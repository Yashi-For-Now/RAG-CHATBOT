from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routes.upload import router as upload_router
from routes.chat import router as chat_router

app= FastAPI(title="RAG Chatbot API")

#Allow React frontend to interact to the backend

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

#Register routes
app.include_router(upload_router, prefix="/api")
app.include_router(chat_router, prefix="/api")

@app.get("/")
def root():
    return {"message":"RAG Chatbot API is running."}