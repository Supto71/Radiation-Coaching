import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  FaBookOpen, 
  FaCheckCircle, 
  FaPhoneAlt, 
  FaClock, 
  FaArrowRight 
} from 'react-icons/fa';

const Courses = () => {
  const [selectedCategory, setSelectedCategory] = useState('all');

  const courseList = [
    {
      id: 1,
      category: 'primary',
      title: "প্রাইমারি ও জুনিয়র হাইস্কুল মডিউল",
      subtitle: "প্রথম শ্রেণি থেকে অষ্টম শ্রেণি",
      description: "বেসিক কনসেপ্ট ক্লিয়ার করার জন্য অভিজ্ঞ শিক্ষকমণ্ডলীর তত্ত্বাবধানে আন্তরিক পাঠদান, প্রতিদিনের পড়া ক্লাসেই আদায় এবং নিয়মিত মূল্যায়ন পরীক্ষা।",
      features: [
        "সাপ্তাহিক মডেল টেস্ট ও প্রোগ্রেস কার্ড",
        "অধ্যায়ভিত্তিক ক্লাসরুম লেকচার",
        "সম্পূর্ণ স্কুল সিলেবাস কাভারেজ",
        "গণিত ও ইংরেজির বিশেষ বেসিক ক্লাস",
        "দুর্বল শিক্ষার্থীদের আলাদা কেয়ার"
      ],
      enrollmentFee: "১০০০ ৳",
      monthlyFee: "২০০০ ৳",
      duration: "নিয়মিত বার্ষিক ব্যাচ",
      badge: "ফাউন্ডেশন কোর্স"
    },
    {
      id: 2,
      category: 'ssc',
      title: "এসএসসি (SSC) স্পেশাল প্রোগ্রাম",
      subtitle: "নবম ও দশম শ্রেণি (বিজ্ঞান ও বাণিজ্য)",
      description: "বোর্ড পরীক্ষার সর্বোচ্চ প্রস্তুতি ও বিজ্ঞান বিভাগের বিষয়গুলোতে (পদার্থ, রসায়ন, উচ্চতর গণিত, জীববিজ্ঞান) এ+ নিশ্চিত করার সমন্বিত কর্মসূচি।",
      features: [
        "বিগত ১০ বছরের বোর্ড ও টেস্ট পেপার সলভিং",
        "অধ্যায়ভিত্তিক পূর্ণাঙ্গ মডেল টেস্ট",
        "বিশেষ সাজেস্টিভ হ্যান্ডনোট ও লেকচার শিট",
        "সৃজনশীল ও বহুনির্বাচনী প্র্যাকটিস টেস্ট",
        "টপ গ্রেড ও গোল্ডেন A+ মেন্টরিং"
      ],
      enrollmentFee: "১০০০ ৳",
      monthlyFee: "২৫০০ ৳",
      duration: "নিয়মিত ও এক্সক্লুসিভ ব্যাচ",
      badge: "সবচেয়ে জনপ্রিয়",
      popular: true
    },
    {
      id: 3,
      category: 'hsc',
      title: "এইচএসসি (HSC) একাডেমিক কেয়ার",
      subtitle: "একাদশ ও দ্বাদশ শ্রেণি",
      description: "কলেজের পড়ার চাপের সাথে মানিয়ে নিয়ে বোর্ড পরীক্ষার শীর্ষ ফলাফল ও ভবিষ্যতের বিশ্ববিদ্যালয় ভর্তি পরীক্ষার শক্ত ভিত্তি গড়ে তোলার বিশেষ প্রোগ্রাম।",
      features: [
        "জটিল সৃজনশীল ও গাণিতিক সমস্যার সমাধান",
        "এডমিশন স্ট্যান্ডার্ড বেসিক গাইডলাইন",
        "অধ্যায়ভিত্তিক ও সমন্বিত টেস্ট পরীক্ষা",
        "সহজে মনে রাখার শর্টকাট টেকনিক ও ট্রিকস",
        "বিশ্ববিদ্যালয়ের শীর্ষ শিক্ষার্থীদের মেন্টরিং"
      ],
      enrollmentFee: "১০০০ ৳",
      monthlyFee: "৩০০০ ৳",
      duration: "বোর্ড স্ট্যান্ডার্ড সেশন",
      badge: "উচ্চতর প্রস্তুতি"
    }
  ];

  const filteredCourses = selectedCategory === 'all' 
    ? courseList 
    : courseList.filter(c => c.category === selectedCategory);

  return (
    <div className="relative min-h-screen bg-[#f8fafc] text-slate-800 py-16 sm:py-24 overflow-hidden">
      
      {/* Soft Ambient Background Lights */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-gradient-to-tr from-sky-200/50 to-cyan-200/40 rounded-full blur-[140px] pointer-events-none" />

      <div className="container mx-auto px-4 sm:px-6 max-w-7xl relative z-10">

        {/* Header Section */}
        <div className="text-center max-w-3xl mx-auto mb-14 space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white border border-sky-200 text-sky-700 text-xs sm:text-sm font-semibold shadow-xs">
            <FaBookOpen />
            <span>শিক্ষাবর্ষ ২০২৬</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight">
            আমাদের <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-600 via-cyan-600 to-teal-600">কোর্স ও প্রোগ্রামসমূহ</span>
          </h1>
          <p className="text-slate-600 text-base sm:text-lg leading-relaxed">
            আপনার লক্ষ্য ও ক্লাসের জন্য নির্ধারিত কোর্সটি বেছে নিন এবং অভিজ্ঞ মেন্টরদের সাথে নিশ্চিত করুন সেরা প্রস্তুতি।
          </p>

          {/* Category Filter Pills */}
          <div className="pt-4 flex flex-wrap justify-center gap-2">
            {[
              { id: 'all', label: 'সকল কোর্স' },
              { id: 'primary', label: '১ম - ৮ম শ্রেণি' },
              { id: 'ssc', label: 'এসএসসি (SSC)' },
              { id: 'hsc', label: 'এইচএসসি (HSC)' }
            ].map(cat => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-5 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                  selectedCategory === cat.id
                    ? 'bg-gradient-to-r from-sky-600 to-cyan-500 text-white shadow-md shadow-sky-500/25'
                    : 'bg-white text-slate-600 hover:text-slate-900 border border-slate-200 hover:border-slate-300'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* Course Cards Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {filteredCourses.map((course) => (
            <div
              key={course.id}
              className={`relative rounded-3xl p-8 bg-white border ${
                course.popular 
                  ? 'border-sky-400 shadow-[0_20px_50px_rgba(2,132,199,0.12)] ring-1 ring-sky-300' 
                  : 'border-slate-200 hover:border-sky-300 shadow-sm hover:shadow-xl'
              } transition-all duration-300 hover:-translate-y-2 flex flex-col justify-between`}
            >
              {/* Badge */}
              <div className="flex items-center justify-between mb-5">
                <span className={`text-xs font-bold px-3 py-1 rounded-full ${
                  course.popular 
                    ? 'bg-gradient-to-r from-sky-600 to-cyan-500 text-white shadow-xs font-extrabold' 
                    : 'bg-sky-50 text-sky-700 border border-sky-200'
                }`}>
                  {course.badge}
                </span>
                <span className="text-xs text-slate-500 flex items-center gap-1 font-medium">
                  <FaClock className="text-sky-600 text-[11px]" />
                  {course.duration}
                </span>
              </div>

              {/* Title & Subtitle */}
              <div className="space-y-3 mb-6">
                <h3 className="text-2xl font-bold text-slate-900 group-hover:text-sky-600 transition-colors">
                  {course.title}
                </h3>
                <p className="text-xs font-semibold text-sky-700 bg-sky-50 border border-sky-100 px-3 py-1 rounded-lg w-fit">
                  {course.subtitle}
                </p>
                <p className="text-slate-600 text-sm leading-relaxed pt-1">
                  {course.description}
                </p>
              </div>

              {/* Feature Checklist */}
              <div className="space-y-3 my-6 pt-6 border-t border-slate-100">
                <p className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">কোর্সের সুবিধাসমূহ:</p>
                {course.features.map((feature, idx) => (
                  <div key={idx} className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-700">
                    <FaCheckCircle className="text-emerald-500 text-sm mt-0.5 shrink-0" />
                    <span>{feature}</span>
                  </div>
                ))}
              </div>

              {/* Pricing Box */}
              <div className="pt-6 border-t border-slate-100 space-y-4">
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 flex items-center justify-between">
                  <div>
                    <span className="text-[11px] text-slate-500 block font-medium">এককালীন ভর্তি ফি</span>
                    <span className="text-base font-bold text-slate-800 font-sans">{course.enrollmentFee}</span>
                  </div>
                  <div className="w-px h-8 bg-slate-200" />
                  <div className="text-right">
                    <span className="text-[11px] text-sky-600 block font-bold">মাসিক টিউশন ফি</span>
                    <span className="text-xl font-extrabold text-slate-900 font-sans">{course.monthlyFee}</span>
                  </div>
                </div>

                <a
                  href="tel:01676924816"
                  className="w-full py-3.5 rounded-xl bg-gradient-to-r from-sky-600 to-cyan-500 hover:from-sky-500 hover:to-cyan-400 text-white font-bold text-sm shadow-md shadow-sky-500/25 flex items-center justify-center gap-2 active:scale-95 transition-all"
                >
                  <FaPhoneAlt className="text-xs" />
                  <span>ভর্তির জন্য যোগাযোগ করুন</span>
                </a>
              </div>

            </div>
          ))}
        </div>

        {/* Bottom Help Notice */}
        <div className="mt-16 text-center">
          <div className="inline-flex flex-col sm:flex-row items-center gap-3 p-5 rounded-2xl bg-white border border-slate-200 shadow-sm">
            <span className="text-sm text-slate-600 font-medium">ভর্তি সংক্রান্ত যেকোনো তথ্যের জন্য সরাসরি আমাদের অফিসে আসুন অথবা কল করুন:</span>
            <a 
              href="tel:01676924816"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-sky-50 text-sky-700 border border-sky-200 font-bold text-sm hover:bg-sky-600 hover:text-white transition-all"
            >
              <FaPhoneAlt className="text-xs" /> 01676924816
            </a>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Courses;
