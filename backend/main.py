from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routes.upload import router as upload_router
from routes.chat import router as chat_router
from routes.history import router as history_router
from routes.session import router as session_router
from db.database import engine, Base

#To create all tables in PostgreSQL on startup
Base.metadata.create_all(bind=engine)

app= FastAPI(title="RAG Chatbot API")

#Allow React frontend to interact to the backend

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173", 
        "https://*netlify.app", 
        "https://rag-chatbot-backend-h6j1.onrender.com"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

#Register routes
app.include_router(upload_router, prefix="/api")
app.include_router(chat_router, prefix="/api")
app.include_router(history_router, prefix="/api")
app.include_router(session_router, prefix="/api")

@app.get("/")
def root():
    return {"message":"RAG Chatbot API is running."}