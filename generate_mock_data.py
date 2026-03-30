import json

mock_data = """export interface University {
  id: string;
  name: string;
  nameAr: string;
  location: string;
  locationAr: string;
  rating: number;
  fees: number;
  image: string;
  logo: string;
  description: string;
  descriptionAr: string;
  mapUrl?: string;
  streetName?: string;
  streetNameAr?: string;
  landmark?: string;
  landmarkAr?: string;
}

export interface College {
  id: string;
  name: string;
  nameAr: string;
  image: string;
  majors: Major[];
}

export interface Major {
  id: string;
  name: string;
  nameAr: string;
  collegeId: string;
  description: string;
  descriptionAr: string;
  years: number;
  fees: number;
  gpa: number;
  careerOpportunities?: string[];
  careerOpportunitiesAr?: string[];
}

export interface GraduationProject {
  id: string;
  name: string;
  nameAr: string;
  collegeName: string;
  collegeNameAr: string;
  majorName: string;
  majorNameAr: string;
  supervisorName: string;
  supervisorNameAr: string;
  memberNames: string[];
  memberNamesAr: string[];
  description: string;
  descriptionAr: string;
  date: string;
  pdfLink: string;
  universityId: string;
  universityName: string;
  universityNameAr: string;
  projectType: 'Research' | 'Application' | 'Hardware';
  projectTypeAr: 'بحث' | 'تطبيق' | 'عتاد';
}

import uniImage1 from '@assets/generated_images/classic_university_building.png';
import uniImage2 from '@assets/generated_images/high-tech_engineering_campus.png';
import uniImage3 from '@assets/generated_images/modern_university_campus_hero.png';

export const universities: University[] = [
  {
    id: '1',
    name: 'King Saud University',
    nameAr: 'جامعة الملك سعود',
    location: 'Riyadh, Saudi Arabia',
    locationAr: 'الرياض',
    streetName: 'King Khalid Road',
    streetNameAr: 'طريق الملك خالد',
    landmark: 'Near Diplomatic Quarter',
    landmarkAr: 'بالقرب من الحي الدبلوماسي',
    rating: 4.8,
    fees: 0,
    image: uniImage1,
    logo: 'https://images.unsplash.com/photo-1599305090598-fe179d501227?w=200&h=200&fit=crop',
    description: 'A premier public university in Riyadh, known for its extensive research programs.',
    descriptionAr: 'جامعة حكومية رائدة في الرياض، تشتهر ببرامجها البحثية المكثفة.',
    mapUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m13!1d3623.238622147317!2d46.61904127595204!3d24.717013350222033!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3e2f1cd8f8373f73%3A0xc665e12815197f26!2sKing%20Saud%20University!5e0!3m2!1sen!2ssa!4v1705574400000!5m2!1sen!2ssa'
  },
  {
    id: '2',
    name: 'King Fahd University of Petroleum & Minerals',
    nameAr: 'جامعة الملك فهد للبترول والمعادن',
    location: 'Dhahran, Saudi Arabia',
    locationAr: 'الظهران',
    streetName: 'Academic Campus Road',
    streetNameAr: 'طريق الحرم الأكاديمي',
    landmark: 'Next to Saudi Aramco',
    landmarkAr: 'بجوار أرامكو',
    rating: 4.9,
    fees: 0,
    image: uniImage2,
    logo: 'https://images.unsplash.com/photo-1599305090598-fe179d501227?w=200&h=200&fit=crop',
    description: 'Specialized in science, engineering, and management. A hub for innovation.',
    descriptionAr: 'متخصصة في العلوم والهندسة والإدارة. مركز للابتكار.',
  },
  {
    id: '3',
    name: 'Alfaisal University',
    nameAr: 'جامعة الفيصل',
    location: 'Riyadh, Saudi Arabia',
    locationAr: 'الرياض',
    rating: 4.5,
    fees: 80000,
    image: uniImage3,
    logo: 'https://images.unsplash.com/photo-1599305090598-fe179d501227?w=200&h=200&fit=crop',
    description: 'A private non-profit university offering world-class education.',
    descriptionAr: 'جامعة خاصة غير ربحية تقدم تعليماً بمستوى عالمي.',
  },
  {
    id: '4',
    name: 'King Abdulaziz University',
    nameAr: 'جامعة الملك عبدالعزيز',
    location: 'Jeddah, Saudi Arabia',
    locationAr: 'جدة',
    rating: 4.7,
    fees: 0,
    image: 'https://images.unsplash.com/photo-1562774053-701939374585?w=800&auto=format&fit=crop',
    logo: 'https://images.unsplash.com/photo-1599305090598-fe179d501227?w=200&h=200&fit=crop',
    description: 'A leading public university located in Jeddah, offering a wide range of programs.',
    descriptionAr: 'جامعة حكومية رائدة تقع في جدة، تقدم مجموعة واسعة من البرامج.',
  },
  {
    id: '5',
    name: 'Prince Sultan University',
    nameAr: 'جامعة الأمير سلطان',
    location: 'Riyadh, Saudi Arabia',
    locationAr: 'الرياض',
    rating: 4.6,
    fees: 75000,
    image: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=800&auto=format&fit=crop',
    logo: 'https://images.unsplash.com/photo-1599305090598-fe179d501227?w=200&h=200&fit=crop',
    description: 'A prominent private university in Riyadh focused on business and technology.',
    descriptionAr: 'جامعة خاصة بارزة في الرياض تركز على الأعمال والتكنولوجيا.',
  },
  {
    id: '6',
    name: 'Imam Abdulrahman Bin Faisal University',
    nameAr: 'جامعة الإمام عبدالرحمن بن فيصل',
    location: 'Dammam, Saudi Arabia',
    locationAr: 'الدمام',
    rating: 4.5,
    fees: 0,
    image: uniImage1,
    logo: 'https://images.unsplash.com/photo-1599305090598-fe179d501227?w=200&h=200&fit=crop',
    description: 'A leading university in the eastern province with a strong focus on health sciences and architecture.',
    descriptionAr: 'جامعة رائدة في المنطقة الشرقية مع تركيز قوي على العلوم الصحية والعمارة.'
  },
  {
    id: '7',
    name: 'King Abdullah University of Science and Technology',
    nameAr: 'جامعة الملك عبدالله للعلوم والتقنية',
    location: 'Thuwal, Saudi Arabia',
    locationAr: 'ثول',
    rating: 4.9,
    fees: 0,
    image: uniImage2,
    logo: 'https://images.unsplash.com/photo-1599305090598-fe179d501227?w=200&h=200&fit=crop',
    description: 'A global destination for scientific and technological education and research.',
    descriptionAr: 'وجهة عالمية للتعليم والبحث العلمي والتكنولوجي.'
  },
  {
    id: '8',
    name: 'Umm Al-Qura University',
    nameAr: 'جامعة أم القرى',
    location: 'Makkah, Saudi Arabia',
    locationAr: 'مكة المكرمة',
    rating: 4.4,
    fees: 0,
    image: uniImage3,
    logo: 'https://images.unsplash.com/photo-1599305090598-fe179d501227?w=200&h=200&fit=crop',
    description: 'One of the oldest universities in Saudi Arabia, highly respected in Islamic studies.',
    descriptionAr: 'واحدة من أقدم الجامعات في المملكة، وتحظى باحترام كبير في الدراسات الإسلامية.'
  },
  {
    id: '9',
    name: 'Princess Nourah bint Abdulrahman University',
    nameAr: 'جامعة الأميرة نورة بنت عبدالرحمن',
    location: 'Riyadh, Saudi Arabia',
    locationAr: 'الرياض',
    rating: 4.6,
    fees: 0,
    image: uniImage1,
    logo: 'https://images.unsplash.com/photo-1599305090598-fe179d501227?w=200&h=200&fit=crop',
    description: 'The largest women\'s university in the world, empowering women through education.',
    descriptionAr: 'أكبر جامعة نسائية في العالم، تعمل على تمكين المرأة من خلال التعليم.'
  },
  {
    id: '10',
    name: 'Qassim University',
    nameAr: 'جامعة القصيم',
    location: 'Buraidah, Saudi Arabia',
    locationAr: 'بريدة',
    rating: 4.3,
    fees: 0,
    image: uniImage2,
    logo: 'https://images.unsplash.com/photo-1599305090598-fe179d501227?w=200&h=200&fit=crop',
    description: 'A prominent university offering diverse programs across various disciplines.',
    descriptionAr: 'جامعة بارزة تقدم برامج متنوعة في مختلف التخصصات.'
  }
];

export const colleges: College[] = [
  { id: 'c1', name: 'College of Engineering', nameAr: 'كلية الهندسة', image: uniImage2, majors: [] },
  { id: 'c2', name: 'College of Medicine', nameAr: 'كلية الطب', image: uniImage3, majors: [] },
  { id: 'c3', name: 'College of Computer Science', nameAr: 'كلية علوم الحاسب', image: uniImage2, majors: [] },
  { id: 'c4', name: 'College of Business', nameAr: 'كلية إدارة الأعمال', image: uniImage1, majors: [] },
  { id: 'c5', name: 'College of Sciences', nameAr: 'كلية العلوم', image: uniImage3, majors: [] },
  { id: 'c6', name: 'College of Law', nameAr: 'كلية الحقوق', image: uniImage1, majors: [] },
];

export const majors: Major[] = [
  {
    id: 'm1', name: 'Software Engineering', nameAr: 'هندسة البرمجيات', collegeId: 'c3',
    description: 'Learn to design and build complex software systems.', descriptionAr: 'تعلم تصميم وبناء أنظمة البرمجيات المعقدة.',
    years: 4, fees: 80000, gpa: 4.5,
    careerOpportunities: ['Software Developer', 'Systems Architect', 'Project Manager', 'Data Scientist'], careerOpportunitiesAr: ['مطور برمجيات', 'معماري أنظمة', 'مدير مشاريع', 'عالم بيانات']
  },
  {
    id: 'm2', name: 'Civil Engineering', nameAr: 'الهندسة المدنية', collegeId: 'c1',
    description: 'Design and oversee construction of infrastructure projects.', descriptionAr: 'تصميم والإشراف على بناء مشاريع البنية التحتية.',
    years: 4, fees: 75000, gpa: 4.0,
    careerOpportunities: ['Civil Engineer', 'Structural Designer', 'Site Manager', 'Urban Planner'], careerOpportunitiesAr: ['مهندس مدني', 'مصمم إنشائي', 'مدير موقع', 'مخطط حضري']
  },
  {
    id: 'm3', name: 'Medicine', nameAr: 'الطب البشري', collegeId: 'c2',
    description: 'Prepare for a career in healthcare and patient treatment.', descriptionAr: 'الاستعداد لمهنة في مجال الرعاية الصحية وعلاج المرضى.',
    years: 7, fees: 120000, gpa: 4.8,
    careerOpportunities: ['Physician', 'Surgeon', 'Medical Researcher'], careerOpportunitiesAr: ['طبيب عام', 'جراح', 'باحث طبي']
  },
  {
    id: 'm4', name: 'Computer Science', nameAr: 'علوم الحاسب', collegeId: 'c3',
    description: 'Study of computation, algorithms, and data structures.', descriptionAr: 'دراسة الحوسبة والخوارزميات وهياكل البيانات.',
    years: 4, fees: 75000, gpa: 4.2,
    careerOpportunities: ['Software Engineer', 'Data Analyst', 'Database Administrator'], careerOpportunitiesAr: ['مهندس برمجيات', 'محلل بيانات', 'مسؤول قواعد بيانات']
  },
  {
    id: 'm5', name: 'Artificial Intelligence', nameAr: 'الذكاء الاصطناعي', collegeId: 'c3',
    description: 'Advanced studies in machine learning and AI systems.', descriptionAr: 'دراسات متقدمة في تعلم الآلة وأنظمة الذكاء الاصطناعي.',
    years: 4, fees: 85000, gpa: 4.6,
    careerOpportunities: ['AI Engineer', 'Machine Learning Researcher', 'Robotics Engineer'], careerOpportunitiesAr: ['مهندس ذكاء اصطناعي', 'باحث تعلم آلة', 'مهندس روبوتات']
  },
  {
    id: 'm6', name: 'Electrical Engineering', nameAr: 'الهندسة الكهربائية', collegeId: 'c1',
    description: 'Study of electronics, electromagnetism, and electrical systems.', descriptionAr: 'دراسة الإلكترونيات والكهرومغناطيسية والأنظمة الكهربائية.',
    years: 4, fees: 78000, gpa: 4.3,
    careerOpportunities: ['Electrical Engineer', 'Electronics Designer', 'Power Systems Engineer'], careerOpportunitiesAr: ['مهندس كهربائي', 'مصمم إلكترونيات', 'مهندس أنظمة طاقة']
  },
  {
    id: 'm7', name: 'Dentistry', nameAr: 'طب الأسنان', collegeId: 'c2',
    description: 'Diagnosis, prevention, and treatment of oral diseases.', descriptionAr: 'تشخيص والوقاية وعلاج أمراض الفم والأسنان.',
    years: 6, fees: 110000, gpa: 4.7,
    careerOpportunities: ['Dentist', 'Orthodontist', 'Oral Surgeon'], careerOpportunitiesAr: ['طبيب أسنان', 'أخصائي تقويم', 'جراح فم']
  },
  {
    id: 'm8', name: 'Finance', nameAr: 'المالية', collegeId: 'c4',
    description: 'Study of money management, investments, and financial systems.', descriptionAr: 'دراسة إدارة الأموال والاستثمارات والأنظمة المالية.',
    years: 4, fees: 65000, gpa: 3.8,
    careerOpportunities: ['Financial Analyst', 'Investment Banker', 'Financial Planner'], careerOpportunitiesAr: ['محلل مالي', 'مصرفي استثماري', 'مخطط مالي']
  },
  {
    id: 'm9', name: 'Accounting', nameAr: 'المحاسبة', collegeId: 'c4',
    description: 'Measurement, processing, and communication of financial information.', descriptionAr: 'قياس ومعالجة وتوصيل المعلومات المالية.',
    years: 4, fees: 60000, gpa: 3.7,
    careerOpportunities: ['Accountant', 'Auditor', 'Tax Consultant'], careerOpportunitiesAr: ['محاسب', 'مدقق حسابات', 'مستشار ضريبي']
  },
  {
    id: 'm10', name: 'Physics', nameAr: 'الفيزياء', collegeId: 'c5',
    description: 'Study of matter, energy, and the fundamental forces of nature.', descriptionAr: 'دراسة المادة والطاقة والقوى الأساسية للطبيعة.',
    years: 4, fees: 50000, gpa: 3.5,
    careerOpportunities: ['Physicist', 'Research Scientist', 'Data Analyst'], careerOpportunitiesAr: ['فيزيائي', 'عالم أبحاث', 'محلل بيانات']
  },
  {
    id: 'm11', name: 'Law', nameAr: 'القانون', collegeId: 'c6',
    description: 'Study of the legal system, legislation, and regulations.', descriptionAr: 'دراسة النظام القانوني والتشريعات واللوائح.',
    years: 4, fees: 70000, gpa: 4.1,
    careerOpportunities: ['Lawyer', 'Legal Advisor', 'Judge'], careerOpportunitiesAr: ['محامي', 'مستشار قانوني', 'قاضي']
  }
];

colleges[0].majors = [majors[1], majors[5]]; 
colleges[1].majors = [majors[2], majors[6]]; 
colleges[2].majors = [majors[0], majors[3], majors[4]]; 
colleges[3].majors = [majors[7], majors[8]]; 
colleges[4].majors = [majors[9]]; 
colleges[5].majors = [majors[10]]; 

export const graduationProjects: GraduationProject[] = [
  {
    id: 'gp1', name: 'AI-Powered University Guidance System', nameAr: 'نظام توجيه جامعي مدعوم بالذكاء الاصطناعي',
    collegeName: 'College of Computer Science', collegeNameAr: 'كلية علوم الحاسب',
    majorName: 'Software Engineering', majorNameAr: 'هندسة البرمجيات',
    supervisorName: 'Dr. Ahmed Al-Malki', supervisorNameAr: 'د. أحمد المالكي',
    memberNames: ['Mohammed Al-Otaibi', 'Omar Al-Ghamdi'], memberNamesAr: ['محمد العتيبي', 'عمر الغامدي'],
    description: 'A platform that uses AI to recommend suitable majors for high school students.', descriptionAr: 'منصة تستخدم الذكاء الاصطناعي لاقتراح التخصصات المناسبة لطلاب الثانوية.',
    date: '2025-12-01', pdfLink: '#', universityId: '1', universityName: 'King Saud University', universityNameAr: 'جامعة الملك سعود', projectType: 'Application', projectTypeAr: 'تطبيق'
  },
  {
    id: 'gp2', name: 'Smart Traffic Management for Smart Cities', nameAr: 'إدارة المرور الذكية للمدن الذكية',
    collegeName: 'College of Engineering', collegeNameAr: 'كلية الهندسة',
    majorName: 'Civil Engineering', majorNameAr: 'الهندسة المدنية',
    supervisorName: 'Dr. Faisal Al-Harbi', supervisorNameAr: 'د. فيصل الحربي',
    memberNames: ['Khalid Al-Dossari', 'Saad Al-Shahrani'], memberNamesAr: ['خالد الدوسري', 'سعد الشهراني'],
    description: 'Designing a smart traffic light system that adapts to real-time traffic.', descriptionAr: 'تصميم نظام إشارات مرور ذكي يتكيف مع تدفق حركة المرور في الوقت الفعلي.',
    date: '2026-04-15', pdfLink: '#', universityId: '2', universityName: 'KFUPM', universityNameAr: 'جامعة الملك فهد', projectType: 'Research', projectTypeAr: 'بحث'
  },
  {
    id: 'gp3', name: 'Automated Medical Diagnostic Tool', nameAr: 'أداة تشخيص طبي آلية',
    collegeName: 'College of Medicine', collegeNameAr: 'كلية الطب',
    majorName: 'Medicine', majorNameAr: 'الطب البشري',
    supervisorName: 'Dr. Sara Al-Hassan', supervisorNameAr: 'د. سارة الحسن',
    memberNames: ['Noura Al-Saud', 'Reem Al-Qahtani'], memberNamesAr: ['نورة آل سعود', 'ريم القحطاني'],
    description: 'A software tool assisting doctors in diagnosing diseases from medical images.', descriptionAr: 'أداة برمجية تساعد الأطباء في تشخيص الأمراض من خلال الصور الطبية.',
    date: '2026-01-20', pdfLink: '#', universityId: '3', universityName: 'Alfaisal University', universityNameAr: 'جامعة الفيصل', projectType: 'Application', projectTypeAr: 'تطبيق'
  },
  {
    id: 'gp4', name: 'Blockchain for Academic Credentials', nameAr: 'سلسلة الكتل للشهادات الأكاديمية',
    collegeName: 'College of Computer Science', collegeNameAr: 'كلية علوم الحاسب',
    majorName: 'Computer Science', majorNameAr: 'علوم الحاسب',
    supervisorName: 'Dr. Yasser Al-Zahrani', supervisorNameAr: 'د. ياسر الزهراني',
    memberNames: ['Ali Al-Shehri', 'Fahad Al-Mutairi'], memberNamesAr: ['علي الشهري', 'فهد المطيري'],
    description: 'A secure blockchain system to issue and verify university degrees.', descriptionAr: 'نظام آمن يعتمد على البلوكتشين لإصدار والتحقق من الشهادات الجامعية.',
    date: '2025-05-10', pdfLink: '#', universityId: '1', universityName: 'King Saud University', universityNameAr: 'جامعة الملك سعود', projectType: 'Research', projectTypeAr: 'بحث'
  },
  {
    id: 'gp5', name: 'Solar-Powered Desalination Plant', nameAr: 'محطة تحلية مياه تعمل بالطاقة الشمسية',
    collegeName: 'College of Engineering', collegeNameAr: 'كلية الهندسة',
    majorName: 'Electrical Engineering', majorNameAr: 'الهندسة الكهربائية',
    supervisorName: 'Dr. Tariq Al-Juhani', supervisorNameAr: 'د. طارق الجهني',
    memberNames: ['Sami Al-Fifi', 'Majed Al-Ruwaili'], memberNamesAr: ['سامي الفيفي', 'ماجد الرويلي'],
    description: 'A portable desalination unit completely powered by solar energy for remote areas.', descriptionAr: 'وحدة تحلية مياه محمولة تعمل بالكامل بالطاقة الشمسية للمناطق النائية.',
    date: '2026-02-28', pdfLink: '#', universityId: '2', universityName: 'KFUPM', universityNameAr: 'جامعة الملك فهد', projectType: 'Hardware', projectTypeAr: 'عتاد'
  },
  {
    id: 'gp6', name: 'Fintech App for Student Budgeting', nameAr: 'تطبيق تقنية مالية لميزانية الطلاب',
    collegeName: 'College of Business', collegeNameAr: 'كلية إدارة الأعمال',
    majorName: 'Finance', majorNameAr: 'المالية',
    supervisorName: 'Dr. Laila Al-Otaibi', supervisorNameAr: 'د. ليلى العتيبي',
    memberNames: ['Hassan Al-Amri', 'Nada Al-Harbi'], memberNamesAr: ['حسن العمري', 'ندى الحربي'],
    description: 'A mobile app to help university students manage their monthly allowances effectively.', descriptionAr: 'تطبيق هاتف محمول لمساعدة طلاب الجامعة في إدارة مكافآتهم الشهرية بفعالية.',
    date: '2025-11-15', pdfLink: '#', universityId: '4', universityName: 'King Abdulaziz University', universityNameAr: 'جامعة الملك عبدالعزيز', projectType: 'Application', projectTypeAr: 'تطبيق'
  },
  {
    id: 'gp7', name: 'Smart IoT Home Security System', nameAr: 'نظام أمان منزلي ذكي عبر إنترنت الأشياء',
    collegeName: 'College of Computer Science', collegeNameAr: 'كلية علوم الحاسب',
    majorName: 'Software Engineering', majorNameAr: 'هندسة البرمجيات',
    supervisorName: 'Dr. Sultan Al-Mutairi', supervisorNameAr: 'د. سلطان المطيري',
    memberNames: ['Bandar Al-Dawsari', 'Yousef Al-Enezi'], memberNamesAr: ['بندر الدوسري', 'يوسف العنزي'],
    description: 'An integrated IoT system for real-time home security monitoring and alerts.', descriptionAr: 'نظام متكامل لإنترنت الأشياء لمراقبة أمان المنزل في الوقت الفعلي والتنبيهات.',
    date: '2026-05-20', pdfLink: '#', universityId: '5', universityName: 'Prince Sultan University', universityNameAr: 'جامعة الأمير سلطان', projectType: 'Hardware', projectTypeAr: 'عتاد'
  }
];
"""

with open('client/src/lib/mockData.ts', 'w') as f:
    f.write(mock_data)

