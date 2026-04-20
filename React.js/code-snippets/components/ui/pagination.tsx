interface ResultsInfoProps {
  startItem: number;
  endItem: number;
  totalItems: number;
}

export function ResultsInfo({
  startItem,
  endItem,
  totalItems,
}: ResultsInfoProps) {
  return (
    <div className="flex items-center mb-4 sm:mb-0">
      <p className="text-sm text-gray-700">
        Showing
        <span className="font-medium mx-1">{startItem}</span>
        to
        <span className="font-medium mx-1">{endItem}</span>
        of
        <span className="font-medium mx-1">{totalItems}</span>
        results
      </p>
    </div>
  );
}

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (_page: number) => void;
}

export function Pagination({
  currentPage,
  totalPages,
  onPageChange,
}: PaginationProps) {
  return (
    <div className="flex items-center space-x-2">
      <button
        className="px-3 py-1 rounded-md bg-gray-100 text-gray-700 hover:bg-gray-200 disabled:opacity-50"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
      >
        Previous
      </button>

      {[...Array(totalPages)].map((_, index) => (
        <button
          key={index + 1}
          onClick={() => onPageChange(index + 1)}
          className={`px-3 py-1 rounded-md ${
            currentPage === index + 1
              ? "bg-blue-600 text-white"
              : "hover:bg-gray-100"
          }`}
        >
          {index + 1}
        </button>
      ))}

      <button
        className="px-3 py-1 rounded-md bg-gray-100 text-gray-700 hover:bg-gray-200 disabled:opacity-50"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
      >
        Next
      </button>
    </div>
  );
}
