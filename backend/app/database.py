from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
import os

print(
    "Using database URL:",
    os.getenv("DATABASE_URL", "postgresql://rules_user:rules_password@db:5432/rules_db"),
)

SQLALCHEMY_DATABASE_URL = os.getenv(
    "DATABASE_URL", "postgresql://rules_user:rules_password@db:5432/rules_db"
)

engine = None
SessionLocal = None


def get_engine():
    global engine
    if engine is None:
        engine = create_engine(SQLALCHEMY_DATABASE_URL)
    return engine


def get_session_local():
    global SessionLocal
    if SessionLocal is None:
        SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=get_engine())
    return SessionLocal


Base = declarative_base()


def get_db():
    SessionLocal = get_session_local()
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
