from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class StudentBase(BaseModel):
    name: str
    class_level: str
    branch: str
    phone: Optional[str] = None
    gender: Optional[str] = "ছেলে"
    father_name: Optional[str] = None
    mother_name: Optional[str] = None
    guardian_phone: str # Required now

class StudentCreate(StudentBase):
    student_uid: Optional[str] = None

class StudentUpdate(StudentBase):
    student_uid: Optional[str] = None

class Student(StudentBase):
    id: int
    student_uid: str
    created_at: datetime

    class Config:
        from_attributes = True

class StudentLogin(BaseModel):
    student_uid: str
    phone: str
