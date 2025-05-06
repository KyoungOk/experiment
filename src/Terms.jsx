import React from "react";
import OnboardingHeader from "./components/OnboardingHeader";

export default function Terms() {
	return (
		<div className="min-h-screen flex flex-col">
			<OnboardingHeader />
			<div className="relative flex flex-col md:flex-row md:items-center justify-center gap-1 md:gap-[60px] pt-4 px-[var(--side-padding)] pb-20 md:mt-20 z-10">
				<div className="max-w-3xl mx-auto px-4 py-10 text-gray-800">
					<h1 className="text-2xl font-bold mb-6">이용약관</h1>

					<h2 className="text-lg font-semibold mt-4 mb-2">제 1 조 (목적)</h2>
					<p>
						이 약관은 <span>[게나우팩토리]</span> (이하 "회사")이 제공하는{" "}
						<span>[테스터매치]</span> (이하 "서비스")의 이용과 관련하여 회사와
						이용자 간의 권리, 의무 및 책임사항 등을 규정함을 목적으로 합니다.
					</p>

					<h2 className="text-lg font-semibold mt-4 mb-2">제 2 조 (정의)</h2>
					<p>
						1. “서비스”란 회사가 웹을 통해 제공하는 테스터 매칭 및 테스트 진행
						지원 서비스를 의미합니다.
						<br />
						2. “이용자”란 본 약관에 따라 서비스를 이용하는 자를 말하며, 테스트
						의뢰자(메이커)와 테스터를 포함합니다.
						<br />
						3. “회원”이란 서비스에 가입하여 회사가 제공하는 기능을 이용할 수
						있는 자를 말합니다.
					</p>

					<h2 className="text-lg font-semibold mt-4 mb-2">
						제 3 조 (약관의 효력 및 변경)
					</h2>
					<p>
						1. 본 약관은 서비스 화면에 게시하거나 기타의 방법으로 공지함으로써
						효력이 발생합니다.
						<br />
						2. 회사는 관련 법령을 위배하지 않는 범위 내에서 본 약관을 개정할 수
						있으며, 변경 시 사전 공지합니다.
						<br />
						3. 이용자가 변경된 약관에 동의하지 않는 경우, 이용계약을 해지할 수
						있습니다.
					</p>

					<h2 className="text-lg font-semibold mt-4 mb-2">
						제 4 조 (회원가입)
					</h2>
					<p>
						1. 회원가입은 회사가 정한 방식에 따라 신청하며, 회사의 승낙으로 회원
						자격이 부여됩니다.
						<br />
						2. 회사는 회원이 입력한 정보가 허위이거나 부정확할 경우 가입을
						제한하거나 취소할 수 있습니다.
					</p>

					<h2 className="text-lg font-semibold mt-4 mb-2">
						제 5 조 (서비스의 제공)
					</h2>
					<p>
						1. 회사는 다음과 같은 서비스를 제공합니다:
						<br />
						- 서비스 테스트 요청 등록
						<br />
						- 조건에 맞는 테스터 추천 및 매칭
						<br />
						- 테스트 관리 및 커뮤니케이션 지원
						<br />
						2. 회사는 서비스 내용 및 제공 방식을 변경할 수 있으며, 사전 공지 후
						시행합니다.
					</p>

					<h2 className="text-lg font-semibold mt-4 mb-2">
						제 6 조 (회원의 의무)
					</h2>
					<p>
						1. 회원은 서비스 이용 시 관계 법령, 본 약관, 이용안내 및 회사의
						공지사항을 준수해야 합니다.
						<br />
						2. 타인의 정보를 도용하거나, 테스트 결과를 무단 유포하거나, 회사의
						업무를 방해하는 행위를 해서는 안 됩니다.
					</p>

					<h2 className="text-lg font-semibold mt-4 mb-2">
						제 7 조 (개인정보의 보호)
					</h2>
					<p>
						회사는 개인정보 보호법 등 관련 법령에 따라 이용자의 개인정보를
						보호합니다. 자세한 내용은{" "}
						<a href="/privacy" className="text-blue-600 underline">
							개인정보처리방침
						</a>
						을 따릅니다.
					</p>

					<h2 className="text-lg font-semibold mt-4 mb-2">
						제 8 조 (계약 해지 및 서비스 탈퇴)
					</h2>
					<p>
						1. 회원은 언제든지 서비스 내 '탈퇴' 기능을 통해 이용계약을 해지할 수
						있습니다.
						<br />
						2. 회사는 다음 각 호의 사유가 발생한 경우 사전 통보 없이 회원자격을
						제한하거나 해지할 수 있습니다:
						<br />
						- 허위 정보 입력
						<br />
						- 타인 명의 도용
						<br />- 테스트의 신뢰를 훼손하는 행위 등
					</p>

					<h2 className="text-lg font-semibold mt-4 mb-2">
						제 9 조 (지적재산권)
					</h2>
					<p>
						서비스 내에서 제공되는 모든 콘텐츠(텍스트, 이미지, 로고 등)에 대한
						지적재산권은 회사에 귀속되며, 회원은 사전 동의 없이 이를 복제, 배포,
						전송할 수 없습니다.
					</p>

					<h2 className="text-lg font-semibold mt-4 mb-2">
						제 10 조 (면책 조항)
					</h2>
					<p>
						1. 회사는 천재지변, 네트워크 장애, 기타 불가항력적인 사유로 인한
						서비스 중단에 대해 책임을 지지 않습니다.
						<br />
						2. 회사는 회원 간 거래 및 테스트 결과에 대한 신뢰도, 적합성 등에
						대해 보증하지 않으며, 분쟁 발생 시 책임을 지지 않습니다.
					</p>

					<h2 className="text-lg font-semibold mt-4 mb-2">
						제 11 조 (준거법 및 관할법원)
					</h2>
					<p>
						본 약관은 대한민국 법령에 따라 해석되며, 회사와 회원 간 분쟁이
						발생할 경우 회사의 주소지를 관할하는 법원을 제1심 관할 법원으로
						합니다.
						<br />
						회사 주소: <span>[서울 강남구 선릉로 428 2층]</span>
						<br />
						이메일: <span>[support@genaufactory.com]</span>
					</p>
				</div>
			</div>
		</div>
	);
}
