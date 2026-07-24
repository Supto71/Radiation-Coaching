import React, { useState, useEffect, useCallback, useRef } from 'react';

// ─── Icons ───────────────────────────────────────────────────────────────────
const SearchIcon = () => (
  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
  </svg>
);
const PlusIcon = () => (
  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
  </svg>
);
const TrashIcon = () => (
  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
  </svg>
);
const EditIcon = () => (
  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
  </svg>
);

// ─── Reusable Alert ───────────────────────────────────────────────────────────
const Alert = ({ message, type = 'success' }) => {
  if (!message) return null;
  const styles = type === 'success'
    ? 'bg-green-50 text-green-700 border-green-200'
    : 'bg-red-50 text-red-700 border-red-200';
  return <div className={`p-3 rounded-lg text-sm border ${styles} mb-4`}>{message}</div>;
};

// ─── Class levels definition ─────────────────────────────────────────────────
const CLASS_LEVELS = [
  { value: 'Class 1', label: 'প্রথম শ্রেণি' },
  { value: 'Class 2', label: 'দ্বিতীয় শ্রেণি' },
  { value: 'Class 3', label: 'তৃতীয় শ্রেণি' },
  { value: 'Class 4', label: 'চতুর্থ শ্রেণি' },
  { value: 'Class 5', label: 'পঞ্চম শ্রেণি' },
  { value: 'Class 6', label: 'ষষ্ঠ শ্রেণি' },
  { value: 'Class 7', label: 'সপ্তম শ্রেণি' },
  { value: 'Class 8', label: 'অষ্টম শ্রেণি' },
  { value: 'Class 9', label: 'নবম শ্রেণি' },
  { value: 'Class 10', label: 'দশম শ্রেণি' },
  { value: 'HSC 1st Year', label: 'এইচএসসি — প্রথম বর্ষ' },
  { value: 'HSC 2nd Year', label: 'এইচএসসি — দ্বিতীয় বর্ষ' },
];

// ─── Student Database Tab ─────────────────────────────────────────────────────
const StudentDatabaseTab = ({ role }) => {
  const [activeClass, setActiveClass] = useState('Class 1');
  const [allStudents, setAllStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filterBranch, setFilterBranch] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingStudentId, setEditingStudentId] = useState(null);
  const [msg, setMsg] = useState({ text: '', type: 'success' });
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({ name: '', student_uid: '', class_level: '9th', branch: 'প্রধান শাখা', gender: 'ছেলে', phone: '', guardian_phone: '', father_name: '', mother_name: '' });

  const fetchStudents = useCallback(async () => {
    setLoading(true);
    try {
      let url = '/api/students/?';
      if (search) url += `search=${encodeURIComponent(search)}&`;
      if (filterBranch) url += `branch=${encodeURIComponent(filterBranch)}&`;
      const res = await fetch(url);
      if (res.ok) setAllStudents(await res.json());
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  }, [search, filterBranch]);

  // Keep form class_level in sync with active tab
  useEffect(() => {
    setForm(f => ({ ...f, class_level: activeClass }));
  }, [activeClass]);

  useEffect(() => {
    const timer = setTimeout(fetchStudents, 300);
    return () => clearTimeout(timer);
  }, [fetchStudents]);

  const handleSave = async () => {
    if (!form.name || !form.class_level || !form.branch || !form.guardian_phone) {
      setMsg({ text: 'নাম, ক্লাস, শাখা এবং অভিভাবকের নম্বর আবশ্যিক!', type: 'error' });
      return;
    }
    setSaving(true);
    try {
      const url = editingStudentId ? `/api/students/${editingStudentId}` : '/api/students/';
      const method = editingStudentId ? 'PUT' : 'POST';
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          student_uid: form.student_uid.trim() === '' ? null : form.student_uid.trim()
        })
      });
      if (res.ok) {
        setMsg({ text: `স্টুডেন্ট সফলভাবে ${editingStudentId ? 'আপডেট' : 'যোগ'} করা হয়েছে!`, type: 'success' });
        setShowForm(false);
        setEditingStudentId(null);
        setForm({ name: '', student_uid: '', class_level: activeClass, branch: 'প্রধান শাখা', gender: 'ছেলে', phone: '', guardian_phone: '', father_name: '', mother_name: '' });
        fetchStudents();
      } else {
        setMsg({ text: `${editingStudentId ? 'আপডেট' : 'যোগ'} করতে সমস্যা হয়েছে।`, type: 'error' });
      }
    } catch { setMsg({ text: 'সার্ভারে সংযোগ নেই।', type: 'error' }); }
    finally { setSaving(false); setTimeout(() => setMsg({ text: '', type: 'success' }), 4000); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('আপনি কি নিশ্চিত যে এই স্টুডেন্টকে মুছতে চান?')) return;
    await fetch(`/api/students/${id}`, { method: 'DELETE' });
    fetchStudents();
  };

  return (
    <div>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <h2 className="text-xl font-bold text-gray-900">শিক্ষার্থী ডেটাবেজ</h2>
        {role === 'admin' && (
        <button
          onClick={() => {
            setEditingStudentId(null);
            setForm({ name: '', student_uid: '', class_level: activeClass, branch: 'প্রধান শাখা', gender: 'ছেলে', phone: '', guardian_phone: '', father_name: '', mother_name: '' });
            setShowForm(!showForm);
          }}
          className="flex items-center gap-2 bg-primary text-white px-5 py-2.5 rounded-xl font-semibold hover:bg-secondary transition-colors shadow-sm"
        >
          <PlusIcon /> নতুন স্টুডেন্ট যোগ করুন
        </button>
        )}
      </div>

      <Alert message={msg.text} type={msg.type} />

      {/* Add / Edit Student Form */}
      {showForm && (
        <div className="bg-blue-50 border border-blue-100 rounded-2xl p-6 mb-6">
          <h3 className="font-bold text-lg mb-4 text-gray-800">{editingStudentId ? 'শিক্ষার্থীর তথ্য এডিট করুন' : 'নতুন শিক্ষার্থীর তথ্য'}</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">স্টুডেন্ট আইডি (ঐচ্ছিক)</label>
              <input type="text" value={form.student_uid || ''} onChange={e => setForm({ ...form, student_uid: e.target.value })}
                className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-primary outline-none bg-white"
                placeholder="যেমন: RC-123 (ফাঁকা রাখলে অটো জেনারেট হবে)" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">পুরো নাম *</label>
              <input type="text" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })}
                className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-primary outline-none bg-white"
                placeholder="স্টুডেন্টের নাম" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">ক্লাস লেভেল *</label>
              <select value={form.class_level} onChange={e => setForm({ ...form, class_level: e.target.value })}
                className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-primary outline-none bg-white">
                {CLASS_LEVELS.map(cl => <option key={cl.value} value={cl.value}>{cl.label}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">শাখা *</label>
              <select value={form.branch} onChange={e => setForm({ ...form, branch: e.target.value })}
                className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-primary outline-none bg-white">
                <option value="প্রধান শাখা">প্রধান শাখা</option>
                <option value="দ্বিতীয় শাখা">দ্বিতীয় শাখা</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">লিঙ্গ *</label>
              <select value={form.gender} onChange={e => setForm({ ...form, gender: e.target.value })}
                className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-primary outline-none bg-white">
                <option value="ছেলে">ছেলে</option>
                <option value="মেয়ে">মেয়ে</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">বাবার নাম</label>
              <input type="text" value={form.father_name} onChange={e => setForm({ ...form, father_name: e.target.value })}
                className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-primary outline-none bg-white"
                placeholder="বাবার নাম (ঐচ্ছিক)" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">মায়ের নাম</label>
              <input type="text" value={form.mother_name} onChange={e => setForm({ ...form, mother_name: e.target.value })}
                className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-primary outline-none bg-white"
                placeholder="মায়ের নাম (ঐচ্ছিক)" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">মোবাইল নম্বর (শিক্ষার্থী)</label>
              <input type="tel" value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })}
                className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-primary outline-none bg-white"
                placeholder="০১XXXXXXXXX (ঐচ্ছিক)" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">অভিভাবকের নম্বর *</label>
              <input type="tel" value={form.guardian_phone} onChange={e => setForm({ ...form, guardian_phone: e.target.value })}
                className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-primary outline-none bg-white"
                placeholder="০১XXXXXXXXX" />
            </div>
          </div>
          <div className="flex gap-3 mt-5">
            <button onClick={handleSave} disabled={saving}
              className="bg-primary text-white px-6 py-2.5 rounded-xl font-semibold hover:bg-secondary transition-colors disabled:bg-gray-400">
              {saving ? 'সেভ হচ্ছে...' : 'সেভ করুন'}
            </button>
            <button onClick={() => setShowForm(false)}
              className="bg-white border border-gray-300 text-gray-700 px-6 py-2.5 rounded-xl font-semibold hover:bg-gray-50 transition-colors">
              বাতিল
            </button>
          </div>
        </div>
      )}

      {/* Class Level Tabs */}
      <div className="flex overflow-x-auto gap-2 mb-5 pb-1">
        {CLASS_LEVELS.map(cl => {
          const count = allStudents.filter(s => s.class_level === cl.value).length;
          return (
            <button
              key={cl.value}
              onClick={() => setActiveClass(cl.value)}
              className={`flex-shrink-0 px-4 py-2 rounded-xl font-semibold text-sm transition-all whitespace-nowrap ${
                activeClass === cl.value
                  ? 'bg-primary text-white shadow-md'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {cl.label}
              <span className={`ml-2 px-2 py-0.5 rounded-full text-xs font-bold ${
                activeClass === cl.value ? 'bg-white/30 text-white' : 'bg-gray-200 text-gray-700'
              }`}>{count}</span>
            </button>
          );
        })}
      </div>

      {/* Search & Branch Filter */}
      <div className="flex flex-col md:flex-row gap-3 mb-5">
        <div className="relative flex-1">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"><SearchIcon /></span>
          <input type="text" value={search} onChange={e => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary outline-none bg-white"
            placeholder="নাম, আইডি বা মোবাইল দিয়ে খুঁজুন..." />
        </div>
        <select value={filterBranch} onChange={e => setFilterBranch(e.target.value)}
          className="border border-gray-300 rounded-xl p-2.5 px-4 focus:ring-2 focus:ring-primary outline-none bg-white font-medium">
          <option value="">সব শাখা</option>
          <option value="প্রধান শাখা">প্রধান শাখা</option>
          <option value="দ্বিতীয় শাখা">দ্বিতীয় শাখা</option>
        </select>
      </div>

      {/* Active class summary cards */}
      {(() => {
        const classStudents = allStudents.filter(s => s.class_level === activeClass);
        const boysCount = classStudents.filter(s => s.gender === 'ছেলে').length;
        const girlsCount = classStudents.filter(s => s.gender === 'মেয়ে').length;
        const classNameStr = CLASS_LEVELS.find(c => c.value === activeClass)?.label || activeClass;

        return (
          <div className="mb-6">
            <h3 className="text-lg font-bold text-gray-800 mb-3">{classNameStr} - এক নজরে</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex items-center gap-4">
                <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center font-bold text-xl">
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
                </div>
                <div>
                  <div className="text-sm text-gray-500 font-semibold">মোট শিক্ষার্থী</div>
                  <div className="text-2xl font-bold text-gray-900">{classStudents.length} জন</div>
                </div>
              </div>
              <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex items-center gap-4">
                <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-full flex items-center justify-center font-bold text-xl">
                  👦
                </div>
                <div>
                  <div className="text-sm text-gray-500 font-semibold">ছাত্র (ছেলে)</div>
                  <div className="text-2xl font-bold text-gray-900">{boysCount} জন</div>
                </div>
              </div>
              <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex items-center gap-4">
                <div className="w-12 h-12 bg-pink-50 text-pink-600 rounded-full flex items-center justify-center font-bold text-xl">
                  👧
                </div>
                <div>
                  <div className="text-sm text-gray-500 font-semibold">ছাত্রী (মেয়ে)</div>
                  <div className="text-2xl font-bold text-gray-900">{girlsCount} জন</div>
                </div>
              </div>
            </div>
          </div>
        );
      })()}

      {/* Student Table filtered by activeClass */}
      {(() => {
        const filteredStudents = allStudents.filter(s => s.class_level === activeClass);
        return loading ? (
          <div className="text-center py-12 text-gray-400 animate-pulse font-medium">লোড হচ্ছে...</div>
        ) : filteredStudents.length === 0 ? (
          <div className="text-center py-16 bg-gray-50 rounded-2xl border border-dashed border-gray-300 text-gray-500 font-medium">
            এই ক্লাসে কোনো শিক্ষার্থী নেই।<br />
            <span className="text-sm">উপরে "নতুন স্টুডেন্ট যোগ করুন" চাপ দিন।</span>
          </div>
        ) : (
          <div className="overflow-x-auto rounded-xl border border-gray-100 shadow-sm">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 text-gray-600 text-sm border-b border-gray-100">
                  <th className="p-4 font-bold">#</th>
                  <th className="p-4 font-bold">স্টুডেন্ট আইডি</th>
                  <th className="p-4 font-bold">নাম</th>
                  <th className="p-4 font-bold">শাখা</th>
                  <th className="p-4 font-bold">মোবাইল</th>
                  <th className="p-4 font-bold">অভিভাবক</th>
                  <th className="p-4 font-bold">অ্যাকশন</th>
                </tr>
              </thead>
              <tbody>
                {filteredStudents.map((s, idx) => (
                  <tr key={s.id} className="border-b border-gray-50 hover:bg-blue-50/40 transition-colors">
                    <td className="p-4 text-gray-400 font-medium">{idx + 1}</td>
                    <td className="p-4"><span className="font-bold text-primary bg-primary/10 px-2 py-1 rounded-lg text-sm">{s.student_uid}</span></td>
                    <td className="p-4 font-semibold text-gray-900">{s.name}</td>
                    <td className="p-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-bold ${s.branch === 'প্রধান শাখা' ? 'bg-blue-100 text-blue-700' : 'bg-green-100 text-green-700'}`}>
                        {s.branch}
                      </span>
                    </td>
                    <td className="p-4 text-gray-600">{s.phone}</td>
                    <td className="p-4 text-gray-500 text-sm">{s.guardian_phone || '—'}</td>
                    <td className="p-4">
                      {role === 'admin' && (
                        <div className="flex gap-2">
                          <button onClick={() => {
                            setEditingStudentId(s.id);
                            setForm({ 
                              name: s.name, 
                              student_uid: s.student_uid, 
                              class_level: s.class_level, 
                              branch: s.branch, 
                              gender: s.gender || 'ছেলে', 
                              phone: s.phone || '', 
                              guardian_phone: s.guardian_phone || '', 
                              father_name: s.father_name || '', 
                              mother_name: s.mother_name || '' 
                            });
                            setShowForm(true);
                            window.scrollTo({ top: 0, behavior: 'smooth' });
                          }} className="text-blue-500 hover:text-blue-700 hover:bg-blue-50 p-2 rounded-lg transition-colors text-sm font-semibold">
                            এডিট
                          </button>
                          <button onClick={() => handleDelete(s.id)}
                            className="text-red-500 hover:text-red-700 hover:bg-red-50 p-2 rounded-lg transition-colors">
                            <TrashIcon />
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="px-4 py-3 bg-gray-50 border-t border-gray-100 text-sm text-gray-500 font-medium">
              মোট {filteredStudents.length} জন শিক্ষার্থী
            </div>
          </div>
        );
      })()}
    </div>
  );
};

// ─── Attendance Tab ────────────────────────────────────────────────────────
const AttendanceTab = () => {
  const [branch, setBranch] = useState('প্রধান শাখা');
  const [classLevel, setClassLevel] = useState('Class 1');
  const [attDate, setAttDate] = useState(new Date().toISOString().split('T')[0]);
  const [students, setStudents] = useState([]);
  const [attendance, setAttendance] = useState({}); // { student_id: true/false }
  const [loadingStudents, setLoadingStudents] = useState(false);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState({ text: '', type: 'success' });
  const [markedBy, setMarkedBy] = useState('অ্যাডমিন');
  const [viewMode, setViewMode] = useState('mark'); // 'mark' | 'history'
  const [historyRecords, setHistoryRecords] = useState([]);

  const fetchStudents = async () => {
    setLoadingStudents(true);
    try {
      const res = await fetch(`/api/students/?branch=${encodeURIComponent(branch)}&class_level=${encodeURIComponent(classLevel)}`);
      if (res.ok) {
        const data = await res.json();
        setStudents(data);
        // Load existing attendance for that date if any
        const attRes = await fetch(`/api/attendance/?att_date=${attDate}&branch=${encodeURIComponent(branch)}&class_level=${encodeURIComponent(classLevel)}`);
        const existing = attRes.ok ? await attRes.json() : [];
        const map = {};
        data.forEach(s => { map[s.id] = true; }); // default: present
        existing.forEach(r => { map[r.student_id] = r.is_present; });
        setAttendance(map);
      }
    } catch (e) { console.error(e); }
    finally { setLoadingStudents(false); }
  };

  const fetchHistory = async () => {
    try {
      const res = await fetch(`/api/attendance/?branch=${encodeURIComponent(branch)}&class_level=${encodeURIComponent(classLevel)}`);
      if (res.ok) setHistoryRecords(await res.json());
    } catch (e) { console.error(e); }
  };

  const handleToggle = (studentId) => {
    setAttendance(prev => ({ ...prev, [studentId]: !prev[studentId] }));
  };

  const handleMarkAll = (value) => {
    const map = {};
    students.forEach(s => { map[s.id] = value; });
    setAttendance(map);
  };

  const handleSave = async () => {
    if (students.length === 0) { setMsg({ text: 'প্রথমে শিক্ষার্থীদের তালিকা লোড করুন!', type: 'error' }); return; }
    setSaving(true);
    try {
      const entries = students.map(s => ({ student_id: s.id, is_present: attendance[s.id] ?? true }));
      const res = await fetch('/api/attendance/bulk', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ date: attDate, branch, class_level: classLevel, marked_by: markedBy, entries })
      });
      if (res.ok) {
        setMsg({ text: 'উপস্থিতি সফলভাবে সেভ হয়েছে!', type: 'success' });
      } else {
        setMsg({ text: 'সেভ হয়নি। আবার চেষ্টা করুন।', type: 'error' });
      }
    } catch { setMsg({ text: 'সার্ভারে সংযোগ নেই।', type: 'error' }); }
    finally { setSaving(false); setTimeout(() => setMsg({ text: '', type: 'success' }), 4000); }
  };

  const presentCount = students.filter(s => attendance[s.id]).length;
  const absentCount = students.length - presentCount;

  // Group history by date
  const grouped = historyRecords.reduce((acc, r) => {
    const d = r.date;
    if (!acc[d]) acc[d] = { present: [], absent: [] };
    if (r.is_present) acc[d].present.push(r); else acc[d].absent.push(r);
    return acc;
  }, {});

  return (
    <div>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <h2 className="text-xl font-bold text-gray-900">শ্রেণি উপস্থিতি</h2>
        <div className="flex gap-2">
          <button onClick={() => setViewMode('mark')}
            className={`px-4 py-2 rounded-xl font-semibold text-sm transition-all ${viewMode === 'mark' ? 'bg-primary text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>
            মার্ক করুন
          </button>
          <button onClick={() => { setViewMode('history'); fetchHistory(); }}
            className={`px-4 py-2 rounded-xl font-semibold text-sm transition-all ${viewMode === 'history' ? 'bg-primary text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>
            ইতিহাস দেখুন
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6 bg-blue-50 border border-blue-100 rounded-2xl p-5">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">শাখা</label>
          <select value={branch} onChange={e => setBranch(e.target.value)}
            className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-primary outline-none bg-white">
            <option value="প্রধান শাখা">প্রধান শাখা</option>
            <option value="দ্বিতীয় শাখা">দ্বিতীয় শাখা</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">শ্রেণি</label>
          <select value={classLevel} onChange={e => setClassLevel(e.target.value)}
            className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-primary outline-none bg-white">
            {CLASS_LEVELS.map(cl => <option key={cl.value} value={cl.value}>{cl.label}</option>)}
          </select>
        </div>
        {viewMode === 'mark' && (
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">তারিখ</label>
            <input type="date" value={attDate} onChange={e => setAttDate(e.target.value)}
              className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-primary outline-none bg-white" />
          </div>
        )}
        {viewMode === 'mark' && (
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">মার্ক করছেন</label>
            <input type="text" value={markedBy} onChange={e => setMarkedBy(e.target.value)}
              className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-primary outline-none bg-white"
              placeholder="শিক্ষকের নাম" />
          </div>
        )}
        <div className="flex items-end">
          <button onClick={fetchStudents}
            className="w-full bg-primary text-white py-2.5 rounded-xl font-semibold hover:bg-secondary transition-colors">
            তালিকা লোড করুন
          </button>
        </div>
      </div>

      <Alert message={msg.text} type={msg.type} />

      {/* Mark Attendance View */}
      {viewMode === 'mark' && (
        <div>
          {loadingStudents ? (
            <div className="text-center py-12 text-gray-400 animate-pulse font-medium">লোড হচ্ছে...</div>
          ) : students.length === 0 ? (
            <div className="text-center py-16 bg-gray-50 rounded-2xl border border-dashed border-gray-300 text-gray-500 font-medium">
              উপরে শাখা, শ্রেণি বেছে "তালিকা লোড করুন" চাপুন
            </div>
          ) : (
            <div>
              {/* Summary + Bulk Actions */}
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-4">
                <div className="flex gap-3">
                  <span className="bg-green-100 text-green-700 font-bold px-3 py-1.5 rounded-xl text-sm">✓ উপস্থিত: {presentCount}</span>
                  <span className="bg-red-100 text-red-700 font-bold px-3 py-1.5 rounded-xl text-sm">✗ অনুপস্থিত: {absentCount}</span>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => handleMarkAll(true)}
                    className="text-xs bg-green-100 text-green-700 px-3 py-1.5 rounded-lg font-semibold hover:bg-green-200 transition-colors">
                    সবাই উপস্থিত
                  </button>
                  <button onClick={() => handleMarkAll(false)}
                    className="text-xs bg-red-100 text-red-700 px-3 py-1.5 rounded-lg font-semibold hover:bg-red-200 transition-colors">
                    সবাই অনুপস্থিত
                  </button>
                </div>
              </div>

              {/* Student List */}
              <div className="space-y-2 mb-6">
                {students.map((s, idx) => (
                  <div key={s.id}
                    className={`flex items-center justify-between p-4 rounded-xl border-2 transition-all cursor-pointer ${
                      attendance[s.id]
                        ? 'border-green-200 bg-green-50'
                        : 'border-red-200 bg-red-50'
                    }`}
                    onClick={() => handleToggle(s.id)}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-gray-400 font-medium w-6 text-sm">{idx + 1}</span>
                      <div>
                        <p className="font-bold text-gray-900">{s.name}</p>
                        <p className="text-xs text-gray-500">{s.student_uid} &bull; {s.branch}</p>
                      </div>
                    </div>
                    <div className={`flex items-center gap-2 px-4 py-2 rounded-xl font-bold text-sm transition-all ${
                      attendance[s.id]
                        ? 'bg-green-500 text-white'
                        : 'bg-red-500 text-white'
                    }`}>
                      {attendance[s.id] ? <>✓ উপস্থিত</> : <>✗ অনুপস্থিত</>}
                    </div>
                  </div>
                ))}
              </div>

              <button onClick={handleSave} disabled={saving}
                className="w-full bg-primary text-white py-3 rounded-xl font-bold text-base hover:bg-secondary transition-colors disabled:bg-gray-400 shadow-md">
                {saving ? 'সেভ হচ্ছে...' : 'উপস্থিতি সেভ করুন'}
              </button>
            </div>
          )}
        </div>
      )}

      {/* History View */}
      {viewMode === 'history' && (
        <div>
          {Object.keys(grouped).length === 0 ? (
            <div className="text-center py-16 bg-gray-50 rounded-2xl border border-dashed border-gray-300 text-gray-500 font-medium">
              কোনো উপস্থিতির রেকর্ড নেই।
            </div>
          ) : (
            <div className="space-y-4">
              {Object.entries(grouped).sort(([a], [b]) => b.localeCompare(a)).map(([date, data]) => (
                <div key={date} className="bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-sm">
                  <div className="bg-gray-50 px-5 py-3 border-b border-gray-100 flex items-center justify-between">
                    <h4 className="font-bold text-gray-800">
                      {new Date(date).toLocaleDateString('bn-BD', { day: 'numeric', month: 'long', year: 'numeric' })}
                    </h4>
                    <div className="flex gap-2 text-sm">
                      <span className="bg-green-100 text-green-700 px-2 py-1 rounded-lg font-bold">উপস্থিত: {data.present.length}</span>
                      <span className="bg-red-100 text-red-700 px-2 py-1 rounded-lg font-bold">অনুপস্থিত: {data.absent.length}</span>
                    </div>
                  </div>
                  <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-3">
                    {[...data.present, ...data.absent].sort((a, b) => a.student_name?.localeCompare(b.student_name || '') || 0).map(r => (
                      <div key={r.id} className={`flex items-center gap-3 p-3 rounded-xl ${
                        r.is_present ? 'bg-green-50 border border-green-100' : 'bg-red-50 border border-red-100'
                      }`}>
                        <span className={`w-6 h-6 rounded-full flex items-center justify-center text-white text-xs font-bold ${
                          r.is_present ? 'bg-green-500' : 'bg-red-500'
                        }`}>{r.is_present ? '✓' : '✗'}</span>
                        <div>
                          <p className="font-semibold text-gray-900 text-sm">{r.student_name}</p>
                          <p className="text-xs text-gray-400">{r.student_uid}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

const SearchableStudentSelect = ({ students, fees, value, onChange }) => {
  const [search, setSearch] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const selectedStudent = students.find(s => s.id.toString() === value?.toString());
  const filteredStudents = students.filter(s =>
    s.name.toLowerCase().includes(search.toLowerCase()) ||
    (s.student_uid || '').toLowerCase().includes(search.toLowerCase())
  );

  // Calculate due for selected student
  let totalDue = 0;
  if (selectedStudent && fees) {
    totalDue = fees
      .filter(f => f.student_id === selectedStudent.id && !f.is_paid)
      .reduce((sum, f) => sum + f.amount, 0);
  }

  // Calculate due for any student in dropdown
  const getDue = (studentId) => {
    if (!fees) return 0;
    return fees.filter(f => f.student_id === studentId && !f.is_paid).reduce((sum, f) => sum + f.amount, 0);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <label className="block text-sm font-semibold text-gray-700 mb-1">স্টুডেন্ট খুঁজুন (নাম বা আইডি) *</label>

      {!selectedStudent ? (
        <div className="relative">
          <input
            type="text"
            placeholder="নাম বা আইডি টাইপ করুন..."
            className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-primary outline-none bg-white"
            value={search}
            onChange={e => { setSearch(e.target.value); setIsOpen(true); }}
            onClick={() => setIsOpen(true)}
          />
          <div className="absolute right-3 top-3 text-gray-400"><SearchIcon /></div>
        </div>
      ) : (
        <div className="w-full border border-primary bg-blue-50 rounded-lg p-3 flex justify-between items-start">
          <div>
            <div className="font-bold text-gray-800">{selectedStudent.name} <span className="text-gray-500 font-normal">({selectedStudent.student_uid})</span></div>
            <div className="text-sm text-gray-600 mt-0.5">{selectedStudent.class_level} — {selectedStudent.branch}</div>
            <div className="mt-2 text-sm">
              পূর্বের বকেয়া: <span className={totalDue > 0 ? 'font-bold text-red-600' : 'font-bold text-green-600'}>৳{totalDue}</span>
            </div>
          </div>
          <button
            type="button"
            onClick={() => { onChange(''); setSearch(''); }}
            className="text-gray-400 hover:text-red-500 bg-white rounded-full p-1 shadow-sm border border-gray-200"
            title="পরিবর্তন করুন"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
          </button>
        </div>
      )}

      {isOpen && !selectedStudent && (
        <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-64 flex flex-col">
          <div className="overflow-y-auto">
            {filteredStudents.length > 0 ? (
              filteredStudents.map(s => {
                const due = getDue(s.id);
                return (
                  <div
                    key={s.id}
                    className="p-3 hover:bg-blue-50 border-b border-gray-100 last:border-0 cursor-pointer flex justify-between items-center"
                    onClick={() => { onChange(s.id); setIsOpen(false); setSearch(''); }}
                  >
                    <div>
                      <div className="font-semibold text-gray-800">{s.name} <span className="text-gray-400 font-normal text-sm">({s.student_uid})</span></div>
                      <div className="text-xs text-gray-500 mt-0.5">{s.class_level} · {s.branch}</div>
                    </div>
                    {due > 0 && (
                      <span className="text-xs font-bold bg-red-100 text-red-600 px-2 py-1 rounded-full ml-2 flex-shrink-0">বকেয়া ৳{due}</span>
                    )}
                  </div>
                );
              })
            ) : (
              <div className="p-4 text-sm text-gray-500 text-center">কোনো স্টুডেন্ট পাওয়া যায়নি</div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

// ─── Fee Tracker Tab ──────────────────────────────────────────────────────────


const FeeTrackerTab = () => {
  const [fees, setFees] = useState([]);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterPaid, setFilterPaid] = useState('');
  const [filterBranch, setFilterBranch] = useState('');
  const [filterMonth, setFilterMonth] = useState('');
  const [feeViewMode, setFeeViewMode] = useState('all'); // 'all', 'dues', 'history'
  const [showForm, setShowForm] = useState(false);
  const [editingFeeId, setEditingFeeId] = useState(null);
  const [editAmount, setEditAmount] = useState('');
  const [msg, setMsg] = useState({ text: '', type: 'success' });
  const [saving, setSaving] = useState(false);
  // History view state
  const [historySearch, setHistorySearch] = useState('');
  const [historyStudent, setHistoryStudent] = useState(null);
  const [allFees, setAllFees] = useState([]); // unfiltered, for history

  const currentMonth = new Date().toISOString().slice(0, 7);
  const [form, setForm] = useState({ student_id: '', amount: '500', month: currentMonth, is_paid: false });

  const fetchFees = useCallback(async () => {
    setLoading(true);
    try {
      let url = '/api/dashboard/fees?';
      if (filterPaid !== '') url += `is_paid=${filterPaid}&`;
      if (filterBranch) url += `branch=${encodeURIComponent(filterBranch)}&`;
      if (filterMonth) url += `month=${encodeURIComponent(filterMonth)}&`;
      const res = await fetch(url);
      if (res.ok) setFees(await res.json());
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  }, [filterPaid, filterBranch, filterMonth]);

  const fetchAllFees = useCallback(async () => {
    try {
      const res = await fetch('/api/dashboard/fees');
      if (res.ok) setAllFees(await res.json());
    } catch (e) { console.error(e); }
  }, []);

  const fetchStudents = async () => {
    const res = await fetch('/api/students/');
    if (res.ok) setStudents(await res.json());
  };

  useEffect(() => { fetchFees(); fetchAllFees(); fetchStudents(); }, [fetchFees, fetchAllFees]);

  const handleAddFee = async () => {
    if (!form.student_id || !form.amount || !form.month) {
      setMsg({ text: 'সকল ফিল্ড পূরণ করুন!', type: 'error' }); return;
    }
    setSaving(true);
    try {
      const res = await fetch('/api/dashboard/fees', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, student_id: parseInt(form.student_id), amount: parseFloat(form.amount) })
      });
      if (res.ok) {
        setMsg({ text: 'ফি রেকর্ড সফলভাবে যোগ হয়েছে!', type: 'success' });
        setShowForm(false);
        fetchFees(); fetchAllFees();
      } else {
        const errorData = await res.json().catch(() => ({}));
        setMsg({ text: `সমস্যা হয়েছে: ${errorData.detail || res.statusText}`, type: 'error' });
      }
    } catch (e) { setMsg({ text: `সার্ভার এরর! ${e.message}`, type: 'error' }); }
    finally { setSaving(false); setTimeout(() => setMsg({ text: '', type: 'success' }), 4000); }
  };

  const handleMarkPaid = async (feeId) => {
    await fetch(`/api/dashboard/fees/${feeId}/pay`, { method: 'PATCH' });
    fetchFees(); fetchAllFees();
  };

  const handleEditFeeAmount = async (feeId) => {
    if (!editAmount || isNaN(editAmount)) return;
    try {
      const res = await fetch(`/api/dashboard/fees/${feeId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount: parseFloat(editAmount) })
      });
      if (res.ok) {
        setEditingFeeId(null);
        fetchFees(); fetchAllFees();
        setMsg({ text: 'পরিমাণ আপডেট হয়েছে!', type: 'success' });
      } else {
        setMsg({ text: 'আপডেট করতে সমস্যা হয়েছে।', type: 'error' });
      }
    } catch {
      setMsg({ text: 'সার্ভারে সংযোগ নেই।', type: 'error' });
    }
    setTimeout(() => setMsg({ text: '', type: 'success' }), 4000);
  };

  const handleDeleteFee = async (feeId) => {
    if (!window.confirm("আপনি কি নিশ্চিত যে এই ফি রেকর্ডটি ডিলিট করতে চান?")) return;
    try {
      const res = await fetch(`/api/dashboard/fees/${feeId}`, { method: 'DELETE' });
      if (res.ok) {
        setMsg({ text: 'ফি রেকর্ডটি সফলভাবে ডিলিট করা হয়েছে!', type: 'success' });
        fetchFees(); fetchAllFees();
      } else {
        setMsg({ text: 'ডিলিট করতে সমস্যা হয়েছে।', type: 'error' });
      }
    } catch {
      setMsg({ text: 'সার্ভার এরর!', type: 'error' });
    }
    setTimeout(() => setMsg({ text: '', type: 'success' }), 4000);
  };

  const totalPaidAmount = fees.filter(f => f.is_paid).reduce((sum, f) => sum + f.amount, 0);
  const totalUnpaidAmount = fees.filter(f => !f.is_paid).reduce((sum, f) => sum + f.amount, 0);

  const formatMonth = (monthStr) => {
    if (!monthStr || !monthStr.includes('-')) return monthStr;
    const [year, month] = monthStr.split('-');
    const date = new Date(year, parseInt(month) - 1);
    return date.toLocaleString('bn-BD', { month: 'long', year: 'numeric' });
  };

  const studentDues = Object.values(fees.reduce((acc, fee) => {
    if (!fee.is_paid) {
      if (!acc[fee.student_id]) {
        acc[fee.student_id] = {
          student_uid: fee.student_uid,
          student_name: fee.student_name,
          student_branch: fee.student_branch,
          total_due: 0,
          months: []
        };
      }
      acc[fee.student_id].total_due += fee.amount;
      acc[fee.student_id].months.push(formatMonth(fee.month));
    }
    return acc;
  }, {})).sort((a, b) => b.total_due - a.total_due);

  // History view: get all fees for a specific student (from unfiltered allFees)
  const historyStudentFees = historyStudent
    ? allFees.filter(f => f.student_id === historyStudent.id)
    : [];

  // History: filtered students list for search
  const historyFilteredStudents = historySearch
    ? students.filter(s =>
        s.name.toLowerCase().includes(historySearch.toLowerCase()) ||
        (s.student_uid || '').toLowerCase().includes(historySearch.toLowerCase())
      ).slice(0, 8)
    : [];

  // Calculate total due for a student (from allFees)
  const getStudentDue = (studentId) => {
    return allFees.filter(f => f.student_id === studentId && !f.is_paid).reduce((sum, f) => sum + f.amount, 0);
  };

  return (
    <div>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <h2 className="text-xl font-bold text-gray-900">ফি ট্র্যাকার</h2>
        <button onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-2 bg-primary text-white px-5 py-2.5 rounded-xl font-semibold hover:bg-secondary transition-colors shadow-sm">
          <PlusIcon /> নতুন ফি এন্ট্রি
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="bg-blue-50 border border-blue-100 rounded-2xl p-4 text-center">
          <p className="text-2xl font-bold text-blue-700">{fees.length}</p>
          <p className="text-sm text-blue-600 font-semibold mt-1">মোট রেকর্ড</p>
        </div>
        <div className="bg-green-50 border border-green-100 rounded-2xl p-4 text-center">
          <p className="text-2xl font-bold text-green-700">৳{totalPaidAmount.toLocaleString('bn-BD')}</p>
          <p className="text-sm text-green-600 font-semibold mt-1">মোট আদায়</p>
        </div>
        <div className="bg-red-50 border border-red-100 rounded-2xl p-4 text-center">
          <p className="text-2xl font-bold text-red-700">৳{totalUnpaidAmount.toLocaleString('bn-BD')}</p>
          <p className="text-sm text-red-600 font-semibold mt-1">মোট বকেয়া</p>
        </div>
      </div>

      <Alert message={msg.text} type={msg.type} />

      {/* Add Fee Form */}
      {showForm && (
        <div className="bg-blue-50 border border-blue-100 rounded-2xl p-6 mb-6">
          <h3 className="font-bold text-lg mb-4 text-gray-800">নতুন ফি এন্ট্রি</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <SearchableStudentSelect
              students={students}
              fees={allFees}
              value={form.student_id}
              onChange={val => setForm({ ...form, student_id: val })}
            />
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">মাস *</label>
              <input type="month" value={form.month} onChange={e => setForm({ ...form, month: e.target.value })}
                className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-primary outline-none bg-white" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">পরিমাণ (টাকা) *</label>
              <input type="number" value={form.amount} onChange={e => setForm({ ...form, amount: e.target.value })}
                className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-primary outline-none bg-white"
                placeholder="৫০০" />
            </div>
            <div className="flex items-center gap-3 mt-6">
              <input type="checkbox" id="isPaid" checked={form.is_paid} onChange={e => setForm({ ...form, is_paid: e.target.checked })}
                className="w-5 h-5 accent-primary cursor-pointer" />
              <label htmlFor="isPaid" className="font-semibold text-gray-700 cursor-pointer">এখনই পরিশোধিত মার্ক করুন</label>
            </div>
          </div>
          <div className="flex gap-3 mt-5">
            <button onClick={handleAddFee} disabled={saving}
              className="bg-primary text-white px-6 py-2.5 rounded-xl font-semibold hover:bg-secondary transition-colors disabled:bg-gray-400">
              {saving ? 'সেভ হচ্ছে...' : 'সেভ করুন'}
            </button>
            <button onClick={() => setShowForm(false)}
              className="bg-white border border-gray-300 text-gray-700 px-6 py-2.5 rounded-xl font-semibold hover:bg-gray-50 transition-colors">
              বাতিল
            </button>
          </div>
        </div>
      )}

      {/* View Mode Tabs */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-5">
        <div className="flex gap-2 bg-gray-100 p-1 rounded-xl w-max">
          <button onClick={() => setFeeViewMode('all')}
            className={`px-4 py-2 rounded-lg font-bold text-sm transition-colors ${feeViewMode === 'all' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}>
            সব রেকর্ড
          </button>
          <button onClick={() => setFeeViewMode('dues')}
            className={`px-4 py-2 rounded-lg font-bold text-sm transition-colors ${feeViewMode === 'dues' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}>
            বকেয়া তালিকা
          </button>
          <button onClick={() => { setFeeViewMode('history'); setHistoryStudent(null); setHistorySearch(''); }}
            className={`px-4 py-2 rounded-lg font-bold text-sm transition-colors ${feeViewMode === 'history' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}>
            পেমেন্ট হিস্ট্রি
          </button>
        </div>

        {feeViewMode === 'all' && (
          <div className="flex flex-wrap gap-3">
            <select value={filterPaid} onChange={e => setFilterPaid(e.target.value)}
              className="border border-gray-300 rounded-xl p-2.5 px-4 focus:ring-2 focus:ring-primary outline-none bg-white font-medium">
              <option value="">সব রেকর্ড</option>
              <option value="false">বকেয়া</option>
              <option value="true">পরিশোধিত</option>
            </select>
            <select value={filterBranch} onChange={e => setFilterBranch(e.target.value)}
              className="border border-gray-300 rounded-xl p-2.5 px-4 focus:ring-2 focus:ring-primary outline-none bg-white font-medium">
              <option value="">সব শাখা</option>
              <option value="প্রধান শাখা">প্রধান শাখা</option>
              <option value="দ্বিতীয় শাখা">দ্বিতীয় শাখা</option>
            </select>
            <div className="flex items-center gap-2">
              <input
                type="month"
                value={filterMonth}
                onChange={e => setFilterMonth(e.target.value)}
                className="border border-gray-300 rounded-xl p-2.5 px-4 focus:ring-2 focus:ring-primary outline-none bg-white font-medium"
                title="মাস ফিল্টার"
              />
              {filterMonth && (
                <button onClick={() => setFilterMonth('')}
                  className="text-sm text-gray-500 hover:text-red-500 border border-gray-200 rounded-xl px-3 py-2.5 bg-white font-medium transition-colors">
                  ✕
                </button>
              )}
            </div>
          </div>
        )}
      </div>

      {/* ── All Records View ── */}
      {feeViewMode === 'all' && (
        loading ? (
          <div className="text-center py-8 text-gray-500 font-medium">লোড হচ্ছে...</div>
        ) : displayedFees.length === 0 ? (
          <div className="text-center py-12 bg-gray-50 rounded-xl border border-dashed border-gray-200 text-gray-400 font-medium">
            কোনো ফি সংক্রান্ত তথ্য পাওয়া যায়নি।
          </div>
        ) : (
          <div className="overflow-x-auto rounded-xl border border-gray-100 shadow-sm">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 text-gray-600 text-sm border-b">
                  <th className="p-4 font-bold">তারিখ / মাস</th>
                  <th className="p-4 font-bold">আইডি & নাম</th>
                  <th className="p-4 font-bold">পরিমাণ</th>
                  <th className="p-4 font-bold">স্ট্যাটাস</th>
                  <th className="p-4 font-bold">অ্যাকশন</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {displayedFees.map(f => (
                  <tr key={f.id} className="hover:bg-gray-50 transition-colors">
                    <td className="p-4 text-sm font-medium text-gray-700">{f.month}</td>
                    <td className="p-4">
                      <div className="font-bold text-gray-900">{f.student_name}</div>
                      <div className="text-xs text-gray-400 font-semibold">{f.student_id}</div>
                    </td>
                    <td className="p-4 font-bold text-gray-900">
                      {editingFeeId === f.id ? (
                        <div className="flex gap-2 items-center">
                          <input type="number" value={editAmount} onChange={e => setEditAmount(e.target.value)} 
                            className="border border-gray-300 rounded px-2 py-1 w-20 text-sm font-normal outline-none focus:ring-2 focus:ring-primary" />
                          <button onClick={() => handleEditFeeAmount(f.id)} className="text-green-600 font-bold hover:bg-green-50 p-1 rounded transition-colors">✓</button>
                          <button onClick={() => setEditingFeeId(null)} className="text-red-500 font-bold hover:bg-red-50 p-1 rounded transition-colors">✗</button>
                        </div>
                      ) : (
                        <div className="flex gap-2 items-center">
                          <span>৳{f.amount}</span>
                          {!f.is_paid && (
                            <button onClick={() => { setEditingFeeId(f.id); setEditAmount(f.amount.toString()); }} className="text-gray-400 hover:text-blue-600 transition-colors" title="পরিমাণ এডিট করুন">
                              ✎
                            </button>
                          )}
                        </div>
                      )}
                    </td>
                    <td className="p-4">
                      {f.is_paid ? (
                        <span className="px-3 py-1 rounded-full text-xs font-bold bg-green-100 text-green-700">
                          ✓ পরিশোধিত
                          {f.payment_date && <span className="ml-1 opacity-70">({f.payment_date})</span>}
                        </span>
                      ) : (
                        <span className="px-3 py-1 rounded-full text-xs font-bold bg-red-100 text-red-700">✗ বকেয়া</span>
                      )}
                    </td>
                    <td className="p-4 flex gap-2 items-center h-full">
                      {!f.is_paid && (
                        <button onClick={() => handleMarkPaid(f.id)}
                          className="text-xs bg-green-500 text-white px-3 py-1.5 rounded-lg hover:bg-green-600 transition-colors font-semibold">
                          পরিশোধিত মার্ক করুন
                        </button>
                      )}
                      <button onClick={() => handleDeleteFee(f.id)}
                        className="text-gray-400 hover:text-red-600 transition-colors bg-gray-100 hover:bg-red-50 p-1.5 rounded-lg" title="ডিলিট করুন">
                        <TrashIcon />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )
      )}

      {/* Dues Summary View */}
      {feeViewMode === 'dues' && (
        <div className="overflow-x-auto rounded-xl border border-gray-100 shadow-sm">
          {studentDues.length === 0 ? (
            <div className="text-center py-16 bg-gray-50 text-gray-500 font-medium">
              কারো কোনো বকেয়া নেই! 🎉
            </div>
          ) : (
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-red-50 text-red-800 text-sm border-b border-red-100">
                  <th className="p-4 font-bold">স্টুডেন্ট আইডি</th>
                  <th className="p-4 font-bold">নাম</th>
                  <th className="p-4 font-bold">শাখা</th>
                  <th className="p-4 font-bold">বকেয়া মাস</th>
                  <th className="p-4 font-bold text-right">মোট বকেয়া</th>
                </tr>
              </thead>
              <tbody>
                {studentDues.map((due, idx) => (
                  <tr key={idx} className="border-b border-gray-50 hover:bg-red-50/30 transition-colors">
                    <td className="p-4"><span className="font-bold text-primary text-sm">{due.student_uid}</span></td>
                    <td className="p-4 font-semibold text-gray-900">{due.student_name}</td>
                    <td className="p-4 text-gray-600 text-sm">{due.student_branch}</td>
                    <td className="p-4 text-gray-600 text-sm">{due.months.join(', ')}</td>
                    <td className="p-4 font-bold text-red-600 text-right text-lg">৳{due.total_due}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}
    </div>
  );
};

// ─── Routine Tab (unchanged) ──────────────────────────────────────────────────
const RoutineTab = ({ role }) => {
  const [routineBranch, setRoutineBranch] = useState('প্রধান শাখা');
  const [routineDate, setRoutineDate] = useState('');
  const [routineStartTime, setRoutineStartTime] = useState('');
  const [routineEndTime, setRoutineEndTime] = useState('');
  const [routineLevel, setRoutineLevel] = useState('');
  const [routineClass, setRoutineClass] = useState('');
  const [routineTeacher, setRoutineTeacher] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [routineMessage, setRoutineMessage] = useState('');
  const [existingRoutines, setExistingRoutines] = useState([]);
  const [filterBranch, setFilterBranch] = useState('প্রধান শাখা');
  const [editingRoutineId, setEditingRoutineId] = useState(null);

  useEffect(() => {
    const fetchRoutines = async () => {
      try {
        const res = await fetch(`/api/dashboard/routines?branch=${encodeURIComponent(filterBranch)}`);
        if (res.ok) setExistingRoutines(await res.json());
      } catch (e) { console.error(e); }
    };
    fetchRoutines();
  }, [filterBranch]);

  useEffect(() => {
    const existing = existingRoutines.find(r =>
      r.branch === routineBranch && r.date === routineDate &&
      r.start_time === routineStartTime && r.end_time === routineEndTime && r.class_level === routineLevel
    );
    if (existing) { setRoutineClass(existing.class_name || ''); setRoutineTeacher(existing.teacher_name || ''); }
    // Removed clearing logic to allow handleEditRoutine to work without getting wiped out immediately
  }, [routineBranch, routineDate, routineStartTime, routineEndTime, routineLevel, existingRoutines]);

  const handleDeleteRoutine = async (id) => {
    if (!window.confirm('আপনি কি নিশ্চিত যে এই রুটিনটি মুছতে চান?')) return;
    try {
      const res = await fetch(`/api/dashboard/routines/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setExistingRoutines(prev => prev.filter(r => r.id !== id));
        setRoutineMessage('রুটিন মোছা হয়েছে!');
        setTimeout(() => setRoutineMessage(''), 3000);
      }
    } catch (e) { console.error(e); }
  };

  const handleDeletePastRoutines = async () => {
    if (!window.confirm('আপনি কি নিশ্চিত যে সমস্ত পুরনো রুটিন মুছতে চান?')) return;
    try {
      const res = await fetch(`/api/dashboard/routines/past`, { method: 'DELETE' });
      if (res.ok) {
        const data = await res.json();
        const today = new Date().toISOString().split('T')[0];
        setExistingRoutines(prev => prev.filter(r => r.date >= today));
        setRoutineMessage(data.message || 'পুরনো রুটিন মোছা হয়েছে!');
        setTimeout(() => setRoutineMessage(''), 3000);
      }
    } catch (e) { console.error(e); }
  };

  const handleEditRoutine = (r) => {
    setEditingRoutineId(r.id);
    setRoutineBranch(r.branch);
    setRoutineDate(r.date);
    setRoutineStartTime(r.start_time);
    setRoutineEndTime(r.end_time);
    setRoutineLevel(r.class_level);
    setRoutineClass(r.class_name);
    setRoutineTeacher(r.teacher_name);
    window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
  };

  const handleSaveRoutine = async () => {
    if (!routineBranch || !routineDate || !routineStartTime || !routineEndTime || !routineLevel || !routineClass || !routineTeacher) {
      setRoutineMessage('দয়া করে সব ফিল্ড পূরণ করুন!'); return;
    }
    setIsSaving(true);
    try {
      const url = editingRoutineId ? `/api/dashboard/routines/${editingRoutineId}` : '/api/dashboard/routines';
      const method = editingRoutineId ? 'PUT' : 'POST';
      const res = await fetch(url, {
        method, headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ branch: routineBranch, date: routineDate, start_time: routineStartTime, end_time: routineEndTime, class_level: routineLevel, class_name: routineClass, teacher_name: routineTeacher })
      });
      if (res.ok) {
        const saved = await res.json();
        if (saved.branch === filterBranch) {
          setExistingRoutines(prev => {
            const filtered = prev.filter(r => r.id !== saved.id);
            return [...filtered, saved];
          });
        }
        setRoutineMessage(editingRoutineId ? 'রুটিন সফলভাবে আপডেট হয়েছে!' : 'রুটিন সফলভাবে তৈরি হয়েছে!');
        setEditingRoutineId(null);
        setRoutineClass('');
        setRoutineTeacher('');
        setTimeout(() => setRoutineMessage(''), 3000);
      } else { setRoutineMessage('রুটিন আপডেট করতে সমস্যা হয়েছে।'); }
    } catch { setRoutineMessage('সার্ভারে কানেক্ট করা যাচ্ছে না।'); }
    finally { setIsSaving(false); }
  };

  return (
    <div>
      {/* Master Routine View */}
      <div className="mb-12 pb-8 border-b border-gray-100">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
          <h3 className="text-xl font-bold">মাস্টার রুটিন ভিউ</h3>
          <div className="flex items-center gap-3">
            <button onClick={handleDeletePastRoutines} className="bg-red-500 text-white font-bold py-2 px-4 rounded-xl hover:bg-red-600 transition-colors">
              পুরনো রুটিন মুছুন
            </button>
            <label className="text-gray-600 font-semibold">শাখা:</label>
            <select value={filterBranch} onChange={e => setFilterBranch(e.target.value)} className="border border-gray-300 rounded-xl p-2 px-4 focus:ring-2 focus:ring-primary outline-none bg-white font-medium">
              <option value="প্রধান শাখা">প্রধান শাখা</option>
              <option value="দ্বিতীয় শাখা">দ্বিতীয় শাখা</option>
            </select>
          </div>
        </div>
        {existingRoutines.length === 0 ? (
          <div className="text-gray-500 py-4 bg-gray-50 rounded-xl p-8 text-center border border-dashed border-gray-300 font-medium">এই শাখার জন্য কোনো রুটিন পাওয়া যায়নি।</div>
        ) : (
          <div className="space-y-8">
            {Object.entries(existingRoutines.reduce((acc, r) => {
              const d = r.date; if (!acc[d]) acc[d] = {};
              const fmt = (t) => { if (!t) return ''; const [h, m] = t.split(':'); let hr = parseInt(h); const ap = hr >= 12 ? 'PM' : 'AM'; hr = hr % 12 || 12; return `${hr}:${m} ${ap}`; };
              const tb = `${fmt(r.start_time)} - ${fmt(r.end_time)}`;
              if (!acc[d][tb]) acc[d][tb] = []; acc[d][tb].push(r); return acc;
            }, {})).map(([date, timeBlocks]) => (
              <div key={date} className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
                <div className="bg-gray-50 px-6 py-3 border-b border-gray-200">
                  <h4 className="font-bold text-gray-800 text-lg">তারিখ: {new Date(date).toLocaleDateString('bn-BD', { day: 'numeric', month: 'long', year: 'numeric' })}</h4>
                </div>
                <div className="p-6 space-y-6">
                  {Object.entries(timeBlocks).map(([time, routines]) => (
                    <div key={time} className="pl-4 border-l-2 border-primary/30">
                      <h5 className="font-semibold text-primary mb-3">সময়: {time}</h5>
                      <div className="space-y-2">
                        {routines.map((r, idx) => (
                          <div key={idx} className="flex items-center text-gray-700 bg-gray-50 p-2 rounded-lg group">
                            <span className="font-semibold min-w-[100px]">{r.class_level}</span>
                            <span className="mx-2">-</span>
                            <span className="font-bold">{r.class_name}</span>
                            <span className="ml-2 text-sm text-gray-500 flex-1">({r.teacher_name})</span>
                            {role === 'admin' && (
                              <div className="flex gap-2">
                                <button onClick={() => handleEditRoutine(r)} className="text-blue-500 hover:bg-blue-100 p-1.5 rounded transition-colors text-sm font-semibold">এডিট</button>
                                <button onClick={() => handleDeleteRoutine(r.id)} className="text-red-500 hover:bg-red-100 p-1.5 rounded transition-colors text-sm font-semibold">মুছুন</button>
                              </div>
                            )}
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

      {/* Routine Update Form */}
      {role === 'admin' && (
      <div>
        <h2 className="text-xl font-bold mb-4">ডেইলি রুটিন আপডেট করুন</h2>
        <div className="space-y-4 max-w-2xl">
          {routineMessage && <Alert message={routineMessage} type={routineMessage.includes('সফল') ? 'success' : 'error'} />}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">শাখা</label>
            <select value={routineBranch} onChange={e => setRoutineBranch(e.target.value)} className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-primary outline-none bg-white">
              <option value="প্রধান শাখা">প্রধান শাখা</option>
              <option value="দ্বিতীয় শাখা">দ্বিতীয় শাখা</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">তারিখ</label>
            <input type="date" value={routineDate} onChange={e => setRoutineDate(e.target.value)} className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-primary outline-none" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">শুরুর সময়</label>
              <input type="time" value={routineStartTime} onChange={e => setRoutineStartTime(e.target.value)} className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-primary outline-none" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">শেষ সময়</label>
              <input type="time" value={routineEndTime} onChange={e => setRoutineEndTime(e.target.value)} className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-primary outline-none" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">ব্যাচ / ক্লাস লেভেল</label>
            <select value={routineLevel} onChange={e => setRoutineLevel(e.target.value)} className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-primary outline-none bg-white">
              <option value="">শ্রেণি নির্বাচন করুন</option>
              <option value="Class 1">প্রথম শ্রেণি</option>
              <option value="Class 2">দ্বিতীয় শ্রেণি</option>
              <option value="Class 3">তৃতীয় শ্রেণি</option>
              <option value="Class 4">চতুর্থ শ্রেণি</option>
              <option value="Class 5">পঞ্চম শ্রেণি</option>
              <option value="Class 6">ষষ্ঠ শ্রেণি</option>
              <option value="Class 7">সপ্তম শ্রেণি</option>
              <option value="Class 8">অষ্টম শ্রেণি</option>
              <option value="Class 9">নবম শ্রেণি</option>
              <option value="Class 10">দশম শ্রেণি</option>
              <option value="HSC 1st Year">এইচএসসি — প্রথম বর্ষ</option>
              <option value="HSC 2nd Year">এইচএসসি — দ্বিতীয় বর্ষ</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">বিষয়ের নাম</label>
            <input type="text" value={routineClass} onChange={e => setRoutineClass(e.target.value)} className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-primary outline-none" placeholder="যেমন: English" />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">শিক্ষকের নাম</label>
            <input type="text" value={routineTeacher} onChange={e => setRoutineTeacher(e.target.value)} className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-primary outline-none" placeholder="যেমন: Irine ma'am" />
          </div>
          <div className="flex gap-4">
            <button onClick={handleSaveRoutine} disabled={isSaving} className="bg-primary text-white px-6 py-2.5 rounded-xl font-semibold hover:bg-secondary transition-colors disabled:bg-gray-400">
              {isSaving ? 'সেভ হচ্ছে...' : (editingRoutineId ? 'আপডেট করুন' : 'সেভ করুন')}
            </button>
            {editingRoutineId && (
              <button onClick={() => { setEditingRoutineId(null); setRoutineClass(''); setRoutineTeacher(''); }} className="bg-gray-500 text-white px-6 py-2.5 rounded-xl font-semibold hover:bg-gray-600 transition-colors">
                বাতিল
              </button>
            )}
          </div>
        </div>
      </div>
      )}
    </div>
  );
};

// ─── Exam Management Tab ────────────────────────────────────────────────────────
const ExamManagementTab = () => {
  const [exams, setExams] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [newExam, setNewExam] = useState({ title: '', subject: '', duration_minutes: 30 });
  const [editingExamId, setEditingExamId] = useState(null);
  const [msg, setMsg] = useState('');
  const [selectedExamId, setSelectedExamId] = useState(null);
  const [selectedExam, setSelectedExam] = useState(null);
  const [newQuestion, setNewQuestion] = useState({ text: '', option1: '', option2: '', option3: '', option4: '', correct_answer: 0 });

  useEffect(() => { fetchExams(); }, []);

  const fetchExams = async () => {
    try {
      const res = await fetch('/api/dashboard/exams');
      if (res.ok) setExams(await res.json());
    } catch (err) { console.error(err); }
  };

  const handleSaveExam = async () => {
    if (!newExam.title || !newExam.subject) return setMsg('শিরোনাম এবং বিষয় পূরণ করুন।');
    try {
      const url = editingExamId ? `/api/dashboard/exams/${editingExamId}` : '/api/dashboard/exams';
      const method = editingExamId ? 'PUT' : 'POST';
      const res = await fetch(url, {
        method, headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newExam)
      });
      if (res.ok) {
        setMsg(editingExamId ? 'পরীক্ষা আপডেট হয়েছে!' : 'পরীক্ষা তৈরি হয়েছে!');
        setShowForm(false);
        setEditingExamId(null);
        setNewExam({ title: '', subject: '', duration_minutes: 30 });
        fetchExams();
      }
    } catch (err) { console.error(err); setMsg('সমস্যা হয়েছে।'); }
    setTimeout(() => setMsg(''), 3000);
  };

  const handleEditExam = (exam, e) => {
    e.stopPropagation();
    setNewExam({ title: exam.title, subject: exam.subject, duration_minutes: exam.duration_minutes });
    setEditingExamId(exam.id);
    setShowForm(true);
  };

  const handleToggleExam = async (id) => {
    await fetch(`/api/dashboard/exams/${id}/toggle`, { method: 'PATCH' });
    fetchExams();
  };

  const handleDeleteExam = async (id) => {
    if(!window.confirm('পরীক্ষাটি মুছতে চান?')) return;
    await fetch(`/api/dashboard/exams/${id}`, { method: 'DELETE' });
    if(selectedExamId === id) setSelectedExamId(null);
    fetchExams();
  };

  const loadExamDetails = async (id) => {
    try {
      const res = await fetch(`/api/dashboard/exams/${id}`);
      if (res.ok) {
        setSelectedExam(await res.json());
        setSelectedExamId(id);
      }
    } catch (err) { console.error(err); }
  };

  const handleAddQuestion = async () => {
    if (!newQuestion.text || !newQuestion.option1 || !newQuestion.option2) return alert('প্রশ্ন ও অন্তত দুটি অপশন দিন।');
    try {
      const optionsArray = [newQuestion.option1, newQuestion.option2, newQuestion.option3, newQuestion.option4].filter(o => o);
      const res = await fetch(`/api/dashboard/exams/${selectedExamId}/questions`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: newQuestion.text,
          options: JSON.stringify(optionsArray),
          correct_answer: parseInt(newQuestion.correct_answer)
        })
      });
      if (res.ok) {
        loadExamDetails(selectedExamId);
        setNewQuestion({ text: '', option1: '', option2: '', option3: '', option4: '', correct_answer: 0 });
      }
    } catch (err) { console.error(err); }
  };

  const handleDeleteQuestion = async (qId) => {
    if(!window.confirm('প্রশ্নটি মুছতে চান?')) return;
    await fetch(`/api/dashboard/questions/${qId}`, { method: 'DELETE' });
    loadExamDetails(selectedExamId);
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-gray-900">পরীক্ষা ম্যানেজমেন্ট</h2>
        <button onClick={() => setShowForm(!showForm)} className="bg-primary text-white px-5 py-2.5 rounded-xl font-semibold hover:bg-secondary">
          + নতুন পরীক্ষা
        </button>
      </div>
      {msg && <div className="mb-4 text-green-700 bg-green-100 p-3 rounded">{msg}</div>}
      {showForm && (
        <div className="bg-blue-50 p-6 rounded-xl mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div><label className="block mb-1 font-bold">শিরোনাম</label><input type="text" value={newExam.title} onChange={e=>setNewExam({...newExam, title: e.target.value})} className="w-full p-2 border rounded" placeholder="মডেল টেস্ট ১" /></div>
            <div><label className="block mb-1 font-bold">বিষয়</label><input type="text" value={newExam.subject} onChange={e=>setNewExam({...newExam, subject: e.target.value})} className="w-full p-2 border rounded" placeholder="পদার্থবিজ্ঞান" /></div>
            <div><label className="block mb-1 font-bold">সময় (মিনিট)</label><input type="number" value={newExam.duration_minutes} onChange={e=>setNewExam({...newExam, duration_minutes: e.target.value})} className="w-full p-2 border rounded" /></div>
          </div>
          <div className="flex gap-2">
            <button onClick={handleSaveExam} className="bg-blue-600 text-white px-4 py-2 rounded font-bold">{editingExamId ? 'আপডেট করুন' : 'সেভ করুন'}</button>
            <button onClick={() => { setShowForm(false); setEditingExamId(null); setNewExam({ title: '', subject: '', duration_minutes: 30 }); }} className="bg-gray-500 text-white px-4 py-2 rounded font-bold">বাতিল</button>
          </div>
        </div>
      )}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 border rounded-xl overflow-hidden">
          <div className="bg-gray-100 p-3 font-bold border-b">পরীক্ষার তালিকা</div>
          <div className="max-h-[500px] overflow-y-auto">
            {exams.map(ex => (
              <div key={ex.id} className={`p-4 border-b cursor-pointer hover:bg-blue-50 ${selectedExamId === ex.id ? 'bg-blue-50 border-l-4 border-l-primary' : ''}`} onClick={() => loadExamDetails(ex.id)}>
                <div className="font-bold">{ex.title}</div>
                <div className="text-sm text-gray-500">{ex.subject} • {ex.duration_minutes} মিনিট</div>
                <div className="mt-2 flex gap-2">
                  <button onClick={(e) => { e.stopPropagation(); handleToggleExam(ex.id); }} className={`text-xs px-2 py-1 rounded text-white ${ex.is_active ? 'bg-green-500' : 'bg-gray-400'}`}>{ex.is_active ? 'Active' : 'Inactive'}</button>
                  <button onClick={(e) => handleEditExam(ex, e)} className="text-xs px-2 py-1 rounded bg-blue-500 text-white">এডিট</button>
                  <button onClick={(e) => { e.stopPropagation(); handleDeleteExam(ex.id); }} className="text-xs px-2 py-1 rounded bg-red-500 text-white">ডিলিট</button>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="lg:col-span-2 border rounded-xl overflow-hidden p-6 bg-white">
          {selectedExam ? (
            <div>
              <h3 className="text-lg font-bold mb-4">{selectedExam.title} - প্রশ্নসমূহ</h3>
              <div className="bg-gray-50 p-4 rounded-lg mb-6 border">
                <h4 className="font-bold mb-3">নতুন প্রশ্ন যোগ করুন</h4>
                <input type="text" placeholder="প্রশ্ন" value={newQuestion.text} onChange={e=>setNewQuestion({...newQuestion, text: e.target.value})} className="w-full p-2 mb-2 border rounded" />
                <div className="grid grid-cols-2 gap-2 mb-2">
                  <input type="text" placeholder="অপশন ১" value={newQuestion.option1} onChange={e=>setNewQuestion({...newQuestion, option1: e.target.value})} className="p-2 border rounded" />
                  <input type="text" placeholder="অপশন ২" value={newQuestion.option2} onChange={e=>setNewQuestion({...newQuestion, option2: e.target.value})} className="p-2 border rounded" />
                  <input type="text" placeholder="অপশন ৩ (ঐচ্ছিক)" value={newQuestion.option3} onChange={e=>setNewQuestion({...newQuestion, option3: e.target.value})} className="p-2 border rounded" />
                  <input type="text" placeholder="অপশন ৪ (ঐচ্ছিক)" value={newQuestion.option4} onChange={e=>setNewQuestion({...newQuestion, option4: e.target.value})} className="p-2 border rounded" />
                </div>
                <div className="flex items-center gap-4">
                  <select value={newQuestion.correct_answer} onChange={e=>setNewQuestion({...newQuestion, correct_answer: e.target.value})} className="p-2 border rounded">
                    <option value={0}>সঠিক: অপশন ১</option>
                    <option value={1}>সঠিক: অপশন ২</option>
                    <option value={2}>সঠিক: অপশন ৩</option>
                    <option value={3}>সঠিক: অপশন ৪</option>
                  </select>
                  <button onClick={handleAddQuestion} className="bg-primary text-white px-4 py-2 rounded font-bold">+ যোগ করুন</button>
                </div>
              </div>
              <div className="space-y-4">
                {selectedExam.questions?.map((q, idx) => {
                  const opts = JSON.parse(q.options);
                  return (
                    <div key={q.id} className="p-4 border rounded relative">
                      <button onClick={() => handleDeleteQuestion(q.id)} className="absolute top-4 right-4 text-red-500 font-bold text-sm hover:underline">মুছুন</button>
                      <div className="font-bold mb-2">{idx + 1}. {q.text}</div>
                      <ol className="list-decimal pl-5 text-sm">
                        {opts.map((opt, i) => (
                          <li key={i} className={q.correct_answer === i ? 'text-green-600 font-bold' : ''}>{opt} {q.correct_answer === i && '✓'}</li>
                        ))}
                      </ol>
                    </div>
                  );
                })}
              </div>
            </div>
          ) : (
            <div className="text-center text-gray-400 py-10">বাম পাশ থেকে একটি পরীক্ষা নির্বাচন করুন</div>
          )}
        </div>
      </div>
    </div>
  );
};

// ─── Main AdminDashboard ──────────────────────────────────────────────────────
const TeacherAttendanceTab = ({ records, fetchRecords }) => {
  const [filterMonth, setFilterMonth] = useState(new Date().toISOString().slice(0, 7));
  const [searchTeacher, setSearchTeacher] = useState('');
  const [activeView, setActiveView] = useState('records');
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [attMsg, setAttMsg] = useState({ text: '', type: 'success' });
  const [saving, setSaving] = useState(false);
  const [teacherRates, setTeacherRates] = useState({});

  const emptyForm = {
    teacher_name: '', date: new Date().toISOString().slice(0, 10),
    classes_taken: 1, subjects: '', batches: '', status: 'Present'
  };
  const [form, setForm] = useState(emptyForm);

  const showAttMsg = (text, type = 'success') => {
    setAttMsg({ text, type });
    setTimeout(() => setAttMsg({ text: '', type: 'success' }), 4000);
  };

  const filteredRecords = records
    .filter(r => r.date.startsWith(filterMonth))
    .filter(r => !searchTeacher || r.teacher_name.toLowerCase().includes(searchTeacher.toLowerCase()));

  const summaryMap = {};
  records.filter(r => r.date.startsWith(filterMonth)).forEach(r => {
    if (!summaryMap[r.teacher_name]) summaryMap[r.teacher_name] = { totalClasses: 0 };
    summaryMap[r.teacher_name].totalClasses += r.classes_taken;
  });
  const summaryArray = Object.keys(summaryMap)
    .map(name => ({ name, totalClasses: summaryMap[name].totalClasses }))
    .sort((a, b) => b.totalClasses - a.totalClasses);

  const handleAttSubmit = async () => {
    if (!form.teacher_name || !form.date || !form.classes_taken) {
      showAttMsg('নাম, তারিখ এবং ক্লাস সংখ্যা আবশ্যিক!', 'error'); return;
    }
    setSaving(true);
    try {
      const url = editingId
        ? `/api/dashboard/teacher-attendance/${editingId}`
        : '/api/dashboard/teacher-attendance';
      const res = await fetch(url, {
        method: editingId ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, classes_taken: parseInt(form.classes_taken) })
      });
      if (res.ok) {
        showAttMsg(editingId ? 'রেকর্ড আপডেট হয়েছে!' : 'হাজিরা এন্ট্রি সফল!');
        setShowForm(false); setEditingId(null); setForm(emptyForm);
        fetchRecords();
      } else {
        const err = await res.json().catch(() => ({}));
        showAttMsg(`সমস্যা: ${err.detail || 'অজানা এরর'}`, 'error');
      }
    } catch { showAttMsg('সার্ভারে সংযোগ নেই।', 'error'); }
    finally { setSaving(false); }
  };

  const handleAttEdit = (record) => {
    setForm({
      teacher_name: record.teacher_name, date: record.date,
      classes_taken: record.classes_taken, subjects: record.subjects,
      batches: record.batches, status: record.status || 'Present'
    });
    setEditingId(record.id);
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleAttDelete = async (id) => {
    if (!window.confirm('এই রেকর্ডটি মুছতে চান?')) return;
    try {
      const res = await fetch(`/api/dashboard/teacher-attendance/${id}`, { method: 'DELETE' });
      if (res.ok || res.status === 204) { showAttMsg('রেকর্ড মুছে গেছে!'); fetchRecords(); }
      else showAttMsg('ডিলিট করতে সমস্যা হয়েছে।', 'error');
    } catch { showAttMsg('সার্ভার এরর!', 'error'); }
  };

  const handleAttCancel = () => { setShowForm(false); setEditingId(null); setForm(emptyForm); };

  return (
    <div>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <h2 className="text-xl font-bold text-gray-900">টিচার হাজিরা</h2>
        <div className="flex gap-2 flex-wrap">
          <button onClick={fetchRecords} className="border border-gray-300 bg-white text-gray-600 px-4 py-2 rounded-xl font-semibold hover:bg-gray-50 transition-colors text-sm">↻ রিফ্রেশ</button>
          <button onClick={() => { if (showForm) { handleAttCancel(); } else { setShowForm(true); } }}
            className="flex items-center gap-2 bg-primary text-white px-5 py-2 rounded-xl font-semibold hover:bg-secondary transition-colors shadow-sm text-sm">
            + নতুন এন্ট্রি
          </button>
        </div>
      </div>

      {attMsg.text && (
        <div className={`p-3 rounded-lg text-sm border mb-4 ${attMsg.type === 'success' ? 'bg-green-50 text-green-700 border-green-200' : 'bg-red-50 text-red-700 border-red-200'}`}>
          {attMsg.text}
        </div>
      )}

      {showForm && (
        <div className="bg-blue-50 border border-blue-100 rounded-2xl p-6 mb-6">
          <h3 className="font-bold text-lg mb-4 text-gray-800">{editingId ? '✎ হাজিরা এডিট করুন' : '+ নতুন হাজিরা এন্ট্রি'}</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">টিচারের নাম *</label>
              <input type="text" value={form.teacher_name} onChange={e => setForm({ ...form, teacher_name: e.target.value })} placeholder="যেমন: RC-Supto" className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-primary outline-none bg-white" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">তারিখ *</label>
              <input type="date" value={form.date} onChange={e => setForm({ ...form, date: e.target.value })} className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-primary outline-none bg-white" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">ক্লাস সংখ্যা *</label>
              <input type="number" min="0" value={form.classes_taken} onChange={e => setForm({ ...form, classes_taken: e.target.value })} className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-primary outline-none bg-white" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">বিষয়সমূহ</label>
              <input type="text" value={form.subjects} onChange={e => setForm({ ...form, subjects: e.target.value })} placeholder="যেমন: Math, Physics" className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-primary outline-none bg-white" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">ব্যাচসমূহ</label>
              <input type="text" value={form.batches} onChange={e => setForm({ ...form, batches: e.target.value })} placeholder="যেমন: Batch A" className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-primary outline-none bg-white" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">স্ট্যাটাস</label>
              <select value={form.status} onChange={e => setForm({ ...form, status: e.target.value })} className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-primary outline-none bg-white">
                <option value="Present">Present</option>
                <option value="Absent">Absent</option>
                <option value="Leave">Leave</option>
              </select>
            </div>
          </div>
          <div className="flex gap-3 mt-5">
            <button onClick={handleAttSubmit} disabled={saving} className="bg-primary text-white px-6 py-2.5 rounded-xl font-semibold hover:bg-secondary transition-colors disabled:bg-gray-400">
              {saving ? 'সেভ হচ্ছে...' : (editingId ? 'আপডেট করুন' : 'সেভ করুন')}
            </button>
            <button onClick={handleAttCancel} className="bg-white border border-gray-300 text-gray-700 px-6 py-2.5 rounded-xl font-semibold hover:bg-gray-50 transition-colors">বাতিল</button>
          </div>
        </div>
      )}

      <div className="flex gap-2 bg-gray-100 p-1 rounded-xl w-max mb-6">
        <button onClick={() => setActiveView('records')} className={`px-4 py-2 rounded-lg font-bold text-sm transition-colors ${activeView === 'records' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}>হাজিরা রেকর্ড</button>
        <button onClick={() => setActiveView('salary')} className={`px-4 py-2 rounded-lg font-bold text-sm transition-colors ${activeView === 'salary' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}>💰 বেতন হিসাব</button>
      </div>

      <div className="flex flex-wrap gap-4 mb-6">
        <div>
          <label className="block text-xs font-semibold text-gray-500 mb-1">মাস</label>
          <input type="month" value={filterMonth} onChange={e => setFilterMonth(e.target.value)} className="border border-gray-300 rounded-xl p-2.5 focus:ring-2 focus:ring-primary outline-none bg-white font-medium" />
        </div>
        <div>
          <label className="block text-xs font-semibold text-gray-500 mb-1">টিচার খুঁজুন</label>
          <input type="text" placeholder="নাম লিখুন..." value={searchTeacher} onChange={e => setSearchTeacher(e.target.value)} className="border border-gray-300 rounded-xl p-2.5 focus:ring-2 focus:ring-primary outline-none bg-white font-medium" />
        </div>
        {activeView === 'salary' && (
          <div className="flex gap-2 items-center">
            <span className="text-sm text-gray-500 font-semibold bg-gray-50 px-3 py-2 rounded-lg border border-gray-200">💡 নোট: নিচের ছক থেকে প্রতিটি টিচারের রেট আলাদাভাবে পরিবর্তন করা যাবে।</span>
          </div>
        )}
      </div>

      {activeView === 'records' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="col-span-1 bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="bg-gray-50 px-4 py-3 border-b border-gray-100 font-bold text-gray-700 text-sm">মাসিক সারাংশ — {filterMonth}</div>
            <table className="w-full text-left border-collapse">
              <thead><tr className="text-xs text-gray-500 border-b bg-gray-50"><th className="px-4 py-2.5">নাম</th><th className="px-4 py-2.5 text-center">ক্লাস</th></tr></thead>
              <tbody>
                {summaryArray.map((s, idx) => (
                  <tr key={idx} className="border-b last:border-0 hover:bg-gray-50">
                    <td className="px-4 py-3 font-semibold text-gray-800 text-sm">{s.name}</td>
                    <td className="px-4 py-3 text-center font-bold text-primary">{s.totalClasses}</td>
                  </tr>
                ))}
                {summaryArray.length === 0 && <tr><td colSpan="2" className="px-4 py-6 text-center text-gray-400 text-sm">কোনো তথ্য নেই</td></tr>}
              </tbody>
            </table>
          </div>
          <div className="col-span-1 lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="bg-gray-50 px-4 py-3 border-b border-gray-100 font-bold text-gray-700 text-sm">বিস্তারিত রেকর্ড ({filteredRecords.length} টি)</div>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-50 text-gray-600 text-xs font-bold uppercase tracking-wider border-b">
                    <th className="px-4 py-3">তারিখ</th><th className="px-4 py-3">টিচার</th><th className="px-4 py-3 text-center">ক্লাস</th><th className="px-4 py-3">বিষয়</th><th className="px-4 py-3">ব্যাচ</th><th className="px-4 py-3">স্ট্যাটাস</th><th className="px-4 py-3">অ্যাকশন</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {filteredRecords.map(r => (
                    <tr key={r.id} className="hover:bg-blue-50/40 transition-colors">
                      <td className="px-4 py-3 text-gray-700 font-medium text-sm">{r.date}</td>
                      <td className="px-4 py-3 font-bold text-primary text-sm">{r.teacher_name}</td>
                      <td className="px-4 py-3 text-center font-bold text-gray-800">{r.classes_taken}</td>
                      <td className="px-4 py-3 text-gray-500 text-sm">{r.subjects}</td>
                      <td className="px-4 py-3 text-gray-500 text-sm">{r.batches}</td>
                      <td className="px-4 py-3">
                        <span className={`px-2 py-1 rounded-full text-xs font-bold ${r.status === 'Present' ? 'bg-green-100 text-green-700' : r.status === 'Absent' ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700'}`}>{r.status || 'Present'}</span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex gap-1">
                          <button onClick={() => handleAttEdit(r)} className="p-1.5 text-blue-500 hover:bg-blue-50 rounded-lg transition-colors" title="এডিট">✎</button>
                          <button onClick={() => handleAttDelete(r.id)} className="p-1.5 text-red-400 hover:bg-red-50 rounded-lg transition-colors" title="ডিলিট">✖</button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {filteredRecords.length === 0 && <tr><td colSpan="7" className="px-4 py-10 text-center text-gray-400">কোনো হাজিরা রেকর্ড পাওয়া যায়নি</td></tr>}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {activeView === 'salary' && (
        <div>
          <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl border border-green-100 p-5 mb-5">
            <p className="text-sm text-gray-600 mb-1">হিসাব পদ্ধতি</p>
            <p className="font-bold text-gray-800">বেতন = মোট ক্লাস × টিচারের নিজস্ব রেট/ক্লাস | মাস: {filterMonth}</p>
          </div>
          {summaryArray.length === 0 ? (
            <div className="text-center py-16 bg-gray-50 rounded-2xl border border-dashed border-gray-200 text-gray-400">এই মাসে কোনো হাজিরা রেকর্ড নেই।</div>
          ) : (
            <div className="overflow-x-auto rounded-xl border border-gray-100 shadow-sm">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-50 text-gray-600 text-sm border-b">
                    <th className="px-5 py-3 font-bold">#</th>
                    <th className="px-5 py-3 font-bold">টিচারের নাম</th>
                    <th className="px-5 py-3 font-bold text-center">মোট ক্লাস</th>
                    <th className="px-5 py-3 font-bold text-center">রেট (৳)</th>
                    <th className="px-5 py-3 font-bold text-right">মোট বেতন</th>
                  </tr>
                </thead>
                <tbody>
                  {summaryArray.map((s, idx) => {
                    const rate = teacherRates[s.name] !== undefined ? teacherRates[s.name] : 500;
                    return (
                      <tr key={idx} className="border-b border-gray-50 hover:bg-green-50/30 transition-colors">
                        <td className="px-5 py-4 text-gray-400 text-sm">{idx + 1}</td>
                        <td className="px-5 py-4 font-bold text-gray-900">{s.name}</td>
                        <td className="px-5 py-4 text-center"><span className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full font-bold text-sm">{s.totalClasses} ক্লাস</span></td>
                        <td className="px-5 py-4 text-center">
                          <input type="number" min="0" value={rate} onChange={e => setTeacherRates({ ...teacherRates, [s.name]: e.target.value === '' ? '' : parseInt(e.target.value) || 0 })} className="border border-gray-300 rounded-lg p-1.5 focus:ring-2 focus:ring-primary outline-none bg-white font-medium w-24 text-center" />
                        </td>
                        <td className="px-5 py-4 text-right font-bold text-lg text-green-600">৳{(s.totalClasses * rate).toLocaleString('bn-BD')}</td>
                      </tr>
                    );
                  })}
                </tbody>
                <tfoot>
                  <tr className="bg-green-50 border-t-2 border-green-200">
                    <td colSpan="4" className="px-5 py-4 font-bold text-gray-700">মোট ({summaryArray.length} জন)</td>
                    <td className="px-5 py-4 text-right font-bold text-xl text-green-700">৳{summaryArray.reduce((sum, s) => sum + s.totalClasses * (teacherRates[s.name] !== undefined ? (teacherRates[s.name] || 0) : 500), 0).toLocaleString('bn-BD')}</td>
                  </tr>
                </tfoot>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

const AdminDashboard = () => {
  const staffRole = localStorage.getItem('staff_role') || 'teacher';
  const [activeTab, setActiveTab] = useState('notices');
  const [noticeTitle, setNoticeTitle] = useState('');
  const [noticeContent, setNoticeContent] = useState('');
  const [noticeImage, setNoticeImage] = useState('');
  const [isPublishing, setIsPublishing] = useState(false);
  const [noticeMessage, setNoticeMessage] = useState('');
  const [notices, setNotices] = useState([]);
  const [loadingNotices, setLoadingNotices] = useState(false);
  const [editingNoticeId, setEditingNoticeId] = useState(null);

  const fetchNotices = useCallback(async () => {
    setLoadingNotices(true);
    try {
      const res = await fetch('/api/dashboard/notices');
      if (res.ok) {
        setNotices(await res.json());
      }
    } catch (err) {
      console.error("Failed to fetch notices", err);
    } finally {
      setLoadingNotices(false);
    }
  }, []);
  const [teacherAttendanceRecords, setTeacherAttendanceRecords] = useState([]);
  const [loadingTeacherAtt, setLoadingTeacherAtt] = useState(false);

  const fetchTeacherAttendance = useCallback(async () => {
    setLoadingTeacherAtt(true);
    try {
      const res = await fetch('/api/dashboard/teacher-attendance');
      if (res.ok) {
        setTeacherAttendanceRecords(await res.json());
      }
    } catch (err) {
      console.error("Failed to fetch teacher attendance", err);
    } finally {
      setLoadingTeacherAtt(false);
    }
  }, []);

  useEffect(() => {
    fetchNotices();
    fetchTeacherAttendance();
  }, [fetchNotices]);

  const handleNoticeImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let { width, height } = img;
        const MAX_SIZE = 800; // slightly larger for notices
        if (width > height && width > MAX_SIZE) {
          height *= MAX_SIZE / width; width = MAX_SIZE;
        } else if (height > MAX_SIZE) {
          width *= MAX_SIZE / height; height = MAX_SIZE;
        }
        canvas.width = width; canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);
        setNoticeImage(canvas.toDataURL('image/jpeg', 0.8));
      };
      img.src = event.target.result;
    };
    reader.readAsDataURL(file);
  };

  const handlePublishNotice = async () => {
    if (!noticeTitle || !noticeContent) { setNoticeMessage('শিরোনাম এবং বিস্তারিত পূরণ করুন!'); return; }
    setIsPublishing(true);
    try {
      const url = editingNoticeId ? `/api/dashboard/notices/${editingNoticeId}` : '/api/dashboard/notices';
      const method = editingNoticeId ? 'PUT' : 'POST';
      const res = await fetch(url, {
        method, headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: noticeTitle, content: noticeContent, image: noticeImage || null, is_active: true })
      });
      if (res.ok) { 
        setNoticeMessage(editingNoticeId ? 'নোটিশ সফলভাবে আপডেট হয়েছে!' : 'নোটিশ সফলভাবে পাবলিশ হয়েছে!'); 
        setNoticeTitle(''); 
        setNoticeContent(''); 
        setNoticeImage('');
        setEditingNoticeId(null);
        fetchNotices();
        setTimeout(() => setNoticeMessage(''), 3000); 
      }
      else { setNoticeMessage('নোটিশ সেভ করতে সমস্যা হয়েছে।'); }
    } catch { setNoticeMessage('সার্ভারে কানেক্ট করা যাচ্ছে না।'); }
    finally { setIsPublishing(false); }
  };

  const handleEditNotice = (notice) => {
    setNoticeTitle(notice.title);
    setNoticeContent(notice.content);
    setNoticeImage(notice.image || '');
    setEditingNoticeId(notice.id);
  };

  const handleDeleteNotice = async (id) => {
    if (!window.confirm('আপনি কি নিশ্চিত যে এই নোটিশটি মুছতে চান?')) return;
    try {
      await fetch(`/api/dashboard/notices/${id}`, { method: 'DELETE' });
      fetchNotices();
    } catch (err) {
      console.error('Failed to delete notice', err);
    }
  };

  const TeacherManagementTab = () => {
    const [teachers, setTeachers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [showForm, setShowForm] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [form, setForm] = useState({ name: '', teacher_uid: '', password: '', image: '' });
    const [msg, setMsg] = useState({ text: '', type: 'success' });
    const [saving, setSaving] = useState(false);

    const fetchTeachers = useCallback(async () => {
      setLoading(true);
      try {
        const res = await fetch('/api/teachers/');
        if (res.ok) setTeachers(await res.json());
      } catch (err) { console.error(err); }
      finally { setLoading(false); }
    }, []);

    useEffect(() => { fetchTeachers(); }, [fetchTeachers]);

    const handleImageChange = (e) => {
      const file = e.target.files[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = (event) => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          let { width, height } = img;
          const MAX_SIZE = 300;
          if (width > height && width > MAX_SIZE) {
            height *= MAX_SIZE / width; width = MAX_SIZE;
          } else if (height > MAX_SIZE) {
            width *= MAX_SIZE / height; height = MAX_SIZE;
          }
          canvas.width = width; canvas.height = height;
          const ctx = canvas.getContext('2d');
          ctx.drawImage(img, 0, 0, width, height);
          setForm(prev => ({ ...prev, image: canvas.toDataURL('image/jpeg', 0.8) }));
        };
        img.src = event.target.result;
      };
      reader.readAsDataURL(file);
    };

    const handleEdit = (t) => {
      setForm({ name: t.name, teacher_uid: t.teacher_uid, password: '', image: t.image || '' });
      setEditingId(t.id);
      setShowForm(true);
    };

    const handleSave = async () => {
      if (!form.name || !form.teacher_uid || (!form.password && !editingId)) {
        setMsg({ text: 'সব ফিল্ড পূরণ করুন!', type: 'error' });
        return;
      }
      setSaving(true);
      try {
        const url = editingId ? `/api/teachers/${editingId}` : '/api/teachers/';
        const method = editingId ? 'PUT' : 'POST';
        const res = await fetch(url, {
          method: method,
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(form)
        });
        if (res.ok) {
          setMsg({ text: editingId ? 'শিক্ষকের তথ্য আপডেট হয়েছে!' : 'শিক্ষক সফলভাবে যোগ করা হয়েছে!', type: 'success' });
          setShowForm(false);
          setEditingId(null);
          setForm({ name: '', teacher_uid: '', password: '', image: '' });
          fetchTeachers();
        } else {
          const errData = await res.json().catch(()=>({}));
          setMsg({ text: errData.detail || 'শিক্ষক যোগ করতে সমস্যা হয়েছে।', type: 'error' });
        }
      } catch { setMsg({ text: 'সার্ভারে সংযোগ নেই।', type: 'error' }); }
      finally { setSaving(false); setTimeout(() => setMsg({ text: '', type: 'success' }), 4000); }
    };

    const handleDelete = async (id) => {
      if (!window.confirm('শিক্ষক মুছতে চান?')) return;
      await fetch(`/api/teachers/${id}`, { method: 'DELETE' });
      fetchTeachers();
    };

    return (
      <div>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-gray-900">শিক্ষক ম্যানেজমেন্ট</h2>
          <button onClick={() => { setShowForm(!showForm); setEditingId(null); setForm({ name: '', teacher_uid: '', password: '', image: '' }); }} className="bg-primary text-white px-5 py-2.5 rounded-xl font-semibold hover:bg-secondary">
            + নতুন শিক্ষক
          </button>
        </div>

        <Alert message={msg.text} type={msg.type} />

        {showForm && (
          <div className="bg-blue-50 border border-blue-100 rounded-2xl p-6 mb-6">
            <h3 className="font-bold text-lg mb-4 text-gray-800">{editingId ? 'শিক্ষকের তথ্য আপডেট করুন' : 'নতুন শিক্ষকের তথ্য'}</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">পুরো নাম *</label>
                <input type="text" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-primary outline-none" placeholder="নাম" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">টিচার আইডি (Teacher UID) *</label>
                <input type="text" value={form.teacher_uid} onChange={e => setForm({ ...form, teacher_uid: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-primary outline-none" placeholder="যেমন: RC-Name" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">{editingId ? 'নতুন পাসওয়ার্ড (ঐচ্ছিক)' : 'লগিন পাসওয়ার্ড *'}</label>
                <input type="text" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-primary outline-none" placeholder="পাসওয়ার্ড দিন" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">প্রোফাইল ছবি (ঐচ্ছিক)</label>
                <input type="file" accept="image/*" onChange={handleImageChange}
                  className="w-full border border-gray-300 rounded-lg p-1.5 focus:ring-2 focus:ring-primary outline-none bg-white text-sm" />
                {form.image && <img src={form.image} alt="Preview" className="mt-2 w-16 h-16 object-cover rounded-full border border-gray-200" />}
              </div>
            </div>
            <div className="flex gap-3 mt-5">
              <button onClick={handleSave} disabled={saving} className="bg-primary text-white px-6 py-2.5 rounded-xl font-semibold hover:bg-secondary">
                {saving ? 'সেভ হচ্ছে...' : (editingId ? 'আপডেট করুন' : 'যোগ করুন')}
              </button>
              <button onClick={() => { setShowForm(false); setEditingId(null); setForm({ name: '', teacher_uid: '', password: '', image: '' }); }} className="bg-white border border-gray-300 text-gray-700 px-6 py-2.5 rounded-xl font-semibold">
                বাতিল
              </button>
            </div>
          </div>
        )}

        <div className="overflow-x-auto rounded-xl border border-gray-100 shadow-sm">
          {loading ? (
             <div className="text-center py-12 text-gray-400">লোড হচ্ছে...</div>
          ) : teachers.length === 0 ? (
             <div className="text-center py-16 bg-gray-50 text-gray-500 font-medium border-dashed border-gray-300">কোনো শিক্ষক পাওয়া যায়নি।</div>
          ) : (
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 text-gray-600 text-sm border-b border-gray-100">
                  <th className="p-4 font-bold">টিচার আইডি</th>
                  <th className="p-4 font-bold">নাম</th>
                  <th className="p-4 font-bold">ছবি (URL)</th>
                  <th className="p-4 font-bold">অ্যাকশন</th>
                </tr>
              </thead>
              <tbody>
                {teachers.map(t => (
                  <tr key={t.id} className="border-b border-gray-50 hover:bg-blue-50/40">
                    <td className="p-4 font-bold text-primary">{t.teacher_uid}</td>
                    <td className="p-4 font-semibold text-gray-900">{t.name}</td>
                    <td className="p-4 text-sm text-gray-500 break-all">{t.image ? 'সেট করা আছে' : 'নেই'}</td>
                    <td className="p-4 flex gap-2">
                      <button onClick={() => handleEdit(t)} className="text-blue-500 hover:bg-blue-50 p-2 rounded-lg">
                        <EditIcon />
                      </button>
                      <button onClick={() => handleDelete(t.id)} className="text-red-500 hover:bg-red-50 p-2 rounded-lg">
                        <TrashIcon />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    );
  };


  const tabs = [
    { id: 'notices', label: 'নোটিশ বোর্ড' },
    { id: 'attendance', label: 'উপস্থিতি' },
    { id: 'teacher_att', label: 'টিচার হাজিরা' },
    { id: 'teachers', label: 'শিক্ষক ম্যানেজমেন্ট' },
    { id: 'routines', label: 'রুটিন আপডেট' },
    { id: 'fees', label: 'ফি ট্র্যাকার' },
    { id: 'students', label: 'শিক্ষার্থী ডেটাবেজ' },
    { id: 'exams', label: 'পরীক্ষা ম্যানেজমেন্ট' }
  ];

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
          <h1 className="text-xl font-bold text-gray-900">অ্যাডমিন ড্যাশবোর্ড</h1>
        </div>
      </div>

      <div className="flex container mx-auto px-0 md:px-4 max-w-[1400px]">
        
        {/* Sidebar */}
        <div className={`fixed inset-y-0 left-0 w-64 md:w-72 bg-white shadow-2xl z-50 transform transition-transform duration-300 ease-in-out ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} flex flex-col`}>
          <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-[#0f172a]">
            <div>
              <h2 className="text-xl font-bold text-white">অ্যাডমিন প্যানেল</h2>
              <p className="text-xs text-[#00b4d8] mt-1 font-medium">{staffRole === 'admin' ? 'Full Access' : 'Read Only'}</p>
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

        {/* Backdrop overlay */}
        {isSidebarOpen && (
          <div className="fixed inset-0 bg-black/40 z-40 backdrop-blur-sm" onClick={() => setIsSidebarOpen(false)}></div>
        )}

        {/* Main Content Area */}
        <div className="flex-1 w-full min-w-0 pb-12">
          <div className="hidden md:flex justify-between items-center mb-8 pt-8 px-8">
            <h1 className="text-3xl font-bold text-gray-900">অ্যাডমিন ড্যাশবোর্ড</h1>
            <div className="bg-primary/10 text-primary px-4 py-2 rounded-lg font-bold shadow-sm">
              {staffRole === 'admin' ? 'অ্যাডমিন প্যানেল' : 'টিচার প্যানেল'}
            </div>
          </div>

          <div className="p-4 md:p-8">
            {activeTab === 'notices' && (
              <div>
                {staffRole === 'admin' ? (
                  <>
                    <h2 className="text-xl font-bold mb-4">নতুন নোটিশ তৈরি করুন</h2>
                    <div className="space-y-4 max-w-2xl">
                      {noticeMessage && <Alert message={noticeMessage} type={noticeMessage.includes('সফল') ? 'success' : 'error'} />}
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1">শিরোনাম</label>
                        <input type="text" value={noticeTitle} onChange={e => setNoticeTitle(e.target.value)}
                          className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-primary outline-none" placeholder="নোটিশের শিরোনাম" />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1">বিস্তারিত</label>
                        <textarea rows="4" value={noticeContent} onChange={e => setNoticeContent(e.target.value)}
                          className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-primary outline-none" placeholder="নোটিশের বিস্তারিত লিখুন..."></textarea>
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1">ছবি (ঐচ্ছিক)</label>
                        <input type="file" accept="image/*" onChange={handleNoticeImageChange}
                          className="w-full border border-gray-300 rounded-lg p-1.5 focus:ring-2 focus:ring-primary outline-none bg-white text-sm" />
                        {noticeImage && <img src={noticeImage} alt="Preview" className="mt-3 max-h-48 rounded-lg border border-gray-200 object-contain" />}
                      </div>
                      <button onClick={handlePublishNotice} disabled={isPublishing}
                        className="bg-primary text-white px-6 py-2.5 rounded-xl font-semibold hover:bg-secondary transition-colors disabled:bg-gray-400">
                        {isPublishing ? 'সেভ হচ্ছে...' : (editingNoticeId ? 'আপডেট করুন' : 'পাবলিশ করুন')}
                      </button>
                      {editingNoticeId && (
                        <button onClick={() => { setEditingNoticeId(null); setNoticeTitle(''); setNoticeContent(''); setNoticeImage(''); }}
                          className="ml-4 bg-gray-500 text-white px-6 py-2.5 rounded-xl font-semibold hover:bg-gray-600 transition-colors">
                          বাতিল
                        </button>
                      )}
                    </div>
                    
                    <div className="mt-12">
                      <h2 className="text-xl font-bold mb-4">সকল নোটিশ</h2>
                      {loadingNotices ? (
                        <div className="text-center py-8 text-gray-500 animate-pulse">লোড হচ্ছে...</div>
                      ) : notices.length > 0 ? (
                        <div className="space-y-4">
                          {notices.map(notice => (
                            <div key={notice.id} className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm">
                              <div className="flex justify-between items-start mb-2">
                                <h3 className="font-bold text-lg text-gray-900">{notice.title}</h3>
                                <div className="flex gap-2">
                                  <button onClick={() => handleEditNotice(notice)} className="text-blue-500 hover:bg-blue-50 px-2 py-1 rounded font-semibold text-sm transition-colors">
                                    এডিট
                                  </button>
                                  <button onClick={() => handleDeleteNotice(notice.id)} className="text-red-500 hover:bg-red-50 px-2 py-1 rounded font-semibold text-sm transition-colors">
                                    মুছুন
                                  </button>
                                </div>
                              </div>
                              <p className="text-gray-600 whitespace-pre-wrap text-sm mb-3">{notice.content}</p>
                              {notice.image && (
                                <img src={notice.image} alt="Notice Image" className="mb-3 max-h-64 rounded-lg border border-gray-200 object-contain" />
                              )}
                              <p className="text-xs text-gray-400">
                                প্রকাশিত: {new Date(notice.created_at).toLocaleDateString('bn-BD')}
                              </p>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="text-center py-8 bg-gray-50 rounded-xl border border-dashed border-gray-300 text-gray-500">
                          কোনো নোটিশ পাওয়া যায়নি।
                        </div>
                      )}
                    </div>
                  </>
                ) : (
                  <div className="text-center py-16 text-gray-500 bg-gray-50 rounded-2xl border border-gray-200 border-dashed">
                    <h2 className="text-xl font-bold mb-2">নোটিশ বোর্ড</h2>
                    <p>নোটিশ তৈরি বা পরিবর্তন করার জন্য অ্যাডমিন পারমিশন প্রয়োজন।</p>
                  </div>
                )}
              </div>
            )}
            {activeTab === 'routines' && <RoutineTab role={staffRole} />}
            {activeTab === 'attendance' && <AttendanceTab role={staffRole} />}
            {activeTab === 'teacher_att' && <TeacherAttendanceTab records={teacherAttendanceRecords} fetchRecords={fetchTeacherAttendance} />}
            {activeTab === 'teachers' && <TeacherManagementTab />}
            {activeTab === 'fees' && <FeeTrackerTab role={staffRole} />}
            {activeTab === 'students' && <StudentDatabaseTab role={staffRole} />}
            {activeTab === 'exams' && <ExamManagementTab role={staffRole} />}
          </div>
          </div>
        </div>
      </div>
  );
};

export default AdminDashboard;
