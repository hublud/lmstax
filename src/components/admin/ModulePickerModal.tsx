"use client";

import { useState, useEffect } from "react";
import { X, Search, Layers, Video, FileText, HelpCircle, Check, Plus } from "lucide-react";
import { getModuleLibrary, type LibraryModule } from "@/app/admin/modules/page";

interface Props {
  onClose: () => void;
  onAdd: (modules: LibraryModule[]) => void;
  alreadySelectedIds?: string[];
}

const lessonIcons = { video: Video, reading: FileText, quiz: HelpCircle };
const lessonColors = { video: "text-blue-500", reading: "text-purple-500", quiz: "text-amber-500" };

export default function ModulePickerModal({ onClose, onAdd, alreadySelectedIds = [] }: Props) {
  const [allModules, setAllModules] = useState<LibraryModule[]>([]);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [search, setSearch] = useState("");

  useEffect(() => { setAllModules(getModuleLibrary()); }, []);

  const filtered = allModules.filter(m =>
    m.title.toLowerCase().includes(search.toLowerCase())
  );

  const toggle = (id: string) => {
    setSelected(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const handleAdd = () => {
    const picked = allModules.filter(m => selected.has(m.id));
    onAdd(picked);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose}/>

      {/* Modal */}
      <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-2xl max-h-[80vh] flex flex-col overflow-hidden animate-fade-in-up">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[var(--border)] flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[var(--primary)]/10 flex items-center justify-center">
              <Layers className="w-5 h-5 text-[var(--primary)]"/>
            </div>
            <div>
              <p className="font-bold text-gray-800">Module Library</p>
              <p className="text-xs text-gray-400">Select modules to add to your course</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 rounded-xl text-gray-400 hover:bg-gray-100 transition-all">
            <X className="w-5 h-5"/>
          </button>
        </div>

        {/* Search */}
        <div className="px-6 py-3 border-b border-[var(--border)] flex-shrink-0">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400"/>
            <input
              type="text" placeholder="Search modules..." value={search}
              onChange={e => setSearch(e.target.value)}
              autoFocus
              className="w-full pl-9 pr-4 py-2 text-sm border border-[var(--border)] rounded-xl outline-none focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary)]/10"
            />
          </div>
        </div>

        {/* Module list */}
        <div className="flex-1 overflow-y-auto p-4 space-y-2">
          {filtered.length === 0 ? (
            <div className="text-center py-12">
              <Layers className="w-10 h-10 text-gray-300 mx-auto mb-3"/>
              <p className="text-sm text-gray-500 font-medium">
                {search ? "No modules match your search" : "No modules in library yet"}
              </p>
              {!search && (
                <p className="text-xs text-gray-400 mt-1">
                  Go to <span className="text-[var(--primary)] font-medium">Module Library → New Module</span> to create one first
                </p>
              )}
            </div>
          ) : (
            filtered.map(mod => {
              const isSelected = selected.has(mod.id);
              const alreadyAdded = alreadySelectedIds.includes(mod.id);
              return (
                <button
                  key={mod.id}
                  onClick={() => !alreadyAdded && toggle(mod.id)}
                  disabled={alreadyAdded}
                  className={`w-full text-left p-4 rounded-2xl border-2 transition-all ${
                    alreadyAdded ? "border-gray-200 bg-gray-50 opacity-50 cursor-not-allowed" :
                    isSelected ? "border-[var(--primary)] bg-[var(--primary)]/5" :
                    "border-[var(--border)] hover:border-[var(--primary)]/40 hover:bg-gray-50"
                  }`}
                >
                  <div className="flex items-start gap-3">
                    {/* Checkbox */}
                    <div className={`w-5 h-5 rounded-lg border-2 flex items-center justify-center flex-shrink-0 mt-0.5 transition-all ${
                      alreadyAdded ? "border-gray-300 bg-gray-100" :
                      isSelected ? "border-[var(--primary)] bg-[var(--primary)]" :
                      "border-gray-300"
                    }`}>
                      {(isSelected || alreadyAdded) && <Check className="w-3 h-3 text-white"/>}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <p className="font-semibold text-gray-800 text-sm">{mod.title}</p>
                        {alreadyAdded && <span className="text-[10px] font-bold bg-gray-200 text-gray-500 px-1.5 py-0.5 rounded-md">Already added</span>}
                      </div>
                      {mod.description && <p className="text-xs text-gray-400 mb-2 line-clamp-1">{mod.description}</p>}

                      {/* Lesson icons */}
                      <div className="flex items-center gap-3 flex-wrap">
                        <span className="text-xs text-gray-500 font-medium">{mod.lessons.length} lessons</span>
                        {(["video","reading","quiz"] as const).map(type => {
                          const count = mod.lessons.filter(l => l.type === type).length;
                          if (!count) return null;
                          const Icon = lessonIcons[type];
                          return (
                            <span key={type} className={`flex items-center gap-1 text-xs font-medium ${lessonColors[type]}`}>
                              <Icon className="w-3 h-3"/>{count} {type}
                            </span>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                </button>
              );
            })
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-[var(--border)] flex items-center justify-between flex-shrink-0 bg-gray-50">
          <p className="text-sm text-gray-500">
            {selected.size > 0 ? (
              <span><span className="font-bold text-[var(--primary)]">{selected.size}</span> module{selected.size > 1 ? "s" : ""} selected</span>
            ) : "Select one or more modules"}
          </p>
          <div className="flex items-center gap-3">
            <button onClick={onClose} className="btn-outline text-sm py-2 px-4">Cancel</button>
            <button
              onClick={handleAdd}
              disabled={selected.size === 0}
              className="btn-primary text-sm py-2 px-4 disabled:opacity-50"
            >
              <Plus className="w-4 h-4"/>
              Add {selected.size > 0 ? `${selected.size} Module${selected.size > 1 ? "s" : ""}` : "Modules"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
