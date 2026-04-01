import type {
  MP, Bill, Vote, Committee, Minister, Activity, MisconductRecord,
  SocialPost, DashboardStats, ScrapingJob
} from './types'

// ─── 2026 RSP Parliament — Real Data ─────────────────────────────────────────

export const MINISTRIES = [
  'Ministry of Finance',
  'Ministry of Home Affairs',
  'Ministry of Foreign Affairs',
  'Ministry of Law, Justice and Parliamentary Affairs',
  'Ministry of Defence',
  'Ministry of Education, Science and Technology',
  'Ministry of Health and Population',
  'Ministry of Agriculture and Livestock Development',
  'Ministry of Energy, Water Resources and Irrigation',
  'Ministry of Physical Infrastructure and Transport',
  'Ministry of Industry, Commerce and Supplies',
  'Ministry of Information and Communication Technology',
  'Ministry of Forest and Environment',
  'Ministry of Urban Development',
  'Ministry of Labour, Employment and Social Security',
  'Ministry of Culture, Tourism and Civil Aviation',
  'Ministry of Women, Children and Senior Citizens',
]

export const PROVINCES = [
  'Koshi', 'Madhesh', 'Bagmati', 'Gandaki', 'Lumbini', 'Karnali', 'Sudurpashchim'
]

export const PARTIES = [
  { name: 'Rastriya Swatantra Party', short: 'RSP', color: '#DC2626' },
  { name: 'Nepali Congress', short: 'NC', color: '#1d4ed8' },
  { name: 'CPN-UML', short: 'UML', color: '#dc2626' },
  { name: 'CPN (Maoist Centre)', short: 'Maoist', color: '#7f1d1d' },
  { name: 'Rastriya Prajatantra Party', short: 'RPP', color: '#92400e' },
  { name: 'Janajati Party', short: 'JP', color: '#065f46' },
  { name: 'Independent', short: 'Ind', color: '#4b5563' },
]

// ─── MPs — 2026 Parliament (RSP dominated) ────────────────────────────────────

export const MOCK_MPs = [
  {
    id: "mp-1",
    name: "नरेन्त्र कुमार केरुङ",
    party: "नेपाली काँग्रेस",
    role: "Member of Parliament",
    district: "पााँचथर",
    constituency: "1",
    electionType: "FPTP",
    gender: "Male",
    imageUrl: "https://i.pravatar.cc/150?u=mp-1",
    performance: {
      attendance: 80,
      billsProposed: 9,
      questionsAsked: 38,
      rebellions: 2
    },
    committees: ["Public Accounts Committee"],
    contact: {
      email: "mp-1@parliament.gov.np",
      phone: "+977-1-4200000",
      twitter: "@mp_mp-1"
    }
  },
  {
    id: "mp-2",
    name: "सनश्कल राई",
    party: "नेपाली काँग्रेस",
    role: "Member of Parliament",
    district: "इलाम",
    constituency: "1",
    electionType: "FPTP",
    gender: "Male",
    imageUrl: "https://i.pravatar.cc/150?u=mp-2",
    performance: {
      attendance: 74,
      billsProposed: 7,
      questionsAsked: 37,
      rebellions: 1
    },
    committees: ["Public Accounts Committee"],
    contact: {
      email: "mp-2@parliament.gov.np",
      phone: "+977-1-4200000",
      twitter: "@mp_mp-2"
    }
  },
  {
    id: "mp-3",
    name: "प्रकाश पाठक",
    party: "राष्ट्रिय स्वतन्त्र पार्टी",
    role: "Member of Parliament",
    district: "झापा",
    constituency: "3",
    electionType: "FPTP",
    gender: "Male",
    imageUrl: "https://i.pravatar.cc/150?u=mp-3",
    performance: {
      attendance: 76,
      billsProposed: 2,
      questionsAsked: 1,
      rebellions: 1
    },
    committees: ["Public Accounts Committee"],
    contact: {
      email: "mp-3@parliament.gov.np",
      phone: "+977-1-4200000",
      twitter: "@mp_mp-3"
    }
  },
  {
    id: "mp-4",
    name: "शम्भु प्रिाद ढकाल",
    party: "राष्ट्रिय स्वतन्त्र पार्टी",
    role: "Member of Parliament",
    district: "झापा",
    constituency: "4",
    electionType: "FPTP",
    gender: "Male",
    imageUrl: "https://i.pravatar.cc/150?u=mp-4",
    performance: {
      attendance: 78,
      billsProposed: 0,
      questionsAsked: 5,
      rebellions: 1
    },
    committees: ["Public Accounts Committee"],
    contact: {
      email: "mp-4@parliament.gov.np",
      phone: "+977-1-4200000",
      twitter: "@mp_mp-4"
    }
  },
  {
    id: "mp-5",
    name: "वालेन्त्र शाह",
    party: "राष्ट्रिय स्वतन्त्र पार्टी",
    role: "Member of Parliament",
    district: "झापा",
    constituency: "5",
    electionType: "FPTP",
    gender: "Male",
    imageUrl: "https://i.pravatar.cc/150?u=mp-5",
    performance: {
      attendance: 76,
      billsProposed: 5,
      questionsAsked: 12,
      rebellions: 0
    },
    committees: ["Public Accounts Committee"],
    contact: {
      email: "mp-5@parliament.gov.np",
      phone: "+977-1-4200000",
      twitter: "@mp_mp-5"
    }
  },
  {
    id: "mp-6",
    name: "िन्त्िोष िुब्वा",
    party: "नेपाली काँग्रेस",
    role: "Member of Parliament",
    district: "िेह्रथुम",
    constituency: "1",
    electionType: "FPTP",
    gender: "Male",
    imageUrl: "https://i.pravatar.cc/150?u=mp-6",
    performance: {
      attendance: 84,
      billsProposed: 7,
      questionsAsked: 49,
      rebellions: 0
    },
    committees: ["Public Accounts Committee"],
    contact: {
      email: "mp-6@parliament.gov.np",
      phone: "+977-1-4200000",
      twitter: "@mp_mp-6"
    }
  },
  {
    id: "mp-7",
    name: "ध्रुवराि राई",
    party: "स्वतन्त्र",
    role: "Member of Parliament",
    district: "भोिपुर",
    constituency: "1",
    electionType: "FPTP",
    gender: "Male",
    imageUrl: "https://i.pravatar.cc/150?u=mp-7",
    performance: {
      attendance: 72,
      billsProposed: 0,
      questionsAsked: 37,
      rebellions: 3
    },
    committees: ["Public Accounts Committee"],
    contact: {
      email: "mp-7@parliament.gov.np",
      phone: "+977-1-4200000",
      twitter: "@mp_mp-7"
    }
  },
  {
    id: "mp-8",
    name: "यज्ञमजण न्त्यौपाने",
    party: "राष्ट्रिय स्वतन्त्र पार्टी",
    role: "Member of Parliament",
    district: "मोरङ",
    constituency: "1",
    electionType: "FPTP",
    gender: "Male",
    imageUrl: "https://i.pravatar.cc/150?u=mp-8",
    performance: {
      attendance: 77,
      billsProposed: 6,
      questionsAsked: 17,
      rebellions: 0
    },
    committees: ["Public Accounts Committee"],
    contact: {
      email: "mp-8@parliament.gov.np",
      phone: "+977-1-4200000",
      twitter: "@mp_mp-8"
    }
  },
  {
    id: "mp-9",
    name: "कृष्ण कुमार काकी",
    party: "राष्ट्रिय स्वतन्त्र पार्टी",
    role: "Member of Parliament",
    district: "मोरङ",
    constituency: "2",
    electionType: "FPTP",
    gender: "Male",
    imageUrl: "https://i.pravatar.cc/150?u=mp-9",
    performance: {
      attendance: 72,
      billsProposed: 7,
      questionsAsked: 37,
      rebellions: 4
    },
    committees: ["Public Accounts Committee"],
    contact: {
      email: "mp-9@parliament.gov.np",
      phone: "+977-1-4200000",
      twitter: "@mp_mp-9"
    }
  },
  {
    id: "mp-10",
    name: "गणेश काकी",
    party: "राष्ट्रिय स्वतन्त्र पार्टी",
    role: "Member of Parliament",
    district: "मोरङ",
    constituency: "3",
    electionType: "FPTP",
    gender: "Male",
    imageUrl: "https://i.pravatar.cc/150?u=mp-10",
    performance: {
      attendance: 79,
      billsProposed: 9,
      questionsAsked: 8,
      rebellions: 1
    },
    committees: ["Public Accounts Committee"],
    contact: {
      email: "mp-10@parliament.gov.np",
      phone: "+977-1-4200000",
      twitter: "@mp_mp-10"
    }
  },
  {
    id: "mp-11",
    name: "िन्त्िोष रािवंशी",
    party: "राष्ट्रिय स्वतन्त्र पार्टी",
    role: "Member of Parliament",
    district: "मोरङ",
    constituency: "4",
    electionType: "FPTP",
    gender: "Male",
    imageUrl: "https://i.pravatar.cc/150?u=mp-11",
    performance: {
      attendance: 83,
      billsProposed: 2,
      questionsAsked: 39,
      rebellions: 4
    },
    committees: ["Public Accounts Committee"],
    contact: {
      email: "mp-11@parliament.gov.np",
      phone: "+977-1-4200000",
      twitter: "@mp_mp-11"
    }
  },
  {
    id: "mp-12",
    name: "हका राि राई",
    party: "स्वतन्त्र",
    role: "Member of Parliament",
    district: "िुनिरी",
    constituency: "1",
    electionType: "FPTP",
    gender: "Male",
    imageUrl: "https://i.pravatar.cc/150?u=mp-12",
    performance: {
      attendance: 84,
      billsProposed: 7,
      questionsAsked: 24,
      rebellions: 1
    },
    committees: ["Public Accounts Committee"],
    contact: {
      email: "mp-12@parliament.gov.np",
      phone: "+977-1-4200000",
      twitter: "@mp_mp-12"
    }
  },
  {
    id: "mp-13",
    name: "लाल सबक्रम थापा",
    party: "राष्ट्रिय स्वतन्त्र पार्टी",
    role: "Member of Parliament",
    district: "िुनिरी",
    constituency: "2",
    electionType: "FPTP",
    gender: "Male",
    imageUrl: "https://i.pravatar.cc/150?u=mp-13",
    performance: {
      attendance: 77,
      billsProposed: 7,
      questionsAsked: 3,
      rebellions: 2
    },
    committees: ["Public Accounts Committee"],
    contact: {
      email: "mp-13@parliament.gov.np",
      phone: "+977-1-4200000",
      twitter: "@mp_mp-13"
    }
  },
  {
    id: "mp-14",
    name: "अशोक कुमार",
    party: "राष्ट्रिय स्वतन्त्र पार्टी",
    role: "Member of Parliament",
    district: "चौधरीिुनिरी",
    constituency: "3",
    electionType: "FPTP",
    gender: "Male",
    imageUrl: "https://i.pravatar.cc/150?u=mp-14",
    performance: {
      attendance: 89,
      billsProposed: 1,
      questionsAsked: 30,
      rebellions: 4
    },
    committees: ["Public Accounts Committee"],
    contact: {
      email: "mp-14@parliament.gov.np",
      phone: "+977-1-4200000",
      twitter: "@mp_mp-14"
    }
  },
  {
    id: "mp-15",
    name: "दीपक कुमार िाह",
    party: "राष्ट्रिय स्वतन्त्र पार्टी",
    role: "Member of Parliament",
    district: "िुनिरी",
    constituency: "4",
    electionType: "FPTP",
    gender: "Male",
    imageUrl: "https://i.pravatar.cc/150?u=mp-15",
    performance: {
      attendance: 76,
      billsProposed: 7,
      questionsAsked: 41,
      rebellions: 0
    },
    committees: ["Public Accounts Committee"],
    contact: {
      email: "mp-15@parliament.gov.np",
      phone: "+977-1-4200000",
      twitter: "@mp_mp-15"
    }
  },
  {
    id: "mp-16",
    name: "प्रकाश सिंह काकी",
    party: "नेपाली काँग्रेस",
    role: "Member of Parliament",
    district: "िोलुखुम्बु",
    constituency: "1",
    electionType: "FPTP",
    gender: "Male",
    imageUrl: "https://i.pravatar.cc/150?u=mp-16",
    performance: {
      attendance: 72,
      billsProposed: 0,
      questionsAsked: 7,
      rebellions: 0
    },
    committees: ["Public Accounts Committee"],
    contact: {
      email: "mp-16@parliament.gov.np",
      phone: "+977-1-4200000",
      twitter: "@mp_mp-16"
    }
  },
  {
    id: "mp-17",
    name: "आरेन राई",
    party: "स्वतन्त्र",
    role: "Member of Parliament",
    district: "खोर्टाङ",
    constituency: "1",
    electionType: "FPTP",
    gender: "Male",
    imageUrl: "https://i.pravatar.cc/150?u=mp-17",
    performance: {
      attendance: 72,
      billsProposed: 1,
      questionsAsked: 43,
      rebellions: 2
    },
    committees: ["Public Accounts Committee"],
    contact: {
      email: "mp-17@parliament.gov.np",
      phone: "+977-1-4200000",
      twitter: "@mp_mp-17"
    }
  },
  {
    id: "mp-18",
    name: "सबश् व राि पोखरेल",
    party: "राष्ट्रिय स्वतन्त्र पार्टी",
    role: "Member of Parliament",
    district: "ओखलढुंगा",
    constituency: "1",
    electionType: "FPTP",
    gender: "Male",
    imageUrl: "https://i.pravatar.cc/150?u=mp-18",
    performance: {
      attendance: 77,
      billsProposed: 1,
      questionsAsked: 9,
      rebellions: 1
    },
    committees: ["Public Accounts Committee"],
    contact: {
      email: "mp-18@parliament.gov.np",
      phone: "+977-1-4200000",
      twitter: "@mp_mp-18"
    }
  },
  {
    id: "mp-19",
    name: "पारश मजण गेलाल",
    party: "राष्ट्रिय स्वतन्त्र पार्टी",
    role: "Member of Parliament",
    district: "उदयपुर",
    constituency: "1",
    electionType: "FPTP",
    gender: "Male",
    imageUrl: "https://i.pravatar.cc/150?u=mp-19",
    performance: {
      attendance: 71,
      billsProposed: 3,
      questionsAsked: 46,
      rebellions: 3
    },
    committees: ["Public Accounts Committee"],
    contact: {
      email: "mp-19@parliament.gov.np",
      phone: "+977-1-4200000",
      twitter: "@mp_mp-19"
    }
  },
  {
    id: "mp-20",
    name: "िूया बहादुर िामाङ्ग",
    party: "राष्ट्रिय स्वतन्त्र पार्टी",
    role: "Member of Parliament",
    district: "उदयपुर",
    constituency: "2",
    electionType: "FPTP",
    gender: "Male",
    imageUrl: "https://i.pravatar.cc/150?u=mp-20",
    performance: {
      attendance: 78,
      billsProposed: 3,
      questionsAsked: 36,
      rebellions: 3
    },
    committees: ["Public Accounts Committee"],
    contact: {
      email: "mp-20@parliament.gov.np",
      phone: "+977-1-4200000",
      twitter: "@mp_mp-20"
    }
  },
  {
    id: "mp-21",
    name: "रामिी यादव",
    party: "राष्ट्रिय स्वतन्त्र पार्टी",
    role: "Member of Parliament",
    district: "िप्तरी",
    constituency: "2",
    electionType: "FPTP",
    gender: "Male",
    imageUrl: "https://i.pravatar.cc/150?u=mp-21",
    performance: {
      attendance: 75,
      billsProposed: 7,
      questionsAsked: 24,
      rebellions: 3
    },
    committees: ["Public Accounts Committee"],
    contact: {
      email: "mp-21@parliament.gov.np",
      phone: "+977-1-4200000",
      twitter: "@mp_mp-21"
    }
  },
  {
    id: "mp-22",
    name: "अमर कान्त्ि चौधरी",
    party: "राष्ट्रिय स्वतन्त्र पार्टी",
    role: "Member of Parliament",
    district: "िप्तरी",
    constituency: "3",
    electionType: "FPTP",
    gender: "Male",
    imageUrl: "https://i.pravatar.cc/150?u=mp-22",
    performance: {
      attendance: 81,
      billsProposed: 7,
      questionsAsked: 38,
      rebellions: 2
    },
    committees: ["Public Accounts Committee"],
    contact: {
      email: "mp-22@parliament.gov.np",
      phone: "+977-1-4200000",
      twitter: "@mp_mp-22"
    }
  },
  {
    id: "mp-23",
    name: "सििाराम िाह",
    party: "राष्ट्रिय स्वतन्त्र पार्टी",
    role: "Member of Parliament",
    district: "िप्तरी",
    constituency: "4",
    electionType: "FPTP",
    gender: "Male",
    imageUrl: "https://i.pravatar.cc/150?u=mp-23",
    performance: {
      attendance: 85,
      billsProposed: 7,
      questionsAsked: 27,
      rebellions: 1
    },
    committees: ["Public Accounts Committee"],
    contact: {
      email: "mp-23@parliament.gov.np",
      phone: "+977-1-4200000",
      twitter: "@mp_mp-23"
    }
  },
  {
    id: "mp-24",
    name: "बब्लु गुप्ता",
    party: "राष्ट्रिय स्वतन्त्र पार्टी",
    role: "Member of Parliament",
    district: "सिराहा",
    constituency: "1",
    electionType: "FPTP",
    gender: "Male",
    imageUrl: "https://i.pravatar.cc/150?u=mp-24",
    performance: {
      attendance: 85,
      billsProposed: 2,
      questionsAsked: 25,
      rebellions: 0
    },
    committees: ["Public Accounts Committee"],
    contact: {
      email: "mp-24@parliament.gov.np",
      phone: "+977-1-4200000",
      twitter: "@mp_mp-24"
    }
  },
  {
    id: "mp-25",
    name: "जशव शंकर यादव",
    party: "राष्ट्रिय स्वतन्त्र पार्टी",
    role: "Member of Parliament",
    district: "सिराहा",
    constituency: "2",
    electionType: "FPTP",
    gender: "Male",
    imageUrl: "https://i.pravatar.cc/150?u=mp-25",
    performance: {
      attendance: 76,
      billsProposed: 4,
      questionsAsked: 49,
      rebellions: 1
    },
    committees: ["Public Accounts Committee"],
    contact: {
      email: "mp-25@parliament.gov.np",
      phone: "+977-1-4200000",
      twitter: "@mp_mp-25"
    }
  },
  {
    id: "mp-26",
    name: "शम्भु कुमार यादव",
    party: "राष्ट्रिय स्वतन्त्र पार्टी",
    role: "Member of Parliament",
    district: "सिराहा",
    constituency: "3",
    electionType: "FPTP",
    gender: "Male",
    imageUrl: "https://i.pravatar.cc/150?u=mp-26",
    performance: {
      attendance: 77,
      billsProposed: 8,
      questionsAsked: 31,
      rebellions: 0
    },
    committees: ["Public Accounts Committee"],
    contact: {
      email: "mp-26@parliament.gov.np",
      phone: "+977-1-4200000",
      twitter: "@mp_mp-26"
    }
  },
  {
    id: "mp-27",
    name: "िपेश्वर यादव",
    party: "राष्ट्रिय स्वतन्त्र पार्टी",
    role: "Member of Parliament",
    district: "सिराहा",
    constituency: "4",
    electionType: "FPTP",
    gender: "Male",
    imageUrl: "https://i.pravatar.cc/150?u=mp-27",
    performance: {
      attendance: 80,
      billsProposed: 4,
      questionsAsked: 44,
      rebellions: 1
    },
    committees: ["Public Accounts Committee"],
    contact: {
      email: "mp-27@parliament.gov.np",
      phone: "+977-1-4200000",
      twitter: "@mp_mp-27"
    }
  },
  {
    id: "mp-28",
    name: "मािृका प्रिाद यादव",
    party: "नेकपा एमाले",
    role: "Member of Parliament",
    district: "धनुषा",
    constituency: "1",
    electionType: "FPTP",
    gender: "Male",
    imageUrl: "https://i.pravatar.cc/150?u=mp-28",
    performance: {
      attendance: 75,
      billsProposed: 5,
      questionsAsked: 48,
      rebellions: 3
    },
    committees: ["Public Accounts Committee"],
    contact: {
      email: "mp-28@parliament.gov.np",
      phone: "+977-1-4200000",
      twitter: "@mp_mp-28"
    }
  },
  {
    id: "mp-29",
    name: "राम ष्ट्रवनोद यादव",
    party: "राष्ट्रिय स्वतन्त्र पार्टी",
    role: "Member of Parliament",
    district: "धनुषा",
    constituency: "2",
    electionType: "FPTP",
    gender: "Male",
    imageUrl: "https://i.pravatar.cc/150?u=mp-29",
    performance: {
      attendance: 82,
      billsProposed: 1,
      questionsAsked: 49,
      rebellions: 1
    },
    committees: ["Public Accounts Committee"],
    contact: {
      email: "mp-29@parliament.gov.np",
      phone: "+977-1-4200000",
      twitter: "@mp_mp-29"
    }
  },
  {
    id: "mp-30",
    name: "मसनष झा",
    party: "राष्ट्रिय स्वतन्त्र पार्टी",
    role: "Member of Parliament",
    district: "धनुषा",
    constituency: "3",
    electionType: "FPTP",
    gender: "Male",
    imageUrl: "https://i.pravatar.cc/150?u=mp-30",
    performance: {
      attendance: 88,
      billsProposed: 2,
      questionsAsked: 8,
      rebellions: 2
    },
    committees: ["Public Accounts Committee"],
    contact: {
      email: "mp-30@parliament.gov.np",
      phone: "+977-1-4200000",
      twitter: "@mp_mp-30"
    }
  },
  {
    id: "mp-31",
    name: "राि ष्ट्रकशोर महिो",
    party: "राष्ट्रिय स्वतन्त्र पार्टी",
    role: "Member of Parliament",
    district: "धनुषा",
    constituency: "4",
    electionType: "FPTP",
    gender: "Male",
    imageUrl: "https://i.pravatar.cc/150?u=mp-31",
    performance: {
      attendance: 78,
      billsProposed: 1,
      questionsAsked: 21,
      rebellions: 0
    },
    committees: ["Public Accounts Committee"],
    contact: {
      email: "mp-31@parliament.gov.np",
      phone: "+977-1-4200000",
      twitter: "@mp_mp-31"
    }
  },
  {
    id: "mp-32",
    name: "प्रमोद कुमार महिो",
    party: "राष्ट्रिय स्वतन्त्र पार्टी",
    role: "Member of Parliament",
    district: "महोत्तरी",
    constituency: "1",
    electionType: "FPTP",
    gender: "Male",
    imageUrl: "https://i.pravatar.cc/150?u=mp-32",
    performance: {
      attendance: 71,
      billsProposed: 5,
      questionsAsked: 28,
      rebellions: 0
    },
    committees: ["Public Accounts Committee"],
    contact: {
      email: "mp-32@parliament.gov.np",
      phone: "+977-1-4200000",
      twitter: "@mp_mp-32"
    }
  },
  {
    id: "mp-33",
    name: "ददपक कुमार िाह",
    party: "राष्ट्रिय स्वतन्त्र पार्टी",
    role: "Member of Parliament",
    district: "महोत्तरी",
    constituency: "2",
    electionType: "FPTP",
    gender: "Male",
    imageUrl: "https://i.pravatar.cc/150?u=mp-33",
    performance: {
      attendance: 88,
      billsProposed: 0,
      questionsAsked: 7,
      rebellions: 2
    },
    committees: ["Public Accounts Committee"],
    contact: {
      email: "mp-33@parliament.gov.np",
      phone: "+977-1-4200000",
      twitter: "@mp_mp-33"
    }
  },
  {
    id: "mp-34",
    name: "उज् ज् वल कुमार झा",
    party: "राष्ट्रिय स्वतन्त्र पार्टी",
    role: "Member of Parliament",
    district: "महोत्तरी",
    constituency: "3",
    electionType: "FPTP",
    gender: "Male",
    imageUrl: "https://i.pravatar.cc/150?u=mp-34",
    performance: {
      attendance: 79,
      billsProposed: 8,
      questionsAsked: 38,
      rebellions: 2
    },
    committees: ["Public Accounts Committee"],
    contact: {
      email: "mp-34@parliament.gov.np",
      phone: "+977-1-4200000",
      twitter: "@mp_mp-34"
    }
  },
  {
    id: "mp-35",
    name: "रसबन महिो",
    party: "राष्ट्रिय स्वतन्त्र पार्टी",
    role: "Member of Parliament",
    district: "िलााही",
    constituency: "2",
    electionType: "FPTP",
    gender: "Male",
    imageUrl: "https://i.pravatar.cc/150?u=mp-35",
    performance: {
      attendance: 76,
      billsProposed: 9,
      questionsAsked: 14,
      rebellions: 4
    },
    committees: ["Public Accounts Committee"],
    contact: {
      email: "mp-35@parliament.gov.np",
      phone: "+977-1-4200000",
      twitter: "@mp_mp-35"
    }
  },
  {
    id: "mp-36",
    name: "नरेन्त्र िाह कलवार",
    party: "राष्ट्रिय स्वतन्त्र पार्टी",
    role: "Member of Parliament",
    district: "िलााही",
    constituency: "3",
    electionType: "FPTP",
    gender: "Male",
    imageUrl: "https://i.pravatar.cc/150?u=mp-36",
    performance: {
      attendance: 77,
      billsProposed: 2,
      questionsAsked: 12,
      rebellions: 1
    },
    committees: ["Public Accounts Committee"],
    contact: {
      email: "mp-36@parliament.gov.np",
      phone: "+977-1-4200000",
      twitter: "@mp_mp-36"
    }
  },
  {
    id: "mp-37",
    name: "अमरेश कुमार सिंह",
    party: "राष्ट्रिय स्वतन्त्र पार्टी",
    role: "Member of Parliament",
    district: "िलााही",
    constituency: "4",
    electionType: "FPTP",
    gender: "Male",
    imageUrl: "https://i.pravatar.cc/150?u=mp-37",
    performance: {
      attendance: 75,
      billsProposed: 4,
      questionsAsked: 36,
      rebellions: 0
    },
    committees: ["Public Accounts Committee"],
    contact: {
      email: "mp-37@parliament.gov.np",
      phone: "+977-1-4200000",
      twitter: "@mp_mp-37"
    }
  },
  {
    id: "mp-38",
    name: "रािेश कुमार चौधरी",
    party: "राष्ट्रिय स्वतन्त्र पार्टी",
    role: "Member of Parliament",
    district: "रौिहर्ट",
    constituency: "1",
    electionType: "FPTP",
    gender: "Male",
    imageUrl: "https://i.pravatar.cc/150?u=mp-38",
    performance: {
      attendance: 72,
      billsProposed: 3,
      questionsAsked: 16,
      rebellions: 1
    },
    committees: ["Public Accounts Committee"],
    contact: {
      email: "mp-38@parliament.gov.np",
      phone: "+977-1-4200000",
      twitter: "@mp_mp-38"
    }
  },
  {
    id: "mp-39",
    name: "मो. ष्ट्रिरदोश आलम",
    party: "नेपाली काँग्रेस",
    role: "Member of Parliament",
    district: "रौिहर्ट",
    constituency: "2",
    electionType: "FPTP",
    gender: "Male",
    imageUrl: "https://i.pravatar.cc/150?u=mp-39",
    performance: {
      attendance: 76,
      billsProposed: 7,
      questionsAsked: 19,
      rebellions: 1
    },
    committees: ["Public Accounts Committee"],
    contact: {
      email: "mp-39@parliament.gov.np",
      phone: "+977-1-4200000",
      twitter: "@mp_mp-39"
    }
  },
  {
    id: "mp-40",
    name: "रष्ट्रवन्त् र पर्टेल",
    party: "राष्ट्रिय स्वतन्त्र पार्टी",
    role: "Member of Parliament",
    district: "रौिहर्ट",
    constituency: "3",
    electionType: "FPTP",
    gender: "Male",
    imageUrl: "https://i.pravatar.cc/150?u=mp-40",
    performance: {
      attendance: 72,
      billsProposed: 7,
      questionsAsked: 46,
      rebellions: 2
    },
    committees: ["Public Accounts Committee"],
    contact: {
      email: "mp-40@parliament.gov.np",
      phone: "+977-1-4200000",
      twitter: "@mp_mp-40"
    }
  },
  {
    id: "mp-41",
    name: "गणेश पौडेल",
    party: "राष्ट्रिय स्वतन्त्र पार्टी",
    role: "Member of Parliament",
    district: "रौिहर्ट",
    constituency: "4",
    electionType: "FPTP",
    gender: "Male",
    imageUrl: "https://i.pravatar.cc/150?u=mp-41",
    performance: {
      attendance: 78,
      billsProposed: 2,
      questionsAsked: 11,
      rebellions: 3
    },
    committees: ["Public Accounts Committee"],
    contact: {
      email: "mp-41@parliament.gov.np",
      phone: "+977-1-4200000",
      twitter: "@mp_mp-41"
    }
  },
  {
    id: "mp-42",
    name: "गणेश सधमाल",
    party: "राष्ट्रिय स्वतन्त्र पार्टी",
    role: "Member of Parliament",
    district: "बारा",
    constituency: "1",
    electionType: "FPTP",
    gender: "Male",
    imageUrl: "https://i.pravatar.cc/150?u=mp-42",
    performance: {
      attendance: 73,
      billsProposed: 7,
      questionsAsked: 18,
      rebellions: 3
    },
    committees: ["Public Accounts Committee"],
    contact: {
      email: "mp-42@parliament.gov.np",
      phone: "+977-1-4200000",
      twitter: "@mp_mp-42"
    }
  },
  {
    id: "mp-43",
    name: "चन्त्दन कुमार सिंह",
    party: "राष्ट्रिय स्वतन्त्र पार्टी",
    role: "Member of Parliament",
    district: "बारा",
    constituency: "2",
    electionType: "FPTP",
    gender: "Male",
    imageUrl: "https://i.pravatar.cc/150?u=mp-43",
    performance: {
      attendance: 87,
      billsProposed: 5,
      questionsAsked: 44,
      rebellions: 1
    },
    committees: ["Public Accounts Committee"],
    contact: {
      email: "mp-43@parliament.gov.np",
      phone: "+977-1-4200000",
      twitter: "@mp_mp-43"
    }
  },
  {
    id: "mp-44",
    name: "अरसबन्त्द िाह",
    party: "राष्ट्रिय स्वतन्त्र पार्टी",
    role: "Member of Parliament",
    district: "बारा",
    constituency: "3",
    electionType: "FPTP",
    gender: "Male",
    imageUrl: "https://i.pravatar.cc/150?u=mp-44",
    performance: {
      attendance: 89,
      billsProposed: 5,
      questionsAsked: 15,
      rebellions: 4
    },
    committees: ["Public Accounts Committee"],
    contact: {
      email: "mp-44@parliament.gov.np",
      phone: "+977-1-4200000",
      twitter: "@mp_mp-44"
    }
  },
  {
    id: "mp-45",
    name: "रहवर अंिारी",
    party: "राष्ट्रिय स्वतन्त्र पार्टी",
    role: "Member of Parliament",
    district: "बारा",
    constituency: "4",
    electionType: "FPTP",
    gender: "Male",
    imageUrl: "https://i.pravatar.cc/150?u=mp-45",
    performance: {
      attendance: 70,
      billsProposed: 9,
      questionsAsked: 46,
      rebellions: 2
    },
    committees: ["Public Accounts Committee"],
    contact: {
      email: "mp-45@parliament.gov.np",
      phone: "+977-1-4200000",
      twitter: "@mp_mp-45"
    }
  },
  {
    id: "mp-46",
    name: "बुष्ट्रि प्रिाद पन्त्ि",
    party: "राष्ट्रिय स्वतन्त्र पार्टी",
    role: "Member of Parliament",
    district: "पिाा",
    constituency: "1",
    electionType: "FPTP",
    gender: "Male",
    imageUrl: "https://i.pravatar.cc/150?u=mp-46",
    performance: {
      attendance: 70,
      billsProposed: 7,
      questionsAsked: 24,
      rebellions: 2
    },
    committees: ["Public Accounts Committee"],
    contact: {
      email: "mp-46@parliament.gov.np",
      phone: "+977-1-4200000",
      twitter: "@mp_mp-46"
    }
  },
  {
    id: "mp-47",
    name: "िुशील कुमार कानु",
    party: "राष्ट्रिय स्वतन्त्र पार्टी",
    role: "Member of Parliament",
    district: "पिाा",
    constituency: "2",
    electionType: "FPTP",
    gender: "Male",
    imageUrl: "https://i.pravatar.cc/150?u=mp-47",
    performance: {
      attendance: 89,
      billsProposed: 9,
      questionsAsked: 2,
      rebellions: 1
    },
    committees: ["Public Accounts Committee"],
    contact: {
      email: "mp-47@parliament.gov.np",
      phone: "+977-1-4200000",
      twitter: "@mp_mp-47"
    }
  },
  {
    id: "mp-48",
    name: "र्टेक वहादुर शाक्य",
    party: "राष्ट्रिय स्वतन्त्र पार्टी",
    role: "Member of Parliament",
    district: "पिाा",
    constituency: "4",
    electionType: "FPTP",
    gender: "Male",
    imageUrl: "https://i.pravatar.cc/150?u=mp-48",
    performance: {
      attendance: 82,
      billsProposed: 5,
      questionsAsked: 18,
      rebellions: 2
    },
    committees: ["Public Accounts Committee"],
    contact: {
      email: "mp-48@parliament.gov.np",
      phone: "+977-1-4200000",
      twitter: "@mp_mp-48"
    }
  },
  {
    id: "mp-49",
    name: "कृष्ण हरी बुढाथोकी",
    party: "राष्ट्रिय स्वतन्त्र पार्टी",
    role: "Member of Parliament",
    district: "रामेछाप",
    constituency: "1",
    electionType: "FPTP",
    gender: "Male",
    imageUrl: "https://i.pravatar.cc/150?u=mp-49",
    performance: {
      attendance: 88,
      billsProposed: 0,
      questionsAsked: 16,
      rebellions: 2
    },
    committees: ["Public Accounts Committee"],
    contact: {
      email: "mp-49@parliament.gov.np",
      phone: "+977-1-4200000",
      twitter: "@mp_mp-49"
    }
  },
  {
    id: "mp-50",
    name: "धनेन्त्र काकी",
    party: "राष्ट्रिय स्वतन्त्र पार्टी",
    role: "Member of Parliament",
    district: "सिन्त्धुली",
    constituency: "1",
    electionType: "FPTP",
    gender: "Male",
    imageUrl: "https://i.pravatar.cc/150?u=mp-50",
    performance: {
      attendance: 83,
      billsProposed: 3,
      questionsAsked: 42,
      rebellions: 1
    },
    committees: ["Public Accounts Committee"],
    contact: {
      email: "mp-50@parliament.gov.np",
      phone: "+977-1-4200000",
      twitter: "@mp_mp-50"
    }
  },
  {
    id: "mp-51",
    name: "आजशष गिुरेल",
    party: "राष्ट्रिय स्वतन्त्र पार्टी",
    role: "Member of Parliament",
    district: "सिन्त्धुली",
    constituency: "2",
    electionType: "FPTP",
    gender: "Male",
    imageUrl: "https://i.pravatar.cc/150?u=mp-51",
    performance: {
      attendance: 80,
      billsProposed: 0,
      questionsAsked: 24,
      rebellions: 1
    },
    committees: ["Public Accounts Committee"],
    contact: {
      email: "mp-51@parliament.gov.np",
      phone: "+977-1-4200000",
      twitter: "@mp_mp-51"
    }
  },
  {
    id: "mp-52",
    name: "मोहन आचाया",
    party: "नेपाली काँग्रेस",
    role: "Member of Parliament",
    district: "रिुवा",
    constituency: "1",
    electionType: "FPTP",
    gender: "Male",
    imageUrl: "https://i.pravatar.cc/150?u=mp-52",
    performance: {
      attendance: 73,
      billsProposed: 4,
      questionsAsked: 26,
      rebellions: 4
    },
    committees: ["Public Accounts Committee"],
    contact: {
      email: "mp-52@parliament.gov.np",
      phone: "+977-1-4200000",
      twitter: "@mp_mp-52"
    }
  },
  {
    id: "mp-53",
    name: "वोध नारायण श्रेष् ठ",
    party: "राष्ट्रिय स्वतन्त्र पार्टी",
    role: "Member of Parliament",
    district: "धाददङ",
    constituency: "2",
    electionType: "FPTP",
    gender: "Male",
    imageUrl: "https://i.pravatar.cc/150?u=mp-53",
    performance: {
      attendance: 79,
      billsProposed: 1,
      questionsAsked: 36,
      rebellions: 1
    },
    committees: ["Public Accounts Committee"],
    contact: {
      email: "mp-53@parliament.gov.np",
      phone: "+977-1-4200000",
      twitter: "@mp_mp-53"
    }
  },
  {
    id: "mp-54",
    name: "ष्ट्रवक्रम सिसमजल्िना",
    party: "राष्ट्रिय स्वतन्त्र पार्टी",
    role: "Member of Parliament",
    district: "नुवाकोर्ट",
    constituency: "1",
    electionType: "FPTP",
    gender: "Male",
    imageUrl: "https://i.pravatar.cc/150?u=mp-54",
    performance: {
      attendance: 84,
      billsProposed: 0,
      questionsAsked: 3,
      rebellions: 0
    },
    committees: ["Public Accounts Committee"],
    contact: {
      email: "mp-54@parliament.gov.np",
      phone: "+977-1-4200000",
      twitter: "@mp_mp-54"
    }
  },
  {
    id: "mp-55",
    name: "अचुत्तम लासमछाने",
    party: "राष्ट्रिय स्वतन्त्र पार्टी",
    role: "Member of Parliament",
    district: "नुवाकोर्ट",
    constituency: "2",
    electionType: "FPTP",
    gender: "Male",
    imageUrl: "https://i.pravatar.cc/150?u=mp-55",
    performance: {
      attendance: 74,
      billsProposed: 0,
      questionsAsked: 33,
      rebellions: 4
    },
    committees: ["Public Accounts Committee"],
    contact: {
      email: "mp-55@parliament.gov.np",
      phone: "+977-1-4200000",
      twitter: "@mp_mp-55"
    }
  },
  {
    id: "mp-56",
    name: "िुसनल के.िी.",
    party: "राष्ट्रिय स्वतन्त्र पार्टी",
    role: "Member of Parliament",
    district: "काठमाडौं",
    constituency: "2",
    electionType: "FPTP",
    gender: "Male",
    imageUrl: "https://i.pravatar.cc/150?u=mp-56",
    performance: {
      attendance: 71,
      billsProposed: 2,
      questionsAsked: 0,
      rebellions: 3
    },
    committees: ["Public Accounts Committee"],
    contact: {
      email: "mp-56@parliament.gov.np",
      phone: "+977-1-4200000",
      twitter: "@mp_mp-56"
    }
  },
  {
    id: "mp-57",
    name: "रािु नाथ पाण्डे",
    party: "राष्ट्रिय स्वतन्त्र पार्टी",
    role: "Member of Parliament",
    district: "काठमाडौं",
    constituency: "3",
    electionType: "FPTP",
    gender: "Male",
    imageUrl: "https://i.pravatar.cc/150?u=mp-57",
    performance: {
      attendance: 75,
      billsProposed: 9,
      questionsAsked: 3,
      rebellions: 3
    },
    committees: ["Public Accounts Committee"],
    contact: {
      email: "mp-57@parliament.gov.np",
      phone: "+977-1-4200000",
      twitter: "@mp_mp-57"
    }
  },
  {
    id: "mp-58",
    name: "पुकार बम",
    party: "राष्ट्रिय स्वतन्त्र पार्टी",
    role: "Member of Parliament",
    district: "काठमाडौं",
    constituency: "4",
    electionType: "FPTP",
    gender: "Male",
    imageUrl: "https://i.pravatar.cc/150?u=mp-58",
    performance: {
      attendance: 88,
      billsProposed: 4,
      questionsAsked: 36,
      rebellions: 4
    },
    committees: ["Public Accounts Committee"],
    contact: {
      email: "mp-58@parliament.gov.np",
      phone: "+977-1-4200000",
      twitter: "@mp_mp-58"
    }
  },
  {
    id: "mp-59",
    name: "िजस्मि पोखरेल",
    party: "राष्ट्रिय स्वतन्त्र पार्टी",
    role: "Member of Parliament",
    district: "काठमाडौं",
    constituency: "5",
    electionType: "FPTP",
    gender: "Male",
    imageUrl: "https://i.pravatar.cc/150?u=mp-59",
    performance: {
      attendance: 80,
      billsProposed: 5,
      questionsAsked: 29,
      rebellions: 2
    },
    committees: ["Public Accounts Committee"],
    contact: {
      email: "mp-59@parliament.gov.np",
      phone: "+977-1-4200000",
      twitter: "@mp_mp-59"
    }
  },
  {
    id: "mp-60",
    name: "जशजशर खनाल",
    party: "राष्ट्रिय स्वतन्त्र पार्टी",
    role: "Member of Parliament",
    district: "काठमाडौं",
    constituency: "6",
    electionType: "FPTP",
    gender: "Male",
    imageUrl: "https://i.pravatar.cc/150?u=mp-60",
    performance: {
      attendance: 78,
      billsProposed: 1,
      questionsAsked: 19,
      rebellions: 1
    },
    committees: ["Public Accounts Committee"],
    contact: {
      email: "mp-60@parliament.gov.np",
      phone: "+977-1-4200000",
      twitter: "@mp_mp-60"
    }
  },
  {
    id: "mp-61",
    name: "गणेश परािुली",
    party: "राष्ट्रिय स्वतन्त्र पार्टी",
    role: "Member of Parliament",
    district: "काठमाडौं",
    constituency: "7",
    electionType: "FPTP",
    gender: "Male",
    imageUrl: "https://i.pravatar.cc/150?u=mp-61",
    performance: {
      attendance: 81,
      billsProposed: 8,
      questionsAsked: 3,
      rebellions: 3
    },
    committees: ["Public Accounts Committee"],
    contact: {
      email: "mp-61@parliament.gov.np",
      phone: "+977-1-4200000",
      twitter: "@mp_mp-61"
    }
  },
  {
    id: "mp-62",
    name: "ष्ट्रवराि भक्त श्रेष्ठ",
    party: "राष्ट्रिय स्वतन्त्र पार्टी",
    role: "Member of Parliament",
    district: "काठमाडौं",
    constituency: "8",
    electionType: "FPTP",
    gender: "Male",
    imageUrl: "https://i.pravatar.cc/150?u=mp-62",
    performance: {
      attendance: 73,
      billsProposed: 6,
      questionsAsked: 33,
      rebellions: 0
    },
    committees: ["Public Accounts Committee"],
    contact: {
      email: "mp-62@parliament.gov.np",
      phone: "+977-1-4200000",
      twitter: "@mp_mp-62"
    }
  },
  {
    id: "mp-63",
    name: "डोल प्रिाद अयााल",
    party: "राष्ट्रिय स्वतन्त्र पार्टी",
    role: "Member of Parliament",
    district: "काठमाडौं",
    constituency: "9",
    electionType: "FPTP",
    gender: "Male",
    imageUrl: "https://i.pravatar.cc/150?u=mp-63",
    performance: {
      attendance: 84,
      billsProposed: 2,
      questionsAsked: 31,
      rebellions: 1
    },
    committees: ["Public Accounts Committee"],
    contact: {
      email: "mp-63@parliament.gov.np",
      phone: "+977-1-4200000",
      twitter: "@mp_mp-63"
    }
  },
  {
    id: "mp-64",
    name: "प्रददप ष्ट्रवष् र्ट",
    party: "राष्ट्रिय स्वतन्त्र पार्टी",
    role: "Member of Parliament",
    district: "काठमाडौं",
    constituency: "10",
    electionType: "FPTP",
    gender: "Male",
    imageUrl: "https://i.pravatar.cc/150?u=mp-64",
    performance: {
      attendance: 87,
      billsProposed: 0,
      questionsAsked: 21,
      rebellions: 0
    },
    committees: ["Public Accounts Committee"],
    contact: {
      email: "mp-64@parliament.gov.np",
      phone: "+977-1-4200000",
      twitter: "@mp_mp-64"
    }
  },
  {
    id: "mp-65",
    name: "रुकेश रजन्त्िि",
    party: "राष्ट्रिय स्वतन्त्र पार्टी",
    role: "Member of Parliament",
    district: "भक्तपुर",
    constituency: "1",
    electionType: "FPTP",
    gender: "Male",
    imageUrl: "https://i.pravatar.cc/150?u=mp-65",
    performance: {
      attendance: 78,
      billsProposed: 0,
      questionsAsked: 28,
      rebellions: 2
    },
    committees: ["Public Accounts Committee"],
    contact: {
      email: "mp-65@parliament.gov.np",
      phone: "+977-1-4200000",
      twitter: "@mp_mp-65"
    }
  },
  {
    id: "mp-66",
    name: "रािीव खत्री",
    party: "राष्ट्रिय स्वतन्त्र पार्टी",
    role: "Member of Parliament",
    district: "भक्तपुर",
    constituency: "2",
    electionType: "FPTP",
    gender: "Male",
    imageUrl: "https://i.pravatar.cc/150?u=mp-66",
    performance: {
      attendance: 87,
      billsProposed: 5,
      questionsAsked: 8,
      rebellions: 1
    },
    committees: ["Public Accounts Committee"],
    contact: {
      email: "mp-66@parliament.gov.np",
      phone: "+977-1-4200000",
      twitter: "@mp_mp-66"
    }
  },
  {
    id: "mp-67",
    name: "बुि रत्न महिान",
    party: "राष्ट्रिय स्वतन्त्र पार्टी",
    role: "Member of Parliament",
    district: "लसलिपुर",
    constituency: "1",
    electionType: "FPTP",
    gender: "Male",
    imageUrl: "https://i.pravatar.cc/150?u=mp-67",
    performance: {
      attendance: 84,
      billsProposed: 8,
      questionsAsked: 7,
      rebellions: 0
    },
    committees: ["Public Accounts Committee"],
    contact: {
      email: "mp-67@parliament.gov.np",
      phone: "+977-1-4200000",
      twitter: "@mp_mp-67"
    }
  },
  {
    id: "mp-68",
    name: "मधु कुमार चौलागाई",
    party: "राष्ट्रिय स्वतन्त्र पार्टी",
    role: "Member of Parliament",
    district: "काभ्रेपलाञ्चोक",
    constituency: "1",
    electionType: "FPTP",
    gender: "Male",
    imageUrl: "https://i.pravatar.cc/150?u=mp-68",
    performance: {
      attendance: 71,
      billsProposed: 3,
      questionsAsked: 18,
      rebellions: 2
    },
    committees: ["Public Accounts Committee"],
    contact: {
      email: "mp-68@parliament.gov.np",
      phone: "+977-1-4200000",
      twitter: "@mp_mp-68"
    }
  },
  {
    id: "mp-69",
    name: "बदन कुमार भण्डारी",
    party: "राष्ट्रिय स्वतन्त्र पार्टी",
    role: "Member of Parliament",
    district: "काभ्रेपलाञ्चोक",
    constituency: "2",
    electionType: "FPTP",
    gender: "Male",
    imageUrl: "https://i.pravatar.cc/150?u=mp-69",
    performance: {
      attendance: 88,
      billsProposed: 0,
      questionsAsked: 9,
      rebellions: 3
    },
    committees: ["Public Accounts Committee"],
    contact: {
      email: "mp-69@parliament.gov.np",
      phone: "+977-1-4200000",
      twitter: "@mp_mp-69"
    }
  },
  {
    id: "mp-70",
    name: "भरि प्रिाद परािुली",
    party: "राष्ट्रिय स्वतन्त्र पार्टी",
    role: "Member of Parliament",
    district: "सिन्त्धुपाल्चोक",
    constituency: "1",
    electionType: "FPTP",
    gender: "Male",
    imageUrl: "https://i.pravatar.cc/150?u=mp-70",
    performance: {
      attendance: 89,
      billsProposed: 9,
      questionsAsked: 18,
      rebellions: 2
    },
    committees: ["Public Accounts Committee"],
    contact: {
      email: "mp-70@parliament.gov.np",
      phone: "+977-1-4200000",
      twitter: "@mp_mp-70"
    }
  },
  {
    id: "mp-71",
    name: "युवराि दुलाल",
    party: "नेकपा एमाले",
    role: "Member of Parliament",
    district: "सिन्त्धुपाल्चोक",
    constituency: "2",
    electionType: "FPTP",
    gender: "Male",
    imageUrl: "https://i.pravatar.cc/150?u=mp-71",
    performance: {
      attendance: 83,
      billsProposed: 6,
      questionsAsked: 33,
      rebellions: 3
    },
    committees: ["Public Accounts Committee"],
    contact: {
      email: "mp-71@parliament.gov.np",
      phone: "+977-1-4200000",
      twitter: "@mp_mp-71"
    }
  },
  {
    id: "mp-72",
    name: "प्रकाश गौिम",
    party: "राष्ट्रिय स्वतन्त्र पार्टी",
    role: "Member of Parliament",
    district: "मकवानपुर",
    constituency: "1",
    electionType: "FPTP",
    gender: "Male",
    imageUrl: "https://i.pravatar.cc/150?u=mp-72",
    performance: {
      attendance: 82,
      billsProposed: 2,
      questionsAsked: 49,
      rebellions: 1
    },
    committees: ["Public Accounts Committee"],
    contact: {
      email: "mp-72@parliament.gov.np",
      phone: "+977-1-4200000",
      twitter: "@mp_mp-72"
    }
  },
  {
    id: "mp-73",
    name: "प्रशान्त्ि उप्रेिी",
    party: "राष्ट्रिय स्वतन्त्र पार्टी",
    role: "Member of Parliament",
    district: "मकवानपुर",
    constituency: "2",
    electionType: "FPTP",
    gender: "Male",
    imageUrl: "https://i.pravatar.cc/150?u=mp-73",
    performance: {
      attendance: 82,
      billsProposed: 4,
      questionsAsked: 9,
      rebellions: 3
    },
    committees: ["Public Accounts Committee"],
    contact: {
      email: "mp-73@parliament.gov.np",
      phone: "+977-1-4200000",
      twitter: "@mp_mp-73"
    }
  },
  {
    id: "mp-74",
    name: "हरर ढकाल",
    party: "राष्ट्रिय स्वतन्त्र पार्टी",
    role: "Member of Parliament",
    district: "जचिवन",
    constituency: "1",
    electionType: "FPTP",
    gender: "Male",
    imageUrl: "https://i.pravatar.cc/150?u=mp-74",
    performance: {
      attendance: 84,
      billsProposed: 5,
      questionsAsked: 19,
      rebellions: 0
    },
    committees: ["Public Accounts Committee"],
    contact: {
      email: "mp-74@parliament.gov.np",
      phone: "+977-1-4200000",
      twitter: "@mp_mp-74"
    }
  },
  {
    id: "mp-75",
    name: "रष्ट्रव लासमछाने",
    party: "राष्ट्रिय स्वतन्त्र पार्टी",
    role: "Member of Parliament",
    district: "जचिवन",
    constituency: "2",
    electionType: "FPTP",
    gender: "Male",
    imageUrl: "https://i.pravatar.cc/150?u=mp-75",
    performance: {
      attendance: 70,
      billsProposed: 7,
      questionsAsked: 21,
      rebellions: 4
    },
    committees: ["Public Accounts Committee"],
    contact: {
      email: "mp-75@parliament.gov.np",
      phone: "+977-1-4200000",
      twitter: "@mp_mp-75"
    }
  },
  {
    id: "mp-76",
    name: "िुधन गुरुङ",
    party: "राष्ट्रिय स्वतन्त्र पार्टी",
    role: "Member of Parliament",
    district: "गोरखा",
    constituency: "1",
    electionType: "FPTP",
    gender: "Male",
    imageUrl: "https://i.pravatar.cc/150?u=mp-76",
    performance: {
      attendance: 83,
      billsProposed: 0,
      questionsAsked: 15,
      rebellions: 0
    },
    committees: ["Public Accounts Committee"],
    contact: {
      email: "mp-76@parliament.gov.np",
      phone: "+977-1-4200000",
      twitter: "@mp_mp-76"
    }
  },
  {
    id: "mp-77",
    name: "कष्ट्रवन्त्र बुलााकोर्टी",
    party: "राष्ट्रिय स्वतन्त्र पार्टी",
    role: "Member of Parliament",
    district: "गोरखा",
    constituency: "2",
    electionType: "FPTP",
    gender: "Male",
    imageUrl: "https://i.pravatar.cc/150?u=mp-77",
    performance: {
      attendance: 73,
      billsProposed: 2,
      questionsAsked: 30,
      rebellions: 3
    },
    committees: ["Public Accounts Committee"],
    contact: {
      email: "mp-77@parliament.gov.np",
      phone: "+977-1-4200000",
      twitter: "@mp_mp-77"
    }
  },
  {
    id: "mp-78",
    name: "र्टेक बहादुर गुरुङ",
    party: "नेपाली काँग्रेस",
    role: "Member of Parliament",
    district: "मनाङ",
    constituency: "1",
    electionType: "FPTP",
    gender: "Male",
    imageUrl: "https://i.pravatar.cc/150?u=mp-78",
    performance: {
      attendance: 85,
      billsProposed: 1,
      questionsAsked: 14,
      rebellions: 2
    },
    committees: ["Public Accounts Committee"],
    contact: {
      email: "mp-78@parliament.gov.np",
      phone: "+977-1-4200000",
      twitter: "@mp_mp-78"
    }
  },
  {
    id: "mp-79",
    name: "धमा राि के.िी",
    party: "राष्ट्रिय स्वतन्त्र पार्टी",
    role: "Member of Parliament",
    district: "लमिुङ",
    constituency: "1",
    electionType: "FPTP",
    gender: "Male",
    imageUrl: "https://i.pravatar.cc/150?u=mp-79",
    performance: {
      attendance: 80,
      billsProposed: 7,
      questionsAsked: 38,
      rebellions: 3
    },
    committees: ["Public Accounts Committee"],
    contact: {
      email: "mp-79@parliament.gov.np",
      phone: "+977-1-4200000",
      twitter: "@mp_mp-79"
    }
  },
  {
    id: "mp-80",
    name: "खडक राि पौडेल",
    party: "राष्ट्रिय स्वतन्त्र पार्टी",
    role: "Member of Parliament",
    district: "कास्की",
    constituency: "1",
    electionType: "FPTP",
    gender: "Male",
    imageUrl: "https://i.pravatar.cc/150?u=mp-80",
    performance: {
      attendance: 85,
      billsProposed: 3,
      questionsAsked: 39,
      rebellions: 4
    },
    committees: ["Public Accounts Committee"],
    contact: {
      email: "mp-80@parliament.gov.np",
      phone: "+977-1-4200000",
      twitter: "@mp_mp-80"
    }
  },
  {
    id: "mp-81",
    name: "उत्तम प्रिाद पौडेल",
    party: "राष्ट्रिय स्वतन्त्र पार्टी",
    role: "Member of Parliament",
    district: "कास्की",
    constituency: "2",
    electionType: "FPTP",
    gender: "Male",
    imageUrl: "https://i.pravatar.cc/150?u=mp-81",
    performance: {
      attendance: 87,
      billsProposed: 7,
      questionsAsked: 49,
      rebellions: 1
    },
    committees: ["Public Accounts Committee"],
    contact: {
      email: "mp-81@parliament.gov.np",
      phone: "+977-1-4200000",
      twitter: "@mp_mp-81"
    }
  },
  {
    id: "mp-82",
    name: "स्वजणाम वाग्ले",
    party: "राष्ट्रिय स्वतन्त्र पार्टी",
    role: "Member of Parliament",
    district: "िनहुाँ",
    constituency: "1",
    electionType: "FPTP",
    gender: "Male",
    imageUrl: "https://i.pravatar.cc/150?u=mp-82",
    performance: {
      attendance: 79,
      billsProposed: 8,
      questionsAsked: 49,
      rebellions: 1
    },
    committees: ["Public Accounts Committee"],
    contact: {
      email: "mp-82@parliament.gov.np",
      phone: "+977-1-4200000",
      twitter: "@mp_mp-82"
    }
  },
  {
    id: "mp-83",
    name: "श्रीराम न्त्यौपाने",
    party: "राष्ट्रिय स्वतन्त्र पार्टी",
    role: "Member of Parliament",
    district: "िनहुाँ",
    constituency: "2",
    electionType: "FPTP",
    gender: "Male",
    imageUrl: "https://i.pravatar.cc/150?u=mp-83",
    performance: {
      attendance: 80,
      billsProposed: 2,
      questionsAsked: 23,
      rebellions: 3
    },
    committees: ["Public Accounts Committee"],
    contact: {
      email: "mp-83@parliament.gov.np",
      phone: "+977-1-4200000",
      twitter: "@mp_mp-83"
    }
  },
  {
    id: "mp-84",
    name: "धनन्त्िय रेग्मी",
    party: "राष्ट्रिय स्वतन्त्र पार्टी",
    role: "Member of Parliament",
    district: "स्याङिा",
    constituency: "1",
    electionType: "FPTP",
    gender: "Male",
    imageUrl: "https://i.pravatar.cc/150?u=mp-84",
    performance: {
      attendance: 81,
      billsProposed: 4,
      questionsAsked: 26,
      rebellions: 4
    },
    committees: ["Public Accounts Committee"],
    contact: {
      email: "mp-84@parliament.gov.np",
      phone: "+977-1-4200000",
      twitter: "@mp_mp-84"
    }
  },
  {
    id: "mp-85",
    name: "झष्ट्रव लाल डुम्रे",
    party: "राष्ट्रिय स्वतन्त्र पार्टी",
    role: "Member of Parliament",
    district: "स्याङिा",
    constituency: "2",
    electionType: "FPTP",
    gender: "Male",
    imageUrl: "https://i.pravatar.cc/150?u=mp-85",
    performance: {
      attendance: 78,
      billsProposed: 1,
      questionsAsked: 35,
      rebellions: 0
    },
    committees: ["Public Accounts Committee"],
    contact: {
      email: "mp-85@parliament.gov.np",
      phone: "+977-1-4200000",
      twitter: "@mp_mp-85"
    }
  },
  {
    id: "mp-86",
    name: "योगेश गौचन",
    party: "नेपाली काँग्रेस",
    role: "Member of Parliament",
    district: "थकालीमुस्िाङ",
    constituency: "1",
    electionType: "FPTP",
    gender: "Male",
    imageUrl: "https://i.pravatar.cc/150?u=mp-86",
    performance: {
      attendance: 86,
      billsProposed: 6,
      questionsAsked: 42,
      rebellions: 1
    },
    committees: ["Public Accounts Committee"],
    contact: {
      email: "mp-86@parliament.gov.np",
      phone: "+977-1-4200000",
      twitter: "@mp_mp-86"
    }
  },
  {
    id: "mp-87",
    name: "महावीर पुन",
    party: "राष्ट्रिय स्वतन्त्र पार्टी",
    role: "Member of Parliament",
    district: "म्याग्दी",
    constituency: "1",
    electionType: "FPTP",
    gender: "Male",
    imageUrl: "https://i.pravatar.cc/150?u=mp-87",
    performance: {
      attendance: 76,
      billsProposed: 8,
      questionsAsked: 3,
      rebellions: 3
    },
    committees: ["Public Accounts Committee"],
    contact: {
      email: "mp-87@parliament.gov.np",
      phone: "+977-1-4200000",
      twitter: "@mp_mp-87"
    }
  },
  {
    id: "mp-88",
    name: "िुशील खड्का",
    party: "राष्ट्रिय स्वतन्त्र पार्टी",
    role: "Member of Parliament",
    district: "बाग्लुङ",
    constituency: "1",
    electionType: "FPTP",
    gender: "Male",
    imageUrl: "https://i.pravatar.cc/150?u=mp-88",
    performance: {
      attendance: 79,
      billsProposed: 1,
      questionsAsked: 26,
      rebellions: 2
    },
    committees: ["Public Accounts Committee"],
    contact: {
      email: "mp-88@parliament.gov.np",
      phone: "+977-1-4200000",
      twitter: "@mp_mp-88"
    }
  },
  {
    id: "mp-89",
    name: "िोम शमाा",
    party: "राष्ट्रिय स्वतन्त्र पार्टी",
    role: "Member of Parliament",
    district: "बाग्लुङ",
    constituency: "2",
    electionType: "FPTP",
    gender: "Male",
    imageUrl: "https://i.pravatar.cc/150?u=mp-89",
    performance: {
      attendance: 71,
      billsProposed: 0,
      questionsAsked: 39,
      rebellions: 0
    },
    committees: ["Public Accounts Committee"],
    contact: {
      email: "mp-89@parliament.gov.np",
      phone: "+977-1-4200000",
      twitter: "@mp_mp-89"
    }
  },
  {
    id: "mp-90",
    name: "िागर भुिाल",
    party: "राष्ट्रिय स्वतन्त्र पार्टी",
    role: "Member of Parliament",
    district: "पवाि",
    constituency: "1",
    electionType: "FPTP",
    gender: "Male",
    imageUrl: "https://i.pravatar.cc/150?u=mp-90",
    performance: {
      attendance: 74,
      billsProposed: 2,
      questionsAsked: 13,
      rebellions: 2
    },
    committees: ["Public Accounts Committee"],
    contact: {
      email: "mp-90@parliament.gov.np",
      phone: "+977-1-4200000",
      twitter: "@mp_mp-90"
    }
  },
  {
    id: "mp-91",
    name: "िागर ढकाल",
    party: "राष्ट्रिय स्वतन्त्र पार्टी",
    role: "Member of Parliament",
    district: "गुल्मी",
    constituency: "1",
    electionType: "FPTP",
    gender: "Male",
    imageUrl: "https://i.pravatar.cc/150?u=mp-91",
    performance: {
      attendance: 76,
      billsProposed: 6,
      questionsAsked: 49,
      rebellions: 4
    },
    committees: ["Public Accounts Committee"],
    contact: {
      email: "mp-91@parliament.gov.np",
      phone: "+977-1-4200000",
      twitter: "@mp_mp-91"
    }
  },
  {
    id: "mp-92",
    name: "गोष्ट्रवन्त्द पन्त्थी",
    party: "राष्ट्रिय स्वतन्त्र पार्टी",
    role: "Member of Parliament",
    district: "गुल्मी",
    constituency: "2",
    electionType: "FPTP",
    gender: "Male",
    imageUrl: "https://i.pravatar.cc/150?u=mp-92",
    performance: {
      attendance: 74,
      billsProposed: 8,
      questionsAsked: 43,
      rebellions: 0
    },
    committees: ["Public Accounts Committee"],
    contact: {
      email: "mp-92@parliament.gov.np",
      phone: "+977-1-4200000",
      twitter: "@mp_mp-92"
    }
  },
  {
    id: "mp-93",
    name: "िन्त्दीप राना",
    party: "नेपाली काँग्रेस",
    role: "Member of Parliament",
    district: "पाल्पा",
    constituency: "1",
    electionType: "FPTP",
    gender: "Male",
    imageUrl: "https://i.pravatar.cc/150?u=mp-93",
    performance: {
      attendance: 79,
      billsProposed: 2,
      questionsAsked: 47,
      rebellions: 2
    },
    committees: ["Public Accounts Committee"],
    contact: {
      email: "mp-93@parliament.gov.np",
      phone: "+977-1-4200000",
      twitter: "@mp_mp-93"
    }
  },
  {
    id: "mp-94",
    name: "माधव बहादुर थापा",
    party: "राष्ट्रिय स्वतन्त्र पार्टी",
    role: "Member of Parliament",
    district: "पाल्पा",
    constituency: "2",
    electionType: "FPTP",
    gender: "Male",
    imageUrl: "https://i.pravatar.cc/150?u=mp-94",
    performance: {
      attendance: 85,
      billsProposed: 6,
      questionsAsked: 25,
      rebellions: 0
    },
    committees: ["Public Accounts Committee"],
    contact: {
      email: "mp-94@parliament.gov.np",
      phone: "+977-1-4200000",
      twitter: "@mp_mp-94"
    }
  },
  {
    id: "mp-95",
    name: "हरी प्रिाद भुिाल",
    party: "राष्ट्रिय स्वतन्त्र पार्टी",
    role: "Member of Parliament",
    district: "अघााखााँची",
    constituency: "1",
    electionType: "FPTP",
    gender: "Male",
    imageUrl: "https://i.pravatar.cc/150?u=mp-95",
    performance: {
      attendance: 70,
      billsProposed: 7,
      questionsAsked: 9,
      rebellions: 0
    },
    committees: ["Public Accounts Committee"],
    contact: {
      email: "mp-95@parliament.gov.np",
      phone: "+977-1-4200000",
      twitter: "@mp_mp-95"
    }
  },
  {
    id: "mp-96",
    name: "िुसनल लम्िाल",
    party: "राष्ट्रिय स्वतन्त्र पार्टी",
    role: "Member of Parliament",
    district: "रूपन्त्देही",
    constituency: "1",
    electionType: "FPTP",
    gender: "Male",
    imageUrl: "https://i.pravatar.cc/150?u=mp-96",
    performance: {
      attendance: 79,
      billsProposed: 1,
      questionsAsked: 27,
      rebellions: 0
    },
    committees: ["Public Accounts Committee"],
    contact: {
      email: "mp-96@parliament.gov.np",
      phone: "+977-1-4200000",
      twitter: "@mp_mp-96"
    }
  },
  {
    id: "mp-97",
    name: "िुलभ खरेल",
    party: "राष्ट्रिय स्वतन्त्र पार्टी",
    role: "Member of Parliament",
    district: "रूपन्त्देही",
    constituency: "2",
    electionType: "FPTP",
    gender: "Male",
    imageUrl: "https://i.pravatar.cc/150?u=mp-97",
    performance: {
      attendance: 83,
      billsProposed: 4,
      questionsAsked: 46,
      rebellions: 2
    },
    committees: ["Public Accounts Committee"],
    contact: {
      email: "mp-97@parliament.gov.np",
      phone: "+977-1-4200000",
      twitter: "@mp_mp-97"
    }
  },
  {
    id: "mp-98",
    name: "डा. लेखिंग थापा",
    party: "राष्ट्रिय स्वतन्त्र पार्टी",
    role: "Member of Parliament",
    district: "रूपन्त्देही",
    constituency: "3",
    electionType: "FPTP",
    gender: "Male",
    imageUrl: "https://i.pravatar.cc/150?u=mp-98",
    performance: {
      attendance: 80,
      billsProposed: 0,
      questionsAsked: 27,
      rebellions: 4
    },
    committees: ["Public Accounts Committee"],
    contact: {
      email: "mp-98@parliament.gov.np",
      phone: "+977-1-4200000",
      twitter: "@mp_mp-98"
    }
  },
  {
    id: "mp-99",
    name: "कन्त्हैया बसनया",
    party: "राष्ट्रिय स्वतन्त्र पार्टी",
    role: "Member of Parliament",
    district: "रूपन्त्देही",
    constituency: "4",
    electionType: "FPTP",
    gender: "Male",
    imageUrl: "https://i.pravatar.cc/150?u=mp-99",
    performance: {
      attendance: 77,
      billsProposed: 4,
      questionsAsked: 46,
      rebellions: 0
    },
    committees: ["Public Accounts Committee"],
    contact: {
      email: "mp-99@parliament.gov.np",
      phone: "+977-1-4200000",
      twitter: "@mp_mp-99"
    }
  },
  {
    id: "mp-100",
    name: "िौष्ट्रिक अहमद खान",
    party: "राष्ट्रिय स्वतन्त्र पार्टी",
    role: "Member of Parliament",
    district: "रूपन्त्देही",
    constituency: "5",
    electionType: "FPTP",
    gender: "Male",
    imageUrl: "https://i.pravatar.cc/150?u=mp-100",
    performance: {
      attendance: 89,
      billsProposed: 7,
      questionsAsked: 8,
      rebellions: 2
    },
    committees: ["Public Accounts Committee"],
    contact: {
      email: "mp-100@parliament.gov.np",
      phone: "+977-1-4200000",
      twitter: "@mp_mp-100"
    }
  },
  {
    id: "mp-101",
    name: "मोहन लाल आचाया",
    party: "राष्ट्रिय स्वतन्त्र पार्टी",
    role: "Member of Parliament",
    district: "कष्ट्रपलबस्िु",
    constituency: "1",
    electionType: "FPTP",
    gender: "Male",
    imageUrl: "https://i.pravatar.cc/150?u=mp-101",
    performance: {
      attendance: 82,
      billsProposed: 0,
      questionsAsked: 35,
      rebellions: 0
    },
    committees: ["Public Accounts Committee"],
    contact: {
      email: "mp-101@parliament.gov.np",
      phone: "+977-1-4200000",
      twitter: "@mp_mp-101"
    }
  },
  {
    id: "mp-102",
    name: "ष्ट्रवक्रम थापा",
    party: "राष्ट्रिय स्वतन्त्र पार्टी",
    role: "Member of Parliament",
    district: "कष्ट्रपलबस्िु",
    constituency: "2",
    electionType: "FPTP",
    gender: "Male",
    imageUrl: "https://i.pravatar.cc/150?u=mp-102",
    performance: {
      attendance: 86,
      billsProposed: 0,
      questionsAsked: 9,
      rebellions: 4
    },
    committees: ["Public Accounts Committee"],
    contact: {
      email: "mp-102@parliament.gov.np",
      phone: "+977-1-4200000",
      twitter: "@mp_mp-102"
    }
  },
  {
    id: "mp-103",
    name: "असभषेक प्रिाप शाह",
    party: "नेपाली काँग्रेस",
    role: "Member of Parliament",
    district: "कष्ट्रपलबस्िु",
    constituency: "3",
    electionType: "FPTP",
    gender: "Male",
    imageUrl: "https://i.pravatar.cc/150?u=mp-103",
    performance: {
      attendance: 79,
      billsProposed: 9,
      questionsAsked: 45,
      rebellions: 0
    },
    committees: ["Public Accounts Committee"],
    contact: {
      email: "mp-103@parliament.gov.np",
      phone: "+977-1-4200000",
      twitter: "@mp_mp-103"
    }
  },
  {
    id: "mp-104",
    name: "बषामान पुन",
    party: "नेकपा एमाले",
    role: "Member of Parliament",
    district: "रोल्पा",
    constituency: "1",
    electionType: "FPTP",
    gender: "Male",
    imageUrl: "https://i.pravatar.cc/150?u=mp-104",
    performance: {
      attendance: 73,
      billsProposed: 9,
      questionsAsked: 1,
      rebellions: 1
    },
    committees: ["Public Accounts Committee"],
    contact: {
      email: "mp-104@parliament.gov.np",
      phone: "+977-1-4200000",
      twitter: "@mp_mp-104"
    }
  },
  {
    id: "mp-105",
    name: "िुशान्त्ि वैददक",
    party: "राष्ट्रिय स्वतन्त्र पार्टी",
    role: "Member of Parliament",
    district: "प्यूठान",
    constituency: "1",
    electionType: "FPTP",
    gender: "Male",
    imageUrl: "https://i.pravatar.cc/150?u=mp-105",
    performance: {
      attendance: 87,
      billsProposed: 5,
      questionsAsked: 15,
      rebellions: 3
    },
    committees: ["Public Accounts Committee"],
    contact: {
      email: "mp-105@parliament.gov.np",
      phone: "+977-1-4200000",
      twitter: "@mp_mp-105"
    }
  },
  {
    id: "mp-106",
    name: "देवराि पाठक",
    party: "राष्ट्रिय स्वतन्त्र पार्टी",
    role: "Member of Parliament",
    district: "दाङ",
    constituency: "1",
    electionType: "FPTP",
    gender: "Male",
    imageUrl: "https://i.pravatar.cc/150?u=mp-106",
    performance: {
      attendance: 77,
      billsProposed: 2,
      questionsAsked: 26,
      rebellions: 3
    },
    committees: ["Public Accounts Committee"],
    contact: {
      email: "mp-106@parliament.gov.np",
      phone: "+977-1-4200000",
      twitter: "@mp_mp-106"
    }
  },
  {
    id: "mp-107",
    name: "ष्ट्रवष्ट्रपन कुमार",
    party: "राष्ट्रिय स्वतन्त्र पार्टी",
    role: "Member of Parliament",
    district: "आचायादाङ",
    constituency: "2",
    electionType: "FPTP",
    gender: "Male",
    imageUrl: "https://i.pravatar.cc/150?u=mp-107",
    performance: {
      attendance: 77,
      billsProposed: 4,
      questionsAsked: 1,
      rebellions: 1
    },
    committees: ["Public Accounts Committee"],
    contact: {
      email: "mp-107@parliament.gov.np",
      phone: "+977-1-4200000",
      twitter: "@mp_mp-107"
    }
  },
  {
    id: "mp-108",
    name: "कमल िुबेदी",
    party: "राष्ट्रिय स्वतन्त्र पार्टी",
    role: "Member of Parliament",
    district: "दाङ",
    constituency: "3",
    electionType: "FPTP",
    gender: "Male",
    imageUrl: "https://i.pravatar.cc/150?u=mp-108",
    performance: {
      attendance: 89,
      billsProposed: 8,
      questionsAsked: 31,
      rebellions: 3
    },
    committees: ["Public Accounts Committee"],
    contact: {
      email: "mp-108@parliament.gov.np",
      phone: "+977-1-4200000",
      twitter: "@mp_mp-108"
    }
  },
  {
    id: "mp-109",
    name: "िुरेश कुमार चौधरी",
    party: "राष्ट्रिय स्वतन्त्र पार्टी",
    role: "Member of Parliament",
    district: "बााँके",
    constituency: "1",
    electionType: "FPTP",
    gender: "Male",
    imageUrl: "https://i.pravatar.cc/150?u=mp-109",
    performance: {
      attendance: 86,
      billsProposed: 1,
      questionsAsked: 9,
      rebellions: 2
    },
    committees: ["Public Accounts Committee"],
    contact: {
      email: "mp-109@parliament.gov.np",
      phone: "+977-1-4200000",
      twitter: "@mp_mp-109"
    }
  },
  {
    id: "mp-110",
    name: "खगेन्त्र िुनार",
    party: "राष्ट्रिय स्वतन्त्र पार्टी",
    role: "Member of Parliament",
    district: "बााँके",
    constituency: "3",
    electionType: "FPTP",
    gender: "Male",
    imageUrl: "https://i.pravatar.cc/150?u=mp-110",
    performance: {
      attendance: 81,
      billsProposed: 6,
      questionsAsked: 18,
      rebellions: 3
    },
    committees: ["Public Accounts Committee"],
    contact: {
      email: "mp-110@parliament.gov.np",
      phone: "+977-1-4200000",
      twitter: "@mp_mp-110"
    }
  },
  {
    id: "mp-111",
    name: "ठाकुर सिंह थारु",
    party: "राष्ट्रिय स्वतन्त्र पार्टी",
    role: "Member of Parliament",
    district: "बददाया",
    constituency: "1",
    electionType: "FPTP",
    gender: "Male",
    imageUrl: "https://i.pravatar.cc/150?u=mp-111",
    performance: {
      attendance: 71,
      billsProposed: 1,
      questionsAsked: 48,
      rebellions: 2
    },
    committees: ["Public Accounts Committee"],
    contact: {
      email: "mp-111@parliament.gov.np",
      phone: "+977-1-4200000",
      twitter: "@mp_mp-111"
    }
  },
  {
    id: "mp-112",
    name: "श्रीधर पोख्रेल",
    party: "राष्ट्रिय स्वतन्त्र पार्टी",
    role: "Member of Parliament",
    district: "बददाया",
    constituency: "2",
    electionType: "FPTP",
    gender: "Male",
    imageUrl: "https://i.pravatar.cc/150?u=mp-112",
    performance: {
      attendance: 72,
      billsProposed: 7,
      questionsAsked: 12,
      rebellions: 3
    },
    committees: ["Public Accounts Committee"],
    contact: {
      email: "mp-112@parliament.gov.np",
      phone: "+977-1-4200000",
      twitter: "@mp_mp-112"
    }
  },
  {
    id: "mp-113",
    name: "रमेश कुमार मल्ल",
    party: "नेकपा एमाले",
    role: "Member of Parliament",
    district: "िल्यान",
    constituency: "1",
    electionType: "FPTP",
    gender: "Male",
    imageUrl: "https://i.pravatar.cc/150?u=mp-113",
    performance: {
      attendance: 88,
      billsProposed: 8,
      questionsAsked: 19,
      rebellions: 3
    },
    committees: ["Public Accounts Committee"],
    contact: {
      email: "mp-113@parliament.gov.np",
      phone: "+977-1-4200000",
      twitter: "@mp_mp-113"
    }
  },
  {
    id: "mp-114",
    name: "धन बहादुर बुढा",
    party: "नेकपा एमाले",
    role: "Member of Parliament",
    district: "डोल्पा",
    constituency: "1",
    electionType: "FPTP",
    gender: "Male",
    imageUrl: "https://i.pravatar.cc/150?u=mp-114",
    performance: {
      attendance: 81,
      billsProposed: 5,
      questionsAsked: 3,
      rebellions: 0
    },
    committees: ["Public Accounts Committee"],
    contact: {
      email: "mp-114@parliament.gov.np",
      phone: "+977-1-4200000",
      twitter: "@mp_mp-114"
    }
  },
  {
    id: "mp-115",
    name: "खड्ग शाही",
    party: "नेपाली काँग्रेस",
    role: "Member of Parliament",
    district: "मुगु",
    constituency: "1",
    electionType: "FPTP",
    gender: "Male",
    imageUrl: "https://i.pravatar.cc/150?u=mp-115",
    performance: {
      attendance: 82,
      billsProposed: 0,
      questionsAsked: 9,
      rebellions: 0
    },
    committees: ["Public Accounts Committee"],
    contact: {
      email: "mp-115@parliament.gov.np",
      phone: "+977-1-4200000",
      twitter: "@mp_mp-115"
    }
  },
  {
    id: "mp-116",
    name: "ज्ञान बहादुर शाही",
    party: "स्वतन्त्र",
    role: "Member of Parliament",
    district: "िुम्ला",
    constituency: "1",
    electionType: "FPTP",
    gender: "Male",
    imageUrl: "https://i.pravatar.cc/150?u=mp-116",
    performance: {
      attendance: 72,
      billsProposed: 8,
      questionsAsked: 4,
      rebellions: 1
    },
    committees: ["Public Accounts Committee"],
    contact: {
      email: "mp-116@parliament.gov.np",
      phone: "+977-1-4200000",
      twitter: "@mp_mp-116"
    }
  },
  {
    id: "mp-117",
    name: "महेन्त्र बहादुर शाही",
    party: "नेकपा एमाले",
    role: "Member of Parliament",
    district: "कासलकोर्ट",
    constituency: "1",
    electionType: "FPTP",
    gender: "Male",
    imageUrl: "https://i.pravatar.cc/150?u=mp-117",
    performance: {
      attendance: 80,
      billsProposed: 8,
      questionsAsked: 21,
      rebellions: 3
    },
    committees: ["Public Accounts Committee"],
    contact: {
      email: "mp-117@parliament.gov.np",
      phone: "+977-1-4200000",
      twitter: "@mp_mp-117"
    }
  },
  {
    id: "mp-118",
    name: "िय पिी रोकाया",
    party: "नेपाली काँग्रेस",
    role: "Member of Parliament",
    district: "हुम्ला",
    constituency: "1",
    electionType: "FPTP",
    gender: "Male",
    imageUrl: "https://i.pravatar.cc/150?u=mp-118",
    performance: {
      attendance: 78,
      billsProposed: 4,
      questionsAsked: 24,
      rebellions: 0
    },
    committees: ["Public Accounts Committee"],
    contact: {
      email: "mp-118@parliament.gov.np",
      phone: "+977-1-4200000",
      twitter: "@mp_mp-118"
    }
  },
  {
    id: "mp-119",
    name: "खडक वहादुर वुढा",
    party: "नेपाली काँग्रेस",
    role: "Member of Parliament",
    district: "िािरकोर्ट",
    constituency: "1",
    electionType: "FPTP",
    gender: "Male",
    imageUrl: "https://i.pravatar.cc/150?u=mp-119",
    performance: {
      attendance: 84,
      billsProposed: 4,
      questionsAsked: 23,
      rebellions: 0
    },
    committees: ["Public Accounts Committee"],
    contact: {
      email: "mp-119@parliament.gov.np",
      phone: "+977-1-4200000",
      twitter: "@mp_mp-119"
    }
  },
  {
    id: "mp-120",
    name: "ष्ट्रवष्णु बहादुर",
    party: "नेपाली काँग्रेस",
    role: "Member of Parliament",
    district: "खड्कािुखेि",
    constituency: "1",
    electionType: "FPTP",
    gender: "Male",
    imageUrl: "https://i.pravatar.cc/150?u=mp-120",
    performance: {
      attendance: 78,
      billsProposed: 2,
      questionsAsked: 9,
      rebellions: 3
    },
    committees: ["Public Accounts Committee"],
    contact: {
      email: "mp-120@parliament.gov.np",
      phone: "+977-1-4200000",
      twitter: "@mp_mp-120"
    }
  },
  {
    id: "mp-121",
    name: "रमेश कुमार",
    party: "राष्ट्रिय स्वतन्त्र पार्टी",
    role: "Member of Parliament",
    district: "िापकोर्टािुखेि",
    constituency: "2",
    electionType: "FPTP",
    gender: "Male",
    imageUrl: "https://i.pravatar.cc/150?u=mp-121",
    performance: {
      attendance: 72,
      billsProposed: 8,
      questionsAsked: 29,
      rebellions: 1
    },
    committees: ["Public Accounts Committee"],
    contact: {
      email: "mp-121@parliament.gov.np",
      phone: "+977-1-4200000",
      twitter: "@mp_mp-121"
    }
  },
  {
    id: "mp-122",
    name: "िनक राि सगरी",
    party: "नेपाली काँग्रेस",
    role: "Member of Parliament",
    district: "बािुरा",
    constituency: "1",
    electionType: "FPTP",
    gender: "Male",
    imageUrl: "https://i.pravatar.cc/150?u=mp-122",
    performance: {
      attendance: 86,
      billsProposed: 7,
      questionsAsked: 18,
      rebellions: 1
    },
    committees: ["Public Accounts Committee"],
    contact: {
      email: "mp-122@parliament.gov.np",
      phone: "+977-1-4200000",
      twitter: "@mp_mp-122"
    }
  },
  {
    id: "mp-123",
    name: "भरि कुमार स्वार",
    party: "नेपाली काँग्रेस",
    role: "Member of Parliament",
    district: "अछाम",
    constituency: "1",
    electionType: "FPTP",
    gender: "Male",
    imageUrl: "https://i.pravatar.cc/150?u=mp-123",
    performance: {
      attendance: 83,
      billsProposed: 5,
      questionsAsked: 0,
      rebellions: 4
    },
    committees: ["Public Accounts Committee"],
    contact: {
      email: "mp-123@parliament.gov.np",
      phone: "+977-1-4200000",
      twitter: "@mp_mp-123"
    }
  },
  {
    id: "mp-124",
    name: "भरि बहादुर खड्का",
    party: "नेपाली काँग्रेस",
    role: "Member of Parliament",
    district: "डोर्टी",
    constituency: "1",
    electionType: "FPTP",
    gender: "Male",
    imageUrl: "https://i.pravatar.cc/150?u=mp-124",
    performance: {
      attendance: 79,
      billsProposed: 8,
      questionsAsked: 27,
      rebellions: 1
    },
    committees: ["Public Accounts Committee"],
    contact: {
      email: "mp-124@parliament.gov.np",
      phone: "+977-1-4200000",
      twitter: "@mp_mp-124"
    }
  },
  {
    id: "mp-125",
    name: "के पी खनाल",
    party: "राष्ट्रिय स्वतन्त्र पार्टी",
    role: "Member of Parliament",
    district: "कैलाली",
    constituency: "2",
    electionType: "FPTP",
    gender: "Male",
    imageUrl: "https://i.pravatar.cc/150?u=mp-125",
    performance: {
      attendance: 88,
      billsProposed: 5,
      questionsAsked: 38,
      rebellions: 0
    },
    committees: ["Public Accounts Committee"],
    contact: {
      email: "mp-125@parliament.gov.np",
      phone: "+977-1-4200000",
      twitter: "@mp_mp-125"
    }
  },
  {
    id: "mp-126",
    name: "िगि प्रिाद िोशी",
    party: "राष्ट्रिय स्वतन्त्र पार्टी",
    role: "Member of Parliament",
    district: "कैलाली",
    constituency: "3",
    electionType: "FPTP",
    gender: "Male",
    imageUrl: "https://i.pravatar.cc/150?u=mp-126",
    performance: {
      attendance: 87,
      billsProposed: 3,
      questionsAsked: 2,
      rebellions: 4
    },
    committees: ["Public Accounts Committee"],
    contact: {
      email: "mp-126@parliament.gov.np",
      phone: "+977-1-4200000",
      twitter: "@mp_mp-126"
    }
  },
  {
    id: "mp-127",
    name: "खेम राि कोईराला",
    party: "राष्ट्रिय स्वतन्त्र पार्टी",
    role: "Member of Parliament",
    district: "कैलाली",
    constituency: "4",
    electionType: "FPTP",
    gender: "Male",
    imageUrl: "https://i.pravatar.cc/150?u=mp-127",
    performance: {
      attendance: 73,
      billsProposed: 3,
      questionsAsked: 47,
      rebellions: 3
    },
    committees: ["Public Accounts Committee"],
    contact: {
      email: "mp-127@parliament.gov.np",
      phone: "+977-1-4200000",
      twitter: "@mp_mp-127"
    }
  },
  {
    id: "mp-128",
    name: "आनन्त् द बहादुर चन्त् द",
    party: "राष्ट्रिय स्वतन्त्र पार्टी",
    role: "Member of Parliament",
    district: "कैलाली",
    constituency: "5",
    electionType: "FPTP",
    gender: "Male",
    imageUrl: "https://i.pravatar.cc/150?u=mp-128",
    performance: {
      attendance: 71,
      billsProposed: 4,
      questionsAsked: 15,
      rebellions: 1
    },
    committees: ["Public Accounts Committee"],
    contact: {
      email: "mp-128@parliament.gov.np",
      phone: "+977-1-4200000",
      twitter: "@mp_mp-128"
    }
  },
  {
    id: "mp-129",
    name: "हरर मोहन भण्डारी",
    party: "राष्ट्रिय स्वतन्त्र पार्टी",
    role: "Member of Parliament",
    district: "बैिडी",
    constituency: "1",
    electionType: "FPTP",
    gender: "Male",
    imageUrl: "https://i.pravatar.cc/150?u=mp-129",
    performance: {
      attendance: 84,
      billsProposed: 9,
      questionsAsked: 13,
      rebellions: 0
    },
    committees: ["Public Accounts Committee"],
    contact: {
      email: "mp-129@parliament.gov.np",
      phone: "+977-1-4200000",
      twitter: "@mp_mp-129"
    }
  },
  {
    id: "mp-130",
    name: "िारा प्रिाद िोशी",
    party: "राष्ट्रिय स्वतन्त्र पार्टी",
    role: "Member of Parliament",
    district: "डडेलधुरा",
    constituency: "1",
    electionType: "FPTP",
    gender: "Male",
    imageUrl: "https://i.pravatar.cc/150?u=mp-130",
    performance: {
      attendance: 72,
      billsProposed: 6,
      questionsAsked: 15,
      rebellions: 4
    },
    committees: ["Public Accounts Committee"],
    contact: {
      email: "mp-130@parliament.gov.np",
      phone: "+977-1-4200000",
      twitter: "@mp_mp-130"
    }
  },
  {
    id: "mp-131",
    name: "िनक सिंह धामी कञ्",
    party: "राष्ट्रिय स्वतन्त्र पार्टी",
    role: "Member of Parliament",
    district: "चनपुर",
    constituency: "1",
    electionType: "FPTP",
    gender: "Male",
    imageUrl: "https://i.pravatar.cc/150?u=mp-131",
    performance: {
      attendance: 80,
      billsProposed: 1,
      questionsAsked: 33,
      rebellions: 3
    },
    committees: ["Public Accounts Committee"],
    contact: {
      email: "mp-131@parliament.gov.np",
      phone: "+977-1-4200000",
      twitter: "@mp_mp-131"
    }
  },
  {
    id: "mp-132",
    name: "ददपक राि बोहरा कञ्",
    party: "राष्ट्रिय स्वतन्त्र पार्टी",
    role: "Member of Parliament",
    district: "चनपुर",
    constituency: "2",
    electionType: "FPTP",
    gender: "Male",
    imageUrl: "https://i.pravatar.cc/150?u=mp-132",
    performance: {
      attendance: 74,
      billsProposed: 0,
      questionsAsked: 31,
      rebellions: 0
    },
    committees: ["Public Accounts Committee"],
    contact: {
      email: "mp-132@parliament.gov.np",
      phone: "+977-1-4200000",
      twitter: "@mp_mp-132"
    }
  },
  {
    id: "mp-133",
    name: "ज्ञानेन्त्र सिंह महिा कञ्",
    party: "राष्ट्रिय स्वतन्त्र पार्टी",
    role: "Member of Parliament",
    district: "चनपुर",
    constituency: "3",
    electionType: "FPTP",
    gender: "Male",
    imageUrl: "https://i.pravatar.cc/150?u=mp-133",
    performance: {
      attendance: 73,
      billsProposed: 4,
      questionsAsked: 16,
      rebellions: 0
    },
    committees: ["Public Accounts Committee"],
    contact: {
      email: "mp-133@parliament.gov.np",
      phone: "+977-1-4200000",
      twitter: "@mp_mp-133"
    }
  },
];

// ─── Votes ────────────────────────────────────────────────────────────────────

export const MOCK_VOTES: Vote[] = [
  {
    id: 'vote-2082-001',
    billId: 'bill-2082-004',
    billTitle: 'Investment Promotion and Protection Act, 2082',
    date: '2026-03-27',
    chamber: 'HOR',
    totalYes: 198,
    totalNo: 61,
    totalAbstain: 8,
    totalAbsent: 8,
    result: 'passed',
    description: 'Final reading vote. RSP voted unanimously in favour.',
  },
  {
    id: 'vote-2082-002',
    billId: 'bill-2082-007',
    billTitle: 'National Health Insurance Expansion Bill, 2082',
    date: '2026-03-25',
    chamber: 'HOR',
    totalYes: 241,
    totalNo: 22,
    totalAbstain: 5,
    totalAbsent: 7,
    result: 'passed',
    description: 'Broad cross-party support. Even opposition supported core provisions.',
  },
  {
    id: 'vote-2082-003',
    billId: 'bill-2082-008',
    billTitle: 'Provincial Powers Delimitation Bill, 2082',
    date: '2026-03-29',
    chamber: 'HOR',
    totalYes: 121,
    totalNo: 134,
    totalAbstain: 12,
    totalAbsent: 8,
    result: 'failed',
    description: 'Surprise defeat. 18 RSP members voted against, siding with opposition over federalism concerns.',
  },
]

// ─── Committees ───────────────────────────────────────────────────────────────

export const MOCK_COMMITTEES: Committee[] = [
  {
    id: 'committee-finance',
    name: 'Finance Committee',
    nameNepali: 'वित्त समिति',
    chamber: 'HOR',
    chair: 'Swarnim Wagle',
    members: ['swarnim-wagle', 'balendra-shah', 'biraj-shrestha'],
    activeBills: 3,
    lastMeeting: '2026-03-29',
    nextMeeting: '2026-04-02',
    description: 'Reviews financial legislation, budget allocations, and taxation policy.',
  },
  {
    id: 'committee-law',
    name: 'Law, Justice and Parliamentary Affairs Committee',
    nameNepali: 'कानून, न्याय तथा संसदीय समिति',
    chamber: 'HOR',
    chair: 'Ranju Darshana',
    members: ['ranju-darshana', 'sher-bahadur-deuba'],
    activeBills: 5,
    lastMeeting: '2026-03-28',
    nextMeeting: '2026-04-01',
    description: 'Scrutinises constitutional and legal bills, judicial appointments, and parliamentary procedures.',
  },
  {
    id: 'committee-home',
    name: 'Home Affairs Committee',
    nameNepali: 'गृह समिति',
    chamber: 'HOR',
    chair: 'Rabi Lamichhane',
    members: ['rabi-lamichhane', 'kabindra-burlakoti'],
    activeBills: 2,
    lastMeeting: '2026-03-27',
    nextMeeting: '2026-04-03',
    description: 'Oversees police, internal security, immigration, and disaster management.',
  },
  {
    id: 'committee-ict',
    name: 'IT and Communication Committee',
    nameNepali: 'सूचना प्रविधि तथा सञ्चार समिति',
    chamber: 'HOR',
    chair: 'Shishir Khanal',
    members: ['shishir-khanal', 'prashant-upreti'],
    activeBills: 2,
    lastMeeting: '2026-03-26',
    nextMeeting: '2026-04-04',
    description: 'Oversees digital policy, telecommunications regulation, and emerging technology legislation.',
  },
  {
    id: 'committee-public-accounts',
    name: 'Public Accounts Committee',
    nameNepali: 'सार्वजनिक लेखा समिति',
    chamber: 'HOR',
    chair: 'Biraj Bhakta Shrestha',
    members: ['biraj-shrestha', 'balendra-shah'],
    activeBills: 0,
    lastMeeting: '2026-03-25',
    nextMeeting: '2026-04-05',
    description: 'Audits government expenditure and reviews Auditor-General\'s reports.',
  },
]

// ─── Ministers ────────────────────────────────────────────────────────────────

export const MOCK_MINISTERS: Minister[] = [
  {
    id: 'minister-001',
    name: 'Swarnim Wagle',
    nameNepali: 'स्वर्णिम वाग्ले',
    ministry: 'Ministry of Finance',
    party: 'RSP',
    appointedDate: '2026-03-27',
    attendance: 97,
    pressReleases: 8,
    budgetUtilization: 12,
    score: 88,
    alerts: 0,
    email: 's.wagle@mof.gov.np',
    pledges: [
      { id: 'p1', title: 'Release FY 2082/83 Budget within 60 days', status: 'in_progress', dueDate: '2026-05-26' },
      { id: 'p2', title: 'Reduce public debt-to-GDP ratio to below 42%', status: 'in_progress', dueDate: '2026-12-31' },
      { id: 'p3', title: 'Launch Investment One-Stop Portal', status: 'completed', completedDate: '2026-03-30' },
    ],
  },
  {
    id: 'minister-002',
    name: 'Rabi Lamichhane',
    nameNepali: 'रवि लामिछाने',
    ministry: 'Ministry of Home Affairs',
    party: 'RSP',
    appointedDate: '2026-03-27',
    attendance: 91,
    pressReleases: 12,
    budgetUtilization: 8,
    score: 79,
    alerts: 1,
    email: 'r.lamichhane@moha.gov.np',
    pledges: [
      { id: 'p4', title: 'Submit Cooperative Scandal final report', status: 'pending', dueDate: '2026-04-30' },
      { id: 'p5', title: 'Reduce crime rate by 20%', status: 'in_progress', dueDate: '2026-12-31' },
      { id: 'p6', title: 'Reform Nepal Police Act', status: 'in_progress', dueDate: '2026-06-30' },
    ],
  },
  {
    id: 'minister-003',
    name: 'Shishir Khanal',
    nameNepali: 'शिशिर खनाल',
    ministry: 'Ministry of Information and Communication Technology',
    party: 'RSP',
    appointedDate: '2026-03-27',
    attendance: 94,
    pressReleases: 15,
    budgetUtilization: 22,
    score: 92,
    alerts: 0,
    email: 's.khanal@mocit.gov.np',
    pledges: [
      { id: 'p7', title: 'Launch National Digital ID for 5M citizens by June', status: 'in_progress', dueDate: '2026-06-30' },
      { id: 'p8', title: 'Establish 3 AI Excellence Centres', status: 'in_progress', dueDate: '2026-09-30' },
      { id: 'p9', title: 'Achieve 70% broadband penetration', status: 'in_progress', dueDate: '2026-12-31' },
      { id: 'p10', title: 'Enable e-filing for all government services', status: 'completed', completedDate: '2026-03-28' },
    ],
  },
]

// ─── Alerts ───────────────────────────────────────────────────────────────────

export const MOCK_ALERTS = [
  {
    id: 'alert-001',
    priority: 'critical' as const,
    ministry: 'Ministry of Finance',
    title: 'Budget submission 48hrs overdue — Finance Minister',
    description: 'Finance Minister failed to submit Q3 budget documentation by the constitutional deadline of Kartik 15. Automatic escalation triggered to PM Secretariat.',
    date: '2026-03-28T09:00:00Z',
    source: 'parliament.gov.np',
  },
  {
    id: 'alert-002',
    priority: 'high' as const,
    ministry: 'Prime Minister\'s Office',
    title: 'PM Balendra Shah missed 3 consecutive parliamentary sessions',
    description: 'Tracking constitutional adherence — threshold at 88%. Quorum violation impact being assessed. No official statement issued.',
    date: '2026-03-27T14:00:00Z',
    source: 'parliament.gov.np',
  },
  {
    id: 'alert-003',
    priority: 'low' as const,
    ministry: 'Ministry of ICT',
    title: 'Digital Nepal Framework Act passed Third Reading',
    description: '182 votes in favour, 42 against. Deployment of implementation monitors scheduled for 2082/04/01. Major RSP election promise fulfilled.',
    date: '2026-03-26T16:30:00Z',
    source: 'parliament.gov.np',
  },
  {
    id: 'alert-004',
    priority: 'high' as const,
    ministry: 'Ministry of Home Affairs',
    title: 'CIAA investigation opened into land acquisition irregularities',
    description: 'Commission for Investigation of Abuse of Authority opened case into alleged land grabs in Pokhara Metropolitan area linked to RSP infrastructure pledges.',
    date: '2026-03-25T11:00:00Z',
    source: 'ciaa.gov.np',
  },
  {
    id: 'alert-005',
    priority: 'low' as const,
    ministry: 'National Assembly',
    title: 'Budget 2083/84 approved — Rs. 1.79 trillion',
    description: '175 Ayes, 42 Nays. Highest infrastructure allocation in Nepal\'s history. Includes Rs. 240 billion for Melamchi Phase 2 and Kathmandu metro rail.',
    date: '2026-03-24T15:00:00Z',
    source: 'mof.gov.np',
  },
]

// ─── Activities ───────────────────────────────────────────────────────────────

export const MOCK_ACTIVITIES: Activity[] = [
  {
    id: 'act-001',
    type: 'bill_introduced',
    title: 'Political Party Student Union Prohibition Bill introduced',
    description: 'RSP government tabled legislation banning political student unions from all educational institutions.',
    ministry: 'Ministry of Education',
    date: '2026-03-30T09:00:00Z',
    priority: 'high',
  },
  {
    id: 'act-002',
    type: 'vote_held',
    title: 'Provincial Powers Bill FAILED in floor vote',
    description: '18 RSP rebels joined opposition to defeat the Provincial Powers Delimitation Bill 134-121.',
    date: '2026-03-29T16:30:00Z',
    priority: 'high',
    relatedBillId: 'bill-2082-008',
  },
  {
    id: 'act-003',
    type: 'bill_passed',
    title: 'Investment Promotion Act passed',
    description: 'Foreign investment fast-track bill passed 198-61. Enables 100% FDI in tech sector effective immediately.',
    date: '2026-03-27T14:00:00Z',
    priority: 'medium',
    relatedBillId: 'bill-2082-004',
  },
  {
    id: 'act-004',
    type: 'minister_action',
    title: 'Finance Minister releases 100-point roadmap progress report',
    description: 'Swarnim Wagle published first monthly governance roadmap progress update, reporting 12 of 100 points completed.',
    ministry: 'Ministry of Finance',
    date: '2026-03-28T11:00:00Z',
    priority: 'medium',
  },
  {
    id: 'act-005',
    type: 'gazette_notice',
    title: 'Nepal Gazette: IT Ordinance full implementation notified',
    description: 'Official gazette notification activating all provisions of IT/ICT Ordinance including 100% FDI in tech.',
    date: '2026-03-26T08:00:00Z',
    priority: 'medium',
  },
  {
    id: 'act-006',
    type: 'committee_meeting',
    title: 'Finance Committee emergency session on Digital Nepal Bill',
    description: 'Finance Committee called emergency session after concerns raised about surveillance provisions in Digital Nepal Framework Act.',
    date: '2026-03-25T10:00:00Z',
    priority: 'high',
  },
  {
    id: 'act-007',
    type: 'statement',
    title: 'PM Balendra Shah: Zero tolerance on corruption from Day 1',
    description: 'Prime Minister addressed parliament pledging immediate action on all pending corruption cases including Cooperative Scandal.',
    date: '2026-03-27T12:00:00Z',
    priority: 'medium',
  },
  {
    id: 'act-008',
    type: 'bill_passed',
    title: 'National Health Insurance Expansion passed with broad support',
    description: 'Health insurance expansion bill passed 241-22 with rare cross-party support.',
    date: '2026-03-25T15:00:00Z',
    priority: 'low',
    relatedBillId: 'bill-2082-007',
  },
]

// ─── Misconduct ───────────────────────────────────────────────────────────────

export const MOCK_MISCONDUCT: MisconductRecord[] = [
  {
    id: 'misc-001',
    mpId: 'kp-sharma-oli',
    name: 'K.P. Sharma Oli',
    allegation: 'Social media suppression ordinance during Gen-Z protests',
    status: 'under_investigation',
    dateReported: '2025-09-15',
    source: 'Commission for the Investigation of Abuse of Authority',
    description: 'CIAA investigating former PM Oli\'s role in ordering social media ban during the Gen-Z protests that led to 19 student deaths in September 2025.',
    severity: 'high',
  },
  {
    id: 'misc-002',
    mpId: 'rabi-lamichhane',
    name: 'Rabi Lamichhane',
    allegation: 'Cooperative Sector Financial Scandal',
    status: 'under_investigation',
    dateReported: '2024-08-01',
    source: 'Supreme Court',
    description: 'Supreme Court investigation into alleged diversion of cooperative depositor funds. Lamichhane previously resigned as Home Minister in 2023 over this case. Returned to politics after acquittal on procedural grounds.',
    severity: 'high',
  },
  {
    id: 'misc-003',
    name: 'Former Education Ministry Officials',
    allegation: 'Textbook Procurement Irregularities',
    status: 'convicted',
    dateReported: '2025-02-10',
    source: 'Special Court',
    description: 'Three former education ministry officials convicted for NPR 2.3 billion irregular procurement of school textbooks. Sentenced to 7 years each.',
    severity: 'high',
  },
]

// ─── Social Posts ─────────────────────────────────────────────────────────────

export const MOCK_SOCIAL_POSTS: SocialPost[] = [
  {
    id: 'post-001',
    platform: 'reddit',
    content: '🚨 **BILL ALERT**: Digital Nepal Framework Act heads to floor vote tomorrow. Key concern: National Digital ID surveillance provisions. Read our AI analysis. #NepalPolitics',
    relatedBillId: 'bill-2082-002',
    postedAt: '2026-03-29T08:00:00Z',
    subreddit: 'Nepal',
    upvotes: 847,
    comments: 142,
    url: 'https://reddit.com/r/Nepal/comments/mock001',
    status: 'mock',
  },
  {
    id: 'post-002',
    platform: 'twitter',
    content: '🗳️ VOTE RESULT: Investment Promotion Act PASSED 198-61 in Nepal\'s House of Representatives. Enables 100% FDI in tech sector. #NepalEconomy #RSP #NepalParliament',
    relatedBillId: 'bill-2082-004',
    postedAt: '2026-03-27T14:30:00Z',
    likes: 2341,
    retweets: 891,
    url: 'https://x.com/mock_nepalmonitor/status/mock002',
    status: 'mock',
  },
  {
    id: 'post-003',
    platform: 'reddit',
    content: '⚠️ 18 RSP rebels defeat Provincial Powers Bill — biggest internal split in Balendra Shah\'s first week as PM. Thread inside. #NepalPolitics #RSP',
    relatedBillId: 'bill-2082-008',
    postedAt: '2026-03-29T17:00:00Z',
    subreddit: 'NepalPolitics',
    upvotes: 1204,
    comments: 318,
    url: 'https://reddit.com/r/NepalPolitics/comments/mock003',
    status: 'mock',
  },
]

// ─── Dashboard Stats ──────────────────────────────────────────────────────────

export const MOCK_STATS: DashboardStats = {
  billsTracked: 8,
  highPriorityAlerts: 4,
  ministersMonitored: 17,
  mpsMonitored: 275,
  postsPublished: 3,
  scrapingSuccessRate: 94,
  lastUpdated: new Date().toISOString(),
}

// ─── Scraping Jobs ────────────────────────────────────────────────────────────

export const MOCK_SCRAPING_JOBS: ScrapingJob[] = [
  { name: 'Parliament Website', url: 'parliament.gov.np', status: 'operational', lastRun: '2026-03-30T12:00:00Z', nextRun: '2026-03-30T18:00:00Z', itemsFound: 12 },
  { name: 'Nepal Gazette', url: 'lawcommission.gov.np', status: 'operational', lastRun: '2026-03-30T10:00:00Z', nextRun: '2026-03-31T10:00:00Z', itemsFound: 3 },
  { name: 'Ministry Websites (17)', url: 'Various', status: 'operational', lastRun: '2026-03-30T08:00:00Z', nextRun: '2026-03-30T20:00:00Z', itemsFound: 27 },
  { name: 'Election Commission', url: 'election.gov.np', status: 'warning', lastRun: '2026-03-30T06:00:00Z', nextRun: '2026-03-31T06:00:00Z', itemsFound: 0 },
  { name: 'Anti-Corruption Comm.', url: 'ciaa.gov.np', status: 'operational', lastRun: '2026-03-30T09:00:00Z', nextRun: '2026-03-31T09:00:00Z', itemsFound: 2 },
  { name: 'Supreme Court', url: 'supremecourt.gov.np', status: 'operational', lastRun: '2026-03-30T07:00:00Z', nextRun: '2026-03-31T07:00:00Z', itemsFound: 5 },
]

// ─── REAL MPs — From hr.parliament.gov.np (Official PDF) ────────────────────
// Source: https://hr.parliament.gov.np/uploads/attachments/rtqjv3jficmlxw0f.pdf
// 2083 B.S. Parliament — Pratinidhi Sabha

export interface RealMP {
  seatNo: number
  nameNe: string
  nameEn: string
  district: string
  constituencyNo?: string
  party: string
  partyShort: 'RSP' | 'NC' | 'UML' | 'NCP' | 'Other'
  gender: 'Male' | 'Female'
  electionType: 'FPTP' | 'PR'
  quota?: string
  province: string
  attendance: number
}

export const REAL_MPs: RealMP[] = [
  // Province 1 / Koshi — FPTP
  { seatNo:1,  nameNe:'नरेन्द्र कुमार केरुङ',  nameEn:'Narendra Kumar Kerung',   district:'पाँचथर',    constituencyNo:'1', party:'नेपाली काँग्रेस',                 partyShort:'NC',  gender:'Male',   electionType:'FPTP', province:'Koshi',        attendance: 82 },
  { seatNo:2,  nameNe:'सनिश्कल राई',            nameEn:'Sanishkal Rai',            district:'इलाम',      constituencyNo:'1', party:'नेपाली काँग्रेस',                 partyShort:'NC',  gender:'Male',   electionType:'FPTP', province:'Koshi',        attendance: 74 },
  { seatNo:3,  nameNe:'प्रकाश पाठक',            nameEn:'Prakash Pathak',           district:'झापा',      constituencyNo:'3', party:'राष्ट्रिय स्वतन्त्र पार्टी',     partyShort:'RSP', gender:'Male',   electionType:'FPTP', province:'Province 1',   attendance: 76 },
  { seatNo:4,  nameNe:'शम्भु प्रसाद ढकाल',      nameEn:'Shambhu Prasad Dhakal',    district:'झापा',      constituencyNo:'4', party:'राष्ट्रिय स्वतन्त्र पार्टी',     partyShort:'RSP', gender:'Male',   electionType:'FPTP', province:'Province 1',   attendance: 78 },
  { seatNo:5,  nameNe:'बालेन्द्र शाह',           nameEn:'Balendra Shah',            district:'काठमाडौं',  constituencyNo:'1', party:'राष्ट्रिय स्वतन्त्र पार्टी',     partyShort:'RSP', gender:'Male',   electionType:'FPTP', province:'Bagmati',      attendance: 91 },
  { seatNo:6,  nameNe:'संतोष सुब्बा',            nameEn:'Santosh Subba',            district:'तेह्रथुम',  constituencyNo:'1', party:'नेपाली काँग्रेस',                 partyShort:'NC',  gender:'Male',   electionType:'FPTP', province:'Koshi',        attendance: 84 },
  { seatNo:7,  nameNe:'ध्रुवराज राई',            nameEn:'Dhrubaraj Rai',            district:'भोजपुर',    constituencyNo:'1', party:'स्वतन्त्र',                       partyShort:'Other',gender:'Male',   electionType:'FPTP', province:'Koshi',        attendance: 72 },
  { seatNo:8,  nameNe:'यज्ञमणि न्यौपाने',        nameEn:'Yagya Mani Neupane',       district:'मोरङ',      constituencyNo:'1', party:'राष्ट्रिय स्वतन्त्र पार्टी',     partyShort:'RSP', gender:'Male',   electionType:'FPTP', province:'Koshi',        attendance: 77 },
  { seatNo:9,  nameNe:'कृष्ण कुमार काकी',        nameEn:'Krishna Kumar Kaki',       district:'मोरङ',      constituencyNo:'2', party:'राष्ट्रिय स्वतन्त्र पार्टी',     partyShort:'RSP', gender:'Male',   electionType:'FPTP', province:'Koshi',        attendance: 72 },
  { seatNo:10, nameNe:'गणेश काकी',               nameEn:'Ganesh Kaki',              district:'मोरङ',      constituencyNo:'3', party:'राष्ट्रिय स्वतन्त्र पार्टी',     partyShort:'RSP', gender:'Male',   electionType:'FPTP', province:'Koshi',        attendance: 79 },
  { seatNo:11, nameNe:'संतोष राजवंशी',           nameEn:'Santosh Rajwanshi',        district:'मोरङ',      constituencyNo:'4', party:'राष्ट्रिय स्वतन्त्र पार्टी',     partyShort:'RSP', gender:'Male',   electionType:'FPTP', province:'Koshi',        attendance: 83 },
  { seatNo:12, nameNe:'हाका राज राई',             nameEn:'Haka Raj Rai',             district:'सुनसरी',    constituencyNo:'1', party:'स्वतन्त्र',                       partyShort:'Other',gender:'Male',   electionType:'FPTP', province:'Koshi',        attendance: 84 },
  { seatNo:13, nameNe:'लाल विक्रम थापा',          nameEn:'Lal Bikram Thapa',         district:'सुनसरी',    constituencyNo:'2', party:'राष्ट्रिय स्वतन्त्र पार्टी',     partyShort:'RSP', gender:'Male',   electionType:'FPTP', province:'Koshi',        attendance: 77 },
  { seatNo:14, nameNe:'अशोक कुमार',               nameEn:'Ashok Kumar',              district:'सुनसरी',    constituencyNo:'3', party:'राष्ट्रिय स्वतन्त्र पार्टी',     partyShort:'RSP', gender:'Male',   electionType:'FPTP', province:'Koshi',        attendance: 89 },
  { seatNo:15, nameNe:'दीपक कुमार साह',           nameEn:'Deepak Kumar Sah',         district:'सुनसरी',    constituencyNo:'4', party:'राष्ट्रिय स्वतन्त्र पार्टी',     partyShort:'RSP', gender:'Male',   electionType:'FPTP', province:'Koshi',        attendance: 76 },
  // Madhesh Province
  { seatNo:21, nameNe:'रामजी यादव',               nameEn:'Ramji Yadav',              district:'सप्तरी',    constituencyNo:'2', party:'राष्ट्रिय स्वतन्त्र पार्टी',     partyShort:'RSP', gender:'Male',   electionType:'FPTP', province:'Madhesh',      attendance: 75 },
  { seatNo:22, nameNe:'अमर कान्त चौधरी',          nameEn:'Amar Kant Chaudhary',      district:'सप्तरी',    constituencyNo:'3', party:'राष्ट्रिय स्वतन्त्र पार्टी',     partyShort:'RSP', gender:'Male',   electionType:'FPTP', province:'Madhesh',      attendance: 81 },
  { seatNo:24, nameNe:'बबलु गुप्ता',               nameEn:'Bablu Gupta',              district:'सिराहा',    constituencyNo:'1', party:'राष्ट्रिय स्वतन्त्र पार्टी',     partyShort:'RSP', gender:'Male',   electionType:'FPTP', province:'Madhesh',      attendance: 85 },
  { seatNo:25, nameNe:'जय शंकर यादव',              nameEn:'Jay Shankar Yadav',        district:'सिराहा',    constituencyNo:'2', party:'राष्ट्रिय स्वतन्त्र पार्टी',     partyShort:'RSP', gender:'Male',   electionType:'FPTP', province:'Madhesh',      attendance: 76 },
  { seatNo:28, nameNe:'मातृका प्रसाद यादव',        nameEn:'Matrika Prasad Yadav',     district:'धनुषा',     constituencyNo:'1', party:'नेपाल कम्युनिस्ट पार्टी (एमाले)',partyShort:'UML', gender:'Male',   electionType:'FPTP', province:'Madhesh',      attendance: 75 },
  { seatNo:29, nameNe:'राम विनोद यादव',            nameEn:'Ram Vinod Yadav',          district:'धनुषा',     constituencyNo:'2', party:'राष्ट्रिय स्वतन्त्र पार्टी',     partyShort:'RSP', gender:'Male',   electionType:'FPTP', province:'Madhesh',      attendance: 82 },
  { seatNo:32, nameNe:'प्रमोद कुमार महतो',         nameEn:'Pramod Kumar Mahato',      district:'महोत्तरी',  constituencyNo:'1', party:'राष्ट्रिय स्वतन्त्र पार्टी',     partyShort:'RSP', gender:'Male',   electionType:'FPTP', province:'Madhesh',      attendance: 71 },
  // Bagmati Province
  { seatNo:60, nameNe:'श्वेता मलकर',              nameEn:'Shweta Malakar',           district:'काठमाडौं',  constituencyNo:'2', party:'राष्ट्रिय स्वतन्त्र पार्टी',     partyShort:'RSP', gender:'Female', electionType:'FPTP', province:'Bagmati',      attendance: 88 },
  { seatNo:61, nameNe:'ऋषिराम पौडेल',             nameEn:'Rishiram Paudel',          district:'काठमाडौं',  constituencyNo:'3', party:'राष्ट्रिय स्वतन्त्र पार्टी',     partyShort:'RSP', gender:'Male',   electionType:'FPTP', province:'Bagmati',      attendance: 79 },
  { seatNo:62, nameNe:'अञ्जिला शिन्धे',            nameEn:'Anjila Shindhe',           district:'काठमाडौं',  constituencyNo:'4', party:'राष्ट्रिय स्वतन्त्र पार्टी',     partyShort:'RSP', gender:'Female', electionType:'FPTP', province:'Bagmati',      attendance: 82 },
  { seatNo:63, nameNe:'रेखा शर्मा',                nameEn:'Rekha Sharma',             district:'काठमाडौं',  constituencyNo:'5', party:'राष्ट्रिय स्वतन्त्र पार्टी',     partyShort:'RSP', gender:'Female', electionType:'FPTP', province:'Bagmati',      attendance: 85 },
  { seatNo:64, nameNe:'रसना खड्का',                nameEn:'Rasana Khadka',            district:'काठमाडौं',  constituencyNo:'6', party:'राष्ट्रिय स्वतन्त्र पार्टी',     partyShort:'RSP', gender:'Female', electionType:'FPTP', province:'Bagmati',      attendance: 77 },
  // Gandaki Province
  { seatNo:90, nameNe:'कृष्ण चन्द्र नेपाली',      nameEn:'Krishna Chandra Nepali',   district:'कास्की',    constituencyNo:'1', party:'राष्ट्रिय स्वतन्त्र पार्टी',     partyShort:'RSP', gender:'Male',   electionType:'FPTP', province:'Gandaki',      attendance: 81 },
  { seatNo:91, nameNe:'किरण पौडेल',                nameEn:'Kiran Paudel',             district:'कास्की',    constituencyNo:'2', party:'राष्ट्रिय स्वतन्त्र पार्टी',     partyShort:'RSP', gender:'Male',   electionType:'FPTP', province:'Gandaki',      attendance: 73 },
  // Lumbini Province
  { seatNo:110,nameNe:'देव लाल लोधा',              nameEn:'Dev Lal Lodha',            district:'रुपन्देही',  constituencyNo:'1', party:'राष्ट्रिय स्वतन्त्र पार्टी',     partyShort:'RSP', gender:'Male',   electionType:'FPTP', province:'Lumbini',      attendance: 78 },
  { seatNo:111,nameNe:'दिलराज भट्ट',               nameEn:'Dilraj Bhatt',             district:'बाँके',     constituencyNo:'1', party:'राष्ट्रिय स्वतन्त्र पार्टी',     partyShort:'RSP', gender:'Male',   electionType:'FPTP', province:'Lumbini',      attendance: 80 },
  // Karnali Province
  { seatNo:140,nameNe:'जनक बहादुर शाही',           nameEn:'Janak Bahadur Shahi',     district:'सुर्खेत',   constituencyNo:'1', party:'राष्ट्रिय स्वतन्त्र पार्टी',     partyShort:'RSP', gender:'Male',   electionType:'FPTP', province:'Karnali',      attendance: 76 },
  // Sudurpashchim Province
  { seatNo:155,nameNe:'कोमल ज्ञवाली',              nameEn:'Komal Gyawali',            district:'कैलाली',    constituencyNo:'1', party:'राष्ट्रिय स्वतन्त्र पार्टी',     partyShort:'RSP', gender:'Female', electionType:'FPTP', province:'Sudurpashchim',attendance: 79 },
  { seatNo:156,nameNe:'के पी खनाल',                nameEn:'KP Khanal',                district:'कैलाली',    constituencyNo:'2', party:'राष्ट्रिय स्वतन्त्र पार्टी',     partyShort:'RSP', gender:'Male',   electionType:'FPTP', province:'Sudurpashchim',attendance: 82 },
  { seatNo:160,nameNe:'गणेश सिंह ठगुन्ना',         nameEn:'Ganesh Singh Thaguna',    district:'दाचुला',    constituencyNo:'1', party:'नेपाल कम्युनिस्ट पार्टी (एमाले)',partyShort:'UML', gender:'Male',   electionType:'FPTP', province:'Sudurpashchim',attendance: 69 },
  { seatNo:161,nameNe:'हरि मोहन भण्डारी',          nameEn:'Hari Mohan Bhandari',      district:'बैतडी',     constituencyNo:'1', party:'राष्ट्रिय स्वतन्त्र पार्टी',     partyShort:'RSP', gender:'Male',   electionType:'FPTP', province:'Sudurpashchim',attendance: 74 },
  { seatNo:163,nameNe:'सनक सिंह धामी',             nameEn:'Sanak Singh Dhami',        district:'कञ्चनपुर',  constituencyNo:'1', party:'राष्ट्रिय स्वतन्त्र पार्टी',     partyShort:'RSP', gender:'Male',   electionType:'FPTP', province:'Sudurpashchim',attendance: 81 },
  { seatNo:164,nameNe:'दीपक राज बोहरा',            nameEn:'Deepak Raj Bohra',         district:'कञ्चनपुर',  constituencyNo:'2', party:'राष्ट्रिय स्वतन्त्र पार्टी',     partyShort:'RSP', gender:'Male',   electionType:'FPTP', province:'Sudurpashchim',attendance: 77 },
  { seatNo:165,nameNe:'ज्ञानेन्द्र सिंह महरा',     nameEn:'Gyanendra Singh Mahra',    district:'कञ्चनपुर',  constituencyNo:'3', party:'राष्ट्रिय स्वतन्त्र पार्टी',     partyShort:'RSP', gender:'Male',   electionType:'FPTP', province:'Sudurpashchim',attendance: 83 },
  // PR — RSP
  { seatNo:166,nameNe:'राम लामा',                  nameEn:'Ram Lama',                 district:'काभ्रेपलाञ्चोक', party:'राष्ट्रिय स्वतन्त्र पार्टी',              partyShort:'RSP', gender:'Male',   electionType:'PR',   quota:'Indigenous', province:'Bagmati',      attendance: 71 },
  { seatNo:169,nameNe:'बसुमाया सामाङ',             nameEn:'Basumaya Tamang',          district:'काठमाडौँ',  party:'राष्ट्रिय स्वतन्त्र पार्टी',                 partyShort:'RSP', gender:'Female', electionType:'PR',   quota:'Indigenous', province:'Bagmati',      attendance: 68 },
  { seatNo:182,nameNe:'रमेश प्रसाई',               nameEn:'Ramesh Prasai',            district:'साप्लेसुङ', party:'राष्ट्रिय स्वतन्त्र पार्टी',                 partyShort:'RSP', gender:'Male',   electionType:'PR',   quota:'Khas Arya',  province:'Province 1',   attendance: 75 },
  { seatNo:185,nameNe:'सलमा अधिकारी',              nameEn:'Salma Adhikari',           district:'काठमाडौँ',  party:'राष्ट्रिय स्वतन्त्र पार्टी',                 partyShort:'RSP', gender:'Female', electionType:'PR',   quota:'Khas Arya',  province:'Bagmati',      attendance: 80 },
  // NC PR seats
  { seatNo:223,nameNe:'भीष्मराज आङ्देम्बे',        nameEn:'Bhishmaraj Angdembe',      district:'पाँचथर',    party:'नेपाली काँग्रेस',                             partyShort:'NC',  gender:'Male',   electionType:'PR',   quota:'Indigenous', province:'Koshi',        attendance: 73 },
  { seatNo:224,nameNe:'मदन कृष्ण श्रेष्ठ',         nameEn:'Madan Krishna Shrestha',   district:'भक्तपुर',   party:'नेपाली काँग्रेस',                             partyShort:'NC',  gender:'Male',   electionType:'PR',   quota:'Indigenous', province:'Bagmati',      attendance: 77 },
  { seatNo:229,nameNe:'अर्जुनसिंह के.सी.',          nameEn:'Arjunsingh K.C.',          district:'नुवाकोट',   party:'नेपाली काँग्रेस',                             partyShort:'NC',  gender:'Male',   electionType:'PR',   quota:'Khas Arya',  province:'Bagmati',      attendance: 81 },
  { seatNo:239,nameNe:'चन्द्र मोहन यादव',           nameEn:'Chandra Mohan Yadav',      district:'धनुषा',     party:'नेपाली काँग्रेस',                             partyShort:'NC',  gender:'Male',   electionType:'PR',   quota:'Madheshi',   province:'Madhesh',      attendance: 69 },
  // UML PR seats
  { seatNo:243,nameNe:'भूमिका लिम्बु सुब्बा',      nameEn:'Bhumika Limbu Subba',      district:'काठमाडौँ',  party:'नेपाल कम्युनिस्ट पार्टी (एमाले)',             partyShort:'UML', gender:'Female', electionType:'PR',   quota:'Indigenous', province:'Bagmati',      attendance: 72 },
  { seatNo:245,nameNe:'रामबहादुर थापा मगर',        nameEn:'Rambahadur Thapa Magar',   district:'चितवन',     party:'नेपाल कम्युनिस्ट पार्टी (एमाले)',             partyShort:'UML', gender:'Male',   electionType:'PR',   quota:'Indigenous', province:'Bagmati',      attendance: 70 },
  { seatNo:260,nameNe:'प्रमेश कुमार हमाल',         nameEn:'Pramesh Kumar Hamal',      district:'काठमाडौँ',  party:'नेपाली कम्युनिस्ट पार्टी',                   partyShort:'NCP', gender:'Male',   electionType:'PR',   quota:'Khas Arya',  province:'Bagmati',      attendance: 68 },
  // Other parties
  { seatNo:268,nameNe:'पूर्ण प्रसाद लिम्बु',       nameEn:'Purna Prasad Limbu',       district:'संखुवासभा', party:'श्रम संस्कृति पार्टी',                       partyShort:'Other',gender:'Male',   electionType:'PR',   quota:'Indigenous', province:'Koshi',        attendance: 60 },
  { seatNo:272,nameNe:'सरस्वती लामा',              nameEn:'Saraswati Lama',           district:'धादिङ',     party:'राष्ट्रिय प्रजातन्त्र पार्टी',               partyShort:'Other',gender:'Female', electionType:'PR',   province:'Bagmati',      attendance: 65 },
  { seatNo:273,nameNe:'भरत गिरी',                  nameEn:'Bharat Giri',              district:'महोत्तरी',  party:'राष्ट्रिय प्रजातन्त्र पार्टी',               partyShort:'Other',gender:'Male',   electionType:'PR',   quota:'Khas Arya',  province:'Madhesh',      attendance: 70 },
  { seatNo:275,nameNe:'साहिर अली भाट',             nameEn:'Sahir Ali Bhat',           district:'रुपन्देही', party:'राष्ट्रिय प्रजातन्त्र पार्टी',               partyShort:'Other',gender:'Male',   electionType:'PR',   quota:'Muslim',     province:'Lumbini',      attendance: 63 },
]

export const PARTY_SEATS = {
  RSP:   182,
  NC:    46,
  UML:   29,
  Other: 18,
  TOTAL: 275,
}

export const PROVINCE_SEATS: Record<string,number> = {
  'Koshi':         28,
  'Madhesh':       32,
  'Bagmati':       44,
  'Gandaki':       25,
  'Lumbini':       38,
  'Karnali':       16,
  'Sudurpashchim': 22,
  'PR (Nationwide)': 70,
}
