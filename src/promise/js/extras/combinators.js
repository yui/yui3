/**
Returns a promise that is resolved or rejected when any of values is either
resolved or rejected.

@for Promise
@method any
@param {Any[]} values A list of either promises or any JavaScript value
@return {Promise} A promise with the value or reason of the first resolved or
                    rejected promise
@static
@since @SINCE@
**/
Promise.any = function (values) {
    return new Promise(function (resolve, reject) {
        if (values.length < 1) {
            return resolve();
        }
        // just go through the list and resolve and reject at the first change
        for (var i = 0, count = values.length; i < count; i++) {
            Y.when(values[i], resolve, reject);
        }
    });
};

/**
Returns a promise that is resolved or rejected when all values are resolved or
any is rejected. If the array passed is empty, the returned promise will be
resolved witn `undefined`.

@for Promise
@method every
@param {Any[]} values An Array of either promises or any JavaScript value
@return {Promise} A promise with the list of all resolved values or the
                    rejection reason of the first rejected promise
@static
@since @SINCE@
**/
Promise.every = function (values) {
    var remaining = values.length,
        i         = 0,
        length    = values.length,
        results   = [];

    return new Promise(function (resolve, reject) {
        function oneDone(index) {
            return function (value) {
                results[index] = value;

                remaining--;

                if (!remaining) {
                    resolve(results);
                }
            };
        }

        if (length < 1) {
            return resolve();
        }

        for (; i < length; i++) {
            Y.when(values[i], oneDone(i), reject);
        }
    });
};

/**
Returns a promise that is resolved or rejected when one of values is resolved
or all are rejected. If the array passed is empty, the returned promise will be
resolved witn `undefined`.

@for Promise
@method some
@param {Any[]} values A list of either promises or any JavaScript value
@return {Promise} A promise with the value of the first resolved promise or a
                    list of all the rejection reasons
@static
@since @SINCE@
**/
Promise.some = function (values) {
    var remaining = values.length,
        i         = 0,
        length    = values.length,
        results   = [];

    // Basically a mirror implementation of Promise.every
    return new Promise(function (resolve, reject) {
        function oneRejected(index) {
            return function (value) {
                results[index] = value;

                remaining--;

                if (!remaining) {
                    reject(results);
                }
            };
        }

        if (length < 1) {
            return resolve();
        }

        for (; i < length; i++) {
            Y.when(values[i], resolve, oneRejected(i));
        }
    });
};
