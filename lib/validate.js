const config = require('../config');
const moment = require('moment');
const cnfAuth = config.auth;
const cnfIRC = config.irc;

/**
 * Determines if x is defined.
 *
 * @param      {any}      x       Any value,
 * @return     {boolean}  True if value is defined, False otherwise.
 */
const isDefined = x => typeof x !== 'undefined';

/**
 * Determines if x is an array.
 *
 * @param      {any}      x       Any value.
 * @return     {boolean}  True if x is an array, False otherwise.
 */
const isArray = x => Array.isArray(x);

/**
 * Determines if number is an integer and not NaN.
 *
 * @param      {number}   number  The number to test.
 * @return     {boolean}  True if number is an integer and not NaN, False otherwise.
 */
const isInteger = number => Number.isInteger(number) && number !== NaN;

/**
 * Determines if string contains numbers only, no leading zero.
 *
 * @param      {string}   string  The string to test.
 * @return     {boolean}  True if string is numbers only, False otherwise.
 */
const isNumbersOnly = string => /^[1-9]\d{0,2}$/.test(string);

/**
 * Determines if string is an interval of format: 5h, 1d, 2w..
 *
 * @param      {string}   string  The string to test.
 * @return     {boolean}  True if string is an interval, False otherwise.
 */
const isInterval = string => /^[1-9]\d{0,2}[smhdw]$/.test(string);

/**
 * Determines if string is a valid date of format: DD.MM.YYYY.
 *
 * @param      {string}   string    The string to test.
 * @return     {boolean}  True if string is a valid date and formated DD.MM.YYYY, False otherwise.
 */
const isDateDayFirst = string => moment(string, 'DD.MM.YYYY', true).isValid();

/**
 * Determines if string is a valid date of format: YYYY.MM.DD.
 *
 * @param      {string}   string    The string to test.
 * @return     {boolean}  True if string is a valid date and formated YYYY.MM.DD, False otherwise.
 */
const isDateYearFirst = string => moment(string, 'YYYY.MM.DD', true).isValid();

/**
 * Determines if string abides to Hidden Service domain name format.
 *
 * @param      {string}   string  The string to test.
 * @return     {boolean}  True if string matches Hidden Service domain name format, False otherwise.
 */
const isHSURL = string => /^\w{16}$/.test(string);

/**
 * Determines if client is authorized to store data.
 *
 * @param      {string}   key     The client's access key.
 * @return     {boolean}  True if authorized, False otherwise.
 */
const isAuthedAPI = key => Object.values(cnfAuth.apiKeys).includes(key);

/**
 * Determines if IRC user is authorized to run the bot command.
 *
 * @param      {string}   nick    The user's IRC nickname.
 * @return     {boolean}  True if user is authorized to run command, False otherwise.
 */
const isAuthedIRC = nickname => cnfIRC.owner.concat(cnfIRC.users).includes(nickname);

module.exports = { isDefined, isArray, isInteger, isNumbersOnly, isInterval, isDateDayFirst, isDateYearFirst, isHSURL, isAuthedAPI, isAuthedIRC };
