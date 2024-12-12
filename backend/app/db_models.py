from sqlalchemy import Column, String, DateTime, ForeignKey, Enum, Boolean
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
import uuid
from datetime import datetime
from .database import Base


class Rule(Base):
    __tablename__ = "rules"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    name = Column(String, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    conditions = relationship("Condition", back_populates="rule", cascade="all, delete-orphan")
    documents = relationship("Document", back_populates="rule", cascade="all, delete-orphan")


class Condition(Base):
    __tablename__ = "conditions"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    rule_id = Column(UUID(as_uuid=True), ForeignKey("rules.id"), nullable=False)
    condition_type = Column(String, nullable=False)
    condition_value = Column(String, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)

    rule = relationship("Rule", back_populates="conditions")


class Document(Base):
    __tablename__ = "documents"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    rule_id = Column(UUID(as_uuid=True), ForeignKey("rules.id"), nullable=False)
    document_type = Column(
        Enum("tax_return", "business_docs", "income_verification", name="document_type_enum"),
        nullable=False,
    )
    created_at = Column(DateTime, default=datetime.utcnow)

    rule = relationship("Rule", back_populates="documents")


class Application(Base):
    __tablename__ = "applications"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    family_id = Column(UUID(as_uuid=True), nullable=False)
    family_status = Column(Enum("new", "returning", name="family_status_enum"), nullable=True)
    business_owner = Column(Boolean, nullable=True)
    tax_filing = Column(Enum("filed", "not_filed", name="tax_filing_enum"), nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Relationship to track which rules matched this application
    matching_rules = relationship("Rule", secondary="rule_matches", backref="matching_applications")


class RuleMatch(Base):
    __tablename__ = "rule_matches"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    rule_id = Column(UUID(as_uuid=True), ForeignKey("rules.id"), nullable=False)
    application_id = Column(UUID(as_uuid=True), ForeignKey("applications.id"), nullable=False)
    matched_at = Column(DateTime, default=datetime.utcnow)
