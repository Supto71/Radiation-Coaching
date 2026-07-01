import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div className="flex flex-col min-h-[calc(100vh-80px)]">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gray-50 flex-grow flex items-center">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-secondary/10 pointer-events-none" />
        
        <div className="container mx-auto px-4 py-20 relative z-10 flex flex-col md:flex-row items-center">
          <div className="md:w-1/2 mb-12 md:mb-0">
            <h1 className="text-5xl md:text-6xl font-bold leading-tight mb-6 text-gray-900">
              আপনার <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">উজ্জ্বল ভবিষ্যতের</span><br />
              সঠিক দিকনির্দেশনা
            </h1>
            <p className="text-xl text-gray-600 mb-10 leading-relaxed max-w-lg">
              রেডিয়েশন কোচিং-এ আপনাকে স্বাগতম। আমাদের অভিজ্ঞ শিক্ষকদের নির্দেশনায় আপনার প্রস্তুতি হোক আরও সুদৃঢ়।
            </p>
            <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
              <Link 
                to="/courses" 
                className="bg-primary text-white text-center px-8 py-3.5 rounded-lg shadow-lg shadow-primary/30 hover:bg-secondary transition-all transform hover:-translate-y-1 font-semibold text-lg"
              >
                আমাদের কোর্সসমূহ
              </Link>
              <Link 
                to="/exam" 
                className="bg-white text-primary border-2 border-primary text-center px-8 py-3.5 rounded-lg hover:bg-gray-50 transition-all font-semibold text-lg"
              >
                অনলাইন পরীক্ষা
              </Link>
            </div>
          </div>
          
          <div className="md:w-1/2 flex justify-center">
            {/* Logo Image */}
            <div className="relative w-full max-w-md flex items-center justify-center">
               <img src="/logo.png" alt="Radiation Coaching Logo" className="w-full max-w-[300px] md:max-w-[400px] h-auto object-contain rounded-full shadow-2xl hover:scale-105 transition-transform duration-300 mix-blend-multiply" />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">কেন আমরা সেরা?</h2>
            <p className="text-gray-500 max-w-2xl mx-auto">আমাদের বিশেষত্বসমূহ যা আপনার প্রস্তুতিকে অনন্য করে তুলবে।</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="bg-gray-50 p-8 rounded-2xl border border-gray-100 hover:shadow-xl transition-shadow group">
              <div className="w-14 h-14 bg-primary/10 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <svg className="w-7 h-7 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-3 text-gray-900">আধুনিক সিলেবাস</h3>
              <p className="text-gray-600 leading-relaxed">সর্বশেষ শিক্ষাক্রম অনুযায়ী সাজানো সম্পূর্ণ স্টাডি ম্যাটেরিয়াল ও লেকচার শিট।</p>
            </div>

            {/* Feature 2 */}
            <div className="bg-gray-50 p-8 rounded-2xl border border-gray-100 hover:shadow-xl transition-shadow group">
              <div className="w-14 h-14 bg-secondary/10 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <svg className="w-7 h-7 text-secondary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-3 text-gray-900">স্মার্ট এক্সাম সিস্টেম</h3>
              <p className="text-gray-600 leading-relaxed">অটোমেটিক গ্রেডিং, নেগেটিভ মার্কিং এবং লাইভ টাইমার সহ অত্যাধুনিক পরীক্ষা পদ্ধতি।</p>
            </div>

            {/* Feature 3 */}
            <div className="bg-gray-50 p-8 rounded-2xl border border-gray-100 hover:shadow-xl transition-shadow group">
              <div className="w-14 h-14 bg-accent/10 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <svg className="w-7 h-7 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-3 text-gray-900">অভিজ্ঞ শিক্ষক</h3>
              <p className="text-gray-600 leading-relaxed">দেশের সেরা বিশ্ববিদ্যালয় থেকে আগত বিষয়ভিত্তিক বিশেষজ্ঞ শিক্ষকমণ্ডলী।</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
