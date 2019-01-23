const date = require('../../lib/date');
const db = require('../../db');
const moment = require('moment');
const url = require('../../lib/url');
const validate = require('../../lib/validate');

/**
 * The IRC client.
 *
 * @type       {object}
 */
let client;

/**
 * The IRC channel or username to reply to.
 *
 * @type       {string}
 */
let recipient;

/**
 * Queries the database.
 *
 * @param      {object}    db          The database instance.
 * @param      {string}    query       The query string.
 * @param      {array}     params      The query parameters.
 * @param      {function}  resHandler  The result handler.
 * @return     {}
 */
const query = (db, query, params, resHandler) => db.acquire(con => { con.query(query, params, resHandler); con.release(); });

/**
 * Workaround query failing when query placeholder at the end of query string.
 */
const queryIntervals = ['second', 'minute', 'hour', 'day', 'week'];
const queryClientsActive = queryIntervals.reduce((obj, interval, i) => ({ ...obj, [interval.slice(0, 1)]: `select * from client where last > date_sub(now(), interval ? ${interval}) and last <= now() order by uri` }), { });
const queryClientsInactive = queryIntervals.reduce((obj, interval, i) => ({ ...obj, [interval.slice(0, 1)]: `select * from client where last < date_sub(now(), interval ? ${interval}) order by uri` }), { });

/**
 * Echos client data to IRC.
 *
 * @param      {object}   error   The query error.
 * @param      {array}    result  The query result.
 * @return     {boolean}  False if query did not return a result.
 */
const replyClient = (error, result) =>
{
	if (!result) return false;

	result.map(row => client.say(recipient, `IP: ${row.uri} // First: ${date.toDateYearFirst(row.first)} // Last: ${date.toDateYearFirst(row.last)} // Status: ${row.type} // Hits: ${row.hits}`));
};

/**
 * Queries all clients.
 *
 * @param      {object}   irc     The IRC client instance.
 * @param      {string}   to      The IRC message recipient.
 * @return     {}
 */
const listAll = (irc, to) =>
{
	client = irc; recipient = to;

	query(db, 'select * from client', [], replyClient);
};

/**
 * Queries all active clients within interval or at date.
 *
 * @param      {object}   irc       The IRC client instance.
 * @param      {string}   to        The IRC message recipient.
 * @param      {string}   modifier  The interval or date to get clients for.
 * @return     {boolean}  False if modifier is malformed.
 */
const listActive = (irc, to, modifier) =>
{
	client = irc; recipient = to;

	if (validate.isInterval(modifier))
	{
		const quantity = modifier.slice(0, modifier.length - 1);

		const interval = modifier.slice(-1);

		query(db, queryClientsActive[interval], [quantity], replyClient);
	}

	else if (validate.isDateDayFirst(modifier))
	{
		const dayStart = moment(`${modifier} 00:00:00`, 'DD-MM-YYYY HH:mm:ss').format('YYYY-MM-DD HH:mm:ss');

		const dayEnd = moment(`${modifier} 23:59:59`, 'DD-MM-YYYY HH:mm:ss').format('YYYY-MM-DD HH:mm:ss');

		query(db, 'select * from client where first between ? and ? or last between ? and ? order by uri', [dayStart, dayEnd, dayStart, dayEnd], replyClient);
	}

	else if (validate.isDateYearFirst(modifier))
	{
		const dayStart = moment(`${modifier} 00:00:00`, 'YYYY-MM-DD HH:mm:ss').format('YYYY-MM-DD HH:mm:ss');

		const dayEnd = moment(`${modifier} 23:59:59`, 'YYYY-MM-DD HH:mm:ss').format('YYYY-MM-DD HH:mm:ss');

		query(db, 'select * from client where first between ? and ? or last between ? and ? order by uri', [dayStart, dayEnd, dayStart, dayEnd], replyClient);
	}

	else return false;
};

/**
 * Queries all inactive clients within interval or at date.
 * TODO: build me.
 *
 * @param      {object}   irc       The IRC client instance.
 * @param      {string}   to        The IRC message recipient.
 * @param      {string}   modifier  The interval or date to get clients for.
 * @return     {}
 */
const listInactive = (irc, to, modifier) => false;

/**
 * Queries client with status code x.
 * 0 = not sending data, 1 = sending descriptors, 2 = sending URLs, 3 = sending both.
 *
 * @param      {object}   irc         The IRC client instance.
 * @param      {string}   to          The IRC message recipient.
 * @param      {string}   statusCode  The status code.
 * @return     {boolean}  False if statusCode is not a defined status code.
 */
const listStatus = (irc, to, statusCode) =>
{
	client = irc; recipient = to;

	const mod = parseInt(statusCode);

	if (![0, 1, 2, 3].includes(mod)) return false;

	query(db, `select * from client where type=? order by uri`, [mod], replyClient);
};

/**
 * List the x most active clients.
 *
 * @param      {object}   irc      The IRC client instance.
 * @param      {string}   to       The IRC message recipient.
 * @param      {string}   topMost  The number of clients to list.
 * @return     {boolean}  False if topMost is not an integer.
 */
const listTop = (irc, to, topMost) =>
{
	client = irc; recipient = to;

	if (!validate.isNumbersOnly(topMost)) return false;

	const mod = parseInt(topMost);

	query(db, 'select * from client order by hits desc limit 0,?', [mod], replyClient);
};

module.exports = { listAll, listActive, listInactive, listStatus, listTop };
