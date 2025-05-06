export default function formatTestDate(startDate, endDate, locale = "ko") {
	if (!startDate) return "";
	const start = new Date(startDate);
	const end = endDate ? new Date(endDate) : null;

	const options = {
		year: "numeric",
		month: "long",
		day: "numeric",
	};

	const formattedStart = new Intl.DateTimeFormat(locale, options).format(start);
	if (!end || start.toDateString() === end.toDateString()) {
		return formattedStart;
	}
	const formattedEnd = new Intl.DateTimeFormat(locale, options).format(end);
	return `${formattedStart} - ${formattedEnd}`;
}

export function formatSingleDate(startDate, locale = "ko") {
	if (!startDate) return "";
	const start = new Date(startDate);

	const options = {
		year: "numeric",
		month: "long",
		day: "numeric",
	};

	const formattedStart = new Intl.DateTimeFormat(locale, options).format(start);
	return `${formattedStart}`;
}
