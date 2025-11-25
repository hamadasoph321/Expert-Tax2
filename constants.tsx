import { CategoryType, CategoryConfig, Document } from './types';
import { Scale, MapPin, ScrollText, Gavel, Lightbulb } from 'lucide-react';

export const CATEGORIES: CategoryConfig[] = [
  {
    id: CategoryType.LAWS,
    title: "القوانين الضريبية والمعايير",
    icon: Scale,
    color: "bg-blue-600",
    description: "قوانين الدخل، القيمة المضافة، والإجراءات الموحدة"
  },
  {
    id: CategoryType.LOCATIONS,
    title: "عناوين المأموريات",
    icon: MapPin,
    color: "bg-emerald-600",
    description: "دليل عناوين المأموريات ونطاق الاختصاص الجغرافي"
  },
  {
    id: CategoryType.INSTRUCTIONS,
    title: "التعليمات والكتب الدورية",
    icon: ScrollText,
    color: "bg-slate-600",
    description: "التعليمات التنفيذية والكتب الدورية المنظمة للعمل"
  },
  {
    id: CategoryType.DECISIONS,
    title: "القرارات والأحكام",
    icon: Gavel,
    color: "bg-indigo-600",
    description: "أحكام المحاكم وقرارات لجان الطعن الضريبي"
  },
  {
    id: CategoryType.FATWAS,
    title: "فتاوى البحوث",
    icon: Lightbulb,
    color: "bg-amber-600",
    description: "الآراء والفتاوى الصادرة عن قطاع البحوث الضريبية"
  }
];

// Mock Data Generation
export const MOCK_DOCUMENTS: Document[] = [
  // Laws
  {
    id: 'law-91-2005',
    category: CategoryType.LAWS,
    title: "قانون الضريبة على الدخل رقم 91 لسنة 2005",
    date: "2005-06-09",
    description: "القانون المنظم للضريبة على دخل الأشخاص الطبيعيين والاعتباريين.",
    content: "مادة 1: تسري الضريبة على مجموع صافي دخل الأشخاص الطبيعيين المقيمين بالنسبة لدخولهم المحققة في مصر أو خارجها...",
    tags: ["دخل", "أشخاص طبيعيين", "شركات"]
  },
  {
    id: 'law-206-2020',
    category: CategoryType.LAWS,
    title: "قانون الإجراءات الضريبية الموحد رقم 206 لسنة 2020",
    date: "2020-10-19",
    description: "قانون لتوحيد إجراءات ربط وتحصيل الضريبة.",
    content: "يهدف هذا القانون إلى دمج الإجراءات الضريبية المختلفة وتبسيطها...",
    tags: ["إجراءات", "رقمنة"]
  },
  // Locations
  {
    id: 'loc-cairo-1',
    category: CategoryType.LOCATIONS,
    title: "مأمورية ضرائب الشركات المساهمة بالقاهرة",
    date: "2023-01-01",
    description: "تختص بمحاسبة الشركات المساهمة داخل نطاق محافظة القاهرة.",
    content: "",
    locationData: {
      address: "26 شارع شريف، وسط البلد، القاهرة",
      code: "101",
      area: "القاهرة الكبرى"
    }
  },
  {
    id: 'loc-giza-inv',
    category: CategoryType.LOCATIONS,
    title: "مأمورية استثمار الجيزة",
    date: "2023-01-01",
    description: "تختص بشركات الاستثمار الواقعة في نطاق الجيزة.",
    content: "",
    locationData: {
      address: "مبنى الضرائب، الحي السابع، 6 أكتوبر",
      code: "205",
      area: "الجيزة"
    }
  },
  // Instructions
  {
    id: 'inst-10-2023',
    category: CategoryType.INSTRUCTIONS,
    title: "تعليمات تنفيذية رقم 10 لسنة 2023",
    date: "2023-03-15",
    description: "بشأن أسس المحاسبة الضريبية لنشاط الصيدليات.",
    content: "نظراً لما تلاحظ من اختلاف في أسس المحاسبة... يتم اتباع الآتي: تحديد رقم الأعمال بناءً على المسحوبات...",
    tags: ["صيدليات", "تجاري"]
  },
  {
    id: 'book-5-2024',
    category: CategoryType.INSTRUCTIONS,
    title: "كتاب دوري رقم 5 لسنة 2024",
    date: "2024-02-10",
    description: "بشأن منظومة الفاتورة الإلكترونية.",
    content: "يجب على جميع المسجلين الالتزام بإصدار فواتير إلكترونية...",
    tags: ["فاتورة إلكترونية", "إلزام"]
  },
  // Decisions
  {
    id: 'court-cass-155',
    category: CategoryType.DECISIONS,
    title: "حكم محكمة النقض رقم 155 لسنة 80 ق",
    date: "2015-11-20",
    description: "مبدأ هام بشأن تقادم دين الضريبة.",
    content: "قضت المحكمة بأن مدة التقادم خمس سنوات تبدأ من تاريخ...",
    tags: ["تقادم", "نقض"]
  },
  // Fatwas
  {
    id: 'fatwa-export',
    category: CategoryType.FATWAS,
    title: "فتوى بشأن ضريبة القيمة المضافة على التصدير",
    date: "2023-07-01",
    description: "مدى خضوع خدمات التصدير للضريبة بسعر صفر.",
    content: "انتهى الرأي إلى أن الخدمات المؤداة لمستفيد بالخارج تخضع لسعر صفر...",
    tags: ["قيمة مضافة", "تصدير"]
  }
];