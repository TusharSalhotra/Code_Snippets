import { forwardRef } from "react";
import { FiChevronDown, FiAlertCircle } from "react-icons/fi";

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  options: { value: string; label: string }[];
  error?: string;
  required?: boolean;
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, options, error, required, className = "", ...props }, ref) => {
    return (
      <div className="space-x-4 flex items-center">
        {label && (
          <label className="block text-[13px] text-[#333] w-[104px]">
            {label} {required && <span className="text-red-500">*</span>}
          </label>
        )}
        <div className="relative">
          <select
            ref={ref}
            className={`
              w-[264px] px-[5px] border bg-[#fff7f7] h-8 text-[#404040] text-[13px]
              appearance-none
              transition-all duration-200 border-l-[3px] !border-l-red-500
              ${
                error
                  ? "border-red-500 focus:ring-red-200"
                  : "border-[#BDBDBD] hover:border-[#3276B1] focus:border-[#3276B1]"
              }
              focus:outline-none
              disabled:bg-gray-50 disabled:text-gray-500
              ${className}
            `}
            {...props}
          >
            {options.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          <div className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none flex items-center">
            {error ? (
              <FiAlertCircle className="h-5 w-5 text-red-500" />
            ) : (
              <FiChevronDown className="h-5 w-5 text-gray-400" />
            )}
          </div>
        </div>
        {error && <p className="text-sm text-red-500">{error}</p>}
      </div>
    );
  },
);

Select.displayName = "Select";
