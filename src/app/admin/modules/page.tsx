"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import AdminHeader from "@/components/admin/AdminHeader";
import {
  Layers, Plus, Trash2, Pencil, Copy, Video, FileText,
  HelpCircle, Search, BookOpen,
} from "lucide-react";

export interface LibraryLesson {
  id: string; title: string; type: "video" | "reading" | "quiz";
  duration: string; isFree: boolean;
  content: {
    videoUrl?: string; videoNotes?: string; readingContent?: string;
    quizTitle?: string; quizTimeLimit?: number; quizPassScore?: number; quizQuestions?: any[];
  };
}

export interface LibraryModule {
  id: string; title: string; description: string;
  lessons: LibraryLesson[];
  createdAt: string; updatedAt: string;
}

const STORAGE_KEY = "taxng_module_library";

export function getModuleLibrary(): LibraryModule[] {
  if (typeof window === "undefined") return [];
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]"); }
  catch { return []; }
}
export function saveModuleLibrary(modules: LibraryModule[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(modules));
}

const lessonTypeIcon = { video: Video, reading: FileText, quiz: HelpCircle };
const lessonTypeColor = { video: "text-blue-600 bg-blue-100", reading: "text-purple-600 bg-purple-100", quiz: "text-amber-600 bg-amber-100" };

export default function ModuleLibraryPage() {
  const [modules, setModules] = useState<LibraryModule[]>([]);
  const [search, setSearch] = useState("");
  const [mounted, setMounted] = useState(false);

  useEffect(() => { setMounted(true); setModules(getModuleLibrary()); }, []);

  const filtered = modules.filter(m =>
    m.title.toLowerCase().includes(search.toLowerCase()) ||
    m.description?.toLowerCase().includes(search.toLowerCase())
  );

  const handleDelete = (id: string) => {
    if (!confirm("Delete this module from the library?")) return;
    const updated = modules.filter(m => m.id !== id);
    setModules(updated);
    saveModuleLibrary(updated);
  };

  const handleDuplicate = (mod: LibraryModule) => {
    const copy: LibraryModule = {
      ...mod,
      id: `mod_${Date.now()}`,
      title: `${mod.title} (Copy)`,
      lessons: mod.lessons.map(l => ({ ...l, id: `l_${Date.now()}_${Math.random()}` })),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    const updated = [...modules, copy];
    setModules(updated);
    saveModuleLibrary(updated);
  };

  if (!mounted) return (
    <div className="min-h-screen">
      <AdminHeader title="Module Library" subtitle="Loading..." />
      <div className="p-12 flex justify-center"><div className="animate-spin w-8 h-8 border-4 border-[var(--primary)] border-t-transparent rounded-full" /></div>
    </div>
  );

  const totalLessons = modules.reduce((acc, m) => acc + m.lessons.length, 0);

  return (
    <div className="min-h-screen">
      <AdminHeader title="Module Library" subtitle="Build standalone modules and reuse them across multiple courses" />

      <main className="p-4 sm:p-6 max-w-5xl mx-auto">
        {/* Toolbar */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-6">
          <div className="relative w-full sm:w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text" placeholder="Search modules..." value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 text-sm border border-[var(--border)] rounded-xl outline-none focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary)]/10 bg-white"
            />
          </div>
          <Link href="/admin/modules/create" className="btn-primary text-sm py-2.5 px-5 flex-shrink-0">
            <Plus className="w-4 h-4" /> New Module
          </Link>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          {[
            { label: "Total Modules", value: modules.length, icon: Layers, color: "text-[var(--primary)]", bg: "bg-[var(--primary)]/10" },
            { label: "Total Lessons", value: totalLessons, icon: BookOpen, color: "text-purple-600", bg: "bg-purple-100" },
            { label: "Avg. Lessons", value: modules.length ? Math.round(totalLessons / modules.length) : 0, icon: FileText, color: "text-blue-600", bg: "bg-blue-100" },
          ].map(stat => (
            <div key={stat.label} className="bg-white rounded-2xl border border-[var(--border)] p-4 flex items-center gap-3">
              <div className={`w-10 h-10 rounded-xl ${stat.bg} flex items-center justify-center flex-shrink-0`}>
                <stat.icon className={`w-5 h-5 ${stat.color}`} />
              </div>
              <div>
                <p className="text-xl font-bold text-gray-800">{stat.value}</p>
                <p className="text-xs text-gray-500">{stat.label}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Module grid */}
        {filtered.length > 0 ? (
          <div className="grid sm:grid-cols-2 gap-4">
            {filtered.map(mod => {
              const videoCount = mod.lessons.filter(l => l.type === "video").length;
              const readingCount = mod.lessons.filter(l => l.type === "reading").length;
              const quizCount = mod.lessons.filter(l => l.type === "quiz").length;
              return (
                <div key={mod.id} className="bg-white rounded-2xl border border-[var(--border)] p-5 hover:shadow-md transition-all group">
                  <div className="flex items-start gap-3 mb-3">
                    <div className="w-10 h-10 rounded-xl bg-[var(--primary)]/10 flex items-center justify-center flex-shrink-0">
                      <Layers className="w-5 h-5 text-[var(--primary)]" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-gray-800 text-sm">{mod.title}</h3>
                      {mod.description && <p className="text-xs text-gray-400 mt-0.5 line-clamp-1">{mod.description}</p>}
                      <p className="text-xs text-gray-400 mt-0.5">Updated {new Date(mod.updatedAt).toLocaleDateString()}</p>
                    </div>
                  </div>

                  {/* Lesson type pills */}
                  <div className="flex flex-wrap gap-2 mb-3">
                    <span className="text-xs bg-gray-100 text-gray-600 px-2.5 py-1 rounded-full font-medium">{mod.lessons.length} lessons</span>
                    {videoCount > 0 && <span className="text-xs bg-blue-100 text-blue-700 px-2.5 py-1 rounded-full font-medium">{videoCount} video</span>}
                    {readingCount > 0 && <span className="text-xs bg-purple-100 text-purple-700 px-2.5 py-1 rounded-full font-medium">{readingCount} reading</span>}
                    {quizCount > 0 && <span className="text-xs bg-amber-100 text-amber-700 px-2.5 py-1 rounded-full font-medium">{quizCount} quiz</span>}
                  </div>

                  {/* Lesson list preview */}
                  {mod.lessons.length > 0 && (
                    <div className="space-y-1 mb-4">
                      {mod.lessons.slice(0, 3).map(lesson => {
                        const Icon = lessonTypeIcon[lesson.type];
                        return (
                          <div key={lesson.id} className="flex items-center gap-2 text-xs text-gray-500">
                            <Icon className={`w-3.5 h-3.5 flex-shrink-0 ${lessonTypeColor[lesson.type].split(" ")[0]}`} />
                            <span className="truncate">{lesson.title}</span>
                            <span className="text-gray-300 ml-auto flex-shrink-0">{lesson.duration}</span>
                          </div>
                        );
                      })}
                      {mod.lessons.length > 3 && (
                        <p className="text-xs text-gray-400 pl-5">+{mod.lessons.length - 3} more lessons</p>
                      )}
                    </div>
                  )}

                  {/* Actions */}
                  <div className="flex items-center gap-2 pt-3 border-t border-[var(--border)]">
                    <Link href={`/admin/modules/create?id=${mod.id}`} className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs font-semibold text-[var(--primary)] bg-[var(--primary)]/5 hover:bg-[var(--primary)]/10 transition-all">
                      <Pencil className="w-3.5 h-3.5" /> Edit
                    </Link>
                    <button onClick={() => handleDuplicate(mod)} className="flex items-center justify-center py-2 px-3 rounded-xl text-xs font-semibold text-gray-500 bg-gray-100 hover:bg-gray-200 transition-all">
                      <Copy className="w-3.5 h-3.5" />
                    </button>
                    <button onClick={() => handleDelete(mod.id)} className="flex items-center justify-center py-2 px-3 rounded-xl text-xs font-semibold text-red-400 bg-red-50 hover:bg-red-100 transition-all">
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-20 bg-white rounded-3xl border-2 border-dashed border-gray-200">
            <Layers className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 font-semibold mb-1">
              {search ? "No modules match your search" : "No modules in library yet"}
            </p>
            <p className="text-sm text-gray-400 mb-6">
              {search ? "Try a different search term" : "Build reusable modules that can be combined into any course"}
            </p>
            {!search && (
              <Link href="/admin/modules/create" className="btn-primary text-sm">
                <Plus className="w-4 h-4" /> Create First Module
              </Link>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
