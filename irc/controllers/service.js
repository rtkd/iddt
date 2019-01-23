const date = require('../../lib/date');
const db = require('../../db');
const moment = require('moment');
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
const queryServiceActive = queryIntervals.reduce((obj, interval, i) => ({ ...obj, [interval.slice(0, 1)]: `select * from service where last > date_sub(now(), interval ? ${interval}) and last <= now() order by uri asc` }), { });

/**
 * Echos Hidden Service data to IRC.
 *
 * @param      {object}   error   The query error.
 * @param      {array}    result  The query result.
 * @return     {boolean}  False if query did not return a result.
 */
const replyService = (error, result) =>
{
	if (!result) return false;

	result.map(row => client.say(recipient, `IP: ${row.uri} // Status: ${row.type} // First: ${date.toDateYearFirst(row.first)} // Last: ${date.toDateYearFirst(row.last)} // Hits: ${row.hits}`));
};

/**
 * Echos a amount of affected Hidden Services to IRC.
 *
 * @param      {object}   error   The query error.
 * @param      {array}    result  The query result.
 * @return     {boolean}  False if query did not return a result.
 */
const replyAffected = (error, result) =>
{
	if (!result) return false;

	client.say(recipient, result[0].rows); };

/**
 * Queries the amount of seen Hidden Services.
 *
 * @param      {object}  irc     The IRC client instance.
 * @param      {string}  to      The IRC message recipient.
 * @return     {}
 */
const countAll = (irc, to) =>
{
	client = irc; recipient = to;

	query(db, 'select count(id) as rows from service', [], replyAffected);
};

/**
 * Queries all seen Hidden Services.
 *
 * @param      {object}  irc     The IRC client instance.
 * @param      {string}  to      The IRC message recipient.
 * @return     {}
 */
const listAll = (irc, to) =>
{
	client = irc; recipient = to;

	query(db, 'select * from service order by uri asc limit 0,?', [10], replyService);
};

/**
 * Queries seen Hidden Services within interval or at date.
 *
 * @param      {object}  irc       The IRC client instance.
 * @param      {string}  to        The IRC message recipient.
 * @param      {string}  modifier  The interval or date to get seen Hidden Services.
 * @return     {}
 */
const listInterval = (irc, to, modifier) =>
{
	client = irc; recipient = to;

	if (validate.isInterval(modifier))
	{
		const quantity = modifier.slice(0, modifier.length - 1);

		const interval = modifier.slice(-1);

		query(db, queryServiceActive[interval], [quantity], replyService);
	}

	else if (validate.isDateDayFirst(modifier))
	{
		const dayStart = moment(`${modifier} 00:00:00`, 'DD-MM-YYYY HH:mm:ss').format('YYYY-MM-DD HH:mm:ss');

		const dayEnd = moment(`${modifier} 23:59:59`, 'DD-MM-YYYY HH:mm:ss').format('YYYY-MM-DD HH:mm:ss');

		query(db, 'select * from service where first between ? and ? or last between ? and ? order by uri asc', [dayStart, dayEnd, dayStart, dayEnd], replyService);
	}

	else if (validate.isDateYearFirst(modifier))
	{
		const dayStart = moment(`${modifier} 00:00:00`, 'YYYY-MM-DD HH:mm:ss').format('YYYY-MM-DD HH:mm:ss');

		const dayEnd = moment(`${modifier} 23:59:59`, 'YYYY-MM-DD HH:mm:ss').format('YYYY-MM-DD HH:mm:ss');

		query(db, 'select * from service where first between ? and ? or last between ? and ? order by uri', [dayStart, dayEnd, dayStart, dayEnd], replyService);
	}

	else return false;
};

/**
 * List the x most seen Hidden Services.
 *
 * @param      {object}   irc      The IRC client instance.
 * @param      {string}   to       The IRC message recipient.
 * @param      {string}   topMost  The number of Hidden Services to list.
 * @return     {boolean}  False if topMost is not an integer.
 */
const listTop = (irc, to, modifier) =>
{
	client = irc; recipient = to;

	if (!validate.isNumbersOnly(topMost)) return false;

	const mod = parseInt(topMost);

	query(db, 'select * from service order by hits desc limit 0,?', [mod], replyService);
};

module.exports = { countAll, listAll, listInterval, listTop };
