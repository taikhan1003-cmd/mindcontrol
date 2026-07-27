import React, { useState } from 'react';
import {
  Sparkles,
  Calendar,
  Mic,
  MicOff,
  Send,
  Lightbulb,
  Heart,
  Loader2,
  Tag,
  CheckCircle2,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { EmotionSelector } from './EmotionSelector';
import { EmotionType, DiaryEntry, AiAnalysisResult } from '../types';
import { addDiaryEntry } from '../utils/storage';

interface DiaryFormProps {
  onEntryAdded: (newEntry: DiaryEntry) => void;
  onSetAiResult: (result: AiAnalysisResult, entry: DiaryEntry) => void;
}

const PROMPT_SUGGESTIONS = [
  '오늘 나를 지치게 하거나 미소 짓게 만든 사건은 무엇이었나요?',
  '누군가에게 차마 털어놓지 못했던 솔직한 마음 속 이야기가 있나요?',
  '오늘 하루 중 가장 수고했던 나 자신에게 어떤 말을 건네고 싶나요?',
  '지금 내 마음 상태를 날씨나 색깔로 표현한다면 어떤 모습인가요?',
];

export const DiaryForm: React.FC<DiaryFormProps> = ({
  onEntryAdded,
  onSetAiResult,
}) => {
  const [date, setDate] = useState(() => new Date().toISOString().slice(0, 10));
  const [emotion, setEmotion] = useState<EmotionType>('joy');
  const [content, setContent] = useState('');
  const [tagInput, setTagInput] = useState('');
  const [tags, setTags] = useState<string[]>(['일상', '마음일기']);
  const [isListening, setIsListening] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingMsgIdx, setLoadingMsgIdx] = useState(0);

  const loadingMessages = [
    'AI 마음 상담사가 소중한 일기를 가만히 읽어내려가고 있어요...',
    '오늘 마음 상태에 꼭 맞는 공감과 따뜻한 위로의 답장을 쓰고 있어요...',
    '당신의 마음에 포근한 온기를 더해 줄 힐링 음악과 활동을 찾고 있어요...',
  ];

  // Voice Recognition Handler (Web Speech API)
  const handleVoiceInput = () => {
    /* eslint-disable @typescript-eslint/no-explicit-any */
    const windowObj = window as any;
    const SpeechRecognitionClass = windowObj.SpeechRecognition || windowObj.webkitSpeechRecognition;

    if (!SpeechRecognitionClass) {
      alert('사용 중인 브라우저에서 음성 인식을 지원하지 않습니다. 키보드로 작성해 주세요.');
      return;
    }

    try {
      const recognition = new SpeechRecognitionClass();
      recognition.lang = 'ko-KR';
      recognition.interimResults = false;

      if (!isListening) {
        recognition.start();
        setIsListening(true);

        recognition.onresult = (event: any) => {
          const transcript = event.results[0][0].transcript;
          setContent((prev) => (prev ? `${prev} ${transcript}` : transcript));
          setIsListening(false);
        };

        recognition.onerror = () => {
          setIsListening(false);
        };

        recognition.onend = () => {
          setIsListening(false);
        };
      } else {
        setIsListening(false);
      }
    } catch (err) {
      console.error(err);
      setIsListening(false);
    }
  };

  const handleAddTag = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      const trimmed = tagInput.trim().replace(/^#/, '');
      if (trimmed && !tags.includes(trimmed) && tags.length < 5) {
        setTags([...tags, trimmed]);
        setTagInput('');
      }
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter((t) => t !== tagToRemove));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) {
      alert('오늘의 마음 일기를 조금이라도 작성해 주세요.');
      return;
    }

    setIsLoading(true);

    // Message rotation during loading
    const interval = setInterval(() => {
      setLoadingMsgIdx((prev) => (prev + 1) % loadingMessages.length);
    }, 2000);

    try {
      const res = await fetch('/api/analyze-entry', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          content,
          emotion,
          date,
        }),
      });

      const aiData: AiAnalysisResult = await res.json();

      const time = new Date().toLocaleTimeString('ko-KR', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: false,
      });

      const newEntry = addDiaryEntry({
        date,
        time,
        content: content.trim(),
        emotion,
        tags,
        aiResult: aiData,
      });

      onEntryAdded(newEntry);
      onSetAiResult(aiData, newEntry);

      // Trigger starry healing confetti!
      confetti({
        particleCount: 65,
        spread: 80,
        origin: { y: 0.6 },
        colors: ['#f472b6', '#a78bfa', '#60a5fa', '#fbbf24', '#34d399'],
      });

      // Clear input
      setContent('');
    } catch (err) {
      console.error('API call failed:', err);
      alert('답장을 작성하는 중 오류가 발생하여 기본 위로 메시지가 생성됩니다.');
    } finally {
      clearInterval(interval);
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full glass-card dark:glass-card-dark rounded-[32px] p-6 sm:p-8 shadow-2xl shadow-indigo-500/10 border border-white/50 dark:border-slate-700/80 relative overflow-hidden transition-all">
      {/* Background Decorative Gradient Aura */}
      <div className="absolute -top-24 -right-24 w-64 h-64 bg-gradient-to-br from-pink-300/40 via-purple-300/30 to-indigo-300/20 rounded-full blur-3xl pointer-events-none" />

      <form onSubmit={handleSubmit} className="relative z-10 space-y-6">
        {/* Header line: Date & Prompt Suggestion Dropdown */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/40 dark:border-slate-700/80 pb-4">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-white/50 text-indigo-700 dark:bg-purple-900/50 dark:text-purple-300 backdrop-blur-md">
              <Calendar className="w-4 h-4" />
            </div>
            <div>
              <label className="block text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                일기 날짜
              </label>
              <input
                type="date"
                id="diary-date-picker"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="bg-transparent font-bold text-sm text-slate-800 dark:text-slate-100 focus:outline-none cursor-pointer"
              />
            </div>
          </div>

          {/* Quick Prompt Button */}
          <div className="flex items-center gap-1.5 text-xs font-semibold text-indigo-900 dark:text-purple-200 bg-white/40 dark:bg-purple-950/40 px-3.5 py-1.5 rounded-xl border border-white/60 dark:border-purple-800/60 backdrop-blur-md">
            <Lightbulb className="w-3.5 h-3.5 text-amber-500 animate-bounce" />
            <span>생각이 떠오르지 않는다면? 아래 가이드 문장을 활용해보세요</span>
          </div>
        </div>

        {/* Emotion Selector */}
        <EmotionSelector
          selectedEmotion={emotion}
          onSelectEmotion={(emo) => setEmotion(emo)}
        />

        {/* Text Area Input */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-sm font-bold text-slate-800 dark:text-slate-100 flex items-center gap-1.5">
              <span>오늘 하루 이야기</span>
              <span className="text-xs text-slate-500 dark:text-slate-400 font-normal">
                (솔직하고 자유롭게 적어보세요)
              </span>
            </label>

            {/* Voice Dictation Button */}
            <button
              type="button"
              id="voice-dictation-btn"
              onClick={handleVoiceInput}
              className={`flex items-center gap-1 px-3 py-1 rounded-xl text-xs font-bold transition-all backdrop-blur-md ${
                isListening
                  ? 'bg-rose-500 text-white animate-pulse'
                  : 'bg-white/50 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-white/80 hover:text-indigo-700 border border-white/60'
              }`}
            >
              {isListening ? <MicOff className="w-3.5 h-3.5" /> : <Mic className="w-3.5 h-3.5 text-indigo-600" />}
              <span>{isListening ? '듣고 있어요...' : '음성 작성'}</span>
            </button>
          </div>

          <div className="relative">
            <textarea
              id="diary-content-textarea"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="오늘 나를 기쁘게 한 일, 남들에게 털어놓지 못했던 고민, 수고했던 나에게 건네고 싶은 이야기를 편안하게 적어보세요..."
              rows={6}
              maxLength={1500}
              className="w-full p-5 rounded-2xl bg-white/30 dark:bg-slate-800/40 border border-white/50 dark:border-slate-700/80 focus:border-white/80 focus:ring-2 focus:ring-white/50 dark:focus:ring-purple-900/40 text-sm sm:text-base text-slate-800 dark:text-slate-100 placeholder-slate-500/80 dark:placeholder-white/50 focus:outline-none transition-all resize-none shadow-inner backdrop-blur-md"
            />
            <div className="absolute bottom-3 right-4 text-[11px] font-bold text-slate-500/80 dark:text-slate-400">
              {content.length} / 1500자
            </div>
          </div>

          {/* Quick Prompt Chips */}
          <div className="flex flex-wrap gap-1.5 pt-1">
            {PROMPT_SUGGESTIONS.map((prompt, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() =>
                  setContent((prev) =>
                    prev ? `${prev}\n\n[질문] ${prompt}\n` : `[질문] ${prompt}\n`
                  )
                }
                className="text-[11px] font-medium bg-white/40 dark:bg-slate-800/60 hover:bg-white/80 dark:hover:bg-purple-900/50 text-slate-700 dark:text-slate-300 px-3 py-1 rounded-xl border border-white/50 dark:border-slate-700/80 transition-all backdrop-blur-sm"
              >
                + "{prompt.slice(0, 18)}..."
              </button>
            ))}
          </div>
        </div>

        {/* Tags input */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1">
            <Tag className="w-3.5 h-3.5 text-indigo-600" />
            <span>태그 추가 (최대 5개, 엔터 키)</span>
          </label>
          <div className="flex flex-wrap items-center gap-2 p-2.5 rounded-2xl bg-white/30 dark:bg-slate-800/40 border border-white/50 dark:border-slate-700/80 backdrop-blur-md">
            {tags.map((tag) => (
              <span
                key={tag}
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-xl bg-white/70 dark:bg-purple-900/60 text-indigo-800 dark:text-purple-200 text-xs font-bold border border-white/80"
              >
                #{tag}
                <button
                  type="button"
                  onClick={() => handleRemoveTag(tag)}
                  className="hover:text-rose-500 text-indigo-400 ml-0.5 font-bold"
                >
                  ×
                </button>
              </span>
            ))}
            {tags.length < 5 && (
              <input
                type="text"
                id="tag-input-field"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={handleAddTag}
                placeholder="태그 입력 후 Enter..."
                className="text-xs font-semibold bg-transparent text-slate-800 dark:text-slate-200 placeholder-slate-500 focus:outline-none flex-1 min-w-[120px]"
              />
            )}
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          id="submit-diary-btn"
          disabled={isLoading || !content.trim()}
          className={`w-full py-4 px-6 rounded-2xl font-bold text-sm text-indigo-900 sm:text-base shadow-xl transition-all duration-300 flex items-center justify-center gap-2 relative overflow-hidden backdrop-blur-md ${
            isLoading || !content.trim()
              ? 'bg-white/30 text-slate-400 dark:bg-slate-800/40 cursor-not-allowed border border-white/30 shadow-none'
              : 'bg-white/85 hover:bg-white text-indigo-700 dark:bg-purple-600 dark:hover:bg-purple-500 dark:text-white border border-white shadow-lg hover:shadow-indigo-300/50 hover:scale-[1.01] active:scale-[0.99] cursor-pointer'
          }`}
        >
          {isLoading ? (
            <div className="flex items-center gap-2 text-indigo-800 dark:text-white">
              <Loader2 className="w-5 h-5 animate-spin" />
              <span>{loadingMessages[loadingMsgIdx]}</span>
            </div>
          ) : (
            <>
              <Sparkles className="w-5 h-5 text-indigo-600 dark:text-yellow-200" />
              <span>AI 감정 분석 및 힐링 답장 받기</span>
              <Send className="w-4 h-4 ml-1 text-indigo-600 dark:text-white" />
            </>
          )}
        </button>
      </form>
    </div>
  );
};
