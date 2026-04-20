import { twMerge } from "tailwind-merge";
import React from "react";

export type AsChildProps<DefaultElementProps> =
  | ({ asChild?: false } & DefaultElementProps)
  | { asChild: true; children: React.ReactNode };

type SlotProps = React.HTMLAttributes<HTMLElement> & {
  children: React.ReactElement;
};

export function Slot({ children, ...props }: SlotProps) {
  if (React.Children.count(children) > 1) {
    throw new Error("Only one child allowed");
  }

  if (React.isValidElement(children)) {
    const childProps = children.props as React.HTMLAttributes<HTMLElement>;
    return React.cloneElement(children, {
      style: {
        ...props.style,
        ...childProps.style,
      },
      className: twMerge(props.className, childProps.className),

      ...props,
      ...childProps,
    });
  }

  return null;
}
