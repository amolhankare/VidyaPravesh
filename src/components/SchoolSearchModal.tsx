import React, { useState, useMemo } from 'react';
import { SchoolAssessmentSubmission } from '../types';
import { ASSESSMENT_CRITERIA } from '../data/maharashtraData';
import { Search, School, CheckCircle2, Clock, Printer, FileText } from 'lucide-react';

interface SchoolSearchModalProps {
  submissions: SchoolAssessmentSubmission[];
  lang: 'mr' | 'en';
}

export const SchoolSearchModal: React.FC<SchoolSearchModalProps> = ({
  submissions,
  lang,
}) => {
  const isMarathi = lang === 'mr';
  const [searchTerm, setSearchTerm] = useState<string>('');

  const searchResults = useMemo(() => {
    const q = searchTerm.trim().toLowerCase();
    if (!q) return [];
    return submissions.filter((s) => {
      return (
        s.udiseNo.includes(q) ||
        s.schoolName.toLowerCase().includes(q) ||
        s.district.toLowerCase().includes(q) ||
        s.cluster.toLowerCase().includes(q)
      );
    });
  }, [searchTerm, submissions]);

  return (
    <div className="max-w-5xl mx-auto px-4 py-6 space-y-6">
      {/* Search Header */}
      <div className="bg-white text-slate-900 p-6 rounded-xl shadow-xs border border-slate-200 space-y-4">
        <div className="space-y-1">
          <span className="inline-flex items-center gap-1.5 bg-blue-50 text-blue-700 text-[11px] font-bold px-2.5 py-0.5 rounded border border-blue-100 uppercase tracking-wider">
            🔍 शाळा शोध व पडताळणी प्रणाली (School Lookup)
          </span>
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900">
            {isMarathi ? 'शाळेचा UDISE क्रमांक किंवा नावाने शोधा' : 'Search School by UDISE Code or Name'}
          </h2>
          <p className="text-slate-500 text-xs sm:text-sm">
            {isMarathi
              ? 'महाराष्ट्रभरातील कोणत्याही प्राथमिक शाळेचा महिना १, २, ३ मधील विद्या प्रवेश अहवाल पहा'
              : 'Search and inspect Month 1, 2, 3 assessment status for any school'}
          </p>
        </div>

        {/* Input Field */}
        <div className="relative">
          <Search className="w-5 h-5 text-blue-600 absolute left-4 top-3.5" />
          <input
            type="text"
            placeholder={
              isMarathi
                ? 'UDISE क्रमांक प्रविष्ट करा (उदा. 27250100101 किंवा शाळेचे नाव)...'
                : 'Enter UDISE Code (e.g. 27250100101) or School Name...'
            }
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-slate-50 text-slate-900 placeholder-slate-400 font-semibold text-sm sm:text-base rounded-lg pl-12 pr-4 py-3 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white transition-all"
          />
        </div>
      </div>

      {/* Results Section */}
      {searchTerm.trim() && (
        <div className="space-y-4">
          <div className="flex items-center justify-between text-xs font-bold text-slate-500 px-1">
            <span>
              {isMarathi ? 'शोध निकाल:' : 'Search Results:'}{' '}
              <strong className="text-slate-900">{searchResults.length}</strong>{' '}
              {isMarathi ? 'नोंदी आढळल्या' : 'records found'}
            </span>
          </div>

          {searchResults.length === 0 ? (
            <div className="bg-white p-8 rounded-xl border border-slate-200 text-center space-y-2 shadow-xs">
              <School className="w-10 h-10 text-slate-300 mx-auto" />
              <p className="font-bold text-slate-700 text-sm">
                {isMarathi
                  ? `"${searchTerm}" साठी कोणतीही नोंद आढळली नाही.`
                  : `No records found for "${searchTerm}".`}
              </p>
              <p className="text-xs text-slate-500">
                {isMarathi
                  ? 'कृपया UDISE क्रमांक बरोबर आहे याची खात्री करा.'
                  : 'Please verify the 11-digit UDISE number or school name.'}
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {searchResults.map((res) => (
                <div
                  key={res.id}
                  className="bg-white p-6 rounded-xl shadow-xs border border-slate-200 space-y-4 hover:border-blue-500 transition-all"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
                    <div>
                      <span className="bg-blue-50 text-blue-700 font-extrabold text-[11px] px-2 py-0.5 rounded border border-blue-100">
                        UDISE: {res.udiseNo}
                      </span>
                      <h3 className="text-lg font-bold text-slate-900 mt-1">
                        {res.schoolName}
                      </h3>
                      <p className="text-xs text-slate-500">
                        {res.district} &gt; {res.block} &gt; {res.cluster} ({res.schoolType})
                      </p>
                    </div>

                    <div className="bg-blue-50 border border-blue-100 text-blue-700 text-xs font-bold px-3 py-1.5 rounded-lg self-start sm:self-auto flex items-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4 text-blue-600" />
                      <span>
                        {res.month} - {isMarathi ? 'सादर केले' : 'Submitted'}
                      </span>
                    </div>
                  </div>

                  {/* Summary Grid */}
                  <div className="grid grid-cols-3 gap-3 bg-slate-50 p-3 rounded-lg text-xs text-center font-semibold border border-slate-100">
                    <div>
                      <span className="text-slate-400 block text-[10px]">
                        मुले (Boys)
                      </span>
                      <span className="text-slate-800">{res.boysCount}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[10px]">
                        मुली (Girls)
                      </span>
                      <span className="text-slate-800">{res.girlsCount}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[10px]">
                        एकूण पट
                      </span>
                      <span className="text-blue-600 font-bold">
                        {res.totalEnrolment}
                      </span>
                    </div>
                  </div>

                  {/* Criteria Preview */}
                  <div className="border-t border-slate-100 pt-3 flex items-center justify-between">
                    <span className="text-xs text-slate-500">
                      सबमिशन वेळ:{' '}
                      {new Date(res.submittedAt).toLocaleString('mr-IN')}
                    </span>

                    <button
                      onClick={() => window.print()}
                      className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold px-3.5 py-2 rounded-lg transition-colors flex items-center gap-1.5 shadow-xs cursor-pointer"
                    >
                      <Printer className="w-3.5 h-3.5" />
                      <span>{isMarathi ? 'अहवाल प्रिंट करा' : 'Print Card'}</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
