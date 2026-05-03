export interface Course {
  id: string;
  title: string;
  instructor: string;
  category: string;
  price: number | "free";
  rating: number;
  reviews: number;
  students: number;
  image: string;
  badge?: string;
  duration: string;
  lessons: number;
  level: "Beginner" | "Intermediate" | "Advanced";
  description: string;
  tags: string[];
  curriculum?: Module[];
  isEnrolled?: boolean;
}

export interface Lesson {
  id: string;
  title: string;
  duration: string;
  type: "video" | "reading" | "quiz";
  completed?: boolean;
  free?: boolean;
  videoUrl?: string;
  content?: string;
  questions?: QuizQuestion[];
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation?: string;
}

export interface Module {
  id: string;
  title: string;
  lessons: Lesson[];
}

export interface Testimonial {
  id: string;
  name: string;
  role: string;
  avatar: string;
  rating: number;
  text: string;
  course: string;
}

export interface Category {
  id: string;
  name: string;
  icon: string;
  count: number;
  color: string;
  bgColor: string;
}

export interface Instructor {
  name: string;
  title: string;
  avatar: string;
  rating: number;
  students: number;
  courses: number;
  bio: string;
}

export const courses: Course[] = [
  {
    id: "1",
    title: "Introduction to Nigerian Taxation",
    instructor: "Prof. Emeka Obi",
    category: "Foundations of Taxation",
    price: "free",
    rating: 4.9,
    reviews: 8430,
    students: 32500,
    image: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=600&q=80",
    badge: "Free",
    duration: "12h 30m",
    lessons: 64,
    level: "Beginner",
    description: "A comprehensive introduction to Nigeria's tax system — covering the legal framework, key tax types, and the roles of FIRS, SIRS, and LIRS.",
    tags: ["FIRS", "Tax Law", "Nigerian Tax System", "CITA", "PITA"],
  },
  {
    id: "2",
    title: "Personal Income Tax (PIT) Masterclass",
    instructor: "Adaeze Nwosu, CTA",
    category: "Personal Income Taxation",
    price: 8500,
    rating: 4.8,
    reviews: 5920,
    students: 19300,
    image: "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=600&q=80",
    badge: "Bestseller",
    duration: "18h 45m",
    lessons: 98,
    level: "Beginner",
    description: "Master Personal Income Tax in Nigeria — from residency rules and chargeable income to allowances, reliefs, and filing your annual return with SIRS.",
    tags: ["PIT", "PAYE", "Tax Reliefs", "Annual Returns", "SIRS"],
  },
  {
    id: "3",
    title: "PAYE Made Simple for Employers & Employees",
    instructor: "Chukwuemeka Eze",
    category: "Personal Income Taxation",
    price: 6000,
    rating: 4.7,
    reviews: 4110,
    students: 14800,
    image: "https://images.unsplash.com/photo-1521791136064-7986c2920216?w=600&q=80",
    badge: "Hot",
    duration: "10h 20m",
    lessons: 55,
    level: "Beginner",
    description: "Understand how Pay As You Earn (PAYE) works in Nigeria — employer obligations, tax deduction tables, monthly remittances, and employee tax cards.",
    tags: ["PAYE", "Payroll Tax", "Tax Deduction", "Employer Obligations"],
  },
  {
    id: "4",
    title: "Corporate Income Tax in Nigeria",
    instructor: "Barrister Ngozi Adeleke",
    category: "Corporate Taxation",
    price: 15000,
    rating: 4.9,
    reviews: 3820,
    students: 9200,
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&q=80",
    badge: "Top Rated",
    duration: "28h 00m",
    lessons: 145,
    level: "Intermediate",
    description: "A deep-dive into Companies Income Tax Act (CITA) — taxable profits, allowable deductions, capital allowances, pioneer status, and filing CIT returns with FIRS.",
    tags: ["CITA", "CIT Returns", "Capital Allowances", "Pioneer Status", "FIRS"],
  },
  {
    id: "5",
    title: "Transfer Pricing & International Taxation",
    instructor: "Dr. Tunde Adesanya",
    category: "Corporate Taxation",
    price: 25000,
    rating: 4.8,
    reviews: 2410,
    students: 5600,
    image: "https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?w=600&q=80",
    badge: "New",
    duration: "22h 15m",
    lessons: 112,
    level: "Advanced",
    description: "Navigate Nigeria's transfer pricing regulations, BEPS action plans, controlled transactions, advance pricing agreements, and cross-border tax treaties.",
    tags: ["Transfer Pricing", "BEPS", "Tax Treaties", "OECD", "International Tax"],
  },
  {
    id: "6",
    title: "VAT, Customs & Excise Duties in Nigeria",
    instructor: "Hajiya Hauwa Ibrahim, ACTI",
    category: "Indirect Taxes",
    price: 12000,
    rating: 4.7,
    reviews: 4670,
    students: 13400,
    image: "https://images.unsplash.com/photo-1608222351212-18fe0ec7b13b?w=600&q=80",
    badge: "Trending",
    duration: "20h 30m",
    lessons: 105,
    level: "Intermediate",
    description: "Master Value Added Tax (VAT), customs tariffs, and excise duties — from registration and filing to input/output VAT reconciliation and NCS import procedures.",
    tags: ["VAT", "Customs Duties", "Excise Duties", "NCS", "Input Tax Credit"],
  },
  {
    id: "7",
    title: "State & Local Government Levies Explained",
    instructor: "Obinna Chukwu",
    category: "State & Local Taxes",
    price: "free",
    rating: 4.6,
    reviews: 3200,
    students: 11900,
    image: "https://images.unsplash.com/photo-1542744095-291d1f67b221?w=600&q=80",
    badge: "Free",
    duration: "8h 45m",
    lessons: 42,
    level: "Beginner",
    description: "Understand Land Use Charge, tenement rates, business premises levies, and other state/local government taxes across Nigeria's 36 states.",
    tags: ["Land Use Charge", "Tenement Rates", "LGA Levies", "State Taxes"],
  },
  {
    id: "8",
    title: "Tax Filing & Compliance Masterclass",
    instructor: "Adaeze Nwosu, CTA",
    category: "Tax Administration & Compliance",
    price: 18000,
    rating: 4.9,
    reviews: 6100,
    students: 16200,
    image: "https://images.unsplash.com/photo-1554224154-26032ffc0d07?w=600&q=80",
    badge: "Bestseller",
    duration: "32h 00m",
    lessons: 168,
    level: "Intermediate",
    description: "End-to-end guide to tax filing, record-keeping, tax audits, objections, appeals, and managing FIRS relationships — for individuals and businesses in Nigeria.",
    tags: ["Tax Filing", "Tax Audit", "FIRS", "TIN", "Objections & Appeals"],
  },
];

export const testimonials: Testimonial[] = [
  {
    id: "1",
    name: "Babatunde Adeyemi",
    role: "Finance Manager, Lagos",
    avatar: "https://images.unsplash.com/photo-1506277886164-e25aa3f4ef7f?w=100&q=80",
    rating: 5,
    text: "TaxNG Academy completely changed how I handle corporate tax filings. The CITA course is incredibly thorough. I passed the FIRS audit last quarter without a single issue. Absolutely invaluable!",
    course: "Corporate Income Tax in Nigeria",
  },
  {
    id: "2",
    name: "Chisom Obi",
    role: "Small Business Owner, Enugu",
    avatar: "https://images.unsplash.com/photo-1531123897727-8f129e1688ce?w=100&q=80",
    rating: 5,
    text: "As an entrepreneur, I used to dread tax season. After the Tax Filing & Compliance Masterclass, I now manage my own VAT returns confidently. Worth every naira spent!",
    course: "Tax Filing & Compliance Masterclass",
  },
  {
    id: "3",
    name: "Ngozi Adeleke",
    role: "Chartered Accountant, Abuja",
    avatar: "https://images.unsplash.com/photo-1531123414708-f47c4ced6bca?w=100&q=80",
    rating: 5,
    text: "The Transfer Pricing course is world-class. Dr. Adesanya explains complex OECD guidelines in a practical, Nigeria-specific way. My clients have saved millions in unnecessary taxes.",
    course: "Transfer Pricing & International Taxation",
  },
  {
    id: "4",
    name: "Emeka Nwosu",
    role: "HR Director, Port Harcourt",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&q=80",
    rating: 5,
    text: "Managing payroll PAYE for 300 staff was a nightmare before TaxNG. The PAYE course is exactly what I needed — clear, Nigeria-specific, and very practical.",
    course: "PAYE Made Simple for Employers & Employees",
  },
  {
    id: "5",
    name: "Hauwa Suleiman",
    role: "Tax Consultant, Kano",
    avatar: "https://images.unsplash.com/photo-1589156280159-27698a70f29e?w=100&q=80",
    rating: 5,
    text: "The free Introduction to Nigerian Taxation course gave me a solid foundation. I then invested in the PIT Masterclass and now have 12 new clients I assist with personal tax returns.",
    course: "Personal Income Tax (PIT) Masterclass",
  },
];

export const categories: Category[] = [
  { id: "1", name: "Foundations of Taxation", icon: "📋", count: 8, color: "#1a6b3c", bgColor: "#e8f5ee" },
  { id: "2", name: "Personal Income Taxation", icon: "👤", count: 14, color: "#0ea5e9", bgColor: "#e0f2fe" },
  { id: "3", name: "Corporate Taxation", icon: "🏢", count: 11, color: "#8b5cf6", bgColor: "#f3f0ff" },
  { id: "4", name: "Indirect Taxes", icon: "🛒", count: 9, color: "#ec4899", bgColor: "#fce7f3" },
  { id: "5", name: "State & Local Taxes", icon: "🏛️", count: 7, color: "#f97316", bgColor: "#fff4ed" },
  { id: "6", name: "Tax Administration & Compliance", icon: "✅", count: 12, color: "#0891b2", bgColor: "#e0f7fa" },
];

export const heroSlides = [
  {
    id: "1",
    headline: "Understand Nigerian Tax.",
    accent: "Master Compliance.",
    subtext: "TaxNG Academy offers expert-led courses on personal tax, corporate tax, VAT, and more — designed specifically for Nigeria's tax laws and regulations.",
    ctaPrimary: "Start Learning Free",
    ctaSecondary: "Browse Courses",
    badge: "🎓 Trusted by 25,000+ Nigerian learners",
    stat1: { value: "60+", label: "Tax Courses" },
    stat2: { value: "25K+", label: "Students" },
    stat3: { value: "98%", label: "Compliance Rate" },
  },
  {
    id: "2",
    headline: "Expert Tax Educators.",
    accent: "Real Results.",
    subtext: "Learn from Nigeria's leading chartered tax practitioners, FIRS-trained consultants, and seasoned legal professionals with decades of experience.",
    ctaPrimary: "Explore Courses",
    badge: "🏆 #1 Tax Learning Platform in Nigeria",
    stat1: { value: "30+", label: "Expert Tutors" },
    stat2: { value: "10K+", label: "Reviews" },
    stat3: { value: "4.8★", label: "Avg. Rating" },
  },
  {
    id: "3",
    headline: "Certificates That",
    accent: "Prove Expertise.",
    subtext: "Earn TaxNG-certified credentials recognised by employers, accounting firms, and tax authorities across Nigeria. Advance your career with proof.",
    ctaPrimary: "Get Certified",
    ctaSecondary: "View Certificates",
    badge: "✨ Certificates trusted by top Nigerian firms",
    stat1: { value: "6", label: "Specialisations" },
    stat2: { value: "50+", label: "Firm Partners" },
    stat3: { value: "82%", label: "Career Growth" },
  },
];

export const courseCurriculum: Module[] = [
  {
    id: "m1",
    title: "Introduction & Legal Framework",
    lessons: [
      {
        id: "l1",
        title: "Welcome to TaxNG Academy",
        duration: "05:20",
        type: "video",
        free: true,
        videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
      },
      {
        id: "l2",
        title: "Nigeria's Tax Legal Framework Overview",
        duration: "10:00",
        type: "reading",
        free: true,
        content: `
          <h3>Nigeria's Tax System</h3>
          <p>Nigeria operates a multi-tiered tax system governed by the Federal Government, State Governments, and Local Government Authorities...</p>
          <h4>Key Tax Laws:</h4>
          <ul>
            <li>Companies Income Tax Act (CITA) Cap C21 LFN 2004</li>
            <li>Personal Income Tax Act (PITA) Cap P8 LFN 2011</li>
            <li>Value Added Tax Act (VATA) Cap V1 LFN 2004</li>
            <li>Federal Inland Revenue Service (Establishment) Act 2007</li>
          </ul>
        `,
      },
      {
        id: "l3",
        title: "Understanding FIRS, SIRS & LIRS",
        duration: "15:45",
        type: "video",
        videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
      },
    ],
  },
  {
    id: "m2",
    title: "Core Tax Concepts & Practical Application",
    lessons: [
      {
        id: "l4",
        title: "Taxable Persons and Residency Rules",
        duration: "24:10",
        type: "video",
        videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
      },
      {
        id: "l5",
        title: "Computing Chargeable Income",
        duration: "12:30",
        type: "reading",
        content: `<h3>Chargeable Income Computation</h3><p>Chargeable income is the income upon which tax is levied after all allowable deductions and reliefs have been applied...</p>`,
      },
      {
        id: "l6",
        title: "Quick Quiz: Tax Fundamentals",
        duration: "08:00",
        type: "quiz",
        questions: [
          {
            id: "q1",
            question: "Which body collects Companies Income Tax in Nigeria?",
            options: ["State Internal Revenue Service (SIRS)", "Federal Inland Revenue Service (FIRS)", "Local Government Revenue Committee", "Nigerian Customs Service"],
            correctAnswer: 1,
            explanation: "FIRS is responsible for assessing and collecting Companies Income Tax and other federal taxes in Nigeria.",
          },
          {
            id: "q2",
            question: "What is the current standard VAT rate in Nigeria?",
            options: ["5%", "7.5%", "10%", "15%"],
            correctAnswer: 1,
            explanation: "The standard VAT rate in Nigeria is 7.5% as amended by the Finance Act 2019.",
          },
        ],
      },
    ],
  },
  {
    id: "m3",
    title: "Filing, Compliance & Advanced Strategies",
    lessons: [
      {
        id: "l7",
        title: "Filing Tax Returns Step-by-Step",
        duration: "18:20",
        type: "video",
        videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
      },
      {
        id: "l8",
        title: "Managing FIRS Tax Audits",
        duration: "10:00",
        type: "reading",
        content: "<h3>Tax Audit Management</h3><p>Understand what triggers a FIRS audit and how to prepare your records, respond to assessments, and file objections...</p>",
      },
      {
        id: "l9",
        title: "Capstone: Complete Tax Filing Exercise",
        duration: "05:00",
        type: "reading",
        content: "<p>Apply everything you've learnt by completing a full tax return exercise for both an individual taxpayer and a small company.</p>",
      },
    ],
  },
];

export const enrolledCourses = [
  {
    id: "1",
    title: "Introduction to Nigerian Taxation",
    instructor: "Prof. Emeka Obi",
    progress: 72,
    image: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=400&q=80",
    lastAccessed: "2 hours ago",
    nextLesson: "Understanding FIRS, SIRS & LIRS",
    totalLessons: 64,
    completedLessons: 46,
    category: "Foundations of Taxation",
  },
  {
    id: "2",
    title: "Personal Income Tax (PIT) Masterclass",
    instructor: "Adaeze Nwosu, CTA",
    progress: 45,
    image: "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=400&q=80",
    lastAccessed: "Yesterday",
    nextLesson: "Allowances and Tax Reliefs",
    totalLessons: 98,
    completedLessons: 44,
    category: "Personal Income Taxation",
  },
  {
    id: "3",
    title: "Tax Filing & Compliance Masterclass",
    instructor: "Adaeze Nwosu, CTA",
    progress: 18,
    image: "https://images.unsplash.com/photo-1554224154-26032ffc0d07?w=400&q=80",
    lastAccessed: "3 days ago",
    nextLesson: "Filing Annual Returns",
    totalLessons: 168,
    completedLessons: 30,
    category: "Tax Administration & Compliance",
  },
];
