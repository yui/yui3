/**
Adds a `Y.DOM.formToObject(identifier)` method to extract the values from a
`<form>` element and return an object map of element name to value(s).

@module dom
@submodule dom-form-values
@since @SINCE@
**/
var isArray = Y.Lang.isArray;

/**
Return an object with form values from `<input>`s, `<select>`s, and
`<textarea>`s, keyed by field name. Fields with multiple values will have those
values in an array.

* Disabled fields will be ignored unless the _includeDisabled_ param is truthy.
* If no radio or checkbox is checked, the returned object will not contain a
    reference to it.
* If no option is selected in a single select, the first option value will be
    used.
* if no option is selected in a multi-select, it will be omitted from the
    returned object.

@method formToObject
@param {Element|Node|String} identifier The DOM element, Node, or selector for
                                the `<form>`
@param {Boolean} includeDisabled
@return {Object}
**/
Y.DOM.formToObject = function (identifier, includeDisabled) {
    var skipDisabled = !includeDisabled, // so I don't have to ! it in loop
        form, fields, field, type, values, name, value,
        selectedIndex, i, len, j, jlen;

    if (identifier.nodeType) {
        form = identifier;
    } else if (identifier._node) {
        form = identifier._node;
    } else if (typeof identifier === 'string') {
        if (/^#([\w\-]+)$/.test(identifier)) {
            form = Y.config.doc.getElementById(RegExp.$1);
        } else if (Y.Selector) {
            form = Y.Selector.query(identifier, null, true);
        }
    }

    function optionValue(opt) {
        return (opt.attributes.value && opt.attributes.value.specified) ?
                 opt.value : opt.text;
    }

    if (form && form.elements) {
        values = {};
        fields = form.elements;

        for (i = 0, len = fields.length; i < len; ++i) {
            value = undefined; // reset for fields that may be skipped
            field = fields[i];
            name  = field.name;

            if (!name || (skipDisabled && field.disabled)) {
                continue;
            }

            type = (field.tagName || '').toLowerCase();

            if (type === 'input' || type === 'textarea') {
                switch ((field.type || '').toLowerCase()) {
                    case 'button':
                    case 'image':
                    case 'submit':
                    case 'reset':
                    case 'file': continue; // don't capture buttons or files

                    case 'radio':
                    case 'checkbox':
                        if (!field.checked) {
                            break;
                        } // else fall through

                    default: value = field.value;
                }
            } else if (type === 'select') {
                type = field.type;

                if (field.type === 'select-multiple') {
                    j = field.selectedIndex;

                    if (j > -1) {
                        value = [];
                        for (jlen = field.options.length; j < jlen; ++j) {
                            if (field.options[j].selected) {
                                value.push(optionValue(field.options[j]));
                            }
                        }
                    }
                } else {
                    // For browsers that allow no selectedIndex or -1
                    // TODO: Is this right?
                    selectedIndex = Math.max(field.selectedIndex, 0);

                    value = optionValue(field.options[selectedIndex]);
                }
            }

            if (value !== undefined) {
                if (name in values) {
                    if (!isArray(values[name])) {
                        values[name] = [values[name]];
                    }
                    values[name].push(value);
                } else {
                    values[name] = value;
                }
            }
        }
    }

    return values || null;
};
