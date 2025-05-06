import { useEffect, useState } from "react";
import {
	fetchUserTests,
	enrichTestsWithMatches,
	fetchTestById,
} from "../repositories/testRepository";
import { loadMaker, deleteMaker } from "../repositories/makerRepository";
import { MatchState } from "../constants/MatchState";
import {
	updateMatchStatus,
	cancelMatchByMaker,
} from "../repositories/matchRepository";
import createEmailContent, { handleEmailNoti } from "../helper/emailTemplates";

export const MakerListViewModel = (user) => {
	const [userTests, setUserTests] = useState([]);
	const [currentIndex, setCurrentIndex] = useState(0);
	const [loading, setLoading] = useState(true);

	const isMaker = async (uid) => {
		if (!uid) return false;

		const testerData = await loadMaker(uid);
		return testerData !== null;
	};

	const getMaker = async (uid) => {
		const testerData = await loadMaker(uid);
		return testerData;
	};

	const deleteAccount = async (uid) => {
		if (!uid) return false;

		const done = await deleteMaker(uid);
		return done;
	};

	const handlePrev = () => {
		setCurrentIndex((prev) => Math.max(prev - 1, 0));
	};

	const handleNext = () => {
		setCurrentIndex((prev) => Math.min(prev + 1, userTests.length - 1));
	};

	const handleTimeChange = (index, newTime) => {
		setUserTests((prevTests) =>
			prevTests.map((test, i) => {
				// 현재 보고 있는 테스트만 수정
				if (i !== currentIndex) return test;

				const updatedMatches = [...test.matches];
				updatedMatches[index] = {
					...updatedMatches[index],
					testTime: newTime,
				};

				return {
					...test,
					matches: updatedMatches,
				};
			})
		);
	};

	const handleDateSend = async (index) => {
		const match = currentTest.matches[index];
		if (!match?.matchId) return;

		// 1. 서버에 상태 업데이트
		await updateMatchStatus(match.matchId, MatchState.dateSuggest, {
			testDate: match.testDate,
			testTime: match.testTime,
		});
		// 테스터에 날짜 수락 알림 메일 보내기
		handleEmailNoti(
			MatchState.dateSuggest,
			"homeTester",
			currentTest.testName,
			currentTest.matches[index].tester.email
		);
		// 2. 로컬 상태도 업데이트
		setUserTests((prevTests) =>
			prevTests.map((test, i) => {
				if (i !== currentIndex) return test;

				const updatedMatches = [...test.matches];
				updatedMatches[index] = {
					...updatedMatches[index],
					status: MatchState.dateSuggest,
				};

				return {
					...test,
					matches: updatedMatches,
				};
			})
		);
	};

	const handleDateChange = (index, newDate) => {
		setUserTests((prevTests) =>
			prevTests.map((test, i) => {
				// 현재 보고 있는 테스트만 수정
				if (i !== currentIndex) return test;

				const updatedMatches = [...test.matches];
				updatedMatches[index] = {
					...updatedMatches[index],
					testDate: newDate,
				};

				return {
					...test,
					matches: updatedMatches,
				};
			})
		);
	};

	const updateStatus = async (index, status) => {
		if (status === MatchState.makerCancel) {
			const confirmChange = window.confirm("테스트를 취소하시겠습니다?");
			if (!confirmChange) return;
		} else if (status === MatchState.makerPending) {
			const confirmChange = window.confirm(
				"테스터를 보류하면 취소할 수 없습니다."
			);
			if (!confirmChange) return;
		}

		const match = currentTest.matches[index];
		if (!match?.matchId) return;
		await updateMatchStatus(match.matchId, status);
		handleEmailNoti(
			status,
			"homeTester",
			currentTest.testName,
			currentTest.matches[index].tester.email
		);
		// 2. 로컬 상태도 업데이트
		setUserTests((prevTests) =>
			prevTests.map((test, i) => {
				if (i !== currentIndex) return test;

				const updatedMatches = [...test.matches];
				updatedMatches[index] = {
					...updatedMatches[index],
					status: status,
				};

				return {
					...test,
					matches: updatedMatches,
				};
			})
		);
	};
	const loadTestData = async (makerId) => {
		if (!makerId) return;

		setLoading(true);
		try {
			const tests = await fetchUserTests(makerId);
			const enrichedTests = await enrichTestsWithMatches(tests);
			console.log("enrichedTests", enrichedTests);

			const enrichedWithMatchList = enrichedTests.map((test) => ({
				...test,
				matchList: (test.matches || [])
					.filter((m) => m.tester)
					.map((m) => ({
						...m.tester,
						matchId: m.matchId,
						testDate: m.testDate || "",
						testTime: m.testTime || "",
						status: m.status,
					})),
			}));
			setUserTests(enrichedWithMatchList);
		} catch (err) {
			console.error("useUserTests 오류:", err);
		} finally {
			setLoading(false);
		}
	};
	// useEffect(() => {
	// 	if (!user) return;

	// 	const fetch = async () => {
	// 		setLoading(true);
	// 		try {
	// 			const tests = await fetchUserTests(user.uid);
	// 			const enrichedTests = await enrichTestsWithMatches(tests);
	// 			console.log("enrichedTests", enrichedTests);
	// 			// 각 테스트에 matchList 추가

	// 			const enrichedWithMatchList = enrichedTests.map((test) => ({
	// 				...test,
	// 				matchList: (test.matches || [])
	// 					.filter((m) => m.tester)
	// 					.map((m) => ({
	// 						...m.tester,
	// 						matchId: m.matchId,
	// 						testDate: m.testDate || "",
	// 						testTime: m.testTime || "",
	// 						status: m.status,
	// 					})),
	// 			}));
	// 			setUserTests(enrichedWithMatchList);
	// 		} catch (err) {
	// 			console.error("useUserTests 오류:", err);
	// 		} finally {
	// 			setLoading(false);
	// 		}
	// 	};

	// 	fetch();
	// }, [user]);
	const currentTest = userTests[currentIndex] || null;
	return {
		userTests,
		isMaker,
		loading,
		handleTimeChange,
		handlePrev,
		handleNext,
		currentIndex,
		currentTest,
		loadTestData,
		handleDateSend,
		handleDateChange,
		updateStatus,
		getMaker,
		deleteAccount,
	};
};
