import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import OnboardingHeader from "./components/OnboardingHeader";
import Footer from "./components/Footer";
import Button from "./components/Button";
import Input from "./components/Input";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { getMatch, saveReview, loading } from "./hooks/ReviewModel";
import formatTestDate, { formatSingleDate } from "./helper/formatTestDate";

export default function Review() {
	const [match, setMatch] = useState(null);
	const [user, setUser] = useState(null);
	const navigate = useNavigate();
	const location = useLocation();
	const params = new URLSearchParams(location.search);
	const matchId = params.get("matchId");
	const [rating, setRating] = useState();
	const [comment, setComment] = useState("");
	const userLanguage = navigator.language || "ko";

	useEffect(() => {
		const auth = getAuth();
		const unsubscribe = onAuthStateChanged(auth, async (user) => {
			if (user) {
				setUser(user); // 상태로 저장 (필요하면)
				const data = await getMatch(matchId);
				setMatch(data);
			}
		});
		// cleanup
		return () => unsubscribe();
	}, []);

	const handleSubmit = async (e) => {
		e.preventDefault();
		let reviewee_id = null;
		let reviewer_id = null;

		if (match?.role === "tester") {
			reviewee_id = match.maker.id;
			reviewer_id = match.tester.id;
		} else {
			reviewee_id = match.tester.id;
			reviewer_id = match.maker.id;
		}
		console.log("reviewee_id", reviewee_id);
		console.log("reviewer_id", reviewer_id);
		console.log("matchId", matchId);
		try {
			await saveReview(reviewee_id, reviewer_id, rating, comment, matchId);
			navigate("/success?role=" + match?.role);
		} catch (error) {
			console.error("리뷰 저장 실패:", error);
			// 실패 시 사용자에게 알림 처리 등을 추가해도 좋음
		}
	};

	return (
		<div className="min-h-screen flex flex-col">
			<OnboardingHeader />
			<div className="w-full flex justify-center pt-4">
				<div className="w-full max-w-[600px] px-4 md:px-[var(--side-padding)] flex flex-col gap-4 pt-4 md:items-center md:mt-10">
					<div className="w-full items-start justify-start z-10 mb-2">
						<p className="w-full text-[54px] whitespace-pre-line font-helvetic font-semibold leading-tight tracking-tight">
							Review.
						</p>
					</div>
					{match === null ? (
						<div className="p-5 rounded-[16px] bg-white space-y-3">
							<div className="flex text-guide items-center justify-center">
								불러오는 중...
							</div>
						</div>
					) : (
						<form onSubmit={handleSubmit} className="w-full space-y-2 pb-10">
							{/* 테스트명 */}
							<div>
								<label className="text-label">테스트명</label>
								<p className="text-value">{match.test.testName || ""}</p>
							</div>

							<div className="h-px bg-gray-100 my-4" />

							{/* 테스트 날짜/시간/보상 */}
							<div className="flex items-start justify-between">
								<div>
									<label className="text-label">테스트 날짜</label>
									<p className="text-value">
										{formatSingleDate(match.match.testDate, userLanguage)}
									</p>
								</div>
								<div>
									<label className="text-label">테스트 시간</label>
									<p className="text-value">{match.match.testTime || ""}</p>
								</div>
								<div className="flex flex-col items-end w-[70px]">
									<label className="text-label">보상금액</label>
									<p className="text-value">{match.test.reward || "-"}</p>
								</div>
							</div>

							<div className="h-px bg-gray-100 my-4" />

							{/* 회사 정보 또는 테스터 정보 */}
							<div className="flex items-start justify-between gap-4">
								{match.role === "tester" ? (
									<>
										<div>
											<label className="text-label">회사 이름</label>
											<p className="text-value">
												{match.maker?.companyName || ""}
											</p>
										</div>
										<div className="flex flex-col items-end w-[100px]">
											<label className="text-label">담당자명</label>
											<p className="text-value">{match.maker?.name || ""}</p>
										</div>
									</>
								) : (
									<>
										<div className="flex flex-col">
											<label className="text-label">테스터 이름</label>
											<p className="text-value">{match.tester?.name || ""}</p>
										</div>
										<div className="flex flex-col items-end w-[100px]">
											<label className="text-label">나이</label>
											<p className="text-value">{match.tester?.age || ""}</p>
										</div>
									</>
								)}
							</div>

							<div className="h-px bg-gray-100 my-4" />

							{/* 별점 */}
							<div>
								<label className="text-label">별점 리뷰</label>
								<div className="flex gap-1">
									{[1, 2, 3, 4, 5].map((star) => (
										<button
											key={star}
											type="button"
											onClick={() => setRating(star)}
											className={`text-2xl transition ${
												rating >= star ? "text-yellow-400" : "text-gray-300"
											}`}>
											★
										</button>
									))}
								</div>
							</div>

							<div className="h-px bg-gray-100" />

							{/* 코멘트 */}
							<div className="gap-2">
								<label className="text-label">코멘트</label>
								<textarea
									value={comment}
									onChange={(e) => setComment(e.target.value)}
									className="w-full h-[120px] px-3 py-2 border border-gray-300 rounded-md resize-none text-sm focus:outline-none focus:ring-2 focus:ring-primary"
									placeholder="리뷰를 작성해주세요"
								/>
							</div>

							<Button
								type="primary"
								buttonType="submit"
								size="lg"
								className="w-full">
								리뷰 완료
							</Button>
						</form>
					)}
				</div>
			</div>

			<Footer />
		</div>
	);
}
