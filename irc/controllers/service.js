const db = require('../../db');
const moment = require('moment');

let client;

let recipient;

const isInteger = number => Number.isInteger(number) && number !== NaN;

const isInterval = string => /^[1-9]\d{0,1}[smhdw]$/.test(string);

const isDate = string => moment(string, 'DD.MM.YYYY', true).isValid(); //const isDate = string => /^[1-9]\d{0,1}\.[1-9]\d{0,1}$/.test(string);

const isHSURL = string => /^\w{16}$/.test(string);

const toISODate = date => date.toISOString().replace(/T/, ' ').replace(/\..+/, '');

const forceInteger = string => parseInt(string.replace(/\D/g, ''));

const query = (db, query, params, resHandler) => db.acquire(con => { con.query(query, params, resHandler); con.release(); });

const queryIntervals = ['second', 'minute', 'hour', 'day', 'week'];

const queryServiceActive = queryIntervals.reduce((obj, interval, i) => ({ ...obj, [interval.slice(0, 1)]: `select * from service where last > date_sub(now(), interval ? ${interval}) and last <= now() order by uri asc` }), { });

const queryServiceInactive = queryIntervals.reduce((obj, interval, i) => ({ ...obj, [interval.slice(0, 1)]: `select * from service where last < date_sub(now(), interval ? ${interval}) order by uri asc` }), { });

const replyMultiLine = (err, res) => { if (!res) return false; res.map(row => client.say(recipient, `IP: ${row.uri} // Status: ${row.type} // First: ${toISODate(row.first)} // Last: ${toISODate(row.last)} // Hits: ${row.hits}`)) };

const replyNumber = (err, res) => client.say(recipient, res[0].rows);

const countAll = (ircClient, to) =>
{
	client = ircClient; recipient = to;

	query(db, 'select count(id) as rows from service', [], replyNumber);
};

const listAll = (ircClient, to) =>
{
	client = ircClient; recipient = to;

	query(db, 'select * from service order by uri asc limit 0,?', [10], replyMultiLine);
};

const listInterval = (ircClient, to, modifier) =>
{
	client = ircClient; recipient = to;

	if (isInterval(modifier))
	{
		const quantity = modifier.slice(0, modifier.length - 1);

		const interval = modifier.slice(-1);

		query(db, queryServiceActive[interval], [quantity], replyMultiLine);
	}

	else if (isDate(modifier))
	{
		const dayStart = moment(`${modifier} 00:00:00`, 'DD-MM-YYYY hh:mm:ss').format('YYYY-MM-DD HH:mm:ss');

		const dayEnd = moment(`${modifier} 23:59:59`, 'DD-MM-YYYY hh:mm:ss').format('YYYY-MM-DD HH:mm:ss');

		query(db, 'select * from service where (first between ? and ?) or (last between ? and ?) order by uri asc', [dayStart, dayEnd, dayStart, dayEnd], replyMultiLine);
	}
};

const listTop = (ircClient, to, modifier) =>
{
	client = ircClient; recipient = to;

	const mod = forceInteger(modifier);

	if (!isInteger(mod)) return false;

	query(db, 'select * from service order by hits desc limit 0,?', [mod], replyMultiLine);
};

module.exports = { countAll, listAll, listInterval, listTop };
