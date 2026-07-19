from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(title="Radiation Coaching API")

# Configure CORS
origins = ["*"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

from .api import auth, dashboard, students, attendance, teachers
from .db.database import engine, Base
from .models import student as student_model        # ensure table is created
from .models import attendance as attendance_model  # ensure table is created
from .models import teacher as teacher_model        # ensure table is created

# Create tables
Base.metadata.create_all(bind=engine)

# Fix Postgres FK constraint if needed
try:
    from sqlalchemy import text
    with engine.connect() as conn:
        if engine.url.drivername in ["postgresql", "postgresql+psycopg2"]:
            conn.execute(text('ALTER TABLE fee_records DROP CONSTRAINT IF EXISTS fee_records_student_id_fkey CASCADE;'))
            try:
                conn.execute(text('ALTER TABLE fee_records ADD CONSTRAINT fee_records_student_id_fkey FOREIGN KEY (student_id) REFERENCES students(id);'))
            except Exception:
                pass
            conn.execute(text('ALTER TABLE exam_results DROP CONSTRAINT IF EXISTS exam_results_student_id_fkey CASCADE;'))
            try:
                conn.execute(text('ALTER TABLE exam_results ADD CONSTRAINT exam_results_student_id_fkey FOREIGN KEY (student_id) REFERENCES students(id);'))
            except Exception:
                pass
            conn.execute(text('ALTER TABLE exam_results DROP CONSTRAINT IF EXISTS exam_results_exam_id_fkey CASCADE;'))
            try:
                conn.execute(text('ALTER TABLE exam_results ADD CONSTRAINT exam_results_exam_id_fkey FOREIGN KEY (exam_id) REFERENCES exams(id);'))
            except Exception:
                pass
            
        # Add gender column to students table if it doesn't exist (works for both sqlite and postgres)
        try:
            conn.execute(text('ALTER TABLE students ADD COLUMN gender VARCHAR DEFAULT \'ছেলে\';'))
        except Exception:
            pass
            
        # Update legacy branch names
        try:
            conn.execute(text('UPDATE students SET branch = \'দ্বিতীয় শাখা\' WHERE branch = \'বালিকা শাখা\';'))
        except Exception:
            pass

        conn.commit()
except Exception as e:
    print("DB Schema Fix error:", e)

app.include_router(auth.router, prefix="/api/auth", tags=["auth"])
app.include_router(dashboard.router, prefix="/api/dashboard", tags=["dashboard"])
app.include_router(students.router, prefix="/api/students", tags=["students"])
app.include_router(attendance.router, prefix="/api/attendance", tags=["attendance"])
app.include_router(teachers.router, prefix="/api/teachers", tags=["teachers"])

import os
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse

# Serve React Frontend if it exists (for full-stack deployment)
STATIC_DIR = os.path.join(os.path.dirname(os.path.dirname(__file__)), "static")

if os.path.exists(STATIC_DIR):
    app.mount("/assets", StaticFiles(directory=os.path.join(STATIC_DIR, "assets")), name="assets")
    
    @app.get("/{catchall:path}")
    def serve_react_app(catchall: str):
        if catchall.startswith("api/"):
            return {"detail": "Not Found"}
        
        # Check if the requested file exists in the static directory (e.g. images in public folder)
        file_path = os.path.join(STATIC_DIR, catchall)
        if os.path.exists(file_path) and os.path.isfile(file_path):
            return FileResponse(file_path)
            
        return FileResponse(os.path.join(STATIC_DIR, "index.html"))
else:
    @app.get("/")
    def read_root():
        return {"message": "Welcome to Radiation Coaching API (Frontend not built)"}
