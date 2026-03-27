import React, { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useNavigate } from 'react-router-dom';
import { generateQuestions, saveAnswer, nextQuestion, evaluateInterview, reset } from '../store/slices/interviewSlice';
import { Bot, User, Send, ArrowLeft, Loader2, CheckCircle } from 'lucide-react';
import { toast } from 'react-toastify';

const Interview = () => {
  const { resumeId } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const chatEndRef = useRef(null);

  const [currentInput, setCurrentInput] = useState('');

  const { questions, answers, currentQuestionIndex, isGenerating, isEvaluating, isError, message } = useSelector(
    (state) => state.interview
  );

  useEffect(() => {
    if (isError) {
      toast.error(message);
      dispatch(reset());
    }
  }, [isError, message, dispatch]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [currentQuestionIndex, answers]);

  useEffect(() => {
    if (questions.length === 0 && !isGenerating) {
      if (resumeId) {
        dispatch(generateQuestions(resumeId));
      }
    }
  }, [resumeId, questions.length, isGenerating, dispatch]);

  const handleNext = async () => {
    if (currentInput.trim() === '') {
      toast.warn('Please provide an answer before continuing.');
      return;
    }

    dispatch(saveAnswer({ questionIndex: currentQuestionIndex, answer: currentInput }));
    
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentInput('');
      dispatch(nextQuestion());
    } else {
      // Final Question Answered. Evaluate!
      try {
        const qaPairs = questions.map((q, idx) => ({
          question: q.question,
          answer: idx === currentQuestionIndex ? currentInput : answers[idx],
        }));

        const result = await dispatch(evaluateInterview({ resumeId, qaPairs })).unwrap();
        toast.success('Interview Evaluated Successfully!');
        navigate(`/result/${result._id}`);
      } catch (err) {
        toast.error('Failed to evaluate interview responses. ' + err);
      }
    }
  };

  if (isGenerating || questions.length === 0) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50">
        <Loader2 className="w-12 h-12 text-primary-600 animate-spin mb-4" />
        <h2 className="text-2xl font-bold text-slate-800">Generating Your Interview</h2>
        <p className="text-slate-500 mt-2">Our AI is reading your resume and crafting personalized questions... This may take up to 15 seconds.</p>
      </div>
    );
  }

  const chatHistory = [];
  for (let i = 0; i <= currentQuestionIndex; i++) {
    chatHistory.push({
      role: 'ai',
      content: questions[i].question,
      type: questions[i].type
    });
    
    if (i < currentQuestionIndex && answers[i]) {
      chatHistory.push({
        role: 'user',
        content: answers[i]
      });
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <header className="bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between sticky top-0 z-10 shadow-sm">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => navigate('/dashboard')}
            className="p-2 hover:bg-slate-100 rounded-full text-slate-500 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-lg font-bold text-slate-800">Mock Interview Session</h1>
            <p className="text-xs text-slate-500 flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-green-500 inline-block"></span> AI Coach Active
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="text-sm font-semibold text-slate-600">
            Question {currentQuestionIndex + 1} of {questions.length}
          </div>
          <div className="w-32 h-2 bg-slate-100 rounded-full overflow-hidden">
            <div 
              className="h-full bg-primary-600 transition-all duration-500 ease-out"
              style={{ width: `${((currentQuestionIndex + 1) / questions.length) * 100}%` }}
            ></div>
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-4xl w-full mx-auto p-4 md:p-6 pb-32">
        <div className="space-y-6">
          {chatHistory.map((chat, idx) => (
            <div 
              key={idx} 
              className={`flex w-full ${chat.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`flex max-w-[85%] ${chat.role === 'user' ? 'flex-row-reverse' : 'flex-row'} gap-4`}>
                <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center shadow-sm ${
                  chat.role === 'user' ? 'bg-slate-800 text-white' : 'bg-primary-600 text-white'
                }`}>
                  {chat.role === 'user' ? <User className="w-5 h-5" /> : <Bot className="w-5 h-5" />}
                </div>

                <div className={`flex flex-col ${chat.role === 'user' ? 'items-end' : 'items-start'}`}>
                  {chat.role === 'ai' && chat.type && (
                    <span className="text-xs font-semibold text-primary-600 mb-1 ml-1 uppercase tracking-wider">
                      {chat.type} Question
                    </span>
                  )}
                  <div className={`px-6 py-4 rounded-2xl shadow-sm text-[15px] leading-relaxed ${
                    chat.role === 'user' 
                      ? 'bg-slate-800 text-white rounded-br-sm' 
                      : 'bg-white text-slate-800 border border-slate-100 rounded-bl-sm'
                  }`}>
                    {chat.content}
                  </div>
                </div>
              </div>
            </div>
          ))}
          {isEvaluating && (
             <div className="flex w-full justify-start mt-6">
                <div className="flex items-center gap-3 bg-white px-6 py-4 rounded-2xl shadow-sm border border-slate-100 text-slate-600">
                   <Loader2 className="w-5 h-5 animate-spin text-primary-600" />
                   Reviewing your answers and generating score...
                </div>
             </div>
          )}
          <div ref={chatEndRef} />
        </div>
      </main>

      <div className="fixed bottom-0 left-0 w-full bg-slate-50/80 backdrop-blur-lg border-t border-slate-200 p-4">
        <div className="max-w-4xl mx-auto flex gap-3 relative">
          <textarea 
            value={currentInput}
            onChange={(e) => setCurrentInput(e.target.value)}
            disabled={isEvaluating}
            placeholder={isEvaluating ? "Evaluating..." : "Type your answer here... Speak naturally!"}
            className="w-full bg-white border border-slate-300 rounded-2xl pl-5 pr-14 py-4 focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 resize-none h-16 shadow-sm overflow-hidden text-[15px] disabled:opacity-50"
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleNext();
              }
            }}
          />
          <button 
            onClick={handleNext}
            disabled={isEvaluating}
            className="absolute right-2 top-2 bottom-2 w-12 bg-primary-600 hover:bg-primary-700 disabled:bg-primary-400 text-white rounded-xl flex items-center justify-center transition-colors shadow-sm"
          >
            {isEvaluating ? (
               <Loader2 className="w-5 h-5 animate-spin" />
            ) : currentQuestionIndex === questions.length - 1 ? (
              <CheckCircle className="w-5 h-5" />
            ) : (
              <Send className="w-5 h-5 ml-1" />
            )}
          </button>
        </div>
        <div className="max-w-4xl mx-auto mt-2 text-center text-xs text-slate-400">
          Press Enter to submit, Shift + Enter for new line.
        </div>
      </div>
    </div>
  );
};

export default Interview;
