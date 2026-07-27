import { GoogleGenAI, Type } from '@google/genai';
import { AiAnalysisResult, EmotionType } from '../types';

export function generateFallbackResponse(content: string, emotion: EmotionType): AiAnalysisResult {
  const emotionMap: Record<string, { reply: string; songTitle: string; artist: string; activity: string; category: 'walk' | 'music' | 'tea' | 'journal' | 'stretch' | 'rest' | 'breathe' }> = {
    joy: {
      reply: '오늘 당신에게서 눈부신 햇살 같은 기쁨이 느껴져요! 반짝이는 순간을 소중히 기억하고 친구들에게도 밝은 에너지를 나누어보세요.',
      songTitle: 'Dynamite',
      artist: 'BTS',
      activity: '오늘 기뻤던 순간을 그림이나 스티커로 일기장에 기록해보기',
      category: 'journal',
    },
    sadness: {
      reply: '마음이 많이 슬프고 가라앉는 날이었군요. 눈물이 나도 괜찮고 슬픈 감정을 꼭꼭 참지 않아도 돼요. 따뜻한 이불속에서 잠시 쉬어가는 건 어떨까요?',
      songTitle: '수고했어, 오늘도',
      artist: '옥상달빛',
      activity: '따뜻한 우유나 차를 마시며 10분간 가만히 휴식하기',
      category: 'tea',
    },
    anxiety: {
      reply: '앞일에 대한 생각으로 가슴이 가늘게 떨리고 걱정이 되었군요. 누구나 불안을 느껴요. 숨을 크게 마시고 내쉬면서 "나는 차근차근 잘해낼 수 있어"라고 되뇌어봐요.',
      songTitle: '가을 아침',
      artist: '아이유',
      activity: '4-7-8 이완 호흡법 3회 실시하기',
      category: 'breathe',
    },
    anger: {
      reply: '답답하고 화가 나서 속이 불타오르는 기분이었을 텐데 참 고생 많았어요. 억지로 화를 누르기보다는 안전한 방법으로 서서히 마음의 열을 식혀보아요.',
      songTitle: 'Tomboy',
      artist: '혁오',
      activity: '시원한 물 한 잔을 마시고 창문 열어 바람 느끼기',
      category: 'stretch',
    },
    excitement: {
      reply: '새로운 생각과 기대로 가슴이 두근거리는 멋진 날이네요! 이 두근거림을 꿈을 향한 작은 도전으로 이어나가보세요.',
      songTitle: '신호등',
      artist: '이무진',
      activity: '미래의 나에게 보내는 짧은 메모 작성해보기',
      category: 'journal',
    },
    exhaustion: {
      reply: '오늘 하루 정말 지치고 에너지가 바닥났군요. 수고 많았어요. 오늘은 아무런 압박감 없이 일찍 누워서 포근한 수면을 취해보세요.',
      songTitle: '밤편지',
      artist: '아이유',
      activity: '가벼운 스트레칭 후 일찍 침대에 눕기',
      category: 'rest',
    },
    calmness: {
      reply: '고요하고 평온한 호수 같은 마음을 유지하셨군요. 이렇게 잔잔한 평화 속에서 나 자신과 만나는 시간이야말로 마음의 큰 자산입니다.',
      songTitle: 'Rest',
      artist: '성시경',
      activity: '좋아하는 음악을 들으며 15분간 가벼운 동네 산책',
      category: 'walk',
    },
    loneliness: {
      reply: '혼자만 남겨진 것 같은 외로움이 마음을 스쳤군요. 떠올려 보면 늘 당신의 편이 되어줄 따뜻한 온기가 가까이에 있답니다. 제가 언제나 당신의 편이에요.',
      songTitle: 'Run with Me',
      artist: '선우정아',
      activity: '좋아하는 반려동물이나 아끼는 인형을 안아주며 마음 안정시키기',
      category: 'rest',
    },
  };

  const info = emotionMap[emotion] || emotionMap.calmness;

  return {
    counselorReply: info.reply,
    song: {
      title: info.songTitle,
      artist: info.artist,
      genre: '힐링 감성',
      reason: '오늘의 마음을 따스하게 차분히 토닥여주는 곡입니다.',
      searchQuery: `${info.artist} ${info.songTitle}`,
    },
    activity: {
      title: info.activity,
      description: '부담 없이 마음을 정리할 수 있는 가벼운 힐링 활동입니다.',
      estimatedMinutes: 10,
      category: info.category,
    },
    affirmation: '나는 있는 그대로 충분히 가치 있고 사랑받는 사람입니다.',
    emotionTemperature: emotion === 'joy' || emotion === 'excitement' ? 88 : 45,
    keywords: ['감정기록', '힐링', '마음챙김'],
  };
}

export async function analyzeDiaryEntry(
  content: string,
  emotion: EmotionType,
  date?: string
): Promise<AiAnalysisResult> {
  // 1. Try server endpoint /api/analyze-entry
  try {
    const res = await fetch('/api/analyze-entry', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ content, emotion, date }),
    });

    const contentType = res.headers.get('content-type') || '';
    if (res.ok && contentType.includes('application/json')) {
      const data = await res.json();
      if (data && data.counselorReply && data.song && data.activity) {
        return data as AiAnalysisResult;
      }
    }
    console.warn(`[AI Service] /api/analyze-entry returned status ${res.status} (${contentType}). Attempting fallback.`);
  } catch (err) {
    console.warn('[AI Service] Endpoint fetch failed:', err);
  }

  // 2. Client-side Gemini direct call if client API key is configured
  /* eslint-disable @typescript-eslint/no-explicit-any */
  const envObj = (import.meta as any).env || {};
  const clientApiKey =
    envObj.VITE_GEMINI_API_KEY ||
    (typeof process !== 'undefined' && process.env ? process.env.GEMINI_API_KEY : undefined);

  if (clientApiKey && clientApiKey !== 'MY_GEMINI_API_KEY') {
    try {
      const ai = new GoogleGenAI({ apiKey: clientApiKey });
      const prompt = `
당신은 청소년을 위한 따뜻하고 전문적인 "AI 마음 힐링 상담사"입니다.
사용자가 작성한 일기와 현재 선택한 감정을 바탕으로 청소년의 눈높이에 맞는 진정성 있고 따뜻한 위로, 감정 공감, 그리고 맞춤형 힐링 노래와 활동을 추천해 주세요.

[사용자 입력]
- 작성 날짜: ${date || '오늘'}
- 선택한 대표 감정: ${emotion}
- 일기 본문: "${content}"

[응답 가이드라인]
1. counselorReply: 3~4문장의 따뜻하고 다정한 다짐과 위로의 메시지 (청소년 언어, 공감대 형성, 압박감 없는 편안한 격려).
2. song: 사용자의 감정에 맞춰 감정을 승화시키거나 마음을 인근해줄 한국 가요/인디/팝 명곡 추천 (제목, 아티스트, 장르, 추천 이유, 유튜브/멜론 검색용 쿼리).
3. activity: 청소년이 집이나 학교, 동네에서 5~15분 내에 쉽게 실천 가능한 현실적인 힐링 활동 (제목, 설명, 소요시간(분), 카테고리: 'walk'|'music'|'tea'|'journal'|'stretch'|'rest'|'breathe').
4. affirmation: 한 문장의 짧고 강력한 "오늘의 마음 주문/긍정 확언".
5. emotionTemperature: 사용자의 마음 에너지/온도 지수 (0~100 숫자).
6. keywords: 일기에서 도출한 핵심 감정 키워드 2~4개.
`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.6-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              counselorReply: { type: Type.STRING },
              song: {
                type: Type.OBJECT,
                properties: {
                  title: { type: Type.STRING },
                  artist: { type: Type.STRING },
                  genre: { type: Type.STRING },
                  reason: { type: Type.STRING },
                  searchQuery: { type: Type.STRING },
                },
                required: ['title', 'artist', 'genre', 'reason', 'searchQuery'],
              },
              activity: {
                type: Type.OBJECT,
                properties: {
                  title: { type: Type.STRING },
                  description: { type: Type.STRING },
                  estimatedMinutes: { type: Type.INTEGER },
                  category: { type: Type.STRING },
                },
                required: ['title', 'description', 'estimatedMinutes', 'category'],
              },
              affirmation: { type: Type.STRING },
              emotionTemperature: { type: Type.INTEGER },
              keywords: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
              },
            },
            required: [
              'counselorReply',
              'song',
              'activity',
              'affirmation',
              'emotionTemperature',
              'keywords',
            ],
          },
        },
      });

      if (response.text) {
        return JSON.parse(response.text) as AiAnalysisResult;
      }
    } catch (clientErr) {
      console.warn('[AI Service] Direct Gemini SDK call failed:', clientErr);
    }
  }

  // 3. Empathetic Fallback Response
  return generateFallbackResponse(content, emotion);
}
