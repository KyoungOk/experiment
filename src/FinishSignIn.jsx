import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import OnboardingHeader from "./components/OnboardingHeader";
import Footer from "./components/Footer";
import {
	getAuth,
	isSignInWithEmailLink,
	signInWithEmailLink,
} from "firebase/auth";

export default function FinishSignIn() {
	const navigate = useNavigate();
	const auth = getAuth();
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState("");
	const [role, setRole] = useState("");

	useEffect(() => {
		const params = new URLSearchParams(window.location.search);
		const email = params.get("email");
		const userRole = params.get("role") || "";

		setRole(userRole);

		const completeSignIn = async () => {
			if (!email) {
				setError("이메일 정보를 찾을 수 없어요.");
				setLoading(false);
				return;
			}

			if (isSignInWithEmailLink(auth, window.location.href)) {
				try {
					const result = await signInWithEmailLink(
						auth,
						email,
						window.location.href
					);
					const isNewUser = result._tokenResponse?.isNewUser;

					const path = isNewUser
						? userRole === "maker"
							? "/registerMaker"
							: "/registerTester"
						: userRole === "maker"
						? "/homeMaker"
						: "/homeTester";

					window.localStorage.removeItem("emailForSignIn");
					window.localStorage.removeItem("role");

					navigate(path);
				} catch (err) {
					console.error("로그인 실패:", err);
					setError("로그인에 실패했어요.");
					setLoading(false);
				}
			} else {
				setError("올바르지 않은 로그인 링크입니다.");
				setLoading(false);
			}
		};

		completeSignIn();
	}, [auth, navigate]);

	return (
		<div className="min-h-screen flex flex-col">
			<OnboardingHeader />

			<div className="flex flex-col md:flex-row md:items-center justify-center pt-4 px-[var(--side-padding)] md:mt-20 z-10 flex-1">
				<div className="flex flex-col items-start gap-2 mt-1 md:mt-20 mb-12">
					<div className="mb-6">
						{/* 로딩 또는 에러 메시지 아래쪽에 고정 표시 */}
						{(loading || error) && (
							<div className="w-full text-center pb-8">
								<p
									className={`text-md ${
										error ? "text-red-500" : "text-gray-600"
									}`}>
									{loading ? "로그인 처리 중입니다..." : error}
								</p>
							</div>
						)}
					</div>
				</div>
			</div>
			<Footer />
		</div>
	);
}
