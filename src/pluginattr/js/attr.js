var Lang       = Y.Lang,
    isString   = Lang.isString,
    isObject   = Lang.isObject,
    isFunction = Lang.isFunction;

/**
 * <p>Register a Plugin with an activation attribute on a host class.
 * Setting this attribute at construction or at run time will cause the
 * Plugin to be plugged into the instance.  For example:</p>
 *
 * <pre><code>
 * Y.Plugin.addHostAttr('sortable', Y.DataTable, Y.Plugin.DTSort);
 * 
 * var dt = new Y.DataTable({ sortable: true }); // plugs DTSort
 * dt.set('sortable', false); // unplugs DTSort
 * </code></pre>
 *
 * <p>To support enhancing host instance behavior when the plugin is
 * use()d after the host instance is instantiated, you can also pass the
 * instance as the second parameter.</p>
 *
 * <p>To allow custom values to be passed to the trigger attribute, pass a
 * preprocessor function as the fourth parameter. The value assigned to the
 * attribute will be translated by this function prior to getting passed to
 * plug() as the configuration.  Return false from this function to cause
 * the plugin to be unplugged.</p>
 *
 * <pre><code>
 * Y.Plugin.addHostAttr('filters', Y.Console, Y.Plugin.ConsoleFilters,
 *      function (config) {
 *          if (Y.Lang.isString(config) || Y.Lang.isArray(config)) {
 *              config = {
 *                  defaultVisibility: false,
 *                  category: Y.Array.hash(Y.Array(config))
 *              };
 *          }
 *
 *         return config;
 *     }
 * });
 *
 * var con = new Y.Console({ filters: ['warn', 'error'] });</code></pre>
 *
 * <p>The host class must have a static ATTRS collection.</p>
 *
 * @method Plugin.addHostAttr
 * @param name {String} The attribute name to trigger plug and unplug
 * @param host {Function|Object} The class or instance to receive the
 *                               triggering attribute
 * @param plugin {Function} The plugin class
 * @param [setter] {Function} Attribute value preprocessor
 * @param [force] {Boolean} Redefine an existing host attribue?
 * @static
 */
Y.Plugin.addHostAttr = function (name, host, plugin, setter, force) {
    if (!isString(name) || !isObject(host) || !isFunction(plugin)) {
        return false;
    }

    if (!isFunction(setter)) {
        setter = null;
    }

    var attrDef = {
        lazyAdd: false,
        setter : function (val, attr) {
            var value  = setter ? setter(val) : val,
                method = (value !== false) ? 'plug' : 'unplug',
                ret    = Y.Attribute.INVALID_VALUE,
                conf   = (isObject(value)) ? value : {};

            // For now, disallow subattribute as a trigger or
            // plugin attribute setter
            if (attr.indexOf('.') === -1) {
                ret = value;
                conf.host = this;

                this[method](plugin, conf);
            }

            return ret;
        }
    };

    if (isFunction(host)) {
        if (host.ATTRS && (force || !host.ATTRS[name])) {
            host.ATTRS[name] = attrDef;
        }
    } else if (host.constructor.ATTRS && host.addAttr &&
            host._state && (force || !host.attrAdded(name))) {
        host.addAttr(name, attrDef, false);
    }

    return true;
};
