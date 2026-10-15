import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import InstallPWA from './components/InstallPWA';
import Home from './pages/Home';
import Courses from './pages/Courses';
import Faculty from './pages/Faculty';
import Exam from './pages/Exam';
import Login from './pages/Login';
import StudentDashboard from './pages/StudentDashboard';
import AdminDashboard from './pages/AdminDashboard';
import TeacherDashboard from './pages/TeacherDashboard';

function App() {
  return (
    <Router>
      <div className="min-h-screen flex flex-col bg-[#f8fafc] text-slate-800 selection:bg-sky-500 selection:text-white">
        <Navbar />
        
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/courses" element={<Courses />} />
            <Route path="/faculty" element={<Faculty />} />
            <Route path="/exam" element={<Exam />} />
            <Route path="/student/dashboard" element={<StudentDashboard />} />
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
            <Route path="/teacher/dashboard" element={<TeacherDashboard />} />
          </Routes>
        </main>

        <Footer />
        <InstallPWA />
      </div>
    </Router>
  );
}

export default App;
