import { MatchState } from "../constants/MatchState";
import { db } from "../firebase";
import {
	collection,
	doc,
	getDoc,
	getDocs,
	query,
	where,
	orderBy,
} from "firebase/firestore";

export const fetchUserTests = async (uid) => {
	const testQuery = query(collection(db, "tests"), where("makerId", "==", uid));
	const testSnapshot = await getDocs(testQuery);

	return testSnapshot.docs.map((doc) => ({
		id: doc.id,
		...doc.data(),
	}));
};

// 🔧 테스트에 매칭 정보 붙이는 함수
export const enrichTestsWithMatches = async (tests, user) => {
	return Promise.all(
		tests.map(async (test) => {
			const matchQuery = query(
				collection(db, "matches"),
				where("testId", "==", test.id)
			);
			const matchSnapshot = await getDocs(matchQuery);

			const matchesWithTester = await Promise.all(
				matchSnapshot.docs.map(async (matchDoc) => {
					const matchData = matchDoc.data();
					const matchStatus = matchData.status;

					// 테스터 정보 가져오기
					const docRef = doc(db, "testers", matchData.testerId);
					const testerSnap = await getDoc(docRef);
					const testerData = !testerSnap.empty ? testerSnap.data() : null;

					if (!testerData) return null;

					// 기본 review 값
					let review = false;

					const shouldCheckReview =
						matchStatus === MatchState.testerAccept ||
						matchStatus === MatchState.doneTest ||
						matchStatus === MatchState.testerDone;

					if (shouldCheckReview && matchData.makerId) {
						const reviewsRef = collection(db, "reviews");
						const q = query(
							reviewsRef,
							where("reviewer_id", "==", matchData.makerId),
							where("match_id", "==", matchDoc.id)
						);
						const reviewSnap = await getDocs(q);
						if (!reviewSnap.empty) {
							review = true;
						}
					}

					// 테스터가 받은 리뷰 개수 및 평균 평점 가져오기
					const testerReviewQuery = query(
						collection(db, "reviews"),
						where("reviewee_id", "==", matchData.testerId)
					);
					const testerReviewSnap = await getDocs(testerReviewQuery);

					let totalRating = 0;
					let reviewCount = testerReviewSnap.size;

					testerReviewSnap.forEach((doc) => {
						const data = doc.data();
						if (data.rating >= 1 && data.rating <= 5) {
							totalRating += data.rating;
						}
					});

					const averageRating =
						reviewCount > 0
							? parseFloat((totalRating / reviewCount).toFixed(2))
							: null;

					return {
						matchId: matchDoc.id,
						testDate: test.startDate,
						testTime: "", // 초기값 빈 문자열로 세팅
						...matchData,
						tester: {
							...testerData,
							reviewStats: {
								reviewCount,
								averageRating,
							},
						},
						review,
					};
				})
			);

			const matches = matchesWithTester.filter(Boolean);
			return {
				...test,
				matches,
			};
		})
	);
};

export const fetchRecentUpcomingTests = async () => {
	const now = new Date();
	const oneMonthAgo = new Date();
	oneMonthAgo.setMonth(now.getMonth() - 2);
	const oneMonthAgoString = oneMonthAgo.toISOString().slice(0, 10); // "2025-04-25"
	const todayString = new Date().toISOString().slice(0, 10); // "2025-04-25"
	const testsRef = collection(db, "tests");
	const testsQuery = query(
		testsRef,
		//where("timestamp", ">=", oneMonthAgoString),
		where("startDate", ">=", todayString),
		orderBy("timestamp", "desc") // or startDate
	);

	const snapshot = await getDocs(testsQuery);
	const rawTests = snapshot.docs.map((doc) => ({
		id: doc.id,
		...doc.data(),
	}));

	// maker가 존재하는 경우에만 필터링
	const validTests = await Promise.all(
		rawTests.map(async (test) => {
			if (!test.makerId) return null;

			const maker = await fetchMakerById(test.makerId);
			if (!maker) return null;

			return test;
		})
	);

	return validTests.filter(Boolean); // null 제거
};

export const fetchTestById = async (testId) => {
	const testRef = doc(db, "tests", testId);
	const testSnap = await getDoc(testRef);
	if (!testSnap.exists()) return null;

	return {
		id: testSnap.id,
		...testSnap.data(),
	};
};

export const fetchMakerById = async (makerId) => {
	if (!makerId) return null;

	try {
		const ref = doc(db, "makers", makerId);
		const snapshot = await getDoc(ref);

		if (!snapshot.exists()) return null;

		return {
			id: snapshot.id,
			...snapshot.data(),
		};
	} catch (error) {
		console.error("Error fetching maker:", error);
		return null;
	}
};
