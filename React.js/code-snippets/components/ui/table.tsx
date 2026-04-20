import { useState } from "react";
import { ResultsInfo, Pagination } from "./pagination";
import { EmptyState, LoadingState } from "./states-handler";
import EditIcon from "../../assets/icons/edit.png";
import DeleteIcon from "../../assets/icons/deleteIcon.gif";

interface TableHeaderProps {
  columns: {
    key: string;
    label: string;
  }[];
}

export function TableHeader({ columns }: TableHeaderProps) {
  return (
    <thead className="text-xs text-white bg-[#313146] h-5">
      <tr>
        {columns.map((column) => (
          <th
            key={column.key}
            scope="col"
            className="p-2 [&:not(:last-child)]:border-r border-[#ddd]  font-normal"
          >
            {column.label}
          </th>
        ))}
      </tr>
    </thead>
  );
}

interface TableBodyProps<Row> {
  data: Row[];
  columns: {
    key: string;
    render?: (_item: Row) => React.ReactNode;
  }[];
  onRowClick?: (_item: Row) => void;
}

export function TableBody<Data>({
  data,
  columns,
  onRowClick,
}: TableBodyProps<Data>) {
  return (
    <tbody className="border-l border-r border-[#ddd]">
      {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
      {data.map((item: any, index) => (
        <tr
          key={index}
          className="bg-white [&:not(:last-child)]:border-b border-[#ddd]"
          onClick={() => onRowClick?.(item)}
        >
          {columns.map((column) => (
            <td
              key={column.key}
              className="p-2 [&:not(:last-child)]:border-r border-[#ddd]"
            >
              {column.render ? column.render(item) : item[column.key]}
            </td>
          ))}
        </tr>
      ))}
    </tbody>
  );
}

interface TableActionProps {
  onEdit?: () => void;
  onDelete?: () => void;
  canDelete?: boolean;
  canEdit?: boolean;
}

export function TableActions({
  onEdit,
  onDelete,
  canDelete = true,
  canEdit = true,
}: TableActionProps) {
  return (
    <div className="flex items-center gap-4">
      {canDelete && onDelete && (
        <button
          title="Delete"
          onClick={(e) => {
            e.stopPropagation();
            onDelete();
          }}
        >
          <img src={DeleteIcon} />
        </button>
      )}

      {canEdit && onEdit && (
        <button title="Edit" onClick={onEdit}>
          <img src={EditIcon} />
        </button>
      )}
    </div>
  );
}

interface TableProps<Row> {
  columns: {
    key: string;
    label: string;
    render?: (_item: Row) => React.ReactNode;
  }[];
  data: Row[];
  itemsPerPage: number;
  isLoading?: boolean;
  emptyMessage?: string;
  showPagination?: boolean;
}

export function Table<Data>({
  columns,
  data,
  itemsPerPage,
  isLoading = false,
  emptyMessage = "No data found",
  showPagination = true,
}: TableProps<Data>) {
  const [currentPage, setCurrentPage] = useState(1);
  const totalItems = data.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  const startItem = (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalItems);

  const currentData = data.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );

  return (
    <div>
      <div className="overflow-x-auto">
        <table className="w-full text-xs text-left text-[#333] border-b border-gray-200">
          <TableHeader columns={columns} />

          {isLoading ? (
            <LoadingState columns={columns.length} />
          ) : data.length === 0 ? (
            <tbody>
              <tr>
                <td colSpan={columns.length}>
                  <EmptyState message={emptyMessage} />
                </td>
              </tr>
            </tbody>
          ) : (
            <TableBody data={currentData} columns={columns} />
          )}
        </table>
      </div>

      {showPagination && !isLoading && data.length > 0 && (
        <div className="flex flex-col sm:flex-row items-center justify-between px-4 py-3 bg-white">
          <ResultsInfo
            startItem={startItem}
            endItem={endItem}
            totalItems={totalItems}
          />
          {totalPages > 1 && (
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
            />
          )}
        </div>
      )}
    </div>
  );
}
