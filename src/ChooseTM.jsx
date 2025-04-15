import React from "react";
import { Link } from "react-router-dom";
import OnboardingHeader from ".//components/OnboardingHeader";
import Footer from ".//components/Footer";
import Button from ".//components/Button";

const testerCopy =
	"테스터는 상품을 테스트하여 피드백을 제공하고 메이커로부터 보상을 받는 사람입니다";
const makerCopy =
	"메이커는 상품이나 기능을 희망하는 테스터와 함께 미리 테스트하고 피드백을 받는 사람입니다.";

export default function ChooseTM() {
	return (
		<div className="min-h-screen flex flex-col">
			<OnboardingHeader />
			<div className="relative flex flex-col md:flex-row md:items-center justify-center gap-2 md:gap-[60px] px-[var(--side-padding)] pt-4 md:pt-20 mb-12 md:mb-0 z-10">
				{/* Testers Area */}
				<div className="relative flex flex-col md:flex-col items-start justify-start md:px-[var(--side-padding)] gap-0 z-10 mt-2 md:mt-20 mb-12 md:mb-0">
					<p className="text-[44px] md:text-[90px] max-w-[300px] md:max-w-[550px]  whitespace-pre-line  font-semibold font-helvetic">
						{"Testers."}
					</p>
					<p className="text-[17px] md:text-[18px] max-w-[300px] md:max-w-[400px]  whitespace-pre-line font-suit tracking-tight mb-2 md:mb-6">
						{testerCopy}
					</p>
					<Link
						to="/signup?role=tester"
						className="w-full max-w-[100%] md:max-w-[320px]">
						<Button type="primary" size="lg">
							나는 테스터입니다
						</Button>
					</Link>
				</div>
				<img
					src="/icons/vs.svg"
					className="w-[35px] h-[28px] md:w-[104px] md:h-[83px] object-contain"
				/>
				{/* Makers Area */}
				<div className="relative flex flex-col md:flex-col items-start justify-start md:px-[var(--side-padding)] gap-0 z-10 mt-2 md:mt-20 mb-12 md:mb-0">
					<p className="text-[44px] md:text-[90px] max-w-[300px] md:max-w-[550px]  whitespace-pre-line  font-semibold font-helvetic">
						{"Makers."}
					</p>
					<p className="text-[17px] md:text-[18px] max-w-[300px] md:max-w-[400px]  whitespace-pre-line font-suit tracking-tight mb-2 md:mb-6">
						{makerCopy}
					</p>
					<Link
						to="/signup?role=maker"
						className="w-full max-w-[100%] md:max-w-[320px] text-center bg-black text-white text-lg font-bold font-suit px-12 md:px-16 py-4 rounded-full hover:bg-gray-800 transition">
						나는 메이커입니다
					</Link>
				</div>
			</div>
			<Footer />
		</div>
	);
}
