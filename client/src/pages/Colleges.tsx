import { Layout } from "@/components/layout/Layout";
import { useLanguage } from "@/contexts/LanguageContext";
import { colleges, universities } from "@/lib/mockData";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { router } from "@/lib/inertia-mock";
import { Clock, Briefcase, GraduationCap, MapPin, Star, Filter, Search } from "lucide-react";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function Colleges() {
  const { t, language } = useLanguage();
  const [selectedMajorId, setSelectedMajorId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("rating");

  const selectedMajor = colleges.flatMap(c => c.majors).find(m => m.id === selectedMajorId);
  const offeringUniversities = universities.filter(u => {
    // In our mock, let's say major m1 is in all unis, m2 is in uni 1 & 2, m3 is in uni 2 & 3
    if (selectedMajorId === 'm1') return true;
    if (selectedMajorId === 'm2') return u.id === '1' || u.id === '2';
    if (selectedMajorId === 'm3') return u.id === '2' || u.id === '3';
    return false;
  });

  const filteredUnis = offeringUniversities.filter(u => 
    (language === 'ar' ? u.nameAr : u.name).toLowerCase().includes(searchTerm.toLowerCase()) ||
    (language === 'ar' ? u.locationAr : u.location).toLowerCase().includes(searchTerm.toLowerCase())
  ).sort((a, b) => {
    if (sortBy === "rating") {
      return b.rating - a.rating;
    } else if (sortBy === "fees_low") {
       // Using the major's fee for sorting
      return (selectedMajor?.fees || 0) - (selectedMajor?.fees || 0); // In reality would compare per uni
    } else if (sortBy === "fees_high") {
      return (selectedMajor?.fees || 0) - (selectedMajor?.fees || 0);
    }
    return 0;
  });

  return (
    <Layout>
      <div className="bg-muted/30 py-12 px-4 md:px-0">
        <div className="container mx-auto">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">{t('colleges')}</h1>
          <p className="text-muted-foreground">{t('exploreColleges')}</p>
        </div>
      </div>

      <div className="container mx-auto py-12 px-4 md:px-0">
        {!selectedMajorId ? (
          <Accordion type="single" collapsible className="w-full space-y-4">
            {colleges.map((college) => (
              <AccordionItem key={college.id} value={college.id} className="border rounded-lg px-4 bg-card shadow-sm">
                <AccordionTrigger className="hover:no-underline py-4">
                  <div className="flex items-center gap-4 text-left rtl:text-right w-full">
                    <div className="h-12 w-12 md:h-16 md:w-16 rounded overflow-hidden bg-muted flex-shrink-0">
                      <img src={college.image} className="w-full h-full object-cover" alt={college.name} />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg md:text-xl font-bold">{language === 'ar' ? college.nameAr : college.name}</h3>
                      <p className="text-xs md:text-sm text-muted-foreground font-normal">
                        {college.majors.length} {language === 'ar' ? 'تخصصات متاحة' : 'Majors Available'}
                      </p>
                    </div>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="pt-4 pb-6 border-t mt-2">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {college.majors.map((major) => (
                      <Card key={major.id} className="p-6 hover:shadow-md transition-all border-border/50">
                        <h4 className="font-bold text-lg mb-2">{language === 'ar' ? major.nameAr : major.name}</h4>
                        <p className="text-sm text-muted-foreground mb-4 line-clamp-3">
                          {language === 'ar' ? major.descriptionAr : major.description}
                        </p>
                        
                        <div className="space-y-4 mb-6">
                          <div className="grid grid-cols-2 gap-3">
                            <div className="flex flex-col gap-1 bg-muted/50 p-3 rounded-lg border border-border/50 text-sm font-medium">
                              <div className="flex items-center gap-2 text-muted-foreground text-xs mb-1">
                                <Clock className="h-4 w-4 text-primary" />
                                {language === 'ar' ? 'سنوات الدراسة' : 'Years of study'}
                              </div>
                              <span className="font-bold text-lg">{major.years}</span>
                            </div>
                            <div className="flex flex-col gap-1 bg-muted/50 p-3 rounded-lg border border-border/50 text-sm font-medium">
                              <div className="flex items-center gap-2 text-muted-foreground text-xs mb-1">
                                <GraduationCap className="h-4 w-4 text-green-600" />
                                {language === 'ar' ? 'المعدل المطلوب' : 'Required GPA'}
                              </div>
                              <span className="font-bold text-lg text-green-600">{major.gpa}</span>
                            </div>
                          </div>
                          
                          <div className="space-y-3 pt-2">
                            <div className="flex items-center gap-2 mb-3">
                              <div className="bg-primary/10 p-1.5 rounded-md">
                                <Briefcase className="h-4 w-4 text-primary" />
                              </div>
                              <p className="text-sm font-bold text-foreground">{language === 'ar' ? 'أبرز الفرص الوظيفية' : 'Top Career Opportunities'}</p>
                            </div>
                            <div className="flex flex-wrap gap-2">
                              {(language === 'ar' ? major.careerOpportunitiesAr : major.careerOpportunities)?.map((job, idx) => (
                                <span key={idx} className="bg-muted text-foreground text-xs font-medium px-3 py-1.5 rounded-md border border-border shadow-sm">
                                  {job}
                                </span>
                              ))}
                            </div>
                          </div>
                        </div>

                        <Button 
                          onClick={() => setSelectedMajorId(major.id)} 
                          className="w-full bg-secondary text-secondary-foreground font-bold hover:bg-secondary/90"
                        >
                          {language === 'ar' ? 'عرض الجامعات والتقديم' : 'View Unis & Apply'}
                        </Button>
                      </Card>
                    ))}
                  </div>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        ) : (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <Button variant="ghost" onClick={() => setSelectedMajorId(null)} className="mb-4">
               {language === 'ar' ? '← العودة للكليات' : '← Back to Colleges'}
            </Button>
            
            <div className="bg-card p-6 rounded-2xl border border-primary/10 shadow-sm mb-12">
               <h2 className="text-3xl font-bold mb-2 text-primary">{language === 'ar' ? selectedMajor?.nameAr : selectedMajor?.name}</h2>
               <p className="text-muted-foreground max-w-3xl mb-4">{language === 'ar' ? selectedMajor?.descriptionAr : selectedMajor?.description}</p>
               <div className="flex flex-wrap gap-4 mt-6">
                  <div className="flex flex-col justify-center items-center gap-1 bg-muted px-6 py-3 rounded-xl border shadow-sm min-w-[120px]">
                    <div className="flex items-center gap-1 text-xs text-muted-foreground uppercase tracking-wider font-semibold">
                      <Clock className="h-3.5 w-3.5 text-primary" />
                      <span>{language === 'ar' ? 'مدة الدراسة' : 'Study Duration'}</span>
                    </div>
                    <div className="text-2xl font-black text-primary">
                      {selectedMajor?.years} <span className="text-sm font-normal text-muted-foreground">{language === 'ar' ? 'سنوات' : 'Years'}</span>
                    </div>
                  </div>
                  <div className="flex flex-col justify-center items-center gap-1 bg-muted px-6 py-3 rounded-xl border shadow-sm min-w-[120px]">
                    <div className="flex items-center gap-1 text-xs text-muted-foreground uppercase tracking-wider font-semibold">
                      <GraduationCap className="h-3.5 w-3.5 text-green-600" />
                      <span>{language === 'ar' ? 'المعدل المطلوب' : 'Required GPA'}</span>
                    </div>
                    <div className="text-2xl font-black text-green-600">
                      {selectedMajor?.gpa} <span className="text-sm font-normal text-muted-foreground">+</span>
                    </div>
                  </div>
               </div>
            </div>

            <div className="flex flex-col md:flex-row gap-8">
               <aside className="w-full md:w-64 space-y-6">
                 <div className="bg-card p-6 rounded-xl border shadow-sm sticky top-24">
                   <div className="flex items-center gap-2 font-bold mb-4">
                     <Filter className="h-4 w-4" />
                     <span>{language === 'ar' ? 'تصفية' : 'Filter'}</span>
                   </div>
                   <div className="space-y-4">
                      <div className="space-y-2">
                        <label className="text-xs font-medium uppercase text-muted-foreground">{language === 'ar' ? 'بحث' : 'Search'}</label>
                        <Input 
                          placeholder={t('search')} 
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-medium uppercase text-muted-foreground">{language === 'ar' ? 'ترتيب حسب' : 'Sort By'}</label>
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
                   </div>
                 </div>
               </aside>

               <div className="flex-1 space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {filteredUnis.map((uni) => (
                      <Card key={uni.id} className="overflow-hidden hover:shadow-lg transition-all border-border/50 group">
                        <div className="aspect-video relative overflow-hidden">
                           <img src={uni.image} className="w-full h-full object-cover transition-transform group-hover:scale-105" />
                           <div className="absolute top-3 right-3 bg-card/90 backdrop-blur-md px-3 py-1.5 rounded-full text-sm font-bold flex items-center gap-1.5 shadow-sm border border-border text-foreground">
                              <Star className="h-4 w-4 fill-yellow-500 text-yellow-500" />
                              {uni.rating}
                            </div>
                        </div>
                        <CardContent className="p-6">
                           <h3 className="text-xl font-bold mb-1">{language === 'ar' ? uni.nameAr : uni.name}</h3>
                           <div className="flex items-center gap-1 text-sm text-muted-foreground mb-4">
                             <MapPin className="h-3.3 w-3.3" />
                             {language === 'ar' ? uni.locationAr : uni.location}
                           </div>
                           <div className="flex justify-between items-center mt-4 pt-4 border-t">
                             <div className="text-primary font-bold">
                               {selectedMajor?.fees.toLocaleString()} SAR
                             </div>
                             <Button size="sm" onClick={() => router.visit(`/apply/${uni.id}?major=${selectedMajorId}`)} className="bg-secondary text-secondary-foreground font-bold">
                               {t('apply')}
                             </Button>
                           </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
               </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}
