import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
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
      <div className="min-h-screen flex flex-col font-bengali">
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
        
        <footer className="bg-gray-900 text-gray-400 py-8 border-t border-gray-800">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-xl font-bold text-white mb-2">রেডিয়েশন কোচিং</h2>
            <p className="mb-4">আপনার সাফল্যের যাত্রায় আমরা আছি পাশে</p>
            <div className="border-t border-gray-800 pt-4 mt-4">
              <p>&copy; {new Date().getFullYear()} রেডিয়েশন কোচিং. সর্বস্বত্ব সংরক্ষিত।</p>
            </div>
          </div>
        </footer>
      </div>
    </Router>
  );
}

export default App;
