const config = require('../config').hash;
const b32 = require('hi-base32');
const crypto = require('crypto');
const rsa = require('node-rsa');


const url = (() =>
{
	const isDefined = x => typeof x !== 'undefined';

	const isArray = x => Array.isArray(x);

	const flatten = ([x, ...xs]) => isDefined(x) ? isArray(x) ? [...flatten(x), ...flatten(xs)] : [x, ...flatten(xs)] : [];

	const extractPubKey = descriptor => descriptor.match(/-----BEGIN RSA PUBLIC KEY-----([\s\S]*?)-----END RSA PUBLIC KEY-----/g).toString();

	const buildHash = pubKey => crypto.createHash('sha1').update(new rsa(pubKey).exportKey('pkcs8-der-public').slice(22));

	const buildURLs = (url, prefix, postfix) => prefix.map(pre => postfix.map(post => pre + url + post));

	const buildURLHashes = (urls, hashFnc) => urls.map(url => hashFnc.map(hash => { return { 'url': url, 'fnc': hash, 'hash': crypto.createHash(hash).update(url).digest('hex') }; }));

	const findURLMatch = (urlHashes, matchHashes)  => urlHashes.map(urlHash => config.match.map(matchHash => (urlHash.hash === matchHash) ? { 'url': urlHash.url, 'fnc': urlHash.fnc, 'hash': matchHash } : false))

	const from = descriptor => b32.encode(buildHash(extractPubKey(descriptor)).digest('binary').slice(0,10).toString(), true).toLowerCase();

	const test = url =>
	{
		const fqdn = buildURLs(url, config.prefix, config.postfix);

		const pqdn = buildURLs(url, [ '' ], config.postfix);

		const urls = flatten([url].concat(pqdn).concat(fqdn));

		const urlHashes = flatten(buildURLHashes(urls, config.hashFnc));

		const urlMatch = flatten(findURLMatch(urlHashes, config.match)).filter(x => x);

		return urlMatch.length > 0 ? urlMatch[0] : false;
	};

	return { from, test };
})();

module.exports = url;
