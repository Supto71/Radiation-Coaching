import { Link, useLocation } from 'react-router-dom';
import { useState } from 'react';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const navLinks = [
    { name: 'হোম পেইজ', path: '/' },
    { name: 'কোর্সসমূহ', path: '/courses' },
    { name: 'শিক্ষকমণ্ডলী', path: '/faculty' },
  ];

  return (
    <nav className="bg-white/80 backdrop-blur-md sticky top-0 z-50 shadow-sm border-b border-gray-100">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary">
          রেডিয়েশন কোচিং
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex space-x-8 items-center">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              to={link.path}
              className={`text-lg transition-colors font-medium ${
                location.pathname === link.path ? 'text-primary' : 'text-gray-600 hover:text-primary'
              }`}
            >
              {link.name}
            </Link>
          ))}
          <div className="hidden md:flex items-center space-x-4">
            <Link to="/login" className="text-gray-600 hover:text-primary font-medium transition-colors">
              লগইন
            </Link>
            <Link
              to="/exam"
              className="bg-gradient-to-r from-primary to-secondary text-white px-6 py-2.5 rounded-full shadow-lg shadow-primary/30 hover:shadow-primary/50 transition-all transform hover:-translate-y-0.5 font-medium"
            >
              পরীক্ষা দিন
            </Link>
          </div>
        </div>

        {/* Mobile Menu Button */}
        <button className="md:hidden text-gray-600" onClick={() => setIsOpen(!isOpen)}>
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
        <div className="md:hidden bg-white border-t border-gray-100 p-4 space-y-4 shadow-lg absolute w-full">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              to={link.path}
              className="block text-gray-600 hover:text-primary font-medium"
              onClick={() => setIsOpen(false)}
            >
              {link.name}
            </Link>
          ))}
          <Link
            to="/exam"
            className="block text-center bg-primary text-white px-4 py-2 rounded-md font-medium"
            onClick={() => setIsOpen(false)}
          >
            পরীক্ষা দিন
          </Link>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
