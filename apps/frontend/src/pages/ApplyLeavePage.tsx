import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { LeaveRequestForm } from '../features/employee/components/LeaveRequestForm';
import { AiChatPanel } from '../features/ai/components/AiChatPanel';
import { Card } from '../components/ui/Card';

type Tab = 'manual' | 'ai';

export default function ApplyLeavePage() {
  const [searchParams] = useSearchParams();
  const [activeTab, setActiveTab] = useState<Tab>(
    searchParams.get('tab') === 'ai' ? 'ai' : 'manual'
  );

  return (
    <div className="max-w-2xl">
      {/* Tabs */}
      <div className="flex bg-gray-100 rounded-xl p-1 mb-6 gap-1">
        <TabButton active={activeTab === 'manual'} onClick={() => setActiveTab('manual')}>
          Manual Request
        </TabButton>
        <TabButton active={activeTab === 'ai'} onClick={() => setActiveTab('ai')}>
          <span className="mr-1">🤖</span> AI Assistant
        </TabButton>
      </div>

      {activeTab === 'manual' && (
        <Card title="Submit Leave Request">
          <LeaveRequestForm />
        </Card>
      )}

      {activeTab === 'ai' && (
        <Card title="AI Leave Assistant">
          <p className="text-sm text-gray-500 mb-4">
            Describe your leave request in plain English. The AI will parse the details and prepare a request for your confirmation.
          </p>
          <AiChatPanel />
        </Card>
      )}
    </div>
  );
}

function TabButton({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      onClick={onClick}
      className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-colors ${
        active ? 'bg-white shadow-sm text-gray-900' : 'text-gray-500 hover:text-gray-700'
      }`}
    >
      {children}
    </button>
  );
}
