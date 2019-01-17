const db = require('../../db');
const url = require('../../lib/url');

let client;

let recipient;

const isHSURL = string => /^\w{16}$/.test(string);

const query = (db, query, params, resHandler) => db.acquire(con => { con.query(query, params, resHandler); con.release(); });

const replyTestURL = (err, res) =>
{
	const matches = res.map(host => url.test(host.uri)).filter(x => x);

	const urlSuffix = res.length > 1 ? 'URLs' : 'URL';

	const matchSuffix = matches.length === 1 ? 'match' : 'matches';

	client.say(recipient, `Checked ${res.length} ${urlSuffix}. Found ${matches.length} ${matchSuffix}`);

	if (matches) matches.map(match => client.say(recipient, `${match.fnc} ${match.url}`));
};

const hashAll = (ircClient, to) =>
{
	client = ircClient; recipient = to;

	query(db, 'select id, uri from service', [], replyTestURL);
};

const hashURL = (ircClient, to, modifier) =>
{
	client = ircClient; recipient = to;

	const mod = modifier ? modifier.toLowerCase() : false;

	if (!isHSURL(mod)) return false;

	const result = url.test(mod);

	client.say(recipient, result ? [`${result.fnc} ${result.hash}`] : [result]);
};

module.exports = { hashAll, hashURL };
