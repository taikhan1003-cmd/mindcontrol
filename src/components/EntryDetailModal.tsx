import React, { useState } from 'react';
import {
  X,
  Trash2,
  Edit2,
  Calendar,
  Clock,
  Sparkles,
  Music,
  ExternalLink,
  Compass,
  Quote,
  Save,
  Tag,
  MessageCircleHeart,
  AlertTriangle,
} from 'lucide-react';
import { DiaryEntry } from '../types';
import { EMOTION_MAP } from '../data/emotions';

interface EntryDetailModalProps {
  entry: DiaryEntry | null;
  onClose: () => void;
  onUpdateEntry: (id: string, newContent: string) => void;
  onDeleteEntry: (id: string) => void;
}

export const EntryDetailModal: React.FC<EntryDetailModalProps> = ({
  entry,
  onClose,
  onUpdateEntry,
  onDeleteEntry,
}) => {
  if (!entry) return null;

  const [isEditing, setIsEditing] = useState(false);
  const [editedContent, setEditedContent] = useState(entry.content);
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);

  const emotionObj = EMOTION_MAP[entry.emotion] || EMOTION_MAP.joy;

  const handleSaveEdit = () => {
    if (!editedContent.trim()) return;
    onUpdateEntry(entry.id, editedContent.trim());
    setIsEditing(false);
  };

  const handleDelete = () => {
    onDeleteEntry(entry.id);
    onClose();
  };

  const youtubeSearchUrl = entry.aiResult
    ? `https://www.youtube.com/results?search_query=${encodeURIComponent(
        entry.aiResult.song.searchQuery ||
          `${entry.aiResult.song.artist} ${entry.aiResult.song.title}`
      )}`
    : '#';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-md animate-fade-in">
      <div
        className="w-full max-w-2xl max-h-[90vh] overflow-y-auto glass-card dark:glass-card-dark rounded-[32px] p-6 sm:p-8 shadow-2xl border border-white/60 dark:border-slate-700 relative space-y-6 backdrop-blur-md"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-white/40 dark:border-slate-700 pb-4">
          <div className="flex items-center gap-3">
            <span className="text-3xl p-2.5 rounded-2xl bg-white/60 dark:bg-slate-800 border border-white shadow-xs">
              {emotionObj.emoji}
            </span>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-base font-extrabold text-slate-900 dark:text-slate-100">
                  {entry.date}
                </span>
                <span className="text-xs px-3 py-0.5 rounded-full font-extrabold bg-white/80 dark:bg-purple-900/50 text-indigo-900 dark:text-purple-300 border border-white">
                  {emotionObj.label}
                </span>
              </div>
              <div className="flex items-center gap-2 text-xs text-slate-500 font-semibold mt-0.5">
                <Clock className="w-3.5 h-3.5 text-indigo-600" />
                <span>{entry.time || '기록 완료'}</span>
              </div>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-1.5">
            {!isEditing ? (
              <button
                type="button"
                id="edit-entry-modal-btn"
                onClick={() => setIsEditing(true)}
                className="p-2 rounded-xl text-slate-700 hover:text-indigo-900 hover:bg-white/60 dark:hover:bg-slate-800 transition-all border border-transparent hover:border-white/60"
                title="일기 수정"
              >
                <Edit2 className="w-4 h-4" />
              </button>
            ) : (
              <button
                type="button"
                id="save-edit-modal-btn"
                onClick={handleSaveEdit}
                className="px-3.5 py-1.5 rounded-xl bg-white/90 text-indigo-900 font-extrabold text-xs flex items-center gap-1 border border-white shadow-md hover:bg-white transition-all cursor-pointer"
              >
                <Save className="w-3.5 h-3.5 text-indigo-600" />
                <span>저장</span>
              </button>
            )}

            <button
              type="button"
              id="delete-entry-modal-btn"
              onClick={() => setShowConfirmDelete(true)}
              className="p-2 rounded-xl text-slate-700 hover:text-rose-600 hover:bg-rose-50/60 dark:hover:bg-slate-800 transition-all"
              title="일기 삭제"
            >
              <Trash2 className="w-4 h-4" />
            </button>

            <button
              type="button"
              id="close-entry-modal-btn"
              onClick={onClose}
              className="p-2 rounded-xl text-slate-700 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-white/60 dark:hover:bg-slate-800 transition-all border border-transparent hover:border-white/60"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Delete Confirmation Alert Banner */}
        {showConfirmDelete && (
          <div className="p-4 rounded-2xl bg-rose-50/80 dark:bg-rose-950/80 border border-rose-200 dark:border-rose-900 text-xs text-rose-900 dark:text-rose-200 flex items-center justify-between gap-3 backdrop-blur-md">
            <div className="flex items-center gap-2 font-bold">
              <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
              <span>정말로 이 일기 기록을 삭제하시겠어요?</span>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleDelete}
                className="px-3 py-1 rounded-lg bg-rose-600 text-white font-extrabold hover:bg-rose-700 transition-colors shadow-xs"
              >
                삭제
              </button>
              <button
                type="button"
                onClick={() => setShowConfirmDelete(false)}
                className="px-3 py-1 rounded-lg bg-white/80 dark:bg-slate-700 text-slate-800 dark:text-slate-200 font-bold hover:bg-white border border-white/60"
              >
                취소
              </button>
            </div>
          </div>
        )}

        {/* Diary Content Body */}
        <div className="space-y-3">
          <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-500">
            작성한 일기 본문
          </h3>
          {!isEditing ? (
            <div className="p-4 sm:p-5 rounded-2xl bg-white/40 dark:bg-slate-800/60 border border-white/60 dark:border-slate-700/80 text-sm text-slate-800 dark:text-slate-100 whitespace-pre-line leading-relaxed font-medium shadow-xs backdrop-blur-md">
              {entry.content}
            </div>
          ) : (
            <textarea
              value={editedContent}
              onChange={(e) => setEditedContent(e.target.value)}
              rows={5}
              className="w-full p-4 rounded-2xl bg-white/60 dark:bg-slate-800 border border-white/80 focus:outline-none focus:ring-2 focus:ring-white text-sm font-medium text-slate-800 dark:text-slate-100 backdrop-blur-md"
            />
          )}

          {/* Tags */}
          {entry.tags && entry.tags.length > 0 && (
            <div className="flex flex-wrap items-center gap-1.5 pt-1">
              <Tag className="w-3.5 h-3.5 text-slate-500" />
              {entry.tags.map((t) => (
                <span
                  key={t}
                  className="px-3 py-0.5 rounded-lg bg-white/50 dark:bg-purple-950 text-indigo-900 dark:text-purple-300 text-xs font-bold border border-white/80"
                >
                  #{t}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* AI Counselor Response Section */}
        {entry.aiResult && (
          <div className="space-y-4 pt-4 border-t border-white/40 dark:border-slate-700">
            <div className="flex items-center gap-2 text-sm font-extrabold text-slate-900 dark:text-slate-100">
              <MessageCircleHeart className="w-4 h-4 text-pink-500" />
              <span>AI 마음 상담사의 힐링 답장</span>
            </div>

            <div className="p-5 rounded-2xl bg-white/60 dark:from-slate-800 dark:to-slate-900 border border-white dark:border-slate-700/80 text-sm text-slate-800 dark:text-slate-200 leading-relaxed font-medium backdrop-blur-md shadow-xs">
              {entry.aiResult.counselorReply}
            </div>

            {/* Song & Activity Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="p-4 rounded-2xl bg-white/40 dark:bg-slate-800/80 border border-white/60 dark:border-slate-700/80 space-y-2 backdrop-blur-md">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-extrabold text-indigo-900 dark:text-indigo-400 flex items-center gap-1">
                    <Music className="w-3.5 h-3.5 text-indigo-600" />
                    추천 노래
                  </span>
                  <a
                    href={youtubeSearchUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[11px] text-indigo-700 hover:underline flex items-center gap-1 font-extrabold"
                  >
                    <span>들어보기</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
                <p className="text-xs font-extrabold text-slate-900 dark:text-slate-100">
                  {entry.aiResult.song.artist} - {entry.aiResult.song.title}
                </p>
                <p className="text-[11px] font-semibold text-slate-600">
                  {entry.aiResult.song.reason}
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-white/40 dark:bg-slate-800/80 border border-white/60 dark:border-slate-700/80 space-y-2 backdrop-blur-md">
                <span className="text-xs font-extrabold text-emerald-800 dark:text-emerald-400 flex items-center gap-1">
                  <Compass className="w-3.5 h-3.5 text-emerald-600" />
                  추천 힐링 활동
                </span>
                <p className="text-xs font-extrabold text-slate-900 dark:text-slate-100">
                  {entry.aiResult.activity.title}
                </p>
                <p className="text-[11px] font-semibold text-slate-600">
                  {entry.aiResult.activity.description}
                </p>
              </div>
            </div>

            {/* Affirmation */}
            <div className="p-3.5 rounded-2xl bg-white/50 dark:bg-amber-950/40 border border-white text-center text-xs font-extrabold text-slate-800 dark:text-amber-200 backdrop-blur-md">
              ✨ "{entry.aiResult.affirmation}"
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
