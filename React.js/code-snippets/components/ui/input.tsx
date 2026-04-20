import { forwardRef } from "react";
import { FiAlertCircle } from "react-icons/fi";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  required?: boolean;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, required, className = "", ...props }, ref) => {
    return (
      <div className="space-x-4 flex items-center">
        {label && (
          <label className="block text-[13px] text-[#333] w-[104px]">
            {label} {required && <span className="text-red-500">*</span>}
          </label>
        )}
        <div className="relative">
          <input
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
          />
          {error && (
            <div className="absolute right-3 top-2.5">
              <FiAlertCircle className="h-5 w-5 text-red-500" />
            </div>
          )}
        </div>
        {error && <p className="text-sm text-red-500">{error}</p>}
      </div>
    );
  },
);

Input.displayName = "Input";
