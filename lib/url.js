const config = require('../config').hash;
const b32 = require('hi-base32');
const crypto = require('crypto');
const rsa = require('node-rsa');
const validate = require('./validate');


const url = (() =>
{
	/**
	 * Flattens an array to 1 level.
	 *
	 * @param      {array}  x       The array to flatten.
	 * @return     {array}  The flattened array.
	 */
	const flatten = ([x, ...xs]) => validate.isDefined(x) ? validate.isArray(x) ? [...flatten(x), ...flatten(xs)] : [x, ...flatten(xs)] : [];

	/**
	 * Extracts the Public Key from a discriptor.
	 *
	 * @param      {string}  descriptor  The Hidden Service descriptor.
	 * @return     {string}  The Hidden Service's Public Key.
	 */
	const extractPubKey = descriptor => descriptor.match(/-----BEGIN RSA PUBLIC KEY-----([\s\S]*?)-----END RSA PUBLIC KEY-----/g).toString();

	/**
	 * Creates the Hidden Services intermediate SHA1 fingerprint.
	 *
	 * @param      {string}  pubKey  The Hidden Service's Public Key.
	 * @return     {string}  The Hidden Service's SHA1 fingerprint.
	 */
	const buildHash = pubKey => crypto.createHash('sha1').update(new rsa(pubKey).exportKey('pkcs8-der-public').slice(22));

	/**
	 * Builds all possible Hidden Service URL formats (Domain name, FQDN..).
	 *
	 * @param      {string}  url      The Hidden Service URL.
	 * @param      {array}   prefix   The URL prefixes.
	 * @param      {array}   postfix  The URL postfixes.
	 * @return     {array}   The generated URLs.
	 */
	const buildURLs = (url, prefix, postfix) => prefix.map(pre => postfix.map(post => pre + url + post));

	/**
	 * Builds all URL hashes.
	 *
	 * @param      {array}  urls     The Hidden Service URLs.
	 * @param      {array}  hashFnc  The hash functions to apply.
	 * @return     {array}  The URL hashes.
	 */
	const buildURLHashes = (urls, hashFnc) => urls.map(url => hashFnc.map(hash => { return { 'url': url, 'fnc': hash, 'hash': crypto.createHash(hash).update(url).digest('hex') }; }));

	/**
	 * Checks if a URL hash matches one of the hashes we are looking for.
	 *
	 * @param      {array}         urlHashes    The Hidden Service URL hashes.
	 * @param      {array}         matchHashes  The hashes to match against.
	 * @return     {object|false}  The matched URL, used hash function and hash, false otherwise.
	 */
	const findURLMatch = (urlHashes, matchHashes)  => urlHashes.map(urlHash => config.match.map(matchHash => (urlHash.hash === matchHash) ? { 'url': urlHash.url, 'fnc': urlHash.fnc, 'hash': matchHash } : false))

	/**
	 * Builds Hidden Service domain name from descriptor.
	 *
	 * @param      {string}  descriptor  The Hidden Service's descriptor.
	 * @return     {string}  The Hidden Service domain name.
	 */
	const from = descriptor => b32.encode(buildHash(extractPubKey(descriptor)).digest('binary').slice(0,10).toString(), true).toLowerCase();

	/**
	 * Checks if URL matches one of the hashes we are looking for.
	 *
	 * @param      {string}          url     The URL.
	 * @return     {(object|false)}  The matched URL, hash function and hash if URL matches one of our hashes, False otherwise.
	 */
	const test = url =>
	{
		// Build all possible URLs.
		const urls = flatten([url].concat(buildURLs(url, config.prefix, config.postfix)));

		// Build the URL hashes.
		const urlHashes = flatten(buildURLHashes(urls, config.hashFnc));

		// Check if we got a match.
		const urlMatch = flatten(findURLMatch(urlHashes, config.match)).filter(x => x);

		// Return match if we got one, False otherwise.
		return urlMatch.length > 0 ? urlMatch[0] : false;
	};

	return { from, test };
})();

module.exports = url;
