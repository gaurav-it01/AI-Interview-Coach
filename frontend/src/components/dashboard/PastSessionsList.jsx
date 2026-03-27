import React from 'react';
import { MessageSquare } from 'lucide-react';
import SessionCard from './SessionCard';

/**
 * PastSessionsList renders the list of past interview objects or a loading/empty state.
 *
 * @param {Object} props
 * @param {Array} props.results - Array of past mock interview results.
 * @param {boolean} props.isLoading - Whether results are currently loading.
 * @param {Function} props.onViewReport - Callback passed up when a user clicks 'View Report'.
 */
const PastSessionsList = ({ results, isLoading, onViewReport }) => {
  return (
    <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-100 shadow-sm p-6" id="history">
      <h2 className="text-xl font-bold text-slate-800 mb-4">Past Sessions</h2>
      
      {isLoading ? (
         <p className="text-slate-500 animate-pulse">Loading previous sessions...</p>
      ) : !results || results.length === 0 ? (
         <div className="text-center py-10 bg-slate-50 rounded-xl border border-dashed border-slate-200">
           <MessageSquare className="w-10 h-10 text-slate-400 mx-auto mb-3" />
           <p className="text-slate-500">No interview sessions found. Upload a resume to begin.</p>
         </div>
      ) : (
        <div className="space-y-4">
          {results.map((session, i) => (
            <SessionCard key={i} session={session} onViewReport={onViewReport} />
          ))}
        </div>
      )}
    </div>
  );
};

export default PastSessionsList;
