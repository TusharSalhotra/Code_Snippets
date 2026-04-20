"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { useState } from "react";
import { Button } from "@/shared/components/ui/button";
import { cn } from "@/shared/utils/cn-utils";

interface CustomCalendarProps {
	selected?: Date;
	onSelect?: (date: Date) => void;
	className?: string;
}

export function CustomCalendar({ selected, onSelect, className }: CustomCalendarProps) {
	const [currentMonth, setCurrentMonth] = useState(selected || new Date());

	const monthNames = [
		"January",
		"February",
		"March",
		"April",
		"May",
		"June",
		"July",
		"August",
		"September",
		"October",
		"November",
		"December",
	];

	const daysOfWeek = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

	const getDaysInMonth = (date: Date) => {
		return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
	};

	const getFirstDayOfMonth = (date: Date) => {
		return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
	};

	const handlePrevMonth = () => {
		setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1));
	};

	const handleNextMonth = () => {
		setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1));
	};

	const handleDateClick = (day: number) => {
		const newDate = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
		onSelect?.(newDate);
	};

	const isToday = (day: number) => {
		const today = new Date();
		return (
			day === today.getDate() &&
			currentMonth.getMonth() === today.getMonth() &&
			currentMonth.getFullYear() === today.getFullYear()
		);
	};

	const isSelected = (day: number) => {
		if (!selected) return false;
		return (
			day === selected.getDate() &&
			currentMonth.getMonth() === selected.getMonth() &&
			currentMonth.getFullYear() === selected.getFullYear()
		);
	};

	const daysInMonth = getDaysInMonth(currentMonth);
	const firstDayOfMonth = getFirstDayOfMonth(currentMonth);
	const daysInPrevMonth =
		currentMonth.getMonth() === 0
			? getDaysInMonth(new Date(currentMonth.getFullYear() - 1, 11))
			: getDaysInMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1));

	// Generate calendar days
	const calendarDays: { day: number; isCurrentMonth: boolean }[] = [];

	// Previous month days
	for (let i = firstDayOfMonth - 1; i >= 0; i--) {
		calendarDays.push({
			day: daysInPrevMonth - i,
			isCurrentMonth: false,
		});
	}

	// Current month days
	for (let i = 1; i <= daysInMonth; i++) {
		calendarDays.push({
			day: i,
			isCurrentMonth: true,
		});
	}

	// Next month days (fill to make 42 cells - 6 weeks)
	const remainingDays = 42 - calendarDays.length;
	for (let i = 1; i <= remainingDays; i++) {
		calendarDays.push({
			day: i,
			isCurrentMonth: false,
		});
	}

	return (
		<div className={cn("p-3 bg-white rounded-lg border", className)}>
			{/* Header */}
			<div className="flex items-center justify-between mb-4 relative">
				<Button
					variant="outline"
					size="icon"
					className="h-7 w-7 absolute left-0"
					onClick={handlePrevMonth}
				>
					<ChevronLeft className="h-4 w-4" />
				</Button>

				<h2 className="text-sm font-medium text-center flex-1">
					{monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
				</h2>

				<Button
					variant="outline"
					size="icon"
					className="h-7 w-7 absolute right-0"
					onClick={handleNextMonth}
				>
					<ChevronRight className="h-4 w-4" />
				</Button>
			</div>

			{/* Days of week */}
			<div className="grid grid-cols-7 gap-0 mb-2">
				{daysOfWeek.map((day) => (
					<div key={day} className="text-center text-xs font-normal text-muted-foreground p-2">
						{day}
					</div>
				))}
			</div>

			{/* Calendar days */}
			<div className="grid grid-cols-7 gap-0">
				{calendarDays.map((calDay, index) => (
					<div key={index} className="p-1">
						<button
							onClick={() => calDay.isCurrentMonth && handleDateClick(calDay.day)}
							disabled={!calDay.isCurrentMonth}
							className={cn(
								"h-9 w-9 p-0 font-normal text-sm rounded-md transition-all",
								"hover:bg-accent hover:text-accent-foreground",
								"focus:outline-none focus:ring-2 focus:ring-[var(--color-brand-primary)] focus:ring-offset-2",
								"disabled:opacity-50 disabled:cursor-not-allowed",
								calDay.isCurrentMonth &&
									isToday(calDay.day) &&
									"ring-2 ring-[var(--color-brand-primary)] ring-offset-2",
								calDay.isCurrentMonth &&
									isSelected(calDay.day) &&
									"bg-[var(--color-brand-primary)] text-white hover:bg-[var(--color-brand-primary-hover)] hover:text-white font-medium",
								!calDay.isCurrentMonth && "text-muted-foreground",
							)}
						>
							{calDay.day}
						</button>
					</div>
				))}
			</div>
		</div>
	);
}
