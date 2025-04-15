import React from "react";
import { Link } from "react-router-dom";
import CommonHeader from ".//components/CommonHeader";
import OnboardingHeader from ".//components/OnboardingHeader";
import Footer from ".//components/Footer";
import Button from ".//components/Button";

const steps = [
	{
		number: "1.",
		text: `내 상품 선호도 관련하여 간단한 프로필 작성하기`,
		image: "/icons/pencil.png",
	},
	{
		number: "2.",
		text: `상품 테스트를 원하는 업체와 매칭되면 업체와 함꼐 상품을 테스트하기`,
		image: "/icons/handshake.png",
	},
	{
		number: "3.",
		text: `테스트를 완료한 후 업체로부터 리워드 받기`,
		image: "/icons/coins.png",
	},
];

const mainCopy = "다양한 서비스를 먼저 체험하면서, 보상까지 받는 방법!";

export default function HowItWorks() {
	return (
		<div className="min-h-screen flex flex-col">
			<OnboardingHeader />
			{/* Navigation Titles */}
			<div className="hidden md:flex relative flex flex-col md:flex-row items-start justify-center  gap-0 z-10 mt-4">
				{["How it works", "Testers or Makers", "Profile"].map((title, idx) => (
					<div
						key={idx}
						className="w-full md:flex-shrink-0 md:w-[calc((100vw-200px)/3)] flex flex-col text-black mb-1 md:mb-0">
						<h2 className="text-[15px] font-bold font-helvetica text-left px-2 md:px-0">
							{title}
						</h2>
					</div>
				))}
			</div>
			{/* Main Copy */}
			<div className="relative flex flex-col md:flex-col items-start justify-start px-[var(--side-padding)] gap-3 z-10 mt-10 md:mt-24 mb-12 md:mb-0">
				<p className="text-[34px] md:text-[46px] max-w-[300px] md:max-w-[550px]  whitespace-pre-line font-suit leading-tight tracking-tight">
					{mainCopy}
				</p>
				<Link to="/choose" className="w-full max-w-[100%] md:max-w-[320px]">
					<Button type="primary" size="lg">
						시작하기
					</Button>
				</Link>
			</div>

			{/* Steps */}
			<div className="relative flex flex-col md:flex-row items-start justify-center px-[var(--side-padding)] gap-0 z-10 mb-10 md:mt-10">
				{steps.map((step, idx) => (
					<div
						key={idx}
						className="w-full md:flex-shrink-0 md:w-[calc((100vw-200px)/3-30px)] md:ml-[30px] flex flex-col gap-0 md:gap-2 text-black mb-4 md:mb-0">
						<div className="text-[27px] md:text-4xl font-regular font-helvetica">
							{step.number}
						</div>
						<p className="w-full max-w-[100%] md:max-w-[320px] text-[24px] md:text-[26px] whitespace-pre-line font-suit leading-tight tracking-tight">
							{step.text}
						</p>
						<img
							src={step.image}
							alt={`step-${step.number}`}
							className="w-[110px] h-[110px] md:w-[150px] md:h-[150px] object-contain mt-0"
						/>
						{/* CTA Button */}
						{idx === 2 && (
							<div className="block md:hidden flex justify-start mt-4">
								<Link
									to="/choose"
									className="w-full max-w-[320px] text-center bg-black text-white text-lg font-bold font-suit px-10 py-4 rounded-full hover:bg-gray-800 transition">
									시작하기
								</Link>
							</div>
						)}
					</div>
				))}
			</div>
			<Footer />
		</div>
	);
}
