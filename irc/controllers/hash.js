const db = require('../../db');
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
 * Tests a Hidden Service domain name against the hashes and echos results to IRC.
 *
 * @param      {object}  err     The error.
 * @param      {array}   res     The query result.
 * @return     {}
 */
const replyTestURL = (err, res) =>
{
	const matches = res.map(host => url.test(host.uri)).filter(x => x);

	const urlSuffix = res.length > 1 ? 'URLs' : 'URL';

	const matchSuffix = matches.length === 1 ? 'match' : 'matches';

	client.say(recipient, `Checked ${res.length} ${urlSuffix}. Found ${matches.length} ${matchSuffix}`);

	if (matches) matches.map(match => client.say(recipient, `${match.fnc} ${match.url}`));
};

/**
 * Tests all seen Hidden Service domain names against the hashes.
 *
 * @param      {object}  ircClient  The IRC client.
 * @param      {string}  to         The IRC recipient.
 * @return     {}
 */
const hashAll = (ircClient, to) =>
{
	client = ircClient; recipient = to;

	query(db, 'select id, uri from service', [], replyTestURL);
};

/**
 * Tests a Hidden Service domain name against the hashes and echos result to IRC.
 *
 * @param      {object}   ircClient  The IRC client.
 * @param      {string}   to         The IRC recipient.
 * @param      {string}   domain     The Hidden Service domain name.
 * @return     {boolean}  False if domain name is not 16 char a-z0-9.
 */
const hashURL = (ircClient, to, domain) =>
{
	client = ircClient; recipient = to;

	const dom = domain ? domain.toLowerCase() : false;

	if (!validate.isHSURL(dom)) return false;

	const result = url.test(dom);

	client.say(recipient, result ? [`${result.fnc} ${result.hash}`] : [result]);
};

module.exports = { hashAll, hashURL };
