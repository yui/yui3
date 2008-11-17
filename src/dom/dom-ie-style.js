/**
 * Add style management functionality to DOM.
 * @module dom
 * @submodule dom-style
 * @for DOM
 */

var CLIENT_TOP = 'clientTop',
    CLIENT_LEFT = 'clientLeft',
    PARENT_NODE = 'parentNode',
    RIGHT = 'right',
    HAS_LAYOUT = 'hasLayout',
    PX = 'px',
    FILTER = 'filter',
    FILTERS = 'filters',
    OPACITY = 'opacity',
    AUTO = 'auto',
    CURRENT_STYLE = 'currentStyle';

// use alpha filter for IE opacity
if (document[DOCUMENT_ELEMENT][STYLE][OPACITY] === UNDEFINED &&
        document[DOCUMENT_ELEMENT][FILTERS]) {
    Y.DOM.CUSTOM_STYLES[OPACITY] = {
        get: function(node) {
            var val = 100;
            try { // will error if no DXImageTransform
                val = node[FILTERS]['DXImageTransform.Microsoft.Alpha'][OPACITY];

            } catch(e) {
                try { // make sure its in the document
                    val = node[FILTERS]('alpha')[OPACITY];
                } catch(err) {
                    Y.log('getStyle: IE opacity filter not found; returning 1', 'warn', 'DOM');
                }
            }
            return val / 100;
        },

        set: function(node, val, style) {
            if (typeof style[FILTER] == 'string') { // in case not appended
                style[FILTER] = 'alpha(' + OPACITY + '=' + val * 100 + ')';
                
                if (!node[CURRENT_STYLE] || !node[CURRENT_STYLE][HAS_LAYOUT]) {
                    style.zoom = 1; // needs layout 
                }
            }
        }
    };
}

// IE getComputedStyle
// TODO: unit-less lineHeight (e.g. 1.22)
var re_size = /^width|height$/,
    re_unit = /^(\d[.\d]*)+(em|ex|px|gd|rem|vw|vh|vm|ch|mm|cm|in|pt|pc|deg|rad|ms|s|hz|khz|%){1}?/i;

var ComputedStyle = {
    CUSTOM_STYLES: {},

    get: function(el, property) {
        var value = '',
            current = el[CURRENT_STYLE][property];

        if (property === OPACITY) {
            value = Y.DOM.CUSTOM_STYLES[OPACITY].get(el);        
        } else if (!current || (current.indexOf && current.indexOf(PX) > -1)) { // no need to convert
            value = current;
        } else if (Y.DOM.IE.COMPUTED[property]) { // use compute function
            value = Y.DOM.IE.COMPUTED[property](el, property);
        } else if (re_unit.test(current)) { // convert to pixel
            value = Y.DOM.IE.ComputedStyle.getPixel(el, property);
        } else {
            value = current;
        }

        return value;
    },

    getOffset: function(el, prop) {
        var current = el[CURRENT_STYLE][prop],                        // value of "width", "top", etc.
            capped = prop.charAt(0).toUpperCase() + prop.substr(1), // "Width", "Top", etc.
            offset = 'offset' + capped,                             // "offsetWidth", "offsetTop", etc.
            pixel = 'pixel' + capped,                               // "pixelWidth", "pixelTop", etc.
            value = '';

        if (current == AUTO) {
            var actual = el[offset]; // offsetHeight/Top etc.
            if (actual === UNDEFINED) { // likely "right" or "bottom"
                value = 0;
            }

            value = actual;
            if (re_size.test(prop)) { // account for box model diff 
                el[STYLE][prop] = actual; 
                if (el[offset] > actual) {
                    // the difference is padding + border (works in Standards & Quirks modes)
                    value = actual - (el[offset] - actual);
                }
                el[STYLE][prop] = AUTO; // revert to auto
            }
        } else { // convert units to px
            if (!el[STYLE][pixel] && !el[STYLE][prop]) { // need to map style.width to currentStyle (no currentStyle.pixelWidth)
                el[STYLE][prop] = current;              // no style.pixelWidth if no style.width
            }
            value = el[STYLE][pixel];
        }
        return value + PX;
    },

    getBorderWidth: function(el, property) {
        // clientHeight/Width = paddingBox (e.g. offsetWidth - borderWidth)
        // clientTop/Left = borderWidth
        var value = null;
        if (!el[CURRENT_STYLE][HAS_LAYOUT]) { // TODO: unset layout?
            el[STYLE].zoom = 1; // need layout to measure client
        }

        switch(property) {
            case BORDER_TOP_WIDTH:
                value = el[CLIENT_TOP];
                break;
            case BORDER_BOTTOM_WIDTH:
                value = el.offsetHeight - el.clientHeight - el[CLIENT_TOP];
                break;
            case BORDER_LEFT_WIDTH:
                value = el[CLIENT_LEFT];
                break;
            case BORDER_RIGHT_WIDTH:
                value = el.offsetWidth - el.clientWidth - el[CLIENT_LEFT];
                break;
        }
        return value + PX;
    },

    getPixel: function(node, att) {
        // use pixelRight to convert to px
        var val = null,
            styleRight = node[CURRENT_STYLE][RIGHT],
            current = node[CURRENT_STYLE][att];

        node[STYLE][RIGHT] = current;
        val = node[STYLE].pixelRight;
        node[STYLE][RIGHT] = styleRight; // revert

        return val + PX;
    },

    getMargin: function(node, att) {
        var val;
        if (node[CURRENT_STYLE][att] == AUTO) {
            val = 0 + PX;
        } else {
            val = Y.DOM.IE.ComputedStyle.getPixel(node, att);
        }
        return val;
    },

    getVisibility: function(node, att) {
        var current;
        while ( (current = node[CURRENT_STYLE]) && current[att] == 'inherit') { // NOTE: assignment in test
            node = node[PARENT_NODE];
        }
        return (current) ? current[att] : VISIBLE;
    },

    getColor: function(node, att) {
        var current = node[CURRENT_STYLE][att];

        if (!current || current === TRANSPARENT) {
            Y.DOM.elementByAxis(node, PARENT_NODE, null, function(parent) {
                current = parent[CURRENT_STYLE][att];
                if (current && current !== TRANSPARENT) {
                    node = parent;
                    return true;
                }
            });
        }

        return Y.Color.toRGB(current);
    },

    getBorderColor: function(node, att) {
        var current = node[CURRENT_STYLE];
        var val = current[att] || current.color;
        return Y.Color.toRGB(Y.Color.toHex(val));
    }

};

//fontSize: getPixelFont,
var IEComputed = {};

IEComputed[WIDTH] = IEComputed[HEIGHT] = ComputedStyle.getOffset;

IEComputed.color = IEComputed.backgroundColor = ComputedStyle.getColor;

IEComputed[BORDER_TOP_WIDTH] = IEComputed[BORDER_RIGHT_WIDTH] =
        IEComputed[BORDER_BOTTOM_WIDTH] = IEComputed[BORDER_LEFT_WIDTH] =
        ComputedStyle.getBorderWidth;

IEComputed.marginTop = IEComputed.marginRight = IEComputed.marginBottom =
        IEComputed.marginLeft = ComputedStyle.getMargin;

IEComputed.visibility = ComputedStyle.getVisibility;
IEComputed.borderColor = IEComputed.borderTopColor =
        IEComputed.borderRightColor = IEComputed.borderBottomColor =
        IEComputed.borderLeftColor = ComputedStyle.getBorderColor;

if (!Y.config.win[GET_COMPUTED_STYLE]) {
    Y.DOM[GET_COMPUTED_STYLE] = ComputedStyle.get; 
}

Y.namespace('DOM.IE');
Y.DOM.IE.COMPUTED = IEComputed;
Y.DOM.IE.ComputedStyle = ComputedStyle;

