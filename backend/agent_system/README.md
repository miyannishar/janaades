# जनादेश AI Agent System

> **An autonomous AI opposition actor for Nepal's parliamentary democracy.**

This directory contains the agent system that powers जनादेश Monitor's intelligence layer. The system is built on [Google ADK](https://github.com/google/adk-python) and operates across three distinct pillars: **Intelligence**, **Analysis**, and **Action**.

---

## Why an AI Agent?

Nepal's parliamentary activity generates enormous amounts of information — hundreds of bills, thousands of votes, press releases, minister statements, budget documents, and news articles — most of which never reach the average citizen. The opposition in any democracy plays a vital role: holding the government accountable by surfacing contradictions, questioning the impact of legislation, and making that information public.

This agent system is designed to do exactly that — automatically, at scale, and in real time.

---

## The Three Pillars

```
┌─────────────────────────────────────────────────────────────────────┐
│                                                                     │
│   PILLAR 1          PILLAR 2              PILLAR 3                  │
│   Intelligence  →   Analysis         →   Action                    │
│   (Know)            (Think)              (Do)                      │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

---

### Pillar 1 — Intelligence: Know Everything

*The agent must be the most informed entity about Nepal's government at any given moment.*

The intelligence layer aggregates information from multiple sources and makes it queryable by all other agents.

#### Data Sources

| Source | What It Provides | Method |
|--------|-----------------|--------|
| **Supabase DB** | Bills, MPs, ministers, votes, promises, misconduct records | Direct query tool |
| **Parliament website** | New bills, session schedules, committee reports, PDFs | Cron scraper (running) |
| **SERP API (web search)** | Real-time news, press releases, court filings, budget documents | `web_search` tool |
| **Facebook pages** | Political statements from party pages, social sentiment | Cron scraper (running) |
| **Government Gazette** | Official legal notices, ordinances, appointments | PDF scraper |
| **News aggregation** | Kantipur, Nagarik, The Kathmandu Post, RSS feeds | Scraper / SERP |

#### Key Intelligence Tools (current & planned)

```python
get_bill_summary(registration_no)         # ✅ Live — queries Supabase
search_web(query)                          # 🔜 SERP API integration
get_mp_profile(name_or_id)                # 🔜 MP voting + attendance
get_minister_promises(minister_id)        # 🔜 Promise tracking
search_recent_news(topic, days=7)         # 🔜 News from SERP + DB
get_gazette_notice(keyword)               # 🔜 Official government notices
```

---

### Pillar 2 — Analysis: Think Critically

*Raw information is not enough. The agent must reason about what it means — especially from the perspective of citizens, civil society, and the opposition.*

The analysis layer takes intelligence outputs and subjects them to structured critical thinking. This is where the agent shifts from "what happened" to "what does this mean and why should people care."

#### Core Analysis Capabilities

**Contradiction Detection**
The agent cross-references a politician's public statements against their voting record, bill sponsorships, and committee decisions. Example:
> "Minister Sharma publicly pledged to protect press freedom in 2024, but co-sponsored the Media Council Bill in 2082 which grants the government authority to revoke journalist licenses."

**Impact Assessment**
For any given bill or policy, the agent researches:
- Which communities are directly affected
- What civil society organizations say
- What legal experts and economists have written
- Historical precedents in Nepal or comparable countries

**Opposition Brief Generation**
Given a bill or government action, the agent produces a structured critique — the kind a parliamentary opposition party would present — with evidence, citations, and suggested questions for the minister in charge.

**Legislative Pattern Matching**
Identifies when a new bill mirrors a previously failed or struck-down law, or when an amendment quietly removes protections that existed in an older version.

**Priority Scoring**
Not everything is equally urgent. The agent scores each parliamentary event by public impact, political sensitivity, and timeliness to decide what deserves immediate attention.

#### Agent-to-Agent (A2A) Architecture

As complexity grows, specialized sub-agents will be connected via the [A2A protocol](https://google.github.io/A2A/):

| Sub-Agent | Specialization |
|-----------|---------------|
| `legal_agent` | Constitutional analysis, Supreme Court precedents, legal language parsing |
| `economics_agent` | Budget impact, fiscal analysis, poverty/development indicators |
| `fact_check_agent` | Verifies politician claims against verifiable records and news |
| `sentiment_agent` | Public opinion from social media, protest activity, polls |

The root `nepal_parliament_agent` orchestrates these sub-agents based on the complexity of the task at hand.

---

### Pillar 3 — Action: Publish, Amplify, Pressure

*Intelligence and analysis only matter if they reach people. The action layer turns agent outputs into public-facing content that creates accountability pressure.*

#### Publishing Channels

| Platform | Format | Audience | Tone |
|----------|--------|----------|------|
| **Reddit** (r/Nepal, r/NepalPolitics) | Long-form posts with evidence | Diaspora, educated citizens | Factual, cited |
| **X / Twitter** | Threads (5–10 tweets) | Journalists, political observers | Sharp, direct |
| **Future: WhatsApp** | Short summaries with links | General public | Simple, Nepali language |
| **Future: Email digest** | Weekly newsletter | Civil society, researchers | Comprehensive |

#### Action Tools

```python
post_to_reddit(title, body, subreddit)     # ✅ Exists (basic)
post_to_twitter(thread: list[str])         # 🔜 X API integration
schedule_post(content, platform, time)    # 🔜 Scheduled campaigns
translate_to_nepali(text)                 # 🔜 Nepali language output
```

#### Responsible Action Principles

The agent follows strict content guidelines:
- **Always cite sources** — every claim links back to an official document, Supabase record, or credible news source
- **No fabrication** — if data is unavailable, the agent says so rather than guessing
- **Factual framing** — opposition framing is evidence-based, not inflammatory
- **Transparency** — posts are clearly identified as AI-generated analysis

---

## Architecture Overview

```
                    ┌─────────────────────┐
                    │  FastAPI Backend     │
                    │  POST /api/agent/chat│
                    └──────────┬──────────┘
                               │
                    ┌──────────▼──────────┐
                    │  nepal_parliament   │
                    │  _agent (root)      │
                    │  gemini-2.0-flash   │
                    └──┬───────┬──────────┘
                       │       │
          ┌────────────▼─┐  ┌──▼────────────┐
          │  Pillar 1    │  │  Pillar 3     │
          │  Tools       │  │  Action Tools │
          │              │  │               │
          │ get_bill_    │  │ post_reddit() │
          │ summary()    │  │ post_x()      │
          │ search_web() │  │               │
          │ get_mp_      │  └───────────────┘
          │ profile()    │
          └──────┬───────┘
                 │  A2A (future)
        ┌────────▼──────────┐
        │  Sub-Agents        │
        │  legal / economics │
        │  fact_check /      │
        │  sentiment         │
        └────────────────────┘
```

---

## Current Status

| Capability | Status |
|-----------|--------|
| ADK runner + FastAPI endpoint | ✅ Live |
| `get_bill_summary` tool (Supabase) | ✅ Live |
| SERP web search tool | 🔜 Next |
| MP / minister profile tools | 🔜 Planned |
| Contradiction detection | 🔜 Planned |
| Opposition brief generation | 🔜 Planned |
| A2A sub-agents | 🔜 Planned |
| Redis posts (basic) | ✅ Exists (cron) |
| X / Twitter thread posting | 🔜 Planned |
| Scheduled AI campaigns | 🔜 Planned |

---

## Extending the Agent

To add a new tool:
1. Define a Python function with a clear docstring (ADK uses this as the tool description)
2. Add it to the `tools=[...]` list in `parliament_agent.py`
3. Restart the container — no rebuild needed if hot-reloaded

To add a sub-agent (A2A):
1. Create a new agent file in `agents/`
2. Expose it via its own ADK runner or connect via the A2A protocol
3. Register it as a tool on the root agent using `AgentTool(agent=sub_agent)`

---

## Philosophy

This system is not a chatbot. It is an **autonomous accountability actor** — a piece of infrastructure for democracy. It exists to make Nepal's parliamentary process more transparent, more accessible, and more contestable by the public it serves.

> *"जनादेश" means "mandate of the people." This agent exists to make sure that mandate is honored.*
