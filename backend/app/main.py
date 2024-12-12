from fastapi import FastAPI, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from typing import List
from . import models, db_models
from .database import get_db, engine
import uuid

app = FastAPI()

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # React app's address
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Create tables
db_models.Base.metadata.create_all(bind=engine)


@app.post("/rules/", response_model=models.RuleResponse)
def create_rule(rule: models.RuleCreate, db: Session = Depends(get_db)):
    # Create and commit the rule first
    db_rule = db_models.Rule(name=rule.name)
    db.add(db_rule)
    db.commit()  # Commit to get the rule.id
    db.refresh(db_rule)

    try:
        # Add conditions
        for condition in rule.conditions:
            db_condition = db_models.Condition(
                rule_id=db_rule.id, condition_type=condition.type, condition_value=condition.value
            )
            db.add(db_condition)

        # Add required documents
        for doc_type in rule.document_types:
            db_document = db_models.Document(rule_id=db_rule.id, document_type=doc_type)
            db.add(db_document)

        db.commit()
        db.refresh(db_rule)

        return format_rule_response(db_rule)
    except Exception as e:
        db.rollback()  # Rollback in case of error
        raise HTTPException(status_code=400, detail=str(e))


@app.get("/rules/", response_model=List[models.RuleResponse])
def get_rules(db: Session = Depends(get_db)):
    rules = db.query(db_models.Rule).all()
    print("Found rules:", rules)  # This will show in the Docker logs
    return [format_rule_response(rule) for rule in rules]


@app.get("/rules/{rule_id}", response_model=models.RuleResponse)
def get_rule(rule_id: uuid.UUID, db: Session = Depends(get_db)):
    rule = db.query(db_models.Rule).filter(db_models.Rule.id == rule_id).first()
    if not rule:
        raise HTTPException(status_code=404, detail="Rule not found")
    return format_rule_response(rule)


@app.delete("/rules/{rule_id}")
def delete_rule(rule_id: uuid.UUID, db: Session = Depends(get_db)):
    rule = db.query(db_models.Rule).filter(db_models.Rule.id == rule_id).first()
    if not rule:
        raise HTTPException(status_code=404, detail="Rule not found")

    db.delete(rule)
    db.commit()
    return {"message": "Rule deleted successfully"}


def format_rule_response(rule: db_models.Rule) -> models.RuleResponse:
    return models.RuleResponse(
        id=rule.id,
        name=rule.name,
        conditions=[
            models.ConditionBase(type=c.condition_type, value=c.condition_value)
            for c in rule.conditions
        ],
        document_types=[doc.document_type for doc in rule.documents],
        created_at=rule.created_at,
        updated_at=rule.updated_at,
    )
