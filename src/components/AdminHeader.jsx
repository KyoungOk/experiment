import React from "react";
import { useEffect, useState } from "react";
import { getAuth, onAuthStateChanged, signOut } from "firebase/auth";
import { useNavigate } from "react-router-dom";

export default function AdminHeader() {
	const [user, setUser] = useState(null);
	const navigate = useNavigate();
	useEffect(() => {
		const unsubscribe = onAuthStateChanged(getAuth(), setUser);
		return () => unsubscribe();
	}, []);
	const handleLogout = async () => {
		const auth = getAuth();

		try {
			await signOut(auth);
			navigate("/signupAdmin");
			console.log("로그아웃되었습니다.");
			// 필요하다면 리디렉션 or 상태 초기화
			// 예: navigate("/login") 또는 setUser(null)
		} catch (error) {
			console.error("로그아웃 실패:", error);
		}
	};
	return (
		<>
			<div className="sticky top-0 z-50 bg-white border-b border-gray-200">
				<div className="flex items-center justify-between px-[20px] md:px-[var(--side-padding)] pt-5 pb-4 md:pt-8 md:pb-5 text-black">
					{/* Logo */}
					<img
						src="/icons/Logo.png"
						alt="Logo"
						className="w-[74px] md:w-[100px] object-contain"
					/>

					<p
						onClick={handleLogout}
						className="text-value text-red-500 hover:underline cursor-pointer  text-center">
						로그아웃
					</p>
				</div>
			</div>
		</>
	);
}
