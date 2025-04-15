// src/components/Footer.jsx
import React from "react";

// components/Footer.jsx
export default function Footer() {
	return (
		<>
			{/* 데스크탑: fixed */}
			<footer className="hidden md:flex fixed bottom-0 left-0 w-full bg-white text-black text-sm py-3 px-6 z-50 justify-between items-center border-t border-gray-200">
				<span>&copy; 2025 Genau Factory.</span>
				<span>Privacy · Terms</span>
			</footer>

			{/* 모바일: 일반 footer */}
			<footer className="block md:hidden w-full bg-white text-black text-sm py-4 px-6 border-t border-gray-200 relative z-10">
				<div className="flex justify-between items-center">
					<span>2025 Genau Factory</span>
					<span>Privacy · Terms</span>
				</div>
			</footer>
		</>
	);
}
