/**
 * Authentication Testing Panel (v4.0)
 * Allows manual testing of window-focus-only token refresh
 *
 * USAGE: Add <AuthTestPanel /> to your dashboard or any page during development
 *
 * v4.0 Changes:
 * - Removed: All retry logic tests (infinite retry, notifications, counters)
 * - Removed: API 401 error tests (no longer triggers refresh)
 * - Removed: Proactive refresh tests (no longer exists)
 * - Added: Window focus refresh test
 * - Focus: Session persistence and window focus trigger
 */

import { useState } from "react";
import { config } from "../lib/config";
import { TokenManager } from "../lib/token-manager";
import { unifiedStorage } from "../lib/unified-storage";
import { Button } from "./ui/button";
import { Card } from "./ui/card";

export function AuthTestPanel() {
	const [logs, setLogs] = useState<string[]>([]);
	const [isVisible, setIsVisible] = useState(true);

	// Only show in development
	if (!config.isDevelopment) {
		return null;
	}

	const addLog = (message: string) => {
		const timestamp = new Date().toLocaleTimeString();
		setLogs((prev) => [`[${timestamp}] ${message}`, ...prev].slice(0, 20));
		console.log(`[AUTH TEST] ${message}`);
	};

	// Get token manager instance
	const getTokenManager = () => TokenManager.getInstance();

	// ==================== SCENARIO TESTS ====================

	const testExpiredToken = () => {
		addLog("🔴 TEST: Simulating expired token...");

		const tokenManager = getTokenManager();
		const currentTokens = (tokenManager as any).tokens;

		if (currentTokens) {
			// Set expiration to past
			currentTokens.expiresAt = Date.now() - 1000; // Expired 1 second ago
			(tokenManager as any).tokens = currentTokens;
			(tokenManager as any).saveTokensToStorage();

			addLog("✅ Token expiration set to past. Next API call will trigger refresh.");
			addLog("💡 Try clicking any button that makes an API call.");
		} else {
			addLog("❌ No tokens found. Please login first.");
		}
	};

	const testWindowFocusRefresh = () => {
		addLog("🪟 TEST: Testing window focus refresh...");

		const tokenManager = getTokenManager();
		const currentTokens = (tokenManager as any).tokens;

		if (currentTokens) {
			// Expire the token
			currentTokens.expiresAt = Date.now() - 1000;
			(tokenManager as any).tokens = currentTokens;
			(tokenManager as any).saveTokensToStorage();

			addLog("✅ Token expired");
			addLog("💡 Click outside browser, then click back");
			addLog("💡 Window focus should trigger token refresh");
		} else {
			addLog("❌ No tokens found. Please login first.");
		}
	};

	const testBrowserRestart = () => {
		addLog("🔄 TEST: Simulating browser restart...");

		// Clear sessionStorage (browser restart behavior)
		sessionStorage.clear();
		addLog("✅ sessionStorage cleared (simulates browser close)");

		// Check if localStorage still has tokens
		const hasLocalStorageTokens = localStorage.getItem("auth_tokens") !== null;
		const hasCognitoTokens =
			localStorage.getItem(
				`CognitoIdentityServiceProvider.${config.cognitoClientId}.LastAuthUser`,
			) !== null;

		if (hasLocalStorageTokens || hasCognitoTokens) {
			addLog("✅ localStorage tokens PRESERVED (good!)");
			addLog("💡 Refresh page to test session restoration.");
		} else {
			addLog("❌ No localStorage tokens found.");
		}
	};

	const testTokenRefresh = async () => {
		addLog("🔄 TEST: Manually triggering token refresh...");

		const tokenManager = getTokenManager();

		try {
			const result = await tokenManager.refreshTokens();
			if (result) {
				addLog("✅ Token refresh successful!");
				addLog(`New expiration: ${new Date(result.expiresAt).toLocaleTimeString()}`);
			} else {
				addLog("❌ Token refresh failed!");
			}
		} catch (error) {
			addLog(`❌ Error: ${error}`);
		}
	};

	const testClearSessionStorage = () => {
		addLog("🗑️ TEST: Clearing sessionStorage only...");
		sessionStorage.clear();
		addLog("✅ sessionStorage cleared");
		addLog("💡 localStorage preserved. Refresh page to verify.");
	};

	const testClearLocalStorage = () => {
		addLog("🗑️ TEST: Clearing localStorage (DANGEROUS - will logout)...");

		if (confirm("This will LOGOUT you. Continue?")) {
			localStorage.clear();
			addLog("✅ localStorage cleared - YOU ARE NOW LOGGED OUT");
			addLog("💡 Refresh page to see login screen.");
		}
	};

	const testViewTokens = () => {
		addLog("👁️ VIEWING: Current token state...");

		const tokenManager = getTokenManager();
		const tokens = (tokenManager as any).tokens;

		if (tokens) {
			const now = Date.now();
			const expiresIn = tokens.expiresAt - now;
			const minutes = Math.floor(expiresIn / 60000);
			const seconds = Math.floor((expiresIn % 60000) / 1000);

			addLog(`✅ Access Token: ${tokens.accessToken.substring(0, 20)}...`);
			addLog(`✅ ID Token: ${tokens.idToken.substring(0, 20)}...`);
			addLog(`✅ Expires at: ${new Date(tokens.expiresAt).toLocaleString()}`);
			addLog(`✅ Time remaining: ${minutes}m ${seconds}s`);
		} else {
			addLog("❌ No tokens found in TokenManager");
		}

		// Check localStorage
		const localTokens = localStorage.getItem("auth_tokens");
		const sessionTokens = sessionStorage.getItem("auth_tokens");

		addLog(`📦 localStorage: ${localTokens ? "✅ Has tokens" : "❌ Empty"}`);
		addLog(`📦 sessionStorage: ${sessionTokens ? "✅ Has tokens" : "❌ Empty"}`);
	};

	const testViewStorage = () => {
		addLog("👁️ VIEWING: All auth-related storage...");

		// Check Cognito tokens
		const cognitoUserKey = `CognitoIdentityServiceProvider.${config.cognitoClientId}.LastAuthUser`;
		const lastAuthUser = localStorage.getItem(cognitoUserKey);

		if (lastAuthUser) {
			addLog(`✅ Cognito User: ${lastAuthUser}`);

			const idTokenKey = `CognitoIdentityServiceProvider.${config.cognitoClientId}.${lastAuthUser}.idToken`;
			const idToken = localStorage.getItem(idTokenKey);
			addLog(`✅ Cognito ID Token: ${idToken ? `${idToken.substring(0, 30)}...` : "❌ Missing"}`);
		} else {
			addLog("❌ No Cognito user found");
		}

		// Check unified storage
		addLog(`📋 Keep Me Signed In: ${unifiedStorage.getKeepMeSignedIn()}`);
		addLog(`📋 Session Type: ${unifiedStorage.getSessionType() || "None"}`);
		addLog(`📋 Last Login: ${unifiedStorage.getLastLoginTime() || "Never"}`);
	};

	const testSimulate24Hours = () => {
		addLog("⏰ TEST: Simulating 24 hour old token...");

		const tokenManager = getTokenManager();
		const currentTokens = (tokenManager as any).tokens;

		if (currentTokens) {
			// Set expiration to 24 hours ago
			currentTokens.expiresAt = Date.now() - 24 * 60 * 60 * 1000;
			(tokenManager as any).tokens = currentTokens;
			(tokenManager as any).saveTokensToStorage();

			addLog("✅ Token set to expired 24 hours ago");
			addLog("💡 Make any API call to trigger refresh");
		} else {
			addLog("❌ No tokens found");
		}
	};

	const testSimulate5Hours = () => {
		addLog("⏰ TEST: Simulating 5-hour absence (USER SCENARIO)...");

		const tokenManager = getTokenManager();
		const currentTokens = (tokenManager as any).tokens;

		if (currentTokens) {
			// Set expiration to 5 hours ago
			currentTokens.expiresAt = Date.now() - 5 * 60 * 60 * 1000;
			(tokenManager as any).tokens = currentTokens;
			(tokenManager as any).saveTokensToStorage();

			addLog("✅ Token set to expired 5 hours ago");
			addLog("💡 CRITICAL: Token still in localStorage (NOT deleted!)");
			addLog("💡 Now RELOAD PAGE (F5) to simulate coming back");
			addLog("💡 Expected: You should stay logged in ✅");
			addLog("💡 First API call will trigger auto-refresh");
		} else {
			addLog("❌ No tokens found. Please login first.");
		}
	};

	const testVerifyTokensPersist = () => {
		addLog("🔍 TEST: Verifying expired tokens persist...");

		const tokenManager = getTokenManager();
		const currentTokens = (tokenManager as any).tokens;

		if (currentTokens) {
			const now = Date.now();
			const isExpired = now >= currentTokens.expiresAt;
			const timeExpired = isExpired ? now - currentTokens.expiresAt : 0;
			const hoursExpired = Math.floor(timeExpired / (60 * 60 * 1000));
			const minutesExpired = Math.floor((timeExpired % (60 * 60 * 1000)) / (60 * 1000));

			addLog(`📊 Token Status: ${isExpired ? "❌ EXPIRED" : "✅ Valid"}`);
			if (isExpired) {
				addLog(`📊 Expired ${hoursExpired}h ${minutesExpired}m ago`);
			}
			addLog(`📊 Expires at: ${new Date(currentTokens.expiresAt).toLocaleString()}`);

			// Check localStorage
			const localTokens = localStorage.getItem("auth_tokens");
			const cognitoUserKey = `CognitoIdentityServiceProvider.${config.cognitoClientId}.LastAuthUser`;
			const lastAuthUser = localStorage.getItem(cognitoUserKey);

			addLog(`📦 localStorage auth_tokens: ${localTokens ? "✅ Present" : "❌ Missing"}`);
			addLog(`📦 Cognito LastAuthUser: ${lastAuthUser ? "✅ Present" : "❌ Missing"}`);

			if (lastAuthUser) {
				const idTokenKey = `CognitoIdentityServiceProvider.${config.cognitoClientId}.${lastAuthUser}.idToken`;
				const refreshTokenKey = `CognitoIdentityServiceProvider.${config.cognitoClientId}.${lastAuthUser}.refreshToken`;
				const idToken = localStorage.getItem(idTokenKey);
				const refreshToken = localStorage.getItem(refreshTokenKey);

				addLog(`📦 Cognito ID Token: ${idToken ? "✅ Present" : "❌ Missing"}`);
				addLog(`📦 Cognito Refresh Token: ${refreshToken ? "✅ Present" : "❌ Missing"}`);
			}

			if (isExpired && localTokens && lastAuthUser) {
				addLog("✅ PERFECT! Expired token persists in storage");
				addLog("✅ This is CORRECT behavior - no auto-logout!");
			} else if (!isExpired) {
				addLog("💡 Token not expired yet. Use '5-Hour Test' first.");
			} else {
				addLog("⚠️ Warning: Tokens missing from storage!");
			}
		} else {
			addLog("❌ No tokens in TokenManager");
		}
	};

	const testPageReloadWithExpiredToken = () => {
		addLog("🔄 TEST: Page reload with expired token...");

		const tokenManager = getTokenManager();
		const currentTokens = (tokenManager as any).tokens;

		if (currentTokens) {
			// Expire the token
			currentTokens.expiresAt = Date.now() - 5 * 60 * 60 * 1000; // 5 hours ago
			(tokenManager as any).tokens = currentTokens;
			(tokenManager as any).saveTokensToStorage();

			addLog("✅ Token expired 5 hours ago");
			addLog("✅ Token saved to localStorage");
			addLog("");
			addLog("🔄 NEXT STEPS:");
			addLog("1. Press F5 to reload the page");
			addLog("2. Expected: You stay logged in ✅");
			addLog("3. Dashboard loads normally");
			addLog("4. First API call triggers token refresh");
			addLog("5. No login screen shown!");
			addLog("");
			addLog("⚠️ If you see login screen, THE BUG IS BACK!");
		} else {
			addLog("❌ No tokens found");
		}
	};

	const testExpiredTokenNotDeleted = () => {
		addLog("🔍 TEST: Verifying expired tokens are NOT deleted...");

		// First, expire the token
		const tokenManager = getTokenManager();
		const currentTokens = (tokenManager as any).tokens;

		if (currentTokens) {
			currentTokens.expiresAt = Date.now() - 1000; // Expired 1 second ago
			(tokenManager as any).tokens = currentTokens;
			(tokenManager as any).saveTokensToStorage();

			addLog("✅ Token expired 1 second ago");

			// Check if token is still in localStorage
			setTimeout(() => {
				const localTokens = localStorage.getItem("auth_tokens");
				const cognitoUserKey = `CognitoIdentityServiceProvider.${config.cognitoClientId}.LastAuthUser`;
				const lastAuthUser = localStorage.getItem(cognitoUserKey);

				if (localTokens && lastAuthUser) {
					addLog("✅ PASS: Expired token still in localStorage");
					addLog("✅ Token was NOT deleted (correct behavior)");

					const idTokenKey = `CognitoIdentityServiceProvider.${config.cognitoClientId}.${lastAuthUser}.idToken`;
					const idToken = localStorage.getItem(idTokenKey);
					addLog(`✅ Cognito ID Token: ${idToken ? "Still present" : "❌ DELETED (BUG!)"}`);

					if (!idToken) {
						addLog("🚨 BUG DETECTED: Expired token was deleted!");
						addLog("🚨 This will cause logout on page reload!");
					}
				} else {
					addLog("❌ FAIL: Tokens were deleted from localStorage!");
					addLog("🚨 BUG: This will cause logout!");
				}
			}, 100);
		} else {
			addLog("❌ No tokens found");
		}
	};

	const testUserStaysLoggedIn = () => {
		addLog("👤 TEST: User stays logged in with expired token...");

		const tokenManager = getTokenManager();
		const currentTokens = (tokenManager as any).tokens;

		if (currentTokens) {
			// Expire token
			currentTokens.expiresAt = Date.now() - 5 * 60 * 60 * 1000;
			(tokenManager as any).tokens = currentTokens;
			(tokenManager as any).saveTokensToStorage();

			addLog("✅ Token expired 5 hours ago");

			// Try to get token
			const token = tokenManager.getTokenForAPI();
			addLog(`📊 getTokenForAPI(): ${token ? "✅ Returns token" : "❌ Returns null"}`);

			if (token) {
				addLog("✅ CORRECT: Token returned even though expired");
				addLog("✅ Window focus will trigger refresh");
			} else {
				addLog("❌ BUG: Token returns null when expired");
				addLog("🚨 This causes API calls to fail without auth header!");
			}

			// Check if user is cleared from auth context
			const authUser = unifiedStorage.getAuthUser();
			addLog(`📊 Auth User: ${authUser ? "✅ Present" : "❌ Cleared"}`);

			if (authUser) {
				addLog("✅ PERFECT: User stays in auth context");
			} else {
				addLog("⚠️ User cleared from storage (check auth-context)");
			}
		} else {
			addLog("❌ No tokens found");
		}
	};

	const clearLogs = () => {
		setLogs([]);
	};

	// ==================== RENDER ====================

	if (!isVisible) {
		return (
			<div className="fixed bottom-4 right-4 z-50">
				<Button
					onClick={() => setIsVisible(true)}
					variant="outline"
					size="sm"
					className="bg-yellow-500 text-white hover:bg-yellow-600"
				>
					🧪 Show Auth Tests
				</Button>
			</div>
		);
	}

	return (
		<div className="fixed bottom-4 right-4 z-50 w-[600px]">
			<Card className="p-4 bg-white shadow-2xl border-2 border-yellow-500">
				<div className="flex justify-between items-center mb-4">
					<h3 className="font-bold text-lg">🧪 Auth Testing Panel</h3>
					<Button onClick={() => setIsVisible(false)} variant="ghost" size="sm">
						✕
					</Button>
				</div>

				{/* Test Buttons Grid */}
				<div className="grid grid-cols-2 gap-2 mb-4">
					{/* Main User Scenario Tests */}
					<Button
						onClick={testSimulate5Hours}
						variant="outline"
						size="sm"
						className="text-xs bg-yellow-100 border-yellow-500 font-bold col-span-2"
					>
						⭐ 5-Hour Test (Main Scenario)
					</Button>
					<Button
						onClick={testPageReloadWithExpiredToken}
						variant="outline"
						size="sm"
						className="text-xs bg-yellow-50"
					>
						🔄 Reload w/ Expired Token
					</Button>
					<Button
						onClick={testVerifyTokensPersist}
						variant="outline"
						size="sm"
						className="text-xs bg-yellow-50"
					>
						🔍 Verify Tokens Persist
					</Button>
					<Button
						onClick={testExpiredTokenNotDeleted}
						variant="outline"
						size="sm"
						className="text-xs bg-yellow-50"
					>
						✅ Not Deleted Test
					</Button>
					<Button
						onClick={testUserStaysLoggedIn}
						variant="outline"
						size="sm"
						className="text-xs bg-yellow-50"
					>
						👤 User Stays Logged In
					</Button>

					{/* Token Expiration Tests */}
					<Button onClick={testExpiredToken} variant="outline" size="sm" className="text-xs">
						🔴 Expire Token Now
					</Button>
					<Button onClick={testWindowFocusRefresh} variant="outline" size="sm" className="text-xs">
						🪟 Window Focus Test
					</Button>
					<Button onClick={testSimulate24Hours} variant="outline" size="sm" className="text-xs">
						⏰ 24h Old Token
					</Button>
					<Button onClick={testTokenRefresh} variant="outline" size="sm" className="text-xs">
						🔄 Force Refresh
					</Button>

					{/* Storage Tests */}
					<Button onClick={testBrowserRestart} variant="outline" size="sm" className="text-xs">
						🔄 Simulate Restart
					</Button>
					<Button onClick={testClearSessionStorage} variant="outline" size="sm" className="text-xs">
						🗑️ Clear Session
					</Button>

					{/* View Tests */}
					<Button onClick={testViewTokens} variant="outline" size="sm" className="text-xs">
						👁️ View Tokens
					</Button>
					<Button onClick={testViewStorage} variant="outline" size="sm" className="text-xs">
						📦 View Storage
					</Button>

					{/* Danger Zone */}
					<Button
						onClick={testClearLocalStorage}
						variant="destructive"
						size="sm"
						className="text-xs col-span-2"
					>
						🚨 Clear All (LOGOUT)
					</Button>
				</div>

				{/* Logs Display */}
				<div className="border rounded p-2 bg-gray-50 h-[300px] overflow-y-auto">
					<div className="flex justify-between items-center mb-2">
						<span className="text-xs font-semibold">📋 Test Logs</span>
						<Button onClick={clearLogs} variant="ghost" size="sm" className="text-xs h-6">
							Clear
						</Button>
					</div>
					<div className="space-y-1">
						{logs.length === 0 ? (
							<p className="text-xs text-gray-400">No logs yet. Click a test button above.</p>
						) : (
							logs.map((log) => (
								<div key={log} className="text-xs font-mono">
									{log}
								</div>
							))
						)}
					</div>
				</div>

				{/* Quick Tips */}
				<div className="mt-3 p-2 bg-blue-50 border border-blue-200 rounded text-xs">
					<p className="font-semibold mb-1">💡 Testing Tips (v4.0):</p>
					<ul className="space-y-1 text-xs">
						<li className="font-bold text-yellow-700">
							⭐ START HERE: Click "5-Hour Test" then reload page (F5)
						</li>
						<li>• Open Browser Console (F12) for detailed logs</li>
						<li>• Tests modify tokens in memory and storage</li>
						<li>• Yellow buttons: Test session persistence</li>
						<li>• 🪟 Token refresh: ONLY on window focus (v4.0)</li>
						<li>• ❌ NO background timers or API retry logic</li>
						<li>• User NEVER logs out automatically!</li>
					</ul>
				</div>
				<div className="mt-2 p-2 bg-yellow-50 border border-yellow-400 rounded text-xs">
					<p className="font-semibold mb-1">🎯 Testing Window Focus Refresh:</p>
					<ol className="space-y-1 text-xs list-decimal list-inside">
						<li>Click "🪟 Window Focus Test"</li>
						<li>Click outside browser window (another app)</li>
						<li>Click back into browser</li>
						<li>Check console - token should refresh ✅</li>
						<li>Or use "5-Hour Test" + F5 reload</li>
					</ol>
				</div>
			</Card>
		</div>
	);
}
