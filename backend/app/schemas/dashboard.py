from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime, date

# Notice Schemas
class NoticeBase(BaseModel):
    title: str
    content: str

class NoticeCreate(NoticeBase):
    pass

class Notice(NoticeBase):
    id: int
    created_at: datetime
    is_active: bool
    author_id: int

    class Config:
        from_attributes = True

# FeeRecord Schemas
class FeeRecordBase(BaseModel):
    amount: float
    month: str
    is_paid: bool = False
    payment_date: Optional[date] = None

class FeeRecordCreate(FeeRecordBase):
    student_id: int

class FeeRecord(FeeRecordBase):
    id: int
    student_id: int

    class Config:
        from_attributes = True

# ExamResult Schemas
class ExamResultBase(BaseModel):
    exam_id: int
    score: float
    total_correct: int
    total_wrong: int

class ExamResultCreate(ExamResultBase):
    pass

class ExamResult(ExamResultBase):
    id: int
    student_id: int
    taken_at: datetime

    class Config:
        from_attributes = True

# Routine Schemas
class RoutineBase(BaseModel):
    date: str
    start_time: str
    end_time: str
    class_level: str
    class_name: str
    teacher_name: str

class RoutineCreate(RoutineBase):
    pass

class Routine(RoutineBase):
    id: int
    updated_at: datetime
    author_id: int

    class Config:
        from_attributes = True
