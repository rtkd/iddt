/* jslint node: true */
'use strict';

//
//	Model
//

var config	= require('../config'),
	crypto	= require('crypto'),
	func	= require('./functions'),
	mysql	= require('./mysql'),
	desc	= require('./descriptor'),
	_		= require('underscore');

function Model ()
{
	this.auth = function (key, res, callback)
	{
		key = (_.isString(key) && new RegExp(/^\w+$/gi).test(key) && key.length === config.apikeylen) ? key : '';

		mysql.acquire(function (err, con)
		{
			con.query('select id from user where uid=?', key, function (err1, result1)
			{
				con.release();
				callback((result1.length === 1) ? 1 : 0);
			});
		});
	};

	this.storeAnnounce = function (data, ip, res, callback)
	{
		var service = desc.parse(data.data.desc, ip);

		if (_.isObject(service))
		{
			var uri		= service.uri,
				found	= func.checkuri(uri);

			mysql.acquire(function (err, con)
			{
				con.query('select id from box where ip=?', ip, function (err1, result1)
				{
					if (result1.length === 1) con.query('update box set ? where id=?', [{'last': func.date(), 'announce': 1}, result1[0].id], function (err2, result2) {});
					else con.query('insert into box set ?', {'ip': ip, 'first': func.date(), 'last': func.date(), 'announce': 1, 'request': 0}, function (err2, result2) {});
				});

				con.query('select id from announce where uri=?', uri, function (err1, result1)
				{
					if (result1.length === 1)
					{
						con.query('update announce set ? where id=?', [{'last': func.date()}, result1[0].id], function (err2, result2)
						{
							if (found) callback(3, {'uri': uri});
							else if (!err2) callback(2, {'uri': uri});
							else callback(0);
						});
					}

					else
					{
						con.query('insert into announce set ?', {'uid': data.key, 'first': func.date(), 'last': func.date(), 'uri': uri}, function (err2, result2)
						{
							if (found) callback(3, {'uri': uri});
							else if (!err2) callback(1, {'uri': uri});
							else callback(0);
						});
					}
				});

				con.release();
			});
		}

		else callback(0);
	};

	this.storeRequest = function (data, ip, res, callback)
	{
		var uri = data.data.uri;

		if (_.isString(uri) && new RegExp(/^\w+$/gi).test(uri) && uri.length === 16)
		{
			mysql.acquire(function (err, con)
			{
				con.query('select id from box where ip=?', ip, function (err1, result1)
				{
					if (result1.length === 1) con.query('update box set ? where id=?', [{'last': func.date(), 'request': 1}, result1[0].id], function (err2, result2) {});
					else con.query('insert into box set ?', {'ip': ip, 'first': func.date(), 'last': func.date(), 'announce': 0, 'request': 1}, function (err2, result2) {});
				});

				con.query('select id,hits from request where uri=?', uri, function (err1, result1)
				{
					var found = func.checkuri(uri);

					if (result1.length === 1)
					{
						con.query('update request set ? where id=?', [{'last': func.date(), 'hits': (result1[0].hits + 1)}, result1[0].id], function (err2, result2)
						{
							if (found) callback(3, {'uri': uri});
							else if (!err2) callback(2, {'uri': uri});
							else callback(0);
						});
					}

					else
					{
						con.query('insert into request set ?', {'uid': data.key, 'first': func.date(), 'last': func.date(), 'uri': uri, 'hits': 1}, function (err2, result2)
						{
							if (found) callback(3, {'uri': uri});
							else if (!err2) callback(1, {'uri': uri});
							else callback(0);
						});
					}
				});

				con.release();
			});
		}

		else callback(0);
	};

	this.export = function (res, callback)
	{
		mysql.acquire(function (err, con)
		{
			con.query('select uri from announce union select uri from request order by uri asc', function (err1, result1)
			{
				if (result1.length > 0) callback(1, _.uniq(result1));
				else callback(0);
			});

			con.release();
		});
	};
}

module.exports = new Model();