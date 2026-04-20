import React from "react";

import { Button } from "@/shared/components/ui/button";
import { AppRoutes } from "@/shared/utils/app-routes";

interface ErrorBoundaryState {
	hasError: boolean;
	error?: Error;
}

interface ErrorBoundaryProps {
	children: React.ReactNode;
}

export class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
	constructor(props: ErrorBoundaryProps) {
		super(props);
		this.state = { hasError: false };
	}

	static getDerivedStateFromError(error: Error): ErrorBoundaryState {
		return { hasError: true, error };
	}

	componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
		console.error("Error caught by boundary:", error, errorInfo);
	}

	handleReset = () => {
		this.setState({ hasError: false, error: undefined });
		// Clear any import retry flags
		sessionStorage.removeItem("import-retry-refreshed");
		window.location.href = AppRoutes.dashboard;
	};

	render() {
		if (this.state.hasError) {
			return <ErrorFallback error={this.state.error} onReset={this.handleReset} />;
		}

		return this.props.children;
	}
}

interface ErrorFallbackProps {
	error?: Error;
	onReset: () => void;
}

function ErrorFallback({ error, onReset }: ErrorFallbackProps) {
	return (
		<div className="flex items-center justify-center py-20 px-4">
			<div className="max-w-md w-full text-center space-y-8">
				{/* Error Icon */}
				<div className="relative">
					<div className="text-[80px] font-bold text-[#0891B2] leading-none select-none">⚠️</div>
				</div>

				{/* Error Message */}
				<div className="space-y-4">
					<h2 className="text-2xl font-bold text-gray-900">Oops! Something went wrong</h2>
					<p className="text-base text-gray-600 max-w-sm mx-auto">
						{error?.message?.includes("Failed to fetch dynamically imported module")
							? "There was a problem loading this page. This might be due to a recent update."
							: "We encountered an unexpected error."}
						<br />
						Please try refreshing the page or contact support if the problem persists.
					</p>
					{error?.message && (
						<details className="mt-4 text-left max-w-sm mx-auto">
							<summary className="text-sm text-gray-500 cursor-pointer hover:text-gray-700">
								Technical details
							</summary>
							<pre className="mt-2 text-xs text-gray-600 bg-gray-100 p-3 rounded overflow-x-auto">
								{error.message}
							</pre>
						</details>
					)}
				</div>

				{/* Action Buttons */}
				<div className="flex items-center justify-center gap-4 pt-8">
					<Button
						onClick={() => window.location.reload()}
						variant="outline"
						size="lg"
						className="min-w-[140px] border-gray-300 hover:bg-gray-100 text-gray-700 font-medium"
					>
						Refresh Page
					</Button>
					<Button
						onClick={onReset}
						size="lg"
						className="min-w-[180px] bg-[#0891B2] hover:bg-[#0891B2]/90 text-white font-medium"
					>
						Back to Dashboard
					</Button>
				</div>
			</div>
		</div>
	);
}
