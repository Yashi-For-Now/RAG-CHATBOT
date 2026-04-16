import os
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from services.vector_store import get_retriever
from services.llm import get_answer_from_gemini
from dotenv import load_dotenv

load_dotenv()

router= APIRouter()

#Defining structure of request

class ChatRequest(BaseModel):
    question: str
    session_id: str

class SourceChunk(BaseModel):
    content: str
    page: int

class ChatResponse(BaseModel):
    question: str
    answer: str
    sources: list[SourceChunk]

@router.post("/chat", response_model=ChatResponse)
async def chat(request: ChatRequest):

    #validation
    if not request.question.strip():
        raise HTTPException(status_code=400, detail="Question cannot be empty.")

    if not request.session_id.strip():
        raise HTTPException(status_code=400, detail="Session ID cannot be empty.")


    #Retreiver for this session's document
    try:
        retriever= get_retriever(request.session_id)
    except Exception as e:
        raise HTTPException( status_code=404, detail=f"No document found for session '{request.session_id}'. Please upload a document first.")
    

    # Finding relevant chunks
    try:
        relevant_chunks= retriever.invoke(request.question)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to retrieve contect: {str(e)}")
    
    #Get answer from Gemini
    try:
        answer=get_answer_from_gemini(request.question, relevant_chunks)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to get answer from Gemini: {str(e)}")

    sources=[]

    for chunk in relevant_chunks:
        sources.append(SourceChunk(
            content=chunk.page_content[:200],
            page=chunk.metadata.get("page", 0)+1
        ))

    return ChatResponse(
        question=request.question,
        answer=answer,
        sources=sources
    )