import type * as LabelPrimitive from "@radix-ui/react-label";
import { Slot } from "@radix-ui/react-slot";
import * as React from "react";

import { Label } from "@/shared/components/ui/label";
import { cn } from "@/shared/utils/cn-utils";

const Form = React.forwardRef<HTMLFormElement, React.ComponentPropsWithoutRef<"form">>(
	({ className, ...props }, ref) => (
		<form ref={ref} className={cn("space-y-6", className)} {...props} />
	),
);
Form.displayName = "Form";

const FormItem = React.forwardRef<HTMLDivElement, React.ComponentPropsWithoutRef<"div">>(
	({ className, ...props }, ref) => (
		<div ref={ref} className={cn("space-y-2", className)} {...props} />
	),
);
FormItem.displayName = "FormItem";

const FormLabel = React.forwardRef<
	React.ElementRef<typeof LabelPrimitive.Root>,
	React.ComponentPropsWithoutRef<typeof LabelPrimitive.Root>
>(({ className, ...props }, ref) => <Label ref={ref} className={cn(className)} {...props} />);
FormLabel.displayName = "FormLabel";

const FormControl = React.forwardRef<
	React.ElementRef<typeof Slot>,
	React.ComponentPropsWithoutRef<typeof Slot>
>(({ ...props }, ref) => <Slot ref={ref} {...props} />);
FormControl.displayName = "FormControl";

const FormDescription = React.forwardRef<HTMLParagraphElement, React.ComponentPropsWithoutRef<"p">>(
	({ className, ...props }, ref) => (
		<p ref={ref} className={cn("text-sm text-muted-foreground", className)} {...props} />
	),
);
FormDescription.displayName = "FormDescription";

const FormMessage = React.forwardRef<HTMLParagraphElement, React.ComponentPropsWithoutRef<"p">>(
	({ className, children, ...props }, ref) => {
		if (!children) {
			return null;
		}

		return (
			<p ref={ref} className={cn("text-sm font-medium text-destructive", className)} {...props}>
				{children}
			</p>
		);
	},
);
FormMessage.displayName = "FormMessage";

export { Form, FormItem, FormLabel, FormControl, FormDescription, FormMessage };
