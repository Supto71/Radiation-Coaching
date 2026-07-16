import React from 'react';

const Faculty = () => {
  const founder = {
    id: 1,
    name: 'রাকিব হাসান ফাহাদ',
    role: 'পরিচালক',
    institute: 'রেডিয়েশন কোচিং',
    image: '/rakib.png'
  };

  const facultyMembers = [
    {
      id: 10,
      name: 'নায়মুন নাফি সুপ্ত',
      university: 'University of Information Science and Technology (UITS)',
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
      id: 2,
      name: 'রেহানা আক্তার তৃষা',
      university: 'ঢাকা সিটি কলেজ (জাতীয় বিশ্ববিদ্যালয়)',
      subject: 'B.B.A (Department of Accounting)',
      year: 'প্রথম বর্ষ (চূড়ান্ত পরীক্ষার পরীক্ষার্থী)',
      teaching: 'ইংরেজি, বাণিজ্য বিভাগের সকল বিষয় এবং বাংলা',
      image: 'https://ui-avatars.com/api/?name=Rehana+Akter+Trisha&background=10B981&color=fff&size=200'
    },
    {
      id: 3,
      name: 'নাবিলা বাশার ঐশী',
      university: 'নারায়ণগঞ্জ কলেজ (জাতীয় বিশ্ববিদ্যালয়)',
      subject: 'B.Sc (Department of Economics)',
      year: 'প্রথম বর্ষ (চূড়ান্ত পরীক্ষার পরীক্ষার্থী)',
      teaching: 'ইংরেজি, মানবিক বিভাগের সকল বিষয় এবং বিজ্ঞান',
      image: 'https://ui-avatars.com/api/?name=Nabila+Basher+Oyshe&background=8B5CF6&color=fff&size=200'
    },
    {
      id: 4,
      name: 'উম্মে হানি লুনা',
      university: 'নারায়ণগঞ্জ সরকারি তোলারাম কলেজ (জাতীয় বিশ্ববিদ্যালয়)',
      subject: 'B.A',
      year: 'দ্বিতীয় বর্ষ',
      teaching: 'বাংলা, বাংলাদেশ ও বিশ্বপরিচয়, ইসলাম, ফিন্যান্স, ব্যবসায় উদ্যোগ',
      image: 'https://ui-avatars.com/api/?name=Ummey+Hany+Luna&background=F59E0B&color=fff&size=200'
    },
    {
      id: 5,
      name: 'ফাহমিদা আক্তার পান্না',
      university: 'জাতীয় বিশ্ববিদ্যালয়',
      subject: 'B.Sc (Department of Geography and Environment)',
      year: '৩য় বর্ষ',
      teaching: 'বাংলাদেশ ও বিশ্বপরিচয়',
      image: 'https://ui-avatars.com/api/?name=Fahmida+akter+Panna&background=EC4899&color=fff&size=200'
    },
    {
      id: 6,
      name: 'মিম ইসলাম',
      university: 'সরকারি শহীদ সোহরাওয়ার্দী কলেজ',
      subject: 'Department of Management',
      year: 'দ্বিতীয় বর্ষ',
      teaching: 'হিসাববিজ্ঞান, অর্থনীতি',
      image: 'https://ui-avatars.com/api/?name=Mim+Islam&background=14B8A6&color=fff&size=200'
    },
    {
      id: 7,
      name: 'আইরিন চৌধুরী স্মৃতি',
      university: 'ইডেন মহিলা কলেজ',
      subject: 'Department of Management',
      year: '৩য় বর্ষ',
      teaching: 'ফিন্যান্স এবং ইংরেজি',
      image: 'https://ui-avatars.com/api/?name=Airin+Chowdhury+Smrity&background=F43F5E&color=fff&size=200'
    },
    {
      id: 8,
      name: 'আয়শা আক্তার প্রিয়াঙ্কা',
      university: 'ইডেন মহিলা কলেজ',
      subject: 'Hons, Masters (Department of Bangla)',
      year: '-',
      teaching: 'বাংলা, পৌরনীতি, সমাজকর্ম, গার্হস্থ্য, ইতিহাস, ভূগোল',
      image: 'https://ui-avatars.com/api/?name=Ayesha+Akter+Priyanka&background=3B82F6&color=fff&size=200'
    },
    {
      id: 9,
      name: 'লামিয়া',
      university: 'Central Women\'s College',
      subject: 'Department of English',
      year: '৩য় বর্ষ',
      teaching: 'বাংলা, বাংলাদেশ ও বিশ্বপরিচয়, ইংরেজি, বিজ্ঞান',
      image: 'https://ui-avatars.com/api/?name=Lamia&background=6366F1&color=fff&size=200'
    },
    
    
    {
      id: 12,
      name: 'ইমাম হাসান বাঁধন',
      university: '-',
      subject: 'বিবিএ (অনার্স), ব্যবস্থাপনা বিভাগ, এলএলবি (অনার্স)',
      year: '-',
      teaching: 'নির্ধারিত হয়নি',
      image: 'https://ui-avatars.com/api/?name=Imam+Hasan+Badhon&background=3B82F6&color=fff&size=200'
    },
    {
      id: 13,
      name: 'মো: ফাহিম আহমেদ',
      university: '-',
      subject: 'বিবিএ, এমবিএ (ফার্স্টক্লাস) হিসাববিজ্ঞান',
      year: '-',
      teaching: 'নির্ধারিত হয়নি',
      image: 'https://ui-avatars.com/api/?name=Md+Fahim+Ahmed&background=10B981&color=fff&size=200'
    },
    {
      id: 14,
      name: 'মো: ইরফান',
      university: '-',
      subject: 'বিএসসি (অনার্স), এমএসসি (রসায়ন)',
      year: '-',
      teaching: 'নির্ধারিত হয়নি',
      image: 'https://ui-avatars.com/api/?name=Md+Irfan&background=F59E0B&color=fff&size=200'
    },
    {
      id: 15,
      name: 'রিয়াজউদ্দিন রাকিব',
      university: '-',
      subject: 'বিবিএ (অনার্স), এমবিএ ফিন্যান্স বিভাগ',
      year: '-',
      teaching: 'নির্ধারিত হয়নি',
      image: 'https://ui-avatars.com/api/?name=Riazuddin+Rakib&background=6366F1&color=fff&size=200'
    },
    {
      id: 16,
      name: 'হাফেজ মাওলানা আমির মোহাম্মদ ওসমান গনি',
      university: '-',
      subject: 'দাওরায় হাদিস (মাস্টার্স), বিএ (অনার্স) আলকুরআন এন্ড ইসলামিক স্টাডিজ',
      year: '-',
      teaching: 'নির্ধারিত হয়নি',
      image: 'https://ui-avatars.com/api/?name=Osman+Gani&background=8B5CF6&color=fff&size=200'
    },
    {
      id: 17,
      name: 'সুমাইয়া আক্তার',
      university: '-',
      subject: 'বিএ (অনার্স) রাষ্ট্রবিজ্ঞান',
      year: '-',
      teaching: 'নির্ধারিত হয়নি',
      image: 'https://ui-avatars.com/api/?name=Sumaiya+Akter&background=EC4899&color=fff&size=200'
    },
    {
      id: 18,
      name: 'জান্নাতুন নাঈমা জাহান',
      university: '-',
      subject: 'বিএসএস (সমাজবিজ্ঞান)',
      year: '-',
      teaching: 'নির্ধারিত হয়নি',
      image: 'https://ui-avatars.com/api/?name=Jannatun+Naima+Jahan&background=14B8A6&color=fff&size=200'
    },
    {
      id: 19,
      name: 'সাদিয়া আক্তার',
      university: '-',
      subject: 'বিএসসি (অনার্স), গণিত',
      year: '-',
      teaching: 'নির্ধারিত হয়নি',
      image: 'https://ui-avatars.com/api/?name=Sadia+Akter&background=F43F5E&color=fff&size=200'
    },
    {
      id: 20,
      name: 'আরাফাত সাগর',
      university: 'ঢাকা বিশ্ববিদ্যালয় (ঢাবি)',
      subject: 'বিএ (অনার্স), এমএ ইংরেজি বিভাগ',
      year: '-',
      teaching: 'নির্ধারিত হয়নি',
      image: 'https://ui-avatars.com/api/?name=Arafat+Sagor&background=0EA5E9&color=fff&size=200'
    },
    {
      id: 21,
      name: 'ওমর ফারুক ফারহান',
      university: 'বাংলাদেশ টেক্সটাইল বিশ্ববিদ্যালয় (বুটেক্স)',
      subject: 'বিএসসি (টেক্সটাইল ইঞ্জিনিয়ারিং)',
      year: '-',
      teaching: 'নির্ধারিত হয়নি',
      image: 'https://ui-avatars.com/api/?name=Omar+Faruk+Farhan&background=84CC16&color=fff&size=200'
    },
    {
      id: 22,
      name: 'সাজ্জাতুল সজীব',
      university: '-',
      subject: 'বিএসসি (অনার্স), এমএসসি (গণিত)',
      year: '-',
      teaching: 'নির্ধারিত হয়নি',
      image: 'https://ui-avatars.com/api/?name=Sajjatul+Sajib&background=6366F1&color=fff&size=200'
    },
    {
      id: 23,
      name: 'মো: সাইফুর রহমান মুনিম',
      university: '-',
      subject: 'বিএসসি (অনার্স), এমএসসি (প্রাণিবিজ্ঞান)',
      year: '-',
      teaching: 'নির্ধারিত হয়নি',
      image: 'https://ui-avatars.com/api/?name=Md+Saifur+Rahman+Munim&background=3B82F6&color=fff&size=200'
    },
    {
      id: 24,
      name: 'ইমাম হাসান',
      university: '-',
      subject: 'বিএ অনার্স (ইংরেজি বিভাগ) এম. এ. (অধ্যয়নরত)',
      year: '-',
      teaching: 'নির্ধারিত হয়নি',
      image: 'https://ui-avatars.com/api/?name=Imam+Hasan&background=10B981&color=fff&size=200'
    },
    {
      id: 25,
      name: 'মো. রিয়াদ',
      university: '-',
      subject: 'বিএসসি (অনার্স), উদ্ভিদ বিজ্ঞান বিভাগ',
      year: '-',
      teaching: 'নির্ধারিত হয়নি',
      image: 'https://ui-avatars.com/api/?name=Md+Riad&background=F59E0B&color=fff&size=200'
    },
    {
      id: 26,
      name: 'শামীম মাহমুদ অন্তু',
      university: '-',
      subject: 'বিএ (অনার্স) ইংরেজি',
      year: '-',
      teaching: 'নির্ধারিত হয়নি',
      image: 'https://ui-avatars.com/api/?name=Shamim+Mahmud+Antu&background=8B5CF6&color=fff&size=200'
    },
    {
      id: 27,
      name: 'মো. রাশেদুল ইসলাম',
      university: '-',
      subject: 'বিএ (অনার্স) রাষ্ট্রবিজ্ঞান বিভাগ',
      year: '-',
      teaching: 'নির্ধারিত হয়নি',
      image: 'https://ui-avatars.com/api/?name=Md+Rashedul+Islam&background=EC4899&color=fff&size=200'
    },
    {
      id: 28,
      name: 'এঞ্জেলী আক্তার',
      university: '-',
      subject: 'বিএ (অনার্স) ভূগোল',
      year: '-',
      teaching: 'নির্ধারিত হয়নি',
      image: 'https://ui-avatars.com/api/?name=Anjely+Akter&background=14B8A6&color=fff&size=200'
    }
  ];

  return (
    <div className="py-12 bg-gray-50 min-h-screen">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">আমাদের <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">শিক্ষকমণ্ডলী</span></h1>
          <p className="text-gray-500 max-w-2xl mx-auto text-lg">আমাদের দক্ষ ও অভিজ্ঞ শিক্ষকমণ্ডলীর সাথে পরিচিত হোন।</p>
        </div>

        {/* Founder Section Highlighted */}
        <div className="flex justify-center mb-20">
          <div className="group text-center bg-white p-10 rounded-3xl border border-primary/20 w-full max-w-lg shadow-xl hover:shadow-2xl hover:shadow-primary/30 transition-all transform hover:-translate-y-1 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-r from-primary to-secondary opacity-10"></div>
            <div className="relative mb-6 inline-block mt-4">
              <div className="w-48 h-48 rounded-full overflow-hidden border-4 border-white shadow-xl relative z-10 group-hover:scale-105 transition-transform duration-300">
                <img src={founder.image} alt={founder.name} className="w-full h-full object-cover" />
              </div>
              <div className="absolute inset-0 bg-gradient-to-tr from-primary to-accent rounded-full blur-2xl opacity-20 group-hover:opacity-50 transition-opacity duration-300 transform scale-110"></div>
            </div>
            
            <h3 className="text-3xl font-bold text-gray-900 mb-2 relative z-10">{founder.name}</h3>
            <p className="text-primary font-bold text-xl mb-1 relative z-10">{founder.role}</p>
            <p className="text-gray-600 font-medium text-lg relative z-10">{founder.institute}</p>
          </div>
        </div>

        {/* Other Faculty Members Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-8">
          {facultyMembers.map((teacher) => (
            <div key={teacher.id} className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-xl hover:border-primary/20 transition-all duration-300 transform hover:-translate-y-1 group">
              <div className="flex items-center gap-5 mb-6 pb-6 border-b border-gray-100">
                <div className="w-20 h-20 rounded-full overflow-hidden border-2 border-gray-100 shadow-md flex-shrink-0 group-hover:border-primary/50 transition-colors">
                  <img 
                    src={teacher.image} 
                    alt={teacher.name} 
                    className={`w-full h-full object-cover ${teacher.id === 10 ? 'scale-[1.4] object-[center_10%] origin-top' : ''}`} 
                  />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900 leading-tight mb-1 group-hover:text-primary transition-colors">{teacher.name}</h3>
                </div>
              </div>
              
              <div className="space-y-4 text-sm">
                <div className="flex items-start gap-3">
                  <div className="mt-0.5 text-primary">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 14l9-5-9-5-9 5 9 5z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14zm-4 6v-7.5l4-2.222"></path></svg>
                  </div>
                  <div>
                    <p className="text-gray-500 font-medium text-xs uppercase tracking-wider mb-0.5">বিশ্ববিদ্যালয়</p>
                    <p className="text-gray-800 font-medium leading-snug">{teacher.university}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="mt-0.5 text-secondary">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path></svg>
                  </div>
                  <div>
                    <p className="text-gray-500 font-medium text-xs uppercase tracking-wider mb-0.5">অধ্যয়নরত বিষয়</p>
                    <p className="text-gray-800 leading-snug">{teacher.subject}</p>
                    {teacher.year !== '-' && <p className="text-gray-600 text-xs mt-0.5">({teacher.year})</p>}
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="mt-0.5 text-green-500">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"></path></svg>
                  </div>
                  <div>
                    <p className="text-gray-500 font-medium text-xs uppercase tracking-wider mb-0.5">দায়িত্বপ্রাপ্ত বিষয়</p>
                    <p className="text-gray-800 font-medium leading-snug">{teacher.teaching}</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Faculty;
