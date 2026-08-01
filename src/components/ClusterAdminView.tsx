import React, { useState, useMemo } from 'react';
import {
  SchoolAssessmentSubmission,
  AssessmentMonth,
  CriteriaValue,
} from '../types';
import {
  MAHARASHTRA_DISTRICTS,
  ASSESSMENT_MONTHS,
  ASSESSMENT_CRITERIA,
} from '../data/maharashtraData';
import {
  School,
  CheckCircle2,
  Clock,
  Eye,
  Search,
  Filter,
  X,
  Printer,
  Sparkles,
  Building,
  User,
  Calendar,
} from 'lucide-react';

interface ClusterAdminViewProps {
  submissions: SchoolAssessmentSubmission[];
  selectedDistrict: string;
  setSelectedDistrict: (d: string) => void;
  selectedBlock: string;
  setSelectedBlock: (b: string) => void;
  selectedCluster: string;
  setSelectedCluster: (c: string) => void;
  lang: 'mr' | 'en';
}

export const ClusterAdminView: React.FC<ClusterAdminViewProps> = ({
  submissions,
  selectedDistrict,
  setSelectedDistrict,
  selectedBlock,
  setSelectedBlock,
  selectedCluster,
  setSelectedCluster,
  lang,
}) => {
  const isMarathi = lang === 'mr';
  const [selectedMonth, setSelectedMonth] = useState<AssessmentMonth>('पहिला महिना');
  const [viewingSubmission, setViewingSubmission] =
    useState<SchoolAssessmentSubmission | null>(null);

  // Get current district obj
  const currentDistrictObj = useMemo(() => {
    return (
      MAHARASHTRA_DISTRICTS.find(
        (d) =>
          d.nameMarathi === selectedDistrict ||
          d.nameEnglish === selectedDistrict ||
          selectedDistrict.includes(d.nameEnglish)
      ) || MAHARASHTRA_DISTRICTS[0]
    );
  }, [selectedDistrict]);

  const availableBlocks = useMemo(() => {
    const predefined = currentDistrictObj.blocks.map((b) => b.name);
    const customInSubs = submissions
      .filter(
        (s) =>
          s.district === selectedDistrict ||
          s.district.includes(currentDistrictObj.nameEnglish) ||
          s.district.includes(currentDistrictObj.nameMarathi)
      )
      .map((s) => s.block);
    return Array.from(new Set([...predefined, ...customInSubs]));
  }, [currentDistrictObj, submissions, selectedDistrict]);

  const currentBlockObj = useMemo(() => {
    return (
      currentDistrictObj.blocks.find(
        (b) => b.name === selectedBlock || selectedBlock.includes(b.name)
      ) || currentDistrictObj.blocks[0]
    );
  }, [currentDistrictObj, selectedBlock]);

  const availableClusters = useMemo(() => {
    const predefined = currentBlockObj ? currentBlockObj.clusters.map((c) => c.name) : [];
    const customInSubs = submissions
      .filter((s) => s.block === selectedBlock || (selectedBlock && s.block.includes(selectedBlock)))
      .map((s) => s.cluster);
    return Array.from(new Set([...predefined, ...customInSubs]));
  }, [currentBlockObj, submissions, selectedBlock]);

  const currentClusterObj = useMemo(() => {
    if (!currentBlockObj) return { name: selectedCluster || 'केंद्र', totalSchools: 30 };
    return (
      currentBlockObj.clusters.find((c) => c.name === selectedCluster) || {
        name: selectedCluster || currentBlockObj.clusters[0]?.name || 'केंद्र',
        totalSchools: 30,
      }
    );
  }, [currentBlockObj, selectedCluster]);

  // Filter submissions under this exact cluster & month
  const clusterSubmissions = useMemo(() => {
    return submissions.filter((s) => {
      const isDistMatch =
        s.district.toLowerCase().includes(currentDistrictObj.nameEnglish.toLowerCase()) ||
        s.district.includes(currentDistrictObj.nameMarathi) ||
        currentDistrictObj.nameMarathi.includes(s.district);

      const isBlockMatch =
        !selectedBlock ||
        s.block.toLowerCase().includes(selectedBlock.toLowerCase()) ||
        selectedBlock.toLowerCase().includes(s.block.toLowerCase());

      const isClusterMatch =
        !selectedCluster ||
        s.cluster.toLowerCase().includes(selectedCluster.toLowerCase()) ||
        selectedCluster.toLowerCase().includes(s.cluster.toLowerCase());

      const isMonthMatch = s.month === selectedMonth;

      return isDistMatch && isBlockMatch && isClusterMatch && isMonthMatch;
    });
  }, [submissions, currentDistrictObj, selectedBlock, selectedCluster, selectedMonth]);

  // Simulated total school roster for this cluster
  const totalClusterTarget = currentClusterObj.totalSchools || 30;
  const submittedCount = clusterSubmissions.length;
  const pendingCount = Math.max(0, totalClusterTarget - submittedCount);

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 space-y-6">
      {/* Header Bar */}
      <div className="bg-white text-slate-900 p-6 rounded-xl shadow-xs border border-slate-200 space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-4">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded bg-blue-50 text-blue-700 text-[11px] font-bold uppercase tracking-wider border border-blue-100">
              <School className="w-3.5 h-3.5" />
              <span>
                {isMarathi
                  ? 'केंद्र / क्लस्टर प्रशासन (Cluster Level Admin)'
                  : 'Cluster Level Dashboard'}
              </span>
            </div>

            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900">
              {currentClusterObj.name}
            </h2>
            <p className="text-slate-500 text-xs sm:text-sm">
              {currentDistrictObj.nameMarathi} &gt; {currentBlockObj.name} &gt;{' '}
              {currentClusterObj.name}
            </p>
          </div>

          <div className="flex items-center gap-2 bg-slate-50 p-2 rounded-lg border border-slate-200">
            <Calendar className="w-4 h-4 text-blue-600" />
            <select
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value as AssessmentMonth)}
              className="bg-transparent text-slate-900 font-bold text-xs sm:text-sm focus:outline-none cursor-pointer"
            >
              {ASSESSMENT_MONTHS.map((m) => (
                <option key={m} value={m} className="bg-white text-slate-900">
                  {m}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Cascading Filter Selection Bar */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
          <div>
            <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1 tracking-wider">
              {isMarathi ? '१. जिल्हा (District)' : '1. District'}
            </label>
            <select
              value={currentDistrictObj.nameMarathi}
              onChange={(e) => {
                setSelectedDistrict(e.target.value);
                const d = MAHARASHTRA_DISTRICTS.find(
                  (x) => x.nameMarathi === e.target.value
                );
                if (d) {
                  setSelectedBlock(d.blocks[0].name);
                  setSelectedCluster(d.blocks[0].clusters[0].name);
                }
              }}
              className="w-full bg-slate-50 border border-slate-200 text-slate-900 text-xs font-semibold rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-600 focus:outline-none"
            >
              {MAHARASHTRA_DISTRICTS.map((d) => (
                <option key={d.id} value={d.nameMarathi}>
                  {d.nameMarathi}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1 tracking-wider">
              {isMarathi ? '२. तालुका / ब्लॉक (Block)' : '2. Block'}
            </label>
            <select
              value={currentBlockObj.name}
              onChange={(e) => {
                setSelectedBlock(e.target.value);
                const b = currentDistrictObj.blocks.find(
                  (x) => x.name === e.target.value
                );
                if (b) {
                  setSelectedCluster(b.clusters[0].name);
                }
              }}
              className="w-full bg-slate-50 border border-slate-200 text-slate-900 text-xs font-semibold rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-600 focus:outline-none"
            >
              {availableBlocks.map((b) => (
                <option key={b} value={b}>
                  {b}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1 tracking-wider">
              {isMarathi ? '३. केंद्र / क्लस्टर (Cluster)' : '3. Cluster'}
            </label>
            <select
              value={currentClusterObj.name}
              onChange={(e) => setSelectedCluster(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 text-slate-900 text-xs font-semibold rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-600 focus:outline-none"
            >
              {availableClusters.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Cluster Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-1">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">
            {isMarathi ? 'एकूण केन्द्रातील शाळा' : 'Total Schools in Center'}
          </span>
          <div className="text-2xl font-extrabold text-slate-900 tracking-tight">
            {totalClusterTarget}
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-1">
          <span className="text-[10px] font-bold text-blue-600 uppercase tracking-widest flex items-center gap-1">
            <CheckCircle2 className="w-4 h-4 text-blue-600" />
            {isMarathi ? 'माहिती सादर केलेल्या शाळा' : 'Submitted Schools'}
          </span>
          <div className="text-2xl font-extrabold text-blue-600 tracking-tight">
            {submittedCount}
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-1">
          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest flex items-center gap-1">
            <Clock className="w-4 h-4 text-slate-400" />
            {isMarathi ? 'प्रलंबित शाळा (Pending)' : 'Pending Schools'}
          </span>
          <div className="text-2xl font-extrabold text-slate-700 tracking-tight">
            {pendingCount}
          </div>
        </div>
      </div>

      {/* Submissions List Table */}
      <div className="bg-white rounded-xl shadow-xs border border-slate-200 overflow-hidden p-6 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <School className="w-5 h-5 text-blue-600" />
            <span>
              {currentClusterObj.name} -{' '}
              {isMarathi ? 'शाळा निहाय संकलन यादी' : 'School Wise Collection Roster'}
            </span>
          </h3>
          <span className="text-xs font-bold text-slate-500">
            {selectedMonth}
          </span>
        </div>

        {clusterSubmissions.length === 0 ? (
          <div className="text-center py-10 bg-slate-50 rounded-lg space-y-2 border border-slate-200">
            <Clock className="w-10 h-10 text-slate-400 mx-auto" />
            <p className="font-bold text-slate-700 text-sm">
              {isMarathi
                ? 'या केंद्रातील निवडलेल्या महिन्यासाठी नवीन नोंद आढळली नाही.'
                : 'No submissions found for this cluster in selected month.'}
            </p>
            <p className="text-xs text-slate-500">
              {isMarathi
                ? 'शाळा माहिती फॉर्म वर जाऊन पहिली नोंद दाखल करा.'
                : 'Go to School Entry Form tab to enter new school data.'}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm border-collapse">
              <thead>
                <tr className="bg-slate-50 text-slate-600 text-[11px] font-bold uppercase tracking-wider border-b border-slate-200">
                  <th className="p-3">UDISE क्रमांक</th>
                  <th className="p-3">शाळेचे नाव (School Name)</th>
                  <th className="p-3 text-center">प्रकार</th>
                  <th className="p-3 text-center">विद्यार्थी (पट)</th>
                  <th className="p-3 text-center">स्थिती (Status)</th>
                  <th className="p-3 text-center">कृती (Action)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs font-medium">
                {clusterSubmissions.map((sub) => (
                  <tr key={sub.id} className="hover:bg-slate-50 transition-colors">
                    <td className="p-3 font-mono font-bold text-slate-800">
                      {sub.udiseNo}
                    </td>

                    <td className="p-3 font-bold text-slate-900">
                      {sub.schoolName}
                    </td>

                    <td className="p-3 text-center">
                      <span className="bg-slate-100 text-slate-700 px-2 py-0.5 rounded text-[11px]">
                        {sub.schoolType}
                      </span>
                    </td>

                    <td className="p-3 text-center font-bold text-slate-800">
                      {sub.boysCount} M + {sub.girlsCount} F ={' '}
                      <strong className="text-blue-600">{sub.totalEnrolment}</strong>
                    </td>

                    <td className="p-3 text-center">
                      <span className="bg-blue-50 text-blue-700 font-bold px-2.5 py-1 rounded text-[11px] inline-flex items-center gap-1 border border-blue-100">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>{isMarathi ? 'सादर केले' : 'Submitted'}</span>
                      </span>
                    </td>

                    <td className="p-3 text-center">
                      <button
                        onClick={() => setViewingSubmission(sub)}
                        className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-3 py-1.5 rounded-lg text-xs transition-colors flex items-center gap-1 mx-auto cursor-pointer"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>{isMarathi ? 'अहवाल पहा' : 'View Form'}</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Detail Submission Modal */}
      {viewingSubmission && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-xl shadow-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto p-6 space-y-6 relative border border-slate-200">
            {/* Close Button */}
            <button
              onClick={() => setViewingSubmission(null)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-800 p-1 rounded-full bg-slate-100 hover:bg-slate-200 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="border-b border-slate-100 pb-4 pr-10">
              <span className="inline-block bg-blue-50 text-blue-700 text-[11px] font-bold px-2.5 py-0.5 rounded mb-1 border border-blue-100">
                विद्या प्रवेश आढावा - {viewingSubmission.month}
              </span>
              <h3 className="text-xl font-bold text-slate-900">
                {viewingSubmission.schoolName}
              </h3>
              <p className="text-xs text-slate-500">
                UDISE: {viewingSubmission.udiseNo} | {viewingSubmission.district} &gt;{' '}
                {viewingSubmission.block} &gt; {viewingSubmission.cluster}
              </p>
            </div>

            {/* Student Stats */}
            <div className="grid grid-cols-3 gap-3 bg-slate-50 p-4 rounded-lg border border-slate-200 text-center">
              <div>
                <span className="text-[11px] text-slate-500 block font-semibold">
                  मुले (Boys)
                </span>
                <span className="text-lg font-bold text-slate-800">
                  {viewingSubmission.boysCount}
                </span>
              </div>
              <div>
                <span className="text-[11px] text-slate-500 block font-semibold">
                  मुली (Girls)
                </span>
                <span className="text-lg font-bold text-slate-800">
                  {viewingSubmission.girlsCount}
                </span>
              </div>
              <div>
                <span className="text-[11px] text-slate-500 block font-semibold">
                  एकूण पटसंख्या (Total)
                </span>
                <span className="text-lg font-extrabold text-blue-600">
                  {viewingSubmission.totalEnrolment}
                </span>
              </div>
            </div>

            {/* Criteria Breakdown */}
            <div className="space-y-3">
              <h4 className="font-bold text-slate-900 text-sm">
                विद्या प्रवेश - ८ उद्दिष्ट निहाय संख्यात्मक नोंद:
              </h4>

              <div className="divide-y divide-slate-200 border border-slate-200 rounded-lg overflow-hidden">
                {ASSESSMENT_CRITERIA.map((crit) => {
                  const val = viewingSubmission.criteriaData[crit.id] || {
                    level1: 0,
                    level2: 0,
                    level3: 0,
                  };

                  return (
                    <div key={crit.id} className="p-3 bg-white space-y-2 text-xs">
                      <p className="font-bold text-slate-800">
                        {crit.id}. {crit.marathiLabel}
                      </p>
                      <div className="grid grid-cols-3 gap-2 text-center">
                        <div className="bg-slate-50 p-2 rounded border border-slate-100">
                          <span className="block text-[10px] text-slate-500">
                            {crit.optionsMarathi[0]}
                          </span>
                          <strong className="text-slate-800 text-sm">
                            {val.level1} विद्यार्थी
                          </strong>
                        </div>

                        <div className="bg-slate-50 p-2 rounded border border-slate-100">
                          <span className="block text-[10px] text-slate-600">
                            {crit.optionsMarathi[1]}
                          </span>
                          <strong className="text-slate-900 text-sm">
                            {val.level2} विद्यार्थी
                          </strong>
                        </div>

                        <div className="bg-blue-50 p-2 rounded border border-blue-100">
                          <span className="block text-[10px] text-blue-700 font-semibold">
                            {crit.optionsMarathi[2]}
                          </span>
                          <strong className="text-blue-800 text-sm">
                            {val.level3} विद्यार्थी
                          </strong>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-slate-100">
              <span className="text-xs text-slate-400">
                सबमिट तारीख:{' '}
                {new Date(viewingSubmission.submittedAt).toLocaleString('mr-IN')}
              </span>

              <button
                onClick={() => window.print()}
                className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-4 py-2 rounded-lg text-xs flex items-center gap-1.5 shadow-xs cursor-pointer"
              >
                <Printer className="w-4 h-4" />
                <span>प्रिंट फॉर्म</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
