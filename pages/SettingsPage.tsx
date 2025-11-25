import React from 'react';
import { Moon, Bell, Database, Info, ChevronRight, Shield, Sun } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { useNavigate } from 'react-router-dom';

const SettingsPage: React.FC = () => {
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">الإعدادات</h2>

      {/* Preferences */}
      <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden transition-colors">
        <div className="p-4 bg-slate-50 dark:bg-slate-900 border-b border-slate-100 dark:border-slate-700 font-medium text-slate-700 dark:text-slate-300">
          التفضيلات العامة
        </div>
        <div className="divide-y divide-slate-100 dark:divide-slate-700">
          <div className="p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-slate-100 dark:bg-slate-700 rounded-lg text-slate-600 dark:text-slate-200">
                {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
              </div>
              <div>
                <p className="font-medium text-slate-800 dark:text-white">الوضع {theme === 'dark' ? 'النهاري' : 'الليلي'}</p>
                <p className="text-xs text-slate-500 dark:text-slate-400">تغيير مظهر التطبيق للألوان {theme === 'dark' ? 'الفاتحة' : 'الداكنة'}</p>
              </div>
            </div>
            <button 
              onClick={toggleTheme}
              className={`w-12 h-6 rounded-full relative transition-colors duration-300 focus:outline-none ${theme === 'dark' ? 'bg-indigo-600' : 'bg-slate-200'}`}
            >
              <div className={`w-5 h-5 bg-white rounded-full shadow absolute top-0.5 transition-transform duration-300 ${theme === 'dark' ? 'left-0.5 translate-x-0' : 'left-0.5 translate-x-6'}`}></div>
            </button>
          </div>

          <div className="p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-slate-100 dark:bg-slate-700 rounded-lg text-slate-600 dark:text-slate-200"><Bell size={20} /></div>
              <div>
                <p className="font-medium text-slate-800 dark:text-white">الإشعارات</p>
                <p className="text-xs text-slate-500 dark:text-slate-400">تنبيهات بالقرارات والتعليمات الجديدة</p>
              </div>
            </div>
            <div className="w-12 h-6 bg-blue-600 rounded-full relative cursor-pointer opacity-70">
              <div className="w-5 h-5 bg-white rounded-full shadow absolute top-0.5 right-0.5"></div>
            </div>
          </div>
        </div>
      </div>

      {/* System */}
      <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden transition-colors">
        <div className="p-4 bg-slate-50 dark:bg-slate-900 border-b border-slate-100 dark:border-slate-700 font-medium text-slate-700 dark:text-slate-300">
          النظام والبيانات
        </div>
        <div className="divide-y divide-slate-100 dark:divide-slate-700">
          <button 
            onClick={() => navigate('/manage-data')}
            className="w-full p-4 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-750 transition-colors text-right"
          >
            <div className="flex items-center gap-3">
              <div className="p-2 bg-slate-100 dark:bg-slate-700 rounded-lg text-slate-600 dark:text-slate-200"><Database size={20} /></div>
              <div>
                <p className="font-medium text-slate-800 dark:text-white">إدارة وتحديث البيانات</p>
                <p className="text-xs text-slate-500 dark:text-slate-400">إضافة قوانين وتعليمات جديدة للنظام</p>
              </div>
            </div>
            <ChevronRight size={18} className="text-slate-400 rotate-180" />
          </button>
          
           <button className="w-full p-4 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-750 transition-colors text-right">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-slate-100 dark:bg-slate-700 rounded-lg text-slate-600 dark:text-slate-200"><Shield size={20} /></div>
              <div>
                <p className="font-medium text-slate-800 dark:text-white">سياسة الخصوصية</p>
              </div>
            </div>
            <ChevronRight size={18} className="text-slate-400 rotate-180" />
          </button>
        </div>
      </div>

      {/* About */}
      <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm p-6 text-center transition-colors">
        <div className="w-16 h-16 bg-blue-600 text-white rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-blue-200 dark:shadow-none">
          <Info size={32} />
        </div>
        <h3 className="text-xl font-bold text-slate-900 dark:text-white">Expert Tax v1.1.0</h3>
        <p className="text-slate-500 dark:text-slate-400 mb-4">الخبير الضريبي - المساعد الذكي لموظفي الضرائب</p>
        <p className="text-xs text-slate-400 dark:text-slate-500">
          تصميم وتطوير لصالح مصلحة الضرائب المصرية.<br/>
          جميع الحقوق محفوظة © 2024
        </p>
      </div>

    </div>
  );
};

export default SettingsPage;