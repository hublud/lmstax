"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import AdminHeader from "@/components/admin/AdminHeader";
import {
  HelpCircle, Plus, Trash2, Pencil, Clock, BarChart3, Copy,
  CheckSquare, Search, AlertCircle,
} from "lucide-react";

interface QuizOption { id: string; text: string; }
interface QuizQuestion {
  id: string; question: string;
  type: "multiple_choice" | "true_false" | "short_answer";
  options: QuizOption[]; correctAnswer: string; points: number; explanation: string;
}
export interface LibraryQuiz {
  id: string; title: string; timeLimit: number; passScore: number;
  questions: QuizQuestion[]; createdAt: string; updatedAt: string;
}

const STORAGE_KEY = "taxng_quiz_library";

export function getQuizLibrary(): LibraryQuiz[] {
  if (typeof window === "undefined") return [];
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]"); }
  catch { return []; }
}
export function saveQuizLibrary(quizzes: LibraryQuiz[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(quizzes));
}

export default function QuizLibraryPage() {
  const [quizzes, setQuizzes] = useState<LibraryQuiz[]>([]);
  const [search, setSearch] = useState("");
  const [mounted, setMounted] = useState(false);

  useEffect(() => { setMounted(true); setQuizzes(getQuizLibrary()); }, []);

  const filtered = quizzes.filter(q =>
    q.title.toLowerCase().includes(search.toLowerCase())
  );

  const handleDelete = (id: string) => {
    if (!confirm("Delete this quiz from the library?")) return;
    const updated = quizzes.filter(q => q.id !== id);
    setQuizzes(updated);
    saveQuizLibrary(updated);
  };

  const handleDuplicate = (quiz: LibraryQuiz) => {
    const copy: LibraryQuiz = {
      ...quiz,
      id: `quiz_${Date.now()}`,
      title: `${quiz.title} (Copy)`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    const updated = [...quizzes, copy];
    setQuizzes(updated);
    saveQuizLibrary(updated);
  };

  const totalPoints = (quiz: LibraryQuiz) =>
    quiz.questions.reduce((acc, q) => acc + q.points, 0);

  if (!mounted) return (
    <div className="min-h-screen">
      <AdminHeader title="Quiz Library" subtitle="Loading..." />
      <div className="p-12 flex justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-[var(--primary)] border-t-transparent rounded-full" />
      </div>
    </div>
  );

  return (
    <div className="min-h-screen">
      <AdminHeader
        title="Quiz Library"
        subtitle="Create reusable quizzes that can be embedded into any module lesson"
      />

      <main className="p-4 sm:p-6 max-w-5xl mx-auto">
        {/* Toolbar */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-6">
          <div className="relative w-full sm:w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search quizzes..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 text-sm border border-[var(--border)] rounded-xl outline-none focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary)]/10 transition-all bg-white"
            />
          </div>
          <Link href="/admin/quizzes/create" className="btn-primary text-sm py-2.5 px-5 flex-shrink-0">
            <Plus className="w-4 h-4" /> New Quiz
          </Link>
        </div>

        {/* Stats bar */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          {[
            { label: "Total Quizzes", value: quizzes.length, icon: HelpCircle, color: "text-[var(--primary)]", bg: "bg-[var(--primary)]/10" },
            { label: "Total Questions", value: quizzes.reduce((a, q) => a + q.questions.length, 0), icon: CheckSquare, color: "text-amber-600", bg: "bg-amber-100" },
            { label: "Avg. Questions", value: quizzes.length ? Math.round(quizzes.reduce((a, q) => a + q.questions.length, 0) / quizzes.length) : 0, icon: BarChart3, color: "text-blue-600", bg: "bg-blue-100" },
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

        {/* Quiz grid */}
        {filtered.length > 0 ? (
          <div className="grid sm:grid-cols-2 gap-4">
            {filtered.map(quiz => (
              <div key={quiz.id} className="bg-white rounded-2xl border border-[var(--border)] p-5 hover:shadow-md transition-all group">
                {/* Header */}
                <div className="flex items-start gap-3 mb-4">
                  <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center flex-shrink-0">
                    <HelpCircle className="w-5 h-5 text-amber-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-gray-800 text-sm truncate">{quiz.title}</h3>
                    <p className="text-xs text-gray-400 mt-0.5">
                      Updated {new Date(quiz.updatedAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>

                {/* Meta */}
                <div className="flex flex-wrap gap-2 mb-4">
                  <span className="inline-flex items-center gap-1 text-xs bg-gray-100 text-gray-600 px-2.5 py-1 rounded-full font-medium">
                    <CheckSquare className="w-3 h-3" />
                    {quiz.questions.length} questions
                  </span>
                  <span className="inline-flex items-center gap-1 text-xs bg-gray-100 text-gray-600 px-2.5 py-1 rounded-full font-medium">
                    <BarChart3 className="w-3 h-3" />
                    {totalPoints(quiz)} pts
                  </span>
                  <span className="inline-flex items-center gap-1 text-xs bg-gray-100 text-gray-600 px-2.5 py-1 rounded-full font-medium">
                    <Clock className="w-3 h-3" />
                    {quiz.timeLimit > 0 ? `${quiz.timeLimit} min` : "No limit"}
                  </span>
                  <span className="inline-flex items-center gap-1 text-xs bg-green-100 text-green-700 px-2.5 py-1 rounded-full font-medium">
                    Pass: {quiz.passScore}%
                  </span>
                </div>

                {/* Question type breakdown */}
                {quiz.questions.length > 0 && (
                  <div className="flex gap-1.5 mb-4 flex-wrap">
                    {["multiple_choice", "true_false", "short_answer"].map(type => {
                      const count = quiz.questions.filter(q => q.type === type).length;
                      if (!count) return null;
                      const labels: Record<string, string> = { multiple_choice: "MC", true_false: "T/F", short_answer: "SA" };
                      const colors: Record<string, string> = { multiple_choice: "bg-blue-100 text-blue-700", true_false: "bg-purple-100 text-purple-700", short_answer: "bg-orange-100 text-orange-700" };
                      return (
                        <span key={type} className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${colors[type]}`}>
                          {count} {labels[type]}
                        </span>
                      );
                    })}
                  </div>
                )}

                {/* Actions */}
                <div className="flex items-center gap-2 pt-3 border-t border-[var(--border)]">
                  <Link
                    href={`/admin/quizzes/create?id=${quiz.id}`}
                    className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs font-semibold text-[var(--primary)] bg-[var(--primary)]/5 hover:bg-[var(--primary)]/10 transition-all"
                  >
                    <Pencil className="w-3.5 h-3.5" /> Edit
                  </Link>
                  <button
                    onClick={() => handleDuplicate(quiz)}
                    className="flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl text-xs font-semibold text-gray-500 bg-gray-100 hover:bg-gray-200 transition-all"
                  >
                    <Copy className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => handleDelete(quiz.id)}
                    className="flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl text-xs font-semibold text-red-400 bg-red-50 hover:bg-red-100 transition-all"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-white rounded-3xl border-2 border-dashed border-gray-200">
            <HelpCircle className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 font-semibold mb-1">
              {search ? "No quizzes match your search" : "No quizzes in library yet"}
            </p>
            <p className="text-sm text-gray-400 mb-6">
              {search ? "Try a different search term" : "Create reusable quizzes that can be added to any module"}
            </p>
            {!search && (
              <Link href="/admin/quizzes/create" className="btn-primary text-sm">
                <Plus className="w-4 h-4" /> Create First Quiz
              </Link>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
