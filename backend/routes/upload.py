import os
import shutil
from fastapi import APIRouter, UploadFile, File, HTTPException
from services.pdf_parser import extract_text_from_pdf
from services.vector_store import process_and_store_pdf
from dotenv import load_dotenv

load_dotenv()

router= APIRouter()

UPLOAD_DIR= "uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)

@router.post("/upload")
async def upload_pdf(file: UploadFile= File(...), session_id: str="default"):
    if not file.filename.endswith(".pdf"):
        raise HTTPException(status_code=400, detail="Omly PDF files are accepted.")
    
    file_path= os.path.join(UPLOAD_DIR, file.filename)
    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    #extract
    try:
        extracted_text= extract_text_from_pdf(file_path)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to parse PDF: {str(e)}")
    
    #process into chunks and store in ChromaDB
    try:
        chunk_count= process_and_store_pdf(file_path, session_id)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to process PDF for RAG: {str(e)}")
    
    return{
        "filename":file.filename,
        "session_id":session_id,
        "status": "Uploaded, parsed and stored successfully",
        "chunks_created":chunk_count,
        "preview": extracted_text[:500] #first 500 chars
    }
