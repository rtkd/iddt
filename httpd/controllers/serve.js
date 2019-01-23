/**
 * Serve the client for auto install.
 *
 * @param      {object}  request   The HTTPD request.
 * @param      {object}  response  The HTTPD response.
 * @return     {}
 */
const client = (request, response) => response.download('./client/client.tar.gz');

module.exports = { client };
