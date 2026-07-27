import React, { useState } from 'react';
import {
  Sparkles,
  BookOpen,
  Calendar as CalendarIcon,
  BarChart3,
  Volume2,
  VolumeX,
  HeartHandshake,
  Download,
  Moon,
  Music,
} from 'lucide-react';
import { AmbientSoundType, playAmbientSound } from '../utils/audioSynth';
import { exportEntriesToJson } from '../utils/storage';
import { DiaryEntry } from '../types';

interface HeaderProps {
  activeTab: 'write' | 'calendar' | 'analytics' | 'healing';
  setActiveTab: (tab: 'write' | 'calendar' | 'analytics' | 'healing') => void;
  entries: DiaryEntry[];
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  entries,
}) => {
  const [ambient, setAmbient] = useState<AmbientSoundType>('off');
  const [showSoundMenu, setShowSoundMenu] = useState(false);

  const handleSoundChange = (type: AmbientSoundType) => {
    setAmbient(type);
    playAmbientSound(type);
    setShowSoundMenu(false);
  };

  const soundLabels: Record<AmbientSoundType, { name: string; icon: string }> = {
    off: { name: '음소거', icon: '🔇' },
    rain: { name: '토닥토닥 빗소리', icon: '🌧️' },
    forest: { name: '상쾌한 숲 바람', icon: '🌲' },
    waves: { name: '잔잔한 밤바다', icon: '🌊' },
    fire: { name: '포근한 장작불', icon: '🔥' },
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-white/25 dark:bg-slate-900/40 backdrop-blur-xl border-b border-white/40 dark:border-white/10 shadow-sm transition-colors">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-3 flex flex-col sm:flex-row items-center justify-between gap-3">
        {/* Logo and Tagline */}
        <div className="flex items-center justify-between w-full sm:w-auto">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white/40 dark:bg-white/10 backdrop-blur-md rounded-2xl flex items-center justify-center border border-white/40 shadow-sm shrink-0">
              <Sparkles className="w-5 h-5 text-indigo-700 dark:text-purple-300 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-extrabold text-slate-800 dark:text-white tracking-tight drop-shadow-xs">
                  마음달빛
                </h1>
                <span className="text-[10px] font-bold text-indigo-800 dark:text-purple-200 bg-white/50 dark:bg-purple-900/60 px-2.5 py-0.5 rounded-full border border-white/60 dark:border-purple-700/50 backdrop-blur-md">
                  AI 힐링 상담소
                </span>
              </div>
              <p className="text-xs text-slate-700/90 dark:text-slate-300 font-medium">
                청소년을 위한 따뜻한 감정 일기장 & 쉼터
              </p>
            </div>
          </div>

          {/* Mobile Right Controls */}
          <div className="flex sm:hidden items-center gap-2">
            <div className="relative">
              <button
                type="button"
                id="header-mobile-sound-btn"
                onClick={() => setShowSoundMenu(!showSoundMenu)}
                className={`p-2 rounded-xl text-xs font-medium border backdrop-blur-md transition-all flex items-center gap-1.5 ${
                  ambient !== 'off'
                    ? 'bg-white/80 text-indigo-700 border-white shadow-sm animate-pulse'
                    : 'bg-white/30 text-slate-700 border-white/40'
                }`}
                title="힐링 사운드스케이프"
              >
                {ambient !== 'off' ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
                <span>{soundLabels[ambient].icon}</span>
              </button>

              {showSoundMenu && (
                <div className="absolute right-0 top-12 w-48 bg-white/80 dark:bg-slate-800/90 backdrop-blur-2xl rounded-2xl shadow-2xl border border-white/50 dark:border-slate-700 p-2 z-50">
                  <div className="text-[11px] font-bold text-slate-500 px-2 py-1 flex items-center justify-between">
                    <span>힐링 사운드</span>
                    <Music className="w-3 h-3 text-purple-500" />
                  </div>
                  {(Object.keys(soundLabels) as AmbientSoundType[]).map((type) => (
                    <button
                      key={type}
                      type="button"
                      onClick={() => handleSoundChange(type)}
                      className={`w-full text-left px-3 py-1.5 text-xs rounded-xl flex items-center gap-2 transition-colors ${
                        ambient === type
                          ? 'bg-white dark:bg-slate-700 text-indigo-700 dark:text-purple-300 font-bold shadow-xs'
                          : 'hover:bg-white/50 dark:hover:bg-slate-700/50 text-slate-700 dark:text-slate-300'
                      }`}
                    >
                      <span>{soundLabels[type].icon}</span>
                      <span>{soundLabels[type].name}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Navigation Tabs (Frosted Glass Container) */}
        <nav className="flex items-center gap-1 bg-white/30 dark:bg-slate-900/50 p-1.5 rounded-2xl border border-white/40 dark:border-white/10 backdrop-blur-lg shadow-sm w-full sm:w-auto justify-center sm:justify-start">
          <button
            type="button"
            id="tab-btn-write"
            onClick={() => setActiveTab('write')}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
              activeTab === 'write'
                ? 'bg-white/80 dark:bg-slate-800 text-indigo-700 dark:text-purple-300 shadow-md border border-white/80'
                : 'text-slate-700 dark:text-slate-200 hover:bg-white/30 dark:hover:bg-slate-800/40'
            }`}
          >
            <BookOpen className="w-4 h-4 text-purple-600" />
            <span>일기 작성</span>
          </button>

          <button
            type="button"
            id="tab-btn-calendar"
            onClick={() => setActiveTab('calendar')}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
              activeTab === 'calendar'
                ? 'bg-white/80 dark:bg-slate-800 text-indigo-700 dark:text-purple-300 shadow-md border border-white/80'
                : 'text-slate-700 dark:text-slate-200 hover:bg-white/30 dark:hover:bg-slate-800/40'
            }`}
          >
            <CalendarIcon className="w-4 h-4 text-blue-600" />
            <span>감정 달력</span>
          </button>

          <button
            type="button"
            id="tab-btn-analytics"
            onClick={() => setActiveTab('analytics')}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
              activeTab === 'analytics'
                ? 'bg-white/80 dark:bg-slate-800 text-indigo-700 dark:text-purple-300 shadow-md border border-white/80'
                : 'text-slate-700 dark:text-slate-200 hover:bg-white/30 dark:hover:bg-slate-800/40'
            }`}
          >
            <BarChart3 className="w-4 h-4 text-emerald-600" />
            <span>리포트</span>
          </button>

          <button
            type="button"
            id="tab-btn-healing"
            onClick={() => setActiveTab('healing')}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
              activeTab === 'healing'
                ? 'bg-white/80 dark:bg-slate-800 text-pink-700 dark:text-pink-300 shadow-md border border-white/80'
                : 'text-slate-700 dark:text-slate-200 hover:bg-white/30 dark:hover:bg-slate-800/40'
            }`}
          >
            <HeartHandshake className="w-4 h-4 text-pink-500" />
            <span>힐링 쉼터</span>
          </button>
        </nav>

        {/* Desktop Controls (Soundscape + Backup Export) */}
        <div className="hidden sm:flex items-center gap-2">
          {/* Soundscape Selector */}
          <div className="relative">
            <button
              type="button"
              id="header-desktop-sound-btn"
              onClick={() => setShowSoundMenu(!showSoundMenu)}
              className={`px-3.5 py-2 rounded-xl text-xs font-semibold border backdrop-blur-md transition-all flex items-center gap-2 ${
                ambient !== 'off'
                  ? 'bg-white/80 text-indigo-700 border-white shadow-md animate-pulse'
                  : 'bg-white/40 dark:bg-slate-800/50 text-slate-700 dark:text-slate-200 border-white/50 dark:border-slate-700 hover:bg-white/60'
              }`}
            >
              {ambient !== 'off' ? (
                <Volume2 className="w-3.5 h-3.5 text-purple-600" />
              ) : (
                <VolumeX className="w-3.5 h-3.5 text-slate-500" />
              )}
              <span>{soundLabels[ambient].icon}</span>
              <span className="max-w-[85px] truncate">{soundLabels[ambient].name}</span>
            </button>

            {showSoundMenu && (
              <div className="absolute right-0 top-12 w-52 bg-white/85 dark:bg-slate-800/95 backdrop-blur-2xl rounded-2xl shadow-2xl border border-white/60 dark:border-slate-700 p-2 z-50">
                <div className="text-[11px] font-bold text-slate-500 px-2 py-1.5 flex items-center justify-between border-b border-white/30 dark:border-slate-700 mb-1">
                  <span>힐링 사운드스케이프</span>
                  <Moon className="w-3.5 h-3.5 text-purple-500" />
                </div>
                {(Object.keys(soundLabels) as AmbientSoundType[]).map((type) => (
                  <button
                    key={type}
                    type="button"
                    onClick={() => handleSoundChange(type)}
                    className={`w-full text-left px-3 py-2 text-xs rounded-xl flex items-center gap-2 transition-colors ${
                      ambient === type
                        ? 'bg-white dark:bg-slate-700 text-indigo-700 dark:text-purple-300 font-bold shadow-xs'
                        : 'hover:bg-white/50 dark:hover:bg-slate-700/50 text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    <span className="text-sm">{soundLabels[type].icon}</span>
                    <span>{soundLabels[type].name}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Backup export button */}
          <button
            type="button"
            id="export-json-btn"
            onClick={() => exportEntriesToJson(entries)}
            className="p-2.5 rounded-xl text-slate-700 dark:text-slate-200 hover:text-indigo-700 bg-white/40 dark:bg-slate-800/50 border border-white/50 dark:border-slate-700 hover:bg-white/70 text-xs flex items-center gap-1.5 transition-colors backdrop-blur-md"
            title="일기 데이터 백업 다운로드"
          >
            <Download className="w-3.5 h-3.5" />
            <span className="text-[11px] font-bold hidden md:inline">백업</span>
          </button>
        </div>
      </div>
    </header>
  );
};
