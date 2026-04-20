import { CheckCircle, XCircle } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { cn } from "@/shared/utils/cn-utils";
import { Input } from "./input";

interface AlphanumericVerificationInputProps {
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
	allowedPattern?: "numeric" | "alphanumeric" | "alpha";
}

export function AlphanumericVerificationInput({
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
	allowedPattern = "alphanumeric",
}: AlphanumericVerificationInputProps) {
	const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
	const [focusedIndex, setFocusedIndex] = useState<number | null>(null);
	const [isComplete, setIsComplete] = useState(false);
	const [hasSubmitted, setHasSubmitted] = useState(false);

	// Split value into individual characters
	const characters = value.split("").concat(Array(length - value.length).fill(""));

	// Get validation pattern based on allowedPattern
	const getValidationPattern = () => {
		switch (allowedPattern) {
			case "numeric":
				return /^\d$/;
			case "alpha":
				return /^[A-Za-z]$/;
			default:
				return /^[A-Za-z0-9]$/;
		}
	};

	// Get full pattern for complete validation
	const getCompletePattern = () => {
		switch (allowedPattern) {
			case "numeric":
				return /^\d+$/;
			case "alpha":
				return /^[A-Za-z]+$/;
			default:
				return /^[A-Za-z0-9]+$/;
		}
	};

	useEffect(() => {
		// Auto-focus first input on mount
		if (autoFocus && inputRefs.current[0]) {
			inputRefs.current[0].focus();
		}
	}, [autoFocus]);

	useEffect(() => {
		// Check if complete
		const complete = value.length === length && getCompletePattern().test(value);
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
	}, [value, length, onComplete, hasSubmitted, getCompletePattern]);

	const handleCharacterChange = (index: number, char: string) => {
		// Only allow single character
		if (char.length > 1) return;

		// Validate character based on pattern
		if (char && !getValidationPattern().test(char)) return;

		const newCharacters = [...characters];
		newCharacters[index] = char;
		const newValue = newCharacters.join("").slice(0, length);

		onChange(newValue);

		// Auto-focus next input
		if (char && index < length - 1) {
			inputRefs.current[index + 1]?.focus();
		}
	};

	const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
		// Handle backspace
		if (e.key === "Backspace") {
			if (!characters[index] && index > 0) {
				// Move to previous input if current is empty
				inputRefs.current[index - 1]?.focus();
			} else {
				// Clear current character
				handleCharacterChange(index, "");
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

		// Filter based on allowed pattern
		let cleaned = "";
		for (let i = 0; i < pastedData.length && cleaned.length < length; i++) {
			const char = pastedData[i];
			if (getValidationPattern().test(char)) {
				cleaned += char;
			}
		}

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
		return cn(
			"w-12 h-12 text-center text-lg font-medium border rounded-md transition-all duration-200",
			{
				"border-green-500 bg-green-50": isComplete && !error,
				"border-red-500 bg-red-50": error,
				"border-blue-500 ring-2 ring-blue-100": focusedIndex === index && !error && !isComplete,
				"border-gray-300": focusedIndex !== index && !error && !isComplete,
				"opacity-60": disabled,
			},
		);
	};

	const getInputMode = () => {
		switch (allowedPattern) {
			case "numeric":
				return "numeric";
			case "alpha":
				return "text";
			default:
				return "text";
		}
	};

	return (
		<div className={cn(className)}>
			<div className="flex justify-center gap-3">
				{Array.from({ length }).map((_, index) => (
					<div key={index} className="relative">
						<Input
							ref={(el) => {
								inputRefs.current[index] = el;
							}}
							type="text"
							inputMode={getInputMode()}
							maxLength={1}
							value={characters[index]}
							onChange={(e) => handleCharacterChange(index, e.target.value)}
							onKeyDown={(e) => handleKeyDown(index, e)}
							onPaste={handlePaste}
							onFocus={() => handleFocus(index)}
							onBlur={() => setFocusedIndex(null)}
							className={getInputClassName(index)}
							disabled={disabled}
							aria-label={`Character ${index + 1} of ${length}`}
							autoComplete={index === 0 ? autoComplete : "off"}
						/>
						{/* Success/Error indicator for last input */}
						{index === length - 1 && (
							<div className="absolute -right-8 top-1/2 -translate-y-1/2">
								{isComplete && !error && <CheckCircle className="w-4 h-4 text-green-500" />}
								{error && (
									<button
										type="button"
										onClick={() => {
											onChange("");
											onClear?.();
											inputRefs.current[0]?.focus();
										}}
										className="p-0.5 rounded-full hover:bg-red-100 transition-colors focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-1"
										aria-label="Clear verification code"
									>
										<XCircle className="w-4 h-4 text-red-500 cursor-pointer" />
									</button>
								)}
							</div>
						)}
					</div>
				))}
			</div>
		</div>
	);
}
