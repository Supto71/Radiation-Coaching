from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List

from ..db.database import get_db
from ..models import dashboard as db_models
from ..models.user import User
from ..schemas import dashboard as schemas

router = APIRouter()

# --- NOTICES ---
@router.get("/notices", response_model=List[schemas.Notice])
def get_notices(db: Session = Depends(get_db)):
    return db.query(db_models.Notice).filter(db_models.Notice.is_active == True).order_by(db_models.Notice.created_at.desc()).all()

@router.post("/notices", response_model=schemas.Notice)
def create_notice(notice: schemas.NoticeCreate, db: Session = Depends(get_db)):
    # In a real app, author_id would come from the logged-in admin user
    # For now we'll hardcode or expect it to be handled
    db_notice = db_models.Notice(**notice.model_dump(), author_id=1) 
    db.add(db_notice)
    db.commit()
    db.refresh(db_notice)
    return db_notice

# --- FEES ---
@router.get("/fees/me", response_model=List[schemas.FeeRecord])
def get_my_fees(student_id: int, db: Session = Depends(get_db)):
    # student_id would normally come from current_user
    return db.query(db_models.FeeRecord).filter(db_models.FeeRecord.student_id == student_id).all()

@router.post("/fees", response_model=schemas.FeeRecord)
def create_fee_record(fee: schemas.FeeRecordCreate, db: Session = Depends(get_db)):
    db_fee = db_models.FeeRecord(**fee.model_dump())
    db.add(db_fee)
    db.commit()
    db.refresh(db_fee)
    return db_fee

# --- EXAM RESULTS (Performance) ---
@router.get("/results/me", response_model=List[schemas.ExamResult])
def get_my_results(student_id: int, db: Session = Depends(get_db)):
    return db.query(db_models.ExamResult).filter(db_models.ExamResult.student_id == student_id).order_by(db_models.ExamResult.taken_at.asc()).all()

@router.post("/results", response_model=schemas.ExamResult)
def submit_exam_result(result: schemas.ExamResultCreate, student_id: int, db: Session = Depends(get_db)):
    db_result = db_models.ExamResult(**result.model_dump(), student_id=student_id)
    db.add(db_result)
    db.commit()
    db.refresh(db_result)
    return db_result

# --- ROUTINE ---
@router.get("/routines", response_model=List[schemas.Routine])
def get_routines(class_level: str = None, db: Session = Depends(get_db)):
    query = db.query(db_models.Routine)
    if class_level:
        query = query.filter(db_models.Routine.class_level == class_level)
    return query.order_by(db_models.Routine.date.asc(), db_models.Routine.start_time.asc()).all()

@router.post("/routines", response_model=schemas.Routine)
def create_or_update_routine(routine: schemas.RoutineCreate, db: Session = Depends(get_db)):
    # Check if a routine already exists for this date, time block, and class level
    db_routine = db.query(db_models.Routine).filter(
        db_models.Routine.date == routine.date,
        db_models.Routine.start_time == routine.start_time,
        db_models.Routine.end_time == routine.end_time,
        db_models.Routine.class_level == routine.class_level
    ).first()
    
    if db_routine:
        db_routine.class_name = routine.class_name
        db_routine.teacher_name = routine.teacher_name
        db_routine.author_id = 1
    else:
        db_routine = db_models.Routine(**routine.model_dump(), author_id=1)
        db.add(db_routine)
    
    db.commit()
    db.refresh(db_routine)
    return db_routine
