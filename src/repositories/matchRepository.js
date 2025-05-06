import { db } from "../firebase";
import { doc, updateDoc } from "firebase/firestore";

export const updateMatchStatus = async (matchId, status, extraFields = {}) => {
	const matchRef = doc(db, "matches", matchId);
	await updateDoc(matchRef, { status, ...extraFields });
};
export const cancelMatchByMaker = async (matchId) => {
	const matchRef = doc(db, "matches", matchId);
	await updateDoc(matchRef, {
		status: "makerCancel",
	});
};
