import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div className="flex flex-col min-h-[calc(100vh-76px)] bg-[#f4f7fb] overflow-hidden">
      
      {/* Hero Section */}
      <section className="relative w-full py-12 md:py-20 flex items-center justify-center min-h-[80vh]">
        {/* Faded Watermark Logo */}
        <div className="absolute inset-0 flex items-center justify-center opacity-5 pointer-events-none z-0">
          <img src="/logo.png" alt="Watermark" className="w-[80vw] md:w-[50vw] max-w-3xl object-contain" />
        </div>
        
        <div className="container mx-auto px-4 sm:px-6 relative z-10 flex flex-col lg:flex-row items-center justify-between gap-12">
          
          {/* Left Text Content */}
          <div className="w-full lg:w-1/2 flex flex-col text-center lg:text-left">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-gray-800 leading-[1.2] mb-6">
              আপনার <span className="text-[#00b4d8]">উজ্জ্বল</span><br />
              <span className="text-[#00b4d8]">ভবিষ্যতের</span><br />
              সঠিক<br />
              দিকনির্দেশনা
            </h1>
            <p className="text-gray-500 font-medium text-sm md:text-base max-w-lg mx-auto lg:mx-0">
              রেডিয়েশন কোচিং এ আপনাদের স্বাগতম। আপনাদের সার্বিক উন্নতিতে আমরা গর্বিত এবং সর্বদা প্রস্তুত।
            </p>
          </div>
          
          {/* Right Image Content */}
          <div className="w-full lg:w-1/2 flex justify-center lg:justify-end relative mt-8 lg:mt-0">
            <div className="relative w-full max-w-2xl lg:max-w-[700px] rounded-[2rem] overflow-hidden shadow-2xl border-4 border-white">
              {/* Fallback image name 'hero-image.png' (Tell user to save the pic as this name) */}
              <img 
                src="/hero-image.jpg" 
                alt="Classroom" 
                className="w-full h-auto object-cover"
                onError={(e) => {
                  e.target.onerror = null; 
                  e.target.src="/logo.png"; // Fallback to logo if not found
                  e.target.className="w-[80%] mx-auto opacity-50 py-10";
                }}
              />
            </div>
          </div>

        </div>
      </section>

      {/* Why We Are The Best Section */}
      <section className="py-16 md:py-24 relative z-10">
        <div className="container mx-auto px-4 max-w-5xl">
          
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-extrabold text-gray-800 mb-3">
              কেন আমরা <span className="text-[#00b4d8]">সেরা?</span>
            </h2>
            <p className="text-gray-500 text-sm font-medium">
              আমাদের বিশেষত্বসমূহ যা আপনাদের পড়াশোনাকে আরও সহজ ও সাবলীল করে তুলবে
            </p>
          </div>
          
          <div className="flex flex-col gap-6">
            
            {/* Feature Card 1 */}
            <div className="bg-white rounded-3xl p-6 md:p-8 flex items-center shadow-[0_8px_30px_rgba(0,0,0,0.04)] relative overflow-hidden group hover:shadow-[0_15px_40px_rgba(0,180,216,0.1)] transition-all">
              <div className="absolute -right-8 top-1/2 -translate-y-1/2 w-32 h-32 bg-[#e0f2fe] rounded-full opacity-50 group-hover:scale-110 transition-transform"></div>
              <div className="w-12 h-12 bg-[#00b4d8] rounded-xl flex items-center justify-center shrink-0 mr-6 shadow-md shadow-cyan-200">
                <span className="text-white font-bold text-xl">১</span>
              </div>
              <div className="relative z-10">
                <h3 className="text-lg font-bold text-gray-800 mb-1">স্মার্ট এক্সাম সিস্টেম</h3>
                <p className="text-gray-500 text-sm leading-relaxed">
                  আমাদের রয়েছে অত্যাধুনিক অনলাইন পরীক্ষা পদ্ধতি। ঘরে বসেই পরীক্ষা দিন এবং সাথে সাথে রেজাল্ট পেয়ে যান।
                </p>
              </div>
            </div>

            {/* Feature Card 2 */}
            <div className="bg-white rounded-3xl p-6 md:p-8 flex items-center shadow-[0_8px_30px_rgba(0,0,0,0.04)] relative overflow-hidden group hover:shadow-[0_15px_40px_rgba(0,180,216,0.1)] transition-all">
              <div className="absolute -right-8 top-1/2 -translate-y-1/2 w-32 h-32 bg-[#e0f2fe] rounded-full opacity-50 group-hover:scale-110 transition-transform"></div>
              <div className="w-12 h-12 bg-[#00b4d8] rounded-xl flex items-center justify-center shrink-0 mr-6 shadow-md shadow-cyan-200">
                <span className="text-white font-bold text-xl">২</span>
              </div>
              <div className="relative z-10">
                <h3 className="text-lg font-bold text-gray-800 mb-1">অভিজ্ঞ শিক্ষকমণ্ডলী</h3>
                <p className="text-gray-500 text-sm leading-relaxed">
                  দেশের সেরা বিশ্ববিদ্যালয় থেকে আগত বিষয়ভিত্তিক বিশেষজ্ঞ শিক্ষকদের নির্দেশনায় আপনার প্রস্তুতি হবে ১০০ ভাগ নির্ভুল।
                </p>
              </div>
            </div>

            {/* Feature Card 3 */}
            <div className="bg-white rounded-3xl p-6 md:p-8 flex items-center shadow-[0_8px_30px_rgba(0,0,0,0.04)] relative overflow-hidden group hover:shadow-[0_15px_40px_rgba(0,180,216,0.1)] transition-all">
              <div className="absolute -right-8 top-1/2 -translate-y-1/2 w-32 h-32 bg-[#e0f2fe] rounded-full opacity-50 group-hover:scale-110 transition-transform"></div>
              <div className="w-12 h-12 bg-[#00b4d8] rounded-xl flex items-center justify-center shrink-0 mr-6 shadow-md shadow-cyan-200">
                <span className="text-white font-bold text-xl">৩</span>
              </div>
              <div className="relative z-10">
                <h3 className="text-lg font-bold text-gray-800 mb-1">স্পেশাল লেকচার শিট</h3>
                <p className="text-gray-500 text-sm leading-relaxed">
                  সহজ ও সাবলীল ভাষায় তৈরি স্পেশাল লেকচার শিট যা পরীক্ষায় ভালো ফলাফল করতে দারুণ সহায়তা করবে।
                </p>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Footer Section */}
      <footer className="bg-[#0f172a] mt-auto relative z-10">
        <div className="container mx-auto px-4 py-16">
          <div className="text-center mb-12">
            <h2 className="text-2xl font-bold text-white mb-2">আমাদের শাখা সমূহ</h2>
            <p className="text-gray-400 text-sm">রেডিয়েশন কোচিং এর যে কোনো শাখায় ভর্তি হতে যোগাযোগ করুন</p>
            <div className="mt-6 inline-flex items-center gap-2 bg-[#1e293b] text-[#00b4d8] px-6 py-2.5 rounded-full font-bold border border-[#334155]">
              📞 01676924816
            </div>
          </div>
          
          <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {/* Branch 1 */}
            <div className="bg-[#1e293b] p-6 rounded-2xl flex items-start gap-4 border border-[#334155]">
              <div className="w-10 h-10 bg-[#0f172a] rounded-full flex items-center justify-center shrink-0">
                <span className="text-[#00b4d8]">📍</span>
              </div>
              <div>
                <h3 className="text-white font-bold mb-1">প্রধান শাখা</h3>
                <p className="text-gray-400 text-xs leading-relaxed">মিজমিজি মাদ্রাসা রোড, বুকস্ গার্ডেন সংলগ্ন</p>
              </div>
            </div>
            {/* Branch 2 */}
            <div className="bg-[#1e293b] p-6 rounded-2xl flex items-start gap-4 border border-[#334155]">
              <div className="w-10 h-10 bg-[#0f172a] rounded-full flex items-center justify-center shrink-0">
                <span className="text-[#00b4d8]">📍</span>
              </div>
              <div>
                <h3 className="text-white font-bold mb-1">দ্বিতীয় শাখা</h3>
                <p className="text-gray-400 text-xs leading-relaxed">মিজমিজি পশ্চিম পাড়া স্কুল এন্ড কলেজ সংলগ্ন</p>
              </div>
            </div>
          </div>
        </div>
        <div className="border-t border-[#1e293b] py-6 text-center">
          <h2 className="text-white font-bold text-lg mb-1">রেডিয়েশন কোচিং জোন</h2>
          <p className="text-gray-500 text-xs">© {new Date().getFullYear()} All Rights Reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default Home;
