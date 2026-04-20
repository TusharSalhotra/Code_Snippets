import { FiInbox } from "react-icons/fi";

interface EmptyStateProps {
  message?: string;
}

export function EmptyState({ message = "No data available" }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-12 bg-gray-50">
      <FiInbox className="w-12 h-12 text-gray-400 mb-3" />
      <p className="text-gray-500 text-sm">{message}</p>
    </div>
  );
}

interface LoadingStateProps {
  columns: number;
}

export function LoadingState({ columns }: LoadingStateProps) {
  return (
    <tbody>
      {[...Array(3)].map((_, rowIndex) => (
        <tr key={rowIndex} className="animate-pulse">
          {[...Array(columns)].map((_, colIndex) => (
            <td key={colIndex} className="px-6 py-4">
              <div className="h-4 bg-gray-200 rounded w-3/4" />
            </td>
          ))}
        </tr>
      ))}
    </tbody>
  );
}
