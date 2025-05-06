// src/components/Footer.jsx
import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
// components/Footer.jsx
export default function Footer() {
	const navigate = useNavigate();
	return (
		<>
			{/* 데스크탑: fixed */}
			<footer className="hidden md:flex fixed bottom-0 left-0 w-full bg-white text-black text-xs py-3 px-6 z-50 border-t border-gray-200 justify-between items-center">
				<span>&copy; 2025 Genau Factory.</span>
				<div className="flex items-center space-x-2 text-xs text-black ml-auto">
					<a href="/privacy" className="hover:underline">
						Privacy
					</a>
					<span>·</span>
					<a href="/terms" className="hover:underline">
						Terms
					</a>
				</div>
			</footer>

			{/* 모바일: 일반 footer */}
			<footer className="block md:hidden w-full bg-white text-black text-xs py-4 px-6 border-t border-gray-200 relative z-10">
				<div className="flex justify-between items-center">
					<span>2025 Genau Factory</span>
					<div className="flex items-center space-x-2 text-xs text-black ml-auto">
						<a href="/privacy" className="hover:underline">
							Privacy
						</a>
						<span>·</span>
						<a href="/terms" className="hover:underline">
							Terms
						</a>
					</div>
				</div>
			</footer>
		</>
	);
}
