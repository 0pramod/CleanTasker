export const contractors = [
  { id: "c1", name: "ABC Cleaning Services", contact: "Brian Holmes", phone: "123-456-6995", sites: 3, workers: 12, score: 95, status: "Active", risk: 12, missing: 0, expiring: 2, expired: 0, lastInspection: 92, onTime: 94 },
  { id: "c2", name: "ARM Facility Services", contact: "Dave Wilson", phone: "524-335-8895", sites: 2, workers: 10, score: 86, status: "Active", risk: 28, missing: 1, expiring: 3, expired: 0, lastInspection: 85, onTime: 88 },
  { id: "c3", name: "CleanWave Partners", contact: "Sarah Carter", phone: "193-430-3929", sites: 4, workers: 6, score: 75, status: "Active", risk: 46, missing: 2, expiring: 1, expired: 1, lastInspection: 78, onTime: 80 },
  { id: "c4", name: "Sparkle Bright Cleaning", contact: "Jason Kim", phone: "102-967-2402", sites: 1, workers: 13, score: 60, status: "Expiring", risk: 71, missing: 3, expiring: 4, expired: 2, lastInspection: 66, onTime: 74 },
  { id: "c5", name: "Bright Shine Cleaners", contact: "Alan Foster", phone: "253-539-9042", sites: 0, workers: 9, score: 40, status: "Expired", risk: 88, missing: 5, expiring: 0, expired: 4, lastInspection: 55, onTime: 62 },
];

export const workforceDocs = [
  { contractor: "ABC Cleaning Services", document: "Public Liability Insurance", expiry: "Apr 16, 2026", days: 16, docStatus: "Valid", overall: "Verified" },
  { contractor: "ABC Cleaning Services", document: "Insurance Policy", expiry: "Apr 27, 2026", days: 27, docStatus: "Valid", overall: "Verified" },
  { contractor: "ABC Cleaning Services", document: "Induction Insurance", expiry: "Mar 02, 2026", days: 6, docStatus: "Expiring", overall: "Expired" },
  { contractor: "ARM Facility Services", document: "WWCC Clearance", expiry: "Mar 05, 2026", days: 9, docStatus: "Pending", overall: "Expired" },
  { contractor: "CleanWave Partners", document: "Police Check", expiry: "Mar 01, 2026", days: 5, docStatus: "Expiring", overall: "Expired" },
  { contractor: "Sparkle Bright Cleaning", document: "Public Liability Insurance", expiry: "Feb 26, 2026", days: 2, docStatus: "Expiring", overall: "Expired" },
];

export const verificationRows = [
  { worker: "John Carter", contractor: "ABC Cleaning Services", site: "Central Plaza", check: "ID Verified", status: "Verified" },
  { worker: "Sophie Patel", contractor: "ARM Facility Services", site: "Greenwood Mall", check: "Police Check", status: "Pending" },
  { worker: "Alex Chen", contractor: "CleanWave Partners", site: "Riverside", check: "Induction", status: "Missing" },
];

export const contractorSites = [
  { site: "Central Plaza", workers: 5, attendance: 96, completion: 93 },
  { site: "Greenwood Mall", workers: 4, attendance: 91, completion: 88 },
  { site: "Riverside", workers: 3, attendance: 89, completion: 86 },
];

export const inspections = [
  { date: "Oct", score: 78 },
  { date: "Nov", score: 80 },
  { date: "Dec", score: 76 },
  { date: "Jan", score: 82 },
  { date: "Feb", score: 85 },
  { date: "Mar", score: 83 },
];

export const platformComplianceTrend = [
  { month: "Oct", score: 82 },
  { month: "Nov", score: 84 },
  { month: "Dec", score: 79 },
  { month: "Jan", score: 88 },
  { month: "Feb", score: 91 },
  { month: "Mar", score: 89 },
];

export const slaTrend = [
  { week: "W1", onTime: 90, late: 10 },
  { week: "W2", onTime: 88, late: 12 },
  { week: "W3", onTime: 92, late: 8 },
  { week: "W4", onTime: 87, late: 13 },
  { week: "W5", onTime: 93, late: 7 },
  { week: "W6", onTime: 91, late: 9 },
];


export const jobs = [
  // contractor, site, status, start/end durations (minutes)
  { id: "j1", contractorId: "c1", contractor: "ABC Cleaning Services", site: "Central Plaza", status: "Completed", delayed: false, durationMin: 55, rating: 4.6, week: "W1" },
  { id: "j2", contractorId: "c1", contractor: "ABC Cleaning Services", site: "Central Plaza", status: "Completed", delayed: false, durationMin: 48, rating: 4.7, week: "W1" },
  { id: "j3", contractorId: "c1", contractor: "ABC Cleaning Services", site: "Riverside", status: "Completed", delayed: true, durationMin: 72, rating: 4.3, week: "W2" },
  { id: "j4", contractorId: "c2", contractor: "ARM Facility Services", site: "Greenwood Mall", status: "Completed", delayed: false, durationMin: 62, rating: 4.2, week: "W1" },
  { id: "j5", contractorId: "c2", contractor: "ARM Facility Services", site: "Greenwood Mall", status: "Delayed", delayed: true, durationMin: 85, rating: 3.9, week: "W2" },
  { id: "j6", contractorId: "c2", contractor: "ARM Facility Services", site: "Greenwood Mall", status: "Completed", delayed: false, durationMin: 58, rating: 4.1, week: "W3" },
  { id: "j7", contractorId: "c3", contractor: "CleanWave Partners", site: "Riverside", status: "Completed", delayed: true, durationMin: 90, rating: 3.8, week: "W2" },
  { id: "j8", contractorId: "c3", contractor: "CleanWave Partners", site: "Riverside", status: "Delayed", delayed: true, durationMin: 110, rating: 3.4, week: "W3" },
  { id: "j9", contractorId: "c3", contractor: "CleanWave Partners", site: "Central Plaza", status: "Completed", delayed: false, durationMin: 64, rating: 3.9, week: "W4" },
  { id: "j10", contractorId: "c4", contractor: "Sparkle Bright Cleaning", site: "Greenwood Mall", status: "Delayed", delayed: true, durationMin: 120, rating: 3.2, week: "W4" },
  { id: "j11", contractorId: "c4", contractor: "Sparkle Bright Cleaning", site: "Greenwood Mall", status: "Completed", delayed: true, durationMin: 98, rating: 3.5, week: "W5" },
  { id: "j12", contractorId: "c5", contractor: "Bright Shine Cleaners", site: "Riverside", status: "Delayed", delayed: true, durationMin: 140, rating: 2.9, week: "W5" },
  { id: "j13", contractorId: "c1", contractor: "ABC Cleaning Services", site: "Central Plaza", status: "Completed", delayed: false, durationMin: 52, rating: 4.8, week: "W3" },
  { id: "j14", contractorId: "c1", contractor: "ABC Cleaning Services", site: "Central Plaza", status: "Completed", delayed: false, durationMin: 49, rating: 4.7, week: "W4" },
  { id: "j15", contractorId: "c2", contractor: "ARM Facility Services", site: "Greenwood Mall", status: "Completed", delayed: false, durationMin: 60, rating: 4.0, week: "W5" },
  { id: "j16", contractorId: "c3", contractor: "CleanWave Partners", site: "Riverside", status: "Completed", delayed: true, durationMin: 88, rating: 3.6, week: "W6" },
  { id: "j17", contractorId: "c4", contractor: "Sparkle Bright Cleaning", site: "Greenwood Mall", status: "Delayed", delayed: true, durationMin: 115, rating: 3.1, week: "W6" },
  { id: "j18", contractorId: "c2", contractor: "ARM Facility Services", site: "Greenwood Mall", status: "Completed", delayed: false, durationMin: 57, rating: 4.2, week: "W6" },
];

export const jobTrend = [
  { week: "W1", total: 3, completed: 3, delayed: 0 },
  { week: "W2", total: 3, completed: 2, delayed: 1 },
  { week: "W3", total: 3, completed: 2, delayed: 1 },
  { week: "W4", total: 3, completed: 2, delayed: 1 },
  { week: "W5", total: 3, completed: 2, delayed: 1 },
  { week: "W6", total: 3, completed: 2, delayed: 1 },
];

