/**
 * String variable substitution and string formatting.
 * If included, the substitute method is added to the YUI instance.
 *
 * @module substitute
 */

    var L = Y.Lang, DUMP = 'dump', SPACE = ' ', LBRACE = '{', RBRACE = '}',
		savedRegExp =  /(~-(\d+)-~)/g, lBraceRegExp = /\{LBRACE\}/g, rBraceRegExp = /\{RBRACE\}/g,

    /**
     * The following methods are added to the YUI instance
     * @class YUI~substitute
     */

    /**
     * Does variable substitution on a string. It scans through the string
     * looking for expressions enclosed in { } braces. If an expression
     * is found, it is used a key on the object.  If there is a space in
     * the key, the first word is used for the key and the rest is provided
     * to an optional function to be used to programatically determine the
     * value (the extra information might be used for this decision). If
     * the value for the key in the object, or what is returned from the
     * function is not undefined (i.e.: it exists) it is
     * substituted for the bracket expression and it continues.  If this
     * value is an object, it uses the Object's toString() if this has
     * been overridden, otherwise it does a shallow dump of the key/value
     * pairs if Y.dump is available (if dump isn't available, toString()
     * is used).
	 * To insert braces in the resulting string, use {LBRACE} and {RBRACE}.
     *
     * This method is included in the 'substitute' module.  It is not included
     * in the YUI module.
     *
     * @method substitute
     * @param {string} s The string that will be modified.
     * @param {object} o An object containing the replacement values.
     * @param {function} f An optional function that can be used to
     *                     process each match.  It receives the key,
     *                     the value read from the object, 
	 *                     and any extra metadata included with
     *                     the key inside of the braces.
     * @param {boolean} recurse if true, the replacement will be recursive,
     * letting you have replacement tokens nested within tokens.  The
     * default is false.
     * @return {string} the substituted string.
     */

    substitute = function(s, o, f, recurse) {
        var i, j, k, key, v, meta, saved = [], token, dump,
            lidx = s.length;

        for (;;) {
            i = s.lastIndexOf(LBRACE, lidx);
            if (i < 0) {
                break;
            }
            j = s.indexOf(RBRACE, i);
            if (i + 1 >= j) {
                break;
            }

            //Extract key and meta info
            token = s.substring(i + 1, j);
            key = token;
            meta = null;
            k = key.indexOf(SPACE);
            if (k > -1) {
                meta = key.substring(k + 1);
                key = key.substring(0, k);
            }

            // lookup the value
            v = o[key];

            // if a substitution function was provided, execute it
            if (f) {
                v = f(key, v, meta);
            }

            if (L.isObject(v)) {
                if (!Y.dump) {
                    v = v.toString();
                } else {
                    if (L.isArray(v)) {
                        v = Y.dump(v, parseInt(meta, 10));
                    } else {
                        meta = meta || '';

                        // look for the keyword 'dump', if found force obj dump
                        dump = meta.indexOf(DUMP);
                        if (dump > -1) {
                            meta = meta.substring(4);
                        }

                        // use the toString if it is not the Object toString
                        // and the 'dump' meta info was not found
                        if (v.toString === Object.prototype.toString ||
                            dump > -1) {
                            v = Y.dump(v, parseInt(meta, 10));
                        } else {
                            v = v.toString();
                        }
                    }
                }
			} else if (L.isUndefined(v)) {
                // This {block} has no replace string. Save it for later.
                v = '~-' + saved.length + '-~';
					saved.push(token);

                // break;
            }

            s = s.substring(0, i) + v + s.substring(j + 1);

			if (!recurse) {
				lidx = i - 1;
			} 
		}
		// restore saved {block}s and escaped braces

		return s
			.replace(savedRegExp, function (str, p1, p2) {
				return LBRACE + saved[parseInt(p2,10)] + RBRACE;
			})
			.replace(lBraceRegExp, LBRACE)
			.replace(rBraceRegExp, RBRACE)
		;
	};

    Y.substitute = substitute;
    L.substitute = substitute;

