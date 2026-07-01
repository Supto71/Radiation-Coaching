from sqlalchemy import Column, Integer, String, Float, Boolean, ForeignKey, JSON
from sqlalchemy.orm import relationship
from ..db.database import Base

class Exam(Base):
    __tablename__ = "exams"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, index=True)
    description = Column(String)
    duration_minutes = Column(Integer)
    is_active = Column(Boolean, default=True)
    negative_marking = Column(Float, default=0.0)

    questions = relationship("Question", back_populates="exam")

class Question(Base):
    __tablename__ = "questions"

    id = Column(Integer, primary_key=True, index=True)
    exam_id = Column(Integer, ForeignKey("exams.id"))
    text = Column(String, nullable=False)
    # Storing options as JSON array: ["opt1", "opt2", "opt3", "opt4"]
    options = Column(JSON, nullable=False)
    correct_option_index = Column(Integer, nullable=False)

    exam = relationship("Exam", back_populates="questions")
