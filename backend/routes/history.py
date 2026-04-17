from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel
from sqlalchemy.orm import Session
from db.database import get_db
from db.models import ChatHistory
from datetime import datetime

router= APIRouter()

class HistoryItem(BaseModel):
    id: int
    question: str
    answer: str
    timestamp: datetime

    class Config:
        from_attributes= True #allow pydantic to read SQLAlchemy objects


@router.get("history/{session_id}", response_model=list[HistoryItem])
def get_history(session_id: str, db: Session = Depends(get_db)):
    """
    Return all chat history for a given session_id
    From oldest to newest
    """

    records= db.query(ChatHistory)\
        .filter(ChatHistory.session_id==session_id)\
        .order_by(ChatHistory.timestamp)\
        .all()

    if not records:
        raise HTTPException(status_code=404, detail=f"No history found for session '{session_id}'")

    return records