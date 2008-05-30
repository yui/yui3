YUI.add('style', function(Y) {

    var OWNER_DOCUMENT = 'ownerDocument',
        DEFAULT_VIEW = 'defaultView';

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
                        Y.log('getStyle: IE opacity filter not found; returning 1', 'warn', 'Style');
                    }
                }
                return val / 100;
            },

            set: function(node, val) {
                if (typeof node.style.filter == 'string') { // in case not appended
                    node.style.filter = 'alpha(opacity=' + val * 100 + ')';
                    
                    if (!node.currentStyle || !node.currentStyle.hasLayout) {
                        node.style.zoom = 1; // needs layout 
                    }
                }
            }
        }
    }


    var Style = {
        set: function(node, att, val) {
            if (node.style) {
                if (_alias[att]) {
                    if (_alias[att].set) {
                        _alias[att].set(node, val);
                        return; // NOTE: return
                    } else {
                        att = _alias[att];
                    }
                }
                node.style[att] = val; 
            }
        },

        get: function(node, att) {
            var style = node.style;
            if (_alias[att]) {
                if (_alias[att].get) {
                    return _alias[att].get(node); // NOTE: return
                } else {
                    att = _alias[att];
                }
            }

            var val = style ? style[att] : undefined;
            if (val === '') { // TODO: is empty string sufficient?
                val = Y.Style.getComputed(node, att);
            }

            return val;
        },

        getComputed: function(node, att) {
            var view = node[OWNER_DOCUMENT][DEFAULT_VIEW],
                val;

            if (view && view.getComputedStyle) {
                val = view.getComputedStyle(node, '')[att];
            } else if (node.currentStyle) {
                val =  node.currentStyle[att];
            }

            if (val === undefined) {
                val = ''; // TODO: more robust
            }

            return val;
        }
   };

    Y.Style = Style;
}, '3.0.0');
