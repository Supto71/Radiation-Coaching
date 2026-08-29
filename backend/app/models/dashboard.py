from sqlalchemy import Column, Integer, String, Float, Boolean, ForeignKey, DateTime, Date, UniqueConstraint
from sqlalchemy.orm import relationship
from datetime import datetime
from ..db.database import Base

class Notice(Base):
    __tablename__ = "notices"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, index=True)
    content = Column(String)
    image = Column(String, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    is_active = Column(Boolean, default=True)
    author_id = Column(Integer, ForeignKey("users.id"))

class FeeRecord(Base):
    __tablename__ = "fee_records"

    id = Column(Integer, primary_key=True, index=True)
    student_id = Column(Integer, ForeignKey("students.id"))
    amount = Column(Float)
    month = Column(String) # e.g. "July 2026"
    status = Column(String, default="Due") # "Due", "Partial", "Paid"
    paid_amount = Column(Float, default=0.0)
    payment_history = Column(String, default="[]") # JSON array of payments
class Exam(Base):
    __tablename__ = "exams"
    
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, index=True)
    subject = Column(String)
    class_level = Column(String, nullable=True) # E.g., "Class 6", "Class 7"
    duration_minutes = Column(Integer, default=30)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)

class Question(Base):
    __tablename__ = "questions"
    
    id = Column(Integer, primary_key=True, index=True)
    exam_id = Column(Integer, ForeignKey("exams.id"))
    text = Column(String)
    options = Column(String) # Stored as JSON string (e.g. '["Option 1", "Option 2"]')
    correct_answer = Column(Integer) # Index of correct option (0-3)

class ExamResult(Base):
    __tablename__ = "exam_results"
    __table_args__ = (
        UniqueConstraint("student_id", "exam_id", name="uq_exam_results_student_exam"),
    )

    id = Column(Integer, primary_key=True, index=True)
    student_id = Column(Integer, ForeignKey("students.id"))
    exam_id = Column(Integer, ForeignKey("exams.id"))
    score = Column(Float)
    total_correct = Column(Integer)
    total_wrong = Column(Integer)
    taken_at = Column(DateTime, default=datetime.utcnow)
    
    exam = relationship("Exam")

class Routine(Base):
    __tablename__ = "routines"

    id = Column(Integer, primary_key=True, index=True)
    date = Column(String, index=True) # e.g. "2026-06-24"
    start_time = Column(String) # e.g. "5:00 PM"
    end_time = Column(String) # e.g. "6:00 PM"
    branch = Column(String) # e.g. "প্রধান শাখা"
    class_level = Column(String) # e.g. "9th/10th"
    class_name = Column(String) # e.g. "Islam"
    teacher_name = Column(String) # e.g. "Mim ma'am"
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    author_id = Column(Integer, ForeignKey("users.id"))

class TeacherAttendance(Base):
    __tablename__ = "teacher_attendance"

    id = Column(Integer, primary_key=True, index=True)
    teacher_name = Column(String, index=True)
    date = Column(String, index=True) # e.g. "2026-07-17"
    classes_taken = Column(Integer, default=0)
    subjects = Column(String) # e.g. "Math, Physics"
    batches = Column(String) # e.g. "Batch 1, Batch 2"
    status = Column(String, default="Present")
    created_at = Column(DateTime, default=datetime.utcnow)

