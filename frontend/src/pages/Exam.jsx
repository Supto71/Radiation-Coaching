import { useState, useEffect, useRef } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import FormattedQuestion from '../components/FormattedQuestion';

const Exam = () => {
  const [searchParams] = useSearchParams();
  const examId = searchParams.get('id');
  const navigate = useNavigate();

  const [student, setStudent] = useState(null);
  const [exam, setExam] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);

  const [started, setStarted] = useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);
  const [cheatWarnings, setCheatWarnings] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [scoreResult, setScoreResult] = useState(null);

  // Security & Screen Lock states
  const [isScreenLocked, setIsScreenLocked] = useState(false);
  const [screenshotAlert, setScreenshotAlert] = useState(false);
  const [showExitConfirm, setShowExitConfirm] = useState(false);
  const lockTimeoutRef = useRef(null);

  useEffect(() => {
    if (!examId) {
      navigate('/student/dashboard');
      return;
    }

    const studentStr = localStorage.getItem('student');
    if (!studentStr) {
      alert('পরীক্ষা দিতে হলে আগে লগইন করুন।');
      navigate('/login');
      return;
    }
    const parsedStudent = JSON.parse(studentStr);
    setStudent(parsedStudent);

    const fetchExam = async () => {
      try {
        const classLevelQuery = parsedStudent.class_level ? `&class_level=${encodeURIComponent(parsedStudent.class_level)}` : '';
        const res = await fetch(`/api/dashboard/exams/${examId}?student_id=${parsedStudent.id}${classLevelQuery}`);
        if (res.ok) {
          const data = await res.json();
          setExam(data);
          
          // Parse questions options
          const parsedQuestions = (data.questions || []).map(q => ({
            ...q,
            options: typeof q.options === 'string' ? JSON.parse(q.options) : q.options
          }));
          setQuestions(parsedQuestions);
          setTimeLeft(data.duration_minutes * 60);
        } else {
          const errData = await res.json().catch(() => ({}));
          const message = errData.detail || 'পরীক্ষাটি পাওয়া যায়নি বা আপনি ইতিমধ্যে অংশগ্রহণ করেছেন।';
          alert(message);
          navigate('/student/dashboard');
        }
      } catch (err) {
        console.error(err);
        alert('পরীক্ষা লোড করতে সমস্যা হয়েছে।');
        navigate('/student/dashboard');
      } finally {
        setLoading(false);
      }
    };
    fetchExam();
  }, [examId, navigate]);

  // Timer effect during exam
  useEffect(() => {
    let timer;
    if (started && !submitted && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0 && started && !submitted) {
      handleSubmit();
    }
    return () => clearInterval(timer);
  }, [started, submitted, timeLeft]);

  // Tab switch / visibility change & anti-cheat during exam & review
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden) {
        if (started && !submitted) {
          setCheatWarnings(prev => prev + 1);
          alert("সতর্কতা: আপনি পরীক্ষার ট্যাব পরিবর্তন করেছেন! এটি চিটিং হিসেবে গণ্য হতে পারে।");
        } else if (submitted) {
          // When in review mode, blur screen immediately to prevent screen capture / snip tool
          setIsScreenLocked(true);
          try {
            navigator.clipboard?.writeText?.('');
          } catch (e) {
            console.warn(e);
          }
        }
      }
    };

    const handleWindowBlur = () => {
      if (submitted) {
        // Blur review when window loses focus (e.g. Snipping tool, Alt-Tab)
        setIsScreenLocked(true);
        try {
          navigator.clipboard?.writeText?.('');
        } catch (e) {
          console.warn(e);
        }
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    window.addEventListener("blur", handleWindowBlur);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      window.removeEventListener("blur", handleWindowBlur);
    };
  }, [started, submitted]);

  // Auto-submit on repeated cheat warnings during exam
  useEffect(() => {
    if (cheatWarnings >= 2 && started && !submitted && !submitting) {
      alert("আপনি একাধিকবার ট্যাব পরিবর্তন করেছেন। আপনার পরীক্ষাটি স্বয়ংক্রিয়ভাবে বাতিল ও সাবমিট করা হলো।");
      handleSubmit();
    }
  }, [cheatWarnings, started, submitted, submitting]);

  // Fullscreen change check during exam
  useEffect(() => {
    const handleFullscreenChange = () => {
      if (!document.fullscreenElement && started && !submitted) {
        setCheatWarnings(prev => prev + 1);
        alert("সতর্কতা: আপনি ফুলস্ক্রিন থেকে বের হয়েছেন! এটি চিটিং হিসেবে গণ্য হতে পারে।");
      }
    };
    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () => document.removeEventListener("fullscreenchange", handleFullscreenChange);
  }, [started, submitted]);

  // Strict Anti-Screenshot & Copy/Paste/Print & Shortcut blocking for BOTH exam and review mode
  useEffect(() => {
    if (!started && !submitted) return;

    const handleContextMenu = (e) => e.preventDefault();
    const handleCopyCutPaste = (e) => {
      e.preventDefault();
      try {
        navigator.clipboard?.writeText?.('');
      } catch (err) {
        console.warn(err);
      }
      alert("সতর্কতা: কপি, কাট বা পেস্ট করা সম্পূর্ণ নিষেধ!");
    };
    const handleSelectStart = (e) => e.preventDefault();
    const handleDragStart = (e) => e.preventDefault();

    const triggerScreenshotProtection = () => {
      try {
        navigator.clipboard?.writeText?.('');
      } catch (e) {
        console.warn(e);
      }
      setIsScreenLocked(true);
      setScreenshotAlert(true);
      if (lockTimeoutRef.current) clearTimeout(lockTimeoutRef.current);
      lockTimeoutRef.current = setTimeout(() => {
        setScreenshotAlert(false);
      }, 5000);
    };

    const handleKeyDown = (e) => {
      // Block PrintScreen
      if (e.key === 'PrintScreen' || e.keyCode === 44) {
        e.preventDefault();
        triggerScreenshotProtection();
        return;
      }

      // Block F12 (DevTools)
      if (e.key === 'F12') {
        e.preventDefault();
        alert("সতর্কতা: ইন্সপেক্ট বা ডেভেলপার টুল ব্যবহার নিষেধ!");
        return;
      }

      // Block Windows Snipping tool (Meta + Shift + S) or Mac (Meta + Shift + 3/4/5)
      if (
        (e.metaKey && e.shiftKey && ['S', 's', '3', '4', '5'].includes(e.key)) ||
        (e.ctrlKey && e.shiftKey && ['S', 's'].includes(e.key))
      ) {
        e.preventDefault();
        triggerScreenshotProtection();
        return;
      }

      // Block Devtools shortcuts (Ctrl+Shift+I, Ctrl+Shift+J, Ctrl+Shift+C)
      if (e.ctrlKey && e.shiftKey && ['I', 'i', 'J', 'j', 'C', 'c'].includes(e.key)) {
        e.preventDefault();
        alert("সতর্কতা: ডেভেলপার টুল ব্যবহার নিষেধ!");
        return;
      }

      // Block Ctrl/Cmd + (P, S, U, C, V, X, A)
      if ((e.ctrlKey || e.metaKey) && ['p', 'P', 's', 'S', 'u', 'U', 'c', 'C', 'v', 'V', 'x', 'X', 'a', 'A'].includes(e.key)) {
        e.preventDefault();
        if (['p', 'P'].includes(e.key)) {
          alert("সতর্কতা: প্রিন্ট করা সম্পূর্ণ নিষেধ!");
        } else if (['s', 'S'].includes(e.key)) {
          alert("সতর্কতা: সেভ করা সম্পূর্ণ নিষেধ!");
        } else if (['u', 'U'].includes(e.key)) {
          alert("সতর্কতা: সোর্স কোড দেখা নিষেধ!");
        } else {
          alert("সতর্কতা: কীবোর্ড শর্টকাট ব্যবহার নিষেধ!");
        }
        return;
      }

      // Block Alt + PrintScreen
      if (e.altKey && (e.key === 'PrintScreen' || e.keyCode === 44)) {
        e.preventDefault();
        triggerScreenshotProtection();
      }
    };

    const handleKeyUp = (e) => {
      // Windows often captures PrintScreen on keyup
      if (e.key === 'PrintScreen' || e.keyCode === 44) {
        triggerScreenshotProtection();
      }
    };

    document.addEventListener("contextmenu", handleContextMenu);
    document.addEventListener("copy", handleCopyCutPaste);
    document.addEventListener("cut", handleCopyCutPaste);
    document.addEventListener("paste", handleCopyCutPaste);
    document.addEventListener("selectstart", handleSelectStart);
    document.addEventListener("dragstart", handleDragStart);
    document.addEventListener("keydown", handleKeyDown);
    document.addEventListener("keyup", handleKeyUp);

    return () => {
      document.removeEventListener("contextmenu", handleContextMenu);
      document.removeEventListener("copy", handleCopyCutPaste);
      document.removeEventListener("cut", handleCopyCutPaste);
      document.removeEventListener("paste", handleCopyCutPaste);
      document.removeEventListener("selectstart", handleSelectStart);
      document.removeEventListener("dragstart", handleDragStart);
      document.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("keyup", handleKeyUp);
      if (lockTimeoutRef.current) clearTimeout(lockTimeoutRef.current);
    };
  }, [started, submitted]);

  // Warn before leaving tab during review
  useEffect(() => {
    const handleBeforeUnload = (e) => {
      if (submitted) {
        const msg = "সতর্কতা: আপনি একবার এই পেজ ত্যাগ করলে আর কখনোই উত্তরমালা দেখতে পারবেন না!";
        e.preventDefault();
        e.returnValue = msg;
        return msg;
      }
    };
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [submitted]);

  const handleOptionSelect = (questionId, optionIndex) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: optionIndex
    }));
  };

  const calculateScoreLocal = () => {
    let score = 0;
    let correct = 0;
    let wrong = 0;
    questions.forEach(q => {
      if (answers[q.id] !== undefined) {
        if (answers[q.id] === q.correct_answer) {
          score += 1;
          correct += 1;
        } else {
          score -= 0.25; // Negative marking
          wrong += 1;
        }
      }
    });
    return { score, correct, wrong };
  };

  const handleSubmit = async () => {
    if (submitting || submitted) return;
    setSubmitted(true);
    setSubmitting(true);
    const result = calculateScoreLocal();
    setScoreResult(result);

    const studentStr = localStorage.getItem('student');
    if (!studentStr) {
      setSubmitting(false);
      alert('লগইন সেশন পাওয়া যায়নি।');
      navigate('/login');
      return;
    }
    const currentStudent = JSON.parse(studentStr);

    try {
      const res = await fetch(`/api/dashboard/results?student_id=${currentStudent.id}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          exam_id: parseInt(examId),
          score: result.score,
          total_correct: result.correct,
          total_wrong: result.wrong
        })
      });
      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        alert(errData.detail || 'ফলাফল জমা দিতে সমস্যা হয়েছে।');
      }
    } catch (err) {
      console.error('Failed to submit result', err);
      alert('ফলাফল জমা দিতে সমস্যা হয়েছে।');
    } finally {
      setSubmitting(false);
    }
  };

  const handleConfirmExit = () => {
    setShowExitConfirm(false);
    navigate('/student/dashboard');
  };

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 text-gray-500 font-medium">
        পরীক্ষা লোড হচ্ছে...
      </div>
    );
  }

  if (!exam || questions.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 text-gray-500 font-medium">
        এই পরীক্ষার কোনো প্রশ্ন পাওয়া যায়নি।
      </div>
    );
  }

  // Initial Start Exam Screen
  if (!started) {
    return (
      <div className="min-h-[calc(100vh-80px)] bg-gray-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
          <div className="bg-gradient-to-r from-primary to-secondary p-6 text-white text-center">
            <h2 className="text-2xl font-bold mb-2">{exam.title}</h2>
            <p className="opacity-90">{exam.subject}</p>
          </div>
          <div className="p-8">
            <ul className="space-y-3 mb-8 text-gray-600 text-base">
              <li className="flex items-center"><span className="w-2.5 h-2.5 bg-primary rounded-full mr-3 flex-shrink-0"></span> মোট প্রশ্ন: {questions.length}টি</li>
              <li className="flex items-center"><span className="w-2.5 h-2.5 bg-primary rounded-full mr-3 flex-shrink-0"></span> সময়: {exam.duration_minutes} মিনিট</li>
              <li className="flex items-center"><span className="w-2.5 h-2.5 bg-red-500 rounded-full mr-3 flex-shrink-0"></span> প্রতিটি ভুল উত্তরের জন্য ০.২৫ নম্বর কাটা যাবে</li>
              <li className="flex items-center"><span className="w-2.5 h-2.5 bg-amber-500 rounded-full mr-3 flex-shrink-0"></span> পরীক্ষা শেষে একবারই মাত্র উত্তরমালা দেখা যাবে</li>
              <li className="flex items-center"><span className="w-2.5 h-2.5 bg-purple-500 rounded-full mr-3 flex-shrink-0"></span> স্ক্রিনশট বা কপি সম্পূর্ণ নিষিদ্ধ</li>
            </ul>
            <button 
              onClick={() => {
                setStarted(true);
                if (document.documentElement.requestFullscreen) {
                  document.documentElement.requestFullscreen().catch(err => console.log("Fullscreen request failed:", err));
                }
              }}
              className="w-full bg-primary text-white py-3.5 rounded-xl font-bold text-lg hover:bg-secondary transition-all shadow-lg shadow-primary/30 active:scale-[0.99]"
            >
              পরীক্ষা শুরু করুন
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Post-Submit Screen with One-Time Answer Review & Anti-Screenshot Protection
  if (submitted) {
    const totalQuestions = questions.length;
    const correctCount = scoreResult?.correct || 0;
    const wrongCount = scoreResult?.wrong || 0;
    const unansweredCount = totalQuestions - correctCount - wrongCount;

    return (
      <div className="min-h-screen bg-gray-100 py-8 px-4 relative select-none no-select secure-exam-content">
        {/* Anti-Screenshot Overlay / Screen Blur Lock */}
        {isScreenLocked && (
          <div className="fixed inset-0 z-50 bg-gray-900/90 backdrop-blur-xl flex items-center justify-center p-4">
            <div className="max-w-md w-full bg-white rounded-2xl p-6 text-center shadow-2xl border border-red-200">
              <div className="w-16 h-16 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-9 h-9" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">নিরাপত্তা সতর্কতা</h3>
              <p className="text-gray-600 mb-6 text-sm leading-relaxed">
                স্ক্রিনশট বা অন্য অ্যাপে যাওয়ার চেষ্টার কারণে কনটেন্ট সুরক্ষিত রাখতে স্ক্রিনটি সাময়িকভাবে লক করা হয়েছে। পরীক্ষা ও উত্তরমালার নিরাপত্তা রক্ষা করা বাধ্যতামূলক।
              </p>
              <button
                onClick={() => {
                  setIsScreenLocked(false);
                  setScreenshotAlert(false);
                }}
                className="w-full bg-primary text-white py-3 rounded-xl font-bold hover:bg-secondary transition-colors shadow-lg shadow-primary/20"
              >
                উত্তরমালা দেখতে ক্লিক করুন
              </button>
            </div>
          </div>
        )}

        {/* Screenshot Detected Toast */}
        {screenshotAlert && (
          <div className="fixed top-5 left-1/2 -translate-x-1/2 z-50 bg-red-600 text-white px-6 py-3 rounded-xl shadow-2xl flex items-center gap-3 animate-bounce">
            <svg className="w-6 h-6 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="font-bold text-sm">সতর্কতা: স্ক্রিনশট নেওয়া সম্পূর্ণ নিষেধ! ক্লিপবোর্ড মুছে দেওয়া হয়েছে।</span>
          </div>
        )}

        {/* Exit Confirmation Modal */}
        {showExitConfirm && (
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="max-w-md w-full bg-white rounded-2xl p-6 text-center shadow-2xl border border-gray-200">
              <div className="w-16 h-16 bg-amber-100 text-amber-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">আপনি কি ড্যাশবোর্ডে ফিরে যেতে চান?</h3>
              <p className="text-red-600 font-semibold text-sm mb-6 bg-red-50 p-3 rounded-xl border border-red-100 leading-relaxed">
                ⚠️ সতর্কবার্তা: একবার ড্যাশবোর্ডে ফিরে গেলে বা এই পেজ ত্যাগ করলে আপনি আর কখনোই এই পরীক্ষার প্রশ্ন ও উত্তরমালা দেখতে পাবেন না!
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowExitConfirm(false)}
                  className="flex-1 bg-gray-100 text-gray-800 py-3 rounded-xl font-semibold hover:bg-gray-200 transition-colors"
                >
                  না, উত্তরগুলো দেখবো
                </button>
                <button
                  onClick={handleConfirmExit}
                  className="flex-1 bg-red-600 text-white py-3 rounded-xl font-bold hover:bg-red-700 transition-colors shadow-lg shadow-red-600/20"
                >
                  হ্যাঁ, বের হয়ে যান
                </button>
              </div>
            </div>
          </div>
        )}

        <div className="max-w-4xl mx-auto space-y-6">
          {/* Header Score Summary Card */}
          <div className="bg-white rounded-2xl shadow-md border border-gray-100 overflow-hidden text-center">
            <div className="bg-gradient-to-r from-emerald-600 to-teal-600 p-6 sm:p-8 text-white">
              <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-3 backdrop-blur-sm">
                <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold mb-1">পরীক্ষা সম্পন্ন হয়েছে!</h2>
              <p className="text-emerald-100 text-sm sm:text-base">{exam.title} &bull; {exam.subject}</p>
            </div>

            <div className="p-6">
              {submitting ? (
                <p className="text-gray-500 mb-4 animate-pulse font-medium">রেজাল্ট সার্ভারে জমা হচ্ছে...</p>
              ) : scoreResult ? (
                <div>
                  <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 mb-6">
                    <div className="bg-sky-50 p-4 rounded-xl border border-sky-100">
                      <p className="text-sky-700 text-xs font-semibold mb-1">প্রাপ্ত নম্বর</p>
                      <p className="text-2xl sm:text-3xl font-bold text-primary">{scoreResult.score.toFixed(2)}</p>
                    </div>
                    <div className="bg-green-50 p-4 rounded-xl border border-green-100">
                      <p className="text-green-700 text-xs font-semibold mb-1">সঠিক উত্তর</p>
                      <p className="text-2xl sm:text-3xl font-bold text-green-600">{scoreResult.correct}</p>
                    </div>
                    <div className="bg-red-50 p-4 rounded-xl border border-red-100">
                      <p className="text-red-700 text-xs font-semibold mb-1">ভুল উত্তর</p>
                      <p className="text-2xl sm:text-3xl font-bold text-red-600">{scoreResult.wrong}</p>
                    </div>
                    <div className="bg-amber-50 p-4 rounded-xl border border-amber-100">
                      <p className="text-amber-700 text-xs font-semibold mb-1">উত্তর দেননি</p>
                      <p className="text-2xl sm:text-3xl font-bold text-amber-600">{unansweredCount}</p>
                    </div>
                    <div className="bg-purple-50 p-4 rounded-xl border border-purple-100 col-span-2 sm:col-span-1">
                      <p className="text-purple-700 text-xs font-semibold mb-1">মোট প্রশ্ন</p>
                      <p className="text-2xl sm:text-3xl font-bold text-purple-700">{totalQuestions}</p>
                    </div>
                  </div>

                  {/* One-Time Review Warning Alert */}
                  <div className="bg-gradient-to-r from-amber-50 to-orange-50 border-2 border-amber-300 rounded-2xl p-4 sm:p-5 text-left mb-6 flex items-start gap-4">
                    <div className="p-2.5 bg-amber-500 text-white rounded-xl flex-shrink-0 mt-0.5 shadow-md shadow-amber-500/20">
                      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                      </svg>
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-900 text-base mb-1">🔒 এককালীন উত্তরমালা ও সমাধান (One-Time Review)</h4>
                      <p className="text-gray-700 text-sm leading-relaxed">
                        আপনি শুধুমাত্র <strong>একবারই</strong> এই উত্তরমালা দেখতে পারবেন। এই পেজ থেকে বের হয়ে গেলে বা রিলোড দিলে <strong>আর কোনোভাবেই উত্তর দেখতে পাবেন না</strong>। শিক্ষার্থীদের স্বার্থে স্ক্রিনশট ও কপি নেওয়া সম্পূর্ণ নিষিদ্ধ ও প্রতিরোধকৃত।
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2 border-t border-gray-100">
                    <span className="text-xs text-gray-500 font-medium">
                      শিক্ষার্থী: {student?.name || 'Student'} ({student?.student_uid || student?.id})
                    </span>
                    <button 
                      onClick={() => setShowExitConfirm(true)}
                      className="w-full sm:w-auto bg-gray-900 text-white px-8 py-3 rounded-xl hover:bg-gray-800 font-bold text-sm transition-all shadow-md active:scale-95 flex items-center justify-center gap-2"
                    >
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                      </svg>
                      রিভিউ শেষ করে ড্যাশবোর্ডে ফিরে যান
                    </button>
                  </div>
                </div>
              ) : null}
            </div>
          </div>

          {/* Question-by-Question Solution Review Section */}
          <div className="relative">
            {/* Dynamic Watermark Background Grid */}
            <div className="absolute inset-0 pointer-events-none select-none overflow-hidden z-10 opacity-[0.04] flex flex-wrap justify-around items-center gap-20 p-8">
              {Array.from({ length: 15 }).map((_, i) => (
                <div key={i} className="text-xl sm:text-2xl font-black text-black transform -rotate-12 whitespace-nowrap">
                  {student?.name || 'STUDENT'} • {student?.student_uid || 'ID'} • Radiation Coaching
                </div>
              ))}
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between px-2">
                <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                  <span className="w-3 h-3 bg-primary rounded-full"></span>
                  প্রশ্ন ও সঠিক উত্তরমালা
                </h3>
                <span className="text-xs font-semibold text-gray-500 bg-white px-3 py-1.5 rounded-full border border-gray-200">
                  মোট {questions.length}টি প্রশ্ন
                </span>
              </div>

              {questions.map((q, idx) => {
                const userAns = answers[q.id];
                const correctAns = q.correct_answer;
                const isCorrect = userAns !== undefined && userAns === correctAns;
                const isWrong = userAns !== undefined && userAns !== correctAns;
                const isUnanswered = userAns === undefined;

                return (
                  <div 
                    key={q.id || idx}
                    className={`bg-white rounded-2xl p-5 sm:p-6 shadow-sm border transition-all ${
                      isCorrect 
                        ? 'border-green-200 ring-1 ring-green-100' 
                        : isWrong 
                        ? 'border-red-200 ring-1 ring-red-100' 
                        : 'border-amber-200 ring-1 ring-amber-100'
                    }`}
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4 pb-3 border-b border-gray-100">
                      <div className="text-base sm:text-lg font-semibold text-gray-900 flex items-start gap-2 max-w-full flex-1 min-w-0">
                        <span className="bg-gray-100 text-gray-800 text-xs px-2.5 py-1 rounded-lg font-bold mt-0.5 flex-shrink-0">
                          #{idx + 1}
                        </span>
                        <FormattedQuestion content={q.text} className="flex-1 font-semibold text-gray-900 leading-relaxed break-words whitespace-normal min-w-0 w-full" />
                      </div>

                      {/* Status Tag */}
                      <div className="flex-shrink-0">
                        {isCorrect && (
                          <span className="inline-flex items-center gap-1.5 bg-green-100 text-green-800 text-xs font-bold px-3 py-1.5 rounded-full">
                            <svg className="w-4 h-4 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                            আপনার উত্তর সঠিক (+১.০০)
                          </span>
                        )}
                        {isWrong && (
                          <span className="inline-flex items-center gap-1.5 bg-red-100 text-red-800 text-xs font-bold px-3 py-1.5 rounded-full">
                            <svg className="w-4 h-4 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                            আপনার উত্তর ভুল (-০.২৫)
                          </span>
                        )}
                        {isUnanswered && (
                          <span className="inline-flex items-center gap-1.5 bg-amber-100 text-amber-800 text-xs font-bold px-3 py-1.5 rounded-full">
                            <svg className="w-4 h-4 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01" />
                            </svg>
                            উত্তর দেওয়া হয়নি (০.০০)
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Options List */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {q.options.map((option, optIdx) => {
                        const isOptionCorrect = optIdx === correctAns;
                        const isOptionUserSelected = optIdx === userAns;

                        let styleClasses = "border-gray-200 bg-gray-50/50 text-gray-700";
                        let badge = null;

                        if (isOptionCorrect && isOptionUserSelected) {
                          // Correct & User picked it
                          styleClasses = "border-green-500 bg-green-50 text-green-900 font-semibold ring-2 ring-green-400/20";
                          badge = (
                            <span className="bg-green-600 text-white text-[11px] font-bold px-2 py-0.5 rounded-md flex items-center gap-1 flex-shrink-0">
                              ✓ আপনার সঠিক নির্বাচন
                            </span>
                          );
                        } else if (isOptionCorrect && !isOptionUserSelected) {
                          // Correct option (User missed it)
                          styleClasses = "border-emerald-500 bg-emerald-50 text-emerald-900 font-semibold ring-2 ring-emerald-400/20";
                          badge = (
                            <span className="bg-emerald-600 text-white text-[11px] font-bold px-2 py-0.5 rounded-md flex items-center gap-1 flex-shrink-0">
                              ✓ সঠিক উত্তর
                            </span>
                          );
                        } else if (isOptionUserSelected && !isOptionCorrect) {
                          // User selected wrong option
                          styleClasses = "border-red-500 bg-red-50 text-red-900 font-semibold ring-2 ring-red-400/20";
                          badge = (
                            <span className="bg-red-600 text-white text-[11px] font-bold px-2 py-0.5 rounded-md flex items-center gap-1 flex-shrink-0">
                              ✗ আপনার ভুল নির্বাচন
                            </span>
                          );
                        }

                        return (
                          <div
                            key={optIdx}
                            className={`p-3.5 sm:p-4 rounded-xl border-2 flex items-start justify-between gap-2 transition-all ${styleClasses}`}
                          >
                            <div className="flex items-start gap-2.5 min-w-0">
                              <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5 ${
                                isOptionCorrect 
                                  ? 'bg-green-600 text-white' 
                                  : isOptionUserSelected 
                                  ? 'bg-red-600 text-white' 
                                  : 'bg-gray-200 text-gray-600'
                              }`}>
                                {String.fromCharCode(65 + optIdx)}
                              </span>
                              <FormattedQuestion content={option} className="text-sm sm:text-base leading-relaxed break-words flex-1 min-w-0" />
                            </div>
                            {badge}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Bottom Exit Button */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
            <div>
              <h4 className="font-bold text-gray-900 text-base">রিভিউ শেষ করতে চান?</h4>
              <p className="text-gray-500 text-xs mt-0.5">
                ড্যাশবোর্ডে ফিরে গেলে এই উত্তরমালা পুনরায় দেখার সুযোগ আর থাকবে না।
              </p>
            </div>
            <button
              onClick={() => setShowExitConfirm(true)}
              className="w-full sm:w-auto bg-gray-900 text-white px-8 py-3 rounded-xl hover:bg-gray-800 font-bold text-sm transition-all shadow-md active:scale-95"
            >
              ড্যাশবোর্ডে ফিরে যান
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Active Exam Taking Screen
  const currentQ = questions[currentQuestionIndex];

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col select-none no-select secure-exam-content">
      {/* Top Header */}
      <div className="flex-shrink-0 bg-white border-b border-gray-100 px-4 py-3 flex justify-between items-center gap-4">
        <div className="min-w-0">
          <p className="text-sm text-gray-500 font-medium mb-1">প্রশ্ন {currentQuestionIndex + 1} / {questions.length}</p>
          <div className="w-40 sm:w-48 h-2 bg-gray-100 rounded-full overflow-hidden">
            <div 
              className="h-full bg-primary transition-all duration-300"
              style={{ width: `${((currentQuestionIndex + 1) / questions.length) * 100}%` }}
            ></div>
          </div>
        </div>
        
        <div className="flex-shrink-0 flex items-center text-accent bg-accent/10 px-3 sm:px-4 py-2 rounded-lg">
          <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span className="font-bold text-lg sm:text-xl tracking-wider">{formatTime(timeLeft)}</span>
        </div>
      </div>

      <div className="flex-1 flex flex-col container mx-auto px-4 py-4 max-w-4xl w-full">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 flex flex-col flex-1">
          <div className="p-5 sm:p-8 flex-1">
            <div className="text-lg sm:text-xl md:text-2xl font-semibold text-gray-900 mb-6 leading-relaxed break-words flex items-start gap-2 max-w-full min-w-0 w-full">
              <span className="text-primary font-bold flex-shrink-0">{currentQuestionIndex + 1}.</span>
              <FormattedQuestion content={currentQ.text} className="flex-1 font-semibold text-gray-900 leading-relaxed break-words whitespace-normal min-w-0 w-full" />
            </div>
            
            <div className="space-y-3">
              {currentQ.options.map((option, idx) => {
                const isSelected = answers[currentQ.id] === idx;
                return (
                  <label 
                    key={idx} 
                    className={`flex items-start p-4 sm:p-5 rounded-xl border-2 cursor-pointer transition-all ${
                      isSelected ? 'border-primary bg-primary/5' : 'border-gray-100 hover:border-gray-200 hover:bg-gray-50'
                    }`}
                  >
                    <div className={`mt-0.5 w-6 h-6 rounded-full border-2 flex items-center justify-center mr-3 sm:mr-4 flex-shrink-0 ${
                      isSelected ? 'border-primary' : 'border-gray-300'
                    }`}>
                      {isSelected && <div className="w-3 h-3 bg-primary rounded-full"></div>}
                    </div>
                    <FormattedQuestion 
                      content={option} 
                      className={`text-base sm:text-lg leading-relaxed break-words whitespace-normal min-w-0 flex-1 ${
                        isSelected ? 'text-primary font-medium' : 'text-gray-700'
                      }`} 
                    />
                    
                    <input 
                      type="radio" 
                      className="hidden"
                      checked={isSelected}
                      onChange={() => handleOptionSelect(currentQ.id, idx)}
                    />
                  </label>
                );
              })}
            </div>
          </div>
          
          <div className="flex-shrink-0 bg-gray-50 p-4 sm:p-6 border-t border-gray-100 flex justify-between items-center gap-3">
            <button
              disabled={currentQuestionIndex === 0}
              onClick={() => setCurrentQuestionIndex(prev => prev - 1)}
              className="px-4 sm:px-6 py-2.5 rounded-lg font-medium text-gray-600 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              পূর্ববর্তী
            </button>
            
            {currentQuestionIndex < questions.length - 1 ? (
              <button
                onClick={() => setCurrentQuestionIndex(prev => prev + 1)}
                className="px-6 sm:px-8 py-2.5 bg-gray-900 text-white rounded-lg font-medium hover:bg-gray-800 transition-colors shadow-lg shadow-gray-900/20"
              >
                পরবর্তী
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                className="px-6 sm:px-8 py-2.5 bg-green-600 text-white rounded-lg font-bold hover:bg-green-700 transition-colors shadow-lg shadow-green-600/30"
              >
                সাবমিট করুন
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Exam;
