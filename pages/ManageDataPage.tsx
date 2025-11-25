import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useData } from '../context/DataContext';
import { CategoryType, Document } from '../types';
import { CATEGORIES } from '../constants';
import { Save, X, PlusCircle, Trash2, Download, Upload } from 'lucide-react';

const ManageDataPage: React.FC = () => {
  const navigate = useNavigate();
  const { addDocument, documents, deleteDocument, resetData, importDatabase } = useData();
  const [activeTab, setActiveTab] = useState<'add' | 'list'>('add');
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Form State
  const [formData, setFormData] = useState<Partial<Document>>({
    title: '',
    category: CategoryType.LAWS,
    date: new Date().toISOString().split('T')[0],
    description: '',
    content: '',
    tags: []
  });
  const [tagInput, setTagInput] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.category) return;

    const newDoc: Document = {
      id: `doc-${Date.now()}`,
      title: formData.title,
      category: formData.category,
      date: formData.date || new Date().toISOString().split('T')[0],
      description: formData.description,
      content: formData.content || '',
      tags: formData.tags || [],
      locationData: undefined // Can be extended for location inputs later
    };

    addDocument(newDoc);
    alert('تمت إضافة المستند بنجاح');
    
    // Reset form
    setFormData({
      title: '',
      category: CategoryType.LAWS,
      date: new Date().toISOString().split('T')[0],
      description: '',
      content: '',
      tags: []
    });
    setTagInput('');
  };

  const handleAddTag = () => {
    if (tagInput.trim()) {
      setFormData(prev => ({
        ...prev,
        tags: [...(prev.tags || []), tagInput.trim()]
      }));
      setTagInput('');
    }
  };

  const handleExport = () => {
    const dataStr = JSON.stringify(documents, null, 2);
    const blob = new Blob([dataStr], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `expert-tax-backup-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const result = e.target?.result as string;
          const data = JSON.parse(result);
          // Basic validation
          if (Array.isArray(data) && (data.length === 0 || (data[0].id && data[0].title))) {
             if(window.confirm(`سيتم استبدال قاعدة البيانات الحالية بـ ${data.length} مستند. هل تريد المتابعة؟`)) {
                  importDatabase(data);
                  alert("تم استعادة قاعدة البيانات بنجاح");
              }
          } else {
              throw new Error("Invalid format");
          }
        } catch (err) {
          console.error(err);
          alert("خطأ في قراءة الملف. يرجى التأكد من صحة ملف JSON.");
        }
      };
      reader.readAsText(file);
    }
    // Reset input
    if (event.target) event.target.value = '';
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">إدارة قاعدة البيانات</h2>
        <div className="flex gap-2">
           <button 
            onClick={handleExport}
            className="flex items-center gap-2 px-3 py-2 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 rounded-lg text-sm hover:bg-indigo-100 dark:hover:bg-indigo-900/50 transition-colors"
            title="تصدير نسخة احتياطية"
          >
            <Download size={16} />
            <span className="hidden sm:inline">نسخ احتياطي</span>
          </button>
          <button 
            onClick={() => fileInputRef.current?.click()}
            className="flex items-center gap-2 px-3 py-2 bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-lg text-sm hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors"
            title="استيراد نسخة احتياطية"
          >
            <Upload size={16} />
            <span className="hidden sm:inline">استعادة</span>
          </button>
          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handleImport} 
            accept=".json" 
            className="hidden" 
          />
        </div>
      </div>

      <div className="bg-slate-100 dark:bg-slate-800 p-1 rounded-lg flex">
          <button 
            onClick={() => setActiveTab('add')}
            className={`flex-1 px-4 py-2 rounded-md text-sm font-medium transition-colors ${activeTab === 'add' ? 'bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-300 shadow-sm' : 'text-slate-500 dark:text-slate-400'}`}
          >
            إضافة مستند جديد
          </button>
          <button 
            onClick={() => setActiveTab('list')}
            className={`flex-1 px-4 py-2 rounded-md text-sm font-medium transition-colors ${activeTab === 'list' ? 'bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-300 shadow-sm' : 'text-slate-500 dark:text-slate-400'}`}
          >
            عرض البيانات ({documents.length})
          </button>
      </div>

      {activeTab === 'add' && (
        <form onSubmit={handleSubmit} className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-6 space-y-6 animate-in fade-in duration-300">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">عنوان المستند</label>
              <input 
                required
                type="text" 
                value={formData.title}
                onChange={e => setFormData({...formData, title: e.target.value})}
                className="w-full p-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 dark:text-white"
                placeholder="مثال: تعليمات تنفيذية رقم 1 لسنة 2024"
              />
            </div>
            
            <div className="space-y-2">
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">التصنيف</label>
              <select 
                value={formData.category}
                onChange={e => setFormData({...formData, category: e.target.value as CategoryType})}
                className="w-full p-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 dark:text-white"
              >
                {CATEGORIES.map(cat => (
                  <option key={cat.id} value={cat.id}>{cat.title}</option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">تاريخ الإصدار</label>
              <input 
                type="date" 
                value={formData.date}
                onChange={e => setFormData({...formData, date: e.target.value})}
                className="w-full p-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 dark:text-white"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">الوسوم (Tags)</label>
              <div className="flex gap-2">
                <input 
                  type="text" 
                  value={tagInput}
                  onChange={e => setTagInput(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), handleAddTag())}
                  className="flex-grow p-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 dark:text-white"
                  placeholder="اكتب واضغط Enter"
                />
                <button 
                  type="button" 
                  onClick={handleAddTag}
                  className="p-3 bg-slate-100 dark:bg-slate-700 rounded-xl hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors"
                >
                  <PlusCircle size={20} className="text-slate-600 dark:text-slate-300" />
                </button>
              </div>
              <div className="flex flex-wrap gap-2 mt-2">
                {formData.tags?.map((tag, i) => (
                  <span key={i} className="text-xs bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 px-2 py-1 rounded-full flex items-center gap-1">
                    {tag}
                    <X size={12} className="cursor-pointer hover:text-red-500" onClick={() => setFormData(prev => ({...prev, tags: prev.tags?.filter(t => t !== tag)}))} />
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">نبذة مختصرة</label>
            <textarea 
              value={formData.description}
              onChange={e => setFormData({...formData, description: e.target.value})}
              rows={2}
              className="w-full p-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 dark:text-white"
              placeholder="وصف قصير لمحتوى المستند..."
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">محتوى المستند (نصي)</label>
            <textarea 
              value={formData.content}
              onChange={e => setFormData({...formData, content: e.target.value})}
              rows={10}
              className="w-full p-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 dark:text-white font-serif"
              placeholder="الصق نص القانون أو التعليمات هنا..."
            />
          </div>

          <div className="pt-4 border-t border-slate-100 dark:border-slate-700 flex justify-end gap-3">
             <button 
               type="button"
               onClick={() => navigate(-1)}
               className="px-6 py-2 rounded-xl text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
             >
               إلغاء
             </button>
             <button 
               type="submit"
               className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow-lg shadow-blue-200 dark:shadow-none transition-colors flex items-center gap-2"
             >
               <Save size={18} />
               حفظ المستند
             </button>
          </div>
        </form>
      )}

      {activeTab === 'list' && (
        <div className="space-y-4 animate-in fade-in duration-300">
          <div className="flex justify-between items-center bg-red-50 dark:bg-red-900/10 border border-red-100 dark:border-red-900/30 p-3 rounded-lg">
             <span className="text-xs text-red-600 dark:text-red-400">منطقة الخطر</span>
            <button onClick={resetData} className="text-red-600 dark:text-red-400 text-xs font-bold hover:underline flex items-center gap-1">
              <Trash2 size={12} />
              استعادة البيانات الافتراضية
            </button>
          </div>
          {documents.map(doc => (
            <div key={doc.id} className="bg-white dark:bg-slate-800 p-4 rounded-xl border border-slate-200 dark:border-slate-700 flex justify-between items-center group">
              <div>
                <h3 className="font-bold text-slate-800 dark:text-white">{doc.title}</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">{CATEGORIES.find(c => c.id === doc.category)?.title} • {doc.date}</p>
              </div>
              <button 
                onClick={() => {
                   if(window.confirm('هل أنت متأكد من حذف هذا المستند؟')) deleteDocument(doc.id);
                }}
                className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                title="حذف"
              >
                <Trash2 size={18} />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ManageDataPage;