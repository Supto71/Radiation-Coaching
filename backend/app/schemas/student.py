from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class StudentBase(BaseModel):
    name: Optional[str] = None
    class_level: Optional[str] = None
    branch: Optional[str] = None
    phone: Optional[str] = None
    gender: Optional[str] = "ছেলে"
    father_name: Optional[str] = None
    mother_name: Optional[str] = None
    guardian_phone: Optional[str] = None
    monthly_fee: Optional[float] = 0.0

class StudentCreate(StudentBase):
    student_uid: Optional[str] = None

class StudentUpdate(StudentBase):
    student_uid: Optional[str] = None

class Student(StudentBase):
    id: int
    student_uid: Optional[str] = None
    created_at: Optional[datetime] = None

    class Config:
        from_attributes = True

class StudentLogin(BaseModel):
    student_uid: str
    phone: str
