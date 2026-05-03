"use client";

import React from "react";
import Link from "next/link";
import { Crown, X, ArrowRight, BookOpen, ShieldCheck, Sparkles } from "lucide-react";

interface SubscriptionModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SubscriptionModal({ isOpen, onClose }: SubscriptionModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity animate-in fade-in duration-300" 
        onClick={onClose}
      />
      
      {/* Modal Content */}
      <div className="relative w-full max-w-lg bg-white rounded-[2.5rem] shadow-2xl overflow-hidden animate-in zoom-in-95 slide-in-from-bottom-10 duration-500">
        {/* Header Decoration */}
        <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-br from-amber-400 via-orange-500 to-amber-600" />
        <div className="absolute top-0 right-0 p-6">
          <button 
            onClick={onClose}
            className="p-2 bg-white/20 hover:bg-white/30 rounded-full text-white backdrop-blur-md transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="relative pt-16 px-8 pb-10 text-center">
          {/* Icon */}
          <div className="inline-flex items-center justify-center w-20 h-20 bg-white rounded-3xl shadow-xl mb-6 relative group">
            <div className="absolute inset-0 bg-amber-100 rounded-3xl scale-90 blur-xl opacity-50 group-hover:opacity-80 transition-opacity" />
            <Crown className="w-10 h-10 text-amber-500 relative z-10" />
          </div>

          <h2 className="text-3xl font-extrabold text-gray-900 mb-3 tracking-tight">
            Welcome to the Academy!
          </h2>
          
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-amber-50 rounded-full border border-amber-100 mb-6">
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            <span className="text-xs font-bold text-amber-700 uppercase tracking-wider">LMS Preview Access</span>
          </div>

          <p className="text-gray-600 leading-relaxed mb-8 max-w-sm mx-auto">
            You have successfully joined the Academy! You can browse the platform, but full course content is exclusive to <span className="font-bold text-gray-900">Tax Expert</span> subscribers.
          </p>

          {/* Benefits List */}
          <div className="space-y-3 mb-8 text-left max-w-xs mx-auto">
            <div className="flex items-center gap-3">
              <div className="w-6 h-6 rounded-full bg-green-50 flex items-center justify-center">
                <ShieldCheck className="w-3.5 h-3.5 text-green-600" />
              </div>
              <span className="text-sm text-gray-600">Access to all 60+ Courses</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-6 h-6 rounded-full bg-green-50 flex items-center justify-center">
                <ShieldCheck className="w-3.5 h-3.5 text-green-600" />
              </div>
              <span className="text-sm text-gray-600">Downloadable Resources</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-6 h-6 rounded-full bg-green-50 flex items-center justify-center">
                <ShieldCheck className="w-3.5 h-3.5 text-green-600" />
              </div>
              <span className="text-sm text-gray-600">Official TaxNG Certificates</span>
            </div>
          </div>

          <div className="flex flex-col gap-3">
            <Link 
              href="https://www.taxnigeria.com/pricing"
              target="_blank"
              className="btn-primary w-full py-4 rounded-2xl shadow-lg shadow-[var(--primary)]/20 justify-center group"
            >
              Upgrade to Tax Expert
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            
            <button 
              onClick={() => {
                onClose();
                window.location.href = "/";
              }}
              className="w-full py-4 text-sm font-bold text-gray-500 hover:text-gray-700 transition-colors"
            >
              Back to Academy Home
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
