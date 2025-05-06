import { React, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { db } from "./firebase";
import { getAuth } from "firebase/auth";
import { collection, query, where, getDocs } from "firebase/firestore";

export default function Home() {
	const navigate = useNavigate();

	useEffect(() => {
		const checkUserRoleAndRedirect = async () => {
			const auth = getAuth();
			const user = auth.currentUser;
			if (!user) return;

			const uid = user.uid;

			try {
				const makerQuery = query(
					collection(db, "makers"),
					where("uid", "==", uid)
				);
				const makerSnapshot = await getDocs(makerQuery);

				if (!makerSnapshot.empty) {
					navigate("/homeMaker");
					return;
				}

				const testerQuery = query(
					collection(db, "testers"),
					where("uid", "==", uid)
				);
				const testerSnapshot = await getDocs(testerQuery);

				if (!testerSnapshot.empty) {
					navigate("/homeTester");
					return;
				}

				navigate("/howItWorks");
			} catch (error) {
				console.error("사용자 역할 확인 중 오류:", error);
				navigate("/howItWorks"); // 오류 발생 시 기본 경로
			}
		};

		checkUserRoleAndRedirect();
	}, [navigate]);

	return null;
}
