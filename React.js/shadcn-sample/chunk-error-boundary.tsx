/**
 * Chunk Error Boundary Component
 *
 * Displays a user-friendly message when chunk loading fails
 * (usually due to stale chunks from a new deployment)
 *
 * The chunk error handler will automatically reload the page
 * to fetch fresh chunks, so this component shows a temporary
 * loading state instead of a scary error message.
 */

import { useEffect, useState } from "react";
import { useRouteError } from "react-router-dom";

export function ChunkErrorBoundary() {
	const error = useRouteError() as Error;
	const [countdown, setCountdown] = useState(3);

	// Check if this is a chunk loading error
	const isChunkError =
		error?.message?.toLowerCase().includes("failed to fetch") ||
		error?.message?.toLowerCase().includes("dynamically imported module") ||
		error?.message?.toLowerCase().includes("loading chunk");

	useEffect(() => {
		if (isChunkError) {
			// The chunk error handler will automatically reload
			// Start a countdown to show user what's happening
			const interval = setInterval(() => {
				setCountdown((prev) => {
					if (prev <= 1) {
						clearInterval(interval);
						// Force reload if chunk handler hasn't already
						window.location.reload();
						return 0;
					}
					return prev - 1;
				});
			}, 1000);

			return () => clearInterval(interval);
		}
	}, [isChunkError]);

	// If it's a chunk error, show loading state instead of error
	if (isChunkError) {
		return (
			<div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 via-gray-100 to-gray-50">
				<div className="flex flex-col items-center gap-6 max-w-md text-center p-6">
					{/* Icon */}
					<div className="relative">
						<div className="w-20 h-20 rounded-full bg-[var(--color-brand-primary)] opacity-10 animate-ping absolute"></div>
						<div className="w-20 h-20 rounded-full bg-[var(--color-brand-primary)] flex items-center justify-center relative">
							<svg
								className="w-10 h-10 text-white animate-spin"
								xmlns="http://www.w3.org/2000/svg"
								fill="none"
								viewBox="0 0 24 24"
							>
								<circle
									className="opacity-25"
									cx="12"
									cy="12"
									r="10"
									stroke="currentColor"
									strokeWidth="4"
								></circle>
								<path
									className="opacity-75"
									fill="currentColor"
									d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
								></path>
							</svg>
						</div>
					</div>

					{/* Message */}
					<div className="space-y-2">
						<h2 className="text-2xl font-semibold text-gray-900">Loading Page...</h2>
						<p className="text-gray-600">Please wait a moment.</p>
					</div>

					{/* Countdown */}
					<div className="flex items-center gap-2 text-sm text-gray-500">
						<div className="w-6 h-6 rounded-full border-2 border-[var(--color-brand-primary)] flex items-center justify-center">
							<span className="text-xs font-semibold text-[var(--color-brand-primary)]">
								{countdown}
							</span>
						</div>
						<span>
							Reloading in {countdown} second{countdown !== 1 ? "s" : ""}...
						</span>
					</div>

					{/* Progress Bar */}
					<div className="w-full max-w-xs">
						<div className="h-2 bg-gray-200 rounded-full overflow-hidden">
							<div
								className="h-full bg-[var(--color-brand-primary)] rounded-full transition-all duration-1000"
								style={{
									width: `${((4 - countdown) / 3) * 100}%`,
								}}
							></div>
						</div>
					</div>
				</div>
			</div>
		);
	}

	// For non-chunk errors, show a generic error page
	return (
		<div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 via-gray-100 to-gray-50">
			<div className="flex flex-col items-center gap-6 max-w-md text-center p-6">
				{/* Error Icon */}
				<div className="w-20 h-20 rounded-full bg-red-100 flex items-center justify-center">
					<svg
						className="w-10 h-10 text-red-600"
						xmlns="http://www.w3.org/2000/svg"
						fill="none"
						viewBox="0 0 24 24"
						stroke="currentColor"
					>
						<path
							strokeLinecap="round"
							strokeLinejoin="round"
							strokeWidth={2}
							d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
						/>
					</svg>
				</div>

				{/* Error Message */}
				<div className="space-y-2">
					<h2 className="text-2xl font-semibold text-gray-900">Oops! Something went wrong</h2>
					<p className="text-gray-600">We encountered an unexpected error. Please try again.</p>
				</div>

				{/* Error Details (Development Only) */}
				{import.meta.env.DEV && error && (
					<details className="w-full text-left">
						<summary className="cursor-pointer text-sm text-gray-500 hover:text-gray-700">
							Error Details
						</summary>
						<div className="mt-2 p-3 bg-gray-100 rounded text-xs font-mono text-gray-700 overflow-auto max-h-40">
							<div className="font-semibold mb-1">{error.name}</div>
							<div className="text-red-600">{error.message}</div>
							{error.stack && (
								<div className="mt-2 text-gray-500 text-[10px]">
									{error.stack.split("\n").slice(0, 5).join("\n")}
								</div>
							)}
						</div>
					</details>
				)}

				{/* Actions */}
				<div className="flex gap-3">
					<button
						onClick={() => window.location.reload()}
						className="px-6 py-2 bg-[var(--color-brand-primary)] text-white rounded-lg hover:bg-[var(--color-brand-primary-hover)] transition-colors"
					>
						Reload Page
					</button>
					<button
						onClick={() => window.history.back()}
						className="px-6 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
					>
						Go Back
					</button>
				</div>
			</div>
		</div>
	);
}
