import re

with open('frontend/src/pages/TeacherDashboard.jsx', 'r', encoding='utf-8') as f:
    content = f.read()

# 1. State changes
content = content.replace(
    '''  // Question Form
  const [qText, setQText] = useState('');
  const [qOptions, setQOptions] = useState(['', '', '', '']);
  const [qCorrect, setQCorrect] = useState(0);''',
    '''  // Question Form
  const [questionsList, setQuestionsList] = useState([{ text: '', options: ['', '', '', ''], correct_answer: 0 }]);
  const [savingQuestions, setSavingQuestions] = useState(false);'''
)

# 2. handleCleanAllHtml
content = content.replace(
    '''  const handleCleanAllHtml = () => {
    setQText(prev => stripHtml(prev));
    setQOptions(prev => prev.map(opt => stripHtml(opt)));
  };''',
    '''  const handleCleanAllHtml = () => {
    const newList = questionsList.map(q => ({
      ...q,
      text: stripHtml(q.text),
      options: q.options.map(o => stripHtml(o))
    }));
    setQuestionsList(newList);
  };'''
)

# 3. addQuestion -> saveAllQuestions
old_add_question = '''  const addQuestion = async (e) => {
    e.preventDefault();
    if (!selectedExamId) return alert('??? ??????? ???????? ????!');
    
    // Automatically strip HTML tags and decode entities
    const cleanText = stripHtml(qText).trim();
    const cleanOpts = qOptions.map(opt => stripHtml(opt).trim());

    if (!cleanText) return alert('??????? ??? ???????? ?????!');
    if (cleanOpts.some(opt => opt === '')) return alert('?????? ???? ???? ????!');
    
    try {
      await axios.post(/api/dashboard/exams//questions, {
        text: cleanText,
        options: JSON.stringify(cleanOpts),
        correct_answer: qCorrect
      });
      alert('?????? ??????? ??? ?????!');
      setQText(''); setQOptions(['', '', '', '']); setQCorrect(0);
      loadExamQuestions(selectedExamId);
      fetchExams();
    } catch (err) { alert('?????? ??? ???? ?????? ?????!'); }
  };'''

new_add_question = '''  const saveAllQuestions = async (e) => {
    e.preventDefault();
    if (!selectedExamId) return alert('??? ??????? ???????? ????!');
    
    // Validate all
    const cleanedList = questionsList.map(q => ({
      text: stripHtml(q.text).trim(),
      options: q.options.map(opt => stripHtml(opt).trim()),
      correct_answer: q.correct_answer
    }));

    for (let i = 0; i < cleanedList.length; i++) {
      if (!cleanedList[i].text) return alert(??????? ???  ?? ???????? ?????!);
      if (cleanedList[i].options.some(opt => opt === '')) return alert(${i+1} ?? ???????? ?????? ???? ???? ????!);
    }
    
    setSavingQuestions(true);
    try {
      for (let q of cleanedList) {
        await axios.post(/api/dashboard/exams//questions, {
          text: q.text,
          options: JSON.stringify(q.options),
          correct_answer: q.correct_answer
        });
      }
      alert(??????? ?? ?????? ??? ?????!);
      setQuestionsList([{ text: '', options: ['', '', '', ''], correct_answer: 0 }]);
      loadExamQuestions(selectedExamId);
      fetchExams();
    } catch (err) { alert('?????? ??? ???? ?????? ?????!'); }
    finally { setSavingQuestions(false); }
  };'''

content = content.replace(old_add_question, new_add_question)


# 4. The form UI
old_form = '''                  <form onSubmit={addQuestion} className="space-y-6 bg-gray-50 p-6 md:p-7 rounded-2xl border border-gray-200">
                    <div className="flex items-center justify-between">
                      <label className="block text-sm font-bold text-gray-800 ml-1">
                        ?????? ????? (?? ?????? ???-???? ????????????? ?????? ?????):
                      </label>
                      <button
                        type="button"
                        onClick={handleCleanAllHtml}
                        className="text-xs bg-amber-100 text-amber-800 hover:bg-amber-200 font-bold px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-colors"
                        title="HTML ??? ?? ????? ????? ?????? ??????? ???????? ????"
                      >
                        <FaBroom className="text-amber-600" /> HTML ????? ?????
                      </button>
                    </div>

                    <div>
                      <textarea 
                        placeholder="????? ???????? ?????... (???? ?????? HTML ????? ???? ????????? ??????)" 
                        required 
                        rows={4}
                        value={qText} 
                        onChange={e => setQText(e.target.value)}
                        onPaste={e => {
                          const pasted = e.clipboardData?.getData('text/plain') || '';
                          if (pasted.includes('<') && pasted.includes('>')) {
                            e.preventDefault();
                            const cleaned = stripHtml(pasted);
                            const start = e.target.selectionStart;
                            const end = e.target.selectionEnd;
                            const next = qText.substring(0, start) + cleaned + qText.substring(end);
                            setQText(next);
                          }
                        }}
                        className="w-full border border-gray-200 rounded-xl p-4 outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 min-h-[100px] text-gray-800 bg-white leading-relaxed break-words whitespace-pre-wrap resize-y" 
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-bold text-gray-800 mb-3 ml-1">
                        ???????? (???? ??????? ??? ???? ??? ????? ??? ???):
                      </label>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {qOptions.map((opt, i) => (
                          <div key={i} className={lex items-start gap-3 p-3.5 rounded-xl border-2 transition-all }>
                            <input 
                              type="radio" 
                              name="correctOpt" 
                              checked={qCorrect === i} 
                              onChange={() => setQCorrect(i)} 
                              className="w-5 h-5 mt-1 accent-green-600 cursor-pointer flex-shrink-0" 
                            />
                            <textarea
                              rows={2}
                              placeholder={???? } 
                              value={opt} 
                              onChange={e => { 
                                const newOpts = [...qOptions]; 
                                newOpts[i] = e.target.value; 
                                setQOptions(newOpts); 
                              }} 
                              onPaste={e => {
                                const pasted = e.clipboardData?.getData('text/plain') || '';
                                if (pasted.includes('<') && pasted.includes('>')) {
                                  e.preventDefault();
                                  const cleaned = stripHtml(pasted);
                                  const newOpts = [...qOptions];
                                  newOpts[i] = cleaned;
                                  setQOptions(newOpts);
                                }
                              }}
                              className="w-full bg-transparent outline-none p-1 text-gray-800 font-medium leading-relaxed break-words resize-none" 
                              required 
                            />
                          </div>
                        ))}
                      </div>
                    </div>

                    <button type="submit" className="w-full bg-primary text-white rounded-xl font-bold py-3.5 shadow-md hover:bg-secondary transition-all active:scale-95 text-lg flex items-center justify-center gap-2">
                      <FaPlus /> ?????? ??? ????
                    </button>
                  </form>'''

new_form = '''                  <form onSubmit={saveAllQuestions} className="space-y-6 bg-gray-50 p-6 md:p-7 rounded-2xl border border-gray-200">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-bold text-lg text-gray-800">??????????</h4>
                      <button
                        type="button"
                        onClick={handleCleanAllHtml}
                        className="text-xs bg-amber-100 text-amber-800 hover:bg-amber-200 font-bold px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-colors"
                        title="?? ???????? HTML ??? ?? ????? ???? ?????"
                      >
                        <FaBroom className="text-amber-600" /> ?? HTML ?????
                      </button>
                    </div>

                    <div className="space-y-6">
                      {questionsList.map((q, qIndex) => (
                        <div key={qIndex} className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm relative">
                          {questionsList.length > 1 && (
                            <button
                              type="button"
                              onClick={() => {
                                const newList = questionsList.filter((_, idx) => idx !== qIndex);
                                setQuestionsList(newList);
                              }}
                              className="absolute top-4 right-4 text-red-500 hover:bg-red-50 p-2 rounded-lg"
                              title="?????? ?????"
                            >
                              <FaTrash />
                            </button>
                          )}
                          
                          <label className="block text-sm font-bold text-gray-800 mb-2">
                            ?????? {qIndex + 1}:
                          </label>
                          <textarea 
                            placeholder="????? ???????? ?????... (???? ?????? HTML ????? ???? ????????? ??????)" 
                            required 
                            rows={3}
                            value={q.text} 
                            onChange={e => {
                              const newList = [...questionsList];
                              newList[qIndex].text = e.target.value;
                              setQuestionsList(newList);
                            }}
                            className="w-full border border-gray-200 rounded-xl p-3 outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 min-h-[80px] text-gray-800 bg-gray-50 leading-relaxed mb-4" 
                          />
                          
                          <label className="block text-sm font-bold text-gray-800 mb-2">
                            ???????? (???? ??????? ??? ???? ??? ????? ??? ???):
                          </label>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            {q.options.map((opt, oIndex) => (
                              <div key={oIndex} className={lex items-start gap-2 p-2 rounded-lg border-2 transition-all }>
                                <input 
                                  type="radio" 
                                  name={correctOpt-} 
                                  checked={q.correct_answer === oIndex} 
                                  onChange={() => {
                                    const newList = [...questionsList];
                                    newList[qIndex].correct_answer = oIndex;
                                    setQuestionsList(newList);
                                  }} 
                                  className="w-4 h-4 mt-1 accent-green-600 cursor-pointer flex-shrink-0" 
                                />
                                <textarea
                                  rows={1}
                                  placeholder={???? } 
                                  value={opt} 
                                  onChange={e => { 
                                    const newList = [...questionsList]; 
                                    newList[qIndex].options[oIndex] = e.target.value; 
                                    setQuestionsList(newList); 
                                  }} 
                                  className="w-full bg-transparent outline-none p-1 text-sm text-gray-800 font-medium resize-none" 
                                  required 
                                />
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="flex flex-col sm:flex-row gap-3 pt-4">
                      <button 
                        type="button" 
                        onClick={() => setQuestionsList([...questionsList, { text: '', options: ['', '', '', ''], correct_answer: 0 }])}
                        className="bg-blue-50 text-blue-700 border border-blue-200 rounded-xl font-bold py-3 px-6 flex-1 hover:bg-blue-100 transition-colors"
                      >
                        + ?????? ?????? ??? ????
                      </button>
                      <button 
                        type="submit" 
                        disabled={savingQuestions}
                        className="bg-primary text-white rounded-xl font-bold py-3 px-8 flex-[2] shadow-md hover:bg-secondary transition-all disabled:opacity-70"
                      >
                        {savingQuestions ? '??? ?????...' : ?????? (??) ?????? ??? ????}
                      </button>
                    </div>
                  </form>'''

content = content.replace(old_form, new_form)

with open('frontend/src/pages/TeacherDashboard.jsx', 'w', encoding='utf-8') as f:
    f.write(content)
print("Done")
