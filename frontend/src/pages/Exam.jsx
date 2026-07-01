import { useState, useEffect } from 'react';

const Exam = () => {
  const [started, setStarted] = useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [timeLeft, setTimeLeft] = useState(30 * 60); // 30 minutes in seconds

  const questions = [
    {
      id: 1,
      text: 'আলোর বেগ কত?',
      options: ['3 x 10^8 m/s', '3 x 10^5 m/s', '3 x 10^10 m/s', '3 x 10^6 m/s'],
      correctAnswer: 0
    },
    {
      id: 2,
      text: 'মানবদেহে ক্রোমোজোমের সংখ্যা কত?',
      options: ['২২ জোড়া', '২৩ জোড়া', '২৪ জোড়া', '২১ জোড়া'],
      correctAnswer: 1
    },
    {
      id: 3,
      text: 'H2SO4 এর আণবিক ভর কত?',
      options: ['96', '98', '100', '102'],
      correctAnswer: 1
    }
  ];

  const [cheatWarnings, setCheatWarnings] = useState(0);

  useEffect(() => {
    let timer;
    if (started && !submitted && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0 && !submitted) {
      setSubmitted(true);
    }
    return () => clearInterval(timer);
  }, [started, submitted, timeLeft]);

  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden && started && !submitted) {
        setCheatWarnings(prev => prev + 1);
        alert("সতর্কতা: আপনি পরীক্ষার ট্যাব পরিবর্তন করেছেন! এটি চিটিং হিসেবে গণ্য হতে পারে।");
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => document.removeEventListener("visibilitychange", handleVisibilityChange);
  }, [started, submitted]);

  const handleOptionSelect = (questionId, optionIndex) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: optionIndex
    }));
  };

  const calculateScore = () => {
    let score = 0;
    let correct = 0;
    let wrong = 0;
    
    questions.forEach(q => {
      if (answers[q.id] !== undefined) {
        if (answers[q.id] === q.correctAnswer) {
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

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  if (!started) {
    return (
      <div className="min-h-[calc(100vh-80px)] bg-gray-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="bg-gradient-to-r from-primary to-secondary p-6 text-white text-center">
            <h2 className="text-2xl font-bold mb-2">মডেল টেস্ট - ১</h2>
            <p className="opacity-90">পদার্থবিজ্ঞান, রসায়ন ও জীববিজ্ঞান</p>
          </div>
          <div className="p-8">
            <ul className="space-y-3 mb-8 text-gray-600">
              <li className="flex items-center"><span className="w-2 h-2 bg-primary rounded-full mr-3"></span> মোট প্রশ্ন: {questions.length}টি</li>
              <li className="flex items-center"><span className="w-2 h-2 bg-primary rounded-full mr-3"></span> সময়: ৩০ মিনিট</li>
              <li className="flex items-center"><span className="w-2 h-2 bg-red-500 rounded-full mr-3"></span> প্রতিটি ভুল উত্তরের জন্য ০.২৫ নম্বর কাটা যাবে</li>
            </ul>
            <button 
              onClick={() => setStarted(true)}
              className="w-full bg-primary text-white py-3 rounded-lg font-bold text-lg hover:bg-secondary transition-colors shadow-lg shadow-primary/30"
            >
              পরীক্ষা শুরু করুন
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (submitted) {
    const result = calculateScore();
    return (
      <div className="min-h-[calc(100vh-80px)] bg-gray-50 flex items-center justify-center p-4">
        <div className="max-w-lg w-full bg-white rounded-2xl shadow-xl overflow-hidden text-center">
          <div className="bg-gradient-to-r from-green-500 to-green-600 p-8 text-white">
             <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4 backdrop-blur-sm">
                <svg className="w-10 h-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
             </div>
            <h2 className="text-3xl font-bold mb-2">পরীক্ষা সম্পন্ন হয়েছে!</h2>
          </div>
          
          <div className="p-8">
            <div className="grid grid-cols-4 gap-4 mb-8">
              <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
                <p className="text-gray-500 text-sm mb-1">মোট প্রাপ্ত নম্বর</p>
                <p className="text-3xl font-bold text-primary">{result.score}</p>
              </div>
              <div className="bg-green-50 p-4 rounded-xl border border-green-100">
                <p className="text-green-600 text-sm mb-1">সঠিক উত্তর</p>
                <p className="text-3xl font-bold text-green-600">{result.correct}</p>
              </div>
              <div className="bg-red-50 p-4 rounded-xl border border-red-100">
                <p className="text-red-600 text-sm mb-1">ভুল উত্তর</p>
                <p className="text-3xl font-bold text-red-600">{result.wrong}</p>
              </div>
              <div className="bg-orange-50 p-4 rounded-xl border border-orange-100">
                <p className="text-orange-600 text-sm mb-1">চিটিং ওয়ার্নিং</p>
                <p className="text-3xl font-bold text-orange-600">{cheatWarnings}</p>
              </div>
            </div>
            
            <button 
              onClick={() => window.location.reload()}
              className="bg-gray-900 text-white px-8 py-3 rounded-lg hover:bg-gray-800 transition-colors"
            >
              আবার চেষ্টা করুন
            </button>
          </div>
        </div>
      </div>
    );
  }

  const currentQ = questions[currentQuestionIndex];

  return (
    <div className="min-h-[calc(100vh-80px)] bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Header / Timer */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-8 flex justify-between items-center sticky top-24 z-10">
          <div>
            <p className="text-sm text-gray-500 font-medium mb-1">প্রশ্ন {currentQuestionIndex + 1} / {questions.length}</p>
            <div className="w-48 h-2 bg-gray-100 rounded-full overflow-hidden">
              <div 
                className="h-full bg-primary transition-all duration-300"
                style={{ width: `${((currentQuestionIndex + 1) / questions.length) * 100}%` }}
              ></div>
            </div>
          </div>
          
          <div className="flex items-center text-accent bg-accent/10 px-4 py-2 rounded-lg">
            <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="font-bold text-xl tracking-wider">{formatTime(timeLeft)}</span>
          </div>
        </div>

        {/* Question Area */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden mb-8">
          <div className="p-8 md:p-12">
            <h3 className="text-2xl font-semibold text-gray-900 mb-8 leading-relaxed">
              {currentQuestionIndex + 1}. {currentQ.text}
            </h3>
            
            <div className="space-y-4">
              {currentQ.options.map((option, idx) => {
                const isSelected = answers[currentQ.id] === idx;
                return (
                  <label 
                    key={idx} 
                    className={`flex items-center p-5 rounded-xl border-2 cursor-pointer transition-all ${
                      isSelected ? 'border-primary bg-primary/5' : 'border-gray-100 hover:border-gray-200 hover:bg-gray-50'
                    }`}
                  >
                    <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center mr-4 flex-shrink-0 ${
                      isSelected ? 'border-primary' : 'border-gray-300'
                    }`}>
                      {isSelected && <div className="w-3 h-3 bg-primary rounded-full"></div>}
                    </div>
                    <span className={`text-lg ${isSelected ? 'text-primary font-medium' : 'text-gray-700'}`}>{option}</span>
                    
                    {/* Hidden radio for accessibility */}
                    <input 
                      type="radio" 
                      name={`question-${currentQ.id}`} 
                      className="hidden"
                      checked={isSelected}
                      onChange={() => handleOptionSelect(currentQ.id, idx)}
                    />
                  </label>
                );
              })}
            </div>
          </div>
          
          {/* Controls */}
          <div className="bg-gray-50 p-6 border-t border-gray-100 flex justify-between items-center">
            <button
              disabled={currentQuestionIndex === 0}
              onClick={() => setCurrentQuestionIndex(prev => prev - 1)}
              className="px-6 py-2.5 rounded-lg font-medium text-gray-600 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              পূর্ববর্তী
            </button>
            
            {currentQuestionIndex < questions.length - 1 ? (
              <button
                onClick={() => setCurrentQuestionIndex(prev => prev + 1)}
                className="px-8 py-2.5 bg-gray-900 text-white rounded-lg font-medium hover:bg-gray-800 transition-colors shadow-lg shadow-gray-900/20"
              >
                পরবর্তী
              </button>
            ) : (
              <button
                onClick={() => setSubmitted(true)}
                className="px-8 py-2.5 bg-green-600 text-white rounded-lg font-bold hover:bg-green-700 transition-colors shadow-lg shadow-green-600/30"
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
