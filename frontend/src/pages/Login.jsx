import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Login = () => {
  const [role, setRole] = useState('student'); // 'student' or 'teacher'
  const [userId, setUserId] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  // Public data state
  const [notices, setNotices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPublicData = async () => {
      try {
        const noticesRes = await axios.get('/api/dashboard/notices').catch(() => ({ data: [] }));
        setNotices(noticesRes.data);
      } catch (err) {
        console.error("Failed to load public data", err);
      } finally {
        setLoading(false);
      }
    };
    fetchPublicData();
  }, []);

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
          setError('স্টুডেন্ট আইডি ভুল অথবা পাসওয়ার্ড ১২৩৪৫ দেওয়া হয়নি!');
        } else {
          setError('সার্ভারে সমস্যা হচ্ছে। দয়া করে পরে চেষ্টা করুন।');
        }
      }
    } else {
      if (userId.trim() === 'teacher' && password.trim() === '1234') {
        navigate('/admin/dashboard');
      } else {
        setError('টিচার আইডি বা পাসওয়ার্ড ভুল হয়েছে! (Hint: teacher / 1234)');
      }
    }
  };

  return (
    <div className="min-h-[calc(100vh-80px)] bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background Decorative Elements */}
      <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-primary/10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-secondary/10 rounded-full blur-3xl"></div>

      <div className="max-w-6xl w-full flex flex-col lg:flex-row gap-8 z-10">
        
        {/* Left Column: Public Information (Notice) */}
        <div className="lg:w-7/12 flex flex-col gap-6">

          <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 flex-1">
            <div className="flex items-center mb-6">
              <div className="bg-secondary/10 p-3 rounded-lg mr-4">
                <svg className="w-6 h-6 text-secondary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-gray-900">নোটিশ বোর্ড</h2>
            </div>
            
            <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2">
              {loading ? (
                <div className="text-gray-500 animate-pulse">লোড হচ্ছে...</div>
              ) : notices.length > 0 ? (
                notices.map((notice) => (
                  <div key={notice.id} className="bg-gray-50 p-4 rounded-xl border border-gray-100">
                    <h3 className="font-bold text-gray-900 mb-2">{notice.title}</h3>
                    <p className="text-gray-600 text-sm mb-2">{notice.content}</p>
                    <p className="text-xs text-gray-400">প্রকাশিত: {new Date(notice.created_at).toLocaleDateString('bn-BD')}</p>
                  </div>
                ))
              ) : (
                <div className="text-gray-500 text-center py-8 bg-gray-50 rounded-xl border border-gray-100 border-dashed">
                  কোনো নতুন নোটিশ নেই।
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Column: Login Form */}
        <div className="lg:w-5/12">
          <div className="w-full bg-white p-8 rounded-2xl shadow-xl border border-gray-100 h-full flex flex-col justify-center">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-2">লগইন করুন</h2>
              <p className="text-gray-500">Radiation Coaching প্ল্যাটফর্মে আপনাকে স্বাগতম</p>
            </div>

            {/* Role Toggle */}
            <div className="flex bg-gray-100 p-1 rounded-xl mb-8">
              <button
                onClick={() => setRole('student')}
                className={`flex-1 py-2.5 text-sm font-medium rounded-lg transition-all ${
                  role === 'student' ? 'bg-white text-primary shadow-sm' : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                স্টুডেন্ট লগইন
              </button>
              <button
                onClick={() => setRole('teacher')}
                className={`flex-1 py-2.5 text-sm font-medium rounded-lg transition-all ${
                  role === 'teacher' ? 'bg-white text-primary shadow-sm' : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                টিচার লগইন
              </button>
            </div>

            <form onSubmit={handleLogin} className="space-y-6">
              {error && (
                <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm text-center border border-red-100">
                  {error}
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {role === 'student' ? 'স্টুডেন্ট আইডি' : 'টিচার আইডি'}
                </label>
                <input
                  type="text"
                  required
                  value={userId}
                  onChange={(e) => setUserId(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all bg-gray-50 focus:bg-white"
                  placeholder={role === 'student' ? 'RC-001' : 'teacher লিখুন'}
                />
              </div>

              <div className="mb-6">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  {role === 'student' ? 'পাসওয়ার্ড (12345 দিন)' : 'পাসওয়ার্ড'}
                </label>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all bg-gray-50 focus:bg-white"
                  placeholder={role === 'student' ? '12345' : '1234'}
                />
              </div>

              <button
                type="submit"
                className="w-full bg-primary hover:bg-secondary text-white py-3.5 rounded-xl font-bold text-lg transition-colors shadow-lg shadow-primary/30"
              >
                প্রবেশ করুন
              </button>
            </form>

            <div className="mt-8 text-center text-sm text-gray-500">
              <p>
                {role === 'student' 
                  ? 'লগইন করতে সমস্যা হলে কোচিং কর্তৃপক্ষের সাথে যোগাযোগ করুন।' 
                  : 'শিক্ষক প্যানেলে প্রবেশের জন্য আপনার নির্ধারিত আইডি ব্যবহার করুন।'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
