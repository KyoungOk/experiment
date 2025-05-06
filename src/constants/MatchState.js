export class MatchState {
	static testerInterest = "testerInterest";
	static dateSuggest = "dateSuggest";
	static testerAccept = "testerAccept";
	static makerCancel = "makerCancel";
	static testerCancel = "testerCancel";
	static doneTest = "doneTest";
	static makerPending = "makerPending";
	static makerApproved = "makerApproved";
	static testerDone = "testerDone";
}

export const ongoingStates = [
	MatchState.testerInterest,
	MatchState.makerCancel,
	MatchState.dateSuggest,
	MatchState.testerCancel,
	MatchState.makerPending,
];
export const editableStates = [
	MatchState.testerInterest,
	MatchState.makerCancel,
];
export const matchStatusMap = {
	[MatchState.testerInterest]: {
		color: "bg-red-500",
		label: "테스터가 관심을 표현하였습니다",
	},
	[MatchState.dateSuggest]: {
		color: "bg-brandPurple",
		label: "테스터가 일정 확인중입니다.",
	},
	[MatchState.testerAccept]: {
		color: "bg-green-500",
		label: "일정 확정되었습니다.",
	},
	[MatchState.makerCancel]: {
		color: "bg-gray-400",
		label: "일정을 취소했습니다.",
	},
	[MatchState.testerCancel]: {
		color: "bg-gray-400",
		label: "테스터가 취소하였습니다",
	},
	[MatchState.doneTest]: {
		color: "bg-blue-500",
		label: "테스트 완료!",
	},
	[MatchState.makerPending]: {
		color: "bg-gray-400",
		label: "보류한 테스터입니다.",
	},
	[MatchState.testerDone]: {
		color: "bg-gray-400",
		label: "완료하였습니다",
	},
};

export const matchTesterStatusMap = {
	[MatchState.testerInterest]: {
		color: "bg-red-500",
		label: "일정을 지정해주세요!",
	},
	[MatchState.dateSuggest]: {
		color: "bg-brandPurple",
		label: "테스트 일정을 확인하기",
	},
	[MatchState.testerAccept]: {
		color: "bg-green-500",
		label: "일정 확정되었습니다.",
	},
	[MatchState.makerCancel]: {
		color: "bg-gray-400",
		label: "일정을 취소했습니다.",
	},
	[MatchState.testerCancel]: {
		color: "bg-gray-400",
		label: "테스터가 일정을 했습니다.",
	},
	[MatchState.doneTest]: {
		color: "bg-blue-500",
		label: "테스트 완료!",
	},
	[MatchState.makerPending]: {
		color: "bg-gray-400",
		label: "",
	},
	[MatchState.testerDone]: {
		color: "bg-gray-400",
		label: "완료하였습니다",
	},
};
