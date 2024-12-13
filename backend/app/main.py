from fastapi import FastAPI, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from typing import List
from . import models, db_models
from .database import get_db, engine
import uuid

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # React app's address
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.post("/rules/", response_model=models.RuleResponse)
def create_rule(rule: models.RuleCreate, db: Session = Depends(get_db)):
    db_rule = db_models.Rule(name=rule.name)
    db.add(db_rule)
    db.commit()
    db.refresh(db_rule)

    try:
        for condition in rule.conditions:
            db_condition = db_models.Condition(
                rule_id=db_rule.id, condition_type=condition.type, condition_value=condition.value
            )
            db.add(db_condition)

        for doc_type in rule.document_types:
            db_document = db_models.Document(rule_id=db_rule.id, document_type=doc_type)
            db.add(db_document)

        db.commit()
        db.refresh(db_rule)

        return format_rule_response(db_rule)
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=400, detail=str(e))


@app.get("/rules/", response_model=List[models.RuleResponse])
def get_rules(db: Session = Depends(get_db)):
    rules = db.query(db_models.Rule).all()
    print("Found rules:", rules)
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


@app.post("/applications/", response_model=models.ApplicationResponse)
def submit_application(application: models.ApplicationCreate, db: Session = Depends(get_db)):
    db_application = db_models.Application(
        family_id=application.family_id,
        family_status=application.family_status,
        business_owner=application.business_owner,
        tax_filing=application.tax_filing,
    )
    db.add(db_application)
    db.commit()
    db.refresh(db_application)

    evaluate_rules_for_application(db_application, db)

    return format_application_response(db_application)


def evaluate_rules_for_application(application: db_models.Application, db: Session):
    """Evaluate all rules and create matches for rules that apply."""
    rules = db.query(db_models.Rule).all()

    for rule in rules:
        if evaluate_rule_conditions(rule, application):
            print(f"Rule {rule.name} matches application {application.id}")
            match = db_models.RuleMatch(rule_id=rule.id, application_id=application.id)
            db.add(match)

            trigger_document_requests(rule, application, db)

    db.commit()


def evaluate_rule_conditions(rule: db_models.Rule, application: db_models.Application) -> bool:
    """Check if an application matches all conditions of a rule."""
    for condition in rule.conditions:
        if not evaluate_single_condition(condition, application):
            return False
    return True


def evaluate_single_condition(
    condition: db_models.Condition, application: db_models.Application
) -> bool:
    """Evaluate a single condition against an application."""
    if condition.condition_type == "family_status":
        return application.family_status == condition.condition_value
    elif condition.condition_type == "business_owner":
        return str(application.business_owner).lower() == condition.condition_value
    elif condition.condition_type == "tax_filing":
        return application.tax_filing == condition.condition_value
    return False


def trigger_document_requests(
    rule: db_models.Rule, application: db_models.Application, db: Session
):
    """Create document requests based on rule's required documents."""
    for document in rule.documents:
        # In a future system, this might create notifications, emails, or other
        print(f"Requesting document: {document.document_type} for application {application.id}")


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


def format_application_response(application: db_models.Application) -> models.ApplicationResponse:
    return models.ApplicationResponse(
        id=application.id,
        family_id=application.family_id,
        family_status=application.family_status,
        business_owner=application.business_owner,
        tax_filing=application.tax_filing,
        created_at=application.created_at,
        updated_at=application.updated_at,
        matching_rules=[format_rule_response(rule) for rule in application.matching_rules],
    )
