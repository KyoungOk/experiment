import React from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import CommonHeader from "./components/CommonHeader";
import Footer from "./components/Footer";
import Button from "./components/Button";
import Input from "./components/Input";
import Radio from "./components/Radio";
import { db } from "./firebase";
import { interestOptions, jobOptions } from ".//constants/options";
import { collection, addDoc } from "firebase/firestore";
import { getAuth } from "firebase/auth";

export default function ProfileForm() {
	const [step, setStep] = useState(1);
	const [name, setName] = useState("");
	const [gender, setGender] = useState("female");
	const [age, setAge] = useState("");
	const [device, setDevice] = useState("iphone");
	const [job, setJob] = useState("");
	const [jobDetail, setJobDetail] = useState("");
	const [interests, setInterests] = useState([]);
	const [email, setEmail] = useState("");
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

			await addDoc(collection(db, "testers"), {
				uid: user.uid,
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
			navigate("/success?role=tester");
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
						{"Testers."}
					</p>
				</div>
				<div className="hidden md:flex flex-col items-start justify-start px-[var(--side-padding)] gap-4 mb-0 mt-10">
					<p className="text-[90px] whitespace-pre-line font-helvetic font-semibold leading-tight tracking-tight">
						{"Testers."}
					</p>
					<p className="text-[32px] max-w-[350px] whitespace-pre-line font-suit leading-tight tracking-tight">
						{"다양한 서비스를 먼저 체험하고, 보상을 받는 방법!"}
					</p>
				</div>

				{/* Profile Area */}
				<div className="w-full max-w-[400px]">
					<h1 className="text-[16px] font-suit mb-4 leading-tight tracking-tight">
						테스터로 매칭햐기 위해 직업, 관심사 등의 정보를 입력하세요.
					</h1>

					<form onSubmit={handleSubmit} className="space-y-3">
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
								<div>
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
								<div>
									<label className="block text-sm font-semibold mt-4 mb-1">
										핸드폰 기종
									</label>
									<div className="flex gap-6">
										<Radio
											name="device"
											value="아이폰"
											label="아이폰"
											checked={device === "iphone"}
											onChange={(e) => setDevice(e.target.value)}
										/>
										<Radio
											name="device"
											value="안드로이드"
											label="안드로이드"
											checked={device === "android"}
											onChange={(e) => setDevice(e.target.value)}
										/>
									</div>
								</div>

								<Button
									type="secondary"
									size="md"
									onClick={handleNext}
									className="w-full md:max-w-[400px]">
									다음
								</Button>
							</>
						)}
						{step === 2 && (
							<>
								<div className=" flex flex-col  md:gap-[20px]">
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
										size="md"
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
