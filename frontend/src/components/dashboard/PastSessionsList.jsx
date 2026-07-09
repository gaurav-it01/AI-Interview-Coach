import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { ClipboardList } from 'lucide-react';
import { toast } from 'react-toastify';
import { deleteResult } from '../../store/slices/interviewSlice';
import DeleteConfirmModal from './DeleteConfirmModal';
import SessionCard from './SessionCard';

const PastSessionsList = ({ results, isLoading, onViewReport }) => {
  const dispatch = useDispatch();
  const { isDeleting } = useSelector((state) => state.interview);
  const [sessionToDelete, setSessionToDelete] = useState(null);

  const handleDeleteRequest = (session) => {
    setSessionToDelete(session);
  };

  const handleCancelDelete = () => {
    if (!isDeleting) setSessionToDelete(null);
  };

  const handleConfirmDelete = async () => {
    if (!sessionToDelete) return;

    try {
      await dispatch(deleteResult(sessionToDelete._id)).unwrap();
      toast.success('Interview deleted successfully.');
      setSessionToDelete(null);
    } catch (err) {
      toast.error(typeof err === 'string' ? err : 'Failed to delete interview session.');
    }
  };

  return (
    <>
      <div className="card p-4 sm:p-5" id="history">
        <h2 className="text-lg font-bold text-slate-900 mb-1">Past Sessions</h2>
        <p className="text-xs text-slate-500 mb-4">Review scores and feedback from completed interviews</p>

        {isLoading ? (
          <p className="text-sm text-slate-500 animate-pulse py-6 text-center">Loading sessions...</p>
        ) : !results || results.length === 0 ? (
          <div className="text-center py-10 px-4 bg-slate-50 rounded-xl border border-dashed border-slate-200">
            <div className="w-14 h-14 rounded-2xl bg-white border border-slate-200 flex items-center justify-center mx-auto mb-4 shadow-sm">
              <ClipboardList className="w-7 h-7 text-slate-400" />
            </div>
            <p className="text-sm font-semibold text-slate-800 mb-1">No interview history yet.</p>
            <p className="text-sm text-slate-500 mb-5 max-w-xs mx-auto">
              Complete your first mock interview to see reports here.
            </p>
            <a
              href="#new"
              className="btn-primary inline-flex text-sm"
            >
              Start New Interview
            </a>
          </div>
        ) : (
          <div className="space-y-2.5">
            {results.map((session, i) => (
              <SessionCard
                key={session._id || i}
                session={session}
                onViewReport={onViewReport}
                onDelete={handleDeleteRequest}
              />
            ))}
          </div>
        )}
      </div>

      <DeleteConfirmModal
        isOpen={Boolean(sessionToDelete)}
        onCancel={handleCancelDelete}
        onConfirm={handleConfirmDelete}
        isDeleting={isDeleting}
      />
    </>
  );
};

export default PastSessionsList;
