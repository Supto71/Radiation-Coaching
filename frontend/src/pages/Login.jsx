import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { 
  FaUserGraduate, 
  FaChalkboardTeacher, 
  FaIdBadge, 
  FaLock, 
  FaEye, 
  FaEyeSlash,
  FaShieldAlt,
  FaArrowRight,
  FaPhoneAlt,
  FaInfoCircle
} from 'react-icons/fa';

const Login = () => {
  const [role, setRole] = useState('student'); // 'student' or 'teacher'
  const [userId, setUserId] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Auto-redirect if already logged in
    const student = localStorage.getItem('student');
    const staffRole = localStorage.getItem('staff_role');
    
    if (student) {
      navigate('/student/dashboard');
      return;
    } else if (staffRole === 'admin') {
      navigate('/admin/dashboard');
      return;
    } else if (staffRole === 'teacher') {
      navigate('/teacher/dashboard');
      return;
    }

    const savedUserId = localStorage.getItem('remembered_userId');
    const savedPassword = localStorage.getItem('remembered_password');
    const savedRole = localStorage.getItem('remembered_role');
    if (savedUserId && savedPassword) {
      setUserId(savedUserId);
      setPassword(savedPassword);
      setRememberMe(true);
      if (savedRole) {
        setRole(savedRole);
      }
    }
  }, [navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const saveCredentials = () => {
      if (rememberMe) {
        localStorage.setItem('remembered_userId', userId);
        localStorage.setItem('remembered_password', password);
        localStorage.setItem('remembered_role', role);
      } else {
        localStorage.removeItem('remembered_userId');
        localStorage.removeItem('remembered_password');
        localStorage.removeItem('remembered_role');
      }
    };

    if (role === 'student') {
      try {
        const res = await axios.post('/api/students/login', {
          student_uid: userId.trim(),
          phone: password.trim()
        });
        if (res.data) {
          localStorage.setItem('student', JSON.stringify(res.data));
          saveCredentials();
          navigate('/student/dashboard');
        }
      } catch (err) {
        if (err.response && err.response.status === 401) {
          setError('স্টুডেন্ট আইডি বা মোবাইল নম্বর ভুল হয়েছে!');
        } else {
          setError('সার্ভারে সমস্যা হচ্ছে। দয়া করে ইন্টারনেট সংযোগ চেক করে আবার চেষ্টা করুন।');
        }
      } finally {
        setLoading(false);
      }
    } else {
      // Teacher or Admin Login
      if (userId.trim() === 'Radiation' && password.trim() === '924816') {
        localStorage.setItem('staff_role', 'admin');
        saveCredentials();
        setLoading(false);
        navigate('/admin/dashboard');
      } else if (userId.trim().toUpperCase().startsWith('RC-')) {
        try {
          const res = await axios.post('/api/teachers/login', {
            teacher_uid: userId.trim(),
            password: password.trim()
          });
          if (res.data) {
            localStorage.setItem('staff_role', 'teacher');
            localStorage.setItem('teacher_name', res.data.name);
            localStorage.setItem('teacher_id', res.data.id);
            if (res.data.image) localStorage.setItem('teacher_image', res.data.image);
            saveCredentials();
            navigate('/teacher/dashboard');
          }
        } catch (err) {
          if (err.response && (err.response.status === 401 || err.response.status === 400)) {
            setError('টিচার আইডি বা পাসওয়ার্ড ভুল হয়েছে!');
          } else {
            setError('সার্ভারে সমস্যা হচ্ছে। দয়া করে পরে চেষ্টা করুন।');
          }
        } finally {
          setLoading(false);
        }
      } else {
        setLoading(false);
        setError('অ্যাডমিন আইডি বা শিক্ষকের আইডি ভুল হয়েছে (টিচার আইডি অবশ্যই RC- দিয়ে শুরু হতে হবে)।');
      }
    }
  };

  return (
    <div className="relative min-h-[calc(100vh-80px)] flex items-center justify-center p-4 sm:p-8 bg-[#f8fafc] text-slate-800 overflow-hidden">
      
      {/* Dynamic Background Ambient Light */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[500px] bg-gradient-to-tr from-sky-200/50 to-cyan-200/40 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-6xl w-full flex flex-col lg:flex-row items-center justify-center gap-12 lg:gap-16 relative z-10 py-8">
        
        {/* Left Side: Branding & Illustration */}
        <div className="w-full lg:w-1/2 flex flex-col items-center lg:items-start text-center lg:text-left space-y-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white border border-sky-200 text-sky-700 text-xs font-semibold shadow-xs">
            <FaShieldAlt className="text-xs" />
            <span>নিরাপদ ও সুরক্ষিত লগইন পোর্টাল</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 leading-tight">
            শেখো, বোঝো ও{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-600 via-cyan-600 to-teal-600">
              এগিয়ে যাও
            </span>
          </h1>

          <p className="text-slate-600 text-sm sm:text-base leading-relaxed max-w-lg">
            রেডিয়েশন কোচিং সেন্টারের ডিজিটাল পোর্টালে আপনার উপস্থিতি, পরীক্ষার ফলাফল, লাইভ নোটিশ এবং অ্যাকাউন্টিং সবকিছু একসাথে।
          </p>

          <div className="w-full max-w-md relative pt-2">
            <div className="relative rounded-3xl overflow-hidden border border-slate-200 bg-white p-4 shadow-sm">
              <img 
                src="/kids.png" 
                alt="Students" 
                className="w-full h-auto object-contain max-h-72 drop-shadow-md mx-auto"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = "/logo.png";
                  e.target.className = "w-40 mx-auto p-6 opacity-70";
                }}
              />
            </div>
          </div>
        </div>

        {/* Right Side: Clean Light Login Card */}
        <div className="w-full lg:w-1/2 max-w-[480px]">
          <div className="rounded-3xl p-7 sm:p-10 bg-white border border-slate-200 shadow-[0_20px_50px_rgba(2,132,199,0.1)] relative overflow-hidden">
            
            {/* Top accent bar */}
            <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-sky-600 via-cyan-500 to-teal-400" />

            {/* Header & Role Switcher */}
            <div className="mb-8">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-2xl font-extrabold text-slate-900">লগইন করুন</h2>
                  <p className="text-xs text-slate-500 mt-0.5">আপনার অ্যাকাউন্টে প্রবেশ করতে তথ্য দিন</p>
                </div>
                <div className="w-10 h-10 rounded-xl bg-sky-50 border border-sky-200 flex items-center justify-center text-sky-600">
                  <FaShieldAlt className="text-lg" />
                </div>
              </div>

              {/* Role Toggle Switcher */}
              <div className="grid grid-cols-2 p-1.5 rounded-2xl bg-slate-100 border border-slate-200">
                <button
                  type="button"
                  onClick={() => { setRole('student'); setError(''); }}
                  className={`flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all duration-200 ${
                    role === 'student'
                      ? 'bg-gradient-to-r from-sky-600 to-cyan-500 text-white shadow-sm'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <FaUserGraduate />
                  <span>শিক্ষার্থী</span>
                </button>
                <button
                  type="button"
                  onClick={() => { setRole('teacher'); setError(''); }}
                  className={`flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all duration-200 ${
                    role === 'teacher'
                      ? 'bg-gradient-to-r from-sky-600 to-cyan-500 text-white shadow-sm'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <FaChalkboardTeacher />
                  <span>শিক্ষক / স্টাফ</span>
                </button>
              </div>
            </div>

            {/* Form */}
            <form onSubmit={handleLogin} className="space-y-5">
              
              {/* Error Message */}
              {error && (
                <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold leading-relaxed animate-fade-in-up flex items-start gap-2">
                  <span className="text-rose-500 text-sm mt-0.5 shrink-0">⚠️</span>
                  <span>{error}</span>
                </div>
              )}

              {/* User ID / Roll Field */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-700">
                  {role === 'student' ? 'স্টুডেন্ট আইডি / রোল নম্বর' : 'টিচার আইডি অথবা অ্যাডমিন আইডি'}
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <FaIdBadge className="text-sm" />
                  </div>
                  <input
                    type="text"
                    required
                    value={userId}
                    onChange={(e) => setUserId(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:bg-white focus:border-sky-500 focus:ring-2 focus:ring-sky-100 text-slate-800 text-sm placeholder-slate-400 outline-none transition-all"
                    placeholder={role === 'student' ? 'যেমন: 101 বা আপনার আইডি' : 'যেমন: RC-Supto বা Radiation'}
                  />
                </div>
              </div>

              {/* Password / Phone Field */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-bold text-slate-700">
                    {role === 'student' ? 'পাসওয়ার্ড (নিবন্ধিত ফোন নম্বর)' : 'পাসওয়ার্ড'}
                  </label>
                  {role === 'student' && (
                    <span className="text-[11px] text-sky-600 font-medium">
                      ফোন নম্বরই পাসওয়ার্ড
                    </span>
                  )}
                </div>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <FaLock className="text-sm" />
                  </div>
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-10 pr-11 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:bg-white focus:border-sky-500 focus:ring-2 focus:ring-sky-100 text-slate-800 text-sm placeholder-slate-400 outline-none transition-all"
                    placeholder="পাসওয়ার্ড লিখুন"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600 transition-colors"
                  >
                    {showPassword ? <FaEyeSlash className="text-sm" /> : <FaEye className="text-sm" />}
                  </button>
                </div>
              </div>

              {/* Remember Me */}
              <div className="flex items-center justify-between pt-1">
                <label className="flex items-center gap-2 cursor-pointer group">
                  <input 
                    type="checkbox" 
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="w-4 h-4 rounded border-slate-300 text-sky-600 focus:ring-sky-500 cursor-pointer" 
                  />
                  <span className="text-xs font-medium text-slate-600 group-hover:text-slate-900 transition-colors">
                    আমাকে মনে রাখুন
                  </span>
                </label>
              </div>

              {/* Submit Button */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3.5 rounded-xl bg-gradient-to-r from-sky-600 to-cyan-500 hover:from-sky-500 hover:to-cyan-400 text-white font-bold text-sm shadow-md shadow-sky-500/20 active:scale-95 transition-all flex items-center justify-center gap-2 disabled:opacity-60"
                >
                  {loading ? (
                    <span className="inline-block w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <>
                      <span>লগইন করুন</span>
                      <FaArrowRight className="text-xs" />
                    </>
                  )}
                </button>
              </div>

              {/* Student Help Banner */}
              <div className="pt-4 text-center border-t border-slate-100">
                <p className="text-xs text-slate-500 flex items-center justify-center gap-1.5">
                  <FaInfoCircle className="text-sky-600 shrink-0" />
                  <span>আইডি বা পাসওয়ার্ড ভুলে গেলে অফিসে যোগাযোগ করুন:</span>
                </p>
                <a 
                  href="tel:01676924816" 
                  className="inline-flex items-center gap-1 text-xs font-bold text-sky-600 hover:text-sky-700 mt-1"
                >
                  <FaPhoneAlt className="text-[10px]" /> 01676924816
                </a>
              </div>

            </form>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Login;
