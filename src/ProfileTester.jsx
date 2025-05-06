import React from "react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import TesterHeader from "./components/TesterHeader";
import Footer from "./components/Footer";
import Button from "./components/Button";
import Input from "./components/Input";
import Radio from "./components/Radio";
import { db } from "./firebase";
import {
	getAuth,
	deleteUser,
	onAuthStateChanged,
	signOut,
} from "firebase/auth";
import { TesterListViewModel } from "./hooks/TesterListViewModel";
import { collection, addDoc, setDoc, doc } from "firebase/firestore";
import {
	interestOptions,
	jobOptions,
	ageOptions,
	deviceOptions,
} from ".//constants/options";

export default function ProfileTester() {
	const [name, setName] = useState("");
	const [gender, setGender] = useState("female");
	const [age, setAge] = useState("");
	const [device, setDevice] = useState("iphone");
	const [job, setJob] = useState("");
	const [jobDetail, setJobDetail] = useState("");
	const [interests, setInterests] = useState([]);
	const [email, setEmail] = useState("");
	const [snsURL, setSnsURL] = useState("");
	const navigate = useNavigate();
	const [user, setUser] = useState(null);
	const [tester, setTester] = useState(null);
	const { getTester, deleteAccount } = TesterListViewModel();
	const [isEdit, setIsEdit] = useState(false);
	const toggleInterest = (item) => {
		setInterests((prev) =>
			prev.includes(item)
				? prev.filter((i) => i !== item)
				: prev.length < 3
				? [...prev, item]
				: prev
		);
	};
	const handleDeleteAccount = async () => {
		const confirmed = window.confirm("정말 계정을 삭제하시겠어요?");
		if (!confirmed) return;

		const auth = getAuth();
		const user = auth.currentUser;

		if (user) {
			try {
				await deleteUser(user);
				await deleteAccount(user);
				alert("계정이 삭제되었습니다.");
				// 예: 로그아웃 처리나 리다이렉트
				navigate("/howItWorks");
			} catch (error) {
				if (error.code === "auth/requires-recent-login") {
					alert("보안을 위해 다시 로그인 후 시도해주세요.");
					// 예: 재로그인 유도 페이지로 이동
					// navigate("/relogin");
				} else {
					console.error("계정 삭제 실패:", error);
					alert("계정 삭제 중 오류가 발생했습니다.");
				}
			}
		} else {
			alert("로그인된 사용자가 없습니다.");
		}
	};
	const handleLogout = async () => {
		const auth = getAuth();

		try {
			await signOut(auth);
			navigate("/signup?role=tester");
			console.log("로그아웃되었습니다.");
			// 필요하다면 리디렉션 or 상태 초기화
			// 예: navigate("/login") 또는 setUser(null)
		} catch (error) {
			console.error("로그아웃 실패:", error);
		}
	};
	const handleSubmit = async (e) => {
		e.preventDefault();

		try {
			const auth = getAuth();
			const user = auth.currentUser;
			if (!user) throw new Error("로그인이 필요합니다.");

			const ref = doc(db, "testers", tester.id); // 🔄 setDoc: uid를 문서 ID로

			await setDoc(
				ref,
				{
					email,
					name,
					gender,
					age,
					device,
					job,
					jobDetail,
					snsURL,
					interests,
				},
				{ merge: true }
			);

			navigate("/success?role=tester");
		} catch (error) {
			console.error("Error adding document: ", error);
		}
	};
	useEffect(() => {
		const unsubscribe = onAuthStateChanged(getAuth(), setUser);
		return () => unsubscribe();
	}, []);
	useEffect(() => {
		const loadTester = async () => {
			if (!user) return;

			const tester = await getTester(user.uid);
			setTester(tester);
		};

		loadTester();
	}, [user]);
	useEffect(() => {
		if (tester) {
			setName(tester.name || "");
			setGender(tester.gender || "female");
			setSnsURL(tester.snsURL || "");
			setAge(tester.age || "");
			setDevice(tester.device || "iphone");
			setJob(tester.job || "");
			setJobDetail(tester.jobDetail || "");
			setInterests(tester.interests || []);
			setEmail(tester.email || user?.email || "");
		}
	}, [tester, user]);

	return (
		<div className="flex flex-col">
			<TesterHeader />
			<div className="relative flex flex-col md:items-center justify-start gap-4 pt-4 px-[var(--side-padding)] md:mt-10 pb-20">
				{/* Main Copy */}
				<div className="items-start justify-start z-10 mb-2">
					<p className="text-[54px] whitespace-pre-line font-helvetic font-semibold leading-tight tracking-tight">
						Profile.
					</p>
					<p className="text-[17px] font-suit tracking-tight">
						상세하게 정보를 입력할수록 테스터로 선정될 확율이 높아집니다.
					</p>
				</div>
				{isEdit ? (
					<>
						{/* Profile Area */}
						<div className="w-full max-w-[400px] pb-20">
							<form onSubmit={handleSubmit} className="space-y-3">
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
									<div className=" flex flex-col  space-y-3">
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
										{/* 회사명, 상세 직업명, 직급 */}
										<div>
											<label className="block text-sm font-semibold mb-1">
												직업 상세(회사명, 직급, 프리랜서)
											</label>
											<Input
												value={jobDetail}
												onChange={(e) => setJobDetail(e.target.value)}
											/>
										</div>
										{/* 소셜 미디어 */}
										<div>
											<label className="block text-sm font-semibold mb-1">
												소셜 미디어(인스타그램, 유튜브, 개인 블로그)
											</label>
											<Input
												value={snsURL}
												onChange={(e) => setSnsURL(e.target.value)}
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
							</form>
						</div>
					</>
				) : (
					<>
						{/* Profile Area */}
						<div className="w-full max-w-[400px] pb-20">
							<form onSubmit={handleSubmit} className="space-y-2">
								<>
									{/* 이름 */}
									<div>
										<label className="text-label mb-1">이름</label>
										<p className="text-value">{name || ""}</p>
									</div>
									<div className="h-px bg-gray-100" />
									{/* 이메일 */}
									<div>
										<label className="text-label mb-1">이메일</label>
										<p className="text-value">{email || ""}</p>
									</div>
									<div className="h-px bg-gray-100" />
									<div className="flex flex-wrap gap-4 mt-1 items-start">
										{/* 나이 */}
										<div className="flex-1">
											<label className="text-label mb-1">나이</label>
											<p className="text-value">{age || ""}</p>
										</div>
										<div className="h-px bg-gray-100" />
										{/* 성별 */}
										<div className="flex-1">
											<label className="text-label mb-1">성별</label>
											<p className="text-value">
												{gender === "female" ? "여성" : "남성"}
											</p>
										</div>
										<div className="h-px bg-gray-100" />
										{/* 핸드폰 기종 */}
										<div className="flex-1">
											<label className="text-label mb-1">핸드폰 기종</label>
											<p className="text-value">
												{device
													? deviceOptions.find((opt) => opt.key === device)
															?.label || device
													: "-"}
											</p>
										</div>
									</div>
									<div className="h-px bg-gray-100" />
									{/* 직업 */}
									<div>
										<label className="text-label mb-1">직업</label>
										<p className="text-value">
											{job
												? jobOptions.find((opt) => opt.key === job)?.label ||
												  job
												: "-"}
										</p>
									</div>
									<div className="h-px bg-gray-100" />
									{/* 회사명, 상세 직업명, 직급 */}
									<div>
										<label className="text-label mb-1">
											직업 상세(회사명, 직급, 프리랜서)
										</label>
										<p className="text-value">{jobDetail || "-"}</p>
									</div>
									<div className="h-px bg-gray-100" />
									{/* 소셜 미디어 */}
									<div>
										<label className="text-label mb-1">
											소셜 미디어(인스타그램, 유튜브, 개인 블로그)
										</label>
										<p className="text-value">{snsURL || "-"}</p>
									</div>
									<div className="h-px bg-gray-100" />
									{/* 관심사 */}
									<div className="pb-3">
										<label className="text-label mb-1">
											관심사 (최대 3개 선택)
										</label>
										<p className="text-value">
											{interests && interests.length > 0
												? interests
														.map((key) => {
															const option = interestOptions.find(
																(opt) => opt.key === key
															);
															return option ? option.label : key; // fallback으로 key도 표시
														})
														.join(", ")
												: "-"}
										</p>
									</div>

									<Button
										type="tertiary"
										onClick={() => setIsEdit(true)}
										size="lg"
										className="w-full md:max-w-[400px]">
										수정
									</Button>
									<div className="w-full flex justify-center pt-6">
										<p
											onClick={handleLogout}
											className="text-value text-red-500 hover:underline cursor-pointer  text-center">
											로그아웃
										</p>
									</div>

									<div className="w-full flex flex-col items-center justify-center pt-10">
										<label className="w-full text-[13px] text-gray-400 text-center">
											계정을 삭제하면 복구할 수 없습니다.
										</label>
										<p
											onClick={handleDeleteAccount}
											className="text-[14px] text-gray-400 hover:underline cursor-pointer text-center mt-2">
											계정삭제
										</p>
									</div>
								</>
							</form>
						</div>
					</>
				)}
			</div>
			<Footer />
		</div>
	);
}
