const mySQL = require('mysql');

const db = (() =>
{
	/**
	 * The connection pool.
	 *
	 * @type       {object}
	 */
	let pool;

	/**
	 * Inits the connection pool.
	 *
	 * @param      {object}  config  The database configuration.
	 * @return     {object}  The connection pool.
	 */
	const init = config => pool = mySQL.createPool(config);

	/**
	 * Gets a connection from the pool.
	 *
	 * @param      {function}  callback  The function to call with the database connection.
	 * @return     {}
	 */
	const acquire = callback => pool.getConnection((err, con) => { if (con) callback(con); });

	return { init, acquire };
})();

module.exports = db;
