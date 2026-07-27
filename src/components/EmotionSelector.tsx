import React from 'react';
import { EMOTIONS } from '../data/emotions';
import { EmotionType } from '../types';

interface EmotionSelectorProps {
  selectedEmotion: EmotionType;
  onSelectEmotion: (emotion: EmotionType) => void;
}

export const EmotionSelector: React.FC<EmotionSelectorProps> = ({
  selectedEmotion,
  onSelectEmotion,
}) => {
  const selectedObj = EMOTIONS.find((e) => e.id === selectedEmotion) || EMOTIONS[0];

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-2.5">
        <label className="text-sm font-bold text-slate-800 dark:text-slate-100 flex items-center gap-1.5">
          <span>오늘 마음속 핵심 감정 선택</span>
          <span className="text-xs font-semibold text-indigo-700 dark:text-purple-300">
            (하나를 클릭해 주세요)
          </span>
        </label>
        <span className="text-xs text-slate-700 dark:text-slate-300 font-bold bg-white/40 dark:bg-slate-800/60 px-3 py-1 rounded-xl border border-white/60 backdrop-blur-md">
          {selectedObj.emoji} {selectedObj.label}
        </span>
      </div>

      <div className="grid grid-cols-4 sm:grid-cols-8 gap-2.5">
        {EMOTIONS.map((item) => {
          const isSelected = selectedEmotion === item.id;
          return (
            <button
              key={item.id}
              type="button"
              id={`emotion-chip-${item.id}`}
              onClick={() => onSelectEmotion(item.id)}
              className={`relative flex flex-col items-center justify-center p-3 rounded-2xl border transition-all duration-300 cursor-pointer backdrop-blur-md ${
                isSelected
                  ? `bg-white/85 dark:bg-slate-800/90 border-white shadow-xl scale-105 ring-2 ring-indigo-400/50`
                  : 'bg-white/30 dark:bg-slate-800/40 border-white/40 dark:border-slate-700/60 hover:bg-white/60 dark:hover:bg-slate-800 hover:scale-102 hover:border-white/80'
              }`}
            >
              <span className={`text-2xl sm:text-3xl transition-transform duration-300 ${isSelected ? 'scale-125' : ''}`}>
                {item.emoji}
              </span>
              <span
                className={`text-xs font-bold mt-1 transition-colors ${
                  isSelected ? 'text-indigo-900 dark:text-purple-200' : 'text-slate-700 dark:text-slate-300'
                }`}
              >
                {item.label}
              </span>

              {isSelected && (
                <div
                  className="absolute -bottom-1 w-2.5 h-2.5 rounded-full bg-indigo-600 dark:bg-purple-400 shadow-sm border border-white"
                />
              )}
            </button>
          );
        })}
      </div>

      {/* Selected Emotion Warm Description Banner */}
      <div className="mt-3.5 px-4 py-2.5 rounded-2xl bg-white/40 dark:bg-purple-950/40 border border-white/60 dark:border-purple-900/50 backdrop-blur-md flex items-center gap-2.5 text-xs text-indigo-900 dark:text-purple-200 shadow-xs">
        <span className="text-lg">{selectedObj.emoji}</span>
        <div className="flex-1">
          <span className="font-extrabold text-indigo-900 dark:text-purple-100 mr-1.5">
            [{selectedObj.label}]
          </span>
          <span className="font-medium text-slate-800 dark:text-slate-200">{selectedObj.description}</span>
        </div>
      </div>
    </div>
  );
};
