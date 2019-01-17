const storeRoutes = require('./store');
const serveRoutes = require('./serve');

const routes = (() =>
{
	/**
	 * Init routes.
	 *
	 * @param      {<type>}  server  The server
	 * @return     {<type>}  { description_of_the_return_value }
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
