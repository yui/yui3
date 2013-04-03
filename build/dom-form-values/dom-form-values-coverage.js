if (typeof _yuitest_coverage == "undefined"){
    _yuitest_coverage = {};
    _yuitest_coverline = function(src, line){
        var coverage = _yuitest_coverage[src];
        if (!coverage.lines[line]){
            coverage.calledLines++;
        }
        coverage.lines[line]++;
    };
    _yuitest_coverfunc = function(src, name, line){
        var coverage = _yuitest_coverage[src],
            funcId = name + ":" + line;
        if (!coverage.functions[funcId]){
            coverage.calledFunctions++;
        }
        coverage.functions[funcId]++;
    };
}
_yuitest_coverage["build/dom-form-values/dom-form-values.js"] = {
    lines: {},
    functions: {},
    coveredLines: 0,
    calledLines: 0,
    coveredFunctions: 0,
    calledFunctions: 0,
    path: "build/dom-form-values/dom-form-values.js",
    code: []
};
_yuitest_coverage["build/dom-form-values/dom-form-values.js"].code=["YUI.add('dom-form-values', function (Y, NAME) {","","/**","Adds a `Y.DOM.formToObject(identifier)` method to extract the values from a","`<form>` element and return an object map of element name to value(s).","","@module dom","@submodule dom-form-values","@since @SINCE@","**/","var isArray = Y.Lang.isArray;","","/**","Return an object with form values from `<input>`s, `<select>`s, and","`<textarea>`s, keyed by field name. Fields with multiple values will have those","values in an array.","","* Disabled fields will be ignored unless the _includeDisabled_ param is truthy.","* If no radio or checkbox is checked, the returned object will not contain a","    reference to it.","* If no option is selected in a single select, the first option value will be","    used.","* if no option is selected in a multi-select, it will be omitted from the","    returned object.","","@method formToObject","@param {Element|Node|String} identifier The DOM element, Node, or selector for","                                the `<form>`","@param {Boolean} includeDisabled","@return {Object}","**/","Y.DOM.formToObject = function (identifier, includeDisabled) {","    var skipDisabled = !includeDisabled, // so I don't have to ! it in loop","        form, fields, field, type, values, name, value,","        selectedIndex, i, len, j, jlen;","","    if (identifier.nodeType) {","        form = identifier;","    } else if (identifier._node) {","        form = identifier._node;","    } else if (typeof identifier === 'string') {","        if (/^#([\\w\\-]+)$/.test(identifier)) {","            form = Y.config.doc.getElementById(RegExp.$1);","        } else if (Y.Selector) {","            form = Y.Selector.query(identifier, null, true);","        }","    }","","    function optionValue(opt) {","        return (opt.attributes.value && opt.attributes.value.specified) ?","                 opt.value : opt.text;","    }","","    if (form && form.elements) {","        values = {};","        fields = form.elements;","","        for (i = 0, len = fields.length; i < len; ++i) {","            field = fields[i];","            name  = field.name;","","            if (!name || (skipDisabled && field.disabled)) {","                continue;","            }","","            type = (field.tagName || '').toLowerCase();","","            if (type === 'input' || type === 'textarea') {","                switch ((field.type || '').toLowerCase()) {","                    case 'button':","                    case 'image':","                    case 'submit':","                    case 'reset':","                    case 'file': continue; // don't capture buttons or files","","                    case 'radio':","                    case 'checkbox':","                        if (!field.checked) {","                            break;","                        } // else fall through","","                    default: value = field.value;","                }","            } else if (type === 'select') {","                type = field.type;","","                if (field.type === 'select-multiple') {","                    j = field.selectedIndex;","","                    if (j > -1) {","                        value = [];","                        for (jlen = field.options.length; j < jlen; ++j) {","                            if (field.options[j].selected) {","                                value.push(optionValue(field.options[j]));","                            }","                        }","                    }","                } else {","                    // For browsers that allow no selectedIndex or -1","                    // TODO: Is this right?","                    selectedIndex = Math.max(field.selectedIndex, 0);","","                    value = optionValue(field.options[selectedIndex]);","                }","            }","","            if (value !== undefined) {","                if (name in values) {","                    if (!isArray(values[name])) {","                        values[name] = [values[name]];","                    }","                    values[name].push(value);","                } else {","                    values[name] = value;","                }","            }","        }","    }","","    return values || null;","};","","","}, '@VERSION@', {\"requires\": [\"selector-native\"]});"];
_yuitest_coverage["build/dom-form-values/dom-form-values.js"].lines = {"1":0,"11":0,"32":0,"33":0,"37":0,"38":0,"39":0,"40":0,"41":0,"42":0,"43":0,"44":0,"45":0,"49":0,"50":0,"54":0,"55":0,"56":0,"58":0,"59":0,"60":0,"62":0,"63":0,"66":0,"68":0,"69":0,"74":0,"78":0,"79":0,"82":0,"84":0,"85":0,"87":0,"88":0,"90":0,"91":0,"92":0,"93":0,"94":0,"101":0,"103":0,"107":0,"108":0,"109":0,"110":0,"112":0,"114":0,"120":0};
_yuitest_coverage["build/dom-form-values/dom-form-values.js"].functions = {"optionValue:49":0,"formToObject:32":0,"(anonymous 1):1":0};
_yuitest_coverage["build/dom-form-values/dom-form-values.js"].coveredLines = 48;
_yuitest_coverage["build/dom-form-values/dom-form-values.js"].coveredFunctions = 3;
_yuitest_coverline("build/dom-form-values/dom-form-values.js", 1);
YUI.add('dom-form-values', function (Y, NAME) {

/**
Adds a `Y.DOM.formToObject(identifier)` method to extract the values from a
`<form>` element and return an object map of element name to value(s).

@module dom
@submodule dom-form-values
@since @SINCE@
**/
_yuitest_coverfunc("build/dom-form-values/dom-form-values.js", "(anonymous 1)", 1);
_yuitest_coverline("build/dom-form-values/dom-form-values.js", 11);
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
_yuitest_coverline("build/dom-form-values/dom-form-values.js", 32);
Y.DOM.formToObject = function (identifier, includeDisabled) {
    _yuitest_coverfunc("build/dom-form-values/dom-form-values.js", "formToObject", 32);
_yuitest_coverline("build/dom-form-values/dom-form-values.js", 33);
var skipDisabled = !includeDisabled, // so I don't have to ! it in loop
        form, fields, field, type, values, name, value,
        selectedIndex, i, len, j, jlen;

    _yuitest_coverline("build/dom-form-values/dom-form-values.js", 37);
if (identifier.nodeType) {
        _yuitest_coverline("build/dom-form-values/dom-form-values.js", 38);
form = identifier;
    } else {_yuitest_coverline("build/dom-form-values/dom-form-values.js", 39);
if (identifier._node) {
        _yuitest_coverline("build/dom-form-values/dom-form-values.js", 40);
form = identifier._node;
    } else {_yuitest_coverline("build/dom-form-values/dom-form-values.js", 41);
if (typeof identifier === 'string') {
        _yuitest_coverline("build/dom-form-values/dom-form-values.js", 42);
if (/^#([\w\-]+)$/.test(identifier)) {
            _yuitest_coverline("build/dom-form-values/dom-form-values.js", 43);
form = Y.config.doc.getElementById(RegExp.$1);
        } else {_yuitest_coverline("build/dom-form-values/dom-form-values.js", 44);
if (Y.Selector) {
            _yuitest_coverline("build/dom-form-values/dom-form-values.js", 45);
form = Y.Selector.query(identifier, null, true);
        }}
    }}}

    _yuitest_coverline("build/dom-form-values/dom-form-values.js", 49);
function optionValue(opt) {
        _yuitest_coverfunc("build/dom-form-values/dom-form-values.js", "optionValue", 49);
_yuitest_coverline("build/dom-form-values/dom-form-values.js", 50);
return (opt.attributes.value && opt.attributes.value.specified) ?
                 opt.value : opt.text;
    }

    _yuitest_coverline("build/dom-form-values/dom-form-values.js", 54);
if (form && form.elements) {
        _yuitest_coverline("build/dom-form-values/dom-form-values.js", 55);
values = {};
        _yuitest_coverline("build/dom-form-values/dom-form-values.js", 56);
fields = form.elements;

        _yuitest_coverline("build/dom-form-values/dom-form-values.js", 58);
for (i = 0, len = fields.length; i < len; ++i) {
            _yuitest_coverline("build/dom-form-values/dom-form-values.js", 59);
field = fields[i];
            _yuitest_coverline("build/dom-form-values/dom-form-values.js", 60);
name  = field.name;

            _yuitest_coverline("build/dom-form-values/dom-form-values.js", 62);
if (!name || (skipDisabled && field.disabled)) {
                _yuitest_coverline("build/dom-form-values/dom-form-values.js", 63);
continue;
            }

            _yuitest_coverline("build/dom-form-values/dom-form-values.js", 66);
type = (field.tagName || '').toLowerCase();

            _yuitest_coverline("build/dom-form-values/dom-form-values.js", 68);
if (type === 'input' || type === 'textarea') {
                _yuitest_coverline("build/dom-form-values/dom-form-values.js", 69);
switch ((field.type || '').toLowerCase()) {
                    case 'button':
                    case 'image':
                    case 'submit':
                    case 'reset':
                    case 'file': _yuitest_coverline("build/dom-form-values/dom-form-values.js", 74);
continue; // don't capture buttons or files

                    case 'radio':
                    case 'checkbox':
                        _yuitest_coverline("build/dom-form-values/dom-form-values.js", 78);
if (!field.checked) {
                            _yuitest_coverline("build/dom-form-values/dom-form-values.js", 79);
break;
                        } // else fall through

                    default: _yuitest_coverline("build/dom-form-values/dom-form-values.js", 82);
value = field.value;
                }
            } else {_yuitest_coverline("build/dom-form-values/dom-form-values.js", 84);
if (type === 'select') {
                _yuitest_coverline("build/dom-form-values/dom-form-values.js", 85);
type = field.type;

                _yuitest_coverline("build/dom-form-values/dom-form-values.js", 87);
if (field.type === 'select-multiple') {
                    _yuitest_coverline("build/dom-form-values/dom-form-values.js", 88);
j = field.selectedIndex;

                    _yuitest_coverline("build/dom-form-values/dom-form-values.js", 90);
if (j > -1) {
                        _yuitest_coverline("build/dom-form-values/dom-form-values.js", 91);
value = [];
                        _yuitest_coverline("build/dom-form-values/dom-form-values.js", 92);
for (jlen = field.options.length; j < jlen; ++j) {
                            _yuitest_coverline("build/dom-form-values/dom-form-values.js", 93);
if (field.options[j].selected) {
                                _yuitest_coverline("build/dom-form-values/dom-form-values.js", 94);
value.push(optionValue(field.options[j]));
                            }
                        }
                    }
                } else {
                    // For browsers that allow no selectedIndex or -1
                    // TODO: Is this right?
                    _yuitest_coverline("build/dom-form-values/dom-form-values.js", 101);
selectedIndex = Math.max(field.selectedIndex, 0);

                    _yuitest_coverline("build/dom-form-values/dom-form-values.js", 103);
value = optionValue(field.options[selectedIndex]);
                }
            }}

            _yuitest_coverline("build/dom-form-values/dom-form-values.js", 107);
if (value !== undefined) {
                _yuitest_coverline("build/dom-form-values/dom-form-values.js", 108);
if (name in values) {
                    _yuitest_coverline("build/dom-form-values/dom-form-values.js", 109);
if (!isArray(values[name])) {
                        _yuitest_coverline("build/dom-form-values/dom-form-values.js", 110);
values[name] = [values[name]];
                    }
                    _yuitest_coverline("build/dom-form-values/dom-form-values.js", 112);
values[name].push(value);
                } else {
                    _yuitest_coverline("build/dom-form-values/dom-form-values.js", 114);
values[name] = value;
                }
            }
        }
    }

    _yuitest_coverline("build/dom-form-values/dom-form-values.js", 120);
return values || null;
};


}, '@VERSION@', {"requires": ["selector-native"]});
