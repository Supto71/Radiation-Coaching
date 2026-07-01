import React, { useState, useEffect } from 'react';

const StudentDashboard = () => {
  const [activeTab, setActiveTab] = useState('routine');
  const [routines, setRoutines] = useState({});
  const [loading, setLoading] = useState(true);
  
  // Student's mock context (since we don't have a real backend session yet)
  // According to user's requirements, students must select their class
  const [selectedClass, setSelectedClass] = useState('9th/10th');

  const fetchRoutines = async (classLevel) => {
    setLoading(true);
    try {
      const response = await fetch(`/api/dashboard/routines?class_level=${encodeURIComponent(classLevel)}`);
      if (response.ok) {
        const data = await response.json();
        // Group by Date and then Time Block
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

  useEffect(() => {
    fetchRoutines(selectedClass);
  }, [selectedClass]);

  const tabs = [
    { id: 'routine', label: 'আমার রুটিন' },
    { id: 'fees', label: 'পেমেন্ট হিস্ট্রি' },
    { id: 'results', label: 'পরীক্ষার রেজাল্ট' }
  ];

  return (
    <div className="bg-gray-50 min-h-screen py-8">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">স্টুডেন্ট ড্যাশবোর্ড</h1>
          <div className="bg-secondary/10 text-secondary px-4 py-2 rounded-lg font-semibold">
            স্টুডেন্ট প্যানেল
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
            {activeTab === 'routine' && (
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-bold">ক্লাস রুটিন</h2>
                  <div className="flex items-center gap-3">
                    <label className="text-sm font-medium text-gray-600">আপনার ক্লাস সিলেক্ট করুন:</label>
                    <select 
                      value={selectedClass}
                      onChange={(e) => setSelectedClass(e.target.value)}
                      className="border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-primary outline-none bg-gray-50"
                    >
                      <option value="College">College</option>
                      <option value="9th/10th">9th/10th</option>
                      <option value="9th">9th</option>
                      <option value="7th/8th">7th/8th</option>
                    </select>
                  </div>
                </div>
                
                {loading ? (
                  <div className="text-center py-12 text-gray-500 animate-pulse">রুটিন লোড হচ্ছে...</div>
                ) : Object.keys(routines).length === 0 ? (
                  <div className="text-center py-12 bg-gray-50 rounded-xl border border-gray-100 border-dashed text-gray-500">
                    এই ক্লাসের জন্য কোনো রুটিন পাওয়া যায়নি।
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
                                      {/* The student cannot see the teacher according to requirement "student can see only the option" */}
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

            {activeTab === 'fees' && (
              <div className="text-center py-12 text-gray-500">
                <p>পেমেন্ট হিস্ট্রি ফিচারটি খুব শীঘ্রই আসছে।</p>
              </div>
            )}

            {activeTab === 'results' && (
              <div className="text-center py-12 text-gray-500">
                <p>পরীক্ষার রেজাল্ট ফিচারটি খুব শীঘ্রই আসছে।</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;
