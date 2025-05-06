import React from "react";
import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import OnboardingHeader from ".//components/OnboardingHeader";
import Footer from ".//components/Footer";
import Button from ".//components/Button";
import { getAuth, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { getAdmin, addAdmin } from "./repositories/adminRepository";

export default function SignupAdmin() {
	const navigate = useNavigate();
	const location = useLocation();
	const auth = getAuth();

	const handleGoogleSignIn = async () => {
		try {
			const provider = new GoogleAuthProvider();
			const result = await signInWithPopup(auth, provider);

			const user = result.user;
			if (!user) throw new Error("로그인 사용자 정보를 불러올 수 없습니다.");

			const adminData = await getAdmin(user.uid);
			if (adminData) {
				navigate("/adminDashboard");
			} else {
				await addAdmin(user);
				navigate("/adminDashboard");
			}
		} catch (error) {
			console.error("Google sign-in error:", error);
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
							Admin
						</p>
					</div>{" "}
					<Button
						type="primary"
						size="lg"
						onClick={handleGoogleSignIn}
						className="w-full md:w-[380px]">
						<img src="/icons/google.svg" />
						구글로 시작하기
					</Button>
				</div>
			</div>
			<Footer />
		</div>
	);
}
