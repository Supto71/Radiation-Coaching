import React from 'react';
import { Link } from 'react-router-dom';
import { FaPhoneAlt, FaMapMarkerAlt, FaEnvelope, FaFacebook, FaYoutube } from 'react-icons/fa';

const Footer = () => {
  return (
    <footer className="relative bg-[#070d1e] text-slate-400 border-t border-slate-800/80 pt-16 pb-12 overflow-hidden">
      {/* Ambient background glow */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-sky-600/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 right-10 w-80 h-80 bg-cyan-500/10 rounded-full blur-[100px] pointer-events-none" />

      <div className="container mx-auto px-4 sm:px-6 relative z-10 max-w-7xl">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
          
          {/* Brand Info */}
          <div className="space-y-4">
            <Link to="/" className="flex items-center gap-3 group">
              <div className="w-11 h-11 rounded-xl bg-gradient-to-tr from-sky-600 to-cyan-400 p-0.5 shadow-lg shadow-sky-500/20 group-hover:scale-105 transition-transform">
                <div className="w-full h-full bg-[#0b132b] rounded-[10px] flex items-center justify-center p-1.5">
                  <img src="/logo.png" alt="Radiation" className="w-full h-full object-contain" />
                </div>
              </div>
              <div>
                <span className="text-xl font-extrabold text-white tracking-wide block">রেডিয়েশন</span>
                <span className="text-[11px] text-sky-400 font-semibold tracking-wider uppercase block">Coaching Centre</span>
              </div>
            </Link>
            <p className="text-sm text-slate-400 leading-relaxed">
              সৃজনশীল শিক্ষা, অভিজ্ঞ শিক্ষকমণ্ডলী ও নিয়মানুবর্তিতার মাধ্যমে শিক্ষার্থীদের সেরা প্রস্তুতি নিশ্চিত করাই আমাদের মূল লক্ষ্য।
            </p>
            <div className="flex items-center gap-2 pt-1">
              <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-500/10 text-sky-400 border border-sky-500/20 text-xs font-bold">
                🏛️ স্থাপিত : ২০১৬
              </span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-base font-bold text-white mb-4 flex items-center gap-2">
              <span className="w-1.5 h-4 bg-sky-500 rounded-full" />
              প্রয়োজনীয় লিংক
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link to="/" className="hover:text-sky-400 transition-colors flex items-center gap-2">
                  <span className="text-sky-500 text-xs">›</span> হোম পেইজ
                </Link>
              </li>
              <li>
                <Link to="/courses" className="hover:text-sky-400 transition-colors flex items-center gap-2">
                  <span className="text-sky-500 text-xs">›</span> কোর্স ও সিলেবাস
                </Link>
              </li>
              <li>
                <Link to="/faculty" className="hover:text-sky-400 transition-colors flex items-center gap-2">
                  <span className="text-sky-500 text-xs">›</span> শিক্ষক পরিচিতি
                </Link>
              </li>
              <li>
                <Link to="/exam" className="hover:text-sky-400 transition-colors flex items-center gap-2">
                  <span className="text-sky-500 text-xs">›</span> অনলাইন এক্সাম
                </Link>
              </li>
              <li>
                <Link to="/login" className="hover:text-sky-400 transition-colors flex items-center gap-2">
                  <span className="text-sky-500 text-xs">›</span> স্টুডেন্ট ও টিচার লগইন
                </Link>
              </li>
            </ul>
          </div>

          {/* Branches */}
          <div>
            <h4 className="text-base font-bold text-white mb-4 flex items-center gap-2">
              <span className="w-1.5 h-4 bg-cyan-500 rounded-full" />
              আমাদের শাখাসমূহ
            </h4>
            <div className="space-y-3 text-sm">
              <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800">
                <p className="text-xs font-bold text-sky-400 mb-1 flex items-center gap-1.5">
                  <FaMapMarkerAlt /> প্রধান শাখা
                </p>
                <p className="text-xs text-slate-300">মিজমিজি মাদ্রাসা রোড, বুকস্ গার্ডেন সংলগ্ন</p>
              </div>
              <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800">
                <p className="text-xs font-bold text-cyan-400 mb-1 flex items-center gap-1.5">
                  <FaMapMarkerAlt /> দ্বিতীয় শাখা
                </p>
                <p className="text-xs text-slate-300">মিজমিজি পশ্চিম পাড়া স্কুল এন্ড কলেজ সংলগ্ন</p>
              </div>
            </div>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-base font-bold text-white mb-4 flex items-center gap-2">
              <span className="w-1.5 h-4 bg-emerald-500 rounded-full" />
              যোগাযোগ ও সহায়তা
            </h4>
            <ul className="space-y-3 text-sm">
              <li className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-sky-500/10 text-sky-400 flex items-center justify-center shrink-0">
                  <FaPhoneAlt className="text-xs" />
                </div>
                <div>
                  <span className="text-xs text-slate-400 block">সরাসরি কল করুন</span>
                  <a href="tel:01676924816" className="font-sans text-white hover:text-sky-400 font-bold transition-colors">
                    01676924816
                  </a>
                </div>
              </li>
              <li className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center shrink-0">
                  <FaEnvelope className="text-xs" />
                </div>
                <div>
                  <span className="text-xs text-slate-400 block">ইমেইল ঠিকানা</span>
                  <span className="text-xs text-slate-300">info@radiationcoaching.com</span>
                </div>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-8 mt-8 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© {new Date().getFullYear()} রেডিয়েশন কোচিং সেন্টার। সর্বস্বত্ব সংরক্ষিত।</p>
          <div className="flex items-center gap-4">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-800/80 text-sky-400 border border-slate-700/50">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" /> PWA Enabled Web App
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
