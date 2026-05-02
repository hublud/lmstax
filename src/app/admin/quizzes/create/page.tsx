"use client";

import { Suspense } from "react";
import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import AdminHeader from "@/components/admin/AdminHeader";
import {
  ArrowLeft, Save, Plus, Trash2, Check, X, ChevronUp, ChevronDown,
  CheckSquare, AlertCircle, AlignLeft, HelpCircle, Clock, BarChart3,
  Pencil,
} from "lucide-react";
import { getQuizLibrary, saveQuizLibrary, type LibraryQuiz } from "../page";

// ─── Types ──────────────────────────────────────────────────────────────────
interface QuizOption { id: string; text: string; }
interface QuizQuestion {
  id: string; question: string;
  type: "multiple_choice" | "true_false" | "short_answer";
  options: QuizOption[]; correctAnswer: string; points: number; explanation: string;
}

// ─── Quiz Question Editor ────────────────────────────────────────────────────
function QuizQuestionEditor({ question, index, onChange, onDelete }: {
  question: QuizQuestion; index: number;
  onChange: (q: QuizQuestion) => void; onDelete: () => void;
}) {
  const [isOpen, setIsOpen] = useState(true);

  const updateOption = (optId: string, text: string) =>
    onChange({ ...question, options: question.options.map(o => o.id === optId ? { ...o, text } : o) });

  const addOption = () => {
    const letters = ["a","b","c","d","e","f"];
    const nextId = letters[question.options.length] || `opt${Date.now()}`;
    onChange({ ...question, options: [...question.options, { id: nextId, text: "" }] });
  };

  const removeOption = (optId: string) =>
    onChange({ ...question, options: question.options.filter(o => o.id !== optId), correctAnswer: question.correctAnswer === optId ? "" : question.correctAnswer });

  const TypeIcon = { multiple_choice: CheckSquare, true_false: AlertCircle, short_answer: AlignLeft }[question.type];

  return (
    <div className="border border-[var(--border)] rounded-2xl overflow-hidden">
      <div className="flex items-center gap-3 p-3.5 bg-gray-50 cursor-pointer hover:bg-gray-100 transition-colors" onClick={() => setIsOpen(!isOpen)}>
        <div className="w-6 h-6 rounded-lg bg-amber-100 flex items-center justify-center flex-shrink-0">
          <span className="text-[10px] font-extrabold text-amber-600">Q{index + 1}</span>
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-gray-700 truncate">{question.question || <span className="text-gray-400 italic">Question {index + 1}</span>}</p>
          <div className="flex items-center gap-2 mt-0.5">
            <span className="text-[10px] text-gray-400 flex items-center gap-0.5"><TypeIcon className="w-3 h-3" />{question.type.replace("_"," ")}</span>
            <span className="text-[10px] text-gray-400">· {question.points} pts</span>
          </div>
        </div>
        <div className="flex items-center gap-1">
          <button onClick={(e) => { e.stopPropagation(); onDelete(); }} className="p-1.5 rounded-lg text-red-400 hover:bg-red-50"><Trash2 className="w-3.5 h-3.5" /></button>
          {isOpen ? <ChevronUp className="w-4 h-4 text-gray-400" /> : <ChevronDown className="w-4 h-4 text-gray-400" />}
        </div>
      </div>

      {isOpen && (
        <div className="p-4 space-y-4">
          <textarea rows={2} value={question.question} onChange={(e) => onChange({ ...question, question: e.target.value })} placeholder="Enter your question..." className="w-full px-3 py-2.5 text-sm border border-[var(--border)] rounded-xl outline-none focus:border-[var(--primary)] resize-none" />

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="text-xs font-semibold text-gray-600 mb-1 block">Type</label>
              <select value={question.type} onChange={(e) => {
                const t = e.target.value as QuizQuestion["type"];
                const opts = t === "true_false" ? [{ id:"true",text:"True"},{id:"false",text:"False"}] : t === "multiple_choice" ? [{id:"a",text:""},{id:"b",text:""},{id:"c",text:""},{id:"d",text:""}] : [];
                onChange({ ...question, type: t, options: opts, correctAnswer: t === "true_false" ? "true" : "" });
              }} className="w-full text-xs px-2.5 py-2 border border-[var(--border)] rounded-xl outline-none focus:border-[var(--primary)]">
                <option value="multiple_choice">Multiple Choice</option>
                <option value="true_false">True / False</option>
                <option value="short_answer">Short Answer</option>
              </select>
            </div>
            <div>
              <label className="text-xs font-semibold text-gray-600 mb-1 block">Points</label>
              <input type="number" min="1" value={question.points} onChange={(e) => onChange({ ...question, points: Math.max(1, parseInt(e.target.value)||1) })} className="w-full text-xs px-2.5 py-2 border border-[var(--border)] rounded-xl outline-none focus:border-[var(--primary)]" />
            </div>
            <div>
              <label className="text-xs font-semibold text-gray-600 mb-1 block">Hint</label>
              <input type="text" value={question.explanation} onChange={(e) => onChange({ ...question, explanation: e.target.value })} placeholder="Shown after answer" className="w-full text-xs px-2.5 py-2 border border-[var(--border)] rounded-xl outline-none focus:border-[var(--primary)]" />
            </div>
          </div>

          {question.type === "multiple_choice" && (
            <div>
              <label className="text-xs font-semibold text-gray-600 mb-2 block">Answer Options</label>
              <div className="space-y-2">
                {question.options.map(option => (
                  <div key={option.id} className="flex items-center gap-2.5">
                    <button type="button" onClick={() => onChange({ ...question, correctAnswer: option.id })} className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${question.correctAnswer === option.id ? "border-green-500 bg-green-500" : "border-gray-300 hover:border-green-400"}`}>
                      {question.correctAnswer === option.id && <Check className="w-2.5 h-2.5 text-white" />}
                    </button>
                    <span className="text-xs font-bold text-gray-400 w-5">{option.id.toUpperCase()}.</span>
                    <input value={option.text} onChange={(e) => updateOption(option.id, e.target.value)} placeholder={`Option ${option.id.toUpperCase()}`} className={`flex-1 text-sm px-3 py-2 rounded-xl border transition-all outline-none ${question.correctAnswer === option.id ? "border-green-400 bg-green-50" : "border-[var(--border)] focus:border-[var(--primary)]"}`} />
                    {question.options.length > 2 && <button type="button" onClick={() => removeOption(option.id)} className="p-1 rounded-lg text-gray-300 hover:text-red-400"><X className="w-3.5 h-3.5" /></button>}
                  </div>
                ))}
              </div>
              {question.options.length < 6 && <button type="button" onClick={addOption} className="mt-3 flex items-center gap-1.5 text-xs text-[var(--primary)] font-medium"><Plus className="w-3.5 h-3.5" />Add Option</button>}
            </div>
          )}

          {question.type === "true_false" && (
            <div>
              <label className="text-xs font-semibold text-gray-600 mb-2 block">Correct Answer</label>
              <div className="flex gap-3">
                {["true","false"].map(val => (
                  <button key={val} type="button" onClick={() => onChange({ ...question, correctAnswer: val })} className={`flex-1 py-2.5 rounded-xl text-sm font-semibold border-2 capitalize ${question.correctAnswer === val ? val === "true" ? "border-green-500 bg-green-50 text-green-700" : "border-red-400 bg-red-50 text-red-700" : "border-[var(--border)] text-gray-500"}`}>
                    {val === "true" ? "✓ True" : "✗ False"}
                  </button>
                ))}
              </div>
            </div>
          )}

          {question.type === "short_answer" && (
            <div>
              <label className="text-xs font-semibold text-gray-600 mb-1 block">Expected Answer</label>
              <input value={question.correctAnswer} onChange={(e) => onChange({ ...question, correctAnswer: e.target.value })} placeholder="Enter the expected correct answer..." className="w-full text-sm px-3 py-2.5 border border-[var(--border)] rounded-xl outline-none focus:border-[var(--primary)]" />
              <p className="text-xs text-gray-400 mt-1">Case-insensitive comparison</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ─── Main Page Inner ─────────────────────────────────────────────────────────
function QuizCreatePageInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const quizId = searchParams.get("id");

  const [title, setTitle] = useState("Untitled Quiz");
  const [timeLimit, setTimeLimit] = useState(10);
  const [passScore, setPassScore] = useState(70);
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [isSaving, setIsSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (quizId) {
      const lib = getQuizLibrary();
      const found = lib.find(q => q.id === quizId);
      if (found) {
        setTitle(found.title);
        setTimeLimit(found.timeLimit);
        setPassScore(found.passScore);
        setQuestions(found.questions as QuizQuestion[]);
      }
    }
  }, [quizId]);

  const addQuestion = () => {
    setQuestions(prev => [...prev, {
      id: `q${Date.now()}`, question: "", type: "multiple_choice",
      options: [{id:"a",text:""},{id:"b",text:""},{id:"c",text:""},{id:"d",text:""}],
      correctAnswer: "", points: 10, explanation: "",
    }]);
  };

  const updateQuestion = (id: string, updated: QuizQuestion) =>
    setQuestions(prev => prev.map(q => q.id === id ? updated : q));

  const deleteQuestion = (id: string) =>
    setQuestions(prev => prev.filter(q => q.id !== id));

  const handleSave = () => {
    if (!title.trim()) { alert("Please enter a quiz title."); return; }
    setIsSaving(true);
    const lib = getQuizLibrary();
    const now = new Date().toISOString();
    if (quizId) {
      const updated = lib.map(q => q.id === quizId ? { ...q, title, timeLimit, passScore, questions, updatedAt: now } : q);
      saveQuizLibrary(updated);
    } else {
      const newQuiz: LibraryQuiz = { id: `quiz_${Date.now()}`, title, timeLimit, passScore, questions, createdAt: now, updatedAt: now };
      saveQuizLibrary([...lib, newQuiz]);
    }
    setIsSaving(false);
    setSavedSuccess(true);
    setTimeout(() => { setSavedSuccess(false); router.push("/admin/quizzes"); }, 1200);
  };

  const totalPoints = questions.reduce((acc, q) => acc + q.points, 0);

  if (!mounted) return <div className="p-12 flex justify-center"><div className="animate-spin w-8 h-8 border-4 border-[var(--primary)] border-t-transparent rounded-full" /></div>;

  return (
    <div className="min-h-screen">
      <AdminHeader title={quizId ? "Edit Quiz" : "New Quiz"} subtitle="Build a reusable quiz for your module library" />
      <main className="p-4 sm:p-6 max-w-3xl mx-auto">
        {/* Toolbar */}
        <div className="flex items-center justify-between mb-6">
          <Link href="/admin/quizzes" className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-800 transition-colors">
            <ArrowLeft className="w-4 h-4" /> Back to Quiz Library
          </Link>
          <div className="flex items-center gap-3">
            {savedSuccess && <span className="text-sm text-green-600 font-medium flex items-center gap-1"><Check className="w-4 h-4" />Saved!</span>}
            <button onClick={handleSave} disabled={isSaving} className="btn-primary text-sm py-2 px-4 disabled:opacity-70">
              {isSaving ? <><svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/></svg>Saving...</> : <><Save className="w-4 h-4" />Save Quiz</>}
            </button>
          </div>
        </div>

        <div className="bg-white rounded-3xl border border-[var(--border)] overflow-hidden">
          {/* Quiz Settings */}
          <div className="p-6 border-b border-[var(--border)] bg-gray-50">
            <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-4">Quiz Settings</p>
            <div className="grid sm:grid-cols-3 gap-4">
              <div className="sm:col-span-3">
                <label className="text-xs font-semibold text-gray-600 mb-1 block flex items-center gap-1"><Pencil className="w-3 h-3"/>Quiz Title *</label>
                <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g. Nigerian Tax Fundamentals Check" className="w-full text-sm px-3 py-2.5 border border-[var(--border)] rounded-xl outline-none focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary)]/10 bg-white" />
              </div>
              <div>
                <label className="text-xs font-semibold text-gray-600 mb-1 block flex items-center gap-1"><Clock className="w-3 h-3"/>Time Limit (min)</label>
                <input type="number" min="0" value={timeLimit} onChange={(e) => setTimeLimit(parseInt(e.target.value)||0)} className="w-full text-sm px-3 py-2.5 border border-[var(--border)] rounded-xl outline-none focus:border-[var(--primary)] bg-white" />
                {timeLimit === 0 && <p className="text-[10px] text-gray-400 mt-1">0 = no time limit</p>}
              </div>
              <div>
                <label className="text-xs font-semibold text-gray-600 mb-1 block flex items-center gap-1"><BarChart3 className="w-3 h-3"/>Pass Score (%)</label>
                <input type="number" min="0" max="100" value={passScore} onChange={(e) => setPassScore(Math.min(100,Math.max(0,parseInt(e.target.value)||0)))} className="w-full text-sm px-3 py-2.5 border border-[var(--border)] rounded-xl outline-none focus:border-[var(--primary)] bg-white" />
              </div>
              <div className="flex flex-col justify-end">
                <div className="bg-[var(--primary)]/5 border border-[var(--primary)]/20 rounded-xl p-3">
                  <p className="text-xs text-gray-500">{questions.length} questions · <span className="font-semibold text-gray-700">{totalPoints} pts</span> total</p>
                  <p className="text-xs text-gray-500">Pass at <span className="font-semibold text-[var(--primary)]">{Math.ceil((passScore/100)*totalPoints)} pts</span></p>
                </div>
              </div>
            </div>
          </div>

          {/* Questions */}
          <div className="p-6 space-y-3">
            <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">Questions</p>
            {questions.map((q, idx) => (
              <QuizQuestionEditor key={q.id} question={q} index={idx} onChange={(updated) => updateQuestion(q.id, updated)} onDelete={() => deleteQuestion(q.id)} />
            ))}
            <button type="button" onClick={addQuestion} className="w-full flex items-center justify-center gap-2 py-3.5 rounded-2xl border-2 border-dashed border-[var(--primary)]/30 text-sm font-medium text-[var(--primary)] hover:bg-[var(--primary)]/5 hover:border-[var(--primary)] transition-all">
              <Plus className="w-4 h-4" /> Add Question
            </button>
            {questions.length === 0 && (
              <div className="text-center py-8 bg-amber-50 rounded-2xl border border-amber-100">
                <HelpCircle className="w-8 h-8 text-amber-300 mx-auto mb-2" />
                <p className="text-sm text-amber-700 font-medium">No questions yet</p>
                <p className="text-xs text-amber-500 mt-0.5">Click "Add Question" to build your quiz</p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

export default function QuizCreatePage() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center min-h-screen"><div className="animate-spin w-8 h-8 border-4 border-[var(--primary)] border-t-transparent rounded-full" /></div>}>
      <QuizCreatePageInner />
    </Suspense>
  );
}
