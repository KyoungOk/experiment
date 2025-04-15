import React from "react";
import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import CommonHeader from ".//components/CommonHeader";
import OnboardingHeader from ".//components/OnboardingHeader";
import Footer from ".//components/Footer";
import Button from ".//components/Button";
import { db } from "./firebase";
import { collection, query, where, getDocs } from "firebase/firestore";
import {
	getAuth,
	signInWithPopup,
	GoogleAuthProvider,
	OAuthProvider,
	signInAnonymously,
} from "firebase/auth";

export default function Signup() {
	const navigate = useNavigate();
	const location = useLocation();
	const auth = getAuth();
	const params = new URLSearchParams(location.search);
	const role = params.get("role"); // "tester" 또는 "maker"

	const handleGoogleSignIn = async () => {
		try {
			const provider = new GoogleAuthProvider();
			await signInWithPopup(auth, provider);
			// ✅ role에 따라 경로 분기
			if (role === "maker") {
				navigate("/registerMaker");
			} else {
				navigate("/registerTester");
			}
		} catch (error) {
			console.error("Google sign-in error:", error);
		}
	};

	const handleAppleSignIn = async () => {
		try {
			const provider = new OAuthProvider("apple.com");
			await signInWithPopup(auth, provider);
			// ✅ role에 따라 경로 분기
			if (role === "maker") {
				navigate("/registerMaker");
			} else {
				navigate("/registerTester");
			}
		} catch (error) {
			console.error("Apple sign-in error:", error);
		}
	};

	const handleAnonymousSignIn = async () => {
		try {
			await signInAnonymously(auth);
			// ✅ role에 따라 경로 분기
			if (role === "maker") {
				navigate("/registerMaker");
			} else {
				navigate("/registerTester");
			}
		} catch (error) {
			console.error("Anonymous sign-in error:", error);
		}
	};

	return (
		<div className="min-h-screen flex flex-col">
			<OnboardingHeader />
			<div className="relative flex flex-col md:flex-row md:items-center justify-center gap-1 md:gap-[60px] pt-4 px-[var(--side-padding)] md:mt-20 z-10">
				{/* Main Copy */}

				{/* Signup Link Area */}
				<div className="relative flex flex-col md:flex-col items-start justify-start gap-2 z-10 mt-1 md:mt-20 mb-12 md:mb-0">
					<div className="justify-start z-10 mb-6">
						<p className="text-[54px] whitespace-pre-line font-helvetic font-semibold leading-tight tracking-tight">
							{role === "tester" ? "Testers." : "Makers."}
						</p>
						<p className="text-[17px] max-w-[300px] whitespace-pre-line font-suit tracking-tight">
							{role === "tester"
								? "테스터로 선정되기 위해 직업과 나이, 관심사 정보가 필요합니다. 먼저 회원가입을 해주세요."
								: "메이커는 테스트할 상품을 등록하기 위해 회원가입이 필요합니다."}
						</p>
					</div>
					<Button
						type="secondary"
						onClick={handleGoogleSignIn}
						className="w-full md:w-[380px]">
						<img src="/icons/google.svg" />
						구글로 시작하기
					</Button>
					<Button
						type="secondary"
						onClick={handleAppleSignIn}
						className="w-full md:w-[380px]">
						<img
							src="/icons/apple.svg"
							className="w-5 h-5 transition group-hover:invert"
						/>
						애플로 시작하기
					</Button>

					<Button
						type="tertiary"
						onClick={handleAnonymousSignIn}
						className="w-full md:w-[380px]">
						나중에
					</Button>

					<p className="text-[12px] md:text-[13px] max-w-[300px] md:max-w-[360px]  whitespace-pre-line font-suit tracking-tight mt-2 md:mt-4">
						{"서비스를 이용하기 위해 게나우 팩토리의 이용약관에 동의합니다. "}
					</p>
				</div>
			</div>
			<Footer />
		</div>
	);
}
