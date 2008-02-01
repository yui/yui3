
(function() {

    var M = function(Y) {

        var getStyle,           // for load time browser branching
            setStyle,           // ditto
            propertyCache = {}, // for faster hyphen converts
            document = Y.config.doc;     // cache for faster lookups
        
        // brower detection
        var isOpera = Y.ua.opera,
            isSafari = Y.ua.webkit, 
            isGecko = Y.ua.gecko,
            isIE = Y.ua.ie; 
        
        // regex cache
        var patterns = {
            HYPHEN: /(-[a-z])/i // to normalize get/setStyle
        };

        var toCamel = function(property) {
            if ( !patterns.HYPHEN.test(property) ) {
                return property; // no hyphens
            }
            
            if (propertyCache[property]) { // already converted
                return propertyCache[property];
            }
           
            var converted = property;
     
            while( patterns.HYPHEN.exec(converted) ) {
                converted = converted.replace(RegExp.$1,
                        RegExp.$1.substr(1).toUpperCase());
            }
            
            propertyCache[property] = converted;
            return converted;
            //return property.replace(/-([a-z])/gi, function(m0, m1) {return m1.toUpperCase()}) // cant use function as 2nd arg yet due to safari bug
        };
        
        // branching at load instead of runtime
        if (document.defaultView && document.defaultView.getComputedStyle) { // W3C DOM method
            getStyle = function(el, property) {
                var value = null;
                
                if (property == 'float') { // fix reserved word
                    property = 'cssFloat';
                }

                var computed = document.defaultView.getComputedStyle(el, '');
                if (computed) { // test computed before touching for safari
                    value = computed[toCamel(property)];
                }
                
                return el.style[property] || value;
            };
        } else if (document.documentElement.currentStyle && isIE) { // IE method
            getStyle = function(el, property) {                         
                switch( toCamel(property) ) {
                    case 'opacity' :// IE opacity uses filter
                        var val = 100;
                        try { // will error if no DXImageTransform
                            val = el.filters['DXImageTransform.Microsoft.Alpha'].opacity;

                        } catch(e) {
                            try { // make sure its in the document
                                val = el.filters('alpha').opacity;
                            } catch(e) {
                                Y.log('getStyle: IE filter failed',
                                        'error', 'Dom');
                            }
                        }
                        return val / 100;
                    case 'float': // fix reserved word
                        property = 'styleFloat'; // fall through
                    default: 
                        // test currentStyle before touching
                        var value = el.currentStyle ? el.currentStyle[property] : null;
                        return ( el.style[property] || value );
                }
            };
        } else { // default to inline only
            getStyle = function(el, property) { return el.style[property]; };
        }
        
        if (isIE) {
            setStyle = function(el, property, val) {
                switch (property) {
                    case 'opacity':
                        if ( Y.lang.isString(el.style.filter) ) { // in case not appended
                            el.style.filter = 'alpha(opacity=' + val * 100 + ')';
                            
                            if (!el.currentStyle || !el.currentStyle.hasLayout) {
                                el.style.zoom = 1; // when no layout or cant tell
                            }
                        }
                        break;
                    case 'float':
                        property = 'styleFloat';
                    default:
                    el.style[property] = val;
                }
            };
        } else {
            setStyle = function(el, property, val) {
                if (property == 'float') {
                    property = 'cssFloat';
                }
                el.style[property] = val;
            };
        }

        Y.Dom.getStyle = function(el, property) {
            property = toCamel(property);
            
            var f = function(element) {
                return getStyle(element, property);
            };
            
            return Y.Dom.batch(el, f, Y.Dom, true);
        };
        
         Y.Dom.setStyle = function(el, property, val) {
            property = toCamel(property);
            
            var f = function(element) {
                setStyle(element, property, val);
                Y.log('setStyle setting ' + property + ' to ' + val, 'info', 'Dom');
                
            };
            
            Y.Dom.batch(el, f, Y.Dom, true);
        };

        
        /**
         * Provides helper methods for styling DOM elements.
         * @namespace YAHOO.util
         * @class Style
         */
        Y.Style = {
            /**
             * Normalizes currentStyle and ComputedStyle.
             * @method get
             * @param {String | HTMLElement |Array} el Accepts a string to use as an ID, an actual DOM reference, or an Array of IDs and/or HTMLElements.
             * @param {String} property The style property whose value is returned.
             * @return {String | Array} The current value of the style property for the element(s).
             */
            get: Y.Dom.getStyle,
            /**
             * Wrapper for setting style properties of HTMLElements.  Normalizes "opacity" across modern browsers.
             * @method set
             * @param {String | HTMLElement | Array} el Accepts a string to use as an ID, an actual DOM reference, or an Array of IDs and/or HTMLElements.
             * @param {String} property The style property to be set.
             * @param {String} val The value to apply to the given property.
             */
            set: Y.Dom.setStyle
        };
    };

    YUI.add("style", M, "3.0.0");

})();
