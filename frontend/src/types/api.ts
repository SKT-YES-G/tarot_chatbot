// 서버 API 요청/응답 타입 정의

// 카드 정보 (서버 응답)
export interface CardFromServer {
  position: string;
  name: string;
  orientation: "upright" | "reversed";
}

// /start 요청
export interface StartRequest {
  session_id: string;
  mode: "year" | "love";
  question: string;
}

// /start 응답
export interface StartResponse {
  session_id: string;
  mode: "year" | "love";
  question: string;
  cards: CardFromServer[];
  cards_text: string;
  reading: string;
}

// /chat 요청
export interface ChatRequest {
  session_id: string;
  message: string;
}

// /chat 응답
export interface ChatResponse {
  answer: string;
}

// /health 응답
export interface HealthResponse {
  ok: boolean;
}
