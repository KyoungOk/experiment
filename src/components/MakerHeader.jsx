import React from "react";
import { useEffect, useState } from "react";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { MakerListViewModel } from "../hooks/MakerListViewModel";
import { useNavigate } from "react-router-dom";

export default function MakerHeader() {
	const [maker, setMaker] = useState(null);
	const { getMaker } = MakerListViewModel();
	const [user, setUser] = useState(null);
	const navigate = useNavigate();
	useEffect(() => {
		const unsubscribe = onAuthStateChanged(getAuth(), setUser);
		return () => unsubscribe();
	}, []);

	useEffect(() => {
		const loadTester = async () => {
			if (!user) return;

			const maker = await getMaker(user.uid);
			setMaker(maker);
		};

		loadTester();
	}, [user]);
	const handleTesterClick = (tester) => {
		// 원하는 동작 실행: 상세 보기, 모달 열기, 페이지 이동 등
		navigate("/profileMaker"); // tester가 아니라면 리디렉션
	};
	const handleLogoClick = (tester) => {
		// 원하는 동작 실행: 상세 보기, 모달 열기, 페이지 이동 등
		navigate("/homeMaker"); // tester가 아니라면 리디렉션
	};
	return (
		<>
			<div className="sticky top-0 z-50 bg-white border-b border-gray-100">
				<div className="flex items-center justify-between px-[20px] md:px-[var(--side-padding)] pt-5 pb-4 md:pt-8 md:pb-5 text-black">
					{/* Logo */}
					<img
						src="/icons/Logo.png"
						alt="Logo"
						className="w-[74px] md:w-[100px] object-contain"
						onClick={() => handleLogoClick()}
					/>
					<div
						className="text-valueTitle cursor-pointer hover:underline"
						onClick={() => handleTesterClick(maker)}>
						<div className="text-valueTitle">{maker?.name || ""}</div>
					</div>
				</div>
			</div>
		</>
	);
}
