
Y.mix(Y.Selector.operators, {
    '^=': function(attr, val) { return attr.indexOf(val) === 0; }, // Match starts with value
    '$=': function(attr, val) { return attr.lastIndexOf(val) === attr[LENGTH] - val[LENGTH]; }, // Match ends with value
    '*=': function(attr, val) { return attr.indexOf(val) > -1; }, // Match contains value as substring 
    '!=': function(attr, val) { return attr !== val; } // Inequality
});

Y.mix(Y.Selector.pseudos, {
        'root': function(node) {
            return node === node[OWNER_DOCUMENT][DOCUMENT_ELEMENT];
        },

        'nth-child': function(node, val) {
            return getNth(node, val);
        },

        'nth-last-child': function(node, val) {
            return getNth(node, val, null, true);
        },

        'nth-of-type': function(node, val) {
            return getNth(node, val, node[TAG_NAME]);
        },
         
        'nth-last-of-type': function(node, val) {
            return getNth(node, val, node[TAG_NAME], true);
        },

        'last-child': function(node) {
            return Y.DOM.lastChild(node[PARENT_NODE]) === node;
        },

        'first-of-type': function(node, val) {
            return Y.DOM.firstChildByTag(node[PARENT_NODE], node[TAG_NAME]) === node;
        },
         
        'last-of-type': function(node, val) {
            return Y.DOM.lastChildByTag(node[PARENT_NODE], node[TAG_NAME]) === node;
        },
         
        'only-child': function(node) {
            var children = Y.DOM.children(node[PARENT_NODE]);
            return children[LENGTH] === 1 && children[0] === node;
        },

        'only-of-type': function(node) {
            return Y.DOM.childrenByTag(node[PARENT_NODE], node[TAG_NAME])[LENGTH] === 1;
        },

        'empty': function(node) {
            return node.childNodes[LENGTH] === 0;
        },

        'not': function(node, simple) {
            return !Y.Selector.test(node, simple);
        },

        'contains': function(node, str) {
            return Y.DOM.getText(node).indexOf(str) > -1;
        },

        'checked': function(node) {
            return node.checked === true;
        }
});

Y.mix(Y.Selector.combinators, {
    '~': function(node, token) {
        var sib = node[PREVIOUS_SIBLING];
        while (sib) {
            if (sib[NODE_TYPE] === 1 && Y.Selector._rTestNode(sib, null, token[PREVIOUS])) {
                return true;
            }
            sib = sib[PREVIOUS_SIBLING];
        }

        return false;
    }
});


var reNth = /^(?:([-]?\d*)(n){1}|(odd|even)$)*([-+]?\d*)$/;

/*
    an+b = get every _a_th node starting at the _b_th
    0n+b = no repeat ("0" and "n" may both be omitted (together) , e.g. "0n+1" or "1", not "0+1"), return only the _b_th element
    1n+b =  get every element starting from b ("1" may may be omitted, e.g. "1n+0" or "n+0" or "n")
    an+0 = get every _a_th element, "0" may be omitted 
*/
var getNth = function(node, expr, tag, reverse) {
    reNth.test(expr);

    var a = parseInt(RegExp.$1, 10), // include every _a_ elements (zero means no repeat, just first _a_)
        n = RegExp.$2, // "n"
        oddeven = RegExp.$3, // "odd" or "even"
        b = parseInt(RegExp.$4, 10) || 0, // start scan from element _b_
        result = [],
        op,
        siblings;

    if (tag) {
        siblings = Y.DOM.childrenByTag(node.parentNode, tag);
    } else {
        siblings = Y.DOM.children(node.parentNode);
    }

    if (oddeven) {
        a = 2; // always every other
        op = '+';
        n = 'n';
        b = (oddeven === 'odd') ? 1 : 0;
    } else if ( isNaN(a) ) {
        a = (n) ? 1 : 0; // start from the first or no repeat
    }

    if (a === 0) { // just the first
        if (reverse) {
            b = siblings[LENGTH] - b + 1; 
        }

        if (siblings[b - 1] === node) {
            return true;
        } else {
            return false;
        }

    } else if (a < 0) {
        reverse = !!reverse;
        a = Math.abs(a);
    }

    if (!reverse) {
        for (var i = b - 1, len = siblings[LENGTH]; i < len; i += a) {
            if ( i >= 0 && siblings[i] === node ) {
                return true;
            }
        }
    } else {
        for (var i = siblings[LENGTH] - b, len = siblings[LENGTH]; i >= 0; i -= a) {
            if ( i < len && siblings[i] === node ) {
                return true;
            }
        }
    }
    return false;
};

