Y.wait = function (ms) {
	return new Y.Promise(function (resolve, reject) {
		var timeout = setTimeout(resolve, ms);
		this.cancel = function () {
			clearTimeout(timeout);
			reject();
		};
	});
};

Y.Promise.prototype.timeout = function (ms) {
	var promise = this;

	return new promise.constructor(function (resolve, reject) {
		promise.then(resolve, reject);
		setTimeout(function () {
			reject(new Error('Operation timed out'));
		}, ms);
	});
};

Y.Promise.prototype.wait = function (ms) {
	var promise = this;

	return new promise.constructor(function (resolve, reject) {
		var timeout;

		promise.then(function (value) {
			timeout = setTimeout(resolve, ms);
			return value;
		}, reject);

		this.cancel = function () {
			clearTimeout(timeout);
			reject();
		};
	});
};