const cnf = require('../../config').irc;
const moment = require('moment');

let ircClient;

const init = client => ircClient = client;

const isInteger = number => Number.isInteger(number) && number !== NaN;

const isInterval = string => /^[1-9]\d{0,1}[smhdw]$/.test(string);

const isDate = string => moment(string, "DD.MM.YYYY", true).isValid();

const isHSURL = string => /^\w{16}$/.test(string);

const stringToInteger = string => parseInt(string.replace(/\D/g, ''));

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

const router = (to, message, obj) =>
{
	return false;

	//const command = parseMessage(message);

	//if (!command) return false;
};

module.exports = { init, router };
