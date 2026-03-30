import { Layout } from "@/components/layout/Layout";
import { useLanguage } from "@/contexts/LanguageContext";
import { universities, majors } from "@/lib/mockData";
import { useRoute, useLocation } from "wouter";
import { useForm } from "@/lib/inertia-mock"; // Using mock Inertia form
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useEffect } from "react";

export default function Apply() {
  const { t, language } = useLanguage();
  const [, setLocation] = useLocation();
  const majorId = new URLSearchParams(window.location.search).get("major") || "";
  const selectedMajor = majors.find(m => m.id === majorId);

  useEffect(() => {
    if (localStorage.getItem('isLoggedIn') !== 'true') {
      toast.error(language === 'ar' ? 'يجب تسجيل الدخول أولاً للتقديم' : 'You must login first to apply');
      setLocation('/login');
    }
  }, [language, setLocation]);
  
  // Inertia useForm hook simulation
  const { data, setData, post, processing, errors, clearErrors } = useForm({
    F_name: "",
    S_name: "",
    Th_name: "",
    Su_name: "",
    phone_number: "",
    graduation_date: "",
    graduation_grade: "",
    certificate_image: null as File | null,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    clearErrors();
    
    if (selectedMajor && parseFloat(data.graduation_grade) < selectedMajor.gpa) {
      toast.error(
        language === 'ar' 
          ? `عذراً، معدلك (${data.graduation_grade}) أقل من المعدل المطلوب لهذا التخصص (${selectedMajor.gpa})` 
          : `Sorry, your grade (${data.graduation_grade}) is lower than the required GPA for this major (${selectedMajor.gpa})`
      );
      return;
    }

    post('/apply', {
      onSuccess: () => {
        toast.success(
          language === 'ar' ? "تم إرسال الطلب بنجاح!" : "Application Submitted!", 
          { description: language === 'ar' ? "سنتواصل معك قريباً." : "We will contact you soon." }
        );
      }
    });
  };

  return (
    <Layout>
      <div className="bg-muted/30 py-12">
        <div className="container mx-auto px-4 max-w-7xl">
          <h1 className="text-4xl font-bold mb-4">{t('apply')}</h1>
          <p className="text-muted-foreground">{language === 'ar' ? 'ابدأ رحلتك الجامعية اليوم.' : 'Start your journey today.'}</p>
        </div>
      </div>

      <div className="container mx-auto py-12 px-4 max-w-3xl">
        <Card>
          <CardHeader>
            <CardTitle>{language === 'ar' ? 'نموذج تقديم الطالب' : 'Student Application Form'}</CardTitle>
            {selectedMajor && (
              <p className="text-sm text-primary font-bold mt-2">
                {language === 'ar' ? 'التقديم لتخصص: ' : 'Applying for: '} 
                {language === 'ar' ? selectedMajor.nameAr : selectedMajor.name}
              </p>
            )}
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid md:grid-cols-4 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="F_name">{language === 'ar' ? 'الاسم الأول' : 'First Name'}</Label>
                  <Input 
                    id="F_name" 
                    required
                    value={data.F_name} 
                    onChange={e => setData("F_name", e.target.value)} 
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="S_name">{language === 'ar' ? 'الاسم الثاني' : 'Second Name'}</Label>
                  <Input 
                    id="S_name" 
                    required
                    value={data.S_name} 
                    onChange={e => setData("S_name", e.target.value)} 
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="Th_name">{language === 'ar' ? 'الاسم الثالث' : 'Third Name'}</Label>
                  <Input 
                    id="Th_name" 
                    required
                    value={data.Th_name} 
                    onChange={e => setData("Th_name", e.target.value)} 
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="Su_name">{language === 'ar' ? 'اللقب / العائلة' : 'Surname'}</Label>
                  <Input 
                    id="Su_name" 
                    required
                    value={data.Su_name} 
                    onChange={e => setData("Su_name", e.target.value)} 
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="phone_number">{language === 'ar' ? 'رقم الهاتف' : 'Phone Number'}</Label>
                  <Input 
                    id="phone_number" 
                    dir="ltr"
                    required
                    value={data.phone_number} 
                    onChange={e => setData("phone_number", e.target.value)} 
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="graduation_date">{language === 'ar' ? 'تاريخ التخرج' : 'Graduation Date'}</Label>
                  <Input 
                    id="graduation_date" 
                    type="date"
                    required
                    value={data.graduation_date} 
                    onChange={e => setData("graduation_date", e.target.value)} 
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="graduation_grade">{language === 'ar' ? 'معدل التخرج' : 'Graduation Grade'}</Label>
                  <Input 
                    id="graduation_grade" 
                    type="number" 
                    step="0.01" 
                    dir="ltr"
                    required
                    value={data.graduation_grade} 
                    onChange={e => setData("graduation_grade", e.target.value)} 
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="certificate_image">{language === 'ar' ? 'صورة الشهادة' : 'Certificate Image'}</Label>
                  <Input 
                    id="certificate_image" 
                    type="file"
                    required
                    accept="image/*,.pdf"
                    onChange={e => setData("certificate_image", e.target.files?.[0] || null)} 
                  />
                </div>
              </div>

              <Button type="submit" className="w-full font-bold text-lg h-12 mt-8" disabled={processing}>
                {processing ? (language === 'ar' ? "جاري الإرسال..." : "Submitting...") : (language === 'ar' ? "إرسال طلب التقديم" : "Submit Application")}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}
