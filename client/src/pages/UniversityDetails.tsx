import { useState, useMemo, useEffect } from "react";
import { useRoute } from "wouter";
import { router, Link } from "@/lib/inertia-mock";
import { Layout } from "@/components/layout/Layout";
import { useLanguage } from "@/contexts/LanguageContext";
import { universities, colleges, majors, graduationProjects } from "@/lib/mockData";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MapPin, Star, GraduationCap, Clock, DollarSign, BookOpen, ArrowLeft, Heart, ArrowRight, CheckCircle2, Search, Filter, X, Briefcase } from "lucide-react";
import NotFound from "./not-found";
import { motion } from "framer-motion";
import { Input } from "@/components/ui/input";
import { useInView } from "react-intersection-observer";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { toast } from "sonner";

export default function UniversityDetails() {
  const [match, params] = useRoute("/universities/:id");
  const { t, language } = useLanguage();
  const [likedProjects, setLikedProjects] = useState<Set<string>>(new Set());
  const [userRating, setUserRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [isRated, setIsRated] = useState(false);
  const [currentUniRating, setCurrentUniRating] = useState<number | null>(null);

  // Filter States for Projects
  const [searchProject, setSearchProject] = useState("");
  const [selectedCollege, setSelectedCollege] = useState("all");
  const [selectedMajor, setSelectedMajor] = useState("all");
  const [selectedDate, setSelectedDate] = useState("all");
  const [selectedType, setSelectedType] = useState("all");

  const toggleLike = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const newLiked = new Set(likedProjects);
    if (newLiked.has(id)) newLiked.delete(id);
    else newLiked.add(id);
    setLikedProjects(newLiked);
  };

  const handleRate = (rating: number) => {
    // Check if user is logged in
    if (localStorage.getItem('isLoggedIn') !== 'true') {
      toast.error(language === 'ar' ? 'يجب تسجيل الدخول أولاً للتقييم' : 'You must login first to rate');
      return;
    }

    const isEditing = isRated;
    setUserRating(rating);
    setIsRated(true);
    
    // Simulate updating the overall rating for mockup purposes
    if (uni) {
      const baseRating = currentUniRating || uni.rating;
      const newRating = isEditing 
        ? Number((baseRating + (rating - userRating) * 0.1).toFixed(1))
        : Number(((baseRating * 10 + rating) / 11).toFixed(1));
      
      setCurrentUniRating(newRating);
    }

    // Inertia.js integration (Mocked for Preview)
    router.post(`/universities/${uni?.id}/rate`, {
      rating: rating,
    }, {
      preserveScroll: true,
      onSuccess: () => {
        toast.success(language === 'ar' ? 'تم التحديث بنجاح' : 'Updated successfully');
      },
    });

    toast.success(language === 'ar' ? (isEditing ? 'تم تحديث تقييمك بنجاح' : 'شكراً لتقييمك!') : (isEditing ? 'Rating updated successfully' : 'Thank you!'), {
      description: language === 'ar' ? 'تم الربط مع واجهة Inertia بنجاح' : 'Connected to Inertia interface successfully',
      icon: <Star className="h-4 w-4 fill-yellow-400 text-yellow-400 animate-bounce" />,
      duration: 4000,
    });
  };
  
  if (!match) return <NotFound />;

  const uni = universities.find(u => u.id === params.id);
  if (!uni) return <NotFound />;

  // Filter projects specific to this university
  const universityProjects = graduationProjects.filter(p => p.universityId === uni.id);
  
  // Extract unique filter options from the university's projects
  const uniqueColleges = Array.from(new Set(universityProjects.map(p => language === 'ar' ? p.collegeNameAr : p.collegeName)));
  const uniqueMajors = Array.from(new Set(universityProjects.map(p => language === 'ar' ? p.majorNameAr : p.majorName)));
  const uniqueDates = Array.from(new Set(universityProjects.map(p => p.date.substring(0, 4)))).sort((a, b) => b.localeCompare(a));
  
  // Projects Pagination State
  const [visibleProjects, setVisibleProjects] = useState(6);
  const projectsPerPage = 6;
  const { ref, inView } = useInView({
    threshold: 0.1,
  });

  // Apply Filters
  const filteredProjects = universityProjects.filter(project => {
    const matchesSearch = 
      (language === 'ar' ? project.nameAr : project.name).toLowerCase().includes(searchProject.toLowerCase()) ||
      (language === 'ar' ? project.supervisorNameAr : project.supervisorName).toLowerCase().includes(searchProject.toLowerCase()) ||
      (language === 'ar' ? project.memberNamesAr.join(' ') : project.memberNames.join(' ')).toLowerCase().includes(searchProject.toLowerCase());
      
    const matchesCollege = selectedCollege === 'all' || (language === 'ar' ? project.collegeNameAr : project.collegeName) === selectedCollege;
    const matchesMajor = selectedMajor === 'all' || (language === 'ar' ? project.majorNameAr : project.majorName) === selectedMajor;
    const matchesDate = selectedDate === 'all' || project.date.startsWith(selectedDate);
    const matchesType = selectedType === 'all' || project.projectType === selectedType;

    return matchesSearch && matchesCollege && matchesMajor && matchesDate && matchesType;
  });

  const displayedProjects = filteredProjects.slice(0, visibleProjects);
  const hasMoreProjects = visibleProjects < filteredProjects.length;

  useEffect(() => {
    if (inView && hasMoreProjects) {
      setVisibleProjects(prev => prev + projectsPerPage);
    }
  }, [inView, hasMoreProjects]);

  const resetFilters = () => {
    setSearchProject("");
    setSelectedCollege("all");
    setSelectedMajor("all");
    setSelectedDate("all");
    setSelectedType("all");
    setVisibleProjects(projectsPerPage);
  };

  useEffect(() => {
    setVisibleProjects(projectsPerPage);
  }, [searchProject, selectedCollege, selectedMajor, selectedDate, selectedType]);

  const hasActiveFilters = searchProject || selectedCollege !== "all" || selectedMajor !== "all" || selectedDate !== "all" || selectedType !== "all";

  const uniColleges = colleges; 

  return (
    <Layout>
      {/* Hero Header */}
      <div className="relative h-[300px] md:h-[400px] bg-muted overflow-hidden">
        <img 
          src={uni.image} 
          alt={uni.name} 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 container mx-auto pb-6 md:pb-8 px-4 md:px-0">
          <div className="flex flex-col sm:flex-row items-center sm:items-end text-center sm:text-start gap-4 sm:gap-6 mb-4 sm:mb-6">
            <div className="w-24 h-24 md:w-32 md:h-32 rounded-full border-4 border-background overflow-hidden bg-white shadow-xl flex-shrink-0 relative z-10 -mt-12 sm:mt-0">
              <img src={uni.logo} alt="Logo" className="w-full h-full object-contain p-2" />
            </div>
            <div className="flex-1 pb-0 sm:pb-2">
              <Link href="/universities">
                <Button variant="ghost" size="sm" className="mb-2 sm:mb-4 text-white hover:text-white hover:bg-white/20">
                  <ArrowLeft className="h-4 w-4 mr-2 rtl:ml-2 rtl:mr-0" /> {language === 'ar' ? 'العودة للقائمة' : 'Back to List'}
                </Button>
              </Link>
              <h1 className="text-2xl sm:text-3xl md:text-5xl font-bold text-white mb-2 shadow-sm drop-shadow-md">
                {language === 'ar' ? uni.nameAr : uni.name}
              </h1>
            </div>
          </div>
          <div className="flex flex-col md:flex-row justify-between items-center sm:items-end gap-6 sm:gap-4">
            <div className="flex flex-col sm:flex-row items-center gap-4 text-white/90">
              <div className="flex items-center gap-1.5 text-sm md:text-base font-medium bg-black/20 px-3 py-1.5 rounded-full backdrop-blur-sm border border-white/10">
                <MapPin className="h-4 w-4" />
                <span>{language === 'ar' ? uni.locationAr : uni.location}</span>
              </div>
              <div className="flex items-center w-full">
                <div className="w-full">
                  <div className="flex flex-col sm:flex-row items-center sm:justify-start gap-3 bg-white/10 backdrop-blur-md rounded-2xl px-5 py-3 border border-white/20 shadow-xl group/rate transition-all hover:bg-white/20">
                    <div className="flex items-center gap-2">
                      <div className="bg-yellow-500/20 p-2 rounded-full flex items-center justify-center">
                        <Star className="h-4 w-4 md:h-5 md:w-5 fill-yellow-500 text-yellow-500" />
                      </div>
                      <div className="flex flex-col text-white">
                        <span className="text-xs font-medium text-white/80 leading-none mb-1">
                          {language === 'ar' ? 'التقييم العام' : 'Overall Rating'}
                        </span>
                        <span className="text-xl md:text-2xl font-black leading-none flex items-center gap-2 text-yellow-400">
                          {currentUniRating || uni.rating} <span className="text-sm font-medium text-white/70">/ 5.0</span>
                        </span>
                      </div>
                    </div>
                    
                    <div className="w-full sm:w-px h-px sm:h-10 bg-white/20 my-2 sm:my-0 sm:mx-2 hidden sm:block"></div>
                    
                    <div className="flex flex-col items-center sm:items-start gap-1.5">
                      <div className="flex items-center gap-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <button
                            key={star}
                            onClick={() => handleRate(star)}
                            onMouseEnter={() => setHoverRating(star)}
                            onMouseLeave={() => setHoverRating(0)}
                            className="transition-all duration-300 transform hover:scale-125 focus:outline-none cursor-pointer active:scale-95"
                            aria-label={language === 'ar' ? `قيم ${star} نجوم` : `Rate ${star} stars`}
                          >
                            <Star 
                              className={`h-6 w-6 md:h-7 md:w-7 transition-all duration-300 ${
                                star <= (hoverRating || userRating) 
                                  ? 'fill-yellow-400 text-yellow-400 drop-shadow-[0_0_8px_rgba(250,204,21,0.5)] scale-110' 
                                  : 'text-white/30 hover:text-white/60'
                              }`} 
                            />
                          </button>
                        ))}
                      </div>
                      <div className="h-4 flex items-center justify-center sm:justify-start w-full">
                        {isRated ? (
                          <div className="flex items-center gap-1.5 text-green-400 animate-in slide-in-from-bottom-2 duration-500">
                            <CheckCircle2 className="h-3 w-3" />
                            <span className="text-xs font-bold tracking-tight">
                              {language === 'ar' ? 'تم التقييم بنجاح' : 'Rated successfully'}
                            </span>
                          </div>
                        ) : (
                          <span className="text-xs font-bold text-white/80 tracking-tight">
                            {language === 'ar' ? 'اضغط للتقييم' : 'Click to rate'}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto py-8 px-4 sm:px-6 lg:px-8 ">
        <Tabs defaultValue="overview" className="space-y-8">
          <TabsList className="w-full justify-start border-b rounded-none h-auto p-0 bg-transparent flex overflow-x-auto scrollbar-hide">
            <TabsTrigger 
              value="overview" 
              className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-4 md:px-6 py-3 text-sm md:text-base whitespace-nowrap"
            >
              {language === 'ar' ? 'نظرة عامة' : 'Overview'}
            </TabsTrigger>
            <TabsTrigger 
              value="colleges" 
              className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-4 md:px-6 py-3 text-sm md:text-base whitespace-nowrap"
            >
              {language === 'ar' ? 'الكليات والتخصصات' : 'Colleges & Majors'}
            </TabsTrigger>
            <TabsTrigger 
              value="projects" 
              className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-4 md:px-6 py-3 text-sm md:text-base whitespace-nowrap"
            >
              {language === 'ar' ? 'مشاريع التخرج' : 'Graduation Projects'}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="md:col-span-2 space-y-6">
                <section>
                  <h2 className="text-2xl font-bold mb-4">{language === 'ar' ? 'عن الجامعة' : 'About University'}</h2>
                  <p className="text-base md:text-lg text-muted-foreground leading-relaxed">
                    {language === 'ar' ? uni.descriptionAr : uni.description}
                  </p>
                </section>
                
                <section>
                  <h2 className="text-2xl font-bold mb-4">{language === 'ar' ? 'معرض الصور' : 'Gallery'}</h2>
                  <div className="relative overflow-hidden group/gallery">
                    <motion.div 
                      className="flex gap-4 cursor-grab active:cursor-grabbing"
                      drag="x"
                      dragConstraints={{ right: 0, left: -400 }}
                      animate={{ 
                        x: [0, -200, 0],
                      }}
                      transition={{ 
                        duration: 20, 
                        repeat: Infinity, 
                        ease: "linear",
                        repeatType: "reverse"
                      }}
                    >
                      <div className="min-w-[300px] md:min-w-[400px] aspect-video bg-muted rounded-lg overflow-hidden border">
                        <img src={uni.image} className="w-full h-full object-cover hover:scale-105 transition-transform" />
                      </div>
                      <div className="min-w-[300px] md:min-w-[400px] aspect-video bg-muted rounded-lg overflow-hidden border">
                        <img src="https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=800&auto=format&fit=crop&q=60" className="w-full h-full object-cover hover:scale-105 transition-transform" />
                      </div>
                      <div className="min-w-[300px] md:min-w-[400px] aspect-video bg-muted rounded-lg overflow-hidden border">
                        <img src="https://images.unsplash.com/photo-1541339907198-e08756ebafe3?w=800&auto=format&fit=crop&q=60" className="w-full h-full object-cover hover:scale-105 transition-transform" />
                      </div>
                    </motion.div>
                    <div className="absolute inset-y-0 left-0 w-16 bg-gradient-to-r from-background to-transparent pointer-events-none z-10" />
                    <div className="absolute inset-y-0 right-0 w-16 bg-gradient-to-l from-background to-transparent pointer-events-none z-10" />
                  </div>
                </section>
              </div>

              <div className="space-y-6">
                 <Card className="border-primary/10">
                   <CardContent className="pt-6 space-y-4">
                     <h3 className="font-bold text-lg border-b pb-2">{language === 'ar' ? 'حقائق سريعة' : 'Key Facts'}</h3>
                     <div className="space-y-3">
                       <div className="flex justify-between items-center py-2 border-b border-dashed">
                         <span className="text-muted-foreground flex items-center gap-2 text-sm"><DollarSign className="h-4 w-4"/> {language === 'ar' ? 'الرسوم' : 'Tuition'}</span>
                         <span className="font-medium text-sm">{uni.fees === 0 ? (language === 'ar' ? 'مجاني' : 'Free') : `${uni.fees} SAR`}</span>
                       </div>
                       <div className="flex justify-between items-center py-2 border-b border-dashed">
                         <span className="text-muted-foreground flex items-center gap-2 text-sm"><GraduationCap className="h-4 w-4"/> {language === 'ar' ? 'تأسست' : 'Founded'}</span>
                         <span className="font-medium text-sm">1957</span>
                       </div>
                       <div className="flex justify-between items-center py-2 border-b border-dashed">
                         <span className="text-muted-foreground flex items-center gap-2 text-sm"><BookOpen className="h-4 w-4"/> {language === 'ar' ? 'البرامج' : 'Programs'}</span>
                         <span className="font-medium text-sm">120+</span>
                       </div>
                     </div>
                   </CardContent>
                 </Card>
                 
                 <Card className="border-primary/10">
                   <CardContent className="pt-6 space-y-4">
                     <h3 className="font-bold text-lg border-b pb-2">{language === 'ar' ? 'معلومات الموقع' : 'Location Details'}</h3>
                     <div className="space-y-4">
                       <div>
                         <span className="text-xs text-muted-foreground block mb-1">{language === 'ar' ? 'المدينة' : 'City'}</span>
                         <span className="font-medium text-sm">{language === 'ar' ? uni.locationAr : uni.location}</span>
                       </div>
                       {(uni.streetName || uni.streetNameAr) && (
                         <div>
                           <span className="text-xs text-muted-foreground block mb-1">{language === 'ar' ? 'الشارع' : 'Street'}</span>
                           <span className="font-medium text-sm">{language === 'ar' ? uni.streetNameAr : uni.streetName}</span>
                         </div>
                       )}
                       {(uni.landmark || uni.landmarkAr) && (
                         <div>
                           <span className="text-xs text-muted-foreground block mb-1">{language === 'ar' ? 'أقرب معلم' : 'Nearest Landmark'}</span>
                           <span className="font-medium text-sm">{language === 'ar' ? uni.landmarkAr : uni.landmark}</span>
                         </div>
                       )}
                       {uni.mapUrl && (
                         <Button 
                           variant="outline" 
                           className="w-full gap-2 mt-2" 
                           onClick={() => window.open(uni.mapUrl, '_blank')}
                         >
                           <MapPin className="h-4 w-4" />
                           {language === 'ar' ? 'عرض على الخريطة' : 'View on Map'}
                         </Button>
                       )}
                     </div>
                   </CardContent>
                 </Card>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="colleges">
            <div className="space-y-8">
              {uniColleges.map((college) => (
                <Card key={college.id} className="overflow-hidden border-primary/10">
                   <div className="bg-muted/30 p-4 border-b flex items-center gap-4">
                     <div className="h-10 w-10 md:h-12 md:w-12 rounded bg-white overflow-hidden border">
                        <img src={college.image} className="h-full w-full object-cover" />
                     </div>
                     <h3 className="text-lg md:text-xl font-bold">{language === 'ar' ? college.nameAr : college.name}</h3>
                   </div>
                   <div className="p-4 md:p-6 bg-muted/10">
                     <div className="grid gap-6">
                       {college.majors.map((major) => (
                         <div key={major.id} className="bg-card rounded-xl p-5 border shadow-sm hover:shadow-md transition-all">
                           <div className="flex flex-col md:flex-row justify-between md:items-start gap-4 mb-4">
                             <div>
                               <h4 className="text-lg font-bold text-primary mb-1">{language === 'ar' ? major.nameAr : major.name}</h4>
                               <p className="text-sm text-muted-foreground">{language === 'ar' ? major.descriptionAr : major.description}</p>
                             </div>
                             <Link href={`/apply/${uni.id}?major=${major.id}`}>
                               <Button size="sm" className="bg-secondary text-secondary-foreground hover:bg-secondary/90 font-bold w-full md:w-auto">
                                 {t('apply')}
                               </Button>
                             </Link>
                           </div>
                           
                           <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-4">
                             <div className="bg-muted/50 p-3 rounded-lg border border-border/50 flex flex-col justify-center items-center text-center">
                               <Clock className="h-4 w-4 text-primary mb-1" />
                               <span className="text-xs text-muted-foreground mb-1">{language === 'ar' ? 'سنوات الدراسة' : 'Years of Study'}</span>
                               <span className="font-bold">{major.years} <span className="text-xs font-normal">{language === 'ar' ? 'سنوات' : 'Years'}</span></span>
                             </div>
                             <div className="bg-muted/50 p-3 rounded-lg border border-border/50 flex flex-col justify-center items-center text-center">
                               <GraduationCap className="h-4 w-4 text-green-600 mb-1" />
                               <span className="text-xs text-muted-foreground mb-1">{language === 'ar' ? 'المعدل المطلوب' : 'Required GPA'}</span>
                               <span className="font-bold text-green-600">{major.gpa}</span>
                             </div>
                             <div className="bg-muted/50 p-3 rounded-lg border border-border/50 flex flex-col justify-center items-center text-center col-span-2 md:col-span-1">
                               <DollarSign className="h-4 w-4 text-muted-foreground mb-1" />
                               <span className="text-xs text-muted-foreground mb-1">{language === 'ar' ? 'الرسوم السنوية' : 'Annual Fees'}</span>
                               <span className="font-bold">{major.fees === 0 ? (language === 'ar' ? 'مجاني' : 'Free') : `${major.fees.toLocaleString()} SAR`}</span>
                             </div>
                           </div>
                           
                           {((language === 'ar' ? major.careerOpportunitiesAr : major.careerOpportunities) || []).length > 0 && (
                             <div className="pt-4 border-t">
                               <p className="text-sm font-bold text-foreground flex items-center gap-2 mb-3">
                                 <span className="bg-primary/10 p-1 rounded-md inline-block">
                                   <Briefcase className="h-3.5 w-3.5 text-primary" />
                                 </span>
                                 {language === 'ar' ? 'الفرص الوظيفية' : 'Career Opportunities'}
                               </p>
                               <div className="flex flex-wrap gap-2">
                                 {(language === 'ar' ? major.careerOpportunitiesAr : major.careerOpportunities)?.map((job, idx) => (
                                   <span key={idx} className="bg-muted text-foreground text-xs font-medium px-2.5 py-1 rounded-md border border-border shadow-sm">
                                     {job}
                                   </span>
                                 ))}
                               </div>
                             </div>
                           )}
                         </div>
                       ))}
                     </div>
                   </div>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="projects">
            <div className="space-y-6">
              {/* Filters Section */}
              <div className="bg-card border rounded-lg p-4 shadow-sm space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold flex items-center gap-2">
                    <Filter className="h-4 w-4" /> {t('filterBy')}
                  </h3>
                  {hasActiveFilters && (
                    <Button variant="ghost" size="sm" onClick={resetFilters} className="h-8 text-muted-foreground hover:text-foreground">
                      <X className="h-4 w-4 mr-1 rtl:ml-1 rtl:mr-0" /> {t('resetFilters')}
                    </Button>
                  )}
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                  {/* Search Input */}
                  <div className="relative col-span-1 lg:col-span-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground rtl:left-auto rtl:right-3" />
                    <Input 
                      placeholder={t('search')} 
                      className="pl-9 rtl:pl-3 rtl:pr-9"
                      value={searchProject}
                      onChange={(e) => setSearchProject(e.target.value)}
                    />
                  </div>

                  {/* College Select */}
                  <Select value={selectedCollege} onValueChange={(val) => {
                    setSelectedCollege(val);
                    setSelectedMajor("all");
                  }}>
                    <SelectTrigger>
                      <SelectValue placeholder={t('allColleges')} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">{t('allColleges')}</SelectItem>
                      {uniqueColleges.map((college) => (
                        <SelectItem key={college} value={college}>{college}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  {/* Major Select */}
                  <Select value={selectedMajor} onValueChange={setSelectedMajor}>
                    <SelectTrigger>
                      <SelectValue placeholder={t('allMajors')} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">{t('allMajors')}</SelectItem>
                      {uniqueMajors
                        .filter(major => {
                          if (selectedCollege === 'all') return true;
                          return universityProjects.some(p => 
                            (language === 'ar' ? p.majorNameAr : p.majorName) === major && 
                            (language === 'ar' ? p.collegeNameAr : p.collegeName) === selectedCollege
                          );
                        })
                        .map((major) => (
                          <SelectItem key={major} value={major}>{major}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  {/* Date Select */}
                  <Select value={selectedDate} onValueChange={setSelectedDate}>
                    <SelectTrigger>
                      <SelectValue placeholder={t('allDates')} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">{t('allDates')}</SelectItem>
                      {uniqueDates.map((date) => (
                        <SelectItem key={date} value={date}>{date}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  {/* Type Select */}
                  <Select value={selectedType} onValueChange={setSelectedType}>
                    <SelectTrigger>
                      <SelectValue placeholder={t('allTypes')} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">{t('allTypes')}</SelectItem>
                      <SelectItem value="Research">{t('research')}</SelectItem>
                      <SelectItem value="Application">{t('application')}</SelectItem>
                      <SelectItem value="Hardware">{t('hardware')}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Projects Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {displayedProjects.length > 0 ? displayedProjects.map((project) => (
                  <Card key={project.id} className="overflow-hidden hover:shadow-md transition-all border-border/50 group flex flex-col h-full">
                    <div className="p-4 md:p-6 flex flex-col justify-between flex-1">
                      <div>
                        <div className="flex justify-between items-start mb-2">
                          <h3 className="font-bold text-xl line-clamp-2 group-hover:text-primary transition-colors">{language === 'ar' ? project.nameAr : project.name}</h3>
                          <span className="bg-primary/10 text-primary text-xs px-2 py-1 rounded-full font-bold whitespace-nowrap">{language === 'ar' ? project.projectTypeAr : project.projectType}</span>
                        </div>
                        <div className="text-sm text-muted-foreground mb-4 flex flex-wrap gap-x-4 gap-y-2">
                          <span className="flex items-center gap-1"><BookOpen className="h-4 w-4" /> {language === 'ar' ? project.collegeNameAr : project.collegeName}</span>
                          <span className="flex items-center gap-1"><GraduationCap className="h-4 w-4" /> {language === 'ar' ? project.majorNameAr : project.majorName}</span>
                        </div>
                        <p className="text-sm text-muted-foreground line-clamp-3 mb-4">{language === 'ar' ? project.descriptionAr : project.description}</p>
                      </div>
                      
                      <div className="mt-4 pt-4 border-t border-border flex items-center justify-between">
                        <div className="flex items-center gap-4 text-xs text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <Clock className="h-3.5 w-3.5" />
                            {project.date}
                          </div>
                        </div>
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button variant="outline" size="sm" className="font-bold">
                              {t('viewDetails')} <ArrowRight className="ml-2 h-4 w-4 rtl:rotate-180 rtl:ml-0 rtl:mr-2" />
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-3xl">
                            <DialogHeader>
                              <div className="flex items-center gap-2 text-xs text-primary font-bold bg-primary/10 w-fit px-2 py-1 rounded-full mb-2">
                                {language === 'ar' ? project.projectTypeAr : project.projectType}
                              </div>
                              <DialogTitle className="text-2xl font-bold">{language === 'ar' ? project.nameAr : project.name}</DialogTitle>
                              <div className="flex items-center gap-4 text-sm text-muted-foreground mt-2">
                                <span className="font-bold text-primary">{language === 'ar' ? project.universityNameAr : project.universityName}</span>
                                <span>{project.date}</span>
                              </div>
                            </DialogHeader>
                            <div className="mt-6 space-y-6">
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-muted/30 p-4 rounded-lg border">
                                <div>
                                  <span className="text-sm text-muted-foreground block mb-1">{language === 'ar' ? 'الكلية' : 'College'}</span>
                                  <span className="font-medium">{language === 'ar' ? project.collegeNameAr : project.collegeName}</span>
                                </div>
                                <div>
                                  <span className="text-sm text-muted-foreground block mb-1">{language === 'ar' ? 'التخصص' : 'Major'}</span>
                                  <span className="font-medium">{language === 'ar' ? project.majorNameAr : project.majorName}</span>
                                </div>
                                <div>
                                  <span className="text-sm text-muted-foreground block mb-1">{language === 'ar' ? 'المشرف' : 'Supervisor'}</span>
                                  <span className="font-medium">{language === 'ar' ? project.supervisorNameAr : project.supervisorName}</span>
                                </div>
                                <div>
                                  <span className="text-sm text-muted-foreground block mb-1">{language === 'ar' ? 'أعضاء الفريق' : 'Team Members'}</span>
                                  <div className="flex flex-wrap gap-1">
                                    {(language === 'ar' ? project.memberNamesAr : project.memberNames).map((member, i) => (
                                      <span key={i} className="bg-background border px-2 py-0.5 rounded text-sm">{member}</span>
                                    ))}
                                  </div>
                                </div>
                              </div>
                              
                              <div>
                                <h4 className="font-bold text-lg mb-2">{language === 'ar' ? 'وصف المشروع' : 'Project Description'}</h4>
                                <p className="text-muted-foreground leading-relaxed">
                                  {language === 'ar' ? project.descriptionAr : project.description}
                                </p>
                              </div>
                              
                              <div className="pt-4 flex justify-end">
                                <Button variant="default" className="gap-2" onClick={() => window.open(project.pdfLink, "_blank")}>
                                  <span className="flex items-center gap-2">
                                    <BookOpen className="h-4 w-4" />
                                    {language === 'ar' ? 'عرض وثيقة المشروع' : 'View Project Document'}
                                  </span>
                                </Button>
                              </div>
                            </div>
                          </DialogContent>
                        </Dialog>
                      </div>
                    </div>
                  </Card>
                )) : (
                  <div className="col-span-full text-center py-12 text-muted-foreground bg-muted/20 rounded-xl border border-dashed">
                    {language === 'ar' ? 'لا توجد مشاريع تخرج مطابقة للبحث' : 'No graduation projects match your search.'}
                  </div>
                )}
              </div>
              
              {hasMoreProjects && (
                <div ref={ref} className="flex justify-center items-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
}