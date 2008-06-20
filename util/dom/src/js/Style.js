YUI.add('style', function(Y) {

    var OWNER_DOCUMENT = 'ownerDocument',
        DEFAULT_VIEW = 'defaultView',
        PX = 'px';

    var _alias = {};

    if (document.documentElement.style.cssFloat !== undefined) {
        _alias['float'] = 'cssFloat';
    } else if (document.documentElement.style.styleFloat !== undefined) {
        _alias['float'] = 'styleFloat';
    }

    // use alpha filter for IE opacity
    if (document.documentElement.style.opacity === undefined &&
            document.documentElement.filters) {
        _alias['opacity'] = {
            get: function(node) {
                var val = 100;
                try { // will error if no DXImageTransform
                    val = node.filters['DXImageTransform.Microsoft.Alpha'].opacity;

                } catch(e) {
                    try { // make sure its in the document
                        val = node.filters('alpha').opacity;
                    } catch(e) {
                        Y.log('getStyle: IE opacity filter not found; returning 1', 'warn', 'DOM');
                    }
                }
                return val / 100;
            },

            set: function(node, val, style) {
                if (typeof style.filter == 'string') { // in case not appended
                    style.filter = 'alpha(opacity=' + val * 100 + ')';
                    
                    if (!node.currentStyle || !node.currentStyle.hasLayout) {
                        style.zoom = 1; // needs layout 
                    }
                }
            }
        }
    }


    Y.mix(Y.DOM, {
        setStyle: function(node, att, val) {
            var style = node.style;
            if (style) {
                if (_alias[att]) {
                    if (_alias[att].set) {
                        _alias[att].set(node, val, style);
                        return; // NOTE: return
                    } else {
                        att = _alias[att];
                    }
                }
                node.style[att] = val; 
            }
        },

        getStyle: function(node, att) {
            var style = node.style;
            if (_alias[att]) {
                if (style && _alias[att].get) {
                    return _alias[att].get(node, att, style); // NOTE: return
                } else {
                    att = _alias[att];
                }
            }

            var val = style ? style[att] : undefined;
            if (val === '') { // TODO: is empty string sufficient?
                val = Y.DOM.getComputedStyle(node, att);
            }

            return val;
        },

        getComputedStyle: function(node, att) {
            var view = node[OWNER_DOCUMENT][DEFAULT_VIEW];
            return view.getComputedStyle(node, '')[att];
        }
   });

    // IE getComputedStyle
    // TODO: unit-less lineHeight (e.g. 1.22)
    var re_compute = /[a-z]*(?:height|width|top|bottom|left|right|fontSize|color|visibility)/i,
        re_size = /^width|height$/,
        re_color = /color$/i,
        re_rgb = /^rgb\(([0-9]+)\s*,\s*([0-9]+)\s*,\s*([0-9]+)\)$/i,
        re_hex = /^#?([0-9A-F]{2})([0-9A-F]{2})([0-9A-F]{2})$/i,
        re_unit = /^(\d[.\d]*)+(em|ex|px|gd|rem|vw|vh|vm|ch|mm|cm|in|pt|pc|deg|rad|ms|s|hz|khz|%){1}?/i;

    var getIEComputedStyle = function(el, property) {
        var value = '',
            current = el.currentStyle[property],
            match = re_compute.exec(property);

        if (!match || current.indexOf(PX) > -1) { // no need to convert
            value = current;
        } else if (match && computed[match[0]]) { // use compute function
            value = computed[match[0]](el, property);
        } else if (re_unit.test(current)) { // convert to pixel
            value = getPixel(el, property);
        }

        return value;
    };

    var getPixelLayout = function(el, prop) {
        var current = el.currentStyle[prop],                        // value of "width", "top", etc.
            capped = prop.charAt(0).toUpperCase() + prop.substr(1), // "Width", "Top", etc.
            offset = 'offset' + capped,                             // "offsetWidth", "offsetTop", etc.
            pixel = 'pixel' + capped,                               // "pixelWidth", "pixelTop", etc.
            value = '';

        if (current == 'auto') {
            var actual = el[offset]; // offsetHeight/Top etc.
            if (actual === undefined) { // likely "right" or "bottom"
                val = 0;
            }

            value = actual;
            if (re_size.test(prop)) { // account for box model diff 
                el.style[prop] = actual; 
                if (el[offset] > actual) {
                    // the difference is padding + border (works in Standards & Quirks modes)
                    value = actual - (el[offset] - actual);
                }
                el.style[prop] = 'auto'; // revert to auto
            }
        } else { // convert units to px
            if (!el.style[pixel] && !el.style[prop]) { // need to map style.width to currentStyle (no currentStyle.pixelWidth)
                el.style[prop] = current;              // no style.pixelWidth if no style.width
            }
            value = el.style[pixel];
        }
        return value + PX;
    };

    var getPixelBorder = function(el, property) {
        // clientHeight/Width = paddingBox (e.g. offsetWidth - borderWidth)
        // clientTop/Left = borderWidth
        var value = null;
        if (!el.currentStyle.hasLayout) {
            el.style.zoom = 1; // need layout to measure client
        }

        switch(property) {
            case 'borderTopWidth':
                value = el.clientTop;
                break;
            case 'borderBottomWidth':
                value = el.offsetHeight - el.clientHeight - el.clientTop;
                break;
            case 'borderLeftWidth':
                value = el.clientLeft;
                break;
            case 'borderRightWidth':
                value = el.offsetWidth - el.clientWidth - el.clientLeft;
                break;
        }
        return value + PX;
    };

    var getPixel = function(node, att) {
        // use pixelRight to convert to px
        var val = null,
            styleRight = node.currentStyle.right,
            current = node.currentStyle[att];

        node.style.right = current;
        val = node.style.pixelRight;
        node.style.right = styleRight; // revert

        return val + PX;
    };

    var getPixelMargin = function(node, att) {
        if (node.currentStyle[att] == 'auto') {
            val = 0 + PX;
        } else {
            val = getPixel(node, att);
        }
        return val;
    };

    var getVisibility = function(node, att) {
        var current;
        while ( (current = node.currentStyle) && current[att] == 'inherit') { // NOTE: assignment in test
            node = node.parentNode;
        }
        return (current) ? current[att] : 'visible';
    };

    var computed = {
        width: getPixelLayout,
        height: getPixelLayout,
        borderTopWidth: getPixelBorder,
        borderRightWidth: getPixelBorder,
        borderBottomWidth: getPixelBorder,
        borderLeftWidth: getPixelBorder,
        marginTop: getPixelMargin,
        marginRight: getPixelMargin,
        marginBottom: getPixelMargin,
        marginLeft: getPixelMargin,
        visibility: getVisibility
        //fontSize: getPixelFont,
        //color: getComputedColor
    };


    if (!window.getComputedStyle) {
        Y.DOM.getComputedStyle = getIEComputedStyle; 
    }
}, '3.0.0', { requires: ['dom'] });
