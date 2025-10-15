
import React, { useEffect } from 'react';
import { X } from 'lucide-react';

interface ReceiptModalProps {
  imageUrl: string;
  onClose: () => void;
}

const ReceiptModal: React.FC<ReceiptModalProps> = ({ imageUrl, onClose }) => {
  
  useEffect(() => {
    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleEsc);
    return () => {
      window.removeEventListener('keydown', handleEsc);
    };
  }, [onClose]);

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-75"
      onClick={onClose}
    >
      <div 
        className="relative max-w-3xl max-h-[90vh] bg-white rounded-lg shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <button 
          onClick={onClose}
          className="absolute top-0 right-0 z-10 p-2 m-2 text-gray-500 bg-white rounded-full -translate-y-1/2 translate-x-1/2 hover:bg-gray-200 hover:text-gray-800"
        >
          <X className="w-6 h-6" />
        </button>
        <img src={imageUrl} alt="Payment Receipt" className="object-contain w-full h-full max-h-[90vh] rounded-lg" />
      </div>
    </div>
  );
};

export default ReceiptModal;
