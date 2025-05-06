import { MatchState } from "../constants/MatchState";

function generateEmailHTML({
	icon,
	heading,
	message1,
	message2,
	dashboardButton,
}) {
	return `
      <div style="font-family: Arial, sans-serif; background-color: #f9f9f9; padding: 40px 20px;">
        <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; padding: 30px; border-radius: 8px; box-shadow: 0 0 10px rgba(0,0,0,0.05); text-align: center;">
          <div style="margin-bottom: 25px;">
            <img src="https://testermatch.com/icons/Logo.png" alt="테스터매치 로고" width="100" style="display: block; margin: 0 auto;" />
          </div>
          <h2 style="font-size: 18px; margin-bottom: 14px; color: #333333;">${icon} ${heading}</h2>
          <p style="font-size: 15px; line-height: 1.0; color: #333333; margin-bottom: 10px;">
            ${message1}
          </p>
          <p style="font-size: 15px; line-height: 1.0; color: #333333;">
            ${message2}
          </p>
          <div style="margin-top: 24px;">
            ${dashboardButton}
          </div>
          <p style="font-size: 12px; margin-top: 14px; line-height: 1.0; color: #333333;">
            TesterMatch 자동으로 보내는 알림 메일로 회신할 수 없습니다. 
          </p>
        </div>
      </div>
    `;
}

export default function createEmailContent(type, dashboardLink, testTitle) {
	const dashboardButton = `
      <a href="${dashboardLink}" 
        style="display: inline-block; background-color:rgb(115, 4, 251); color: #ffffff; padding: 14px 26px; text-decoration: none; border-radius: 6px; font-size: 16px; margin-top: 20px;">
        대시보드 바로가기
      </a>
    `;

	switch (type) {
		case "testerInterest":
			return {
				subject: `[테스터매치] ${testTitle}: 새로운 테스터가 관심을 표현하였습니다.`,
				html: generateEmailHTML({
					icon: "👀",
					heading: "새로운 테스터가 관심을 표현하였습니다",
					message1: `<strong>${testTitle}</strong>에 관심을 보인 새로운 테스터가 있습니다.`,
					message2: "테스터의 프로필을 확인하고 수락을 눌러주세요.",
					dashboardButton,
				}),
			};

		case "dateSuggest":
			return {
				subject: `[테스터매치] ${testTitle}: 테스트 일정을 확인해주세요.`,
				html: generateEmailHTML({
					icon: "📅",
					heading: "테스트 일정을 확인해주세요.",
					message1: `<strong>${testTitle}</strong>의 테스터로 선정되었습니다.`,
					message2: "테스트 일정을 대시보드에서 확인하고 수락해주세요.",
					dashboardButton,
				}),
			};
		case "testerAccept":
			return {
				subject: `[테스터매치] ${testTitle}: 테스터가 일정을 수락했습니다.`,
				html: generateEmailHTML({
					icon: "✅",
					heading: "테스터가 일정을 수락했습니다.",
					message1: `<strong>${testTitle}</strong>의 테스터가 확정되었습니다.`,
					message2:
						"대시보드에서 테스터의 이메일을 확인하여 사전에 준비 사항을 알려주세요.",
					dashboardButton,
				}),
			};
		case "testerAccept":
			return {
				subject: `[테스터매치] ${testTitle}: 테스터가 일정을 수락했습니다.`,
				html: generateEmailHTML({
					icon: "✅",
					heading: "테스터가 일정을 수락했습니다.",
					message1: `<strong>${testTitle}</strong>의 테스터가 확정되었습니다.`,
					message2: "테스트 전, 준비사항을 테스터에게 안내해 주세요.",
					dashboardButton,
				}),
			};

		case "makerCancel":
			return {
				subject: `[테스터매치] ${testTitle}: 테스트가 취소되었습니다.`,
				html: generateEmailHTML({
					icon: "⚠️",
					heading: "업체에서 테스트를 취소하였습니다.",
					message1: `<strong>${testTitle}</strong>가 취소되었습니다.`,
					message2:
						"일정을 조정하기 위해 취소한 경우에는 새로운 일정과 함께 안내 메일이 발송됩니다.",
					dashboardButton,
				}),
			};

		case "testerCancel":
			return {
				subject: `[테스터매치] ${testTitle}: 테스터가 일정을 취소하였습니다.`,
				html: generateEmailHTML({
					icon: "⚠️",
					heading: "테스터가 일정을 취소하였습니다.",
					message1: `<strong>${testTitle}</strong> 테스터 중 한명이 일정을 취소되었습니다.`,
					message2: "새로운 테스터를 찾거나, 다시 일정을 조정해보세요",
					dashboardButton,
				}),
			};

		case "doneTest":
			return {
				subject: `[테스터매치] ${testTitle}: 테스트가 완료되었습니다.`,
				html: generateEmailHTML({
					icon: "✅",
					heading: "사용자 테스트가 완료되었습니다.",
					message1: `<strong>${testTitle}</strong> 테스트에 대한 리뷰를 남겨주세요.`,
					message2: "더 나은 서비스를 제공하도록 노력하겠습니다.",
					dashboardButton,
				}),
			};

		case "makerApproved":
			return {
				subject: `[테스터매치] 회사 승인이 완료되었습니다.`,
				html: generateEmailHTML({
					icon: "✅",
					heading: "회사 승인이 완료되었습니다.",
					message1: "새로운 사용자 테스트를 추가하실 수 있습니다.",
					message2: "테스트매치를 지금 시작해보세요!",
					dashboardButton,
				}),
			};

		default:
			throw new Error(`알 수 없는 이메일 타입: ${type}`);
	}
}

export const handleEmailNoti = async (status, dashboard, testTitle, email) => {
	if (status !== MatchState.makerPending) {
		const content = createEmailContent(
			status,
			"https://testermatch.com/" + dashboard,
			testTitle
		);
		console.log("status", status);
		console.log("testTitle", testTitle);
		console.log("email", email);

		await fetch(
			"https://us-central1-experiment-a9d0d.cloudfunctions.net/sendEmail",
			{
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					to: email,
					payload: {
						subject: content.subject,
						html: content.html,
					},
				}),
			}
		);
		console.log("메이커에게 관심 테스터 알림 완료");
	}
};
