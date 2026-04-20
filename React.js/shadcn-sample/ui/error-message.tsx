/**
 * Error Message Component
 * Better error display with recovery actions and auto-retry
 */

import { AlertCircle, Clock, RefreshCw, Wifi, X } from "lucide-react";
import { useEffect, useState } from "react";
import { useNetworkStatus } from "../../hooks/useNetworkStatus";
import { getAuthErrorMessage } from "../../utils/auth-errors";
import { cn } from "../../utils/cn-utils";
import { Button } from "./button";

interface ErrorMessageProps {
	error?: string | Error | null;
	context: {
		action: "signup" | "verification" | "resend" | "signin";
		step?: "phone" | "email";
	};
	onRetry?: () => void;
	onResendCode?: () => void;
	onRestartSignup?: () => void;
	onContactSupport?: () => void;
	onDismiss?: () => void;
	className?: string;
}

export function ErrorMessage({
	error,
	context,
	onRetry,
	onResendCode,
	onRestartSignup,
	onContactSupport,
	onDismiss,
	className,
}: ErrorMessageProps) {
	const [countdown, setCountdown] = useState(0);
	const [isRetrying, setIsRetrying] = useState(false);
	const { isOffline } = useNetworkStatus();

	if (!error) return null;

	const errorInfo = getAuthErrorMessage(error, context);

	// Handle auto-retry countdown
	useEffect(() => {
		if (errorInfo.autoRetry && errorInfo.retryDelay && onRetry) {
			const delay = Math.floor(errorInfo.retryDelay / 1000);
			setCountdown(delay);

			const interval = setInterval(() => {
				setCountdown((prev) => {
					if (prev <= 1) {
						clearInterval(interval);
						setIsRetrying(true);
						onRetry();
						return 0;
					}
					return prev - 1;
				});
			}, 1000);

			return () => clearInterval(interval);
		}
	}, [errorInfo.autoRetry, errorInfo.retryDelay, onRetry]);

	const getIcon = () => {
		if (isOffline) return <Wifi className="w-5 h-5" />;
		if (errorInfo.severity === "warning") return <Clock className="w-5 h-5" />;
		return <AlertCircle className="w-5 h-5" />;
	};

	const getColorClasses = () => {
		if (isOffline) return "bg-orange-50 border-orange-200 text-orange-700";
		if (errorInfo.severity === "warning") return "bg-yellow-50 border-yellow-200 text-yellow-700";
		return "bg-red-50 border-red-200 text-red-700";
	};

	const handleActionClick = (action: string) => {
		switch (action) {
			case "retry":
				onRetry?.();
				break;
			case "resend_code":
				onResendCode?.();
				break;
			case "restart_signup":
				onRestartSignup?.();
				break;
			case "contact_support":
				onContactSupport?.();
				break;
			case "wait_retry":
				// Let auto-retry handle this
				break;
			case "check_network":
				// Could open network settings or show network troubleshooting
				window.open("https://support.google.com/chrome/answer/113066", "_blank");
				break;
		}
	};

	return (
		<div
			className={cn(
				"p-4 border rounded-lg flex items-start gap-3 animate-in slide-in-from-top-2 duration-300",
				getColorClasses(),
				className,
			)}
		>
			<div className="flex-shrink-0 mt-0.5">{getIcon()}</div>

			<div className="flex-1 min-w-0">
				<div className="flex items-start justify-between">
					<div className="flex-1">
						<p className="text-sm font-medium mb-1">{isOffline ? "Connection Lost" : "Error"}</p>
						<p className="text-sm">
							{isOffline
								? "Please check your internet connection and try again."
								: errorInfo.message}
						</p>

						{/* Auto-retry countdown */}
						{countdown > 0 && !isOffline && (
							<div className="mt-3 flex items-center gap-2 text-xs">
								<RefreshCw className="w-3 h-3 animate-spin" />
								<span>
									Retrying in {countdown} second{countdown !== 1 ? "s" : ""}...
								</span>
							</div>
						)}

						{/* Recovery actions */}
						{!isRetrying && (errorInfo.recoveryActions || isOffline) && (
							<div className="mt-3 flex flex-wrap gap-2">
								{(isOffline
									? [{ label: "Try Again", action: "retry", primary: true }]
									: errorInfo.recoveryActions || []
								).map((recoveryAction) => (
									<Button
										key={recoveryAction.action}
										type="button"
										size="sm"
										variant={recoveryAction.primary ? "default" : "outline"}
										onClick={() => handleActionClick(recoveryAction.action)}
										className={cn(
											"h-8 px-3 text-xs",
											recoveryAction.primary && isOffline && "bg-orange-600 hover:bg-orange-700",
											recoveryAction.primary &&
												errorInfo.severity === "warning" &&
												"bg-yellow-600 hover:bg-yellow-700",
											recoveryAction.primary &&
												errorInfo.severity === "error" &&
												"bg-red-600 hover:bg-red-700",
											!recoveryAction.primary &&
												isOffline &&
												"border-orange-300 text-orange-700 hover:bg-orange-100",
											!recoveryAction.primary &&
												errorInfo.severity === "warning" &&
												"border-yellow-300 text-yellow-700 hover:bg-yellow-100",
											!recoveryAction.primary &&
												errorInfo.severity === "error" &&
												"border-red-300 text-red-700 hover:bg-red-100",
										)}
										disabled={countdown > 0}
									>
										{recoveryAction.label}
									</Button>
								))}
							</div>
						)}
					</div>

					{/* Dismiss button */}
					{onDismiss && (
						<Button
							type="button"
							variant="ghost"
							size="sm"
							onClick={onDismiss}
							className="p-1 h-auto -mr-1 -mt-1 text-current hover:bg-current/10"
						>
							<X className="w-4 h-4" />
						</Button>
					)}
				</div>
			</div>
		</div>
	);
}
