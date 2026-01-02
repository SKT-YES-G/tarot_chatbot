import os
from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain_community.vectorstores import Chroma
from langchain_openai import OpenAIEmbeddings
from langchain_core.documents import Document
from dotenv import load_dotenv
load_dotenv()


DATA_PATH = "./data/tarot_meanings.txt"
PERSIST_DIR = "./chroma_db"

def main():
    with open(DATA_PATH, "r", encoding="utf-8") as f:
        text = f.read()

    # 필요하면 txt에 섹션/카드명 헤더가 있으면 더 좋음
    docs = [Document(page_content=text, metadata={"source": "tarot_meanings_txt"})]

    splitter = RecursiveCharacterTextSplitter(
        chunk_size=800,
        chunk_overlap=120,
        separators=["\n\n", "\n", "•", "-", ".", " ", ""]
    )
    chunks = splitter.split_documents(docs)

    embeddings = OpenAIEmbeddings(model="text-embedding-3-large")

    db = Chroma.from_documents(
        documents=chunks,
        embedding=embeddings,
        persist_directory=PERSIST_DIR,
        collection_name="tarot"
    )
    db.persist()
    print(f"✅ Indexed {len(chunks)} chunks into {PERSIST_DIR}")

if __name__ == "__main__":
    main()
