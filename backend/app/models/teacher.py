from sqlalchemy import Column, Integer, String, Boolean, DateTime
from datetime import datetime
from ..db.database import Base

class Teacher(Base):
    __tablename__ = "teachers"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)
    teacher_uid = Column(String, unique=True, index=True) # Must start with RC-
    hashed_password = Column(String)
    image = Column(String, nullable=True) # Store image URL or path
    created_at = Column(DateTime, default=datetime.utcnow)
    is_active = Column(Boolean, default=True)
