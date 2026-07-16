const Courses = () => {
  const courseList = [
    {
      id: 1,
      title: "প্রাইমারি ও হাইস্কুল মডিউল",
      subtitle: "প্রথম শ্রেণি থেকে অষ্টম শ্রেণি",
      description: "বেসিক মজবুত করার জন্য অভিজ্ঞ শিক্ষকদের তত্ত্বাবধানে নিয়মিত ক্লাস ও পরীক্ষা।",
      features: [
        "সপ্তাহিক মডেল টেস্ট",
        "অধ্যায়ভিত্তিক ক্লাস",
        "স্কুল সিলেবাস কভার",
        "বেসিক ডেভেলপমেন্ট"
      ],
      enrollmentFee: "৩০০০ ৳",
      monthlyFee: "১৫০০ ৳",
      duration: "নিয়মিত ব্যাচ"
    },
    {
      id: 2,
      title: "এসএসসি (SSC) মডিউল",
      subtitle: "নবম ও দশম শ্রেণি",
      description: "বোর্ড পরীক্ষার জন্য সম্পূর্ণ প্রস্তুতি ও বিজ্ঞান বিভাগের বিশেষ যত্ন।",
      features: [
        "টেস্ট পেপার সলভিং",
        "পূর্ণাঙ্গ মডেল টেস্ট",
        "হ্যান্ডনোট ও লেকচার শিট",
        "স্পেশাল প্রবলেম সলভিং"
      ],
      enrollmentFee: "৩৫০০ ৳",
      monthlyFee: "২০০০ ৳",
      duration: "নিয়মিত ব্যাচ"
    },
    {
      id: 3,
      title: "এইচএসসি (HSC) মডিউল",
      subtitle: "একাদশ ও দ্বাদশ শ্রেণি",
      description: "কলেজ বোর্ড পরীক্ষা ও উচ্চতর শিক্ষার বেসিক তৈরির জন্য বিশেষ প্রোগ্রাম।",
      features: [
        "সৃজনশীল প্রশ্নের সমাধান",
        "এডমিশন বেসিক গাইডলাইন",
        "অধ্যায়ভিত্তিক পরীক্ষা",
        "শর্টকাট টেকনিক"
      ],
      enrollmentFee: "৪০০০ ৳",
      monthlyFee: "২৫০০ ৳",
      duration: "নিয়মিত ব্যাচ"
    }
  ];

  return (
    <div className="py-20 min-h-screen" style={{ backgroundColor: 'var(--color-bg-light, #f4f7fb)' }}>
      <div className="container mx-auto px-4 sm:px-8 max-w-6xl">
        
        {/* Header Section */}
        <div className="text-center mb-20">
          <h1 className="text-4xl md:text-5xl font-extrabold text-[#0f172a] mb-4">আমাদের <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00b4d8] to-[#0096b4]">কোর্সসমূহ</span></h1>
          <p className="text-gray-500 max-w-2xl mx-auto text-lg font-medium">আপনার লক্ষ্য অনুযায়ী সঠিক কোর্সটি বেছে নিন এবং ভবিষ্যতের প্রস্তুতি শুরু করুন।</p>
        </div>

        {/* Timeline Layout */}
        <div className="relative">
          {/* Vertical Line */}
          <div className="absolute left-8 md:left-1/2 top-4 bottom-4 w-1 bg-gradient-to-b from-[#00b4d8]/50 to-[#0096b4]/10 rounded-full transform md:-translate-x-1/2"></div>

          <div className="space-y-12 md:space-y-20">
            {courseList.map((course, index) => {
              const isLeft = index % 2 === 0;
              
              return (
                <div key={course.id} className={`relative flex flex-col md:flex-row items-center ${isLeft ? '' : 'md:flex-row-reverse'}`}>
                  
                  {/* Timeline Dot */}
                  <div className="absolute left-8 md:left-1/2 w-6 h-6 rounded-full bg-[#00b4d8] border-4 border-white shadow-[0_0_15px_rgba(0,180,216,0.6)] transform -translate-x-1/2 top-8 md:top-1/2 md:-translate-y-1/2 z-10"></div>
                  
                  {/* Empty space for alternating layout */}
                  <div className="hidden md:block md:w-1/2"></div>

                  {/* Course Card */}
                  <div className={`w-full md:w-1/2 pl-16 md:pl-0 ${isLeft ? 'md:pr-12 lg:pr-16' : 'md:pl-12 lg:pl-16'}`}>
                    <div className="bg-white rounded-[2rem] shadow-[0_15px_50px_rgba(0,0,0,0.05)] border border-gray-100 hover:shadow-[0_20px_50px_rgba(0,180,216,0.15)] transition-all duration-300 overflow-hidden group transform hover:-translate-y-1">
                      
                      {/* Top Gradient Bar */}
                      <div className="h-2 w-full bg-gradient-to-r from-[#00b4d8] to-[#0096b4] transform origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-500"></div>
                      
                      <div className="p-8 sm:p-10">
                        <h2 className="text-2xl font-bold text-[#0f172a] mb-2">{course.title}</h2>
                        <p className="inline-block bg-[#00b4d8]/10 text-[#00b4d8] font-bold px-4 py-1.5 rounded-full text-sm mb-4">
                          {course.subtitle}
                        </p>
                        <p className="text-gray-600 mb-8 leading-relaxed">{course.description}</p>
                        
                        {/* Features List */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
                          {course.features.map((feature, idx) => (
                            <div key={idx} className="flex items-center text-gray-700 font-medium text-sm">
                              <span className="w-6 h-6 rounded-full bg-[#00b4d8]/10 flex items-center justify-center mr-3 flex-shrink-0">
                                <svg className="w-3.5 h-3.5 text-[#00b4d8]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                </svg>
                              </span>
                              {feature}
                            </div>
                          ))}
                        </div>
                        
                        {/* Pricing & Duration */}
                        <div className="bg-[#f4f7fb] rounded-2xl p-6 mt-6 flex flex-col sm:flex-row justify-between items-center gap-4">
                          <div className="w-full sm:w-auto">
                            <span className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">ভর্তি ফি</span>
                            <span className="font-bold text-[#0f172a] text-lg">{course.enrollmentFee}</span>
                          </div>
                          <div className="hidden sm:block w-px h-10 bg-gray-300"></div>
                          <div className="w-full sm:w-auto">
                            <span className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">মাসিক ফি</span>
                            <span className="font-bold text-[#00b4d8] text-xl">{course.monthlyFee}</span>
                          </div>
                        </div>

                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

      </div>
    </div>
  );
};

export default Courses;
