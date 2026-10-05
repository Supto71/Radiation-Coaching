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
    guardian_phone: Optional[str] = None
    monthly_fee: Optional[float] = None
    admission_fee: Optional[float] = None

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

class StudentFeeUpdate(BaseModel):
    monthly_fee: Optional[float] = None

class StudentFeeBulkUpdate(BaseModel):
    class_level: str
    monthly_fee: float
    branch: Optional[str] = None
    only_unset: bool = False  # if True, only fill students who have no fee yet

class StudentLogin(BaseModel):
    student_uid: str
    phone: str
