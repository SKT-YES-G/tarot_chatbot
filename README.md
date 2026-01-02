# 인생 세장 - 타로 챗봇

세 장의 카드로 보는 당신의 이야기. RAG 기반 타로 리딩 챗봇입니다.

## 주요 기능

- **신년 타로**: 메이저 아르카나 22장으로 2026년 운세 리딩
- **연애 타로**: 컵 수트 14장으로 연애운 리딩
- **RAG 기반 해석**: ChromaDB + LangChain으로 카드 의미 검색 및 GPT 해석
- **대화형 인터페이스**: 초기 리딩 후 추가 질문 가능

## 기술 스택

### Frontend
- React 18 + TypeScript
- Vite
- Tailwind CSS 4
- Radix UI / shadcn/ui
- Framer Motion

### Backend
- FastAPI + Uvicorn
- LangChain + LangChain-OpenAI
- ChromaDB (벡터 DB)
- OpenAI Embeddings (text-embedding-3-large)

## 프로젝트 구조

```
flyai_chatbot/
├── frontend/                # React 프론트엔드
│   ├── src/
│   │   ├── app/
│   │   │   ├── components/  # TarotChatbot, TarotCard 등
│   │   │   └── data/        # 카드 데이터 (majorArcana, cupsCards)
│   │   ├── services/        # API 호출 모듈
│   │   └── types/           # TypeScript 타입 정의
│   ├── public/cards/        # 카드 이미지
│   └── package.json
│
├── tarot-rag/               # FastAPI 백엔드
│   ├── app.py               # 메인 API 서버
│   ├── buildindex.py        # ChromaDB 인덱스 빌드
│   ├── data/
│   │   └── tarot_meanings.txt  # 카드 의미 원본 데이터
│   ├── chroma_db/           # 벡터 DB (자동 생성)
│   └── requirements.txt
│
└── README.md
```

## 설치 및 실행

### 1. Backend 설정

```bash
cd tarot-rag

# 가상환경 생성 및 활성화
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate

# 패키지 설치
pip install -r requirements.txt

# 환경변수 설정
# .env 파일 생성 후 OPENAI_API_KEY 입력
echo "OPENAI_API_KEY=sk-..." > .env

# 벡터 DB 인덱스 빌드 (최초 1회)
python buildindex.py

# 서버 실행
uvicorn app:app --reload --port 8000
```

### 2. Frontend 설정

```bash
cd frontend

# 패키지 설치
npm install

# 개발 서버 실행
npm run dev
```

### 3. 접속

- Frontend: http://localhost:5173
- Backend API: http://localhost:8000
- API 문서: http://localhost:8000/docs

## API 엔드포인트

| Method | Endpoint | 설명 |
|--------|----------|------|
| GET | `/health` | 헬스체크 |
| POST | `/start` | 타로 리딩 시작 (카드 3장 뽑기 + 해석) |
| POST | `/chat` | 후속 질문 대화 |

### /start 요청 예시

```json
{
  "session_id": "uuid-1234",
  "mode": "year",
  "question": "올해 재정 운은 어떨까요?"
}
```

### /chat 요청 예시

```json
{
  "session_id": "uuid-1234",
  "message": "첫 번째 카드에 대해 더 자세히 알려주세요"
}
```

## 환경 변수

### Backend (.env)

```
OPENAI_API_KEY=sk-...
TAROT_EMBED_MODEL=text-embedding-3-large  # (선택)
TAROT_CHAT_MODEL=gpt-4o-mini              # (선택)
```

### Frontend (.env.local)

```
VITE_API_URL=http://localhost:8000  # (선택, 기본값)
```

## 라이선스

MIT License
