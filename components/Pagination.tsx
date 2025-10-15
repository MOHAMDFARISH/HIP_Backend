import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface PaginationProps {
  currentPage: number;
  totalCount: number;
  pageSize: number;
  onPageChange: (page: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalCount,
  pageSize,
  onPageChange,
}) => {
  const totalPages = Math.ceil(totalCount / pageSize);

  if (totalPages <= 1) {
    return null;
  }

  const handlePrevious = () => {
    onPageChange(currentPage - 1);
  };

  const handleNext = () => {
    onPageChange(currentPage + 1);
  };

  const firstItem = currentPage * pageSize + 1;
  const lastItem = Math.min((currentPage + 1) * pageSize, totalCount);

  return (
    <nav
      className="flex flex-col items-center justify-between gap-4 px-4 py-3 text-sm border-t border-gray-200 sm:flex-row sm:px-6"
      aria-label="Pagination"
    >
      <div className="hidden sm:block">
        <p className="text-gray-700">
          Showing <span className="font-medium">{firstItem}</span> to{' '}
          <span className="font-medium">{lastItem}</span> of{' '}
          <span className="font-medium">{totalCount}</span> results
        </p>
      </div>
      <div className="flex items-center justify-between flex-1 sm:justify-end">
        <button
          onClick={handlePrevious}
          disabled={currentPage === 0}
          className="relative inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <ChevronLeft className="w-4 h-4 mr-2" />
          Previous
        </button>
        <button
          onClick={handleNext}
          disabled={currentPage >= totalPages - 1}
          className="relative inline-flex items-center px-4 py-2 ml-3 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Next
          <ChevronRight className="w-4 h-4 ml-2" />
        </button>
      </div>
    </nav>
  );
};

export default Pagination;
