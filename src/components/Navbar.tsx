"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Menu,
  X,
  Search,
  BookOpen,
  GraduationCap,
} from "lucide-react";
import { usePathname } from "next/navigation";
import LogoSVG from "./LogoSVG";


const navLinks = [
  { href: "/", label: "Home", external: false },
  { href: "/courses", label: "Courses", external: false },
  { href: "/about", label: "About", external: false },
];

const TAX_AI_HREF = "http://taxnigeria.com/";

export default function Navbar() {
  const pathname = usePathname();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const isHome = pathname === "/";
  const needsDarkText = !isHome || isScrolled || isMobileOpen;

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Do not render the global Navbar in the admin panel, student dashboard, or course player
  if (
    pathname?.includes("/admin") ||
    pathname?.includes("/dashboard") ||
    pathname?.includes("/courses/")
  ) {
    return null;
  }

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? "glass shadow-lg shadow-black/5"
          : isMobileOpen
          ? "bg-white border-b border-[var(--border)]"
          : !isHome
          ? "bg-white/80 backdrop-blur-md border-b border-[var(--border)]"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-18 py-4">
          {/* Logo */}
          <Link href="/" className="flex items-center group" aria-label="TaxNG Academy Home">
            <LogoSVG className="h-10 w-auto" />
          </Link>


          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`text-sm font-500 transition-colors relative group ${
                  needsDarkText ? "text-gray-700" : "text-white/90 hover:text-white"
                } hover:text-[var(--primary)]`}
              >
                {link.label}
                <span
                  className={`absolute -bottom-1 left-0 w-0 h-0.5 bg-[var(--primary)] rounded-full group-hover:w-full transition-all duration-300 ${
                    !needsDarkText ? "bg-white" : ""
                  }`}
                />
              </Link>
            ))}
            {/* TAX_NG AI — external link */}
            <a
              href={TAX_AI_HREF}
              target="_blank"
              rel="noopener noreferrer"
              className={`text-sm font-semibold transition-all relative group flex items-center gap-1.5 ${
                needsDarkText ? "text-[var(--primary)]" : "text-[#fbbf24]"
              } hover:opacity-80`}
            >
              <span className="inline-flex items-center gap-1">
                <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z"/></svg>
                TAX_NG AI
              </span>
              <svg className="w-3 h-3 opacity-60" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25"/></svg>
              <span className={`absolute -bottom-1 left-0 w-0 h-0.5 rounded-full group-hover:w-full transition-all duration-300 ${
                needsDarkText ? "bg-[var(--primary)]" : "bg-[#fbbf24]"
              }`}/>
            </a>
          </div>

          {/* Right side */}
          <div className="hidden md:flex items-center gap-3">
            <button
              aria-label="Search"
              className={`p-2 rounded-xl transition-all ${
                needsDarkText
                  ? "text-gray-600 hover:text-[var(--primary)] hover:bg-[var(--primary)]/10"
                  : "text-white/80 hover:text-white hover:bg-white/10"
              }`}
            >
              <Search className="w-5 h-5" />
            </button>

            <Link
              href="/login"
              className={`py-2.5 px-5 text-sm font-semibold transition-all ${
                needsDarkText ? "btn-outline" : "text-white hover:text-white/80"
              }`}
            >
              Login
            </Link>
            <Link href="https://www.taxnigeria.com/pricing" className="btn-primary py-2.5 px-5 text-sm">
              <GraduationCap className="w-4 h-4" />
              Get Started
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileOpen(!isMobileOpen)}
            className={`md:hidden p-2 rounded-xl transition-all ${
              needsDarkText ? "text-gray-700" : "text-white"
            } hover:text-[var(--primary)]`}
            aria-label="Toggle menu"
          >
            {isMobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileOpen && (
        <div className="md:hidden bg-white border-t border-[var(--border)] shadow-xl animate-fade-in">
          <div className="px-4 py-6 space-y-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setIsMobileOpen(false)}
                className="flex items-center px-4 py-3 text-gray-700 hover:text-[var(--primary)] hover:bg-[var(--primary)]/10 rounded-xl transition-all font-medium"
              >
                {link.label}
              </Link>
            ))}
            {/* TAX_NG AI — mobile */}
            <a
              href={TAX_AI_HREF}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => setIsMobileOpen(false)}
              className="flex items-center gap-2 px-4 py-3 text-[var(--primary)] hover:bg-[var(--primary)]/10 rounded-xl transition-all font-semibold"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z"/></svg>
              TAX_NG AI
              <svg className="w-3.5 h-3.5 ml-auto opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25"/></svg>
            </a>
            <div className="pt-4 space-y-3 border-t border-[var(--border)]">
              <Link
                href="/login"
                onClick={() => setIsMobileOpen(false)}
                className="btn-outline w-full justify-center"
              >
                Login
              </Link>
              <Link
                href="https://www.taxnigeria.com/pricing"
                onClick={() => setIsMobileOpen(false)}
                className="btn-primary w-full justify-center"
              >
                <GraduationCap className="w-4 h-4" />
                Get Started
              </Link>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
