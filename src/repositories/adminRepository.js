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
} from "firebase/firestore";
import { getAuth } from "firebase/auth";

export const getAdmin = async (uid) => {
	if (!uid) return null;

	try {
		const testersRef = collection(db, "admin");
		const q = query(testersRef, where("uid", "==", uid));
		const snapshot = await getDocs(q);

		if (!snapshot.empty) {
			const docSnap = snapshot.docs[0];
			return { id: docSnap.id, ...docSnap.data() };
		}
		return null;
	} catch (error) {
		console.error("관리자 정보 조회 중 오류:", error);
		return null;
	}
};

export const addAdmin = async (user) => {
	if (!user) throw new Error("로그인이 필요합니다.");

	await addDoc(collection(db, "admin"), {
		uid: user.uid,
		email: user.email,
		name: user.displayName,
		timestamp: new Date(),
	});
};

export const subscribeMakers = (onData) => {
	const auth = getAuth();
	const user = auth.currentUser;

	if (!user) {
		throw new Error("로그인이 필요합니다.");
	}

	const makersRef = collection(db, "makers");
	const makersQuery = query(makersRef, orderBy("timestamp", "desc"), limit(50));

	const unsubscribe = onSnapshot(
		makersQuery,
		(snapshot) => {
			const makers = snapshot.docs.map((doc) => ({
				id: doc.id,
				...doc.data(),
			}));
			onData(makers); // 외부에서 받아올 콜백
		},
		(error) => {
			console.error("메이커 실시간 구독 중 오류:", error);
		}
	);

	return unsubscribe; // 구독 해제할 때 사용
};

export const updateApprove = async (makerId, approved) => {
	const auth = getAuth();
	const user = auth.currentUser;

	if (!user) {
		throw new Error("로그인이 필요합니다.");
	}

	const makerRef = doc(db, "makers", makerId);
	await updateDoc(makerRef, {
		approved,
	});
};
