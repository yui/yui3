/**
 * Object utils
 * @class object
 */
YUI.add("object", function(Y) {

    // Returns a new object based upon the supplied object
    Y.object = function(o) {
        var F = function() {};
        F.prototype = o;
        return new F();
    }; 

    var O = Y.object, L = Y.lang;

    /**
     * Determines whether or not the property was added
     * to the object instance.  Returns false if the property is not present
     * in the object, or was inherited from the prototype.
     * This abstraction is provided to basic hasOwnProperty for Safari 1.3.x.
     * This 
     * There is a discrepancy between YAHOO.lang.hasOwnProperty and
     * Object.prototype.hasOwnProperty when the property is a primitive added to
     * both the instance AND prototype with the same value:
     * <pre>
     * var A = function() {};
     * A.prototype.foo = 'foo';
     * var a = new A();
     * a.foo = 'foo';
     * alert(a.hasOwnProperty('foo')); // true
     * alert(YAHOO.lang.hasOwnProperty(a, 'foo')); // false when using fallback
     * </pre>
     * @method owns
     * @param o {any} The object being testing
     * @parma p {string} the property to look for
     * @return Boolean
     */
    O.owns = (Object.prototype.hasOwnProperty) ? 
        function(o, p) {
            return (o.hasOwnProperty) ? o.hasOwnProperty(p) : true;
        } : 
        function(o, p) {
            return !L.isUndefined(o[p]) && 
                    o.constructor.prototype[p] !== o[p];
        };

    // @todo remove --- 
    // L.hasOwnProperty = function(o, p) {
        // Y.log("Y.lang.hasOwnProperty will not be in 3.0.  Use Y.object.owns instead. "  +
        // "This warning is here because omitting this function will cause silent failure " +
        // "in browsers the have a hasOwnProperty implementation.");
        // return O.owns(o, p);
    // };

    /**
     * Returns an array containing the object's keys
     * @method keys
     * @param o an object
     * @return {string[]} the keys
     */
    O.keys = function(o) {
        var a=[], i;
        for (i in o) {
            if (O.owns(o, i)) {
                a.push(i);
            }
        }

        return a;
    };

    /**
     * Executes a function on each item. The function
     * receives the value, the key, and the object
     * as paramters (in that order).
     * @param o the object to iterate
     * @param f {function} the function to execute
     * @param c the execution context
     * @return {YUI} the YUI instance
     */
    O.each = function (o, f, c) {
        var s = c || Y;

        // hack in NodeList support
        // if (o.length && o.item) {
        //     for (var i=0, l=o..get('length'); i<l; i=i+1) {
        //         f.call(s, o.item(i), i, o);
        //     }
        // } else {
        //     for (var i in o) {
        //         if (O.owns(o, i)) {
        //             f.call(s, o[i], i, o);
        //         }
        //     }
        // }

        for (var i in o) {
            if (O.owns(o, i)) {
                f.call(s, o[i], i, o);
            }
        }
        return Y;
    };
}, "3.0.0");
