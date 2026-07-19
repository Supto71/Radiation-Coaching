import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FaCalendarAlt, FaUserCheck, FaClipboardList, FaQuestionCircle, FaSignOutAlt, FaPlus, FaSave, FaUserCog } from 'react-icons/fa';

const TeacherDashboard = () => {
  const [activeTab, setActiveTab] = useState('routine');
  const navigate = useNavigate();
  const teacherName = localStorage.getItem('teacher_name');
  const teacherId = localStorage.getItem('teacher_id');
  // States
  const [routines, setRoutines] = useState([]);
  const [exams, setExams] = useState([]);
  const [notices, setNotices] = useState([]);
  

  // My Attendance States
  const [myAttDate, setMyAttDate] = useState(new Date().toISOString().split('T')[0]);
  const [myClasses, setMyClasses] = useState(1);
  const [mySubjects, setMySubjects] = useState('');
  const [myBatches, setMyBatches] = useState('');

  // Exam States
  const [examTitle, setExamTitle] = useState('');
  const [examSubject, setExamSubject] = useState('');
  const [examDuration, setExamDuration] = useState(30);
  const [selectedExamId, setSelectedExamId] = useState(null);
  
  // Question Form
  const [qText, setQText] = useState('');
  const [qOptions, setQOptions] = useState(['', '', '', '']);
  const [qCorrect, setQCorrect] = useState(0);

  // Profile
  const [profileImg, setProfileImg] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [updatingProfile, setUpdatingProfile] = useState(false);

  useEffect(() => {
    if (!teacherName) {
      navigate('/login');
    }
    fetchNotices();
    fetchRoutines();
    fetchExams();
  }, [teacherName, navigate]);

  const fetchNotices = async () => {
    try {
      const res = await axios.get('/api/dashboard/notices');
      setNotices(res.data);
    } catch (err) { console.error(err); }
  };

  const fetchRoutines = async () => {
    try {
      const res = await axios.get('/api/dashboard/routines');
      setRoutines(res.data);
    } catch (err) { console.error(err); }
  };

  const fetchExams = async () => {
    try {
      const res = await axios.get('/api/dashboard/exams?active_only=false');
      setExams(res.data);
    } catch (err) { console.error(err); }
  };


  const submitMyAttendance = async (e) => {
    e.preventDefault();
    try {
      await axios.post('/api/dashboard/teacher-attendance', {
        teacher_name: teacherName,
        date: myAttDate,
        classes_taken: myClasses,
        subjects: mySubjects,
        batches: myBatches
      });
      alert('আপনার হাজিরা সফলভাবে জমা হয়েছে!');
      setMySubjects('');
      setMyBatches('');
    } catch (err) {
      alert(err.response?.data?.detail || 'হাজিরা জমা দিতে সমস্যা হয়েছে!');
    }
  };

  const createExam = async (e) => {
    e.preventDefault();
    try {
      await axios.post('/api/dashboard/exams', {
        title: examTitle,
        subject: examSubject,
        duration_minutes: examDuration,
        is_active: true
      });
      alert('পরীক্ষা তৈরি হয়েছে! এবার প্রশ্ন যোগ করুন।');
      setExamTitle(''); setExamSubject('');
      fetchExams();
    } catch (err) { alert('পরীক্ষা তৈরি করতে সমস্যা হয়েছে!'); }
  };

  const addQuestion = async (e) => {
    e.preventDefault();
    if (!selectedExamId) return alert('আগে পরীক্ষা নির্বাচন করুন!');
    if (qOptions.some(opt => opt.trim() === '')) return alert('সবগুলো অপশন পূরণ করুন!');
    
    try {
      await axios.post(`/api/dashboard/exams/${selectedExamId}/questions`, {
        text: qText,
        options: JSON.stringify(qOptions),
        correct_answer: qCorrect
      });
      alert('প্রশ্ন যোগ হয়েছে!');
      setQText(''); setQOptions(['', '', '', '']); setQCorrect(0);
      fetchExams();
    } catch (err) { alert('প্রশ্ন যোগ করতে সমস্যা হয়েছে!'); }
  };

  const handleLogout = () => {
    localStorage.removeItem('teacher_name');
    localStorage.removeItem('teacher_id');
    localStorage.removeItem('staff_role');
    navigate('/login');
  };

  const updateProfile = async (e) => {
    e.preventDefault();
    if (!teacherId) return alert('Teacher ID not found!');
    setUpdatingProfile(true);
    try {
      const data = {};
      if (profileImg) data.image = profileImg;
      if (newPassword) data.password = newPassword;
      await axios.put(`/api/teachers/${teacherId}`, data);
      alert('প্রোফাইল আপডেট হয়েছে!');
      setNewPassword('');
      setProfileImg('');
    } catch (err) { alert('আপডেট করতে সমস্যা হয়েছে!'); }
    setUpdatingProfile(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col md:flex-row">
      {/* Sidebar */}
      <div className="w-full md:w-64 bg-white shadow-lg flex flex-col z-10">
        <div className="p-6 text-center border-b border-gray-100">
          <h2 className="text-2xl font-bold text-gray-800">Teacher Panel</h2>
          <p className="text-sm text-gray-500 mt-2 font-medium">স্বাগতম, <span className="text-primary">{teacherName}</span></p>
        </div>
        <nav className="flex-1 p-4 space-y-2">
          <button onClick={() => setActiveTab('routine')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeTab === 'routine' ? 'bg-[#e0f2fe] text-primary font-bold shadow-sm' : 'text-gray-600 hover:bg-gray-50'}`}>
            <FaCalendarAlt className={activeTab === 'routine' ? 'text-primary' : 'text-gray-400'} /> মাস্টার রুটিন
          </button>
          <button onClick={() => setActiveTab('notice')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeTab === 'notice' ? 'bg-[#e0f2fe] text-primary font-bold shadow-sm' : 'text-gray-600 hover:bg-gray-50'}`}>
            <FaClipboardList className={activeTab === 'notice' ? 'text-primary' : 'text-gray-400'} /> নোটিশ বোর্ড
          </button>
          <button onClick={() => setActiveTab('my_att')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeTab === 'my_att' ? 'bg-[#e0f2fe] text-primary font-bold shadow-sm' : 'text-gray-600 hover:bg-gray-50'}`}>
            <FaClipboardList className={activeTab === 'my_att' ? 'text-primary' : 'text-gray-400'} /> আমার হাজিরা
          </button>
          <button onClick={() => setActiveTab('exams')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeTab === 'exams' ? 'bg-[#e0f2fe] text-primary font-bold shadow-sm' : 'text-gray-600 hover:bg-gray-50'}`}>
            <FaQuestionCircle className={activeTab === 'exams' ? 'text-primary' : 'text-gray-400'} /> প্রশ্ন তৈরি (MCQ)
          </button>
          <button onClick={() => setActiveTab('profile')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeTab === 'profile' ? 'bg-[#e0f2fe] text-primary font-bold shadow-sm' : 'text-gray-600 hover:bg-gray-50'}`}>
            <FaUserCog className={activeTab === 'profile' ? 'text-primary' : 'text-gray-400'} /> আমার প্রোফাইল
          </button>
        </nav>
        <div className="p-4 border-t border-gray-100">
          <button onClick={handleLogout} className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-red-50 text-red-600 rounded-xl hover:bg-red-100 font-bold transition-colors">
            <FaSignOutAlt /> লগআউট
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-4 md:p-8 overflow-y-auto h-screen bg-[#f4f7fb]">
        
        {activeTab === 'routine' && (
          <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-gray-100">
            <h3 className="text-xl font-bold mb-6 text-gray-800">মাস্টার রুটিন (Master Routine)</h3>
            <div className="overflow-x-auto rounded-xl border border-gray-100">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-50 text-gray-600 text-sm uppercase tracking-wider">
                    <th className="p-4 font-semibold">তারিখ</th>
                    <th className="p-4 font-semibold">সময়</th>
                    <th className="p-4 font-semibold">শাখা</th>
                    <th className="p-4 font-semibold">ক্লাস</th>
                    <th className="p-4 font-semibold">শিক্ষক</th>
                  </tr>
                </thead>
                <tbody className="text-gray-700">
                  {routines.map(r => (
                    <tr key={r.id} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                      <td className="p-4 text-gray-700 font-medium">{r.date}</td>
                      <td className="p-4 text-gray-600">{r.start_time} - {r.end_time}</td>
                      <td className="p-4"><span className="px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-xs font-medium">{r.branch}</span></td>
                      <td className="p-4 text-gray-600">{r.class_level} ({r.class_name})</td>
                      <td className="p-4 text-primary font-medium">{r.teacher_name}</td>
                    </tr>
                  ))}
                  {routines.length === 0 && (
                    <tr><td colSpan="5" className="p-8 text-center text-gray-400">কোনো রুটিন পাওয়া যায়নি</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* --- Notice Tab --- */}
        {activeTab === 'notice' && (
          <div className="bg-white p-6 md:p-8 rounded-[2rem] shadow-sm border border-gray-100">
            <h3 className="text-xl font-bold mb-6 text-gray-800 flex items-center gap-2"><FaClipboardList className="text-primary"/> নোটিশ বোর্ড</h3>
            <div className="grid grid-cols-1 gap-4">
              {notices.map(n => (
                <div key={n.id} className="p-4 border border-gray-100 rounded-xl bg-gray-50">
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-bold text-gray-800">{n.title}</h4>
                    <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full">{new Date(n.custom_date || n.created_at).toLocaleDateString('bn-BD', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
                  </div>
                  <p className="text-sm text-gray-600 whitespace-pre-wrap">{n.content}</p>
                </div>
              ))}
              {notices.length === 0 && (
                <div className="text-center text-gray-500 py-8">কোনো নোটিশ নেই</div>
              )}
            </div>
          </div>
        )}

        {/* Removed Student Attendance Tab */}

        {activeTab === 'my_att' && (
          <div className="bg-white p-6 md:p-8 rounded-[2rem] shadow-sm border border-gray-100 max-w-2xl mx-auto">
            <h3 className="text-xl font-bold mb-8 text-gray-800 flex items-center gap-2"><FaClipboardList className="text-primary"/> আমার হাজিরা (Teacher Attendance)</h3>
            <form onSubmit={submitMyAttendance} className="space-y-6">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1.5 ml-1">তারিখ</label>
                <input type="date" required value={myAttDate} onChange={e => setMyAttDate(e.target.value)} className="w-full border border-gray-200 rounded-xl p-3 outline-none focus:border-primary focus:ring-1 focus:ring-primary text-gray-700 bg-gray-50" />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1.5 ml-1">আজ কয়টি ক্লাস নিয়েছেন?</label>
                <input type="number" min="1" required value={myClasses} onChange={e => setMyClasses(e.target.value)} className="w-full border border-gray-200 rounded-xl p-3 outline-none focus:border-primary focus:ring-1 focus:ring-primary text-gray-700 bg-gray-50" placeholder="যেমন: 3" />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1.5 ml-1">কী কী বিষয়ে ক্লাস নিয়েছেন?</label>
                <input type="text" required value={mySubjects} onChange={e => setMySubjects(e.target.value)} className="w-full border border-gray-200 rounded-xl p-3 outline-none focus:border-primary focus:ring-1 focus:ring-primary text-gray-700 bg-gray-50" placeholder="যেমন: পদার্থবিজ্ঞান, উচ্চতর গণিত" />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1.5 ml-1">কোন কোন ব্যাচের ক্লাস নিয়েছেন?</label>
                <input type="text" required value={myBatches} onChange={e => setMyBatches(e.target.value)} className="w-full border border-gray-200 rounded-xl p-3 outline-none focus:border-primary focus:ring-1 focus:ring-primary text-gray-700 bg-gray-50" placeholder="যেমন: ১০ম শ্রেণি (বালিকা), এইচএসসি ১ম বর্ষ" />
              </div>
              <div className="pt-4">
                <button type="submit" className="w-full bg-[#0f172a] text-white py-3.5 rounded-xl font-bold hover:bg-gray-800 shadow-lg shadow-gray-200 transition-all active:scale-95 flex items-center justify-center gap-2 text-lg">
                  <FaSave /> হাজিরা জমা দিন (Submit)
                </button>
              </div>
            </form>
          </div>
        )}

        {activeTab === 'exams' && (
          <div className="space-y-8">
            {/* Create Exam */}
            <div className="bg-white p-6 md:p-8 rounded-[2rem] shadow-sm border border-gray-100">
              <h3 className="text-xl font-bold mb-6 text-gray-800 flex items-center gap-2"><FaPlus className="text-primary"/> নতুন পরীক্ষা (MCQ) তৈরি করুন</h3>
              <form onSubmit={createExam} className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <input type="text" placeholder="পরীক্ষার নাম (যেমন: Physics Weekly)" required value={examTitle} onChange={e => setExamTitle(e.target.value)} className="border border-gray-200 rounded-xl p-3 outline-none focus:border-primary focus:ring-1 focus:ring-primary md:col-span-2 text-gray-700 bg-gray-50" />
                <input type="text" placeholder="বিষয়" required value={examSubject} onChange={e => setExamSubject(e.target.value)} className="border border-gray-200 rounded-xl p-3 outline-none focus:border-primary focus:ring-1 focus:ring-primary text-gray-700 bg-gray-50" />
                <button type="submit" className="bg-[#0f172a] text-white rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-gray-800 py-3 shadow-md transition-all active:scale-95"><FaPlus /> তৈরি করুন</button>
              </form>
            </div>

            {/* Add Questions */}
            <div className="bg-white p-6 md:p-8 rounded-[2rem] shadow-sm border border-gray-100">
              <h3 className="text-xl font-bold mb-6 text-gray-800 flex items-center gap-2"><FaQuestionCircle className="text-primary"/> প্রশ্ন যোগ করুন (Add Questions)</h3>
              
              <div className="mb-8">
                <label className="block text-sm font-bold text-gray-700 mb-2 ml-1">যে পরীক্ষার প্রশ্ন বানাবেন সেটি নির্বাচন করুন:</label>
                <select value={selectedExamId || ''} onChange={e => setSelectedExamId(e.target.value)} className="w-full border border-gray-200 rounded-xl p-3.5 outline-none focus:border-primary focus:ring-1 focus:ring-primary text-gray-700 bg-gray-50">
                  <option value="">-- পরীক্ষা নির্বাচন করুন --</option>
                  {exams.map(ex => (
                    <option key={ex.id} value={ex.id}>{ex.title} ({ex.subject})</option>
                  ))}
                </select>
              </div>

              {selectedExamId && (
                <form onSubmit={addQuestion} className="space-y-6 animate-fade-in bg-gray-50 p-6 rounded-2xl border border-gray-100">
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2 ml-1">প্রশ্ন:</label>
                    <textarea placeholder="এখানে প্রশ্নটি লিখুন..." required value={qText} onChange={e => setQText(e.target.value)} className="w-full border border-gray-200 rounded-xl p-4 outline-none focus:border-primary focus:ring-1 focus:ring-primary min-h-[120px] text-gray-700 resize-none" />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-3 ml-1">অপশনসমূহ (সঠিক উত্তরের বাম পাশে টিক দিন):</label>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {qOptions.map((opt, i) => (
                        <div key={i} className={`flex items-center gap-3 p-3 rounded-xl border-2 transition-all ${qCorrect === i ? 'border-green-500 bg-green-50/50' : 'border-gray-200 bg-white'}`}>
                          <input type="radio" name="correctOpt" checked={qCorrect === i} onChange={() => setQCorrect(i)} className="w-5 h-5 accent-green-600 cursor-pointer" />
                          <input type="text" placeholder={`অপশন ${i + 1}`} value={opt} onChange={e => { const newOpts = [...qOptions]; newOpts[i] = e.target.value; setQOptions(newOpts); }} className="w-full bg-transparent outline-none p-1 text-gray-700 font-medium" required />
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div className="pt-2">
                    <button type="submit" className="w-full md:w-auto bg-green-600 text-white px-10 py-3.5 rounded-xl font-bold hover:bg-green-700 shadow-lg shadow-green-200 transition-all active:scale-95 flex items-center justify-center gap-2 text-lg">
                      <FaSave /> প্রশ্ন সেভ করুন
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        )}

        {activeTab === 'profile' && (
          <div className="bg-white p-6 md:p-8 rounded-[2rem] shadow-sm border border-gray-100 max-w-xl mx-auto mt-8">
            <h3 className="text-xl font-bold mb-6 text-gray-800 flex items-center gap-2"><FaUserCog className="text-primary"/> প্রোফাইল সেটিংস</h3>
            <form onSubmit={updateProfile} className="space-y-6">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1.5 ml-1">নতুন পাসওয়ার্ড (পরিবর্তন করতে না চাইলে ফাঁকা রাখুন)</label>
                <input type="text" value={newPassword} onChange={e => setNewPassword(e.target.value)} className="w-full border border-gray-200 rounded-xl p-3 outline-none focus:border-primary focus:ring-1 focus:ring-primary text-gray-700 bg-gray-50" placeholder="নতুন পাসওয়ার্ড" />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1.5 ml-1">প্রোফাইল ছবির URL (পরিবর্তন করতে না চাইলে ফাঁকা রাখুন)</label>
                <input type="text" value={profileImg} onChange={e => setProfileImg(e.target.value)} className="w-full border border-gray-200 rounded-xl p-3 outline-none focus:border-primary focus:ring-1 focus:ring-primary text-gray-700 bg-gray-50" placeholder="/example.png অথবা https://..." />
              </div>
              <div className="pt-4">
                <button type="submit" disabled={updatingProfile} className="w-full bg-[#0f172a] text-white py-3.5 rounded-xl font-bold hover:bg-gray-800 shadow-lg shadow-gray-200 transition-all active:scale-95 flex items-center justify-center gap-2 text-lg disabled:opacity-50">
                  <FaSave /> {updatingProfile ? 'আপডেট হচ্ছে...' : 'প্রোফাইল আপডেট করুন'}
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default TeacherDashboard;
