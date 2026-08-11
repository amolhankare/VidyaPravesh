import React, { useState, useEffect } from 'react';
import {
  FileSpreadsheet,
  Save,
  X,
  ExternalLink,
  Check,
  Copy,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import { getGoogleAppsScriptUrl, saveGoogleAppsScriptUrl } from '../utils/storage';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  lang: 'mr' | 'en';
}

export const GoogleSheetsIntegrationModal: React.FC<Props> = ({
  isOpen,
  onClose,
  lang,
}) => {
  const isMarathi = lang === 'mr';
  const [gasUrl, setGasUrl] = useState<string>('');
  const [savedStatus, setSavedStatus] = useState<boolean>(false);
  const [showScriptCode, setShowScriptCode] = useState<boolean>(false);
  const [copiedCode, setCopiedCode] = useState<boolean>(false);

  useEffect(() => {
    if (isOpen) {
      setGasUrl(getGoogleAppsScriptUrl() || '');
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSaveUrl = () => {
    saveGoogleAppsScriptUrl(gasUrl.trim());
    setSavedStatus(true);
    setTimeout(() => setSavedStatus(false), 2500);
  };

  const handleOpenSheet = () => {
    if (gasUrl.trim()) {
      window.open(gasUrl.trim(), '_blank');
    }
  };

  const APPS_SCRIPT_CODE = `function doPost(e) {
  try {
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    var data = JSON.parse(e.postData.contents);
    if (sheet.getLastRow() === 0) {
      sheet.appendRow(["Timestamp","UDISE No","School Name","School Type","District","Block","Cluster","Month","Boys","Girls","Total","Criteria Data JSON"]);
    }
    var udise = String(data.udiseNo || '').trim();
    var month = String(data.month || '').trim();
    var rows = sheet.getDataRange().getValues();
    var existingRowIndex = -1;
    for (var i = 1; i < rows.length; i++) {
      if (String(rows[i][1]).trim() === udise && String(rows[i][7]).trim() === month) {
        existingRowIndex = i + 1;
        break;
      }
    }
    var rowData = [
      new Date().toISOString(), data.udiseNo, data.schoolName, data.schoolType,
      data.district, data.block, data.cluster, data.month,
      data.boysCount, data.girlsCount, data.totalEnrolment, JSON.stringify(data.criteriaData || {})
    ];
    if (existingRowIndex > 0) {
      sheet.getRange(existingRowIndex, 1, 1, rowData.length).setValues([rowData]);
    } else {
      sheet.appendRow(rowData);
    }
    return ContentService.createTextOutput(JSON.stringify({ status: "success" })).setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService.createTextOutput(JSON.stringify({ status: "error", message: err.toString() })).setMimeType(ContentService.MimeType.JSON);
  }
}`;

  const handleCopyCode = () => {
    navigator.clipboard.writeText(APPS_SCRIPT_CODE);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2500);
  };

  return (
    <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-xs z-50 flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="bg-gradient-to-r from-emerald-700 to-teal-800 text-white p-4 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-white/10 rounded-lg">
              <FileSpreadsheet className="w-5 h-5 text-emerald-200" />
            </div>
            <div>
              <h2 className="text-base font-bold">
                {isMarathi ? 'गूगल शीट लिंक (Google Sheet Link)' : 'Google Sheet URL Setting'}
              </h2>
              <p className="text-xs text-emerald-100/90">
                {isMarathi
                  ? 'येथे फक्त तुमच्या गूगल शीटची पेस्ट लिंक टाका'
                  : 'Paste your Google Sheet Web App URL here'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-white/80 hover:text-white hover:bg-white/10 rounded-lg transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-5 space-y-4">
          <div className="space-y-2">
            <label className="block text-xs font-bold text-slate-800">
              {isMarathi
                ? 'गूगल शीट वेब अ‍ॅप यूआरएल पेस्ट करा (Paste Sheet URL):'
                : 'Paste Google Sheet Web App / Sheet URL:'}
            </label>
            <input
              type="text"
              value={gasUrl}
              onChange={(e) => setGasUrl(e.target.value)}
              placeholder="https://script.google.com/macros/s/.../exec"
              className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm font-mono text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-600 shadow-xs"
            />
          </div>

          <div className="flex items-center gap-2 pt-1">
            <button
              onClick={handleSaveUrl}
              className="flex-1 bg-emerald-700 hover:bg-emerald-800 text-white font-bold px-4 py-2.5 rounded-xl text-xs sm:text-sm flex items-center justify-center gap-2 transition-all cursor-pointer shadow-sm"
            >
              <Save className="w-4 h-4" />
              {savedStatus
                ? isMarathi
                  ? 'जतन झाले! ✅'
                  : 'Saved! ✅'
                : isMarathi
                ? 'यूआरएल जतन करा (Save)'
                : 'Save Sheet URL'}
            </button>

            {gasUrl.trim() && (
              <button
                onClick={handleOpenSheet}
                className="bg-slate-800 hover:bg-slate-900 text-white font-bold px-4 py-2.5 rounded-xl text-xs sm:text-sm flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-sm shrink-0"
              >
                <ExternalLink className="w-4 h-4" />
                {isMarathi ? 'शीट उघडा' : 'Open Sheet'}
              </button>
            )}
          </div>

          {/* Optional Code Snippet Toggle */}
          <div className="border-t border-slate-200 pt-3">
            <button
              onClick={() => setShowScriptCode(!showScriptCode)}
              className="text-slate-500 hover:text-slate-800 text-xs font-semibold flex items-center gap-1.5 cursor-pointer py-1"
            >
              <span>{isMarathi ? 'अ‍ॅप्स स्क्रिप्ट कोड (Apps Script Code - Optional)' : 'Apps Script Code (Optional)'}</span>
              {showScriptCode ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
            </button>

            {showScriptCode && (
              <div className="mt-2 space-y-2 animate-in fade-in duration-150">
                <div className="flex items-center justify-between text-[11px] text-slate-600">
                  <span>Google Sheet &rarr; Extensions &rarr; Apps Script</span>
                  <button
                    onClick={handleCopyCode}
                    className="text-emerald-700 hover:text-emerald-800 font-bold flex items-center gap-1 cursor-pointer"
                  >
                    {copiedCode ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                    {copiedCode ? (isMarathi ? 'कॉपी झाले' : 'Copied') : (isMarathi ? 'कोड कॉपी करा' : 'Copy Code')}
                  </button>
                </div>
                <pre className="bg-slate-900 text-emerald-300 font-mono text-[10px] p-2.5 rounded-lg overflow-x-auto max-h-36 border border-slate-800">
                  {APPS_SCRIPT_CODE}
                </pre>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="bg-slate-50 border-t border-slate-200 p-3 flex justify-end">
          <button
            onClick={onClose}
            className="bg-slate-200 hover:bg-slate-300 text-slate-800 text-xs px-4 py-1.5 rounded-lg font-bold transition-colors cursor-pointer"
          >
            {isMarathi ? 'बंद करा' : 'Close'}
          </button>
        </div>
      </div>
    </div>
  );
};

