from fastapi import FastAPI
import fitz
from fastapi import UploadFile, File
from sentence_transformers import SentenceTransformer
import faiss
import numpy as np

app = FastAPI(
    title="IPRA",
    description="Intelligent Patent & Regulatory Research Assistant"
)
model = SentenceTransformer("all-MiniLM-L6-v2")
stored_chunks = []
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
    global stored_chunks, faiss_index
    if not file.filename or not file.filename.lower().endswith(".pdf"):
        return {"error": "Please upload a PDF file"}

    pdf_bytes = await file.read()

    with fitz.open(stream=pdf_bytes, filetype="pdf") as doc:
        text = ""
        for page in doc:
            text += page.get_text()

    chunks = chunk_text(text)

    embeddings = generate_embeddings(chunks)
    index = faiss.IndexFlatL2(embeddings.shape[1])
    index.add(embeddings)
    stored_chunks = chunks
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