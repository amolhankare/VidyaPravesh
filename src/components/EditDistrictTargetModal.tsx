import React, { useState, useEffect } from 'react';
import { DistrictInfo } from '../types';
import {
  getCustomDistrictTargets,
  saveCustomDistrictTarget,
  saveAllCustomDistrictTargets,
  resetCustomDistrictTargets,
} from '../utils/districtTargets';
import { MAHARASHTRA_DISTRICTS } from '../data/maharashtraData';
import { X, Save, RotateCcw, Target, Edit3, Check, Search } from 'lucide-react';

interface EditDistrictTargetModalProps {
  isOpen: boolean;
  onClose: () => void;
  lang: 'mr' | 'en';
  onTargetsUpdated: () => void;
  focusDistrictId?: string; // Optional district ID to focus/scroll to
}

export const EditDistrictTargetModal: React.FC<EditDistrictTargetModalProps> = ({
  isOpen,
  onClose,
  lang,
  onTargetsUpdated,
  focusDistrictId,
}) => {
  const isMarathi = lang === 'mr';
  const [districtTargets, setDistrictTargets] = useState<Record<string, number>>({});
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [savedSuccess, setSavedSuccess] = useState<boolean>(false);

  useEffect(() => {
    if (isOpen) {
      const stored = getCustomDistrictTargets();
      const initialMap: Record<string, number> = {};
      MAHARASHTRA_DISTRICTS.forEach((d) => {
        initialMap[d.id] = stored[d.id] !== undefined ? stored[d.id] : d.totalSchoolsTarget;
      });
      setDistrictTargets(initialMap);
      setSavedSuccess(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleTargetChange = (districtId: string, value: string) => {
    const num = parseInt(value.replace(/[^0-9]/g, ''), 10);
    setDistrictTargets((prev) => ({
      ...prev,
      [districtId]: isNaN(num) ? 0 : num,
    }));
  };

  const handleSaveSingle = (districtId: string) => {
    const val = districtTargets[districtId] || 0;
    saveCustomDistrictTarget(districtId, val);
    onTargetsUpdated();
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2000);
  };

  const handleSaveAll = () => {
    saveAllCustomDistrictTargets(districtTargets);
    onTargetsUpdated();
    setSavedSuccess(true);
    setTimeout(() => {
      setSavedSuccess(false);
      onClose();
    }, 1000);
  };

  const handleResetDefaults = () => {
    if (
      window.confirm(
        isMarathi
          ? 'तुम्हाला खरोखर सर्व जिल्ह्यांचे उद्दिष्ट डीफॉल्ट प्रमाणावर रिसेट करायचे आहे का?'
          : 'Are you sure you want to reset all district targets back to default?'
      )
    ) {
      resetCustomDistrictTargets();
      const defaultMap: Record<string, number> = {};
      MAHARASHTRA_DISTRICTS.forEach((d) => {
        defaultMap[d.id] = d.totalSchoolsTarget;
      });
      setDistrictTargets(defaultMap);
      onTargetsUpdated();
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 2000);
    }
  };

  const filteredDistricts = MAHARASHTRA_DISTRICTS.filter((d) => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return true;
    return (
      d.nameMarathi.toLowerCase().includes(q) ||
      d.nameEnglish.toLowerCase().includes(q) ||
      d.code.includes(q)
    );
  });

  const totalSumTargets = (Object.values(districtTargets) as number[]).reduce((a: number, b: number) => a + (b || 0), 0);

  return (
    <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-xs z-50 flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col my-auto max-h-[90vh]">
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-blue-700 to-indigo-800 text-white p-4 sm:p-5 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-white/10 rounded-xl backdrop-blur-md">
              <Target className="w-6 h-6 text-blue-200" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold">
                {isMarathi
                  ? 'जिल्हा निहाय लक्ष्य शाळा संख्या बदला (District Target Schools)'
                  : 'Manage District Target Schools'}
              </h2>
              <p className="text-xs text-blue-100/90 mt-0.5">
                {isMarathi
                  ? 'प्रत्येक जिल्ह्याचे मूळ उद्दिष्ट (Target Schools) अपडेट करा'
                  : 'Update school target count district-wise for admin monitoring'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-white/80 hover:text-white p-1.5 rounded-lg hover:bg-white/10 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Total Target Bar & Search */}
        <div className="p-4 bg-slate-50 border-b border-slate-200 space-y-3 shrink-0">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
            <div className="text-xs font-bold text-slate-700">
              {isMarathi ? 'एकूण महाराष्ट्र सुधारित उद्दिष्ट:' : 'Total Maharashtra Modified Target:'}{' '}
              <span className="text-blue-700 text-sm font-extrabold ml-1">
                {totalSumTargets.toLocaleString('en-IN')} {isMarathi ? 'शाळा' : 'Schools'}
              </span>
            </div>
            <button
              onClick={handleResetDefaults}
              className="text-slate-600 hover:text-rose-600 text-xs font-semibold flex items-center gap-1 transition-colors cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>{isMarathi ? 'डीफॉल्ट रिसेट करा' : 'Reset Defaults'}</span>
            </button>
          </div>

          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={isMarathi ? 'जिल्हा शोधा (उदा. पुणे, ठाणे, नागपूर)...' : 'Search district...'}
              className="w-full pl-9 pr-3 py-2 bg-white border border-slate-300 rounded-xl text-xs font-medium focus:ring-2 focus:ring-blue-600 focus:outline-none"
            />
          </div>
        </div>

        {/* District Target Table */}
        <div className="p-4 overflow-y-auto flex-1 space-y-2">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {filteredDistricts.map((d) => {
              const currentVal = districtTargets[d.id] ?? d.totalSchoolsTarget;
              const isFocused = focusDistrictId === d.id;

              return (
                <div
                  key={d.id}
                  className={`p-3 rounded-xl border transition-all flex items-center justify-between gap-3 ${
                    isFocused
                      ? 'bg-blue-50/80 border-blue-400 ring-2 ring-blue-300'
                      : 'bg-white border-slate-200 hover:border-slate-300 shadow-2xs'
                  }`}
                >
                  <div className="space-y-0.5">
                    <span className="text-xs font-bold text-slate-900 block">
                      {d.nameMarathi}
                    </span>
                    <span className="text-[11px] text-slate-500 block">
                      {d.nameEnglish} ({d.code})
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <div className="relative">
                      <input
                        type="number"
                        min="0"
                        value={currentVal}
                        onChange={(e) => handleTargetChange(d.id, e.target.value)}
                        className="w-24 text-right font-bold text-slate-900 bg-slate-50 border border-slate-300 rounded-lg px-2.5 py-1 text-xs focus:ring-2 focus:ring-blue-600 focus:bg-white focus:outline-none"
                      />
                    </div>
                    <button
                      onClick={() => handleSaveSingle(d.id)}
                      title={isMarathi ? 'जतन करा' : 'Save'}
                      className="p-1.5 bg-blue-50 hover:bg-blue-600 hover:text-white text-blue-700 rounded-lg transition-colors cursor-pointer"
                    >
                      <Check className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Modal Footer */}
        <div className="bg-slate-50 border-t border-slate-200 p-4 flex items-center justify-between shrink-0">
          <div className="text-xs text-slate-600 font-medium">
            {savedSuccess ? (
              <span className="text-emerald-600 font-bold flex items-center gap-1">
                <Check className="w-4 h-4" />
                {isMarathi ? 'उद्दिष्ट यशस्वीपणे अपडेट झाले! ✅' : 'District Targets Saved! ✅'}
              </span>
            ) : (
              <span>{isMarathi ? 'बदल केलेले उद्दिष्ट सर्व रिपोर्टमध्ये लागू होतील.' : 'Updated targets apply across all admin reports.'}</span>
            )}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="bg-slate-200 hover:bg-slate-300 text-slate-800 text-xs font-bold px-4 py-2 rounded-xl transition-colors cursor-pointer"
            >
              {isMarathi ? 'रद्द करा' : 'Cancel'}
            </button>
            <button
              onClick={handleSaveAll}
              className="bg-blue-700 hover:bg-blue-800 text-white text-xs font-bold px-4 py-2 rounded-xl transition-colors shadow-xs flex items-center gap-1.5 cursor-pointer"
            >
              <Save className="w-4 h-4" />
              <span>{isMarathi ? 'सर्व जतन करा (Save All)' : 'Save All Targets'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
