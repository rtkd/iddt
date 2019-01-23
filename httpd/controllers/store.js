const config = require('../../config');
const date = require('../../lib/date');
const db = require('../../db');
const url = require('../../lib/url');
const validate = require('../../lib/validate');
const cnfAuth = config.auth;
const cnfIRC = config.irc;

/**
 * The IRC client.
 *
 * @type       {object}
 */
let client;

/**
 * The current date and time.
 *
 * @type       {<type>}
 */
let now;

/**
 * Inits the IRC client.
 *
 * @param      {object}  irc     The IRC client instance.
 * @return     {}
 */
const init = irc => client = irc;

/**
 * Builds Hidden Service domain name from Hidden Service descriptor.
 *
 * @param      {string}          descriptor  The base64 encoded descriptor.
 * @return     {(string|false)}  The Hidden Service domain name, False otherwise.
 */
const urlFromDescriptor = descriptor =>
{
	const desc = Buffer.from(descriptor, 'base64').toString('utf8');

	return (desc.includes('DESCRIPTOR') && desc.includes('END DESCRIPTOR')) ? url.from(desc) : false;
};

/**
 * Queries the database.
 *
 * @param      {object}    db          The database instance.
 * @param      {string}    query       The query string,
 * @param      {array}     params      The query parameters.
 * @param      {function}  resHandler  The result handler.
 * @return     {}
 */
const query = (db, query, params, resHandler) => db.acquire(con => { con.query(query, params, resHandler); con.release(); });

/**
 * Updates the client database table.
 * TODO: client status/type is not implemented as intended.
 *
 * @param      {object}  error   The query error.
 * @param      {array}   result  The query result.
 * @return     {}
 */
const handleClient = (error, result) =>
{
	// New client?
	if (result.length === 0) query(db, 'insert into client set ?', { 'uri': clientIP, 'first': now, 'last': now, 'type': 1, 'hits': 1 }, () => { });

	// Existing client?
	else if (result.length === 1)
	{
		const id = result[0].id;
		const type = result[0].type === 2 ? 3 : result[0].type;
		const hits = result[0].hits + 1;

		query(db, 'update client set ? where id=?', [{ 'last': now, 'type': type, 'hits': hits }, id], () => { });
	}
};

/**
 * Updates the service database table.
 * TODO: client status/type is not implemented as intended.
 *
 * @param      {object}  error   The query error.
 * @param      {array}   result  The query result.
 * @return     {}
 */
const handleService = (error, result) =>
{
	// New Hidden Service?
	if (result.length === 0) query(db, 'insert into service set ?', { 'uri': hsURL, 'first': now, 'last': now, 'type': 1, 'hits': 1 }, () => { });

	// Existing Hidden Service?
	else if (result.length === 1)
	{
		const id = result[0].id;
		const type = result[0].type === 2 ? 3 : result[0].type;
		const hits = result[0].hits + 1;

		query(db, 'update service set ? where id=?', [{ 'last': now, 'type': type, 'hits': hits }, id], () => { });
	}
};

/**
 * Stores data send by client.
 *
 * @param      {object}  request   The HTTPD request.
 * @param      {object}  response  The HTTPD response.
 * @return     {}
 */
const storePacket = (request, response) =>
{
	// If the client is not authorized to store data, end the connection.
	if (!validate.isAuthedAPI(request.body.user)) { response.end('0\n'); return false; }

	now = date.getNowYearFirst();
	const clientIP = request.ip;
	const clientData = request.body.data;

	// Did we get a domain name or a descriptor?
	const hsURL = validate.isHSURL(clientData) ? clientData : urlFromDescriptor(clientData);

	// If we do not have a domain name at this point, inform the client and end the connection.
	if (!hsURL) { response.end('malformed descriptor or url\n'); return false; }

	// If domain name matches our hash, inform the IRC main channel.
	if (url.test(hsURL)) client.say(cnfIRC.mainchannel, `Hash found ${hsURL}`);

	// Update the client data.
	query(db, 'select id, type, hits from client where uri=?', [clientIP], handleClient);

	// Update the Hidden Service data.
	query(db, 'select id, type, hits from service where uri=?', [hsURL], handleService);

	// Inform client about getting the request and end the connection.
	response.end('ok\n');
};

module.exports = { init, storePacket };
