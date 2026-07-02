import os
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base

# Use DATABASE_URL from environment if available (e.g., Supabase PostgreSQL)
# Otherwise, fallback to local SQLite
SQLALCHEMY_DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./sql_app.db")

# Supabase Postgres URIs usually start with postgres:// but SQLAlchemy 1.4+ needs postgresql://
if SQLALCHEMY_DATABASE_URL.startswith("postgres://"):
    SQLALCHEMY_DATABASE_URL = SQLALCHEMY_DATABASE_URL.replace("postgres://", "postgresql://", 1)

# SQLite specific connect args
connect_args = {"check_same_thread": False} if SQLALCHEMY_DATABASE_URL.startswith("sqlite") else {}

engine = create_engine(
    SQLALCHEMY_DATABASE_URL, connect_args=connect_args
)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
