import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useNavigate } from 'react-router-dom';
import { getResultById, reset } from '../store/slices/interviewSlice';
import { ArrowLeft, Target, TrendingUp, AlertTriangle, Lightbulb, Loader2 } from 'lucide-react';
import { toast } from 'react-toastify';

const ResultDetails = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { currentResult, isLoading, isError, message } = useSelector(
    (state) => state.interview
  );

  useEffect(() => {
    if (isError) {
      toast.error(message);
      dispatch(reset());
    }
    
    if (id) {
      dispatch(getResultById(id));
    }
  }, [id, isError, message, dispatch]);

  if (isLoading || !currentResult) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
         <Loader2 className="w-10 h-10 text-primary-600 animate-spin" />
      </div>
    );
  }

  const getScoreColor = (score) => {
    if (score >= 8) return 'text-green-600';
    if (score >= 6) return 'text-blue-600';
    return 'text-orange-600';
  };

  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      <header className="bg-white border-b border-slate-200 sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-4 py-4 sm:px-6 lg:px-8 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => navigate('/dashboard')}
              className="p-2 hover:bg-slate-100 rounded-full text-slate-500 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <h1 className="text-xl font-bold text-slate-800">Interview Feedback Report</h1>
              <p className="text-xs text-slate-500">
                {new Date(currentResult.createdAt).toLocaleString()}
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
             <div className="text-right hidden sm:block">
               <span className="block text-xs text-slate-500 uppercase font-semibold tracking-wider">Overall Score</span>
               <span className={`text-2xl font-bold ${getScoreColor(currentResult.averageScore)}`}>
                 {currentResult.averageScore} / 10
               </span>
             </div>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 mt-2">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
           <div className="col-span-1 md:col-span-4 bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col md:flex-row md:items-center justify-between">
              <div>
                <h2 className="text-lg font-bold text-slate-800 mb-1">Session Summary</h2>
                <p className="text-slate-600">Based on your parsed resume <span className="font-semibold">"{currentResult.resume?.fileName}"</span></p>
              </div>
              <div className="mt-4 md:mt-0 text-3xl font-extrabold flex items-center gap-2">
                <Target className="w-8 h-8 text-primary-500" />
                <span className={getScoreColor(currentResult.averageScore)}>{currentResult.averageScore.toFixed(1)}</span>
                <span className="text-slate-400 text-sm">/ 10</span>
              </div>
           </div>
        </div>

        <h3 className="text-lg font-bold text-slate-800 mb-6 uppercase tracking-wide text-center mt-10">Detailed Question Breakdown</h3>

        <div className="space-y-10">
          {currentResult.evaluations.map((evalItem, idx) => (
            <div key={idx} className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
               <div className="bg-slate-800 text-white p-6 sm:p-8">
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                     <h3 className="text-xl font-semibold leading-relaxed flex-1">
                       <span className="text-slate-400 mr-2">Q{idx+1}.</span> 
                       {evalItem.question}
                     </h3>
                     <div className="flex-shrink-0 bg-white/10 px-4 py-2 rounded-xl text-center backdrop-blur-md border border-white/5">
                        <span className="block text-xs uppercase tracking-wider text-slate-300 mb-1">Score</span>
                        <span className={`text-2xl font-bold ${getScoreColor(evalItem.score).replace('600', '400')}`}>{evalItem.score}/10</span>
                     </div>
                  </div>
               </div>
               
               <div className="p-6 sm:p-8 space-y-8 bg-slate-50 border-b border-slate-200">
                  <div>
                    <h4 className="text-sm font-semibold text-slate-800 mb-3 uppercase tracking-wider">Your Answer</h4>
                    <p className="text-slate-700 leading-relaxed bg-white border border-slate-200 p-4 rounded-xl shadow-sm italic text-lg decoration-slate-200 decoration-1 underline-offset-4">
                      "{evalItem.answer}"
                    </p>
                  </div>
               </div>

               <div className="p-6 sm:p-8 bg-white grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="bg-green-50/50 p-5 rounded-2xl border border-green-100">
                    <h4 className="flex items-center gap-2 text-green-800 font-semibold mb-3">
                      <TrendingUp className="w-5 h-5 text-green-600" />
                      Strengths
                    </h4>
                    <p className="text-sm text-green-900 leading-relaxed bg-white p-3 rounded-xl border border-green-50 shadow-sm">{evalItem.strengths}</p>
                  </div>
                  
                  <div className="bg-orange-50/50 p-5 rounded-2xl border border-orange-100">
                    <h4 className="flex items-center gap-2 text-orange-800 font-semibold mb-3">
                      <AlertTriangle className="w-5 h-5 text-orange-600" />
                      Weaknesses
                    </h4>
                    <p className="text-sm text-orange-900 leading-relaxed bg-white p-3 rounded-xl border border-orange-50 shadow-sm">{evalItem.weaknesses}</p>
                  </div>
                  
                  <div className="bg-blue-50/50 p-5 rounded-2xl border border-blue-100">
                    <h4 className="flex items-center gap-2 text-blue-800 font-semibold mb-3">
                      <Lightbulb className="w-5 h-5 text-blue-600" />
                      Suggestions
                    </h4>
                    <p className="text-sm text-blue-900 leading-relaxed bg-white p-3 rounded-xl border border-blue-50 shadow-sm">{evalItem.suggestions}</p>
                  </div>
               </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
};

export default ResultDetails;
