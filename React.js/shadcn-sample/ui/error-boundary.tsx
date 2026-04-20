/**
 * Error Boundary Component
 * Graceful error handling for form components
 */

import { AlertTriangle, RefreshCw } from "lucide-react";
import * as React from "react";
import { Button } from "./button";

interface ErrorBoundaryState {
	hasError: boolean;
	error?: Error;
	errorInfo?: React.ErrorInfo;
}

interface ErrorBoundaryProps {
	children: React.ReactNode;
	fallback?: React.ComponentType<{
		error: Error;
		retry: () => void;
	}>;
	onError?: (error: Error, errorInfo: React.ErrorInfo) => void;
}

export class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
	constructor(props: ErrorBoundaryProps) {
		super(props);
		this.state = { hasError: false };
	}

	static getDerivedStateFromError(error: Error): ErrorBoundaryState {
		return {
			hasError: true,
			error,
		};
	}

	componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
		this.setState({
			error,
			errorInfo,
		});

		this.props.onError?.(error, errorInfo);

		// Log error in development
		if (process.env.NODE_ENV === "development") {
			console.error("Error Boundary caught an error:", error, errorInfo);
		}
	}

	retry = () => {
		this.setState({ hasError: false, error: undefined, errorInfo: undefined });
	};

	render() {
		if (this.state.hasError) {
			if (this.props.fallback) {
				const FallbackComponent = this.props.fallback;
				return <FallbackComponent error={this.state.error!} retry={this.retry} />;
			}

			return <DefaultErrorFallback error={this.state.error!} retry={this.retry} />;
		}

		return this.props.children;
	}
}

// Default error fallback component
function DefaultErrorFallback({ error, retry }: { error: Error; retry: () => void }) {
	return (
		<div className="min-h-[200px] flex flex-col items-center justify-center p-6 bg-red-50 border border-red-200 rounded-lg">
			<AlertTriangle className="w-12 h-12 text-red-500 mb-4" />

			<h3 className="text-lg font-semibold text-red-900 mb-2">Something went wrong</h3>

			<p className="text-sm text-red-700 text-center mb-4 max-w-md">
				We encountered an unexpected error. Please try again or contact support if the problem
				persists.
			</p>

			{process.env.NODE_ENV === "development" && (
				<details className="mb-4 max-w-md">
					<summary className="text-xs text-red-600 cursor-pointer mb-2">
						Error Details (Development)
					</summary>
					<pre className="text-xs text-red-700 bg-red-100 p-2 rounded overflow-auto max-h-32">
						{error.message}
						{error.stack}
					</pre>
				</details>
			)}

			<Button
				onClick={retry}
				variant="outline"
				className="border-red-300 text-red-700 hover:bg-red-100"
			>
				<RefreshCw className="w-4 h-4 mr-2" />
				Try Again
			</Button>
		</div>
	);
}
