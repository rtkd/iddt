const cnf = require('../../config').irc;
const moment = require('moment');
const clientController = require('../controllers/client');
const serviceController = require('../controllers/service');
const hashController = require('../controllers/hash');

/**
 * The IRC client.
 *
 * @type       {<type>}
 */
let ircClient;

/**
 * Init the IRC client.
 *
 * @param      {<type>}  client  The client
 * @return     {<type>}  { description_of_the_return_value }
 */
const init = client => ircClient = client;

/**
 * Determines if number is an integer and not NaN.
 *
 * @param      {<type>}   number  The number
 * @return     {boolean}  True if integer, False otherwise.
 */
const isInteger = number => Number.isInteger(number) && number !== NaN;

/**
 * Determines if string represents an interval (5h, 1d, 2w..)
 *
 * @param      {<type>}   string  The string
 * @return     {boolean}  True if interval, False otherwise.
 */
const isInterval = string => /^[1-9]\d{0,1}[smhdw]$/.test(string);

/**
 * Determines if string is a valid date.
 *
 * @param      {<type>}   string  The string
 * @return     {boolean}  True if date, False otherwise.
 */
const isDate = string => moment(string, "DD.MM.YYYY", true).isValid();

/**
 * Determines if string is a HS URL.
 *
 * @param      {<type>}   string  The string
 * @return     {boolean}  True if hsurl, False otherwise.
 */
const isHSURL = string => /^\w{16}$/.test(string);

/**
 * Determines if user is authorized to access data.
 *
 * @param      {<type>}   nick    The nick
 * @return     {boolean}  True if authed, False otherwise.
 */
const isAuthed = nick => cnf.owner.concat(cnf.users).filter(user => user === nick).length === 1 ? true : false;

/**
 * Turn string into an integer;
 *
 * @param      {string}  string  The string
 * @return     {<type>}  { description_of_the_return_value }
 */
const stringToInteger = string => parseInt(string.replace(/\D/g, ''));

/**
 * Turn the IRC message into something the bot can understand.
 *
 * @param      {string}            msg     The message
 * @return     {(Object|boolean)}  { description_of_the_return_value }
 */
const parseMessage = msg =>
{
	const chunks = msg.trim().replace(/\s\s+/g, ' ').toLowerCase().split(' ');

	if (chunks[0] !== cnf.botalias) return false;

	if (chunks.length > 4) return false;

	if (!cnf.botCommands.actions.includes(chunks[1])) return false;

	if (!cnf.botCommands.tasks.includes(chunks[2])) return false;

	if (chunks[3]) if (!isInteger(stringToInteger(chunks[3])) && !isInterval(chunks[3]) && !isDate(chunks[3]) && !isHSURL(chunks[3])) return false;

	return { 'action': chunks[1], 'task': chunks[2], 'modifier': chunks[3] };
};

/**
 * Route the IRC commands.
 *
 * @param      {<type>}   from     The from
 * @param      {<type>}   to       { parameter_description }
 * @param      {<type>}   message  The message
 * @return     {boolean}  { description_of_the_return_value }
 */
const router = (from, to, message) =>
{
	const command = parseMessage(message);

	if (!command) return false;

	if (command.action === 'client')
	{
		if(!isAuthed(from)) return false;

		if (command.task === 'all') clientController.listAll(ircClient, to);

		else if (command.task === 'active') clientController.listActive(ircClient, to, command.modifier);

		else if (command.task === 'inactive') clientController.listInactive(ircClient, to, command.modifier);

		else if (command.task === 'status') clientController.listStatus(ircClient, to, command.modifier);

		else if (command.task === 'top') clientController.listTop(ircClient, to, command.modifier);
	}

	else if (command.action === 'service')
	{
		if(!isAuthed(from)) return false;

		if (command.task === 'count') serviceController.countAll(ircClient, to);

		else if (command.task === 'list') serviceController.listInterval(ircClient, to, command.modifier);

		else if (command.task === 'top') serviceController.listTop(ircClient, to, command.modifier);
	}

	else if (command.action === 'hash')
	{
		if (command.task === 'all') { if(!isAuthed(from)) return false; hashController.hashAll(ircClient, to); }

		else if (command.task === 'url') hashController.hashURL(ircClient, to, command.modifier);
	}
};

module.exports = { init, router };
