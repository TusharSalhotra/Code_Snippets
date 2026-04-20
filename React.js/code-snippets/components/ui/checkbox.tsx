import { cn } from "@/lib/utils";

interface CheckboxProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "type"> {
  label?: string;
}

export function Checkbox({
  checked,
  value,
  onChange,
  className = "",
  ...props
}: CheckboxProps) {
  return (
    <label
      htmlFor={props.id}
      className="flex items-center cursor-pointer relative"
    >
      <input
        type="checkbox"
        checked={checked || !!value}
        onChange={onChange}
        className={cn(
          "peer h-[19px] w-[19px] cursor-pointer transition-all appearance-none border border-[#BDBDBD] hover:border-[#5D98CC] checked:border-[#3276B1]",
          className,
        )}
        {...props}
      />
      <span className="absolute text-[#3276B1] bg-white top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
        {checked ? <CheckIcon /> : <UncheckIcon />}
      </span>
    </label>
  );
}

const CheckIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    height="16px"
    viewBox="0 -960 960 960"
    width="16px"
    fill="currentColor"
  >
    <path d="M382-208 122-468l90-90 170 170 366-366 90 90-456 456Z" />
  </svg>
);

const UncheckIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    height="15px"
    viewBox="0 -960 960 960"
    width="15px"
    fill="currentColor"
  >
    <path d="m256-168-88-88 224-224-224-224 88-88 224 224 224-224 88 88-224 224 224 224-88 88-224-224-224 224Z" />
  </svg>
);
