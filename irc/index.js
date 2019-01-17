const irc = require('irc');
const routes = require('./routes');

const bot = (() =>
{
	/**
	 * The IRC client.
	 *
	 * @type       {<type>}
	 */
	let client;

	/**
	 * Get the IRC client.
	 *
	 * @return     {<type>}  The client.
	 */
	const getClient = () => client;

	/**
	 * Init IRC client and routes.
	 *
	 * @param      {<type>}  config  The configuration
	 * @return     {<type>}  { description_of_the_return_value }
	 */
	const init = config =>
	{
		client = new irc.Client(config.server, config.nick, config.options);

		routes.init(client);
	};

	return { init, getClient };
})();

module.exports = bot;
