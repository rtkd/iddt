/* jslint node: true */
'use strict';

//
//	Functions
//

var config	= require('../config'),
	crypto	= require('crypto'),
	ifttt	= require('iftttmaker')(config.ifttt.key);

var F =
{
	'date': function () {return new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '');},

	'checkuri': function (uri)
	{
		var fqdn = config.hash.prefix + uri + config.hash.postfix,
			pqdn = uri + config.hash.postfix;

		return (
			crypto.createHash('sha512').update(uri).digest('hex') === config.hash.match ||
			crypto.createHash('sha512').update(fqdn).digest('hex') === config.hash.match ||
			crypto.createHash('sha512').update(pqdn).digest('hex') === config.hash.match ||
			crypto.createHash('whirlpool').update(uri).digest('hex') === config.hash.match ||
			crypto.createHash('whirlpool').update(fqdn).digest('hex') === config.hash.match ||
			crypto.createHash('whirlpool').update(pqdn).digest('hex') === config.hash.match
		) ? true : false;
	},

	'ifttt': function (data)
	{
		ifttt.send(config.ifttt.event, data, function (error)
		{
			if (error)
			{
				console.log('The IFTTT request could not be sent:', error);
			}

			else
			{
				console.log('IFTTT Request was sent');
			}
		});
	}
};

module.exports = F;