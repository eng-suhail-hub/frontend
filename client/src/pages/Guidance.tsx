import { useState, useMemo } from "react";
import { Layout } from "@/components/layout/Layout";
import { useLanguage } from "@/contexts/LanguageContext";
import { universities, colleges, majors } from "@/lib/mockData";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, CheckCircle, GraduationCap, Clock, DollarSign, Building, Filter, Search, Star } from "lucide-react";
import { Link } from "@/lib/inertia-mock";
import { toast } from "sonner";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function Guidance() {
  const { t, language } = useLanguage();
  const [step, setStep] = useState(1);
  const [gpa, setGpa] = useState<number>(0);
  const [selectedCollegeId, setSelectedCollegeId] = useState<string>("");
  const [selectedMajorId, setSelectedMajorId] = useState<string>("");
  
  // Step 4 filters
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("rating");
  const [selectedStreet, setSelectedStreet] = useState<string>("all");

  const handleNext = () => setStep(step + 1);
  const handleBack = () => setStep(step - 1);

  // Step 3: Get majors based on selected college
  const availableMajors = majors.filter(m => m.collegeId === selectedCollegeId);

  // Extract unique streets for the dropdown
  const uniqueStreets = useMemo(() => {
    const streets = new Set<string>();
    universities.forEach(uni => {
      const street = language === 'ar' ? uni.streetNameAr : uni.streetName;
      if (street) streets.add(street);
    });
    return Array.from(streets);
  }, [language]);

  // Step 4: Find universities offering the selected major
  const selectedMajor = majors.find(m => m.id === selectedMajorId);
  const offeringUniversities = universities.filter(u => {
    if (!selectedMajor) return false;
    // Mock relation: assume m1 is in all, m2 in 1&2, m3 in 2&3
    if (selectedMajor.id === 'm1') return true;
    if (selectedMajor.id === 'm2') return u.id === '1' || u.id === '2';
    if (selectedMajor.id === 'm3') return u.id === '2' || u.id === '3';
    return true;
  });

  const filteredUnis = offeringUniversities.filter(uni => {
    const name = language === 'ar' ? uni.nameAr : uni.name;
    const location = language === 'ar' ? uni.locationAr : uni.location;
    const street = language === 'ar' ? uni.streetNameAr || '' : uni.streetName || '';
    
    const matchesSearch = name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          location.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStreet = selectedStreet === "all" || street === selectedStreet;

    return matchesSearch && matchesStreet;
  }).sort((a, b) => {
    if (sortBy === "rating") {
      return b.rating - a.rating;
    } else if (sortBy === "fees_low") {
      return (selectedMajor?.fees || 0) - (selectedMajor?.fees || 0); // Mock sort
    } else if (sortBy === "fees_high") {
      return (selectedMajor?.fees || 0) - (selectedMajor?.fees || 0); // Mock sort
    }
    return 0;
  });

  const handleMajorSelect = (major: any) => {
    if (gpa < major.gpa) {
      toast.error(
        language === 'ar' 
          ? `عذراً، معدلك (${gpa}) أقل من المتطلبات لهذا التخصص (${major.gpa})`
          : `Sorry, your GPA (${gpa}) is less than the requirement for this major (${major.gpa})`
      );
      return;
    }
    setSelectedMajorId(major.id);
  };

  return (
    <Layout>
      <div className="bg-primary py-12 text-primary-foreground">
        <div className="container text-center">
          <h1 className="text-4xl font-bold mb-4">{t('guidance')}</h1>
          <p className="opacity-90 max-w-2xl mx-auto">
            {language === 'ar' 
              ? 'أجب على بضعة أسئلة ودع نظامنا يوجهك لأفضل التخصصات والجامعات المتاحة لك.' 
              : 'Answer a few questions and let our system guide you to the best available majors and universities.'}
          </p>
        </div>
      </div>

      <div className="container py-12 max-w-5xl">
        <div className="flex justify-between mb-8 relative max-w-3xl mx-auto">
           <div className="absolute top-1/2 left-0 right-0 h-1 bg-muted -z-10 -translate-y-1/2" />
           {[1, 2, 3, 4].map((s) => (
             <div 
               key={s} 
               className={`w-10 h-10 rounded-full flex items-center justify-center font-bold transition-colors ${step >= s ? 'bg-secondary text-secondary-foreground' : 'bg-muted text-muted-foreground'}`}
             >
               {s}
             </div>
           ))}
        </div>

        <AnimatePresence mode="wait">
          {/* STEP 1: GPA Input */}
          {step === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="max-w-3xl mx-auto"
            >
              <Card>
                <CardContent className="pt-6 space-y-6">
                  <div className="text-center">
                    <h2 className="text-2xl font-bold mb-2">{language === 'ar' ? 'ما هو معدلك؟' : 'What is your GPA?'}</h2>
                    <p className="text-muted-foreground">{language === 'ar' ? 'هذا يساعدنا في التحقق من أهليتك للتخصصات.' : 'This helps us check your eligibility for majors.'}</p>
                  </div>
                  <div className="max-w-xs mx-auto">
                    <Label className="text-center block mb-2">{language === 'ar' ? 'المعدل التراكمي (من 100 أو 5.0)' : 'GPA (out of 100 or 5.0)'}</Label>
                    <Input 
                      type="number" 
                      min="0" 
                      max="100" 
                      step="0.01" 
                      value={gpa || ''} 
                      onChange={(e) => setGpa(parseFloat(e.target.value))} 
                      className="text-center text-3xl font-bold h-16"
                    />
                  </div>
                  <div className="flex justify-end pt-4 border-t">
                    <Button onClick={handleNext} disabled={!gpa || gpa <= 0} size="lg">
                      {language === 'ar' ? 'الخطوة التالية' : 'Next Step'} <ArrowRight className="ml-2 h-4 w-4 rtl:ml-0 rtl:mr-2 rtl:rotate-180" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* STEP 2: College Interest */}
          {step === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="max-w-3xl mx-auto"
            >
              <Card>
                <CardContent className="pt-6 space-y-6">
                  <div className="text-center mb-6">
                    <h2 className="text-2xl font-bold mb-2">{language === 'ar' ? 'ما هي الكلية التي تثير اهتمامك؟' : 'Which college interests you?'}</h2>
                    <p className="text-muted-foreground">{language === 'ar' ? 'اختر الكلية لعرض التخصصات المتاحة فيها.' : 'Select a college to see available majors.'}</p>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {colleges.map((college) => (
                      <div 
                        key={college.id}
                        className={`p-4 rounded-xl border-2 cursor-pointer transition-all flex flex-col items-center text-center gap-3 ${selectedCollegeId === college.id ? 'border-primary bg-primary/5 shadow-md' : 'border-border bg-card hover:border-primary/30 hover:bg-muted/50'}`}
                        onClick={() => {
                          setSelectedCollegeId(college.id);
                          setSelectedMajorId("");
                        }}
                      >
                         <div className="w-16 h-16 rounded-full overflow-hidden bg-muted border mb-2">
                           <img src={college.image} className="w-full h-full object-cover" alt={college.name} />
                         </div>
                         <span className="font-bold text-lg">{language === 'ar' ? college.nameAr : college.name}</span>
                      </div>
                    ))}
                  </div>

                  <div className="flex justify-between pt-6 border-t">
                    <Button variant="outline" onClick={handleBack} size="lg">
                      {language === 'ar' ? 'رجوع' : 'Back'}
                    </Button>
                    <Button onClick={handleNext} disabled={!selectedCollegeId} size="lg">
                      {language === 'ar' ? 'الخطوة التالية' : 'Next Step'} <ArrowRight className="ml-2 h-4 w-4 rtl:ml-0 rtl:mr-2 rtl:rotate-180" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* STEP 3: Major Selection */}
          {step === 3 && (
            <motion.div
              key="step3"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="max-w-3xl mx-auto"
            >
              <Card>
                <CardContent className="pt-6 space-y-6">
                  <div className="text-center mb-6">
                    <h2 className="text-2xl font-bold mb-2">{language === 'ar' ? 'اختر التخصص المناسب' : 'Choose a Major'}</h2>
                    <p className="text-muted-foreground">{language === 'ar' ? 'هذه هي التخصصات المتاحة في الكلية التي اخترتها.' : 'These are the available majors in your selected college.'}</p>
                  </div>
                  
                  <div className="grid gap-4">
                    {availableMajors.length > 0 ? availableMajors.map((major) => {
                      const isEligible = gpa >= major.gpa;
                      return (
                      <div 
                        key={major.id}
                        className={`p-5 rounded-xl border-2 transition-all relative overflow-hidden ${
                          selectedMajorId === major.id 
                            ? 'border-primary bg-primary/5 shadow-md' 
                            : !isEligible 
                              ? 'border-border/50 bg-muted/30 opacity-75' 
                              : 'border-border bg-card cursor-pointer hover:border-primary/30 hover:shadow-sm'
                        }`}
                        onClick={() => handleMajorSelect(major)}
                      >
                         {!isEligible && (
                           <div className="absolute top-0 right-0 left-0 bg-destructive/10 text-destructive text-xs py-1 px-3 font-bold text-center border-b border-destructive/20">
                             {language === 'ar' ? 'المعدل أقل من المتطلبات' : 'GPA is below requirements'}
                           </div>
                         )}
                         <div className={`flex justify-between items-center mb-3 ${!isEligible ? 'mt-4' : ''}`}>
                           <span className="font-bold text-xl">{language === 'ar' ? major.nameAr : major.name}</span>
                           <span className={`text-sm px-3 py-1 rounded-full font-bold ${isEligible ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                             {language === 'ar' ? 'المعدل المطلوب:' : 'Required GPA:'} {major.gpa}
                           </span>
                         </div>
                         <p className="text-sm text-muted-foreground leading-relaxed">{language === 'ar' ? major.descriptionAr : major.description}</p>
                      </div>
                    )}) : (
                      <div className="text-center py-12 bg-muted/30 rounded-xl border border-dashed text-muted-foreground">
                        <GraduationCap className="h-12 w-12 mx-auto mb-3 opacity-20" />
                        {language === 'ar' ? 'لا توجد تخصصات متاحة في هذه الكلية حالياً.' : 'No majors available in this college currently.'}
                      </div>
                    )}
                  </div>

                  <div className="flex justify-between pt-6 border-t">
                    <Button variant="outline" onClick={handleBack} size="lg">
                      {language === 'ar' ? 'رجوع' : 'Back'}
                    </Button>
                    <Button onClick={handleNext} disabled={!selectedMajorId} size="lg">
                      {language === 'ar' ? 'إظهار الجامعات' : 'Show Universities'} <CheckCircle className="ml-2 h-4 w-4 rtl:ml-0 rtl:mr-2" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* STEP 4: Results (Universities) */}
          {step === 4 && (
            <motion.div
              key="step4"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              <div className="space-y-8">
                <div className="text-center mb-8">
                  <h2 className="text-3xl font-bold mb-2">{language === 'ar' ? 'الجامعات المتاحة لك' : 'Available Universities for You'}</h2>
                  <p className="text-muted-foreground">
                    {language === 'ar' 
                      ? `بناءً على اختيارك لتخصص (${selectedMajor?.nameAr}) ومعدلك (${gpa}).` 
                      : `Based on your selection of (${selectedMajor?.name}) and GPA of (${gpa}).`}
                  </p>
                </div>

                <div className="flex flex-col md:flex-row gap-8">
                   {/* Filters Sidebar */}
                   <aside className="w-full md:w-64 space-y-6">
                     <div className="bg-card p-6 rounded-xl border shadow-sm sticky top-24">
                       <div className="flex items-center gap-2 font-bold mb-4 text-lg">
                         <Filter className="h-5 w-5" />
                         <span>{language === 'ar' ? 'تصفية' : 'Filter'}</span>
                       </div>
                       <div className="space-y-4">
                          <div className="space-y-2">
                            <label className="text-sm font-medium">{language === 'ar' ? 'بحث' : 'Search'}</label>
                            <div className="relative">
                               <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground rtl:left-auto rtl:right-3" />
                               <Input 
                                 placeholder={t('search')} 
                                 className="pl-10 rtl:pl-3 rtl:pr-10"
                                 value={searchTerm}
                                 onChange={(e) => setSearchTerm(e.target.value)}
                               />
                            </div>
                          </div>
                          
                          <div className="space-y-2">
                            <label className="text-sm font-medium">{language === 'ar' ? 'ترتيب حسب' : 'Sort By'}</label>
                            <Select value={sortBy} onValueChange={setSortBy}>
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="rating">{language === 'ar' ? 'الأعلى تقييماً' : 'Highest Rated'}</SelectItem>
                                <SelectItem value="fees_low">{language === 'ar' ? 'الأقل رسوماً' : 'Lowest Fees'}</SelectItem>
                                <SelectItem value="fees_high">{language === 'ar' ? 'الأعلى رسوماً' : 'Highest Fees'}</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>

                          <div className="space-y-2">
                            <label className="text-sm font-medium">{language === 'ar' ? 'الشارع/الحي' : 'Street/Area'}</label>
                            <Select value={selectedStreet} onValueChange={setSelectedStreet}>
                              <SelectTrigger>
                                <SelectValue placeholder={language === 'ar' ? 'اختر الشارع...' : 'Select street...'} />
                              </SelectTrigger>
                              <SelectContent>
                                <div className="p-2 border-b">
                                  <Input
                                    placeholder={language === 'ar' ? 'بحث...' : 'Search...'}
                                    className="h-8"
                                    onChange={(e) => {
                                       const searchVal = e.target.value.toLowerCase();
                                       const items = document.querySelectorAll('[role="option"]');
                                       items.forEach((item) => {
                                         if (item.getAttribute('data-value') === 'all') return;
                                         const text = item.textContent?.toLowerCase() || '';
                                         if (text.includes(searchVal)) {
                                           (item as HTMLElement).style.display = '';
                                         } else {
                                           (item as HTMLElement).style.display = 'none';
                                         }
                                       });
                                    }}
                                  />
                                </div>
                                <SelectItem value="all" data-value="all">{language === 'ar' ? 'الكل' : 'All'}</SelectItem>
                                {uniqueStreets.map(street => (
                                  <SelectItem key={street} value={street} data-value={street}>{street}</SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                       </div>
                     </div>
                   </aside>

                   {/* Main Content */}
                   <div className="flex-1 space-y-6">
                      <div className="grid gap-6">
                         {filteredUnis.length > 0 ? filteredUnis.map((uni) => (
                           <Card key={uni.id} className="border-primary/20 shadow-sm relative overflow-hidden flex flex-col md:flex-row hover:shadow-md transition-shadow group">
                             <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-secondary rtl:right-0 rtl:left-auto" />
                             <div className="w-full md:w-56 h-40 md:h-auto bg-muted relative">
                               <img src={uni.image} alt={uni.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                               <div className="absolute top-2 right-2 bg-background/90 backdrop-blur-md px-2 py-1 rounded-full text-xs font-bold flex items-center gap-1 shadow-sm">
                                  <Star className="h-3 w-3 fill-yellow-500 text-yellow-500" />
                                  {uni.rating}
                                </div>
                             </div>
                             <CardContent className="pt-6 pb-6 pr-6 pl-8 rtl:pl-6 rtl:pr-8 flex-1 flex flex-col md:flex-row justify-between gap-6">
                               <div className="flex-1">
                                 <div className="flex items-center gap-3 mb-3">
                                    <div className="w-10 h-10 rounded-full border bg-white p-1 shadow-sm flex-shrink-0">
                                      <img src={uni.logo} alt="logo" className="w-full h-full object-contain" />
                                    </div>
                                    <h3 className="text-2xl font-bold">{language === 'ar' ? uni.nameAr : uni.name}</h3>
                                 </div>
                                 <p className="text-sm text-muted-foreground mb-6 flex items-center gap-1.5">
                                   {language === 'ar' ? uni.locationAr : uni.location}
                                 </p>
                                 
                                 <div className="flex flex-wrap gap-4 text-sm bg-muted/40 p-3.5 rounded-xl border border-border/50">
                                    <div className="flex items-center gap-2 font-medium">
                                      <Clock className="h-4 w-4 text-primary" />
                                      <span>{selectedMajor?.years} {language === 'ar' ? 'سنوات' : 'Years'}</span>
                                    </div>
                                    <div className="w-px h-4 bg-border hidden md:block"></div>
                                    <div className="flex items-center gap-2 font-bold text-primary">
                                      <DollarSign className="h-4 w-4" />
                                      <span>{selectedMajor?.fees.toLocaleString()} SAR</span>
                                    </div>
                                 </div>
                               </div>
                               
                               <div className="flex flex-col justify-center gap-4 min-w-[180px] border-t md:border-t-0 md:border-l rtl:md:border-r rtl:md:border-l-0 pt-6 md:pt-0 md:pl-8 rtl:md:pr-8">
                                 <div className="text-center bg-green-50 rounded-xl p-3 border border-green-100 dark:bg-green-950/20 dark:border-green-900/30">
                                   <span className="text-green-700 dark:text-green-400 text-xs font-bold block mb-1 uppercase tracking-wider">
                                     {language === 'ar' ? 'المعدل المطلوب' : 'Required GPA'}
                                   </span>
                                   <span className="font-black text-2xl text-green-600 dark:text-green-500">{selectedMajor?.gpa}</span>
                                 </div>
                                 <Link href={`/apply/${uni.id}?major=${selectedMajor?.id}`} className="w-full">
                                   <Button className="w-full h-12 text-base bg-secondary hover:bg-secondary/90 text-secondary-foreground font-bold shadow-sm">
                                     {language === 'ar' ? 'تقديم الآن' : 'Apply Now'}
                                   </Button>
                                 </Link>
                               </div>
                             </CardContent>
                           </Card>
                         )) : (
                           <div className="text-center p-16 bg-muted/30 rounded-2xl border border-dashed">
                             <Building className="h-16 w-16 text-muted-foreground/40 mx-auto mb-4" />
                             <p className="text-xl font-bold mb-2">{language === 'ar' ? 'لا توجد جامعات متاحة.' : 'No universities available.'}</p>
                             <p className="text-muted-foreground">
                               {language === 'ar' 
                                 ? 'لم نتمكن من العثور على جامعات تطابق بحثك حالياً.' 
                                 : 'We couldn\'t find universities matching your search currently.'}
                             </p>
                           </div>
                         )}
                      </div>
                   </div>
                </div>
                
                <div className="flex justify-between pt-8 border-t mt-8">
                   <Button variant="outline" onClick={handleBack} size="lg">
                     {language === 'ar' ? 'رجوع' : 'Back'}
                   </Button>
                   <Button variant="ghost" size="lg" onClick={() => { setStep(1); setGpa(0); setSelectedCollegeId(""); setSelectedMajorId(""); }}>
                     {language === 'ar' ? 'البدء من جديد' : 'Start Over'}
                   </Button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </Layout>
  );
}