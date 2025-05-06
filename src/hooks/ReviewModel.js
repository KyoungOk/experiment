import { db } from "../firebase";
import {
	collection,
	addDoc,
	doc,
	getDoc,
	getDocs,
	onSnapshot,
	setDoc,
	updateDoc,
	query,
	where,
	deleteDoc,
	orderBy,
	limit,
	serverTimestamp,
} from "firebase/firestore";
import { getAuth, onAuthStateChanged } from "firebase/auth";

export const saveReview = async (
	reviewee_id,
	reviewer_id,
	rating,
	comment,
	match_id
) => {
	try {
		const docRef = await addDoc(collection(db, "reviews"), {
			review_date: serverTimestamp(), // Firestore 서버 시간 기준
			reviewee_id,
			reviewer_id,
			rating,
			comment,
			match_id,
		});

		console.log("리뷰 저장 완료:", docRef.id);
		return docRef.id;
	} catch (error) {
		console.error("리뷰 저장 중 오류 발생:", error);
		throw error;
	}
};
export const getMatch = async (matchId) => {
	if (!matchId) return null;
	try {
		const docRef = doc(db, "matches", matchId);
		const matchSnap = await getDoc(docRef);

		if (!matchSnap.exists()) {
			console.error("해당 매치 문서를 찾을 수 없습니다.");
			return null;
		}

		const matchData = matchSnap.data();
		const { testerId, makerId, testId } = matchData;

		return new Promise((resolve) => {
			onAuthStateChanged(getAuth(), async (user) => {
				if (!user) {
					console.error("로그인된 사용자가 없습니다.");
					resolve(null);
					return;
				}

				const uid = user.uid;
				let role = null;
				let testerData = null;
				let testData = null;
				let makerData = null;

				if (uid === testerId) {
					role = "tester";
				} else if (uid === makerId) {
					role = "maker";
				} else {
					console.error("사용자가 해당 매치에 포함되어 있지 않습니다.");
					resolve(null);
					return;
				}

				const testersRef = doc(db, "testers", testerId);
				const testersSnap = await getDoc(testersRef);
				if (testersSnap.exists()) {
					testerData = {
						id: testersSnap.id, // ← 문서 ID 포함
						...testersSnap.data(), // ← 문서 내용 포함
					};
				}

				const makersRef = doc(db, "makers", makerId);
				const makerSnap = await getDoc(makersRef);
				if (makerSnap.exists()) {
					makerData = {
						id: makerSnap.id,
						...makerSnap.data(),
					};
				}

				const testRef = doc(db, "tests", testId);
				const testSnap = await getDoc(testRef);
				if (testSnap.exists()) {
					testData = {
						id: testSnap.id,
						...testSnap.data(),
					};
				}

				resolve({
					match: matchData,
					role,
					test: testData,
					tester: testerData,
					maker: makerData,
				});
			});
		});
	} catch (error) {
		console.error("테스트 정보 오류:", error);
		return null;
	}
};
