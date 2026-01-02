import { motion } from "motion/react";
import { useState } from "react";

interface TarotCardProps {
  cardName: string;
  cardNameKo: string;
  isRevealed: boolean;
  onClick?: () => void;
  index: number;
  mode?: "year" | "love";
}

// 영문 카드명 → 이미지 파일명 매핑 (Major Arcana)
const majorArcanaImageMap: Record<string, string> = {
  "The Fool": "바보",
  "The Magician": "마법사",
  "The High Priestess": "여사제",
  "The Empress": "여황제",
  "The Emperor": "황제",
  "The Hierophant": "교황",
  "The Lovers": "연인",
  "The Chariot": "전차",
  "Strength": "힘",
  "The Hermit": "은둔자",
  "Wheel of Fortune": "운명의 수레바퀴",
  "Justice": "정의",
  "The Hanged Man": "매달린 남자",
  "Death": "죽음",
  "Temperance": "절제",
  "The Devil": "악마",
  "The Tower": "타워",
  "The Star": "별",
  "The Moon": "달",
  "The Sun": "태양",
  "Judgement": "심판",
  "The World": "세계",
};

// 영문 카드명 → 이미지 파일명 매핑 (Cups)
const cupsImageMap: Record<string, string> = {
  "Ace of Cups": "에이스컵",
  "Two of Cups": "2컵",
  "Three of Cups": "3컵",
  "Four of Cups": "4컵",
  "Five of Cups": "5컵",
  "Six of Cups": "6컵",
  "Seven of Cups": "7컵",
  "Eight of Cups": "8컵",
  "Nine of Cups": "9컵",
  "Ten of Cups": "10컵",
  "Page of Cups": "페이지 컵",
  "Knight of Cups": "나이트컵",
  "Queen of Cups": "퀸컵",
  "King of Cups": "킹컵",
};

function getCardImagePath(cardName: string, mode: "year" | "love"): string {
  if (mode === "year") {
    const fileName = majorArcanaImageMap[cardName];
    return fileName ? `/cards/tarot/${fileName}.png` : "";
  } else {
    const fileName = cupsImageMap[cardName];
    return fileName ? `/cards/cup/${fileName}.png` : "";
  }
}

function getBackImagePath(mode: "year" | "love"): string {
  // 신년 타로는 heart, 연애 타로는 new (또는 원하는대로 변경 가능)
  return mode === "year" ? "/cards/back/back_heart.png" : "/cards/back/back_new.png";
}

export function TarotCard({
  cardName,
  cardNameKo,
  isRevealed,
  onClick,
  index,
  mode = "year",
}: TarotCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const cardImagePath = getCardImagePath(cardName, mode);
  const backImagePath = getBackImagePath(mode);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className="relative cursor-pointer"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={onClick}
    >
      <motion.div
        className="relative w-48 h-72 preserve-3d"
        animate={{ rotateY: isRevealed ? 180 : 0 }}
        transition={{ duration: 0.6, ease: "easeInOut" }}
        style={{ transformStyle: "preserve-3d" }}
      >
        {/* 카드 뒷면 */}
        <div
          className="absolute inset-0 backface-hidden rounded-lg overflow-hidden shadow-xl"
          style={{ backfaceVisibility: "hidden" }}
        >
          <img
            src={backImagePath}
            alt="카드 뒷면"
            className="w-full h-full object-cover"
          />
          {!isRevealed && isHovered && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="absolute inset-0 bg-black/30 flex items-center justify-center"
            >
              <span className="text-white text-sm font-medium">클릭하여 뒤집기</span>
            </motion.div>
          )}
        </div>

        {/* 카드 앞면 */}
        <div
          className="absolute inset-0 backface-hidden rounded-lg overflow-hidden shadow-xl"
          style={{
            backfaceVisibility: "hidden",
            transform: "rotateY(180deg)",
          }}
        >
          {cardImagePath ? (
            <img
              src={cardImagePath}
              alt={cardNameKo}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-amber-50 to-yellow-100 flex flex-col items-center justify-center p-4">
              <div className="text-5xl mb-4">✨</div>
              <h3 className="text-xl font-serif text-purple-900 mb-2">
                {cardNameKo}
              </h3>
              <p className="text-sm text-gray-600">{cardName}</p>
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}
