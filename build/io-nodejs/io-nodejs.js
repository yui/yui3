YUI.add('io-nodejs', function(Y) {

/*global Buffer: false, clearInterval: false, clearTimeout: false, console: false, exports: false, global: false, module: false, process: false, querystring: false, require: false, setInterval: false, setTimeout: false, __filename: false, __dirname: false */   

    /**
    * Passthru to the NodeJS <a href="https://github.com/mikeal/request">request</a> module.
    * This method is return of `require('request')` so you can use it inside NodeJS without
    * the IO abstraction.
    * @method request
    * @static
    */
    if (!Y.IO.request) {
        Y.IO.request = require('request');
    }


    /**
    NodeJS IO transport, uses the NodeJS <a href="https://github.com/mikeal/request">request</a>
    module under the hood to perform all network IO.
    @method transports.nodejs
    @static
    @returns {Object} This object contains only a `send` method that accepts a
    `transaction object`, `uri` and the `config object`.
    @example
        
        Y.io('https://somedomain.com/url', {
            method: 'PUT',
            data: '?foo=bar',
            //Extra request module config options.
            request: {
                maxRedirects: 100,
                strictSSL: true,
                multipart: [
                    {
                        'content-type': 'application/json',
                        body: JSON.stringify({
                            foo: 'bar',
                            _attachments: {
                                'message.txt': {
                                    follows: true,
                                    length: 18,
                                    'content_type': 'text/plain'
                                }
                            }
                        })
                    },
                    {
                        body: 'I am an attachment'
                    }
                ] 
            },
            on: {
                success: function(id, e) {
                }
            }
        });
    */

    Y.IO.transports.nodejs = function() {
        // Return an object that has a send method.  IO
        // will route the prepared request data to this
        // method with arguments: the transaction object,
        // uri, and the configuration object.

        return {
            send: function (transaction, uri, config) {

                config.notify('start', transaction, config);
                
                var rconf = {
                    method: config.method,
                    uri: uri
                };
                if (config.timeout) {
                    rconf.timeout = config.timeout;
                }
                if (config.request) {
                    Y.mix(rconf, config.request);
                }

                Y.IO.request(rconf, function(err, data) {

                    if (data && data.statusCode !== 200) {
                        err = {
                            statusCode: data.statusCode,
                            code: data.statusCode + ' - ' + data.body,
                            message: data.body
                        };
                    }

                    if (err) {
                        transaction.errorCode = err.code;
                        config.notify(((err.code === 'ETIMEDOUT') ? 'timeout' : 'failure'), transaction, config);
                        return;
                    }
                    if (data) {
                        transaction.c = {
                            statusCode: data.statusCode,
                            headers: data.headers,
                            responseText: data.body,
                            responseXML: null
                        };
                    }
                    config.notify('success', transaction, config);
                    config.notify('complete', transaction, config);
                });
            }
        };
    };

    Y.IO.defaultTransport('nodejs');



}, '@VERSION@' ,{requires:['io-base']});
