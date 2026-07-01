from sqlalchemy import Column, Integer, String, Float, Boolean, ForeignKey, DateTime, Date
from sqlalchemy.orm import relationship
from datetime import datetime
from ..db.database import Base

class Notice(Base):
    __tablename__ = "notices"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, index=True)
    content = Column(String)
    created_at = Column(DateTime, default=datetime.utcnow)
    is_active = Column(Boolean, default=True)
    author_id = Column(Integer, ForeignKey("users.id"))

class FeeRecord(Base):
    __tablename__ = "fee_records"

    id = Column(Integer, primary_key=True, index=True)
    student_id = Column(Integer, ForeignKey("users.id"))
    amount = Column(Float)
    month = Column(String) # e.g. "July 2026"
    is_paid = Column(Boolean, default=False)
    payment_date = Column(Date, nullable=True)

class ExamResult(Base):
    __tablename__ = "exam_results"

    id = Column(Integer, primary_key=True, index=True)
    student_id = Column(Integer, ForeignKey("users.id"))
    exam_id = Column(Integer)
    score = Column(Float)
    total_correct = Column(Integer)
    total_wrong = Column(Integer)
    taken_at = Column(DateTime, default=datetime.utcnow)

class Routine(Base):
    __tablename__ = "routines"

    id = Column(Integer, primary_key=True, index=True)
    date = Column(String, index=True) # e.g. "2026-06-24"
    start_time = Column(String) # e.g. "5:00 PM"
    end_time = Column(String) # e.g. "6:00 PM"
    class_level = Column(String) # e.g. "9th/10th"
    class_name = Column(String) # e.g. "Islam"
    teacher_name = Column(String) # e.g. "Mim ma'am"
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    author_id = Column(Integer, ForeignKey("users.id"))
