"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { GraduationCap, Users, BookOpen, Award, Target, Heart, Zap, Globe, ArrowRight, Shield } from "lucide-react";
import { supabase } from "@/lib/supabase";

const values = [
  { icon: Target, title: "Mission-Driven", desc: "Every decision is guided by our mission to make Nigerian tax knowledge accessible, practical, and affordable for every citizen.", color: "text-[var(--primary)]", bg: "bg-[var(--primary)]/10" },
  { icon: Heart, title: "Learner First", desc: "We design every lesson, quiz, and resource with the learner in mind — clear language, real examples, and Nigeria-specific context.", color: "text-rose-500", bg: "bg-rose-100" },
  { icon: Zap, title: "Always Current", desc: "Our courses are updated after every Finance Act and FIRS circular to reflect the latest tax rates, rules, and compliance requirements.", color: "text-[var(--accent)]", bg: "bg-[var(--accent)]/10" },
  { icon: Globe, title: "Nationwide Impact", desc: "Building tax literacy across all 36 states of Nigeria — from Lagos to Kano, Port Harcourt to Abuja.", color: "text-blue-600", bg: "bg-blue-100" },
];

export default function AboutPage() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then((res: any) => {
      setIsLoggedIn(!!res.data.session);
    });
  }, []);

  return (
    <div className="min-h-screen" style={{ backgroundColor: "var(--bg)" }}>
      {/* Hero */}
      <div className="bg-gradient-to-br from-[var(--primary)] to-[var(--primary-light)] text-white pt-32 pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 rounded-full px-4 py-2 text-sm mb-6">
            <GraduationCap className="w-4 h-4 text-[var(--accent)]" />
            Our Story
          </div>
          <h1 className="text-4xl md:text-6xl font-extrabold mb-5 leading-tight">
            Bridging Nigeria&apos;s
            <span className="block text-[var(--accent)]">Tax Knowledge Gap</span>
          </h1>
          <p className="text-green-100 text-xl max-w-2xl mx-auto">
            TaxNG Academy is the educational arm of Tax Nigeria — built to empower individuals, businesses, and professionals with clear, practical, and accessible tax knowledge rooted in Nigerian law.
          </p>
        </div>
      </div>

      {/* Stats */}
      <div className="py-12 bg-white border-b border-[var(--border)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {[
              { icon: Users, value: "25K+", label: "Active Learners", color: "text-[var(--primary)]" },
              { icon: BookOpen, value: "60+", label: "Tax Courses", color: "text-[var(--accent)]" },
              { icon: Award, value: "30+", label: "Expert Educators", color: "text-purple-600" },
              { icon: Globe, value: "36", label: "States Covered", color: "text-blue-600" },
            ].map((stat) => (
              <div key={stat.label}>
                <stat.icon className={`w-6 h-6 ${stat.color} mx-auto mb-2`} />
                <p className="text-3xl font-extrabold text-gray-800">{stat.value}</p>
                <p className="text-sm text-gray-500">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Mission */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div>
            <div className="section-badge">
              <Target className="w-3.5 h-3.5" />
              Our Mission
            </div>
            <h2 className="section-title mb-4">Making Nigerian Tax Knowledge Accessible to All</h2>
            <p className="text-gray-600 leading-relaxed mb-5">
              Most Nigerians pay taxes without understanding what they pay, why they pay it, or how to comply correctly. TaxNG Academy was created to change that — by making accurate, up-to-date, and affordable tax education available to every Nigerian.
            </p>
            <p className="text-gray-600 leading-relaxed mb-8">
              From employed individuals navigating PAYE, to entrepreneurs managing VAT, to finance professionals handling CITA returns — we have a course for every tax challenge you face in Nigeria.
            </p>
            <Link href="/courses" className="btn-primary">
              Explore Our Courses
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="relative h-80 bg-gradient-to-br from-[var(--primary)]/10 to-[var(--accent)]/10 rounded-3xl overflow-hidden">
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center px-8">
                <Shield className="w-20 h-20 text-[var(--primary)]/30 mx-auto mb-4" />
                <p className="text-[var(--primary)] font-bold text-xl">Nigeria-Specific Tax Education</p>
                <p className="text-gray-500 text-sm mt-2">Every lesson rooted in Nigerian law</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-20 bg-white" aria-labelledby="values-heading">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <div className="section-badge mx-auto w-fit">
              <Heart className="w-3.5 h-3.5" />
              What We Believe
            </div>
            <h2 id="values-heading" className="section-title">Our Core Values</h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((v) => (
              <div key={v.title} className="card p-6 text-center group">
                <div className={`w-14 h-14 ${v.bg} rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform`}>
                  <v.icon className={`w-7 h-7 ${v.color}`} />
                </div>
                <h3 className="font-bold text-gray-800 mb-2">{v.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-r from-[var(--primary)] to-[var(--primary-light)] rounded-3xl p-10 text-white text-center">
            <h2 className="text-3xl font-extrabold mb-3">Ready to Master Nigerian Taxation?</h2>
            <p className="text-green-100 mb-6">Start learning today and join thousands of Nigerians bridging the tax knowledge gap with TaxNG Academy.</p>
            <Link href={isLoggedIn ? "/dashboard" : "/login"} className="btn-accent text-base px-8 py-3.5">
              {isLoggedIn ? "Go to Dashboard" : "Get Started Free"}
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
