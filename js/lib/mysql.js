/* jslint node: true */
'use strict';

//
//	MySQL
//

var config = require('../config');
var mysql = require('mysql');

function Connection()
{
	this.pool = null;

	this.init = function()
	{
		this.pool = mysql.createPool(config.db);
	};

	this.acquire = function(callback)
	{
		this.pool.getConnection(function (err, connection)
		{
			callback(err, connection);
		});
	};
}

module.exports = new Connection();