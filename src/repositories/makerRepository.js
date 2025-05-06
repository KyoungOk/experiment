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

export const loadMaker = async (uid) => {
	if (!uid) return null;

	try {
		const docRef = doc(db, "makers", uid);
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

export const deleteMaker = async (uid) => {
	if (!uid) return;

	try {
		const docRef = doc(db, "makers", uid);
		await deleteDoc(docRef);
	} catch (error) {
		console.error("Error deleting tester:", error);
	}
};
