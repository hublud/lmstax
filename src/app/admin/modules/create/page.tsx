"use client";

import { Suspense } from "react";
import { useState, useEffect, useCallback } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import AdminHeader from "@/components/admin/AdminHeader";
import {
  ArrowLeft, Save, Plus, Trash2, GripVertical, ChevronDown, ChevronRight,
  Video, FileText, HelpCircle, Check, X, Pencil, Clock, BarChart3,
  CheckSquare, AlertCircle, AlignLeft, ChevronUp, BookOpen, Layers,
} from "lucide-react";
import { getModuleLibrary, saveModuleLibrary, type LibraryModule, type LibraryLesson } from "../page";

// ─── Types ─────────────────────────────────────────────────────────────────
interface QuizOption { id: string; text: string; }
interface QuizQuestion {
  id: string; question: string;
  type: "multiple_choice" | "true_false" | "short_answer";
  options: QuizOption[]; correctAnswer: string; points: number; explanation: string;
}

// ─── Quiz Question Editor ──────────────────────────────────────────────────
function QuizQEditor({ q, idx, onChange, onDelete }: { q: QuizQuestion; idx: number; onChange: (q: QuizQuestion) => void; onDelete: () => void }) {
  const [open, setOpen] = useState(true);
  const TIcon = { multiple_choice: CheckSquare, true_false: AlertCircle, short_answer: AlignLeft }[q.type];

  return (
    <div className="border border-[var(--border)] rounded-2xl overflow-hidden">
      <div className="flex items-center gap-3 p-3 bg-gray-50 cursor-pointer" onClick={() => setOpen(!open)}>
        <div className="w-6 h-6 rounded-lg bg-amber-100 flex items-center justify-center flex-shrink-0">
          <span className="text-[10px] font-extrabold text-amber-600">Q{idx+1}</span>
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-gray-700 truncate">{q.question || <span className="text-gray-400 italic">Question {idx+1}</span>}</p>
          <span className="text-[10px] text-gray-400 flex items-center gap-1"><TIcon className="w-3 h-3"/>{q.type.replace("_"," ")} · {q.points}pts</span>
        </div>
        <button onClick={(e)=>{e.stopPropagation();onDelete();}} className="p-1.5 rounded-lg text-red-400 hover:bg-red-50"><Trash2 className="w-3.5 h-3.5"/></button>
        {open ? <ChevronUp className="w-4 h-4 text-gray-400"/> : <ChevronDown className="w-4 h-4 text-gray-400"/>}
      </div>
      {open && (
        <div className="p-4 space-y-3">
          <textarea rows={2} value={q.question} onChange={e=>onChange({...q,question:e.target.value})} placeholder="Enter question..." className="w-full px-3 py-2 text-sm border border-[var(--border)] rounded-xl outline-none focus:border-[var(--primary)] resize-none"/>
          <div className="grid grid-cols-3 gap-2">
            <div>
              <label className="text-xs font-semibold text-gray-600 mb-1 block">Type</label>
              <select value={q.type} onChange={e=>{
                const t=e.target.value as QuizQuestion["type"];
                const opts=t==="true_false"?[{id:"true",text:"True"},{id:"false",text:"False"}]:t==="multiple_choice"?[{id:"a",text:""},{id:"b",text:""},{id:"c",text:""},{id:"d",text:""}]:[];
                onChange({...q,type:t,options:opts,correctAnswer:t==="true_false"?"true":""});
              }} className="w-full text-xs px-2 py-2 border border-[var(--border)] rounded-xl outline-none">
                <option value="multiple_choice">Multiple Choice</option>
                <option value="true_false">True / False</option>
                <option value="short_answer">Short Answer</option>
              </select>
            </div>
            <div>
              <label className="text-xs font-semibold text-gray-600 mb-1 block">Points</label>
              <input type="number" min="1" value={q.points} onChange={e=>onChange({...q,points:Math.max(1,parseInt(e.target.value)||1)})} className="w-full text-xs px-2 py-2 border border-[var(--border)] rounded-xl outline-none"/>
            </div>
            <div>
              <label className="text-xs font-semibold text-gray-600 mb-1 block">Hint</label>
              <input value={q.explanation} onChange={e=>onChange({...q,explanation:e.target.value})} className="w-full text-xs px-2 py-2 border border-[var(--border)] rounded-xl outline-none" placeholder="Optional hint"/>
            </div>
          </div>
          {q.type==="multiple_choice" && (
            <div className="space-y-2">
              {q.options.map(o=>(
                <div key={o.id} className="flex items-center gap-2">
                  <button type="button" onClick={()=>onChange({...q,correctAnswer:o.id})} className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${q.correctAnswer===o.id?"border-green-500 bg-green-500":"border-gray-300"}`}>
                    {q.correctAnswer===o.id&&<Check className="w-2.5 h-2.5 text-white"/>}
                  </button>
                  <span className="text-xs font-bold text-gray-400 w-4">{o.id.toUpperCase()}.</span>
                  <input value={o.text} onChange={e=>onChange({...q,options:q.options.map(op=>op.id===o.id?{...op,text:e.target.value}:op)})} className={`flex-1 text-sm px-3 py-1.5 rounded-xl border ${q.correctAnswer===o.id?"border-green-400 bg-green-50":"border-[var(--border)]"} outline-none`}/>
                  {q.options.length>2&&<button type="button" onClick={()=>onChange({...q,options:q.options.filter(op=>op.id!==o.id),correctAnswer:q.correctAnswer===o.id?"":q.correctAnswer})} className="p-1 text-gray-300 hover:text-red-400"><X className="w-3.5 h-3.5"/></button>}
                </div>
              ))}
              {q.options.length<6&&<button type="button" onClick={()=>{const letters=["a","b","c","d","e","f"];onChange({...q,options:[...q.options,{id:letters[q.options.length]||`o${Date.now()}`,text:""}]});}} className="text-xs text-[var(--primary)] flex items-center gap-1"><Plus className="w-3 h-3"/>Add Option</button>}
            </div>
          )}
          {q.type==="true_false"&&(
            <div className="flex gap-3">
              {["true","false"].map(v=>(
                <button key={v} type="button" onClick={()=>onChange({...q,correctAnswer:v})} className={`flex-1 py-2 rounded-xl text-sm font-semibold border-2 capitalize ${q.correctAnswer===v?v==="true"?"border-green-500 bg-green-50 text-green-700":"border-red-400 bg-red-50 text-red-700":"border-[var(--border)] text-gray-500"}`}>{v==="true"?"✓ True":"✗ False"}</button>
              ))}
            </div>
          )}
          {q.type==="short_answer"&&<input value={q.correctAnswer} onChange={e=>onChange({...q,correctAnswer:e.target.value})} placeholder="Expected answer..." className="w-full text-sm px-3 py-2 border border-[var(--border)] rounded-xl outline-none"/>}
        </div>
      )}
    </div>
  );
}

// ─── Lesson Editor ─────────────────────────────────────────────────────────
function LessonEditor({ lesson, onChange, onClose }: { lesson: LibraryLesson; onChange: (l: LibraryLesson) => void; onClose: () => void }) {
  const upd = useCallback((partial: Partial<LibraryLesson["content"]>) => onChange({...lesson,content:{...lesson.content,...partial}}), [lesson,onChange]);
  const questions: QuizQuestion[] = (lesson.content.quizQuestions as QuizQuestion[]) || [];

  return (
    <div className="border-t border-[var(--border)] bg-white">
      <div className="flex items-center justify-between px-4 py-3 bg-gray-50 border-b border-[var(--border)]">
        <p className="text-sm font-semibold text-gray-700 capitalize">{lesson.type} editor — {lesson.title||"Untitled"}</p>
        <button onClick={onClose} className="p-1.5 rounded-lg text-gray-400 hover:bg-gray-200"><ChevronUp className="w-4 h-4"/></button>
      </div>
      <div className="p-4">
        {lesson.type==="video"&&(
          <div className="space-y-3">
            <div>
              <label className="text-xs font-semibold text-gray-600 mb-1 block">Video URL</label>
              <input type="url" value={lesson.content.videoUrl||""} onChange={e=>upd({videoUrl:e.target.value})} placeholder="YouTube / Vimeo / MP4 URL" className="w-full px-3 py-2.5 text-sm border border-[var(--border)] rounded-xl outline-none focus:border-[var(--primary)]"/>
            </div>
            <div>
              <label className="text-xs font-semibold text-gray-600 mb-1 block">Notes / Transcript</label>
              <textarea rows={5} value={lesson.content.videoNotes||""} onChange={e=>upd({videoNotes:e.target.value})} placeholder="Lesson notes..." className="w-full px-3 py-2.5 text-sm border border-[var(--border)] rounded-xl outline-none focus:border-[var(--primary)] resize-none font-mono"/>
            </div>
          </div>
        )}
        {lesson.type==="reading"&&(
          <div>
            <label className="text-xs font-semibold text-gray-600 mb-1 block">Lesson Content (Markdown)</label>
            <textarea rows={10} value={lesson.content.readingContent||""} onChange={e=>upd({readingContent:e.target.value})} placeholder="Write lesson content here..." className="w-full px-3 py-2.5 text-sm border border-[var(--border)] rounded-xl outline-none focus:border-[var(--primary)] resize-y font-mono" style={{minHeight:"200px"}}/>
          </div>
        )}
        {lesson.type==="quiz"&&(
          <div className="space-y-4">
            <div className="grid grid-cols-3 gap-3 bg-gray-50 rounded-2xl p-3">
              <div>
                <label className="text-xs font-semibold text-gray-600 mb-1 block">Quiz Title</label>
                <input value={lesson.content.quizTitle||""} onChange={e=>upd({quizTitle:e.target.value})} className="w-full text-sm px-3 py-2 border border-[var(--border)] rounded-xl outline-none focus:border-[var(--primary)] bg-white"/>
              </div>
              <div>
                <label className="text-xs font-semibold text-gray-600 mb-1 block flex items-center gap-1"><Clock className="w-3 h-3"/>Time Limit (min)</label>
                <input type="number" min="0" value={lesson.content.quizTimeLimit??10} onChange={e=>upd({quizTimeLimit:parseInt(e.target.value)||0})} className="w-full text-sm px-3 py-2 border border-[var(--border)] rounded-xl outline-none bg-white"/>
              </div>
              <div>
                <label className="text-xs font-semibold text-gray-600 mb-1 block flex items-center gap-1"><BarChart3 className="w-3 h-3"/>Pass Score (%)</label>
                <input type="number" min="0" max="100" value={lesson.content.quizPassScore??70} onChange={e=>upd({quizPassScore:Math.min(100,Math.max(0,parseInt(e.target.value)||0))})} className="w-full text-sm px-3 py-2 border border-[var(--border)] rounded-xl outline-none bg-white"/>
              </div>
            </div>
            <div className="space-y-2">
              {questions.map((q,qi)=>(
                <QuizQEditor key={q.id} q={q} idx={qi} onChange={updated=>upd({quizQuestions:questions.map(qq=>qq.id===q.id?updated:qq)})} onDelete={()=>upd({quizQuestions:questions.filter(qq=>qq.id!==q.id)})}/>
              ))}
            </div>
            <button type="button" onClick={()=>upd({quizQuestions:[...questions,{id:`q${Date.now()}`,question:"",type:"multiple_choice",options:[{id:"a",text:""},{id:"b",text:""},{id:"c",text:""},{id:"d",text:""}],correctAnswer:"",points:10,explanation:""}]})} className="w-full flex items-center justify-center gap-2 py-3 rounded-2xl border-2 border-dashed border-[var(--primary)]/30 text-sm font-medium text-[var(--primary)] hover:bg-[var(--primary)]/5 transition-all">
              <Plus className="w-4 h-4"/>Add Question
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Lesson Row ────────────────────────────────────────────────────────────
function LessonRow({ lesson, onChange, onDelete }: { lesson: LibraryLesson; onChange: (l: LibraryLesson) => void; onDelete: () => void }) {
  const [editorOpen, setEditorOpen] = useState(false);
  const Icon = { video: Video, reading: FileText, quiz: HelpCircle }[lesson.type];
  const color = { video: "bg-blue-100 text-blue-600", reading: "bg-purple-100 text-purple-600", quiz: "bg-amber-100 text-amber-600" }[lesson.type];

  return (
    <div className="border border-gray-200 rounded-xl overflow-hidden">
      <div className="flex items-center gap-3 px-3 py-2.5 bg-gray-50 group">
        <GripVertical className="w-4 h-4 text-gray-300 flex-shrink-0 cursor-grab"/>
        <div className={`w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 ${color}`}><Icon className="w-3.5 h-3.5"/></div>
        <input value={lesson.title} onChange={e=>onChange({...lesson,title:e.target.value})} className="flex-1 bg-transparent text-sm font-medium text-gray-700 outline-none min-w-0" placeholder="Lesson title"/>
        <select value={lesson.type} onChange={e=>{
          const t=e.target.value as LibraryLesson["type"];
          const content=t==="video"?{videoUrl:"",videoNotes:""}:t==="reading"?{readingContent:""}:{quizTitle:"Quiz",quizTimeLimit:10,quizPassScore:70,quizQuestions:[]};
          onChange({...lesson,type:t,content});
        }} className="text-xs bg-white border border-gray-200 rounded-lg px-2 py-1 text-gray-600 outline-none flex-shrink-0">
          <option value="video">Video</option>
          <option value="reading">Reading</option>
          <option value="quiz">Quiz</option>
        </select>
        <input value={lesson.duration} onChange={e=>onChange({...lesson,duration:e.target.value})} placeholder="0:00" className="w-14 text-xs text-center bg-white border border-gray-200 rounded-lg px-2 py-1 text-gray-600 outline-none flex-shrink-0"/>
        <label className="flex items-center gap-1 text-xs text-gray-500 cursor-pointer flex-shrink-0">
          <input type="checkbox" checked={lesson.isFree} onChange={e=>onChange({...lesson,isFree:e.target.checked})} className="w-3.5 h-3.5 accent-[var(--primary)]"/>Free
        </label>
        <button onClick={()=>setEditorOpen(!editorOpen)} className={`p-1.5 rounded-lg text-xs flex items-center gap-1 flex-shrink-0 ${editorOpen?"bg-[var(--primary)] text-white":"text-gray-400 hover:text-[var(--primary)]"}`}>
          <Pencil className="w-3.5 h-3.5"/>
        </button>
        <button onClick={onDelete} className="opacity-0 group-hover:opacity-100 p-1 rounded-lg text-red-400 hover:bg-red-50 flex-shrink-0"><Trash2 className="w-3.5 h-3.5"/></button>
      </div>
      {editorOpen&&<LessonEditor lesson={lesson} onChange={onChange} onClose={()=>setEditorOpen(false)}/>}
    </div>
  );
}

// ─── Main Page ─────────────────────────────────────────────────────────────
function ModuleCreatePageInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const moduleId = searchParams.get("id");

  const [title, setTitle] = useState("Untitled Module");
  const [description, setDescription] = useState("");
  const [lessons, setLessons] = useState<LibraryLesson[]>([]);
  const [isSaving, setIsSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (moduleId) {
      const lib = getModuleLibrary();
      const found = lib.find(m => m.id === moduleId);
      if (found) { setTitle(found.title); setDescription(found.description||""); setLessons(found.lessons as LibraryLesson[]); }
    }
  }, [moduleId]);

  const addLesson = () => setLessons(prev=>[...prev,{id:`l_${Date.now()}`,title:"New Lesson",type:"video",duration:"0:00",isFree:false,content:{videoUrl:"",videoNotes:""}}]);

  const handleSave = () => {
    if (!title.trim()) { alert("Please enter a module title."); return; }
    setIsSaving(true);
    const lib = getModuleLibrary();
    const now = new Date().toISOString();
    if (moduleId) {
      saveModuleLibrary(lib.map(m=>m.id===moduleId?{...m,title,description,lessons,updatedAt:now}:m));
    } else {
      saveModuleLibrary([...lib,{id:`mod_${Date.now()}`,title,description,lessons,createdAt:now,updatedAt:now}]);
    }
    setIsSaving(false); setSavedSuccess(true);
    setTimeout(()=>{setSavedSuccess(false); router.push("/admin/modules");},1200);
  };

  if (!mounted) return <div className="p-12 flex justify-center"><div className="animate-spin w-8 h-8 border-4 border-[var(--primary)] border-t-transparent rounded-full"/></div>;

  return (
    <div className="min-h-screen">
      <AdminHeader title={moduleId?"Edit Module":"New Module"} subtitle="Build a standalone module with lessons to add to any course"/>
      <main className="p-4 sm:p-6 max-w-3xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <Link href="/admin/modules" className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-800"><ArrowLeft className="w-4 h-4"/>Back to Module Library</Link>
          <div className="flex items-center gap-3">
            {savedSuccess&&<span className="text-sm text-green-600 font-medium flex items-center gap-1"><Check className="w-4 h-4"/>Saved!</span>}
            <button onClick={handleSave} disabled={isSaving} className="btn-primary text-sm py-2 px-4 disabled:opacity-70">
              {isSaving?<><svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/></svg>Saving...</>:<><Save className="w-4 h-4"/>Save Module</>}
            </button>
          </div>
        </div>

        <div className="bg-white rounded-3xl border border-[var(--border)] overflow-hidden">
          {/* Module info */}
          <div className="p-6 border-b border-[var(--border)] bg-gray-50 space-y-3">
            <div className="flex items-center gap-3 mb-1">
              <div className="w-9 h-9 rounded-xl bg-[var(--primary)]/10 flex items-center justify-center"><Layers className="w-5 h-5 text-[var(--primary)]"/></div>
              <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">Module Details</p>
            </div>
            <div>
              <label className="text-xs font-semibold text-gray-600 mb-1 block">Module Title *</label>
              <input value={title} onChange={e=>setTitle(e.target.value)} placeholder="e.g. Introduction to Nigerian Tax Law" className="w-full text-sm px-3 py-2.5 border border-[var(--border)] rounded-xl outline-none focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary)]/10 bg-white"/>
            </div>
            <div>
              <label className="text-xs font-semibold text-gray-600 mb-1 block">Description (optional)</label>
              <textarea rows={2} value={description} onChange={e=>setDescription(e.target.value)} placeholder="What will students learn in this module?" className="w-full text-sm px-3 py-2.5 border border-[var(--border)] rounded-xl outline-none focus:border-[var(--primary)] resize-none bg-white"/>
            </div>
          </div>

          {/* Lessons */}
          <div className="p-6 space-y-3">
            <div className="flex items-center justify-between">
              <p className="text-xs font-bold text-gray-500 uppercase tracking-wider flex items-center gap-2"><BookOpen className="w-3.5 h-3.5"/>{lessons.length} Lessons</p>
              <button onClick={addLesson} className="btn-primary text-xs py-1.5 px-3"><Plus className="w-3 h-3"/>Add Lesson</button>
            </div>
            {lessons.map(lesson=>(
              <LessonRow key={lesson.id} lesson={lesson} onChange={updated=>setLessons(prev=>prev.map(l=>l.id===updated.id?updated:l))} onDelete={()=>setLessons(prev=>prev.filter(l=>l.id!==lesson.id))}/>
            ))}
            {lessons.length===0&&(
              <div className="text-center py-10 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200">
                <BookOpen className="w-8 h-8 text-gray-300 mx-auto mb-2"/>
                <p className="text-sm text-gray-500 font-medium">No lessons yet</p>
                <p className="text-xs text-gray-400 mt-0.5">Click "Add Lesson" to build your module</p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

export default function ModuleCreatePage() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center min-h-screen"><div className="animate-spin w-8 h-8 border-4 border-[var(--primary)] border-t-transparent rounded-full"/></div>}>
      <ModuleCreatePageInner/>
    </Suspense>
  );
}
