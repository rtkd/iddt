const messageRoutes = require('./message');
const privateMessageRoutes = require('./private-message');
const errorRoutes = require('./error');

const routes = (() =>
{
	/**
	 * Init routes and listener.
	 *
	 * @param      {<type>}  client  The client
	 * @return     {<type>}  { description_of_the_return_value }
	 */
	const init = client =>
	{
		messageRoutes.init(client);

		privateMessageRoutes.init(client);

		errorRoutes.init(client);

		client.addListener('message', messageRoutes.router);

		client.addListener('pm', privateMessageRoutes.router);

		client.addListener('error', errorRoutes.router);
	};

	return { init };
})();

module.exports = routes;
