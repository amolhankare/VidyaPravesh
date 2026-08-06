import { CriteriaConfig, DistrictInfo, AssessmentMonth } from '../types';
import { DISTRICT_BLOCKS_MAP } from './allDistrictBlocks';

export const ASSESSMENT_CRITERIA: CriteriaConfig[] = [
  {
    id: 1,
    marathiLabel: 'वैयक्तिक स्वच्छता (चांगली किंवा सुधारणेची गरज वाटते)',
    englishLabel: 'Personal Hygiene (Good or needs improvement)',
    type: 'frequency',
    optionsMarathi: ['क्वचित (Rarely)', 'कधीकधी (Sometimes)', 'नेहमी (Always)'],
    optionsEnglish: ['Rarely', 'Sometimes', 'Always'],
  },
  {
    id: 2,
    marathiLabel: 'दैनंदिन कार्यक्रमातील समायोजन',
    englishLabel: 'Adjustment in daily activities',
    type: 'frequency',
    optionsMarathi: ['क्वचित (Rarely)', 'कधीकधी (Sometimes)', 'नेहमी (Always)'],
    optionsEnglish: ['Rarely', 'Sometimes', 'Always'],
  },
  {
    id: 3,
    marathiLabel: 'मैदानी खेळांमधील सहभाग',
    englishLabel: 'Participation in outdoor games',
    type: 'effort',
    optionsMarathi: [
      'मदतीची आवश्यकता असते (Needs Help)',
      'थोड्या प्रयत्नांनी करता येते (With Little Effort)',
      'सहज करता येते (Can Do Easily)',
    ],
    optionsEnglish: ['Needs Help', 'With Little Effort', 'Can Do Easily'],
  },
  {
    id: 4,
    marathiLabel:
      'सर्जनशील कलात्मक उपक्रमांमध्ये सहभाग- सूक्ष्मकारक विकास, कल्पनाशक्ती व कलात्मक / सौंदर्य दृष्टीचा विकास.',
    englishLabel:
      'Participation in creative artistic activities - fine motor development, imagination & artistic/aesthetic vision development',
    type: 'effort',
    optionsMarathi: [
      'मदतीची आवश्यकता असते (Needs Help)',
      'थोड्या प्रयत्नांनी करता येते (With Little Effort)',
      'सहज करता येते (Can Do Easily)',
    ],
    optionsEnglish: ['Needs Help', 'With Little Effort', 'Can Do Easily'],
  },
  {
    id: 5,
    marathiLabel: 'गणिती कौशल्ये व परिसराबद्दलची जागरूकता दाखविणे.',
    englishLabel: 'Demonstrating mathematical skills & environmental awareness',
    type: 'effort',
    optionsMarathi: [
      'मदतीची आवश्यकता असते (Needs Help)',
      'थोड्या प्रयत्नांनी करता येते (With Little Effort)',
      'सहज करता येते (Can Do Easily)',
    ],
    optionsEnglish: ['Needs Help', 'With Little Effort', 'Can Do Easily'],
  },
  {
    id: 6,
    marathiLabel: 'तोंडी अभिव्यक्ती',
    englishLabel: 'Oral Expression',
    type: 'frequency',
    optionsMarathi: ['क्वचित (Rarely)', 'कधीकधी (Sometimes)', 'नेहमी (Always)'],
    optionsEnglish: ['Rarely', 'Sometimes', 'Always'],
  },
  {
    id: 7,
    marathiLabel: 'अंकुरते वाचन कौशल्ये',
    englishLabel: 'Emergent Reading Skills',
    type: 'frequency',
    optionsMarathi: ['क्वचित (Rarely)', 'कधीकधी (Sometimes)', 'नेहमी (Always)'],
    optionsEnglish: ['Rarely', 'Sometimes', 'Always'],
  },
  {
    id: 8,
    marathiLabel: 'अंकुरते लेखनाची कौशल्ये',
    englishLabel: 'Emergent Writing Skills',
    type: 'frequency',
    optionsMarathi: ['क्वचित (Rarely)', 'कधीकधी (Sometimes)', 'नेहमी (Always)'],
    optionsEnglish: ['Rarely', 'Sometimes', 'Always'],
  },
];

export const ASSESSMENT_MONTHS: AssessmentMonth[] = [
  'पहिला महिना',
  'दुसरा महिना',
  'तिसरा महिना',
];

const RAW_DISTRICTS = [
  { id: 'pune', nameMarathi: 'पुणे (Pune)', nameEnglish: 'Pune', code: '2725', target: 6850 },
  { id: 'nashik', nameMarathi: 'नाशिक (Nashik)', nameEnglish: 'Nashik', code: '2720', target: 5420 },
  { id: 'chhatrapati-sambhajinagar', nameMarathi: 'छत्रपती संभाजीनगर (Chhatrapati Sambhajinagar)', nameEnglish: 'Chhatrapati Sambhajinagar', code: '2719', target: 4980 },
  { id: 'thane', nameMarathi: 'ठाणे (Thane)', nameEnglish: 'Thane', code: '2721', target: 4200 },
  { id: 'nagpur', nameMarathi: 'नागपूर (Nagpur)', nameEnglish: 'Nagpur', code: '2709', target: 4150 },
  { id: 'kolhapur', nameMarathi: 'कोल्हापूर (Kolhapur)', nameEnglish: 'Kolhapur', code: '2734', target: 3850 },
  { id: 'solapur', nameMarathi: 'सोलापूर (Solapur)', nameEnglish: 'Solapur', code: '2730', target: 4300 },
  { id: 'ahmednagar', nameMarathi: 'अहिल्यानगर / नगर (Ahilyanagar)', nameEnglish: 'Ahilyanagar (Ahmednagar)', code: '2726', target: 5100 },
  { id: 'satara', nameMarathi: 'सातारा (Satara)', nameEnglish: 'Satara', code: '2731', target: 3650 },
  { id: 'amravati', nameMarathi: 'अमरावती (Amravati)', nameEnglish: 'Amravati', code: '2707', target: 3400 },
  { id: 'latur', nameMarathi: 'लातूर (Latur)', nameEnglish: 'Latur', code: '2728', target: 2950 },
  { id: 'nanded', nameMarathi: 'नांदेड (Nanded)', nameEnglish: 'Nanded', code: '2715', target: 3700 },
  { id: 'jalgaon', nameMarathi: 'जळगाव (Jalgaon)', nameEnglish: 'Jalgaon', code: '2703', target: 3900 },
  { id: 'sangli', nameMarathi: 'सांगली (Sangli)', nameEnglish: 'Sangli', code: '2735', target: 3100 },
  { id: 'palghar', nameMarathi: 'पालघर (Palghar)', nameEnglish: 'Palghar', code: '2736', target: 3300 },
  { id: 'mumbai-suburban', nameMarathi: 'मुंबई उपनगर (Mumbai Suburban)', nameEnglish: 'Mumbai Suburban', code: '2722', target: 3800 },
  { id: 'mumbai-city', nameMarathi: 'मुंबई शहर (Mumbai City)', nameEnglish: 'Mumbai City', code: '2723', target: 2900 },
  { id: 'raigad', nameMarathi: 'रायगड (Raigad)', nameEnglish: 'Raigad', code: '2724', target: 3100 },
  { id: 'ratnagiri', nameMarathi: 'रत्नागिरी (Ratnagiri)', nameEnglish: 'Ratnagiri', code: '2732', target: 2900 },
  { id: 'sindhudurg', nameMarathi: 'सिंधुदुर्ग (Sindhudurg)', nameEnglish: 'Sindhudurg', code: '2733', target: 2100 },
  { id: 'dhule', nameMarathi: 'धुळे (Dhule)', nameEnglish: 'Dhule', code: '2702', target: 2600 },
  { id: 'nandurbar', nameMarathi: 'नंदुरबार (Nandurbar)', nameEnglish: 'Nandurbar', code: '2701', target: 2400 },
  { id: 'beed', nameMarathi: 'बीड (Beed)', nameEnglish: 'Beed', code: '2717', target: 3500 },
  { id: 'jalna', nameMarathi: 'जालना (Jalna)', nameEnglish: 'Jalna', code: '2718', target: 2800 },
  { id: 'dharashiv', nameMarathi: 'धाराशिव (Dharashiv)', nameEnglish: 'Dharashiv (Osmanabad)', code: '2729', target: 2700 },
  { id: 'parbhani', nameMarathi: 'परभणी (Parbhani)', nameEnglish: 'Parbhani', code: '2714', target: 2500 },
  { id: 'hingoli', nameMarathi: 'हिंगोली (Hingoli)', nameEnglish: 'Hingoli', code: '2713', target: 1900 },
  { id: 'buldhana', nameMarathi: 'बुलढाणा (Buldhana)', nameEnglish: 'Buldhana', code: '2704', target: 3300 },
  { id: 'akola', nameMarathi: 'अकोला (Akola)', nameEnglish: 'Akola', code: '2705', target: 2600 },
  { id: 'washim', nameMarathi: 'वाशीम (Washim)', nameEnglish: 'Washim', code: '2706', target: 2100 },
  { id: 'yavatmal', nameMarathi: 'यवतमाळ (Yavatmal)', nameEnglish: 'Yavatmal', code: '2712', target: 3600 },
  { id: 'wardha', nameMarathi: 'वर्धा (Wardha)', nameEnglish: 'Wardha', code: '2708', target: 2200 },
  { id: 'bhandara', nameMarathi: 'भंडारा (Bhandara)', nameEnglish: 'Bhandara', code: '2710', target: 2000 },
  { id: 'gondia', nameMarathi: 'गोंदिया (Gondia)', nameEnglish: 'Gondia', code: '2711', target: 2100 },
  { id: 'chandrapur', nameMarathi: 'चंद्रपूर (Chandrapur)', nameEnglish: 'Chandrapur', code: '2716', target: 3200 },
  { id: 'gadchiroli', nameMarathi: 'गडचिरोली (Gadchiroli)', nameEnglish: 'Gadchiroli', code: '2727', target: 2300 },
];

export const MAHARASHTRA_DISTRICTS: DistrictInfo[] = RAW_DISTRICTS.map((d) => ({
  id: d.id,
  nameMarathi: d.nameMarathi,
  nameEnglish: d.nameEnglish,
  code: d.code,
  totalSchoolsTarget: d.target,
  blocks: DISTRICT_BLOCKS_MAP[d.id] || [
    {
      name: `${d.nameEnglish} तालुका / गट (Taluka)`,
      clusters: [
        { name: `${d.nameEnglish} केंद्र १ (Center 1)`, totalSchools: 35 },
        { name: `${d.nameEnglish} केंद्र २ (Center 2)`, totalSchools: 30 },
      ],
    },
  ],
}));

// Overall Maharashtra Target (Total schools across all 36 districts)
export const MAHARASHTRA_TOTAL_SCHOOL_TARGET = 124500; // ~1.245 Lakh schools
