// src/components/CommonHeader.jsx
import React from "react";

export default function CommonHeader() {
	return (
		<>
			<div className="sticky top-0 z-50 bg-white border-b border-gray-200">
				{/* Logo */}
				<div className="ml-[var(--side-padding)] flex flex-col gap-2 text-black pt-5 pb-4 md:pt-8 md:pb-5 ">
					<img
						src="/icons/Logo.png"
						alt="Logo"
						className="w-[74px] md:w-[100px] object-contain"
					/>
					<div className="w-4 h-0 outline outline-[2px] outline-offset-[-1px] outline-black" />
				</div>
			</div>
		</>
	);
}
