"use client";
import { useState, useEffect } from "react";

import Link from "next/link";
import { ArrowRight, BookOpen, Users, Award, TrendingUp, UserCheck, Lightbulb, Rocket, Check, GraduationCap, Shield, Crown } from "lucide-react";

import HeroSlider from "@/components/HeroSlider";
import CourseCard from "@/components/CourseCard";
import TestimonialCard from "@/components/TestimonialCard";
import { categories } from "@/lib/mockData";
import { supabase } from "@/lib/supabase";

const steps = [
  {
    number: "01",
    icon: UserCheck,
    title: "Create Your Account",
    desc: "Sign up free in seconds. No payment required to get started with foundational tax courses.",
    color: "from-[var(--primary)] to-[var(--primary-light)]",
    bg: "bg-[var(--primary)]/10",
    iconColor: "text-[var(--primary)]",
  },
  {
    number: "02",
    icon: BookOpen,
    title: "Pick a Tax Course",
    desc: "Browse 60+ courses across all six tax categories — from personal income tax to corporate compliance.",
    color: "from-[var(--accent)] to-orange-400",
    bg: "bg-[var(--accent)]/10",
    iconColor: "text-[var(--accent)]",
  },
  {
    number: "03",
    icon: Rocket,
    title: "Learn & Get Certified",
    desc: "Study at your own pace and earn TaxNG certificates that prove your tax expertise to employers.",
    color: "from-purple-600 to-purple-400",
    bg: "bg-purple-100",
    iconColor: "text-purple-600",
  },
];

const stats = [
  { icon: BookOpen, value: "60+", label: "Tax Courses", color: "text-[var(--primary)]", bg: "bg-[var(--primary)]/10" },
  { icon: Users, value: "25K+", label: "Active Learners", color: "text-[var(--accent)]", bg: "bg-[var(--accent)]/10" },
  { icon: Award, value: "6", label: "Specialisations", color: "text-purple-600", bg: "bg-purple-100" },
  { icon: TrendingUp, value: "98%", label: "Compliance Rate", color: "text-blue-600", bg: "bg-blue-100" },
];

export default function HomePage() {
  const [featuredCourses, setFeaturedCourses] = useState<any[]>([]);

  useEffect(() => {
    const fetchCourses = async () => {
      const { data } = await supabase
        .from("courses")
        .select("*, users(full_name)")
        .eq("status", "published")
        .limit(8);

      if (data) {
        const mapped = data.map((c: any) => {
          let parsedContent: any = {};
          try {
            if (c.content) parsedContent = JSON.parse(c.content);
          } catch (e) {}

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
        setFeaturedCourses(mapped);
      }
    };
    fetchCourses();
  }, []);

  const fetchedCategories = categories;

  return (
    <main>
      {/* Hero */}
      <HeroSlider />

      {/* Stats Bar */}
      <section className="py-8 sm:py-12 bg-white border-b border-[var(--border)]" aria-label="Platform statistics">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
            {stats.map((stat) => (
              <div key={stat.label} className="flex flex-col sm:flex-row items-center sm:items-start text-center sm:text-left gap-3 sm:gap-4 p-3 rounded-2xl hover:bg-gray-50 transition-colors">
                <div className={`w-10 h-10 sm:w-12 sm:h-12 ${stat.bg} rounded-xl flex items-center justify-center flex-shrink-0`}>
                  <stat.icon className={`w-5 h-5 sm:w-6 sm:h-6 ${stat.color}`} />
                </div>
                <div>
                  <p className="text-xl sm:text-2xl font-bold text-gray-800 leading-tight">{stat.value}</p>
                  <p className="text-[10px] sm:text-sm text-gray-500 font-medium uppercase tracking-wider">{stat.label}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Courses */}
      <section className="section-py" aria-labelledby="featured-courses-heading">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
            <div className="text-center md:text-left mx-auto md:mx-0">
              <div className="section-badge mx-auto md:mx-0">
                <Lightbulb className="w-3.5 h-3.5" />
                Featured Courses
              </div>
              <h2 id="featured-courses-heading" className="section-title">
                Learn Tax from Certified Experts
              </h2>
              <p className="section-subtitle mt-3">
                Discover our curated tax courses crafted by Nigeria&apos;s leading tax practitioners
              </p>

              {/* Subscription Tip */}
              <div className="mt-8 inline-flex items-center gap-4 p-4 bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-100 rounded-2xl shadow-sm animate-fade-in text-left max-w-xl">
                <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm flex-shrink-0">
                  <Crown className="w-5 h-5 text-amber-500" />
                </div>
                <div>
                  <p className="text-sm font-bold text-gray-900">LMS Access Tip</p>
                  <p className="text-xs text-gray-600 leading-relaxed">
                    Full access to our premium courses and learning materials is exclusive to <span className="font-bold text-amber-600">Tax Expert</span> subscribers.
                    <a 
                      href="https://www.taxnigeria.com/pricing" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="ml-2 inline-flex items-center gap-1 text-amber-600 font-bold hover:text-amber-700 underline underline-offset-2"
                    >
                      Upgrade or Subscribe Now <ArrowRight className="w-3 h-3" />
                    </a>
                  </p>
                </div>
              </div>
            </div>
            <Link href="/courses" className="btn-outline btn-full-mobile">
              View All Courses
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 tracking-tight">
            {featuredCourses.map((course) => (
              <CourseCard key={course.id} course={course} />
            ))}
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="section-py bg-white" aria-labelledby="categories-heading">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 sm:mb-16">
            <div className="section-badge mx-auto">
              <BookOpen className="w-3.5 h-3.5" />
              All Tax Topics
            </div>
            <h2 id="categories-heading" className="section-title">Browse by Tax Category</h2>
            <p className="section-subtitle mt-3 mx-auto">
              Find the perfect course in your area of tax specialisation
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-3 gap-3 sm:gap-5">
            {fetchedCategories.map((cat) => (
              <Link
                key={cat.id}
                href={`/courses?category=${cat.name}`}
                className="group flex flex-col sm:flex-row items-center sm:items-start gap-3 sm:gap-4 p-4 sm:p-5 rounded-2xl border-2 border-transparent hover:border-[var(--primary)] transition-all hover:shadow-xl hover:-translate-y-1 bg-gray-50/50 sm:bg-white"
                style={{ color: "var(--primary)" }}
                aria-label={`Browse ${cat.name} courses`}
              >
                <span className="text-2xl sm:text-3xl filter grayscale group-hover:grayscale-0 transition-all">{cat.icon}</span>
                <div className="text-center sm:text-left">
                  <p className="font-bold text-sm text-gray-800 leading-tight">{cat.name}</p>
                  <p className="text-[10px] text-gray-400 mt-1 uppercase tracking-wider font-semibold">{cat.count} courses</p>
                </div>
                <ArrowRight className="hidden sm:block w-4 h-4 ml-auto opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="section-py" aria-labelledby="how-it-works-heading">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14 sm:mb-20">
            <div className="section-badge mx-auto">
              <Rocket className="w-3.5 h-3.5" />
              Simple Process
            </div>
            <h2 id="how-it-works-heading" className="section-title">How It Works</h2>
            <p className="section-subtitle mt-3 mx-auto">
              Start your tax learning journey in three simple steps
            </p>
          </div>

          <div className="relative grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-8">
            {/* Connector line */}
            <div className="hidden md:block absolute top-12 left-[15%] right-[15%] h-0.5 bg-gradient-to-r from-[var(--primary)] via-[var(--accent)] to-purple-600 opacity-20" />

            {steps.map((step, i) => (
              <div key={step.title} className="relative text-center group">
                <div className="relative inline-block mb-6 sm:mb-8">
                  <div className={`w-16 h-16 sm:w-20 sm:h-20 ${step.bg} rounded-2xl sm:rounded-3xl flex items-center justify-center mx-auto group-hover:scale-110 group-hover:rotate-3 transition-all duration-500 shadow-sm`}>
                    <step.icon className={`w-7 h-7 sm:w-9 sm:h-9 ${step.iconColor}`} />
                  </div>
                  <div className={`absolute -top-2 -right-2 w-7 h-7 bg-gradient-to-br ${step.color} rounded-xl flex items-center justify-center shadow-lg border-2 border-white`}>
                    <span className="text-white text-xs font-bold">{i + 1}</span>
                  </div>
                </div>
                <h3 className="text-lg sm:text-xl font-bold text-gray-800 mb-3">{step.title}</h3>
                <p className="text-sm sm:text-base text-gray-500 leading-relaxed max-w-xs mx-auto">{step.desc}</p>
              </div>
            ))}
          </div>

          <div className="text-center mt-12 sm:mt-16">
            <Link href="/login" className="btn-primary text-base px-10 py-4 btn-full-mobile">
              <GraduationCap className="w-5 h-5" />
              Start Learning for Free
            </Link>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="section-py bg-white" aria-labelledby="testimonials-heading">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            <div className="text-center lg:text-left">
              <div className="section-badge mx-auto lg:mx-0">
                <Award className="w-3.5 h-3.5" />
                Success Stories
              </div>
              <h2 id="testimonials-heading" className="section-title">
                What Our Learners Say
              </h2>
              <p className="section-subtitle mt-4 mb-10 mx-auto lg:mx-0">
                Join thousands of Nigerians who have mastered taxation and transformed their careers with TaxNG Academy.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-left max-w-lg mx-auto lg:mx-0">
                {[
                  "Expert-led video lessons",
                  "Lifetime course access",
                  "TaxNG certificates",
                  "Nigeria-specific content",
                ].map((feat) => (
                  <div key={feat} className="flex items-center gap-3 p-3 rounded-xl bg-gray-50 border border-gray-100">
                    <div className="w-6 h-6 rounded-full bg-[var(--primary)]/10 flex items-center justify-center flex-shrink-0">
                      <Check className="w-3.5 h-3.5 text-[var(--primary)]" />
                    </div>
                    <span className="text-xs sm:text-sm font-medium text-gray-700">{feat}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-8 lg:mt-0 max-w-lg mx-auto lg:max-w-none lg:w-full">
              <TestimonialCard />
            </div>
          </div>
        </div>
      </section>

      {/* Why TaxNG */}
      <section className="section-py" aria-labelledby="why-taxng-heading">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <div className="section-badge mx-auto">
              <Shield className="w-3.5 h-3.5" />
              Why TaxNG Academy
            </div>
            <h2 id="why-taxng-heading" className="section-title">Nigeria&apos;s Premier Tax Education Platform</h2>
            <p className="section-subtitle mt-3 mx-auto">
              Built exclusively for Nigerian tax learners — every lesson, example, and case study is rooted in Nigerian law.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { icon: "🇳🇬", title: "100% Nigeria-Focused", desc: "Every course is built around Nigerian tax laws, FIRS regulations, Finance Acts, and real Nigerian case studies." },
              { icon: "🎓", title: "Certified Tax Educators", desc: "Learn from ICAN-certified accountants, CITN members, seasoned barristers, and FIRS-trained tax consultants." },
              { icon: "📱", title: "Learn Anywhere, Anytime", desc: "Mobile-friendly platform so you can study during your commute, lunch break, or from the comfort of your home." },
              { icon: "🔄", title: "Always Up-to-Date", desc: "Courses are updated after every Finance Act to reflect the latest tax rates, rules, and compliance requirements." },
              { icon: "✅", title: "Practical & Compliance-Ready", desc: "Real-world exercises, sample tax computations, and filing walkthroughs you can apply immediately." },
              { icon: "🏆", title: "Recognised Certificates", desc: "TaxNG certificates are trusted by accounting firms, corporate employers, and government agencies across Nigeria." },
            ].map((item) => (
              <div key={item.title} className="card p-6 hover:-translate-y-1 transition-transform duration-300">
                <div className="text-4xl mb-4">{item.icon}</div>
                <h3 className="text-lg font-bold text-gray-800 mb-2">{item.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <section className="section-py" aria-labelledby="cta-heading">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-[var(--primary)] via-[#1d7a45] to-[var(--primary-light)] p-8 sm:p-12 md:p-20 text-white text-center">
            {/* Decorations */}
            <div className="absolute top-0 right-0 w-64 h-64 sm:w-96 sm:h-96 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-48 h-48 sm:w-80 sm:h-80 bg-[var(--accent)]/10 rounded-full translate-y-1/2 -translate-x-1/2 blur-3xl pointer-events-none" />

            <div className="relative z-10">
              <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/20 rounded-full px-4 py-2 text-xs sm:text-sm font-medium mb-6 sm:mb-8">
                <Rocket className="w-4 h-4 text-[var(--accent)]" />
                Start with free courses today — no credit card needed
              </div>
              <h2 id="cta-heading" className="text-3xl sm:text-4xl md:text-5xl font-extrabold mb-6 leading-tight">
                Ready to Master <br className="hidden sm:block" /> Nigerian Taxation?
              </h2>
              <p className="text-green-50 text-base sm:text-lg mb-10 max-w-xl mx-auto leading-relaxed opacity-90">
                Join over 25,000 Nigerians already learning with TaxNG Academy. Get unlimited access to expert tax courses, certificates, and study resources.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/login" className="btn-accent text-base px-10 py-4 shadow-xl">
                  <GraduationCap className="w-5 h-5" />
                  Get Started Free
                </Link>
                <Link href="/courses" className="btn-outline-white text-base px-10 py-4 backdrop-blur-sm">
                  Browse All Courses
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
