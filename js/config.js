/* jslint node: true */
'use strict';

//
//	Config
//

var C =
{
	'path'		: '', // Path to listen on
	'port'		: 10101, // Port to listen on
	'apikeylen'	: 16,

	'deploy'	: '',
	'deploypath': 'assets',
	'deployfile': 'tor.tar.gz',

	'desclog'		: '', // Path to log descriptors to

	'db':
	{
		'host'		: 'localhost',
		'user'		: 'unprivileged',
		'password'	: '',
		'database'	: '',

		'allowExport': [], // Array of user hashes allowed to export URLs
		'connectionLimit': 16
	},

	'irc':
	{
		'owner'	: {}, // Nicks of IRC bot owner
		'master': {}, // Nicks of IRC bot users

		'mainchannel': '',

		'botalias': '.',

		'server'	: '',
		'nick'		: '',
		'options'	:
		{
			'userName'				: '',
			'realName'				: '',
			'password'				: '',
			'port'					: 6697,
			'localAddress'			: null,
			'debug'					: false,
			'showErrors'			: false,
			'autoRejoin'			: true,
			'autoConnect'			: true,
			'channels'				: [],
			'secure'				: true,
			'selfSigned'			: false,
			'certExpired'			: false,
			'floodProtection'		: true,
			'floodProtectionDelay'	: 750,
			'sasl'					: true,
			'stripColors'			: true,
			'channelPrefixes'		: '&#',
			'messageSplit'			: 512,
			'encoding'				: 'utf-8'
		}
	},

	'ifttt':
	{
		'key'	:'',
		'event'	:'hash_found'
	},

	'hash':
	{
		'cicada'	: '36367763ab73783c7af284446c59466b4cd653239a311cb7116d4618dee09a8425893dc7500b464fdaf1672d7bef5e891c6e2274568926a49fb4f45132c2a8b4',
		'facebook'	: '1861cda4e2f1b331d594f2f581660a770ef951b22c9cd50b15e916b70f3f1d464b1008e644430dcb4f79a42342af2a2597b201f0955b45f28e557c5a0d601bb7',

		get match () {return this.cicada;},

		'prefix'	: 'http://',
		'postfix'	: '.onion'
	}
};

module.exports = C;