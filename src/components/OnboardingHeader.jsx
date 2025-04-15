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
				className="block md:hidden fixed inset-0 w-full h-full bg-no-repeat bg-bottom bg-fixed z-0"
				style={{
					backgroundImage: "url('/icons/patternBottomMobile.svg')",
				}}
			/>

			{/* 세로 라인들 */}
			<div className="block absolute top-0 bottom-0 left-[var(--side-padding)] w-[0.5px] bg-black/10 z-20" />
			<div className="hidden md:block absolute top-0 bottom-0 right-[var(--side-padding)] w-[0.5px] bg-black/10 z-10" />
			<div className="hidden md:block absolute top-0 bottom-0 left-[calc((100vw-var(--side-padding)*2)/3+var(--side-padding))] w-[0.5px] bg-black/10 z-10" />
			<div className="hidden md:block absolute top-0 bottom-0 left-[calc((100vw-var(--side-padding)*2)*2/3+var(--side-padding))] w-[0.5px] bg-black/10 z-10" />

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

				{/* Navigation Titles */}
				{/* <div className="hidden md:flex relative flex flex-col md:flex-row items-start justify-center md:px-[var(--side-padding)] gap-0 z-10 mt-8">
                    {["How it works", "Testers or Makers", "Profile"].map(
                        (title, idx) => (
                            <div
                                key={idx}
                                className="w-full md:flex-shrink-0 md:w-[calc((100vw-200px)/3-30px)] md:ml-[30px] flex flex-col text-black mb-8 md:mb-0">
                                <h2 className="text-[15px] font-bold font-helvetica text-left px-2 md:px-0">
                                    {title}
                                </h2>
                            </div>
                        )
                    )}
                </div> */}
			</div>
		</>
	);
}
