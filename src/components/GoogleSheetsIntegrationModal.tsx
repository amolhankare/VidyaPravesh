import React, { useState, useEffect } from 'react';
import {
  FileSpreadsheet,
  Cloud,
  Check,
  Copy,
  ExternalLink,
  Save,
  X,
  Server,
  Zap,
  ShieldCheck,
  HelpCircle,
  Globe,
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
  const [copiedCode, setCopiedCode] = useState<boolean>(false);
  const [copiedCloudflare, setCopiedCloudflare] = useState<boolean>(false);
  const [savedStatus, setSavedStatus] = useState<boolean>(false);

  useEffect(() => {
    if (isOpen) {
      setGasUrl(getGoogleAppsScriptUrl() || '');
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const APPS_SCRIPT_CODE = `// ========================================================
// 🏫 विद्या प्रवेश (Vidya Pravesh) - Google Apps Script
// Paste this code in Google Sheet -> Extensions -> Apps Script
// ========================================================

function doPost(e) {
  try {
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    var data = JSON.parse(e.postData.contents);
    
    // Auto-create headers if sheet is brand new
    if (sheet.getLastRow() === 0) {
      sheet.appendRow([
        "Timestamp",
        "UDISE No",
        "School Name",
        "School Type",
        "District",
        "Block",
        "Cluster",
        "Month",
        "Boys Enrolled",
        "Girls Enrolled",
        "Total Enrolled",
        "Assessment Criteria Data (JSON)"
      ]);
    }
    
    var udise = String(data.udiseNo || '').trim();
    var month = String(data.month || '').trim();
    var rows = sheet.getDataRange().getValues();
    var existingRowIndex = -1;
    
    // Check if UDISE + Month record already exists to UPDATE (no duplicates)
    for (var i = 1; i < rows.length; i++) {
      if (String(rows[i][1]).trim() === udise && String(rows[i][7]).trim() === month) {
        existingRowIndex = i + 1; // 1-based index
        break;
      }
    }
    
    var rowData = [
      new Date().toISOString(),
      data.udiseNo,
      data.schoolName,
      data.schoolType,
      data.district,
      data.block,
      data.cluster,
      data.month,
      data.boysCount,
      data.girlsCount,
      data.totalEnrolment,
      JSON.stringify(data.criteriaData || {})
    ];
    
    if (existingRowIndex > 0) {
      // Update existing row
      sheet.getRange(existingRowIndex, 1, 1, rowData.length).setValues([rowData]);
      return ContentService.createTextOutput(JSON.stringify({ status: "success", action: "updated" }))
        .setMimeType(ContentService.MimeType.JSON);
    } else {
      // Append new row
      sheet.appendRow(rowData);
      return ContentService.createTextOutput(JSON.stringify({ status: "success", action: "appended" }))
        .setMimeType(ContentService.MimeType.JSON);
    }
  } catch (err) {
    return ContentService.createTextOutput(JSON.stringify({ status: "error", message: err.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

function doGet(e) {
  try {
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    var rows = sheet.getDataRange().getValues();
    if (rows.length <= 1) {
      return ContentService.createTextOutput(JSON.stringify([])).setMimeType(ContentService.MimeType.JSON);
    }
    var result = [];
    for (var i = 1; i < rows.length; i++) {
      var row = rows[i];
      result.push({
        submittedAt: row[0],
        udiseNo: String(row[1]),
        schoolName: row[2],
        schoolType: row[3],
        district: row[4],
        block: row[5],
        cluster: row[6],
        month: row[7],
        boysCount: Number(row[8] || 0),
        girlsCount: Number(row[9] || 0),
        totalEnrolment: Number(row[10] || 0),
        criteriaData: row[11] ? JSON.parse(row[11]) : {}
      });
    }
    return ContentService.createTextOutput(JSON.stringify(result)).setMimeType(ContentService.MimeType.JSON);
  } catch(err) {
    return ContentService.createTextOutput(JSON.stringify([])).setMimeType(ContentService.MimeType.JSON);
  }
}`;

  const CLOUDFLARE_GUIDE = `# Cloudflare Pages Build Settings:
1. Build Command: npm run build
2. Build Output Directory: dist
3. Node Version: 18 or 20`;

  const handleCopyCode = () => {
    navigator.clipboard.writeText(APPS_SCRIPT_CODE);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2500);
  };

  const handleSaveUrl = () => {
    saveGoogleAppsScriptUrl(gasUrl.trim());
    setSavedStatus(true);
    setTimeout(() => setSavedStatus(false), 2500);
  };

  return (
    <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-xs z-50 flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="bg-white w-full max-w-3xl rounded-2xl shadow-2xl border border-slate-200 overflow-hidden my-auto max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="bg-gradient-to-r from-emerald-700 via-teal-700 to-emerald-800 text-white p-4 sm:p-5 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-white/10 rounded-xl backdrop-blur-md">
              <FileSpreadsheet className="w-6 h-6 text-emerald-200" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-bold">
                  {isMarathi
                    ? '१००% मोफत सेटअप: Google Sheet + Cloudflare Pages'
                    : '100% Free Setup: Google Sheets + Cloudflare Pages'}
                </h2>
                <span className="bg-emerald-400/20 border border-emerald-300/40 text-emerald-100 text-[10px] font-extrabold px-2 py-0.5 rounded-full uppercase tracking-wider">
                  Cost: ₹0 / Free
                </span>
              </div>
              <p className="text-xs text-emerald-100/90 mt-0.5">
                {isMarathi
                  ? 'कोणताही खर्च न करता अमर्याद डेटा Google Sheet मध्ये सुरक्षित साठवा.'
                  : 'Store unlimited submissions directly in Google Sheets without paying any server cost.'}
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
        <div className="p-4 sm:p-6 overflow-y-auto space-y-6 text-slate-700 text-xs sm:text-sm">
          {/* Cost Summary Box */}
          <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 flex items-start gap-3">
            <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
            <div>
              <h4 className="font-bold text-emerald-950 text-xs sm:text-sm">
                {isMarathi
                  ? 'तुमचा महिना खर्च: ₹० (0 Rupees / Lifetime Free)'
                  : 'Your Monthly Operational Cost: $0.00 / Month (Lifetime Free)'}
              </h4>
              <p className="text-emerald-800 text-xs mt-1 leading-relaxed">
                • <strong>Cloudflare Pages Hosting:</strong> Free (Unlimited static bandwith & free SSL).<br />
                • <strong>Google Sheets Database API:</strong> Free with any standard Google Account.<br />
                • <strong>UDISE Duplicate Protection:</strong> Pre-built in Google Apps Script below.
              </p>
            </div>
          </div>

          {/* STEP 1: Google Sheet Script */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-slate-900 flex items-center gap-2 text-sm sm:text-base">
                <span className="bg-emerald-700 text-white w-6 h-6 rounded-full inline-flex items-center justify-center text-xs">
                  1
                </span>
                {isMarathi
                  ? 'गूगल शीट (Google Sheet) मध्ये स्क्रिप्ट टाका (Code Copy)'
                  : 'Add Google Apps Script to your Google Sheet'}
              </h3>
              <button
                onClick={handleCopyCode}
                className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs px-3 py-1.5 rounded-lg font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                {copiedCode ? (
                  <>
                    <Check className="w-3.5 h-3.5" /> {isMarathi ? 'कॉपी झाले!' : 'Copied!'}
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" /> {isMarathi ? 'कोड कॉपी करा' : 'Copy Script Code'}
                  </>
                )}
              </button>
            </div>

            <ol className="list-decimal list-inside space-y-1 text-slate-600 text-xs leading-relaxed bg-slate-50 p-3 rounded-lg border border-slate-200">
              <li>Open a new Google Sheet in your Google Drive.</li>
              <li>Click <strong>Extensions (विस्तार)</strong> &rarr; <strong>Apps Script</strong>.</li>
              <li>Delete all existing code, paste the copied script below, and click <strong>Save (💾)</strong>.</li>
              <li>Click <strong>Deploy</strong> &rarr; <strong>New deployment</strong> &rarr; Select type: <strong>Web app</strong>.</li>
              <li>Execute as: <strong>Me</strong> | Who has access: <strong>Anyone (कोणीही)</strong> &rarr; Click <strong>Deploy</strong>.</li>
              <li>Copy the generated <strong>Web App URL</strong> and paste it in Step 2 below.</li>
            </ol>

            <div className="relative bg-slate-900 text-emerald-300 font-mono text-[11px] p-3 rounded-xl overflow-x-auto max-h-48 border border-slate-800">
              <pre>{APPS_SCRIPT_CODE}</pre>
            </div>
          </div>

          {/* STEP 2: Configure Web App URL */}
          <div className="space-y-2 border-t border-slate-200 pt-4">
            <h3 className="font-bold text-slate-900 flex items-center gap-2 text-sm sm:text-base">
              <span className="bg-emerald-700 text-white w-6 h-6 rounded-full inline-flex items-center justify-center text-xs">
                2
              </span>
              {isMarathi
                ? 'येथे तुमचा Google Apps Script Web App URL लिंक करा'
                : 'Link your Google Apps Script Web App URL'}
            </h3>
            <p className="text-slate-600 text-xs">
              {isMarathi
                ? 'Deploy केल्यानंतर मिळालेली लिंक खाली टाकून Save करा. त्यानंतर अर्ज सबमिट करताच डेटा थेट तुमच्या Google Sheet मध्ये जमा होईल.'
                : 'Paste your deployed Web App URL below and click Save. Submissions will automatically sync to your Google Sheet!'}
            </p>

            <div className="flex flex-col sm:flex-row items-stretch gap-2 pt-1">
              <input
                type="text"
                value={gasUrl}
                onChange={(e) => setGasUrl(e.target.value)}
                placeholder="https://script.google.com/macros/s/AKfycb.../exec"
                className="flex-1 bg-slate-50 border border-slate-300 rounded-lg px-3.5 py-2 text-xs sm:text-sm font-mono text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-600"
              />
              <button
                onClick={handleSaveUrl}
                className="bg-emerald-700 hover:bg-emerald-800 text-white font-bold px-4 py-2 rounded-lg text-xs sm:text-sm flex items-center justify-center gap-1.5 transition-colors cursor-pointer shrink-0"
              >
                <Save className="w-4 h-4" />
                {savedStatus ? (isMarathi ? 'जतन झाले! ✅' : 'Saved! ✅') : (isMarathi ? 'यूआरएल जतन करा' : 'Save URL')}
              </button>
            </div>
          </div>

          {/* STEP 3: Cloudflare Pages Deployment Guide */}
          <div className="space-y-3 border-t border-slate-200 pt-4">
            <h3 className="font-bold text-slate-900 flex items-center gap-2 text-sm sm:text-base">
              <span className="bg-emerald-700 text-white w-6 h-6 rounded-full inline-flex items-center justify-center text-xs">
                3
              </span>
              {isMarathi
                ? 'क्लाउडफ्लेअर (Cloudflare Pages) वर मोफत होस्टिंग करण्याची पद्धत'
                : 'How to Publish on Cloudflare Pages (Free Hosting)'}
            </h3>

            <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 space-y-2 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <span className="font-bold text-slate-800 flex items-center gap-1">
                    <Globe className="w-3.5 h-3.5 text-blue-600" />
                    Option A: Connect GitHub (Automated)
                  </span>
                  <p className="text-slate-600 text-[11px]">
                    1. Push this project to GitHub.<br />
                    2. Go to <strong>Cloudflare Dashboard &rarr; Workers & Pages &rarr; Create Page</strong>.<br />
                    3. Connect GitHub repo, set Build command: <code className="bg-slate-200 px-1 py-0.5 rounded">npm run build</code>, Output dir: <code className="bg-slate-200 px-1 py-0.5 rounded">dist</code>.
                  </p>
                </div>

                <div className="space-y-1">
                  <span className="font-bold text-slate-800 flex items-center gap-1">
                    <Zap className="w-3.5 h-3.5 text-amber-600" />
                    Option B: Direct Direct Upload (No Git)
                  </span>
                  <p className="text-slate-600 text-[11px]">
                    1. Run <code className="bg-slate-200 px-1 py-0.5 rounded">npm run build</code> locally.<br />
                    2. Go to Cloudflare Pages &rarr; <strong>Upload assets</strong>.<br />
                    3. Drag and drop the <code className="bg-slate-200 px-1 py-0.5 rounded">dist</code> folder! Done!
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-slate-50 border-t border-slate-200 p-4 flex items-center justify-between shrink-0">
          <div className="text-[11px] text-slate-500 font-medium">
            💡 {isMarathi ? 'ऑफलाईन बॅकअप आणि ऑनलाईन शीट सिंक एकत्र काम करतील.' : 'Submissions run with dual local backup + Google Sheet sync.'}
          </div>
          <button
            onClick={onClose}
            className="bg-slate-800 hover:bg-slate-900 text-white text-xs px-4 py-2 rounded-lg font-bold transition-colors cursor-pointer"
          >
            {isMarathi ? 'बंद करा' : 'Close'}
          </button>
        </div>
      </div>
    </div>
  );
};
