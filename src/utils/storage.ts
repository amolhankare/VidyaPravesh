import { SchoolAssessmentSubmission, AssessmentMonth } from '../types';
import { MAHARASHTRA_DISTRICTS } from '../data/maharashtraData';

const STORAGE_KEY = 'maharashtra_vidya_pravesh_submissions_v1';

// Initial pre-loaded seed submissions to give immediate rich state/district/cluster stats
const INITIAL_SEED_DATA: SchoolAssessmentSubmission[] = [
  {
    id: 'sub-001',
    udiseNo: '27250100101',
    schoolName: 'जिल्हा परिषद प्राथमिक शाळा, खडकवासला',
    schoolType: 'शासकीय',
    district: 'पुणे (Pune)',
    block: 'हवेली (Haveli)',
    cluster: 'खडकवासला केंद्र (Khadakwasla Center)',
    month: 'पहिला महिना',
    boysCount: 18,
    girlsCount: 16,
    totalEnrolment: 34,
    criteriaData: {
      1: { level1: 3, level2: 11, level3: 20 },
      2: { level1: 2, level2: 12, level3: 20 },
      3: { level1: 4, level2: 10, level3: 20 },
      4: { level1: 5, level2: 14, level3: 15 },
      5: { level1: 3, level2: 15, level3: 16 },
      6: { level1: 4, level2: 10, level3: 20 },
      7: { level1: 6, level2: 12, level3: 16 },
      8: { level1: 5, level2: 15, level3: 14 },
    },
    submittedAt: '2026-07-28T10:30:00.000Z',
  },
  {
    id: 'sub-002',
    udiseNo: '27250100102',
    schoolName: 'छत्रपती शिवाजी विद्यालय, उरुळी कांचन',
    schoolType: 'अनुदानित',
    district: 'पुणे (Pune)',
    block: 'हवेली (Haveli)',
    cluster: 'उरुळी कांचन केंद्र (Uruli Kanchan Center)',
    month: 'पहिला महिना',
    boysCount: 22,
    girlsCount: 20,
    totalEnrolment: 42,
    criteriaData: {
      1: { level1: 2, level2: 15, level3: 25 },
      2: { level1: 4, level2: 13, level3: 25 },
      3: { level1: 3, level2: 14, level3: 25 },
      4: { level1: 6, level2: 16, level3: 20 },
      5: { level1: 5, level2: 17, level3: 20 },
      6: { level1: 3, level2: 14, level3: 25 },
      7: { level1: 7, level2: 15, level3: 20 },
      8: { level1: 8, level2: 14, level3: 20 },
    },
    submittedAt: '2026-07-29T11:15:00.000Z',
  },
  {
    id: 'sub-003',
    udiseNo: '27200100201',
    schoolName: 'महानगरपालिका शाळा क्र. १२, पंचवटी',
    schoolType: 'शासकीय',
    district: 'नाशिक (Nashik)',
    block: 'नाशिक (Nashik)',
    cluster: 'पंचवटी केंद्र (Panchavati Center)',
    month: 'पहिला महिना',
    boysCount: 15,
    girlsCount: 15,
    totalEnrolment: 30,
    criteriaData: {
      1: { level1: 3, level2: 10, level3: 17 },
      2: { level1: 2, level2: 10, level3: 18 },
      3: { level1: 4, level2: 11, level3: 15 },
      4: { level1: 5, level2: 12, level3: 13 },
      5: { level1: 4, level2: 11, level3: 15 },
      6: { level1: 3, level2: 10, level3: 17 },
      7: { level1: 5, level2: 12, level3: 13 },
      8: { level1: 6, level2: 11, level3: 13 },
    },
    submittedAt: '2026-07-30T09:20:00.000Z',
  },
  {
    id: 'sub-004',
    udiseNo: '27190100301',
    schoolName: 'जि. प. शाळा, मुकुंदवाडी',
    schoolType: 'शासकीय',
    district: 'छत्रपती संभाजीनगर (Chhatrapati Sambhajinagar)',
    block: 'संभाजीनगर (Sambhajinagar)',
    cluster: 'मुकुंदवाडी केंद्र (Mukundwadi Center)',
    month: 'पहिला महिना',
    boysCount: 20,
    girlsCount: 18,
    totalEnrolment: 38,
    criteriaData: {
      1: { level1: 4, level2: 14, level3: 20 },
      2: { level1: 3, level2: 15, level3: 20 },
      3: { level1: 5, level2: 13, level3: 20 },
      4: { level1: 6, level2: 14, level3: 18 },
      5: { level1: 4, level2: 16, level3: 18 },
      6: { level1: 3, level2: 15, level3: 20 },
      7: { level1: 7, level2: 13, level3: 18 },
      8: { level1: 6, level2: 14, level3: 18 },
    },
    submittedAt: '2026-07-30T14:45:00.000Z',
  },
  {
    id: 'sub-005',
    udiseNo: '27210100401',
    schoolName: 'ठाणे महापालिका शाळा क्र. ५, नौपाडा',
    schoolType: 'शासकीय',
    district: 'ठाणे (Thane)',
    block: 'ठाणे (Thane City)',
    cluster: 'नौपाडा केंद्र (Naupada Center)',
    month: 'पहिला महिना',
    boysCount: 25,
    girlsCount: 23,
    totalEnrolment: 48,
    criteriaData: {
      1: { level1: 3, level2: 15, level3: 30 },
      2: { level1: 4, level2: 14, level3: 30 },
      3: { level1: 5, level2: 15, level3: 28 },
      4: { level1: 6, level2: 17, level3: 25 },
      5: { level1: 4, level2: 18, level3: 26 },
      6: { level1: 3, level2: 15, level3: 30 },
      7: { level1: 8, level2: 16, level3: 24 },
      8: { level1: 7, level2: 17, level3: 24 },
    },
    submittedAt: '2026-07-31T08:10:00.000Z',
  },
];

// Generate crisp, fast sample data across districts to simulate state scale without heavy memory/JSON load
function generateExpandedSeeds(): SchoolAssessmentSubmission[] {
  const expanded: SchoolAssessmentSubmission[] = [...INITIAL_SEED_DATA];
  let idCounter = 6;

  const schoolPrefixes = [
    'जि. प. प्राथ. शाळा',
    'महापालिका शाळा',
    'आदर्श प्राथमिक शाळा',
    'विद्या निकेतन',
    'छत्रपती शाहू महाराज शाळा',
  ];

  const months: AssessmentMonth[] = ['पहिला महिना', 'दुसरा महिना', 'तिसरा महिना'];

  // Generate 1 school per district per month for clean, ultra-fast initial state
  MAHARASHTRA_DISTRICTS.forEach((d, distIdx) => {
    const b = d.blocks[0]; // first block
    if (!b) return;
    const c = b.clusters[0]; // first cluster
    if (!c) return;

    months.forEach((m, mIdx) => {
      const boys = 15 + ((distIdx + mIdx) % 10);
      const girls = 14 + ((distIdx * 2 + mIdx) % 10);
      const total = boys + girls;

      const makeRow = () => {
        const l1 = Math.floor(total * 0.15);
        const l2 = Math.floor(total * 0.35);
        const l3 = total - l1 - l2;
        return { level1: l1, level2: l2, level3: l3 };
      };

      const udise = `${d.code}010${mIdx + 1}01`;
      const sName = `${schoolPrefixes[distIdx % schoolPrefixes.length]} ${c.name.split(' ')[0]}`;

      expanded.push({
        id: `seed-${idCounter++}`,
        udiseNo: udise,
        schoolName: sName,
        schoolType: distIdx % 2 === 0 ? 'शासकीय' : 'अनुदानित',
        district: d.nameMarathi,
        block: b.name,
        cluster: c.name,
        month: m,
        boysCount: boys,
        girlsCount: girls,
        totalEnrolment: total,
        criteriaData: {
          1: makeRow(),
          2: makeRow(),
          3: makeRow(),
          4: makeRow(),
          5: makeRow(),
          6: makeRow(),
          7: makeRow(),
          8: makeRow(),
        },
        submittedAt: new Date(Date.now() - (distIdx + mIdx) * 3600000).toISOString(),
      });
    });
  });

  return expanded;
}

const GAS_URL_KEY = 'maharashtra_vidya_pravesh_gas_url_v1';

export function getGoogleAppsScriptUrl(): string | null {
  try {
    return localStorage.getItem(GAS_URL_KEY) || null;
  } catch (err) {
    return null;
  }
}

export function saveGoogleAppsScriptUrl(url: string): void {
  try {
    if (!url) {
      localStorage.removeItem(GAS_URL_KEY);
    } else {
      localStorage.setItem(GAS_URL_KEY, url);
    }
  } catch (err) {
    console.error('Error saving Google Apps Script URL:', err);
  }
}

export function getStoredSubmissions(): SchoolAssessmentSubmission[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      const initial = generateExpandedSeeds();
      localStorage.setItem(STORAGE_KEY, JSON.stringify(initial));
      return initial;
    }
    return JSON.parse(raw);
  } catch (err) {
    console.error('Error reading localStorage:', err);
    return INITIAL_SEED_DATA;
  }
}

export function saveSubmission(submission: SchoolAssessmentSubmission): boolean {
  try {
    const current = getStoredSubmissions();
    // Check if school already submitted for this month
    const existingIdx = current.findIndex(
      (s) => s.udiseNo === submission.udiseNo && s.month === submission.month
    );

    if (existingIdx >= 0) {
      current[existingIdx] = {
        ...submission,
        updatedAt: new Date().toISOString(),
      };
    } else {
      current.unshift(submission);
    }

    localStorage.setItem(STORAGE_KEY, JSON.stringify(current));

    // Optional: Send data to Google Apps Script if URL is configured
    const gasUrl = getGoogleAppsScriptUrl();
    if (gasUrl && gasUrl.startsWith('http')) {
      fetch(gasUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'text/plain;charset=utf-8',
        },
        body: JSON.stringify(submission),
      }).catch((err) => {
        console.warn('Google Sheet background sync warning:', err);
      });
    }

    return true;
  } catch (err) {
    console.error('Error saving submission:', err);
    return false;
  }
}

export function resetToSeedData(): SchoolAssessmentSubmission[] {
  const fresh = generateExpandedSeeds();
  localStorage.setItem(STORAGE_KEY, JSON.stringify(fresh));
  return fresh;
}
