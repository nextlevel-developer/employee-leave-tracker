import { useState } from 'react';
import { useSubmitLeaveRequest } from '../hooks/useLeaveRequest';
import { useLeaveTypes } from '../../leave-types/hooks/useLeaveTypes';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';

export function LeaveRequestForm({ onSuccess }: { onSuccess?: () => void }) {
  const [form, setForm] = useState({
    leaveTypeId: '',
    startDate: '',
    endDate: '',
    reason: '',
  });

  const submit = useSubmitLeaveRequest();
  const { data: leaveTypes } = useLeaveTypes();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    submit.mutate(
      { ...form, reason: form.reason || undefined },
      { onSuccess: () => { setForm({ leaveTypeId: '', startDate: '', endDate: '', reason: '' }); onSuccess?.(); } }
    );
  };

  const errorMessage = submit.error
    ? (submit.error as any).response?.data?.error?.message || 'Failed to submit request'
    : null;

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {errorMessage && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
          {errorMessage}
        </div>
      )}
      {submit.isSuccess && (
        <div className="p-3 bg-green-50 border border-green-200 rounded-lg text-sm text-green-700">
          Leave request submitted successfully!
        </div>
      )}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Leave Type</label>
        <select
          value={form.leaveTypeId}
          onChange={e => setForm(p => ({ ...p, leaveTypeId: e.target.value }))}
          required
          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
        >
          <option value="">Select leave type</option>
          {leaveTypes?.map(lt => (
            <option key={lt.id} value={lt.id}>{lt.name}</option>
          ))}
        </select>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <Input label="Start Date" type="date" value={form.startDate} onChange={e => setForm(p => ({ ...p, startDate: e.target.value }))} required />
        <Input label="End Date" type="date" value={form.endDate} onChange={e => setForm(p => ({ ...p, endDate: e.target.value }))} required />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Reason (optional)</label>
        <textarea
          value={form.reason}
          onChange={e => setForm(p => ({ ...p, reason: e.target.value }))}
          rows={3}
          placeholder="Brief reason for leave..."
          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 resize-none"
        />
      </div>
      <Button type="submit" loading={submit.isPending}>Submit Request</Button>
    </form>
  );
}
