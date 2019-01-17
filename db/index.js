const mySQL = require('mysql');

const db = (() =>
{
	let pool;

	/**
	 * Init the connection pool.
	 *
	 * @param      {<type>}  config  The configuration
	 * @return     {<type>}  { description_of_the_return_value }
	 */
	const init = config => pool = mySQL.createPool(config);

	/**
	 * Get connection from pool.
	 *
	 * @param      {Function}  callback  The callback
	 * @return     {<type>}    { description_of_the_return_value }
	 */
	const acquire = callback => pool.getConnection((err, con) => { if (con) callback(con); });;

	return { init, acquire };
})();

module.exports = db;
