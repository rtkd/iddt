/**
 * Serve the client for auto install.
 *
 * @param      {<type>}  req     The request
 * @param      {<type>}  res     The resource
 * @return     {<type>}  { description_of_the_return_value }
 */
const client = (req, res) => res.download('./client/client.tar.gz');

module.exports = { client };
