// 📁 hooks/useMatchesViewModel.js
import { useEffect, useState } from "react";
import {
	collection,
	query,
	where,
	getDoc,
	getDocs,
	addDoc,
	sort,
	updateDoc,
	doc,
	onSnapshot,
} from "firebase/firestore";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { db } from "../firebase";
import createEmailContent, { handleEmailNoti } from "../helper/emailTemplates";
import { MatchState } from "../constants/MatchState";
import {
	fetchRecentUpcomingTests,
	fetchMakerById,
	fetchTestById,
} from "../repositories/testRepository";
import { checkTester, deleteTester } from "../repositories/testerRepository";

export const TesterListViewModel = () => {
	const [user, setUser] = useState(null);
	const [tester, setTester] = useState([]);
	const [userTests, setUserTests] = useState([]);
	const [ingTests, setIngTests] = useState([]);
	const [progressTests, setProgressTests] = useState([]);
	const [loading, setLoading] = useState(true);

	const getUpdatedUserTests = () => {
		return userTests.map((test) => {
			const matching = [...ingTests, ...progressTests].find(
				(m) => m.testId === test.id
			);
			return {
				...test,
				matchStatus: matching?.status || null,
			};
		});
	};
	const isTester = async (uid) => {
		if (!uid) return false;

		const testerData = await checkTester(uid);
		return testerData !== null;
	};

	const deleteAccount = async (uid) => {
		if (!uid) return false;

		const done = await deleteTester(uid);
		return done;
	};

	const getTester = async (uid) => {
		const testerData = await checkTester(uid);
		return testerData;
	};

	const handleInterest = async (testId, makerId, status, testTitle, email) => {
		try {
			if (!user) throw new Error("로그인한 사용자가 없습니다.");

			const matchesRef = collection(db, "matches");
			const q = query(
				matchesRef,
				where("testId", "==", testId),
				where("testerId", "==", user.uid)
			);
			const querySnapshot = await getDocs(q);

			if (!querySnapshot.empty) {
				console.log("이미 관심 등록이 되어 있습니다.");
				return;
			}

			await addDoc(matchesRef, {
				testId,
				testerId: tester.id,
				makerId,
				status,
				createdAt: new Date(),
			});
			//setUserTests(getUpdatedUserTests());
			console.log("관심 등록 완료");
			handleEmailNoti(status, "homeMaker", testTitle, email);
		} catch (error) {
			console.error("관심 등록 중 오류:", error);
		}
	};

	const updateMatchStatus = async (matchId, status, testTitle, email) => {
		console.log("matchId", matchId);
		console.log("status", status);
		console.log("testTitle", testTitle);
		console.log("email", email);
		if (status === MatchState.testerCancel) {
			const confirmChange = window.confirm("테스트를 취소하시겠습니다?");
			if (!confirmChange) return;
		}

		try {
			const matchRef = doc(db, "matches", matchId);
			await updateDoc(matchRef, { status });
			console.log(`상태 변경 완료: ${status}`);
			if (status !== MatchState.testerDone) {
				handleEmailNoti(status, "homeMaker", testTitle, email);
			}
		} catch (error) {
			console.error("상태 변경 중 오류:", error);
		}
	};

	useEffect(() => {
		const unsubscribeAuth = onAuthStateChanged(getAuth(), async (user) => {
			if (!user) return;
			setUser(user);
			const testerData = await checkTester(user.uid);
			setTester(testerData);
			console.log("testerData", testerData);
			const recentTests = await fetchRecentUpcomingTests();
			const matchesQuery = query(
				collection(db, "matches"),
				where("testerId", "==", testerData.id)
			);
			const filteredTests = recentTests.filter((test) =>
				test.devices.includes(testerData.device)
			);
			const unsubscribeMatches = onSnapshot(matchesQuery, async (snapshot) => {
				const allMatches = snapshot.docs.map((doc) => ({
					id: doc.id,
					...doc.data(),
				}));

				const matchWithTestInfo = (
					await Promise.all(
						allMatches.map(async (match) => {
							const test = await fetchTestById(match.testId);
							const maker = await fetchMakerById(match.makerId);

							if (!test || !maker) return null;

							let review = false;

							const isReviewCheckNeeded =
								match.status === MatchState.testerAccept ||
								match.status === MatchState.doneTest;

							if (isReviewCheckNeeded) {
								const reviewsRef = collection(db, "reviews");
								const q = query(
									reviewsRef,
									where("reviewer_id", "==", user.uid),
									where("match_id", "==", match.id)
								);
								const reviewSnap = await getDocs(q);
								if (!reviewSnap.empty) {
									review = true;
								}
							}

							return {
								...match,
								maker,
								test,
								review,
							};
						})
					)
				).filter(Boolean);

				// ✅ 상태별 필터링
				const ing = matchWithTestInfo.filter(
					(m) => m.status === MatchState.testerAccept
				);

				const progress = matchWithTestInfo.filter(
					(m) =>
						![
							MatchState.testerCancel,
							MatchState.testerDone,
							MatchState.makerPending,
							MatchState.testerInterest,
							MatchState.testerAccept,
							MatchState.doneTest,
						].includes(m.status)
				);

				// ✅ 최근 테스트 중 내가 매칭한 것 정리
				const safeMatches = allMatches ?? [];

				const updatedUserTests = (
					await Promise.all(
						filteredTests.map(async (test) => {
							const matched = safeMatches.find((m) => m.testId === test.id);
							const matchStatus = matched?.status ?? null;

							const isTargetStatus =
								matchStatus === MatchState.testerInterest ||
								matchStatus === MatchState.testerCancel ||
								matchStatus === null;

							if (!isTargetStatus) return null;

							const maker = await fetchMakerById(test.makerId);

							return {
								...test,
								matchStatus,
								makerEmail: maker.email,
							};
						})
					)
				)
					.filter((test) => test !== null)
					.sort((a, b) => {
						if (a.matchStatus === null && b.matchStatus !== null) return -1;
						if (a.matchStatus !== null && b.matchStatus === null) return 1;
						return 0;
					});

				//setAllMatches(matchWithTestInfo); // ✅ 정확한 match + test 정보
				setUserTests(updatedUserTests);
				setIngTests(ing);
				setProgressTests(progress);
				setLoading(false);
			});

			return unsubscribeMatches;
		});

		return () => unsubscribeAuth();
	}, []);

	return {
		user,
		userTests,
		ingTests,
		progressTests,
		loading,
		handleInterest,
		updateMatchStatus,
		isTester,
		getTester,
		deleteAccount,
	};
};
