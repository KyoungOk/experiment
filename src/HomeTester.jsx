import React from "react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import TesterHeader from "./components/TesterHeader";
import Footer from "./components/Footer";
import Button from "./components/Button";
import formatTestDate, { formatSingleDate } from "./helper/formatTestDate";
import {
	addToGoogleCalendar,
	downloadIcsFile,
	isGoogleEmail,
} from "./helper/calendarManager";
import { TesterListViewModel } from "./hooks/TesterListViewModel";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { MatchState, matchTesterStatusMap } from "./constants/MatchState";
import {
	interestOptions,
	jobOptions,
	ageOptions,
	deviceOptions,
} from ".//constants/options";
export default function HomeTester() {
	const navigate = useNavigate();
	const userLanguage = navigator.language || "ko";
	const [user, setUser] = useState(null);
	const {
		userTests,
		ingTests,
		progressTests,
		loading,
		handleInterest,
		updateMatchStatus,
		isTester,
	} = TesterListViewModel();

	const handleReview = async (matchId) => {
		navigate("/review?matchId=" + matchId);
	};

	const handleCalendar = async (
		title,
		details,
		location,
		testDate,
		testTime,
		email
	) => {
		const startTime = new Date(`${testDate}T${testTime}:00`);
		// 2. 종료 시간 = 시작 시간 + 1시간
		const endTime = new Date(startTime.getTime() + 60 * 60 * 1000);
		if (isGoogleEmail(email)) {
			await addToGoogleCalendar(title, details, location, startTime, endTime);
		} else {
			await downloadIcsFile(title, details, location, startTime, endTime);
		}
	};

	useEffect(() => {
		const unsubscribe = onAuthStateChanged(getAuth(), async (user) => {
			setUser(user); // ✅ 필요하면 여전히 setUser 가능
			if (!user) {
				navigate("/signup?role=maker");
				return;
			}
			const tester = await isTester(user.uid);
			if (!tester) {
				navigate("/signup?role=tester");
			}
		});

		return () => unsubscribe();
	}, [navigate]);
	return (
		<div className="flex min-h-screen flex-col bg-gray-100">
			<TesterHeader />
			<div className="w-full pt-5 md:pt-10 pb-20 px-[10px]">
				<div className="flex flex-col md:flex-row gap-10 pb-4 justify-center item-center">
					{/* 진행중인 테스트 */}
					<div className="w-full max-w-card">
						<div className="text-sectionTitle pb-3">참여 예정인 테스트</div>
						{loading ? (
							<div className="p-5 rounded-[16px] bg-white space-y-3">
								<div className="flex text-guide item-center justify-center">
									불러오는 중...
								</div>
							</div>
						) : ingTests.length === 0 ? (
							<div className="p-5 rounded-[16px] bg-white space-y-3">
								<div className="flex text-guide item-center justify-center">
									진행중인 테스트가 없습니다
								</div>
							</div>
						) : (
							<ul className="space-y-3 ">
								{ingTests.map((ingTest) => (
									<li
										key={ingTest.test.id}
										className="p-7 rounded-[16px] bg-white space-y-2">
										<div className="flex items-center gap-2 mb-8">
											<div
												className={`w-3 h-3 rounded-full ${
													matchTesterStatusMap[ingTest.status].color
												}`}
											/>
											<p className="text-base font-semibold text-black">
												{matchTesterStatusMap[ingTest.status].label}
											</p>
										</div>
										<div className="flex items-start justify-between gap-4">
											<div className="flex flex-col flex-1">
												<div className="text-label">테스트명</div>
												<div className="text-valueTitle">
													{ingTest.test.testName || "제목 없음"}
												</div>
											</div>
											<div className="flex flex-col items-end w-[70px]">
												<p className="text-label">보상금액</p>
												<p className="text-valueTitle">
													{ingTest.test.reward || "-"}
												</p>
											</div>
										</div>

										<div className="h-px bg-gray-100 my-4" />
										<div className="flex flex-wrap gap-4 mt-1 items-start">
											<div className="flex flex-col flex-1">
												<p className="text-label">테스트 일자</p>
												<p className="text-value">
													{formatSingleDate(ingTest.testDate, userLanguage)}
												</p>
											</div>
											<div className="flex flex-col flex-1">
												<p className="text-label">테스트 시간</p>
												<p className="text-value">{ingTest.testTime || "-"}</p>
											</div>
											<div className="flex flex-col items-end w-[70px]">
												<p className="text-label">소요시간</p>
												<p className="text-value">
													{ingTest.test.duration || "-"}
												</p>
											</div>
										</div>
										{/* 업체명 이메일 */}
										<div className="h-px bg-gray-100 my-4" />
										<div className="flex flex-wrap gap-4 mt-1 items-start">
											<div className="flex flex-col flex-1">
												<p className="text-label">업체명</p>
												<p className="text-value">
													{ingTest.maker.companyName || "-"}
												</p>
											</div>
											<div className="flex flex-col items-end w-[70px]">
												<p className="text-label">연락처</p>
												<p className="text-value">
													{ingTest.maker.email || "-"}
												</p>
											</div>
										</div>

										{/* 홈페이지 */}

										{ingTest.maker.homepage?.trim() ? (
											<>
												<div className="h-px bg-gray-100 my-4" />
												<div className="flex flex-wrap gap-4 mt-1 items-start">
													<div className="flex flex-col flex-1">
														<p className="text-label">회사 홈페이지</p>
														<a
															href={ingTest.maker.homepage}
															target="_blank"
															rel="noopener noreferrer"
															className="text-value text-black underline">
															{ingTest.maker.homepage}
														</a>{" "}
													</div>
												</div>
											</>
										) : null}
										<div className="h-px bg-gray-100 my-4" />
										<p className="text-sm text-gray-600">
											{ingTest.test.description || "설명이 없습니다."}
										</p>

										{(() => {
											const testDateTime = new Date(
												`${ingTest.testDate}T${ingTest.testTime}`
											);
											const isPast = new Date() > testDateTime;

											if (isPast) {
												return (
													<div className="flex gap-1 md:flex-row gap-2 pt-2 items-end justify-end">
														{ingTest.review ? (
															<Button
																type="tertiary"
																size="md"
																onClick={() =>
																	updateMatchStatus(
																		ingTest.id,
																		MatchState.testerDone,
																		ingTest.test.testName,
																		ingTest.maker.email
																	)
																}
																className="w-1/2 md:max-w-[400px]">
																완료
															</Button>
														) : (
															<Button
																type="primary"
																size="md"
																onClick={() => handleReview(ingTest.id)}
																className="w-1/2 md:max-w-[400px]">
																리뷰 남기기
															</Button>
														)}
													</div>
												);
											} else {
												return (
													<>
														<div className="flex flex-wrap gap-1 rounded-[16px] items-start p-5 bg-gray-50">
															<p className="text-value">
																📌 TesterMatch는 보상 및 결제에 관여하지
																않습니다.{" "}
															</p>
															<p className="text-sm">
																1. 모든 테스트는 온라인으로 진행하는 것을
																추천드려요.
															</p>
															<p className="text-sm">
																2. TesterMatch에서는 결제를 지원하지 않아요.
																테스트 보상과 지불 방식은 기업과 미리 꼭 협의해
																주세요.
															</p>
															<p className="text-sm">
																3. 안전한 방법으로 참여하시고, 중요한 대화나
																테스트 내용을 기록해 두는 걸 추천드려요.
															</p>
														</div>
														<div className="flex gap-1 md:flex-row gap-2 pt-2 items-end justify-end">
															<Button
																type="tertiary"
																size="md"
																onClick={() =>
																	updateMatchStatus(
																		ingTest.id,
																		MatchState.testerCancel,
																		ingTest.test.testName,
																		ingTest.maker.email
																	)
																}
																className="w-1/2 md:max-w-[400px]">
																취소
															</Button>
															<Button
																type="tertiary"
																size="md"
																onClick={() =>
																	handleCalendar(
																		ingTest.test.testName,
																		ingTest.test.description,
																		"online",
																		ingTest.testDate,
																		ingTest.testTime,
																		ingTest.maker.email
																	)
																}
																className="w-1/2 md:max-w-[400px]">
																캘린더에 추가
															</Button>
														</div>
													</>
												);
											}
										})()}
									</li>
								))}
							</ul>
						)}
					</div>
					{/* 요청받은 테스트 */}
					<div className="w-full max-w-card ">
						<div className="text-sectionTitle pb-3">요청 받은 테스트</div>
						{loading ? (
							<div className="p-5 rounded-[16px] bg-white space-y-3">
								<div className="flex text-guide item-center justify-center">
									불러오는 중...
								</div>
							</div>
						) : progressTests.length === 0 ? (
							<div className="p-5 rounded-[16px] bg-white space-y-3">
								<div className="flex text-guide item-center justify-center">
									요청받은 테스트가 없습니다
								</div>
							</div>
						) : (
							<ul className="space-y-3 ">
								{progressTests.map((progressTest) => (
									<li
										key={progressTest.test.id}
										className="p-7 rounded-[16px] bg-white space-y-2">
										<div className="flex items-center gap-2 mb-8">
											<div
												className={`w-3 h-3 rounded-full ${
													matchTesterStatusMap[progressTest.status].color
												}`}
											/>
											<p className="text-base font-semibold text-black">
												{matchTesterStatusMap[progressTest.status].label}
											</p>
										</div>
										<div className="flex items-start justify-between gap-4">
											<div className="flex flex-col flex-1">
												<div className="text-label">테스트명</div>
												<div className="text-valueTitle">
													{progressTest.test.testName || "제목 없음"}
												</div>
											</div>
											<div className="flex flex-col items-end w-[70px]">
												<p className="text-label">보상금액</p>
												<p className="text-valueTitle">
													{progressTest.test.reward || "-"}
												</p>
											</div>
										</div>

										<div className="h-px bg-gray-100" />
										<div className="flex flex-wrap gap-4 mt-1 items-start">
											<div className="flex flex-col flex-1">
												<p className="text-label">테스트 일정</p>
												<p className="text-value">
													{formatSingleDate(
														progressTest.testDate,
														userLanguage
													)}
												</p>
											</div>
											<div className="flex flex-col flex-1">
												<p className="text-label">테스트 시간</p>
												<p className="text-value">
													{progressTest.testTime || "-"}
												</p>
											</div>
											<div className="flex flex-col items-end w-[70px]">
												<p className="text-label">소요시간</p>
												<p className="text-value">
													{progressTest.test.duration || "-"}
												</p>
											</div>
										</div>
										{/* 업체명 이메일 */}
										<div className="h-px bg-gray-100" />
										<div className="flex flex-wrap gap-4 mt-1 items-start">
											<div className="flex flex-col flex-1">
												<p className="text-label">업체명</p>
												<p className="text-value">
													{progressTest.maker.companyName || "-"}
												</p>
											</div>
											<div className="flex flex-col items-end w-[70px]">
												<p className="text-label">연락처</p>
												<p className="text-value">
													{progressTest.maker.email || "-"}
												</p>
											</div>
										</div>
										{/* 홈페이지 */}

										{progressTest.maker.homepage?.trim() ? (
											<>
												<div className="h-px bg-gray-100 my-4" />
												<div className="flex flex-wrap gap-4 mt-1 items-start">
													<div className="flex flex-col flex-1">
														<p className="text-label">회사 홈페이지</p>
														<a
															href={progressTest.maker.homepage}
															target="_blank"
															rel="noopener noreferrer"
															className="text-value text-black underline">
															{progressTest.maker.homepage}
														</a>{" "}
													</div>
												</div>
											</>
										) : null}

										{/* 테스트 설명 */}
										<div className="h-px bg-gray-100" />
										<p className="text-sm text-gray-600">
											{progressTest.test.description || "설명이 없습니다."}
										</p>
										{/* 버튼 */}
										<div className="flex gap-1 md:flex-row gap-2 pt-2 items-end justify-end">
											<Button
												type="tertiary"
												size="md"
												onClick={() =>
													updateMatchStatus(
														progressTest.id,
														MatchState.testerCancel,
														progressTest.test.testName,
														progressTest.maker.email
													)
												}
												className="w-1/2 md:max-w-[400px]">
												취소
											</Button>
											<Button
												type="secondary"
												size="md"
												onClick={() =>
													updateMatchStatus(
														progressTest.id,
														MatchState.testerAccept,
														progressTest.test.testName,
														progressTest.maker.email
													)
												}
												className="w-1/2 md:max-w-[400px]">
												확정하기
											</Button>
										</div>
									</li>
								))}
							</ul>
						)}
					</div>
					{/* 새로 추가된 테스트 */}
					<div className="w-full max-w-card">
						<div className="text-sectionTitle pb-3">신규 테스트</div>

						{loading ? (
							<div className="p-5 rounded-[16px] bg-white space-y-3">
								<div className="flex text-guide item-center justify-center">
									불러오는 중...
								</div>
							</div>
						) : userTests.length === 0 ? (
							<div className="p-5 rounded-[16px] bg-white space-y-3">
								<div className="flex text-guide item-center justify-center">
									새로 추가된 테스트가 없습니다.
								</div>
							</div>
						) : (
							<ul className="space-y-3">
								{userTests.map((test) => (
									<li
										key={test.id}
										className="p-7 rounded-[16px] bg-white space-y-2">
										<div className="flex items-start justify-between gap-4">
											<div className="flex flex-col flex-1">
												<div className="text-label">테스트명</div>
												<div className="text-valueTitle">
													{test.testName || "제목 없음"}
												</div>
											</div>
											<div className="flex flex-col items-end w-[70px]">
												<p className="text-label">보상금액</p>
												<p className="text-valueTitle">{test.reward || "-"}</p>
											</div>
										</div>

										<div className="h-px bg-gray-100 my-4" />
										<div className="flex flex-wrap gap-4 mt-1 items-start">
											<div className="flex flex-col flex-1">
												<p className="text-label">일정</p>
												<p className="text-value min-w-[100px]">
													{formatTestDate(
														test.startDate,
														test.endDate,
														userLanguage
													)}
												</p>
											</div>
											<div className="flex flex-col items-end w-[70px]">
												<p className="text-label">소요시간</p>
												<p className="text-value">{test.duration || "-"}</p>
											</div>
										</div>

										<div className="h-px bg-gray-100 my-4" />
										<div className="flex flex-wrap gap-4 mt-1 items-start">
											<div className="flex flex-col flex-1">
												<p className="text-label">테스터 연령대</p>
												<p className="text-value">
													{test.ages?.length === ageOptions.length
														? "제한 없음"
														: test.ages
																?.map((key) => {
																	const found = ageOptions.find(
																		(opt) => opt.key === key
																	);
																	return found ? found.label : key;
																})
																.join(", ") || "-"}
												</p>
											</div>
											<div className="flex flex-col items-end w-max-[90px]">
												<p className="text-label">디바이스</p>
												<p className="text-value">
													{test.devices?.length === deviceOptions.length
														? "제한 없음"
														: test.devices
																?.map(
																	(key) =>
																		deviceOptions.find((opt) => opt.key === key)
																			?.label
																)
																.filter(Boolean)
																.join(", ") || ""}
												</p>
											</div>
										</div>

										<div className="h-px bg-gray-100 my-4" />
										<p className="text-sm text-gray-600">
											{test.description || "설명이 없습니다."}
										</p>

										<div className="flex flex-col md:flex-row items-center justify-center">
											{test.matchStatus === MatchState.testerInterest ? (
												<p className="w-full flex text-[13px] text-gray-500 items-center justify-center rounded-[12px] h-[48px] bg-gray-50">
													업체에서 내 프로필을 검토중입니다.
												</p>
											) : test.matchStatus === MatchState.testerCancel ? (
												<p className="w-full flex text-[13px] text-gray-400 items-center justify-center rounded-[12px] h-[48px] bg-gray-100">
													내가 취소한 테스트입니다.
												</p>
											) : (
												<Button
													type="primary"
													size="md"
													onClick={() =>
														handleInterest(
															test.id,
															test.makerId,
															MatchState.testerInterest,
															test.testName,
															test.makerEmail
														)
													}
													className="w-1/2 md:max-w-[400px]">
													테스터 신청하기
												</Button>
											)}
										</div>
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
