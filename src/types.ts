export type SchoolType = 'शासकीय' | 'अनुदानित' | 'विनाअनुदानित';

export type AssessmentMonth = 'पहिला महिना' | 'दुसरा महिना' | 'तिसरा महिना';

export interface CriteriaConfig {
  id: number;
  marathiLabel: string;
  englishLabel: string;
  type: 'frequency' | 'effort'; // frequency: क्वचित/कधीकधी/नेहमी, effort: मदतीची आवश्यकता/थोड्या प्रयत्नांनी/सहज
  optionsMarathi: [string, string, string];
  optionsEnglish: [string, string, string];
}

export interface CriteriaValue {
  level1: number; // e.g. क्वचित OR मदतीची आवश्यकता असते
  level2: number; // e.g. कधीकधी OR थोड्या प्रयत्नांनी करता येते
  level3: number; // e.g. नेहमी OR सहज करता येते
}

export interface SchoolAssessmentSubmission {
  id: string;
  udiseNo: string;
  schoolName: string;
  schoolType: SchoolType;
  district: string;
  block: string; // Taluka
  cluster: string; // Center
  month: AssessmentMonth;
  boysCount: number;
  girlsCount: number;
  totalEnrolment: number;
  criteriaData: Record<number, CriteriaValue>; // Key is criteria id 1..8
  submittedAt: string; // ISO string
  submittedBy?: string;
  updatedAt?: string;
}

export interface ClusterInfo {
  name: string;
  totalSchools: number;
}

export interface BlockInfo {
  name: string;
  clusters: ClusterInfo[];
}

export interface DistrictInfo {
  id: string;
  nameMarathi: string;
  nameEnglish: string;
  code: string;
  totalSchoolsTarget: number; // Estimated school target in this district
  blocks: BlockInfo[];
}

export type ActiveTab = 'form' | 'state-admin' | 'district-admin' | 'cluster-admin' | 'search';

export type PortalMode = 'user' | 'admin';
