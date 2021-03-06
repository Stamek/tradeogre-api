var cloudscraper = require('cloudscraper');

var TradeOgre = function (key, secret, family) {

        family = family || 4;
	var self = this;

	self.VERSION = '1.1.4';

	self._key = key;
	self._secret = secret;

	self._endpoint = 'tradeogre.com/api/v1';
	self._publicUrl = 'https://' + self._endpoint;
	self._privateUrl = 'https://' + self._key + ":" + self._secret + "@" + self._endpoint;
        self._userAgent = 'Mozilla/5.0 (Windows NT 6.3; Win64; x64; rv:60.0) Gecko/20100101 Firefox/60.0';

	self._request = function (method, path, options, callback) {
		if (method === 'GET') {
			return self._get(path, options, callback)
		}
		if (method === 'POST') {
			return self._post(path, options, callback)
		}
	}
	self._get = function (path, options, callback) {
		var qs = ''
		for (var o in options) {
			qs += '/' + options[o]
		}
		return cloudscraper.request(
			{
				method: "GET",
				url: self._publicUrl + path + qs,
                                timeout: 2000,
                                headers: {'User-Agent': self._userAgent},
                                family: family
			},
			callback
		)
	}
	self._getprivate = function (path, options, callback) {
		var qs = ''
		for (var o in options) {
			qs += '/' + options[o]
		}
		return cloudscraper.request(
			{
				method: "GET",
				url: self._privateUrl + path + qs,
                                json: true,
                                timeout: 2000,
                                headers: {'User-Agent': self._userAgent},
                                family: family
			},
			callback
		)
	}
	self._post = function (path, options, callback) {
		return cloudscraper.request(
			{
				method: "POST",
				url: self._privateUrl + path,
				form: options,
				json: true,
                                timeout: 2000,
                                headers: {'User-Agent': self._userAgent},
                                family: family
			},
			callback
		)
	}

	return self
}

// Public methods
TradeOgre.prototype.getMarkets = function (callback) {
	/**
	 * @param market
	 */
	this._get('/markets', {}, callback)
}
TradeOgre.prototype.getOrderBook = function (market, callback) {
	/**
	 * @param market
	 */
	this._get('/orders', { market : market }, callback)
}
TradeOgre.prototype.getTicker = function (market, callback) {
	/**
	 * @param market
	 */
	this._get('/ticker', { market : market }, callback)
}
TradeOgre.prototype.getTradeHistory = function (market, callback) {
	/**
	 * @param market
	 */
	this._get('/history', { market : market }, callback)
}

// Private methods
TradeOgre.prototype.buy = function (market, quantity, price, callback) {
	/**
	 * @param market
	 * @param quantity
	 * @param price
	 */
	this._post('/order/buy', { market : market, quantity: quantity, price: price }, callback)
}
TradeOgre.prototype.sell = function (market, quantity, price, callback) {
	/**
	 * @param market
	 * @param quantity
	 * @param price
	 */
	this._post('/order/sell', { market : market, quantity: quantity, price: price }, callback)
}
TradeOgre.prototype.cancelOrder = function (uuid, callback) {
	/**
	 * @param uuid
	 */
	this._post('/order/cancel', { uuid: uuid }, callback)
}
TradeOgre.prototype.getOrder = function (uuid, callback) {
	/**
	 * @param uuid
	 */
	this._getprivate('/account/order', { uuid: uuid }, callback)
}
TradeOgre.prototype.getOrders = function (market, callback) {
	/**
	 * @param market
	 */
	this._post('/account/orders', { market: market }, callback)
}
TradeOgre.prototype.getBalance = function (currency, callback) {
	/**
	 * @param currency
	 */
	this._post('/account/balance', { currency: currency }, callback)
}
TradeOgre.prototype.getBalances = function (callback) {
	/**
	 * @param currency
	 */
	this._post('/account/balances', {}, callback)
}

module.exports = TradeOgre
