/**
Creates a fulfilled promise for a certain value. If the value is a promise, the
new promise will be fulfilled or rejected based on the provided promise

@for Promise
@method resolve
@param {Any} valueOrPromise Any value to wrap in a promise
@return {Promise} A new promise for the provided value
@static
@since @SINCE@
**/
Promise.resolve = function (valueOrPromise) {
    return new Promise(function (resolve) {
        resolve(valueOrPromise);
    });
};

/**
Creates a rejected promise based on a certain reason

@for Promise
@method reject
@param {Any} reason Any reason to reject a promise with
@return {Promise} A new reject promise for the provided reason
@static
@since @SINCE@
**/
Promise.reject = function (reason) {
    return new Promise(function (resolve, reject) {
        reject(reason);
    });
};
