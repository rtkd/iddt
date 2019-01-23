let client;

const init = irc => client = irc;

const router = message => { console.log(message); };

module.exports = { init, router };
