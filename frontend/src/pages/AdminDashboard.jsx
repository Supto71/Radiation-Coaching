import React, { useState, useEffect } from 'react';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('notices');
  
  // Notice State
  const [noticeTitle, setNoticeTitle] = useState('');
  const [noticeContent, setNoticeContent] = useState('');
  const [isPublishing, setIsPublishing] = useState(false);
  const [noticeMessage, setNoticeMessage] = useState('');

  // Routine State
  const [routineDate, setRoutineDate] = useState('');
  const [routineStartTime, setRoutineStartTime] = useState('');
  const [routineEndTime, setRoutineEndTime] = useState('');
  const [routineLevel, setRoutineLevel] = useState('');
  const [routineClass, setRoutineClass] = useState('');
  const [routineTeacher, setRoutineTeacher] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [routineMessage, setRoutineMessage] = useState('');
  
  // Existing Routines State
  const [existingRoutines, setExistingRoutines] = useState([]);

  // Fetch routines on mount
  useEffect(() => {
    const fetchRoutines = async () => {
      try {
        const response = await fetch('/api/dashboard/routines');
        if (response.ok) {
          const data = await response.json();
          setExistingRoutines(data);
        }
      } catch (err) {
        console.error("Failed to fetch routines", err);
      }
    };
    fetchRoutines();
  }, []);

  // Pre-fill form when routineDate, startTime, endTime changes
  useEffect(() => {
    const existing = existingRoutines.find(r => 
      r.date === routineDate && 
      r.start_time === routineStartTime &&
      r.end_time === routineEndTime &&
      r.class_level === routineLevel
    );
    if (existing) {
      setRoutineClass(existing.class_name || '');
      setRoutineTeacher(existing.teacher_name || '');
    } else {
      setRoutineClass('');
      setRoutineTeacher('');
    }
  }, [routineDate, routineStartTime, routineEndTime, routineLevel, existingRoutines]);

  const handleSaveRoutine = async () => {
    if (!routineDate || !routineStartTime || !routineEndTime || !routineLevel || !routineClass || !routineTeacher) {
      setRoutineMessage('দয়া করে সব ফিল্ড পূরণ করুন!');
      return;
    }
    
    setIsSaving(true);
    try {
      const response = await fetch('/api/dashboard/routines', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          date: routineDate,
          start_time: routineStartTime,
          end_time: routineEndTime,
          class_level: routineLevel,
          class_name: routineClass,
          teacher_name: routineTeacher
        })
      });
      
      if (response.ok) {
        const savedRoutine = await response.json();
        setExistingRoutines(prev => {
          const filtered = prev.filter(r => !(
            r.date === savedRoutine.date && 
            r.start_time === savedRoutine.start_time &&
            r.end_time === savedRoutine.end_time &&
            r.class_level === savedRoutine.class_level
          ));
          return [...filtered, savedRoutine];
        });
        setRoutineMessage('রুটিন সফলভাবে আপডেট হয়েছে!');
        setTimeout(() => setRoutineMessage(''), 3000);
      } else {
        setRoutineMessage('রুটিন আপডেট করতে সমস্যা হয়েছে।');
      }
    } catch (error) {
      console.error(error);
      setRoutineMessage('সার্ভারে কানেক্ট করা যাচ্ছে না।');
    } finally {
      setIsSaving(false);
    }
  };

  const handlePublishNotice = async () => {
    if (!noticeTitle || !noticeContent) {
      setNoticeMessage('দয়া করে শিরোনাম এবং বিস্তারিত পূরণ করুন!');
      return;
    }
    
    setIsPublishing(true);
    try {
      const response = await fetch('/api/dashboard/notices', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: noticeTitle,
          content: noticeContent,
          is_active: true
        })
      });
      
      if (response.ok) {
        setNoticeMessage('নোটিশ সফলভাবে পাবলিশ হয়েছে!');
        setNoticeTitle('');
        setNoticeContent('');
        setTimeout(() => setNoticeMessage(''), 3000);
      } else {
        setNoticeMessage('নোটিশ পাবলিশ করতে সমস্যা হয়েছে।');
      }
    } catch (error) {
      console.error(error);
      setNoticeMessage('সার্ভারে কানেক্ট করা যাচ্ছে না।');
    } finally {
      setIsPublishing(false);
    }
  };

  const tabs = [
    { id: 'notices', label: 'নোটিশ বোর্ড' },
    { id: 'routines', label: 'রুটিন আপডেট' },
    { id: 'fees', label: 'ফি ট্র্যাকার' },
    { id: 'students', label: 'শিক্ষার্থী ডেটাবেজ' }
  ];

  return (
    <div className="bg-gray-50 min-h-screen py-8">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">অ্যাডমিন ড্যাশবোর্ড</h1>
          <div className="bg-primary/10 text-primary px-4 py-2 rounded-lg font-semibold">
            অ্যাডমিন প্যানেল
          </div>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center">
            <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center mr-4">
              <span className="text-xl font-bold text-blue-600">৩২০</span>
            </div>
            <div>
              <p className="text-sm text-gray-500 font-medium">মোট শিক্ষার্থী</p>
            </div>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center">
            <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center mr-4">
              <span className="text-xl font-bold text-green-600">৳১৫k</span>
            </div>
            <div>
              <p className="text-sm text-gray-500 font-medium">আজকের ফি আদায়</p>
            </div>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center">
            <div className="w-12 h-12 rounded-full bg-accent/20 flex items-center justify-center mr-4">
              <span className="text-xl font-bold text-accent">৫</span>
            </div>
            <div>
              <p className="text-sm text-gray-500 font-medium">চলমান ব্যাচ</p>
            </div>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center">
            <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center mr-4">
              <span className="text-xl font-bold text-red-600">১২</span>
            </div>
            <div>
              <p className="text-sm text-gray-500 font-medium">বকেয়া ফি (জন)</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          {/* Tabs */}
          <div className="flex border-b border-gray-100">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 py-4 text-center font-medium transition-colors ${
                  activeTab === tab.id 
                    ? 'border-b-2 border-primary text-primary bg-primary/5' 
                    : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          <div className="p-8">
            {activeTab === 'notices' && (
              <div>
                <h2 className="text-xl font-bold mb-4">নতুন নোটিশ তৈরি করুন</h2>
                <div className="space-y-4 max-w-2xl">
                  {noticeMessage && (
                    <div className="bg-green-50 text-green-700 p-3 rounded-lg text-sm border border-green-100">
                      {noticeMessage}
                    </div>
                  )}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">শিরোনাম</label>
                    <input 
                      type="text" 
                      value={noticeTitle}
                      onChange={(e) => setNoticeTitle(e.target.value)}
                      className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-primary focus:border-transparent outline-none" 
                      placeholder="নোটিশের শিরোনাম" 
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">বিস্তারিত</label>
                    <textarea 
                      rows="4" 
                      value={noticeContent}
                      onChange={(e) => setNoticeContent(e.target.value)}
                      className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-primary focus:border-transparent outline-none" 
                      placeholder="নোটিশের বিস্তারিত লিখুন..."></textarea>
                  </div>
                  <button 
                    onClick={handlePublishNotice}
                    disabled={isPublishing}
                    className="bg-primary text-white px-6 py-2.5 rounded-lg font-medium hover:bg-secondary transition-colors disabled:bg-gray-400">
                    {isPublishing ? 'পাবলিশ হচ্ছে...' : 'পাবলিশ করুন'}
                  </button>
                </div>
              </div>
            )}

            {activeTab === 'fees' && (
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-bold">ফি ট্র্যাকার (জুলাই ২০২৬)</h2>
                  <input type="text" placeholder="স্টুডেন্ট আইডি বা নাম খুঁজুন..." className="border border-gray-300 rounded-lg p-2 px-4 focus:ring-2 focus:ring-primary outline-none" />
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-gray-50 text-gray-600 text-sm border-y border-gray-100">
                        <th className="p-4 font-semibold">স্টুডেন্ট আইডি</th>
                        <th className="p-4 font-semibold">নাম</th>
                        <th className="p-4 font-semibold">ব্যাচ</th>
                        <th className="p-4 font-semibold">ফি স্ট্যাটাস</th>
                        <th className="p-4 font-semibold">অ্যাকশন</th>
                      </tr>
                    </thead>
                    <tbody>
                      {[1,2,3].map(i => (
                        <tr key={i} className="border-b border-gray-50 hover:bg-gray-50/50">
                          <td className="p-4 font-medium text-gray-900">RC-2026-{200+i}</td>
                          <td className="p-4 text-gray-700">রাকিবুল হাসান</td>
                          <td className="p-4 text-gray-600">এইচএসসি (পদার্থবিজ্ঞান)</td>
                          <td className="p-4">
                            {i === 1 ? (
                              <span className="px-3 py-1 rounded-full text-xs font-bold bg-green-100 text-green-700">পরিশোধিত</span>
                            ) : (
                              <span className="px-3 py-1 rounded-full text-xs font-bold bg-red-100 text-red-700">বকেয়া</span>
                            )}
                          </td>
                          <td className="p-4">
                            {i !== 1 && (
                              <button className="text-xs bg-primary text-white px-3 py-1.5 rounded hover:bg-secondary transition-colors">পে মার্ক করুন</button>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {activeTab === 'students' && (
              <div className="text-center py-12 text-gray-500">
                <svg className="w-16 h-16 mx-auto text-gray-300 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
                <p>শিক্ষার্থী ডেটাবেজ মডিউল শিঘ্রই যুক্ত করা হবে।</p>
              </div>
            )}

            {activeTab === 'routines' && (
              <div>
                <h2 className="text-xl font-bold mb-4">ডেইলি রুটিন আপডেট করুন</h2>
                <div className="space-y-4 max-w-2xl">
                  {routineMessage && (
                    <div className="bg-green-50 text-green-700 p-3 rounded-lg text-sm border border-green-100">
                      {routineMessage}
                    </div>
                  )}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">তারিখ (Date)</label>
                    <input 
                      type="date"
                      value={routineDate}
                      onChange={(e) => setRoutineDate(e.target.value)}
                      className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-primary outline-none"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">শুরুর সময় (Start Time)</label>
                      <input 
                        type="time" 
                        value={routineStartTime}
                        onChange={(e) => setRoutineStartTime(e.target.value)}
                        className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-primary outline-none" 
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">শেষ সময় (End Time)</label>
                      <input 
                        type="time" 
                        value={routineEndTime}
                        onChange={(e) => setRoutineEndTime(e.target.value)}
                        className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-primary outline-none" 
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">ব্যাচ / ক্লাস লেভেল (Batch / Class)</label>
                    <input 
                      type="text" 
                      value={routineLevel}
                      onChange={(e) => setRoutineLevel(e.target.value)}
                      className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-primary outline-none" 
                      placeholder="যেমন: College বা 9th/10th" 
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">বিষয়ের নাম (Class Name)</label>
                    <input 
                      type="text" 
                      value={routineClass}
                      onChange={(e) => setRoutineClass(e.target.value)}
                      className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-primary outline-none" 
                      placeholder="যেমন: English" 
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">শিক্ষকের নাম (Teacher's Name)</label>
                    <input 
                      type="text" 
                      value={routineTeacher}
                      onChange={(e) => setRoutineTeacher(e.target.value)}
                      className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-primary outline-none" 
                      placeholder="যেমন: Irine ma'am" 
                    />
                  </div>
                  <button 
                    onClick={handleSaveRoutine}
                    disabled={isSaving}
                    className="bg-primary text-white px-6 py-2.5 rounded-lg font-medium hover:bg-secondary transition-colors disabled:bg-gray-400">
                    {isSaving ? 'সেভ হচ্ছে...' : 'সেভ করুন'}
                  </button>
                </div>

                {/* Master Routine View */}
                <div className="mt-12 pt-8 border-t border-gray-100">
                  <h3 className="text-xl font-bold mb-6">মাস্টার রুটিন ভিউ</h3>
                  {existingRoutines.length === 0 ? (
                    <div className="text-gray-500 py-4">কোনো রুটিন পাওয়া যায়নি।</div>
                  ) : (
                    <div className="space-y-8">
                      {Object.entries(
                        existingRoutines.reduce((acc, routine) => {
                          const date = routine.date;
                          if (!acc[date]) acc[date] = {};
                          
                          const formatTime = (t24) => {
                            if (!t24) return '';
                            const [h, m] = t24.split(':');
                            let hour = parseInt(h, 10);
                            const ampm = hour >= 12 ? 'PM' : 'AM';
                            hour = hour % 12 || 12;
                            return `${hour}:${m} ${ampm}`;
                          };

                          const timeBlock = `${formatTime(routine.start_time)} - ${formatTime(routine.end_time)}`;
                          if (!acc[date][timeBlock]) acc[date][timeBlock] = [];
                          acc[date][timeBlock].push(routine);
                          return acc;
                        }, {})
                      ).map(([date, timeBlocks]) => (
                        <div key={date} className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
                          <div className="bg-gray-50 px-6 py-3 border-b border-gray-200">
                            <h4 className="font-bold text-gray-800 text-lg">তারিখ: {new Date(date).toLocaleDateString('bn-BD', { day: 'numeric', month: 'long', year: 'numeric' })}</h4>
                          </div>
                          <div className="p-6 space-y-6">
                            {Object.entries(timeBlocks).map(([time, routines]) => (
                              <div key={time} className="pl-4 border-l-2 border-primary/30">
                                <h5 className="font-semibold text-primary mb-3">সময়: {time}</h5>
                                <div className="space-y-2">
                                  {routines.map((r, idx) => (
                                    <div key={idx} className="flex items-center text-gray-700 bg-gray-50 p-2 rounded-lg">
                                      <span className="font-medium min-w-[100px]">{r.class_level}</span>
                                      <span className="mx-2">-</span>
                                      <span className="font-semibold">{r.class_name}</span>
                                      <span className="ml-2 text-sm text-gray-500">({r.teacher_name})</span>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
