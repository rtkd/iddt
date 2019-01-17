let ircClient;

const init = client => ircClient = client;

const router = (message) =>
{
	console.log(message);
};

module.exports = { init, router };
