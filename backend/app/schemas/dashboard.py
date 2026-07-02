from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime, date

# Notice Schemas
class NoticeBase(BaseModel):
    title: str
    content: str
    custom_date: Optional[str] = None  # format: YYYY-MM-DD

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

class FeeRecordUpdate(BaseModel):
    amount: float

class FeeRecordCreate(FeeRecordBase):
    student_id: int

class FeeRecord(FeeRecordBase):
    id: int
    student_id: int

    class Config:
        from_attributes = True

class FeeRecordWithStudent(FeeRecordBase):
    id: int
    student_id: int
    student_name: str
    student_uid: str
    student_branch: str
    student_class: str

    class Config:
        from_attributes = True

# Exam Schemas
class QuestionBase(BaseModel):
    text: str
    options: str # JSON array string
    correct_answer: int

class QuestionCreate(QuestionBase):
    pass

class Question(QuestionBase):
    id: int
    exam_id: int

    class Config:
        from_attributes = True

class ExamBase(BaseModel):
    title: str
    subject: str
    duration_minutes: int
    is_active: bool = True

class ExamCreate(ExamBase):
    pass

class Exam(ExamBase):
    id: int
    created_at: datetime
    questions: Optional[List[Question]] = []

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
    exam: Optional[Exam] = None

    class Config:
        from_attributes = True

# Routine Schemas
class RoutineBase(BaseModel):
    date: str
    start_time: str
    end_time: str
    branch: str
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
