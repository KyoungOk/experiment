import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import CommonHeader from ".//components/CommonHeader";
import Footer from ".//components/Footer";
import Button from ".//components/Button";

export default function Success() {
	const navigate = useNavigate();
	const location = useLocation();
	const handleNext = async () => {
		if (role === "maker") {
			navigate("/makerHome");
		} else {
			navigate("/testerHome");
		}
	};
	const params = new URLSearchParams(location.search);
	const role = params.get("role"); // "tester" 또는 "maker"

	return (
		<div className="min-h-screen flex flex-col">
			<div className="relative px-10 pt-5 pb-8 md:pt-8 md:pb-48">
				<CommonHeader />
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
							{
								"프로필이 성공적으로 등록되었습니다. 테스터 조건과 매칭될 경우 홈페이지 확인 또는 이메일로 안내드립니다."
							}
						</p>
						<Button
							type="tertiary"
							onClick={handleNext}
							className="w-full max-w-[380px]">
							홈으로
						</Button>
					</div>
				</div>
			</div>
			<Footer />
		</div>
	);
}
