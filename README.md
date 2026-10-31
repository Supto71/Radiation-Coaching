# Radiation Coaching

A modern coaching management system for managing students, teachers, attendance and reports, with a dedicated admin dashboard.

🌐 **Live:** [radiation-coaching-3.onrender.com](https://radiation-coaching-3.onrender.com/admin/dashboard)

## Features
- Admin dashboard to manage the coaching centre
- Student and teacher management
- Attendance tracking
- Reports

## Tech Stack
![React](https://img.shields.io/badge/React-20232A?style=flat&logo=react&logoColor=61DAFB)
![Vite](https://img.shields.io/badge/Vite-646CFF?style=flat&logo=vite&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=flat&logo=tailwindcss&logoColor=white)
![FastAPI](https://img.shields.io/badge/FastAPI-009688?style=flat&logo=fastapi&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?style=flat&logo=postgresql&logoColor=white)
![Render](https://img.shields.io/badge/Render-46E3B7?style=flat&logo=render&logoColor=black)

**Frontend:** React, Vite, Tailwind CSS  
**Backend:** FastAPI (Python)  
**Database:** PostgreSQL (Supabase)  
**Deployment:** Render

## Project Structure
```
Radiation-Coaching/
├── backend/    # FastAPI application
├── frontend/   # React application
├── build.sh
└── render.yaml
```

## Run Locally

### Backend
```bash
cd backend
pip install -r requirements.txt
uvicorn main:app --reload
```
Create a `.env` file in `backend/` with your PostgreSQL connection string.

### Frontend
```bash
cd frontend
npm install
npm run dev
```

## Author
**Naymon Nafi Supto** · [GitHub](https://github.com/Supto71) · [LinkedIn](https://www.linkedin.com/in/naymon-nafi-supto-202b543b6/)
