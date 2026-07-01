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
      price: "মাসিক ফী",
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
      price: "মাসিক ফী",
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
      price: "মাসিক ফী",
      duration: "নিয়মিত ব্যাচ"
    }
  ];

  return (
    <div className="py-12 bg-gray-50 min-h-screen">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">আমাদের <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">কোর্সসমূহ</span></h1>
          <p className="text-gray-500 max-w-2xl mx-auto text-lg">আপনার লক্ষ্য অনুযায়ী সঠিক কোর্সটি বেছে নিন এবং প্রস্তুতি শুরু করুন।</p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {courseList.map((course) => (
            <div key={course.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 hover:shadow-xl transition-all flex flex-col overflow-hidden group">
              <div className="h-2 w-full bg-gradient-to-r from-primary to-secondary transform origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></div>
              <div className="p-8 flex-grow">
                <h2 className="text-2xl font-bold text-gray-900 mb-1">{course.title}</h2>
                <p className="text-primary font-medium mb-3">{course.subtitle}</p>
                <p className="text-gray-600 mb-6 line-clamp-3">{course.description}</p>
                
                <div className="space-y-3 mb-8">
                  {course.features.map((feature, idx) => (
                    <div key={idx} className="flex items-center text-gray-600">
                      <svg className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      {feature}
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="p-8 bg-gray-50 border-t border-gray-100 mt-auto flex justify-between items-center">
                <div>
                  <span className="block text-sm text-gray-500">কোর্সের মেয়াদ</span>
                  <span className="font-semibold text-gray-900">{course.duration}</span>
                </div>
                <div className="text-right">
                  <span className="block text-2xl font-bold text-primary">{course.price}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Courses;
