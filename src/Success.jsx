import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import OnboardingHeader from ".//components/OnboardingHeader";
import Footer from ".//components/Footer";
import Button from ".//components/Button";

export default function Success() {
	const navigate = useNavigate();
	const location = useLocation();
	const handleNext = async () => {
		if (role === "maker") {
			navigate("/homeMaker");
		} else {
			navigate("/HomeTester");
		}
	};
	const params = new URLSearchParams(location.search);
	const role = params.get("role"); // "tester" 또는 "maker"

	return (
		<div className="min-h-screen flex flex-col">
			<OnboardingHeader />
			<div className="relative flex flex-col items-center justify-center gap-2 mt-20">
				<img
					src="/icons/success.png"
					className="w-[110px] h-[110px] md:w-[130px] md:h-[130px] object-contain mt-0"
				/>
				<p className="text-[40px] md:text-[60px] font-helvetic font-semibold leading-tight tracking-tight whitespace-pre-line">
					{"Success."}
				</p>
				<div className="flex flex-col items-center justify-center text-center gap-6  mb-20">
					<p className="text-[16px] md:text-[17px] max-w-[350px] font-suit leading-tight whitespace-pre-line">
						{"성공적으로 완료되었습니다. 홈으로 이동합니다."}
					</p>
					<Button
						type="tertiary"
						onClick={handleNext}
						className="w-full max-w-[380px]">
						홈으로
					</Button>
				</div>
			</div>

			<Footer />
		</div>
	);
}
