import { Copy } from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "./button";
import { customToast } from "./sonner";

interface EnhancedCodeBlockProps {
	children: string;
	language?: string;
	filename?: string;
	onCopy?: (text: string) => void;
	className?: string;
}

export function EnhancedCodeBlock({
	children,
	language = "json",
	filename,
	onCopy,
	className = "",
}: EnhancedCodeBlockProps) {
	const [highlightedCode, setHighlightedCode] = useState<string>("");
	const [isLoading, setIsLoading] = useState(true);

	// Special handling for long URLs
	const isHttpContent = language === "http" || language === "url";
	const wrapperClasses = isHttpContent
		? `${className} [&_code]:break-all [&_code]:whitespace-pre-wrap [&_pre]:whitespace-pre-wrap`
		: className;

	useEffect(() => {
		let mounted = true;

		const highlightCode = async () => {
			try {
				// Dynamic import to avoid SSR issues
				const { codeToHtml } = await import("shiki");

				const html = await codeToHtml(children, {
					lang: language as any,
					themes: {
						light: "github-light",
						dark: "github-dark",
					},
				});

				if (mounted) {
					setHighlightedCode(html);
					setIsLoading(false);
				}
			} catch (error) {
				console.error("Failed to highlight code:", error);
				if (mounted) {
					setIsLoading(false);
				}
			}
		};

		highlightCode();

		return () => {
			mounted = false;
		};
	}, [children, language]);

	const handleCopy = async () => {
		try {
			await navigator.clipboard.writeText(children);
			customToast.success("Copied!", "Code copied to clipboard");
			onCopy?.(children);
		} catch (error) {
			console.error("Failed to copy:", error);
			customToast.error("Copy Failed", "Unable to copy to clipboard");
		}
	};

	if (isLoading) {
		return (
			<div className={`relative rounded-lg border border-slate-200 bg-slate-50 ${className}`}>
				{filename && (
					<div className="border-b border-slate-200 px-4 py-2">
						<span className="text-xs font-medium text-slate-700">{filename}</span>
					</div>
				)}
				<div className="p-4">
					<div className="animate-pulse space-y-2">
						<div className="h-4 bg-slate-200 rounded w-3/4"></div>
						<div className="h-4 bg-slate-200 rounded w-1/2"></div>
						<div className="h-4 bg-slate-200 rounded w-2/3"></div>
					</div>
				</div>
			</div>
		);
	}

	return (
		<div
			className={`relative rounded-lg border border-slate-200 bg-slate-50 overflow-hidden ${wrapperClasses}`}
		>
			{filename && (
				<div className="border-b border-slate-200 px-4 py-2 flex items-center justify-between">
					<span className="text-xs font-medium text-slate-700">{filename}</span>
					<Button
						type="button"
						variant="ghost"
						size="sm"
						className="h-6 w-6 p-0 hover:bg-slate-200 transition-colors"
						onClick={handleCopy}
					>
						<Copy className="h-3 w-3 text-slate-600" />
					</Button>
				</div>
			)}

			{highlightedCode ? (
				<div
					className="[&_pre]:p-4 [&_pre]:m-0 [&_pre]:bg-transparent [&_code]:text-sm [&_pre]:overflow-x-auto [&_code]:whitespace-pre-wrap [&_code]:break-all [&_pre]:whitespace-pre-wrap"
					dangerouslySetInnerHTML={{ __html: highlightedCode }}
				/>
			) : (
				<pre className="p-4 m-0 bg-transparent overflow-x-auto whitespace-pre-wrap">
					<code className="text-sm text-slate-900 font-mono whitespace-pre-wrap break-all">
						{children}
					</code>
				</pre>
			)}

			{!filename && (
				<div className="absolute top-2 right-2">
					<Button
						type="button"
						variant="ghost"
						size="sm"
						className="h-6 w-6 p-0 hover:bg-slate-200/80 transition-colors"
						onClick={handleCopy}
					>
						<Copy className="h-3 w-3 text-slate-600" />
					</Button>
				</div>
			)}
		</div>
	);
}
