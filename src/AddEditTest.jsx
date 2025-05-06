import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import MakerHeader from "./components/MakerHeader";
import Footer from "./components/Footer";
import Button from "./components/Button";
import Input from "./components/Input";
import { db } from "./firebase";
import { doc, getDoc, collection, addDoc, updateDoc } from "firebase/firestore";
import { loadMaker } from "./repositories/makerRepository";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import {
	interestOptions,
	ageOptions,
	deviceOptions,
} from "./constants/options";

export default function AddEditTest() {
	const [maker, setMaker] = useState("");
	const [testName, setTestName] = useState("");
	const [reward, setReward] = useState("");
	const [description, setDescription] = useState("");
	const [devices, setDevices] = useState([]);
	const [category, setCategory] = useState([]);
	const [ages, setAges] = useState([]);
	const [startDate, setStartDate] = useState("");
	const [endDate, setEndDate] = useState("");
	const [isSameDate, setIsSameDate] = useState(false);
	const [testerCount, setTesterCount] = useState("");
	const [duration, setDuration] = useState("");

	const [errors, setErrors] = useState({});
	const navigate = useNavigate();
	const { testId } = useParams();
	const isEditMode = !!testId;

	useEffect(() => {
		const unsubscribe = onAuthStateChanged(getAuth(), async (user) => {
			if (!user) {
				navigate("/signup?role=maker");
				return;
			}

			const maker = await loadMaker(user.uid);
			if (!maker) {
				navigate("/signup?role=maker");
			} else {
				setMaker(maker);
				console.log("maker", maker);
			}

			if (isEditMode) {
				const fetchTest = async () => {
					const docRef = doc(db, "tests", testId);
					const docSnap = await getDoc(docRef);
					if (docSnap.exists()) {
						const data = docSnap.data();
						setTestName(data.testName || "");
						setReward(data.reward || "");
						setDescription(data.description || "");
						setDevices(data.devices || []);
						setCategory(data.category || []);
						setAges(data.ages || []);
						setStartDate(data.startDate || "");
						setEndDate(data.endDate || "");
						setIsSameDate(data.isSameDate || false);
						setTesterCount(data.testerCount || "");
						setDuration(data.duration || "");
					}
				};
				fetchTest();
			}
		});

		return () => unsubscribe();
	}, [navigate, isEditMode, testId]);

	const toggleItem = (item, list, setter) => {
		if (list.includes(item)) {
			setter(list.filter((i) => i !== item));
		} else {
			setter([...list, item]);
		}
	};

	const toggleCategory = (item) => {
		setCategory((prev) => (prev.includes(item) ? [] : [item]));
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		const newErrors = {
			testName: testName.trim() === "",
			reward: reward.trim() === "",
			testerCount: testerCount.trim() === "",
		};
		setErrors(newErrors);
		if (Object.values(newErrors).some((v) => v)) {
			alert("모든 필드를 입력해주세요.");
			return;
		}

		try {
			const user = getAuth().currentUser;
			if (!user) throw new Error("로그인이 필요합니다.");

			const testData = {
				makerId: maker.id,
				testName,
				reward,
				description,
				devices,
				category,
				ages,
				startDate,
				endDate: isSameDate ? startDate : endDate,
				isSameDate,
				testerCount,
				duration,
				timestamp: new Date(),
			};

			if (isEditMode) {
				const testRef = doc(db, "tests", testId);
				await updateDoc(testRef, testData);
				console.log("수정 완료");
			} else {
				await addDoc(collection(db, "tests"), testData);
				console.log("등록 완료");
			}

			navigate("/homeMaker");
		} catch (err) {
			console.error("등록/수정 실패:", err);
		}
	};

	return (
		<div className="min-h-screen flex flex-col">
			<MakerHeader />
			<div className="relative flex flex-col md:items-center justify-start  gap-3 md:gap-5 md:px-0 mt-2 md:mt-10 px-[var(--side-padding)]">
				{/* Main Copy */}
				<div className="flex flex-col  w-full max-w-[600px]  items-start justify-start">
					<p className="text-[54px] whitespace-pre-line font-helvetic font-semibold leading-tight tracking-tight">
						New Test.
					</p>
					<p className="text-[17px] font-suit tracking-tight">
						테스트할 서비스와 테스터 조건을 상세히 작성해주세요.
					</p>
				</div>
				{/* Add Test */}
				<div className="w-full max-w-[600px]">
					<form onSubmit={handleSubmit} className="space-y-6 mb-24">
						{/* 테스트명 */}
						<div className="flex flex-wrap gap-1">
							<div className="flex flex-nowrap items-center gap-x-2">
								<label className="text-label-black">타이틀</label>
								<label className="block text-sm font-light mb-1">
									(테스트할 내용이 직관적으로 이해되도록 작성)
								</label>
							</div>
							<Input
								value={testName}
								onChange={(e) => setTestName(e.target.value)}
							/>
						</div>
						{/* 상품 카테고리 */}
						<div className="flex flex-wrap gap-1">
							<label className="text-label-black">상품 카테고리</label>
							<div className="flex flex-wrap gap-2">
								{interestOptions.map(({ key, label }) => (
									<button
										type="button"
										key={key}
										onClick={() => toggleCategory(key)}
										className={`px-6 py-2 rounded-full border text-sm transition ${
											category.includes(key)
												? "bg-black text-white border-black"
												: "bg-white text-black border-gray-300"
										}`}>
										{label}
									</button>
								))}
							</div>
						</div>

						{/* 시작일 & 종료일 */}
						<div>
							<div className="flex gap-4 flex-wrap pt-3">
								<label className="text-label-black">테스트 일정 </label>
								<div className="flex gap-1 flex-wrap">
									<input
										type="checkbox"
										checked={isSameDate}
										onChange={(e) => setIsSameDate(e.target.checked)}
									/>
									<label className="block text-sm mb-1">
										시작일과 종료일이 같음
									</label>
								</div>
							</div>
							<div className="flex items-center gap-4">
								<div className="flex flex-col">
									<span className="text-xs mb-1">시작일</span>
									<input
										type="date"
										value={startDate}
										onChange={(e) => setStartDate(e.target.value)}
										className="border border-gray-300 rounded px-3 py-1"
									/>
								</div>

								{!isSameDate && (
									<div className="flex flex-col">
										<span className="text-xs mb-1">종료일</span>
										<input
											type="date"
											value={endDate}
											onChange={(e) => setEndDate(e.target.value)}
											className="border border-gray-300 rounded px-3 py-1"
										/>
									</div>
								)}
							</div>
						</div>
						<div className="flex gap-2">
							{/* 테스트 인원 */}
							<div>
								<label className="text-label-black pb-1">참가 인원</label>
								<Input
									type="number"
									min={1}
									value={testerCount}
									onChange={(e) => setTesterCount(e.target.value)}
									className="w-[150px]"
								/>
							</div>

							{/* 소요 시간 */}
							<div>
								<label className="text-label-black  pb-1">예상 소요 시간</label>
								<Input
									placeholder="예: 1시간"
									value={duration}
									onChange={(e) => setDuration(e.target.value)}
									className="w-[150px]"
								/>
							</div>

							{/* 보상 */}
							<div>
								<label className="text-label-black  pb-1">
									보상(금액,상품권)
								</label>
								<Input
									type="text"
									value={reward}
									onChange={(e) => setReward(e.target.value)}
									className="w-[150px]"
								/>
							</div>
						</div>
						{/* 디바이스 */}
						<div>
							<label className="text-label-black pb-1">테스트 환경</label>
							<div className="flex flex-wrap gap-2">
								{deviceOptions.map(({ key, label }) => (
									<button
										type="button"
										key={key}
										onClick={() => toggleItem(key, devices, setDevices)}
										className={`px-6 py-2 rounded-full border text-sm transition ${
											devices.includes(key)
												? "bg-black text-white border-black"
												: "bg-white text-black border-gray-300"
										}`}>
										{label}
									</button>
								))}
							</div>
						</div>

						{/* 연령대 */}
						<div>
							<label className="block text-sm font-semibold mb-2">
								테스터의 연령대
							</label>
							<div className="flex flex-wrap gap-2">
								{ageOptions.map(({ key, label }) => (
									<button
										type="button"
										key={key}
										onClick={() => toggleItem(key, ages, setAges)}
										className={`px-6 py-2 rounded-full border text-sm transition ${
											ages.includes(key)
												? "bg-black text-white border-black"
												: "bg-white text-black border-gray-300"
										}`}>
										{label}
									</button>
								))}
							</div>
						</div>

						{/* 상세 내용 */}
						<div>
							<label className="text-label-black pb-1">테스트 내용 상세</label>
							<textarea
								rows={5}
								className="w-full border border-gray-300 rounded p-2"
								value={description}
								onChange={(e) => setDescription(e.target.value)}
							/>
						</div>
						<Button
							type="primary"
							buttonType="submit"
							size="lg"
							className={`w-full md:max-w-[var(--max-width)]`}>
							저장
						</Button>
					</form>
				</div>
			</div>
			<Footer />
		</div>
	);
}
