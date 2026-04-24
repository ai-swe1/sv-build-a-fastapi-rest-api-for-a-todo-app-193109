from __future__ import annotations

from datetime import datetime
from typing import Optional

from pydantic import BaseModel, Field, validator

class TodoBase(BaseModel):
    title: str = Field(..., min_length=1, max_length=200)
    description: Optional[str] = Field(None, max_length=1000)
    completed: bool = Field(False)

    @validator('title')
    def title_must_not_be_blank(cls, v: str) -> str:
        if not v.strip():
            raise ValueError('title must not be blank')
        return v

class TodoCreate(TodoBase):
    """Schema for creating a new Todo item."""
    pass

class TodoUpdate(BaseModel):
    """Schema for updating an existing Todo item. All fields are optional."""
    title: Optional[str] = Field(None, min_length=1, max_length=200)
    description: Optional[str] = Field(None, max_length=1000)
    completed: Optional[bool] = None

    @validator('title')
    def title_must_not_be_blank(cls, v: Optional[str]) -> Optional[str]:
        if v is not None and not v.strip():
            raise ValueError('title must not be blank')
        return v

class TodoRead(TodoBase):
    """Schema returned to the client."""
    id: int
    created_at: datetime
    updated_at: datetime

    class Config:
        orm_mode = True
