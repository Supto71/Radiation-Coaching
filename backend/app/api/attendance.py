from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List, Optional
from datetime import date

from ..db.database import get_db
from ..models.attendance import Attendance as AttendanceModel
from ..models.student import Student as StudentModel
from ..schemas.attendance import (
    AttendanceBulkCreate, AttendanceRecord, AttendanceWithStudent
)

router = APIRouter()


@router.post("/bulk", response_model=List[AttendanceRecord])
def mark_attendance_bulk(payload: AttendanceBulkCreate, db: Session = Depends(get_db)):
    """Mark attendance for all students in a class on a given date."""
    from datetime import datetime
    att_date = datetime.strptime(payload.date, "%Y-%m-%d").date()

    results = []
    for entry in payload.entries:
        # Upsert: update if already exists, else create
        existing = db.query(AttendanceModel).filter(
            AttendanceModel.student_id == entry.student_id,
            AttendanceModel.date == att_date
        ).first()

        if existing:
            existing.is_present = entry.is_present
            existing.marked_by = payload.marked_by or "admin"
            db.commit()
            db.refresh(existing)
            results.append(existing)
        else:
            new_att = AttendanceModel(
                student_id=entry.student_id,
                date=att_date,
                branch=payload.branch,
                class_level=payload.class_level,
                is_present=entry.is_present,
                marked_by=payload.marked_by or "admin"
            )
            db.add(new_att)
            db.commit()
            db.refresh(new_att)
            results.append(new_att)

    return results


@router.get("/", response_model=List[AttendanceWithStudent])
def get_attendance(
    att_date: Optional[str] = None,
    branch: Optional[str] = None,
    class_level: Optional[str] = None,
    db: Session = Depends(get_db)
):
    """Admin view: get attendance with student info, filtered by date/branch/class."""
    query = db.query(AttendanceModel)

    if att_date:
        from datetime import datetime
        parsed = datetime.strptime(att_date, "%Y-%m-%d").date()
        query = query.filter(AttendanceModel.date == parsed)
    if branch:
        query = query.filter(AttendanceModel.branch == branch)
    if class_level:
        query = query.filter(AttendanceModel.class_level == class_level)

    records = query.order_by(AttendanceModel.date.desc()).all()

    result = []
    for r in records:
        student = db.query(StudentModel).filter(StudentModel.id == r.student_id).first()
        result.append(AttendanceWithStudent(
            id=r.id,
            student_id=r.student_id,
            student_name=student.name if student else "অজানা",
            student_uid=student.student_uid if student else "",
            date=r.date,
            branch=r.branch,
            class_level=r.class_level,
            is_present=r.is_present,
            marked_by=r.marked_by,
        ))
    return result


@router.get("/student/{student_id}", response_model=List[AttendanceRecord])
def get_student_attendance(student_id: int, db: Session = Depends(get_db)):
    """Get all attendance records for a specific student."""
    return db.query(AttendanceModel).filter(
        AttendanceModel.student_id == student_id
    ).order_by(AttendanceModel.date.desc()).all()


@router.get("/by-uid/{student_uid}", response_model=List[AttendanceRecord])
def get_attendance_by_uid(student_uid: str, db: Session = Depends(get_db)):
    """Get attendance for a student using their student_uid (e.g. RC-2026-001)."""
    student = db.query(StudentModel).filter(
        StudentModel.student_uid == student_uid
    ).first()
    if not student:
        raise HTTPException(status_code=404, detail="Student not found")
    return db.query(AttendanceModel).filter(
        AttendanceModel.student_id == student.id
    ).order_by(AttendanceModel.date.desc()).all()
