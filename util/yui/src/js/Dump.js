// requires lang
(function() {

    var M = function(Y) {

        /**
         * Returns a simple string representation of the object or array.
         * Other types of objects will be returned unprocessed.  Arrays
         * are expected to be indexed.  Use object notation for
         * associative arrays.
         * @method dump
         * @since 2.3.0
         * @param o {Object} The object to dump
         * @param d {int} How deep to recurse child objects, default 3
         * @return {String} the dump result
         */
        Y.lang.dump = function(o, d) {
            var l=Y.lang,i,len,s=[],OBJ="{...}",FUN="f(){...}",
                COMMA=', ', ARROW=' => ';

            // Cast non-objects to string
            // Skip dates because the std toString is what we want
            // Skip HTMLElement-like objects because trying to dump 
            // an element will cause an unhandled exception in FF 2.x
            if (!l.isObject(o)) {
                return o + "";
            } else if (o instanceof Date || ("nodeType" in o && "tagName" in o)) {
                return o;
            } else if  (l.isFunction(o)) {
                return FUN;
            }

            // dig into child objects the depth specifed. Default 3
            d = (l.isNumber(d)) ? d : 3;

            // arrays [1, 2, 3]
            if (l.isArray(o)) {
                s.push("[");
                for (i=0,len=o.length;i<len;i=i+1) {
                    if (l.isObject(o[i])) {
                        s.push((d > 0) ? l.dump(o[i], d-1) : OBJ);
                    } else {
                        s.push(o[i]);
                    }
                    s.push(COMMA);
                }
                if (s.length > 1) {
                    s.pop();
                }
                s.push("]");
            // objects {k1 => v1, k2 => v2}
            } else {
                s.push("{");
                for (i in o) {
                    if (l.hasOwnProperty(o, i)) {
                        s.push(i + ARROW);
                        if (l.isObject(o[i])) {
                            s.push((d > 0) ? l.dump(o[i], d-1) : OBJ);
                        } else {
                            s.push(o[i]);
                        }
                        s.push(COMMA);
                    }
                }
                if (s.length > 1) {
                    s.pop();
                }
                s.push("}");
            }

            return s.join("");
        };
    };

    // Register the module with the global YUI object
    YUI.add("dump", null , M, "3.0.0");

})();

