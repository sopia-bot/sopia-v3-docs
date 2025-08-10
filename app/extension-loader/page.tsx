"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";

const EXTENSION_URL =
	"https://chromewebstore.google.com/detail/%EC%86%8C%ED%94%BC%EC%95%84-%EB%B8%8C%EB%9D%BC%EC%9A%B0%EC%A0%80-%ED%99%95%EC%9E%A5-%ED%94%84%EB%A1%9C%EA%B7%B8%EB%9E%A8/cnkgjlgacbijgepeibgakidmkldfejpc";
const REDIRECT_STORAGE_KEY = "sopia_extension_redirect";

function ExtensionLoaderContent() {
	const searchParams = useSearchParams();
	const router = useRouter();
	const [isLoading, setIsLoading] = useState(true);
	const [status, setStatus] = useState<
		"checking" | "installing" | "redirecting" | "error"
	>("checking");

	useEffect(() => {
		const redirectUrl = searchParams.get("redirect");
		const isComplete = searchParams.get("complete") === "true";

		// 확장 프로그램 설치 완료 후 돌아온 경우
		if (isComplete) {
			const savedRedirectUrl = localStorage.getItem(REDIRECT_STORAGE_KEY);
			console.log("complete", savedRedirectUrl);
			if (savedRedirectUrl) {
				localStorage.removeItem(REDIRECT_STORAGE_KEY);
				setStatus("redirecting");
				setTimeout(() => {
					window.location.href = savedRedirectUrl;
				}, 1000);
			} else {
				setStatus("error");
				setIsLoading(false);
			}
			return;
		}

		// 리다이렉트 URL이 없는 경우
		if (!redirectUrl) {
			setStatus("error");
			setIsLoading(false);
			return;
		}

		// 확장 프로그램 설치 여부 확인
		const checkExtension = () => {
			// @ts-ignore - window.$sopia 객체가 있으면 확장 프로그램이 설치된 것
			if (window.$sopia) {
				// 확장 프로그램이 설치되어 있으면 바로 리다이렉트
				setStatus("redirecting");
				setTimeout(() => {
					window.location.href = redirectUrl;
				}, 500);
			} else {
				// 확장 프로그램이 설치되어 있지 않으면 설치 페이지로 이동
				localStorage.setItem(REDIRECT_STORAGE_KEY, redirectUrl);
				setStatus("installing");
				setTimeout(() => {
					window.location.href = EXTENSION_URL;
				}, 2000);
			}
			setIsLoading(false);
		};

		// 페이지 로드 후 잠시 대기하여 확장 프로그램이 플래그를 설정할 시간을 줌
		setTimeout(checkExtension, 1000);
	}, [searchParams, router]);

	const getStatusMessage = () => {
		switch (status) {
			case "checking":
				return "확장 프로그램 설치 여부를 확인하고 있습니다...";
			case "installing":
				return "확장 프로그램이 설치되어 있지 않습니다. Chrome 웹스토어로 이동합니다...";
			case "redirecting":
				return "확장 프로그램이 설치되어 있습니다. 원래 페이지로 이동합니다...";
			case "error":
				return "오류가 발생했습니다. 올바른 URL로 접근해주세요.";
			default:
				return "";
		}
	};

	const getStatusColor = () => {
		switch (status) {
			case "checking":
				return "text-blue-600";
			case "installing":
				return "text-orange-600";
			case "redirecting":
				return "text-green-600";
			case "error":
				return "text-red-600";
			default:
				return "text-gray-600";
		}
	};

	return (
		<div className="min-h-screen flex items-center justify-center bg-gray-50">
			<div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
				<div className="mb-6">
					<div className="w-16 h-16 mx-auto mb-4 bg-blue-100 rounded-full flex items-center justify-center">
						{isLoading ? (
							<div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
						) : status === "error" ? (
							<svg
								className="w-8 h-8 text-red-600"
								fill="none"
								stroke="currentColor"
								viewBox="0 0 24 24"
							>
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth={2}
									d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.268 18.5c-.77.833.192 2.5 1.732 2.5z"
								/>
							</svg>
						) : (
							<svg
								className="w-8 h-8 text-blue-600"
								fill="none"
								stroke="currentColor"
								viewBox="0 0 24 24"
							>
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth={2}
									d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
								/>
							</svg>
						)}
					</div>
					<h1 className="text-2xl font-bold text-gray-900 mb-2">
						소피아 확장 프로그램
					</h1>
					<p className={`text-sm ${getStatusColor()}`}>{getStatusMessage()}</p>
				</div>

				{status === "installing" && (
					<div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
						<p className="text-sm text-blue-800 mb-2">
							확장 프로그램을 설치한 후, 이 페이지로 자동으로 돌아옵니다.
						</p>
						<p className="text-xs text-blue-600">
							설치가 완료되면 원래 페이지로 자동 이동됩니다.
						</p>
					</div>
				)}

				{status === "error" && (
					<div className="bg-red-50 border border-red-200 rounded-lg p-4">
						<p className="text-sm text-red-800 mb-2">
							올바른 형식으로 접근해주세요:
						</p>
						<code className="text-xs bg-gray-100 px-2 py-1 rounded">
							/extension-loader?redirect=[이동할 주소]
						</code>
					</div>
				)}
			</div>
		</div>
	);
}

function LoadingFallback() {
	return (
		<div className="min-h-screen flex items-center justify-center bg-gray-50">
			<div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
				<div className="mb-6">
					<div className="w-16 h-16 mx-auto mb-4 bg-blue-100 rounded-full flex items-center justify-center">
						<div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
					</div>
					<h1 className="text-2xl font-bold text-gray-900 mb-2">
						소피아 확장 프로그램
					</h1>
					<p className="text-sm text-blue-600">로딩 중...</p>
				</div>
			</div>
		</div>
	);
}

export default function ExtensionLoaderPage() {
	return (
		<Suspense fallback={<LoadingFallback />}>
			<ExtensionLoaderContent />
		</Suspense>
	);
}
