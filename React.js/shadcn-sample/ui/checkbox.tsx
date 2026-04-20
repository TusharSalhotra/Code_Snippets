import * as CheckboxPrimitive from "@radix-ui/react-checkbox";
import { Check } from "lucide-react";
import * as React from "react";

import { cn } from "@/shared/utils/cn-utils";

const Checkbox = React.forwardRef<
	React.ElementRef<typeof CheckboxPrimitive.Root>,
	React.ComponentPropsWithoutRef<typeof CheckboxPrimitive.Root>
>(({ className, ...props }, ref) => (
	<CheckboxPrimitive.Root
		ref={ref}
		className={cn(
			"peer h-4 w-4 shrink-0 rounded border border-teritory disabled:cursor-not-allowed disabled:opacity-50 " +
				"data-[state=checked]:bg-teritory data-[state=checked]:text-white " +
				// 👇 Add proper focus ring
				"focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-teritory",
			className,
		)}
		{...props}
	>
		<CheckboxPrimitive.Indicator className={cn("flex items-center justify-center text-current")}>
			<Check className="h-4 w-4" />
		</CheckboxPrimitive.Indicator>
	</CheckboxPrimitive.Root>
));
Checkbox.displayName = CheckboxPrimitive.Root.displayName;

export { Checkbox };
