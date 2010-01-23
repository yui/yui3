Y.mix = function(r, s, ov, wl, mode, merge) {

    if (!s||!r) {
        return r || Y;
    }

    if (mode) {
        switch (mode) {
            case 1: // proto to proto
                return Y.mix(r.prototype, s.prototype);
            case 2: // object to object and proto to proto
                Y.mix(r.prototype, s.prototype);
                break; // pass through 
            case 3: // proto to static
                return Y.mix(r, s.prototype);
            case 4: // static to proto
                return Y.mix(r.prototype, s);
            default:  // object to object is what happens below
        }
    }

    // Maybe don't even need this wl && wl.length check anymore??
    var w = (wl && wl.length) ? wl : null, 
        arr = merge && L.isArray(r), 
        i, 
        l, 
        p;

    if (w) {
        for (i = 0, l = w.length; i < l; ++i) {
            p = w[i]
            if ((p in s) && (ov || !(p in r))) {
                r[p] = s[p];
            }
        }
    } else {
        for (i in s) { 
            if (s.hasOwnProperty(i) && !(i in FROZEN)) {
                // check white list if it was supplied
                if (!w || (i in w)) {
                    // if the receiver has this property, it is an object,
                    // and merge is specified, merge the two objects.
                    if (merge && L.isObject(r[i], true)) {
                        Y.mix(r[i], s[i]); // recursive
                    // otherwise apply the property only if overwrite
                    // is specified or the receiver doesn't have one.
                    } else if (!arr && (ov || !(i in r))) {
                        r[i] = s[i];
                    // if merge is specified and the receiver is an array,
                    // append the array item
                    } else if (arr) {
                        r.push(s[i]);
                    }
                }
            }
        }
    
        if (Y.UA.ie) {
            _iefix(r, s, w);
        }
    }

    return r;
};
