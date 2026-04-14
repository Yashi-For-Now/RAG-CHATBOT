import os
from langchain_community.document_loaders import PyMuPDFLoader
from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain_google_genai import GoogleGenerativeAIEmbeddings
from langchain_community.vectorstores import Chroma


#ChromaDB data storage location on disk

CHROMA_DIR= "chroma_db"

def get_embeddings():
    """
    Creates and returns the embedding model.
    Model converts text into vectors (lists of numbers).
    """

    return GoogleGenerativeAIEmbeddings(
        model="models/gemini-embedding-001",
        google_api_key=os.getenv("GEMINI_API_KEY")
    )

def process_and_store_pdf(file_path: str, session_id: str)-> int:
    """
    Takes a PDF file path and:
    1. Loads and extracts text ising LangChain's PDF Loader.
    2. Splits texts into overlapping chunks.
    3. Converts chunks to vectors. (embeddings)
    4. Stores vectors into ChromaDB under collection named after the session_id.
    
    Returns the number of chunks created.
    """
    
    #load the odf using langchain
    loader=PyMuPDFLoader(file_path)
    documents=loader.load()

    #split into chunks
    splitter= RecursiveCharacterTextSplitter(
        chunk_size=1000,
        chunk_overlap=100
    )

    chunks= splitter.split_documents(documents)

    #embed and store in ChromaDB
    embeddings=get_embeddings()
    Chroma.from_documents(
        documents=chunks,
        embedding=embeddings,
        persist_directory=CHROMA_DIR,
        collection_name=session_id
    )

    return len(chunks)

def get_retriever(session_id: str):
    """
    Opens an existing ChromaDB collection for a session 
    and returns a retriever object.
    Retreiver's job is to find the most relevant chunk for a given question
    """

    embeddings=get_embeddings()

    #loading existing vectore store for this session
    vector_store=Chroma(
        persist_directory=CHROMA_DIR,
        embedding_function=embeddings,
        collection_name=session_id
    )

    #return top 3 msot relevant chunks be default
    return vector_store.as_retriever(
        search_kwargs={"k": 3} #k is number of chunks to retreive
    )