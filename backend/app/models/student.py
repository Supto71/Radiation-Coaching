from sqlalchemy import Column, Integer, String, DateTime
from datetime import datetime
from ..db.database import Base

class Student(Base):
    __tablename__ = "students"

    id = Column(Integer, primary_key=True, index=True)
    student_uid = Column(String, unique=True, index=True)  # e.g. "RC-2026-001"
    name = Column(String, nullable=False)
    class_level = Column(String)   # e.g. "9th/10th", "College"
    branch = Column(String)        # "প্রধান শাখা" or "২য় শাখা"
    phone = Column(String, nullable=True)
    gender = Column(String, nullable=True, default="ছেলে")
    father_name = Column(String, nullable=True)
    mother_name = Column(String, nullable=True)
    guardian_phone = Column(String, nullable=True) # Make this required conceptually but keep DB backward compatible if needed
    created_at = Column(DateTime, default=datetime.utcnow)
