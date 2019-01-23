const moment = require('moment');

/**
 * Converts date from year first to day first.
 *
 * @param      {string}  date    The date to format.
 * @return     {string}  The date formated as DD-MM-YYYY HH:mm:ss.
 */
const toDateDayFirst = date => moment(date, 'YYYY-MM-DD HH:mm:ss').format('DD-MM-YYYY HH:mm:ss');

/**
 * Converts date from day first to year first.
 *
 * @param      {string}  date    The date to format.
 * @return     {string}  The date formated as YYYY-MM-DD HH:mm:ss.
 */
const toDateYearFirst = date => moment(date, 'DD-MM-YYYY HH:mm:ss').format('YYYY-MM-DD HH:mm:ss');

/**
 * Gets the current date and time, day first.
 *
 * @return     {string}  The current date and time, day first.
 */
const getNowDayFirst = () => moment().format('DD-MM-YYYY HH:mm:ss');

/**
 * Gets the current date and time, year first.
 *
 * @return     {string}  The current date and time, year first.
 */
const getNowYearFirst = () => moment().format('YYYY-MM-DD HH:mm:ss');

module.exports = { toDateDayFirst, toDateYearFirst, getNowDayFirst, getNowYearFirst };
