import React, { useState } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  Calendar as CalendarIcon,
  Plus,
  Heart,
  Sparkles,
} from 'lucide-react';
import { DiaryEntry } from '../types';
import { EMOTION_MAP, EMOTIONS } from '../data/emotions';

interface EmotionCalendarProps {
  entries: DiaryEntry[];
  onSelectEntry: (entry: DiaryEntry) => void;
  onSelectDateToCreate: (dateStr: string) => void;
}

export const EmotionCalendar: React.FC<EmotionCalendarProps> = ({
  entries,
  onSelectEntry,
  onSelectDateToCreate,
}) => {
  const [currentDate, setCurrentDate] = useState(() => new Date());

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth(); // 0-indexed

  // Navigation handlers
  const handlePrevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  const handleToday = () => {
    setCurrentDate(new Date());
  };

  // Build entry map by date string YYYY-MM-DD
  const entryMap = new Map<string, DiaryEntry>();
  entries.forEach((e) => {
    entryMap.set(e.date, e);
  });

  // Calculate days for the calendar grid
  const firstDayIndex = new Date(year, month, 1).getDay(); // 0 (Sun) - 6 (Sat)
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const daysArray: (number | null)[] = [];
  for (let i = 0; i < firstDayIndex; i++) {
    daysArray.push(null);
  }
  for (let d = 1; d <= daysInMonth; d++) {
    daysArray.push(d);
  }

  const todayStr = new Date().toISOString().slice(0, 10);

  return (
    <div className="w-full glass-card dark:glass-card-dark rounded-[32px] p-6 sm:p-8 shadow-2xl shadow-indigo-500/10 border border-white/50 dark:border-slate-700/80 space-y-6">
      {/* Calendar Header */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 border-b border-white/40 dark:border-slate-700 pb-4">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-2xl bg-white/60 dark:bg-slate-800 text-indigo-700 dark:text-purple-300 shadow-md border border-white backdrop-blur-md">
            <CalendarIcon className="w-5 h-5 text-indigo-600 dark:text-purple-300" />
          </div>
          <div>
            <h2 className="text-lg sm:text-xl font-extrabold text-slate-800 dark:text-slate-100">
              {year}년 {month + 1}월의 감정 달력
            </h2>
            <p className="text-xs text-slate-600 dark:text-slate-400 font-medium">
              날짜별 이모지를 클릭하면 작성했던 일기와 AI 힐링 답장을 볼 수 있어요
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            id="calendar-today-btn"
            onClick={handleToday}
            className="px-3.5 py-1.5 rounded-xl bg-white/50 dark:bg-purple-950/50 text-indigo-900 dark:text-purple-200 font-bold text-xs border border-white/60 dark:border-purple-800/60 hover:bg-white/80 transition-all backdrop-blur-md shadow-xs cursor-pointer"
          >
            오늘로 이동
          </button>
          <div className="flex items-center gap-1 bg-white/30 dark:bg-slate-800/80 p-1 rounded-xl border border-white/40 backdrop-blur-md">
            <button
              type="button"
              id="calendar-prev-month-btn"
              onClick={handlePrevMonth}
              className="p-1.5 rounded-lg text-slate-700 dark:text-slate-200 hover:bg-white/60 dark:hover:bg-slate-700 transition-colors"
              title="이전 달"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              type="button"
              id="calendar-next-month-btn"
              onClick={handleNextMonth}
              className="p-1.5 rounded-lg text-slate-700 dark:text-slate-200 hover:bg-white/60 dark:hover:bg-slate-700 transition-colors"
              title="다음 달"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Weekday Labels Header */}
      <div className="grid grid-cols-7 gap-1 sm:gap-2 text-center text-xs font-extrabold text-slate-600 dark:text-slate-400 uppercase tracking-wider">
        <span className="text-rose-600">일</span>
        <span>월</span>
        <span>화</span>
        <span>수</span>
        <span>목</span>
        <span>금</span>
        <span className="text-indigo-600">토</span>
      </div>

      {/* Grid Days */}
      <div className="grid grid-cols-7 gap-1.5 sm:gap-2.5">
        {daysArray.map((dayNum, index) => {
          if (dayNum === null) {
            return <div key={`empty-${index}`} className="h-16 sm:h-24 rounded-2xl bg-transparent" />;
          }

          const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(
            dayNum
          ).padStart(2, '0')}`;
          const entry = entryMap.get(dateStr);
          const isToday = dateStr === todayStr;
          const emotionObj = entry ? EMOTION_MAP[entry.emotion] : null;

          return (
            <div
              key={dateStr}
              onClick={() => {
                if (entry) {
                  onSelectEntry(entry);
                } else {
                  onSelectDateToCreate(dateStr);
                }
              }}
              className={`h-20 sm:h-24 rounded-2xl p-1.5 sm:p-2 border transition-all duration-300 cursor-pointer flex flex-col justify-between relative group backdrop-blur-md ${
                entry
                  ? `bg-white/80 dark:bg-slate-800/90 border-white shadow-md hover:shadow-xl hover:scale-[1.03]`
                  : 'bg-white/30 dark:bg-slate-800/30 border-white/40 dark:border-slate-700/50 hover:bg-white/60 dark:hover:bg-slate-800 hover:border-white'
              } ${isToday ? 'ring-2 ring-indigo-500 ring-offset-2 dark:ring-offset-slate-900 font-extrabold' : ''}`}
            >
              {/* Day Number Header */}
              <div className="flex items-center justify-between w-full">
                <span
                  className={`text-xs font-bold px-1.5 py-0.5 rounded-md ${
                    isToday
                      ? 'bg-indigo-600 text-white'
                      : index % 7 === 0
                      ? 'text-rose-600'
                      : index % 7 === 6
                      ? 'text-indigo-600'
                      : 'text-slate-700 dark:text-slate-300'
                  }`}
                >
                  {dayNum}
                </span>

                {entry && (
                  <span className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse" />
                )}
              </div>

              {/* Cell Center Content */}
              {entry ? (
                <div className="flex-1 flex flex-col items-center justify-center my-0.5">
                  <span className="text-2xl sm:text-3xl filter drop-shadow-xs transition-transform duration-300 group-hover:scale-125">
                    {emotionObj?.emoji}
                  </span>
                  <span className="text-[10px] font-extrabold text-indigo-900 dark:text-slate-200 hidden sm:block truncate max-w-[50px]">
                    {emotionObj?.label}
                  </span>
                </div>
              ) : (
                <div className="flex-1 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <span className="p-1 rounded-full bg-white/70 text-indigo-700 dark:bg-purple-900/50 text-xs shadow-xs">
                    <Plus className="w-3.5 h-3.5" />
                  </span>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Legend Bar */}
      <div className="pt-4 border-t border-white/40 dark:border-slate-700">
        <div className="text-xs font-bold text-slate-600 dark:text-slate-300 mb-2.5 flex items-center gap-1">
          <Sparkles className="w-3.5 h-3.5 text-amber-500" />
          <span>감정 이모지 범례</span>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          {EMOTIONS.map((emo) => (
            <div
              key={emo.id}
              className="flex items-center gap-1 px-3 py-1 rounded-xl bg-white/40 dark:bg-slate-800/60 border border-white/60 dark:border-slate-700 text-xs text-slate-800 dark:text-slate-200 shadow-2xs backdrop-blur-md"
            >
              <span>{emo.emoji}</span>
              <span className="font-bold text-[11px]">{emo.label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
