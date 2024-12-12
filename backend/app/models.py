from pydantic import BaseModel
from typing import List, Optional
from uuid import UUID
from datetime import datetime


class ConditionBase(BaseModel):
    type: str
    value: str


class DocumentType(BaseModel):
    document_type: str


class RuleCreate(BaseModel):
    name: str
    conditions: List[ConditionBase]
    document_types: List[str]


class RuleResponse(BaseModel):
    id: UUID
    name: str
    conditions: List[ConditionBase]
    document_types: List[str]
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


class ApplicationBase(BaseModel):
    family_id: UUID
    family_status: Optional[str]
    business_owner: Optional[bool]
    tax_filing: Optional[str]


class ApplicationCreate(ApplicationBase):
    pass


class ApplicationResponse(ApplicationBase):
    id: UUID
    created_at: datetime
    updated_at: datetime
    matching_rules: List[RuleResponse] = []

    class Config:
        from_attributes = True
