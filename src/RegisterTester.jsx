import React from "react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import OnboardingHeader from "./components/OnboardingHeader";
import Footer from "./components/Footer";
import Button from "./components/Button";
import Input from "./components/Input";
import Radio from "./components/Radio";
import { db } from "./firebase";
import { interestOptions, jobOptions } from ".//constants/options";
import { collection, addDoc, doc, setDoc } from "firebase/firestore";
import { getAuth, onAuthStateChanged, signOut } from "firebase/auth";
export default function RegisterTester() {
	const [user, setUser] = useState(null);
	const [step, setStep] = useState(1);
	const [name, setName] = useState("");
	const [gender, setGender] = useState("female");
	const [age, setAge] = useState("");
	const [device, setDevice] = useState("iphone");
	const [job, setJob] = useState("");
	const [jobDetail, setJobDetail] = useState("");
	const [interests, setInterests] = useState([]);
	const [email, setEmail] = useState("");
	const [profilePhoto, setProfilePhoto] = useState("");
	const navigate = useNavigate();
	const handleNext = () => {
		if (name && gender && age && device) setStep(2);
	};

	const toggleInterest = (item) => {
		setInterests((prev) =>
			prev.includes(item)
				? prev.filter((i) => i !== item)
				: prev.length < 3
				? [...prev, item]
				: prev
		);
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		try {
			const auth = getAuth();
			const user = auth.currentUser;
			if (!user) throw new Error("로그인이 필요합니다.");

			const testerRef = doc(db, "testers", user.uid); // ← 문서 ID를 uid로 지정
			await setDoc(testerRef, {
				email: user.email || null,
				displayName: user.displayName || null,
				name,
				gender,
				age,
				device,
				job,
				jobDetail,
				interests,
				email,
				timestamp: new Date(),
			});

			setStep(1);
			navigate("/success");
		} catch (error) {
			console.error("Error adding document: ", error);
		}
	};

	useEffect(() => {
		const auth = getAuth();

		const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
			if (firebaseUser) {
				setUser(firebaseUser);
				setName(firebaseUser.displayName || "");
				setEmail(firebaseUser.email || "");
				setProfilePhoto(firebaseUser.photoURL || "");
			}
		});

		return () => unsubscribe();
	}, []);

	return (
		<div className="min-h-screen flex flex-col">
			<OnboardingHeader />
			<div className="relative flex flex-col md:items-center justify-start gap-4 pt-4 px-[var(--side-padding)] md:mt-10">
				{/* Main Copy */}
				<div className="items-start justify-start z-10 mb-2">
					<p className="text-[54px] whitespace-pre-line font-helvetic font-semibold leading-tight tracking-tight">
						Testers.
					</p>
					<p className="text-[17px] font-suit tracking-tight">
						테스터로 매칭햐기 위해 직업, 관심사 등의 정보를 입력하세요.
					</p>
				</div>

				{/* Profile Area */}
				<div className="w-full max-w-[400px]">
					<form onSubmit={handleSubmit} className="space-y-3 pb-10">
						{step === 1 && (
							<>
								{/* 이름 */}
								<div>
									<label className="block text-sm font-semibold mb-1">
										이름
									</label>
									<Input
										type="text"
										value={name}
										onChange={(e) => setName(e.target.value)}
										required
									/>
								</div>
								{/* 이메일 */}
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
								{/* 나이 */}
								<div>
									<label className="block text-sm font-semibold mb-1">
										나이
									</label>
									<Input
										type="number"
										value={age}
										onChange={(e) => setAge(e.target.value)}
										required
									/>
								</div>
								{/* 성별 */}
								<div className="pb-2">
									<label className="block text-sm font-semibold mb-1">
										성별
									</label>
									<div className="flex gap-6">
										<Radio
											name="gender"
											value="female"
											label="여성"
											checked={gender === "female"}
											onChange={(e) => setGender(e.target.value)}
											className="w-6 h-6 accent-black"
										/>
										<Radio
											name="gender"
											value="male"
											label="남성"
											checked={gender === "male"}
											onChange={(e) => setGender(e.target.value)}
										/>
									</div>
								</div>
								{/* 핸드폰 기종 */}
								<div className="pb-3">
									<label className="block text-sm font-semibold mt-4 mb-1">
										핸드폰 기종
									</label>
									<div className="flex gap-6">
										<Radio
											name="device"
											value="iphone"
											label="아이폰"
											checked={device === "iphone"}
											onChange={(e) => setDevice(e.target.value)}
										/>
										<Radio
											name="device"
											value="android"
											label="안드로이드"
											checked={device === "android"}
											onChange={(e) => setDevice(e.target.value)}
										/>
									</div>
								</div>

								<Button
									type="primary"
									size="lg"
									onClick={handleNext}
									className="w-full md:max-w-[400px]">
									다음
								</Button>
							</>
						)}
						{step === 2 && (
							<>
								<div className=" flex flex-col  space-y-5 pb-10">
									{/* 직업 */}
									<div>
										<label className="block text-sm font-semibold mb-1">
											직업
										</label>
										<select
											value={job}
											onChange={(e) => setJob(e.target.value)}
											className="w-full h-12 bg-white border border-gray-300 rounded-md px-2 py-3 text-md focus:outline-none focus:ring-2 focus:ring-black">
											<option value="">선택해주세요</option>
											{jobOptions.map(({ key, label }) => (
												<option key={key} value={key}>
													{label}
												</option>
											))}
										</select>
									</div>

									<div>
										<label className="block text-sm font-semibold mb-1">
											회사명, 상세 직업명, 직급(선택)
										</label>
										<Input
											value={jobDetail}
											onChange={(e) => setJobDetail(e.target.value)}
											required
										/>
									</div>

									{/* 관심사 */}
									<div>
										<label className="block text-sm font-semibold mb-2">
											관심사 (최대 3개 선택)
										</label>
										<div className="flex flex-wrap gap-2">
											{interestOptions.map(({ key, label }) => (
												<button
													type="button"
													key={key}
													onClick={() => toggleInterest(key)}
													className={`px-6 py-2 rounded-full border text-sm transition ${
														interests.includes(key)
															? "bg-black text-white border-black"
															: "bg-white text-black border-gray-300"
													}`}>
													{label}
												</button>
											))}
										</div>
									</div>

									<Button
										type="primary"
										buttonType="submit"
										size="lg"
										className="w-full md:max-w-[400px]">
										프로필 저장
									</Button>
								</div>
							</>
						)}
					</form>
				</div>
			</div>
			<Footer />
		</div>
	);
}
