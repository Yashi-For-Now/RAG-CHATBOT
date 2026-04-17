from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel
from sqlalchemy.orm import Session
from db.database import get_db
from db.models import ChatHistory
import os
import shutil

router= APIRouter()

UPLOAD_DIR = "uploads"
CHROMA_DIR = "chroma_db"

class SessionStatus(BaseModel):
    session_id: str
    has_document: bool
    message_count: int


@router.get("/session/{session_id}", response_model=SessionStatus)
def get_session_status(session_id: str, db: Session = Depends(get_db)):
    
    """
    Checks if a session has an uplaoded document
    and how many messages have been exchanged.
    Frontend uses this to decide which screen to show.
    """

    #Count messages for this session in the database
    message_count= db.query(ChatHistory)\
        .filter(ChatHistory.session_id==session_id)\
        .count()

        #check if chroma_db collection exists for this session, if it does, documnet has been uploaded

    chroma_session_path=os.path.join(CHROMA_DIR, session_id)
    has_document= os.path.exists(chroma_session_path)

    return SessionStatus(
        session_id=session_id,
        has_document=has_document,
        message_count=message_count
    )

@router.delete("/session/{session_id}")
def delete_session(session_id: str, db: Session = Depends(get_db)):
    
    """
    Deletes all data for a session:
    -Chat history from PostgreSQL
    -ChromaDB vectors
    -Uploaded PDF file
    """

    #deleting from PostgreSQL
    deleted_count= db.query(ChatHistory)\
        .filter(ChatHistory.session_id==session_id)\
        .delete()

    db.commit()

    #delete vectors form chromadb
    chroma_session_path = os.path.join(CHROMA_DIR, session_id)
    if os.path.exists(chroma_session_path):
        shutil.rmtree(chroma_session_path)

    if deleted_count==0:
        raise HTTPException(status_code=404, detail= f"No session found with id '{session_id}'")

    return {
        "message": f"Session '{session_id}' deleted successfully",
        "messages_deleted": deleted_count
    }