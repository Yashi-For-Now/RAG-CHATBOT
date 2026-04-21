# RAG Chatbot — AI Document Q&A

A fullstack AI-powered web application that lets users upload any PDF document and have an intelligent conversation with it. Built with a complete RAG (Retrieval Augmented Generation) pipeline.

🔗 **Live Demo:** [rag-chatbot-fr.netlify.app](https://rag-chatbot-fr.netlify.app)

---

## What is RAG?

RAG (Retrieval Augmented Generation) is an AI architecture that grounds language model responses in real document content rather than relying on general training data. Instead of the AI guessing, it:

1. Converts your document into searchable vector embeddings
2. Finds the most relevant sections for each question
3. Generates an answer grounded strictly in those sections
4. Returns the source citations so you can verify
   
---

## Features

- 📄 Upload any PDF document
- 💬 Ask natural language questions about the document
- 🔍 AI answers grounded in document content — no hallucinations
- 📌 Source citations shown for every answer
- 🕒 Full chat history saved per session
- 🔄 Session persistence across page refreshes
- 🗑️ Clear session to start fresh with a new document
  
---

## Tech Stack

### Backend

| Technology            | Purpose                                |
| --------------------- | -------------------------------------- |
| FastAPI               | REST API framework                     |
| LangChain             | RAG pipeline orchestration             |
| ChromaDB              | Vector database for embeddings         |
| Google Gemini API     | LLM for answer generation + embeddings |
| PostgreSQL (Supabase) | Chat history storage                   |
| SQLAlchemy            | ORM for database operations            |
| PyMuPDF               | PDF text extraction                    |

### Frontend

| Technology   | Purpose      |
| ------------ | ------------ |
| React        | UI framework |
| Tailwind CSS | Styling      |
| Axios        | HTTP client  |
| Vite         | Build tool   |

### Deployment

| Service  | Purpose             |
| -------- | ------------------- |
| Render   | Backend hosting     |
| Netlify  | Frontend hosting    |
| Supabase | PostgreSQL database |
---
</>Markdown
## Architecture

User uploads PDF
↓
PyMuPDF extracts text
↓
LangChain splits into chunks (1000 chars, 100 overlap)
↓
Gemini converts chunks to vector embeddings
↓
Vectors stored in ChromaDB
User asks question
↓
Question converted to vector
↓
ChromaDB finds top 3 most similar chunks
↓
Chunks + question sent to Gemini
↓
Gemini generates grounded answer
↓
Answer + source citations returned to user
↓
Q&A saved to PostgreSQL

---

## API Endpoints

| Method | Endpoint                    | Description                           |
| ------ | --------------------------- | ------------------------------------- |
| GET    | `/`                         | Health check                          |
| POST   | `/api/upload`               | Upload PDF, process and store vectors |
| POST   | `/api/chat`                 | Ask question, get RAG answer          |
| GET    | `/api/history/{session_id}` | Fetch chat history                    |
| GET    | `/api/session/{session_id}` | Get session status                    |
| DELETE | `/api/session/{session_id}` | Clear session data                    |
---

## Local Setup

### Prerequisites

- Python 3.12+
- Node.js 18+
- Git

### Backend Setup

```bash
# Clone the repo
git clone https://github.com/Yashi-For-Now/RAG-CHATBOT.git
cd RAG-CHATBOT/backend

# Create and activate virtual environment
python -m venv venv
venv\Scripts\activate  # Windows
source venv/bin/activate  # Mac/Linux

# Install dependencies
pip install -r requirements.txt

# Create .env file
cp .env.example .env
# Add your API keys to .env

# Run the server
uvicorn main:app --reload
```

### Frontend Setup

```bash
cd ../frontend

# Install dependencies
npm install

# Create .env file
echo "VITE_API_URL=http://localhost:8000/api" > .env

# Run the dev server
npm run dev
```
### Environment Variables

Create `backend/.env`:
GEMINI_API_KEY=your_gemini_api_key
DATABASE_URL=your_postgresql_connection_string

Create `frontend/.env`:
VITE_API_URL="http://localhost:8000/api"
---

## Project Structure

RAG Chatbot WebAPP/
├── backend/
│ ├── main.py
│ ├── requirements.txt
│ ├── routes/
│ │ ├── upload.py
│ │ ├── chat.py
│ │ ├── history.py
│ │ └── session.py
│ ├── services/
│ │ ├── pdf_parser.py
│ │ ├── vector_store.py
│ │ └── llm.py
│ └── db/
│ ├── database.py
│ └── models.py
└── frontend/
└── src/
├── components/
│ ├── FileUpload.jsx
│ ├── ChatWindow.jsx
│ ├── MessageBubble.jsx
│ ├── InputBar.jsx
│ ├── SourceCitation.jsx
│ ├── Header.jsx
│ └── HistorySidebar.jsx
├── context/
│ └── AppContext.jsx
└── services/
└── api.js
---

## Key Implementation Decisions

**Session-based identity** — Used `crypto.randomUUID()` stored in localStorage instead of full auth system. Each browser gets a persistent session ID tying all uploads and chat history together.

**Chunk overlap** — Used 100 character overlap between chunks to ensure important sentences at chunk boundaries are never lost during retrieval.

**Temperature 0.2** — Low temperature setting on the LLM ensures factual, consistent answers rather than creative but potentially inaccurate responses.

**Source citations** — Every AI response includes the exact document chunks used to generate it, making answers verifiable and transparent.

---

## Future Improvements

- User authentication for multi-device session sync
- Support for multiple document formats (DOCX, TXT, CSV)
- Streaming responses for faster perceived performance
- Multiple documents per session
- Dark/light mode toggle
  
---

## Author

**Yashashwani Singh**

- GitHub: [@Yashi-For-Now](https://github.com/Yashi-For-Now)
- LinkedIn: [Yashashwani Singh](https://linkedin.com/in/yashashwani-singh)
- Email: s.yashashwani0.02@gmail.com
