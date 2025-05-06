import React from "react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import MakerHeader from "./components/MakerHeader";
import Footer from "./components/Footer";
import Button from "./components/Button";
import formatTestDate from "./helper/formatTestDate";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { MakerListViewModel } from "./hooks/MakerListViewModel";
import TestListForMaker from "./maker/TestListForMaker";

import {
	MatchState,
	matchStatusMap,
	ongoingStates,
	editableStates,
} from "./constants/MatchState";
import {
	addToGoogleCalendar,
	downloadIcsFile,
	isGoogleEmail,
} from "./helper/calendarManager";
import {
	interestOptions,
	jobOptions,
	ageOptions,
	deviceOptions,
	genderOptions,
} from ".//constants/options";

export default function HomeMaker() {
	const navigate = useNavigate();
	const userLanguage = navigator.language || "ko";
	const [user, setUser] = useState(null);
	const [maker, setMaker] = useState(null);
	const {
		userTests,
		getMaker,
		handleTimeChange,
		handlePrev,
		handleNext,
		currentIndex,
		currentTest,
		handleDateSend,
		handleDateChange,
		updateStatus,
		loading,
		loadTestData,
	} = MakerListViewModel(user);

	const handleReview = async (matchId) => {
		console.log("matchId", matchId);
		navigate("/review?matchId=" + matchId);
	};

	const handleCalendar = async (
		title,
		details,
		location,
		testDate,
		testTime
	) => {
		const startTime = new Date(`${testDate}T${testTime}:00`);
		// 2. 종료 시간 = 시작 시간 + 1시간
		const endTime = new Date(startTime.getTime() + 60 * 60 * 1000);
		if (isGoogleEmail(maker.email)) {
			await addToGoogleCalendar(title, details, location, startTime, endTime);
		} else {
			await downloadIcsFile(title, details, location, startTime, endTime);
		}
	};
	const handleAdd = () => {
		if (maker.approved) {
			navigate("/add-test");
		} else {
			const confirmChange = window.confirm(
				"회사 승인이 아직 완료되지 않았습니다."
			);
			if (!confirmChange) return;
		}
	};

	const handleEdit = (testId) => {
		navigate(`/edit-test/${testId}`);
	};

	useEffect(() => {
		const unsubscribe = onAuthStateChanged(getAuth(), async (user) => {
			setUser(user); // ✅ 필요하면 여전히 setUser 가능
			console.log("user", user);
			if (!user) {
				navigate("/signup?role=maker");
				return;
			}

			const maker = await getMaker(user.uid);
			if (!maker) {
				navigate("/signup?role=maker");
			} else {
				setMaker(maker);
				loadTestData(maker.id);
			}
		});

		return () => unsubscribe();
	}, [navigate]);

	return (
		<div className="min-h-screen flex flex-col bg-gray-100">
			<MakerHeader />
			<div className="px-[10px] md:px-[var(--side-padding)] pt-3 md:pt-5  pb-3 md:pb-4">
				{maker && maker.approved !== true && (
					<div className="w-full max-w-card text-value text-red-600 py-5">
						회사 승인이 완료되지 않았기 때문에 테스트를 추가하실 수 없습니다.
						승인은 최대 24시간 걸릴 수 있습니다.
					</div>
				)}
				<Button
					type="primary"
					size="lg"
					onClick={handleAdd}
					className="w-full max-w-card">
					테스트 만들기
				</Button>
			</div>
			<div className="w-full pb-20 px-[10px] md:px-[var(--side-padding)]">
				<div className="flex flex-col md:flex-row gap-4 md:gap-10">
					{/* 테스트 목록 */}
					<TestListForMaker
						loading={loading}
						userTests={userTests}
						currentIndex={currentIndex}
						handlePrev={handlePrev}
						handleNext={handleNext}
						handleEdit={handleEdit}
						currentTest={currentTest}
						userLanguage={userLanguage}
					/>
					{/* 선택된 테스트의 참가자 진행중 */}
					<div className="w-full max-w-card pb-4 space-y-3">
						<div className="px-7 py-4 rounded-[10px] bg-white space-y-1">
							<div className="flex items-start justify-between">
								<div className="flex text-value">테스터 탐색하기</div>
								{currentTest.matches.filter(
									(m) => m.status === MatchState.testerInterest
								).length > 0 && (
									<div className="flex items-center gap-2">
										<div
											className={`w-3 h-3 rounded-full ${
												matchStatusMap[MatchState.testerInterest].color
											}`}
										/>
										<div className="text-[13px]">
											관심표현{" "}
											{
												currentTest.matches.filter(
													(m) => m.status === MatchState.testerInterest
												).length
											}
										</div>
									</div>
								)}
								{currentTest.matches.filter(
									(m) => m.status === MatchState.dateSuggest
								).length > 0 && (
									<div className="flex items-center gap-2">
										<div
											className={`w-3 h-3 rounded-full ${
												matchStatusMap[MatchState.dateSuggest].color
											}`}
										/>
										<div className="text-[13px]">
											대기중{" "}
											{
												currentTest.matches.filter(
													(m) => m.status === MatchState.dateSuggest
												).length
											}
										</div>
									</div>
								)}
								{currentTest.matches.filter(
									(m) => m.status === MatchState.testerCancel
								).length > 0 && (
									<div className="flex items-center gap-2">
										<div
											className={`w-3 h-3 rounded-full ${
												matchStatusMap[MatchState.testerCancel].color
											}`}
										/>
										<div className="text-[13px]">
											테스터 취소{" "}
											{
												currentTest.matches.filter(
													(m) => m.status === MatchState.testerCancel
												).length
											}
										</div>
									</div>
								)}
							</div>
						</div>
						{currentTest === null ? (
							<div className="p-7 rounded-[16px] bg-white space-y-3">
								<div className="flex text-guide item-center justify-center">
									테스터를 탐색하는 영역입니다.
								</div>
							</div>
						) : currentTest?.matches.filter((m) =>
								ongoingStates.includes(m.status)
						  ).length === 0 ? (
							<div className="p-7 rounded-[16px] bg-white space-y-3">
								<div className="flex text-guide item-center justify-center">
									테스터를 찾고 있습니다. 최대 2-3일 소요될 수 있습니다.
								</div>
							</div>
						) : (
							<ul className="space-y-2">
								{currentTest?.matches
									.filter((m) => ongoingStates.includes(m.status))
									.map((match, index) => (
										<li
											key={index}
											className="p-7 rounded-[10px] bg-white space-y-2">
											<div className="flex items-center gap-2 mb-8">
												<div
													className={`w-3 h-3 rounded-full ${
														matchStatusMap[match.status].color
													}`}
												/>
												<p className="text-base font-semibold text-gray-800">
													{matchStatusMap[match.status].label}
												</p>
											</div>

											<div className="flex items-start justify-between gap-4">
												<div className="flex flex-col ">
													<div className="text-label">이름</div>
													<p className="text-value">
														{match.tester.name || "-"}
													</p>
												</div>
												<div className="flex flex-col">
													<div className="text-label">나이</div>
													<div className="text-value">
														{match.tester.age || "-"}
													</div>
												</div>
												<div className="flex flex-col items-end">
													<div className="text-label">성별</div>
													<p className="text-value">
														{match.tester.gender
															? genderOptions.find(
																	(opt) => opt.key === match.tester.gender
															  )?.label || match.tester.gender
															: "-"}
													</p>
												</div>

												{match.tester.reviewStats.reviewCount > 0 && (
													<div className="flex flex-col items-end">
														<div className="text-label">
															리뷰({match.tester.reviewStats.reviewCount ?? "-"}
															)
														</div>
														<p className="text-value">
															{match.tester.reviewStats.averageRating ?? "-"} /
															5
														</p>
													</div>
												)}
											</div>

											<div className="h-px bg-gray-100 my-4" />

											<div className="flex items-start justify-between gap-4">
												<div className="flex flex-col">
													<div className="text-label">사용 기기</div>
													<p className="text-value">
														{match.tester.device
															? deviceOptions.find(
																	(opt) => opt.key === match.tester.device
															  )?.label || match.tester.device
															: "-"}
													</p>
												</div>
												<div className="flex flex-col">
													<div className="text-label">직업</div>
													<p className="text-value">
														{match.tester.job
															? jobOptions.find(
																	(opt) => opt.key === match.tester.job
															  )?.label || match.tester.job
															: "-"}
													</p>
												</div>
												<div className="flex flex-col items-end">
													<div className="text-label">직업상세</div>
													<p className="text-value">
														{match.tester.jobDetail || "-"}
													</p>
												</div>
											</div>

											<div className="h-px bg-gray-100 my-4" />

											<div className="flex items-start justify-between gap-4 pb-1">
												<div className="flex flex-col gap-2">
													<div className="text-label">관심사</div>
													<div className="flex flex-wrap gap-2">
														{match.tester.interests &&
														match.tester.interests.length > 0 ? (
															match.tester.interests.map((key) => {
																const option = interestOptions.find(
																	(opt) => opt.key === key
																);
																const label = option ? option.label : key;

																const isHighlighted = Array.isArray(
																	currentTest?.category
																)
																	? currentTest.category.includes(key)
																	: currentTest?.category === key;

																return (
																	<span
																		key={key}
																		className={`px-3 py-1 rounded-full text-[11px] border ${
																			isHighlighted
																				? "bg-yellow-50 border-yellow-200"
																				: "bg-white border-gray-150"
																		}`}>
																		{label}
																	</span>
																);
															})
														) : (
															<span className="text-gray-400">-</span>
														)}
													</div>
												</div>
											</div>
											{match.tester.snsURL?.trim() ? (
												<>
													{" "}
													<div className="h-px bg-gray-100 my-4" />
													<div className="flex flex-col items-start">
														<div className="text-label">소셜 미디어</div>
														<p className="text-value">
															{match.tester.snsURL || "-"}
														</p>
													</div>
												</>
											) : null}
											<div className="h-px bg-gray-100 my-4" />

											<div className="grid grid-cols-2 gap-2 mb-8">
												<div className="flex flex-col gap-1">
													<div className="text-label">일자</div>
													{editableStates.includes(match.status) ? (
														<input
															type="date"
															value={match.testDate || "날짜지정"}
															onChange={(e) =>
																handleDateChange(index, e.target.value)
															}
															className="border border-black rounded px-3 py-1"
														/>
													) : (
														<p className="text-valueTitle">
															{match.testDate || "-"}
														</p>
													)}
												</div>

												<div className="flex flex-col gap-1">
													<div className="text-label">시간</div>
													{editableStates.includes(match.status) ? (
														<input
															type="time"
															value={match.testTime || "시간 지정"}
															onChange={(e) =>
																handleTimeChange(index, e.target.value)
															}
															className="border border-black rounded px-3 py-1"
														/>
													) : (
														<p className="text-valueTitle">
															{match.testTime || "-"}
														</p>
													)}
												</div>
											</div>

											<div className="flex gap-1 md:flex-row gap-2 pt-2 items-end justify-end">
												{match.status === MatchState.testerInterest ||
												match.status === MatchState.makerCancel ? (
													<>
														<Button
															type="tertiary"
															size="md"
															onClick={() =>
																updateStatus(index, MatchState.makerPending)
															}
															className="w-1/2 md:max-w-[400px]">
															보류
														</Button>
														<Button
															type="secondary"
															size="md"
															onClick={() => handleDateSend(index)}
															className="w-1/2 md:max-w-[400px]">
															일정 보내기
														</Button>
													</>
												) : match.status === MatchState.testerCancel ||
												  match.status === MatchState.makerPending ? (
													<div />
												) : (
													<Button
														type="tertiary"
														size="md"
														onClick={() =>
															updateStatus(index, MatchState.makerCancel)
														}
														className="w-1/2 md:max-w-[400px]">
														일정 취소
													</Button>
												)}
											</div>
										</li>
									))}
							</ul>
						)}
					</div>

					{/* 선택된 테스트의 참가자 일정 확인 및 완료 */}
					<div className="w-full max-w-card pb-4 space-y-3">
						<div className="px-7 py-4 rounded-[10px] bg-white space-y-1">
							<div className="flex items-start justify-between gap-6">
								<div className="flex text-value flex-1">테스터 목록</div>
								{currentTest?.matches.filter(
									(m) => m.status === MatchState.testerAccept
								).length > 0 && (
									<div className="flex items-center gap-2">
										<div
											className={`w-3 h-3 rounded-full ${
												matchStatusMap[MatchState.testerAccept].color
											}`}
										/>
										<div className="text-[13px]">
											확정{" "}
											{
												currentTest.matches.filter(
													(m) => m.status === MatchState.testerAccept
												).length
											}
										</div>
									</div>
								)}

								{currentTest?.matches.filter(
									(m) =>
										m.status === MatchState.doneTest ||
										m.status === MatchState.testerDone
								).length > 0 && (
									<div className="flex items-center gap-2">
										<div
											className={`w-3 h-3 rounded-full ${
												matchStatusMap[MatchState.testerDone].color
											}`}
										/>
										<div className="text-[13px]">
											완료{" "}
											{
												currentTest.matches.filter(
													(m) =>
														m.status === MatchState.doneTest ||
														m.status === MatchState.testerDone
												).length
											}
										</div>
									</div>
								)}
							</div>
						</div>
						{currentTest === null ? (
							<div className="p-7 rounded-[16px] bg-white space-y-3">
								<div className="flex text-guide item-center justify-center">
									일정이 확정된 테스터를 모아보는 공간입니다.
								</div>
							</div>
						) : currentTest?.matches.filter(
								(m) =>
									m.status === MatchState.testerAccept ||
									m.status === MatchState.testerDone
						  ).length === 0 ? (
							<div className="p-7 rounded-[16px] bg-white space-y-3">
								<div className="flex text-guide item-center justify-center">
									진행 예정인 테스터가 없습니다.
								</div>
							</div>
						) : (
							<ul className="space-y-2">
								{currentTest?.matches
									.filter(
										(m) =>
											m.status === MatchState.doneTest ||
											m.status === MatchState.testerDone ||
											m.status === MatchState.testerAccept
									)
									.map((match, index) => (
										<li
											key={index}
											className="p-7 rounded-[10px] bg-white space-y-2">
											<div className="flex items-center gap-2 mb-8">
												<div
													className={`w-3 h-3 rounded-full ${
														matchStatusMap[match.status].color
													}`}
												/>
												<p className="text-base font-semibold text-gray-800">
													{matchStatusMap[match.status].label}
												</p>
											</div>

											<div className="grid grid-cols-2 justify-between mb-8">
												<div className="flex flex-col flex-1">
													<div className="text-label">일자</div>
													{editableStates.includes(match.status) ? (
														<input
															type="date"
															value={match.testDate || "날짜지정"}
															onChange={(e) =>
																handleDateChange(index, e.target.value)
															}
															className="border border-black rounded px-3 py-1"
														/>
													) : (
														<p className="text-valueTitle">
															{match.testDate || "-"}
														</p>
													)}
												</div>

												<div className="flex flex-col items-end">
													<div className="text-label">시간</div>
													{editableStates.includes(match.status) ? (
														<input
															type="time"
															value={match.testTime || "시간 지정"}
															onChange={(e) =>
																handleTimeChange(index, e.target.value)
															}
															className="border border-black rounded px-3 py-1"
														/>
													) : (
														<p className="text-valueTitle">
															{match.testTime || "-"}
														</p>
													)}
												</div>
											</div>
											<div className="h-px bg-gray-100 my-4" />

											<div className="flex items-start justify-between gap-4">
												<div className="flex flex-col">
													<div className="text-label">이름</div>
													<p className="text-value">
														{match.tester.name || "-"}
													</p>
												</div>
												<div className="flex flex-col">
													<div className="text-label">나이</div>
													<div className="text-value">
														{match.tester.age || "-"}
													</div>
												</div>
												<div className="flex flex-col items-end">
													<div className="text-label">직업</div>
													<p className="text-value">
														{match.tester.job
															? jobOptions.find(
																	(opt) => opt.key === match.tester.job
															  )?.label || match.tester.job
															: "-"}
													</p>
												</div>
											</div>

											<div className="h-px bg-gray-100 my-4" />

											<div className="flex items-start justify-between gap-4">
												<div className="flex flex-col">
													<div className="text-label">이메일</div>
													<p className="text-value">
														{match.tester.email || "-"}
													</p>
												</div>
												<div className="flex flex-col items-end">
													<div className="text-label">성별</div>
													<p className="text-value">
														{match.tester.gender === "male" ? "남성" : "여성"}
													</p>
												</div>
											</div>

											<div className="h-px bg-gray-100 my-4" />

											<div className="flex items-start justify-between gap-4">
												<div className="flex flex-col">
													<div className="text-label">관심사</div>
													<p className="text-value">
														{match.tester.interests &&
														match.tester.interests.length > 0
															? match.tester.interests
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

												<div className="flex flex-col items-end">
													<div className="text-label">사용 기기</div>
													<p className="text-value">
														{match.tester.device
															? deviceOptions.find(
																	(opt) => opt.key === match.tester.device
															  )?.label || match.tester.device
															: "-"}
													</p>
												</div>
											</div>
											{match.tester.snsURL?.trim() ? (
												<>
													{" "}
													<div className="h-px bg-gray-100 my-4" />
													<div className="flex flex-col items-start">
														<div className="text-label">소셜 미디어</div>
														<p className="text-value">
															{match.tester.snsURL || "-"}
														</p>
													</div>
												</>
											) : null}
											{match.status !== MatchState.doneTest && (
												<>
													{(() => {
														const now = new Date();
														const testStart = new Date(
															`${match.testDate}T${match.testTime}:00`
														);
														const isBeforeTest = now < testStart;
														const hasReview = !!match.review;

														if (isBeforeTest) {
															return (
																<>
																	<div className="flex flex-wrap gap-1 rounded-[16px] items-start p-5 bg-gray-50">
																		<p className="text-value">
																			📌 TesterMatch는 결제 서비스를 제공하지
																			않습니다.
																		</p>
																		<p className="text-sm">
																			1. 모든 테스트는 온라인으로 진행하며,
																			필요한 준비사항은 사전에 이메일로 안내해
																			주세요.
																		</p>
																		<p className="text-sm">
																			2. 보상은 사전 협의 하고 약속한 일정에
																			지급해 주세요.
																		</p>
																		<p className="text-sm">
																			3. 테스트 녹화가 필요한 경우, 반드시
																			사전에 테스터의 동의를 받으시고, 녹화본은
																			테스트 분석 외의 용도로는 사용하실 수
																			없습니다.
																		</p>
																	</div>
																	<div className="grid gap-2 pt-2 pb-1 grid-cols-1 md:grid-cols-2">
																		<Button
																			type="tertiary"
																			size="md"
																			onClick={() =>
																				updateStatus(
																					index,
																					MatchState.makerCancel
																				)
																			}
																			className="w-full md:max-w-[400px]">
																			취소
																		</Button>
																		<Button
																			type="primary"
																			size="md"
																			onClick={() =>
																				handleCalendar(
																					currentTest.testName,
																					currentTest.description,
																					"online",
																					match.testDate,
																					match.testTime
																				)
																			}
																			className="w-full md:max-w-[400px]">
																			캘린더에 추가
																		</Button>
																	</div>
																</>
															);
														}

														if (!hasReview) {
															return (
																<div className="grid gap-2 pt-2 pb-1 grid-cols-1">
																	<Button
																		type="primary"
																		size="md"
																		onClick={() => handleReview(match.matchId)}
																		className="w-full md:max-w-[400px]">
																		리뷰 남기기
																	</Button>
																</div>
															);
														} else {
															return (
																<div className="grid gap-2 pt-2 pb-1 grid-cols-1">
																	<Button
																		type="secondary"
																		size="md"
																		onClick={() =>
																			updateStatus(index, MatchState.doneTest)
																		}
																		className="w-full md:max-w-[400px]">
																		완료하기
																	</Button>
																</div>
															);
														}

														return null;
													})()}
												</>
											)}
										</li>
									))}
							</ul>
						)}
					</div>
				</div>
			</div>
			<Footer />
		</div>
	);
}
