import moment from 'moment-timezone';

export const SECOND = 1;
export const MINUTE = 60 * SECOND;
export const HOUR = 60 * MINUTE;
export const DAY = 24 * HOUR;

export const MILLISECONDS = {
  SECOND: 1000,
  MINUTE: SECOND * 60,
  HOUR: MINUTE * 60,
  DAY: HOUR * 24,
};

export function now() {
  return moment().unix();
}

export function fromNow(seconds) {
  return now() + seconds;
}

export function fromStartOfDay(seconds) {
  const startOfDay = moment().startOf('day').unix();
  return Math.floor(startOfDay + seconds);
}

export const date = function (seconds) {
  if (!seconds) return new Date();
  const millis = seconds * 1000;
  return new Date(millis);
};

export const fromDate = function (millis) {
  return Math.floor(new Date(millis).getTime() / 1000);
};

export const format = function (
  secondsSinceEpoch,
  format = 'M/DD/YYYY h:mma',
  timezone = 'America/Denver',
) {
  if (!timezone) timezone = 'America/Denver';
  const millis = date(secondsSinceEpoch);
  return moment(millis).tz(timezone).format(format);
};

export const getStartOfHour = (seconds) => {
  return moment(seconds * 1000)
    .startOf('hour')
    .unix();
};

export const getStartOfDay = (seconds) => {
  return moment(seconds * 1000)
    .startOf('day')
    .unix();
};

export const getStartOfWeek = (seconds) => {
  return moment(seconds * 1000)
    .startOf('week')
    .unix();
};

export const getStartOfMonth = (seconds) => {
  return moment(seconds * 1000)
    .startOf('month')
    .unix();
};

export const getStartOfYear = (seconds) => {
  return moment(seconds * 1000)
    .startOf('year')
    .unix();
};

/**
 * Compute a Unix timestamp `days` in the future (from now) at the time
 * 23:59:59, adjusting for some timezone offset.
 *
 * @param {number} days Number of days in the future.
 * @param {string} timezone Timezone which defaults to 'America/Denver'.
 *
 * @returns {number} Unix timestamp.
 */
export const endOfDayFromNow = (days, timezone = 'America/Denver') => {
  const startDaySeconds = getStartOfDay(now());
  const dayInFutureSeconds = startDaySeconds + (days + 1) * DAY;
  return moment(dayInFutureSeconds * 1000)
    .tz(timezone)
    .set({
      hour: 23,
      minute: 59,
      second: 59,
      millisecond: 0,
    })
    .unix();
};

export const getDateByOffset = (offset, date) => {
  const format = 'YYYY/MM/DD HH:mm:ss';
  if (!date) {
    date = new Date();
  }
  const newDate = moment(date).utcOffset(offset).format(format);

  const timestamp = Date.parse(newDate);

  return new Date(timestamp);
};
