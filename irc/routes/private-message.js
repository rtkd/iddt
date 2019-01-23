const config = require('../../config').irc;
const moment = require('moment');
const validate = require('../../lib/validate');

/**
 * The IRC client.
 *
 * @type       {object}
 */
let client;

/**
 * Inits the IRC client.
 *
 * @param      {object}  irc     The IRC client instance.
 * @return     {}
 */
const init = irc => client = irc;

/**
 * Turns the IRC message into something the bot can understand.
 *
 * @param      {string}            msg     The IRC message
 * @return     {(ooject|boolean)}  The bot commands if message was understood, False otherwise.
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

const router = (to, message, obj) =>
{
	// WIP
	return false;
};

module.exports = { init, router };
