const express = require('express');
const bodyParser = require('body-parser');
const routes = require('./routes');
const storeController = require('./controllers/store');

const httpd = (() =>
{
	const server = express();

	/**
	 * Init server, routes and store controller.
	 *
	 * @param      {<type>}  config  The configuration
	 * @param      {<type>}  irc     The irc
	 * @return     {<type>}  { description_of_the_return_value }
	 */
	const init = (config, irc) =>
	{
		server.set('env', config.env);
		server.set('etag', config.etag);
		server.set('hostname', config.hostName);
		server.set('port', config.port);
		server.set('strict routing', config.strictRouting);
		server.set('view cache', config.viewCache);
		server.set('views', config.views);
		server.set('x-powered-by', config.xPoweredBy);

		server.use(bodyParser.json());
		server.use(bodyParser.urlencoded({ extended: true }));

		routes.init(server);
		storeController.init(irc);
	};

	/**
	 * Start server at <ip> <port>.
	 *
	 * @return     {<type>}  { description_of_the_return_value }
	 */
	const start = () =>
	{
		const hostname = server.get('hostname');
		const port = server.get('port');

		server.listen(port, () =>
		{
			console.log(`Listening on: http://${hostname}:${port}`);
		});
	};

	return { init, start };
})();

module.exports = httpd;
