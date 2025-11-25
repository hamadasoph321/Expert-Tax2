import React, { useState } from 'react';
import { useData } from '../context/DataContext';
import { CATEGORIES } from '../constants';
import DocumentList from '../components/DocumentList';
import { Search, SlidersHorizontal, X } from 'lucide-react';

const SearchPage: React.FC = () => {
  const [query, setQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<string>('all');
  const { documents } = useData();

  const filteredDocs = documents.filter(doc => {
    // Category Filter
    if (activeFilter !== 'all' && doc.category !== activeFilter) return false;
    
    // Text Filter
    if (!query) return false;
    const q = query.toLowerCase();
    return (
      doc.title.toLowerCase().includes(q) ||
      (doc.description?.toLowerCase().includes(q) ?? false) ||
      (doc.tags?.some(t => t.toLowerCase().includes(q)) ?? false)
    );
  });

  return (
    <div className="space-y-6">
      
      {/* Search Header */}
      <div className="bg-white dark:bg-slate-800 p-8 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 text-center transition-colors">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">البحث الشامل</h2>
        
        <div className="max-w-2xl mx-auto relative">
          <input 
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="ابحث عن قانون، فتوى، أو تعليمات..."
            className="w-full pl-4 pr-12 py-4 text-lg rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 dark:focus:ring-blue-500/20 outline-none transition-all shadow-sm placeholder:text-slate-400"
            autoFocus
          />
          <div className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400">
            <Search size={24} />
          </div>
          {query && (
            <button 
              onClick={() => setQuery('')}
              className="absolute left-4 top-1/2 -translate-y-1/2 p-1 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 rounded-full text-slate-500 dark:text-slate-300 transition-colors"
            >
              <X size={16} />
            </button>
          )}
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-6">
        
        {/* Sidebar Filters */}
        <div className="w-full md:w-64 flex-shrink-0 space-y-4">
          <div className="bg-white dark:bg-slate-800 p-4 rounded-xl border border-slate-200 dark:border-slate-700 sticky top-24 transition-colors">
            <div className="flex items-center gap-2 font-bold text-slate-800 dark:text-white mb-4 pb-2 border-b border-slate-100 dark:border-slate-700">
              <SlidersHorizontal size={18} />
              <span>تصفية النتائج</span>
            </div>
            
            <div className="space-y-1">
              <button 
                onClick={() => setActiveFilter('all')}
                className={`w-full text-right px-3 py-2 rounded-lg text-sm transition-colors ${activeFilter === 'all' ? 'bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300 font-medium' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700'}`}
              >
                جميع الأقسام
              </button>
              {CATEGORIES.map(cat => (
                <button 
                  key={cat.id}
                  onClick={() => setActiveFilter(cat.id)}
                  className={`w-full text-right px-3 py-2 rounded-lg text-sm transition-colors ${activeFilter === cat.id ? 'bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300 font-medium' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700'}`}
                >
                  {cat.title}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Results Area */}
        <div className="flex-grow">
          {query ? (
            <>
              <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-4">
                نتائج البحث ({filteredDocs.length})
              </h3>
              <DocumentList documents={filteredDocs} type="search" />
            </>
          ) : (
             <div className="text-center py-12 text-slate-400 dark:text-slate-600">
               <Search size={48} className="mx-auto mb-4 opacity-20" />
               <p>ابدأ الكتابة للبحث في قاعدة البيانات</p>
             </div>
          )}
        </div>

      </div>

    </div>
  );
};

export default SearchPage;