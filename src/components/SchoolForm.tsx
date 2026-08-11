import React, { useState, useEffect, useMemo } from 'react';
import {
  SchoolType,
  AssessmentMonth,
  SchoolAssessmentSubmission,
  CriteriaValue,
} from '../types';
import {
  ASSESSMENT_CRITERIA,
  ASSESSMENT_MONTHS,
  MAHARASHTRA_DISTRICTS,
} from '../data/maharashtraData';
import { saveSubmission, getStoredSubmissions } from '../utils/storage';
import {
  School,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  Printer,
  Calendar,
  Building,
  UserCheck,
  Calculator,
  Info,
  RefreshCw,
} from 'lucide-react';

interface SchoolFormProps {
  lang: 'mr' | 'en';
  onSubmissionSuccess: () => void;
}

export const SchoolForm: React.FC<SchoolFormProps> = ({
  lang,
  onSubmissionSuccess,
}) => {
  const isMarathi = lang === 'mr';

  // State fields
  const [month, setMonth] = useState<AssessmentMonth>('पहिला महिना');
  const [district, setDistrict] = useState<string>('पुणे (Pune)');
  const [block, setBlock] = useState<string>('हवेली (Haveli)');
  const [isCustomBlock, setIsCustomBlock] = useState<boolean>(false);
  const [customBlockText, setCustomBlockText] = useState<string>('');

  const [cluster, setCluster] = useState<string>('खडकवासला केंद्र (Khadakwasla Center)');
  const [isCustomCluster, setIsCustomCluster] = useState<boolean>(false);
  const [customClusterText, setCustomClusterText] = useState<string>('');

  const [schoolName, setSchoolName] = useState<string>('');
  const [schoolType, setSchoolType] = useState<SchoolType>('शासकीय');
  const [udiseNo, setUdiseNo] = useState<string>('');
  const [boysCount, setBoysCount] = useState<number>(15);
  const [girlsCount, setGirlsCount] = useState<number>(15);

  // Criteria data map
  const [criteriaData, setCriteriaData] = useState<Record<number, CriteriaValue>>(() => {
    const initial: Record<number, CriteriaValue> = {};
    ASSESSMENT_CRITERIA.forEach((c) => {
      initial[c.id] = { level1: 3, level2: 10, level3: 17 };
    });
    return initial;
  });

  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successSubmission, setSuccessSubmission] =
    useState<SchoolAssessmentSubmission | null>(null);

  // Storage and existing UDISE lookup state
  const [allSubmissions, setAllSubmissions] = useState<SchoolAssessmentSubmission[]>([]);
  const [isExistingMonthRecord, setIsExistingMonthRecord] = useState<boolean>(false);
  const [foundNotice, setFoundNotice] = useState<string | null>(null);

  // Load all stored submissions to gather custom clusters/blocks & enable UDISE auto-fill
  useEffect(() => {
    setAllSubmissions(getStoredSubmissions());
  }, [successSubmission]);

  // Get blocks based on selected district (merging standard and custom added blocks)
  const selectedDistrictObj = MAHARASHTRA_DISTRICTS.find(
    (d) => d.nameMarathi === district || d.nameEnglish === district
  );

  const availableBlocks = useMemo(() => {
    const predefined = selectedDistrictObj
      ? selectedDistrictObj.blocks.map((b) => b.name)
      : [];
    const customInSubs = allSubmissions
      .filter(
        (s) =>
          selectedDistrictObj &&
          (s.district.includes(selectedDistrictObj.nameEnglish) ||
            s.district.includes(selectedDistrictObj.nameMarathi) ||
            s.district === district)
      )
      .map((s) => s.block);
    return Array.from(new Set([...predefined, ...customInSubs]));
  }, [selectedDistrictObj, district, allSubmissions]);

  // Get clusters based on selected block (merging standard and custom added clusters)
  const selectedBlockObj = selectedDistrictObj?.blocks.find(
    (b) => b.name === block
  );

  const availableClusters = useMemo(() => {
    const predefined = selectedBlockObj
      ? selectedBlockObj.clusters.map((c) => c.name)
      : [];
    const customInSubs = allSubmissions
      .filter((s) => s.block === block || (block && s.block.includes(block)))
      .map((s) => s.cluster);
    return Array.from(new Set([...predefined, ...customInSubs]));
  }, [selectedBlockObj, block, allSubmissions]);

  // Auto-fill school details when UDISE is entered, and detect existing month assessment
  useEffect(() => {
    const cleanUdise = udiseNo.trim();
    if (cleanUdise.length < 3) {
      setIsExistingMonthRecord(false);
      setFoundNotice(null);
      return;
    }

    const matches = allSubmissions.filter((s) => s.udiseNo === cleanUdise);
    if (matches.length > 0) {
      // Latest matching school details
      const latest = matches[0];
      
      // Auto-fill metadata if user hasn't explicitly entered a different custom value
      if (!schoolName) setSchoolName(latest.schoolName);
      if (latest.schoolType) setSchoolType(latest.schoolType);
      if (latest.district) setDistrict(latest.district);
      if (latest.block) setBlock(latest.block);
      if (latest.cluster) setCluster(latest.cluster);

      // Check if assessment for current month ALREADY exists
      const exactMonthMatch = matches.find((s) => s.month === month);
      if (exactMonthMatch) {
        setIsExistingMonthRecord(true);
        setBoysCount(exactMonthMatch.boysCount);
        setGirlsCount(exactMonthMatch.girlsCount);
        if (exactMonthMatch.criteriaData) {
          setCriteriaData(exactMonthMatch.criteriaData);
        }
        setFoundNotice(
          isMarathi
            ? `✏️ यू-डायस (${cleanUdise}) चा '${month}' मधील भरलेला डेटा आढळला आहे. आपण सबमिट केल्यास जुनी नोंद अद्ययावत (Update) होईल (पुनरावृत्ती टळेल).`
            : `✏️ Assessment record found for UDISE (${cleanUdise}) in '${month}'. Submitting will UPDATE this record (no duplicate entry).`
        );
      } else {
        setIsExistingMonthRecord(false);
        setFoundNotice(
          isMarathi
            ? `✨ यू-डायस (${cleanUdise}) च्या जुन्या नोंदीवरून शाळेची माहिती ('${latest.schoolName}') आपोआप भरली आहे. कृपया '${month}' साठी मूल्यांमाकन भरा.`
            : `✨ School details ('${latest.schoolName}') auto-filled for UDISE ${cleanUdise}. Please enter assessment for '${month}'.`
        );
      }
    } else {
      setIsExistingMonthRecord(false);
      setFoundNotice(null);
    }
  }, [udiseNo, month, allSubmissions, isMarathi]);

  const handleDistrictChange = (newDist: string) => {
    setDistrict(newDist);
    setIsCustomBlock(false);
    setCustomBlockText('');
    setIsCustomCluster(false);
    setCustomClusterText('');

    const distObj = MAHARASHTRA_DISTRICTS.find(
      (d) => d.nameMarathi === newDist || d.nameEnglish === newDist
    );
    if (distObj && distObj.blocks.length > 0) {
      const firstBlock = distObj.blocks[0];
      setBlock(firstBlock.name);
      if (firstBlock.clusters.length > 0) {
        setCluster(firstBlock.clusters[0].name);
      } else {
        setIsCustomCluster(true);
      }
    } else {
      setIsCustomBlock(true);
      setIsCustomCluster(true);
    }
  };

  const handleBlockChange = (newBlock: string) => {
    if (newBlock === 'CUSTOM_OTHER_BLOCK') {
      setIsCustomBlock(true);
      setIsCustomCluster(true);
    } else {
      setIsCustomBlock(false);
      setCustomBlockText('');
      setBlock(newBlock);
      const blockObj = selectedDistrictObj?.blocks.find((b) => b.name === newBlock);
      if (blockObj && blockObj.clusters.length > 0) {
        setIsCustomCluster(false);
        setCustomClusterText('');
        setCluster(blockObj.clusters[0].name);
      } else {
        setIsCustomCluster(true);
      }
    }
  };

  const handleClusterChange = (newCluster: string) => {
    if (newCluster === 'CUSTOM_OTHER_CLUSTER') {
      setIsCustomCluster(true);
    } else {
      setIsCustomCluster(false);
      setCustomClusterText('');
      setCluster(newCluster);
    }
  };

  const totalEnrolment = Number(boysCount || 0) + Number(girlsCount || 0);

  // Helper to update criteria numerical value
  const handleCriteriaChange = (
    id: number,
    levelKey: keyof CriteriaValue,
    val: number
  ) => {
    const cleanVal = Math.max(0, val);
    setCriteriaData((prev) => ({
      ...prev,
      [id]: {
        ...prev[id],
        [levelKey]: cleanVal,
      },
    }));
  };

  // Quick helper to fill proportional baseline student counts
  const handleAutoDistribute = (id: number) => {
    if (totalEnrolment <= 0) return;
    const l1 = Math.floor(totalEnrolment * 0.15);
    const l2 = Math.floor(totalEnrolment * 0.35);
    const l3 = totalEnrolment - l1 - l2;
    setCriteriaData((prev) => ({
      ...prev,
      [id]: { level1: l1, level2: l2, level3: l3 },
    }));
  };

  const handleAutoDistributeAll = () => {
    if (totalEnrolment <= 0) return;
    const l1 = Math.floor(totalEnrolment * 0.15);
    const l2 = Math.floor(totalEnrolment * 0.35);
    const l3 = totalEnrolment - l1 - l2;

    const updated: Record<number, CriteriaValue> = {};
    ASSESSMENT_CRITERIA.forEach((c) => {
      updated[c.id] = { level1: l1, level2: l2, level3: l3 };
    });
    setCriteriaData(updated);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    const finalBlock = isCustomBlock ? customBlockText.trim() : block;
    const finalCluster = isCustomCluster ? customClusterText.trim() : cluster;

    // Validation
    if (!finalBlock) {
      setErrorMsg(
        isMarathi
          ? 'कृपया तालुका / ब्लॉक चे नाव प्रविष्ट करा.'
          : 'Please select or enter the block/taluka name.'
      );
      return;
    }

    if (!finalCluster) {
      setErrorMsg(
        isMarathi
          ? 'कृपया केंद्र / क्लस्टर चे नाव प्रविष्ट करा.'
          : 'Please select or enter the cluster/center name.'
      );
      return;
    }

    if (!udiseNo.trim()) {
      setErrorMsg(
        isMarathi
          ? 'कृपया शाळेचा UDISE क्रमांक प्रविष्ट करा.'
          : 'Please enter the school UDISE number.'
      );
      return;
    }

    if (!schoolName.trim()) {
      setErrorMsg(
        isMarathi ? 'कृपया शाळेचे नाव प्रविष्ट करा.' : 'Please enter the school name.'
      );
      return;
    }

    if (totalEnrolment <= 0) {
      setErrorMsg(
        isMarathi
          ? 'कृपया विद्यार्थ्यांची पटसंख्या (मुले/मुली) प्रविष्ट करा.'
          : 'Please enter total student enrolment counts.'
      );
      return;
    }

    // Prepare submission object
    const newSubmission: SchoolAssessmentSubmission = {
      id: `sub-${Date.now()}`,
      udiseNo: udiseNo.trim(),
      schoolName: schoolName.trim(),
      schoolType,
      district,
      block: finalBlock,
      cluster: finalCluster,
      month,
      boysCount: Number(boysCount),
      girlsCount: Number(girlsCount),
      totalEnrolment,
      criteriaData,
      submittedAt: new Date().toISOString(),
    };

    const saved = saveSubmission(newSubmission);
    if (saved) {
      setSuccessSubmission(newSubmission);
      onSubmissionSuccess();
    } else {
      setErrorMsg(
        isMarathi
          ? 'डेटा जतन करताना त्रुटी आली. पुन्हा प्रयत्न करा.'
          : 'Error saving submission data. Please try again.'
      );
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-6 space-y-6">
      {/* Title Card */}
      <div className="bg-white text-slate-900 p-6 rounded-xl shadow-xs border border-slate-200">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded bg-blue-50 text-blue-700 text-[11px] font-bold uppercase tracking-wider border border-blue-100">
              <Sparkles className="w-3.5 h-3.5" />
              <span>विद्या प्रवेश - इयत्ता पहिली (Vidya Pravesh - Grade 1)</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900">
              {isMarathi
                ? 'शाळा माहिती व प्रगती नोंदणी फॉर्म (आढावा)'
                : 'School Assessment Data Collection Form'}
            </h2>
            <p className="text-slate-500 text-xs sm:text-sm">
              {isMarathi
                ? 'महाराष्ट्रातील १.२ लाख+ शाळांच्या क्लस्टर, ब्लॉक आणि जिल्हा निहाय माहिती संकलनासाठी'
                : 'Online data collection across Maharashtra Districts, Blocks & Clusters'}
            </p>
          </div>

          {/* Month Dropdown Card Header */}
          <div className="bg-slate-50 p-3 rounded-lg border border-slate-200 flex items-center gap-3 shrink-0">
            <Calendar className="w-5 h-5 text-blue-600" />
            <div>
              <label className="block text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                {isMarathi ? 'आढावा महिना (Select Month)' : 'Select Review Month'}
              </label>
              <select
                value={month}
                onChange={(e) => setMonth(e.target.value as AssessmentMonth)}
                className="bg-white text-slate-900 font-bold text-sm rounded border border-slate-200 px-3 py-1 focus:outline-none focus:ring-2 focus:ring-blue-600 cursor-pointer"
              >
                {ASSESSMENT_MONTHS.map((m) => (
                  <option key={m} value={m}>
                    {m}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Success Receipt State */}
      {successSubmission ? (
        <div className="bg-emerald-50 border-2 border-emerald-500 rounded-2xl p-6 shadow-xl space-y-6 animate-fadeIn">
          <div className="flex items-center gap-4 text-emerald-800">
            <div className="w-12 h-12 rounded-full bg-emerald-500 text-white flex items-center justify-center shrink-0 shadow-lg">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <div>
              <h3 className="text-xl font-bold">
                {isMarathi
                  ? 'माहिती यशस्वीरित्या नोंदवली गेली आहे! (Submitted Successfully)'
                  : 'Assessment Data Submitted Successfully!'}
              </h3>
              <p className="text-sm text-emerald-700">
                {isMarathi
                  ? `UDISE Code: ${successSubmission.udiseNo} | महिना: ${successSubmission.month}`
                  : `UDISE Code: ${successSubmission.udiseNo} | Month: ${successSubmission.month}`}
              </p>
            </div>
          </div>

          <div className="bg-white p-5 rounded-xl border border-emerald-200 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
            <div>
              <span className="text-xs text-slate-500 block font-semibold">
                {isMarathi ? 'शाळेचे नाव:' : 'School Name:'}
              </span>
              <span className="font-bold text-slate-800">
                {successSubmission.schoolName}
              </span>
            </div>
            <div>
              <span className="text-xs text-slate-500 block font-semibold">
                {isMarathi ? 'जिल्हा / ब्लॉक / केंद्र:' : 'District / Block / Cluster:'}
              </span>
              <span className="font-semibold text-slate-800">
                {successSubmission.district} &gt; {successSubmission.block} &gt;{' '}
                {successSubmission.cluster}
              </span>
            </div>
            <div>
              <span className="text-xs text-slate-500 block font-semibold">
                {isMarathi ? 'विद्यार्थी संख्या (मुले / मुली / एकूण):' : 'Students (Boys/Girls/Total):'}
              </span>
              <span className="font-bold text-slate-800">
                {successSubmission.boysCount} मुले + {successSubmission.girlsCount} मुली ={' '}
                <strong className="text-amber-600">
                  {successSubmission.totalEnrolment}
                </strong>
              </span>
            </div>
            <div>
              <span className="text-xs text-slate-500 block font-semibold">
                {isMarathi ? 'सबमिशन दिनांक:' : 'Submitted At:'}
              </span>
              <span className="text-slate-700 font-medium">
                {new Date(successSubmission.submittedAt).toLocaleString('mr-IN')}
              </span>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3 pt-2">
            <button
              onClick={() => {
                setSuccessSubmission(null);
                setUdiseNo('');
                setSchoolName('');
              }}
              className="bg-emerald-700 hover:bg-emerald-800 text-white font-bold px-5 py-2.5 rounded-xl shadow-md transition-colors text-sm flex items-center gap-2"
            >
              <School className="w-4 h-4" />
              <span>
                {isMarathi ? 'दुसऱ्या शाळेची माहिती भरा' : 'Fill Form for Another School'}
              </span>
            </button>

            <button
              onClick={() => window.print()}
              className="bg-slate-800 hover:bg-slate-900 text-white font-bold px-4 py-2.5 rounded-xl shadow-sm transition-colors text-sm flex items-center gap-2"
            >
              <Printer className="w-4 h-4" />
              <span>{isMarathi ? 'पावती प्रिंट करा' : 'Print Receipt'}</span>
            </button>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-6">
          {errorMsg && (
            <div className="bg-rose-50 border-l-4 border-rose-500 p-4 rounded-xl flex items-center gap-3 text-rose-800 text-sm">
              <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Section 1: Administrative Location Hierarchy */}
          <div className="bg-white p-6 rounded-xl shadow-xs border border-slate-200 space-y-4">
            <div className="flex items-center gap-2 text-slate-800 font-bold text-base border-b border-slate-100 pb-3">
              <Building className="w-5 h-5 text-blue-600" />
              <span>
                {isMarathi
                  ? 'भाग १: प्रशासकीय रचना (District, Block, Cluster Collection)'
                  : 'Section 1: Administrative Location'}
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* District Dropdown */}
              <div>
                <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                  {isMarathi ? '१. जिल्हा (District) *' : '1. District *'}
                </label>
                <select
                  value={district}
                  onChange={(e) => handleDistrictChange(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-900 text-sm font-medium focus:ring-2 focus:ring-blue-600 focus:bg-white focus:outline-none cursor-pointer"
                >
                  {MAHARASHTRA_DISTRICTS.map((d) => (
                    <option key={d.id} value={d.nameMarathi}>
                      {d.nameMarathi}
                    </option>
                  ))}
                </select>
              </div>

              {/* Block / Taluka Dropdown */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                    {isMarathi ? '२. तालुका / ब्लॉक (Block/Taluka) *' : '2. Block/Taluka *'}
                  </label>
                  <button
                    type="button"
                    onClick={() => {
                      setIsCustomBlock(!isCustomBlock);
                      if (!isCustomBlock) {
                        setIsCustomCluster(true);
                      }
                    }}
                    className="text-[11px] font-bold text-blue-600 hover:text-blue-800 underline cursor-pointer"
                  >
                    {isCustomBlock
                      ? (isMarathi ? 'सूचीतून निवडा' : 'Select List')
                      : (isMarathi ? '+ मॅन्युअली टाका' : '+ Add Manual')}
                  </button>
                </div>

                {!isCustomBlock ? (
                  <select
                    value={block}
                    onChange={(e) => handleBlockChange(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-900 text-sm font-medium focus:ring-2 focus:ring-blue-600 focus:bg-white focus:outline-none cursor-pointer"
                  >
                    {availableBlocks.map((b) => (
                      <option key={b} value={b}>
                        {b}
                      </option>
                    ))}
                    <option value="CUSTOM_OTHER_BLOCK">
                      {isMarathi
                        ? '✍️ + इतर तालुका (मॅन्युअली नवीन तालुका टाका)'
                        : '✍️ + Other Block (Add Manual Block)'}
                    </option>
                  </select>
                ) : (
                  <input
                    type="text"
                    placeholder={
                      isMarathi
                        ? 'तालुका / ब्लॉक चे नाव लिहा (उदा. वेल्हे)...'
                        : 'Enter Block / Taluka Name...'
                    }
                    value={customBlockText}
                    onChange={(e) => setCustomBlockText(e.target.value)}
                    className="w-full bg-white border border-blue-400 rounded-lg px-3 py-2 text-slate-900 text-sm font-semibold focus:ring-2 focus:ring-blue-600 focus:outline-none shadow-xs"
                  />
                )}
              </div>

              {/* Cluster Dropdown / Manual Custom Input */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                    {isMarathi ? '३. केंद्र / क्लस्टर (Cluster/Center) *' : '3. Cluster/Center *'}
                  </label>
                  <button
                    type="button"
                    onClick={() => {
                      setIsCustomCluster(!isCustomCluster);
                    }}
                    className="text-[11px] font-bold text-blue-600 hover:text-blue-800 underline cursor-pointer"
                  >
                    {isCustomCluster
                      ? (isMarathi ? 'सूचीतून निवडा' : 'Select List')
                      : (isMarathi ? '+ मॅन्युअली टाका' : '+ Add Manual')}
                  </button>
                </div>

                {!isCustomCluster ? (
                  <select
                    value={cluster}
                    onChange={(e) => handleClusterChange(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-900 text-sm font-medium focus:ring-2 focus:ring-blue-600 focus:bg-white focus:outline-none cursor-pointer"
                  >
                    {availableClusters.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                    <option value="CUSTOM_OTHER_CLUSTER">
                      {isMarathi
                        ? '✍️ + इतर केंद्र (मॅन्युअली नवीन केंद्र टाका)'
                        : '✍️ + Other Cluster (Add Custom Cluster)'}
                    </option>
                  </select>
                ) : (
                  <input
                    type="text"
                    placeholder={
                      isMarathi
                        ? 'केंद्र / क्लस्टर चे नाव येथे प्रविष्ट करा (उदा. वरसगाव केंद्र)...'
                        : 'Type Cluster / Center Name here...'
                    }
                    value={customClusterText}
                    onChange={(e) => setCustomClusterText(e.target.value)}
                    className="w-full bg-white border border-blue-400 rounded-lg px-3 py-2 text-slate-900 text-sm font-semibold focus:ring-2 focus:ring-blue-600 focus:outline-none shadow-xs"
                  />
                )}
                {isCustomCluster && (
                  <p className="text-[10px] text-blue-600 font-semibold mt-1">
                    💡 {isMarathi ? 'टीप: प्रविष्ट केलेले नवीन केंद्र या फॉर्ममध्ये जतन केले जाईल.' : 'Note: Entered custom cluster will be saved.'}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Section 2: School Details & Enrollment */}
          <div className="bg-white p-6 rounded-xl shadow-xs border border-slate-200 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2 text-slate-800 font-bold text-base">
                <School className="w-5 h-5 text-blue-600" />
                <span>
                  {isMarathi
                    ? 'भाग २: शाळेची सर्वसाधारण माहिती व पटसंख्या'
                    : 'Section 2: School Metadata & Enrolment'}
                </span>
              </div>
              {isExistingMonthRecord && (
                <span className="bg-amber-100 text-amber-900 border border-amber-300 px-2.5 py-1 rounded-md text-[11px] font-bold flex items-center gap-1.5">
                  <RefreshCw className="w-3.5 h-3.5 text-amber-700 animate-spin-slow" />
                  {isMarathi ? 'माहिती अद्ययावत (Update Mode)' : 'Updating Existing Record'}
                </span>
              )}
            </div>

            {foundNotice && (
              <div
                className={`p-3.5 rounded-lg text-xs font-semibold flex items-start gap-2.5 ${
                  isExistingMonthRecord
                    ? 'bg-amber-50 text-amber-900 border border-amber-200'
                    : 'bg-blue-50 text-blue-900 border border-blue-200'
                }`}
              >
                <Info className="w-4 h-4 shrink-0 mt-0.5" />
                <span>{foundNotice}</span>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* School UDISE */}
              <div>
                <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                  {isMarathi ? 'शाळेचा UDISE क्रमांक *' : 'School UDISE Code *'}
                </label>
                <input
                  type="text"
                  placeholder="उदा. 27250100101"
                  value={udiseNo}
                  onChange={(e) => setUdiseNo(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-900 text-sm font-semibold focus:ring-2 focus:ring-blue-600 focus:bg-white focus:outline-none"
                  required
                />
              </div>

              {/* School Name */}
              <div>
                <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                  {isMarathi ? 'शाळेचे नाव *' : 'School Name *'}
                </label>
                <input
                  type="text"
                  placeholder="उदा. जिल्हा परिषद प्राथमिक शाळा..."
                  value={schoolName}
                  onChange={(e) => setSchoolName(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-900 text-sm font-semibold focus:ring-2 focus:ring-blue-600 focus:bg-white focus:outline-none"
                  required
                />
              </div>

              {/* School Type */}
              <div>
                <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                  {isMarathi ? 'शाळेचा प्रकार *' : 'School Type *'}
                </label>
                <select
                  value={schoolType}
                  onChange={(e) => setSchoolType(e.target.value as SchoolType)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-900 text-sm font-semibold focus:ring-2 focus:ring-blue-600 focus:bg-white focus:outline-none"
                >
                  <option value="शासकीय">१. शासकीय (Government)</option>
                  <option value="अनुदानित">२. अनुदानित (Aided)</option>
                  <option value="विनाअनुदानित">३. विनाअनुदानित (Unaided)</option>
                </select>
              </div>
            </div>

            {/* Enrolment Counters */}
            <div className="bg-slate-50 p-4 rounded-lg border border-slate-200 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                  <UserCheck className="w-4 h-4 text-blue-600" />
                  {isMarathi ? 'इयत्ता पहिली पट (Student Enrollment)' : 'Grade 1 Enrollment'}
                </span>

                <span className="text-xs text-blue-700 font-bold bg-blue-50 px-2.5 py-0.5 rounded-md border border-blue-100">
                  {isMarathi ? 'एकूण पटसंख्या:' : 'Total Enrolled:'}{' '}
                  <strong className="text-blue-900 text-sm">{totalEnrolment}</strong>
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1">
                    {isMarathi ? 'मुले (Boys)' : 'Boys'}
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={boysCount}
                    onChange={(e) => setBoysCount(Number(e.target.value))}
                    className="w-full bg-white border border-slate-200 rounded-lg px-3 py-1.5 text-slate-900 font-bold text-sm"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1">
                    {isMarathi ? 'मुली (Girls)' : 'Girls'}
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={girlsCount}
                    onChange={(e) => setGirlsCount(Number(e.target.value))}
                    className="w-full bg-white border border-slate-200 rounded-lg px-3 py-1.5 text-slate-900 font-bold text-sm"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1">
                    {isMarathi ? 'एकूण (Total)' : 'Total'}
                  </label>
                  <input
                    type="number"
                    value={totalEnrolment}
                    readOnly
                    className="w-full bg-slate-100 border border-slate-200 text-slate-800 font-bold text-sm rounded-lg px-3 py-1.5 cursor-not-allowed"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Section 3: PDF Criteria Numerical Rating Grid */}
          <div className="bg-white p-6 rounded-xl shadow-xs border border-slate-200 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-base font-bold text-slate-800 flex items-center gap-2">
                  <Calculator className="w-5 h-5 text-blue-600" />
                  <span>
                    {isMarathi
                      ? 'भाग ३: विद्या प्रवेश - उद्दिष्ट निहाय संख्यात्मक आढावा (८ मुद्दे)'
                      : 'Section 3: Assessment Numerical Evaluation (8 Criteria)'}
                  </span>
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  {isMarathi
                    ? 'प्रत्येक मुद्द्यासमोर प्रत्येक श्रेणीतील विद्यार्थ्यांची संख्या (Number Data) टाका'
                    : 'Enter student counts for each rating level per criteria.'}
                </p>
              </div>

              <button
                type="button"
                onClick={handleAutoDistributeAll}
                className="bg-slate-50 hover:bg-slate-100 text-slate-700 text-xs font-bold px-3 py-1.5 rounded-lg transition-colors border border-slate-200 self-start sm:self-auto shrink-0 flex items-center gap-1.5"
                title="Automatically populate realistic sample distribution based on total enrolment"
              >
                <Sparkles className="w-3.5 h-3.5 text-blue-600" />
                <span>
                  {isMarathi ? 'पटसंख्या प्रमाणे स्वयं-भरा' : 'Auto-Fill Baseline'}
                </span>
              </button>
            </div>

            {/* Assessment Grid Table */}
            <div className="overflow-x-auto border border-slate-200 rounded-lg">
              <table className="w-full text-left text-sm border-collapse">
                <thead>
                  <tr className="bg-slate-900 text-white text-xs">
                    <th className="p-3 w-12 text-center border-b border-slate-800">
                      अ.क्र.
                    </th>
                    <th className="p-3 border-b border-slate-800 min-w-[280px]">
                      मुद्दे / उद्दिष्ट (Assessment Criteria)
                    </th>
                    <th className="p-3 border-b border-slate-800 text-center bg-slate-800 min-w-[120px]">
                      श्रेणी १<br />
                      <span className="text-[10px] font-normal text-slate-300">
                        (क्वचित / मदतीची गरज)
                      </span>
                    </th>
                    <th className="p-3 border-b border-slate-800 text-center bg-slate-800 min-w-[120px]">
                      श्रेणी २<br />
                      <span className="text-[10px] font-normal text-slate-300">
                        (कधीकधी / थोड्या प्रयत्नाने)
                      </span>
                    </th>
                    <th className="p-3 border-b border-slate-800 text-center bg-blue-700 min-w-[120px]">
                      श्रेणी ३<br />
                      <span className="text-[10px] font-normal text-blue-100">
                        (नेहमी / सहज करता येते)
                      </span>
                    </th>
                    <th className="p-3 border-b border-slate-800 text-center w-24">
                      एकूण नोंद
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 text-xs">
                  {ASSESSMENT_CRITERIA.map((crit) => {
                    const rowVal = criteriaData[crit.id] || {
                      level1: 0,
                      level2: 0,
                      level3: 0,
                    };
                    const rowSum =
                      Number(rowVal.level1) +
                      Number(rowVal.level2) +
                      Number(rowVal.level3);

                    const isMatches = rowSum === totalEnrolment;

                    return (
                      <tr
                        key={crit.id}
                        className="hover:bg-slate-50 transition-colors"
                      >
                        <td className="p-3 text-center font-bold text-slate-700 bg-slate-50">
                          {crit.id}
                        </td>

                        <td className="p-3 font-medium text-slate-800 space-y-0.5">
                          <p className="font-semibold">{crit.marathiLabel}</p>
                          <p className="text-[10px] text-slate-500 italic">
                            {crit.englishLabel}
                          </p>
                        </td>

                        {/* Level 1 input */}
                        <td className="p-2 text-center bg-slate-50/50">
                          <div className="space-y-1">
                            <input
                              type="number"
                              min="0"
                              value={rowVal.level1}
                              onChange={(e) =>
                                handleCriteriaChange(
                                  crit.id,
                                  'level1',
                                  Number(e.target.value)
                                )
                              }
                              className="w-16 mx-auto text-center font-bold text-slate-800 bg-white border border-slate-300 rounded px-2 py-1 focus:ring-2 focus:ring-blue-600"
                            />
                            <span className="block text-[10px] text-slate-600 font-semibold whitespace-normal leading-tight">
                              {crit.type === 'frequency' ? '१. क्वचित' : '१. मदतीची गरज'}
                            </span>
                          </div>
                        </td>

                        {/* Level 2 input */}
                        <td className="p-2 text-center bg-slate-50/80">
                          <div className="space-y-1">
                            <input
                              type="number"
                              min="0"
                              value={rowVal.level2}
                              onChange={(e) =>
                                handleCriteriaChange(
                                  crit.id,
                                  'level2',
                                  Number(e.target.value)
                                )
                              }
                              className="w-16 mx-auto text-center font-bold text-slate-800 bg-white border border-slate-300 rounded px-2 py-1 focus:ring-2 focus:ring-blue-600"
                            />
                            <span className="block text-[10px] text-slate-600 font-semibold whitespace-normal leading-tight">
                              {crit.type === 'frequency' ? '२. कधीकधी' : '२. थोड्या प्रयत्नाने'}
                            </span>
                          </div>
                        </td>

                        {/* Level 3 input */}
                        <td className="p-2 text-center bg-blue-50/50">
                          <div className="space-y-1">
                            <input
                              type="number"
                              min="0"
                              value={rowVal.level3}
                              onChange={(e) =>
                                handleCriteriaChange(
                                  crit.id,
                                  'level3',
                                  Number(e.target.value)
                                )
                              }
                              className="w-16 mx-auto text-center font-bold text-slate-800 bg-white border border-blue-300 rounded px-2 py-1 focus:ring-2 focus:ring-blue-600"
                            />
                            <span className="block text-[10px] text-blue-800 font-bold whitespace-normal leading-tight">
                              {crit.type === 'frequency' ? '३. नेहमी' : '३. सहज करता येते'}
                            </span>
                          </div>
                        </td>

                        {/* Row total check */}
                        <td className="p-3 text-center">
                          <span
                            className={`inline-block font-bold px-2 py-0.5 rounded text-xs ${
                              isMatches
                                ? 'bg-emerald-100 text-emerald-800'
                                : 'bg-amber-100 text-amber-900'
                            }`}
                          >
                            {rowSum} / {totalEnrolment}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Form Action Footer */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-2">
            <div className="text-xs text-slate-500">
              * {isMarathi ? 'माहिती सबमिट केल्यानंतर राज्य व जिल्हा लेव्हल डॅशबोर्डवर त्वरित अद्यतनित होईल.' : 'Data will be updated immediately across State & District dashboards.'}
            </div>

            <button
              type="submit"
              className="w-full sm:w-auto bg-slate-900 hover:bg-slate-800 text-white font-bold px-8 py-3 rounded-lg shadow-sm transition-all text-sm flex items-center justify-center gap-2 cursor-pointer"
            >
              <CheckCircle2 className="w-5 h-5 text-blue-400" />
              <span>
                {isMarathi ? 'माहिती सादर करा (Submit Form)' : 'Submit Assessment Data'}
              </span>
            </button>
          </div>
        </form>
      )}
    </div>
  );
};
