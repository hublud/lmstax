"use client";

import Link from "next/link";
import Image from "next/image";
import { Mail, Phone, MapPin, ArrowRight } from "lucide-react";
import LogoSVG from "./LogoSVG";


const footerLinks = {
  Company: [
    { label: "About Us", href: "/about" },
    { label: "Blog", href: "#" },
  ],
  Courses: [
    { label: "Foundations of Taxation", href: "/courses" },
    { label: "Personal Income Tax", href: "/courses" },
    { label: "Corporate Taxation", href: "/courses" },
    { label: "Indirect Taxes", href: "/courses" },
    { label: "State & Local Taxes", href: "/courses" },
    { label: "Tax Administration", href: "/courses" },
  ],
};



export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white">
      {/* Main Footer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          {/* Brand */}
          <div className="lg:col-span-2">
            <Link
              href="/"
              className="mb-5 block w-fit rounded-xl"
              aria-label="TaxNG Academy"
            >
              <LogoSVG className="h-12 w-auto" />
            </Link>

            <p className="text-gray-400 text-sm leading-relaxed mb-6 max-w-xs">
              TaxNG Academy is the educational arm of <span className="text-white font-semibold">Tax Nigeria</span> — bridging the tax knowledge gap by delivering clear, practical, and accessible tax education to all Nigerians.
            </p>
            <div className="space-y-3 text-sm">
              <a
                href="mailto:academy@taxnigeria.com"
                className="flex items-center gap-3 text-gray-400 hover:text-[var(--accent)] transition-colors"
              >
                <div className="w-8 h-8 bg-white/5 rounded-lg flex items-center justify-center">
                  <Mail className="w-4 h-4" />
                </div>
                academy@taxnigeria.com
              </a>

            </div>
          </div>

          {/* Links */}
          {Object.entries(footerLinks).map(([title, links]) => (
            <div key={title}>
              <h3 className="text-sm font-600 text-white uppercase tracking-wider mb-5 font-semibold">
                {title}
              </h3>
              <ul className="space-y-3">
                {links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-sm text-gray-400 hover:text-[var(--accent)] transition-colors flex items-center gap-1 group"
                    >
                      <ArrowRight className="w-3 h-3 opacity-0 -ml-4 group-hover:opacity-100 group-hover:ml-0 transition-all" />
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Social + Bottom */}
        <div className="flex flex-col md:flex-row items-center justify-between pt-10 mt-10 border-t border-white/10 gap-4">
          <p className="text-sm text-gray-500">
            © 2026 TaxNG Academy — Tax Nigeria. All rights reserved.
          </p>

        </div>
      </div>
    </footer>
  );
}
