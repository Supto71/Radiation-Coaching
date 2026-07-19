from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from ..db.database import get_db
from ..models import teacher as teacher_model
from ..schemas import teacher as teacher_schema
from ..core import security

router = APIRouter()

@router.post("/", response_model=teacher_schema.TeacherResponse)
def create_teacher(teacher: teacher_schema.TeacherCreate, db: Session = Depends(get_db)):
    if not teacher.teacher_uid.startswith("RC-"):
        raise HTTPException(status_code=400, detail="Teacher UID must start with RC-")
        
    db_teacher = db.query(teacher_model.Teacher).filter(teacher_model.Teacher.teacher_uid == teacher.teacher_uid).first()
    if db_teacher:
        raise HTTPException(status_code=400, detail="Teacher UID already exists")
    
    hashed_password = security.get_password_hash(teacher.password)
    new_teacher = teacher_model.Teacher(
        name=teacher.name,
        teacher_uid=teacher.teacher_uid,
        hashed_password=hashed_password,
        image=teacher.image,
        is_active=teacher.is_active
    )
    db.add(new_teacher)
    db.commit()
    db.refresh(new_teacher)
    return new_teacher

@router.get("/", response_model=List[teacher_schema.TeacherResponse])
def get_teachers(db: Session = Depends(get_db)):
    teachers = db.query(teacher_model.Teacher).all()
    return teachers

@router.post("/login", response_model=teacher_schema.TeacherResponse)
def login_teacher(login_data: teacher_schema.TeacherLogin, db: Session = Depends(get_db)):
    teacher = db.query(teacher_model.Teacher).filter(teacher_model.Teacher.teacher_uid == login_data.teacher_uid).first()
    if not teacher or not security.verify_password(login_data.password, teacher.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect Teacher UID or password"
        )
    if not teacher.is_active:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Inactive Teacher"
        )
    return teacher

@router.put("/{teacher_id}", response_model=teacher_schema.TeacherResponse)
def update_teacher(teacher_id: int, teacher_update: teacher_schema.TeacherUpdate, db: Session = Depends(get_db)):
    teacher = db.query(teacher_model.Teacher).filter(teacher_model.Teacher.id == teacher_id).first()
    if not teacher:
        raise HTTPException(status_code=404, detail="Teacher not found")
        
    if teacher_update.name is not None:
        teacher.name = teacher_update.name
    if teacher_update.password is not None:
        teacher.hashed_password = security.get_password_hash(teacher_update.password)
    if teacher_update.image is not None:
        teacher.image = teacher_update.image
        
    db.commit()
    db.refresh(teacher)
    return teacher

@router.delete("/{teacher_id}")
def delete_teacher(teacher_id: int, db: Session = Depends(get_db)):
    teacher = db.query(teacher_model.Teacher).filter(teacher_model.Teacher.id == teacher_id).first()
    if not teacher:
        raise HTTPException(status_code=404, detail="Teacher not found")
    
    db.delete(teacher)
    db.commit()
    return {"detail": "Teacher deleted"}
