-- ================================================
-- जनादेश Nepal Parliamentary Monitor — DB Schema
-- Project: hhxbqcsydpcdsxkngykk
-- ================================================

-- 1. BILLS
CREATE TABLE IF NOT EXISTS public.bills (
  id               text PRIMARY KEY,
  title            text NOT NULL,
  title_nepali     text,
  ministry         text,
  status           text NOT NULL DEFAULT 'introduced'
                   CHECK (status IN ('introduced','committee','floor_vote','passed','failed','withdrawn')),
  priority         text NOT NULL DEFAULT 'medium'
                   CHECK (priority IN ('high','medium','low')),
  date_introduced  date,
  date_last_action date,
  summary          text,
  concerns         text[]   DEFAULT '{}',
  affected_groups  text[]   DEFAULT '{}',
  source_url       text,
  full_text_url    text,
  sponsor_name     text,
  chamber          text     DEFAULT 'HOR' CHECK (chamber IN ('HOR','NA')),
  category         text,
  ai_analysis      text,
  posted_reddit    boolean  DEFAULT false,
  posted_twitter   boolean  DEFAULT false,
  created_at       timestamptz DEFAULT now(),
  updated_at       timestamptz DEFAULT now()
);

-- 2. VOTES
CREATE TABLE IF NOT EXISTS public.votes (
  id            text PRIMARY KEY,
  bill_id       text REFERENCES public.bills(id) ON DELETE SET NULL,
  bill_title    text,
  date          date NOT NULL,
  chamber       text DEFAULT 'HOR' CHECK (chamber IN ('HOR','NA')),
  total_yes     int  DEFAULT 0,
  total_no      int  DEFAULT 0,
  total_abstain int  DEFAULT 0,
  total_absent  int  DEFAULT 0,
  result        text CHECK (result IN ('passed','failed')),
  description   text,
  created_at    timestamptz DEFAULT now()
);

-- 3. MEMBERS (mirrors mps-excel.json, adds relational FK surface)
CREATE TABLE IF NOT EXISTS public.members (
  id              text PRIMARY KEY,   -- matches Excel mp id field
  name            text NOT NULL,
  district        text,
  province        text,
  party           text,
  party_short     text,
  gender          text CHECK (gender IN ('Male','Female')),
  election_type   text CHECK (election_type IN ('FPTP','PR')),
  inclusive_group text,
  lat             numeric,
  lng             numeric,
  created_at      timestamptz DEFAULT now()
);

-- 4. MINISTERS
CREATE TABLE IF NOT EXISTS public.ministers (
  id                 text PRIMARY KEY,
  name               text NOT NULL,
  name_nepali        text,
  ministry           text,
  ministry_nepali    text,
  party              text,
  photo_url          text,
  appointed_date     date,
  attendance         int  DEFAULT 0,
  press_releases     int  DEFAULT 0,
  budget_utilization int  DEFAULT 0,
  score              int  DEFAULT 0,
  alerts             int  DEFAULT 0,
  email              text,
  created_at         timestamptz DEFAULT now(),
  updated_at         timestamptz DEFAULT now()
);

-- 5. MINISTER PLEDGES (one-to-many off ministers)
CREATE TABLE IF NOT EXISTS public.minister_pledges (
  id             text PRIMARY KEY,
  minister_id    text NOT NULL REFERENCES public.ministers(id) ON DELETE CASCADE,
  title          text NOT NULL,
  status         text DEFAULT 'pending'
                 CHECK (status IN ('completed','in_progress','pending','failed')),
  due_date       date,
  completed_date date,
  created_at     timestamptz DEFAULT now()
);

-- 6. COMMITTEES
CREATE TABLE IF NOT EXISTS public.committees (
  id           text PRIMARY KEY,
  name         text NOT NULL,
  name_nepali  text,
  chamber      text DEFAULT 'HOR' CHECK (chamber IN ('HOR','NA')),
  chair        text,
  member_names text[]  DEFAULT '{}',
  active_bills int     DEFAULT 0,
  last_meeting date,
  next_meeting date,
  description  text,
  created_at   timestamptz DEFAULT now()
);

-- 7. ACTIVITIES (live event feed)
CREATE TABLE IF NOT EXISTS public.activities (
  id              text PRIMARY KEY,
  type            text NOT NULL
                  CHECK (type IN (
                    'bill_introduced','bill_passed','bill_failed',
                    'minister_action','gazette_notice','committee_meeting',
                    'vote_held','statement','misconduct'
                  )),
  title           text NOT NULL,
  description     text,
  ministry        text,
  date            timestamptz NOT NULL,
  priority        text DEFAULT 'medium' CHECK (priority IN ('high','medium','low')),
  source_url      text,
  related_bill_id text REFERENCES public.bills(id) ON DELETE SET NULL,
  created_at      timestamptz DEFAULT now()
);

-- 8. MISCONDUCT (accountability tracker)
CREATE TABLE IF NOT EXISTS public.misconduct (
  id            text PRIMARY KEY,
  person_name   text NOT NULL,
  mp_excel_id   text,               -- cross-ref to mps-excel.json id
  minister_id   text REFERENCES public.ministers(id) ON DELETE SET NULL,
  allegation    text NOT NULL,
  status        text DEFAULT 'alleged'
                CHECK (status IN ('alleged','under_investigation','convicted','cleared','dismissed')),
  date_reported date,
  source        text,
  description   text,
  severity      text DEFAULT 'medium' CHECK (severity IN ('high','medium','low')),
  created_at    timestamptz DEFAULT now(),
  updated_at    timestamptz DEFAULT now()
);

-- 9. ALERTS (dashboard notifications)
CREATE TABLE IF NOT EXISTS public.alerts (
  id              text PRIMARY KEY,
  priority        text DEFAULT 'high'
                  CHECK (priority IN ('critical','high','medium','low')),
  ministry        text,
  title           text NOT NULL,
  description     text,
  date            timestamptz NOT NULL,
  source          text,
  is_resolved     boolean DEFAULT false,
  related_bill_id text REFERENCES public.bills(id) ON DELETE SET NULL,
  created_at      timestamptz DEFAULT now()
);

-- ── Indexes ───────────────────────────────────────────────────────────────────
CREATE INDEX IF NOT EXISTS idx_bills_status         ON public.bills(status);
CREATE INDEX IF NOT EXISTS idx_bills_priority       ON public.bills(priority);
CREATE INDEX IF NOT EXISTS idx_bills_category       ON public.bills(category);
CREATE INDEX IF NOT EXISTS idx_votes_bill_id        ON public.votes(bill_id);
CREATE INDEX IF NOT EXISTS idx_votes_date           ON public.votes(date DESC);
CREATE INDEX IF NOT EXISTS idx_activities_date      ON public.activities(date DESC);
CREATE INDEX IF NOT EXISTS idx_activities_type      ON public.activities(type);
CREATE INDEX IF NOT EXISTS idx_misconduct_status    ON public.misconduct(status);
CREATE INDEX IF NOT EXISTS idx_alerts_resolved      ON public.alerts(is_resolved);
CREATE INDEX IF NOT EXISTS idx_alerts_date          ON public.alerts(date DESC);
CREATE INDEX IF NOT EXISTS idx_members_province     ON public.members(province);
CREATE INDEX IF NOT EXISTS idx_members_party_short  ON public.members(party_short);
CREATE INDEX IF NOT EXISTS idx_members_district     ON public.members(district);
CREATE INDEX IF NOT EXISTS idx_pledges_minister_id  ON public.minister_pledges(minister_id);

-- ── updated_at auto-trigger ───────────────────────────────────────────────────
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS trigger LANGUAGE plpgsql AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

CREATE OR REPLACE TRIGGER trg_bills_updated_at
  BEFORE UPDATE ON public.bills
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE OR REPLACE TRIGGER trg_ministers_updated_at
  BEFORE UPDATE ON public.ministers
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE OR REPLACE TRIGGER trg_misconduct_updated_at
  BEFORE UPDATE ON public.misconduct
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
