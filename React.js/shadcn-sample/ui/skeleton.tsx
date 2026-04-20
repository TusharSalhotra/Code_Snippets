import { cn } from "@/shared/utils/cn-utils";

interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
	className?: string;
}

export function Skeleton({ className, ...props }: SkeletonProps) {
	return (
		<div
			className={cn("animate-pulse rounded-md bg-gray-200 dark:bg-gray-700", className)}
			{...props}
		/>
	);
}

export function FormSkeleton() {
	return (
		<div className="space-y-6">
			<div>
				<Skeleton className="h-4 w-24 mb-2" />
				<Skeleton className="h-11 w-full" />
			</div>
			<div>
				<Skeleton className="h-4 w-24 mb-2" />
				<Skeleton className="h-11 w-full" />
			</div>
			<div>
				<Skeleton className="h-4 w-24 mb-2" />
				<Skeleton className="h-11 w-full" />
			</div>
			<Skeleton className="h-11 w-full" />
		</div>
	);
}

export function VerificationSkeleton() {
	return (
		<div className="flex justify-center gap-3">
			{[...Array(6)].map((_, i) => (
				<Skeleton key={i} className="w-12 h-12" />
			))}
		</div>
	);
}
