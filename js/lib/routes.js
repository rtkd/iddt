/* jslint node: true */
'use strict';

//
//	Routes
//

var config	= require('../config'),
	bot		= require('./irc'),
	func	= require('./functions'),
	model	= require('./model'),
	_		= require('underscore');

var R =
{
	"configure": function(app)
	{
		app.get(config.deploy, function(req, res)
		{
			res.download(config.deploypath + '/' + config.deployfile, 'tor_deploy.tar.gz');
		});

		app.get('/*', function (req, res) {res.end('0');});

		app.post(config.path, function (req, res)
		{
			model.auth(req.body.key, res, function (authed)
			{
				if (authed === 1)
				{
					if (req.body.datatype === 0)
					{
						model.storeAnnounce(req.body, req.ip, res, function (stored, data)
						{
							if (stored === 1) {res.end('1'); console.log('[-] ' + func.date() + ' - New Announce: ' + data.uri);}
							else if (stored === 2) {res.end('2'); console.log('[-] ' + func.date() + ' - Update Announce: ' + data.uri);}
							else if (stored === 3)
							{
								res.end('3');
								bot.say(config.irc.mainchannel, '[!] ' + func.date() + ' HASH FOUND! ' + data.uri);
								_.each(config.irc.options.channels, function(el, index) {if (el !== config.irc.mainchannel) bot.say(el, '[!] ' + func.date() + ' HASH FOUND!');});
								func.ifttt(data.uri);
								console.warn('[!] ' + func.date() + ' - HASH FOUND! ' + data.uri);
							}
							else res.end('0');
						});
					}

					else if (req.body.datatype === 1)
					{
						model.storeRequest(req.body, req.ip, res, function (stored, data)
						{
							if (stored === 1) {res.end('1'); console.log('[-] ' + func.date() + ' - New Request: ' + data.uri);}
							else if (stored === 2) {res.end('2'); console.log('[-] ' + func.date() + ' - Update Request: ' + data.uri);}
							else if (stored === 3)
							{
								res.end('3');
								bot.say(config.irc.mainchannel, '[!] ' + func.date() + ' HASH FOUND! ' + data.uri);
								_.each(config.irc.options.channels, function(el, index) {if (el !== config.irc.mainchannel) bot.say(el, '[!] ' + func.date() + ' HASH FOUND!');});
								func.ifttt(data.uri);
								console.warn('[!] ' + func.date() + ' - HASH FOUND! ' + data.uri);
							}
							else res.end('0');
						});
					}

					else if (req.body.datatype === 2 && config.db.allowExport.indexOf(req.body.key) !== -1)
					{
						model.export(res, function (exported, data)
						{
							if (exported === 1) {res.send(data); console.log('[-] ' + func.date() + ' - New Export: ' + req.body.key);}
							else res.end('0');
						});
					}

					else res.end('0');
				}

				else res.end('0');
			});
		});

		app.post('/*', function (req, res) {res.end('0');});
		app.put('/*', function (req, res) {res.end('0');});
		app.delete('/*', function (req, res) {res.end('0');});
	}
};

module.exports = R;


