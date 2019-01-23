const irc = require('irc');
const routes = require('./routes');

const bot = (() =>
{
	/**
	 * The IRC client.
	 *
	 * @type       {object}
	 */
	let client;

	/**
	 * Gets the IRC client.
	 *
	 * @return     {object}  The IRC client instance.
	 */
	const getClient = () => client;

	/**
	 * Init IRC client and routes.
	 *
	 * @param      {object}  config  The IRC configuration.
	 * @return     {}
	 */
	const init = config =>
	{
		client = new irc.Client(config.server, config.nick, config.options);

		routes.init(client);
	};

	return { init, getClient };
})();

module.exports = bot;
