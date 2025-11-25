import React, { useState, useRef, useEffect } from 'react';
import { useData } from '../context/DataContext';
import { FileText, ArrowLeftRight, Lock, Unlock, AlertCircle } from 'lucide-react';

const ComparePage: React.FC = () => {
  const [doc1Id, setDoc1Id] = useState<string>('');
  const [doc2Id, setDoc2Id] = useState<string>('');
  const [syncScroll, setSyncScroll] = useState(true);
  const { documents } = useData();

  const doc1 = documents.find(d => d.id === doc1Id);
  const doc2 = documents.find(d => d.id === doc2Id);

  const pane1Ref = useRef<HTMLDivElement>(null);
  const pane2Ref = useRef<HTMLDivElement>(null);
  const isScrolling = useRef<boolean>(false);

  useEffect(() => {
    const p1 = pane1Ref.current;
    const p2 = pane2Ref.current;

    const handleScroll = (source: 'pane1' | 'pane2') => {
      if (!syncScroll || isScrolling.current) return;
      
      isScrolling.current = true;
      const sourceRef = source === 'pane1' ? p1 : p2;
      const targetRef = source === 'pane1' ? p2 : p1;

      if (sourceRef && targetRef) {
        targetRef.scrollTop = sourceRef.scrollTop;
      }
      
      setTimeout(() => {
        isScrolling.current = false;
      }, 50);
    };

    const onScroll1 = () => handleScroll('pane1');
    const onScroll2 = () => handleScroll('pane2');

    if (p1) p1.addEventListener('scroll', onScroll1);
    if (p2) p2.addEventListener('scroll', onScroll2);

    return () => {
      if (p1) p1.removeEventListener('scroll', onScroll1);
      if (p2) p2.removeEventListener('scroll', onScroll2);
    };
  }, [syncScroll, doc1Id, doc2Id]);

  return (
    <div className="flex flex-col h-[calc(100vh-140px)]">
      
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-3">
          <div className="p-2 bg-indigo-100 dark:bg-indigo-900 rounded-lg text-indigo-700 dark:text-indigo-300">
            <ArrowLeftRight size={24} />
          </div>
          أداة المقارنة
        </h2>
        <p className="text-slate-500 dark:text-slate-400 mt-1">اختر مستندين لعرضهما جنباً إلى جنب للمقارنة</p>
      </div>

      {/* Controls */}
      <div className="bg-white dark:bg-slate-800 p-4 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 mb-4 flex flex-col md:flex-row gap-4 items-center justify-between transition-colors">
        <div className="flex-1 w-full flex gap-2 items-center">
           <span className="text-slate-400 font-bold text-lg">1</span>
           <select 
             className="w-full p-2 border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-800 dark:text-white rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
             value={doc1Id}
             onChange={(e) => setDoc1Id(e.target.value)}
           >
             <option value="">اختر المستند الأول...</option>
             {documents.map(d => (
               <option key={`1-${d.id}`} value={d.id}>{d.title}</option>
             ))}
           </select>
        </div>

        <button 
          onClick={() => setSyncScroll(!syncScroll)}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
            syncScroll 
              ? 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900 dark:text-indigo-300' 
              : 'bg-slate-100 text-slate-500 dark:bg-slate-700 dark:text-slate-400'
          }`}
          title="تزامن التمرير"
        >
          {syncScroll ? <Lock size={16} /> : <Unlock size={16} />}
          <span className="text-sm">تزامن</span>
        </button>

        <div className="flex-1 w-full flex gap-2 items-center" dir="rtl">
           <select 
             className="w-full p-2 border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-800 dark:text-white rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
             value={doc2Id}
             onChange={(e) => setDoc2Id(e.target.value)}
           >
             <option value="">اختر المستند الثاني...</option>
             {documents.map(d => (
               <option key={`2-${d.id}`} value={d.id}>{d.title}</option>
             ))}
           </select>
           <span className="text-slate-400 font-bold text-lg">2</span>
        </div>
      </div>

      {/* Comparison Area */}
      <div className="flex-grow flex gap-4 overflow-hidden">
        {/* Pane 1 */}
        <div className="flex-1 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-inner overflow-hidden flex flex-col transition-colors">
          {doc1 ? (
             <div ref={pane1Ref} className="p-6 overflow-y-auto h-full scroll-smooth">
               <h3 className="font-bold text-xl mb-2 text-slate-800 dark:text-white border-b border-slate-100 dark:border-slate-700 pb-2">{doc1.title}</h3>
               <div className="prose prose-sm dark:prose-invert max-w-none text-slate-600 dark:text-slate-300">
                 <p className="font-medium text-slate-900 dark:text-white">{doc1.description}</p>
                 <hr className="my-4 border-slate-200 dark:border-slate-700"/>
                 <p>{doc1.content || "لا يوجد نص كامل متاح للعرض في هذه المعاينة."}</p>
                 {Array.from({ length: 10 }).map((_, i) => (
                    <p key={i} className="mt-4">
                      {i + 1}. هذا نص إضافي لغرض إطالة المستند وتجربة خاصية التمرير المتزامن بين النافذتين. (مادة رقم {i + 1})
                    </p>
                 ))}
               </div>
             </div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-slate-400 dark:text-slate-500 p-8 text-center bg-slate-50 dark:bg-slate-900">
              <FileText size={48} className="mb-2 opacity-50" />
              <p>اختر مستنداً من القائمة اليمنى</p>
            </div>
          )}
        </div>

        {/* Pane 2 */}
        <div className="flex-1 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-inner overflow-hidden flex flex-col transition-colors">
          {doc2 ? (
             <div ref={pane2Ref} className="p-6 overflow-y-auto h-full scroll-smooth">
               <h3 className="font-bold text-xl mb-2 text-slate-800 dark:text-white border-b border-slate-100 dark:border-slate-700 pb-2">{doc2.title}</h3>
               <div className="prose prose-sm dark:prose-invert max-w-none text-slate-600 dark:text-slate-300">
                 <p className="font-medium text-slate-900 dark:text-white">{doc2.description}</p>
                 <hr className="my-4 border-slate-200 dark:border-slate-700"/>
                 <p>{doc2.content || "لا يوجد نص كامل متاح للعرض في هذه المعاينة."}</p>
                  {Array.from({ length: 10 }).map((_, i) => (
                    <p key={i} className={`mt-4 ${i === 4 ? 'bg-yellow-50 dark:bg-yellow-900/30 border border-yellow-200 dark:border-yellow-700 p-2 rounded' : ''}`}>
                      {i + 1}. هذا نص إضافي لغرض إطالة المستند وتجربة خاصية التمرير المتزامن بين النافذتين. (مادة رقم {i + 1})
                    </p>
                 ))}
               </div>
             </div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-slate-400 dark:text-slate-500 p-8 text-center bg-slate-50 dark:bg-slate-900">
              <FileText size={48} className="mb-2 opacity-50" />
              <p>اختر مستنداً من القائمة اليسرى</p>
            </div>
          )}
        </div>
      </div>
      
      {(!doc1 || !doc2) && (
        <div className="mt-2 flex items-center gap-2 text-amber-600 dark:text-amber-400 text-sm bg-amber-50 dark:bg-amber-900/30 p-3 rounded-lg border border-amber-100 dark:border-amber-800">
          <AlertCircle size={16} />
          يرجى اختيار كلا المستندين لبدء المقارنة الفعالة.
        </div>
      )}

    </div>
  );
};

export default ComparePage;