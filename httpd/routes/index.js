const storeRoutes = require('./store');
const serveRoutes = require('./serve');

const routes = (() =>
{
	/**
	 * Inits the HTTPD routes.
	 *
	 * @param      {object}  server  The HTTPD instance.
	 * @return     {}
	 */
	const init = server =>
	{
		server.use('/store', storeRoutes);

		server.use('/serve', serveRoutes);

		server.get('*', (req, res) => res.end('0\n'));

		server.post('*', (req, res) => res.end('0\n'));
	};

	return { init };
})();

module.exports = routes;
