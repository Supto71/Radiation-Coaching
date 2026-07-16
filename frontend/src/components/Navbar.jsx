import { Link, useLocation } from 'react-router-dom';
import { useState } from 'react';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const navLinks = [
    { name: 'হোম', path: '/' },
    { name: 'কোর্সসমূহ', path: '/courses' },
    { name: 'নোটিশ বোর্ড', path: '#' },
    { name: 'আমাদের সম্পর্কে', path: '#' },
    { name: 'যোগাযোগ', path: '#' },
  ];

  return (
    <nav className="bg-[#115b76] sticky top-0 z-50 shadow-md">
      <div className="container mx-auto px-4 py-3.5 flex justify-between items-center">
        {/* Logo and Name */}
        <Link to="/" className="flex items-center gap-3">
          <img src="/logo.png" alt="Radiation Coaching" className="h-10 w-auto object-contain bg-white rounded-full p-0.5" />
          <span className="text-white font-extrabold text-xl tracking-wide hidden sm:block">
            রেডিয়েশন কোচিং জোন
          </span>
        </Link>

        {/* Desktop Menu */}
        <div className="hidden lg:flex space-x-7 items-center">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              to={link.path}
              className={`text-[15px] font-bold transition-colors ${
                location.pathname === link.path ? 'text-white' : 'text-gray-200 hover:text-white'
              }`}
            >
              {link.name}
            </Link>
          ))}
          <div className="hidden lg:flex items-center pl-2">
            <Link
              to="/login"
              className="bg-[#00b4d8] text-white px-5 py-2 rounded-full shadow-md hover:bg-[#0096b4] transition-all transform hover:-translate-y-0.5 font-bold text-[15px]"
            >
              লগইন/রেজিস্টার
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
        <div className="lg:hidden bg-[#0e4a60] border-t border-[#135d79] p-4 space-y-4 shadow-lg absolute w-full">
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
            লগইন/রেজিস্টার
          </Link>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
