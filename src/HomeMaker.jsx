import React from "react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import CommonHeader from "./components/CommonHeader";
import Footer from "./components/Footer";
import Button from "./components/Button";
import Input from "./components/Input";
import Radio from "./components/Radio";
import { db } from "./firebase";
import { getAuth } from "firebase/auth";
import { collection, query, where, getDocs } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";

export default function HomeMaker() {
	const navigate = useNavigate();
	const [userTests, setUserTests] = useState([]);
	const [loading, setLoading] = useState(true);
	const handleAdd = () => {
		navigate("/addTest");
	};
	useEffect(() => {
		const auth = getAuth();
		const unsubscribe = onAuthStateChanged(auth, async (user) => {
			if (!user) return;

			setLoading(true);
			try {
				const q = query(collection(db, "tests"), where("uid", "==", user.uid));
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
		<div className="min-h-screen flex flex-col bg-gray-50">
			<CommonHeader />
			<div className="relative flex flex-col md:flex-row md:items-center justify-start gap-0 md:gap-[60px] md:px-0 mt-0 ml-[var(--side-padding)] mr-[var(--side-padding)] md:mt-10 mb-0 md:mb-0 z-10">
				<Button
					type="primary"
					size="md"
					onClick={handleAdd}
					className="w-full md:max-w-[400px]">
					테스트 만들기
				</Button>
			</div>

			<div className="w-full max-w-[500px] mt-6 md:mt-10 ml-[var(--side-padding)]">
				{loading ? (
					<p>불러오는 중...</p>
				) : userTests.length === 0 ? (
					<p>아직 만든 테스트가 없습니다.</p>
				) : (
					<ul className="space-y-2 ">
						{userTests.map((test) => (
							<li key={test.id} className="p-8 rounded-lg bg-white space-y-4">
								<div className="flex flex-col">
									<div className="text-label">{test.category || "없음"}</div>
									<h3 className="text-lg font-bold">
										{test.testName || "제목 없음"}
									</h3>
								</div>
								<div className="h-px bg-gray-100 my-4" />
								<div className="flex flex-wrap gap-4 mt-1 items-start">
									<div className="flex flex-col flex-1 min-w-[230px]">
										<p className="text-label">일정</p>
										<p className="text-value min-w-[100px]">
											{test.startDate || ""} - {test.endDate || ""}
										</p>
									</div>
									<div className="flex flex-col w-[70px]">
										<p className="text-label">소요시간</p>
										<p className="text-value">{test.duration || "-"}</p>
									</div>

									<div className="flex flex-col w-[70px]">
										<p className="text-label">보상금액</p>
										<p className="text-value">{test.reward || "-"}</p>
									</div>
								</div>
								<div className="h-px bg-gray-100 my-4" />
								<div className="flex flex-wrap gap-4 mt-1 items-start">
									{/* 테스터 조건 - 나머지 전체 너비 차지 */}
									<div className="flex flex-col flex-1 min-w-[230px]">
										<p className="text-label">테스터 조건</p>
										<p className="text-value">
											{test.ages?.join(", ") || ""}{" "}
											{test.devices?.join(", ") || ""}
										</p>
									</div>

									<div className="flex flex-col w-[70px]">
										<p className="text-label">참가 인원</p>
										<p className="text-value">{test.testerCount || "-"}명</p>
									</div>
								</div>

								<div className="h-px bg-gray-100 my-4" />
								<p className="text-sm text-gray-600">
									{test.description || "설명이 없습니다."}
								</p>
							</li>
						))}
					</ul>
				)}
			</div>

			<Footer />
		</div>
	);
}
