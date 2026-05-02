"use client";

export const dynamic = 'force-dynamic';

import { useState } from "react";
import Link from "next/link";
import {
  Search,
  Filter,
  Star,
  ChevronDown,
  X,
  SlidersHorizontal,
  BookOpen,
  Grid3x3,
  LayoutList,
  Crown,
  ArrowRight,
} from "lucide-react";
import CourseCard from "@/components/CourseCard";
import { CourseCardSkeleton } from "@/components/CourseCard";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { courses as mockCourses, categories as mockCategories } from "@/lib/mockData";
import { supabase } from "@/lib/supabase";

const priceFilters = ["All", "Free", "Paid"];
const levelFilters = ["All", "Beginner", "Intermediate", "Advanced"];
const ratingFilters = [
  { label: "4.5 & above", value: 4.5 },
  { label: "4.0 & above", value: 4.0 },
  { label: "3.5 & above", value: 3.5 },
];

export default function CoursesPage() {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [priceFilter, setPriceFilter] = useState("All");
  const [levelFilter, setLevelFilter] = useState("All");
  const [ratingFilter, setRatingFilter] = useState<number | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [sortBy, setSortBy] = useState("popular");
  const [isLoading, setIsLoading] = useState(true);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [fetchedCourses, setFetchedCourses] = useState<any[]>([]);
  const [fetchedCategories, setFetchedCategories] = useState<any[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
          router.push("/login");
          return;
        }

        // Fetch categories from Supabase, fallback to mock if empty
        const { data: cats, error: catsErr } = await supabase
          .from("categories")
          .select("*")
          .order("name");
          
        if (cats && cats.length > 0 && !catsErr) {
          setFetchedCategories(cats);
        } else {
          setFetchedCategories(mockCategories.map((c: any) => ({ id: c.id, name: c.name })));
        }
        
        // Fetch courses from Supabase
        const { data, error } = await supabase
          .from("courses")
          .select("*, users(full_name)")
          .eq("status", "published");

        if (error) {
          console.error("Supabase error fetching live courses:", error.message);
        }

        const liveCourses = data || [];
        
        const mapped = liveCourses.map((c: any) => {
          let parsedContent: any = {};
          try {
            if (c.content) {
              parsedContent = typeof c.content === 'string' ? JSON.parse(c.content) : c.content;
            }
          } catch(e) {
            console.warn("Could not parse course content JSON for course:", c.id);
          }

          return {
            ...c,
            id: c.id,
            title: c.title,
            description: c.description,
            instructor: c.users?.full_name || "TaxNG Instructor",
            category: parsedContent.category || "General Tax",
            price: parsedContent.price === 0 ? "free" : (parsedContent.price || 5000),
            image: parsedContent.image_url || "/images/course-placeholder.jpg",
            level: (c.difficulty_level || "beginner").charAt(0).toUpperCase() + (c.difficulty_level || "beginner").slice(1),
            rating: parsedContent.rating || 4.8,
            reviews: parsedContent.reviews || 120,
            students: parsedContent.students || 1500,
            lessons: parsedContent.lessons || 12,
          };
        });
        setFetchedCourses(mapped);

      } catch (err: any) {
        console.error("Fatal error in courses fetchData:", err.message || err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const filtered = fetchedCourses.filter((c: any) => {
    const matchSearch = c.title.toLowerCase().includes(search.toLowerCase());
    const matchCategory = selectedCategory === "All" || c.category === selectedCategory;
    const matchPrice =
      priceFilter === "All" ||
      (priceFilter === "Free" && c.price === "free") ||
      (priceFilter === "Paid" && c.price !== "free");
    const matchLevel = levelFilter === "All" || c.level === levelFilter;
    const matchRating = ratingFilter === null || c.rating >= ratingFilter;
    return matchSearch && matchCategory && matchPrice && matchLevel && matchRating;
  });

  const sorted = [...filtered].sort((a, b) => {
    if (sortBy === "popular") return b.students - a.students;
    if (sortBy === "rating") return b.rating - a.rating;
    if (sortBy === "newest") return parseInt(b.id) - parseInt(a.id);
    if (sortBy === "price-asc") return (a.price === "free" ? 0 : a.price) - (b.price === "free" ? 0 : (b.price as number));
    return 0;
  });

  const clearFilters = () => {
    setSearch("");
    setSelectedCategory("All");
    setPriceFilter("All");
    setLevelFilter("All");
    setRatingFilter(null);
  };

  const activeFiltersCount = [
    selectedCategory !== "All",
    priceFilter !== "All",
    levelFilter !== "All",
    ratingFilter !== null,
  ].filter(Boolean).length;

  return (
    <div className="min-h-screen" style={{ backgroundColor: "var(--bg)" }}>
      {/* Header */}
      <div className="bg-gradient-to-br from-[var(--primary)] to-[var(--primary-light)] text-white pt-24 pb-10 sm:pt-32 sm:pb-16 relative overflow-hidden">
        {/* Decorations */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-8 px-4">
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold mb-4 tracking-tight leading-tight">
              Explore All Courses
            </h1>
            <p className="text-green-100 text-sm sm:text-base md:text-lg max-w-2xl mx-auto opacity-90">
              Discover {fetchedCourses.length}+ expert-led courses curated to help you master new skills and advance your career.
            </p>

            {/* Subscription Tip */}
            <div className="mt-8 inline-flex items-center gap-4 p-3 sm:p-4 bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl shadow-xl animate-fade-in text-left max-w-xl mx-auto">
              <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm flex-shrink-0">
                <Crown className="w-5 h-5 text-amber-500" />
              </div>
              <div>
                <p className="text-sm font-bold text-white">LMS Access Tip</p>
                <p className="text-xs text-green-50 leading-relaxed">
                  Full access to the Learning Management System is exclusive to <span className="font-bold text-amber-300">Tax Expert</span> subscribers.
                  <a 
                    href="https://www.taxnigeria.com/pricing" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="ml-2 inline-flex items-center gap-1 text-amber-300 font-bold hover:text-amber-400 underline underline-offset-2"
                  >
                    Upgrade Now <ArrowRight className="w-3 h-3" />
                  </a>
                </p>
              </div>
            </div>
          </div>
          {/* Search */}
          <div className="max-w-2xl mx-auto px-2 sm:px-0">
            <div className="relative flex gap-3">
              <div className="relative flex-1">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="search"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search courses, instructors..."
                  aria-label="Search courses"
                  className="w-full pl-12 pr-4 py-3.5 sm:py-4 rounded-xl sm:rounded-2xl bg-white text-gray-800 text-sm sm:text-base outline-none focus:ring-4 focus:ring-white/30 shadow-2xl transition-all"
                />
                {search && (
                  <button onClick={() => setSearch("")} className="absolute right-4 top-1/2 -translate-y-1/2 p-1 hover:bg-gray-100 rounded-full transition-colors" aria-label="Clear search">
                    <X className="w-4 h-4 text-gray-400" />
                  </button>
                )}
              </div>
              <button
                onClick={() => setIsSidebarOpen(true)}
                className="md:hidden px-4 sm:px-5 py-3.5 sm:py-4 bg-white/10 hover:bg-white/20 rounded-xl sm:rounded-2xl border border-white/30 flex items-center gap-2 text-white font-medium backdrop-blur-sm transition-all"
                aria-label="Toggle filters"
              >
                <Filter className="w-5 h-5" />
                {activeFiltersCount > 0 && (
                  <span className="bg-[var(--accent)] text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                    {activeFiltersCount}
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <div className="flex gap-8 relative">
          
          {/* Mobile Sidebar Overlay */}
          <div 
            className={`fixed inset-0 bg-black/50 backdrop-blur-sm z-[99] transition-opacity duration-300 md:hidden ${isSidebarOpen ? "opacity-100" : "opacity-0 pointer-events-none"}`}
            onClick={() => setIsSidebarOpen(false)}
          />

          {/* Sidebar (Desktop & Mobile Drawer) */}
          <aside
            className={`
              fixed md:static inset-y-0 left-0 w-[280px] sm:w-[320px] md:w-64 bg-white md:bg-transparent z-[100] md:z-auto
              transform transition-transform duration-300 ease-in-out px-6 py-8 md:p-0
              ${isSidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
              md:block flex-shrink-0
            `}
            aria-label="Course filters"
          >
            <div className="bg-white md:rounded-2xl md:shadow-sm md:border md:border-[var(--border)] p-0 md:p-5 sticky top-24 space-y-6 overflow-y-auto max-h-[calc(100vh-120px)] md:max-h-none">
              <div className="flex items-center justify-between mb-2">
                <h2 className="font-bold text-gray-800 flex items-center gap-2 text-lg md:text-base">
                  <SlidersHorizontal className="w-4.5 h-4.5 md:w-4 md:h-4" />
                  Filters
                </h2>
                <div className="flex items-center gap-3">
                  {activeFiltersCount > 0 && (
                    <button onClick={clearFilters} className="text-xs text-[var(--primary)] font-medium hover:underline">
                      Clear
                    </button>
                  )}
                  <button 
                    onClick={() => setIsSidebarOpen(false)}
                    className="md:hidden p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <X className="w-5 h-5 text-gray-400" />
                  </button>
                </div>
              </div>

              {/* Category */}
              <div>
                <h3 className="text-sm font-bold text-gray-800 mb-4 flex items-center gap-2">
                  <span className="w-1 h-3 bg-[var(--primary)] rounded-full"></span>
                  Category
                </h3>
                <div className="grid grid-cols-1 gap-2">
                  {["All", ...fetchedCategories.map((c: any) => c.name)].map((cat: string) => (
                    <label key={cat} className={`flex items-center justify-between gap-2.5 p-2 rounded-xl border border-transparent cursor-pointer transition-all ${selectedCategory === cat ? "bg-[var(--primary)]/5 border-[var(--primary)]/10" : "hover:bg-gray-50"}`}>
                      <div className="flex items-center gap-2.5">
                        <input
                          type="radio"
                          name="category"
                          checked={selectedCategory === cat}
                          onChange={() => setSelectedCategory(cat)}
                          className="w-4 h-4 accent-[var(--primary)]"
                          aria-label={`Filter by ${cat}`}
                        />
                        <span className={`text-sm ${selectedCategory === cat ? "text-[var(--primary)] font-semibold" : "text-gray-600"}`}>
                          {cat}
                        </span>
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              {/* Price */}
              <div>
                <h3 className="text-sm font-bold text-gray-800 mb-4 flex items-center gap-2">
                  <span className="w-1 h-3 bg-[var(--accent)] rounded-full"></span>
                  Price
                </h3>
                <div className="flex flex-wrap gap-2">
                  {priceFilters.map((p) => (
                    <button
                      key={p}
                      onClick={() => setPriceFilter(p)}
                      className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
                        priceFilter === p
                          ? "bg-[var(--primary)] text-white shadow-md shadow-[var(--primary)]/20"
                          : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                      }`}
                      aria-pressed={priceFilter === p}
                    >
                      {p}
                    </button>
                  ))}
                </div>
              </div>

              {/* Level */}
              <div>
                <h3 className="text-sm font-bold text-gray-800 mb-4 flex items-center gap-2">
                  <span className="w-1 h-3 bg-purple-500 rounded-full"></span>
                  Skill Level
                </h3>
                <div className="space-y-2">
                  {levelFilters.map((l) => (
                    <label key={l} className={`flex items-center gap-2.5 p-2 rounded-xl cursor-pointer transition-all ${levelFilter === l ? "bg-purple-50 border border-purple-100" : "hover:bg-gray-50"}`}>
                      <input
                        type="radio"
                        name="level"
                        checked={levelFilter === l}
                        onChange={() => setLevelFilter(l)}
                        className="w-4 h-4 accent-purple-600"
                        aria-label={`Filter by level: ${l}`}
                      />
                      <span className={`text-sm ${levelFilter === l ? "text-purple-700 font-semibold" : "text-gray-600"}`}>
                        {l}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Rating */}
              <div>
                <h3 className="text-sm font-bold text-gray-800 mb-4 flex items-center gap-2">
                  <span className="w-1 h-3 bg-amber-400 rounded-full"></span>
                  Minimum Rating
                </h3>
                <div className="space-y-2">
                  {ratingFilters.map((r) => (
                    <label key={r.value} className={`flex items-center gap-2.5 p-2 rounded-xl cursor-pointer transition-all ${ratingFilter === r.value ? "bg-amber-50 border border-amber-100" : "hover:bg-gray-50"}`}>
                      <input
                        type="radio"
                        name="rating"
                        checked={ratingFilter === r.value}
                        onChange={() => setRatingFilter(r.value)}
                        className="w-4 h-4 accent-amber-500"
                        aria-label={`Filter by rating: ${r.label}`}
                      />
                      <span className="flex items-center gap-1.5 text-sm text-gray-600">
                        <Star className={`w-3.5 h-3.5 ${ratingFilter === r.value ? "fill-amber-500 text-amber-500" : "fill-amber-400 text-amber-400"}`} />
                        <span className={ratingFilter === r.value ? "text-amber-700 font-semibold" : ""}>{r.label}</span>
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              <button 
                onClick={() => setIsSidebarOpen(false)}
                className="md:hidden btn-primary w-full py-3 mt-4"
              >
                Apply Filters
              </button>
            </div>
          </aside>

          {/* Main content */}
          <div className="flex-1 min-w-0">
            {/* Toolbar */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 bg-white rounded-2xl border border-[var(--border)] p-3 px-4 shadow-sm">
              <p className="text-sm text-gray-600 text-center sm:text-left">
                Showing <span className="font-bold text-gray-900">{sorted.length}</span> {sorted.length === 1 ? "course" : "courses"}
              </p>
              <div className="flex items-center justify-center gap-3">
                {/* View toggle */}
                <div className="hidden sm:flex gap-1 bg-gray-100 rounded-xl p-1">
                  <button
                    onClick={() => setViewMode("grid")}
                    className={`p-1.5 rounded-lg transition-all ${viewMode === "grid" ? "bg-white shadow-sm text-[var(--primary)]" : "text-gray-400 hover:text-gray-600"}`}
                    aria-label="Grid view"
                    aria-pressed={viewMode === "grid"}
                  >
                    <Grid3x3 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setViewMode("list")}
                    className={`p-1.5 rounded-lg transition-all ${viewMode === "list" ? "bg-white shadow-sm text-[var(--primary)]" : "text-gray-400 hover:text-gray-600"}`}
                    aria-label="List view"
                    aria-pressed={viewMode === "list"}
                  >
                    <LayoutList className="w-4 h-4" />
                  </button>
                </div>
                {/* Sort */}
                <div className="relative min-w-[160px] sm:min-w-0">
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="w-full appearance-none pl-3 pr-10 py-2.5 text-sm rounded-xl border border-gray-200 bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/20 focus:border-[var(--primary)] transition-all cursor-pointer"
                    aria-label="Sort courses"
                  >
                    <option value="popular">Most Popular</option>
                    <option value="rating">Highest Rated</option>
                    <option value="newest">Newest First</option>
                    <option value="price-asc">Price: Low to High</option>
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                </div>
              </div>
            </div>

            {/* Courses grid */}
            {isLoading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                {[...Array(6)].map((_, i) => <CourseCardSkeleton key={i} />)}
              </div>
            ) : sorted.length === 0 ? (
              <div className="text-center py-24 sm:py-32 bg-white rounded-3xl border border-[var(--border)] shadow-sm px-6">
                <div className="w-20 h-20 bg-gray-50 rounded-3xl flex items-center justify-center mx-auto mb-6">
                  <Search className="w-10 h-10 text-gray-300" />
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-3">No courses match your criteria</h3>
                <p className="text-gray-500 mb-8 max-w-sm mx-auto text-sm sm:text-base">We couldn't find any courses matching your current filters. Try clearing them to see all content.</p>
                <button onClick={clearFilters} className="btn-primary px-8">Clear All Filters</button>
              </div>
            ) : (
              <div className={`grid gap-6 ${viewMode === "grid" ? "grid-cols-1 sm:grid-cols-2 xl:grid-cols-3" : "grid-cols-1"}`}>
                {sorted.map((course) => (
                  <div key={course.id} className="animate-fade-in">
                    <CourseCard course={course} />
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

    </div>
  );
}
