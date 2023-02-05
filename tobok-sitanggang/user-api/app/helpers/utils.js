const rangeDates = (startDate, endDate, excludeDays = [], excludeDates = [], clientTimezone = 'Asia/Jakarta') => {
    const dayjs = require('dayjs');
    const utc = require('dayjs/plugin/utc');
    const timezone = require('dayjs/plugin/timezone');
    dayjs.extend(utc);
    dayjs.extend(timezone);

    dayjs.tz(clientTimezone);
    let start = dayjs(startDate);
    let end = dayjs(endDate);
    // let totalDays = dayjs(startDate).diff(endDate, 'day') + 1;

    let dates = [start.format()];
    while (start < end) {
        start = start.add(1, 'day');
        dates.push(start.format());
    }

    let results = [];

    if (excludeDays.length > 0) {
        results = dates.filter((date) => !excludeDays.includes(dayjs(date).format('dddd')));
        if (excludeDates.length > 0) {
            results = results.filter((date) => !excludeDates.includes(dayjs(date).format()));
        }
        return results;
    }

    if (excludeDates.length > 0) {
        results = dates.filter((date) => !excludeDates.includes(dayjs(date).format()));
        return results;
    }

    results = dates;
    return results;
};

const createDate = (day, defauTimezone = 'Asia/Jakarta') => {
    const dayjs = require('dayjs');
    const utc = require('dayjs/plugin/utc');
    const timezone = require('dayjs/plugin/timezone');
    dayjs.extend(utc);
    dayjs.extend(timezone);

    let date = null;
    if (day) date = dayjs(day).tz(defauTimezone);
    else date = dayjs().tz(defauTimezone);
    return date.format();
};

const isDateInPast = (date) => {
    const dayjs = require('dayjs');
    const relativeTime = require('dayjs/plugin/relativeTime');
    dayjs.extend(relativeTime);

    const now = dayjs(date).fromNow();
    return now.indexOf('ago') > 0 ? true : false;
};

const dateDiff = (startDate, endDate, label = 'day') => {
    const dayjs = require('dayjs');
    const start = dayjs(startDate);
    const end = dayjs(endDate);

    return start.diff(end, label);
};

module.exports = {
    DateDiff: dateDiff,
    CreateDate: createDate,
    IsDateInPast: isDateInPast
};
