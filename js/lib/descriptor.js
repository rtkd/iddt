/* jslint node: true */
'use strict';

//
//	Parse
//

var config	= require('../config'),
	base32	= require('./b32'),
	base64	= require('js-base64').Base64,
	crypto	= require('crypto'),
	func	= require('./functions'),
	fs		= require('fs'),
	NodeRSA	= require('node-rsa');

var D =
{	'parse': function (data, ip)
	{
		var desc = base64.decode(data),
			start = (desc.indexOf('BEGIN RSA PUBLIC KEY') !== -1) ? '-----BEGIN RSA PUBLIC KEY' : false,
			end = (desc.indexOf('END RSA PUBLIC KEY') !== -1) ? 'END RSA PUBLIC KEY-----' : false;

		fs.writeFile(config.desclog + func.date().replace(/\s/g, '-') + '_' + crypto.createHash('sha1').update(data).digest('hex').slice(16) + '_' + ip, desc, function (err)
		{
			if (err) return console.error(err);
		});

		if (start && end)
		{
			try
			{
				var pubkey = desc.substring(desc.indexOf(start), desc.indexOf(end)) + end,
					sha1sum	= crypto.createHash('sha1').update(new NodeRSA(pubkey).exportKey('pkcs8-der-public').slice(22));

				return {'uri': base32(sha1sum.digest('binary').slice(0,10).toString()).toLowerCase()};
			}

			catch (e)
			{
				console.log(e.stack);
				return false;
			}
		}

		else return false;
	}
};

module.exports = D;