import { parseISO, format } from 'date-fns';

export default function Date({ dateString }) {
	const date = parseISO(dateString);
	const dateTime = format(date, 'P');
	return <time dateTime={dateTime}>{format(dateTime, 'LLLL d, yyyy')}</time>
}