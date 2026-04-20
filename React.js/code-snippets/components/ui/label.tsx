type LabelProps = React.ComponentProps<"label">;
export function Label({ children, htmlFor, ...props }: LabelProps) {
  return (
    <label
      className="text-sm text-gray-500 font-medium"
      htmlFor={htmlFor}
      {...props}
    >
      {children}
    </label>
  );
}
