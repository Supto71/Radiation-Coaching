import { Link, useLocation } from 'react-router-dom';
import { useState } from 'react';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const navLinks = [
    { name: 'হোম', path: '/' },
    { name: 'কোর্সসমূহ', path: '/courses' },
    { name: 'শিক্ষকমন্ডলী', path: '/faculty' },
  ];

  return (
    <nav className="bg-[#0f172a] sticky top-0 z-50 shadow-md border-b border-white/10">
      <div className="container mx-auto px-4 py-3.5 flex justify-between items-center relative">
        {/* Left Side: Menu + Logo */}
        <div className="flex items-center gap-1 sm:gap-3">
          {/* Three Dot Menu (Mobile only) */}
          <button 
            className="lg:hidden text-white hover:text-[#00b4d8] transition-colors p-1 sm:p-2 -ml-1 sm:-ml-2"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? (
              <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
              </svg>
            )}
          </button>

          {/* Logo (Visible on all screens next to menu) */}
          <Link to="/" className="flex items-center gap-2">
            <img src="/logo.png" alt="Radiation Coaching" className="h-8 sm:h-10 w-auto object-contain bg-white rounded-full p-0.5" />
            <span className="text-white font-extrabold text-[14px] sm:text-xl tracking-wide">
              রেডিয়েশন কোচিং
            </span>
          </Link>
        </div>

        {/* Right Side: Red Login Button (Mobile only) */}
        <div className="flex items-center lg:hidden">
          <Link
            to="/login"
            className="relative overflow-hidden group bg-red-600 text-white px-5 py-2 sm:px-6 sm:py-2.5 rounded-full shadow-lg transition-all transform hover:-translate-y-0.5 hover:shadow-[0_0_20px_rgba(220,38,38,0.5)] font-bold text-[14px] sm:text-[15px]"
          >
            <span className="relative z-10">লগইন</span>
            <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
          </Link>
        </div>

        {/* DESKTOP VIEW ELEMENTS (hidden on mobile, visible on lg) */}
        <div className="hidden lg:flex space-x-2 items-center">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              to={link.path}
              className={`text-[15px] font-bold px-4 py-2 rounded-full transition-all duration-300 ${
                location.pathname === link.path 
                  ? 'bg-white/20 text-white shadow-inner' 
                  : 'text-gray-200 hover:bg-white/10 hover:text-white'
              }`}
            >
              {link.name}
            </Link>
          ))}
          <div className="hidden lg:flex items-center pl-4">
            <Link
              to="/login"
              className="relative overflow-hidden group bg-gradient-to-r from-[#00b4d8] to-[#0096b4] text-white px-6 py-2.5 rounded-full shadow-lg transition-all transform hover:-translate-y-0.5 hover:shadow-[0_0_20px_rgba(0,180,216,0.4)] font-bold text-[15px]"
            >
              <span className="relative z-10">লগইন</span>
              <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
            </Link>
          </div>
        </div>
      </div>

      {/* Vertical Menu Dropdown (Mobile only) */}
      <div 
        className={`lg:hidden absolute top-full left-0 w-64 bg-[#0f172a] h-screen border-r border-white/10 shadow-2xl transform transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}
      >
        <div className="flex flex-col p-6 space-y-4">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              to={link.path}
              className={`text-lg font-bold px-4 py-3 rounded-xl transition-all duration-300 ${
                location.pathname === link.path 
                  ? 'bg-white/10 text-[#00b4d8]' 
                  : 'text-gray-200 hover:bg-white/5 hover:text-white'
              }`}
              onClick={() => setIsOpen(false)}
            >
              {link.name}
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
