import { format } from "date-fns";
import { Calendar } from "lucide-react";
import { useEffect, useState } from "react";
import {
	Button,
	CustomCalendar,
	cn,
	Label,
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/shared";
import type { AuditLogFilter } from "../types/audit-log.types";

interface TimePeriodSelectorProps {
	filters: AuditLogFilter;
	onFiltersChange: (filters: AuditLogFilter) => void;
	className?: string;
}

const TIME_PERIODS = [
	{ value: "today", label: "Today" },
	{ value: "7d", label: "7d" },
	{ value: "30d", label: "30d" },
	{ value: "90d", label: "90d" },
] as const;

export function TimePeriodSelector({
	filters,
	onFiltersChange,
	className,
}: TimePeriodSelectorProps) {
	const [isStartDateOpen, setIsStartDateOpen] = useState(false);
	const [isEndDateOpen, setIsEndDateOpen] = useState(false);
	const [isCustomPopoverOpen, setIsCustomPopoverOpen] = useState(false);
	// Local state for date selection before applying
	const [tempStartDate, setTempStartDate] = useState<Date | undefined>(filters.startDate);
	const [tempEndDate, setTempEndDate] = useState<Date | undefined>(filters.endDate);

	// Update temp dates when filters change
	useEffect(() => {
		if (filters.timeFilter === "custom") {
			setTempStartDate(filters.startDate);
			setTempEndDate(filters.endDate);
		}
	}, [filters.startDate, filters.endDate, filters.timeFilter]);

	const handleTimePeriodChange = (period: string) => {
		if (period === "custom") {
			// Just open the custom date picker, don't apply yet
			setIsCustomPopoverOpen(true);
			// Reset temp dates to current filter values
			setTempStartDate(filters.startDate);
			setTempEndDate(filters.endDate);
		} else {
			onFiltersChange({
				...filters,
				timeFilter: period as AuditLogFilter["timeFilter"],
				startDate: undefined,
				endDate: undefined,
			});
		}
	};

	const handleStartDateSelect = (date: Date | undefined) => {
		if (date) {
			setTempStartDate(date);
			// Also set end date if not set
			if (!tempEndDate) {
				setTempEndDate(date);
			}
			setIsStartDateOpen(false);
			// Automatically open end date picker after selecting start date
			setTimeout(() => setIsEndDateOpen(true), 200);
		}
	};

	const handleEndDateSelect = (date: Date | undefined) => {
		if (date) {
			setTempEndDate(date);
			// Also set start date if not set
			if (!tempStartDate) {
				setTempStartDate(date);
			}
			setIsEndDateOpen(false);
		}
	};

	const handleApplyCustomRange = () => {
		if (tempStartDate && tempEndDate) {
			onFiltersChange({
				...filters,
				timeFilter: "custom",
				startDate: tempStartDate,
				endDate: tempEndDate,
			});
			setIsCustomPopoverOpen(false);
		}
	};

	const handleCancelCustomRange = () => {
		// Reset temp dates
		setTempStartDate(filters.startDate);
		setTempEndDate(filters.endDate);
		setIsCustomPopoverOpen(false);
	};

	return (
		<div className={cn("flex items-center gap-2", className)}>
			{/* Time Period Buttons */}
			<div className="flex items-center gap-1">
				{TIME_PERIODS.map((period) => (
					<Button
						key={period.value}
						size="sm"
						variant={filters.timeFilter === period.value ? "default" : "outline"}
						onClick={() => handleTimePeriodChange(period.value)}
						className={cn(
							"h-8",
							filters.timeFilter === period.value
								? "bg-[var(--color-brand-primary)] hover:bg-[var(--color-brand-primary)]/90 text-white border-0"
								: "bg-white hover:bg-gray-50",
						)}
					>
						{period.label}
					</Button>
				))}
			</div>

			{/* Custom Date Range Picker */}
			<Popover open={isCustomPopoverOpen} onOpenChange={setIsCustomPopoverOpen}>
				<PopoverTrigger asChild>
					<Button
						size="sm"
						variant={filters.timeFilter === "custom" ? "default" : "outline"}
						onClick={() => handleTimePeriodChange("custom")}
						className={cn(
							"h-8 gap-2",
							filters.timeFilter === "custom"
								? "bg-[var(--color-brand-primary)] hover:bg-[var(--color-brand-primary)]/90 text-white border-0"
								: "bg-white hover:bg-gray-50",
						)}
					>
						<Calendar className="h-4 w-4" />
						{filters.timeFilter === "custom" && filters.startDate && filters.endDate ? (
							<span className="text-xs">
								{format(filters.startDate, "MMM d")} - {format(filters.endDate, "MMM d, yyyy")}
							</span>
						) : (
							<span>Custom</span>
						)}
					</Button>
				</PopoverTrigger>
				<PopoverContent align="end" className="w-[500px] p-4">
					<div className="space-y-4">
						<div className="space-y-2">
							<Label className="text-sm font-medium">Custom Range</Label>
							<div className="grid grid-cols-2 gap-3">
								{/* Start Date */}
								<div className="space-y-2">
									<Label className="text-xs text-gray-600">Start Date</Label>
									<Popover open={isStartDateOpen} onOpenChange={setIsStartDateOpen}>
										<PopoverTrigger asChild>
											<Button
												variant="outline"
												className={cn(
													"w-full justify-start text-left font-normal h-10 px-3 border-gray-200 hover:border-gray-300 focus:border-[var(--color-brand-primary)] focus:ring-1 focus:ring-[var(--color-brand-primary)]",
													!tempStartDate && "text-gray-500",
													tempStartDate && "text-gray-900",
												)}
											>
												<Calendar className="mr-2 h-4 w-4 text-gray-400" />
												{tempStartDate ? (
													<span className="font-medium">
														{format(tempStartDate, "MMM dd, yyyy")}
													</span>
												) : (
													<span>Select start date</span>
												)}
											</Button>
										</PopoverTrigger>
										<PopoverContent className="w-auto p-0" align="start">
											<CustomCalendar selected={tempStartDate} onSelect={handleStartDateSelect} />
										</PopoverContent>
									</Popover>
								</div>

								{/* End Date */}
								<div className="space-y-2">
									<Label className="text-xs text-gray-600">End Date</Label>
									<Popover open={isEndDateOpen} onOpenChange={setIsEndDateOpen}>
										<PopoverTrigger asChild>
											<Button
												variant="outline"
												className={cn(
													"w-full justify-start text-left font-normal h-10 px-3 border-gray-200 hover:border-gray-300 focus:border-[var(--color-brand-primary)] focus:ring-1 focus:ring-[var(--color-brand-primary)]",
													!tempEndDate && "text-gray-500",
													tempEndDate && "text-gray-900",
												)}
											>
												<Calendar className="mr-2 h-4 w-4 text-gray-400" />
												{tempEndDate ? (
													<span className="font-medium">{format(tempEndDate, "MMM dd, yyyy")}</span>
												) : (
													<span>Select end date</span>
												)}
											</Button>
										</PopoverTrigger>
										<PopoverContent className="w-auto p-0" align="start">
											<CustomCalendar selected={tempEndDate} onSelect={handleEndDateSelect} />
										</PopoverContent>
									</Popover>
								</div>
							</div>
						</div>

						{/* Quick Actions */}
						<div className="space-y-2">
							<div className="flex gap-2">
								<Button
									variant="outline"
									size="sm"
									onClick={() => {
										const today = new Date();
										const sevenDaysAgo = new Date(today);
										sevenDaysAgo.setDate(today.getDate() - 7);
										setTempStartDate(sevenDaysAgo);
										setTempEndDate(today);
									}}
									className="flex-1"
								>
									Last 7d
								</Button>
								<Button
									variant="outline"
									size="sm"
									onClick={() => {
										const today = new Date();
										const thirtyDaysAgo = new Date(today);
										thirtyDaysAgo.setDate(today.getDate() - 30);
										setTempStartDate(thirtyDaysAgo);
										setTempEndDate(today);
									}}
									className="flex-1"
								>
									Last 30d
								</Button>
							</div>

							{/* Action Buttons */}
							<div className="flex gap-2 pt-2 border-t">
								<Button
									variant="outline"
									size="sm"
									onClick={handleCancelCustomRange}
									className="flex-1"
								>
									Cancel
								</Button>
								<Button
									size="sm"
									onClick={handleApplyCustomRange}
									disabled={!tempStartDate || !tempEndDate}
									className="flex-1 bg-[var(--color-brand-primary)] hover:bg-[var(--color-brand-primary)]/90 text-white"
								>
									Apply
								</Button>
							</div>
						</div>
					</div>
				</PopoverContent>
			</Popover>
		</div>
	);
}
