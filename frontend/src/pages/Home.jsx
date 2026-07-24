import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const features = [
    {
      id: 1,
      title: "অভাবনীয় সাফল্য",
      desc: "প্রতিষ্ঠালগ্ন থেকে সরকারি বৃত্তি, গোল্ডেন A+ সহ শতভাগ পাশ",
      number: "১"
    },
    {
      id: 2,
      title: "স্মার্ট এক্সাম সিস্টেম",
      desc: "আমাদের রয়েছে অত্যাধুনিক অনলাইন পরীক্ষা পদ্ধতি। ঘরে বসেই পরীক্ষা দিন এবং সাথে সাথে রেজাল্ট পেয়ে যান।",
      number: "২"
    },
    {
      id: 3,
      title: "অভিজ্ঞ শিক্ষকমণ্ডলী",
      desc: "দেশের সেরা বিশ্ববিদ্যালয় থেকে আগত বিষয়ভিত্তিক বিশেষজ্ঞ শিক্ষকদের নির্দেশনায় আপনার প্রস্তুতি হবে ১০০ ভাগ নির্ভুল।",
      number: "৩"
    },
    {
      id: 4,
      title: "স্পেশাল লেকচার শিট",
      desc: "সহজ ও সাবলীল ভাষায় তৈরি স্পেশাল লেকচার শিট যা পরীক্ষায় ভালো ফলাফল করতে দারুণ সহায়তা করবে।",
      number: "৪"
    }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % features.length);
    }, 4000);
    return () => clearInterval(timer);
  }, [features.length]);

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
          <div className="w-full lg:w-1/2 flex flex-col text-center lg:text-left animate-fade-in-up">
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
          <div className="w-full lg:w-1/2 flex justify-center lg:justify-end relative mt-12 lg:mt-0 animate-fade-in-up delay-200">
            {/* Soft background glow to blend the image */}
            <div className="absolute inset-0 bg-[#00b4d8] opacity-5 blur-[100px] rounded-full z-0"></div>
            
            <div className="relative w-full max-w-[800px] rounded-[3rem] overflow-hidden shadow-[0_20px_50px_rgba(0,180,216,0.15)] z-10 transition-transform duration-500 hover:scale-[1.02]">
              {/* Fallback image name 'hero-image.png' (Tell user to save the pic as this name) */}
              <img 
                src="/hero-image-v2.jpg" 
                alt="Classroom" 
                className="w-full h-auto object-cover"
                onError={(e) => {
                  e.target.onerror = null; 
                  e.target.src="/logo.png"; // Fallback to logo if not found
                  e.target.className="w-[80%] mx-auto opacity-50 py-10";
                }}
              />
              
              {/* Subtle overlay gradient to blend with the background */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#f4f7fb]/40 to-transparent pointer-events-none"></div>
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
          
          <div className="relative max-w-3xl mx-auto pb-12">
            <div className="overflow-hidden rounded-3xl">
              <div 
                className="flex transition-transform duration-700 ease-in-out"
                style={{ transform: `translateX(-${currentSlide * 100}%)` }}
              >
                {features.map((feature) => (
                  <div key={feature.id} className="w-full shrink-0 px-2">
                    <div className="bg-white/40 backdrop-blur-md border border-white/60 rounded-3xl p-8 md:p-10 flex flex-col md:flex-row items-center text-center md:text-left shadow-lg relative overflow-hidden group hover:shadow-[0_15px_40px_rgba(0,180,216,0.15)] transition-all min-h-[220px]">
                      <div className="absolute -right-8 top-1/2 -translate-y-1/2 w-32 h-32 bg-[#e0f2fe] rounded-full opacity-50 group-hover:scale-110 transition-transform"></div>
                      
                      <div className="w-16 h-16 md:w-20 md:h-20 bg-[#00b4d8] rounded-2xl flex items-center justify-center shrink-0 mb-6 md:mb-0 md:mr-8 shadow-md shadow-cyan-200">
                        <span className="text-white font-bold text-2xl md:text-3xl">{feature.number}</span>
                      </div>
                      
                      <div className="relative z-10 flex-1">
                        <h3 className="text-xl md:text-2xl font-bold text-gray-800 mb-2 md:mb-3">{feature.title}</h3>
                        <p className="text-gray-500 text-sm md:text-base leading-relaxed">
                          {feature.desc}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Slider Dots */}
            <div className="absolute bottom-0 left-0 right-0 flex justify-center gap-3">
              {features.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentSlide(index)}
                  className={`w-3 h-3 rounded-full transition-all duration-300 ${
                    currentSlide === index ? "bg-[#00b4d8] w-8" : "bg-gray-300 hover:bg-gray-400"
                  }`}
                  aria-label={`Go to slide ${index + 1}`}
                />
              ))}
            </div>
            
            {/* Navigation Arrows */}
            <button 
              onClick={() => setCurrentSlide((prev) => (prev - 1 + features.length) % features.length)}
              className="absolute -left-4 md:-left-12 top-[45%] -translate-y-1/2 w-10 h-10 md:w-12 md:h-12 bg-white/80 rounded-full shadow-lg flex items-center justify-center text-gray-600 hover:bg-[#00b4d8] hover:text-white transition-all z-10 opacity-70 hover:opacity-100"
            >
              &#10094;
            </button>
            <button 
              onClick={() => setCurrentSlide((prev) => (prev + 1) % features.length)}
              className="absolute -right-4 md:-right-12 top-[45%] -translate-y-1/2 w-10 h-10 md:w-12 md:h-12 bg-white/80 rounded-full shadow-lg flex items-center justify-center text-gray-600 hover:bg-[#00b4d8] hover:text-white transition-all z-10 opacity-70 hover:opacity-100"
            >
              &#10095;
            </button>
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
          
          {/* Established Info */}
          <div className="mt-16 pt-8 border-t border-white/10 text-center flex flex-col items-center justify-center gap-3">
            <span className="bg-[#1e293b] text-[#00b4d8] px-6 py-2 rounded-full text-sm font-bold border border-[#334155] inline-flex items-center gap-2 shadow-lg">
              <span>🏛️</span> স্থাপিত : ২০১৬
            </span>
            <p className="text-gray-500 text-xs mt-2">
              © {new Date().getFullYear()} রেডিয়েশন কোচিং। সর্বস্বত্ব সংরক্ষিত।
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;
