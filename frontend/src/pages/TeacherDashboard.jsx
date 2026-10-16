import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FaCalendarAlt, FaUserCheck, FaClipboardList, FaQuestionCircle, FaSignOutAlt, FaPlus, FaSave, FaUserCog, FaTrash, FaBroom, FaEye, FaCamera, FaLayerGroup } from 'react-icons/fa';
import FormattedQuestion from '../components/FormattedQuestion';
import MathToolbar from '../components/MathToolbar';
import OcrUploader from '../components/OcrUploader';
import { stripHtml } from '../utils/textUtils';
import { parseBulkQuestions } from '../utils/parseBulkQuestions';

// Render cold-start retry: Backend ঘুমালে auto-retry করে
async function retryAxios(method, url, data, maxRetries = 20, delay = 5000) {
  for (let i = 0; i <= maxRetries; i++) {
    try {
      return await axios({ method, url, data });
    } catch (err) {
      // Network error (ECONNREFUSED / timeout) = ঘুমাচ্ছে
      if (err.code === 'ERR_NETWORK' || err.message === 'Network Error') {
        if (i < maxRetries) await new Promise(r => setTimeout(r, delay));
        else throw err;
      } else {
        throw err; // 4xx/5xx — retry করার দরকার নেই
      }
    }
  }
}

const TeacherDashboard = () => {
  const [activeTab, setActiveTab] = useState('routine');
  const navigate = useNavigate();
  const teacherName = localStorage.getItem('teacher_name');
  const teacherId = localStorage.getItem('teacher_id');
  const teacherImage = localStorage.getItem('teacher_image');
  // States
  const [routines, setRoutines] = useState([]);
  const [routineBranchFilter, setRoutineBranchFilter] = useState('');
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
  const [examClassLevel, setExamClassLevel] = useState('');
  const [examDuration, setExamDuration] = useState(30);
  const [selectedExamId, setSelectedExamId] = useState(null);
  const [selectedExamDetails, setSelectedExamDetails] = useState(null);
  const [showPreview, setShowPreview] = useState(false);
  
  // Question Form
  const [qText, setQText] = useState('');
  const [qOptions, setQOptions] = useState(['', '', '', '']);
  const [qCorrect, setQCorrect] = useState(0);

  // OCR & Bulk states
  const [showOcr, setShowOcr]   = useState(false);
  const [showBulk, setShowBulk] = useState(false);
  const [bulkText, setBulkText] = useState('');
  const [bulkParsed, setBulkParsed] = useState([]);
  const [bulkSaving, setBulkSaving] = useState(false);

  // Profile
  const [profileImg, setProfileImg] = useState(teacherImage || '');
  const [newPassword, setNewPassword] = useState('');
  const [updatingProfile, setUpdatingProfile] = useState(false);

  // Refs for math toolbar integration
  const questionTextareaRef = useRef(null);
  const optionTextareaRefs = useRef([React.createRef(), React.createRef(), React.createRef(), React.createRef()]);

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
      const res = await retryAxios('get', '/api/dashboard/notices');
      setNotices(res.data);
    } catch (err) { console.error(err); }
  };

  const fetchRoutines = async () => {
    try {
      const res = await retryAxios('get', '/api/dashboard/routines');
      setRoutines(res.data);
    } catch (err) { console.error(err); }
  };

  const fetchExams = async () => {
    try {
      const res = await retryAxios('get', '/api/dashboard/exams?active_only=false');
      setExams(res.data);
    } catch (err) { console.error(err); }
  };

  const loadExamQuestions = async (examId) => {
    if (!examId) {
      setSelectedExamDetails(null);
      return;
    }
    try {
      const res = await axios.get(`/api/dashboard/exams/${examId}`);
      setSelectedExamDetails(res.data);
    } catch (err) {
      console.error('Error fetching exam questions', err);
    }
  };

  const handleSelectExam = (examId) => {
    setSelectedExamId(examId);
    if (examId) {
      loadExamQuestions(examId);
    } else {
      setSelectedExamDetails(null);
    }
  };

  const handleCleanAllHtml = () => {
    setQText(prev => stripHtml(prev));
    setQOptions(prev => prev.map(opt => stripHtml(opt)));
  };

  const deleteQuestion = async (qId) => {
    if (!window.confirm('আপনি কি এই প্রশ্নটি মুছে ফেলতে চান?')) return;
    try {
      await axios.delete(`/api/dashboard/questions/${qId}`);
      alert('প্রশ্নটি মুছে ফেলা হয়েছে।');
      if (selectedExamId) {
        loadExamQuestions(selectedExamId);
      }
      fetchExams();
    } catch (err) {
      alert('প্রশ্ন মুছতে সমস্যা হয়েছে!');
    }
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
        class_level: examClassLevel,
        duration_minutes: examDuration,
        is_active: true
      });
      alert('পরীক্ষা তৈরি হয়েছে! এবার প্রশ্ন যোগ করুন।');
      setExamTitle(''); setExamSubject(''); setExamClassLevel('');
      fetchExams();
    } catch (err) { alert('পরীক্ষা তৈরি করতে সমস্যা হয়েছে!'); }
  };

  const addQuestion = async (e) => {
    e.preventDefault();
    if (!selectedExamId) return alert('আগে পরীক্ষা নির্বাচন করুন!');
    
    // Preserve HTML tags (sub, sup) for math/science formatting
    const finalText = qText.trim();
    const finalOpts = qOptions.map(opt => opt.trim());

    if (!finalText) return alert('অনুগ্রহ করে প্রশ্নটি লিখুন!');
    if (finalOpts.some(opt => opt === '')) return alert('সবগুলো অপশন পূরণ করুন!');
    
    try {
      await axios.post(`/api/dashboard/exams/${selectedExamId}/questions`, {
        text: finalText,
        options: JSON.stringify(finalOpts),
        correct_answer: qCorrect
      });
      alert('প্রশ্ন সফলভাবে যোগ হয়েছে!');
      setQText(''); setQOptions(['', '', '', '']); setQCorrect(0);
      loadExamQuestions(selectedExamId);
      fetchExams();
    } catch (err) { alert('প্রশ্ন যোগ করতে সমস্যা হয়েছে!'); }
  };

  // Save ALL bulk-parsed questions sequentially
  const saveBulkQuestions = async () => {
    if (!bulkParsed.length) return alert('কোনো প্রশ্ন সনাক্ত করা হয়নি!');
    if (!selectedExamId) return alert('আগে একটি পরীক্ষা নির্বাচন করুন!');

    setBulkSaving(true);
    let savedCount = 0;
    for (const q of bulkParsed) {
      try {
        await axios.post(`/api/dashboard/exams/${selectedExamId}/questions`, {
          text: q.text,
          options: JSON.stringify(q.options),
          correct_answer: q.correct,
        });
        savedCount++;
      } catch (err) {
        console.error('Bulk save error for question:', q.text, err);
      }
    }
    setBulkSaving(false);
    if (savedCount > 0) {
      setShowBulk(false);
      setBulkText('');
      setBulkParsed([]);
      await loadExamQuestions(selectedExamId);
      await fetchExams();
      alert(`${savedCount}টি প্রশ্ন সফলভাবে সেভ হয়েছে!`);
    } else {
      alert('প্রশ্ন সেভ করা সম্ভব হয়নি। সার্ভার কানেকশন অথবা ফর্ম চেক করুন।');
    }
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
      if (profileImg) {
          data.image = profileImg;
          localStorage.setItem('teacher_image', profileImg);
      }
      if (newPassword) data.password = newPassword;
      await axios.put(`/api/teachers/${teacherId}`, data);
      alert('প্রোফাইল আপডেট হয়েছে!');
      setNewPassword('');
    } catch (err) { alert('আপডেট করতে সমস্যা হয়েছে!'); }
    setUpdatingProfile(false);
  };

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Universal Header */}
      <div className="bg-white shadow-sm border-b border-gray-100 px-4 py-4 flex items-center justify-between sticky top-0 z-30">
        <div className="flex items-center gap-3">
          <button onClick={() => setIsSidebarOpen(true)} className="p-2 -ml-2 text-gray-600 hover:text-primary transition-colors">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          <h1 className="text-xl font-bold text-gray-900">টিচার ড্যাশবোর্ড</h1>
        </div>
      </div>

      <div className="flex container mx-auto px-0 md:px-4 max-w-[1400px]">
        {/* Sidebar */}
        <div className={`fixed inset-y-0 left-0 w-64 md:w-72 bg-white shadow-2xl z-50 transform transition-transform duration-300 ease-in-out ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} flex flex-col`}>
          <div className="p-6 text-center border-b border-gray-100 flex flex-col items-center bg-[#0f172a] relative">
            <button onClick={() => setIsSidebarOpen(false)} className="absolute top-4 right-4 text-white/70 hover:text-white p-1">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            {teacherImage ? (
                <img src={teacherImage} alt="Profile" className="w-20 h-20 rounded-full object-cover border-4 border-white/20 shadow-sm mb-3" />
            ) : (
                <div className="w-20 h-20 rounded-full bg-white/10 flex items-center justify-center border-4 border-white/20 shadow-sm mb-3">
                    <FaUserCheck className="text-3xl text-white opacity-80" />
                </div>
            )}
            <h2 className="text-xl font-bold text-white">টিচার প্যানেল</h2>
            <p className="text-xs text-[#00b4d8] mt-1 font-medium">স্বাগতম, {teacherName}</p>
          </div>
          <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
            <button onClick={() => { setActiveTab('routine'); setIsSidebarOpen(false); }} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeTab === 'routine' ? 'bg-[#e0f2fe] text-primary font-bold shadow-sm' : 'text-gray-600 hover:bg-gray-50'}`}>
              <FaCalendarAlt className={activeTab === 'routine' ? 'text-primary' : 'text-gray-400'} /> মাস্টার রুটিন
            </button>
            <button onClick={() => { setActiveTab('notice'); setIsSidebarOpen(false); }} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeTab === 'notice' ? 'bg-[#e0f2fe] text-primary font-bold shadow-sm' : 'text-gray-600 hover:bg-gray-50'}`}>
              <FaClipboardList className={activeTab === 'notice' ? 'text-primary' : 'text-gray-400'} /> নোটিশ বোর্ড
            </button>
            <button onClick={() => { setActiveTab('my_att'); setIsSidebarOpen(false); }} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeTab === 'my_att' ? 'bg-[#e0f2fe] text-primary font-bold shadow-sm' : 'text-gray-600 hover:bg-gray-50'}`}>
              <FaClipboardList className={activeTab === 'my_att' ? 'text-primary' : 'text-gray-400'} /> আমার হাজিরা
            </button>
            <button onClick={() => { setActiveTab('exams'); setIsSidebarOpen(false); }} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeTab === 'exams' ? 'bg-[#e0f2fe] text-primary font-bold shadow-sm' : 'text-gray-600 hover:bg-gray-50'}`}>
              <FaQuestionCircle className={activeTab === 'exams' ? 'text-primary' : 'text-gray-400'} /> প্রশ্ন তৈরি (MCQ)
            </button>
            <button onClick={() => { setActiveTab('profile'); setIsSidebarOpen(false); }} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeTab === 'profile' ? 'bg-[#e0f2fe] text-primary font-bold shadow-sm' : 'text-gray-600 hover:bg-gray-50'}`}>
              <FaUserCog className={activeTab === 'profile' ? 'text-primary' : 'text-gray-400'} /> আমার প্রোফাইল
            </button>
          </nav>
          <div className="p-4 border-t border-gray-100">
            <button onClick={handleLogout} className="w-full bg-red-50 text-red-600 px-4 py-3 rounded-xl font-semibold hover:bg-red-100 transition-colors border border-red-100 flex justify-center items-center gap-2">
              <FaSignOutAlt className="w-5 h-5" /> লগআউট
            </button>
          </div>
        </div>

        {/* Backdrop overlay */}
        {isSidebarOpen && (
          <div className="fixed inset-0 bg-black/40 z-40 backdrop-blur-sm" onClick={() => setIsSidebarOpen(false)}></div>
        )}

        {/* Main Content */}
        <div className="flex-1 w-full min-w-0 pb-12">
          <div className="hidden md:flex justify-between items-center mb-8 pt-8 px-8">
            <h1 className="text-3xl font-bold text-gray-900">টিচার ড্যাশবোর্ড</h1>
            <div className="bg-primary/10 text-primary px-4 py-2 rounded-lg font-bold shadow-sm">
              টিচার প্যানেল
            </div>
          </div>
          <div className="p-4 md:p-8 bg-gray-50 min-h-screen md:min-h-0">
        
        {activeTab === 'routine' && (
          <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-gray-100">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
              <h3 className="text-xl font-bold text-gray-800">মাস্টার রুটিন (Master Routine)</h3>
              <select 
                value={routineBranchFilter} 
                onChange={e => setRoutineBranchFilter(e.target.value)}
                className="border border-gray-300 rounded-xl p-2.5 px-4 focus:ring-2 focus:ring-primary outline-none bg-white font-medium"
              >
                <option value="">সব শাখা</option>
                {[...new Set(routines.map(r => r.branch))].filter(Boolean).map(b => (
                  <option key={b} value={b}>{b}</option>
                ))}
              </select>
            </div>
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
                  {routines.filter(r => !routineBranchFilter || r.branch === routineBranchFilter).map(r => (
                    <tr key={r.id} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                      <td className="p-4 text-gray-700 font-medium">{r.date}</td>
                      <td className="p-4 text-gray-600">{r.start_time} - {r.end_time}</td>
                      <td className="p-4"><span className="px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-xs font-medium">{r.branch}</span></td>
                      <td className="p-4 text-gray-600">{r.class_level} ({r.class_name})</td>
                      <td className="p-4 text-primary font-medium">{r.teacher_name}</td>
                    </tr>
                  ))}
                  {routines.filter(r => !routineBranchFilter || r.branch === routineBranchFilter).length === 0 && (
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
                  {n.image && (
                    <img src={n.image} alt="Notice Image" className="mt-3 max-h-64 rounded-lg border border-gray-200 object-contain" />
                  )}
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
              <form onSubmit={createExam} className="grid grid-cols-1 md:grid-cols-5 gap-4">
                <input type="text" placeholder="পরীক্ষার নাম (যেমন: Physics Weekly)" required value={examTitle} onChange={e => setExamTitle(e.target.value)} className="border border-gray-200 rounded-xl p-3 outline-none focus:border-primary focus:ring-1 focus:ring-primary md:col-span-2 text-gray-700 bg-gray-50" />
                <input type="text" placeholder="বিষয়" required value={examSubject} onChange={e => setExamSubject(e.target.value)} className="border border-gray-200 rounded-xl p-3 outline-none focus:border-primary focus:ring-1 focus:ring-primary text-gray-700 bg-gray-50" />
                <select value={examClassLevel} onChange={e => setExamClassLevel(e.target.value)} className="border border-gray-200 rounded-xl p-3 outline-none focus:border-primary focus:ring-1 focus:ring-primary text-gray-700 bg-gray-50">
                  <option value="">সব ক্লাস</option>
                  <option value="Class 1">Class 1</option>
                  <option value="Class 2">Class 2</option>
                  <option value="Class 3">Class 3</option>
                  <option value="Class 4">Class 4</option>
                  <option value="Class 5">Class 5</option>
                  <option value="Class 6">Class 6</option>
                  <option value="Class 7">Class 7</option>
                  <option value="Class 8">Class 8</option>
                  <option value="Class 9">Class 9</option>
                  <option value="Class 10">Class 10</option>
                  <option value="HSC 1st Year">HSC 1st Year</option>
                  <option value="HSC 2nd Year">HSC 2nd Year</option>
                </select>
                <button type="submit" className="bg-[#0f172a] text-white rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-gray-800 py-3 shadow-md transition-all active:scale-95"><FaPlus /> তৈরি করুন</button>
              </form>
            </div>

            {/* Add Questions */}
            <div className="bg-white p-6 md:p-8 rounded-[2rem] shadow-sm border border-gray-100">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                  <FaQuestionCircle className="text-primary"/> প্রশ্ন যোগ ও ম্যানেজ করুন
                </h3>
                {selectedExamDetails?.questions && (
                  <span className="text-xs font-bold text-primary bg-primary/10 px-3 py-1.5 rounded-full self-start sm:self-auto">
                    মোট প্রশ্ন: {selectedExamDetails.questions.length}টি
                  </span>
                )}
              </div>
              
              <div className="mb-8">
                <label className="block text-sm font-bold text-gray-700 mb-2 ml-1">যে পরীক্ষার প্রশ্ন বানাবেন সেটি নির্বাচন করুন:</label>
                <select 
                  value={selectedExamId || ''} 
                  onChange={e => handleSelectExam(e.target.value)} 
                  className="w-full border border-gray-200 rounded-xl p-3.5 outline-none focus:border-primary focus:ring-1 focus:ring-primary text-gray-700 bg-gray-50 font-medium"
                >
                  <option value="">-- পরীক্ষা নির্বাচন করুন --</option>
                  {exams.map(ex => (
                    <option key={ex.id} value={ex.id}>{ex.title} ({ex.subject})</option>
                  ))}
                </select>
              </div>

              {selectedExamId && (
                <div className="space-y-8 animate-fade-in">
                  <form onSubmit={addQuestion} className="space-y-6 bg-gray-50 p-6 md:p-7 rounded-2xl border border-gray-200">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <label className="block text-sm font-bold text-gray-800 ml-1">
                        প্রশ্ন লিখুন (subscript, superscript ও math symbol সাপোর্ট আছে):
                      </label>
                      <div className="flex gap-2 flex-wrap">
                        {/* OCR button */}
                        <button
                          type="button"
                          onClick={() => { setShowOcr(v => !v); setShowBulk(false); }}
                          className={`text-xs font-bold px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-colors ${
                            showOcr ? 'bg-blue-600 text-white' : 'bg-blue-100 text-blue-800 hover:bg-blue-200'
                          }`}
                          title="ছবি থেকে টেক্সট বের করুন"
                        >
                          <FaCamera /> OCR (ছবি থেকে)
                        </button>
                        {/* Bulk paste button */}
                        <button
                          type="button"
                          onClick={() => { setShowBulk(v => !v); setShowOcr(false); }}
                          className={`text-xs font-bold px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-colors ${
                            showBulk ? 'bg-purple-600 text-white' : 'bg-purple-100 text-purple-800 hover:bg-purple-200'
                          }`}
                          title="একসাথে অনেক প্রশ্ন paste করুন"
                        >
                          <FaLayerGroup /> Bulk Paste
                        </button>
                        {/* Clean HTML button */}
                        <button
                          type="button"
                          onClick={handleCleanAllHtml}
                          className="text-xs bg-amber-100 text-amber-800 hover:bg-amber-200 font-bold px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-colors"
                          title="HTML কোড বা ট্যাগ থাকলে সাধারণ টেক্সটে রূপান্তর করুন"
                        >
                          <FaBroom className="text-amber-600" /> HTML ট্যাগ মুছুন
                        </button>
                      </div>
                    </div>

                    {/* OCR Panel */}
                    {showOcr && (
                      <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 space-y-3">
                        <p className="text-xs font-bold text-blue-700 flex items-center gap-1.5">
                          <FaCamera /> ছবি আপলোড করুন — text স্বয়ংক্রিয়ভাবে প্রশ্ন ফিল্ডে চলে যাবে
                        </p>
                        <OcrUploader
                          onText={(t) => {
                            setQText(prev => prev ? prev + '\n' + t : t);
                            setShowOcr(false);
                          }}
                        />
                        <p className="text-[11px] text-blue-500">💡 টিপস: ক্লিয়ার/স্ক্যান করা ছবি ব্যবহার করুন। ছবিতে অনেক প্রশ্ন থাকলে OCR এর পরে Bulk Paste ব্যবহার করুন।</p>
                      </div>
                    )}

                    {/* Bulk Paste Panel */}
                    {showBulk && (
                      <div className="bg-purple-50 border border-purple-200 rounded-xl p-4 space-y-3">
                        <p className="text-xs font-bold text-purple-700 flex items-center gap-1.5">
                          <FaLayerGroup /> একসাথে অনেক MCQ প্রশ্ন paste করুন — auto-parse হয়ে সেভ হবে
                        </p>
                        <p className="text-[11px] text-purple-500">
                          ফরম্যাট: <code className="bg-purple-100 px-1 rounded">1. প্রশ্ন? A. অপশন B. অপশন C. অপশন D. অপশন Answer: A</code>
                        </p>
                        <textarea
                          rows={8}
                          className="w-full border border-purple-300 rounded-xl p-3 text-sm outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-300 bg-white font-mono"
                          placeholder={`1. পানির রাসায়নিক সংকেত কী?\nA. H2O2  B. H2O  C. CO2  D. O2\nAnswer: B\n\n2. আলোকসংশ্লেষণ কোথায় হয়?\nA. মূলে  B. ফুলে  C. পাতায়  D. কাণ্ডে\nAnswer: C`}
                          value={bulkText}
                          onChange={e => {
                            setBulkText(e.target.value);
                            setBulkParsed(parseBulkQuestions(e.target.value));
                          }}
                        />
                        {bulkParsed.length > 0 && (
                          <div className="space-y-2">
                            <p className="text-xs font-bold text-green-700">✓ {bulkParsed.length}টি প্রশ্ন সনাক্ত হয়েছে:</p>
                            <div className="max-h-40 overflow-y-auto space-y-1">
                              {bulkParsed.map((q, idx) => (
                                <div key={idx} className="text-xs bg-white border border-green-200 rounded-lg px-3 py-1.5 text-gray-700">
                                  <span className="font-bold text-green-700">{idx + 1}.</span> {q.text.slice(0, 80)}{q.text.length > 80 ? '…' : ''}
                                  <span className="ml-2 text-green-600 font-semibold">(সঠিক: {['A','B','C','D'][q.correct]})</span>
                                </div>
                              ))}
                            </div>
                            <button
                              type="button"
                              disabled={bulkSaving}
                              onClick={saveBulkQuestions}
                              className="w-full bg-purple-600 hover:bg-purple-700 disabled:opacity-60 text-white font-bold py-2.5 rounded-xl flex items-center justify-center gap-2 transition-all"
                            >
                              {bulkSaving ? (
                                <><span className="ocr-spinner-sm" /> সেভ হচ্ছে...</>
                              ) : (
                                <><FaSave /> সব {bulkParsed.length}টি প্রশ্ন একসাথে সেভ করুন</>
                              )}
                            </button>
                          </div>
                        )}
                        {bulkText && bulkParsed.length === 0 && (
                          <p className="text-xs text-red-500 font-semibold">⚠ কোনো প্রশ্ন সনাক্ত করা যায়নি। উপরের ফরম্যাট অনুসরণ করুন।</p>
                        )}
                      </div>
                    )}

                    <div>
                      <MathToolbar
                        textareaRef={questionTextareaRef}
                        value={qText}
                        onChange={setQText}
                      />
                      <textarea 
                        ref={questionTextareaRef}
                        placeholder="এখানে প্রশ্নটি লিখুন... (H₂O, x², <sub>, <sup> ব্যবহার করতে পারেন)" 
                        required 
                        rows={4}
                        value={qText} 
                        onChange={e => setQText(e.target.value)}
                        className="w-full border border-gray-200 rounded-xl p-4 outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 min-h-[100px] text-gray-800 bg-white leading-relaxed break-words whitespace-pre-wrap resize-y" 
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-bold text-gray-800 mb-3 ml-1">
                        অপশনসমূহ (সঠিক উত্তরের বাম পাশে গোল বাটনে টিক দিন):
                      </label>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {qOptions.map((opt, i) => (
                          <div key={i} className={`flex items-start gap-3 p-3.5 rounded-xl border-2 transition-all ${qCorrect === i ? 'border-green-500 bg-green-50/70' : 'border-gray-200 bg-white'}`}>
                            <input 
                              type="radio" 
                              name="correctOpt" 
                              checked={qCorrect === i} 
                              onChange={() => setQCorrect(i)} 
                              className="w-5 h-5 mt-1 accent-green-600 cursor-pointer flex-shrink-0" 
                            />
                            <div className="flex-1 min-w-0">
                              <MathToolbar
                                textareaRef={optionTextareaRefs.current[i]}
                                value={opt}
                                onChange={(newVal) => {
                                  const newOpts = [...qOptions];
                                  newOpts[i] = newVal;
                                  setQOptions(newOpts);
                                }}
                              />
                              <textarea
                                ref={optionTextareaRefs.current[i]}
                                rows={2}
                                placeholder={`অপশন ${i + 1} (যেমন: H₂O, x², <sub>2</sub>)`} 
                                value={opt} 
                                onChange={e => { 
                                  const newOpts = [...qOptions]; 
                                  newOpts[i] = e.target.value; 
                                  setQOptions(newOpts); 
                                }} 
                                className="w-full bg-transparent outline-none p-1 text-gray-800 font-medium leading-relaxed break-words resize-none" 
                                required 
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Real-time Preview */}
                    {(qText.trim() || qOptions.some(o => o.trim())) && (
                      <div className="bg-white p-5 rounded-xl border border-blue-200 shadow-sm space-y-3">
                        <div className="text-xs font-bold text-blue-700 uppercase tracking-wider flex items-center gap-1.5">
                          <FaEye /> লাইভ প্রিভিউ (শিক্ষার্থীরা যেভাবে দেখবে)
                        </div>
                        <div className="text-base font-semibold text-gray-900 break-words leading-relaxed">
                          <FormattedQuestion content={qText || 'প্রশ্ন এখানে দেখা যাবে...'} />
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                          {qOptions.map((opt, i) => (
                            <div key={i} className={`p-2.5 rounded-lg border text-sm flex items-start gap-2 break-words ${qCorrect === i ? 'bg-green-50 border-green-300 text-green-900 font-medium' : 'bg-gray-50 border-gray-200 text-gray-700'}`}>
                              <span className="font-bold flex-shrink-0">{String.fromCharCode(65 + i)}.</span>
                              <FormattedQuestion content={opt || `অপশন ${i + 1}`} className="flex-1 min-w-0" />
                              {qCorrect === i && <span className="text-xs bg-green-600 text-white px-1.5 py-0.5 rounded font-bold ml-auto flex-shrink-0">সঠিক</span>}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    <div className="pt-2">
                      <button type="submit" className="w-full md:w-auto bg-green-600 text-white px-10 py-3.5 rounded-xl font-bold hover:bg-green-700 shadow-lg shadow-green-200 transition-all active:scale-95 flex items-center justify-center gap-2 text-lg">
                        <FaSave /> প্রশ্ন সেভ করুন
                      </button>
                    </div>
                  </form>

                  {/* List of existing questions in this exam */}
                  <div className="pt-4 border-t border-gray-100">
                    <h4 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                      <span className="w-2.5 h-2.5 bg-primary rounded-full"></span>
                      এই পরীক্ষার সংরক্ষিত প্রশ্নসমূহ ({selectedExamDetails?.questions?.length || 0}টি)
                    </h4>

                    {selectedExamDetails?.questions && selectedExamDetails.questions.length > 0 ? (
                      <div className="space-y-4">
                        {selectedExamDetails.questions.map((q, idx) => {
                          let opts = [];
                          try {
                            opts = typeof q.options === 'string' ? JSON.parse(q.options) : q.options;
                          } catch (e) {
                            opts = [];
                          }

                          return (
                            <div key={q.id || idx} className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm relative group hover:border-primary/40 transition-colors">
                              <div className="flex items-start justify-between gap-4 mb-3">
                                <div className="flex items-start gap-2.5 flex-1 min-w-0">
                                  <span className="bg-primary/10 text-primary text-xs font-bold px-2.5 py-1 rounded-lg mt-0.5 flex-shrink-0">
                                    #{idx + 1}
                                  </span>
                                  <FormattedQuestion content={q.text} className="text-base font-bold text-gray-900 leading-relaxed flex-1" />
                                </div>
                                <button 
                                  onClick={() => deleteQuestion(q.id)}
                                  className="text-red-500 hover:text-red-700 hover:bg-red-50 p-2 rounded-lg transition-colors flex-shrink-0 flex items-center gap-1 text-xs font-bold"
                                  title="প্রশ্ন মুছুন"
                                >
                                  <FaTrash /> মুছুন
                                </button>
                              </div>

                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pl-8">
                                {Array.isArray(opts) && opts.map((opt, i) => (
                                  <div 
                                    key={i} 
                                    className={`p-2.5 rounded-lg border text-sm flex items-start gap-2 break-words ${
                                      q.correct_answer === i 
                                        ? 'bg-green-50 border-green-300 text-green-900 font-semibold' 
                                        : 'bg-gray-50 border-gray-100 text-gray-700'
                                    }`}
                                  >
                                    <span className={`w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 ${
                                      q.correct_answer === i ? 'bg-green-600 text-white' : 'bg-gray-200 text-gray-600'
                                    }`}>
                                      {String.fromCharCode(65 + i)}
                                    </span>
                                    <FormattedQuestion content={opt} className="flex-1 min-w-0 leading-relaxed" />
                                    {q.correct_answer === i && (
                                      <span className="text-[11px] bg-green-600 text-white px-1.5 py-0.5 rounded font-bold ml-auto flex-shrink-0">✓ সঠিক</span>
                                    )}
                                  </div>
                                ))}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    ) : (
                      <div className="text-center py-8 bg-gray-50 rounded-2xl border border-dashed border-gray-200 text-gray-500 text-sm">
                        এই পরীক্ষায় এখনও কোনো প্রশ্ন যোগ করা হয়নি। উপরের ফরম থেকে প্রশ্ন যোগ করুন।
                      </div>
                    )}
                  </div>
                </div>
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
      </div>
    </div>
  );
};

export default TeacherDashboard;