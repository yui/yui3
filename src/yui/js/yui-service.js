/**
 * Provides a global service layer for YUI.  It adds an addService method to
 * YUI instances that will store an arbitrary value.  This value can be retrieved
 * elsewhere on the page by specifying the service name in use():
 *
 * This implementation requires event_custom in order to be able to tie
 * into the use method.  The idea was that it could use the queue infrastructure
 * in use() to get rid of timing problems.  This isn't actually true unless
 * the queue code is repeated here, or use is changed in a way that separates
 * the queue from the rest of the implementation.
 *
 * YUI().use('event-custom', function(Y) {
 *     Y.addService('global_y', Y);
 *     Y.addService('global_data', { foo: 'bar' });
 * }):
 *
 * YUI().use('service:global_y', function(Y) {
 *     // Y is the shared instance, not the
 *     // one we created with YUI() to set up
 *     // the service provider;
 *
 *     var global_data = Y.use('service:global_data');
 *     Y.log(global_data.foo);
 * });
 *
 * // should work as well
 * var my_y = YUI().use('service:global_y');
 * 
 * @module yui
 * @submodule yui-service
 * @requires event-custom
 */

    YUI.Env.services = YUI.Env.services || {};

    var services = YUI.Env.services,
        SERVICE_PREFIX = 'service:';
        
    YUI.prototype.addService = function(name, service) {
        services[name] = service;
    };

    Y.Do.before(Y, 'use', function(name) {
        var i = name.indexOf(SERVICE_PREFIX),
            ret, service;
        if (i > -1) {
            service = services[name.substr(i+SERVICE_PREFIX.length)];
            if (service) {
                return new Y.Do.Halt('', service);
            }
        }
    });

