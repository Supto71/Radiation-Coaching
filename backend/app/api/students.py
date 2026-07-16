from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import List, Optional

from ..db.database import get_db
from ..models.student import Student as StudentModel
from ..schemas.student import Student, StudentCreate, StudentUpdate, StudentLogin

router = APIRouter()

def generate_student_uid(db: Session) -> str:
    """Auto-generate a unique student ID like RC-001"""
    from sqlalchemy import func
    max_id = db.query(func.max(StudentModel.id)).scalar() or 0
    return f"RC-{max_id + 1:03d}"

@router.get("/", response_model=List[Student])
def get_students(
    search: Optional[str] = None,
    branch: Optional[str] = None,
    class_level: Optional[str] = None,
    gender: Optional[str] = None,
    db: Session = Depends(get_db)
):
    query = db.query(StudentModel)
    if branch:
        query = query.filter(StudentModel.branch == branch)
    if class_level:
        query = query.filter(StudentModel.class_level == class_level)
    if gender:
        query = query.filter(StudentModel.gender == gender)
    if search:
        search_term = f"%{search}%"
        query = query.filter(
            (StudentModel.name.ilike(search_term)) |
            (StudentModel.student_uid.ilike(search_term)) |
            (StudentModel.phone.ilike(search_term))
        )
    return query.order_by(StudentModel.created_at.desc()).all()

@router.post("/", response_model=Student)
def create_student(student: StudentCreate, db: Session = Depends(get_db)):
    student_uid = student.student_uid
    if not student_uid:
        student_uid = generate_student_uid(db)
    
    student_data = student.model_dump()
    student_data.pop("student_uid", None) # remove it if it exists so we can explicitly set it
    
    db_student = StudentModel(**student_data, student_uid=student_uid)
    db.add(db_student)
    db.commit()
    db.refresh(db_student)
    return db_student

@router.put("/{student_id}", response_model=Student)
def update_student(student_id: int, student: StudentUpdate, db: Session = Depends(get_db)):
    db_student = db.query(StudentModel).filter(StudentModel.id == student_id).first()
    if not db_student:
        raise HTTPException(status_code=404, detail="Student not found")
        
    update_data = student.model_dump(exclude_unset=True)
    if "student_uid" in update_data and update_data["student_uid"] is None:
        update_data.pop("student_uid") # don't overwrite with null

    for key, value in update_data.items():
        setattr(db_student, key, value)
        
    db.commit()
    db.refresh(db_student)
    return db_student

@router.delete("/{student_id}")
def delete_student(student_id: int, db: Session = Depends(get_db)):
    student = db.query(StudentModel).filter(StudentModel.id == student_id).first()
    if not student:
        raise HTTPException(status_code=404, detail="Student not found")
    db.delete(student)
    db.commit()
    return {"message": "Student deleted successfully"}

@router.post("/login", response_model=Student)
def login_student(creds: StudentLogin, db: Session = Depends(get_db)):
    if creds.phone != "12345":
        raise HTTPException(status_code=401, detail="Invalid credentials")
        
    student = db.query(StudentModel).filter(
        StudentModel.student_uid == creds.student_uid
    ).first()
    
    if not student:
        raise HTTPException(status_code=401, detail="Invalid credentials")
    
    return student
