const db = require('../../db');
const moment = require('moment');

let client;

let recipient;

const isInteger = number => Number.isInteger(number) && number !== NaN;

const isInterval = string => /^[1-9]\d{0,1}[smhdw]$/.test(string);

const isDate = string => moment(string, 'DD.MM.YYYY', true).isValid();

const isHSURL = string => /^\w{16}$/.test(string);

const toISODate = date => date.toISOString().replace(/T/, ' ').replace(/\..+/, '');

const forceInteger = string => parseInt(string.replace(/\D/g, ''));

const query = (db, query, params, resHandler) => db.acquire(con => { con.query(query, params, resHandler); con.release(); });

const queryIntervals = ['second', 'minute', 'hour', 'day', 'week'];

const queryClientsActive = queryIntervals.reduce((obj, interval, i) => ({ ...obj, [interval.slice(0, 1)]: `select * from client where last > date_sub(now(), interval ? ${interval}) and last <= now() order by uri` }), { });

const queryClientsInactive = queryIntervals.reduce((obj, interval, i) => ({ ...obj, [interval.slice(0, 1)]: `select * from client where last < date_sub(now(), interval ? ${interval}) order by uri` }), { });

const replyMultiLine = (err, res) => { if (!res) return false; res.map(row => client.say(recipient, `IP: ${row.uri} // First: ${toISODate(row.first)} // Last: ${toISODate(row.last)} // Status: ${row.type} // Hits: ${row.hits}`)) };

const listAll = (ircClient, to) =>
{
	client = ircClient; recipient = to;

	query(db, 'select * from client', [], replyMultiLine);
};

const listActive = (ircClient, to, modifier) =>
{
	client = ircClient; recipient = to;

	if (isInterval(modifier))
	{
		const quantity = modifier.slice(0, modifier.length - 1);

		const interval = modifier.slice(-1);

		query(db, queryClientsActive[interval], [quantity], replyMultiLine);
	}

	else if (isDate(modifier))
	{
		const dayStart = moment(`${modifier} 00:00:00`, 'DD-MM-YYYY hh:mm:ss').format('YYYY-MM-DD HH:mm:ss');

		const dayEnd = moment(`${modifier} 23:59:59`, 'DD-MM-YYYY hh:mm:ss').format('YYYY-MM-DD HH:mm:ss');

		query(db, 'select * from client where first between ? and ? or last between ? and ? order by uri', [dayStart, dayEnd, dayStart, dayEnd], replyMultiLine);
	}
};

const listInactive = (ircClient, to, modifier) =>
{
	client = ircClient; recipient = to;

	if (isInterval(modifier))
	{
		const quantity = modifier.slice(0, modifier.length - 1);

		const interval = modifier.slice(-1);

		query(db, queryClientsInactive[interval], [quantity], replyMultiLine);
	}

	else if (isDate(modifier))
	{
		const dayStart = moment(`${modifier} 00:00:00`, 'DD-MM-YYYY hh:mm:ss').format('YYYY-MM-DD HH:mm:ss');

		const dayEnd = moment(`${modifier} 23:59:59`, 'DD-MM-YYYY hh:mm:ss').format('YYYY-MM-DD HH:mm:ss');

		//query(db, 'select * from client where first between ? and ? or last between ? and ? order by uri', [dayStart, dayEnd, dayStart, dayEnd], replyMultiLine);
	}
};

const listStatus = (ircClient, to, modifier) =>
{
	client = ircClient; recipient = to;

	const mod = forceInteger(modifier);

	if (![0, 1, 2, 3].includes(mod)) return false;

	query(db, `select * from client where type=? order by uri`, [mod], replyMultiLine);
};

const listTop = (ircClient, to, modifier) =>
{
	client = ircClient; recipient = to;

	const mod = forceInteger(modifier);

	if (!isInteger(mod)) return false;

	query(db, 'select * from client order by hits desc limit 0,?', [mod], replyMultiLine);
};

module.exports = { listAll, listActive, listInactive, listStatus, listTop };
