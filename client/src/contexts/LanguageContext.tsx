import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

type Language = 'en' | 'ar';
type Direction = 'ltr' | 'rtl';

interface Translations {
  [key: string]: {
    en: string;
    ar: string;
  };
}

const translations: Translations = {
  home: { en: 'Home', ar: 'الرئيسية' },
  universities: { en: 'Universities', ar: 'الجامعات' },
  colleges: { en: 'Colleges', ar: 'الكليات' },
  projects: { en: 'Projects', ar: 'مشاريع التخرج' },
  allColleges: { en: 'All Colleges', ar: 'جميع الكليات' },
  allMajors: { en: 'All Majors', ar: 'جميع التخصصات' },
  allDates: { en: 'All Dates', ar: 'كل التواريخ' },
  allTypes: { en: 'All Types', ar: 'جميع الأنواع' },
  allUniversities: { en: 'All Universities', ar: 'جميع الجامعات' },
  research: { en: 'Research', ar: 'بحث' },
  application: { en: 'Application', ar: 'تطبيق' },
  hardware: { en: 'Hardware', ar: 'عتاد' },
  filterBy: { en: 'Filter by', ar: 'فرز حسب' },
  resetFilters: { en: 'Reset Filters', ar: 'إعادة ضبط الفرز' },
  guidance: { en: 'Smart Guidance', ar: 'التوجيه الذكي' },
  about: { en: 'About Us', ar: 'من نحن' },
  contact: { en: 'Contact', ar: 'اتصل بنا' },
  login: { en: 'Login', ar: 'تسجيل الدخول' },
  dashboard: { en: 'Go to Dashboard', ar: 'الذهاب للوحة التحكم' },
  apply: { en: 'Apply Now', ar: 'قدم الآن' },
  search: { en: 'Search...', ar: 'بحث...' },
  readMore: { en: 'Read More', ar: 'اقرأ المزيد' },
  viewDetails: { en: 'View Details', ar: 'عرض التفاصيل' },
  copyright: { en: '© 2026 UniGuide. All rights reserved.', ar: '© 2026 UniGuide. جميع الحقوق محفوظة.' },
  exploreUnis: { en: 'Explore Universities', ar: 'استكشف الجامعات' },
  exploreColleges: { en: 'Explore Colleges', ar: 'استكشف الكليات' },
  heroTitle: { en: 'Find Your Future', ar: 'اكتشف مستقبلك' },
  heroSubtitle: { en: 'Your gateway to the best universities and academic paths.', ar: 'بوابتك لأفضل الجامعات والمسارات الأكاديمية.' },
  popularUniversities: { en: 'Popular Universities', ar: 'الجامعات الشائعة' },
  latestProjects: { en: 'Latest Projects', ar: 'أحدث المشاريع' },
  whyChooseUs: { en: 'Why Choose Us', ar: 'لماذا تختارنا' },
  compare: { en: 'Compare', ar: 'مقارنة' },
};

interface LanguageContextType {
  language: Language;
  direction: Direction;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const [language, setLanguage] = useState<Language>(() => {
    return (localStorage.getItem('appLanguage') as Language) || 'en';
  });
  const [direction, setDirection] = useState<Direction>('ltr');

  useEffect(() => {
    const dir = language === 'ar' ? 'rtl' : 'ltr';
    setDirection(dir);
    document.documentElement.dir = dir;
    document.documentElement.lang = language;
    localStorage.setItem('appLanguage', language);
  }, [language]);

  const t = (key: string) => {
    return translations[key]?.[language] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, direction, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
