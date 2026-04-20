interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "outline";
  children: React.ReactNode;
}

export function Button({
  variant = "primary",
  children,
  className = "",
  ...props
}: ButtonProps) {
  const baseStyles =
    "px-[15px] py-[5px] rounded-sm transition-colors duration-200 flex items-center justify-center text-xs";
  const variants = {
    primary:
      "bg-[#3b9ff3] text-white disabled:opacity-60 focus:shadow-none border border-[#3292E2] shadow-[0px_2px_4px_0px_rgba(0,0,0,0.2),0px_3px_10px_0px_rgba(0,0,0,0.19)]",
    outline:
      "border border-gray-300 text-gray-700 hover:bg-gray-50 disabled:bg-gray-50 disabled:text-gray-400",
  };

  return (
    <button
      className={`${baseStyles} ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
