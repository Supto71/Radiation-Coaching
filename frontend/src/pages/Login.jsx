import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { FaUserGraduate, FaChalkboardTeacher, FaIdBadge, FaLock, FaEye, FaEyeSlash } from 'react-icons/fa';

const Login = () => {
  const [role, setRole] = useState('student'); // 'student' or 'teacher'
  const [userId, setUserId] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');

    if (role === 'student') {
      try {
        const res = await axios.post('/api/students/login', {
          student_uid: userId.trim(),
          phone: password.trim()
        });
        if (res.data) {
          localStorage.setItem('student', JSON.stringify(res.data));
          navigate('/student/dashboard');
        }
      } catch (err) {
        if (err.response && err.response.status === 401) {
          setError('স্টুডেন্ট আইডি বা পাসওয়ার্ড ভুল হয়েছে!');
        } else {
          setError('সার্ভারে সমস্যা হচ্ছে। দয়া করে পরে চেষ্টা করুন।');
        }
      }
    } else {
      if (userId.trim() === 'admin' && password.trim() === 'admin123') {
        localStorage.setItem('staff_role', 'admin');
        navigate('/admin/dashboard');
      } else if (userId.trim() === 'teacher' && password.trim() === '1234') {
        localStorage.setItem('staff_role', 'teacher');
        navigate('/admin/dashboard');
      } else {
        setError('টিচার/অ্যাডমিন আইডি বা পাসওয়ার্ড ভুল হয়েছে!');
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 sm:p-8" style={{ backgroundColor: 'var(--color-bg-light, #f4f7fb)' }}>
      <div className="max-w-6xl w-full flex flex-col lg:flex-row items-center gap-12">
        
        {/* Left Side: Illustration */}
        <div className="w-full lg:w-1/2 flex flex-col items-center justify-center lg:justify-end mt-12 lg:mt-0 order-2 lg:order-1 relative">
          <img 
            src="/kids.png" 
            alt="Students" 
            className="w-[85%] sm:w-[70%] lg:w-[90%] max-w-lg object-contain drop-shadow-2xl z-10"
          />
          <img 
            src="/login-text.png" 
            alt="Login Text" 
            className="w-[70%] sm:w-[50%] lg:w-[70%] max-w-sm object-contain drop-shadow-xl z-20 -mt-16 sm:-mt-24"
          />
        </div>

        {/* Right Side: Login Card */}
        <div className="w-full lg:w-1/2 flex justify-center lg:justify-start order-1 lg:order-2">
          <div className="bg-white w-full max-w-md p-8 sm:p-10 rounded-3xl shadow-[0_10px_40px_rgba(0,0,0,0.08)]">
            
            <h1 className="text-3xl font-bold text-gray-800 mb-2 flex items-center gap-2">
              স্বাগতম <span className="animate-wave inline-block origin-[70%_70%]">👋</span>
            </h1>
            <p className="text-gray-500 font-medium mb-8">আপনার একাউন্টে লগইন করুন</p>

            {/* Role Toggle Pill */}
            <div className="flex bg-blue-50/70 p-1.5 rounded-full mb-8 relative">
              <button
                type="button"
                onClick={() => setRole('student')}
                className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-full text-sm font-bold transition-all duration-300 z-10 ${
                  role === 'student' ? 'bg-primary text-white shadow-md' : 'text-gray-500 hover:text-gray-800'
                }`}
              >
                <FaUserGraduate className={role === 'student' ? 'text-white' : 'text-gray-400'} /> স্টুডেন্ট
              </button>
              <button
                type="button"
                onClick={() => setRole('teacher')}
                className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-full text-sm font-bold transition-all duration-300 z-10 ${
                  role === 'teacher' ? 'bg-primary text-white shadow-md' : 'text-gray-500 hover:text-gray-800'
                }`}
              >
                <FaChalkboardTeacher className={role === 'teacher' ? 'text-white' : 'text-gray-400'} /> টিচার
              </button>
            </div>

            <form onSubmit={handleLogin} className="space-y-5">
              {error && (
                <div className="bg-red-50 text-red-600 px-4 py-3 rounded-xl text-sm font-semibold text-center border border-red-100">
                  {error}
                </div>
              )}

              {/* ID Input */}
              <div className="space-y-2">
                <label className="block text-sm font-bold text-gray-700 ml-1">
                  <FaIdBadge className="inline mr-2 text-gray-400" />
                  {role === 'student' ? 'আইডি/রোল' : 'টিচার আইডি'}
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <FaIdBadge className="text-gray-400" />
                  </div>
                  <input
                    type="text"
                    required
                    value={userId}
                    onChange={(e) => setUserId(e.target.value)}
                    className="w-full pl-11 pr-4 py-3.5 rounded-2xl border border-gray-200 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all bg-gray-50/50 hover:bg-gray-50 focus:bg-white text-gray-700 font-medium"
                    placeholder={role === 'student' ? 'আপনার আইডি/রোল লিখুন' : 'টিচার আইডি লিখুন'}
                  />
                </div>
              </div>

              {/* Password Input */}
              <div className="space-y-2">
                <label className="block text-sm font-bold text-gray-700 ml-1">
                  <FaLock className="inline mr-2 text-gray-400" /> পাসওয়ার্ড
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <FaLock className="text-gray-400" />
                  </div>
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-11 pr-12 py-3.5 rounded-2xl border border-gray-200 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all bg-gray-50/50 hover:bg-gray-50 focus:bg-white text-gray-700 font-medium"
                    placeholder="আপনার পাসওয়ার্ড লিখুন"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </div>
              </div>

              {/* Remember Me & Forgot Password */}
              <div className="flex items-center justify-between pt-2">
                <label className="flex items-center gap-2 cursor-pointer group">
                  <input type="checkbox" className="w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary cursor-pointer" />
                  <span className="text-sm font-medium text-gray-500 group-hover:text-gray-700 transition-colors">আমাকে মনে রাখুন</span>
                </label>
                <a href="#" className="text-sm font-bold text-primary hover:text-secondary transition-colors">
                  পাসওয়ার্ড ভুলে গেছেন?
                </a>
              </div>

              {/* Submit Button */}
              <div className="pt-4">
                <button
                  type="submit"
                  className="w-full bg-[#d92525] hover:bg-[#b91c1c] text-white py-4 rounded-2xl font-bold text-lg transition-all transform hover:scale-[1.02] active:scale-95 shadow-[0_8px_20px_rgba(217,37,37,0.3)]"
                >
                  লগইন করুন
                </button>
              </div>

              {/* Divider */}
              <div className="relative flex items-center py-4">
                <div className="flex-grow border-t border-gray-200"></div>
                <span className="flex-shrink-0 mx-4 text-gray-400 text-sm font-medium">অথবা</span>
                <div className="flex-grow border-t border-gray-200"></div>
              </div>

              {/* Register Link */}
              <div className="text-center">
                <p className="text-sm font-medium text-gray-500">
                  একাউন্ট নেই? <Link to="/register" className="text-[#d92525] font-bold hover:underline">রেজিস্ট্রেশন করুন</Link>
                </p>
              </div>

            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
