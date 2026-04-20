import { useNavigate } from "react-router-dom";

import { Button } from "@/shared/components/ui/button";
import { useAuth } from "@/shared/contexts/auth-context";
import { AppRoutes } from "@/shared/utils/app-routes";

export function ServerError() {
	const navigate = useNavigate();
	const { isAuthenticated } = useAuth();

	const handleGoHome = () => {
		// Navigate to dashboard if authenticated, otherwise to login
		navigate(isAuthenticated ? AppRoutes.dashboard : AppRoutes.login);
	};

	const handleRefresh = () => {
		window.location.reload();
	};

	return (
		<div className="flex items-center justify-center py-20 px-4">
			<div className="max-w-md w-full text-center space-y-8">
				{/* 500 Number */}
				<div className="relative">
					<h1 className="text-[120px] font-bold text-[#0891B2] leading-none select-none">500</h1>
				</div>

				{/* Error Message */}
				<div className="space-y-4">
					<h2 className="text-2xl font-bold text-gray-900">Internal Server Error</h2>
					<p className="text-base text-gray-600 max-w-sm mx-auto">
						Something went wrong on our servers.
						<br />
						Please try again later or contact support if the issue persists.
					</p>
				</div>

				{/* Action Buttons */}
				<div className="flex items-center justify-center gap-4 pt-8">
					<Button
						onClick={handleRefresh}
						variant="outline"
						size="lg"
						className="min-w-[140px] border-gray-300 hover:bg-gray-100 text-gray-700 font-medium"
					>
						Refresh Page
					</Button>
					<Button
						onClick={handleGoHome}
						size="lg"
						className="min-w-[180px] bg-[#0891B2] hover:bg-[#0891B2]/90 text-white font-medium"
					>
						Back to Home
					</Button>
				</div>
			</div>
		</div>
	);
}
