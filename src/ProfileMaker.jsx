import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import MakerHeader from "./components/MakerHeader";
import Footer from "./components/Footer";
import Button from "./components/Button";
import Input from "./components/Input";
import { db } from "./firebase";
import { collection, doc, setDoc, getDoc } from "firebase/firestore";
import {
	getAuth,
	onAuthStateChanged,
	deleteUser,
	signOut,
} from "firebase/auth";
import { MakerListViewModel } from "./hooks/MakerListViewModel";

export default function ProfileMaker() {
	const [companyName, setCompanyName] = useState("");
	const [homepage, setHomepage] = useState("");
	const [productLink, setProductLink] = useState("");
	const [name, setName] = useState("");
	const [email, setEmail] = useState("");
	const [errors, setErrors] = useState({});
	const [maker, setMaker] = useState(null);
	const [user, setUser] = useState(null);
	const navigate = useNavigate();
	const { getMaker, deleteAccount } = MakerListViewModel();
	const [isEdit, setIsEdit] = useState(false);

	useEffect(() => {
		const auth = getAuth();
		const unsubscribe = onAuthStateChanged(auth, async (user) => {
			if (user) {
				setUser(user); // 상태로 저장 (필요하면)
				const data = await getMaker(user.uid);
				if (data) {
					setMaker(data);
					setCompanyName(data.companyName || "");
					setHomepage(data.homepage || "");
					setName(data.name || "");
					setEmail(data.email || "");
					setProductLink(data.productLink || "");
				}
			}
		});

		// cleanup
		return () => unsubscribe();
	}, []);

	const handleSubmit = async (e) => {
		e.preventDefault();

		try {
			const auth = getAuth();
			const user = auth.currentUser;
			if (!user) throw new Error("로그인이 필요합니다.");

			const ref = doc(db, "makers", maker.id); // 🔄 setDoc: uid를 문서 ID로

			await setDoc(
				ref,
				{
					companyName,
					homepage,
					name,
					email,
					productLink,
				},
				{ merge: true }
			);

			navigate("/success?role=maker");
		} catch (error) {
			console.error("Error adding document: ", error);
		}
	};

	const handleDeleteAccount = async () => {
		const confirmed = window.confirm("정말 계정을 삭제하시겠어요?");
		if (!confirmed) return;

		const auth = getAuth();
		const user = auth.currentUser;

		if (user) {
			try {
				await deleteUser(user);
				await deleteAccount(user);
				alert("계정이 삭제되었습니다.");
				// 예: 로그아웃 처리나 리다이렉트
				navigate("/signup?role=maker");
			} catch (error) {
				if (error.code === "auth/requires-recent-login") {
					alert("보안을 위해 다시 로그인 후 시도해주세요.");
					// 예: 재로그인 유도 페이지로 이동
					// navigate("/relogin");
				} else {
					console.error("계정 삭제 실패:", error);
					alert("계정 삭제 중 오류가 발생했습니다.");
				}
			}
		} else {
			alert("로그인된 사용자가 없습니다.");
		}
	};
	const handleLogout = async () => {
		const auth = getAuth();

		try {
			await signOut(auth);
			navigate("/signup?role=maker");
			console.log("로그아웃되었습니다.");
			// 필요하다면 리디렉션 or 상태 초기화
			// 예: navigate("/login") 또는 setUser(null)
		} catch (error) {
			console.error("로그아웃 실패:", error);
		}
	};

	return (
		<div className="min-h-screen flex flex-col">
			<MakerHeader />
			<div className="w-full flex justify-center pt-14">
				<div className="w-full px-[25px] pb-[50px] max-w-[500px] flex flex-col">
					{isEdit ? (
						<>
							<div className="items-start justify-start z-10 mb-2">
								<p className="w-full text-[54px] whitespace-pre-line font-helvetic font-semibold leading-tight tracking-tight">
									Profile.
								</p>
								<h1 className="text-[16px] font-suit mb-4 leading-tight tracking-tight">
									기본적인 회사 정보를 입력해주세요.
								</h1>
							</div>

							<form onSubmit={handleSubmit} className="space-y-3">
								{/* 회사이름 */}
								<div>
									<label className="block text-sm font-semibold mb-1">
										회사이름
									</label>
									<Input
										type="text"
										value={companyName}
										onChange={(e) => setCompanyName(e.target.value)}
										required
									/>
								</div>

								{/* 홈페이지 */}
								<div>
									<div className="flex flex-nowrap items-center gap-x-2">
										<label className="block text-sm font-semibold mb-1">
											홈페이지
										</label>
										<label className="block text-sm font-light mb-1">
											(소셜미디어, 링크드인 가능)
										</label>
									</div>
									<Input
										type="text"
										value={homepage}
										onChange={(e) => setHomepage(e.target.value)}
										required
									/>
								</div>
								{/* 상품 */}
								<div>
									<div className="flex flex-nowrap items-center gap-x-2">
										<label className="block text-sm font-semibold mb-1">
											서비스 또는 상품 링크
										</label>
										<label className="block text-sm font-light mb-1">
											(앱스토어, 구글 플레이 링크 대체 가능)
										</label>
									</div>
									<Input
										type="text"
										value={productLink}
										onChange={(e) => setProductLink(e.target.value)}
									/>
								</div>
								{/* 이름 */}
								<div>
									<label className="block text-sm font-semibold mb-1">
										이름
									</label>
									<Input
										type="text"
										value={name}
										onChange={(e) => setName(e.target.value)}
										required
									/>
								</div>

								{/* 이메일 */}
								<div className="pb-2">
									<label className="block text-sm font-semibold mb-1">
										이메일
									</label>
									<Input
										type="email"
										value={email}
										onChange={(e) => setEmail(e.target.value)}
										required
									/>
								</div>

								<Button
									type="primary"
									buttonType="submit"
									size="lg"
									className="w-full md:max-w-[500px]">
									프로필 저장
								</Button>
							</form>
						</>
					) : (
						<>
							<div className="items-start justify-start z-10 mb-2">
								<p className="w-full text-[54px] whitespace-pre-line font-helvetic font-semibold leading-tight tracking-tight">
									Profile.
								</p>
								<h1 className="text-[16px] font-suit mb-4 leading-tight tracking-tight">
									기본적인 회사 정보를 입력해주세요.
								</h1>
							</div>
							<div className="space-y-3">
								{/* 회사이름 */}
								<div>
									<label className="block text-label">회사이름</label>
									<p className="text-value">{companyName || ""}</p>
								</div>
								<div className="h-px bg-gray-100" />
								{/* 홈페이지 */}
								<div>
									<div className="flex flex-nowrap items-center gap-x-2">
										<label className="block text-label">홈페이지</label>
										<label className="block text-label">
											(소셜미디어, 링크드인 가능)
										</label>
									</div>
									{homepage ? (
										<a
											href={homepage}
											target="_blank"
											rel="noopener noreferrer"
											className="text-value text-black underline">
											{homepage}
										</a>
									) : (
										<p className="text-value">-</p>
									)}
								</div>
								<div className="h-px bg-gray-100" />
								{/* 서비스 */}
								<div>
									<div className="flex flex-nowrap items-center gap-x-2">
										<label className="block text-label">서비스 또는 상품</label>
									</div>
									{productLink ? (
										<a
											href={productLink}
											target="_blank"
											rel="noopener noreferrer"
											className="text-value text-black underline">
											{productLink}
										</a>
									) : (
										<p className="text-value">-</p>
									)}
								</div>
								<div className="h-px bg-gray-100" />
								{/* 이름 */}
								<div>
									<label className="block text-label">이름</label>
									<p className="text-value">{name || ""}</p>
								</div>
								<div className="h-px bg-gray-100" />
								{/* 이메일 */}
								<div className="pb-2">
									<label className="block text-label">이메일</label>
									<p className="text-value">{email || ""}</p>
								</div>

								<Button
									type="tertiary"
									onClick={() => setIsEdit(true)}
									size="lg"
									className="w-full md:max-w-[500px]">
									수정
								</Button>
								<div className="w-full flex justify-center pt-6">
									<p
										onClick={handleLogout}
										className="text-value text-red-500 hover:underline cursor-pointer  text-center">
										로그아웃
									</p>
								</div>

								<div className="w-full flex flex-col items-center justify-center pt-10">
									<label className="w-full text-[13px] text-gray-400 text-center">
										계정을 삭제하면 복구할 수 없습니다.
									</label>
									<p
										onClick={handleDeleteAccount}
										className="text-[14px] text-gray-400 hover:underline cursor-pointer text-center mt-2">
										계정삭제
									</p>
								</div>
							</div>
						</>
					)}
				</div>
			</div>

			<Footer />
		</div>
	);
}
