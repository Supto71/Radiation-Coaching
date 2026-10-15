import React, { useState } from 'react';
import { 
  FaUniversity, 
  FaSearch, 
  FaChalkboardTeacher,
  FaAward
} from 'react-icons/fa';

const Faculty = () => {
  const [searchQuery, setSearchQuery] = useState('');

  const founder = {
    id: 1,
    name: 'রাকিব হাসান ফাহাদ',
    role: 'পরিচালক',
    institute: 'রেডিয়েশন কোচিং সেন্টার',
    image: '/fahad-sir.png',
    message: 'শিক্ষার্থীদের স্বপ্নপূরণে সঠিক পরিকল্পনা ও নিয়মানুবর্তিতাই আমাদের মূল শক্তি।'
  };

  const facultyMembers = [
    {
      id: 13,
      name: 'মো: ফাহিম আহমেদ',
      university: 'সরকারি শহীদ সোহরাওয়ার্দী কলেজ, অধিভুক্ত ঢাকা বিশ্ববিদ্যালয়',
      subject: 'বিবিএ, এমবিএ (ফার্স্টক্লাস) হিসাববিজ্ঞান',
      year: '-',
      teaching: 'ইংরেজি',
      image: '/fahim.png'
    },
    {
      id: 10,
      name: 'নায়মুন নাফি সুপ্ত',
      university: 'University of Information Technology and Science (UITS)',
      subject: 'Department of C.S.E',
      year: 'প্রথম বর্ষ',
      teaching: 'বিজ্ঞান, গণিত, তথ্য ও যোগাযোগ প্রযুক্তি',
      image: '/supto.png'
    },
    {
      id: 11,
      name: 'উম্মে হাবিবা রিয়া',
      university: 'ঢাকা মহানগর মহিলা কলেজ',
      subject: 'M.Sc in Zoology',
      year: '-',
      teaching: 'গণিত, পদার্থ বিজ্ঞান, রসায়ন, জীববিজ্ঞান, উচ্চতর গণিত',
      image: '/ria.png'
    },
    {
      id: 14,
      name: 'মোঃ সাজ্জাদ হোসেন',
      university: 'Asian University of Bangladesh (AUB)',
      subject: 'BA Honours, MA English (AUB) | B.Ed (জগন্নাথ বিশ্ববিদ্যালয়)',
      year: '-',
      teaching: 'ইংরেজি',
      image: '/sajjad.jpg'
    },
    {
      id: 2,
      name: 'রেহানা আক্তার তৃষা',
      university: 'ঢাকা সিটি কলেজ (জাতীয় বিশ্ববিদ্যালয়)',
      subject: 'B.B.A (Department of Accounting)',
      year: 'প্রথম বর্ষ (চূড়ান্ত পরীক্ষার্থী)',
      teaching: 'ইংরেজি, বাণিজ্য বিভাগের সকল বিষয় এবং বাংলা',
      image: '/Tr.png'
    },
    {
      id: 4,
      name: 'উম্মে হানি লুনা',
      university: 'নারায়ণগঞ্জ সরকারি তোলারাম কলেজ',
      subject: 'B.A',
      year: 'দ্বিতীয় বর্ষ',
      teaching: 'বাংলা, বাংলাদেশ ও বিশ্বপরিচয়, ইসলাম শিক্ষা, ফিন্যান্স, ব্যবসায় উদ্যোগ',
      image: '/Luna.png'
    },
    {
      id: 5,
      name: 'ফাহমিদা আক্তার পান্না',
      university: 'জাতীয় বিশ্ববিদ্যালয়',
      subject: 'B.Sc (Department of Geography and Environment)',
      year: '৩য় বর্ষ',
      teaching: 'বাংলাদেশ ও বিশ্বপরিচয়',
      image: '/panna.png'
    },
    {
      id: 6,
      name: 'মিম ইসলাম',
      university: 'সরকারি শহীদ সোহরাওয়ার্দী কলেজ',
      subject: 'Department of Management',
      year: 'দ্বিতীয় বর্ষ',
      teaching: 'হিসাববিজ্ঞান, অর্থনীতি',
      image: '/Mim.png'
    },
    {
      id: 7,
      name: 'আইরিন চৌধুরী স্মৃতি',
      university: 'ইডেন মহিলা কলেজ',
      subject: 'BBA (Hons) Department of Management',
      year: '৩য় বর্ষ',
      teaching: 'ফিন্যান্স এবং ইংরেজি',
      image: '/Irinn.png'
    },
    {
      id: 9,
      name: 'লামিয়া',
      university: "Central Women's College",
      subject: 'Department of English',
      year: '৩য় বর্ষ',
      teaching: 'বাংলা, বাংলাদেশ ও বিশ্বপরিচয়, ইংরেজি, বিজ্ঞান',
      image: '/lamia.png'
    },
    {
      id: 16,
      name: 'হাফেজ মাওলানা আমির মোহাম্মদ ওসমান গনি',
      university: 'ইসলামিক স্টাডিজ অনুষদ',
      subject: 'দাওরায়ে হাদিস (মাস্টার্স), বিএ (অনার্স) আলকুরআন এন্ড ইসলামিক স্টাডিজ',
      year: '-',
      teaching: 'ইসলাম ও নৈতিক শিক্ষা',
      image: '/Osman_Goni.png'
    },
    {
      id: 29,
      name: 'মেহেরুন নেছা নিলিমা',
      university: 'সিদ্ধেশ্বরী কলেজ (জাতীয় বিশ্ববিদ্যালয়)',
      subject: 'B.B.A (Department of Marketing)',
      year: '৩য় বর্ষ',
      teaching: 'ব্যবসায়ী শাখার সকল বিষয় ও অন্যান্য সাধারণ বিষয়',
      image: '/Nilima.png'
    },
    {
      id: 26,
      name: 'শামীম মাহমুদ অন্তু',
      university: 'জাতীয় বিশ্ববিদ্যালয়',
      subject: 'বিএ (অনার্স) ইংরেজি',
      year: '-',
      teaching: 'উচ্চতর গণিত ও ইংরেজি',
      image: '/Shamim.png'
    },
    {
      id: 8,
      name: 'আয়শা আক্তার প্রিয়াঙ্কা',
      university: 'ইডেন মহিলা কলেজ',
      subject: 'Hons, Masters (Department of Bangla)',
      year: '-',
      teaching: 'বাংলা, পৌরনীতি, সমাজকর্ম, ইতিহাস, ভূগোল',
      image: 'https://ui-avatars.com/api/?name=Ayesha+Priyanka&background=0284C7&color=fff&size=200'
    },
    {
      id: 20,
      name: 'আরাফাত সাগর',
      university: 'ঢাকা বিশ্ববিদ্যালয় (ঢাবি)',
      subject: 'বিএ (অনার্স), এমএ ইংরেজি বিভাগ',
      year: '-',
      teaching: 'ইংরেজি ব্যাকরণ ও সাহিত্য',
      image: 'https://ui-avatars.com/api/?name=Arafat+Sagor&background=0EA5E9&color=fff&size=200'
    },
    {
      id: 21,
      name: 'ওমর ফারুক ফারহান',
      university: 'বাংলাদেশ টেক্সটাইল বিশ্ববিদ্যালয় (বুটেক্স)',
      subject: 'বিএসসি (টেক্সটাইল ইঞ্জিনিয়ারিং)',
      year: '-',
      teaching: 'পদার্থবিজ্ঞান ও সাধারণ গণিত',
      image: 'https://ui-avatars.com/api/?name=Omar+Faruk&background=10B981&color=fff&size=200'
    }
  ];

  const filteredTeachers = facultyMembers.filter(t => 
    t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    t.teaching.toLowerCase().includes(searchQuery.toLowerCase()) ||
    t.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
    t.university.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="relative min-h-screen bg-[#f8fafc] text-slate-800 py-16 sm:py-24 overflow-hidden">
      
      {/* Soft Ambient Background Lights */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-gradient-to-tr from-sky-200/50 to-cyan-200/40 rounded-full blur-[140px] pointer-events-none" />

      <div className="container mx-auto px-4 sm:px-6 max-w-7xl relative z-10">

        {/* Header Section */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white border border-sky-200 text-sky-700 text-xs sm:text-sm font-semibold shadow-xs">
            <FaChalkboardTeacher />
            <span>আমাদের শিক্ষক প্যানেল</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight">
            অভিজ্ঞ ও নিবেদিতপ্রাণ{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-600 via-cyan-600 to-teal-600">
              শিক্ষকমণ্ডলী
            </span>
          </h1>
          <p className="text-slate-600 text-base sm:text-lg leading-relaxed">
            দেশের শীর্ষ বিশ্ববিদ্যালয় ও কলেজ থেকে আগত বিষয়ভিত্তিক বিশেষজ্ঞ শিক্ষকরা প্রস্তুত আপনার সন্তানের সর্বোচ্চ ফলাফল নিশ্চিত করতে।
          </p>

          {/* Teacher Search Input */}
          <div className="pt-4 max-w-md mx-auto">
            <div className="relative">
              <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-sm" />
              <input
                type="text"
                placeholder="শিক্ষক বা বিষয়ের নাম দিয়ে খুঁজুন..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-11 pr-4 py-3 rounded-2xl bg-white border border-slate-200 focus:border-sky-500 focus:ring-2 focus:ring-sky-100 text-slate-800 text-sm placeholder-slate-400 shadow-sm outline-none transition-all"
              />
            </div>
          </div>
        </div>

        {/* FOUNDER / DIRECTOR SPOTLIGHT */}
        <div className="max-w-2xl mx-auto mb-20">
          <div className="relative rounded-[2.5rem] p-8 sm:p-10 bg-white border border-sky-200 shadow-[0_20px_50px_rgba(2,132,199,0.12)] text-center overflow-hidden">
            <div className="absolute top-0 right-0 w-48 h-48 bg-sky-100/60 rounded-full blur-2xl pointer-events-none" />

            <div className="relative mb-6 inline-block">
              <div className="w-36 h-36 sm:w-44 sm:h-44 rounded-full p-1.5 bg-gradient-to-tr from-sky-600 via-cyan-500 to-teal-400 shadow-xl mx-auto">
                <img
                  src={founder.image}
                  alt={founder.name}
                  className="w-full h-full object-cover rounded-full bg-slate-100"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = "/logo.png";
                  }}
                />
              </div>
              <div className="absolute bottom-1 right-2 w-9 h-9 rounded-full bg-amber-400 text-slate-900 flex items-center justify-center font-bold text-sm shadow-md">
                <FaAward />
              </div>
            </div>

            <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mb-1">{founder.name}</h3>
            <p className="text-sky-600 font-bold text-base mb-1">{founder.role}</p>
            <p className="text-slate-500 text-xs sm:text-sm mb-4 font-medium">{founder.institute}</p>

            <blockquote className="italic text-xs sm:text-sm text-slate-600 max-w-lg mx-auto bg-slate-50 p-4 rounded-2xl border border-slate-200">
              "{founder.message}"
            </blockquote>
          </div>
        </div>

        {/* FACULTY MEMBERS GRID */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredTeachers.map((teacher) => (
            <div
              key={teacher.id}
              className="rounded-3xl p-6 bg-white border border-slate-200/90 hover:border-sky-400 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1.5 flex flex-col justify-between group"
            >
              <div className="space-y-4">
                
                {/* Teacher Avatar */}
                <div className="relative w-28 h-28 mx-auto rounded-2xl p-1 bg-gradient-to-tr from-sky-500 to-cyan-400 shadow-sm">
                  <img
                    src={teacher.image}
                    alt={teacher.name}
                    className="w-full h-full object-cover rounded-xl bg-slate-50"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(teacher.name)}&background=0284C7&color=fff&size=200`;
                    }}
                  />
                </div>

                {/* Name & Academic info */}
                <div className="text-center space-y-1">
                  <h4 className="text-lg font-bold text-slate-900 group-hover:text-sky-600 transition-colors">
                    {teacher.name}
                  </h4>
                  <p className="text-xs text-sky-600 font-medium flex items-center justify-center gap-1.5">
                    <FaUniversity className="text-[11px] shrink-0" />
                    <span className="truncate max-w-[200px]" title={teacher.university}>
                      {teacher.university !== '-' ? teacher.university : 'রেডিয়েশন ফ্যাকাল্টি'}
                    </span>
                  </p>
                  <p className="text-[11px] text-slate-500 line-clamp-2 leading-relaxed" title={teacher.subject}>
                    {teacher.subject}
                  </p>
                </div>

              </div>

              {/* Teaching Subject Box */}
              <div className="pt-4 mt-4 border-t border-slate-100">
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/60 text-center">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-0.5">
                    পাঠদানের বিষয়
                  </span>
                  <p className="text-xs font-semibold text-slate-700">
                    {teacher.teaching}
                  </p>
                </div>
              </div>

            </div>
          ))}
        </div>

        {filteredTeachers.length === 0 && (
          <div className="text-center py-16 text-slate-500 space-y-2">
            <p className="text-lg font-semibold">কোনো শিক্ষক পাওয়া যায়নি</p>
            <p className="text-xs">অনুগ্রহ করে ভিন্ন কোনো নাম বা বিষয়ের নাম দিয়ে অনুসন্ধান করুন।</p>
          </div>
        )}

      </div>
    </div>
  );
};

export default Faculty;
