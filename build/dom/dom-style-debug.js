YUI.add('dom-style', function(Y) {

(function(Y) {
/** 
 * Add style management functionality to DOM.
 * @module dom
 * @submodule dom-style
 * @for DOM
 */

var DOCUMENT_ELEMENT = 'documentElement',
    DEFAULT_VIEW = 'defaultView',
    OWNER_DOCUMENT = 'ownerDocument',
    STYLE = 'style',
    FLOAT = 'float',
    CSS_FLOAT = 'cssFloat',
    STYLE_FLOAT = 'styleFloat',
    TRANSPARENT = 'transparent',
    GET_COMPUTED_STYLE = 'getComputedStyle',

    DOCUMENT = Y.config.doc,
    UNDEFINED = undefined,

    re_color = /color$/i;


Y.mix(Y.DOM, {
    CUSTOM_STYLES: {
    },


    /**
     * Sets a style property for a given element.
     * @method setStyle
     * @param {HTMLElement} An HTMLElement to apply the style to.
     * @param {String} att The style property to set. 
     * @param {String|Number} val The value. 
     */
    setStyle: function(node, att, val, style) {
        style = style || node.style;
        var CUSTOM_STYLES = Y.DOM.CUSTOM_STYLES;

        if (style) {
            if (val === null) {
                val = ''; // normalize for unsetting
            }
            if (att in CUSTOM_STYLES) {
                if (CUSTOM_STYLES[att].set) {
                    CUSTOM_STYLES[att].set(node, val, style);
                    return; // NOTE: return
                } else if (typeof CUSTOM_STYLES[att] === 'string') {
                    att = CUSTOM_STYLES[att];
                }
            }
            style[att] = val; 
        }
    },

    /**
     * Returns the current style value for the given property.
     * @method getStyle
     * @param {HTMLElement} An HTMLElement to get the style from.
     * @param {String} att The style property to get. 
     */
    getStyle: function(node, att) {
        var style = node[STYLE],
            CUSTOM_STYLES = Y.DOM.CUSTOM_STYLES,
            val = '';

        if (style) {
            if (att in CUSTOM_STYLES) {
                if (CUSTOM_STYLES[att].get) {
                    return CUSTOM_STYLES[att].get(node, att, style); // NOTE: return
                } else if (typeof CUSTOM_STYLES[att] === 'string') {
                    att = CUSTOM_STYLES[att];
                }
            }
            val = style[att];
            if (val === '') { // TODO: is empty string sufficient?
                val = Y.DOM[GET_COMPUTED_STYLE](node, att);
            }
        }

        return val;
    },

    /**
     * Sets multiple style properties.
     * @method setStyles
     * @param {HTMLElement} node An HTMLElement to apply the styles to. 
     * @param {Object} hash An object literal of property:value pairs. 
     */
    setStyles: function(node, hash) {
        var style = node.style;
        Y.each(hash, function(v, n) {
            Y.DOM.setStyle(node, n, v, style);
        }, Y.DOM);
    },

    /**
     * Returns the computed style for the given node.
     * @method getComputedStyle
     * @param {HTMLElement} An HTMLElement to get the style from.
     * @param {String} att The style property to get. 
     * @return {String} The computed value of the style property. 
     */
    getComputedStyle: function(node, att) {
        var val = '',
            doc = node[OWNER_DOCUMENT];

        if (node[STYLE]) {
            val = doc[DEFAULT_VIEW][GET_COMPUTED_STYLE](node, null)[att];
        }
        return val;
    }
});

// normalize reserved word float alternatives ("cssFloat" or "styleFloat")
if (DOCUMENT[DOCUMENT_ELEMENT][STYLE][CSS_FLOAT] !== UNDEFINED) {
    Y.DOM.CUSTOM_STYLES[FLOAT] = CSS_FLOAT;
} else if (DOCUMENT[DOCUMENT_ELEMENT][STYLE][STYLE_FLOAT] !== UNDEFINED) {
    Y.DOM.CUSTOM_STYLES[FLOAT] = STYLE_FLOAT;
}

// fix opera computedStyle default color unit (convert to rgb)
if (Y.UA.opera) {
    Y.DOM[GET_COMPUTED_STYLE] = function(node, att) {
        var view = node[OWNER_DOCUMENT][DEFAULT_VIEW],
            val = view[GET_COMPUTED_STYLE](node, '')[att];

        if (re_color.test(att)) {
            val = Y.Color.toRGB(val);
        }

        return val;
    };

}

// safari converts transparent to rgba(), others use "transparent"
if (Y.UA.webkit) {
    Y.DOM[GET_COMPUTED_STYLE] = function(node, att) {
        var view = node[OWNER_DOCUMENT][DEFAULT_VIEW],
            val = view[GET_COMPUTED_STYLE](node, '')[att];

        if (val === 'rgba(0, 0, 0, 0)') {
            val = TRANSPARENT; 
        }

        return val;
    };

}
})(Y);
(function(Y) {
var TO_STRING = 'toString',
    PARSE_INT = parseInt,
    RE = RegExp;

Y.Color = {
    KEYWORDS: {
        black: '000',
        silver: 'c0c0c0',
        gray: '808080',
        white: 'fff',
        maroon: '800000',
        red: 'f00',
        purple: '800080',
        fuchsia: 'f0f',
        green: '008000',
        lime: '0f0',
        olive: '808000',
        yellow: 'ff0',
        navy: '000080',
        blue: '00f',
        teal: '008080',
        aqua: '0ff'
    },

    re_RGB: /^rgb\(([0-9]+)\s*,\s*([0-9]+)\s*,\s*([0-9]+)\)$/i,
    re_hex: /^#?([0-9A-F]{2})([0-9A-F]{2})([0-9A-F]{2})$/i,
    re_hex3: /([0-9A-F])/gi,

    toRGB: function(val) {
        if (!Y.Color.re_RGB.test(val)) {
            val = Y.Color.toHex(val);
        }

        if(Y.Color.re_hex.exec(val)) {
            val = 'rgb(' + [
                PARSE_INT(RE.$1, 16),
                PARSE_INT(RE.$2, 16),
                PARSE_INT(RE.$3, 16)
            ].join(', ') + ')';
        }
        return val;
    },

    toHex: function(val) {
        val = Y.Color.KEYWORDS[val] || val;
        if (Y.Color.re_RGB.exec(val)) {
            var r = (RE.$1.length === 1) ? '0' + RE.$1 : Number(RE.$1),
                g = (RE.$2.length === 1) ? '0' + RE.$2 : Number(RE.$2),
                b = (RE.$3.length === 1) ? '0' + RE.$3 : Number(RE.$3);

            val = [
                r[TO_STRING](16),
                g[TO_STRING](16),
                b[TO_STRING](16)
            ].join('');
        }

        if (val.length < 6) {
            val = val.replace(Y.Color.re_hex3, '$1$1');
        }

        if (val !== 'transparent' && val.indexOf('#') < 0) {
            val = '#' + val;
        }

        return val.toLowerCase();
    }
};
})(Y);

(function(Y) {
var CLIENT_TOP = 'clientTop',
    CLIENT_LEFT = 'clientLeft',
    HAS_LAYOUT = 'hasLayout',
    PX = 'px',
    FILTER = 'filter',
    FILTERS = 'filters',
    OPACITY = 'opacity',
    AUTO = 'auto',
    BORDER_TOP_WIDTH = 'borderTopWidth',
    BORDER_RIGHT_WIDTH = 'borderRightWidth',
    BORDER_BOTTOM_WIDTH = 'borderBottomWidth',
    BORDER_LEFT_WIDTH = 'borderLeftWidth',
    WIDTH = 'width',
    HEIGHT = 'height',
    TRANSPARENT = 'transparent',
    VISIBLE = 'visible',
    GET_COMPUTED_STYLE = 'getComputedStyle',
    UNDEFINED = undefined,
    documentElement = document.documentElement,

    // TODO: unit-less lineHeight (e.g. 1.22)
    re_size = /^width|height$/,
    re_unit = /^(\d[.\d]*)+(em|ex|px|gd|rem|vw|vh|vm|ch|mm|cm|in|pt|pc|deg|rad|ms|s|hz|khz|%){1}?/i,

    _getStyleObj = function(node) {
        return node.currentStyle || node.style;
    },

    ComputedStyle = {
        CUSTOM_STYLES: {},

        get: function(el, property) {
            var value = '',
                current;

            if (el) {
                    current = _getStyleObj(el)[property];

                if (property === OPACITY) {
                    value = Y.DOM.CUSTOM_STYLES[OPACITY].get(el);        
                } else if (!current || (current.indexOf && current.indexOf(PX) > -1)) { // no need to convert
                    value = current;
                } else if (Y.DOM.IE.COMPUTED[property]) { // use compute function
                    value = Y.DOM.IE.COMPUTED[property](el, property);
                } else if (re_unit.test(current)) { // convert to pixel
                    value = ComputedStyle.getPixel(el, property) + PX;
                } else {
                    value = current;
                }
            }

            return value;
        },

        getOffset: function(el, prop) {
            var current = _getStyleObj(el)[prop],                     // value of "width", "top", etc.
                capped = prop.charAt(0).toUpperCase() + prop.substr(1), // "Width", "Top", etc.
                offset = 'offset' + capped,                             // "offsetWidth", "offsetTop", etc.
                pixel = 'pixel' + capped,                               // "pixelWidth", "pixelTop", etc.
                actual,
                value = '';

            if (current === AUTO) {
                actual = el[offset]; // offsetHeight/Top etc.
                if (actual === UNDEFINED) { // likely "right" or "bottom"
                    value = 0;
                }

                value = actual;
                if (re_size.test(prop)) { // account for box model diff 
                    el.style[prop] = actual;
                    if (el[offset] > actual) {
                        // the difference is padding + border (works in Standards & Quirks modes)
                        value = actual - (el[offset] - actual);
                    }
                    el.style[prop] = AUTO; // revert to auto
                }
            } else { // convert units to px
                if (current.indexOf('%') > -1) { // IE pixelWidth incorrect for percent; manually compute 
                    current = el.clientWidth - // offsetWidth - borderWidth
                            ComputedStyle.getPixel(el, 'paddingRight') -
                            ComputedStyle.getPixel(el, 'paddingLeft');
                }
                if (!el.style[pixel] && !el.style[prop]) { // need to map style.width to currentStyle (no currentStyle.pixelWidth)
                    el.style[prop] = current;              // no style.pixelWidth if no style.width
                }
                value = el.style[pixel];
            }
            return value + PX;
        },

        getBorderWidth: function(el, property) {
            // clientHeight/Width = paddingBox (e.g. offsetWidth - borderWidth)
            // clientTop/Left = borderWidth
            var value = null;
            if (!el.currentStyle || !el.currentStyle[HAS_LAYOUT]) { // TODO: unset layout?
                el.style.zoom = 1; // need layout to measure client
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
                style = _getStyleObj(node),
                styleRight = style.right,
                current = style[att];

            node.style.right = current;
            val = node.style.pixelRight;
            node.style.right = styleRight; // revert

            return val;
        },

        getMargin: function(node, att) {
            var val,
                style = _getStyleObj(node);

            if (style[att] == AUTO) {
                val = 0;
            } else {
                val = ComputedStyle.getPixel(node, att);
            }
            return val + PX;
        },

        getVisibility: function(node, att) {
            var current;
            while ( (current = node.currentStyle) && current[att] == 'inherit') { // NOTE: assignment in test
                node = node.parentNode;
            }
            return (current) ? current[att] : VISIBLE;
        },

        getColor: function(node, att) {
            var current = _getStyleObj(node)[att];

            if (!current || current === TRANSPARENT) {
                Y.DOM.elementByAxis(node, 'parentNode', null, function(parent) {
                    current = _getStyleObj(parent)[att];
                    if (current && current !== TRANSPARENT) {
                        node = parent;
                        return true;
                    }
                });
            }

            return Y.Color.toRGB(current);
        },

        getBorderColor: function(node, att) {
            var current = _getStyleObj(node),
                val = current[att] || current.color;
            return Y.Color.toRGB(Y.Color.toHex(val));
        }
    },

    //fontSize: getPixelFont,
    IEComputed = {};

// use alpha filter for IE opacity
if (documentElement.style[OPACITY] === UNDEFINED &&
        documentElement[FILTERS]) {
    Y.DOM.CUSTOM_STYLES[OPACITY] = {
        get: function(node) {
            var val = 100;
            try { // will error if no DXImageTransform
                val = node[FILTERS]['DXImageTransform.Microsoft.Alpha'][OPACITY];

            } catch(e) {
                try { // make sure its in the document
                    val = node[FILTERS]('alpha')[OPACITY];
                } catch(err) {
                    Y.log('getStyle: IE opacity filter not found; returning 1', 'warn', 'dom-style');
                }
            }
            return val / 100;
        },

        set: function(node, val, style) {
            var current,
                styleObj;

            if (val === '') { // normalize inline style behavior
                styleObj = _getStyleObj(node);
                current = (OPACITY in styleObj) ? styleObj[OPACITY] : 1; // revert to original opacity
                val = current;
            }

            if (typeof style[FILTER] == 'string') { // in case not appended
                style[FILTER] = 'alpha(' + OPACITY + '=' + val * 100 + ')';
                
                if (!node.currentStyle || !node.currentStyle[HAS_LAYOUT]) {
                    style.zoom = 1; // needs layout 
                }
            }
        }
    };
}

try {
    document.createElement('div').style.height = '-1px';
} catch(e) { // IE throws error on invalid style set; trap common cases
    Y.DOM.CUSTOM_STYLES.height = {
        set: function(node, val, style) {
            if (parseInt(val, 10) >= 0) {
                style.height = val;
            } else {
                Y.log('invalid style value for height: ' + val, 'warn', 'dom-style');
            }
        }
    };

    Y.DOM.CUSTOM_STYLES.width = {
        set: function(node, val, style) {
            if (parseInt(val, 10) >= 0) {
                style.width = val;
            } else {
                Y.log('invalid style value for width: ' + val, 'warn', 'dom-style');
            }
        }
    };
}

// TODO: top, right, bottom, left
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

})(Y);


}, '@VERSION@' ,{skinnable:false, requires:['dom-base']});
