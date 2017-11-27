/* jslint node: true */
'use strict';

//
//	Test
//

var config	= require('../config'),
	func	= require('./functions'),
	irc		= require('irc'),
	moment	= require('moment'),
	mysql	= require('./mysql'),
	_		= require('underscore');

config.irc.master = _.extend(config.irc.master, config.irc.owner);

var client = new irc.Client(config.irc.server, config.irc.nick, config.irc.options);

client.addListener('message', function (from, to, message)
{
	if (config.irc.master[from])
	{
		var parts	= _.without(message.split(' '), ''),
			command	= parts[0].split('');

		if (command[0] === config.irc.botalias)
		{
			// Boxes
			if (command[1] === 'b')
			{
				if (parts[1] && parts[1] === 'v' && to === config.irc.mainchannel)
				{
					mysql.acquire(function (err, con)
					{
						con.query('select ip,first,last,announce,request from box where last > date_sub(now(), interval 24 hour) and last <= now() order by ip', function (err1, result1)
						{
							_.each(result1, function(el, index)
							{
								client.say(to, el.ip.substring(7) + ' First seen: ' + el.first + ' Last seen: ' + el.last + ' A: ' + el.announce + ' R: ' + el.request);
							});
							con.release();
						});
					});
				}

				else if (parts[1] && parts[1] === 'v')
				{
					client.say(to, 'You have chosen poorly..');
					if (!config.irc.owner[from]) config.irc.master[from] = false;
				}

				else
				{
					mysql.acquire(function (err, con)
					{
						con.query('select id from box where last > date_sub(now(), interval 24 hour) and last <= now()', function (err1, result1)
						{
							client.say(to, 'Found ' + result1.length + ' active boxes within the last 24h.');
							con.release();
						});
					});
				}
			}

			// Count services
			else if (command[1] === 'c')
			{
				if (parts[1] && parts[1] === 'a')
				{
					mysql.acquire(function (err, con)
					{
						con.query('select uri from announce', function (err1, result1)
						{
							client.say(to, 'Found ' + result1.length + ' unique Announces.');
							con.release();
						});
					});
				}

				else if (parts[1] && parts[1] === 'r')
				{
					mysql.acquire(function (err, con)
					{
						con.query('select uri from request', function (err1, result1)
						{
							client.say(to, 'Found ' + result1.length + ' unique Requests.');
							con.release();
						});
					});
				}

				else
				{
					mysql.acquire(function (err, con)
					{
						con.query('select uri from announce union select uri from request', function (err1, result1)
						{
							client.say(to, 'Found ' + result1.length + ' unique Service IDs.');
							con.release();
						});
					});
				}
			}

			// List services
			else if (command[1] === 'l')
			{
				client.say(to, 'Locked. Not in debug mode.');
				/*
				mysql.acquire(function (err, con)
				{
					con.query('select uri from announce union select uri from request order by uri asc limit 0,?', 10, function (err1, result1)
					{
						_.each(result1, function (el, index) {client.say(to, index + '\t' + el);});
						con.release();
					});
				});
				*/
			}

			// Most requested
			else if (command[1] === 'm')
			{
				var limit = (parts[1] && _.isNumber(parseInt(parts[1])) && parseInt(parts[1]) >= 1  && parseInt(parts[1]) <= 100) ? Math.floor(parseInt(parts[1])) : 10;

				mysql.acquire(function (err, con)
				{
					con.query('select uri,hits from request order by hits desc limit 0,?', limit, function (err1, result1)
					{
						client.say(to, 'Most requested Service IDs');
						_.each(result1, function (el, index, list1) {client.say(to, index + '\t' + el.uri + '\t' + el.hits);});
						con.release();
					});
				});
			}

			// New services per day
			else if (command[1] === 'n')
			{
				mysql.acquire(function (err, con)
				{
					var year		= '2016',
						daystart	= '00:00:00',
						dayend		= '23:59:59';

					var date = (parts[1] && moment(parts[1], "MM.DD", true).isValid()) ? year + '-' + parts[1] : func.date().substring(0, 10);

					var datestart	= date + ' ' + daystart,
						dateend		= date + ' ' + dayend;

					// Make this 1 query
					var query1 = 'select uri from announce where first between ? and ? union select uri from request where first between ? and ?';
					var query2 = 'select count(uri) as n from announce where first between ? and ? union all select count(uri) as n from request where first between ? and ?';

					con.query(query1, [datestart, dateend, datestart, dateend], function (err1, result1)
					{
						con.query(query2, [datestart, dateend, datestart, dateend], function (err2, result2)
						{
							client.say(to, 'Found ' + result1.length + ' (' + result2[0].n + '/' + result2[1].n + ') new unique Service IDs on ' + date.replace(/[^\w\s]|_/g, '-') + '.');
							con.release();
						});
					});
				});
			}

			// Test if uri matches hash
			else if (command[1] === 't')
			{
				if (_.isString(parts[1]) && new RegExp(/^\w+$/gi).test(parts[1]) && parts[1].length === 16)
				{
					if (func.checkuri(parts[1])) client.say(to, 'MATCH!');
					else client.say(to, 'No Match.');
				}

				else
				{
					mysql.acquire(function (err, con)
					{
						con.query('select uri from announce union select uri from request', function (err1, result1)
						{
							client.say(to, 'Checking ' + result1.length + ' unique Service IDs.');

							var found = false;

							_.each(result1, function (el, index)
							{
								if (func.checkuri(el.uri))
								{
									client.say(to, 'MATCH: http://' + el.uri + '.onion');
									found = true;
								}
							});

							if (!found) client.say(to, 'No Match.');
						});
					});
				}
			}
		}
	}
});

client.addListener('pm', function (from, message)
{

});

client.addListener('error', function (message) {console.log('error: ', message);});

module.exports = client;