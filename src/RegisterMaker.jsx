import React from "react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import OnboardingHeader from "./components/OnboardingHeader";
import Footer from "./components/Footer";
import Button from "./components/Button";
import Input from "./components/Input";
import Radio from "./components/Radio";
import { db } from "./firebase";
import { collection, addDoc, doc, setDoc } from "firebase/firestore";
import { getAuth, onAuthStateChanged } from "firebase/auth";

export default function RegisterMaker() {
	const [companyName, setCompanyName] = useState("");
	const [homepage, setHomepage] = useState("");
	const [name, setName] = useState("");
	const [email, setEmail] = useState("");
	const [productLink, setProductLink] = useState("");
	const navigate = useNavigate();

	// ✅ user 정보로 기본값 세팅
	useEffect(() => {
		const auth = getAuth();
		const unsubscribe = onAuthStateChanged(auth, (user) => {
			if (user) {
				if (user.displayName) setName(user.displayName);
				if (user.email) setEmail(user.email);
			}
		});
		return () => unsubscribe();
	}, []);
	const [errors, setErrors] = useState({
		companyName: false,
		homepage: false,
		name: false,
		email: false,
	});
	const handleSubmit = async (e) => {
		e.preventDefault();
		const newErrors = {
			companyName: companyName.trim() === "",
			homepage: homepage.trim() === "",
			name: name.trim() === "",
			email: email.trim() === "",
		};

		setErrors(newErrors);

		// 하나라도 true면 중단
		if (Object.values(newErrors).some((v) => v)) {
			alert("모든 필드를 입력해주세요.");
			return;
		}
		try {
			const auth = getAuth();
			const user = auth.currentUser;
			if (!user) throw new Error("로그인이 필요합니다.");
			const testerRef = doc(db, "makers", user.uid); // ← 문서 ID를 uid로 지정
			await setDoc(testerRef, {
				companyName,
				homepage,
				name,
				email,
				productLink,
				timestamp: new Date(),
			});
			navigate("/success?role=maker");
		} catch (error) {
			console.error("Error adding document: ", error);
		}
	};

	return (
		<div className="min-h-screen flex flex-col">
			<OnboardingHeader />
			<div className="relative flex flex-col md:items-center justify-start gap-4 pt-4 px-[var(--side-padding)] md:mt-10">
				{/* Main Copy */}
				<div className="flex flex-col  w-full max-w-[400px]  items-start justify-start z-10 mb-2">
					<p className="text-[54px] whitespace-pre-line font-helvetic font-semibold leading-tight tracking-tight">
						Makers.
					</p>
					<p className="text-[17px] font-suit tracking-tight">
						메이커의 기본적인 회사 정보를 입력해주세요.
					</p>
				</div>

				{/* Profile Area */}
				<div className="w-full max-w-[400px] pb-10">
					<form onSubmit={handleSubmit} className="space-y-3">
						{/* 회사이름 */}
						<div>
							<label className="block text-sm font-semibold mb-1">
								회사이름
							</label>
							<Input
								type="text"
								value={companyName}
								onChange={(e) => setCompanyName(e.target.value)}
								required
							/>
						</div>
						{/* 홈페이지 */}
						<div>
							<div className="flex flex-nowrap items-center gap-x-2">
								<label className="block text-sm font-semibold mb-1">
									회사 홈페이지
								</label>
								<label className="block text-sm font-light mb-1">
									(소셜미디어, 링크드인으로 대체 가능)
								</label>
							</div>
							<Input
								type="text"
								value={homepage}
								onChange={(e) => setHomepage(e.target.value)}
								required
							/>
						</div>
						{/* 상품 */}
						<div>
							<div className="flex flex-nowrap items-center gap-x-2">
								<label className="block text-sm font-semibold mb-1">
									서비스 또는 상품 링크
								</label>
								<label className="block text-sm font-light mb-1">
									(앱스토어, 구글 플레이 링크 대체 가능)
								</label>
							</div>
							<Input
								type="text"
								value={productLink}
								onChange={(e) => setProductLink(e.target.value)}
							/>
						</div>
						{/* 이름 */}
						<div>
							<label className="block text-sm font-semibold mb-1">이름</label>
							<Input
								type="text"
								value={name}
								onChange={(e) => setName(e.target.value)}
								required
							/>
						</div>
						{/* 이메일 */}
						<div className="flex flex-col gap-4">
							<div>
								<label className="block text-sm font-semibold mb-1">
									이메일
								</label>
								<Input
									type="email"
									value={email}
									onChange={(e) => setEmail(e.target.value)}
									required
								/>
							</div>

							<Button
								type="primary"
								buttonType="submit"
								size="lg"
								className="w-full md:max-w-[400px]">
								저장
							</Button>
						</div>
					</form>
				</div>
			</div>
			<Footer />
		</div>
	);
}
