const config = require('./config');
const db = require('./db');
const httpd = require('./httpd');
const irc = require('./irc');

/**
 * Init the database.
 */
db.init(config.db);

/**
 * Init the IRC client.
 */
irc.init(config.irc);

/**
 * Init the HTTPD.
 */
httpd.init(config.httpd, irc.getClient());

/**
 * Start the HTTPD.
 */
httpd.start();
