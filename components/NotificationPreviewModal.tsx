
import React, { useEffect } from 'react';
import { X, Send } from 'lucide-react';

interface NotificationPreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSend: () => void;
  recipientEmail: string;
  subject: string;
  body: string;
}

const NotificationPreviewModal: React.FC<NotificationPreviewModalProps> = ({
  isOpen,
  onClose,
  onSend,
  recipientEmail,
  subject,
  body,
}) => {
  useEffect(() => {
    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };
    if (isOpen) {
      window.addEventListener('keydown', handleEsc);
    }
    return () => {
      window.removeEventListener('keydown', handleEsc);
    };
  }, [isOpen, onClose]);

  if (!isOpen) {
    return null;
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-75"
      onClick={onClose}
      aria-modal="true"
      role="dialog"
    >
      <div
        className="relative flex flex-col w-full max-w-2xl bg-white rounded-lg shadow-xl max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        <header className="flex items-start justify-between p-4 border-b">
            <h2 className="text-xl font-semibold text-gray-800">Email Notification Preview</h2>
            <button
                onClick={onClose}
                className="p-1 text-gray-500 rounded-full hover:bg-gray-200 hover:text-gray-800"
                aria-label="Close modal"
            >
                <X className="w-6 h-6" />
            </button>
        </header>
        
        <main className="flex-1 p-4 space-y-4 overflow-y-auto">
            <div>
                <label className="text-sm font-medium text-gray-500">To:</label>
                <p className="p-2 mt-1 text-gray-800 bg-gray-100 rounded-md">{recipientEmail}</p>
            </div>
            <div>
                <label className="text-sm font-medium text-gray-500">Subject:</label>
                <p className="p-2 mt-1 text-gray-800 bg-gray-100 rounded-md">{subject}</p>
            </div>
            <div>
                <label className="text-sm font-medium text-gray-500">Body:</label>
                <div className="p-2 mt-1 text-gray-800 whitespace-pre-wrap bg-gray-100 rounded-md">
                    {body}
                </div>
            </div>
        </main>

        <footer className="flex justify-end p-4 space-x-4 border-t bg-gray-50 rounded-b-lg">
            <button
                onClick={onClose}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-400"
            >
                Cancel
            </button>
            <button
                onClick={onSend}
                className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white border border-transparent rounded-md shadow-sm bg-brand-primary hover:bg-brand-secondary focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-primary"
            >
                <Send className="w-4 h-4" />
                Send Notification
            </button>
        </footer>
      </div>
    </div>
  );
};

export default NotificationPreviewModal;
