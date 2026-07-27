import { DiaryEntry } from '../types';
import { getInitialSampleEntries } from '../data/sampleEntries';

const STORAGE_KEY = 'ai_emotion_diary_entries_v1';

export function loadDiaryEntries(): DiaryEntry[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      const initial = getInitialSampleEntries();
      saveDiaryEntries(initial);
      return initial;
    }
    const parsed = JSON.parse(raw) as DiaryEntry[];
    return Array.isArray(parsed) ? parsed : [];
  } catch (err) {
    console.error('Failed to load entries from localStorage:', err);
    return getInitialSampleEntries();
  }
}

export function saveDiaryEntries(entries: DiaryEntry[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
  } catch (err) {
    console.error('Failed to save entries to localStorage:', err);
  }
}

export function addDiaryEntry(entry: Omit<DiaryEntry, 'id' | 'createdAt' | 'updatedAt'>): DiaryEntry {
  const entries = loadDiaryEntries();
  const now = Date.now();
  const newEntry: DiaryEntry = {
    ...entry,
    id: `entry_${now}_${Math.random().toString(36).substring(2, 7)}`,
    createdAt: now,
    updatedAt: now,
  };

  // Check if an entry already exists for the same date (optional replacement or prepend)
  const existingIdx = entries.findIndex((e) => e.date === entry.date);
  if (existingIdx !== -1) {
    entries[existingIdx] = newEntry;
  } else {
    entries.unshift(newEntry);
  }

  // Sort by date descending
  entries.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  saveDiaryEntries(entries);
  return newEntry;
}

export function updateDiaryEntry(id: string, updatedFields: Partial<DiaryEntry>): DiaryEntry | null {
  const entries = loadDiaryEntries();
  const index = entries.findIndex((e) => e.id === id);
  if (index === -1) return null;

  entries[index] = {
    ...entries[index],
    ...updatedFields,
    updatedAt: Date.now(),
  };

  saveDiaryEntries(entries);
  return entries[index];
}

export function deleteDiaryEntry(id: string): void {
  const entries = loadDiaryEntries();
  const filtered = entries.filter((e) => e.id !== id);
  saveDiaryEntries(filtered);
}

export function exportEntriesToJson(entries: DiaryEntry[]): void {
  const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(entries, null, 2));
  const downloadAnchor = document.createElement('a');
  downloadAnchor.setAttribute('href', dataStr);
  downloadAnchor.setAttribute('download', `ai_emotion_diary_backup_${new Date().toISOString().slice(0, 10)}.json`);
  document.body.appendChild(downloadAnchor);
  downloadAnchor.click();
  downloadAnchor.remove();
}
