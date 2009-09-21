var rulesProp = Y.config.doc.styleSheets &&
                Y.config.doc.styleSheets[0].cssRules ? 'cssRules' : 'rules',

    floatProp = 'cssFloat' in document.createElement('p').style ?
                'cssFloat' : 'styleFloat',

    specificityValue = {
        '*': 0.000000001, // really small but truthy on purpose
        '[': 10,
        ':': 10,
        '.': 10,
        '#': 100
    };

function _origin(href, el) {
    return (href || el.ownerDocument.location.pathname).replace(/.*\//,'');
}

function _specificity(sel, sheetIndex, ruleIndex) {
    var specificity = 0, i,
                    // stuff inside not(..) counts, but :not doesn't
        tokens = sel.replace(/:not\((.*?)\)/g,' $1 ')
                    // pseudo-elements count as tags
                    .replace(/::[\w\-]+/g, ' a ')
                    // separate attribute selectors, pseudo-classes, and
                    // chained classes
                    .replace(/(\S)([\[:.])/g,'$1 $2')
                    // tokenize, ignoring combinators
                    .split(/\s+(?:[+~>]\s+)?/);

    for (i = tokens.length - 1; i >= 0; --i) {
        specificity += specificityValue[tokens[i].charAt(0)] || 1;
    }

    return [specificity, sheetIndex, ruleIndex];
}

function _camel(str) {
    return str.indexOf('float') > -1 ? floatProp :
        str.replace(/-\w/g, function (m) {
            return m.charAt(1).toUpperCase();
        });
}

function _reduce(style, specificity) {
    var props = {},
        importants = {},
        found, prop, v,
        i;
        
    // !important can only be found in the cssText in all but Opera.
    // @FIXME? Opera does not report !important in any way.  Have to check
    // against the currentStyle to see if it matches the assigned value.
    found = style.cssText.match(/([\w\-]+)\s*:[^;]+!\s*important/);

    if (found) {
        for (i = found.length - 1; i >= 0; --i) {
            importants[found[i].toLowerCase()] = true;
        }
    }

    // Search cssText for assigned properties because Safari doesn't enum
    // style properties, IE includes 'accelerator', Opera includes values
    // for rollup properties when you assign a child property (font: italic
    // and font-style: italic).  There are individual ways to work around
    // these, but easier to just use cssText.
    // @TODO expand rollup properties?  Problem: A defines font, B
    // overrides font-style only
    found = style.cssText.match(/[\w\-]+\s*:/g);
    if (found) {
        for (i = found.length - 1; i >= 0; --i) {
            prop = found[i].replace(/\s*:/,'').toLowerCase();

            v = style[_camel(prop)];

            if (v) {
                props[prop] = {
                    value       : v,
                    specificity : specificity,
                    important   : importants[prop]
                };
            }
        }
    }

    return props;
}

function _resolve(rules) {
    var current = {},
        style,
        i,prop,v;

    // sort rules by decreasing specificity
    rules.sort(function (a,b) {
        var as = a.specificity,
            bs = b.specificity;

               // first by selectorText
               // then by order of stylesheet appearance
               // then by order of rule appearance w/in the same stylesheet
        return as[0] > bs[0] ? -1 :
               as[0] < bs[0] ? 1 :
               as[1] > bs[1] ? -1 :
               as[1] < bs[1] ? 1 :
               as[2] > bs[2] ? -1 :
               as[2] < bs[2] ? 1 : 0;
    });

    // iterate from least to most specificity, marking less specific
    // rule-property combos as overridden (taking into account !important)
    for (i = rules.length - 1; i >= 0; --i) {
        style = rules[i].style;

        for (prop in style) {
            if (current[prop]) {
                if (current[prop].important && !style[prop].important) {
                    style[prop].overridden = true;
                } else {
                    current[prop].overridden = true;
                    current[prop] = style[prop];
                }
            } else {
                current[prop] = style[prop];
            }
        }
    }

    return rules;
}

Y.namespace('Inspector').getCSS = function (node) {
    var el = Y.Node.getDOMNode(Y.one(node)),
        sheets = el && el.ownerDocument.styleSheets,
        applied = [],
        rules,
        sel,
        specificity,
        i,len,j,jlen;

    if (!el) {
        return null;
    }
            
    // @TODO: capture currentStyle of the element to get property:values from
    // the browser.css (and use for reference in Opera to find !important
    // styles?)


    // Element inline style
    if (el.style.cssText) {
        applied.push({
            node: Y.one(el),
            origin: _origin(false,el),
            selectorText: 'element.style',
            style: _reduce(el.style),
            specificity: [1000,1000,1000]
        });
    }

    // Stylesheets
    for (i = 0, len = sheets.length; i < len; ++i) {
        if (!sheets[i].disabled) {
            // This is where it will fail for xdomain link sheets
            // except in Safari and IE, which allow access (read-only?)
            try {
            rules = sheets[i][rulesProp];
            for (j = 0, jlen = rules.length; j < jlen; ++j) {
                sel = rules[j].selectorText;

                if (Y.Selector.test(el, sel)) {
                    specificity = _specificity(sel, i, j);

                    applied.push({
                        node         : Y.one(sheets[i].ownerNode),
                        origin       : _origin(sheets[i].href, el),
                        selectorText : sel,
                        style        : _reduce(rules[j].style, specificity),
                        specificity  : specificity
                    });
                }
            }
            }
            catch (e) {}
        }
    }

    // @TODO: walk up ancenstor axis and do the same thing to get inherited
    // styles.  Note !important values inherited from an ancestor trump direct
    // value assignments.

    return _resolve(applied);
};
