/**
* Extends IO to enable HTML form data serialization, when specified
* in the transaction's configuration object.
* @module io
* @submodule io-form
* @for IO
*/

var eUC = encodeURIComponent;

/**
 * Method to enumerate through an HTML form's elements collection
 * and return a string comprised of key-value pairs.
 *
 * @method serialize
 * @static
 * @param {Node|String} f - YUI form node or HTML form id
 * @param {Object} c - Configuration:
 * <dl>
 * <dt>useDisabled</dt>
 * <dd>`true` to include disabled fields</dd>
 * <dt>extra</dt>
 * <dd>Extra values to include. Can be either a query string or an object with key-value pairs.</dd>
 * </dl>
 * @return {String}
 */
Y.IO.stringify = function(f, c) {
    return Y.IO.prototype._serialize({
        id: f,
        useDisabled: c.useDisabled
    },
    Y.Lang.isObject(c.extra) ? Y.QueryString.stringify(c.extra) ? c.extra);
};

Y.mix(Y.IO.prototype, {
   /**
    * Method to enumerate through an HTML form's elements collection
    * and return a string comprised of key-value pairs.
    *
    * @method _serialize
    * @private
    * @param {Object} c - id: YUI form node or HTML form id, useDisabled: `true` to include disabled fields
    * @param {String} s - Key-value data defined in the configuration object.
    * @return {String}
    */
    _serialize: function(c, s) {
        var data = [],
            df = c.useDisabled || false,
            item = 0,
            id = (typeof c.id === 'string') ? c.id : c.id.getAttribute('id'),
            e, f, n, v, d, i, il, j, jl, o;

            if (!id) {
                id = Y.guid('io:');
                c.id.setAttribute('id', id);
            }

            f = Y.config.doc.getElementById(id);

        // Iterate over the form elements collection to construct the
        // label-value pairs.
        for (i = 0, il = f.elements.length; i < il; ++i) {
            e = f.elements[i];
            d = e.disabled;
            n = e.name;

            if (df ? n : n && !d) {
                n = eUC(n) + '=';
                v = eUC(e.value);

                switch (e.type) {
                    // Safari, Opera, FF all default options.value from .text if
                    // value attribute not specified in markup
                    case 'select-one':
                        if (e.selectedIndex > -1) {
                            o = e.options[e.selectedIndex];
                            data[item++] = n + eUC(o.attributes.value && o.attributes.value.specified ? o.value : o.text);
                        }
                        break;
                    case 'select-multiple':
                        if (e.selectedIndex > -1) {
                            for (j = e.selectedIndex, jl = e.options.length; j < jl; ++j) {
                                o = e.options[j];
                                if (o.selected) {
                                  data[item++] = n + eUC(o.attributes.value && o.attributes.value.specified ? o.value : o.text);
                                }
                            }
                        }
                        break;
                    case 'radio':
                    case 'checkbox':
                        if (e.checked) {
                            data[item++] = n + v;
                        }
                        break;
                    case 'file':
                        // stub case as XMLHttpRequest will only send the file path as a string.
                    case undefined:
                        // stub case for fieldset element which returns undefined.
                    case 'reset':
                        // stub case for input type reset button.
                    case 'button':
                        // stub case for input type button elements.
                        break;
                    case 'submit':
                    default:
                        data[item++] = n + v;
                }
            }
        }
        Y.log('HTML form serialized. The value is: ' + data.join('&'), 'info', 'io');
        return s ? data.join('&') + "&" + s : data.join('&');
    }
}, true);
