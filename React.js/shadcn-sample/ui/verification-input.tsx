import { CheckCircle, XCircle } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { cn } from "@/shared/utils/cn-utils";
import { Input } from "./input";

interface VerificationInputProps {
	length?: number;
	value: string;
	onChange: (value: string) => void;
	onComplete?: (value: string) => void;
	onClear?: () => void;
	autoFocus?: boolean;
	error?: boolean;
	disabled?: boolean;
	className?: string;
	autoComplete?: string;
}

export function VerificationInput({
	length = 6,
	value = "",
	onChange,
	onComplete,
	onClear,
	autoFocus = true,
	error = false,
	disabled = false,
	className,
	autoComplete = "off",
}: VerificationInputProps) {
	const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
	const [focusedIndex, setFocusedIndex] = useState<number | null>(null);
	const [isComplete, setIsComplete] = useState(false);
	const [hasSubmitted, setHasSubmitted] = useState(false);

	// Split value into individual digits
	const digits = value.split("").concat(Array(length - value.length).fill(""));

	useEffect(() => {
		// Auto-focus first input on mount
		if (autoFocus && inputRefs.current[0]) {
			inputRefs.current[0].focus();
		}
	}, [autoFocus]);

	useEffect(() => {
		// Check if complete
		const complete = value.length === length && /^\d+$/.test(value);
		setIsComplete(complete);

		if (complete && onComplete && !hasSubmitted) {
			// Delay to show success state and prevent multiple submissions
			setHasSubmitted(true);
			setTimeout(() => onComplete(value), 100);
		}

		// Reset hasSubmitted flag when value changes from complete to incomplete
		if (!complete && hasSubmitted) {
			setHasSubmitted(false);
		}
	}, [value, length, onComplete, hasSubmitted]);

	const handleDigitChange = (index: number, digit: string) => {
		// Only allow single digit
		if (digit.length > 1) return;

		// Only allow numbers
		if (digit && !/^\d$/.test(digit)) return;

		const newDigits = [...digits];
		newDigits[index] = digit;
		const newValue = newDigits.join("").slice(0, length);

		onChange(newValue);

		// Auto-focus next input
		if (digit && index < length - 1) {
			inputRefs.current[index + 1]?.focus();
		}
	};

	const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
		// Handle backspace
		if (e.key === "Backspace") {
			if (!digits[index] && index > 0) {
				// Move to previous input if current is empty
				inputRefs.current[index - 1]?.focus();
			} else {
				// Clear current digit
				handleDigitChange(index, "");
			}
			e.preventDefault();
		}

		// Handle arrow keys
		if (e.key === "ArrowLeft" && index > 0) {
			inputRefs.current[index - 1]?.focus();
		}
		if (e.key === "ArrowRight" && index < length - 1) {
			inputRefs.current[index + 1]?.focus();
		}

		// Handle Enter
		if (e.key === "Enter" && isComplete) {
			onComplete?.(value);
		}
	};

	const handlePaste = (e: React.ClipboardEvent) => {
		e.preventDefault();
		const pastedData = e.clipboardData.getData("text");
		const cleaned = pastedData.replace(/\D/g, "").slice(0, length);
		onChange(cleaned);

		// Focus last input or next empty one
		const nextIndex = Math.min(cleaned.length, length - 1);
		inputRefs.current[nextIndex]?.focus();
	};

	const handleFocus = (index: number) => {
		setFocusedIndex(index);
		// Select all text on focus
		inputRefs.current[index]?.select();
	};

	const getInputClassName = (index: number) => {
		return cn("w-12 h-12 text-center text-lg font-bold border-2 transition-all duration-200", {
			"border-green-500 bg-green-50": isComplete && !error,
			"border-red-500 bg-red-50": error,
			"border-[var(--color-brand-primary)] ring-2 ring-[var(--color-brand-focus-ring)]":
				focusedIndex === index && !error && !isComplete,
			"border-gray-300": focusedIndex !== index && !error && !isComplete,
			"animate-pulse": disabled,
		});
	};

	return (
		<div className={cn("space-y-2", className)}>
			<div className="flex justify-center gap-2 sm:gap-3">
				{Array.from({ length }).map((_, index) => (
					<div key={index} className="relative">
						<Input
							ref={(el) => {
								inputRefs.current[index] = el;
							}}
							type="text"
							inputMode="numeric"
							maxLength={1}
							value={digits[index]}
							onChange={(e) => handleDigitChange(index, e.target.value)}
							onKeyDown={(e) => handleKeyDown(index, e)}
							onPaste={handlePaste}
							onFocus={() => handleFocus(index)}
							onBlur={() => setFocusedIndex(null)}
							className={getInputClassName(index)}
							disabled={disabled}
							aria-label={`Digit ${index + 1} of ${length}`}
							autoComplete={index === 0 ? autoComplete : "off"}
						/>
						{/* Success/Error indicator for last input */}
						{index === length - 1 && (
							<div className="absolute -right-8 top-1/2 -translate-y-1/2">
								{isComplete && !error && (
									<CheckCircle className="w-5 h-5 text-green-500 animate-in fade-in zoom-in" />
								)}
								{error && (
									<button
										type="button"
										onClick={() => {
											onChange("");
											onClear?.();
											inputRefs.current[0]?.focus();
										}}
										className="p-0.5 rounded-full hover:bg-red-100 hover:scale-110 active:scale-95 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-1"
										aria-label="Clear verification code"
									>
										<XCircle className="w-5 h-5 text-red-500 animate-in fade-in zoom-in cursor-pointer" />
									</button>
								)}
							</div>
						)}
					</div>
				))}
			</div>

			{/* Visual feedback bar */}
			<div className="w-full h-1 bg-gray-200 rounded-full overflow-hidden">
				<div
					className={cn("h-full transition-all duration-300", {
						"bg-green-500": isComplete && !error,
						"bg-red-500": error,
						"bg-[var(--color-brand-primary)]": !isComplete && !error,
					})}
					style={{ width: `${(value.length / length) * 100}%` }}
				/>
			</div>
		</div>
	);
}
