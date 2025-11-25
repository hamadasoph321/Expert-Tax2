import React, { useState, useRef } from 'react';
import { GoogleGenAI } from "@google/genai";
import { Sparkles, Image as ImageIcon, Upload, Download, RefreshCw, AlertCircle, Wand2 } from 'lucide-react';

const AiEditorPage: React.FC = () => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedImage(reader.result as string);
        setGeneratedImage(null);
        setError(null);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleGenerate = async () => {
    if (!selectedImage || !prompt) return;

    setLoading(true);
    setError(null);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      
      // Extract base64 data and mime type
      const base64Data = selectedImage.split(',')[1];
      const mimeType = selectedImage.split(';')[0].split(':')[1];

      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash-image',
        contents: {
          parts: [
            {
              inlineData: {
                data: base64Data,
                mimeType: mimeType
              }
            },
            {
              text: prompt
            }
          ]
        }
      });

      // Find image part in response
      let foundImage = false;
      if (response.candidates?.[0]?.content?.parts) {
        for (const part of response.candidates[0].content.parts) {
          if (part.inlineData) {
            const base64EncodeString = part.inlineData.data;
            const newImageUrl = `data:image/png;base64,${base64EncodeString}`;
            setGeneratedImage(newImageUrl);
            foundImage = true;
            break;
          }
        }
      }

      if (!foundImage) {
        throw new Error("لم يتم استلام صورة من النموذج. يرجى المحاولة مرة أخرى.");
      }

    } catch (err: any) {
      console.error(err);
      setError(err.message || "حدث خطأ أثناء معالجة الصورة");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-violet-600 to-indigo-600 rounded-2xl p-8 text-white shadow-lg">
        <div className="flex items-center gap-4 mb-2">
          <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
            <Sparkles size={32} className="text-yellow-300" />
          </div>
          <div>
            <h2 className="text-3xl font-bold">المحرر الذكي</h2>
            <p className="text-indigo-100 mt-1">قم بتحرير وتحسين صور المستندات باستخدام الذكاء الاصطناعي</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Input Section */}
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-6">
          <h3 className="font-bold text-slate-800 flex items-center gap-2">
            <ImageIcon size={20} className="text-slate-500" />
            الصورة الأصلية
          </h3>

          <div 
            onClick={() => fileInputRef.current?.click()}
            className={`border-2 border-dashed rounded-xl h-64 flex flex-col items-center justify-center cursor-pointer transition-all overflow-hidden relative ${
              selectedImage ? 'border-indigo-300 bg-slate-50' : 'border-slate-300 hover:bg-slate-50 hover:border-indigo-400'
            }`}
          >
            {selectedImage ? (
              <img src={selectedImage} alt="Selected" className="w-full h-full object-contain" />
            ) : (
              <div className="text-center text-slate-400 p-4">
                <Upload size={40} className="mx-auto mb-2 opacity-50" />
                <p>اضغط لرفع صورة أو مستند</p>
              </div>
            )}
            <input 
              type="file" 
              ref={fileInputRef} 
              className="hidden" 
              accept="image/*" 
              onChange={handleImageUpload} 
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-slate-700">كيف تريد تعديل الصورة؟</label>
            <div className="flex gap-2">
              <input
                type="text"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="مثال: أضف فلتر قديم، وضح النص، احذف الخلفية..."
                className="flex-grow p-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                disabled={loading}
              />
              <button
                onClick={handleGenerate}
                disabled={!selectedImage || !prompt || loading}
                className={`px-6 py-3 rounded-xl font-bold text-white flex items-center gap-2 transition-all ${
                  !selectedImage || !prompt || loading 
                  ? 'bg-slate-300 cursor-not-allowed' 
                  : 'bg-indigo-600 hover:bg-indigo-700 shadow-lg hover:shadow-indigo-200'
                }`}
              >
                {loading ? <RefreshCw className="animate-spin" size={20} /> : <Wand2 size={20} />}
                <span className="hidden sm:inline">تنفيذ</span>
              </button>
            </div>
            <div className="flex gap-2 mt-2 text-xs text-slate-500 overflow-x-auto pb-2">
              <button onClick={() => setPrompt("اجعل الصورة عالية التباين للأبيض والأسود")} className="whitespace-nowrap px-3 py-1 bg-slate-100 rounded-full hover:bg-slate-200 transition-colors">عالية التباين</button>
              <button onClick={() => setPrompt("أضف طابع ريترو قديم")} className="whitespace-nowrap px-3 py-1 bg-slate-100 rounded-full hover:bg-slate-200 transition-colors">طابع ريترو</button>
              <button onClick={() => setPrompt("اجعل الخلفية بيضاء نظيفة")} className="whitespace-nowrap px-3 py-1 bg-slate-100 rounded-full hover:bg-slate-200 transition-colors">خلفية بيضاء</button>
            </div>
          </div>

          {error && (
            <div className="bg-red-50 text-red-700 p-4 rounded-xl flex items-start gap-3 text-sm">
              <AlertCircle size={18} className="shrink-0 mt-0.5" />
              <p>{error}</p>
            </div>
          )}
        </div>

        {/* Output Section */}
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-6 flex flex-col">
          <h3 className="font-bold text-slate-800 flex items-center gap-2">
            <Sparkles size={20} className="text-indigo-500" />
            النتيجة
          </h3>

          <div className="flex-grow bg-slate-100 rounded-xl border border-slate-200 flex items-center justify-center min-h-[300px] overflow-hidden relative group">
            {loading ? (
              <div className="text-center text-indigo-600">
                <div className="w-12 h-12 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin mx-auto mb-4"></div>
                <p className="font-medium animate-pulse">جاري المعالجة بواسطة Gemini 2.5...</p>
              </div>
            ) : generatedImage ? (
              <>
                <img src={generatedImage} alt="Generated" className="w-full h-full object-contain" />
                <a 
                  href={generatedImage} 
                  download="edited-image.png"
                  className="absolute bottom-4 left-4 bg-white text-slate-800 p-3 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity hover:bg-indigo-50 hover:text-indigo-600"
                  title="تحميل الصورة"
                >
                  <Download size={24} />
                </a>
              </>
            ) : (
              <div className="text-slate-400 text-center p-8">
                <div className="w-16 h-16 bg-slate-200 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Wand2 size={32} className="opacity-50" />
                </div>
                <p>ستظهر النتيجة هنا بعد المعالجة</p>
              </div>
            )}
          </div>
          
          <div className="text-xs text-slate-400 text-center">
            مدعوم بواسطة Gemini 2.5 Flash Image. قد تختلف النتائج حسب دقة الوصف.
          </div>
        </div>
      </div>
    </div>
  );
};

export default AiEditorPage;