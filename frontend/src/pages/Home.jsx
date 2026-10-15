import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  FaGraduationCap, 
  FaLaptopCode, 
  FaBookOpen, 
  FaChalkboardTeacher, 
  FaCheckCircle, 
  FaArrowRight, 
  FaPhoneAlt, 
  FaMapMarkerAlt, 
  FaTrophy, 
  FaUsers, 
  FaChevronDown,
  FaStar,
  FaShieldAlt,
  FaMobileAlt
} from 'react-icons/fa';

const Home = () => {
  const [activeFaq, setActiveFaq] = useState(null);

  const stats = [
    { id: 1, number: '৫০০+', label: 'সফল শিক্ষার্থী', icon: FaUsers, color: 'from-sky-500 to-cyan-400' },
    { id: 2, number: '২০+', label: 'অভিজ্ঞ শিক্ষক', icon: FaChalkboardTeacher, color: 'from-cyan-500 to-teal-400' },
    { id: 3, number: '৯৮%', label: 'বোর্ড পাসের হার', icon: FaTrophy, color: 'from-amber-400 to-orange-500' },
    { id: 4, number: '১০+ বছর', label: 'সুনামের সাথে পরিচালিত', icon: FaShieldAlt, color: 'from-indigo-500 to-sky-400' },
  ];

  const bentoFeatures = [
    {
      id: 1,
      title: "স্মার্ট এক্সাম ও অটো রেজাল্ট সিস্টেম",
      subtitle: "অত্যাধুনিক প্রযুক্তি",
      desc: "মোবাইল বা কম্পিউটারে রিয়েল-টাইম টাইমার সহ নির্ভুল অনলাইন পরীক্ষা। পরীক্ষা শেষ হওয়ামাত্র স্বয়ংক্রিয় রেজাল্ট ও বিস্তারিত বিশ্লেষণ।",
      badge: "ফিচার ১",
      gradient: "from-sky-50/80 via-white to-white",
      borderColor: "border-sky-200",
      icon: FaLaptopCode,
      colSpan: "lg:col-span-2"
    },
    {
      id: 2,
      title: "স্পেশাল হ্যান্ডনোট ও লেকচার শিট",
      subtitle: "সহজ পাঠদান",
      desc: "বোর্ড স্ট্যান্ডার্ড অনুযায়ী প্রতিটি অধ্যায়ের সহজবোধ্য হ্যান্ডনোট ও সাজেস্টিভ প্রশ্নব্যাংক যা পরীক্ষার ভীতি দূর করে।",
      badge: "ফিচার ২",
      gradient: "from-cyan-50/80 via-white to-white",
      borderColor: "border-cyan-200",
      icon: FaBookOpen,
      colSpan: "lg:col-span-1"
    },
    {
      id: 3,
      title: "সেরা বিশ্ববিদ্যালয়ের বিশেষজ্ঞ শিক্ষক",
      subtitle: "সঠিক গাইডলাইন",
      desc: "দেশের স্বনামধন্য বিশ্ববিদ্যালয় থেকে উত্তীর্ণ অভিজ্ঞ শিক্ষকদের সরাসরি তত্ত্বাবধানে বিষয়ভিত্তিক বিশেষ ক্লাস।",
      badge: "ফিচার ৩",
      gradient: "from-indigo-50/80 via-white to-white",
      borderColor: "border-indigo-200",
      icon: FaChalkboardTeacher,
      colSpan: "lg:col-span-1"
    },
    {
      id: 4,
      title: "ডিজিটাল উপস্থিতি ও SMS নোটিফিকেশন",
      subtitle: "অভিভাবক সচেতনতা",
      desc: "প্রতিটি ক্লাসের হাজিরা ও পরীক্ষার মার্কস সরাসরি অভিভাবকের মোবাইল নম্বরে তাৎক্ষণিক SMS-এর মাধ্যমে প্রেরিত হয়।",
      badge: "ফিচার ৪",
      gradient: "from-emerald-50/80 via-white to-white",
      borderColor: "border-emerald-200",
      icon: FaMobileAlt,
      colSpan: "lg:col-span-2"
    }
  ];

  const featuredCourses = [
    {
      id: 1,
      title: "প্রাইমারি ও জুনিয়র ব্যাচ",
      classes: "১ম থেকে ৮ম শ্রেণি",
      desc: "মৌলিক বিষয়গুলো সহজভাবে আয়ত্ত করার জন্য আন্তরিক পাঠদান ও নিয়মিত মূল্যায়ন পরীক্ষা।",
      fee: "২০০০ ৳ / মাস",
      tags: ["বেসিক ডেভেলপমেন্ট", "সাপ্তাহিক মডেল টেস্ট", "বিশেষ কেয়ার"]
    },
    {
      id: 2,
      title: "এসএসসি (SSC) স্পেশাল প্রোগ্রাম",
      classes: "৯ম ও ১০ম শ্রেণি (বিজ্ঞান ও বাণিজ্য)",
      desc: "বোর্ড পরীক্ষার পূর্ণাঙ্গ প্রস্তুতি, টেস্ট পেপার সলভ এবং গোল্ডেন A+ নিশ্চিতকরণের বিশেষ স্ট্র্যাটেজি।",
      fee: "২৫০০ ৳ / মাস",
      tags: ["টেস্ট পেপার সমাধান", "সৃজনশীল প্র্যাকটিস", "সাজেশন শিট"],
      popular: true
    },
    {
      id: 3,
      title: "এইচএসসি (HSC) একাডেমিক কেয়ার",
      classes: "একাদশ ও দ্বাদশ শ্রেণি",
      desc: "উচ্চমাধ্যমিক বোর্ড সিলেবাস কভারের পাশাপাশি বিশ্ববিদ্যালয় ভর্তি পরীক্ষার দৃঢ় ভিত্তি গড়ে তোলা।",
      fee: "৩০০০ ৳ / মাস",
      tags: ["অধ্যায়ভিত্তিক পরীক্ষা", "এডমিশন গাইডলাইন", "শর্টকাট মেথড"]
    }
  ];

  const featuredTeachers = [
    { name: "শামীম স্যার", subject: "গণিত ও উচ্চতর গণিত", image: "/Shamim.png" },
    { name: "লুনা ম্যাম", subject: "ইংরেজি ও সাহিত্য", image: "/Luna.png" },
    { name: "আইরিন ম্যাম", subject: "পদার্থ ও রসায়ন বিজ্ঞান", image: "/Irinn.png" },
    { name: "ওসমান গনি স্যার", subject: "সাধারণ বিজ্ঞান ও তথ্যপ্রযুক্তি", image: "/Osman_Goni.png" },
  ];

  const faqs = [
    {
      q: "রেডিয়েশন কোচিংয়ে ভর্তির প্রক্রিয়া কী?",
      a: "আমাদের যেকোনো শাখায় সরাসরি এসে নির্ধারিত ফর্ম পূরণ করে অথবা আমাদের হটলাইনে (01676924816) যোগাযোগ করে সহজেই ভর্তি হওয়া যায়।"
    },
    {
      q: "অনলাইন পরীক্ষা পদ্ধতি কীভাবে কাজ করে?",
      a: "শিক্ষার্থী তার নিজস্ব আইডি ও পাসওয়ার্ড দিয়ে আমাদের ওয়েবসাইট বা PWA অ্যাপে লগইন করে 'অনলাইন এক্সাম' সেকশন থেকে যেকোনো সময় শিডিউলড পরীক্ষায় অংশ নিতে পারবে।"
    },
    {
      q: "দুর্বল শিক্ষার্থীদের জন্য কি আলাদা কোনো যত্ন নেওয়া হয়?",
      a: "হ্যাঁ, প্রতি সপ্তাহে দুর্বল শিক্ষার্থীদের চিহ্নিত করে অতিরিক্ত প্রবলেম সলভিং ক্লাস ও ব্যক্তিগত কাউন্সিলিং প্রদান করা হয়।"
    },
    {
      q: "মোবাইল অ্যাপটি ব্যবহার করতে কি কোনো ফি দিতে হবে?",
      a: "না, আমাদের প্রগ্রেসিভ ওয়েব অ্যাপ (PWA) ১০০% বিনামূল্যে যেকোনো স্মার্টফোনে ইনস্টল করে ব্যবহার করা যায়।"
    }
  ];

  return (
    <div className="relative min-h-screen bg-[#f8fafc] text-slate-800 overflow-hidden">
      
      {/* Soft Ambient Background Glows */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[450px] bg-gradient-to-tr from-sky-200/50 to-cyan-200/40 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute top-96 -left-32 w-80 h-80 bg-blue-100/60 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-96 -right-32 w-80 h-80 bg-cyan-100/60 rounded-full blur-[100px] pointer-events-none" />

      {/* HERO SECTION */}
      <section className="relative pt-10 md:pt-16 pb-16 md:pb-24">
        <div className="container mx-auto px-4 sm:px-6 max-w-7xl relative z-10">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-12 lg:gap-16">
            
            {/* Left Content */}
            <div className="w-full lg:w-7/12 text-center lg:text-left space-y-6">
              
              {/* Top Announcement Pill */}
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white border border-sky-200 text-sky-700 text-xs sm:text-sm font-semibold shadow-xs">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                <span>২০২৬ শিক্ষাবর্ষে নতুন ব্যাচে ভর্তি চলছে</span>
                <span className="text-slate-300">|</span>
                <span className="text-amber-600 font-bold">আসন সীমিত</span>
              </div>

              {/* Main Headline */}
              <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 leading-[1.2] tracking-tight">
                আপনার সন্তানের মেধা ও সাফল্যের{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-600 via-cyan-600 to-teal-600">
                  বিশ্বস্ত ঠিকানা
                </span>
              </h1>

              {/* Description */}
              <p className="text-slate-600 text-base sm:text-lg leading-relaxed max-w-2xl mx-auto lg:mx-0 font-normal">
                প্রতিষ্ঠালগ্ন (<span className="text-sky-700 font-bold">২০১৬</span>) থেকে সরকারি বৃত্তি, গোল্ডেন A+ সহ শতভাগ পাসের নিশ্চয়তা। আধুনিক স্মার্ট এক্সাম, সার্বক্ষণিক মেন্টরিং ও অভিজ্ঞ শিক্ষকদের তত্ত্বাবধানে গড়ে উঠুক সাফল্যের ভিত্তি।
              </p>

              {/* CTA Buttons */}
              <div className="pt-2 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
                <Link
                  to="/courses"
                  className="w-full sm:w-auto flex items-center justify-center gap-2.5 px-8 py-3.5 rounded-2xl bg-gradient-to-r from-sky-600 to-cyan-500 hover:from-sky-500 hover:to-cyan-400 text-white font-bold text-base shadow-lg shadow-sky-500/25 hover:shadow-sky-500/40 hover:-translate-y-0.5 active:scale-95 transition-all"
                >
                  <FaBookOpen />
                  <span>কোর্সসমূহ দেখুন</span>
                  <FaArrowRight className="text-xs" />
                </Link>

                <Link
                  to="/login"
                  className="w-full sm:w-auto flex items-center justify-center gap-2 px-7 py-3.5 rounded-2xl bg-white hover:bg-slate-50 text-slate-700 hover:text-slate-900 font-bold text-base border border-slate-200 shadow-sm hover:border-sky-300 hover:-translate-y-0.5 active:scale-95 transition-all"
                >
                  <FaGraduationCap className="text-sky-600 text-lg" />
                  <span>লগইন পোর্টাল</span>
                </Link>
              </div>

              {/* Social Proof Metric */}
              <div className="pt-3 flex items-center justify-center lg:justify-start gap-6 text-xs text-slate-500 font-medium">
                <div className="flex items-center gap-1.5">
                  <FaCheckCircle className="text-emerald-500 text-sm" />
                  <span>শতভাগ ফলাফল নিশ্চয়তা</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <FaStar className="text-amber-500 text-sm" />
                  <span>অভিভাবক দ্বারা পরীক্ষিত</span>
                </div>
              </div>

            </div>

            {/* Right Visual Image Card */}
            <div className="w-full lg:w-5/12 flex justify-center relative">
              <div className="relative w-full max-w-[460px]">
                
                {/* Soft backdrop glow */}
                <div className="absolute inset-0 bg-gradient-to-tr from-sky-200/50 to-cyan-200/40 rounded-[2.5rem] blur-2xl -z-10" />

                {/* Main Image Container */}
                <div className="relative rounded-[2.5rem] overflow-hidden border border-slate-200/80 bg-white p-2 shadow-[0_20px_50px_rgba(0,0,0,0.06)] group">
                  <img
                    src="/hero-image-v2.jpg"
                    alt="Radiation Coaching Classroom"
                    className="w-full h-auto object-cover rounded-[2rem] group-hover:scale-102 transition-transform duration-700"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = "/logo.png";
                      e.target.className = "w-48 mx-auto p-12 opacity-80";
                    }}
                  />
                </div>

                {/* Floating Glass Badge 1: Top Left */}
                <div className="absolute -top-5 -left-4 sm:-left-6 p-3 sm:p-3.5 rounded-2xl bg-white/95 backdrop-blur-xl border border-amber-200 shadow-xl flex items-center gap-3 animate-float">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-400 to-yellow-300 flex items-center justify-center text-slate-900 font-bold shadow-xs">
                    <FaTrophy className="text-lg" />
                  </div>
                  <div>
                    <span className="text-[11px] text-slate-500 block font-medium">রেকর্ড সাফল্য</span>
                    <span className="text-xs sm:text-sm font-bold text-slate-900 block">গোল্ডেন A+ অর্জন</span>
                  </div>
                </div>

                {/* Floating Glass Badge 2: Bottom Right */}
                <div className="absolute -bottom-5 -right-3 sm:-right-6 p-3 sm:p-3.5 rounded-2xl bg-white/95 backdrop-blur-xl border border-sky-200 shadow-xl flex items-center gap-3 animate-float" style={{ animationDelay: '2s' }}>
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-sky-600 to-cyan-500 flex items-center justify-center text-white font-bold shadow-xs">
                    <FaLaptopCode className="text-lg" />
                  </div>
                  <div>
                    <span className="text-[11px] text-sky-600 block font-semibold">অত্যাধুনিক</span>
                    <span className="text-xs sm:text-sm font-bold text-slate-900 block">লাইভ এক্সাম পোর্টাল</span>
                  </div>
                </div>

              </div>
            </div>

          </div>
        </div>
      </section>

      {/* STATS COUNTER STRIP */}
      <section className="relative py-8 border-y border-slate-200 bg-white shadow-xs">
        <div className="container mx-auto px-4 sm:px-6 max-w-7xl">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
            {stats.map((item) => {
              const Icon = item.icon;
              return (
                <div 
                  key={item.id} 
                  className="p-5 rounded-2xl bg-slate-50/70 border border-slate-200/80 hover:border-sky-300 transition-all flex items-center gap-4"
                >
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-tr ${item.color} flex items-center justify-center text-white text-xl font-bold shrink-0 shadow-md`}>
                    <Icon />
                  </div>
                  <div>
                    <span className="text-2xl sm:text-3xl font-extrabold text-slate-900 block font-sans tracking-tight">
                      {item.number}
                    </span>
                    <span className="text-xs sm:text-sm text-slate-600 font-semibold">
                      {item.label}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* BENTO GRID: WHY WE ARE THE BEST */}
      <section className="py-20 md:py-28 relative">
        <div className="container mx-auto px-4 sm:px-6 max-w-7xl relative z-10">
          
          {/* Section Header */}
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
            <span className="text-xs sm:text-sm font-bold tracking-widest uppercase text-sky-700 bg-sky-50 px-3.5 py-1.5 rounded-full border border-sky-200">
              আমাদের বিশেষত্ব
            </span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight">
              কেন শিক্ষার্থী ও অভিভাবকদের{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-600 to-cyan-500">
                প্রথম পছন্দ?
              </span>
            </h2>
            <p className="text-slate-600 text-sm sm:text-base">
              ঐতিহ্যগত পড়াশোনার চেয়ে ভিন্নধর্মী আধুনিক শিক্ষা প্রযুক্তির সমন্বয়ে আমাদের প্রস্তুতি কর্মসূচি
            </p>
          </div>

          {/* Bento Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {bentoFeatures.map((feature) => {
              const Icon = feature.icon;
              return (
                <div
                  key={feature.id}
                  className={`${feature.colSpan} relative rounded-3xl p-7 sm:p-8 bg-gradient-to-br ${feature.gradient} border ${feature.borderColor} hover:border-sky-400 transition-all duration-300 group hover:-translate-y-1 shadow-sm hover:shadow-xl overflow-hidden flex flex-col justify-between`}
                >
                  <div className="space-y-4 relative z-10">
                    <div className="flex items-center justify-between">
                      <div className="w-12 h-12 rounded-2xl bg-white border border-slate-200 text-sky-600 flex items-center justify-center text-xl group-hover:scale-110 group-hover:bg-gradient-to-r group-hover:from-sky-600 group-hover:to-cyan-500 group-hover:text-white transition-all shadow-xs">
                        <Icon />
                      </div>
                      <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-slate-100 text-slate-600 border border-slate-200">
                        {feature.badge}
                      </span>
                    </div>

                    <div>
                      <span className="text-xs font-bold text-sky-600 uppercase tracking-wider block mb-1">
                        {feature.subtitle}
                      </span>
                      <h3 className="text-xl sm:text-2xl font-bold text-slate-900 group-hover:text-sky-600 transition-colors">
                        {feature.title}
                      </h3>
                    </div>

                    <p className="text-slate-600 text-sm leading-relaxed">
                      {feature.desc}
                    </p>
                  </div>

                  <div className="pt-6 mt-4 border-t border-slate-100 flex items-center text-sky-600 text-xs font-bold gap-2">
                    <span>বিস্তারিত জানুন</span>
                    <FaArrowRight className="text-[10px] group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              );
            })}
          </div>

        </div>
      </section>

      {/* FEATURED COURSES PREVIEW */}
      <section className="py-16 md:py-24 bg-white border-t border-slate-200 relative">
        <div className="container mx-auto px-4 sm:px-6 max-w-7xl relative z-10">
          
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-14 gap-6">
            <div>
              <span className="text-xs sm:text-sm font-bold tracking-widest uppercase text-sky-700 bg-sky-50 px-3.5 py-1.5 rounded-full border border-sky-200">
                আমাদের কোর্সসমূহ
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 mt-3">
                আপনার লক্ষ্য অনুযায়ী ব্যাচ বেছে নিন
              </h2>
            </div>
            <Link
              to="/courses"
              className="inline-flex items-center gap-2 text-sky-600 hover:text-sky-700 font-bold text-sm group"
            >
              <span>সকল কোর্স ও ফি বিস্তারিত</span>
              <FaArrowRight className="text-xs group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
            {featuredCourses.map((c) => (
              <div
                key={c.id}
                className={`relative rounded-3xl p-7 bg-white border ${
                  c.popular ? 'border-sky-400 shadow-[0_15px_35px_rgba(2,132,199,0.12)] ring-1 ring-sky-300' : 'border-slate-200 hover:border-slate-300 shadow-sm'
                } transition-all hover:-translate-y-1.5 flex flex-col justify-between`}
              >
                {c.popular && (
                  <span className="absolute -top-3.5 right-6 px-3 py-1 rounded-full bg-gradient-to-r from-sky-600 to-cyan-500 text-white text-xs font-extrabold shadow-sm">
                    সবচেয়ে জনপ্রিয়
                  </span>
                )}

                <div className="space-y-4">
                  <div className="text-xs font-semibold px-2.5 py-1 rounded-md bg-sky-50 text-sky-700 w-fit border border-sky-100">
                    {c.classes}
                  </div>
                  <h3 className="text-xl font-bold text-slate-900">{c.title}</h3>
                  <p className="text-slate-600 text-sm leading-relaxed">{c.desc}</p>
                  
                  <div className="pt-2 space-y-2">
                    {c.tags.map((tag, idx) => (
                      <div key={idx} className="flex items-center gap-2 text-xs text-slate-600 font-medium">
                        <FaCheckCircle className="text-emerald-500 text-xs shrink-0" />
                        <span>{tag}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-6 mt-6 border-t border-slate-100 flex items-center justify-between">
                  <div>
                    <span className="text-[11px] text-slate-500 block font-medium">মাসিক ফি</span>
                    <span className="text-lg font-extrabold text-slate-900 font-sans">{c.fee}</span>
                  </div>
                  <Link
                    to="/courses"
                    className="px-4 py-2 rounded-xl bg-sky-50 hover:bg-sky-600 hover:text-white text-sky-700 border border-sky-200 text-xs font-bold transition-all"
                  >
                    ভর্তি তথ্য
                  </Link>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* MEET OUR EXPERT FACULTY */}
      <section className="py-20 md:py-28 relative">
        <div className="container mx-auto px-4 sm:px-6 max-w-7xl relative z-10">
          
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
            <span className="text-xs sm:text-sm font-bold tracking-widest uppercase text-emerald-700 bg-emerald-50 px-3.5 py-1.5 rounded-full border border-emerald-200">
              অভিজ্ঞ শিক্ষকমণ্ডলী
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900">
              যাদের নির্দেশনায় নিশ্চিত হবে আপনার প্রস্তুতি
            </h2>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-5 sm:gap-6">
            {featuredTeachers.map((teacher, index) => (
              <div
                key={index}
                className="group rounded-3xl p-5 bg-white border border-slate-200/80 hover:border-sky-300 text-center transition-all duration-300 hover:-translate-y-1.5 shadow-sm hover:shadow-xl"
              >
                <div className="relative w-24 h-24 sm:w-28 sm:h-28 mx-auto mb-4 rounded-full p-1 bg-gradient-to-tr from-sky-600 to-cyan-400 shadow-md">
                  <img
                    src={teacher.image}
                    alt={teacher.name}
                    className="w-full h-full object-cover rounded-full bg-slate-100"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = "/logo.png";
                    }}
                  />
                </div>
                <h4 className="text-base font-bold text-slate-900 group-hover:text-sky-600 transition-colors">
                  {teacher.name}
                </h4>
                <p className="text-xs text-slate-500 mt-1 font-medium">{teacher.subject}</p>
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link
              to="/faculty"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-white border border-slate-200 hover:border-sky-400 text-slate-700 hover:text-slate-900 font-bold text-sm shadow-xs transition-all"
            >
              <span>সকল শিক্ষকদের বিস্তারিত প্রোফাইল দেখুন</span>
              <FaArrowRight className="text-xs" />
            </Link>
          </div>

        </div>
      </section>

      {/* BRANCHES SHOWCASE */}
      <section className="py-16 bg-white border-t border-slate-200">
        <div className="container mx-auto px-4 sm:px-6 max-w-7xl">
          <div className="text-center max-w-xl mx-auto mb-10">
            <h3 className="text-2xl font-bold text-slate-900">আমাদের শাখাসমূহ</h3>
            <p className="text-slate-500 text-xs sm:text-sm mt-1">আপনার নিকটবর্তী শাখায় সরাসরি যোগাযোগ করতে পারেন</p>
          </div>

          <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {/* Branch 1 */}
            <div className="p-6 rounded-2xl bg-slate-50/80 border border-slate-200 flex items-start gap-4 hover:border-sky-300 transition-all shadow-xs">
              <div className="w-12 h-12 rounded-xl bg-sky-100 text-sky-600 flex items-center justify-center text-xl shrink-0">
                <FaMapMarkerAlt />
              </div>
              <div className="flex-1">
                <span className="text-xs font-bold text-sky-600 uppercase">শাখা ১</span>
                <h4 className="text-lg font-bold text-slate-900 mt-0.5">প্রধান শাখা</h4>
                <p className="text-sm text-slate-600 mt-1 leading-relaxed">মিজমিজি মাদ্রাসা রোড, বুকস্ গার্ডেন সংলগ্ন</p>
                <a href="tel:01676924816" className="inline-flex items-center gap-1.5 mt-3 text-xs font-bold text-sky-600 hover:text-sky-700">
                  <FaPhoneAlt className="text-[10px]" /> 01676924816
                </a>
              </div>
            </div>

            {/* Branch 2 */}
            <div className="p-6 rounded-2xl bg-slate-50/80 border border-slate-200 flex items-start gap-4 hover:border-cyan-300 transition-all shadow-xs">
              <div className="w-12 h-12 rounded-xl bg-cyan-100 text-cyan-600 flex items-center justify-center text-xl shrink-0">
                <FaMapMarkerAlt />
              </div>
              <div className="flex-1">
                <span className="text-xs font-bold text-cyan-600 uppercase">শাখা ২</span>
                <h4 className="text-lg font-bold text-slate-900 mt-0.5">দ্বিতীয় শাখা</h4>
                <p className="text-sm text-slate-600 mt-1 leading-relaxed">মিজমিজি পশ্চিম পাড়া স্কুল এন্ড কলেজ সংলগ্ন</p>
                <a href="tel:01676924816" className="inline-flex items-center gap-1.5 mt-3 text-xs font-bold text-cyan-600 hover:text-cyan-700">
                  <FaPhoneAlt className="text-[10px]" /> 01676924816
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* INTERACTIVE FAQ ACCORDION */}
      <section className="py-20 md:py-24 relative">
        <div className="container mx-auto px-4 sm:px-6 max-w-4xl relative z-10">
          <div className="text-center mb-12">
            <span className="text-xs sm:text-sm font-bold tracking-widest uppercase text-amber-700 bg-amber-50 px-3.5 py-1.5 rounded-full border border-amber-200">
              সাধারণ প্রশ্নোত্তর
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 mt-3">
              সচরাচর জিজ্ঞাসিত প্রশ্ন
            </h2>
          </div>

          <div className="space-y-3">
            {faqs.map((faq, idx) => (
              <div
                key={idx}
                className="rounded-2xl bg-white border border-slate-200/90 overflow-hidden shadow-xs transition-all"
              >
                <button
                  onClick={() => setActiveFaq(activeFaq === idx ? null : idx)}
                  className="w-full p-5 text-left flex items-center justify-between gap-4 text-slate-900 font-bold text-base hover:text-sky-600 transition-colors"
                >
                  <span>{faq.q}</span>
                  <FaChevronDown
                    className={`text-xs text-sky-600 transform transition-transform duration-300 shrink-0 ${
                      activeFaq === idx ? 'rotate-180' : ''
                    }`}
                  />
                </button>
                {activeFaq === idx && (
                  <div className="px-5 pb-5 pt-1 text-sm text-slate-600 leading-relaxed border-t border-slate-100 animate-fade-in-up">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* HIGH-CONVERTING BOTTOM CTA */}
      <section className="py-16 md:py-24 relative">
        <div className="container mx-auto px-4 sm:px-6 max-w-5xl relative z-10">
          <div className="relative rounded-[2.5rem] p-8 sm:p-14 overflow-hidden bg-gradient-to-r from-sky-600 via-sky-500 to-cyan-500 text-white shadow-2xl text-center space-y-6">
            
            <div className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-md mx-auto flex items-center justify-center text-white text-2xl shadow-sm">
              <FaGraduationCap />
            </div>

            <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white max-w-2xl mx-auto leading-tight">
              আজই শুরু করুন আপনার সন্তানের উজ্জ্বল ভবিষ্যতের প্রস্তুতি
            </h2>

            <p className="text-sky-100 text-sm sm:text-base max-w-xl mx-auto leading-relaxed">
              সরাসরি যোগাযোগ করুন অথবা অনলাইন পোর্টালে লগইন করে এক্সাম ও ক্লাসের সুবিধা গ্রহণ করুন।
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
              <a
                href="tel:01676924816"
                className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl bg-white hover:bg-slate-50 text-sky-700 font-bold text-sm shadow-lg active:scale-95 transition-all"
              >
                <FaPhoneAlt className="text-xs" />
                <span>01676924816 এ কল করুন</span>
              </a>

              <Link
                to="/login"
                className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl bg-sky-700/60 hover:bg-sky-700 text-white font-bold text-sm border border-sky-400/40 active:scale-95 transition-all"
              >
                <span>স্টুডেন্ট লগইন</span>
              </Link>
            </div>

          </div>
        </div>
      </section>

    </div>
  );
};

export default Home;
