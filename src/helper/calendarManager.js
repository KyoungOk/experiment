export const addToGoogleCalendar = async (
	title,
	details,
	location,
	startTime,
	endTime
) => {
	//(title, details, location, startTime, endTime);
	const baseUrl = "https://calendar.google.com/calendar/render";
	const params = new URLSearchParams({
		action: "TEMPLATE",
		text: title,
		details: details,
		location: location,
		dates: `${formatDate(startTime)}/${formatDate(endTime)}`,
	});

	window.open(`${baseUrl}?${params.toString()}`, "_blank");
};

const formatDate = (date) => {
	// Google Calendar용 포맷 (UTC 기준)
	return new Date(date).toISOString().replace(/[-:]|\.\d{3}/g, "");
};

export const isGoogleEmail = (email) => {
	if (!email) return false;
	return (
		email.endsWith("@gmail.com") ||
		email.endsWith("@googlemail.com") ||
		email.includes("gsuite")
	); // 유연하게
};

export const downloadIcsFile = async (
	title,
	details,
	location,
	startTime,
	endTime
) => {
	const start = new Date(startTime).toISOString().replace(/[-:]|\.\d{3}/g, "");
	const end = new Date(endTime).toISOString().replace(/[-:]|\.\d{3}/g, "");

	const icsContent = `
BEGIN:VCALENDAR
VERSION:2.0
BEGIN:VEVENT
SUMMARY:${title}
DESCRIPTION:${details}
LOCATION:${location}
DTSTART:${start}
DTEND:${end}
END:VEVENT
END:VCALENDAR
	`.trim();

	const blob = new Blob([icsContent], { type: "text/calendar;charset=utf-8" });
	const url = URL.createObjectURL(blob);
	const a = document.createElement("a");
	a.href = url;
	a.download = `${title}.ics`;
	a.click();
	URL.revokeObjectURL(url);
};
