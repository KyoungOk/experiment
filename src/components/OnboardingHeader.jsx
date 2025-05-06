// src/components/OnboardingHeader.jsx
import React from "react";

export default function OnboardingHeader() {
	return (
		<>
			{/* 상단 패턴 — 데스크탑 전용 */}
			<div
				className="hidden md:block fixed top-[-350px] left-0 w-full h-full bg-repeat-x z-[-1]"
				style={{
					backgroundImage: "url('/icons/patternTop.svg')",
				}}
			/>

			{/* 💻 데스크탑 전용 패턴 */}
			<div
				className="hidden md:block fixed bottom-0 left-0 w-full h-1/2 bg-repeat-x z-[-1]"
				style={{
					backgroundImage: "url('/icons/patternBottom.svg')",
				}}
			/>

			{/* 📱 모바일 전용 배경 고정 패턴 */}
			<div
				className="block md:hidden fixed inset-0 w-full h-full bg-no-repeat bg-bottom bg-fixed z-[-1]"
				style={{
					backgroundImage: "url('/icons/patternBottomMobile.svg')",
				}}
			/>

			{/* 세로 라인들 */}
			<div className="block absolute top-0 bottom-0 left-[var(--side-padding)] w-[0.5px] bg-black/10 z-1" />
			<div className="hidden md:block absolute top-0 bottom-0 right-[var(--side-padding)] w-[0.5px] bg-black/10 z-1" />
			<div className="hidden md:block absolute top-0 bottom-0 left-[calc((100vw-var(--side-padding)*2)/3+var(--side-padding))] w-[0.5px] bg-black/10 z-1" />
			<div className="hidden md:block absolute top-0 bottom-0 left-[calc((100vw-var(--side-padding)*2)*2/3+var(--side-padding))] w-[0.5px] bg-black/10 z-1" />

			<div className="sticky top-0 z-50 bg-white border-b border-gray-100">
				<div className="flex items-center justify-between px-[20px] md:px-[var(--side-padding)] pt-5 pb-4 md:pt-8 md:pb-5 text-black">
					<a href="/">
						<img
							src="/icons/Logo.png"
							alt="Logo"
							className="w-[74px] md:w-[88px] object-contain"
						/>
					</a>
				</div>
			</div>
		</>
	);
}
