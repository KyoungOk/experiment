import React from "react";
import Button from "..//components/Button";
import formatTestDate from "..//helper/formatTestDate";

import {
	MatchState,
	matchStatusMap,
	ongoingStates,
	editableStates,
} from "..//constants/MatchState";
import {
	interestOptions,
	jobOptions,
	ageOptions,
	deviceOptions,
	genderOptions,
} from "..//constants/options";

const TestListForMaker = ({
	loading,
	userTests,
	currentIndex,
	handlePrev,
	handleNext,
	handleEdit,
	currentTest,
	userLanguage,
}) => {
	return (
		<div className="w-full max-w-card pb-4  space-y-3">
			{/* 데스크 탑에서 상단 타이틀 */}
			<div className="hidden md:flex px-7 py-4 rounded-[10px] bg-white space-y-1">
				<div className="flex items-start">
					<div className="text-value">진행중인 테스트 {userTests.length}개</div>
				</div>
			</div>
			{loading ? (
				<div className="p-7 rounded-[16px] bg-white space-y-3">
					<div className="flex text-value item-center justify-center">
						불러오는중...
					</div>
				</div>
			) : userTests.length === 0 ? (
				<div className="p-7 rounded-[16px] bg-white space-y-3">
					<div className="flex text-guide item-center justify-center">
						내가 만든 테스트가 없습니다
					</div>
				</div>
			) : (
				<div className="flex flex-col gap-2">
					{/* 모바일에서는 상단에 타이틀과 네비 버튼 */}
					<div className="flex md:hidden items-center justify-between w-full">
						<button
							onClick={handlePrev}
							disabled={currentIndex === 0}
							className="px-6 py-2 bg-white rounded disabled:opacity-30">
							←
						</button>
						<div className="text-value">
							진행중인 테스트 {userTests.length}개
						</div>
						<button
							onClick={handleNext}
							disabled={currentIndex === userTests.length - 1}
							className="px-6 py-2 bg-white rounded disabled:opacity-30">
							→
						</button>
					</div>
					<div className="space-y-2">
						<ul>
							<li
								key={currentTest.id}
								className="p-7 rounded-[10px] bg-white space-y-2">
								<div className="flex items-start justify-between gap-4">
									<div className="flex flex-col flex-1">
										<div className="text-label">테스트명</div>
										<h3 className="text-valueTitle">
											{currentTest.testName || "제목 없음"}
										</h3>
									</div>
									<div className="flex flex-col w-[70px]">
										<p className="text-label">참가 인원</p>
										<p className="text-value">
											{currentTest.testerCount || "-"}명
										</p>
									</div>

									<div className="flex flex-col items-end">
										<p className="text-label">보상금액</p>
										<p className="text-value">{currentTest.reward || "-"}</p>
									</div>
								</div>

								<div className="h-px bg-gray-100" />

								<div className="flex flex-wrap gap-3 mt-1 items-start">
									<div className="flex flex-col flex-1">
										<p className="text-label">일정</p>
										<p className="text-value min-w-[100px]">
											{formatTestDate(
												currentTest.startDate,
												currentTest.endDate,
												userLanguage
											)}
										</p>
									</div>
									<div className="flex flex-col w-[50px] items-end">
										<p className="text-label">소요시간</p>
										<p className="text-value">{currentTest.duration || "-"}</p>
									</div>
								</div>

								<div className="h-px bg-gray-100" />

								<div className="flex flex-wrap gap-4 mt-1 items-start">
									<div className="flex flex-col flex-1">
										<p className="text-label">테스터 연령대</p>
										<p className="text-value">
											{currentTest.ages?.length === ageOptions.length
												? "제한 없음"
												: currentTest.ages
														?.map((key) => {
															const found = ageOptions.find(
																(opt) => opt.key === key
															);
															return found ? found.label : key;
														})
														.join(", ") || "-"}
										</p>
									</div>

									<div className="flex flex-col items-end w-max-[100px]">
										<p className="text-label">테스터 기기</p>
										<p className="text-value">
											{currentTest.devices?.length === deviceOptions.length
												? "제한 없음"
												: currentTest.devices
														?.map(
															(key) =>
																deviceOptions.find((opt) => opt.key === key)
																	?.label
														)
														.join(", ") || ""}
										</p>
									</div>
								</div>

								<div className="h-px bg-gray-100" />
								<p className="text-sm text-gray-600">
									{currentTest.description || "설명이 없습니다."}
								</p>
								<Button
									type="tertiary"
									size="sm"
									onClick={() => handleEdit(currentTest.id)}
									className="w-[72px] h-[40px]">
									<img
										src="/icons/edit.png"
										className="w-[13px] object-contain"
										onClick={() => handleEdit(currentTest.id)}
									/>
								</Button>
							</li>
						</ul>

						{/* 페이징 버튼 */}
						<div className="hidden md:flex justify-between w-full">
							<button
								onClick={handlePrev}
								disabled={currentIndex === 0}
								className="px-6 py-2 bg-black text-white rounded disabled:opacity-5">
								←
							</button>
							<button
								onClick={handleNext}
								disabled={currentIndex === userTests.length - 1}
								className="px-6 py-2 bg-black text-white     rounded disabled:opacity-5">
								→
							</button>
						</div>
					</div>
				</div>
			)}
		</div>
	);
};

export default TestListForMaker;
