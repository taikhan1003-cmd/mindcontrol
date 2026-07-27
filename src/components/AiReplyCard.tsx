import React, { useState } from 'react';
import {
  Sparkles,
  Music,
  Heart,
  ExternalLink,
  Check,
  Quote,
  Thermometer,
  Compass,
  Copy,
  Clock,
  MessageCircleHeart,
} from 'lucide-react';
import { AiAnalysisResult, DiaryEntry } from '../types';
import { EMOTION_MAP } from '../data/emotions';

interface AiReplyCardProps {
  aiResult: AiAnalysisResult;
  entry: DiaryEntry;
}

export const AiReplyCard: React.FC<AiReplyCardProps> = ({ aiResult, entry }) => {
  const [copied, setCopied] = useState(false);
  const emotionObj = EMOTION_MAP[entry.emotion] || EMOTION_MAP.joy;

  const handleCopyReply = () => {
    const textToCopy = `[마음달빛 AI 힐링 답장]\n${aiResult.counselorReply}\n\n🎵 오늘의 힐링 추천 곡: ${aiResult.song.artist} - ${aiResult.song.title}\n✨ 마음 주문: ${aiResult.affirmation}`;
    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const youtubeSearchUrl = `https://www.youtube.com/results?search_query=${encodeURIComponent(
    aiResult.song.searchQuery || `${aiResult.song.artist} ${aiResult.song.title}`
  )}`;

  return (
    <div className="w-full glass-card dark:glass-card-dark rounded-[32px] p-6 sm:p-8 shadow-2xl shadow-indigo-500/10 border border-white/50 dark:border-slate-700/80 space-y-6 relative overflow-hidden transition-all animate-fade-in">
      {/* Decorative background glow */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-gradient-to-bl from-pink-300/30 via-purple-300/20 to-blue-200/20 rounded-full blur-3xl pointer-events-none" />

      {/* Title Header */}
      <div className="flex items-center justify-between border-b border-white/40 dark:border-slate-700 pb-4">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-2xl bg-white/60 dark:bg-slate-800 text-indigo-700 dark:text-purple-300 shadow-md border border-white backdrop-blur-md">
            <MessageCircleHeart className="w-5 h-5 animate-pulse text-indigo-600 dark:text-purple-300" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-extrabold text-slate-800 dark:text-slate-100">
                AI 마음 상담사의 힐링 답장
              </h2>
              <span className="text-xs px-3 py-0.5 rounded-full bg-white/50 dark:bg-purple-950 text-indigo-900 dark:text-purple-200 font-bold border border-white/60 backdrop-blur-md">
                {entry.date}
              </span>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-400 font-medium">
              오늘 선택한 감정: <span className="font-extrabold text-slate-800 dark:text-slate-200">{emotionObj.emoji} {emotionObj.label}</span>
            </p>
          </div>
        </div>

        <button
          type="button"
          id="copy-ai-reply-btn"
          onClick={handleCopyReply}
          className="px-3 py-1.5 rounded-xl bg-white/40 hover:bg-white/70 dark:bg-slate-800/60 text-slate-700 dark:text-slate-200 border border-white/50 transition-all text-xs font-bold flex items-center gap-1.5 backdrop-blur-md shadow-xs cursor-pointer"
          title="답장 복사하기"
        >
          {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4 text-indigo-600" />}
          <span className="hidden sm:inline">{copied ? '복사완료' : '답장복사'}</span>
        </button>
      </div>

      {/* Main Counselor Response Speech Bubble */}
      <div className="relative p-6 sm:p-7 rounded-3xl bg-white/40 dark:bg-slate-800/50 border border-white/60 dark:border-purple-900/50 backdrop-blur-md shadow-sm">
        <Quote className="absolute top-4 left-4 w-8 h-8 text-indigo-300/40 dark:text-purple-900/50 -z-0 opacity-80" />
        <div className="relative z-10 space-y-4">
          <p className="text-sm sm:text-base text-slate-800 dark:text-slate-100 leading-relaxed font-semibold whitespace-pre-line">
            {aiResult.counselorReply}
          </p>

          {/* Emotional Temperature Gauge */}
          <div className="pt-3 border-t border-white/40 dark:border-slate-700/60 flex items-center justify-between text-xs text-slate-600 font-bold">
            <div className="flex items-center gap-1.5 text-indigo-900 dark:text-purple-300">
              <Thermometer className="w-4 h-4 text-rose-500" />
              <span>오늘의 마음 온도: {aiResult.emotionTemperature}°C</span>
            </div>
            <div className="w-32 bg-white/50 dark:bg-slate-700 h-2.5 rounded-full overflow-hidden border border-white/60">
              <div
                className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-500 h-full rounded-full transition-all duration-1000 shadow-xs"
                style={{ width: `${Math.min(100, Math.max(10, aiResult.emotionTemperature))}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Grid: Recommended Song & Healing Activity */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Recommended Song Card */}
        <div className="p-5 sm:p-6 rounded-3xl bg-white/35 dark:bg-slate-800/40 border border-white/50 dark:border-slate-700/80 backdrop-blur-md shadow-sm flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-white/60 text-indigo-700 dark:bg-indigo-900/50 dark:text-indigo-300 border border-white">
                  <Music className="w-4 h-4" />
                </div>
                <span className="text-xs font-extrabold text-slate-800 dark:text-slate-100">
                  오늘의 힐링 추천 곡
                </span>
              </div>
              <span className="text-[11px] font-bold text-indigo-800 dark:text-indigo-300 bg-white/50 dark:bg-indigo-950 px-2.5 py-0.5 rounded-lg border border-white/60">
                {aiResult.song.genre}
              </span>
            </div>

            <div className="mt-2 space-y-1">
              <h3 className="text-base font-extrabold text-slate-900 dark:text-slate-100">
                {aiResult.song.title}
              </h3>
              <p className="text-xs font-bold text-indigo-800 dark:text-purple-300">
                {aiResult.song.artist}
              </p>
              <p className="text-xs text-slate-700 dark:text-slate-300 mt-2 bg-white/40 dark:bg-slate-900/50 p-3 rounded-2xl border border-white/50 dark:border-slate-800 font-medium leading-relaxed">
                💡 {aiResult.song.reason}
              </p>
            </div>
          </div>

          <a
            href={youtubeSearchUrl}
            target="_blank"
            rel="noopener noreferrer"
            id="search-song-youtube-btn"
            className="w-full py-3 px-4 rounded-2xl bg-white/80 hover:bg-white text-indigo-900 dark:bg-indigo-600 dark:hover:bg-indigo-500 dark:text-white font-extrabold text-xs transition-all flex items-center justify-center gap-2 border border-white shadow-sm cursor-pointer"
          >
            <span>YouTube에서 들어보기</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>

        {/* Recommended Healing Activity Card */}
        <div className="p-5 sm:p-6 rounded-3xl bg-white/35 dark:bg-slate-800/40 border border-white/50 dark:border-slate-700/80 backdrop-blur-md shadow-sm flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-white/60 text-emerald-700 dark:bg-emerald-900/50 dark:text-emerald-300 border border-white">
                  <Compass className="w-4 h-4" />
                </div>
                <span className="text-xs font-extrabold text-slate-800 dark:text-slate-100">
                  추천 힐링 미션
                </span>
              </div>
              <span className="text-[11px] font-bold text-emerald-800 dark:text-emerald-300 bg-white/50 dark:bg-emerald-950 px-2.5 py-0.5 rounded-lg border border-white/60 flex items-center gap-1">
                <Clock className="w-3 h-3" />
                약 {aiResult.activity.estimatedMinutes}분
              </span>
            </div>

            <div className="mt-2 space-y-1">
              <h3 className="text-base font-extrabold text-slate-900 dark:text-slate-100">
                {aiResult.activity.title}
              </h3>
              <p className="text-xs text-slate-700 dark:text-slate-300 mt-2 bg-white/40 dark:bg-slate-900/50 p-3 rounded-2xl border border-white/50 dark:border-slate-800 font-medium leading-relaxed">
                🌿 {aiResult.activity.description}
              </p>
            </div>
          </div>

          <div className="w-full py-3 px-4 rounded-2xl bg-white/50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 font-extrabold text-xs flex items-center justify-center gap-1.5 border border-white/60">
            <Heart className="w-3.5 h-3.5 text-pink-500 fill-pink-500" />
            <span>나를 위한 소소한 10분의 휴식 선물</span>
          </div>
        </div>
      </div>

      {/* Today's Affirmation Banner */}
      <div className="p-4 sm:p-5 rounded-3xl bg-white/45 dark:bg-slate-800/60 border border-white/60 dark:border-amber-900/50 backdrop-blur-md text-center space-y-1.5 shadow-sm">
        <div className="text-[11px] font-extrabold tracking-widest uppercase text-amber-800 dark:text-amber-300 flex items-center justify-center gap-1">
          <Sparkles className="w-3.5 h-3.5 text-amber-500" />
          <span>오늘의 마음 주문 (Affirmation)</span>
        </div>
        <p className="text-base sm:text-lg font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">
          "{aiResult.affirmation}"
        </p>
      </div>
    </div>
  );
};
