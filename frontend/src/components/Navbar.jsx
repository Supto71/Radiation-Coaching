import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { 
  FaBars, 
  FaTimes, 
  FaHome, 
  FaBookOpen, 
  FaUserTie, 
  FaLaptopCode, 
  FaTachometerAlt, 
  FaSignOutAlt, 
  FaSignInAlt 
} from 'react-icons/fa';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  // Check login state
  const isStudent = !!localStorage.getItem('student');
  const staffRole = localStorage.getItem('staff_role');
  const teacherName = localStorage.getItem('teacher_name');
  const studentData = localStorage.getItem('student') ? JSON.parse(localStorage.getItem('student')) : null;
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

  const getUserDisplayName = () => {
    if (isStudent && studentData) return studentData.name || 'শিক্ষার্থী';
    if (staffRole === 'teacher') return teacherName || 'শিক্ষক';
    if (staffRole === 'admin') return 'অ্যাডমিন';
    return '';
  };

  const navLinks = [
    { name: 'হোম', path: '/', icon: FaHome },
    { name: 'কোর্সসমূহ', path: '/courses', icon: FaBookOpen },
    { name: 'শিক্ষকমণ্ডলী', path: '/faculty', icon: FaUserTie },
    { name: 'অনলাইন এক্সাম', path: '/exam', icon: FaLaptopCode },
  ];

  return (
    <>
      <header className="sticky top-0 z-40 w-full backdrop-blur-xl bg-white/90 border-b border-slate-200/80 shadow-[0_2px_15px_rgba(0,0,0,0.03)] transition-all">
        <div className="container mx-auto px-4 sm:px-6 h-16 sm:h-20 flex justify-between items-center relative">
          
          {/* Left: Mobile Hamburger + Brand Logo */}
          <div className="flex items-center gap-3 sm:gap-4">
            <button 
              aria-label="ন্যাভিগেশন মেনু খুলুন"
              className="lg:hidden text-slate-700 hover:text-sky-600 p-2 rounded-xl bg-slate-100 hover:bg-slate-200 active:scale-95 transition-all"
              onClick={() => setIsOpen(!isOpen)}
            >
              <FaBars className="w-5 h-5" />
            </button>

            <Link to="/" className="flex items-center gap-3 group">
              <div className="relative w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-gradient-to-tr from-sky-600 to-cyan-500 p-0.5 shadow-md shadow-sky-500/20 group-hover:scale-105 transition-all">
                <div className="w-full h-full bg-white rounded-[10px] flex items-center justify-center p-1">
                  <img 
                    src="/logo.png" 
                    alt="Radiation Coaching" 
                    className="w-full h-full object-contain" 
                  />
                </div>
              </div>
              <div className="flex flex-col">
                <span className="text-slate-900 font-extrabold text-base sm:text-xl tracking-tight leading-none group-hover:text-sky-600 transition-colors">
                  রেডিয়েশন <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-600 to-cyan-500">কোচিং</span>
                </span>
                <span className="text-[10px] sm:text-xs text-slate-500 font-medium tracking-wide">
                  শিক্ষায় আধুনিকতার ছোঁয়া
                </span>
              </div>
            </Link>
          </div>

          {/* Desktop Nav Links */}
          <nav className="hidden lg:flex items-center gap-1.5 bg-slate-100/80 p-1.5 rounded-full border border-slate-200 shadow-inner">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive = location.pathname === link.path;
              return (
                <Link
                  key={link.name}
                  to={link.path}
                  className={`flex items-center gap-2 text-sm font-semibold px-4 py-2 rounded-full transition-all duration-200 ${
                    isActive 
                      ? 'bg-gradient-to-r from-sky-600 to-cyan-500 text-white shadow-md shadow-sky-500/25' 
                      : 'text-slate-600 hover:text-sky-600 hover:bg-white'
                  }`}
                >
                  <Icon className={`text-xs ${isActive ? 'text-white' : 'text-sky-500'}`} />
                  {link.name}
                </Link>
              );
            })}
          </nav>

          {/* Right Action: Auth & Profile */}
          <div className="flex items-center gap-3">
            {isLoggedIn ? (
              <div className="flex items-center gap-2">
                <Link
                  to={getDashboardPath()}
                  className="flex items-center gap-2 bg-gradient-to-r from-sky-600 to-cyan-500 hover:from-sky-500 hover:to-cyan-400 text-white px-3.5 sm:px-5 py-2 sm:py-2.5 rounded-xl font-bold text-xs sm:text-sm shadow-md shadow-sky-500/20 active:scale-95 transition-all"
                >
                  <FaTachometerAlt className="text-sm" />
                  <span className="hidden sm:inline">{getUserDisplayName() || 'ড্যাশবোর্ড'}</span>
                  <span className="sm:hidden">ড্যাশবোর্ড</span>
                </Link>
                <button
                  onClick={handleLogout}
                  className="hidden sm:flex items-center gap-1.5 bg-slate-100 hover:bg-rose-50 text-slate-600 hover:text-rose-600 px-3.5 py-2 sm:py-2.5 rounded-xl font-semibold text-xs sm:text-sm border border-slate-200 hover:border-rose-200 transition-all"
                  title="লগআউট"
                >
                  <FaSignOutAlt className="text-xs" />
                  <span>লগআউট</span>
                </button>
              </div>
            ) : (
              <Link
                to="/login"
                className="flex items-center gap-2 bg-gradient-to-r from-sky-600 to-cyan-500 hover:from-sky-500 hover:to-cyan-400 text-white px-4 sm:px-6 py-2 sm:py-2.5 rounded-xl font-bold text-xs sm:text-sm shadow-md shadow-sky-500/25 hover:shadow-sky-500/40 active:scale-95 transition-all"
              >
                <FaSignInAlt className="text-xs" />
                <span>লগইন করুন</span>
              </Link>
            )}
          </div>

        </div>
      </header>

      {/* MOBILE SLIDE-OVER DRAWER (Light Theme) */}
      <div 
        className={`lg:hidden fixed inset-y-0 left-0 w-[300px] max-w-[85vw] bg-white z-50 border-r border-slate-200 shadow-2xl transform transition-transform duration-300 ease-in-out flex flex-col justify-between ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div>
          {/* Drawer Header */}
          <div className="p-4 border-b border-slate-100 bg-slate-50 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-sky-600 to-cyan-500 p-0.5">
                <div className="w-full h-full bg-white rounded-[10px] flex items-center justify-center p-1">
                  <img src="/logo.png" alt="Logo" className="w-full h-full object-contain" />
                </div>
              </div>
              <div>
                <h3 className="text-slate-900 font-bold text-sm leading-tight">রেডিয়েশন কোচিং</h3>
                <span className="text-[11px] text-sky-600 font-medium">নেভিগেশন মেনু</span>
              </div>
            </div>
            <button 
              onClick={() => setIsOpen(false)}
              className="text-slate-400 hover:text-slate-700 p-2 rounded-xl hover:bg-slate-200/60 transition-colors"
              aria-label="মেনু বন্ধ করুন"
            >
              <FaTimes className="w-5 h-5" />
            </button>
          </div>

          {/* User Card if Logged In */}
          {isLoggedIn && (
            <div className="m-4 p-3.5 rounded-2xl bg-sky-50 border border-sky-100 flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-sky-600 to-cyan-500 flex items-center justify-center text-white font-bold text-sm shadow">
                {getUserDisplayName().charAt(0) || 'U'}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-slate-900 truncate">{getUserDisplayName()}</p>
                <p className="text-xs text-sky-600 font-medium capitalize">{isStudent ? 'শিক্ষার্থী' : staffRole}</p>
              </div>
            </div>
          )}

          {/* Nav Links */}
          <div className="p-4 space-y-2">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive = location.pathname === link.path;
              return (
                <Link
                  key={link.name}
                  to={link.path}
                  className={`flex items-center gap-3.5 px-4 py-3 rounded-xl font-bold text-sm transition-all ${
                    isActive 
                      ? 'bg-gradient-to-r from-sky-600 to-cyan-500 text-white shadow-md shadow-sky-500/20' 
                      : 'text-slate-700 hover:bg-slate-100'
                  }`}
                  onClick={() => setIsOpen(false)}
                >
                  <Icon className={`text-base ${isActive ? 'text-white' : 'text-sky-600'}`} />
                  {link.name}
                </Link>
              );
            })}

            {isLoggedIn && (
              <Link
                to={getDashboardPath()}
                className={`flex items-center gap-3.5 px-4 py-3 rounded-xl font-bold text-sm transition-all ${
                  location.pathname.includes('dashboard')
                    ? 'bg-gradient-to-r from-sky-600 to-cyan-500 text-white shadow-md shadow-sky-500/20'
                    : 'text-sky-600 bg-sky-50 hover:bg-sky-100'
                }`}
                onClick={() => setIsOpen(false)}
              >
                <FaTachometerAlt className="text-base" />
                আমার ড্যাশবোর্ড
              </Link>
            )}
          </div>
        </div>

        {/* Drawer Bottom Actions */}
        <div className="p-4 border-t border-slate-100 bg-slate-50 space-y-2">
          {isLoggedIn ? (
            <button
              onClick={handleLogout}
              className="w-full bg-rose-600 hover:bg-rose-700 text-white py-3 rounded-xl font-bold text-sm transition-all shadow-md flex items-center justify-center gap-2 active:scale-95"
            >
              <FaSignOutAlt />
              <span>লগআউট করুন</span>
            </button>
          ) : (
            <Link
              to="/login"
              onClick={() => setIsOpen(false)}
              className="w-full bg-gradient-to-r from-sky-600 to-cyan-500 hover:from-sky-500 hover:to-cyan-400 text-white py-3 rounded-xl font-bold text-sm transition-all shadow-md shadow-sky-500/25 flex items-center justify-center gap-2 text-center active:scale-95"
            >
              <FaSignInAlt />
              <span>লগইন করুন</span>
            </Link>
          )}
        </div>
      </div>

      {/* Backdrop overlay */}
      {isOpen && (
        <div 
          className="lg:hidden fixed inset-0 bg-slate-900/40 z-40 backdrop-blur-xs transition-opacity"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  );
};

export default Navbar;
