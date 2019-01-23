const config = require('../../config').irc;
const date = require('../../lib/date');
const db = require('../../db');
const moment = require('moment');
const validate = require('../../lib/validate');
const clientController = require('../controllers/client');
const serviceController = require('../controllers/service');
const hashController = require('../controllers/hash');

/**
 * The IRC client.
 *
 * @type       {object}
 */
let client;

/**
 * Inits the IRC client.
 *
 * @param      {object}  irc  The IRC client instance.
 * @return     {object}  The IRC client instance.
 */
const init = irc => client = irc;

/**
 * Turns the IRC message into something the bot can understand.
 *
 * @param      {string}            msg     The IRC message
 * @return     {(Object|boolean)}  The bot commands if message was understood, False otherwise.
 */
const parseMessage = msg =>
{
	// Turn message string into an array of single words.
	const chunks = msg.trim().replace(/\s\s+/g, ' ').toLowerCase().split(' ');

	// Is someone talking to us?
	if (chunks[0] !== config.botalias) return false;

	// We only take a max of 4 commands.
	if (chunks.length > 4) return false;

	// Is the action defined?
	if (!config.botCommands.actions.includes(chunks[1])) return false;

	// Can we handle the task?
	if (!config.botCommands.tasks.includes(chunks[2])) return false;

	// Is there some modifier we understand?
	if (chunks[3]) if (!validate.isNumbersOnly(chunks[3]) && !validate.isInterval(chunks[3]) && !validate.isDateDayFirst(chunks[3]) && !validate.isDateYearFirst(chunks[3]) && !validate.isHSURL(chunks[3])) return false;

	return { 'action': chunks[1], 'task': chunks[2], 'modifier': chunks[3] };
};

/**
 * Routes the IRC command.
 *
 * @param      {string}   from     The IRC nickname talking.
 * @param      {string}   to       The IRC message recipient.
 * @param      {string}   message  The message send.
 * @return     {boolean}  False if command not understood.
 */
const router = (from, to, message) =>
{
	// The bot command.
	const command = parseMessage(message);

	// Return false if message was not understood.
	if (!command) return false;

	// Client command routes.
	if (command.action === 'client')
	{
		// Allow only authorized users to access client data.
		if(!validate.isAuthedIRC(from)) return false;

		// List all clients.
		if (command.task === 'all') clientController.listAll(client, to);

		// List active clients.
		else if (command.task === 'active') clientController.listActive(client, to, command.modifier);

		// List inactive clients.
		else if (command.task === 'inactive') clientController.listInactive(client, to, command.modifier);

		// List clients by status.
		else if (command.task === 'status') clientController.listStatus(client, to, command.modifier);

		// List top x most active clients.
		else if (command.task === 'top') clientController.listTop(client, to, command.modifier);
	}

	// Hidden Service command routes.
	else if (command.action === 'service')
	{
		// Allow only authorized users to access Hidden Service data.
		if(!validate.isAuthedIRC(from)) return false;

		// Count number of seen Hidden Services.
		if (command.task === 'count') serviceController.countAll(client, to);

		// List seen Hidden Services.
		// NOTE: Can potentially echo thousands of lines to IRC!
		else if (command.task === 'list') serviceController.listInterval(client, to, command.modifier);

		// List top x most seen services.
		else if (command.task === 'top') serviceController.listTop(client, to, command.modifier);
	}

	// Hash command routes.
	else if (command.action === 'hash')
	{
		// Allow only authorized users to test all seen Hidden Service domain names against the hash (CPU intensive).
		if (command.task === 'all') { if(!validate.isAuthedIRC(from)) return false; hashController.hashAll(client, to); }

		// Allow anyone to test a single Hidden Service domain name against the hash.
		else if (command.task === 'url') hashController.hashURL(client, to, command.modifier);
	}
};

module.exports = { init, router };
