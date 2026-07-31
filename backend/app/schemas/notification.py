from pydantic import BaseModel
from datetime import datetime

class NotificationBase(BaseModel):
    title: str
    message: str

class NotificationCreate(NotificationBase):
    student_id: int

class NotificationResponse(NotificationBase):
    id: int
    student_id: int
    is_read: bool
    created_at: datetime

    class Config:
        from_attributes = True
