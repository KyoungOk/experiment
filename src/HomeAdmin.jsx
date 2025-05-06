import React from "react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Footer from "./components/Footer";
import Button from "./components/Button";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import createEmailContent, { handleEmailNoti } from "./helper/emailTemplates";
import {
	getAdmin,
	subscribeMakers,
	updateApprove,
} from "./repositories/adminRepository";
import AdminHeader from "./components/AdminHeader";
import {
	MatchState,
	matchStatusMap,
	ongoingStates,
	editableStates,
} from "./constants/MatchState";

export default function HomeAdmin() {
	const navigate = useNavigate();
	const userLanguage = navigator.language || "ko";
	const [user, setUser] = useState(null);
	const [makers, setMakers] = useState([]);
	const [admin, setAdmin] = useState(null);
	const [loading, setLoading] = useState();

	const handleToggleApproval = async (maker) => {
		const newApproved = !maker.approved;
		if (newApproved) {
			handleEmailNoti(MatchState.makerApproved, "homeMaker", "", maker.email);
		}
		await updateApprove(maker.id, newApproved);

		setMakers((prev) =>
			prev.map((m) => (m.id === maker.id ? { ...m, approved: newApproved } : m))
		);
	};

	useEffect(() => {
		const unsubscribe = onAuthStateChanged(getAuth(), async (user) => {
			if (!user) {
				navigate("/signupAdmin");
				return;
			}
			setLoading(true);
			const admin = await getAdmin(user.uid);

			if (admin === null) {
				navigate("/signupAdmin");
			} else {
				setAdmin(admin);
			}
			const unsubscribe = subscribeMakers((data) => {
				setMakers(data);
				setLoading(false);
			});
		});

		return () => unsubscribe();
	}, [navigate]);

	return (
		<div className="min-h-screen flex flex-col bg-gray-100">
			<AdminHeader />
			<div className="w-full py-20 px-[10px] md:px-[var(--side-padding)]">
				<div className="flex flex-col md:flex-row gap-4 md:gap-10">
					{/* 테스트 목록 */}
					<div className="w-full max-w-card pb-4">
						{loading ? (
							<div className="p-7 rounded-[16px] bg-white space-y-3">
								<div className="flex text-value item-center justify-center">
									불러오는중...
								</div>
							</div>
						) : makers?.length === 0 ? (
							<div className="p-7 rounded-[16px] bg-white space-y-3">
								<div className="flex text-value item-center justify-center">
									내가 만든 테스트가 없습니다
								</div>
							</div>
						) : (
							<div className="flex flex-col gap-2">
								{/* 타이틀 */}
								<div className="hidden md:flex px-7 py-4 rounded-[10px] bg-white space-y-1">
									<div className="flex items-start justify-between">
										<div className="text-[14px]">
											진행중인 테스트 {makers?.length}개
										</div>
									</div>
								</div>
								<div className="space-y-2">
									{makers.map((maker) => (
										<ul>
											<li
												key={maker.id}
												className="p-7 rounded-[10px] bg-white space-y-2">
												<div className="flex items-start justify-between gap-4">
													<div className="flex flex-col flex-1">
														<div className="text-label">회사명</div>
														<h3 className="text-value">
															{maker.companyName || "제목 없음"}
														</h3>
													</div>
													<div className="flex flex-col items-end">
														<p className="text-label">담당자명</p>
														<p className="text-value">{maker.name || "-"}</p>
													</div>
												</div>
												<div className="h-px bg-gray-100 my-4" />
												<div className="flex items-start justify-between gap-4">
													<div className="flex flex-col flex-1">
														<div className="text-label">이메일</div>
														<h3 className="text-value">
															{maker.email || "제목 없음"}
														</h3>
													</div>
												</div>
												<div className="h-px bg-gray-100 my-4" />

												{/* 홈페이지 */}
												<div className="flex flex-col flex-1">
													<div className="text-label">홈페이지</div>
													{maker.homepage ? (
														<a
															href={maker.homepage}
															target="_blank"
															rel="noopener noreferrer"
															className="text-value underline text-black hover:text-black">
															{maker.homepage}
														</a>
													) : (
														<p className="text-value text-gray-500">
															제목 없음
														</p>
													)}
												</div>

												{/* 승인 토글 (오른쪽 정렬) */}
												<div className="flex justify-end pt-2">
													<button
														onClick={() => handleToggleApproval(maker)}
														className={`px-6 py-2 rounded-full text-value transition-colors duration-300 ${
															maker.approved
																? "bg-green-500 text-white hover:bg-green-600"
																: "bg-gray-100 text-gray-800 hover:bg-gray-200"
														}`}>
														{maker.approved ? "승인" : "미승인"}
													</button>
												</div>
											</li>
										</ul>
									))}
								</div>
							</div>
						)}
					</div>
				</div>
			</div>
			<Footer />
		</div>
	);
}
