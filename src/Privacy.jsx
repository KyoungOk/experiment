import React from "react";
import OnboardingHeader from "./components/OnboardingHeader";

export default function Privacy() {
	return (
		<div className="min-h-screen flex flex-col">
			<OnboardingHeader />
			<div className="relative flex flex-col md:flex-row md:items-center justify-center gap-1 md:gap-[60px] pt-4 pb-20 px-[var(--side-padding)] md:mt-20 z-10">
				<div className="max-w-3xl mx-auto px-4 py-10 text-gray-800">
					<h1 className="text-2xl font-bold mb-6">개인정보 처리방침</h1>

					<p className="mb-6">
						<span>[게나우팩토리]</span> (이하 "회사")는 이용자의 개인정보를
						중요하게 여기며, 개인정보 보호법 등 관련 법령을 준수합니다. 본
						방침은 회사가 제공하는 <span>[테스터매치]</span>의 이용과 관련하여
						수집되는 개인정보의 처리에 대한 사항을 설명합니다.
					</p>

					<h2 className="text-lg font-semibold mt-4 mb-2">
						1. 수집하는 개인정보 항목
					</h2>
					<p>
						회사는 회원가입 및 서비스 이용 과정에서 아래와 같은 정보를 수집할 수
						있습니다:
						<br />
						- 필수: 이메일, 이름, 서비스 이용 기록
						<br />
						- 선택: 프로필 정보, 테스트 선호 정보 등<br />- 자동 수집: IP 주소,
						브라우저 정보, 이용시간, 기기 정보 등
					</p>

					<h2 className="text-lg font-semibold mt-4 mb-2">
						2. 개인정보 수집 방법
					</h2>
					<p>
						회사는 다음과 같은 방법으로 개인정보를 수집합니다:
						<br />
						- 웹사이트 내 회원가입 및 프로필 작성 시<br />
						- 테스트 신청/참여 시 입력한 정보
						<br />- 자동 수집 도구 (쿠키 등)를 통한 수집
					</p>

					<h2 className="text-lg font-semibold mt-4 mb-2">
						3. 개인정보 이용 목적
					</h2>
					<p>
						수집된 개인정보는 다음의 목적을 위해 활용됩니다:
						<br />
						- 사용자 인증 및 식별
						<br />
						- 테스터 매칭 및 테스트 진행 관리
						<br />
						- 공지사항 및 주요 알림 전달
						<br />- 통계 및 분석을 통한 서비스 개선
					</p>

					<h2 className="text-lg font-semibold mt-4 mb-2">
						4. 개인정보 보유 및 이용 기간
					</h2>
					<p>
						회사는 개인정보 수집 및 이용 목적이 달성된 후에는 해당 정보를 지체
						없이 파기합니다. 단, 관련 법령에 따라 일정 기간 보관이 필요한 경우는
						예외로 합니다.
					</p>

					<h2 className="text-lg font-semibold mt-4 mb-2">
						5. 개인정보 제3자 제공
					</h2>
					<p>
						회사는 이용자의 사전 동의 없이 개인정보를 외부에 제공하지 않으며,
						아래의 경우에 한해 예외적으로 제공할 수 있습니다:
						<br />
						- 법령에 근거하여 수사기관의 요청이 있는 경우
						<br />- 이용자가 동의한 경우 (예: 테스터-메이커 간 매칭 시 연락
						목적)
					</p>

					<h2 className="text-lg font-semibold mt-4 mb-2">
						6. 개인정보 처리 위탁
					</h2>
					<p>
						회사는 서비스 운영을 위해 일부 업무를 외부에 위탁할 수 있으며, 위탁
						시 개인정보가 안전하게 처리되도록 관리·감독합니다.
						<br />- 예: 이메일 발송 대행, 클라우드 서버 운영 등
					</p>

					<h2 className="text-lg font-semibold mt-4 mb-2">
						7. 이용자의 권리 및 행사 방법
					</h2>
					<p>
						이용자는 언제든지 본인의 개인정보에 대해 열람, 정정, 삭제,
						처리정지를 요청할 수 있으며, 서비스 내 문의 또는 이메일(
						<span>[support@genaufactory.com]</span>)을 통해 권리를 행사할 수
						있습니다.
					</p>

					<h2 className="text-lg font-semibold mt-4 mb-2">
						8. 개인정보 보호를 위한 조치
					</h2>
					<p>
						회사는 개인정보의 안전한 처리를 위해 아래와 같은 조치를 취하고
						있습니다:
						<br />
						- 개인정보 접근 권한 최소화
						<br />
						- 데이터 암호화 저장 및 전송
						<br />- 보안 프로그램 설치 및 주기적 점검
					</p>

					<h2 className="text-lg font-semibold mt-4 mb-2">
						9. 쿠키(cookie)의 사용
					</h2>
					<p>
						웹사이트는 이용자 경험 향상 및 통계 분석을 위해 쿠키를 사용할 수
						있으며, 이용자는 브라우저 설정을 통해 쿠키 저장을 거부할 수
						있습니다.
					</p>

					<h2 className="text-lg font-semibold mt-4 mb-2">
						10. 개인정보 보호책임자 안내
					</h2>
					<p>
						회사는 개인정보 처리와 관련한 문의사항에 대해 성실히 답변할 수
						있도록 개인정보 보호책임자를 지정하고 있습니다.
						<br />- 성명: <span>[박경옥]</span>
						<br />- 이메일: <span>[support@genaufactory]</span>
					</p>

					<h2 className="text-lg font-semibold mt-4 mb-2">11. 고지의 의무</h2>
					<p>
						본 개인정보처리방침은 관련 법령 및 내부 방침에 따라 변경될 수
						있으며, 변경 시 홈페이지 또는 서비스 내 공지사항을 통해 안내됩니다.
					</p>
				</div>
			</div>
		</div>
	);
}
