import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Search, Settings, Home, ArrowRight } from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();

  const isHome = location.pathname === '/';

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col text-slate-800 dark:text-slate-100 transition-colors duration-300">
      {/* Top Header */}
      <header className="bg-white dark:bg-slate-900 shadow-sm sticky top-0 z-50 border-b border-slate-200 dark:border-slate-800 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            {!isHome && (
              <button 
                onClick={() => navigate(-1)}
                className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 transition-colors"
                aria-label="Back"
              >
                <ArrowRight size={20} />
              </button>
            )}
            <Link to="/" className="flex items-center gap-2 group">
              <div className="bg-slate-900 dark:bg-indigo-600 text-white p-1.5 rounded-lg group-hover:bg-slate-800 dark:group-hover:bg-indigo-700 transition-colors">
                <Home size={20} />
              </div>
              <div>
                <h1 className="text-xl font-bold text-slate-900 dark:text-white leading-none">Expert Tax</h1>
                <span className="text-xs text-slate-500 dark:text-slate-400 font-medium tracking-wide">الخبير الضريبي</span>
              </div>
            </Link>
          </div>

          <div className="flex items-center gap-2">
            <Link 
              to="/search" 
              className="p-2 text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors flex items-center gap-2"
              title="بحث عام"
            >
              <Search size={20} />
              <span className="hidden md:inline text-sm font-medium">بحث شامل</span>
            </Link>
            <div className="h-6 w-px bg-slate-200 dark:bg-slate-700 mx-1"></div>
            <Link 
              to="/settings"
              className="p-2 text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors"
              title="الإعدادات"
            >
              <Settings size={20} />
            </Link>
            <div className="h-8 w-8 bg-blue-100 dark:bg-slate-700 text-blue-700 dark:text-blue-300 rounded-full flex items-center justify-center text-sm font-bold border border-blue-200 dark:border-slate-600 ml-2">
              م.أ
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 py-6 mt-auto transition-colors">
        <div className="max-w-7xl mx-auto px-4 text-center text-slate-400 dark:text-slate-500 text-sm">
          <p>© {new Date().getFullYear()} Expert Tax - الخبير الضريبي. جميع الحقوق محفوظة.</p>
        </div>
      </footer>
    </div>
  );
};

export default Layout;