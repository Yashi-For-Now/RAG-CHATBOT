from sqlalchemy import Column, String, Text, DateTime, Integer
from sqlalchemy.sql import func
from db.database import Base

class ChatHistory(Base):
    """
    Represents chat history table in PostgreSQL.
    Each instance of this class= one row in the table.
    """

    __tablename__="chat_history"

    #Primary key
    id= Column(Integer, primary_key=True, index=True)

    session_id= Column(String, index=True, nullable=False)

    question=Column(Text, nullable=False)

    answer= Column(Text, nullable=False)

    timestamp= Column(DateTime(timezone=True), server_default=func.now())

