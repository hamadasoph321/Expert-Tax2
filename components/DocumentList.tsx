import React from 'react';
import { Link } from 'react-router-dom';
import { Document } from '../types';
import { FileText, MapPin, Calendar, ArrowLeft } from 'lucide-react';

interface DocumentListProps {
  documents: Document[];
  type: string;
}

const DocumentList: React.FC<DocumentListProps> = ({ documents, type }) => {
  if (documents.length === 0) {
    return (
      <div className="text-center py-20 bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-100 dark:border-slate-700 transition-colors">
        <FileText size={48} className="mx-auto text-slate-300 dark:text-slate-600 mb-4" />
        <h3 className="text-lg font-medium text-slate-900 dark:text-white">لا توجد مستندات</h3>
        <p className="text-slate-500 dark:text-slate-400">لم يتم العثور على نتائج تطابق بحثك</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {documents.map((doc) => (
        <Link 
          key={doc.id}
          to={`/document/${doc.id}`}
          className="block bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-5 hover:shadow-md hover:border-blue-300 dark:hover:border-blue-500 transition-all group"
        >
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <span className={`px-2.5 py-0.5 rounded text-xs font-semibold ${
                  type === 'locations' ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200' : 'bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300'
                }`}>
                  {type === 'locations' ? 'مأمورية' : 'مستند'}
                </span>
                <div className="flex items-center text-slate-400 dark:text-slate-500 text-xs">
                  <Calendar size={12} className="ml-1" />
                  {doc.date}
                </div>
              </div>
              
              <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100 group-hover:text-blue-700 dark:group-hover:text-blue-400 transition-colors mb-2">
                {doc.title}
              </h3>
              
              {doc.description && (
                <p className="text-slate-600 dark:text-slate-400 text-sm mb-3 line-clamp-2">
                  {doc.description}
                </p>
              )}

              {doc.locationData && (
                <div className="flex items-start gap-2 text-sm text-slate-600 dark:text-slate-300 bg-slate-50 dark:bg-slate-700/50 p-2 rounded-lg mt-2">
                  <MapPin size={16} className="text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-semibold block">{doc.locationData.area}</span>
                    <span className="text-xs">{doc.locationData.address}</span>
                  </div>
                </div>
              )}

              {doc.tags && doc.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {doc.tags.map(tag => (
                    <span key={tag} className="text-xs text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-700 px-2 py-1 rounded-full">
                      #{tag}
                    </span>
                  ))}
                </div>
              )}
            </div>
            
            <div className="self-center pr-4">
               <div className="h-8 w-8 rounded-full bg-slate-50 dark:bg-slate-700 flex items-center justify-center text-slate-400 dark:text-slate-300 group-hover:bg-blue-600 group-hover:text-white dark:group-hover:bg-blue-500 transition-all">
                 <ArrowLeft size={16} />
               </div>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
};

export default DocumentList;