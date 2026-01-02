import os
import random
from typing import Dict, List, Literal, Optional

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field

from dotenv import load_dotenv
load_dotenv()

from langchain_community.vectorstores import Chroma
from langchain_openai import OpenAIEmbeddings, ChatOpenAI
from langchain_core.prompts import ChatPromptTemplate, MessagesPlaceholder
from langchain_core.messages import AIMessage, HumanMessage
from langchain_core.output_parsers import StrOutputParser

# =========================
# Config
# =========================
PERSIST_DIR = "./chroma_db"
COLLECTION_NAME = "tarot"

EMBED_MODEL = os.getenv("TAROT_EMBED_MODEL", "text-embedding-3-large")
CHAT_MODEL = os.getenv("TAROT_CHAT_MODEL", "gpt-5-nano")  # 필요하면 env로 바꿔도 됨

# =========================
# App
# =========================
app = FastAPI(title="Tarot RAG")

# CORS 설정 (Frontend 연동용)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ---------- Vector DB ----------
embeddings = OpenAIEmbeddings(model=EMBED_MODEL)
db = Chroma(
    persist_directory=PERSIST_DIR,
    embedding_function=embeddings,
    collection_name=COLLECTION_NAME,
)
retriever = db.as_retriever(search_kwargs={"k": 6})

def format_docs(docs):
    return "\n\n".join([d.page_content for d in docs])

# ---------- LLM ----------
llm = ChatOpenAI(model=CHAT_MODEL, temperature=0.1)

# =========================
# Decks
# =========================
MAJOR_ARCANA_22 = [
    "The Fool", "The Magician", "The High Priestess", "The Empress", "The Emperor",
    "The Hierophant", "The Lovers", "The Chariot", "Strength", "The Hermit",
    "Wheel of Fortune", "Justice", "The Hanged Man", "Death", "Temperance",
    "The Devil", "The Tower", "The Star", "The Moon", "The Sun",
    "Judgement", "The World",
]

CUPS_14 = [
    "Ace of Cups", "Two of Cups", "Three of Cups", "Four of Cups", "Five of Cups",
    "Six of Cups", "Seven of Cups", "Eight of Cups", "Nine of Cups", "Ten of Cups",
    "Page of Cups", "Knight of Cups", "Queen of Cups", "King of Cups",
]

YEAR_POSITIONS = ["테마카드(올해의 흐름)", "확장카드(잘 흘러갈 때 모습)", "저항카드(방해/저항)"]
LOVE_POSITIONS = ["나의 상태", "상대의 상태", "관계의 흐름/조언"]

def draw_three(mode: Literal["year", "love"]):
    deck = MAJOR_ARCANA_22 if mode == "year" else CUPS_14
    positions = YEAR_POSITIONS if mode == "year" else LOVE_POSITIONS

    cards = random.sample(deck, 3)
    result = []
    for pos, name in zip(positions, cards):
        orientation = "upright"  # 정방향만 사용
        result.append({"position": pos, "name": name, "orientation": orientation})
    return result

# =========================
# Prompts / Chains
# =========================
SYSTEM_RULES = """
너는 타로 리더다.
- 사용자의 mode(신년운세/year 또는 연애운/love)와 질문, 그리고 뽑힌 3장의 카드(각 포지션/정방향/역방향)를 바탕으로 리딩한다.
- 제공된 문서(context)에서 근거가 되는 의미/키워드를 찾아 반영한다. (근거 없는 단정 금지)
- 정방향(upright)은 긍정/순방향, 역방향(reversed)은 경고/막힘/내면화 등으로 해석하되, 무조건 나쁘다고 단정하지 말고 '조언' 중심으로 설명한다.
- 답변은 한국어로, 소제목과 bullet을 사용한다.
- 첫 리딩은 반드시 3장의 카드를 각각 해석하고, 마지막에 종합 요약을 제공한다.
- 이후 채팅에서는 '초기 질문'과 '뽑힌 카드 3장'과 '첫 리딩 요약'을 유지하며 사용자의 질문에 이어서 답한다.
"""

start_prompt = ChatPromptTemplate.from_messages([
    ("system", SYSTEM_RULES),
    ("user",
     "mode: {mode}\n"
     "사용자 질문: {question}\n\n"
     "뽑힌 카드 3장:\n{cards_text}\n\n"
     "아래 문서 context를 근거로 각 카드(포지션별)를 해석하고, 마지막에 종합 요약을 작성해줘.\n\n"
     "context:\n{context}\n\n"
     "출력 형식:\n"
     "## 카드 1: {pos1}\n- 카드: {card1} ({ori1})\n- 핵심 키워드(3~6)\n- 해석\n- 조언(실행 2~3)\n\n"
     "## 카드 2: {pos2}\n- 카드: {card2} ({ori2})\n- 핵심 키워드(3~6)\n- 해석\n- 조언(실행 2~3)\n\n"
     "## 카드 3: {pos3}\n- 카드: {card3} ({ori3})\n- 핵심 키워드(3~6)\n- 해석\n- 조언(실행 2~3)\n\n"
     "## 종합 요약\n- 한 문단 요약\n- 오늘부터 할 수 있는 액션 3개\n\n"
     "## 문서 기반 근거 포인트(3~6)\n- (카드 의미/키워드 근거를 짧게)\n"
    )
])

chat_prompt = ChatPromptTemplate.from_messages([
    ("system", SYSTEM_RULES),
    ("system",
     "초기 질문: {question}\n"
     "mode: {mode}\n"
     "뽑힌 카드 3장:\n{cards_text}\n"
     "첫 리딩 요약:\n{reading_summary}\n"
    ),
    MessagesPlaceholder("history"),
    ("user",
     "추가 질문: {user_message}\n\n"
     "참고 context:\n{context}"
    )
])

def build_cards_text(cards: List[Dict]) -> str:
    # 프론트에서 그대로 보여주기 쉽도록 텍스트도 같이 만들기
    # orientation: upright/reversed -> 한국어 표시도 같이
    def ori_kr(o): return "정방향" if o == "upright" else "역방향"
    lines = []
    for c in cards:
        lines.append(f"- {c['position']}: {c['name']} ({ori_kr(c['orientation'])})")
    return "\n".join(lines)

def summarize_reading(reading: str) -> str:
    # 아주 간단한 요약(운영에선 LLM 요약으로 바꿔도 됨)
    lines = [l.strip() for l in reading.splitlines() if l.strip()]
    return "\n".join(lines[:14])

def retrieve_context(query: str) -> str:
    docs = retriever.invoke(query)
    return format_docs(docs)

# =========================
# Session store (MVP)
# =========================
SESSION: Dict[str, Dict] = {}
# SESSION[session_id] =
# {
#   "mode": "year"/"love",
#   "question": "...",
#   "cards": [...],
#   "reading": "...",
#   "history": [HumanMessage/AIMessage...]
# }

# =========================
# API Schemas
# =========================
class StartReq(BaseModel):
    session_id: str
    mode: Literal["year", "love"] = Field(..., description="year=신년운세(메이저 22), love=연애운(컵 14)")
    question: str

class ChatReq(BaseModel):
    session_id: str
    message: str

@app.get("/health")
def health():
    return {"ok": True}

@app.post("/start")
def start(req: StartReq):
    # 1) 카드 3장 뽑기
    cards = draw_three(req.mode)
    cards_text = build_cards_text(cards)

    # 2) RAG 검색 쿼리 만들기 (질문 + 카드명 + 정/역 + 포지션)
    #    txt 문서가 "카드명/키워드/정역" 기준으로 되어 있으면 잘 걸림
    def ori_tag(o): return "정방향" if o == "upright" else "역방향"
    retrieval_query = (
        f"{req.mode} 타로 "
        f"질문: {req.question}\n"
        f"카드: " + ", ".join([f"{c['name']}({ori_tag(c['orientation'])})" for c in cards])
    )
    context = retrieve_context(retrieval_query)

    # 3) 프롬프트 변수 채우기
    vars_ = {
        "mode": req.mode,
        "question": req.question,
        "cards_text": cards_text,
        "context": context,
        "pos1": cards[0]["position"], "card1": cards[0]["name"], "ori1": ori_tag(cards[0]["orientation"]),
        "pos2": cards[1]["position"], "card2": cards[1]["name"], "ori2": ori_tag(cards[1]["orientation"]),
        "pos3": cards[2]["position"], "card3": cards[2]["name"], "ori3": ori_tag(cards[2]["orientation"]),
    }

    reading = (start_prompt | llm | StrOutputParser()).invoke(vars_)

    # 4) 세션 저장
    SESSION[req.session_id] = {
        "mode": req.mode,
        "question": req.question,
        "cards": cards,
        "reading": reading,
        "history": [
            HumanMessage(content=f"[START] mode={req.mode}\n질문={req.question}\n{cards_text}"),
            AIMessage(content=reading),
        ],
    }

    return {
        "session_id": req.session_id,
        "mode": req.mode,
        "question": req.question,
        "cards": cards,          # 프론트에서 카드 이미지 매핑하기 좋음
        "cards_text": cards_text,
        "reading": reading,
    }

@app.post("/chat")
def chat(req: ChatReq):
    if req.session_id not in SESSION:
        raise HTTPException(status_code=400, detail="세션이 없습니다. 먼저 /start 를 호출하세요.")

    s = SESSION[req.session_id]
    mode = s["mode"]
    question = s["question"]
    cards = s["cards"]
    cards_text = build_cards_text(cards)
    reading_summary = summarize_reading(s["reading"])
    history = s["history"]

    # RAG 쿼리: 카드 + 유저 질문 + 초기 질문
    retrieval_query = (
        f"{mode} 타로\n"
        f"초기 질문: {question}\n"
        f"추가 질문: {req.message}\n"
        f"카드: " + ", ".join([c["name"] for c in cards])
    )
    context = retrieve_context(retrieval_query)

    vars_ = {
        "mode": mode,
        "question": question,
        "cards_text": cards_text,
        "reading_summary": reading_summary,
        "history": history,
        "user_message": req.message,
        "context": context,
    }

    answer = (chat_prompt | llm | StrOutputParser()).invoke(vars_)

    history.append(HumanMessage(content=req.message))
    history.append(AIMessage(content=answer))

    return {"answer": answer}
