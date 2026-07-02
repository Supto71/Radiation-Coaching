from sqlalchemy import Column, Integer, String, Boolean, Date, DateTime, ForeignKey
from datetime import datetime
from ..db.database import Base

class Attendance(Base):
    __tablename__ = "attendance"

    id = Column(Integer, primary_key=True, index=True)
    student_id = Column(Integer, ForeignKey("students.id"), index=True)
    date = Column(Date, index=True)
    branch = Column(String)
    class_level = Column(String)
    is_present = Column(Boolean, default=False)
    marked_by = Column(String, default="admin")  # teacher name or admin
    created_at = Column(DateTime, default=datetime.utcnow)
