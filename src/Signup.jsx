import React from "react";
import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import OnboardingHeader from ".//components/OnboardingHeader";
import Footer from ".//components/Footer";
import Button from ".//components/Button";
import Input from "./components/Input";
import {
	getAdditionalUserInfo,
	getAuth,
	signInWithPopup,
	GoogleAuthProvider,
	OAuthProvider,
	signInAnonymously,
	sendSignInLinkToEmail,
	isSignInWithEmailLink,
	signInWithEmailLink,
} from "firebase/auth";
import { db } from "./firebase";
import {
	collection,
	addDoc,
	getDoc,
	getDocs,
	doc,
	query,
	where,
} from "firebase/firestore";

export default function Signup() {
	const navigate = useNavigate();
	const location = useLocation();
	const auth = getAuth();
	const params = new URLSearchParams(location.search);
	const role = params.get("role"); // "tester" 또는 "maker"
	const [emailMode, setEmailMode] = useState(false);
	const [email, setEmail] = useState("");
	const redirectURL = "https://testermatch.com/finishSignIn";

	const handleGoogleSignIn = async () => {
		try {
			const provider = new GoogleAuthProvider();
			const result = await signInWithPopup(auth, provider);

			const user = result.user;
			if (!user) throw new Error("로그인 사용자 정보를 불러올 수 없습니다.");

			const uid = user.uid;

			let collectionName = role === "maker" ? "makers" : "testers";
			const docRef = doc(db, collectionName, uid);
			const snapshot = await getDoc(docRef);
			if (snapshot.exists()) {
				// 이미 등록된 사용자 → 홈으로 이동
				navigate(role === "maker" ? "/homeMaker" : "/homeTester");
			} else {
				// 신규 사용자 → 등록 페이지로 이동
				navigate(role === "maker" ? "/registerMaker" : "/registerTester");
			}
		} catch (error) {
			console.error("Google sign-in error:", error);
		}
	};

	const sendLoginEmail = async () => {
		const url = `${redirectURL}?email=${encodeURIComponent(
			email
		)}&role=${role}`;

		const actionCodeSettings = {
			url, // Firebase 콘솔에 등록한 redirect URL과 같아야 함
			handleCodeInApp: true,
		};

		try {
			await sendSignInLinkToEmail(auth, email, actionCodeSettings);
			window.localStorage.setItem("emailForSignIn", email);
			window.localStorage.setItem("role", role);
			alert("로그인 링크를 이메일로 보냈어요!");
		} catch (error) {
			console.error("이메일 전송 실패:", error);
			alert("이메일 전송에 실패했어요.");
		}
	};

	// const handleAppleSignIn = async () => {
	// 	try {
	// 		const provider = new OAuthProvider("apple.com");
	// 		await signInWithPopup(auth, provider);
	// 		// ✅ role에 따라 경로 분기
	// 		if (role === "maker") {
	// 			navigate("/registerMaker");
	// 		} else {
	// 			navigate("/registerTester");
	// 		}
	// 	} catch (error) {
	// 		console.error("Apple sign-in error:", error);
	// 	}
	// };

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
						<p className="text-[17px] max-w-[400px] whitespace-pre-line font-suit tracking-tight">
							{role === "tester"
								? "테스터 매치의 테스터가 되어주세요."
								: "회사 이메일로 가입해야 승인절차가 간소화됩니다."}
						</p>
					</div>
					{emailMode ? (
						<>
							<label className="block text-sm font-semibold">이메일</label>
							<Input
								type="text"
								value={email}
								onChange={(e) => setEmail(e.target.value)}
								required
							/>
							<Button
								type="primary"
								size="lg"
								onClick={sendLoginEmail}
								className="w-full md:w-[380px]">
								가입 링크 보내기
							</Button>
						</>
					) : (
						<>
							{" "}
							<Button
								type="primary"
								size="lg"
								onClick={handleGoogleSignIn}
								className="w-full md:w-[380px]">
								<img src="/icons/google.svg" />
								구글로 시작하기
							</Button>
							{/* <Button
								type="primary"
								size="lg"
								onClick={handleAppleSignIn}
								className="w-full md:w-[380px]">
								<img
									src="/icons/apple-logo.svg"
									className="w-5 h-5 transition group-hover:invert"
								/>
								애플로 시작하기
							</Button> */}
							<Button
								type="tertiary"
								size="lg"
								onClick={() => setEmailMode(true)}
								className="w-full md:w-[380px]">
								이메일로 시작하기
							</Button>
							{/* <Button
								type="tertiary"
								size="lg"
								onClick={handleAnonymousSignIn}
								className="w-full md:w-[380px]">
								나중에
							</Button> */}
						</>
					)}

					<p className="text-[12px] md:text-[13px] max-w-[300px] md:max-w-[360px]  whitespace-pre-line font-suit tracking-tight mt-2 md:mt-4">
						{"서비스를 이용하기 위해 게나우 팩토리의 이용약관에 동의합니다. "}
					</p>
				</div>
			</div>
			<Footer />
		</div>
	);
}
