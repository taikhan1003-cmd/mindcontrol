import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { DiaryForm } from './components/DiaryForm';
import { AiReplyCard } from './components/AiReplyCard';
import { EmotionCalendar } from './components/EmotionCalendar';
import { EmotionAnalytics } from './components/EmotionAnalytics';
import { HealingSpace } from './components/HealingSpace';
import { EntryDetailModal } from './components/EntryDetailModal';
import { DiaryEntry, AiAnalysisResult } from './types';
import {
  loadDiaryEntries,
  updateDiaryEntry,
  deleteDiaryEntry,
} from './utils/storage';
import { Sparkles, Heart, Github, Globe } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<'write' | 'calendar' | 'analytics' | 'healing'>('write');
  const [entries, setEntries] = useState<DiaryEntry[]>([]);
  const [selectedEntryDetail, setSelectedEntryDetail] = useState<DiaryEntry | null>(null);

  // Latest AI response to display immediately on write tab
  const [latestAiResult, setLatestAiResult] = useState<{
    result: AiAnalysisResult;
    entry: DiaryEntry;
  } | null>(null);

  // Load entries on mount
  useEffect(() => {
    const loaded = loadDiaryEntries();
    setEntries(loaded);
  }, []);

  const handleEntryAdded = (newEntry: DiaryEntry) => {
    setEntries((prev) => [newEntry, ...prev.filter((e) => e.id !== newEntry.id)]);
  };

  const handleSetAiResult = (result: AiAnalysisResult, entry: DiaryEntry) => {
    setLatestAiResult({ result, entry });
  };

  const handleUpdateEntry = (id: string, newContent: string) => {
    const updated = updateDiaryEntry(id, { content: newContent });
    if (updated) {
      setEntries((prev) => prev.map((e) => (e.id === id ? updated : e)));
      if (selectedEntryDetail?.id === id) {
        setSelectedEntryDetail(updated);
      }
      if (latestAiResult?.entry.id === id) {
        setLatestAiResult({ ...latestAiResult, entry: updated });
      }
    }
  };

  const handleDeleteEntry = (id: string) => {
    deleteDiaryEntry(id);
    setEntries((prev) => prev.filter((e) => e.id !== id));
    if (selectedEntryDetail?.id === id) {
      setSelectedEntryDetail(null);
    }
    if (latestAiResult?.entry.id === id) {
      setLatestAiResult(null);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#fbc2eb] via-[#a6c1ee] to-[#fbc2eb] dark:from-slate-950 dark:via-purple-950 dark:to-slate-900 text-slate-800 dark:text-slate-100 font-sans transition-colors duration-300 pb-16 flex flex-col justify-between relative overflow-x-hidden selection:bg-purple-200 selection:text-purple-900">
      {/* Frosted Glass Floating Ambient Background Orbs */}
      <div className="fixed bottom-[-100px] left-[-100px] w-[450px] h-[450px] bg-purple-400/30 dark:bg-purple-600/20 rounded-full blur-[120px] pointer-events-none z-0 animate-pulse-glow" />
      <div className="fixed top-[-80px] right-[-80px] w-[350px] h-[350px] bg-yellow-200/30 dark:bg-indigo-600/20 rounded-full blur-[100px] pointer-events-none z-0 animate-float-slow" />
      <div className="fixed top-[40%] left-[20%] w-[300px] h-[300px] bg-pink-300/20 rounded-full blur-[100px] pointer-events-none z-0" />

      <div className="relative z-10">
        {/* Header Navigation */}
        <Header
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          entries={entries}
        />

        {/* Main View Container */}
        <main className="max-w-4xl mx-auto px-4 sm:px-6 pt-6 sm:pt-8 space-y-8">
          {activeTab === 'write' && (
            <div className="space-y-8 animate-fade-in">
              <DiaryForm
                onEntryAdded={handleEntryAdded}
                onSetAiResult={handleSetAiResult}
              />

              {latestAiResult && (
                <AiReplyCard
                  aiResult={latestAiResult.result}
                  entry={latestAiResult.entry}
                />
              )}
            </div>
          )}

          {activeTab === 'calendar' && (
            <div className="animate-fade-in">
              <EmotionCalendar
                entries={entries}
                onSelectEntry={(entry) => setSelectedEntryDetail(entry)}
                onSelectDateToCreate={() => {
                  setActiveTab('write');
                }}
              />
            </div>
          )}

          {activeTab === 'analytics' && (
            <div className="animate-fade-in">
              <EmotionAnalytics
                entries={entries}
                onSelectEntry={(entry) => setSelectedEntryDetail(entry)}
              />
            </div>
          )}

          {activeTab === 'healing' && (
            <div className="animate-fade-in">
              <HealingSpace />
            </div>
          )}
        </main>
      </div>

      {/* Entry Detail Modal / Drawer */}
      <EntryDetailModal
        entry={selectedEntryDetail}
        onClose={() => setSelectedEntryDetail(null)}
        onUpdateEntry={handleUpdateEntry}
        onDeleteEntry={handleDeleteEntry}
      />

      {/* Footer */}
      <footer className="max-w-4xl mx-auto px-4 sm:px-6 pt-12 text-center text-xs text-slate-400 space-y-2">
        <div className="flex items-center justify-center gap-2">
          <span>마음달빛 AI 힐링 상담소</span>
          <span>•</span>
          <span className="flex items-center gap-1 text-pink-500 font-medium">
            Made with <Heart className="w-3 h-3 fill-pink-500" /> for Teens
          </span>
        </div>
        <p>
          GitHub & Vercel Deploy Ready • AI 모델: Gemini 3.6 Flash
        </p>
      </footer>
    </div>
  );
}
