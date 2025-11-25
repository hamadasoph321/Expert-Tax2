import React from 'react';
import { Link } from 'react-router-dom';
import { CATEGORIES } from '../constants';
import { ArrowLeftRight, Search } from 'lucide-react';

const Home: React.FC = () => {
  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      
      {/* Hero Section */}
      <div className="text-center py-8">
        <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">مرحباً بك في الخبير الضريبي</h2>
        <p className="text-slate-500 dark:text-slate-400 max-w-2xl mx-auto">
          المرجع الشامل للقوانين، التعليمات، والفتاوى الضريبية. اختر قسماً للبدء أو استخدم البحث الشامل.
        </p>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {CATEGORIES.map((cat) => {
          const Icon = cat.icon;
          return (
            <Link 
              key={cat.id} 
              to={`/category/${cat.id}`}
              className="group bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 p-6 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 relative overflow-hidden"
            >
              <div className={`absolute top-0 left-0 w-2 h-full ${cat.color} opacity-80`} />
              
              <div className="flex items-start justify-between mb-4">
                <div className={`p-4 rounded-xl ${cat.color} bg-opacity-10 text-opacity-100 dark:bg-opacity-20`}>
                   <Icon className={`w-8 h-8 ${cat.color.replace('bg-', 'text-')}`} />
                </div>
              </div>

              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2 group-hover:text-blue-700 dark:group-hover:text-blue-400 transition-colors">
                {cat.title}
              </h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                {cat.description}
              </p>
            </Link>
          );
        })}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8 max-w-4xl mx-auto">
        <Link to="/compare" className="bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-100 dark:border-indigo-800/50 p-6 rounded-xl flex items-center gap-4 hover:bg-indigo-100 dark:hover:bg-indigo-900/40 transition-colors">
          <div className="bg-indigo-600 text-white p-3 rounded-lg shadow-lg shadow-indigo-200 dark:shadow-none shrink-0">
            <ArrowLeftRight size={24} />
          </div>
          <div>
            <h4 className="text-lg font-bold text-indigo-900 dark:text-indigo-200">أداة المقارنة</h4>
            <p className="text-indigo-700 dark:text-indigo-300 text-sm">قارن بين مستندين جنباً إلى جنب</p>
          </div>
        </Link>

        <Link to="/search" className="bg-slate-100 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 p-6 rounded-xl flex items-center gap-4 hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors">
          <div className="bg-slate-700 dark:bg-slate-600 text-white p-3 rounded-lg shadow-lg shadow-slate-300 dark:shadow-none shrink-0">
            <Search size={24} />
          </div>
          <div>
            <h4 className="text-lg font-bold text-slate-900 dark:text-slate-100">البحث المتقدم</h4>
            <p className="text-slate-600 dark:text-slate-400 text-sm">بحث في كامل قاعدة البيانات</p>
          </div>
        </Link>
      </div>
    </div>
  );
};

export default Home;