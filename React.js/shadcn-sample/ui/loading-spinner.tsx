interface LoadingSpinnerProps {
	fullScreen?: boolean;
	message?: string;
}

export const LoadingSpinner = ({
	fullScreen = false,
	message = "Loading...",
}: LoadingSpinnerProps) => {
	const content = (
		<div className="text-center">
			<div className="relative inline-flex">
				<div className="animate-spin rounded-full h-16 w-16 border-4 border-gray-200"></div>
				<div className="absolute top-0 left-0 animate-spin rounded-full h-16 w-16 border-4 border-[var(--color-brand-primary)] border-t-transparent"></div>
			</div>
			<p className="text-gray-600 mt-4 text-sm font-medium">{message}</p>
		</div>
	);

	if (fullScreen) {
		return (
			<div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 via-gray-100 to-gray-50">
				{content}
			</div>
		);
	}

	return <div className="flex items-center justify-center p-8">{content}</div>;
};
