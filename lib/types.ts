// ─── Core Domain Types ────────────────────────────────────────────────────────

export type Priority = 'high' | 'medium' | 'low'
export type BillStatus = 'introduced' | 'committee' | 'floor_vote' | 'passed' | 'failed' | 'withdrawn'
export type ElectionType = 'FPTP' | 'PR'
export type Chamber = 'HOR' | 'NA' // House of Representatives | National Assembly
export type Province = 'Koshi' | 'Madhesh' | 'Bagmati' | 'Gandaki' | 'Lumbini' | 'Karnali' | 'Sudurpashchim'

// ─── MP / Member of Parliament ────────────────────────────────────────────────

export interface Constituency {
  id: number
  name: string
  province: Province
  district: string
  lat: number
  lng: number
}

export interface VotingRecord {
  billId: string
  billTitle: string
  vote: 'yes' | 'no' | 'abstain' | 'absent'
  date: string
}

export interface MP {
  id: string
  name: string
  nameNepali: string
  party: string
  partyShort: string
  chamber: Chamber
  electionType: ElectionType
  constituency: Constituency
  province: Province
  photoUrl?: string
  email: string
  phone: string
  website?: string
  committees: string[]
  attendance: number     // percentage 0-100
  billsSponsored: number
  questionsAsked: number
  votesParticipated: number
  votingRecord: VotingRecord[]
  electedYear: number
  isMinister: boolean
  ministryPortfolio?: string
  bio: string
}

// ─── Bill ─────────────────────────────────────────────────────────────────────

export interface Bill {
  id: string
  title: string
  titleNepali?: string
  ministry: string
  status: BillStatus
  priority: Priority
  dateIntroduced: string
  dateLastAction: string
  summary: string
  concerns: string[]
  affectedGroups: string[]
  sourceUrl?: string
  fullTextUrl?: string
  sponsor?: string
  cosponsors?: string[]
  aiAnalysis?: string
  chamber: Chamber
  category: string
  postedReddit: boolean
  postedTwitter: boolean
}

// ─── Vote ─────────────────────────────────────────────────────────────────────

export interface Vote {
  id: string
  billId: string
  billTitle: string
  date: string
  chamber: Chamber
  totalYes: number
  totalNo: number
  totalAbstain: number
  totalAbsent: number
  result: 'passed' | 'failed'
  description: string
}

// ─── Committee ────────────────────────────────────────────────────────────────

export interface Committee {
  id: string
  name: string
  nameNepali?: string
  chamber: Chamber
  chair: string
  members: string[]       // MP IDs
  activeBills: number
  lastMeeting: string
  nextMeeting?: string
  description: string
}

// ─── Minister ─────────────────────────────────────────────────────────────────

export interface Minister {
  id: string
  name: string
  nameNepali: string
  ministry: string
  ministryNepali?: string
  party: string
  photoUrl?: string
  appointedDate: string
  pledges: MinisterPledge[]
  attendance: number
  pressReleases: number
  budgetUtilization: number  // percentage
  score: number              // 0–100 overall performance score
  alerts: number
  email: string
}

export interface MinisterPledge {
  id: string
  title: string
  status: 'completed' | 'in_progress' | 'pending' | 'failed'
  dueDate?: string
  completedDate?: string
}

// ─── Activity Feed ────────────────────────────────────────────────────────────

export interface Activity {
  id: string
  type: 'bill_introduced' | 'bill_passed' | 'bill_failed' | 'minister_action' |
        'gazette_notice' | 'committee_meeting' | 'vote_held' | 'statement' | 'misconduct'
  title: string
  description: string
  ministry?: string
  date: string
  priority: Priority
  sourceUrl?: string
  relatedBillId?: string
  relatedMPId?: string
}

// ─── Misconduct ───────────────────────────────────────────────────────────────

export interface MisconductRecord {
  id: string
  mpId?: string
  ministerId?: string
  name: string
  allegation: string
  status: 'alleged' | 'under_investigation' | 'convicted' | 'cleared' | 'dismissed'
  dateReported: string
  source: string
  description: string
  severity: Priority
}

// ─── Social Post ──────────────────────────────────────────────────────────────

export interface SocialPost {
  id: string
  platform: 'reddit' | 'twitter'
  content: string
  relatedBillId?: string
  relatedActivityId?: string
  postedAt: string
  subreddit?: string
  tweetId?: string
  upvotes?: number
  comments?: number
  likes?: number
  retweets?: number
  url?: string
  status: 'posted' | 'pending' | 'failed' | 'mock'
}

// ─── Dashboard Stats ──────────────────────────────────────────────────────────

export interface DashboardStats {
  billsTracked: number
  highPriorityAlerts: number
  ministersMonitored: number
  mpsMonitored: number
  postsPublished: number
  scrapingSuccessRate: number
  lastUpdated: string
}

// ─── System Status ────────────────────────────────────────────────────────────

export interface ScrapingJob {
  name: string
  url: string
  status: 'operational' | 'running' | 'warning' | 'error'
  lastRun: string
  nextRun: string
  itemsFound: number
}
