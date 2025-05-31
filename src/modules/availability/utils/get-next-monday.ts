export function getNextMonday() {
	const date = new Date();
	date.setDate(date.getDate() + ((8 - date.getDay()) % 7));
	date.setHours(0, 0, 0, 0);
	return date;
}
