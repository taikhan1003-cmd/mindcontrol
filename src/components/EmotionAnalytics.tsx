import React, { useState } from 'react';
import {
  BarChart3,
  TrendingUp,
  Sparkles,
  Heart,
  Calendar,
  Smile,
  Thermometer,
  PieChart,
  Search,
  BookOpen,
} from 'lucide-react';
import { DiaryEntry, EmotionType } from '../types';
import { EMOTION_MAP, EMOTIONS } from '../data/emotions';

interface EmotionAnalyticsProps {
  entries: DiaryEntry[];
  onSelectEntry: (entry: DiaryEntry) => void;
}

export const EmotionAnalytics: React.FC<EmotionAnalyticsProps> = ({
  entries,
  onSelectEntry,
}) => {
  const [selectedFilterEmotion, setSelectedFilterEmotion] = useState<EmotionType | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Calculate emotion stats
  const emotionCounts: Record<EmotionType, number> = {
    joy: 0,
    sadness: 0,
    anxiety: 0,
    anger: 0,
    excitement: 0,
    exhaustion: 0,
    calmness: 0,
    loneliness: 0,
  };

  let totalTemp = 0;
  let tempCount = 0;

  entries.forEach((e) => {
    if (emotionCounts[e.emotion] !== undefined) {
      emotionCounts[e.emotion] += 1;
    }
    if (e.aiResult?.emotionTemperature) {
      totalTemp += e.aiResult.emotionTemperature;
      tempCount += 1;
    }
  });

  const totalEntries = entries.length;

  // Find most frequent emotion
  let maxCount = 0;
  let topEmotion: EmotionType | null = null;
  (Object.keys(emotionCounts) as EmotionType[]).forEach((emo) => {
    if (emotionCounts[emo] > maxCount) {
      maxCount = emotionCounts[emo];
      topEmotion = emo;
    }
  });

  const topEmotionObj = topEmotion ? EMOTION_MAP[topEmotion] : null;
  const avgTemp = tempCount > 0 ? Math.round(totalTemp / tempCount) : 60;

  // Filter entries
  const filteredEntries = entries.filter((e) => {
    const matchesEmotion = selectedFilterEmotion === 'all' || e.emotion === selectedFilterEmotion;
    const matchesSearch =
      !searchQuery.trim() ||
      e.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (e.tags && e.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase())));
    return matchesEmotion && matchesSearch;
  });

  return (
    <div className="w-full space-y-6">
      {/* Top Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Total Entries */}
        <div className="glass-card dark:glass-card-dark rounded-3xl p-5 border border-white/50 dark:border-slate-700 flex items-center gap-4 shadow-xl shadow-indigo-500/10 backdrop-blur-md">
          <div className="p-3.5 rounded-2xl bg-white/60 dark:bg-purple-900/50 text-indigo-700 dark:text-purple-300 border border-white">
            <BookOpen className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
              총 기록한 일기
            </span>
            <div className="text-2xl font-extrabold text-slate-800 dark:text-slate-100 mt-0.5">
              {totalEntries} <span className="text-xs font-semibold text-slate-600">편</span>
            </div>
          </div>
        </div>

        {/* Top Emotion */}
        <div className="glass-card dark:glass-card-dark rounded-3xl p-5 border border-white/50 dark:border-slate-700 flex items-center gap-4 shadow-xl shadow-indigo-500/10 backdrop-blur-md">
          <div className="p-3.5 rounded-2xl bg-white/60 dark:bg-pink-900/50 text-pink-600 dark:text-pink-300 border border-white">
            <Smile className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
              가장 많이 느낀 감정
            </span>
            <div className="text-xl font-extrabold text-slate-800 dark:text-slate-100 mt-0.5 flex items-center gap-1.5">
              {topEmotionObj ? (
                <>
                  <span>{topEmotionObj.emoji}</span>
                  <span>{topEmotionObj.label}</span>
                  <span className="text-xs text-indigo-800 font-bold">({maxCount}회)</span>
                </>
              ) : (
                <span className="text-sm font-medium text-slate-400">기록 대기 중</span>
              )}
            </div>
          </div>
        </div>

        {/* Avg Emotional Temperature */}
        <div className="glass-card dark:glass-card-dark rounded-3xl p-5 border border-white/50 dark:border-slate-700 flex items-center gap-4 shadow-xl shadow-indigo-500/10 backdrop-blur-md">
          <div className="p-3.5 rounded-2xl bg-white/60 dark:bg-amber-900/50 text-amber-600 dark:text-amber-300 border border-white">
            <Thermometer className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
              평균 마음 온도 지수
            </span>
            <div className="text-2xl font-extrabold text-slate-800 dark:text-slate-100 mt-0.5">
              {avgTemp}°C
            </div>
          </div>
        </div>
      </div>

      {/* Emotion Breakdown Bars */}
      <div className="glass-card dark:glass-card-dark rounded-[32px] p-6 sm:p-8 border border-white/50 dark:border-slate-700 space-y-4 backdrop-blur-md">
        <div className="flex items-center justify-between border-b border-white/40 dark:border-slate-700 pb-3">
          <div className="flex items-center gap-2">
            <PieChart className="w-5 h-5 text-indigo-600" />
            <h3 className="text-base sm:text-lg font-extrabold text-slate-800 dark:text-slate-100">
              감정 분포 리포트
            </h3>
          </div>
          <span className="text-xs font-bold text-slate-600">
            총 {totalEntries}개 감정 기록 분석
          </span>
        </div>

        <div className="space-y-3 pt-2">
          {EMOTIONS.map((emo) => {
            const count = emotionCounts[emo.id] || 0;
            const percentage = totalEntries > 0 ? Math.round((count / totalEntries) * 100) : 0;

            return (
              <div key={emo.id} className="space-y-1">
                <div className="flex items-center justify-between text-xs font-bold">
                  <div className="flex items-center gap-1.5 text-slate-800 dark:text-slate-200">
                    <span>{emo.emoji}</span>
                    <span>{emo.label}</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-600">
                    <span>{count}회</span>
                    <span className="w-10 text-right font-extrabold text-indigo-800">{percentage}%</span>
                  </div>
                </div>

                <div className="w-full bg-white/40 dark:bg-slate-800 h-2.5 rounded-full overflow-hidden border border-white/50">
                  <div
                    className={`h-full rounded-full transition-all duration-700 bg-gradient-to-r ${emo.gradient}`}
                    style={{ width: `${percentage}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Search & Filter Past Entries List */}
      <div className="glass-card dark:glass-card-dark rounded-[32px] p-6 sm:p-8 border border-white/50 dark:border-slate-700 space-y-5 backdrop-blur-md">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/40 dark:border-slate-700 pb-3">
          <h3 className="text-base sm:text-lg font-extrabold text-slate-800 dark:text-slate-100 flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-indigo-600" />
            <span>감정일기 타임라인 검색</span>
          </h3>

          {/* Search input */}
          <div className="relative w-full sm:w-64">
            <Search className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
            <input
              type="text"
              id="analytics-search-input"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="일기 내용 또는 태그 검색..."
              className="w-full pl-9 pr-3 py-1.5 rounded-xl bg-white/40 dark:bg-slate-800 border border-white/60 dark:border-slate-700 text-xs font-semibold text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-white/80 placeholder-slate-500 backdrop-blur-md"
            />
          </div>
        </div>

        {/* Filter emotion chips */}
        <div className="flex flex-wrap items-center gap-1.5">
          <button
            type="button"
            onClick={() => setSelectedFilterEmotion('all')}
            className={`px-3 py-1.5 rounded-xl text-xs font-extrabold transition-all ${
              selectedFilterEmotion === 'all'
                ? 'bg-white/90 text-indigo-900 shadow-md border border-white'
                : 'bg-white/30 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-white/60 border border-white/40'
            }`}
          >
            전체 보기
          </button>
          {EMOTIONS.map((emo) => (
            <button
              key={emo.id}
              type="button"
              onClick={() => setSelectedFilterEmotion(emo.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-extrabold flex items-center gap-1 transition-all ${
                selectedFilterEmotion === emo.id
                  ? 'bg-white/90 text-indigo-900 shadow-md border border-white'
                  : 'bg-white/30 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-white/40 hover:bg-white/60'
              }`}
            >
              <span>{emo.emoji}</span>
              <span>{emo.label}</span>
            </button>
          ))}
        </div>

        {/* Filtered Entry Cards List */}
        <div className="space-y-3 pt-2">
          {filteredEntries.length === 0 ? (
            <div className="text-center py-8 text-slate-600 font-medium text-xs">
              조건에 맞는 일기 기록이 없어요. 새로운 마음 일기를 작성해보세요!
            </div>
          ) : (
            filteredEntries.map((entry) => {
              const emotionObj = EMOTION_MAP[entry.emotion] || EMOTION_MAP.joy;

              return (
                <div
                  key={entry.id}
                  onClick={() => onSelectEntry(entry)}
                  className="p-4 sm:p-5 rounded-2xl bg-white/40 dark:bg-slate-800/60 border border-white/60 dark:border-slate-700/80 hover:bg-white/70 hover:shadow-lg transition-all cursor-pointer space-y-2 group backdrop-blur-md"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-xl">{emotionObj.emoji}</span>
                      <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                        {entry.date}
                      </span>
                      <span className="text-[11px] font-extrabold text-indigo-900 dark:text-purple-200 bg-white/60 dark:bg-purple-950 px-2.5 py-0.5 rounded-md border border-white/80">
                        {emotionObj.label}
                      </span>
                    </div>
                    <span className="text-xs text-indigo-700 font-extrabold group-hover:underline">
                      상세 보기 →
                    </span>
                  </div>

                  <p className="text-xs text-slate-700 dark:text-slate-300 line-clamp-2 leading-relaxed font-medium">
                    {entry.content}
                  </p>

                  {entry.aiResult && (
                    <div className="pt-2 border-t border-white/40 dark:border-slate-700/60 flex items-center justify-between text-[11px] text-slate-600">
                      <span className="text-pink-700 font-bold truncate max-w-[260px]">
                        💬 {entry.aiResult.counselorReply}
                      </span>
                      <span className="font-extrabold text-indigo-900 shrink-0 ml-2">
                        🎵 {entry.aiResult.song.artist} - {entry.aiResult.song.title}
                      </span>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};
