import React from 'react';
import { ActiveTab, PortalMode } from '../types';
import {
  FileText,
  Building2,
  MapPin,
  School,
  Search,
  RotateCcw,
  ShieldCheck,
  ArrowLeft,
  LayoutDashboard,
  Download,
} from 'lucide-react';

interface NavbarProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  portalMode: PortalMode;
  setPortalMode: (mode: PortalMode) => void;
  isAdminAuthenticated: boolean;
  onOpenAdminLogin: () => void;
  onAdminLogout: () => void;
  lang: 'mr' | 'en';
  setLang: (lang: 'mr' | 'en') => void;
  onResetData: () => void;
  totalSubmissionsCount: number;
  onOpenGoogleSheetsModal?: () => void;
  onExportExcel?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  portalMode,
  setPortalMode,
  isAdminAuthenticated,
  onOpenAdminLogin,
  onAdminLogout,
  lang,
  setLang,
  onResetData,
  totalSubmissionsCount,
  onExportExcel,
}) => {
  const isMarathi = lang === 'mr';

  // Distinct User Form Nav Items (Standard users only see form & search status)
  const userNavItems = [
    {
      id: 'form' as ActiveTab,
      labelMarathi: 'शाळा माहिती अर्ज',
      labelEnglish: 'School Entry Form',
      icon: FileText,
    },
    {
      id: 'search' as ActiveTab,
      labelMarathi: 'शाळा शोधा व पडताळणी',
      labelEnglish: 'Search School Status',
      icon: Search,
    },
  ];

  // Admin Portal Nav Items (ONLY unlocked after successful User ID + Password login)
  const adminNavItems = [
    {
      id: 'state-admin' as ActiveTab,
      labelMarathi: 'राज्य स्तर आढावा',
      labelEnglish: 'State Overview',
      icon: Building2,
    },
    {
      id: 'district-admin' as ActiveTab,
      labelMarathi: 'जिल्हा प्रशासन',
      labelEnglish: 'District Dashboard',
      icon: MapPin,
    },
    {
      id: 'cluster-admin' as ActiveTab,
      labelMarathi: 'केंद्र / क्लस्टर',
      labelEnglish: 'Cluster Insights',
      icon: School,
    },
    {
      id: 'search' as ActiveTab,
      labelMarathi: 'शाळा शोध',
      labelEnglish: 'Search Records',
      icon: Search,
    },
  ];

  // Navigation items based on actual admin authentication
  const currentNavItems = isAdminAuthenticated && portalMode === 'admin'
    ? adminNavItems
    : userNavItems;

  const handleSwitchToUser = () => {
    setPortalMode('user');
    setActiveTab('form');
  };

  return (
    <header className="bg-white border-b border-slate-200 text-slate-900 sticky top-0 z-50 shadow-xs">
      {/* Top Banner Bar with Portal Mode Indicator */}
      <div
        className={`px-4 py-1.5 text-xs font-medium flex items-center justify-between text-white ${
          isAdminAuthenticated && portalMode === 'admin'
            ? 'bg-slate-900 border-b border-slate-800'
            : 'bg-slate-900'
        }`}
      >
        <div className="flex items-center gap-2 max-w-7xl mx-auto w-full">
          <span className="inline-block bg-blue-600 text-white text-[10px] px-2 py-0.5 rounded font-bold uppercase tracking-wider">
            महाराष्ट्र शासन
          </span>

          {isAdminAuthenticated && portalMode === 'admin' ? (
            <span className="inline-flex items-center gap-1.5 bg-amber-500/20 text-amber-300 text-[11px] px-2 py-0.5 rounded font-bold border border-amber-500/30">
              <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
              <span>
                {isMarathi ? 'प्रशासकीय सनियंत्रण दालन' : 'Admin Monitoring Portal'}
              </span>
            </span>
          ) : (
            <span className="hidden sm:inline text-slate-300">
              {isMarathi
                ? 'शालेय शिक्षण व क्रीडा विभाग | विद्या प्रवेश - इयत्ता पहिली डेटा नोंदणी'
                : 'School Education & Sports Dept | Vidya Pravesh - Class 1 School Form'}
            </span>
          )}

          <span className="sm:hidden text-slate-300 text-[11px] truncate">
            विद्या प्रवेश पोर्टल
          </span>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={() => setLang(isMarathi ? 'en' : 'mr')}
            className="hover:bg-slate-800 bg-slate-800/80 px-2.5 py-0.5 rounded text-slate-200 font-semibold transition-colors flex items-center gap-1 text-[11px] border border-slate-700 cursor-pointer"
            title="Toggle Language"
          >
            <span>🌐</span> {isMarathi ? 'English' : 'मराठी'}
          </button>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          {/* Logo & Title */}
          <div
            onClick={handleSwitchToUser}
            className="flex items-center gap-3 cursor-pointer group shrink-0"
          >
            <div className="w-8 h-8 rounded bg-blue-600 flex items-center justify-center text-white font-bold text-lg shadow-sm group-hover:scale-105 transition-transform">
              M
            </div>
            <div>
              <h1 className="text-base sm:text-lg font-bold leading-tight text-slate-900 tracking-tight group-hover:text-blue-600 transition-colors">
                {isMarathi
                  ? 'विद्या प्रवेश - इयत्ता पहिली आढावा'
                  : 'MahaStats | Vidya Pravesh'}
              </h1>
              <p className="text-[11px] text-slate-500 hidden sm:block font-medium uppercase tracking-wider">
                {isAdminAuthenticated && portalMode === 'admin'
                  ? isMarathi
                    ? 'राज्य, जिल्हा व केंद्र प्रशासन दालन'
                    : 'State, District & Cluster Admin Portal'
                  : isMarathi
                  ? 'शाळा डेटा नोंदणी व शोध प्रणाली'
                  : 'School Data Entry & Verification Portal'}
              </p>
            </div>
          </div>

          {/* Navigation Items - Desktop */}
          <nav className="hidden lg:flex items-center gap-1">
            {currentNavItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-sm font-medium transition-all cursor-pointer ${
                    isActive
                      ? 'bg-blue-50 text-blue-700 font-bold shadow-xs'
                      : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{isMarathi ? item.labelMarathi : item.labelEnglish}</span>
                </button>
              );
            })}
          </nav>

          {/* Right Portal Switcher / Admin Login Buttons */}
          <div className="flex items-center gap-2.5 shrink-0">
            {!isAdminAuthenticated ? (
              <button
                onClick={onOpenAdminLogin}
                className="bg-slate-900 hover:bg-slate-800 text-white px-3.5 py-2 rounded-lg text-xs font-bold transition-all shadow-xs flex items-center gap-2 cursor-pointer border border-slate-800"
                title={
                  isMarathi
                    ? 'प्रशासकीय युझर आयडी आणि पासवर्डसह लॉगिन करा'
                    : 'Admin Login with User ID & Password'
                }
              >
                <LayoutDashboard className="w-4 h-4 text-blue-400" />
                <span>{isMarathi ? 'प्रशासन लॉगिन' : 'Admin Login'}</span>
              </button>
            ) : (
              <div className="flex items-center gap-2">
                <button
                  onClick={onAdminLogout}
                  className="bg-slate-100 hover:bg-rose-50 hover:text-rose-700 text-slate-700 px-3.5 py-2 rounded-lg text-xs font-bold transition-all border border-slate-200 flex items-center gap-1.5 cursor-pointer"
                  title={isMarathi ? 'लॉगआउट करा' : 'Logout Admin'}
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>{isMarathi ? 'लॉगआउट' : 'Logout'}</span>
                </button>
              </div>
            )}

            <span className="hidden md:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-100 text-slate-700 border border-slate-200 text-xs font-medium">
              <span className="w-2 h-2 rounded-full bg-blue-600 animate-pulse"></span>
              <span>
                {isMarathi ? 'एकूण नोंदणी:' : 'Synced:'}{' '}
                <strong className="text-blue-600 font-bold">
                  {totalSubmissionsCount}
                </strong>
              </span>
            </span>

            {onExportExcel && isAdminAuthenticated && (
              <button
                onClick={onExportExcel}
                className="bg-emerald-700 hover:bg-emerald-800 text-white font-bold px-2.5 py-1.5 rounded-lg transition-colors text-xs flex items-center gap-1.5 cursor-pointer shadow-xs border border-emerald-600"
                title={
                  isMarathi
                    ? 'सर्व डेटा एक्ससेल शीट मध्ये डाउनलोड करा (प्रशासकांसाठी)'
                    : 'Export all data to Excel sheet (Admin Only)'
                }
              >
                <Download className="w-3.5 h-3.5 text-emerald-200" />
                <span className="hidden sm:inline">
                  {isMarathi ? '📊 एक्ससेल शीट (Admin)' : '📊 Excel Sheet (Admin)'}
                </span>
              </button>
            )}

            <button
              onClick={onResetData}
              className="p-2 text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors text-xs flex items-center gap-1 border border-slate-200 cursor-pointer"
              title={
                isMarathi ? 'डेटा रीसेट करा (Reset Sample Data)' : 'Reset Sample Data'
              }
            >
              <RotateCcw className="w-4 h-4" />
              <span className="hidden xl:inline">
                {isMarathi ? 'रीसेट' : 'Reset'}
              </span>
            </button>
          </div>
        </div>

        {/* Mobile Navigation Bar */}
        <div className="flex lg:hidden overflow-x-auto py-2 border-t border-slate-100 gap-1 scrollbar-none">
          {currentNavItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors shrink-0 ${
                  isActive
                    ? 'bg-blue-50 text-blue-700 font-bold'
                    : 'text-slate-600 bg-slate-50 hover:bg-slate-100'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{isMarathi ? item.labelMarathi : item.labelEnglish}</span>
              </button>
            );
          })}
        </div>
      </div>
    </header>
  );
};
