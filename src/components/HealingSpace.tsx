import React, { useState, useEffect } from 'react';
import {
  HeartHandshake,
  Wind,
  Volume2,
  VolumeX,
  Sparkles,
  Shuffle,
  Smile,
  Play,
  Pause,
  RotateCcw,
  Sun,
  Moon,
  Coffee,
} from 'lucide-react';
import { playAmbientSound, playMeditationChime, AmbientSoundType } from '../utils/audioSynth';

const HEALING_CARDS = [
  {
    title: '나만의 속도 존중하기',
    quote: '남들과 비교하며 조급해하지 않아도 돼요. 꽃들은 저마다 피어나는 계절이 다르듯, 당신의 빛나는 순간도 곧 찾아올 거예요.',
    color: 'from-amber-100 to-orange-100 border-amber-200 text-amber-900',
    emoji: '🌸',
  },
  {
    title: '실수해도 괜찮아',
    quote: '처음 가보는 길에서 길을 헤매는 것은 당연해요. 오늘 한 작은 실수는 더 지혜로운 내일을 만들기 위한 예쁜 경험치입니다.',
    color: 'from-pink-100 to-purple-100 border-pink-200 text-pink-900',
    emoji: '💖',
  },
  {
    title: '마음에 가만히 귀 기울이기',
    quote: '화가 나거나 슬플 때 그 감정을 억지로 미워하지 마세요. "아, 내 마음이 지금 쉬고 싶어 하는구나" 하며 조용히 품어주세요.',
    color: 'from-blue-100 to-indigo-100 border-blue-200 text-blue-900',
    emoji: '🌿',
  },
  {
    title: '오늘의 작은 수고 칭찬하기',
    quote: '아침에 일어난 것부터 무사히 하루를 마친 것까지, 당신이 해낸 소소한 일상들은 결코 당연한 게 아니랍니다. 참 수고했어요!',
    color: 'from-emerald-100 to-teal-100 border-emerald-200 text-emerald-900',
    emoji: '✨',
  },
  {
    title: '용기 한 스푼',
    quote: '두렵고 불안할 때는 손을 가슴에 가만히 얹어보세요. 콩닥거리는 심장 소리는 당신이 용기 있게 살아가고 있다는 증거예요.',
    color: 'from-rose-100 to-pink-100 border-rose-200 text-rose-900',
    emoji: '🦁',
  },
];

export const HealingSpace: React.FC = () => {
  // Breathing timer state
  const [isBreathing, setIsBreathing] = useState(false);
  const [breathPhase, setBreathPhase] = useState<'Inhale' | 'Hold' | 'Exhale'>('Inhale');
  const [breathCountdown, setBreathCountdown] = useState(4);
  const [currentSound, setCurrentSound] = useState<AmbientSoundType>('off');

  // Random Healing Card index
  const [cardIndex, setCardIndex] = useState(0);
  const [isFlipping, setIsFlipping] = useState(false);

  const handleNextCard = () => {
    setIsFlipping(true);
    setTimeout(() => {
      setCardIndex((prev) => (prev + 1) % HEALING_CARDS.length);
      setIsFlipping(false);
    }, 200);
  };

  // Soundscape handler
  const handleSoundSelect = (type: AmbientSoundType) => {
    if (currentSound === type) {
      setCurrentSound('off');
      playAmbientSound('off');
    } else {
      setCurrentSound(type);
      playAmbientSound(type);
    }
  };

  // Breathing logic: 4s Inhale -> 7s Hold -> 8s Exhale
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isBreathing) {
      timer = setInterval(() => {
        setBreathCountdown((prev) => {
          if (prev > 1) return prev - 1;

          // Transition phase
          if (breathPhase === 'Inhale') {
            setBreathPhase('Hold');
            return 7;
          } else if (breathPhase === 'Hold') {
            setBreathPhase('Exhale');
            return 8;
          } else {
            playMeditationChime();
            setBreathPhase('Inhale');
            return 4;
          }
        });
      }, 1000);
    }

    return () => clearInterval(timer);
  }, [isBreathing, breathPhase]);

  const toggleBreathing = () => {
    if (!isBreathing) {
      playMeditationChime();
      setBreathPhase('Inhale');
      setBreathCountdown(4);
      setIsBreathing(true);
    } else {
      setIsBreathing(false);
    }
  };

  const currentCard = HEALING_CARDS[cardIndex];

  return (
    <div className="w-full space-y-6">
      {/* Header Banner */}
      <div className="glass-card dark:glass-card-dark rounded-[32px] p-6 sm:p-8 border border-white/50 dark:border-slate-700 shadow-2xl shadow-indigo-500/10 relative overflow-hidden backdrop-blur-md">
        <div className="absolute top-0 right-0 w-72 h-72 bg-gradient-to-br from-pink-300/30 via-purple-300/30 to-indigo-200/20 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <HeartHandshake className="w-6 h-6 text-pink-500" />
              <h2 className="text-xl sm:text-2xl font-extrabold text-slate-800 dark:text-slate-100">
                마음달빛 힐링 쉼터
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 font-medium">
              지친 마음에 차분한 수면 호흡, 힐링 카드, ASMR 사운드스케이프로 따뜻한 안식을 선물해 보세요.
            </p>
          </div>

          <button
            type="button"
            id="meditation-chime-btn"
            onClick={playMeditationChime}
            className="px-4 py-2.5 rounded-2xl bg-white/60 dark:bg-purple-900/50 hover:bg-white/90 text-indigo-900 dark:text-purple-200 font-extrabold text-xs flex items-center gap-2 border border-white shadow-md cursor-pointer shrink-0 backdrop-blur-md transition-all"
          >
            <Sparkles className="w-4 h-4 text-amber-500" />
            <span>528Hz 힐링 싱잉볼 종소리 듣기</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Breathing Exercise Card */}
        <div className="glass-card dark:glass-card-dark rounded-[32px] p-6 sm:p-8 border border-white/50 dark:border-slate-700 space-y-5 flex flex-col justify-between backdrop-blur-md shadow-2xl shadow-indigo-500/10">
          <div className="flex items-center justify-between border-b border-white/40 dark:border-slate-700 pb-3">
            <div className="flex items-center gap-2">
              <Wind className="w-5 h-5 text-indigo-600" />
              <h3 className="text-base sm:text-lg font-extrabold text-slate-800 dark:text-slate-100">
                4-7-8 자율신경 이완 호흡법
              </h3>
            </div>
            <span className="text-xs font-bold text-slate-600">스트레스 & 불안 해소</span>
          </div>

          {/* Animated Pulsing Circle */}
          <div className="flex flex-col items-center justify-center my-4 space-y-4">
            <div className="relative flex items-center justify-center">
              <div
                className={`w-40 h-40 sm:w-48 sm:h-48 rounded-full border-4 border-white/80 dark:border-purple-800 flex flex-col items-center justify-center transition-all duration-1000 shadow-2xl backdrop-blur-md ${
                  isBreathing
                    ? breathPhase === 'Inhale'
                      ? 'scale-125 bg-white/80 text-indigo-950 shadow-indigo-300'
                      : breathPhase === 'Hold'
                      ? 'scale-125 bg-white/90 text-purple-950 shadow-purple-300'
                      : 'scale-90 bg-white/60 text-blue-950 shadow-blue-200'
                    : 'bg-white/40 dark:bg-purple-950/40 text-slate-800 dark:text-purple-200 border-white/60'
                }`}
              >
                <span className="text-xs sm:text-sm font-extrabold tracking-widest uppercase mb-1">
                  {isBreathing
                    ? breathPhase === 'Inhale'
                      ? '숨 들이마시기 (코)'
                      : breathPhase === 'Hold'
                      ? '숨 참기 (멈춤)'
                      : '숨 천천히 내쉬기 (입)'
                    : '준비 되셨나요?'}
                </span>
                <span className="text-4xl sm:text-5xl font-extrabold tracking-tight">
                  {isBreathing ? breathCountdown : '4-7-8'}
                </span>
              </div>
            </div>

            <p className="text-xs font-semibold text-slate-600 text-center max-w-xs leading-relaxed">
              4초 동안 마시고, 7초간 멈추고, 8초 동안 내쉬며 몸의 긴장감을 내려놓으세요.
            </p>
          </div>

          <button
            type="button"
            id="toggle-breathing-btn"
            onClick={toggleBreathing}
            className={`w-full py-3.5 px-6 rounded-2xl font-extrabold text-xs sm:text-sm text-indigo-950 border border-white shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer backdrop-blur-md ${
              isBreathing
                ? 'bg-rose-400/90 hover:bg-rose-500/90 text-white'
                : 'bg-white/80 hover:bg-white text-indigo-900'
            }`}
          >
            {isBreathing ? (
              <>
                <Pause className="w-4 h-4" />
                <span>호흡 운동 일시정지</span>
              </>
            ) : (
              <>
                <Play className="w-4 h-4 fill-indigo-900" />
                <span>4-7-8 이완 호흡 시작하기</span>
              </>
            )}
          </button>
        </div>

        {/* Healing Card Drawer */}
        <div className="glass-card dark:glass-card-dark rounded-[32px] p-6 sm:p-8 border border-white/50 dark:border-slate-700 space-y-5 flex flex-col justify-between backdrop-blur-md shadow-2xl shadow-indigo-500/10">
          <div className="flex items-center justify-between border-b border-white/40 dark:border-slate-700 pb-3">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-amber-500" />
              <h3 className="text-base sm:text-lg font-extrabold text-slate-800 dark:text-slate-100">
                오늘의 마음 힐링 카드
              </h3>
            </div>
            <button
              type="button"
              id="next-healing-card-btn"
              onClick={handleNextCard}
              className="p-2 rounded-xl bg-white/40 dark:bg-purple-950 text-indigo-900 dark:text-purple-300 hover:bg-white/80 text-xs font-extrabold flex items-center gap-1 transition-all border border-white/60 cursor-pointer backdrop-blur-md"
            >
              <Shuffle className="w-3.5 h-3.5" />
              <span>다른 카드 뽑기</span>
            </button>
          </div>

          <div
            className={`p-6 sm:p-7 rounded-2xl bg-white/60 dark:bg-slate-800/80 border border-white shadow-xl space-y-4 transition-all duration-300 my-auto backdrop-blur-md ${
              isFlipping ? 'opacity-0 scale-95' : 'opacity-100 scale-100'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-3xl">{currentCard.emoji}</span>
              <span className="text-xs font-extrabold uppercase tracking-wider text-indigo-800">
                HEALING CARD
              </span>
            </div>

            <h4 className="text-lg font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">
              {currentCard.title}
            </h4>

            <p className="text-xs sm:text-sm leading-relaxed font-bold text-slate-700 dark:text-slate-300">
              "{currentCard.quote}"
            </p>
          </div>

          {/* ASMR Sound Quick Toggles */}
          <div className="space-y-2 pt-2 border-t border-white/40 dark:border-slate-700">
            <span className="text-xs font-bold text-slate-600 block">
              ASMR 백색소음 빠르게 틀기
            </span>
            <div className="grid grid-cols-4 gap-2">
              {[
                { type: 'rain', name: '빗소리', emoji: '🌧️' },
                { type: 'forest', name: '숲소리', emoji: '🌲' },
                { type: 'waves', name: '바다소리', emoji: '🌊' },
                { type: 'fire', name: '장작불', emoji: '🔥' },
              ].map((sound) => {
                const isActive = currentSound === sound.type;
                return (
                  <button
                    key={sound.type}
                    type="button"
                    onClick={() => handleSoundSelect(sound.type as AmbientSoundType)}
                    className={`py-2 px-1 rounded-xl text-xs font-extrabold flex flex-col items-center justify-center border transition-all cursor-pointer backdrop-blur-md ${
                      isActive
                        ? 'bg-white/95 text-indigo-950 border-white shadow-lg scale-105 animate-pulse'
                        : 'bg-white/30 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-white/50 hover:bg-white/60'
                    }`}
                  >
                    <span className="text-base">{sound.emoji}</span>
                    <span className="text-[10px] mt-0.5">{sound.name}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
