import React from "react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import CommonHeader from "./components/CommonHeader";
import Footer from "./components/Footer";
import Button from "./components/Button";
import formatTestDate from "./helper/formatTestDate";
import { db } from "./firebase";
import {
	getFirestore,
	collection,
	addDoc,
	query,
	getDocs,
} from "firebase/firestore";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { MatchState } from "./constants/MatchState";

export default function HomeTester() {
	const navigate = useNavigate();
	const [userTests, setUserTests] = useState([]);
	const [loading, setLoading] = useState(true);
	const userLanguage = navigator.language || "ko";
	const handleInterest = async (testId) => {
		try {
			const auth = getAuth();
			const user = auth.currentUser;

			if (!user) {
				console.error("로그인한 사용자가 없습니다.");
				return;
			}

			const testerId = user.uid;
			const db = getFirestore();

			await addDoc(collection(db, "matches"), {
				testId,
				testerId,
				status: MatchState.testerInterest,
				createdAt: new Date(),
			});

			console.log("관심 등록 완료");
		} catch (error) {
			console.error("관심 등록 중 오류:", error);
		}
	};

	useEffect(() => {
		const auth = getAuth();
		const unsubscribe = onAuthStateChanged(auth, async (user) => {
			if (!user) return;

			setLoading(true);
			try {
				const q = query(collection(db, "tests"));
				const querySnapshot = await getDocs(q);

				const testList = querySnapshot.docs.map((doc) => ({
					id: doc.id,
					...doc.data(),
				}));

				setUserTests(testList);
			} catch (error) {
				console.error("Error fetching tests:", error);
			} finally {
				setLoading(false);
			}
		});

		return () => unsubscribe();
	}, []);

	return (
		<div className="min-h-screen flex flex-col bg-gray-100">
			<CommonHeader />
			<div className="w-full pt-6 pb-10 px-[10px] md:px-[var(--side-padding)]">
				<div className="flex flex-col md:flex-row gap-5">
					{/* 진행중인 테스트 */}
					<div className="w-full max-w-[600px]  pb-4">
						{loading ? (
							<p>불러오는 중...</p>
						) : userTests.length === 0 ? (
							<p>아직 만든 테스트가 없습니다.</p>
						) : (
							<ul className="space-y-1 ">
								<div className="text-sectionTitle pl-4 pb-1">
									진행중인 테스트
								</div>
								{userTests.map((test) => (
									<li
										key={test.id}
										className="p-7 rounded-[16px] bg-white space-y-3">
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
											{/* 테스터 조건 - 나머지 전체 너비 차지 */}
											<div className="flex flex-col flex-1">
												<p className="text-label">테스터 연령대</p>
												<p className="text-value">
													{test.ages?.join(", ") || ""}{" "}
												</p>
											</div>
											<div className="flex flex-col items-end w-[70px]">
												<p className="text-label">테스터 기기</p>
												<p className="text-value">
													{test.devices?.join(", ") || ""}
												</p>
											</div>
										</div>

										<div className="h-px bg-gray-100 my-4" />
										<p className="text-sm text-gray-600">
											{test.description || "설명이 없습니다."}
										</p>

										<div className="flex gap-1 md:flex-row items-end justify-end">
											<Button
												type="secondary"
												size="sm"
												onClick={() => handleInterest(test.id)}
												className="w-1/2">
												관심있음
											</Button>
										</div>
									</li>
								))}
							</ul>
						)}
					</div>
					{/* 요청받은 테스트 */}
					<div className="w-full max-w-[600px]  pb-4">
						{loading ? (
							<p>불러오는 중...</p>
						) : userTests.length === 0 ? (
							<p>아직 만든 테스트가 없습니다.</p>
						) : (
							<ul className="space-y-1 ">
								<div className="text-sectionTitle pl-4 pb-1">
									요청받은 테스트
								</div>
								{userTests.map((test) => (
									<li
										key={test.id}
										className="p-7 rounded-[16px] bg-white space-y-3">
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
											{/* 테스터 조건 - 나머지 전체 너비 차지 */}
											<div className="flex flex-col flex-1">
												<p className="text-label">테스터 연령대</p>
												<p className="text-value">
													{test.ages?.join(", ") || ""}{" "}
												</p>
											</div>
											<div className="flex flex-col items-end w-[70px]">
												<p className="text-label">테스터 기기</p>
												<p className="text-value">
													{test.devices?.join(", ") || ""}
												</p>
											</div>
										</div>

										<div className="h-px bg-gray-100 my-4" />
										<p className="text-sm text-gray-600">
											{test.description || "설명이 없습니다."}
										</p>
										<div className="flex flex-col md:flex-row items-end justify-end">
											<Button
												type="secondary"
												size="sm"
												onClick={() => handleInterest(test.id)}
												className="w-1/2">
												관심있음
											</Button>
										</div>
									</li>
								))}
							</ul>
						)}
					</div>
					{/* 새로 추가된 테스트 */}
					<div className="w-full max-w-[600px] pb-4">
						{loading ? (
							<p>불러오는 중...</p>
						) : userTests.length === 0 ? (
							<p>아직 만든 테스트가 없습니다.</p>
						) : (
							<ul className="space-y-1 ">
								<div className="text-sectionTitle pl-4 pb-1">
									새로 추가된 테스트
								</div>
								{userTests.map((test) => (
									<li
										key={test.id}
										className="p-7 rounded-[16px] bg-white space-y-3">
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
											{/* 테스터 조건 - 나머지 전체 너비 차지 */}
											<div className="flex flex-col flex-1">
												<p className="text-label">테스터 연령대</p>
												<p className="text-value">
													{test.ages?.join(", ") || ""}{" "}
												</p>
											</div>
											<div className="flex flex-col items-end w-[70px]">
												<p className="text-label">테스터 기기</p>
												<p className="text-value">
													{test.devices?.join(", ") || ""}
												</p>
											</div>
										</div>

										<div className="h-px bg-gray-100 my-4" />
										<p className="text-sm text-gray-600">
											{test.description || "설명이 없습니다."}
										</p>

										<div className="flex flex-col md:flex-row items-end justify-end">
											<Button
												type="secondary"
												size="sm"
												onClick={() => handleInterest(test.id)}
												className="w-1/2 md:max-w-[400px]">
												관심있음
											</Button>
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
