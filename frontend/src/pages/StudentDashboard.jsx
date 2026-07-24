import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const StudentDashboard = () => {
  const navigate = useNavigate();
  const [student, setStudent] = useState(null);
  const [activeTab, setActiveTab] = useState('routine');
  
  // Data states
  const [routines, setRoutines] = useState({});
  const [loading, setLoading] = useState(true);
  const [myAttendance, setMyAttendance] = useState([]);
  const [attLoading, setAttLoading] = useState(true);
  const [fees, setFees] = useState([]);
  const [feesLoading, setFeesLoading] = useState(true);
  const [exams, setExams] = useState([]);
  const [examsLoading, setExamsLoading] = useState(true);
  const [results, setResults] = useState([]);
  const [resultsLoading, setResultsLoading] = useState(true);
  const [notices, setNotices] = useState([]);
  const [noticesLoading, setNoticesLoading] = useState(true);

  useEffect(() => {
    // Load student from localStorage
    const studentData = localStorage.getItem('student');
    if (studentData) {
      setStudent(JSON.parse(studentData));
    } else {
      // If no student session, go back to login
      navigate('/login');
    }
  }, [navigate]);

  useEffect(() => {
    if (!student) return;

    // Fetch Routines based on student's branch and class
    const fetchRoutines = async () => {
      setLoading(true);
      try {
        const response = await fetch(`/api/dashboard/routines?branch=${encodeURIComponent(student.branch)}&class_level=${encodeURIComponent(student.class_level)}`);
        if (response.ok) {
          const data = await response.json();
          const grouped = data.reduce((acc, routine) => {
            const date = routine.date;
            if (!acc[date]) acc[date] = {};
            const timeBlock = `${routine.start_time}-${routine.end_time}`;
            if (!acc[date][timeBlock]) acc[date][timeBlock] = [];
            acc[date][timeBlock].push(routine);
            return acc;
          }, {});
          setRoutines(grouped);
        }
      } catch (err) {
        console.error("Failed to fetch routines", err);
      } finally {
        setLoading(false);
      }
    };

    // Fetch Attendance based on student UID
    const fetchAttendance = async () => {
      setAttLoading(true);
      try {
        const res = await fetch(`/api/attendance/by-uid/${encodeURIComponent(student.student_uid)}`);
        if (res.ok) {
          setMyAttendance(await res.json());
        }
      } catch (err) {
        console.error("Failed to fetch attendance", err);
      } finally {
        setAttLoading(false);
      }
    };

    // Fetch Fees based on student ID
    const fetchFees = async () => {
      setFeesLoading(true);
      try {
        const res = await fetch(`/api/dashboard/fees/me?student_id=${student.id}`);
        if (res.ok) {
          setFees(await res.json());
        }
      } catch (err) {
        console.error("Failed to fetch fees", err);
      } finally {
        setFeesLoading(false);
      }
    };

    // Fetch Active Exams
    const fetchExams = async () => {
      setExamsLoading(true);
      try {
        const res = await fetch(`/api/dashboard/exams?active_only=true`);
        if (res.ok) {
          setExams(await res.json());
        }
      } catch (err) {
        console.error("Failed to fetch exams", err);
      } finally {
        setExamsLoading(false);
      }
    };

    // Fetch Results
    const fetchResults = async () => {
      setResultsLoading(true);
      try {
        const res = await fetch(`/api/dashboard/results/me?student_id=${student.id}`);
        if (res.ok) {
          setResults(await res.json());
        }
      } catch (err) {
        console.error("Failed to fetch results", err);
      } finally {
        setResultsLoading(false);
      }
    };

    // Fetch Notices
    const fetchNotices = async () => {
      setNoticesLoading(true);
      try {
        const res = await fetch(`/api/dashboard/notices`);
        if (res.ok) {
          setNotices(await res.json());
        }
      } catch (err) {
        console.error("Failed to fetch notices", err);
      } finally {
        setNoticesLoading(false);
      }
    };

    fetchRoutines();
    fetchAttendance();
    fetchFees();
    fetchExams();
    fetchResults();
    fetchNotices();
  }, [student]);

  const handleLogout = () => {
    localStorage.removeItem('student');
    navigate('/login');
  };

  if (!student) return <div className="min-h-screen flex items-center justify-center bg-gray-50 text-gray-500">লোড হচ্ছে...</div>;

  const presentDays = myAttendance.filter(a => a.is_present).length;
  const totalDays = myAttendance.length;
  const pct = totalDays > 0 ? Math.round((presentDays / totalDays) * 100) : 0;

  const tabs = [
    { id: 'routine', label: 'আমার রুটিন' },
    { id: 'attendance', label: 'আমার উপস্থিতি' },
    { id: 'fees', label: 'পেমেন্ট হিস্ট্রি' },
    { id: 'exams', label: 'পরীক্ষা' },
    { id: 'results', label: 'ফলাফল' },
    { id: 'notices', label: 'নোটিশ বোর্ড' }
  ];

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Universal Header */}
      <div className="bg-white shadow-sm border-b border-gray-100 px-4 py-4 flex items-center justify-between sticky top-0 z-30">
        <div className="flex items-center gap-3">
          <button onClick={() => setIsSidebarOpen(true)} className="p-2 -ml-2 text-gray-600 hover:text-primary transition-colors">
            {/* Hamburger / Three lines icon */}
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          <h1 className="text-xl font-bold text-gray-900">স্টুডেন্ট ড্যাশবোর্ড</h1>
        </div>
        <button onClick={handleLogout} className="text-sm font-bold text-red-600 hover:text-red-700 bg-red-50 hover:bg-red-100 px-3 py-1.5 rounded-lg transition-colors">
          লগআউট
        </button>
      </div>

      <div className="flex container mx-auto px-0 md:px-4 max-w-[1400px]">
        
        {/* Sidebar */}
        <div className={`fixed inset-y-0 left-0 w-64 md:w-72 bg-white shadow-2xl z-50 transform transition-transform duration-300 ease-in-out ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} flex flex-col`}>
          <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-[#0f172a]">
            <div>
              <h2 className="text-xl font-bold text-white">স্টুডেন্ট প্যানেল</h2>
              <p className="text-xs text-[#00b4d8] mt-1 font-medium">{student.student_uid}</p>
            </div>
            <button onClick={() => setIsSidebarOpen(false)} className="text-white/70 hover:text-white p-1">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <div className="flex-1 overflow-y-auto p-4 space-y-2">
            {tabs.map(tab => (
              <button key={tab.id} onClick={() => { setActiveTab(tab.id); setIsSidebarOpen(false); }}
                className={`w-full flex items-center px-4 py-3 rounded-xl font-semibold transition-all ${activeTab === tab.id ? 'bg-[#00b4d8]/10 text-[#00b4d8] shadow-sm' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'}`}>
                {tab.label}
              </button>
            ))}
          </div>

          </div>

          {/* Tab Content */}
          <div className="flex-1 w-full p-4 md:p-8">
            
            {/* Backdrop overlay */}
            {isSidebarOpen && (
              <div className="fixed inset-0 bg-black/40 z-40 backdrop-blur-sm" onClick={() => setIsSidebarOpen(false)}></div>
            )}
            
            {/* ROUTINE TAB */}
            {activeTab === 'routine' && (
              <div>
                <h2 className="text-xl font-bold mb-6">আমার ক্লাস রুটিন</h2>
                {loading ? (
                  <div className="text-center py-12 text-gray-500 animate-pulse">রুটিন লোড হচ্ছে...</div>
                ) : Object.keys(routines).length === 0 ? (
                  <div className="text-center py-12 bg-gray-50 rounded-xl border border-gray-100 border-dashed text-gray-500">
                    আপনার ক্লাসের জন্য কোনো রুটিন পাওয়া যায়নি।
                  </div>
                ) : (
                  <div className="space-y-6">
                    {Object.entries(routines).map(([date, timeBlocks]) => (
                      <div key={date} className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
                        <div className="bg-gray-50 px-6 py-3 border-b border-gray-200">
                          <h4 className="font-bold text-gray-800 text-lg">
                            তারিখ: {new Date(date).toLocaleDateString('bn-BD', { day: 'numeric', month: 'long', year: 'numeric' })}
                          </h4>
                        </div>
                        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                          {Object.entries(timeBlocks).map(([time, classes]) => {
                            const formatTime = (t24) => {
                              if (!t24) return '';
                              const [h, m] = t24.split(':');
                              let hour = parseInt(h, 10);
                              const ampm = hour >= 12 ? 'PM' : 'AM';
                              hour = hour % 12 || 12;
                              return `${hour}:${m} ${ampm}`;
                            };
                            
                            let formattedTime = time;
                            if (time.includes('-')) {
                              const [start, end] = time.split('-');
                              formattedTime = `${formatTime(start)} - ${formatTime(end)}`;
                            }
                            
                            return (
                              <div key={time} className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm hover:border-primary/30 transition-colors">
                                <div className="flex items-center gap-2 mb-3">
                                  <div className="w-2 h-2 rounded-full bg-primary"></div>
                                  <h5 className="font-bold text-primary">{formattedTime}</h5>
                                </div>
                                <div className="space-y-2">
                                  {classes.map((c, idx) => (
                                    <div key={idx} className="flex flex-col bg-gray-50 p-3 rounded-lg border border-gray-100">
                                      <span className="font-bold text-gray-900">{c.class_name}</span>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* ATTENDANCE TAB */}
            {activeTab === 'attendance' && (
              <div>
                <h3 className="text-xl font-bold mb-5">আমার উপস্থিতি</h3>
                {attLoading ? (
                  <div className="text-center py-12 text-gray-500 animate-pulse">হাজিরা লোড হচ্ছে...</div>
                ) : myAttendance.length > 0 ? (
                  <div>
                    {/* Summary */}
                    <div className="grid grid-cols-3 gap-4 mb-6">
                      <div className="bg-blue-50 border border-blue-100 rounded-2xl p-4 text-center">
                        <p className="text-2xl font-bold text-blue-700">{totalDays}</p>
                        <p className="text-sm text-blue-600 font-semibold mt-1">মোট দিন</p>
                      </div>
                      <div className="bg-green-50 border border-green-100 rounded-2xl p-4 text-center">
                        <p className="text-2xl font-bold text-green-700">{presentDays}</p>
                        <p className="text-sm text-green-600 font-semibold mt-1">উপস্থিত</p>
                      </div>
                      <div className={`border rounded-2xl p-4 text-center ${pct >= 75 ? 'bg-green-50 border-green-100' : 'bg-red-50 border-red-100'}`}>
                        <p className={`text-2xl font-bold ${pct >= 75 ? 'text-green-700' : 'text-red-700'}`}>{pct}%</p>
                        <p className={`text-sm font-semibold mt-1 ${pct >= 75 ? 'text-green-600' : 'text-red-600'}`}>উপস্থিতির হার</p>
                      </div>
                    </div>

                    {/* Attendance List */}
                    <div className="space-y-2">
                      {myAttendance.map(a => (
                        <div key={a.id} className={`flex items-center justify-between p-3 rounded-xl border ${
                          a.is_present ? 'bg-green-50 border-green-100' : 'bg-red-50 border-red-100'
                        }`}>
                          <div className="flex items-center gap-3">
                            <span className={`w-7 h-7 rounded-full flex items-center justify-center text-white text-sm font-bold ${
                              a.is_present ? 'bg-green-500' : 'bg-red-500'
                            }`}>{a.is_present ? '✓' : '✗'}</span>
                            <div>
                              <p className="font-semibold text-gray-900 text-sm">
                                {new Date(a.date).toLocaleDateString('bn-BD', { day: 'numeric', month: 'long', year: 'numeric' })}
                              </p>
                              <p className="text-xs text-gray-500">{a.class_level} &bull; {a.branch}</p>
                            </div>
                          </div>
                          <span className={`text-xs font-bold px-3 py-1 rounded-full ${
                            a.is_present ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                          }`}>{a.is_present ? 'উপস্থিত' : 'অনুপস্থিত'}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-12 bg-gray-50 rounded-xl border border-gray-100 border-dashed text-gray-500">
                    আপনার কোনো হাজিরার রেকর্ড পাওয়া যায়নি।
                  </div>
                )}
              </div>
            )}

            {/* FEES TAB */}
            {activeTab === 'fees' && (
              <div>
                <h3 className="text-xl font-bold mb-5">আমার পেমেন্ট হিস্ট্রি</h3>
                {feesLoading ? (
                  <div className="text-center py-12 text-gray-500 animate-pulse">পেমেন্ট হিস্ট্রি লোড হচ্ছে...</div>
                ) : fees.length > 0 ? (
                  <div className="space-y-3">
                    {fees.map(fee => (
                      <div key={fee.id} className={`flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-xl border ${
                        fee.is_paid ? 'bg-green-50 border-green-100' : 'bg-amber-50 border-amber-100'
                      }`}>
                        <div className="mb-3 sm:mb-0">
                          <h4 className="font-bold text-gray-900">{fee.month}</h4>
                          <p className="text-sm text-gray-600 font-medium mt-1">
                            পরিমাণ: <span className="font-bold text-gray-900">{fee.amount} ৳</span>
                          </p>
                        </div>
                        <div className="flex items-center gap-3">
                          {fee.is_paid ? (
                            <div className="text-right">
                              <span className="inline-block bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-bold mb-1">
                                পেইড
                              </span>
                              {fee.payment_date && (
                                <p className="text-xs text-green-600 font-medium">
                                  {new Date(fee.payment_date).toLocaleDateString('bn-BD')}
                                </p>
                              )}
                            </div>
                          ) : (
                            <span className="inline-block bg-amber-100 text-amber-700 px-3 py-1 rounded-full text-xs font-bold">
                              আনপেইড
                            </span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12 bg-gray-50 rounded-xl border border-gray-100 border-dashed text-gray-500">
                    আপনার কোনো পেমেন্ট রেকর্ড নেই।
                  </div>
                )}
              </div>
            )}

            {/* EXAMS TAB */}
            {activeTab === 'exams' && (
              <div>
                <h3 className="text-xl font-bold mb-5">উপলব্ধ পরীক্ষাসমূহ</h3>
                {examsLoading ? (
                  <div className="text-center py-12 text-gray-500 animate-pulse">লোড হচ্ছে...</div>
                ) : exams.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {exams.map(ex => {
                      const takenResult = results.find(r => r.exam_id === ex.id);
                      return (
                      <div key={ex.id} className="border rounded-xl p-5 bg-white shadow-sm hover:shadow-md transition-shadow relative">
                        {takenResult && (
                           <div className="absolute top-2 right-2 bg-green-100 text-green-700 text-xs px-2 py-1 rounded">অংশগ্রহণকৃত</div>
                        )}
                        <h4 className="font-bold text-lg text-gray-900 mb-1">{ex.title}</h4>
                        <div className="text-sm text-gray-500 mb-4">{ex.subject} • {ex.duration_minutes} মিনিট</div>
                        {takenResult ? (
                          <button onClick={() => setActiveTab('results')} className="bg-gray-200 text-gray-700 w-full py-2 rounded-lg font-bold hover:bg-gray-300 transition-colors">
                            ফলাফল দেখুন
                          </button>
                        ) : (
                          <button onClick={() => navigate(`/exam?id=${ex.id}`)} className="bg-primary text-white w-full py-2 rounded-lg font-bold hover:bg-secondary transition-colors">
                            পরীক্ষা দিন
                          </button>
                        )}
                      </div>
                    )})}
                  </div>
                ) : (
                  <div className="text-center py-12 bg-gray-50 rounded-xl border border-gray-100 border-dashed text-gray-500">
                    বর্তমানে কোনো পরীক্ষা নেই।
                  </div>
                )}
              </div>
            )}

            {/* RESULTS TAB */}
            {activeTab === 'results' && (
              <div>
                <h3 className="text-xl font-bold mb-5">আমার পরীক্ষার রেজাল্ট</h3>
                {resultsLoading ? (
                  <div className="text-center py-12 text-gray-500 animate-pulse">রেজাল্ট লোড হচ্ছে...</div>
                ) : results.length > 0 ? (
                  <div className="space-y-4">
                    {results.map(res => (
                      <div key={res.id} className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div>
                          <h4 className="font-bold text-lg text-gray-900">{res.exam?.title || 'Unknown Exam'}</h4>
                          <p className="text-sm text-gray-500">{res.exam?.subject || ''}</p>
                          <p className="text-xs text-gray-400 mt-1">
                            {new Date(res.taken_at).toLocaleDateString('bn-BD', { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                          </p>
                        </div>
                        <div className="flex gap-4">
                          <div className="text-center bg-gray-50 px-4 py-2 rounded-lg border border-gray-100">
                            <p className="text-xs text-gray-500 font-semibold mb-1">প্রাপ্ত নম্বর</p>
                            <p className="text-xl font-bold text-primary">{res.score}</p>
                          </div>
                          <div className="text-center bg-green-50 px-4 py-2 rounded-lg border border-green-100">
                            <p className="text-xs text-green-600 font-semibold mb-1">সঠিক</p>
                            <p className="text-xl font-bold text-green-600">{res.total_correct}</p>
                          </div>
                          <div className="text-center bg-red-50 px-4 py-2 rounded-lg border border-red-100">
                            <p className="text-xs text-red-600 font-semibold mb-1">ভুল</p>
                            <p className="text-xl font-bold text-red-600">{res.total_wrong}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12 bg-gray-50 rounded-xl border border-gray-100 border-dashed text-gray-500">
                    আপনি এখনও কোনো পরীক্ষায় অংশগ্রহণ করেননি।
                  </div>
                )}
              </div>
            )}

            {/* NOTICES TAB */}
            {activeTab === 'notices' && (
              <div className="space-y-4">
                <h2 className="text-xl font-bold mb-4">নোটিশ বোর্ড</h2>
                {noticesLoading ? (
                  <div className="text-center py-12 text-gray-400 animate-pulse">লোড হচ্ছে...</div>
                ) : notices.length === 0 ? (
                  <div className="text-center py-16 bg-gray-50 rounded-2xl border border-dashed border-gray-300 text-gray-500">
                    কোনো নতুন নোটিশ নেই।
                  </div>
                ) : (
                  <div className="grid grid-cols-1 gap-4">
                    {notices.map(notice => (
                      <div key={notice.id} className="bg-white p-5 rounded-xl border-l-4 border-l-primary shadow-sm">
                        <div className="flex justify-between items-start mb-2">
                          <h3 className="font-bold text-lg text-gray-900">{notice.title}</h3>
                          <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                            {notice.custom_date ? new Date(notice.custom_date).toLocaleDateString('bn-BD') : new Date(notice.created_at).toLocaleDateString('bn-BD')}
                          </span>
                        </div>
                        <p className="text-gray-600 whitespace-pre-wrap mt-2 text-sm leading-relaxed">{notice.content}</p>
                        {notice.image && (
                          <img src={notice.image} alt="Notice Image" className="mt-4 max-h-64 rounded-lg border border-gray-200 object-contain" />
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

          </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;
