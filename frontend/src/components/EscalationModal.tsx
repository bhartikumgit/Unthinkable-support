import { useState } from 'react';
import { XMarkIcon } from '@heroicons/react/24/outline';

interface EscalationModalProps {
  onClose: () => void;
  onEscalate: (issue: string) => void;
}

const EscalationModal = ({ onClose, onEscalate }: EscalationModalProps) => {
  const [issue, setIssue] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (issue.trim()) {
      onEscalate(issue.trim());
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 max-w-md w-full mx-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-900">
            Connect with Support
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <XMarkIcon className="h-6 w-6" />
          </button>
        </div>

        <p className="text-gray-600 mb-4">
          I'll connect you with a support representative who can better assist you.
          Please briefly describe your issue:
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <textarea
            value={issue}
            onChange={(e) => setIssue(e.target.value)}
            placeholder="Please describe your issue..."
            className="w-full h-32 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-1"
            required
          />

          <div className="flex gap-3 justify-end">
            <button
              type="button"
              onClick={onClose}
              className="btn-secondary"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn-primary"
              disabled={!issue.trim()}
            >
              Create Ticket
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EscalationModal;
