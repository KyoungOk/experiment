import { db } from "../firebase";
import {
	collection,
	doc,
	getDoc,
	getDocs,
	setDoc,
	updateDoc,
	query,
	where,
	deleteDoc,
} from "firebase/firestore";

export const checkTester = async (uid) => {
	if (!uid) return null;

	try {
		const docRef = doc(db, "testers", uid);
		const snapshot = await getDoc(docRef);

		if (!snapshot.empty) {
			return { id: snapshot.id, ...snapshot.data() };
		} else {
			return null;
		}
	} catch (error) {
		console.error("Error checking tester:", error);
		return null;
	}
};

export const updateTester = async (uid, data) => {
	if (!uid || !data) return;

	try {
		const docRef = doc(db, "testers", uid);
		await setDoc(docRef, data, { merge: true }); // merge:true로 기존 데이터 유지하면서 업데이트
	} catch (error) {
		console.error("Error updating tester:", error);
	}
};

export const deleteTester = async (uid) => {
	if (!uid) return;

	try {
		const docRef = doc(db, "testers", uid);
		await deleteDoc(docRef);
	} catch (error) {
		console.error("Error deleting tester:", error);
	}
};
