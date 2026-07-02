from pydantic import BaseModel
from typing import List, Optional
from datetime import date, datetime

class AttendanceEntry(BaseModel):
    student_id: int
    is_present: bool

class AttendanceBulkCreate(BaseModel):
    date: str          # "YYYY-MM-DD"
    branch: str
    class_level: str
    marked_by: Optional[str] = "admin"
    entries: List[AttendanceEntry]

class AttendanceRecord(BaseModel):
    id: int
    student_id: int
    date: date
    branch: str
    class_level: str
    is_present: bool
    marked_by: str
    created_at: datetime

    class Config:
        from_attributes = True

class AttendanceWithStudent(BaseModel):
    id: int
    student_id: int
    student_name: str
    student_uid: str
    date: date
    branch: str
    class_level: str
    is_present: bool
    marked_by: str

    class Config:
        from_attributes = True
