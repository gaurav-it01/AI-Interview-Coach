import React from 'react';

/**
 * SessionCard displays summary details of a past interview session.
 *
 * @param {Object} props
 * @param {Object} props.session - The result/session object containing scores and resume metadata.
 * @param {Function} props.onViewReport - Callback to navigate to the detailed report page.
 */
const SessionCard = ({ session, onViewReport }) => {
  // Determine badge styling based on average score
  let badgeStyle = 'bg-orange-50 text-orange-600 border border-orange-100';
  if (session.averageScore >= 8) {
    badgeStyle = 'bg-green-50 text-green-600 border border-green-100';
  } else if (session.averageScore >= 6) {
    badgeStyle = 'bg-blue-50 text-blue-600 border border-blue-100';
  }

  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-xl border border-slate-100 hover:shadow-md hover:border-slate-200 transition-all bg-white gap-4 sm:gap-0">
      <div className="flex items-center gap-4">
        <div className={`w-14 h-14 rounded-xl flex items-center justify-center font-bold text-lg ${badgeStyle}`}>
          {session.averageScore}
        </div>
        <div>
          <h4 className="font-semibold text-slate-800">Mock Interview</h4>
          <p className="text-sm text-slate-500 flex items-center gap-2 mt-1">
            <span className="font-medium text-slate-700">{session.resume?.fileName || 'Resume'}</span> 
            &bull; {new Date(session.createdAt).toLocaleDateString()}
          </p>
        </div>
      </div>
      <button 
        onClick={() => onViewReport(session._id)}
        className="text-primary-600 text-sm font-semibold hover:text-primary-700 bg-primary-50 px-4 py-2 rounded-lg hover:bg-primary-100 transition-colors self-start sm:self-auto"
      >
        View Report
      </button>
    </div>
  );
};

export default SessionCard;
