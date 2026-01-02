import { useState, useRef, useEffect } from "react";
import { ChatMessage } from "./ChatMessage";
import { TarotCard } from "./TarotCard";
import { majorArcana, TarotCardData } from "../data/majorArcana";
import { cupsCards, CupCardData } from "../data/cupsCards";
import { motion } from "motion/react";
import { Send, Loader2 } from "lucide-react";
import { tarotApi, generateSessionId, ApiError } from "../../services/api";
import type { CardFromServer } from "../../types/api";

type TarotType = "new-year" | "love" | null;
type Step =
  | "select-type"
  | "waiting-for-question"
  | "loading"
  | "reveal-cards"
  | "chat";

interface Message {
  text: string;
  isUser: boolean;
}

interface DrawnCard {
  card: TarotCardData | CupCardData;
  isReversed: boolean;
  isRevealed: boolean;
  position: string;
}

// 서버 카드명 → 로컬 카드 데이터 매핑
function findCardData(
  cardName: string,
  mode: "year" | "love"
): TarotCardData | CupCardData | undefined {
  if (mode === "year") {
    return majorArcana.find((c) => c.name === cardName);
  } else {
    return cupsCards.find((c) => c.name === cardName);
  }
}

export function TarotChatbot() {
  const [step, setStep] = useState<Step>("select-type");
  const [tarotType, setTarotType] = useState<TarotType>(null);
  const [messages, setMessages] = useState<Message[]>([
    {
      text: "안녕하세요, 반가워요!\n\n오늘 당신의 이야기를 들려주세요.\n\n'신년 타로' 또는 '연애 타로'를 선택해주세요.",
      isUser: false,
    },
  ]);
  const [drawnCards, setDrawnCards] = useState<DrawnCard[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [sessionId, setSessionId] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const [serverReading, setServerReading] = useState<string>("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const addMessage = (text: string, isUser: boolean = false) => {
    setMessages((prev) => [...prev, { text, isUser }]);
  };

  const selectTarotType = (type: TarotType) => {
    setTarotType(type);

    if (type === "new-year") {
      addMessage("신년 타로", true);
      setTimeout(() => {
        addMessage(
          "신년 타로를 선택하셨네요!\n\n2026년, 어떤 이야기가 궁금하신가요?\n\n예시:\n• 올해 나의 재정 운은 어떨까요?\n• 직장에서의 성장이 궁금해요\n• 건강 운세를 알고 싶어요"
        );
        setStep("waiting-for-question");
      }, 500);
    } else if (type === "love") {
      addMessage("연애 타로", true);
      setTimeout(() => {
        addMessage(
          "연애 타로를 선택하셨네요!\n\n마음속 이야기를 들려주세요.\n\n예시:\n• 그 사람의 마음이 궁금해요\n• 새로운 인연을 만날 수 있을까요?\n• 우리의 미래는 어떨까요?"
        );
        setStep("waiting-for-question");
      }, 500);
    }
  };

  // 서버 API로 카드 뽑기 및 해석 받기
  const startReading = async (question: string) => {
    const newSessionId = generateSessionId();
    setSessionId(newSessionId);
    setIsLoading(true);
    setStep("loading");

    addMessage(`"${question}"\n\n카드를 뽑고 있어요...`);

    try {
      const mode = tarotType === "new-year" ? "year" : "love";
      const response = await tarotApi.start({
        session_id: newSessionId,
        mode,
        question,
      });

      // 서버 카드 → 로컬 카드 데이터로 매핑
      const cards: DrawnCard[] = response.cards.map((serverCard: CardFromServer) => {
        const cardData = findCardData(serverCard.name, mode);
        return {
          card: cardData || {
            id: 0,
            name: serverCard.name,
            nameKo: serverCard.name,
            upright: [],
            reversed: [],
            uprightMeaning: "",
            reversedMeaning: "",
          },
          isReversed: serverCard.orientation === "reversed",
          isRevealed: false,
          position: serverCard.position,
        };
      });

      setDrawnCards(cards);
      setServerReading(response.reading);
      setIsLoading(false);
      addMessage("세 장의 카드가 나왔어요!\n카드를 하나씩 눌러서 확인해보세요.");
      setStep("reveal-cards");
    } catch (error) {
      setIsLoading(false);
      if (error instanceof ApiError) {
        addMessage(`앗, 문제가 생겼어요: ${error.message}\n\n다시 시도해주세요.`);
      } else {
        addMessage(
          "서버에 연결할 수 없어요.\n백엔드 서버가 실행 중인지 확인해주세요."
        );
      }
      setStep("waiting-for-question");
    }
  };

  const revealCard = (index: number) => {
    if (drawnCards[index].isRevealed) return;

    const newCards = [...drawnCards];
    newCards[index].isRevealed = true;
    setDrawnCards(newCards);

    // 모든 카드가 뒤집어졌는지 확인
    const allRevealed = newCards.every((c) => c.isRevealed);
    if (allRevealed) {
      setTimeout(() => {
        showReadingResult();
      }, 800);
    }
  };

  // 서버 해석 결과 표시
  const showReadingResult = () => {
    addMessage(serverReading);
    setStep("chat");
    setTimeout(() => {
      addMessage("\n더 궁금한 점이 있으시면 물어봐주세요.\n새로운 리딩을 원하시면 아래 버튼을 눌러주세요.");
    }, 500);
  };

  // 후속 대화 (서버 /chat API 호출)
  const sendFollowUpMessage = async (message: string) => {
    setIsLoading(true);

    try {
      const response = await tarotApi.chat({
        session_id: sessionId,
        message,
      });
      addMessage(response.answer);
    } catch (error) {
      if (error instanceof ApiError) {
        addMessage(`앗, 문제가 생겼어요: ${error.message}`);
      } else {
        addMessage("연결이 끊어졌어요. 다시 시도해주세요.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const reset = () => {
    setStep("select-type");
    setTarotType(null);
    setDrawnCards([]);
    setSessionId("");
    setServerReading("");
    setMessages([
      {
        text: "안녕하세요, 반가워요!\n\n오늘 당신의 이야기를 들려주세요.\n\n'신년 타로' 또는 '연애 타로'를 선택해주세요.",
        isUser: false,
      },
    ]);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  const handleInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleInputSubmit();
    }
  };

  const handleInputSubmit = async () => {
    if (!inputValue.trim() || isLoading) return;

    const userInput = inputValue.trim();
    const lowerCaseInput = userInput.toLowerCase();
    setInputValue("");

    if (step === "select-type") {
      if (lowerCaseInput === "신년 타로" || lowerCaseInput.includes("신년")) {
        selectTarotType("new-year");
      } else if (lowerCaseInput === "연애 타로" || lowerCaseInput.includes("연애")) {
        selectTarotType("love");
      } else {
        addMessage(userInput, true);
        setTimeout(() => {
          addMessage("'신년 타로' 또는 '연애 타로'를 선택해주세요.");
        }, 300);
      }
    } else if (step === "waiting-for-question") {
      addMessage(userInput, true);
      await startReading(userInput);
    } else if (step === "chat") {
      addMessage(userInput, true);
      if (
        lowerCaseInput.includes("다시") ||
        lowerCaseInput.includes("처음") ||
        lowerCaseInput.includes("시작")
      ) {
        reset();
      } else {
        await sendFollowUpMessage(userInput);
      }
    }
  };

  useEffect(() => {
    inputRef.current?.focus();
  }, [step]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-950 via-purple-900 to-indigo-950 flex items-center justify-center p-4">
      <div className="w-full max-w-4xl bg-gradient-to-b from-purple-900/90 to-indigo-950/95 backdrop-blur-sm rounded-3xl shadow-2xl overflow-hidden border border-purple-500/20">
        {/* 헤더 */}
        <div className="bg-gradient-to-r from-purple-800/80 to-indigo-800/80 text-white p-8 text-center">
          <h1 className="text-4xl font-serif tracking-wider text-amber-100">
            인생 세장
          </h1>
          <p className="text-purple-200/80 mt-3 text-sm tracking-widest">
            세 장의 카드로 보는 당신의 이야기
          </p>
        </div>

        {/* 채팅 영역 */}
        <div className="h-96 overflow-y-auto p-6 bg-gradient-to-b from-indigo-950/50 to-purple-950/50">
          {messages.map((msg, idx) => (
            <ChatMessage key={idx} message={msg.text} isUser={msg.isUser} />
          ))}
          {isLoading && (
            <div className="flex items-center gap-2 text-amber-200/80 p-4">
              <Loader2 className="animate-spin" size={20} />
              <span className="text-sm">카드를 해석하고 있어요...</span>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* 카드 영역 */}
        {step === "reveal-cards" && (
          <div className="p-6 bg-purple-900/30 border-t border-purple-500/20">
            <div className="flex justify-center gap-6 flex-wrap">
              {drawnCards.map((drawnCard, index) => (
                <div key={index} className="flex flex-col items-center">
                  <TarotCard
                    cardName={drawnCard.card.name}
                    cardNameKo={
                      (drawnCard.card as TarotCardData).nameKo ||
                      drawnCard.card.name
                    }
                    isRevealed={drawnCard.isRevealed}
                    onClick={() => revealCard(index)}
                    index={index}
                    mode={tarotType === "new-year" ? "year" : "love"}
                  />
                  <div className="mt-3 text-sm text-purple-200/70 text-center font-serif">
                    {drawnCard.position}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 버튼 영역 */}
        <div className="p-6 bg-purple-950/30 border-t border-purple-500/20">
          {step === "select-type" && (
            <div className="flex gap-4 justify-center">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => selectTarotType("new-year")}
                className="px-8 py-4 bg-gradient-to-r from-amber-600/80 to-orange-600/80 text-white rounded-2xl shadow-lg hover:shadow-amber-500/25 transition-all border border-amber-400/30"
              >
                <span className="font-serif tracking-wide">신년 타로</span>
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => selectTarotType("love")}
                className="px-8 py-4 bg-gradient-to-r from-rose-600/80 to-pink-600/80 text-white rounded-2xl shadow-lg hover:shadow-rose-500/25 transition-all border border-rose-400/30"
              >
                <span className="font-serif tracking-wide">연애 타로</span>
              </motion.button>
            </div>
          )}

          {step === "chat" && (
            <div className="flex justify-center">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={reset}
                className="px-8 py-4 bg-gradient-to-r from-purple-600/80 to-indigo-600/80 text-white rounded-2xl shadow-lg hover:shadow-purple-500/25 transition-all border border-purple-400/30"
              >
                <span className="font-serif tracking-wide">새로운 리딩 시작</span>
              </motion.button>
            </div>
          )}
        </div>

        {/* 입력 영역 */}
        <div className="p-6 bg-indigo-950/50 border-t border-purple-500/20">
          <div className="flex items-center gap-3">
            <input
              ref={inputRef}
              type="text"
              value={inputValue}
              onChange={handleInputChange}
              onKeyDown={handleInputKeyDown}
              disabled={step === "loading" || step === "reveal-cards" || isLoading}
              className="flex-1 px-5 py-3 bg-purple-900/50 border border-purple-400/30 rounded-2xl focus:outline-none focus:ring-2 focus:ring-amber-400/50 focus:border-amber-400/50 disabled:opacity-50 disabled:cursor-not-allowed transition-all text-purple-100 placeholder-purple-300/50"
              placeholder={
                step === "select-type"
                  ? "타로 종류를 선택해주세요..."
                  : step === "waiting-for-question"
                  ? "궁금한 이야기를 적어주세요..."
                  : step === "chat"
                  ? "더 궁금한 점을 물어보세요..."
                  : "잠시만 기다려주세요..."
              }
            />
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleInputSubmit}
              disabled={
                step === "loading" ||
                step === "reveal-cards" ||
                !inputValue.trim() ||
                isLoading
              }
              className="px-5 py-3 bg-gradient-to-r from-amber-500/80 to-orange-500/80 text-white rounded-2xl shadow-lg hover:shadow-amber-500/25 transition-all disabled:opacity-50 disabled:cursor-not-allowed border border-amber-400/30"
            >
              {isLoading ? (
                <Loader2 className="animate-spin" size={20} />
              ) : (
                <Send size={20} />
              )}
            </motion.button>
          </div>
        </div>
      </div>
    </div>
  );
}
