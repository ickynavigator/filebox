import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import utc from 'dayjs/plugin/utc';

dayjs.extend(relativeTime);
dayjs.extend(utc);

export const timeFromNow = (date: string | Date | null) => {
  const dateToParse = dayjs.utc(date);

  const hasDateReached = dayjs.utc().isAfter(dateToParse);

  const today = dayjs.utc().endOf('day');

  return hasDateReached ? today.fromNow() : dateToParse.fromNow();
};
