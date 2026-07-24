from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session, joinedload
from sqlalchemy import func
from typing import List, Optional
from datetime import date

from ..db.database import get_db
from ..models import dashboard as db_models
from ..models.student import Student as StudentModel
from ..models.user import User
from ..schemas import dashboard as schemas

router = APIRouter()

def get_default_admin(db: Session):
    admin = db.query(User).first()
    if not admin:
        admin = User(email="admin@example.com", hashed_password="x", full_name="System Admin")
        db.add(admin)
        db.commit()
        db.refresh(admin)
    return admin.id

# --- NOTICES ---
@router.get("/notices", response_model=List[schemas.Notice])
def get_notices(db: Session = Depends(get_db)):
    return db.query(db_models.Notice).filter(db_models.Notice.is_active == True).order_by(db_models.Notice.created_at.desc()).all()

@router.post("/notices", response_model=schemas.Notice)
def create_notice(notice: schemas.NoticeCreate, db: Session = Depends(get_db)):
    from datetime import datetime
    notice_data = notice.model_dump()
    custom_date_str = notice_data.pop('custom_date', None)
    created_at = datetime.utcnow()
    if custom_date_str:
        try:
            created_at = datetime.strptime(custom_date_str, '%Y-%m-%d')
        except ValueError:
            pass
    db_notice = db_models.Notice(**notice_data, author_id=get_default_admin(db), created_at=created_at)
    db.add(db_notice)
    db.commit()
    db.refresh(db_notice)
    return db_notice

@router.put("/notices/{notice_id}", response_model=schemas.Notice)
def update_notice(notice_id: int, notice_update: schemas.NoticeUpdate, db: Session = Depends(get_db)):
    db_notice = db.query(db_models.Notice).filter(db_models.Notice.id == notice_id).first()
    if not db_notice:
        raise HTTPException(status_code=404, detail="Notice not found")
    
    update_data = notice_update.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(db_notice, key, value)
        
    db.commit()
    db.refresh(db_notice)
    return db_notice

@router.delete("/notices/{notice_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_notice(notice_id: int, db: Session = Depends(get_db)):
    db_notice = db.query(db_models.Notice).filter(db_models.Notice.id == notice_id).first()
    if not db_notice:
        raise HTTPException(status_code=404, detail="Notice not found")
    db.delete(db_notice)
    db.commit()
    return None

# --- FEES ---
@router.get("/fees", response_model=List[schemas.FeeRecordWithStudent])
def get_all_fees(
    is_paid: Optional[bool] = None,
    month: Optional[str] = None,
    branch: Optional[str] = None,
    db: Session = Depends(get_db)
):
    query = db.query(db_models.FeeRecord)
    if is_paid is not None:
        query = query.filter(db_models.FeeRecord.is_paid == is_paid)
    if month:
        query = query.filter(db_models.FeeRecord.month == month)
    
    records = query.order_by(db_models.FeeRecord.id.desc()).all()
    
    result = []
    for record in records:
        student = db.query(StudentModel).filter(StudentModel.id == record.student_id).first()
        if branch and student and student.branch != branch:
            continue
        result.append(schemas.FeeRecordWithStudent(
            id=record.id,
            student_id=record.student_id,
            amount=record.amount,
            month=record.month,
            is_paid=record.is_paid,
            payment_date=record.payment_date,
            student_name=student.name if student and student.name else "অজানা",
            student_uid=student.student_uid if student and student.student_uid else "",
            student_branch=student.branch if student and student.branch else "",
            student_class=student.class_level if student and student.class_level else "",
        ))
    return result

@router.get("/fees/me", response_model=List[schemas.FeeRecord])
def get_my_fees(student_id: int, db: Session = Depends(get_db)):
    return db.query(db_models.FeeRecord).filter(db_models.FeeRecord.student_id == student_id).all()

@router.post("/fees", response_model=schemas.FeeRecord)
def create_fee_record(fee: schemas.FeeRecordCreate, db: Session = Depends(get_db)):
    try:
        data = fee.model_dump()
        if data.get('is_paid') and not data.get('payment_date'):
            from datetime import date
            data['payment_date'] = date.today()
            
        db_fee = db_models.FeeRecord(**data)
        db.add(db_fee)
        db.commit()
        db.refresh(db_fee)
        return db_fee
    except Exception as e:
        db.rollback()
        from fastapi import HTTPException
        raise HTTPException(status_code=400, detail=f"Database error: {str(e)}")

@router.patch("/fees/{fee_id}/pay", response_model=schemas.FeeRecord)
def mark_fee_paid(fee_id: int, db: Session = Depends(get_db)):
    fee = db.query(db_models.FeeRecord).filter(db_models.FeeRecord.id == fee_id).first()
    if not fee:
        raise HTTPException(status_code=404, detail="Fee record not found")
    fee.is_paid = True
    fee.payment_date = date.today()
    db.commit()
    db.refresh(fee)
    return fee

@router.patch("/fees/{fee_id}", response_model=schemas.FeeRecord)
def update_fee_record(fee_id: int, fee_update: schemas.FeeRecordUpdate, db: Session = Depends(get_db)):
    fee = db.query(db_models.FeeRecord).filter(db_models.FeeRecord.id == fee_id).first()
    if not fee:
        raise HTTPException(status_code=404, detail="Fee record not found")
    
    if fee_update.amount is not None:
        fee.amount = fee_update.amount
    if fee_update.month is not None:
        fee.month = fee_update.month
    if fee_update.is_paid is not None:
        if fee_update.is_paid and not fee.is_paid:
            from datetime import date
            fee.payment_date = date.today()
        elif not fee_update.is_paid:
            fee.payment_date = None
        fee.is_paid = fee_update.is_paid

    db.commit()
    db.refresh(fee)
    return fee

@router.delete("/fees/{fee_id}")
def delete_fee_record(fee_id: int, db: Session = Depends(get_db)):
    fee = db.query(db_models.FeeRecord).filter(db_models.FeeRecord.id == fee_id).first()
    if not fee:
        raise HTTPException(status_code=404, detail="Fee record not found")
    db.delete(fee)
    db.commit()
    return {"message": "Fee record deleted successfully"}

# --- EXAMS ---
@router.get("/exams", response_model=List[schemas.Exam])
def get_all_exams(active_only: bool = False, db: Session = Depends(get_db)):
    query = db.query(db_models.Exam)
    if active_only:
        query = query.filter(db_models.Exam.is_active == True)
    return query.order_by(db_models.Exam.created_at.desc()).all()

@router.post("/exams", response_model=schemas.Exam)
def create_exam(exam: schemas.ExamCreate, db: Session = Depends(get_db)):
    db_exam = db_models.Exam(**exam.model_dump())
    db.add(db_exam)
    db.commit()
    db.refresh(db_exam)
    return db_exam

@router.get("/exams/{exam_id}", response_model=schemas.Exam)
def get_exam(exam_id: int, db: Session = Depends(get_db)):
    exam = db.query(db_models.Exam).filter(db_models.Exam.id == exam_id).first()
    if not exam:
        raise HTTPException(status_code=404, detail="Exam not found")
    questions = db.query(db_models.Question).filter(db_models.Question.exam_id == exam_id).all()
    exam.questions = questions
    return exam

@router.patch("/exams/{exam_id}/toggle", response_model=schemas.Exam)
def toggle_exam_active(exam_id: int, db: Session = Depends(get_db)):
    exam = db.query(db_models.Exam).filter(db_models.Exam.id == exam_id).first()
    if not exam:
        raise HTTPException(status_code=404, detail="Exam not found")
    exam.is_active = not exam.is_active
    db.commit()
    db.refresh(exam)
    return exam

@router.put("/exams/{exam_id}", response_model=schemas.Exam)
def update_exam(exam_id: int, exam_update: schemas.ExamUpdate, db: Session = Depends(get_db)):
    exam = db.query(db_models.Exam).filter(db_models.Exam.id == exam_id).first()
    if not exam:
        raise HTTPException(status_code=404, detail="Exam not found")
    
    update_data = exam_update.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(exam, key, value)
        
    db.commit()
    db.refresh(exam)
    return exam

@router.delete("/exams/{exam_id}")
def delete_exam(exam_id: int, db: Session = Depends(get_db)):
    exam = db.query(db_models.Exam).filter(db_models.Exam.id == exam_id).first()
    if not exam:
        raise HTTPException(status_code=404, detail="Exam not found")
    db.query(db_models.Question).filter(db_models.Question.exam_id == exam_id).delete()
    db.delete(exam)
    db.commit()
    return {"message": "Exam deleted"}

@router.post("/exams/{exam_id}/questions", response_model=schemas.Question)
def add_question(exam_id: int, question: schemas.QuestionCreate, db: Session = Depends(get_db)):
    exam = db.query(db_models.Exam).filter(db_models.Exam.id == exam_id).first()
    if not exam:
        raise HTTPException(status_code=404, detail="Exam not found")
    db_q = db_models.Question(**question.model_dump(), exam_id=exam_id)
    db.add(db_q)
    db.commit()
    db.refresh(db_q)
    return db_q

@router.delete("/questions/{question_id}")
def delete_question(question_id: int, db: Session = Depends(get_db)):
    q = db.query(db_models.Question).filter(db_models.Question.id == question_id).first()
    if not q:
        raise HTTPException(status_code=404, detail="Question not found")
    db.delete(q)
    db.commit()
    return {"message": "Question deleted"}

# --- EXAM RESULTS (Performance) ---
@router.get("/results/me", response_model=List[schemas.ExamResult])
def get_my_results(student_id: int, db: Session = Depends(get_db)):
    return db.query(db_models.ExamResult).options(joinedload(db_models.ExamResult.exam)).filter(db_models.ExamResult.student_id == student_id).order_by(db_models.ExamResult.taken_at.desc()).all()

@router.post("/results", response_model=schemas.ExamResult)
def submit_exam_result(result: schemas.ExamResultCreate, student_id: int, db: Session = Depends(get_db)):
    db_result = db_models.ExamResult(**result.model_dump(), student_id=student_id)
    db.add(db_result)
    db.commit()
    db.refresh(db_result)
    return db_result

# --- ROUTINE ---
@router.get("/routines", response_model=List[schemas.Routine])
def get_routines(branch: str = None, class_level: str = None, db: Session = Depends(get_db)):
    query = db.query(db_models.Routine)
    if branch:
        query = query.filter(db_models.Routine.branch == branch)
    if class_level:
        query = query.filter(db_models.Routine.class_level == class_level)
    return query.order_by(db_models.Routine.date.asc(), db_models.Routine.start_time.asc()).all()

@router.post("/routines", response_model=schemas.Routine)
def create_or_update_routine(routine: schemas.RoutineCreate, db: Session = Depends(get_db)):
    db_routine = db.query(db_models.Routine).filter(
        db_models.Routine.date == routine.date,
        db_models.Routine.start_time == routine.start_time,
        db_models.Routine.end_time == routine.end_time,
        db_models.Routine.branch == routine.branch,
        db_models.Routine.class_level == routine.class_level
    ).first()
    
    if db_routine:
        db_routine.class_name = routine.class_name
        db_routine.teacher_name = routine.teacher_name
        db_routine.author_id = get_default_admin(db)
    else:
        db_routine = db_models.Routine(**routine.model_dump(), author_id=get_default_admin(db))
        db.add(db_routine)
    
    db.commit()
    db.refresh(db_routine)
    return db_routine

@router.put("/routines/{routine_id}", response_model=schemas.Routine)
def update_routine(routine_id: int, routine_update: schemas.RoutineUpdate, db: Session = Depends(get_db)):
    routine = db.query(db_models.Routine).filter(db_models.Routine.id == routine_id).first()
    if not routine:
        raise HTTPException(status_code=404, detail="Routine not found")
    
    update_data = routine_update.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(routine, key, value)
        
    db.commit()
    db.refresh(routine)
    return routine

@router.delete("/routines/past")
def delete_past_routines(db: Session = Depends(get_db)):
    from datetime import date
    today = date.today().isoformat()
    
    # Delete routines where date < today
    past_routines = db.query(db_models.Routine).filter(db_models.Routine.date < today).all()
    count = len(past_routines)
    
    for r in past_routines:
        db.delete(r)
    db.commit()
    
    return {"message": f"{count} past routines deleted successfully"}

@router.delete("/routines/{routine_id}")
def delete_routine(routine_id: int, db: Session = Depends(get_db)):
    routine = db.query(db_models.Routine).filter(db_models.Routine.id == routine_id).first()
    if not routine:
        raise HTTPException(status_code=404, detail="Routine not found")
    
    db.delete(routine)
    db.commit()
    return {"message": "Routine deleted successfully"}

# --- Teacher Attendance Endpoints ---

@router.get("/teacher-attendance", response_model=List[schemas.TeacherAttendance])
def get_all_teacher_attendance(db: Session = Depends(get_db)):
    return db.query(db_models.TeacherAttendance).order_by(db_models.TeacherAttendance.date.desc()).all()

@router.get("/teacher-attendance/{teacher_name}", response_model=List[schemas.TeacherAttendance])
def get_teacher_attendance(teacher_name: str, db: Session = Depends(get_db)):
    return db.query(db_models.TeacherAttendance).filter(
        db_models.TeacherAttendance.teacher_name == teacher_name
    ).order_by(db_models.TeacherAttendance.date.desc()).all()

@router.post("/teacher-attendance", response_model=schemas.TeacherAttendance)
def create_teacher_attendance(attendance: schemas.TeacherAttendanceCreate, db: Session = Depends(get_db)):
    # Check if already submitted for today
    existing = db.query(db_models.TeacherAttendance).filter(
        db_models.TeacherAttendance.teacher_name == attendance.teacher_name,
        db_models.TeacherAttendance.date == attendance.date
    ).first()
    if existing:
        raise HTTPException(status_code=400, detail="Attendance already submitted for this date")
    
    db_attendance = db_models.TeacherAttendance(**attendance.model_dump())
    db.add(db_attendance)
    db.commit()
    db.refresh(db_attendance)
    return db_attendance

@router.put("/teacher-attendance/{attendance_id}", response_model=schemas.TeacherAttendance)
def update_teacher_attendance(attendance_id: int, attendance_update: schemas.TeacherAttendanceUpdate, db: Session = Depends(get_db)):
    db_attendance = db.query(db_models.TeacherAttendance).filter(db_models.TeacherAttendance.id == attendance_id).first()
    if not db_attendance:
        raise HTTPException(status_code=404, detail="Attendance record not found")
    
    update_data = attendance_update.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(db_attendance, key, value)
        
    db.commit()
    db.refresh(db_attendance)
    return db_attendance

@router.delete("/teacher-attendance/{attendance_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_teacher_attendance(attendance_id: int, db: Session = Depends(get_db)):
    db_attendance = db.query(db_models.TeacherAttendance).filter(db_models.TeacherAttendance.id == attendance_id).first()
    if not db_attendance:
        raise HTTPException(status_code=404, detail="Attendance record not found")
    db.delete(db_attendance)
    db.commit()
    return None
