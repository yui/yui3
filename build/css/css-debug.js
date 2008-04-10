// TODO: documentation
YUI.add('css',function (Y) {

// TODO: var sn  = Y.Node.create(['style',{type:'text/css'}]),
var sn = (function () { var n = document.createElement('style'); n.type = 'text/css'; return n; })(),
    waiting = false, // attempt to add style node prior to head element ready
    ss, // will hold the styleSheet object
    _SL = Array.prototype.slice,
    p   = [],
    idx = {};

// TODO Y.on('DOMReady', function () {})
// or whatever the sig will be
var init = function () {
    if (sn.parentNode) { return true; }

    if (waiting) { return false; }

    try {
        var h = document.getElementsByTagName('head')[0],i=0,l=p.length;
        // TODO: Include configuration for where to insert the node w/i head
        // TODO: Account for no head element
        h.appendChild(sn);

        // styleSheet object is exposed after the node is added to the head
        ss = sn.styleSheet || sn.sheet;

        // Execute all the pending calls
        for (;i<l;++i) {
            // ['set','.foo',{stuff}] becomes
            // Y.css['set'].apply(Y.css,['.foo',{stuff}])
            // better known as Y.css.set('.foo',{stuff});
            Y.css[p[i][0]].apply(Y.css,_SL.call(p[i],1));
        }
        p = [];
        return true;
    }
    catch (e) {
        waiting = true;
        Y.Event.onDOMReady(function () { waiting = false; init(); });
        return false;
    }
};

// Namespace is alias for Y.css.set
Y.css = function (sel,props) {
    if (init()) {
        var r = ss.rules || ss.cssRules;
        if (typeof idx[sel] !== 'number') {
            idx[sel] = r.length;
            if (ss.addRule) {
                ss.addRule(sel,'clip:auto'); // For IE and Safari
            } else {
                ss.insertRule(sel+' {}',idx[sel]); // For W3C friendly
            }
        }
        Y.mix(r[idx[sel]].style,props);
    } else {
        p.push(['set'].concat(_SL.call(arguments)));
    }
    return Y;
};

Y.mix(Y.css, {
    set    : Y.css,

    // reset some rules or remove an entire rule
    remove : function (sel,rules) {
        if (init()) {
            if (typeof rules === 'object') {
                rules = Y.lang.isArray(rules) ? rules : Y.object.keys(rules);
                rules = Y.array.hash(rules,
                    new Array(rules.length).join(',').split(','));
                    // ^ create array of empty strings for hash values
                return Y.css.set(sel,rules);
            }
            
            if (idx[sel] >= 0) {
                if (ss.removeRule) {
                    ss.removeRule(idx[sel]); // For IE and Safari
                } else {
                    ss.deleteRule(idx[sel]); // For W3C friendly
                }
                idx[sel] = undefined;
            }
        } else {
            p.push(['set'].concat(_SL.call(arguments)));
        }
        return Y;
    }
});

},'3.0.0');
