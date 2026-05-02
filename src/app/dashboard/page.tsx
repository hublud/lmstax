"use client";

import { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { enrolledCourses as mockEnrolledCourses } from "@/lib/mockData";
import {
  BookOpen,
  TrendingUp,
  User,
  Users,
  Bell,
  Settings,
  LogOut,
  Play,
  Award,
  Clock,
  Star,
  ChevronRight,
  Flame,
  Target,
  LayoutDashboard,
  GraduationCap,
  Download,
  Camera,
  Lock,
  CheckCircle2,
  Circle,
  Calendar,
  Zap,
  BarChart3,
  BookMarked,
  MessageSquare,
  Menu,
  X,
  DollarSign,
} from "lucide-react";
import { enrolledCourses } from "@/lib/mockData";
import CertificateGenerator from "@/components/dashboard/CertificateGenerator";
import LogoSVG from "@/components/LogoSVG";
import { supabase } from "@/lib/supabase";
import SubscriptionModal from "@/components/SubscriptionModal";


const studentNavItems = [
  { id: "overview", label: "Overview", icon: LayoutDashboard },
  { id: "courses", label: "My Courses", icon: BookOpen },
  { id: "progress", label: "Progress", icon: TrendingUp },
  { id: "certificates", label: "Certificates", icon: Award },
  { id: "profile", label: "Profile", icon: User },
  { id: "settings", label: "Settings", icon: Settings },
];

const teacherNavItems = [
  { id: "overview", label: "Overview", icon: LayoutDashboard },
  { id: "teaching", label: "My Courses", icon: BookOpen },
  { id: "students", label: "Students", icon: Users },
  { id: "analytics", label: "Analytics", icon: BarChart3 },
  { id: "profile", label: "Profile", icon: User },
  { id: "settings", label: "Settings", icon: Settings },
];

const achievements = [
  { icon: Flame, label: "7-Day Streak", color: "text-orange-500", bg: "bg-orange-100" },
  { icon: Star, label: "Top Student", color: "text-amber-500", bg: "bg-amber-100" },
  { icon: Award, label: "3 Certificates", color: "text-purple-500", bg: "bg-purple-100" },
  { icon: Target, label: "Goal Crusher", color: "text-green-600", bg: "bg-green-100" },
];

function ProgressRing({ percent, size = 80 }: { percent: number; size?: number }) {
  const r = (size - 10) / 2;
  const circ = 2 * Math.PI * r;
  const dash = (percent / 100) * circ;
  return (
    <svg width={size} height={size} className="-rotate-90">
      <circle cx={size / 2} cy={size / 2} r={r} strokeWidth="8" stroke="#f0f0f0" fill="none" />
      <circle
        cx={size / 2} cy={size / 2} r={r} strokeWidth="8"
        stroke="var(--primary)" fill="none"
        strokeLinecap="round"
        strokeDasharray={`${dash} ${circ - dash}`}
        className="transition-all duration-500"
      />
    </svg>
  );
}


function DashboardContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [activeTab, setActiveTab] = useState(searchParams.get("tab") || "overview");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const tab = searchParams.get("tab");
    if (tab) setActiveTab(tab);
  }, [searchParams]);
  const [profile, setProfile] = useState<any>(null);
  const [enrollments, setEnrollments] = useState<any[]>([]);
  const [teachingCourses, setTeachingCourses] = useState<any[]>([]);
  const [certificates, setCertificates] = useState<any[]>([]);
  const [showSubModal, setShowSubModal] = useState(false);

  const [profileForm, setProfileForm] = useState({
    name: "",
    email: "",
    bio: "",
    location: "Lagos, Nigeria",
    website: "",
    twitter: "",
  });

  const [settingsState, setSettingsState] = useState({
    emailNotifications: true,
    pushNotifications: false,
    weeklyReport: true,
    publicProfile: true,
    twoFactor: false,
  });

  useEffect(() => {
    const fetchUserData = async () => {
      setIsLoading(true);
      try {
        const { data: { user: authUser } } = await supabase.auth.getUser();
        
        if (!authUser) {
          router.push("/login");
          return;
        }

        setUser(authUser);

        // Fetch user profile and subscription from the 'users' table
        const { data: profileData, error: profileError } = await supabase
          .from("users")
          .select("*")
          .eq("auth_id", authUser.id)
          .maybeSingle();

        if (profileError) {
          console.warn("User data fetch issue:", profileError.message);
        }

        const isTaxExpert = profileData?.subscription_tier?.toLowerCase() === "taxexpert";
        const isStaff = ["admin", "teacher", "staff"].includes(profileData?.role?.toLowerCase() || "");

        if (profileData && !isTaxExpert && !isStaff) {
          setShowSubModal(true);
        }

        setProfile(profileData || { full_name: authUser.email?.split('@')[0], role: "student" });
        setProfileForm({
          name: profileData?.full_name || authUser.email?.split('@')[0] || "",
          email: authUser.email || "",
          bio: profileData?.bio || "",
          location: profileData?.location || "Lagos, Nigeria",
          website: profileData?.website || "",
          twitter: profileData?.twitter || "",
        });

        // Fetch teaching data if role is teacher
        if (isStaff && (profileData?.role === "teacher" || userData?.role === "teacher")) {
          const { data: coursesTaught } = await supabase
            .from("courses")
            .select("*, enrollments(count)")
            .eq("created_by", authUser.id);
          setTeachingCourses(coursesTaught || []);
        }

        // Still using mock data for enrollments/certificates for students
        const mapped = mockEnrolledCourses.map((c: any) => ({
          ...c,
          completedLessons: Math.round((c.progress / 100) * 12),
          totalLessons: 12,
          lastAccessed: "2 hours ago",
          nextLesson: "Module 2: Practical Exercises"
        }));
        setEnrollments(mapped);

        const mappedCerts = mapped.filter(c => c.progress >= 100).map(c => ({
          id: c.id,
          title: c.title,
          date: "Oct 24, 2024",
          instructor: c.instructor,
          image: c.image,
          studentName: profileData.full_name
        }));
        setCertificates(mappedCerts);

      } catch (err: any) {
        console.error("Dashboard data fetch error:", err.message || err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserData();
  }, [router]);

  const handleLogout = async () => {
    router.push("/login");
  };

  const totalProgress = enrollments.length > 0
    ? Math.round(enrollments.reduce((acc, c) => acc + (c.progress || 0), 0) / enrollments.length)
    : 0;

  const totalHoursLearned = enrollments.reduce((acc, c) => acc + (c.completedLessons * 0.5), 0).toFixed(1);

  const dynamicAchievements = [];
  
  // 1. Streak Achievement
  const currentStreak = profile?.streak || 0;
  if (currentStreak > 0) {
    dynamicAchievements.push({ 
      icon: Flame, 
      label: `${currentStreak}-Day Streak`, 
      color: "text-orange-500", 
      bg: "bg-orange-100" 
    });
  }

  // 2. Certificates Achievement (Live)
  if (certificates.length > 0) {
    dynamicAchievements.push({ 
      icon: Award, 
      label: `${certificates.length} Certificate${certificates.length > 1 ? 's' : ''}`, 
      color: "text-purple-500", 
      bg: "bg-purple-100" 
    });
  }

  const isTeacher = profile?.role === "teacher";
  const navItems = isTeacher ? teacherNavItems : studentNavItems;
  const tabLabel = navItems.find((n) => n.id === activeTab)?.label || "Dashboard";

  return (
    <div className="min-h-screen flex" style={{ backgroundColor: "var(--bg)" }}>
      {/* Sidebar */}
      <aside
        className={`
          fixed lg:static inset-y-0 left-0 z-40 w-64 flex-shrink-0
          bg-white border-r border-[var(--border)] shadow-xl lg:shadow-none
          transform transition-transform duration-300
          ${isSidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
        `}
        aria-label="Dashboard navigation"
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="p-6 border-b border-[var(--border)] flex items-center justify-between">
            <Link href="/" className="block">
              <LogoSVG className="h-10 w-auto" />
            </Link>

            <button
              className="lg:hidden text-gray-500 hover:text-gray-800"
              onClick={() => setIsSidebarOpen(false)}
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* User info */}
          <div className="p-5 border-b border-[var(--border)] bg-[var(--bg)]">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[var(--primary)] to-[var(--primary-light)] flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                {profile?.full_name?.charAt(0) || user?.email?.charAt(0)?.toUpperCase()}
              </div>
              <div className="min-w-0">
                <p className="font-semibold text-sm text-gray-800 truncate">{profile?.full_name || "New Learner"}</p>
                <p className="text-xs text-gray-500 truncate">{user?.email}</p>
                <div className="flex items-center gap-1 mt-0.5">
                  <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
                  <span className="text-xs text-green-600 font-medium capitalize">{profile?.role || "Student"}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Nav items */}
          <nav className="flex-1 p-4 space-y-1 overflow-y-auto" aria-label="Main navigation">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => { setActiveTab(item.id); setIsSidebarOpen(false); }}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium w-full text-left transition-all ${
                  activeTab === item.id
                    ? "bg-[var(--primary)] text-white shadow-md"
                    : "text-gray-600 hover:bg-gray-100 hover:text-gray-800"
                }`}
                aria-current={activeTab === item.id ? "page" : undefined}
              >
                <item.icon className="w-4 h-4 flex-shrink-0" />
                {item.label}
                {item.id === "courses" && !isTeacher && (
                  <span className={`ml-auto text-xs px-1.5 py-0.5 rounded-full font-bold ${activeTab === item.id ? "bg-white/20 text-white" : "bg-[var(--primary)]/10 text-[var(--primary)]"}`}>
                    {enrollments.length}
                  </span>
                )}
                {item.id === "teaching" && isTeacher && (
                  <span className={`ml-auto text-xs px-1.5 py-0.5 rounded-full font-bold ${activeTab === item.id ? "bg-white/20 text-white" : "bg-[var(--primary)]/10 text-[var(--primary)]"}`}>
                    {teachingCourses.length}
                  </span>
                )}
                {item.id === "certificates" && !isTeacher && (
                  <span className={`ml-auto text-xs px-1.5 py-0.5 rounded-full font-bold ${activeTab === item.id ? "bg-white/20 text-white" : "bg-purple-100 text-purple-600"}`}>
                    {certificates.length}
                  </span>
                )}
              </button>
            ))}
          </nav>

          <div className="p-4 border-t border-[var(--border)] space-y-1">
            <Link href="/admin" className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-gray-500 hover:bg-gray-50 transition-all">
              <LayoutDashboard className="w-4 h-4" />
              Admin Panel
            </Link>
            <button 
              onClick={handleLogout}
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-red-500 hover:bg-red-50 w-full transition-all text-left"
            >
              <LogOut className="w-4 h-4" />
              Logout
            </button>
          </div>
        </div>
      </aside>

      {/* Overlay for mobile */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/40 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Main content */}
      <div className="flex-1 min-w-0 flex flex-col h-screen overflow-hidden">
        {/* Top bar */}
        <header className="sticky top-0 z-20 bg-white border-b border-[var(--border)] px-4 sm:px-6 py-3 sm:py-4 flex items-center justify-between shadow-sm">
          <div className="flex items-center gap-2 sm:gap-3 flex-1 min-w-0">
            <button
              onClick={() => setIsSidebarOpen(true)}
              className="lg:hidden p-1.5 sm:p-2 rounded-xl hover:bg-gray-100 transition-colors flex-shrink-0"
              aria-label="Open menu"
            >
              <Menu className="w-5 h-5 text-gray-600" />
            </button>
            
            {/* Logo on mobile only */}
            <Link href="/" className="lg:hidden flex-shrink-0 mr-1 sm:mr-2">
              <LogoSVG className="h-6 sm:h-7 w-auto" />
            </Link>


            <div className="min-w-0 border-l border-gray-200 pl-2 sm:pl-3 lg:border-none lg:p-0">
              <h1 className="font-bold text-gray-800 capitalize text-sm sm:text-base truncate leading-tight">{tabLabel}</h1>
              <p className="text-[10px] sm:text-xs text-gray-400 truncate leading-tight">Welcome back, {profile?.full_name?.split(' ')[0] || "Learner"}! 👋</p>
            </div>
          </div>
          <div className="flex items-center gap-2 sm:gap-4">
            <button className="relative p-2 text-gray-500 hover:text-[var(--primary)] hover:bg-[var(--primary)]/10 rounded-xl transition-all" aria-label="Notifications">
              <Bell className="w-5 h-5" />
              <span className="absolute top-2 right-2 w-2 h-2 bg-[var(--accent)] rounded-full border-2 border-white" />
            </button>
            <div className="flex items-center gap-2 group cursor-pointer">
              <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-gradient-to-br from-[var(--primary)] to-[var(--primary-light)] flex items-center justify-center text-white text-xs font-bold shadow-sm shadow-[var(--primary)]/20">
                {profile?.full_name?.charAt(0) || user?.email?.charAt(0)?.toUpperCase()}
              </div>
              <ChevronRight className="w-3.5 h-3.5 text-gray-400 group-hover:text-gray-600 transition-all rotate-90 sm:rotate-0" />
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 space-y-6 sm:space-y-8">
          {isLoading ? (
            <div className="flex items-center justify-center py-20">
              <div className="animate-spin w-8 h-8 border-4 border-[var(--primary)] border-t-transparent rounded-full shadow-lg" />
            </div>
          ) : (
            <>
            <div className="max-w-6xl mx-auto space-y-6 sm:space-y-8 pb-10">
            {/* ─── OVERVIEW TAB ─── */}
            {activeTab === "overview" && (
              <>
                {isTeacher ? (
                  /* Teacher Overview */
                  <div className="space-y-6 sm:space-y-8">
                    <div className="grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-4 gap-4">
                      {[
                        { label: "Teaching", value: teachingCourses.length, icon: BookOpen, color: "text-[var(--primary)]", bg: "bg-[var(--primary)]/10" },
                        { label: "Total Students", value: teachingCourses.reduce((acc, c) => acc + (c.enrollments?.[0]?.count || 0), 0), icon: Users, color: "text-[var(--accent)]", bg: "bg-[var(--accent)]/10" },
                        { label: "Avg. Rating", value: (teachingCourses.reduce((acc, c) => acc + (c.rating || 0), 0) / (teachingCourses.length || 1)).toFixed(1), icon: Star, color: "text-amber-500", bg: "bg-amber-100" },
                        { label: "Earnings", value: "₦0", icon: DollarSign, color: "text-blue-600", bg: "bg-blue-100" },
                      ].map((stat) => (
                        <div key={stat.label} className="bg-white rounded-2xl border border-[var(--border)] p-4 sm:p-5 hover:border-[var(--primary)]/30 hover:shadow-xl hover:-translate-y-1 transition-all group">
                          <div className={`w-10 h-10 sm:w-11 sm:h-11 ${stat.bg} rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                            <stat.icon className={`w-5 h-5 sm:w-5.5 sm:h-5.5 ${stat.color}`} />
                          </div>
                          <p className="text-2xl sm:text-3xl font-extrabold text-gray-800 leading-none">{stat.value}</p>
                          <p className="text-[10px] sm:text-xs text-gray-500 mt-2 font-medium uppercase tracking-wider">{stat.label}</p>
                        </div>
                      ))}
                    </div>

                    <div className="bg-white rounded-3xl border border-[var(--border)] p-8 text-center space-y-4">
                      <div className="w-20 h-20 bg-[var(--primary)]/10 rounded-full flex items-center justify-center mx-auto">
                        <GraduationCap className="w-10 h-10 text-[var(--primary)]" />
                      </div>
                      <h2 className="text-2xl font-bold text-gray-800">Welcome to your Teacher Dashboard</h2>
                      <p className="text-gray-500 max-w-md mx-auto">
                        Manage your courses, track student progress, and view analytics for your educational content.
                      </p>
                      <Link href="/admin/courses" className="btn-primary inline-flex py-3 px-8">
                        Manage My Courses
                      </Link>
                    </div>
                  </div>
                ) : (
                  /* Student Overview */
                  <>
                {/* Stats */}
                <div className="grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-4 gap-4">
                  {[
                    { label: "Enrolled", value: enrollments.length, icon: BookOpen, color: "text-[var(--primary)]", bg: "bg-[var(--primary)]/10" },
                    { label: "Avg. Progress", value: `${totalProgress}%`, icon: TrendingUp, color: "text-[var(--accent)]", bg: "bg-[var(--accent)]/10" },
                    { label: "Hours Learned", value: `${totalHoursLearned}h`, icon: Clock, color: "text-purple-600", bg: "bg-purple-100" },
                    { label: "Certificates", value: certificates.length, icon: Award, color: "text-blue-600", bg: "bg-blue-100" },
                  ].map((stat) => (
                    <div key={stat.label} className="bg-white rounded-2xl border border-[var(--border)] p-4 sm:p-5 hover:border-[var(--primary)]/30 hover:shadow-xl hover:-translate-y-1 transition-all group">
                      <div className={`w-10 h-10 sm:w-11 sm:h-11 ${stat.bg} rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                        <stat.icon className={`w-5 h-5 sm:w-5.5 sm:h-5.5 ${stat.color}`} />
                      </div>
                      <p className="text-2xl sm:text-3xl font-extrabold text-gray-800 leading-none">{stat.value}</p>
                      <p className="text-[10px] sm:text-xs text-gray-500 mt-2 font-medium uppercase tracking-wider">{stat.label}</p>
                    </div>
                  ))}
                </div>

              <div className="grid lg:grid-cols-3 gap-6 sm:gap-8">
                {/* Left Column (Main Stats & Courses) */}
                <div className="lg:col-span-2 space-y-6 sm:space-y-8">
                  {/* Enrolled courses */}
                  <section>
                    <div className="flex items-center justify-between mb-4 px-1">
                      <h2 className="font-bold text-gray-800 flex items-center gap-2 text-base sm:text-lg">
                        <BookOpen className="w-5 h-5 text-[var(--primary)]" />
                        Active Courses
                      </h2>
                      <button
                        onClick={() => setActiveTab("courses")}
                        className="text-xs sm:text-sm text-[var(--primary)] font-bold hover:underline flex items-center gap-1"
                      >
                        See All <ChevronRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {enrollments.length === 0 ? (
                        <div className="col-span-full text-center py-12 bg-white rounded-3xl border-2 border-dashed border-gray-100 px-6">
                          <p className="text-sm text-gray-400 mb-4">Your dashboard is feeling a bit lonely. Start learning today!</p>
                          <Link href="/courses" className="btn-primary py-2 px-6 text-sm">Explore Content</Link>
                        </div>
                      ) : (
                        enrollments.slice(0, 2).map((course) => (
                          <div key={course.id} className="bg-white rounded-3xl border border-[var(--border)] p-4 hover:shadow-xl transition-all group flex flex-col">
                            <div className="flex gap-4 mb-4">
                              <div className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-2xl overflow-hidden flex-shrink-0 bg-gray-50 shadow-inner">
                                {course.image && <Image src={course.image} alt={course.title} fill className="object-cover group-hover:scale-110 transition-transform duration-500" />}
                              </div>
                              <div className="flex-1 min-w-0 pt-1">
                                <p className="font-bold text-sm text-gray-800 line-clamp-1 mb-1">{course.title}</p>
                                <p className="text-[10px] sm:text-xs text-gray-500 truncate">Instructor: {course.instructor}</p>
                              </div>
                            </div>
                            <div className="mt-auto">
                              <div className="flex items-center justify-between mb-2">
                                <span className="text-[10px] text-gray-400 font-medium">{course.completedLessons}/{course.totalLessons || 10} modules</span>
                                <span className="text-[10px] font-bold text-[var(--primary)] bg-[var(--primary)]/10 px-2 py-0.5 rounded-full">{course.progress}%</span>
                              </div>
                              <div className="progress-bar h-1.5 mb-4">
                                <div className="progress-fill" style={{ width: `${course.progress}%` }} />
                              </div>
                              <Link href={`/courses/${course.id}/learn`} className="btn-primary w-full justify-center text-xs py-2.5 transition-all group-hover:shadow-[var(--primary)]/20" aria-label={`Continue ${course.title}`}>
                                <Play className="w-3.5 h-3.5 fill-current" /> Resume Learning
                              </Link>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </section>

                  {/* Recently Accessed */}
                  <section className="bg-white rounded-3xl border border-[var(--border)] p-5 sm:p-6 shadow-sm">
                    <h2 className="font-bold text-gray-800 mb-6 flex items-center gap-2 text-base sm:text-lg">
                      <Clock className="w-5 h-5 text-[var(--primary)]" />
                      Resume Where You Left Off
                    </h2>
                    <div className="space-y-4">
                      {enrollments.length === 0 ? (
                        <p className="text-xs text-gray-400 italic text-center py-4">No content history yet.</p>
                      ) : (
                        enrollments.slice(0, 3).map((course) => (
                          <Link key={course.id} href={`/courses/${course.id}/learn`} className="flex items-center gap-4 p-3.5 rounded-2xl hover:bg-[var(--primary)]/5 transition-all border border-gray-50 hover:border-[var(--primary)]/10 group">
                            <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-[var(--primary)] shadow-md shadow-[var(--primary)]/20 flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform">
                              <Play className="w-4 h-4 text-white ml-0.5 fill-current" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-bold text-gray-800 line-clamp-1 group-hover:text-[var(--primary)] transition-colors">{course.title}</p>
                              <p className="text-[10px] sm:text-xs text-gray-500 mt-1">Next: {course.nextLesson}</p>
                            </div>
                            <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-[var(--primary)] group-hover:translate-x-1 transition-all" />
                          </Link>
                        ))
                      )}
                    </div>
                  </section>
                </div>

                {/* Right Column (Achievements & Mini Sections) */}
                <div className="space-y-6 sm:space-y-8">
                  {/* Achievements */}
                  <section className="bg-white rounded-3xl border border-[var(--border)] p-5 sm:p-6 shadow-sm">
                    <h2 className="font-bold text-gray-800 mb-6 flex items-center gap-2 text-base sm:text-lg">
                      <Star className="w-5 h-5 text-amber-500" />
                      Achievements
                    </h2>
                    <div className="grid grid-cols-1 gap-3">
                      {dynamicAchievements.map((a) => (
                        <div key={a.label} className={`flex items-center gap-3 p-3 rounded-2xl ${a.bg} border border-transparent hover:border-current/10 transition-all`}>
                          <div className="p-2 rounded-xl bg-white shadow-sm">
                            <a.icon className={`w-4 h-4 ${a.color}`} />
                          </div>
                          <span className={`text-xs font-bold ${a.color}`}>{a.label}</span>
                          <CheckCircle2 className={`w-4 h-4 ${a.color} ml-auto opacity-40`} />
                        </div>
                      ))}
                    </div>
                  </section>

                  {/* Learning Streak Mini */}
                  <section className="bg-gradient-to-br from-orange-50 to-orange-100/50 rounded-3xl border border-orange-200/50 p-5 sm:p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-bold text-gray-800 text-sm flex items-center gap-2">
                        <Flame className="w-4.5 h-4.5 text-orange-500" />
                        Daily Streak
                      </h3>
                      <span className="text-[10px] font-bold text-orange-600 bg-orange-200/50 px-2.5 py-1 rounded-full uppercase tracking-tight">Active</span>
                    </div>
                    <div className="flex items-baseline gap-2 mb-1">
                      <span className="text-4xl font-black text-orange-500">{profile?.streak || 0}</span>
                      <span className="text-xs font-bold text-orange-400">Days</span>
                    </div>
                    <p className="text-[10px] text-orange-600/70 font-medium leading-relaxed">
                      You&apos;re doing great! Keep learning every day to maintain your streak.
                    </p>
                  </section>
                </div>
              </div>
            </>
          )}
        </>
      )}

          {/* ─── COURSES TAB (Student) ─── */}
          {activeTab === "courses" && !isTeacher && (
            <div className="space-y-6">
              {/* Header row — stacks on very small screens */}
              <div className="flex flex-col sm:flex-row sm:items-center gap-4 justify-between bg-white p-4 rounded-2xl border border-[var(--border)] shadow-sm">
                <h2 className="font-bold text-gray-800 flex items-center gap-2.5 text-base sm:text-lg">
                  <BookOpen className="w-5 h-5 text-[var(--primary)] flex-shrink-0" />
                  My Learning Path
                  <span className="text-[10px] bg-[var(--primary)] text-white font-black px-2 py-0.5 rounded-full">{enrollments.length}</span>
                </h2>
                <Link href="/courses" className="btn-primary text-xs py-2.5 px-6 self-start sm:self-auto shadow-md shadow-[var(--primary)]/20">
                  Find More Courses
                </Link>
              </div>

              {enrollments.length === 0 ? (
                <div className="text-center py-20 bg-white rounded-3xl border border-[var(--border)] shadow-sm px-6">
                  <div className="w-16 h-16 bg-gray-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <BookOpen className="w-8 h-8 text-gray-200" />
                  </div>
                  <h3 className="text-lg font-bold text-gray-800">No courses yet</h3>
                  <p className="text-sm text-gray-500 mt-2 mb-8 max-w-xs mx-auto">Start your learning journey today and discover a world of knowledge.</p>
                  <Link href="/courses" className="btn-primary text-sm py-3 px-8">Explore Catalog</Link>
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-4">
                  {enrollments.map((course) => (
                    <div key={course.id} className="bg-white rounded-2xl border border-[var(--border)] p-4 sm:p-5 hover:shadow-xl transition-all group flex flex-col sm:flex-row gap-5 items-start sm:items-center">
                      {/* Left: image */}
                      <div className="relative w-full sm:w-32 h-40 sm:h-24 rounded-xl overflow-hidden flex-shrink-0 bg-gray-50 shadow-inner">
                        {course.image && <Image src={course.image} alt={course.title} fill className="object-cover group-hover:scale-110 transition-transform duration-700" />}
                        <div className="absolute top-2 left-2 px-2 py-0.5 bg-black/50 backdrop-blur-md text-white text-[8px] font-black rounded uppercase tracking-widest">{course.category}</div>
                      </div>
                      
                      {/* Middle: Info */}
                      <div className="flex-1 min-w-0 flex flex-col h-full justify-center">
                        <h3 className="font-bold text-base sm:text-lg text-gray-800 leading-tight line-clamp-2 group-hover:text-[var(--primary)] transition-colors">{course.title}</h3>
                        <p className="text-xs text-gray-500 mt-1 mb-3">By {course.instructor}</p>
                        
                        <div className="flex items-center gap-3">
                           <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden shadow-inner flex-shrink-0">
                             <div className="h-full bg-gradient-to-r from-[var(--primary)] to-[var(--primary-light)] rounded-full transition-all duration-1000" style={{ width: `${course.progress}%` }} />
                           </div>
                           <span className="text-[10px] font-black text-[var(--primary)] min-w-[30px]">{course.progress}%</span>
                        </div>
                      </div>

                      {/* Right: Actions */}
                      <div className="w-full sm:w-auto flex sm:flex-col items-center justify-between sm:justify-center gap-3 pt-3 sm:pt-0 sm:border-l sm:border-gray-100 sm:pl-5">
                          <div className="text-[10px] text-gray-400 font-medium flex items-center gap-1">
                             <Clock className="w-3 h-3" /> {course.lastAccessed}
                          </div>
                          <Link
                            href={`/courses/${course.id}/learn`}
                            className="btn-primary text-xs py-2.5 px-6 rounded-xl flex-shrink-0 w-full sm:w-auto text-center"
                            aria-label={`Continue ${course.title}`}
                          >
                             Resume
                          </Link>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* ─── TEACHING TAB (Teacher) ─── */}
          {activeTab === "teaching" && isTeacher && (
            <div className="space-y-6">
              <div className="flex items-center justify-between bg-white p-4 rounded-2xl border border-[var(--border)] shadow-sm">
                <h2 className="font-bold text-gray-800 flex items-center gap-2.5 text-base sm:text-lg">
                  <BookOpen className="w-5 h-5 text-[var(--primary)] flex-shrink-0" />
                  My Courses
                  <span className="text-[10px] bg-[var(--primary)] text-white font-black px-2 py-0.5 rounded-full">{teachingCourses.length}</span>
                </h2>
                <Link href="/admin/courses?action=new" className="btn-primary text-xs py-2.5 px-6 shadow-md shadow-[var(--primary)]/20">
                  Create New Course
                </Link>
              </div>

              {teachingCourses.length === 0 ? (
                <div className="text-center py-20 bg-white rounded-3xl border border-[var(--border)] px-6">
                  <div className="w-16 h-16 bg-gray-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <BookOpen className="w-8 h-8 text-gray-200" />
                  </div>
                  <h3 className="text-lg font-bold text-gray-800">No courses yet</h3>
                  <p className="text-sm text-gray-500 mt-2 mb-8 max-w-xs mx-auto">Share your expertise! Create your first course today.</p>
                  <Link href="/admin/courses?action=new" className="btn-primary text-sm py-3 px-8">Start Teaching</Link>
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-4">
                  {teachingCourses.map((course) => (
                    <div key={course.id} className="bg-white rounded-2xl border border-[var(--border)] p-4 sm:p-5 hover:shadow-xl transition-all group flex flex-col sm:flex-row gap-5 items-start sm:items-center">
                      <div className="relative w-full sm:w-32 h-40 sm:h-24 rounded-xl overflow-hidden flex-shrink-0 bg-gray-50 shadow-inner">
                        {course.image_url && <Image src={course.image_url} alt={course.title} fill className="object-cover group-hover:scale-110 transition-transform duration-700" />}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-bold text-base sm:text-lg text-gray-800 leading-tight line-clamp-2">{course.title}</h3>
                        <div className="flex items-center gap-4 mt-3">
                           <div className="flex items-center gap-1.5 text-xs text-gray-500">
                             <Users className="w-3.5 h-3.5" /> {course.enrollments?.[0]?.count || 0} Students
                           </div>
                           <div className="flex items-center gap-1.5 text-xs text-gray-500">
                             <Star className="w-3.5 h-3.5 text-amber-500" /> {course.rating || "No ratings"}
                           </div>
                        </div>
                      </div>
                      <div className="w-full sm:w-auto flex gap-2">
                        <Link href={`/admin/courses/${course.id}`} className="btn-outline flex-1 sm:flex-none text-xs py-2 px-4">Edit</Link>
                        <Link href={`/courses/${course.id}`} className="btn-primary flex-1 sm:flex-none text-xs py-2 px-4">View Page</Link>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* ─── STUDENTS TAB (Teacher) ─── */}
          {activeTab === "students" && isTeacher && (
            <div className="space-y-6">
              <div className="bg-white rounded-3xl border border-[var(--border)] p-12 text-center space-y-4">
                <Users className="w-12 h-12 text-gray-200 mx-auto" />
                <h3 className="text-lg font-bold text-gray-800">Student Insights</h3>
                <p className="text-sm text-gray-500 max-w-sm mx-auto">This section will show a detailed list of students enrolled in your courses and their individual progress.</p>
              </div>
            </div>
          )}

          {/* ─── PROGRESS TAB (Student) ─── */}
          {activeTab === "progress" && !isTeacher && (
            <div className="space-y-6">
              {/* Weekly Goal */}
              <div className="bg-white rounded-2xl border border-[var(--border)] p-5">
                <div className="flex items-center justify-between mb-5">
                  <h2 className="font-bold text-gray-800 flex items-center gap-2">
                    <Target className="w-4 h-4 text-[var(--primary)]" /> Weekly Goal
                  </h2>
                  <span className="text-xs text-gray-400">Apr 7 – Apr 13</span>
                </div>
                  <div className="flex items-center gap-4 sm:gap-6">
                    <div className="relative flex-shrink-0">
                      <ProgressRing percent={71} size={80} />
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-base font-extrabold text-gray-800">71%</span>
                      </div>
                    </div>
                    <div className="flex-1 grid grid-cols-2 xs:grid-cols-3 sm:grid-cols-4 gap-2">
                       {/* Compact day stats */}
                      {[
                        { day: "M", done: true },
                        { day: "T", done: true },
                        { day: "W", done: true },
                        { day: "T", done: true },
                        { day: "F", done: true },
                        { day: "S", done: false },
                        { day: "S", done: false },
                      ].map((d, i) => (
                        <div key={i} className={`flex flex-col items-center justify-center p-2 rounded-xl border ${d.done ? "bg-[var(--primary)]/5 border-[var(--primary)]/10" : "bg-gray-50 border-gray-100 opacity-50"}`}>
                           <span className={`text-[10px] font-bold ${d.done ? "text-[var(--primary)]" : "text-gray-400"}`}>{d.day}</span>
                           {d.done ? <CheckCircle2 className="w-3 h-3 text-[var(--primary)] mt-1" /> : <Circle className="w-3 h-3 text-gray-300 mt-1" />}
                        </div>
                      ))}
                    </div>
                  </div>
              </div>

              {/* Course progress cards */}
              <div>
                <h2 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
                  <BarChart3 className="w-4 h-4 text-[var(--primary)]" />
                  Course Progress
                </h2>
                <div className="space-y-4">
                  {enrollments.length === 0 ? (
                    <div className="bg-white rounded-2xl border border-[var(--border)] p-10 text-center">
                      <p className="text-sm text-gray-500">No course progress to display.</p>
                    </div>
                  ) : (
                    enrollments.map((course) => (
                      <div key={course.id} className="bg-white rounded-2xl border border-[var(--border)] p-5">
                        <div className="flex items-center gap-3 mb-3">
                          <div className="relative w-10 h-10 rounded-xl overflow-hidden flex-shrink-0">
                            {course.image && <Image src={course.image} alt={course.title} fill className="object-cover" />}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-semibold text-gray-800 line-clamp-1">{course.title}</p>
                            <p className="text-xs text-gray-500">by {course.instructor}</p>
                          </div>
                          <div className="relative flex-shrink-0">
                            <ProgressRing percent={course.progress} size={52} />
                            <div className="absolute inset-0 flex items-center justify-center">
                              <span className="text-[10px] font-bold text-gray-800">{course.progress}%</span>
                            </div>
                          </div>
                        </div>
                        <div className="grid grid-cols-3 gap-3">
                          {[
                            { label: "Completed", value: course.completedLessons },
                            { label: "Remaining", value: (course.totalLessons || 10) - course.completedLessons },
                            { label: "Total", value: course.totalLessons || 10 },
                          ].map((s) => (
                            <div key={s.label} className="bg-gray-50 rounded-xl p-3 text-center">
                              <p className="text-sm font-bold text-gray-800">{s.value}</p>
                              <p className="text-[10px] text-gray-400">{s.label}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* Learning Streak */}
              <div className="bg-white rounded-2xl border border-[var(--border)] p-5 sm:p-6 shadow-sm overflow-hidden">
                <h2 className="font-bold text-gray-800 mb-6 flex items-center gap-2">
                  <Flame className="w-5 h-5 text-orange-500" />
                  Activity Graph
                </h2>
                <div className="flex flex-col sm:flex-row items-center gap-6 mb-4">
                  <div className="text-center px-4 py-2 bg-orange-50 rounded-2xl border border-orange-100 flex-shrink-0">
                    <p className="text-4xl font-black text-orange-500">7</p>
                    <p className="text-[10px] font-bold text-orange-600 uppercase tracking-widest">Day Streak</p>
                  </div>
                  <div className="flex-1 flex flex-wrap justify-center sm:justify-start gap-1">
                    {Array.from({ length: 42 }).map((_, i) => (
                      <div
                        key={i}
                        className={`w-3.5 h-3.5 rounded-sm sm:rounded ${
                          i >= 35 ? "bg-orange-500" : i >= 20 ? "bg-orange-200" : "bg-gray-100"
                        }`}
                        title={`Activity level ${i}`}
                      />
                    ))}
                  </div>
                </div>
                <p className="text-xs text-gray-400 text-center sm:text-left">Your consistency is paying off! Keep it up 🔥</p>
              </div>
            </div>
          )}

          {/* ─── CERTIFICATES TAB (Student) ─── */}
          {activeTab === "certificates" && !isTeacher && (
            <div className="space-y-5">
              <div className="flex items-center justify-between">
                <h2 className="font-bold text-gray-800 flex items-center gap-2">
                  <Award className="w-4 h-4 text-purple-500" />
                  My Certificates ({certificates.length})
                </h2>
              </div>

              <div className="grid sm:grid-cols-2 gap-5">
                {certificates.map((cert) => (
                  <div key={cert.id} className="bg-white rounded-2xl border border-[var(--border)] overflow-hidden hover:shadow-lg transition-shadow group">
                    <div className="relative h-36 overflow-hidden">
                      <Image src={cert.image} alt={cert.title} fill className="object-cover group-hover:scale-105 transition-transform" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                      <div className="absolute bottom-0 left-0 p-4">
                        <p className="text-white font-bold text-sm line-clamp-2">{cert.title}</p>
                      </div>
                      <div className="absolute top-3 right-3 w-9 h-9 bg-amber-400 rounded-xl flex items-center justify-center shadow-lg">
                        <Award className="w-5 h-5 text-white" />
                      </div>
                    </div>
                    <div className="p-4">
                      <p className="font-semibold text-sm text-gray-800 mb-2 line-clamp-1">{cert.title}</p>
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-xs text-gray-500">Issued by {cert.instructor}</p>
                          <p className="text-xs text-gray-400 flex items-center gap-1 mt-0.5">
                            <Calendar className="w-3 h-3" /> {cert.date}
                          </p>
                        </div>
                        <CertificateGenerator
                           studentName={cert.studentName}
                           courseTitle={cert.title}
                           date={cert.date}
                           instructorName={cert.instructor}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Upcoming */}
              <div className="bg-white rounded-2xl border border-[var(--border)] p-5">
                <h3 className="font-bold text-gray-800 mb-4 text-sm flex items-center gap-2">
                  <Zap className="w-4 h-4 text-amber-500" />
                  Courses in Progress (earn certificate on completion)
                </h3>
                {enrollments.filter((c) => c.progress < 100).map((course) => (
                  <div key={course.id} className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 transition-colors">
                    <div className="w-9 h-9 rounded-xl bg-purple-100 flex items-center justify-center flex-shrink-0">
                      <Award className="w-4 h-4 text-purple-400" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-700 line-clamp-1">{course.title}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                          <div className="h-full bg-purple-400 rounded-full" style={{ width: `${course.progress}%` }} />
                        </div>
                        <span className="text-[10px] text-purple-600 font-bold">{course.progress}%</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ─── PROFILE TAB ─── */}
          {activeTab === "profile" && (
            <div className="max-w-2xl space-y-5">
              {/* Avatar */}
              <div className="bg-white rounded-2xl border border-[var(--border)] p-6">
                <h2 className="font-bold text-gray-800 mb-5">Profile Picture</h2>
                <div className="flex items-center gap-5">
                  <div className="relative">
                    <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-[var(--primary)] to-[var(--primary-light)] flex items-center justify-center text-white font-extrabold text-2xl">
                      JD
                    </div>
                    <button className="absolute -bottom-1 -right-1 w-7 h-7 bg-white border border-[var(--border)] rounded-xl flex items-center justify-center shadow-sm hover:bg-gray-50 transition-colors">
                      <Camera className="w-3.5 h-3.5 text-gray-600" />
                    </button>
                  </div>
                  <div>
                    <p className="font-semibold text-gray-800">John Doe</p>
                    <p className="text-sm text-gray-500">Student since Jan 2024</p>
                    <button className="text-xs text-[var(--primary)] font-medium hover:underline mt-1">
                      Upload new photo
                    </button>
                  </div>
                </div>
              </div>

              {/* Personal Info */}
              <div className="bg-white rounded-2xl border border-[var(--border)] p-6">
                <h2 className="font-bold text-gray-800 mb-5">Personal Information</h2>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="form-label">Full Name</label>
                    <input className="form-input" value={profileForm.name} onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })} />
                  </div>
                  <div>
                    <label className="form-label">Email</label>
                    <input type="email" className="form-input" value={profileForm.email} onChange={(e) => setProfileForm({ ...profileForm, email: e.target.value })} />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="form-label">Bio</label>
                    <textarea rows={3} className="form-input resize-none" value={profileForm.bio} onChange={(e) => setProfileForm({ ...profileForm, bio: e.target.value })} />
                  </div>
                  <div>
                    <label className="form-label">Location</label>
                    <input className="form-input" value={profileForm.location} onChange={(e) => setProfileForm({ ...profileForm, location: e.target.value })} />
                  </div>
                  <div>
                    <label className="form-label">Website</label>
                    <input className="form-input" placeholder="https://" value={profileForm.website} onChange={(e) => setProfileForm({ ...profileForm, website: e.target.value })} />
                  </div>
                </div>
                <button className="btn-primary mt-5 text-sm py-2.5 px-5">Save Changes</button>
              </div>
            </div>
          )}

          {/* ─── SETTINGS TAB ─── */}
          {activeTab === "settings" && (
            <div className="max-w-2xl space-y-5">
              {/* Notifications */}
              <div className="bg-white rounded-2xl border border-[var(--border)] p-6">
                <h2 className="font-bold text-gray-800 mb-1 flex items-center gap-2">
                  <Bell className="w-4 h-4" /> Notification Settings
                </h2>
                <p className="text-xs text-gray-500 mb-5">Control how and when TaxNG Academy contacts you</p>
                <div className="space-y-3">
                  {Object.entries(settingsState).filter(([k]) => ["emailNotifications", "pushNotifications", "weeklyReport"].includes(k)).map(([key, val]) => {
                    const labels: Record<string, { label: string; desc: string }> = {
                      emailNotifications: { label: "Email Notifications", desc: "Receive updates about your courses via email" },
                      pushNotifications: { label: "Push Notifications", desc: "In-browser alerts for new activities" },
                      weeklyReport: { label: "Weekly Progress Report", desc: "Get a weekly summary of your learning progress" },
                    };
                    return (
                      <label key={key} className="flex items-center justify-between p-4 rounded-2xl border border-[var(--border)] hover:bg-gray-50 cursor-pointer">
                        <div>
                          <p className="font-medium text-sm text-gray-800">{labels[key].label}</p>
                          <p className="text-xs text-gray-400">{labels[key].desc}</p>
                        </div>
                        <div
                          onClick={() => setSettingsState({ ...settingsState, [key]: !val })}
                          className={`relative w-11 h-6 rounded-full cursor-pointer transition-colors ${val ? "bg-[var(--primary)]" : "bg-gray-200"}`}
                        >
                          <div className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-all ${val ? "left-5" : "left-0.5"}`} />
                        </div>
                      </label>
                    );
                  })}
                </div>
              </div>

              {/* Privacy */}
              <div className="bg-white rounded-2xl border border-[var(--border)] p-6">
                <h2 className="font-bold text-gray-800 mb-1 flex items-center gap-2">
                  <Lock className="w-4 h-4" /> Privacy & Security
                </h2>
                <p className="text-xs text-gray-500 mb-5">Manage your account security and privacy preferences</p>
                <div className="space-y-3">
                  {[
                    { key: "publicProfile", label: "Public Profile", desc: "Allow others to see your profile and progress" },
                    { key: "twoFactor", label: "Two-Factor Authentication", desc: "Add an extra layer of security to your account" },
                  ].map(({ key, label, desc }) => {
                    const val = settingsState[key as keyof typeof settingsState] as boolean;
                    return (
                      <label key={key} className="flex items-center justify-between p-4 rounded-2xl border border-[var(--border)] hover:bg-gray-50 cursor-pointer">
                        <div>
                          <p className="font-medium text-sm text-gray-800">{label}</p>
                          <p className="text-xs text-gray-400">{desc}</p>
                        </div>
                        <div
                          onClick={() => setSettingsState({ ...settingsState, [key]: !val })}
                          className={`relative w-11 h-6 rounded-full cursor-pointer transition-colors ${val ? "bg-[var(--primary)]" : "bg-gray-200"}`}
                        >
                          <div className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-all ${val ? "left-5" : "left-0.5"}`} />
                        </div>
                      </label>
                    );
                  })}
                </div>
              </div>

              {/* Danger Zone */}
              <div className="bg-white rounded-2xl border border-red-100 p-6">
                <h2 className="font-bold text-red-700 mb-1 flex items-center gap-2">
                  <Target className="w-4 h-4" /> Danger Zone
                </h2>
                <p className="text-xs text-gray-500 mb-4">These actions are permanent and cannot be undone</p>
                <div className="flex gap-3">
                  <button className="text-sm border-2 border-red-200 text-red-600 px-4 py-2 rounded-xl hover:bg-red-50 transition-colors font-medium">
                    Delete Account
                  </button>
                  <button className="text-sm border-2 border-gray-200 text-gray-600 px-4 py-2 rounded-xl hover:bg-gray-50 transition-colors font-medium">
                    Export Data
                  </button>
                </div>
              </div>
            </div>
          )}
            </div>
            </>
          )}
        </main>
      </div>

      <SubscriptionModal 
        isOpen={showSubModal} 
        onClose={() => setShowSubModal(false)} 
      />
    </div>
  );
}

export default function DashboardPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-[var(--bg)]">
        <div className="animate-spin w-8 h-8 border-4 border-[var(--primary)] border-t-transparent rounded-full" />
      </div>
    }>
      <DashboardContent />
    </Suspense>
  );
}
