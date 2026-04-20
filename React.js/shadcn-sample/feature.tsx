import type { ReactNode } from "react";
import { type FeatureFlag, isFeatureEnabled } from "@/shared/lib/feature-flags";

interface FeatureProps {
	flag: FeatureFlag;
	children: ReactNode;
	fallback?: ReactNode;
}

/**
 * Feature flag wrapper component
 * Conditionally renders children based on feature flag status
 */
export function Feature({ flag, children, fallback = null }: FeatureProps) {
	if (isFeatureEnabled(flag)) {
		return <>{children}</>;
	}

	return <>{fallback}</>;
}
