'use strict';

var Bindable      = Y.Attribute.Bindable,
    bindableProto = Bindable.prototype;

/**
DataBind provides the `Y.DataBind` class to automate binding attribute state
to the state of other objects via configuration, obviating the need to manually
subscribe to change events or, in the event of bidirectional binding,
transfering data from the other object back to the attribute.

@module attr-bindable
@submodule data-bind
@class DataBind
@since @SINCE@
**/
Y.DataBind = Y.extend(
    function (host) {
        Bindable.call(this, { model: host });
    },
    Bindable,
    {
        /**
        Detaches bindings.

        @method destroy
        **/
        destroy: bindableProto.destructor,

        /**
        Relays `instance.get(attr)` to the bound attribute's host's `get(attr)`
        method. If no binding for the provided attribute is found, `undefined`
        is returned.

        @method get
        @param {String} attr Attribute name to get value from host
        @return {Any} Whatever is stored in the attribute, or `undefined` if the
                      provided attribute is not bound
        **/
        get: function (attr) {
            var binding = this._bindMap[attr],
                host    = binding && binding.host;

            // Returning `undefined` because the binding isn't defined, so
            // there's no value associated, not even `null`.
            return host ? host.get.apply(host, arguments) : undefined;
        },

        /**
        Relays `instance.set(attr, val)` to the bound attribute's host's
        `set(attr, val)` method.

        @method set
        @param {String} attr Attribute name to get value from host
        @param {Any} value Attribute name to get value from host
        @param {Any} [args]* Additional arguments to relay to host's `set()` method
        @chainable
        **/
        set: function (attr) {
            var binding = this._bindMap[attr],
                host    = binding && binding.host;

            if (host) {
                host.get.apply(host, arguments);
            }

            return this;
        }
    }, {
        BIND_TYPES: Bindable.BIND_TYPES
    });
