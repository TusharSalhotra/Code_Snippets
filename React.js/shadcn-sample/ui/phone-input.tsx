import type { CountryCode } from "libphonenumber-js";
import { parsePhoneNumber } from "libphonenumber-js";
import { useCallback, useEffect, useRef, useState } from "react";
import PhoneInput from "react-phone-number-input";

import "react-phone-number-input/style.css";
import { config } from "@/shared/lib/config";
import { cn } from "@/shared/utils/cn-utils";

// Country digit limits for national numbers (without country code)
const COUNTRY_LIMITS: Record<string, number> = {
	// Asia Pacific
	IN: 10, // India: 10 digits
	MY: 10, // Malaysia: 10 digits (10-11 digits, but we'll use 10 as standard)
	SG: 8, // Singapore: 8 digits
	TH: 9, // Thailand: 9 digits
	PH: 10, // Philippines: 10 digits
	ID: 11, // Indonesia: 10-11 digits
	VN: 9, // Vietnam: 9 digits
	KH: 8, // Cambodia: 8 digits
	LA: 8, // Laos: 8 digits
	MM: 9, // Myanmar: 9 digits
	BN: 7, // Brunei: 7 digits
	CN: 11, // China: 11 digits
	JP: 10, // Japan: 10 digits
	KR: 10, // South Korea: 10 digits
	TW: 9, // Taiwan: 9 digits
	HK: 8, // Hong Kong: 8 digits
	MO: 8, // Macau: 8 digits
	AU: 9, // Australia: 9 digits
	NZ: 9, // New Zealand: 9 digits

	// North America
	US: 10, // United States: 10 digits
	CA: 10, // Canada: 10 digits
	MX: 10, // Mexico: 10 digits

	// Europe
	GB: 10, // United Kingdom: 10 digits
	DE: 11, // Germany: 11 digits
	FR: 9, // France: 9 digits
	IT: 10, // Italy: 10 digits
	ES: 9, // Spain: 9 digits
	NL: 9, // Netherlands: 9 digits
	BE: 9, // Belgium: 9 digits
	CH: 9, // Switzerland: 9 digits
	AT: 11, // Austria: 11 digits
	SE: 9, // Sweden: 9 digits
	NO: 8, // Norway: 8 digits
	DK: 8, // Denmark: 8 digits
	FI: 9, // Finland: 9 digits
	IE: 9, // Ireland: 9 digits
	PT: 9, // Portugal: 9 digits
	GR: 10, // Greece: 10 digits
	PL: 9, // Poland: 9 digits
	CZ: 9, // Czech Republic: 9 digits
	HU: 9, // Hungary: 9 digits
	RO: 9, // Romania: 9 digits
	BG: 8, // Bulgaria: 8 digits
	HR: 8, // Croatia: 8 digits
	SI: 8, // Slovenia: 8 digits
	SK: 9, // Slovakia: 9 digits
	EE: 7, // Estonia: 7 digits
	LV: 8, // Latvia: 8 digits
	LT: 8, // Lithuania: 8 digits
	RU: 10, // Russia: 10 digits

	// Middle East
	AE: 9, // UAE: 9 digits
	SA: 9, // Saudi Arabia: 9 digits
	QA: 8, // Qatar: 8 digits
	KW: 8, // Kuwait: 8 digits
	BH: 8, // Bahrain: 8 digits
	OM: 8, // Oman: 8 digits
	JO: 9, // Jordan: 9 digits
	LB: 8, // Lebanon: 8 digits
	IL: 9, // Israel: 9 digits
	TR: 10, // Turkey: 10 digits
	IR: 10, // Iran: 10 digits
	IQ: 10, // Iraq: 10 digits

	// Africa
	ZA: 9, // South Africa: 9 digits
	EG: 10, // Egypt: 10 digits
	NG: 10, // Nigeria: 10 digits
	KE: 9, // Kenya: 9 digits
	GH: 9, // Ghana: 9 digits
	TZ: 9, // Tanzania: 9 digits
	UG: 9, // Uganda: 9 digits
	ZW: 9, // Zimbabwe: 9 digits
	ZM: 9, // Zambia: 9 digits
	BW: 7, // Botswana: 7 digits
	NA: 8, // Namibia: 8 digits

	// South America
	BR: 11, // Brazil: 10-11 digits
	AR: 10, // Argentina: 10 digits
	CL: 9, // Chile: 9 digits
	CO: 10, // Colombia: 10 digits
	PE: 9, // Peru: 9 digits
	VE: 10, // Venezuela: 10 digits
	EC: 9, // Ecuador: 9 digits
	UY: 8, // Uruguay: 8 digits
	PY: 9, // Paraguay: 9 digits
	BO: 8, // Bolivia: 8 digits
};

interface PhoneInputProps {
	value?: string;
	onChange: (value: string | undefined) => void;
	placeholder?: string;
	className?: string;
	disabled?: boolean;
	defaultCountry?: CountryCode;
	disableCountrySelect?: boolean;
}

export function PhoneInputComponent({
	value,
	onChange,
	placeholder = "Enter phone number",
	className,
	disabled = false,
	defaultCountry = "MY",
	disableCountrySelect = false,
}: PhoneInputProps) {
	const [selectedCountry, setSelectedCountry] = useState<CountryCode>(defaultCountry);
	const phoneInputRef = useRef<HTMLDivElement>(null);

	// Get digit limit for current country
	const getDigitLimit = useCallback((country: CountryCode): number => {
		return COUNTRY_LIMITS[country] || 15;
	}, []);

	// Extract only the national number digits (without country code)
	const extractNationalDigits = useCallback(
		(phoneNumber: string): string => {
			if (!phoneNumber) return "";

			try {
				const parsed = parsePhoneNumber(phoneNumber);
				if (parsed?.nationalNumber) {
					return parsed.nationalNumber.replace(/\D/g, "");
				}
			} catch {
				// Fallback: extract digits, removing known country codes
				const digits = phoneNumber.replace(/\D/g, "");

				// Remove country codes based on current selection
				const countryCodeMap: Record<string, string[]> = {
					IN: ["91"],
					MY: ["60"],
					US: ["1"],
					CA: ["1"],
					GB: ["44"],
					SG: ["65"],
					AU: ["61"],
					DE: ["49"],
					FR: ["33"],
					IT: ["39"],
					ES: ["34"],
					NL: ["31"],
					BE: ["32"],
					CH: ["41"],
					AT: ["43"],
					SE: ["46"],
					NO: ["47"],
					DK: ["45"],
					FI: ["358"],
					IE: ["353"],
					PT: ["351"],
					GR: ["30"],
					PL: ["48"],
					CZ: ["420"],
					HU: ["36"],
					RO: ["40"],
					BG: ["359"],
					HR: ["385"],
					SI: ["386"],
					SK: ["421"],
					EE: ["372"],
					LV: ["371"],
					LT: ["370"],
					RU: ["7"],
					AE: ["971"],
					SA: ["966"],
					QA: ["974"],
					KW: ["965"],
					BH: ["973"],
					OM: ["968"],
					JO: ["962"],
					LB: ["961"],
					IL: ["972"],
					TR: ["90"],
					IR: ["98"],
					IQ: ["964"],
					ZA: ["27"],
					EG: ["20"],
					NG: ["234"],
					KE: ["254"],
					GH: ["233"],
					TZ: ["255"],
					UG: ["256"],
					ZW: ["263"],
					ZM: ["260"],
					BW: ["267"],
					NA: ["264"],
					BR: ["55"],
					AR: ["54"],
					CL: ["56"],
					CO: ["57"],
					PE: ["51"],
					VE: ["58"],
					EC: ["593"],
					UY: ["598"],
					PY: ["595"],
					BO: ["591"],
					TH: ["66"],
					PH: ["63"],
					ID: ["62"],
					VN: ["84"],
					KH: ["855"],
					LA: ["856"],
					MM: ["95"],
					BN: ["673"],
					CN: ["86"],
					JP: ["81"],
					KR: ["82"],
					TW: ["886"],
					HK: ["852"],
					MO: ["853"],
					NZ: ["64"],
					MX: ["52"],
				};

				const countryCodes = countryCodeMap[selectedCountry] || [];

				for (const code of countryCodes) {
					if (digits.startsWith(code) && digits.length > code.length) {
						return digits.substring(code.length);
					}
				}

				return digits;
			}

			return "";
		},
		[selectedCountry],
	);

	// Enhanced onChange handler with strict digit limiting
	const handlePhoneChange = (newValue: string | undefined) => {
		if (!newValue) {
			onChange(undefined);
			return;
		}

		// Determine current country
		let currentCountry = selectedCountry;
		try {
			const parsed = parsePhoneNumber(newValue);
			if (parsed?.country) {
				currentCountry = parsed.country;
				setSelectedCountry(currentCountry);
			}
		} catch {
			// Keep existing country
		}

		// Check digit limit
		const digitLimit = getDigitLimit(currentCountry);
		const nationalDigits = extractNationalDigits(newValue);

		if (config.isDevelopment) {
			console.log(
				`Country: ${currentCountry}, Limit: ${digitLimit}, Digits: ${nationalDigits}, Length: ${nationalDigits.length}`,
			);
		}

		// Prevent input if exceeding limit
		if (nationalDigits.length > digitLimit) {
			if (config.isDevelopment) {
				console.log("Blocked: Exceeding digit limit");
			}
			return; // Block the change
		}

		onChange(newValue);
	};

	// Add keyboard event listener to intercept input at character level
	useEffect(() => {
		const handleKeyDown = (e: KeyboardEvent) => {
			// Only process if it's a digit
			if (!/^\d$/.test(e.key)) return;

			const target = e.target as HTMLInputElement;
			if (!target || !target.classList.contains("PhoneInputInput")) return;

			const currentValue = value || "";
			const digitalLimit = getDigitLimit(selectedCountry);
			const currentNationalDigits = extractNationalDigits(currentValue);

			// If we're at the limit, prevent further digit input
			if (currentNationalDigits.length >= digitalLimit) {
				if (config.isDevelopment) {
					console.log("Blocked at keyboard level");
				}
				e.preventDefault();
				e.stopPropagation();
			}
		};

		const container = phoneInputRef.current;
		if (container) {
			container.addEventListener("keydown", handleKeyDown, true);
			return () => {
				container.removeEventListener("keydown", handleKeyDown, true);
			};
		}
	}, [value, selectedCountry, extractNationalDigits, getDigitLimit]);

	// Update country when value changes
	useEffect(() => {
		if (value) {
			try {
				const parsed = parsePhoneNumber(value);
				if (parsed?.country && parsed.country !== selectedCountry) {
					setSelectedCountry(parsed.country);
				}
			} catch {
				// Keep current country
			}
		}
	}, [value, selectedCountry]);
	return (
		<>
			<style>{`
        .phone-input-custom {
          display: flex;
          align-items: center;
          border-radius: 0.375rem;
          background-color: white;
          transition: border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out;
          height: 2.5rem;
          padding-left: 12px;
        }
        
        .phone-input-custom.error {
          border: 1px solid rgb(239, 68, 68);
        }
        
        .phone-input-custom.error:focus-within {
          outline: none;
          border-color: rgb(239, 68, 68);
          box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.2);
        }
        
        .phone-input-custom.normal {
          border: 1px solid rgb(209, 213, 219);
        }
        
        .phone-input-custom.normal:focus-within {
          outline: none;
          border-color: #25bdcc;
          box-shadow: 0 0 0 3px rgba(37, 189, 204, 0.1);
        }
        
        .PhoneInputCountryIcon {
          width: 1.25rem;
          height: 0.875rem;
          margin-right: 0.25rem;
        }
        
        .PhoneInputCountrySelect {
          padding: 0.5rem;
          border: none;
          background: transparent;
          outline: none;
          cursor: pointer;
          font-size: 0.875rem;
          color: rgb(55, 65, 81);
        }
        
        .PhoneInputCountryCode {
          padding: 0.25rem 0.5rem;
          border: none;
          background: transparent;
          outline: none;
          font-size: 0.875rem;
          color: rgb(55, 65, 81);
          pointer-events: none;
          user-select: none;
          font-weight: 500;
        }
        
        .PhoneInputInput {
          border: none;
          outline: none;
          padding: 0.5rem;
          flex: 1;
          font-size: 0.875rem;
          background: transparent;
          color: rgb(55, 65, 81);
          height: 100%;
        }
        
        .PhoneInputInput::placeholder {
          color: rgb(156, 163, 175);
        }
        
        .PhoneInputCountrySelectArrow {
          margin-left: 0.25rem;
          opacity: 0.5;
        }
      `}</style>
			<div ref={phoneInputRef} className={cn("relative", className)}>
				<PhoneInput
					international
					defaultCountry={defaultCountry}
					value={value}
					onChange={handlePhoneChange}
					placeholder={placeholder}
					disabled={disabled}
					countryCallingCodeEditable={false}
					countrySelectProps={{
						disabled: disableCountrySelect,
					}}
					className={cn(
						"phone-input-custom",
						className?.includes("border-red-500") ? "error" : "normal",
					)}
				/>
			</div>
		</>
	);
}
