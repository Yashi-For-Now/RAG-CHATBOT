import os
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base
from dotenv import load_dotenv

load_dotenv()

DATABASE_URL= os.getenv("DATABASE_URL")

#database engine-actual connection to PostgreSQL
engine= create_engine(DATABASE_URL)

#Session local creates database sessions
# Each session  is one conversation with DB

SessionLocal= sessionmaker(
    autocommit=False, #do not save automatically
    autoflush=False, #do not send SQL automatically
    bind=engine #use the given connection
)

#base class that all our databse models will inherit from
Base= declarative_base()

def get_db():
    """
    This is a dependency function that provides a database session.
    Automatically closes the session when done, even if error occurs.
    This is used by FastAPI's dependency injection system.
    """

    db= SessionLocal()
    try:
        yield db #give the session to the rpute function
    finally:
        db.close() #always close no matter what
