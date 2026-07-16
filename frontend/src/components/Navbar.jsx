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
      <div className="container mx-auto px-4 py-3.5 flex justify-between items-center">
        {/* Logo and Name */}
        <Link to="/" className="flex items-center gap-3">
          <img src="/logo.png" alt="Radiation Coaching" className="h-10 w-auto object-contain bg-white rounded-full p-0.5" />
          <span className="text-white font-extrabold text-lg sm:text-xl tracking-wide">
            রেডিয়েশন কোচিং
          </span>
        </Link>

        {/* Desktop Menu */}
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

        {/* Mobile Menu Button */}
        <button className="lg:hidden text-white" onClick={() => setIsOpen(!isOpen)}>
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            {isOpen ? (
               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            ) : (
               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="lg:hidden bg-[#0f172a] border-t border-white/10 p-4 space-y-4 shadow-lg absolute w-full">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              to={link.path}
              className="block text-gray-200 hover:text-white font-bold"
              onClick={() => setIsOpen(false)}
            >
              {link.name}
            </Link>
          ))}
          <Link
            to="/login"
            className="block text-center bg-[#00b4d8] text-white px-4 py-2 rounded-full font-bold shadow-md"
            onClick={() => setIsOpen(false)}
          >
            লগইন
          </Link>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
