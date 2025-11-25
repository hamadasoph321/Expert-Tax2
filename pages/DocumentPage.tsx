import React, { useState } from 'react';
import { useParams, Navigate } from 'react-router-dom';
import { useData } from '../context/DataContext';
import { Printer, Download, ZoomIn, ZoomOut, RotateCw, Search, RefreshCw } from 'lucide-react';
import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";

const DocumentPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { documents } = useData();
  const doc = documents.find(d => d.id === id);
  const [zoom, setZoom] = useState(100);
  const [rotation, setRotation] = useState(0);
  const [isDownloading, setIsDownloading] = useState(false);

  if (!doc) return <Navigate to="/" replace />;

  const handlePrint = () => {
    window.print();
  };

  const handleDownload = async () => {
    const input = document.getElementById('document-content');
    if (!input) return;

    setIsDownloading(true);

    // Temporarily save style state
    const originalTransform = input.style.transform;
    const originalMarginTop = input.style.marginTop;
    
    // Reset transform for clean capture
    input.style.transform = 'none';
    input.style.marginTop = '0';

    try {
        const canvas = await html2canvas(input, {
            scale: 2, // Improve quality
            useCORS: true,
            logging: false,
            backgroundColor: '#ffffff'
        });

        const imgData = canvas.toDataURL('image/png');
        const pdf = new jsPDF('p', 'mm', 'a4');
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = pdf.internal.pageSize.getHeight();
        const imgWidth = canvas.width;
        const imgHeight = canvas.height;
        
        // Calculate ratio to fit A4 width
        const ratio = pdfWidth / imgWidth;
        const imgHeightInPdf = imgHeight * ratio;

        // Add image to PDF
        pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, imgHeightInPdf);
        
        // If the content is longer than one page, we might want to add pages
        // For simplicity in this text-heavy document context, a single long page 
        // scaled to width is the robust "screenshot" approach.
        // For multi-page PDF from HTML, complex splitting is often required.
        // Given the requirement is "Download as PDF", this provides a faithful visual copy.

        pdf.save(`${doc.title}.pdf`);

    } catch (err) {
        console.error("PDF generation failed", err);
        alert("حدث خطأ أثناء إنشاء ملف PDF");
    } finally {
        // Restore styles
        input.style.transform = originalTransform;
        input.style.marginTop = originalMarginTop;
        setIsDownloading(false);
    }
  };

  const handleRotate = () => {
    setRotation(prev => (prev + 90) % 360);
  };

  const handleReset = () => {
    setZoom(100);
    setRotation(0);
  };

  return (
    <div className="h-[calc(100vh-140px)] flex flex-col bg-slate-800 rounded-xl overflow-hidden shadow-2xl border border-slate-700 print:h-auto print:bg-white print:overflow-visible">
      
      {/* Toolbar - Hidden when printing */}
      <div className="bg-slate-900 text-slate-300 p-3 flex items-center justify-between border-b border-slate-700 shrink-0 print:hidden">
        <div className="flex items-center gap-4">
           <h3 className="text-white font-medium text-sm truncate max-w-[200px] md:max-w-md" title={doc.title}>
             {doc.title}
           </h3>
           <span className="text-xs bg-slate-700 px-2 py-0.5 rounded text-slate-400 hidden sm:inline-block">
             PDF
           </span>
        </div>

        <div className="flex items-center gap-1 md:gap-2">
           <button 
             onClick={() => (window as any).find()} 
             className="p-2 hover:bg-slate-700 rounded transition-colors hidden md:block" 
             title="بحث في الصفحة (Ctrl+F)"
           >
             <Search size={18} />
           </button>
           <div className="h-4 w-px bg-slate-700 mx-1 hidden md:block"></div>
           <button onClick={() => setZoom(z => Math.max(50, z - 10))} className="p-2 hover:bg-slate-700 rounded transition-colors">
             <ZoomOut size={18} />
           </button>
           <span className="text-xs w-12 text-center hidden md:inline-block">{zoom}%</span>
           <button onClick={() => setZoom(z => Math.min(200, z + 10))} className="p-2 hover:bg-slate-700 rounded transition-colors">
             <ZoomIn size={18} />
           </button>
           <div className="h-4 w-px bg-slate-700 mx-1 hidden md:block"></div>
           
           <button onClick={handleReset} className="p-2 hover:bg-slate-700 rounded transition-colors" title="إعادة تعيين العرض">
             <RefreshCw size={18} />
           </button>

           <button onClick={handleRotate} className="p-2 hover:bg-slate-700 rounded transition-colors hidden sm:block" title="تدوير">
             <RotateCw size={18} />
           </button>
           
           <button 
            onClick={handleDownload} 
            disabled={isDownloading}
            className={`p-2 hover:bg-slate-700 rounded transition-colors text-blue-400 ${isDownloading ? 'opacity-50 cursor-not-allowed' : ''}`} 
            title="تنزيل PDF"
           >
             <Download size={18} />
           </button>
           
           <button onClick={handlePrint} className="p-2 hover:bg-slate-700 rounded transition-colors" title="طباعة">
             <Printer size={18} />
           </button>
        </div>
      </div>

      {/* Viewer Body */}
      <div className="flex-grow flex overflow-hidden relative print:overflow-visible">
        
        {/* Thumbnails Sidebar (Simulated) */}
        <div className="w-16 sm:w-64 bg-slate-800 border-l border-slate-700 overflow-y-auto hidden md:block custom-scrollbar print:hidden">
          {[1, 2, 3].map((page) => (
             <div key={page} className="p-4 cursor-pointer hover:bg-slate-700 transition-colors group">
               <div className="aspect-[1/1.4] bg-white opacity-90 group-hover:opacity-100 shadow-sm mb-2 text-[6px] p-2 overflow-hidden text-slate-300">
                 Lorem ipsum...
               </div>
               <div className="text-center text-xs text-slate-500 group-hover:text-slate-300">
                 صفحة {page}
               </div>
             </div>
          ))}
        </div>

        {/* Main View Area */}
        <div className="flex-grow bg-slate-600 overflow-auto p-4 md:p-8 flex justify-center items-start print:bg-white print:p-0 print:block">
           <div 
             id="document-content"
             className="bg-white shadow-xl min-h-[800px] w-full max-w-3xl transition-all duration-200 ease-linear origin-top print:shadow-none print:w-full print:max-w-none print:transform-none"
             style={{ 
               transform: `scale(${zoom / 100}) rotate(${rotation}deg)`,
               marginTop: rotation === 90 || rotation === 270 ? '100px' : '0' 
             }}
           >
             <div className="p-12 md:p-16 text-slate-900 print:p-8">
                <div className="border-b-2 border-black pb-4 mb-8 flex justify-between items-end">
                   <div>
                     <h1 className="text-2xl font-bold mb-2">{doc.title}</h1>
                     <p className="text-sm font-serif">تاريخ الإصدار: {doc.date}</p>
                   </div>
                   <div className="text-right">
                     <p className="text-xs font-bold uppercase tracking-widest text-slate-500">Expert Tax Doc</p>
                     <p className="text-xs text-slate-400">Ref: {doc.id}</p>
                   </div>
                </div>

                <div className="prose max-w-none font-serif leading-relaxed text-justify">
                  <p className="mb-6 font-bold text-lg">
                    {doc.description}
                  </p>
                  
                  {doc.content ? (
                    <p className="mb-6 whitespace-pre-line">
                      {doc.content}
                    </p>
                  ) : (
                    <>
                      <p className="mb-4">
                        لوريم إيبسوم دولار سيت أميت، كونسيكتيتور أدايباكسينج إليت. سيد دو إيوسمود تيمبور إنسيديدونت أوت لابوري إت دولوري ماجنا أليكا.
                      </p>
                      <p className="mb-4">
                        أوت إنيم أد مينيم فينيام، كويس نوسترود إكسيرسيتاسيون أولامكو لابوريس نيسي أوت أليكويب إكس إيا كومودو كونسي كوات.
                      </p>
                      <p className="mb-4">
                        دويس أوتي إيروري دولور إن ريبريهينديريت إن فولوبتاتي فيليت إيسي كايلوم دولوري إيو فوجيات نولا بارياتور.
                      </p>
                    </>
                  )}

                  {doc.locationData && (
                    <div className="mt-8 border p-4 bg-slate-50">
                      <h4 className="font-bold border-b pb-2 mb-2">بيانات الاتصال</h4>
                      <p><strong>العنوان:</strong> {doc.locationData.address}</p>
                      <p><strong>الكود:</strong> {doc.locationData.code}</p>
                    </div>
                  )}
                </div>
                
                <div className="mt-20 pt-8 border-t border-slate-200 text-center text-xs text-slate-400">
                  تم استخراج هذا المستند من قاعدة بيانات الخبير الضريبي الرقمية.
                </div>
             </div>
           </div>
        </div>

      </div>
    </div>
  );
};

export default DocumentPage;