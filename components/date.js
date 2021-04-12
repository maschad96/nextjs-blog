import { parseISO, format, addHours } from 'date-fns';

export default function Date({ dateString }) {
	let date = parseISO(dateString);
	date = addHours(date, 4)
	const dateTime = format(date, 'P');
	return <time dateTime={dateTime}>{dateTime}</time>
}