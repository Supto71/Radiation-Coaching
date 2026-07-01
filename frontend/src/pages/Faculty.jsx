const Faculty = () => {
  const founder = {
    id: 1,
    name: 'Rakib Hasan Fahad Sir',
    subject: 'Founder of Radiation Coaching',
    qualification: 'বিস্তারিত তথ্য পরবর্তীতে যুক্ত করা হবে',
    experience: 'প্রতিষ্ঠাতা ও পরিচালক',
    image: 'https://ui-avatars.com/api/?name=Rakib+Hasan+Fahad&background=2563EB&color=fff&size=200'
  };

  const facultyMembers = [
    {
      id: 2,
      name: 'Nabila Akter Oyshe',
      subject: 'English Department',
      qualification: 'বিস্তারিত তথ্য পরবর্তীতে যুক্ত করা হবে',
      experience: 'অভিজ্ঞ শিক্ষিকা',
      image: 'https://ui-avatars.com/api/?name=Nabila+Akter+Oyshe&background=10B981&color=fff&size=200'
    },
    {
      id: 3,
      name: 'Naymon Nafi Supto',
      subject: 'Science Department',
      qualification: 'বিস্তারিত তথ্য পরবর্তীতে যুক্ত করা হবে',
      experience: 'অভিজ্ঞ শিক্ষক',
      image: 'https://ui-avatars.com/api/?name=Naymon+Nafi+Supto&background=1E40AF&color=fff&size=200'
    },
    {
      id: 4,
      name: 'Ria Mam',
      subject: 'Science Department',
      qualification: 'বিস্তারিত তথ্য পরবর্তীতে যুক্ত করা হবে',
      experience: 'অভিজ্ঞ শিক্ষিকা',
      image: 'https://ui-avatars.com/api/?name=Ria+Mam&background=F59E0B&color=fff&size=200'
    }
  ];

  return (
    <div className="py-12 bg-white min-h-screen">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">আমাদের <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">শিক্ষকমণ্ডলী</span></h1>
          <p className="text-gray-500 max-w-2xl mx-auto text-lg">আমাদের দক্ষ ও অভিজ্ঞ শিক্ষকমণ্ডলীর সাথে পরিচিত হোন।</p>
        </div>

        {/* Founder Section Highlighted */}
        <div className="flex justify-center mb-16">
          <div className="group text-center bg-primary/5 p-10 rounded-3xl border border-primary/20 w-full max-w-lg shadow-lg hover:shadow-2xl hover:shadow-primary/20 transition-all">
            <div className="relative mb-6 inline-block">
              <div className="w-48 h-48 rounded-full overflow-hidden border-4 border-white shadow-xl relative z-10 group-hover:scale-105 transition-transform duration-300">
                <img src={founder.image} alt={founder.name} className="w-full h-full object-cover" />
              </div>
              <div className="absolute inset-0 bg-gradient-to-tr from-primary to-accent rounded-full blur-2xl opacity-20 group-hover:opacity-50 transition-opacity duration-300 transform scale-110"></div>
            </div>
            
            <h3 className="text-3xl font-bold text-gray-900 mb-2">{founder.name}</h3>
            <p className="text-primary font-bold text-lg mb-4">{founder.subject}</p>
            
            <div className="bg-white rounded-xl p-4 inline-block w-full border border-gray-100 shadow-sm">
              <p className="text-sm text-gray-600 mb-2">{founder.qualification}</p>
              <p className="text-sm font-semibold text-gray-800">{founder.experience}</p>
            </div>
          </div>
        </div>

        {/* Other Faculty Members */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {facultyMembers.map((teacher) => (
            <div key={teacher.id} className="group text-center">
              <div className="relative mb-6 inline-block">
                <div className="w-40 h-40 rounded-full overflow-hidden border-4 border-white shadow-xl relative z-10 group-hover:scale-105 transition-transform duration-300">
                  <img src={teacher.image} alt={teacher.name} className="w-full h-full object-cover" />
                </div>
                <div className="absolute inset-0 bg-gradient-to-tr from-primary to-accent rounded-full blur-xl opacity-0 group-hover:opacity-30 transition-opacity duration-300 transform scale-110"></div>
              </div>
              
              <h3 className="text-2xl font-bold text-gray-900 mb-1">{teacher.name}</h3>
              <p className="text-primary font-medium mb-3">{teacher.subject}</p>
              
              <div className="bg-gray-50 rounded-lg p-4 inline-block w-full border border-gray-100 group-hover:bg-primary/5 transition-colors">
                <p className="text-sm text-gray-600 mb-2">{teacher.qualification}</p>
                <p className="text-sm font-semibold text-gray-800">{teacher.experience}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Faculty;
