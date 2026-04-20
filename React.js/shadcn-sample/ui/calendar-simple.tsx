"use client";

import type * as React from "react";
import { DayPicker } from "react-day-picker";

import { cn } from "@/shared/utils/cn-utils";

export type CalendarProps = React.ComponentProps<typeof DayPicker>;

function CalendarSimple({ className, showOutsideDays = true, ...props }: CalendarProps) {
	return (
		<DayPicker
			showOutsideDays={showOutsideDays}
			className={cn("p-3 rdp-custom", className)}
			modifiersStyles={{
				selected: {
					backgroundColor: "var(--color-brand-primary)",
					color: "white",
					fontWeight: "500",
					border: "2px solid var(--color-brand-primary)",
				},
				today: {
					fontWeight: "bold",
					textDecoration: "underline",
				},
			}}
			styles={{
				head_cell: {
					width: "2rem",
					fontWeight: "normal",
					fontSize: "0.875rem",
					color: "var(--muted-foreground)",
				},
				cell: {
					width: "2rem",
					height: "2rem",
				},
				day: {
					width: "2rem",
					height: "2rem",
					fontSize: "0.875rem",
				},
			}}
			{...props}
		/>
	);
}
CalendarSimple.displayName = "CalendarSimple";

export { CalendarSimple };
