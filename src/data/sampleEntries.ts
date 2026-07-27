import { DiaryEntry } from '../types';

function formatDateOffset(daysOffset: number): string {
  const d = new Date();
  d.setDate(d.getDate() + daysOffset);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function getInitialSampleEntries(): DiaryEntry[] {
  return [
    {
      id: 'sample-entry-1',
      date: formatDateOffset(-1),
      time: '21:30',
      content:
        '오늘 시험 성적이 나왔는데 생각했던 것보다 잘 나오지 않아서 속상했다. 친구들은 잘 나온 것 같아 부러웠지만, 그래도 다음엔 공부 방법을 조금 바꾸어서 도전해봐야겠다.',
      emotion: 'sadness',
      tags: ['성적', '고민', '다짐'],
      createdAt: Date.now() - 86400000 * 1,
      updatedAt: Date.now() - 86400000 * 1,
      aiResult: {
        counselorReply:
          '열심히 준비한 만큼 아쉬운 마음이 참 크셨겠어요. 하지만 결코 노력이 사라진 것은 아니랍니다. 오늘 마음의 상처를 따뜻하게 보듬어 주고, "나는 언제든 다시 일어설 수 있다"는 자신감을 품어보세요. 고생 많았어요!',
        song: {
          title: '스물다섯, 스물하나',
          artist: '자우림',
          genre: '인디 록 / 감성 어쿠스틱',
          reason: '지친 마음에 은은한 울림과 깊은 위로를 건네주는 명곡입니다.',
          searchQuery: '자우림 스물다섯 스물하나',
        },
        activity: {
          title: '따뜻한 차 한 잔과 깊은 호흡',
          description:
            '카모마일이나 유자차처럼 따뜻한 음료를 마시며 5분 동안 천천히 호흡을 가다듬어보세요.',
          estimatedMinutes: 10,
          category: 'tea',
        },
        affirmation: '실패는 더 크게 피어날 내일을 위한 준비 과정일 뿐이에요.',
        emotionTemperature: 42,
        keywords: ['시험', '아쉬움', '성장'],
      },
    },
    {
      id: 'sample-entry-2',
      date: formatDateOffset(-3),
      time: '22:15',
      content:
        '학교 방과 후 동아리 활동에서 내가 제안한 아이디어가 친구들에게 좋은 반응을 얻었다! 다 함께 깔깔 웃으며 아이디어를 가꿔나가는 과정이 정말 신나고 행복했다.',
      emotion: 'joy',
      tags: ['동아리', '친구', '성공'],
      createdAt: Date.now() - 86400000 * 3,
      updatedAt: Date.now() - 86400000 * 3,
      aiResult: {
        counselorReply:
          '나의 소중한 생각과 아이디어가 빛을 발하고 친구들과 마음이 통했을 때의 짜릿함! 정말 기분 좋은 하루였겠네요. 이 온기와 기쁨의 에너지를 마음에 차곡차곡 모아두세요!',
        song: {
          title: 'Dynamite',
          artist: 'BTS',
          genre: '디스코 팝',
          reason: '신나고 경쾌한 멜로디로 오늘 하루의 기쁨을 축하해 줄 노래예요.',
          searchQuery: 'BTS Dynamite',
        },
        activity: {
          title: '오늘의 기쁜 순간 다이어리 꾸미기',
          description:
            '오늘 가장 미소 짓게 만든 순간을 그림이나 스티커로 기록해 기억에 남겨보세요.',
          estimatedMinutes: 15,
          category: 'journal',
        },
        affirmation: '나의 창의력과 반짝이는 열정은 사람들에게 긍정의 에너지를 줘요.',
        emotionTemperature: 92,
        keywords: ['아이디어', '동아리', '성취감'],
      },
    },
    {
      id: 'sample-entry-3',
      date: formatDateOffset(-5),
      time: '20:00',
      content:
        '요즘 발표 과제가 많아서 밤마다 가슴이 답답하고 불안하다. 남들 앞에서 말할 때 떨리는 내 모습을 다른 사람이 이상하게 생각할까 봐 걱정이 된다.',
      emotion: 'anxiety',
      tags: ['발표', '불안', '부담감'],
      createdAt: Date.now() - 86400000 * 5,
      updatedAt: Date.now() - 86400000 * 5,
      aiResult: {
        counselorReply:
          '누구나 많은 사람들 앞에 설 때는 두근거리고 긴장하기 마련이에요. 떨리는 모습조차 열정적으로 준비한 당신의 진심이랍니다. 잘해내고 싶은 마음에서 나오는 자연스러운 불안이니 스스로를 지그시 안아주세요.',
        song: {
          title: '수고했어, 오늘도',
          artist: '옥상달빛',
          genre: '어쿠스틱 힐링',
          reason: '토닥토닥 어깨를 두드려주는 따스한 목소리가 불안한 마음을 토닥여줍니다.',
          searchQuery: '옥상달빛 수고했어 오늘도',
        },
        activity: {
          title: '4-7-8 이완 호흡법',
          description:
            '4초 동안 숨을 마시고, 7초 멈추고, 8초간 천천히 내쉬며 몸의 긴장을 풀어주세요.',
          estimatedMinutes: 5,
          category: 'breathe',
        },
        affirmation: '나는 떨려도 괜찮고, 완벽하지 않아도 멋진 사람이에요.',
        emotionTemperature: 38,
        keywords: ['발표', '긴장', '용기'],
      },
    },
    {
      id: 'sample-entry-4',
      date: formatDateOffset(-7),
      time: '19:10',
      content:
        '오랜만에 저녁에 조용히 좋아하는 음악을 들으며 동네 산책을 다녀왔다. 나뭇잎 사이로 부는 바람이 차가웠지만 마음은 오히려 온화하고 편안해지는 기분이었다.',
      emotion: 'calmness',
      tags: ['산책', '휴식', '음악'],
      createdAt: Date.now() - 86400000 * 7,
      updatedAt: Date.now() - 86400000 * 7,
      aiResult: {
        counselorReply:
          '바쁜 하루 속에서 나만을 위한 평온한 시간을 선물하셨네요. 바람 소리와 조용한 발걸음 속에서 마음이 잔잔해지는 순간을 느낄 수 있었던 건 참 소중한 능력이에요.',
        song: {
          title: 'Rest',
          artist: '성시경',
          genre: '발라드',
          reason: '감미로운 음색이 평화로운 노을빛과 산책길을 아름답게 물들여 줍니다.',
          searchQuery: '성시경 Rest',
        },
        activity: {
          title: '자기 전 따스한 수면 스트레칭',
          description:
            '목과 어깨를 가볍게 풀어주며 하루 동안 쌓였던 피로를 부드럽게 털어내세요.',
          estimatedMinutes: 8,
          category: 'stretch',
        },
        affirmation: '조용한 휴식 속에 진짜 나를 만나는 평온함이 넘칩니다.',
        emotionTemperature: 85,
        keywords: ['산책', '평온', '마음챙김'],
      },
    },
  ];
}
