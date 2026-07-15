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
            className="w-[95%] sm:w-[80%] lg:w-[100%] max-w-2xl object-contain drop-shadow-2xl z-10"
          />
          <img 
            src="/login-text.png" 
            alt="Login Text" 
            className="w-[85%] sm:w-[65%] lg:w-[85%] max-w-lg object-contain drop-shadow-xl z-20 -mt-20 sm:-mt-28"
          />
        </div>

        {/* Right Side: Login Content */}
        <div className="w-full lg:w-1/2 flex flex-col items-center justify-center lg:justify-start order-1 lg:order-2">
          
          {/* Top Heading above Card */}
          <div className="text-center mb-8">
            <h2 className="text-[1.8rem] font-extrabold text-gray-800 mb-1" style={{ color: '#1f2937' }}>শেখো, বোঝো, এগিয়ে যাও</h2>
            <p className="text-gray-400 text-base font-medium">শত শত শিক্ষার্থীর বিশ্বস্ত প্ল্যাটফর্ম</p>
          </div>

          <div className="bg-white w-full max-w-[500px] p-8 sm:p-12 rounded-[2.5rem] shadow-[0_15px_50px_rgba(0,0,0,0.06)]">
            
            {/* Card Header & Toggle */}
            <div className="flex justify-between items-start mb-8">
              <div>
                <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2 mb-1">
                  স্বাগতম <span className="animate-wave inline-block origin-[70%_70%]">👋</span>
                </h1>
                <p className="text-gray-400 text-xs font-medium">আপনার একাউন্টে লগইন করুন</p>
              </div>

              {/* Small Role Toggle Pill */}
              <div className="flex bg-[#e0f2fe] p-1 rounded-full shrink-0">
                <button
                  type="button"
                  onClick={() => setRole('student')}
                  className={`px-3 py-1 rounded-full text-[11px] font-bold transition-all duration-300 ${
                    role === 'student' ? 'bg-[#93c5fd] text-gray-800 shadow-sm' : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  স্টুডেন্ট
                </button>
                <button
                  type="button"
                  onClick={() => setRole('teacher')}
                  className={`px-3 py-1 rounded-full text-[11px] font-bold transition-all duration-300 ${
                    role === 'teacher' ? 'bg-[#93c5fd] text-gray-800 shadow-sm' : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  টিচার
                </button>
              </div>
            </div>

            <form onSubmit={handleLogin} className="space-y-5">
              {error && (
                <div className="bg-red-50 text-red-600 px-4 py-3 rounded-xl text-sm font-semibold text-center border border-red-100">
                  {error}
                </div>
              )}

              {/* ID Input */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-gray-700 ml-1">
                  <FaIdBadge className="inline mr-1.5 text-gray-500" />
                  {role === 'student' ? 'আইডি/রোল' : 'টিচার আইডি'}
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                    <FaIdBadge className="text-gray-400 text-sm" />
                  </div>
                  <input
                    type="text"
                    required
                    value={userId}
                    onChange={(e) => setUserId(e.target.value)}
                    className="w-full pl-9 pr-4 py-3 rounded-xl border border-gray-200 focus:ring-1 focus:ring-primary focus:border-primary outline-none transition-all bg-white text-sm text-gray-700 font-medium placeholder-gray-300"
                    placeholder={role === 'student' ? 'আপনার আইডি/রোল লিখুন' : 'টিচার আইডি লিখুন'}
                  />
                </div>
              </div>

              {/* Password Input */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-gray-700 ml-1">
                  <FaLock className="inline mr-1.5 text-gray-500" /> পাসওয়ার্ড
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                    <FaLock className="text-gray-400 text-sm" />
                  </div>
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-9 pr-10 py-3 rounded-xl border border-gray-200 focus:ring-1 focus:ring-primary focus:border-primary outline-none transition-all bg-white text-sm text-gray-700 font-medium placeholder-gray-300"
                    placeholder="আপনার পাসওয়ার্ড লিখুন"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    {showPassword ? <FaEyeSlash className="text-sm" /> : <FaEye className="text-sm" />}
                  </button>
                </div>
              </div>

              {/* Remember Me & Forgot Password */}
              <div className="flex items-center justify-between pt-1">
                <label className="flex items-center gap-1.5 cursor-pointer group">
                  <input type="checkbox" className="w-3.5 h-3.5 rounded border-gray-300 text-primary focus:ring-primary cursor-pointer" />
                  <span className="text-[11px] font-medium text-gray-500 group-hover:text-gray-700 transition-colors">আমাকে মনে রাখুন</span>
                </label>
                <a href="#" className="text-[11px] font-bold text-primary hover:text-secondary transition-colors">
                  পাসওয়ার্ড ভুলে গেছেন?
                </a>
              </div>

              {/* Submit Button */}
              <div className="pt-3">
                <button
                  type="submit"
                  className="w-full bg-[#d32f2f] hover:bg-[#b91c1c] text-white py-3.5 rounded-xl font-bold text-[15px] transition-all transform hover:scale-[1.02] active:scale-95 shadow-md shadow-red-500/20"
                >
                  লগইন করুন
                </button>
              </div>

              {/* Divider */}
              <div className="relative flex items-center py-3">
                <div className="flex-grow border-t border-gray-100"></div>
                <span className="flex-shrink-0 mx-4 text-gray-300 text-xs font-medium">অথবা</span>
                <div className="flex-grow border-t border-gray-100"></div>
              </div>

              {/* Register Link */}
              <div className="text-center pb-2">
                <p className="text-[11px] font-medium text-gray-400">
                  একাউন্ট নেই? <Link to="/register" className="text-[#d32f2f] font-bold hover:underline ml-1">রেজিস্ট্রেশন করুন</Link>
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
