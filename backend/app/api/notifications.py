from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List

from ..db.database import get_db
from ..models.notification import Notification as NotificationModel
from ..models.student import Student as StudentModel
from ..schemas.notification import NotificationResponse

router = APIRouter()

@router.get("/{student_uid}", response_model=List[NotificationResponse])
def get_student_notifications(student_uid: str, db: Session = Depends(get_db)):
    """Fetch all notifications for a student by their UID."""
    student = db.query(StudentModel).filter(StudentModel.student_uid == student_uid).first()
    if not student:
        raise HTTPException(status_code=404, detail="Student not found")
        
    return db.query(NotificationModel).filter(
        NotificationModel.student_id == student.id
    ).order_by(NotificationModel.created_at.desc()).all()


@router.put("/{notification_id}/read", response_model=NotificationResponse)
def mark_notification_as_read(notification_id: int, db: Session = Depends(get_db)):
    """Mark a specific notification as read."""
    notification = db.query(NotificationModel).filter(NotificationModel.id == notification_id).first()
    if not notification:
        raise HTTPException(status_code=404, detail="Notification not found")
        
    notification.is_read = True
    db.commit()
    db.refresh(notification)
    return notification
