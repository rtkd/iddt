/**
 * The configuration.
 *
 * @type       {object}
 */
const config = { };

/**
 * Basic authentication for clients.
 *
 * @type       {object}
 */
config.auth =
{
	/**
	 * Client has to supply a key listed here, in the <user> field of the request.
	 */
	'apiKeys': { }
};

/**
 * Database configuration.
 *
 * @type       {object}
 */
config.db =
{
	'host'				: '',
	'user'				: '',
	'password'			: '',
	'database'			: '',
	'connectionLimit'	: 16
};

/**
 * Hash configuration.
 *
 * @type       {object}
 */
config.hash =
{
	'match':
	[
		/**
		 * The hash from 3301's Liber Primus, page 73.
		 */
		'36367763ab73783c7af284446c59466b4cd653239a311cb7116d4618dee09a8425893dc7500b464fdaf1672d7bef5e891c6e2274568926a49fb4f45132c2a8b4',

		/**
		 * Known positive - SHA512 of Facebook's Hidden Service domain name (facebookcorewwwi).
		 */
		'1861cda4e2f1b331d594f2f581660a770ef951b22c9cd50b15e916b70f3f1d464b1008e644430dcb4f79a42342af2a2597b201f0955b45f28e557c5a0d601bb7'
	],
	'prefix'	: [ '', 'http://', 'https://' ],
	'postfix'	:
	[
		'.onion',
		'.onion/',
		'.onion/index.htm',
		'.onion/index.html',
		'.onion/index.php',
		'.onion/3301.htm',
		'.onion/3301.html',
		'.onion/3301.php',
		'.onion/1033.htm',
		'.onion/1033.html',
		'.onion/1033.php',
		'.onion/1595277641.htm',
		'.onion/1595277641.html',
		'.onion/1595277641.php'
	],

	/**
	 * Hash functions to apply.
	 * Must be supported by node-rsa.
	 */
	'hashFnc'	: [ 'sha512', 'whirlpool' ]
};

/**
 * HTTPD configuration.
 *
 * @type       {object}
 */
config.httpd =
{
	'env'			: '',
	'etag'			: false,
	'hostName'		: 'localhost',
	'port'			: 1025,
	'strictRouting'	: true,
	'viewCache'		: false,
	'views'			: '',
	'x-powered-by'	: false
};

/**
 * IRC configuration.
 *
 * @type       {object}
 */
config.irc =
{
	'owner'			: [ ],
	'users'			: [ ],
	'mainchannel'	: '',
	'botalias'		: '',
	'server'		: '',
	'nick'			: '',
	'options':
	{
		'autoConnect'			: true,
		'autoRejoin'			: true,
		'certExpired'			: false,
		'channels'				: [ ],
		'channelPrefixes'		: '&#',
		'debug'					: false,
		'encoding'				: 'utf-8',
		'floodProtection'		: true,
		'floodProtectionDelay'	: 750,
		'localAddress'			: null,
		'messageSplit'			: 512,
		'password'				: '',
		'port'					: 6697,
		'realName'				: '',
		'sasl'					: true,
		'secure'				: true,
		'selfSigned'			: false,
		'showErrors'			: false,
		'stripColors'			: true,
		'userName'				: ''
	},

	/**
	 * Whitelist IRC bot commands.
	 */
	'botCommands':
	{
		'actions'	: [ 'client', 'service', 'hash' ],
		'tasks'		: [ 'active', 'all', 'count', 'inactive', 'list', 'status', 'top', 'url' ]
	}
};

/**
 * Log configuration.
 * TODO: Build me.
 *
 * @type       {object}
 */
config.log =
{
	'logPath'			: '',
	'logDescriptors'	: false
};

module.exports = config;
