import { Eye, EyeOff } from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "@/shared/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/shared/components/ui/dropdown-menu";
import { getAllFeatureFlags } from "@/shared/lib/feature-flags";

/**
 * List of users allowed to see the feature toggle in dev/staging
 * Add usernames (from Cognito) here to grant access
 */
const ALLOWED_FEATURE_TOGGLE_USERS = [
	"ziyang.gam",
	// Add more usernames here as needed
	// "another.user",
];

/**
 * Feature Toggle Component for Development/Testing
 * Only visible to specific users in dev/staging environments
 */
export function FeatureToggle() {
	const [isInternal, setIsInternal] = useState(false);
	const [features, setFeatures] = useState<Record<string, boolean>>({});
	const [isAllowedUser, setIsAllowedUser] = useState(false);

	useEffect(() => {
		// Get current username from Cognito
		const cognitoClientId = import.meta.env.VITE_COGNITO_CLIENT_ID;
		const lastAuthUserKey = `CognitoIdentityServiceProvider.${cognitoClientId}.LastAuthUser`;
		const username = localStorage.getItem(lastAuthUserKey);

		// Check if user is allowed to see this toggle
		setIsAllowedUser(username ? ALLOWED_FEATURE_TOGGLE_USERS.includes(username) : false);

		// Check if current user is internal
		setIsInternal(username === "ziyang.gam");

		// Get current feature flags
		setFeatures(getAllFeatureFlags());
	}, []);

	const toggleUserMode = (mode: "internal" | "public") => {
		// This is just for testing - it won't actually change the username
		// but will use URL parameter instead
		if (mode === "internal") {
			window.location.href = `${window.location.pathname}?internal=true`;
		} else {
			window.location.href = window.location.pathname;
		}
	};

	// Only show in development mode AND if user is allowed
	if (import.meta.env.PROD || !isAllowedUser) {
		return null;
	}

	return (
		<div className="fixed bottom-4 right-4 z-50">
			<DropdownMenu>
				<DropdownMenuTrigger asChild>
					<Button variant="outline" size="sm" className="shadow-lg bg-white">
						{isInternal ? (
							<>
								<Eye className="w-4 h-4 mr-2" />
								Internal View
							</>
						) : (
							<>
								<EyeOff className="w-4 h-4 mr-2" />
								Public View
							</>
						)}
					</Button>
				</DropdownMenuTrigger>
				<DropdownMenuContent align="end" className="w-64">
					<DropdownMenuLabel>Feature Access Control</DropdownMenuLabel>
					<DropdownMenuSeparator />
					<DropdownMenuItem
						onClick={() => toggleUserMode("internal")}
						className={isInternal ? "bg-gray-100" : ""}
					>
						<Eye className="w-4 h-4 mr-2" />
						Internal User Mode
						{isInternal && <span className="ml-auto text-xs">✓</span>}
					</DropdownMenuItem>
					<DropdownMenuItem
						onClick={() => toggleUserMode("public")}
						className={!isInternal ? "bg-gray-100" : ""}
					>
						<EyeOff className="w-4 h-4 mr-2" />
						Public User Mode
						{!isInternal && <span className="ml-auto text-xs">✓</span>}
					</DropdownMenuItem>
					<DropdownMenuSeparator />
					<div className="px-2 py-1.5 text-xs text-gray-500">
						<p className="font-semibold mb-1">Hidden Features:</p>
						<ul className="space-y-0.5">
							{Object.entries(features).map(([key, enabled]) => (
								<li key={key} className="flex items-center">
									<span className={enabled ? "text-green-600" : "text-red-600"}>
										{enabled ? "✓" : "✗"}
									</span>
									<span className="ml-1">{key.split(".").pop()}</span>
								</li>
							))}
						</ul>
					</div>
				</DropdownMenuContent>
			</DropdownMenu>
		</div>
	);
}
