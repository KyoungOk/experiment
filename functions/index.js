/**
 * Import function triggers from their respective submodules:
 *
 * const {onCall} = require("firebase-functions/v2/https");
 * const {onDocumentWritten} = require("firebase-functions/v2/firestore");
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

const functions = require("firebase-functions");
const nodemailer = require("nodemailer");
const admin = require("firebase-admin");
const cors = require("cors")({ origin: true });

admin.initializeApp();

// 🔐 Gmail SMTP 설정 (앱 비밀번호 사용)
const transporter = nodemailer.createTransport({
	service: "gmail",
	auth: {
		user: "support@genaufactory.com", // Gmail 주소
		pass: "wxsh bbwh fxul kkrc", // 앱 비밀번호 (2단계 인증용)
	},
});

/**
 * Firebase Function to send email based on match state.
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
// 📩 이메일 전송 Cloud Function
exports.sendEmail = functions.https.onRequest((req, res) => {
	cors(req, res, async () => {
		const { to, payload } = req.body;

		if (!to || !payload) {
			return res.status(400).send("to, payload가 필요합니다.");
		}

		try {
			const mailOptions = {
				from: '"TesterMatch" <support@genaufactory.com>',
				to: to,
				subject: payload.subject,
				html: payload.html,
			};

			await transporter.sendMail(mailOptions);
			return res.status(200).send({ success: true });
		} catch (error) {
			console.error("이메일 전송 오류:", error);
			return res.status(500).send("이메일 전송 실패");
		}
	});
});
