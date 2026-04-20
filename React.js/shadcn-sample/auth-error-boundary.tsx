import React, { Component, type ErrorInfo, type PropsWithChildren } from "react";
import { authStateManager } from "../lib/auth-state-manager";
import { TokenManager } from "../lib/token-manager";
import { unifiedStorage } from "../lib/unified-storage";
import { AppRoutes } from "../utils/app-routes";
import { Button } from "./ui/button";

interface AuthErrorBoundaryProps extends PropsWithChildren {
	fallback?: React.ComponentType<{ error: Error; onRetry: () => void }>;
	onError?: (error: Error, errorInfo: ErrorInfo) => void;
}

interface AuthErrorBoundaryState {
	hasError: boolean;
	errorCount: number;
	errorType?: "loop" | "auth" | "network" | "unknown";
	lastError?: Error;
	errorTimestamp?: number;
}

export class AuthErrorBoundary extends Component<AuthErrorBoundaryProps, AuthErrorBoundaryState> {
	private errorTimeout?: NodeJS.Timeout;
	private readonly MAX_ERRORS_BEFORE_RESET = 5;
	private readonly ERROR_RESET_TIMEOUT = 60000; // 1 minute

	constructor(props: AuthErrorBoundaryProps) {
		super(props);
		this.state = {
			hasError: false,
			errorCount: 0,
			errorTimestamp: Date.now(),
		};
	}

	static getDerivedStateFromError(error: Error): Partial<AuthErrorBoundaryState> {
		// Detect different types of errors
		const errorMessage = error.message.toLowerCase();
		const errorStack = error.stack?.toLowerCase() || "";

		let errorType: AuthErrorBoundaryState["errorType"] = "unknown";

		// Detect loop-like errors
		if (
			errorStack.includes("maximum call stack") ||
			errorMessage.includes("too much recursion") ||
			error.name === "RangeError" ||
			errorMessage.includes("loop") ||
			errorMessage.includes("circular")
		) {
			errorType = "loop";
		}
		// Detect auth-related errors
		else if (
			errorMessage.includes("auth") ||
			errorMessage.includes("token") ||
			errorMessage.includes("unauthorized") ||
			errorMessage.includes("forbidden")
		) {
			errorType = "auth";
		}
		// Detect network errors
		else if (
			errorMessage.includes("network") ||
			errorMessage.includes("fetch") ||
			errorMessage.includes("connection")
		) {
			errorType = "network";
		}

		return {
			hasError: true,
			errorType,
			lastError: error,
			errorTimestamp: Date.now(),
		};
	}

	componentDidUpdate(_prevProps: AuthErrorBoundaryProps, prevState: AuthErrorBoundaryState) {
		// Increment error count when a new error occurs
		if (this.state.hasError && !prevState.hasError) {
			this.setState((prevState) => ({
				errorCount: prevState.errorCount + 1,
			}));
		}

		// Auto-reset after too many errors
		if (this.state.errorCount >= this.MAX_ERRORS_BEFORE_RESET) {
			this.handleForceLogout();
		}
	}

	componentDidCatch(error: Error, errorInfo: ErrorInfo) {
		console.error("🚨 AuthErrorBoundary caught an error:", error, errorInfo);

		// Call custom error handler if provided
		if (this.props.onError) {
			this.props.onError(error, errorInfo);
		}

		// Handle loop errors with special cleanup
		if (this.state.errorType === "loop") {
			console.error("🔄 Authentication loop detected:", error, errorInfo);
			this.performEmergencyCleanup().catch((cleanupError) => {
				console.error("Emergency cleanup failed during loop handling:", cleanupError);
			});
		}

		// Auto-reset error state after timeout
		if (this.errorTimeout) {
			clearTimeout(this.errorTimeout);
		}

		this.errorTimeout = setTimeout(() => {
			this.setState({
				hasError: false,
				errorType: undefined,
				lastError: undefined,
			});
		}, this.ERROR_RESET_TIMEOUT);

		// In development, provide more detailed logging
		if (process.env.NODE_ENV === "development") {
			console.group("🔍 AuthErrorBoundary Debug Info");
			console.log("Error Type:", this.state.errorType);
			console.log("Error Count:", this.state.errorCount);
			console.log("Component Stack:", errorInfo.componentStack);
			console.log("Error Stack:", error.stack);
			console.groupEnd();
		}

		// Log to monitoring service in production
		if (import.meta.env.PROD) {
			// TODO: Send to error monitoring service
			console.error("Production error:", error);
		}
	}

	componentWillUnmount() {
		if (this.errorTimeout) {
			clearTimeout(this.errorTimeout);
		}
	}

	/**
	 * Emergency cleanup for loop errors
	 */
	private performEmergencyCleanup = async (): Promise<void> => {
		try {
			console.log("🚨 Performing emergency auth cleanup due to loop error");

			// Shutdown Intercom immediately
			try {
				const { intercomService } = await import("@/shared/lib/providers/intercom.service");
				intercomService.shutdown();
			} catch (intercomError) {
				console.warn("Failed to shutdown Intercom during emergency cleanup:", intercomError);
			}

			// Clear all token manager state
			const tokenManager = TokenManager.getInstance();
			tokenManager.clearTokens();

			// Clear all unified storage
			unifiedStorage.clearAllAuthData();

			// Reset auth state manager
			authStateManager.reset();

			// Clear any intervals or timeouts that might be causing loops
			const highestTimeoutId = setTimeout(() => {}, 0);
			for (let i = 0; i < Number(highestTimeoutId); i++) {
				clearTimeout(i);
				clearInterval(i);
			}

			console.log("✅ Emergency cleanup completed");
		} catch (cleanupError) {
			console.error("❌ Failed to perform emergency cleanup:", cleanupError);
			// Last resort - reload the page
			setTimeout(() => window.location.reload(), 1000);
		}
	};

	handleRetry = () => {
		console.log("🔄 Retrying after auth error");
		this.setState({
			hasError: false,
			errorType: undefined,
			lastError: undefined,
		});
	};

	handleForceLogout = async (): Promise<void> => {
		console.log("🔒 Force logout and session clear");
		await this.performEmergencyCleanup();
		window.location.href = AppRoutes.login;
	};

	handleGoToLogin = () => {
		window.location.href = AppRoutes.login;
	};

	render() {
		if (this.state.hasError) {
			// Use custom fallback component if provided
			if (this.props.fallback) {
				const FallbackComponent = this.props.fallback;
				return <FallbackComponent error={this.state.lastError!} onRetry={this.handleRetry} />;
			}

			// Enhanced default error UI with loop detection
			return (
				<div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
					<div className="max-w-2xl w-full bg-white rounded-lg shadow-lg p-8 text-center">
						<div className="mb-6">
							<div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-red-100">
								<div className="text-4xl">{this.state.errorType === "loop" ? "🔄" : "⚠️"}</div>
							</div>
						</div>

						<h3 className="text-2xl font-bold text-gray-900 mb-4">
							{this.state.errorType === "loop"
								? "Authentication Loop Detected"
								: "Authentication Error"}
						</h3>

						<p className="text-sm text-gray-600 mb-6 leading-relaxed">
							{this.state.errorType === "loop"
								? "We detected an infinite loop in the authentication system. This usually happens when there are conflicting authentication states."
								: "An error occurred in the authentication system. This might be due to network issues, expired tokens, or system configuration problems."}
						</p>

						{this.state.lastError && (
							<div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-left">
								<p className="text-xs text-red-600 font-mono break-all">
									{this.state.lastError.message}
								</p>
								{process.env.NODE_ENV === "development" && this.state.lastError.stack && (
									<details className="mt-2">
										<summary className="cursor-pointer text-xs text-gray-600">Stack Trace</summary>
										<pre className="mt-1 text-xs overflow-auto whitespace-pre-wrap">
											{this.state.lastError.stack}
										</pre>
									</details>
								)}
							</div>
						)}

						<div className="mb-6">
							<p className="text-sm text-gray-500">
								Error occurred {this.state.errorCount} time{this.state.errorCount !== 1 ? "s" : ""}
							</p>
						</div>

						<div className="flex flex-col sm:flex-row gap-4 justify-center mb-6">
							<Button onClick={this.handleRetry} variant="outline" className="flex-1 sm:flex-none">
								Try Again
							</Button>

							<Button onClick={this.handleGoToLogin} className="flex-1 sm:flex-none">
								Go to Login
							</Button>

							{this.state.errorType === "loop" && (
								<Button
									onClick={this.handleForceLogout}
									variant="destructive"
									className="flex-1 sm:flex-none"
								>
									Clear Session & Refresh
								</Button>
							)}
						</div>

						<div className="text-xs text-gray-400">
							<p>If this problem persists, please contact support.</p>
							{process.env.NODE_ENV === "development" && (
								<p className="mt-2 font-mono">
									Time: {new Date(this.state.errorTimestamp || Date.now()).toISOString()}
								</p>
							)}
						</div>
					</div>
				</div>
			);
		}

		return this.props.children;
	}
}

// Higher-order component wrapper
export const withAuthErrorBoundary = <P extends object>(
	Component: React.ComponentType<P>,
	errorBoundaryProps?: Omit<AuthErrorBoundaryProps, "children">,
) => {
	const WrappedComponent = (props: P) => (
		<AuthErrorBoundary {...errorBoundaryProps}>
			<Component {...props} />
		</AuthErrorBoundary>
	);

	WrappedComponent.displayName = `withAuthErrorBoundary(${Component.displayName || Component.name})`;

	return WrappedComponent;
};

export default AuthErrorBoundary;
