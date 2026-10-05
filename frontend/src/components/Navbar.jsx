import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  // Check login state
  const isStudent = !!localStorage.getItem('student');
  const staffRole = localStorage.getItem('staff_role');
  const isLoggedIn = isStudent || !!staffRole;

  // Auto close menu on route change
  useEffect(() => {
    setIsOpen(false);
  }, [location.pathname]);

  // Prevent background scroll when mobile drawer is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const handleLogout = () => {
    localStorage.removeItem('student');
    localStorage.removeItem('staff_role');
    localStorage.removeItem('teacher_name');
    localStorage.removeItem('teacher_id');
    localStorage.removeItem('teacher_image');
    localStorage.removeItem('admin');
    setIsOpen(false);
    navigate('/login');
  };

  const getDashboardPath = () => {
    if (isStudent) return '/student/dashboard';
    if (staffRole === 'admin') return '/admin/dashboard';
    if (staffRole === 'teacher') return '/teacher/dashboard';
    return '/login';
  };

  const navLinks = [
    { name: 'হোম', path: '/' },
    { name: 'কোর্সসমূহ', path: '/courses' },
    { name: 'শিক্ষকমন্ডলী', path: '/faculty' },
  ];

  return (
    <>
      <nav className="bg-[#0f172a] sticky top-0 z-40 shadow-lg border-b border-white/10 backdrop-blur-md bg-opacity-95">
        <div className="container mx-auto px-3 sm:px-6 py-2.5 sm:py-3.5 flex justify-between items-center relative">
          
          {/* Left Side: Hamburger (Mobile) + Brand Logo */}
          <div className="flex items-center gap-2 sm:gap-4">
            {/* Hamburger Button (Mobile only) */}
            <button 
              aria-label="Toggle navigation menu"
              className="lg:hidden text-white hover:text-[#00b4d8] focus:outline-none p-1.5 rounded-lg active:bg-white/10 transition-colors"
              onClick={() => setIsOpen(!isOpen)}
            >
              <svg className="w-6 h-6 sm:w-7 sm:h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>

            {/* Logo */}
            <Link to="/" className="flex items-center gap-2 sm:gap-2.5">
              <img 
                src="/logo.png" 
                alt="Radiation Coaching" 
                className="h-8 sm:h-10 w-auto object-contain bg-white rounded-full p-0.5 shadow-sm" 
              />
              <span className="text-white font-extrabold text-sm sm:text-lg md:text-xl tracking-tight leading-none">
                রেডিয়েশন <span className="text-[#00b4d8]">কোচিং</span>
              </span>
            </Link>
          </div>

          {/* Right Side: Quick Action (Mobile only) */}
          <div className="flex items-center gap-1.5 sm:gap-2 lg:hidden">
            {isLoggedIn ? (
              <Link
                to={getDashboardPath()}
                className="bg-[#00b4d8] hover:bg-[#0096b4] text-white px-3 py-1.5 rounded-full font-bold text-xs sm:text-sm shadow-md transition-all active:scale-95 flex items-center gap-1"
              >
                <span>ড্যাশবোর্ড</span>
              </Link>
            ) : (
              <Link
                to="/login"
                className="bg-red-600 hover:bg-red-700 text-white px-3.5 py-1.5 rounded-full font-bold text-xs sm:text-sm shadow-md transition-all active:scale-95"
              >
                লগইন
              </Link>
            )}
          </div>

          {/* DESKTOP NAV (hidden on mobile, visible on lg) */}
          <div className="hidden lg:flex space-x-2 items-center">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                className={`text-[15px] font-bold px-4 py-2 rounded-full transition-all duration-200 ${
                  location.pathname === link.path 
                    ? 'bg-white/20 text-white shadow-inner' 
                    : 'text-gray-200 hover:bg-white/10 hover:text-white'
                }`}
              >
                {link.name}
              </Link>
            ))}

            <div className="hidden lg:flex items-center pl-4 gap-2">
              {isLoggedIn ? (
                <>
                  <Link
                    to={getDashboardPath()}
                    className="bg-gradient-to-r from-[#00b4d8] to-[#0096b4] text-white px-5 py-2 rounded-full shadow-md font-bold text-[14px] hover:shadow-cyan-500/20 transition-all hover:-translate-y-0.5"
                  >
                    ড্যাশবোর্ড
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-full shadow-md font-bold text-[14px] transition-all hover:-translate-y-0.5"
                  >
                    লগআউট
                  </button>
                </>
              ) : (
                <Link
                  to="/login"
                  className="bg-gradient-to-r from-[#00b4d8] to-[#0096b4] text-white px-6 py-2.5 rounded-full shadow-lg font-bold text-[15px] hover:shadow-cyan-500/20 transition-all hover:-translate-y-0.5"
                >
                  লগইন
                </Link>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* MOBILE SLIDE-OVER DRAWER */}
      <div 
        className={`lg:hidden fixed inset-y-0 left-0 w-[280px] max-w-[85vw] bg-[#0f172a] z-50 border-r border-white/10 shadow-2xl transform transition-transform duration-300 ease-in-out flex flex-col justify-between ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Drawer Header */}
        <div>
          <div className="p-4 border-b border-white/10 flex items-center justify-between bg-black/20">
            <div className="flex items-center gap-2.5">
              <img src="/logo.png" alt="Logo" className="h-8 w-8 object-contain bg-white rounded-full p-0.5" />
              <div>
                <h3 className="text-white font-bold text-sm leading-tight">রেডিয়েশন কোচিং</h3>
                <p className="text-[#00b4d8] text-[10px] font-medium">মেনু অপশন</p>
              </div>
            </div>
            <button 
              onClick={() => setIsOpen(false)}
              className="text-gray-400 hover:text-white p-1 rounded-lg hover:bg-white/10 transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Nav Links */}
          <div className="p-4 space-y-1.5">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                className={`flex items-center px-4 py-3 rounded-xl font-bold text-base transition-all ${
                  location.pathname === link.path 
                    ? 'bg-[#00b4d8] text-white shadow-md' 
                    : 'text-gray-300 hover:bg-white/5 hover:text-white'
                }`}
                onClick={() => setIsOpen(false)}
              >
                {link.name}
              </Link>
            ))}

            {isLoggedIn && (
              <Link
                to={getDashboardPath()}
                className={`flex items-center px-4 py-3 rounded-xl font-bold text-base transition-all ${
                  location.pathname.includes('dashboard')
                    ? 'bg-[#00b4d8] text-white shadow-md'
                    : 'text-[#00b4d8] bg-[#00b4d8]/10 hover:bg-[#00b4d8]/20'
                }`}
                onClick={() => setIsOpen(false)}
              >
                📊 আমার ড্যাশবোর্ড
              </Link>
            )}
          </div>
        </div>

        {/* Drawer Footer / Auth Actions */}
        <div className="p-4 border-t border-white/10 bg-black/20 space-y-2">
          {isLoggedIn ? (
            <button
              onClick={handleLogout}
              className="w-full bg-red-600/90 hover:bg-red-600 text-white py-3 rounded-xl font-bold text-sm transition-colors shadow-md flex items-center justify-center gap-2"
            >
              <span>🚪</span> লগআউট করুন
            </button>
          ) : (
            <Link
              to="/login"
              onClick={() => setIsOpen(false)}
              className="w-full bg-gradient-to-r from-[#00b4d8] to-[#0096b4] text-white py-3 rounded-xl font-bold text-sm transition-all shadow-md flex items-center justify-center gap-2 text-center"
            >
              <span>🔐</span> লগইন করুন
            </Link>
          )}
        </div>
      </div>

      {/* Backdrop overlay for mobile drawer */}
      {isOpen && (
        <div 
          className="lg:hidden fixed inset-0 bg-black/60 z-40 backdrop-blur-xs transition-opacity"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  );
};

export default Navbar;
