// ─────────────────────────────────────────────
// TaxNG Admin Mock Data
// ─────────────────────────────────────────────

export interface AdminCourse {
  id: string;
  title: string;
  instructor: string;
  category: string;
  status: "published" | "draft" | "review";
  enrollments: number;
  revenue: number;
  rating: number;
  lessons: number;
  createdAt: string;
  image: string;
  price: number | "free";
}

export interface AdminStudent {
  id: string;
  name: string;
  email: string;
  avatar: string;
  coursesEnrolled: number;
  completionRate: number;
  totalSpent: number;
  joinedAt: string;
  status: "active" | "inactive";
  lastSeen: string;
}

export interface AdminTeacher {
  id: string;
  name: string;
  email: string;
  avatar: string;
  courses: number;
  totalStudents: number;
  rating: number;
  revenue: number;
  status: "active" | "pending" | "suspended";
  joinedAt: string;
}

export interface AdminMessage {
  id: string;
  from: string;
  email: string;
  subject: string;
  preview: string;
  time: string;
  read: boolean;
  avatar: string;
  type: "support" | "inquiry" | "report";
}

export interface AnalyticPoint {
  label: string;
  value: number;
}

export const adminCourses: AdminCourse[] = [
  { id: "1", title: "Introduction to Nigerian Taxation", instructor: "Prof. Emeka Obi", category: "Foundations of Taxation", status: "published", enrollments: 32500, revenue: 0, rating: 4.9, lessons: 64, createdAt: "Jan 10, 2024", image: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=400&q=80", price: "free" },
  { id: "2", title: "Personal Income Tax (PIT) Masterclass", instructor: "Adaeze Nwosu, CTA", category: "Personal Income Taxation", status: "published", enrollments: 19300, revenue: 164050000, rating: 4.8, lessons: 98, createdAt: "Feb 5, 2024", image: "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=400&q=80", price: 8500 },
  { id: "3", title: "PAYE Made Simple for Employers & Employees", instructor: "Chukwuemeka Eze", category: "Personal Income Taxation", status: "published", enrollments: 14800, revenue: 88800000, rating: 4.7, lessons: 55, createdAt: "Mar 1, 2024", image: "https://images.unsplash.com/photo-1521791136064-7986c2920216?w=400&q=80", price: 6000 },
  { id: "4", title: "Corporate Income Tax in Nigeria", instructor: "Barrister Ngozi Adeleke", category: "Corporate Taxation", status: "published", enrollments: 9200, revenue: 138000000, rating: 4.9, lessons: 145, createdAt: "Dec 20, 2023", image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&q=80", price: 15000 },
  { id: "5", title: "Transfer Pricing & International Taxation", instructor: "Dr. Tunde Adesanya", category: "Corporate Taxation", status: "published", enrollments: 5600, revenue: 140000000, rating: 4.8, lessons: 112, createdAt: "Apr 1, 2024", image: "https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?w=400&q=80", price: 25000 },
  { id: "6", title: "VAT, Customs & Excise Duties in Nigeria", instructor: "Hajiya Hauwa Ibrahim, ACTI", category: "Indirect Taxes", status: "published", enrollments: 13400, revenue: 160800000, rating: 4.7, lessons: 105, createdAt: "Apr 5, 2024", image: "https://images.unsplash.com/photo-1608222351212-18fe0ec7b13b?w=400&q=80", price: 12000 },
  { id: "7", title: "State & Local Government Levies Explained", instructor: "Obinna Chukwu", category: "State & Local Taxes", status: "published", enrollments: 11900, revenue: 0, rating: 4.6, lessons: 42, createdAt: "Oct 1, 2023", image: "https://images.unsplash.com/photo-1542744095-291d1f67b221?w=400&q=80", price: "free" },
  { id: "8", title: "Tax Filing & Compliance Masterclass", instructor: "Adaeze Nwosu, CTA", category: "Tax Administration & Compliance", status: "published", enrollments: 16200, revenue: 291600000, rating: 4.9, lessons: 168, createdAt: "Nov 15, 2023", image: "https://images.unsplash.com/photo-1554224154-26032ffc0d07?w=400&q=80", price: 18000 },
];

export const adminStudents: AdminStudent[] = [
  { id: "1", name: "Babatunde Adeyemi", email: "babs@example.com", avatar: "https://images.unsplash.com/photo-1506277886164-e25aa3f4ef7f?w=100&q=80", coursesEnrolled: 3, completionRate: 68, totalSpent: 31500, joinedAt: "Jan 15, 2024", status: "active", lastSeen: "2 hours ago" },
  { id: "2", name: "Chisom Obi", email: "chisom@example.com", avatar: "https://images.unsplash.com/photo-1531123897727-8f129e1688ce?w=100&q=80", coursesEnrolled: 5, completionRate: 91, totalSpent: 59500, joinedAt: "Nov 3, 2023", status: "active", lastSeen: "Online" },
  { id: "3", name: "Emeka Nwosu", email: "emeka@example.com", avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=100&q=80", coursesEnrolled: 2, completionRate: 45, totalSpent: 24500, joinedAt: "Feb 20, 2024", status: "active", lastSeen: "Yesterday" },
  { id: "4", name: "Ngozi Adeleke", email: "ngozi@example.com", avatar: "https://images.unsplash.com/photo-1531123414708-f47c4ced6bca?w=100&q=80", coursesEnrolled: 7, completionRate: 84, totalSpent: 98500, joinedAt: "Sep 12, 2023", status: "active", lastSeen: "3 hours ago" },
  { id: "5", name: "Hauwa Suleiman", email: "hauwa@example.com", avatar: "https://images.unsplash.com/photo-1589156280159-27698a70f29e?w=100&q=80", coursesEnrolled: 1, completionRate: 22, totalSpent: 0, joinedAt: "Mar 30, 2024", status: "active", lastSeen: "5 days ago" },
  { id: "6", name: "Yemi Ade", email: "yemi@example.com", avatar: "https://images.unsplash.com/photo-1531123897727-8f129e1688ce?w=100&q=80", coursesEnrolled: 4, completionRate: 100, totalSpent: 47500, joinedAt: "Aug 8, 2023", status: "inactive", lastSeen: "2 weeks ago" },
  { id: "7", name: "Obinna Eze", email: "obinna@example.com", avatar: "https://images.unsplash.com/photo-1506277886164-e25aa3f4ef7f?w=100&q=80", coursesEnrolled: 6, completionRate: 73, totalSpent: 76500, joinedAt: "Oct 22, 2023", status: "active", lastSeen: "1 hour ago" },
  { id: "8", name: "Adaobi Nwachukwu", email: "adaobi@example.com", avatar: "https://images.unsplash.com/photo-1531123897727-8f129e1688ce?w=100&q=80", coursesEnrolled: 3, completionRate: 57, totalSpent: 33500, joinedAt: "Jan 5, 2024", status: "active", lastSeen: "4 hours ago" },
];

export const adminTeachers: AdminTeacher[] = [
  { id: "1", name: "Adaeze Nwosu, CTA", email: "adaeze@taxng.com", avatar: "https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=100&q=80", courses: 3, totalStudents: 48100, rating: 4.9, revenue: 455650000, status: "active", joinedAt: "Oct 1, 2022" },
  { id: "2", name: "Prof. Emeka Obi", email: "emeka@taxng.com", avatar: "https://images.unsplash.com/photo-1462804993656-fac4ff489837?w=100&q=80", courses: 2, totalStudents: 32500, rating: 4.9, revenue: 0, status: "active", joinedAt: "Dec 15, 2022" },
  { id: "3", name: "Barrister Ngozi Adeleke", email: "ngozi@taxng.com", avatar: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=100&q=80", courses: 2, totalStudents: 14800, rating: 4.9, revenue: 138000000, status: "active", joinedAt: "Sep 20, 2022" },
  { id: "4", name: "Hajiya Hauwa Ibrahim, ACTI", email: "hauwa@taxng.com", avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=100&q=80", courses: 1, totalStudents: 13400, rating: 4.7, revenue: 160800000, status: "active", joinedAt: "Jan 10, 2023" },
  { id: "5", name: "Dr. Tunde Adesanya", email: "tunde@taxng.com", avatar: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=100&q=80", courses: 1, totalStudents: 5600, rating: 4.8, revenue: 140000000, status: "active", joinedAt: "Apr 2, 2024" },
  { id: "6", name: "Obinna Chukwu", email: "obinna@taxng.com", avatar: "https://images.unsplash.com/photo-1547425260-76bcadfb4f2c?w=100&q=80", courses: 1, totalStudents: 11900, rating: 4.6, revenue: 0, status: "active", joinedAt: "Nov 5, 2022" },
];

export const adminMessages: AdminMessage[] = [
  { id: "1", from: "Babatunde Adeyemi", email: "babs@example.com", subject: "Unable to access Corporate Tax Module 4", preview: "Hi, I'm trying to access the Transfer Pricing module but it keeps showing a loading error...", time: "10 min ago", read: false, avatar: "https://images.unsplash.com/photo-1506277886164-e25aa3f4ef7f?w=100&q=80", type: "support" },
  { id: "2", from: "Chisom Obi", email: "chisom@example.com", subject: "Certificate not generated after course completion", preview: "I completed the Tax Filing & Compliance Masterclass 2 days ago but haven't received my certificate yet...", time: "1 hour ago", read: false, avatar: "https://images.unsplash.com/photo-1531123897727-8f129e1688ce?w=100&q=80", type: "support" },
  { id: "3", from: "Emeka Nwosu", email: "emeka@example.com", subject: "Question about PAYE calculation example", preview: "In Module 3, the PAYE calculation example uses a different formula than FIRS official tables...", time: "3 hours ago", read: true, avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=100&q=80", type: "inquiry" },
  { id: "4", from: "Ngozi Adeleke", email: "ngozi@example.com", subject: "Finance Act 2024 updates not reflected", preview: "The Corporate Tax course still references pre-2024 Finance Act rates. Please update...", time: "Yesterday", read: true, avatar: "https://images.unsplash.com/photo-1531123414708-f47c4ced6bca?w=100&q=80", type: "report" },
  { id: "5", from: "Hauwa Suleiman", email: "hauwa@example.com", subject: "Corporate training inquiry for 200 staff", preview: "We are a company of 200 employees interested in bulk tax training access for our finance team...", time: "2 days ago", read: true, avatar: "https://images.unsplash.com/photo-1589156280159-27698a70f29e?w=100&q=80", type: "inquiry" },
  { id: "6", from: "Obinna Eze", email: "obinna@example.com", subject: "Video playback issues on mobile", preview: "The course videos buffer excessively on my Android phone even on WiFi...", time: "3 days ago", read: true, avatar: "https://images.unsplash.com/photo-1506277886164-e25aa3f4ef7f?w=100&q=80", type: "report" },
];

export const enrollmentTrend: AnalyticPoint[] = [
  { label: "Oct", value: 1800 },
  { label: "Nov", value: 2400 },
  { label: "Dec", value: 3100 },
  { label: "Jan", value: 2700 },
  { label: "Feb", value: 3800 },
  { label: "Mar", value: 5200 },
  { label: "Apr", value: 6400 },
];

export const revenueTrend: AnalyticPoint[] = [
  { label: "Oct", value: 12500000 },
  { label: "Nov", value: 18200000 },
  { label: "Dec", value: 28400000 },
  { label: "Jan", value: 22100000 },
  { label: "Feb", value: 34600000 },
  { label: "Mar", value: 48900000 },
  { label: "Apr", value: 61200000 },
];

export const adminKpis = {
  totalStudents: 123000,
  totalRevenue: 983250000,
  totalCourses: 8,
  activeCourses: 8,
  completionRate: 76,
  avgRating: 4.81,
  newStudentsThisMonth: 6400,
  revenueThisMonth: 61200000,
};

export const recentActivity = [
  { id: "1", text: "Adaeze Nwosu published a new module in Tax Filing & Compliance Masterclass", time: "5 min ago", type: "course" },
  { id: "2", text: "Chisom Obi completed PIT Masterclass and earned a TaxNG certificate", time: "12 min ago", type: "certificate" },
  { id: "3", text: "New course submitted for review: Petroleum Profits Tax in Nigeria", time: "1 hour ago", type: "review" },
  { id: "4", text: "62 new students enrolled in the Corporate Income Tax course", time: "2 hours ago", type: "enrollment" },
  { id: "5", text: "Emeka Nwosu raised a support ticket about PAYE module", time: "3 hours ago", type: "support" },
  { id: "6", text: "Revenue milestone reached: ₦1 Billion total platform revenue", time: "Yesterday", type: "milestone" },
];

// ─────────────────────────────────────────────
// Categories
// ─────────────────────────────────────────────

export interface AdminCategory {
  id: string;
  name: string;
  slug: string;
  description: string;
  icon: string;
  color: string;
  courseCount: number;
  studentCount: number;
  isActive: boolean;
  createdAt: string;
}

export const adminCategories: AdminCategory[] = [
  { id: "1", name: "Foundations of Taxation", slug: "foundations-of-taxation", description: "Core principles of Nigeria's tax system, legal framework, and the roles of FIRS, SIRS, and LIRS.", icon: "📋", color: "from-green-700 to-green-500", courseCount: 8, studentCount: 32500, isActive: true, createdAt: "Jan 1, 2024" },
  { id: "2", name: "Personal Income Taxation", slug: "personal-income-taxation", description: "PIT, PAYE, tax reliefs, allowances, and annual returns for individuals across Nigeria.", icon: "👤", color: "from-sky-500 to-sky-400", courseCount: 14, studentCount: 34100, isActive: true, createdAt: "Jan 1, 2023" },
  { id: "3", name: "Corporate Taxation", slug: "corporate-taxation", description: "CITA, capital allowances, transfer pricing, pioneer status, and corporate tax planning.", icon: "🏢", color: "from-purple-500 to-purple-400", courseCount: 11, studentCount: 14800, isActive: true, createdAt: "Jan 1, 2023" },
  { id: "4", name: "Indirect Taxes", slug: "indirect-taxes", description: "VAT, customs duties, excise duties, stamp duties, and consumption taxes in Nigeria.", icon: "🛒", color: "from-pink-500 to-pink-400", courseCount: 9, studentCount: 13400, isActive: true, createdAt: "Feb 12, 2023" },
  { id: "5", name: "State & Local Taxes", slug: "state-local-taxes", description: "Land Use Charge, tenement rates, business premises levies, and LGA revenue instruments.", icon: "🏛️", color: "from-orange-500 to-orange-400", courseCount: 7, studentCount: 11900, isActive: true, createdAt: "Mar 5, 2023" },
  { id: "6", name: "Tax Administration & Compliance", slug: "tax-administration-compliance", description: "Tax filing, TIN registration, FIRS audits, objections, appeals, and record-keeping.", icon: "✅", color: "from-cyan-600 to-cyan-400", courseCount: 12, studentCount: 16200, isActive: true, createdAt: "Mar 5, 2023" },
];

// ─────────────────────────────────────────────
// Certificate Templates
// ─────────────────────────────────────────────

export interface CertificateTemplate {
  id: string;
  name: string;
  style: "classic" | "modern" | "minimal" | "elegant" | "bold";
  primaryColor: string;
  accentColor: string;
  font: string;
  description: string;
  isDefault: boolean;
  isActive: boolean;
  issued: number;
  previewBg: string;
  border: string;
}

export const certificateTemplates: CertificateTemplate[] = [
  {
    id: "1",
    name: "Classic Gold",
    style: "classic",
    primaryColor: "#1a4731",
    accentColor: "#d4a017",
    font: "Playfair Display",
    description: "Timeless design with gold accents and decorative borders. Perfect for professional tax certifications.",
    isDefault: true,
    isActive: true,
    issued: 8400,
    previewBg: "from-[#1a4731] to-[#2d6e4f]",
    border: "border-amber-400",
  },
  {
    id: "2",
    name: "Modern Gradient",
    style: "modern",
    primaryColor: "#1d4ed8",
    accentColor: "#06b6d4",
    font: "Inter",
    description: "Clean modern layout with gradient accents. Ideal for compliance and digital tax courses.",
    isDefault: false,
    isActive: true,
    issued: 5200,
    previewBg: "from-blue-600 to-cyan-500",
    border: "border-blue-400",
  },
  {
    id: "3",
    name: "Minimal White",
    style: "minimal",
    primaryColor: "#111827",
    accentColor: "#6d28d9",
    font: "Outfit",
    description: "Clean and minimalist design that keeps the focus on the achievement.",
    isDefault: false,
    isActive: true,
    issued: 3600,
    previewBg: "from-gray-100 to-white",
    border: "border-purple-400",
  },
  {
    id: "4",
    name: "Elegant Dark",
    style: "elegant",
    primaryColor: "#0f172a",
    accentColor: "#f59e0b",
    font: "Cormorant Garamond",
    description: "Sophisticated dark theme with amber highlights for advanced tax programmes.",
    isDefault: false,
    isActive: true,
    issued: 2100,
    previewBg: "from-slate-900 to-slate-800",
    border: "border-amber-500",
  },
  {
    id: "5",
    name: "Bold TaxNG",
    style: "bold",
    primaryColor: "#14532d",
    accentColor: "#f97316",
    font: "Poppins",
    description: "Branded TaxNG certificate with signature green and orange accent colours.",
    isDefault: false,
    isActive: true,
    issued: 12800,
    previewBg: "from-green-900 to-green-800",
    border: "border-orange-400",
  },
];
