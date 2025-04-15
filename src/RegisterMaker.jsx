import React from "react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import CommonHeader from "./components/CommonHeader";
import Footer from "./components/Footer";
import Button from "./components/Button";
import Input from "./components/Input";
import Radio from "./components/Radio";
import { db } from "./firebase";
import { collection, addDoc } from "firebase/firestore";
import { getAuth } from "firebase/auth";

export default function RegisterMaker() {
	const [companyName, setCompanyName] = useState("");
	const [homepage, setHomepage] = useState("");
	const [name, setName] = useState("");
	const [email, setEmail] = useState("");
	const navigate = useNavigate();
	// ✅ user 정보로 기본값 세팅
	useEffect(() => {
		const auth = getAuth();
		const user = auth.currentUser;
		if (user) {
			if (user.displayName) setName(user.displayName);
			if (user.email) setEmail(user.email);
		}
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

			await addDoc(collection(db, "makers"), {
				uid: user.uid,
				companyName,
				homepage,
				name,
				email,
				timestamp: new Date(),
			});
			navigate("/success?role=maker");
		} catch (error) {
			console.error("Error adding document: ", error);
		}
	};

	return (
		<div className="min-h-screen flex flex-col">
			<CommonHeader />
			<div className="relative flex flex-col md:flex-row md:items-center justify-start gap-0 md:gap-[60px] md:px-0 mt-0 md:mt-20 mb-0 md:mb-0 z-10">
				{/* Main Copy */}
				<div className="block md:hidden justify-start z-10 mt-0 mb-1">
					<p className="text-[35px] whitespace-pre-line font-helvetic font-semibold leading-tight tracking-tight">
						{"Makers."}
					</p>
				</div>
				<div className="hidden md:flex flex-col items-start justify-start px-[var(--side-padding)] gap-4 mb-0 mt-10">
					<p className="text-[90px] whitespace-pre-line font-helvetic font-semibold leading-tight tracking-tight">
						{"Makers."}
					</p>
					<p className="text-[32px] max-w-[350px] whitespace-pre-line font-suit leading-tight tracking-tight">
						{"원하는 사용자를 선택해서 상품을 테스트하세요."}
					</p>
				</div>

				{/* Profile Area */}
				<div className="w-full max-w-[400px]">
					<h1 className="text-[16px] font-suit mb-4 leading-tight tracking-tight">
						메이커의 기본적인 회사 정보를 입력해주세요.
					</h1>

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
									홈페이지
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
								size="md"
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
