from fastapi import FastAPI
import fitz
from fastapi import UploadFile, File
from sentence_transformers import SentenceTransformer
import faiss
import numpy as np
import os
from dotenv import load_dotenv
from google import genai



app = FastAPI(
    title="IPRA",
    description="Intelligent Patent & Regulatory Research Assistant"
)
load_dotenv()

client = genai.Client(
    api_key=os.getenv("GEMINI_API_KEY")
)
model = SentenceTransformer("all-MiniLM-L6-v2")
stored_chunks = []
stored_metadata = []
faiss_index = None

@app.get("/")
def home():
    return {
        "message": "Welcome to IPRA",
        "status": "Backend is running successfully"
    }

@app.get("/health")
def health():
    return {
        "status": "healthy"
    }
@app.post("/upload")
async def upload_pdf(file: UploadFile = File(...)):
    global stored_chunks,stored_metadata, faiss_index
    if not file.filename or not file.filename.lower().endswith(".pdf"):
        return {"error": "Please upload a PDF file"}

    pdf_bytes = await file.read()

    chunks = []
    metadata = []

    with fitz.open(stream=pdf_bytes, filetype="pdf") as doc:
        for page_number, page in enumerate(doc, start=1):
            page_text = page.get_text()

            if not page_text.strip():
                continue

        page_chunks = chunk_text(page_text)

        for chunk in page_chunks:
            chunks.append(chunk)
            metadata.append({
                "document": 
        file.filename,
                "page": page_number
            })



    embeddings = generate_embeddings(chunks)
    index = faiss.IndexFlatL2(embeddings.shape[1])
    index.add(embeddings)
    stored_chunks = chunks
    stored_metadata = metadata
    faiss_index = index

    return {
    "filename": file.filename,
    "total_chunks": len(chunks),
    "sample_chunks": chunks[:3],
    "status": "PDF processed and chunked successfully"
    }
def chunk_text(text, chunk_size=500, overlap=100):
    chunks = []

    start = 0

    while start < len(text):
        end = start + chunk_size
        chunk = text[start:end]
        chunks.append(chunk)

        start += chunk_size - overlap

    return chunks
def generate_embeddings(chunks):
    embeddings = model.encode(chunks)
    return np.asarray(embeddings, dtype="float32")
from pydantic import BaseModel

class SearchQuery(BaseModel):
    question: str

@app.post("/search")
def search_patents(query: SearchQuery):
    if faiss_index is None:
        return {"error": "Please upload a PDF first"}

    question_embedding = generate_embeddings([query.question])

    k = min(3, len(stored_chunks))
    distances, indices = faiss_index.search(question_embedding, k)

    results = []

    for i in indices[0]:
        results.append(stored_chunks[int(i)])

    return {
        "question": query.question,
        "relevant_information": results
    }
@app.post("/query")
def ask_ipra(query: SearchQuery):

    if faiss_index is None or not stored_chunks:
        return {"error": "Please upload a PDF first"}

    question_embedding = generate_embeddings([query.question])

    k = min(3, len(stored_chunks))
    distances, indices = faiss_index.search(question_embedding, k)
    best_distance = float(distances[0][0])

    if best_distance > 1.5:
        return {
        "question": query.question,
        "answer": "Insufficient supporting evidence is available.",
        "confidence": "Low",
        "sources": []
    }

    if best_distance < 0.5:
        confidence = "High"
    elif best_distance < 1.0:
        confidence = "Medium"
    else:
        confidence = "Low"
    evidence = "\n\n".join(
        stored_chunks[int(i)] for i in indices[0]
    )

    prompt = f"""
    You are IPRA, a patent research assistant.

    Answer the question using ONLY the evidence provided.

    If the evidence is insufficient, clearly say:
    "Insufficient supporting evidence is available."

    Do not invent legal provisions or citations.

    Evidence:
    {evidence}

    Question:
    {query.question}
    """

    response = client.models.generate_content(
        model="gemini-2.5-flash",
        contents=prompt
    )

    return {
    "question": query.question,
    "answer": response.text,
    "confidence": confidence,
    "sources": [
    {
        "document": stored_metadata[int(i)]["document"],
        "page": stored_metadata[int(i)]["page"],
        "evidence": stored_chunks[int(i)]
    }
    for i in indices[0]
    ]
}