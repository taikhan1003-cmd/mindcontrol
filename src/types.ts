export type EmotionType =
  | 'joy'
  | 'sadness'
  | 'anxiety'
  | 'anger'
  | 'excitement'
  | 'exhaustion'
  | 'calmness'
  | 'loneliness';

export interface EmotionOption {
  id: EmotionType;
  emoji: string;
  label: string;
  description: string;
  color: string;
  gradient: string;
  bgGlow: string;
  borderColor: string;
  textColor: string;
}

export interface SongRecommendation {
  title: string;
  artist: string;
  genre: string;
  reason: string;
  searchQuery: string;
}

export interface HealingActivity {
  title: string;
  description: string;
  estimatedMinutes: number;
  category: 'walk' | 'music' | 'tea' | 'journal' | 'stretch' | 'rest' | 'breathe';
}

export interface AiAnalysisResult {
  counselorReply: string; // 따뜻한 위로와 공감의 답장
  song: SongRecommendation; // 추천 노래
  activity: HealingActivity; // 추천 힐링 활동
  affirmation: string; // 오늘의 마음 주문 / 긍정 확언
  emotionTemperature: number; // 0 ~ 100 감정 에너지
  keywords: string[];
}

export interface DiaryEntry {
  id: string;
  date: string; // YYYY-MM-DD
  time: string; // HH:mm
  content: string;
  emotion: EmotionType;
  tags?: string[];
  aiResult?: AiAnalysisResult;
  createdAt: number;
  updatedAt: number;
}

export interface MonthlyStats {
  totalEntries: number;
  emotionCounts: Record<EmotionType, number>;
  mostFrequentEmotion: EmotionType | null;
  averageTemperature: number;
  reflectionSummary?: string;
}
