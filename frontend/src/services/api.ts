import type {
  StartRequest,
  StartResponse,
  ChatRequest,
  ChatResponse,
  HealthResponse,
} from "../types/api";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

// UUID 생성 함수
export function generateSessionId(): string {
  return crypto.randomUUID();
}

// API 에러 클래스
export class ApiError extends Error {
  constructor(
    public status: number,
    message: string
  ) {
    super(message);
    this.name = "ApiError";
  }
}

// 공통 fetch 래퍼
async function fetchApi<T>(
  endpoint: string,
  options?: RequestInit
): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    headers: {
      "Content-Type": "application/json",
    },
    ...options,
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new ApiError(
      response.status,
      errorData.detail || `API 오류: ${response.status}`
    );
  }

  return response.json();
}

// API 함수들
export const tarotApi = {
  // 헬스체크
  health: (): Promise<HealthResponse> => {
    return fetchApi<HealthResponse>("/health");
  },

  // 타로 리딩 시작
  start: (req: StartRequest): Promise<StartResponse> => {
    return fetchApi<StartResponse>("/start", {
      method: "POST",
      body: JSON.stringify(req),
    });
  },

  // 후속 대화
  chat: (req: ChatRequest): Promise<ChatResponse> => {
    return fetchApi<ChatResponse>("/chat", {
      method: "POST",
      body: JSON.stringify(req),
    });
  },
};
