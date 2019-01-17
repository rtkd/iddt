const cnfAuth = require('../../config').auth;
const cnfIRC = require('../../config').irc;
const db = require('../../db');
const url = require('../../lib/url');
const moment = require('moment');

/**
 * The IRC client.
 *
 * @type       {<type>}
 */
let client;

/**
 * Init the IRC client.
 *
 * @param      {<type>}  irc     The irc
 * @return     {<type>}  { description_of_the_return_value }
 */
const init = irc => client = irc;

/**
 * Gets now.
 *
 * @return     {<type>}  The now.
 */
const getNow = () => moment().format('YYYY:MM:DD HH:mm:ss');

/**
 * Checks if client is authorized to store data.
 *
 * @param      {<type>}   key     The key
 * @return     {boolean}  True if authed, False otherwise.
 */
const isAuthed = key => Object.values(cnfAuth.apiKeys).includes(key);

/**
 * Determines if string is a Hidden Service URL.
 *
 * @param      {<type>}   string  The string
 * @return     {boolean}  True if hsurl, False otherwise.
 */
const isHSURL = string => /^[a-z0-9]{16}$/.test(string);

/**
 * Queries the DB.
 *
 * @param      {<type>}    db          The database
 * @param      {Function}  query       The query
 * @param      {<type>}    params      The parameters
 * @param      {<type>}    resHandler  The resource handler
 * @return     {<type>}    { description_of_the_return_value }
 */
const query = (db, query, params, resHandler) => db.acquire(con => { con.query(query, params, resHandler); con.release(); });

/**
 * Stores a packet.
 *
 * @param      {<type>}           request  The request
 * @param      {number}           result   The result
 * @return     {(Array|boolean)}  { description_of_the_return_value }
 */
const storePacket = (request, result) =>
{
	if (!isAuthed(request.body.user)) { result.end('0\n'); return false; }

	const now = getNow();
	const clientIP = request.ip;
	const clientData = request.body.data;

	/**
	 * Builds HS URL from HS descriptor
	 *
	 * @param      {<type>}  b64     The b 64
	 * @return     {Array}   { description_of_the_return_value }
	 */
	const urlFromDescriptor = b64 =>
	{
		const descriptor = Buffer.from(b64, 'base64').toString('utf8');

		return (descriptor.includes('DESCRIPTOR') && descriptor.includes('END DESCRIPTOR')) ? url.from(descriptor) : false;
	}

	const hsURL = isHSURL(clientData) ? clientData : urlFromDescriptor(clientData);

	if (!hsURL) { result.end('malformed descriptor or url\n'); return false; }

	if (url.test(hsURL)) client.say(cnfIRC.mainchannel, `Hash found ${hsURL}`);

	/**
	 * Updates the client data.
	 *
	 * @param      {<type>}  error   The error
	 * @param      {number}  result  The result
	 * @return     {<type>}  { description_of_the_return_value }
	 */
	const handleClient = (error, result) =>
	{
		if (result.length === 0) query(db, 'insert into client set ?', { 'uri': clientIP, 'first': now, 'last': now, 'type': 1, 'hits': 1 }, () => { });

		else if (result.length === 1)
		{
			const id = result[0].id;
			const type = result[0].type === 2 ? 3 : result[0].type;
			const hits = result[0].hits + 1;

			query(db, 'update client set ? where id=?', [{ 'last': now, 'type': type, 'hits': hits }, id], () => { });
		}
	};

	/**
	 * Updates the service data.
	 *
	 * @param      {<type>}  error   The error
	 * @param      {number}  result  The result
	 * @return     {<type>}  { description_of_the_return_value }
	 */
	const handleService = (error, result) =>
	{
		if (result.length === 0) query(db, 'insert into service set ?', { 'uri': hsURL, 'first': now, 'last': now, 'type': 1, 'hits': 1 }, () => { });

		else if (result.length === 1)
		{
			const id = result[0].id;
			const type = result[0].type === 2 ? 3 : result[0].type;
			const hits = result[0].hits + 1;

			query(db, 'update service set ? where id=?', [{ 'last': now, 'type': type, 'hits': hits }, id], () => { });
		}
	};

	query(db, 'select id, type, hits from client where uri=?', [clientIP], handleClient);

	query(db, 'select id, type, hits from service where uri=?', [hsURL], handleService);

	result.end('ok\n');
};

module.exports = { init, storePacket };
