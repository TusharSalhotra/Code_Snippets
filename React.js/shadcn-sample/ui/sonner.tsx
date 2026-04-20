import { Toaster as Sonner, toast as sonnerToast, type ToasterProps } from "sonner";
import { useTheme } from "@/shared/components/theme-provider";

const Toaster = ({ ...props }: ToasterProps) => {
	const { theme = "system" } = useTheme();

	return (
		<Sonner
			theme={theme as ToasterProps["theme"]}
			className="toaster group"
			toastOptions={{
				unstyled: false,
				classNames: {
					toast:
						"group toast group-[.toaster]:bg-white group-[.toaster]:text-gray-900 group-[.toaster]:border-gray-200 group-[.toaster]:shadow-lg group-[.toaster]:rounded-lg",
					title: "!font-bold !text-gray-900",
					description: "group-[.toast]:text-gray-600 group-[.toast]:text-sm",
					actionButton: "group-[.toast]:bg-primary group-[.toast]:text-primary-foreground",
					cancelButton: "group-[.toast]:bg-muted group-[.toast]:text-muted-foreground",
					error:
						"group toast group-[.toaster]:bg-red-50 group-[.toaster]:text-red-900 group-[.toaster]:border-red-200",
					success:
						"group toast group-[.toaster]:bg-white group-[.toaster]:text-gray-900 group-[.toaster]:border-gray-200",
					warning:
						"group toast group-[.toaster]:bg-white group-[.toaster]:text-gray-900 group-[.toaster]:border-gray-200",
					info: "group toast group-[.toaster]:bg-white group-[.toaster]:text-gray-900 group-[.toaster]:border-gray-200",
				},
			}}
			{...props}
		/>
	);
};

export { Toaster };

// Custom toast functions with no icons
export const customToast = {
	success: (title: string, description?: string) => {
		return sonnerToast.success(title, {
			description,
			icon: null,
		});
	},
	error: (title: string, description?: string) => {
		return sonnerToast.error(title, {
			description,
			icon: null,
		});
	},
	info: (title: string, description?: string) => {
		return sonnerToast.info(title, {
			description,
			icon: null,
		});
	},
};
