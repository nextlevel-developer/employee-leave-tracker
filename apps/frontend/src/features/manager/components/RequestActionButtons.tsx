import { useState } from 'react';
import { useApproveRequest, useRejectRequest } from '../hooks/useReviewRequest';
import { RejectReasonModal } from './RejectReasonModal';

export function RequestActionButtons({ requestId }: { requestId: string }) {
  const [showRejectModal, setShowRejectModal] = useState(false);
  const approve = useApproveRequest();
  const reject = useRejectRequest();

  const handleApprove = () => approve.mutate(requestId);

  const handleReject = (reason: string) => {
    reject.mutate({ id: requestId, rejectionReason: reason }, {
      onSuccess: () => setShowRejectModal(false),
    });
  };

  return (
    <>
      <div className="flex gap-2">
        <button
          onClick={handleApprove}
          disabled={approve.isPending}
          className="px-3 py-1.5 text-xs font-medium bg-green-100 hover:bg-green-200 text-green-800 rounded-lg transition-colors disabled:opacity-50"
        >
          {approve.isPending ? '...' : 'Approve'}
        </button>
        <button
          onClick={() => setShowRejectModal(true)}
          className="px-3 py-1.5 text-xs font-medium bg-red-100 hover:bg-red-200 text-red-800 rounded-lg transition-colors"
        >
          Reject
        </button>
      </div>
      <RejectReasonModal
        isOpen={showRejectModal}
        onClose={() => setShowRejectModal(false)}
        onConfirm={handleReject}
        isLoading={reject.isPending}
      />
    </>
  );
}
