import React from "react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import CommonHeader from "./components/CommonHeader";
import Footer from "./components/Footer";
import Button from "./components/Button";
import Input from "./components/Input";
import { db } from "./firebase";
import { collection, addDoc } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { interestOptions, ageOptions } from ".//constants/options";

export default function AddTest() {
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

	const navigate = useNavigate();
	// ✅ user 정보로 기본값 세팅

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

	const [errors, setErrors] = useState({
		testName: false,
		reward: false,
	});
	const handleSubmit = async (e) => {
		e.preventDefault();
		const newErrors = {
			testName: testName.trim() === "",
			reward: reward.trim() === "",
			testerCount: testerCount.trim() === "",
		};

		setErrors(newErrors);

		// 하나라도 true면 중단
		if (Object.values(newErrors).some((v) => v)) {
			alert("모든 필드를 입력해주세요.");
			return;
		}
		try {
			const user = getAuth().currentUser;
			if (!user) throw new Error("로그인이 필요합니다.");

			await addDoc(collection(db, "tests"), {
				uid: user.uid,
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
			});

			navigate("/makerHome");
		} catch (err) {
			console.error("등록 실패:", err);
		}
	};

	return (
		<div className="min-h-screen flex flex-col">
			<CommonHeader />
			<div className="relative flex flex-col md:flex-row md:items-top justify-start gap-0 md:gap-[60px] md:px-0 mt-2 md:mt-10 mb-0 md:mb-0 z-10">
				{/* Main Copy */}
				<div className="hidden md:flex flex-col fixed items-start justify-start px-[var(--side-padding)] gap-4 mt-24">
					<p className="text-[90px] whitespace-pre-line font-helvetic font-semibold leading-tight tracking-tight">
						{"New Test."}
					</p>
					<p className="text-[32px] max-w-[350px] whitespace-pre-line font-suit leading-tight tracking-tight">
						{"테스트할 내용과 테스터 조건을 설정해 주세요."}
					</p>
				</div>

				{/* Add Test */}
				<div className="w-full max-w-[600px] px-[16px] md:px-[30px] md:ml-[calc((100vw-16px*2)/3+16px)]">
					<div className="block md:hidden justify-start z-10 mt-1 mb-3">
						<p className="text-[35px] whitespace-pre-line font-helvetic font-bold leading-tight tracking-tight">
							{"New Test."}
						</p>
					</div>
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
								<label className="text-label-black">테스트 기간 </label>
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
								<label className="text-label-black pb-1">테스터 인원</label>
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
								<label className="text-label-black  pb-1">보상</label>
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
							<div className="flex gap-4 flex-wrap">
								{["아이폰", "안드로이드", "웹"].map((device) => (
									<label key={device} className="flex items-center gap-2">
										<input
											type="checkbox"
											checked={devices.includes(device)}
											onChange={() => toggleItem(device, devices, setDevices)}
										/>
										{device}
									</label>
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
							size="md"
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
