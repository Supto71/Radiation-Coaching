from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class TeacherBase(BaseModel):
    name: str
    teacher_uid: str
    image: Optional[str] = None
    is_active: bool = True

class TeacherCreate(TeacherBase):
    password: str

class TeacherUpdate(BaseModel):
    name: Optional[str] = None
    password: Optional[str] = None
    image: Optional[str] = None

class TeacherResponse(TeacherBase):
    id: int
    created_at: datetime

    class Config:
        orm_mode = True

class TeacherLogin(BaseModel):
    teacher_uid: str
    password: str
