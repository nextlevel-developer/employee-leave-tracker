import { AiParsedLeave } from '@leave-tracker/shared-types';

export function AiParsedPreview({
  parsed,
  onConfirm,
  isConfirming,
}: {
  parsed: AiParsedLeave;
  onConfirm: () => void;
  isConfirming: boolean;
}) {
  return (
    <div className="mt-3 bg-primary-50 border border-primary-200 rounded-xl p-4 space-y-3">
      <p className="text-xs font-semibold text-primary-700 uppercase tracking-wide">Leave Request Preview</p>
      <div className="grid grid-cols-2 gap-2 text-sm">
        <div>
          <p className="text-gray-500 text-xs">Type</p>
          <p className="font-medium text-gray-900">{parsed.leaveTypeName}</p>
        </div>
        <div>
          <p className="text-gray-500 text-xs">Duration</p>
          <p className="font-medium text-gray-900">{parsed.totalDays} day{parsed.totalDays !== 1 ? 's' : ''}</p>
        </div>
        <div>
          <p className="text-gray-500 text-xs">From</p>
          <p className="font-medium text-gray-900">{parsed.startDate}</p>
        </div>
        <div>
          <p className="text-gray-500 text-xs">To</p>
          <p className="font-medium text-gray-900">{parsed.endDate}</p>
        </div>
        {parsed.reason && (
          <div className="col-span-2">
            <p className="text-gray-500 text-xs">Reason</p>
            <p className="font-medium text-gray-900">{parsed.reason}</p>
          </div>
        )}
      </div>
      <button
        onClick={onConfirm}
        disabled={isConfirming}
        className="w-full bg-primary-600 hover:bg-primary-700 disabled:opacity-60 text-white text-sm font-medium py-2 px-4 rounded-lg transition-colors"
      >
        {isConfirming ? 'Submitting...' : 'Confirm & Submit'}
      </button>
    </div>
  );
}
