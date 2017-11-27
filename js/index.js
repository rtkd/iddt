/* jslint node: true */
'use strict';

//
//	Index
//

var config		= require('./config'),
	bodyparser	= require('body-parser'),
	express		= require('express'),
	func		= require('./lib/functions'),
	mysql		= require('./lib/mysql'),
	routes		= require('./lib/routes');

var app = express();

app.set('env', '');
app.set('etag', false);
app.set('strict routing', true);
app.set('views', '');
app.set('view cache', false);
app.set('x-powered-by', false);

app.use(bodyparser.urlencoded({extended: true}));
app.use(bodyparser.json());
app.use(function(err, req, res, next)
{
	res.end('0');
	console.error('[!] ' + func.date() + ' Error: ', err.status, 'Malformed request');
});

mysql.init();
routes.configure(app);

var server = app.listen(config.port, function()
{
	console.log('[#] ' + func.date() + ' Listening on: ', server.address().port);
});