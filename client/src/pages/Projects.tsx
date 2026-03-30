import { useState, useMemo, useEffect } from "react";
import { Layout } from "@/components/layout/Layout";
import { useLanguage } from "@/contexts/LanguageContext";
import { graduationProjects } from "@/lib/mockData";
import { Link } from "@/lib/inertia-mock";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { FileText } from "lucide-react";
import { Search, Calendar, Heart, ArrowRight, BookOpen, GraduationCap, Filter, X } from "lucide-react";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

export default function Projects() {
  const { t, language } = useLanguage();
  const [likedProjects, setLikedProjects] = useState<Set<string>>(new Set());

  // Pagination State
  const [visibleProjects, setVisibleProjects] = useState(6);
  const projectsPerPage = 6;
  const { ref, inView } = useInView({
    threshold: 0.1,
  });

  // Filter States
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedUniversity, setSelectedUniversity] = useState("all");
  const [selectedCollege, setSelectedCollege] = useState("all");
  const [selectedMajor, setSelectedMajor] = useState("all");
  const [selectedType, setSelectedType] = useState("all");

  const toggleLike = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const newLiked = new Set(likedProjects);
    if (newLiked.has(id)) newLiked.delete(id);
    else newLiked.add(id);
    setLikedProjects(newLiked);
  };

  // Extract unique options for filters
  const uniqueUniversities = Array.from(new Set(graduationProjects.map(p => language === 'ar' ? p.universityNameAr : p.universityName)));
  const uniqueColleges = Array.from(new Set(graduationProjects.map(p => language === 'ar' ? p.collegeNameAr : p.collegeName)));
  const uniqueMajors = Array.from(new Set(graduationProjects.map(p => language === 'ar' ? p.majorNameAr : p.majorName)));

  // Apply filters
  const filteredProjects = graduationProjects.filter(project => {
    const title = language === 'ar' ? project.nameAr : project.name;
    const supervisor = language === 'ar' ? project.supervisorNameAr : project.supervisorName;
    const members = language === 'ar' ? project.memberNamesAr.join(' ') : project.memberNames.join(' ');
    
    const matchesSearch = 
      title.toLowerCase().includes(searchQuery.toLowerCase()) || 
      supervisor.toLowerCase().includes(searchQuery.toLowerCase()) ||
      members.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesUniversity = selectedUniversity === 'all' || (language === 'ar' ? project.universityNameAr : project.universityName) === selectedUniversity;
    const matchesCollege = selectedCollege === 'all' || (language === 'ar' ? project.collegeNameAr : project.collegeName) === selectedCollege;
    const matchesMajor = selectedMajor === 'all' || (language === 'ar' ? project.majorNameAr : project.majorName) === selectedMajor;
    const matchesType = selectedType === 'all' || project.projectType === selectedType;

    return matchesSearch && matchesUniversity && matchesCollege && matchesMajor && matchesType;
  });

  const currentProjects = filteredProjects.slice(0, visibleProjects);
  const hasMore = visibleProjects < filteredProjects.length;

  useEffect(() => {
    if (inView && hasMore) {
      setVisibleProjects(prev => prev + projectsPerPage);
    }
  }, [inView, hasMore]);

  const resetFilters = () => {
    setSearchQuery("");
    setSelectedUniversity("all");
    setSelectedCollege("all");
    setSelectedMajor("all");
    setSelectedType("all");
    setVisibleProjects(projectsPerPage);
  };

  // Reset to first page when filters change
  useEffect(() => {
    setVisibleProjects(projectsPerPage);
  }, [searchQuery, selectedUniversity, selectedCollege, selectedMajor, selectedType]);

  const hasActiveFilters = searchQuery || selectedUniversity !== "all" || selectedCollege !== "all" || selectedMajor !== "all" || selectedType !== "all";

  return (
    <Layout>
      <div className="bg-muted/30 py-12">
        <div className="container mx-auto px-4 ">
          <h1 className="text-4xl font-bold mb-4">{t('projects')}</h1>
          <p className="text-muted-foreground">{t('latestProjects')}</p>
        </div>
      </div>

      <div className="container mx-auto py-12 px-4 ">
        
        {/* Advanced Filters Section */}
        <div className="bg-card border rounded-2xl p-6 shadow-sm mb-10 space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold flex items-center gap-2">
              <Filter className="h-5 w-5 text-primary" /> {t('filterBy')}
            </h3>
            {hasActiveFilters && (
              <Button variant="ghost" size="sm" onClick={resetFilters} className="text-muted-foreground hover:text-foreground">
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
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            {/* University Select */}
            <Select value={selectedUniversity} onValueChange={setSelectedUniversity}>
              <SelectTrigger>
                <SelectValue placeholder={t('allUniversities')} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t('allUniversities')}</SelectItem>
                {uniqueUniversities.map((uni) => (
                  <SelectItem key={uni} value={uni}>{uni}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* College Select */}
            <Select value={selectedCollege} onValueChange={(val) => {
              setSelectedCollege(val);
              setSelectedMajor("all"); // Reset major when college changes
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
                  // Filter majors based on selected college if one is selected
                  .filter(major => {
                    if (selectedCollege === 'all') return true;
                    // Find a project that has this major and the selected college
                    return graduationProjects.some(p => 
                      (language === 'ar' ? p.majorNameAr : p.majorName) === major && 
                      (language === 'ar' ? p.collegeNameAr : p.collegeName) === selectedCollege
                    );
                  })
                  .map((major) => (
                    <SelectItem key={major} value={major}>{major}</SelectItem>
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

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {currentProjects.length > 0 ? currentProjects.map((project, index) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: (index % projectsPerPage) * 0.1 }}
            >
              <Card className="overflow-hidden hover:shadow-lg transition-all h-full flex flex-col group border-border/50">
                <CardHeader>
                  <div className="flex items-center justify-between mb-2">
                    <Link 
                      href={`/universities/${project.universityId}`}
                      className="bg-primary/10 text-primary text-xs px-2 py-1 rounded-full font-bold hover:bg-primary/20 transition-colors"
                    >
                       {language === 'ar' ? project.universityNameAr : project.universityName}
                    </Link>
                    <span className="bg-secondary/10 text-secondary text-xs px-2 py-1 rounded-full font-bold">
                      {language === 'ar' ? project.projectTypeAr : project.projectType}
                    </span>
                  </div>
                  <CardTitle className="text-xl leading-tight group-hover:text-primary transition-colors mt-2">
                    {language === 'ar' ? project.nameAr : project.name}
                  </CardTitle>
                </CardHeader>
                <CardContent className="flex-1">
                  <p className="text-sm text-muted-foreground line-clamp-3 mb-4">
                    {language === 'ar' ? project.descriptionAr : project.description}
                  </p>
                  <div className="text-sm text-muted-foreground flex flex-col gap-2">
                    <span className="flex items-center gap-2"><BookOpen className="h-4 w-4" /> {language === 'ar' ? project.collegeNameAr : project.collegeName}</span>
                    <span className="flex items-center gap-2"><GraduationCap className="h-4 w-4" /> {language === 'ar' ? project.majorNameAr : project.majorName}</span>
                  </div>
                </CardContent>
                <CardFooter className="border-t pt-4 text-xs text-muted-foreground flex justify-between items-center">
                   <div className="flex items-center gap-4">
                     <div className="flex items-center gap-1">
                       <Calendar className="h-3 w-3" />
                       {project.date}
                     </div>
                   </div>
                   <Dialog>
                     <DialogTrigger asChild>
                       <Button variant="link" size="sm" className="p-0 h-auto font-bold text-primary">
                         {t('viewDetails')} <ArrowRight className="ml-1 h-3 w-3 rtl:rotate-180 rtl:ml-0 rtl:mr-1" />
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
                          
                          <div className="pt-4 flex flex-col sm:flex-row gap-4 justify-between items-center border-t">
                            <Link href={`/universities/${project.universityId}`}>
                              <Button variant="outline" className="gap-2 w-full sm:w-auto">
                                <GraduationCap className="h-4 w-4" />
                                {language === 'ar' ? 'صفحة الجامعة' : 'University Page'}
                              </Button>
                            </Link>
                            <Button variant="default" className="gap-2 w-full sm:w-auto" onClick={() => window.open(project.pdfLink, "_blank")}>
                              <span className="flex items-center gap-2">
                                <BookOpen className="h-4 w-4" />
                                {language === 'ar' ? 'عرض وثيقة المشروع' : 'View Project Document'}
                              </span>
                            </Button>
                          </div>
                        </div>
                      </DialogContent>
                   </Dialog>
                </CardFooter>
              </Card>
            </motion.div>
          )) : (
            <div className="col-span-full text-center py-16 px-4 bg-muted/20 border border-dashed rounded-2xl">
              <GraduationCap className="h-12 w-12 text-muted-foreground/50 mx-auto mb-4" />
              <h3 className="text-xl font-bold mb-2">{language === 'ar' ? 'لا توجد نتائج' : 'No results found'}</h3>
              <p className="text-muted-foreground mb-4">
                {language === 'ar' 
                  ? 'لم نتمكن من العثور على أي مشاريع تطابق خيارات البحث الحالية.' 
                  : 'We couldn\'t find any projects matching your current search criteria.'}
              </p>
              <Button variant="outline" onClick={resetFilters}>
                {t('resetFilters')}
              </Button>
            </div>
          )}
        </div>

        {/* Infinite Scroll trigger element */}
        {hasMore && (
          <div ref={ref} className="flex justify-center items-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        )}
      </div>
    </Layout>
  );
}