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

from .api import auth, dashboard, students, attendance
from .db.database import engine, Base
from .models import student as student_model        # ensure table is created
from .models import attendance as attendance_model  # ensure table is created

# Create tables
Base.metadata.create_all(bind=engine)

app.include_router(auth.router, prefix="/api/auth", tags=["auth"])
app.include_router(dashboard.router, prefix="/api/dashboard", tags=["dashboard"])
app.include_router(students.router, prefix="/api/students", tags=["students"])
app.include_router(attendance.router, prefix="/api/attendance", tags=["attendance"])

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
        return FileResponse(os.path.join(STATIC_DIR, "index.html"))
else:
    @app.get("/")
    def read_root():
        return {"message": "Welcome to Radiation Coaching API (Frontend not built)"}
