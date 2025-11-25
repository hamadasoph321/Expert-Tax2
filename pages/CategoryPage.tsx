import React, { useState, useMemo } from 'react';
import { useParams, Navigate } from 'react-router-dom';
import { CATEGORIES } from '../constants';
import { useData } from '../context/DataContext';
import DocumentList from '../components/DocumentList';
import { Search, Filter } from 'lucide-react';

const CategoryPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [searchQuery, setSearchQuery] = useState('');
  const { documents } = useData();
  
  const categoryConfig = CATEGORIES.find(c => c.id === id);

  if (!categoryConfig) {
    return <Navigate to="/" replace />;
  }

  const filteredDocs = useMemo(() => {
    return documents.filter(doc => {
      if (doc.category !== id) return false;
      if (!searchQuery) return true;
      const q = searchQuery.toLowerCase();
      return (
        doc.title.toLowerCase().includes(q) ||
        (doc.description?.toLowerCase().includes(q) ?? false) ||
        (doc.tags?.some(t => t.toLowerCase().includes(q)) ?? false) ||
        (doc.locationData?.address.includes(q) ?? false)
      );
    });
  }, [id, searchQuery, documents]);

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 p-6 relative overflow-hidden transition-colors">
        <div className={`absolute top-0 left-0 w-full h-1 ${categoryConfig.color}`} />
        <div className="flex items-center gap-4">
          <div className={`p-3 rounded-xl ${categoryConfig.color} bg-opacity-10 dark:bg-opacity-20`}>
            <categoryConfig.icon className={`w-8 h-8 ${categoryConfig.color.replace('bg-', 'text-')}`} />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">{categoryConfig.title}</h2>
            <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">{categoryConfig.description}</p>
          </div>
        </div>
        
        {/* Search Bar */}
        <div className="mt-6 flex gap-3">
          <div className="relative flex-grow">
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
            <input 
              type="text"
              placeholder={`بحث في ${categoryConfig.title}...`}
              className="w-full pr-10 pl-4 py-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:text-white outline-none transition-all placeholder:text-slate-400"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <button className="px-4 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 hover:border-slate-300 transition-colors flex items-center gap-2">
            <Filter size={18} />
            <span className="hidden sm:inline">فلترة</span>
          </button>
        </div>
      </div>

      {/* Results */}
      <div>
        <div className="flex items-center justify-between mb-4 px-1">
          <span className="text-sm font-semibold text-slate-500 dark:text-slate-400">
            {filteredDocs.length} نتيجة
          </span>
          <span className="text-xs text-slate-400 dark:text-slate-500">
            ترتيب حسب: الأحدث
          </span>
        </div>
        <DocumentList documents={filteredDocs} type={id || ''} />
      </div>
    </div>
  );
};

export default CategoryPage;