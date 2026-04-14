import os
import shutil
from fastapi import APIRouter, UploadFile, File, HTTPException
from services.pdf_parser import extract_text_from_pdf

router= APIRouter()

UPLOAD_DIR= "uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)

@router.post("/upload")
async def upload_pdf(file: UploadFile= File(...)):
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

    return{
        "filename":file.filename,
        "status": "Uploaded and parsed successfully",
        "preview": extracted_text[:500] #first 500 chars
    }
