// A promise already resolved to "undefined"
// Used in combinator functions to avoid creating new promises when passed an
// empty list
RESOLVED_PROMISE = Promise.resolve();

/**
Returns a promise that is resolved or rejected when any of values is either
resolved or rejected. If no values are passed the returned promise will be
resolved witn `undefined`.

@for Promise
@method any
@param {Any} values* Any number of either promises or other JavaScript values
@return {Promise} A promise with the value or reason of the first resolved or
                    rejected promise
@static
@since @SINCE@
**/
Promise.any = function () {
    var values = arguments;
    // When values is an empty list any() should resolve to undefined
    // This is spec'd in DOMFuture
    return values.length < 1 ? RESOLVED_PROMISE :
        new Promise(function (resolve, reject) {
            // Go through the list and resolve and reject at the first change
            // Abuses the fact that fulfilling or rejecting an already resolved
            // promise does not throw or do anything else
            for (var i = 0, count = values.length; i < count; i++) {
                Y.when(values[i], resolve, reject);
            }
        });
};

/**
Returns a promise that is resolved or rejected when all values are resolved or
any is rejected. If no values are passed the returned promise will be
resolved witn `undefined`.

@for Promise
@method every
@param {Any} values* Any number of either promises or other JavaScript values
@return {Promise} A promise with the list of all resolved values or the
                    rejection reason of the first rejected promise
@static
@since @SINCE@
**/
Promise.every = function () {
    var values    = arguments,
        remaining = values.length,
        i         = 0,
        length    = values.length,
        results   = [];

    // Follows the DOMFuture spec like any()
    return length < 1 ? RESOLVED_PROMISE :
        new Promise(function (resolve, reject) {
            function oneDone(index) {
                return function (value) {
                    results[index] = value;

                    remaining--;

                    if (!remaining) {
                        resolve(results);
                    }
                };
            }

            for (; i < length; i++) {
                Y.when(values[i], oneDone(i), reject);
            }
        });
};

/**
Returns a promise that is resolved or rejected when one of values is resolved
or all are rejected. If no values are passed the returned promise will be
resolved witn `undefined`.

@for Promise
@method some
@param {Any} values* Any number of either promises or other JavaScript values
@return {Promise} A promise with the value of the first resolved promise or a
                    list of all the rejection reasons
@static
@since @SINCE@
**/
Promise.some = function () {
    var values    = arguments,
        remaining = values.length,
        i         = 0,
        length    = values.length,
        results   = [];

    // Follows the DOMFuture spec like any()
    return length < 1 ? RESOLVED_PROMISE :
        new Promise(function (resolve, reject) {
            // This is a mirror implementation of Promise.every()
            // Instead of keeping a list of fulfill values,
            // keep a list of rejection reasons
            function oneRejected(index) {
                return function (value) {
                    results[index] = value;

                    remaining--;

                    if (!remaining) {
                        reject(results);
                    }
                };
            }

            for (; i < length; i++) {
                Y.when(values[i], resolve, oneRejected(i));
            }
        });
};
