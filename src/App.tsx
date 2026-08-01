import React, { useState, useEffect } from 'react';
import { ActiveTab, PortalMode, SchoolAssessmentSubmission } from './types';
import { getStoredSubmissions, resetToSeedData } from './utils/storage';
import { Navbar } from './components/Navbar';
import { SchoolForm } from './components/SchoolForm';
import { StateAdminView } from './components/StateAdminView';
import { DistrictAdminView } from './components/DistrictAdminView';
import { ClusterAdminView } from './components/ClusterAdminView';
import { SchoolSearchModal } from './components/SchoolSearchModal';
import { AdminLoginModal } from './components/AdminLoginModal';
import { GoogleSheetsIntegrationModal } from './components/GoogleSheetsIntegrationModal';

export default function App() {
  const [portalMode, setPortalMode] = useState<PortalMode>('user');
  const [activeTab, setActiveTab] = useState<ActiveTab>('form');
  const [lang, setLang] = useState<'mr' | 'en'>('mr');
  const [submissions, setSubmissions] = useState<SchoolAssessmentSubmission[]>([]);

  // Admin authentication state
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState<boolean>(false);
  const [isAdminLoginModalOpen, setIsAdminLoginModalOpen] = useState<boolean>(false);

  // Google Sheets Integration modal state
  const [isGoogleSheetsModalOpen, setIsGoogleSheetsModalOpen] = useState<boolean>(false);

  // Selected hierarchy states for drill-down navigation
  const [selectedDistrict, setSelectedDistrict] = useState<string>('पुणे (Pune)');
  const [selectedBlock, setSelectedBlock] = useState<string>('हवेली (Haveli)');
  const [selectedCluster, setSelectedCluster] = useState<string>(
    'खडकवासला केंद्र (Khadakwasla Center)'
  );

  // Load submissions from storage on mount
  const refreshData = () => {
    const data = getStoredSubmissions();
    setSubmissions(data);
  };

  useEffect(() => {
    refreshData();
  }, []);

  const handleResetData = () => {
    const confirmText =
      lang === 'mr'
        ? 'नमुना डेटा पूर्ववत करायचा आहे का?'
        : 'Are you sure you want to reset to initial seed data?';

    if (window.confirm(confirmText)) {
      const fresh = resetToSeedData();
      setSubmissions(fresh);
    }
  };

  const handleAdminLoginSuccess = () => {
    setIsAdminAuthenticated(true);
    setIsAdminLoginModalOpen(false);
    setPortalMode('admin');
    setActiveTab('state-admin');
  };

  const handleAdminLogout = () => {
    setIsAdminAuthenticated(false);
    setPortalMode('user');
    setActiveTab('form');
  };

  const handleOpenAdminLogin = () => {
    if (isAdminAuthenticated) {
      setPortalMode('admin');
      setActiveTab('state-admin');
    } else {
      setIsAdminLoginModalOpen(true);
    }
  };

  const handleNavigateToDistrict = (districtName: string) => {
    setSelectedDistrict(districtName);
    if (isAdminAuthenticated) {
      setPortalMode('admin');
      setActiveTab('district-admin');
    } else {
      setIsAdminLoginModalOpen(true);
    }
  };

  const handleNavigateToCluster = (
    district: string,
    block: string,
    cluster: string
  ) => {
    setSelectedDistrict(district);
    setSelectedBlock(block);
    setSelectedCluster(cluster);
    if (isAdminAuthenticated) {
      setPortalMode('admin');
      setActiveTab('cluster-admin');
    } else {
      setIsAdminLoginModalOpen(true);
    }
  };

  // Safe tab switcher that enforces login for admin views
  const handleTabChange = (tab: ActiveTab) => {
    const isAdminTab = tab === 'state-admin' || tab === 'district-admin' || tab === 'cluster-admin';
    if (isAdminTab && !isAdminAuthenticated) {
      setIsAdminLoginModalOpen(true);
      return;
    }
    setActiveTab(tab);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans flex flex-col selection:bg-blue-600 selection:text-white">
      {/* Top Navbar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={handleTabChange}
        portalMode={portalMode}
        setPortalMode={setPortalMode}
        isAdminAuthenticated={isAdminAuthenticated}
        onOpenAdminLogin={handleOpenAdminLogin}
        onAdminLogout={handleAdminLogout}
        lang={lang}
        setLang={setLang}
        onResetData={handleResetData}
        totalSubmissionsCount={submissions.length}
        onOpenGoogleSheetsModal={() => setIsGoogleSheetsModalOpen(true)}
      />

      {/* Admin Login Password Modal */}
      <AdminLoginModal
        isOpen={isAdminLoginModalOpen}
        onClose={() => setIsAdminLoginModalOpen(false)}
        onLoginSuccess={handleAdminLoginSuccess}
        lang={lang}
      />

      {/* Google Sheets Integration & Cloudflare Setup Modal */}
      <GoogleSheetsIntegrationModal
        isOpen={isGoogleSheetsModalOpen}
        onClose={() => setIsGoogleSheetsModalOpen(false)}
        lang={lang}
      />

      {/* Main Content Area */}
      <main className="flex-1 pb-16">
        {activeTab === 'form' && (
          <SchoolForm lang={lang} onSubmissionSuccess={refreshData} />
        )}

        {activeTab === 'state-admin' && isAdminAuthenticated && (
          <StateAdminView
            submissions={submissions}
            lang={lang}
            onSelectDistrict={handleNavigateToDistrict}
          />
        )}

        {activeTab === 'district-admin' && isAdminAuthenticated && (
          <DistrictAdminView
            submissions={submissions}
            selectedDistrictName={selectedDistrict}
            setSelectedDistrictName={setSelectedDistrict}
            lang={lang}
            onNavigateToCluster={handleNavigateToCluster}
          />
        )}

        {activeTab === 'cluster-admin' && isAdminAuthenticated && (
          <ClusterAdminView
            submissions={submissions}
            selectedDistrict={selectedDistrict}
            setSelectedDistrict={setSelectedDistrict}
            selectedBlock={selectedBlock}
            setSelectedBlock={setSelectedBlock}
            selectedCluster={selectedCluster}
            setSelectedCluster={setSelectedCluster}
            lang={lang}
          />
        )}

        {activeTab === 'search' && (
          <SchoolSearchModal submissions={submissions} lang={lang} />
        )}
      </main>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-400 py-6 border-t border-slate-800 text-xs">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p className="font-medium text-slate-300">
            {lang === 'mr'
              ? 'महाराष्ट्र शासन - शालेय शिक्षण व क्रीडा विभाग | विद्या प्रवेश इयत्ता पहिली आढावा पोर्टल'
              : 'Govt of Maharashtra - School Education & Sports Department | Vidya Pravesh Portal'}
          </p>
          <div className="flex items-center gap-3">
            {!isAdminAuthenticated ? (
              <button
                onClick={handleOpenAdminLogin}
                className="text-blue-400 hover:underline font-bold text-xs cursor-pointer"
              >
                {lang === 'mr' ? 'प्रशासन विभाग लॉगिन' : 'Admin Portal Access'}
              </button>
            ) : (
              <button
                onClick={handleAdminLogout}
                className="text-rose-400 hover:underline font-bold text-xs cursor-pointer"
              >
                {lang === 'mr' ? 'लॉगआउट करा' : 'Logout Admin'}
              </button>
            )}
            <span className="text-slate-600">|</span>
            <p className="text-slate-500 text-[11px]">
              {lang === 'mr'
                ? '१.२ लाख+ शाळांसाठी ऑनलाइन डेटा संकलन दालन'
                : 'Online Data Collection System for 1.2 Lakh+ Schools'}
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

