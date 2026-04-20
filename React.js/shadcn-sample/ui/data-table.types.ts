export interface TableColumn<T> {
	key: keyof T;
	label: string;
	sortable?: boolean;
	render?: (value: unknown, item: T) => React.ReactNode;
	className?: string;
}

// Base props interface
interface BaseDataTableProps<T> {
	data: T[];
	columns: TableColumn<T>[];
	title?: string | React.ReactNode;
	subtitle?: string;
	isLoading?: boolean;
	searchable?: boolean;
	exportable?: boolean;
	pageSize?: number;
	searchFields?: (keyof T)[];
	footer?: React.ReactNode;
	className?: string;
	onExport?: () => void;
	emptyMessage?: string;
	virtualizeRows?: boolean;
	onSortChange?: (field: keyof T, direction: SortDirection) => void;
	onSearchChange?: (searchTerm: string) => void;
	headerActions?: React.ReactNode;
}

// Client-side pagination props
interface ClientPaginationProps<T> extends BaseDataTableProps<T> {
	serverPagination?: false;
	totalCount?: never;
	currentPage?: never;
	onPageChange?: never;
	onPageSizeChange?: never;
}

// Server-side pagination props (requires totalCount)
interface ServerPaginationProps<T> extends BaseDataTableProps<T> {
	serverPagination: true;
	totalCount: number;
	currentPage?: number;
	onPageChange?: (page: number) => void;
	onPageSizeChange?: (size: number) => void;
}

export type DataTableProps<T> = ClientPaginationProps<T> | ServerPaginationProps<T>;

export type SortDirection = "asc" | "desc";
