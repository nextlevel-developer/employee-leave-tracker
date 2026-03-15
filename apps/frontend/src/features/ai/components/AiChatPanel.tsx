import { useEffect, useRef } from 'react';
import { useAiSession } from '../hooks/useAiSession';
import { AiChatInput } from './AiChatInput';
import { AiParsedPreview } from './AiParsedPreview';

export function AiChatPanel() {
  const { messages, isLoading, isConfirming, confirmed, error, canConfirm, sendMessage, confirmLeave, reset } =
    useAiSession();
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  return (
    <div className="flex flex-col h-full min-h-[400px]">
      {/* Chat messages */}
      <div className="flex-1 overflow-y-auto space-y-3 p-4 bg-gray-50 rounded-xl border border-gray-200 mb-3">
        {messages.length === 0 && (
          <div className="text-center py-8">
            <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <span className="text-2xl">🤖</span>
            </div>
            <p className="text-gray-600 font-medium">AI Leave Assistant</p>
            <p className="text-gray-400 text-sm mt-1">
              Describe your leave in natural language.<br />
              e.g. "I need sick leave next Monday and Tuesday"
            </p>
          </div>
        )}

        {messages.map((msg, i) => (
          <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div
              className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-sm ${
                msg.role === 'user'
                  ? 'bg-primary-600 text-white rounded-br-sm'
                  : 'bg-white border border-gray-200 text-gray-800 rounded-bl-sm shadow-sm'
              }`}
            >
              <p>{msg.content}</p>
              {msg.role === 'assistant' && msg.parsed && msg.status === 'STRUCTURED' && !confirmed && (
                <AiParsedPreview
                  parsed={msg.parsed}
                  onConfirm={confirmLeave}
                  isConfirming={isConfirming}
                />
              )}
            </div>
          </div>
        ))}

        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-white border border-gray-200 rounded-2xl rounded-bl-sm px-4 py-2.5 shadow-sm">
              <div className="flex gap-1">
                <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
            </div>
          </div>
        )}

        {confirmed && (
          <div className="text-center py-4">
            <div className="inline-flex items-center gap-2 bg-green-50 border border-green-200 text-green-700 px-4 py-2 rounded-lg text-sm font-medium">
              <span>✓</span> Leave request submitted successfully!
            </div>
            <button onClick={reset} className="block mx-auto mt-3 text-xs text-primary-600 hover:underline">
              Start a new request
            </button>
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      {!confirmed && (
        <AiChatInput onSend={sendMessage} disabled={isLoading || isConfirming} />
      )}

      {error && (
        <p className="text-xs text-red-500 mt-2">{error}</p>
      )}
    </div>
  );
}
