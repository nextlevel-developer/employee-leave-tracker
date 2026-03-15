import { useState } from 'react';
import { Modal } from '../../../components/ui/Modal';
import { Button } from '../../../components/ui/Button';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (reason: string) => void;
  isLoading?: boolean;
}

export function RejectReasonModal({ isOpen, onClose, onConfirm, isLoading }: Props) {
  const [reason, setReason] = useState('');

  const handleConfirm = () => {
    if (!reason.trim()) return;
    onConfirm(reason.trim());
    setReason('');
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Reject Leave Request">
      <div className="space-y-4">
        <p className="text-sm text-gray-600">Please provide a reason for rejecting this leave request.</p>
        <textarea
          value={reason}
          onChange={e => setReason(e.target.value)}
          rows={3}
          placeholder="Reason for rejection..."
          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-400 resize-none"
        />
        <div className="flex gap-3 justify-end">
          <Button variant="secondary" onClick={onClose} disabled={isLoading}>Cancel</Button>
          <Button variant="danger" onClick={handleConfirm} disabled={!reason.trim()} loading={isLoading}>
            Reject Request
          </Button>
        </div>
      </div>
    </Modal>
  );
}
