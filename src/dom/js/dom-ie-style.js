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
