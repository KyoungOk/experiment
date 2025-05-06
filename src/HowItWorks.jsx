import React from "react";
import { Link } from "react-router-dom";
import OnboardingHeader from ".//components/OnboardingHeader";
import Footer from ".//components/Footer";
import Button from ".//components/Button";

const steps = [
	{
		number: "1.",
		text: `테스터 매칭을 위해 내 프로필 작성하기`,
		image: "/icons/pencil.png",
	},
	{
		number: "2.",
		text: `관심 가는 서비스를 선택하고 테스터 조건에 맞으면 서비스를 테스트하기`,
		image: "/icons/handshake.png",
	},
	{
		number: "3.",
		text: `온라인으로 테스트를 완료한 후 업체로부터 리워드 받기`,
		image: "/icons/coins.png",
	},
];

const mainCopy = "다양한 웹,앱 서비스를 체험하면서, 보상까지 받는 방법!";

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
			<div className="relative flex flex-col md:flex-col items-center md:items-start justify-start px-[var(--side-padding)] gap-3 z-10 mt-10 md:mt-24 mb-12 md:mb-0">
				<p className="text-[34px] md:text-[46px] max-w-[300px] md:max-w-[600px] whitespace-pre-line font-suit leading-tight tracking-tight text-center md:text-left">
					{mainCopy}
				</p>

				<Link to="/choose" className="w-full max-w-[100%] md:max-w-[320px]">
					<Button type="primary" size="lg">
						시작하기
					</Button>
				</Link>
			</div>

			{/* Steps */}
			<div className="relative flex flex-col md:flex-row justify-center px-[var(--side-padding)] gap-0 z-10 mb-10 md:mt-10">
				{steps.map((step, idx) => (
					<div
						key={idx}
						className="w-full md:flex-shrink-0 md:w-[calc((100vw-200px)/3-30px)] items-center md:items-start md:ml-[30px] flex flex-col gap-0 md:gap-2 text-black mb-4 md:mb-0">
						<div className="text-[22px] md:text-[32px] font-regular font-helvetica">
							{step.number}
						</div>
						<p className="flex max-w-[90%] md:max-w-[360px] text-[19px] md:text-[24px] whitespace-pre-line font-suit leading-tight tracking-tight">
							{step.text}
						</p>
						<img
							src={step.image}
							alt={`step-${step.number}`}
							className="w-[100px] md:w-[130px] object-contain mt-0"
						/>
					</div>
				))}
			</div>
			<div className="block md:hidden flex justify-start mt-4 px-[var(--side-padding)] pb-20 z-10 ">
				<Button type="primary" size="lg">
					시작하기
				</Button>
			</div>
			<Footer />
		</div>
	);
}
