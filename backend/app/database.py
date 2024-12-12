from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
import os

# Add debug logging
print(
    "Using database URL:",
    os.getenv("DATABASE_URL", "postgresql://rules_user:rules_password@db:5432/rules_db"),
)

SQLALCHEMY_DATABASE_URL = os.getenv(
    "DATABASE_URL", "postgresql://rules_user:rules_password@db:5432/rules_db"
)

engine = create_engine(SQLALCHEMY_DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
