import { FileText, Info, User } from "lucide-react";
import { formatDate } from "@/shared/utils/formatters";
import type { AuditLogSummary } from "../types/audit-log.types";

interface AuditSummaryCardsProps {
	summary: AuditLogSummary;
	isLoading?: boolean;
}

export function AuditSummaryCards({ summary, isLoading }: AuditSummaryCardsProps) {
	return (
		<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
			{/* Total Activities Card */}
			<div className="bg-white rounded-xl p-6 transition-all duration-300 hover:shadow-lg border border-gray-100 shadow-sm h-[140px] flex flex-col">
				<div className="flex items-center justify-between mb-4">
					<h3 className="text-sm font-medium text-gray-600">Total Activities</h3>
					<FileText className="h-4 w-4 text-gray-400" />
				</div>

				<div className="space-y-1 flex-1">
					{isLoading ? (
						<div className="h-8 w-20 bg-gray-200 rounded animate-pulse" />
					) : (
						<>
							<p className="text-2xl font-bold text-gray-900">
								{summary.totalActivities.toLocaleString()}
							</p>
							<p className="text-sm text-gray-500">In selected period</p>
						</>
					)}
				</div>
			</div>

			{/* Last User Action Card */}
			<div className="bg-white rounded-xl p-6 transition-all duration-300 hover:shadow-lg border border-gray-100 shadow-sm h-[140px] flex flex-col">
				<div className="flex items-center justify-between mb-4">
					<h3 className="text-sm font-medium text-gray-600">Last User Action</h3>
					<User className="h-4 w-4 text-gray-400" />
				</div>

				<div className="space-y-1 flex-1">
					{isLoading ? (
						<div className="space-y-2">
							<div className="h-8 w-32 bg-gray-200 rounded animate-pulse" />
							<div className="h-4 w-24 bg-gray-200 rounded animate-pulse" />
						</div>
					) : summary.lastUserAction ? (
						<>
							<p className="text-2xl font-bold text-gray-900 truncate">
								{summary.lastUserAction.userName}
							</p>
							<p className="text-sm text-gray-500">{summary.lastUserAction.action}</p>
						</>
					) : (
						<p className="text-sm text-gray-500">No recent actions</p>
					)}
				</div>
			</div>

			{/* Last Activity Card */}
			<div className="bg-white rounded-xl p-6 transition-all duration-300 hover:shadow-lg border border-gray-100 shadow-sm h-[140px] flex flex-col">
				<div className="flex items-center justify-between mb-4">
					<h3 className="text-sm font-medium text-gray-600">Last Activity</h3>
					<Info className="h-4 w-4 text-gray-400" />
				</div>

				<div className="space-y-1 flex-1">
					{isLoading ? (
						<div className="space-y-2">
							<div className="h-8 w-24 bg-gray-200 rounded animate-pulse" />
							<div className="h-4 w-36 bg-gray-200 rounded animate-pulse" />
						</div>
					) : summary.lastActivity ? (
						<>
							<p className="text-2xl font-bold text-gray-900">
								{formatDate(summary.lastActivity.date)}
							</p>
							<p className="text-sm text-gray-500">{summary.lastActivity.description}</p>
						</>
					) : (
						<p className="text-sm text-gray-500">No recent activity</p>
					)}
				</div>
			</div>
		</div>
	);
}
