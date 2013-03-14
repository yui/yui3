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
_yuitest_coverage["build/dom-base/dom-base.js"] = {
    lines: {},
    functions: {},
    coveredLines: 0,
    calledLines: 0,
    coveredFunctions: 0,
    calledFunctions: 0,
    path: "build/dom-base/dom-base.js",
    code: []
};
_yuitest_coverage["build/dom-base/dom-base.js"].code=["YUI.add('dom-base', function (Y, NAME) {","","/**","* @for DOM","* @module dom","*/","var documentElement = Y.config.doc.documentElement,","    Y_DOM = Y.DOM,","    TAG_NAME = 'tagName',","    OWNER_DOCUMENT = 'ownerDocument',","    EMPTY_STRING = '',","    addFeature = Y.Features.add,","    testFeature = Y.Features.test;","","Y.mix(Y_DOM, {","    /**","     * Returns the text content of the HTMLElement. ","     * @method getText         ","     * @param {HTMLElement} element The html element. ","     * @return {String} The text content of the element (includes text of any descending elements).","     */","    getText: (documentElement.textContent !== undefined) ?","        function(element) {","            var ret = '';","            if (element) {","                ret = element.textContent;","            }","            return ret || '';","        } : function(element) {","            var ret = '';","            if (element) {","                ret = element.innerText || element.nodeValue; // might be a textNode","            }","            return ret || '';","        },","","    /**","     * Sets the text content of the HTMLElement. ","     * @method setText         ","     * @param {HTMLElement} element The html element. ","     * @param {String} content The content to add. ","     */","    setText: (documentElement.textContent !== undefined) ?","        function(element, content) {","            if (element) {","                element.textContent = content;","            }","        } : function(element, content) {","            if ('innerText' in element) {","                element.innerText = content;","            } else if ('nodeValue' in element) {","                element.nodeValue = content;","            }","    },","","    CUSTOM_ATTRIBUTES: (!documentElement.hasAttribute) ? { // IE < 8","        'for': 'htmlFor',","        'class': 'className'","    } : { // w3c","        'htmlFor': 'for',","        'className': 'class'","    },","","    /**","     * Provides a normalized attribute interface. ","     * @method setAttribute","     * @param {HTMLElement} el The target element for the attribute.","     * @param {String} attr The attribute to set.","     * @param {String} val The value of the attribute.","     */","    setAttribute: function(el, attr, val, ieAttr) {","        if (el && attr && el.setAttribute) {","            attr = Y_DOM.CUSTOM_ATTRIBUTES[attr] || attr;","            el.setAttribute(attr, val, ieAttr);","        }","    },","","","    /**","     * Provides a normalized attribute interface. ","     * @method getAttribute","     * @param {HTMLElement} el The target element for the attribute.","     * @param {String} attr The attribute to get.","     * @return {String} The current value of the attribute. ","     */","    getAttribute: function(el, attr, ieAttr) {","        ieAttr = (ieAttr !== undefined) ? ieAttr : 2;","        var ret = '';","        if (el && attr && el.getAttribute) {","            attr = Y_DOM.CUSTOM_ATTRIBUTES[attr] || attr;","            ret = el.getAttribute(attr, ieAttr);","","            if (ret === null) {","                ret = ''; // per DOM spec","            }","        }","        return ret;","    },","","    VALUE_SETTERS: {},","","    VALUE_GETTERS: {},","","    getValue: function(node) {","        var ret = '', // TODO: return null?","            getter;","","        if (node && node[TAG_NAME]) {","            getter = Y_DOM.VALUE_GETTERS[node[TAG_NAME].toLowerCase()];","","            if (getter) {","                ret = getter(node);","            } else {","                ret = node.value;","            }","        }","","        // workaround for IE8 JSON stringify bug","        // which converts empty string values to null","        if (ret === EMPTY_STRING) {","            ret = EMPTY_STRING; // for real","        }","","        return (typeof ret === 'string') ? ret : '';","    },","","    setValue: function(node, val) {","        var setter;","","        if (node && node[TAG_NAME]) {","            setter = Y_DOM.VALUE_SETTERS[node[TAG_NAME].toLowerCase()];","","            if (setter) {","                setter(node, val);","            } else {","                node.value = val;","            }","        }","    },","","    creators: {}","});","","addFeature('value-set', 'select', {","    test: function() {","        var node = Y.config.doc.createElement('select');","        node.innerHTML = '<option>1</option><option>2</option>';","        node.value = '2';","        return (node.value && node.value === '2');","    }","});","","if (!testFeature('value-set', 'select')) {","    Y_DOM.VALUE_SETTERS.select = function(node, val) {","        for (var i = 0, options = node.getElementsByTagName('option'), option;","                option = options[i++];) {","            if (Y_DOM.getValue(option) === val) {","                option.selected = true;","                //Y_DOM.setAttribute(option, 'selected', 'selected');","                break;","            }","        }","    };","}","","Y.mix(Y_DOM.VALUE_GETTERS, {","    button: function(node) {","        return (node.attributes && node.attributes.value) ? node.attributes.value.value : '';","    }","});","","Y.mix(Y_DOM.VALUE_SETTERS, {","    // IE: node.value changes the button text, which should be handled via innerHTML","    button: function(node, val) {","        var attr = node.attributes.value;","        if (!attr) {","            attr = node[OWNER_DOCUMENT].createAttribute('value');","            node.setAttributeNode(attr);","        }","","        attr.value = val;","    }","});","","","Y.mix(Y_DOM.VALUE_GETTERS, {","    option: function(node) {","        var attrs = node.attributes;","        return (attrs.value && attrs.value.specified) ? node.value : node.text;","    },","","    select: function(node) {","        var val = node.value,","            options = node.options;","","        if (options && options.length) {","            // TODO: implement multipe select","            if (node.multiple) {","            } else if (node.selectedIndex > -1) {","                val = Y_DOM.getValue(options[node.selectedIndex]);","            }","        }","","        return val;","    }","});","var addClass, hasClass, removeClass;","","/**","* Old browsers like IE 7/8/9 do not support classList, the fallback use the original dom-class method, working with className attribute","*/","var _hasClassList = (typeof document !== \"undefined\" && (\"classList\" in document.createElement(\"a\")));","","Y.mix(Y.DOM, {","    /**","     * Determines whether a DOM element has the given className.","     * @method hasClass","     * @for DOM","     * @param {HTMLElement} element The DOM element. ","     * @param {String} className the class name to search for","     * @return {Boolean} Whether or not the element has the given class. ","     */","    hasClass: function(node, className) {","		if (_hasClassList){","			return node.classList.contains(className);","		} else {","			var re = Y.DOM._getRegExp('(?:^|\\\\s+)' + className + '(?:\\\\s+|$)');","			return re.test(node.className);","		}","    },","","    /**","     * Adds a class name to a given DOM element.","     * @method addClass         ","     * @for DOM","     * @param {HTMLElement} element The DOM element. ","     * @param {String} className the class name to add to the class attribute","     */","    addClass: function(node, className) {","		if (!Y.DOM.hasClass(node, className)){ // skip if already present","			if (_hasClassList){","				node.classList.add(className);","			} else {","				node.className = Y.Lang.trim([node.className, className].join(' '));","			}","		}","    },","","    /**","     * Removes a class name from a given element.","     * @method removeClass         ","     * @for DOM","     * @param {HTMLElement} element The DOM element. ","     * @param {String} className the class name to remove from the class attribute","     */","    removeClass: function(node, className) {  ","		if (className && hasClass(node, className)) {","			if (_hasClassList){","				node.classList.remove(className);","			} else {","				node.className = Y.Lang.trim(node.className.replace(Y.DOM._getRegExp('(?:^|\\\\s+)' + className + '(?:\\\\s+|$)'), ' '));","			}","","			if ( hasClass(node, className) ) { // in case of multiple adjacent","				removeClass(node, className);","			}","		}            ","    },","","    /**","     * Replace a class with another class for a given element.","     * If no oldClassName is present, the newClassName is simply added.","     * @method replaceClass  ","     * @for DOM","     * @param {HTMLElement} element The DOM element ","     * @param {String} oldClassName the class name to be replaced","     * @param {String} newClassName the class name that will be replacing the old class name","     */","    replaceClass: function(node, oldC, newC) {","        removeClass(node, oldC); // remove first in case oldC === newC","        addClass(node, newC);","    },","","    /**","     * If the className exists on the node it is removed, if it doesn't exist it is added.","     * @method toggleClass  ","     * @for DOM","     * @param {HTMLElement} element The DOM element","     * @param {String} className the class name to be toggled","     * @param {Boolean} addClass optional boolean to indicate whether class","     * should be added or removed regardless of current state","     */","    toggleClass: function(node, className, force) {","        var add = (force !== undefined) ? force :","                !(hasClass(node, className));","","        if (add) {","            addClass(node, className);","        } else {","            removeClass(node, className);","        }","    }","});","","hasClass = Y.DOM.hasClass;","removeClass = Y.DOM.removeClass;","addClass = Y.DOM.addClass;","","var re_tag = /<([a-z]+)/i,","","    Y_DOM = Y.DOM,","","    addFeature = Y.Features.add,","    testFeature = Y.Features.test,","","    creators = {},","","    createFromDIV = function(html, tag) {","        var div = Y.config.doc.createElement('div'),","            ret = true;","","        div.innerHTML = html;","        if (!div.firstChild || div.firstChild.tagName !== tag.toUpperCase()) {","            ret = false;","        }","","        return ret;","    },","","    re_tbody = /(?:\\/(?:thead|tfoot|tbody|caption|col|colgroup)>)+\\s*<tbody/,","","    TABLE_OPEN = '<table>',","    TABLE_CLOSE = '</table>';","","Y.mix(Y.DOM, {","    _fragClones: {},","","    _create: function(html, doc, tag) {","        tag = tag || 'div';","","        var frag = Y_DOM._fragClones[tag];","        if (frag) {","            frag = frag.cloneNode(false);","        } else {","            frag = Y_DOM._fragClones[tag] = doc.createElement(tag);","        }","        frag.innerHTML = html;","        return frag;","    },","","    _children: function(node, tag) {","            var i = 0,","            children = node.children,","            childNodes,","            hasComments,","            child;","","        if (children && children.tags) { // use tags filter when possible","            if (tag) {","                children = node.children.tags(tag);","            } else { // IE leaks comments into children","                hasComments = children.tags('!').length;","            }","        }","        ","        if (!children || (!children.tags && tag) || hasComments) {","            childNodes = children || node.childNodes;","            children = [];","            while ((child = childNodes[i++])) {","                if (child.nodeType === 1) {","                    if (!tag || tag === child.tagName) {","                        children.push(child);","                    }","                }","            }","        }","","        return children || [];","    },","","    /**","     * Creates a new dom node using the provided markup string. ","     * @method create","     * @param {String} html The markup used to create the element","     * @param {HTMLDocument} doc An optional document context ","     * @return {HTMLElement|DocumentFragment} returns a single HTMLElement ","     * when creating one node, and a documentFragment when creating","     * multiple nodes.","     */","    create: function(html, doc) {","        if (typeof html === 'string') {","            html = Y.Lang.trim(html); // match IE which trims whitespace from innerHTML","","        }","","        doc = doc || Y.config.doc;","        var m = re_tag.exec(html),","            create = Y_DOM._create,","            custom = creators,","            ret = null,","            creator,","            tag, nodes;","","        if (html != undefined) { // not undefined or null","            if (m && m[1]) {","                creator = custom[m[1].toLowerCase()];","                if (typeof creator === 'function') {","                    create = creator; ","                } else {","                    tag = creator;","                }","            }","","            nodes = create(html, doc, tag).childNodes;","","            if (nodes.length === 1) { // return single node, breaking parentNode ref from \"fragment\"","                ret = nodes[0].parentNode.removeChild(nodes[0]);","            } else if (nodes[0] && nodes[0].className === 'yui3-big-dummy') { // using dummy node to preserve some attributes (e.g. OPTION not selected)","                if (nodes.length === 2) {","                    ret = nodes[0].nextSibling;","                } else {","                    nodes[0].parentNode.removeChild(nodes[0]); ","                    ret = Y_DOM._nl2frag(nodes, doc);","                }","            } else { // return multiple nodes as a fragment","                 ret = Y_DOM._nl2frag(nodes, doc);","            }","","        }","","        return ret;","    },","","    _nl2frag: function(nodes, doc) {","        var ret = null,","            i, len;","","        if (nodes && (nodes.push || nodes.item) && nodes[0]) {","            doc = doc || nodes[0].ownerDocument; ","            ret = doc.createDocumentFragment();","","            if (nodes.item) { // convert live list to static array","                nodes = Y.Array(nodes, 0, true);","            }","","            for (i = 0, len = nodes.length; i < len; i++) {","                ret.appendChild(nodes[i]); ","            }","        } // else inline with log for minification","        return ret;","    },","","    /**","     * Inserts content in a node at the given location ","     * @method addHTML","     * @param {HTMLElement} node The node to insert into","     * @param {HTMLElement | Array | HTMLCollection} content The content to be inserted ","     * @param {HTMLElement} where Where to insert the content","     * If no \"where\" is given, content is appended to the node","     * Possible values for \"where\"","     * <dl>","     * <dt>HTMLElement</dt>","     * <dd>The element to insert before</dd>","     * <dt>\"replace\"</dt>","     * <dd>Replaces the existing HTML</dd>","     * <dt>\"before\"</dt>","     * <dd>Inserts before the existing HTML</dd>","     * <dt>\"before\"</dt>","     * <dd>Inserts content before the node</dd>","     * <dt>\"after\"</dt>","     * <dd>Inserts content after the node</dd>","     * </dl>","     */","    addHTML: function(node, content, where) {","        var nodeParent = node.parentNode,","            i = 0,","            item,","            ret = content,","            newNode;","            ","","        if (content != undefined) { // not null or undefined (maybe 0)","            if (content.nodeType) { // DOM node, just add it","                newNode = content;","            } else if (typeof content == 'string' || typeof content == 'number') {","                ret = newNode = Y_DOM.create(content);","            } else if (content[0] && content[0].nodeType) { // array or collection ","                newNode = Y.config.doc.createDocumentFragment();","                while ((item = content[i++])) {","                    newNode.appendChild(item); // append to fragment for insertion","                }","            }","        }","","        if (where) {","            if (newNode && where.parentNode) { // insert regardless of relationship to node","                where.parentNode.insertBefore(newNode, where);","            } else {","                switch (where) {","                    case 'replace':","                        while (node.firstChild) {","                            node.removeChild(node.firstChild);","                        }","                        if (newNode) { // allow empty content to clear node","                            node.appendChild(newNode);","                        }","                        break;","                    case 'before':","                        if (newNode) {","                            nodeParent.insertBefore(newNode, node);","                        }","                        break;","                    case 'after':","                        if (newNode) {","                            if (node.nextSibling) { // IE errors if refNode is null","                                nodeParent.insertBefore(newNode, node.nextSibling);","                            } else {","                                nodeParent.appendChild(newNode);","                            }","                        }","                        break;","                    default:","                        if (newNode) {","                            node.appendChild(newNode);","                        }","                }","            }","        } else if (newNode) {","            node.appendChild(newNode);","        }","","        return ret;","    },","","    wrap: function(node, html) {","        var parent = (html && html.nodeType) ? html : Y.DOM.create(html),","            nodes = parent.getElementsByTagName('*');","","        if (nodes.length) {","            parent = nodes[nodes.length - 1];","        }","","        if (node.parentNode) { ","            node.parentNode.replaceChild(parent, node);","        }","        parent.appendChild(node);","    },","","    unwrap: function(node) {","        var parent = node.parentNode,","            lastChild = parent.lastChild,","            next = node,","            grandparent;","","        if (parent) {","            grandparent = parent.parentNode;","            if (grandparent) {","                node = parent.firstChild;","                while (node !== lastChild) {","                    next = node.nextSibling;","                    grandparent.insertBefore(node, parent);","                    node = next;","                }","                grandparent.replaceChild(lastChild, parent);","            } else {","                parent.removeChild(node);","            }","        }","    }","});","","addFeature('innerhtml', 'table', {","    test: function() {","        var node = Y.config.doc.createElement('table');","        try {","            node.innerHTML = '<tbody></tbody>';","        } catch(e) {","            return false;","        }","        return (node.firstChild && node.firstChild.nodeName === 'TBODY');","    }","});","","addFeature('innerhtml-div', 'tr', {","    test: function() {","        return createFromDIV('<tr></tr>', 'tr');","    }","});","","addFeature('innerhtml-div', 'script', {","    test: function() {","        return createFromDIV('<script></script>', 'script');","    }","});","","if (!testFeature('innerhtml', 'table')) {","    // TODO: thead/tfoot with nested tbody","        // IE adds TBODY when creating TABLE elements (which may share this impl)","    creators.tbody = function(html, doc) {","        var frag = Y_DOM.create(TABLE_OPEN + html + TABLE_CLOSE, doc),","            tb = Y.DOM._children(frag, 'tbody')[0];","","        if (frag.children.length > 1 && tb && !re_tbody.test(html)) {","            tb.parentNode.removeChild(tb); // strip extraneous tbody","        }","        return frag;","    };","}","","if (!testFeature('innerhtml-div', 'script')) {","    creators.script = function(html, doc) {","        var frag = doc.createElement('div');","","        frag.innerHTML = '-' + html;","        frag.removeChild(frag.firstChild);","        return frag;","    };","","    creators.link = creators.style = creators.script;","}","","if (!testFeature('innerhtml-div', 'tr')) {","    Y.mix(creators, {","        option: function(html, doc) {","            return Y_DOM.create('<select><option class=\"yui3-big-dummy\" selected></option>' + html + '</select>', doc);","        },","","        tr: function(html, doc) {","            return Y_DOM.create('<tbody>' + html + '</tbody>', doc);","        },","","        td: function(html, doc) {","            return Y_DOM.create('<tr>' + html + '</tr>', doc);","        }, ","","        col: function(html, doc) {","            return Y_DOM.create('<colgroup>' + html + '</colgroup>', doc);","        }, ","","        tbody: 'table'","    });","","    Y.mix(creators, {","        legend: 'fieldset',","        th: creators.td,","        thead: creators.tbody,","        tfoot: creators.tbody,","        caption: creators.tbody,","        colgroup: creators.tbody,","        optgroup: creators.option","    });","}","","Y_DOM.creators = creators;","Y.mix(Y.DOM, {","    /**","     * Sets the width of the element to the given size, regardless","     * of box model, border, padding, etc.","     * @method setWidth","     * @param {HTMLElement} element The DOM element. ","     * @param {String|Number} size The pixel height to size to","     */","","    setWidth: function(node, size) {","        Y.DOM._setSize(node, 'width', size);","    },","","    /**","     * Sets the height of the element to the given size, regardless","     * of box model, border, padding, etc.","     * @method setHeight","     * @param {HTMLElement} element The DOM element. ","     * @param {String|Number} size The pixel height to size to","     */","","    setHeight: function(node, size) {","        Y.DOM._setSize(node, 'height', size);","    },","","    _setSize: function(node, prop, val) {","        val = (val > 0) ? val : 0;","        var size = 0;","","        node.style[prop] = val + 'px';","        size = (prop === 'height') ? node.offsetHeight : node.offsetWidth;","","        if (size > val) {","            val = val - (size - val);","","            if (val < 0) {","                val = 0;","            }","","            node.style[prop] = val + 'px';","        }","    }","});","","","}, '@VERSION@', {\"requires\": [\"dom-core\"]});"];
_yuitest_coverage["build/dom-base/dom-base.js"].lines = {"1":0,"7":0,"15":0,"24":0,"25":0,"26":0,"28":0,"30":0,"31":0,"32":0,"34":0,"45":0,"46":0,"49":0,"50":0,"51":0,"52":0,"72":0,"73":0,"74":0,"87":0,"88":0,"89":0,"90":0,"91":0,"93":0,"94":0,"97":0,"105":0,"108":0,"109":0,"111":0,"112":0,"114":0,"120":0,"121":0,"124":0,"128":0,"130":0,"131":0,"133":0,"134":0,"136":0,"144":0,"146":0,"147":0,"148":0,"149":0,"153":0,"154":0,"155":0,"157":0,"158":0,"160":0,"166":0,"168":0,"172":0,"175":0,"176":0,"177":0,"178":0,"181":0,"186":0,"188":0,"189":0,"193":0,"196":0,"198":0,"199":0,"200":0,"204":0,"207":0,"212":0,"214":0,"224":0,"225":0,"227":0,"228":0,"240":0,"241":0,"242":0,"244":0,"257":0,"258":0,"259":0,"261":0,"264":0,"265":0,"280":0,"281":0,"294":0,"297":0,"298":0,"300":0,"305":0,"306":0,"307":0,"309":0,"319":0,"322":0,"323":0,"324":0,"327":0,"335":0,"339":0,"341":0,"342":0,"343":0,"345":0,"347":0,"348":0,"352":0,"358":0,"359":0,"360":0,"362":0,"366":0,"367":0,"368":0,"369":0,"370":0,"371":0,"372":0,"378":0,"391":0,"392":0,"396":0,"397":0,"404":0,"405":0,"406":0,"407":0,"408":0,"410":0,"414":0,"416":0,"417":0,"418":0,"419":0,"420":0,"422":0,"423":0,"426":0,"431":0,"435":0,"438":0,"439":0,"440":0,"442":0,"443":0,"446":0,"447":0,"450":0,"475":0,"482":0,"483":0,"484":0,"485":0,"486":0,"487":0,"488":0,"489":0,"490":0,"495":0,"496":0,"497":0,"499":0,"501":0,"502":0,"504":0,"505":0,"507":0,"509":0,"510":0,"512":0,"514":0,"515":0,"516":0,"518":0,"521":0,"523":0,"524":0,"528":0,"529":0,"532":0,"536":0,"539":0,"540":0,"543":0,"544":0,"546":0,"550":0,"555":0,"556":0,"557":0,"558":0,"559":0,"560":0,"561":0,"562":0,"564":0,"566":0,"572":0,"574":0,"575":0,"576":0,"578":0,"580":0,"584":0,"586":0,"590":0,"592":0,"596":0,"599":0,"600":0,"603":0,"604":0,"606":0,"610":0,"611":0,"612":0,"614":0,"615":0,"616":0,"619":0,"622":0,"623":0,"625":0,"629":0,"633":0,"637":0,"643":0,"654":0,"655":0,"665":0,"677":0,"681":0,"682":0,"684":0,"685":0,"687":0,"688":0,"690":0,"691":0,"694":0};
_yuitest_coverage["build/dom-base/dom-base.js"].functions = {"(anonymous 2):23":0,"}:29":0,"(anonymous 3):44":0,"}:48":0,"setAttribute:71":0,"getAttribute:86":0,"getValue:104":0,"setValue:127":0,"test:145":0,"select:154":0,"button:167":0,"button:174":0,"option:187":0,"select:192":0,"hasClass:223":0,"addClass:239":0,"removeClass:256":0,"replaceClass:279":0,"toggleClass:293":0,"createFromDIV:318":0,"_create:338":0,"_children:351":0,"create:390":0,"_nl2frag:434":0,"addHTML:474":0,"wrap:535":0,"unwrap:549":0,"test:573":0,"test:585":0,"test:591":0,"tbody:599":0,"script:611":0,"option:624":0,"tr:628":0,"td:632":0,"col:636":0,"setWidth:664":0,"setHeight:676":0,"_setSize:680":0,"(anonymous 1):1":0};
_yuitest_coverage["build/dom-base/dom-base.js"].coveredLines = 245;
_yuitest_coverage["build/dom-base/dom-base.js"].coveredFunctions = 40;
_yuitest_coverline("build/dom-base/dom-base.js", 1);
YUI.add('dom-base', function (Y, NAME) {

/**
* @for DOM
* @module dom
*/
_yuitest_coverfunc("build/dom-base/dom-base.js", "(anonymous 1)", 1);
_yuitest_coverline("build/dom-base/dom-base.js", 7);
var documentElement = Y.config.doc.documentElement,
    Y_DOM = Y.DOM,
    TAG_NAME = 'tagName',
    OWNER_DOCUMENT = 'ownerDocument',
    EMPTY_STRING = '',
    addFeature = Y.Features.add,
    testFeature = Y.Features.test;

_yuitest_coverline("build/dom-base/dom-base.js", 15);
Y.mix(Y_DOM, {
    /**
     * Returns the text content of the HTMLElement. 
     * @method getText         
     * @param {HTMLElement} element The html element. 
     * @return {String} The text content of the element (includes text of any descending elements).
     */
    getText: (documentElement.textContent !== undefined) ?
        function(element) {
            _yuitest_coverfunc("build/dom-base/dom-base.js", "(anonymous 2)", 23);
_yuitest_coverline("build/dom-base/dom-base.js", 24);
var ret = '';
            _yuitest_coverline("build/dom-base/dom-base.js", 25);
if (element) {
                _yuitest_coverline("build/dom-base/dom-base.js", 26);
ret = element.textContent;
            }
            _yuitest_coverline("build/dom-base/dom-base.js", 28);
return ret || '';
        } : function(element) {
            _yuitest_coverfunc("build/dom-base/dom-base.js", "}", 29);
_yuitest_coverline("build/dom-base/dom-base.js", 30);
var ret = '';
            _yuitest_coverline("build/dom-base/dom-base.js", 31);
if (element) {
                _yuitest_coverline("build/dom-base/dom-base.js", 32);
ret = element.innerText || element.nodeValue; // might be a textNode
            }
            _yuitest_coverline("build/dom-base/dom-base.js", 34);
return ret || '';
        },

    /**
     * Sets the text content of the HTMLElement. 
     * @method setText         
     * @param {HTMLElement} element The html element. 
     * @param {String} content The content to add. 
     */
    setText: (documentElement.textContent !== undefined) ?
        function(element, content) {
            _yuitest_coverfunc("build/dom-base/dom-base.js", "(anonymous 3)", 44);
_yuitest_coverline("build/dom-base/dom-base.js", 45);
if (element) {
                _yuitest_coverline("build/dom-base/dom-base.js", 46);
element.textContent = content;
            }
        } : function(element, content) {
            _yuitest_coverfunc("build/dom-base/dom-base.js", "}", 48);
_yuitest_coverline("build/dom-base/dom-base.js", 49);
if ('innerText' in element) {
                _yuitest_coverline("build/dom-base/dom-base.js", 50);
element.innerText = content;
            } else {_yuitest_coverline("build/dom-base/dom-base.js", 51);
if ('nodeValue' in element) {
                _yuitest_coverline("build/dom-base/dom-base.js", 52);
element.nodeValue = content;
            }}
    },

    CUSTOM_ATTRIBUTES: (!documentElement.hasAttribute) ? { // IE < 8
        'for': 'htmlFor',
        'class': 'className'
    } : { // w3c
        'htmlFor': 'for',
        'className': 'class'
    },

    /**
     * Provides a normalized attribute interface. 
     * @method setAttribute
     * @param {HTMLElement} el The target element for the attribute.
     * @param {String} attr The attribute to set.
     * @param {String} val The value of the attribute.
     */
    setAttribute: function(el, attr, val, ieAttr) {
        _yuitest_coverfunc("build/dom-base/dom-base.js", "setAttribute", 71);
_yuitest_coverline("build/dom-base/dom-base.js", 72);
if (el && attr && el.setAttribute) {
            _yuitest_coverline("build/dom-base/dom-base.js", 73);
attr = Y_DOM.CUSTOM_ATTRIBUTES[attr] || attr;
            _yuitest_coverline("build/dom-base/dom-base.js", 74);
el.setAttribute(attr, val, ieAttr);
        }
    },


    /**
     * Provides a normalized attribute interface. 
     * @method getAttribute
     * @param {HTMLElement} el The target element for the attribute.
     * @param {String} attr The attribute to get.
     * @return {String} The current value of the attribute. 
     */
    getAttribute: function(el, attr, ieAttr) {
        _yuitest_coverfunc("build/dom-base/dom-base.js", "getAttribute", 86);
_yuitest_coverline("build/dom-base/dom-base.js", 87);
ieAttr = (ieAttr !== undefined) ? ieAttr : 2;
        _yuitest_coverline("build/dom-base/dom-base.js", 88);
var ret = '';
        _yuitest_coverline("build/dom-base/dom-base.js", 89);
if (el && attr && el.getAttribute) {
            _yuitest_coverline("build/dom-base/dom-base.js", 90);
attr = Y_DOM.CUSTOM_ATTRIBUTES[attr] || attr;
            _yuitest_coverline("build/dom-base/dom-base.js", 91);
ret = el.getAttribute(attr, ieAttr);

            _yuitest_coverline("build/dom-base/dom-base.js", 93);
if (ret === null) {
                _yuitest_coverline("build/dom-base/dom-base.js", 94);
ret = ''; // per DOM spec
            }
        }
        _yuitest_coverline("build/dom-base/dom-base.js", 97);
return ret;
    },

    VALUE_SETTERS: {},

    VALUE_GETTERS: {},

    getValue: function(node) {
        _yuitest_coverfunc("build/dom-base/dom-base.js", "getValue", 104);
_yuitest_coverline("build/dom-base/dom-base.js", 105);
var ret = '', // TODO: return null?
            getter;

        _yuitest_coverline("build/dom-base/dom-base.js", 108);
if (node && node[TAG_NAME]) {
            _yuitest_coverline("build/dom-base/dom-base.js", 109);
getter = Y_DOM.VALUE_GETTERS[node[TAG_NAME].toLowerCase()];

            _yuitest_coverline("build/dom-base/dom-base.js", 111);
if (getter) {
                _yuitest_coverline("build/dom-base/dom-base.js", 112);
ret = getter(node);
            } else {
                _yuitest_coverline("build/dom-base/dom-base.js", 114);
ret = node.value;
            }
        }

        // workaround for IE8 JSON stringify bug
        // which converts empty string values to null
        _yuitest_coverline("build/dom-base/dom-base.js", 120);
if (ret === EMPTY_STRING) {
            _yuitest_coverline("build/dom-base/dom-base.js", 121);
ret = EMPTY_STRING; // for real
        }

        _yuitest_coverline("build/dom-base/dom-base.js", 124);
return (typeof ret === 'string') ? ret : '';
    },

    setValue: function(node, val) {
        _yuitest_coverfunc("build/dom-base/dom-base.js", "setValue", 127);
_yuitest_coverline("build/dom-base/dom-base.js", 128);
var setter;

        _yuitest_coverline("build/dom-base/dom-base.js", 130);
if (node && node[TAG_NAME]) {
            _yuitest_coverline("build/dom-base/dom-base.js", 131);
setter = Y_DOM.VALUE_SETTERS[node[TAG_NAME].toLowerCase()];

            _yuitest_coverline("build/dom-base/dom-base.js", 133);
if (setter) {
                _yuitest_coverline("build/dom-base/dom-base.js", 134);
setter(node, val);
            } else {
                _yuitest_coverline("build/dom-base/dom-base.js", 136);
node.value = val;
            }
        }
    },

    creators: {}
});

_yuitest_coverline("build/dom-base/dom-base.js", 144);
addFeature('value-set', 'select', {
    test: function() {
        _yuitest_coverfunc("build/dom-base/dom-base.js", "test", 145);
_yuitest_coverline("build/dom-base/dom-base.js", 146);
var node = Y.config.doc.createElement('select');
        _yuitest_coverline("build/dom-base/dom-base.js", 147);
node.innerHTML = '<option>1</option><option>2</option>';
        _yuitest_coverline("build/dom-base/dom-base.js", 148);
node.value = '2';
        _yuitest_coverline("build/dom-base/dom-base.js", 149);
return (node.value && node.value === '2');
    }
});

_yuitest_coverline("build/dom-base/dom-base.js", 153);
if (!testFeature('value-set', 'select')) {
    _yuitest_coverline("build/dom-base/dom-base.js", 154);
Y_DOM.VALUE_SETTERS.select = function(node, val) {
        _yuitest_coverfunc("build/dom-base/dom-base.js", "select", 154);
_yuitest_coverline("build/dom-base/dom-base.js", 155);
for (var i = 0, options = node.getElementsByTagName('option'), option;
                option = options[i++];) {
            _yuitest_coverline("build/dom-base/dom-base.js", 157);
if (Y_DOM.getValue(option) === val) {
                _yuitest_coverline("build/dom-base/dom-base.js", 158);
option.selected = true;
                //Y_DOM.setAttribute(option, 'selected', 'selected');
                _yuitest_coverline("build/dom-base/dom-base.js", 160);
break;
            }
        }
    };
}

_yuitest_coverline("build/dom-base/dom-base.js", 166);
Y.mix(Y_DOM.VALUE_GETTERS, {
    button: function(node) {
        _yuitest_coverfunc("build/dom-base/dom-base.js", "button", 167);
_yuitest_coverline("build/dom-base/dom-base.js", 168);
return (node.attributes && node.attributes.value) ? node.attributes.value.value : '';
    }
});

_yuitest_coverline("build/dom-base/dom-base.js", 172);
Y.mix(Y_DOM.VALUE_SETTERS, {
    // IE: node.value changes the button text, which should be handled via innerHTML
    button: function(node, val) {
        _yuitest_coverfunc("build/dom-base/dom-base.js", "button", 174);
_yuitest_coverline("build/dom-base/dom-base.js", 175);
var attr = node.attributes.value;
        _yuitest_coverline("build/dom-base/dom-base.js", 176);
if (!attr) {
            _yuitest_coverline("build/dom-base/dom-base.js", 177);
attr = node[OWNER_DOCUMENT].createAttribute('value');
            _yuitest_coverline("build/dom-base/dom-base.js", 178);
node.setAttributeNode(attr);
        }

        _yuitest_coverline("build/dom-base/dom-base.js", 181);
attr.value = val;
    }
});


_yuitest_coverline("build/dom-base/dom-base.js", 186);
Y.mix(Y_DOM.VALUE_GETTERS, {
    option: function(node) {
        _yuitest_coverfunc("build/dom-base/dom-base.js", "option", 187);
_yuitest_coverline("build/dom-base/dom-base.js", 188);
var attrs = node.attributes;
        _yuitest_coverline("build/dom-base/dom-base.js", 189);
return (attrs.value && attrs.value.specified) ? node.value : node.text;
    },

    select: function(node) {
        _yuitest_coverfunc("build/dom-base/dom-base.js", "select", 192);
_yuitest_coverline("build/dom-base/dom-base.js", 193);
var val = node.value,
            options = node.options;

        _yuitest_coverline("build/dom-base/dom-base.js", 196);
if (options && options.length) {
            // TODO: implement multipe select
            _yuitest_coverline("build/dom-base/dom-base.js", 198);
if (node.multiple) {
            } else {_yuitest_coverline("build/dom-base/dom-base.js", 199);
if (node.selectedIndex > -1) {
                _yuitest_coverline("build/dom-base/dom-base.js", 200);
val = Y_DOM.getValue(options[node.selectedIndex]);
            }}
        }

        _yuitest_coverline("build/dom-base/dom-base.js", 204);
return val;
    }
});
_yuitest_coverline("build/dom-base/dom-base.js", 207);
var addClass, hasClass, removeClass;

/**
* Old browsers like IE 7/8/9 do not support classList, the fallback use the original dom-class method, working with className attribute
*/
_yuitest_coverline("build/dom-base/dom-base.js", 212);
var _hasClassList = (typeof document !== "undefined" && ("classList" in document.createElement("a")));

_yuitest_coverline("build/dom-base/dom-base.js", 214);
Y.mix(Y.DOM, {
    /**
     * Determines whether a DOM element has the given className.
     * @method hasClass
     * @for DOM
     * @param {HTMLElement} element The DOM element. 
     * @param {String} className the class name to search for
     * @return {Boolean} Whether or not the element has the given class. 
     */
    hasClass: function(node, className) {
		_yuitest_coverfunc("build/dom-base/dom-base.js", "hasClass", 223);
_yuitest_coverline("build/dom-base/dom-base.js", 224);
if (_hasClassList){
			_yuitest_coverline("build/dom-base/dom-base.js", 225);
return node.classList.contains(className);
		} else {
			_yuitest_coverline("build/dom-base/dom-base.js", 227);
var re = Y.DOM._getRegExp('(?:^|\\s+)' + className + '(?:\\s+|$)');
			_yuitest_coverline("build/dom-base/dom-base.js", 228);
return re.test(node.className);
		}
    },

    /**
     * Adds a class name to a given DOM element.
     * @method addClass         
     * @for DOM
     * @param {HTMLElement} element The DOM element. 
     * @param {String} className the class name to add to the class attribute
     */
    addClass: function(node, className) {
		_yuitest_coverfunc("build/dom-base/dom-base.js", "addClass", 239);
_yuitest_coverline("build/dom-base/dom-base.js", 240);
if (!Y.DOM.hasClass(node, className)){ // skip if already present
			_yuitest_coverline("build/dom-base/dom-base.js", 241);
if (_hasClassList){
				_yuitest_coverline("build/dom-base/dom-base.js", 242);
node.classList.add(className);
			} else {
				_yuitest_coverline("build/dom-base/dom-base.js", 244);
node.className = Y.Lang.trim([node.className, className].join(' '));
			}
		}
    },

    /**
     * Removes a class name from a given element.
     * @method removeClass         
     * @for DOM
     * @param {HTMLElement} element The DOM element. 
     * @param {String} className the class name to remove from the class attribute
     */
    removeClass: function(node, className) {  
		_yuitest_coverfunc("build/dom-base/dom-base.js", "removeClass", 256);
_yuitest_coverline("build/dom-base/dom-base.js", 257);
if (className && hasClass(node, className)) {
			_yuitest_coverline("build/dom-base/dom-base.js", 258);
if (_hasClassList){
				_yuitest_coverline("build/dom-base/dom-base.js", 259);
node.classList.remove(className);
			} else {
				_yuitest_coverline("build/dom-base/dom-base.js", 261);
node.className = Y.Lang.trim(node.className.replace(Y.DOM._getRegExp('(?:^|\\s+)' + className + '(?:\\s+|$)'), ' '));
			}

			_yuitest_coverline("build/dom-base/dom-base.js", 264);
if ( hasClass(node, className) ) { // in case of multiple adjacent
				_yuitest_coverline("build/dom-base/dom-base.js", 265);
removeClass(node, className);
			}
		}            
    },

    /**
     * Replace a class with another class for a given element.
     * If no oldClassName is present, the newClassName is simply added.
     * @method replaceClass  
     * @for DOM
     * @param {HTMLElement} element The DOM element 
     * @param {String} oldClassName the class name to be replaced
     * @param {String} newClassName the class name that will be replacing the old class name
     */
    replaceClass: function(node, oldC, newC) {
        _yuitest_coverfunc("build/dom-base/dom-base.js", "replaceClass", 279);
_yuitest_coverline("build/dom-base/dom-base.js", 280);
removeClass(node, oldC); // remove first in case oldC === newC
        _yuitest_coverline("build/dom-base/dom-base.js", 281);
addClass(node, newC);
    },

    /**
     * If the className exists on the node it is removed, if it doesn't exist it is added.
     * @method toggleClass  
     * @for DOM
     * @param {HTMLElement} element The DOM element
     * @param {String} className the class name to be toggled
     * @param {Boolean} addClass optional boolean to indicate whether class
     * should be added or removed regardless of current state
     */
    toggleClass: function(node, className, force) {
        _yuitest_coverfunc("build/dom-base/dom-base.js", "toggleClass", 293);
_yuitest_coverline("build/dom-base/dom-base.js", 294);
var add = (force !== undefined) ? force :
                !(hasClass(node, className));

        _yuitest_coverline("build/dom-base/dom-base.js", 297);
if (add) {
            _yuitest_coverline("build/dom-base/dom-base.js", 298);
addClass(node, className);
        } else {
            _yuitest_coverline("build/dom-base/dom-base.js", 300);
removeClass(node, className);
        }
    }
});

_yuitest_coverline("build/dom-base/dom-base.js", 305);
hasClass = Y.DOM.hasClass;
_yuitest_coverline("build/dom-base/dom-base.js", 306);
removeClass = Y.DOM.removeClass;
_yuitest_coverline("build/dom-base/dom-base.js", 307);
addClass = Y.DOM.addClass;

_yuitest_coverline("build/dom-base/dom-base.js", 309);
var re_tag = /<([a-z]+)/i,

    Y_DOM = Y.DOM,

    addFeature = Y.Features.add,
    testFeature = Y.Features.test,

    creators = {},

    createFromDIV = function(html, tag) {
        _yuitest_coverfunc("build/dom-base/dom-base.js", "createFromDIV", 318);
_yuitest_coverline("build/dom-base/dom-base.js", 319);
var div = Y.config.doc.createElement('div'),
            ret = true;

        _yuitest_coverline("build/dom-base/dom-base.js", 322);
div.innerHTML = html;
        _yuitest_coverline("build/dom-base/dom-base.js", 323);
if (!div.firstChild || div.firstChild.tagName !== tag.toUpperCase()) {
            _yuitest_coverline("build/dom-base/dom-base.js", 324);
ret = false;
        }

        _yuitest_coverline("build/dom-base/dom-base.js", 327);
return ret;
    },

    re_tbody = /(?:\/(?:thead|tfoot|tbody|caption|col|colgroup)>)+\s*<tbody/,

    TABLE_OPEN = '<table>',
    TABLE_CLOSE = '</table>';

_yuitest_coverline("build/dom-base/dom-base.js", 335);
Y.mix(Y.DOM, {
    _fragClones: {},

    _create: function(html, doc, tag) {
        _yuitest_coverfunc("build/dom-base/dom-base.js", "_create", 338);
_yuitest_coverline("build/dom-base/dom-base.js", 339);
tag = tag || 'div';

        _yuitest_coverline("build/dom-base/dom-base.js", 341);
var frag = Y_DOM._fragClones[tag];
        _yuitest_coverline("build/dom-base/dom-base.js", 342);
if (frag) {
            _yuitest_coverline("build/dom-base/dom-base.js", 343);
frag = frag.cloneNode(false);
        } else {
            _yuitest_coverline("build/dom-base/dom-base.js", 345);
frag = Y_DOM._fragClones[tag] = doc.createElement(tag);
        }
        _yuitest_coverline("build/dom-base/dom-base.js", 347);
frag.innerHTML = html;
        _yuitest_coverline("build/dom-base/dom-base.js", 348);
return frag;
    },

    _children: function(node, tag) {
            _yuitest_coverfunc("build/dom-base/dom-base.js", "_children", 351);
_yuitest_coverline("build/dom-base/dom-base.js", 352);
var i = 0,
            children = node.children,
            childNodes,
            hasComments,
            child;

        _yuitest_coverline("build/dom-base/dom-base.js", 358);
if (children && children.tags) { // use tags filter when possible
            _yuitest_coverline("build/dom-base/dom-base.js", 359);
if (tag) {
                _yuitest_coverline("build/dom-base/dom-base.js", 360);
children = node.children.tags(tag);
            } else { // IE leaks comments into children
                _yuitest_coverline("build/dom-base/dom-base.js", 362);
hasComments = children.tags('!').length;
            }
        }
        
        _yuitest_coverline("build/dom-base/dom-base.js", 366);
if (!children || (!children.tags && tag) || hasComments) {
            _yuitest_coverline("build/dom-base/dom-base.js", 367);
childNodes = children || node.childNodes;
            _yuitest_coverline("build/dom-base/dom-base.js", 368);
children = [];
            _yuitest_coverline("build/dom-base/dom-base.js", 369);
while ((child = childNodes[i++])) {
                _yuitest_coverline("build/dom-base/dom-base.js", 370);
if (child.nodeType === 1) {
                    _yuitest_coverline("build/dom-base/dom-base.js", 371);
if (!tag || tag === child.tagName) {
                        _yuitest_coverline("build/dom-base/dom-base.js", 372);
children.push(child);
                    }
                }
            }
        }

        _yuitest_coverline("build/dom-base/dom-base.js", 378);
return children || [];
    },

    /**
     * Creates a new dom node using the provided markup string. 
     * @method create
     * @param {String} html The markup used to create the element
     * @param {HTMLDocument} doc An optional document context 
     * @return {HTMLElement|DocumentFragment} returns a single HTMLElement 
     * when creating one node, and a documentFragment when creating
     * multiple nodes.
     */
    create: function(html, doc) {
        _yuitest_coverfunc("build/dom-base/dom-base.js", "create", 390);
_yuitest_coverline("build/dom-base/dom-base.js", 391);
if (typeof html === 'string') {
            _yuitest_coverline("build/dom-base/dom-base.js", 392);
html = Y.Lang.trim(html); // match IE which trims whitespace from innerHTML

        }

        _yuitest_coverline("build/dom-base/dom-base.js", 396);
doc = doc || Y.config.doc;
        _yuitest_coverline("build/dom-base/dom-base.js", 397);
var m = re_tag.exec(html),
            create = Y_DOM._create,
            custom = creators,
            ret = null,
            creator,
            tag, nodes;

        _yuitest_coverline("build/dom-base/dom-base.js", 404);
if (html != undefined) { // not undefined or null
            _yuitest_coverline("build/dom-base/dom-base.js", 405);
if (m && m[1]) {
                _yuitest_coverline("build/dom-base/dom-base.js", 406);
creator = custom[m[1].toLowerCase()];
                _yuitest_coverline("build/dom-base/dom-base.js", 407);
if (typeof creator === 'function') {
                    _yuitest_coverline("build/dom-base/dom-base.js", 408);
create = creator; 
                } else {
                    _yuitest_coverline("build/dom-base/dom-base.js", 410);
tag = creator;
                }
            }

            _yuitest_coverline("build/dom-base/dom-base.js", 414);
nodes = create(html, doc, tag).childNodes;

            _yuitest_coverline("build/dom-base/dom-base.js", 416);
if (nodes.length === 1) { // return single node, breaking parentNode ref from "fragment"
                _yuitest_coverline("build/dom-base/dom-base.js", 417);
ret = nodes[0].parentNode.removeChild(nodes[0]);
            } else {_yuitest_coverline("build/dom-base/dom-base.js", 418);
if (nodes[0] && nodes[0].className === 'yui3-big-dummy') { // using dummy node to preserve some attributes (e.g. OPTION not selected)
                _yuitest_coverline("build/dom-base/dom-base.js", 419);
if (nodes.length === 2) {
                    _yuitest_coverline("build/dom-base/dom-base.js", 420);
ret = nodes[0].nextSibling;
                } else {
                    _yuitest_coverline("build/dom-base/dom-base.js", 422);
nodes[0].parentNode.removeChild(nodes[0]); 
                    _yuitest_coverline("build/dom-base/dom-base.js", 423);
ret = Y_DOM._nl2frag(nodes, doc);
                }
            } else { // return multiple nodes as a fragment
                 _yuitest_coverline("build/dom-base/dom-base.js", 426);
ret = Y_DOM._nl2frag(nodes, doc);
            }}

        }

        _yuitest_coverline("build/dom-base/dom-base.js", 431);
return ret;
    },

    _nl2frag: function(nodes, doc) {
        _yuitest_coverfunc("build/dom-base/dom-base.js", "_nl2frag", 434);
_yuitest_coverline("build/dom-base/dom-base.js", 435);
var ret = null,
            i, len;

        _yuitest_coverline("build/dom-base/dom-base.js", 438);
if (nodes && (nodes.push || nodes.item) && nodes[0]) {
            _yuitest_coverline("build/dom-base/dom-base.js", 439);
doc = doc || nodes[0].ownerDocument; 
            _yuitest_coverline("build/dom-base/dom-base.js", 440);
ret = doc.createDocumentFragment();

            _yuitest_coverline("build/dom-base/dom-base.js", 442);
if (nodes.item) { // convert live list to static array
                _yuitest_coverline("build/dom-base/dom-base.js", 443);
nodes = Y.Array(nodes, 0, true);
            }

            _yuitest_coverline("build/dom-base/dom-base.js", 446);
for (i = 0, len = nodes.length; i < len; i++) {
                _yuitest_coverline("build/dom-base/dom-base.js", 447);
ret.appendChild(nodes[i]); 
            }
        } // else inline with log for minification
        _yuitest_coverline("build/dom-base/dom-base.js", 450);
return ret;
    },

    /**
     * Inserts content in a node at the given location 
     * @method addHTML
     * @param {HTMLElement} node The node to insert into
     * @param {HTMLElement | Array | HTMLCollection} content The content to be inserted 
     * @param {HTMLElement} where Where to insert the content
     * If no "where" is given, content is appended to the node
     * Possible values for "where"
     * <dl>
     * <dt>HTMLElement</dt>
     * <dd>The element to insert before</dd>
     * <dt>"replace"</dt>
     * <dd>Replaces the existing HTML</dd>
     * <dt>"before"</dt>
     * <dd>Inserts before the existing HTML</dd>
     * <dt>"before"</dt>
     * <dd>Inserts content before the node</dd>
     * <dt>"after"</dt>
     * <dd>Inserts content after the node</dd>
     * </dl>
     */
    addHTML: function(node, content, where) {
        _yuitest_coverfunc("build/dom-base/dom-base.js", "addHTML", 474);
_yuitest_coverline("build/dom-base/dom-base.js", 475);
var nodeParent = node.parentNode,
            i = 0,
            item,
            ret = content,
            newNode;
            

        _yuitest_coverline("build/dom-base/dom-base.js", 482);
if (content != undefined) { // not null or undefined (maybe 0)
            _yuitest_coverline("build/dom-base/dom-base.js", 483);
if (content.nodeType) { // DOM node, just add it
                _yuitest_coverline("build/dom-base/dom-base.js", 484);
newNode = content;
            } else {_yuitest_coverline("build/dom-base/dom-base.js", 485);
if (typeof content == 'string' || typeof content == 'number') {
                _yuitest_coverline("build/dom-base/dom-base.js", 486);
ret = newNode = Y_DOM.create(content);
            } else {_yuitest_coverline("build/dom-base/dom-base.js", 487);
if (content[0] && content[0].nodeType) { // array or collection 
                _yuitest_coverline("build/dom-base/dom-base.js", 488);
newNode = Y.config.doc.createDocumentFragment();
                _yuitest_coverline("build/dom-base/dom-base.js", 489);
while ((item = content[i++])) {
                    _yuitest_coverline("build/dom-base/dom-base.js", 490);
newNode.appendChild(item); // append to fragment for insertion
                }
            }}}
        }

        _yuitest_coverline("build/dom-base/dom-base.js", 495);
if (where) {
            _yuitest_coverline("build/dom-base/dom-base.js", 496);
if (newNode && where.parentNode) { // insert regardless of relationship to node
                _yuitest_coverline("build/dom-base/dom-base.js", 497);
where.parentNode.insertBefore(newNode, where);
            } else {
                _yuitest_coverline("build/dom-base/dom-base.js", 499);
switch (where) {
                    case 'replace':
                        _yuitest_coverline("build/dom-base/dom-base.js", 501);
while (node.firstChild) {
                            _yuitest_coverline("build/dom-base/dom-base.js", 502);
node.removeChild(node.firstChild);
                        }
                        _yuitest_coverline("build/dom-base/dom-base.js", 504);
if (newNode) { // allow empty content to clear node
                            _yuitest_coverline("build/dom-base/dom-base.js", 505);
node.appendChild(newNode);
                        }
                        _yuitest_coverline("build/dom-base/dom-base.js", 507);
break;
                    case 'before':
                        _yuitest_coverline("build/dom-base/dom-base.js", 509);
if (newNode) {
                            _yuitest_coverline("build/dom-base/dom-base.js", 510);
nodeParent.insertBefore(newNode, node);
                        }
                        _yuitest_coverline("build/dom-base/dom-base.js", 512);
break;
                    case 'after':
                        _yuitest_coverline("build/dom-base/dom-base.js", 514);
if (newNode) {
                            _yuitest_coverline("build/dom-base/dom-base.js", 515);
if (node.nextSibling) { // IE errors if refNode is null
                                _yuitest_coverline("build/dom-base/dom-base.js", 516);
nodeParent.insertBefore(newNode, node.nextSibling);
                            } else {
                                _yuitest_coverline("build/dom-base/dom-base.js", 518);
nodeParent.appendChild(newNode);
                            }
                        }
                        _yuitest_coverline("build/dom-base/dom-base.js", 521);
break;
                    default:
                        _yuitest_coverline("build/dom-base/dom-base.js", 523);
if (newNode) {
                            _yuitest_coverline("build/dom-base/dom-base.js", 524);
node.appendChild(newNode);
                        }
                }
            }
        } else {_yuitest_coverline("build/dom-base/dom-base.js", 528);
if (newNode) {
            _yuitest_coverline("build/dom-base/dom-base.js", 529);
node.appendChild(newNode);
        }}

        _yuitest_coverline("build/dom-base/dom-base.js", 532);
return ret;
    },

    wrap: function(node, html) {
        _yuitest_coverfunc("build/dom-base/dom-base.js", "wrap", 535);
_yuitest_coverline("build/dom-base/dom-base.js", 536);
var parent = (html && html.nodeType) ? html : Y.DOM.create(html),
            nodes = parent.getElementsByTagName('*');

        _yuitest_coverline("build/dom-base/dom-base.js", 539);
if (nodes.length) {
            _yuitest_coverline("build/dom-base/dom-base.js", 540);
parent = nodes[nodes.length - 1];
        }

        _yuitest_coverline("build/dom-base/dom-base.js", 543);
if (node.parentNode) { 
            _yuitest_coverline("build/dom-base/dom-base.js", 544);
node.parentNode.replaceChild(parent, node);
        }
        _yuitest_coverline("build/dom-base/dom-base.js", 546);
parent.appendChild(node);
    },

    unwrap: function(node) {
        _yuitest_coverfunc("build/dom-base/dom-base.js", "unwrap", 549);
_yuitest_coverline("build/dom-base/dom-base.js", 550);
var parent = node.parentNode,
            lastChild = parent.lastChild,
            next = node,
            grandparent;

        _yuitest_coverline("build/dom-base/dom-base.js", 555);
if (parent) {
            _yuitest_coverline("build/dom-base/dom-base.js", 556);
grandparent = parent.parentNode;
            _yuitest_coverline("build/dom-base/dom-base.js", 557);
if (grandparent) {
                _yuitest_coverline("build/dom-base/dom-base.js", 558);
node = parent.firstChild;
                _yuitest_coverline("build/dom-base/dom-base.js", 559);
while (node !== lastChild) {
                    _yuitest_coverline("build/dom-base/dom-base.js", 560);
next = node.nextSibling;
                    _yuitest_coverline("build/dom-base/dom-base.js", 561);
grandparent.insertBefore(node, parent);
                    _yuitest_coverline("build/dom-base/dom-base.js", 562);
node = next;
                }
                _yuitest_coverline("build/dom-base/dom-base.js", 564);
grandparent.replaceChild(lastChild, parent);
            } else {
                _yuitest_coverline("build/dom-base/dom-base.js", 566);
parent.removeChild(node);
            }
        }
    }
});

_yuitest_coverline("build/dom-base/dom-base.js", 572);
addFeature('innerhtml', 'table', {
    test: function() {
        _yuitest_coverfunc("build/dom-base/dom-base.js", "test", 573);
_yuitest_coverline("build/dom-base/dom-base.js", 574);
var node = Y.config.doc.createElement('table');
        _yuitest_coverline("build/dom-base/dom-base.js", 575);
try {
            _yuitest_coverline("build/dom-base/dom-base.js", 576);
node.innerHTML = '<tbody></tbody>';
        } catch(e) {
            _yuitest_coverline("build/dom-base/dom-base.js", 578);
return false;
        }
        _yuitest_coverline("build/dom-base/dom-base.js", 580);
return (node.firstChild && node.firstChild.nodeName === 'TBODY');
    }
});

_yuitest_coverline("build/dom-base/dom-base.js", 584);
addFeature('innerhtml-div', 'tr', {
    test: function() {
        _yuitest_coverfunc("build/dom-base/dom-base.js", "test", 585);
_yuitest_coverline("build/dom-base/dom-base.js", 586);
return createFromDIV('<tr></tr>', 'tr');
    }
});

_yuitest_coverline("build/dom-base/dom-base.js", 590);
addFeature('innerhtml-div', 'script', {
    test: function() {
        _yuitest_coverfunc("build/dom-base/dom-base.js", "test", 591);
_yuitest_coverline("build/dom-base/dom-base.js", 592);
return createFromDIV('<script></script>', 'script');
    }
});

_yuitest_coverline("build/dom-base/dom-base.js", 596);
if (!testFeature('innerhtml', 'table')) {
    // TODO: thead/tfoot with nested tbody
        // IE adds TBODY when creating TABLE elements (which may share this impl)
    _yuitest_coverline("build/dom-base/dom-base.js", 599);
creators.tbody = function(html, doc) {
        _yuitest_coverfunc("build/dom-base/dom-base.js", "tbody", 599);
_yuitest_coverline("build/dom-base/dom-base.js", 600);
var frag = Y_DOM.create(TABLE_OPEN + html + TABLE_CLOSE, doc),
            tb = Y.DOM._children(frag, 'tbody')[0];

        _yuitest_coverline("build/dom-base/dom-base.js", 603);
if (frag.children.length > 1 && tb && !re_tbody.test(html)) {
            _yuitest_coverline("build/dom-base/dom-base.js", 604);
tb.parentNode.removeChild(tb); // strip extraneous tbody
        }
        _yuitest_coverline("build/dom-base/dom-base.js", 606);
return frag;
    };
}

_yuitest_coverline("build/dom-base/dom-base.js", 610);
if (!testFeature('innerhtml-div', 'script')) {
    _yuitest_coverline("build/dom-base/dom-base.js", 611);
creators.script = function(html, doc) {
        _yuitest_coverfunc("build/dom-base/dom-base.js", "script", 611);
_yuitest_coverline("build/dom-base/dom-base.js", 612);
var frag = doc.createElement('div');

        _yuitest_coverline("build/dom-base/dom-base.js", 614);
frag.innerHTML = '-' + html;
        _yuitest_coverline("build/dom-base/dom-base.js", 615);
frag.removeChild(frag.firstChild);
        _yuitest_coverline("build/dom-base/dom-base.js", 616);
return frag;
    };

    _yuitest_coverline("build/dom-base/dom-base.js", 619);
creators.link = creators.style = creators.script;
}

_yuitest_coverline("build/dom-base/dom-base.js", 622);
if (!testFeature('innerhtml-div', 'tr')) {
    _yuitest_coverline("build/dom-base/dom-base.js", 623);
Y.mix(creators, {
        option: function(html, doc) {
            _yuitest_coverfunc("build/dom-base/dom-base.js", "option", 624);
_yuitest_coverline("build/dom-base/dom-base.js", 625);
return Y_DOM.create('<select><option class="yui3-big-dummy" selected></option>' + html + '</select>', doc);
        },

        tr: function(html, doc) {
            _yuitest_coverfunc("build/dom-base/dom-base.js", "tr", 628);
_yuitest_coverline("build/dom-base/dom-base.js", 629);
return Y_DOM.create('<tbody>' + html + '</tbody>', doc);
        },

        td: function(html, doc) {
            _yuitest_coverfunc("build/dom-base/dom-base.js", "td", 632);
_yuitest_coverline("build/dom-base/dom-base.js", 633);
return Y_DOM.create('<tr>' + html + '</tr>', doc);
        }, 

        col: function(html, doc) {
            _yuitest_coverfunc("build/dom-base/dom-base.js", "col", 636);
_yuitest_coverline("build/dom-base/dom-base.js", 637);
return Y_DOM.create('<colgroup>' + html + '</colgroup>', doc);
        }, 

        tbody: 'table'
    });

    _yuitest_coverline("build/dom-base/dom-base.js", 643);
Y.mix(creators, {
        legend: 'fieldset',
        th: creators.td,
        thead: creators.tbody,
        tfoot: creators.tbody,
        caption: creators.tbody,
        colgroup: creators.tbody,
        optgroup: creators.option
    });
}

_yuitest_coverline("build/dom-base/dom-base.js", 654);
Y_DOM.creators = creators;
_yuitest_coverline("build/dom-base/dom-base.js", 655);
Y.mix(Y.DOM, {
    /**
     * Sets the width of the element to the given size, regardless
     * of box model, border, padding, etc.
     * @method setWidth
     * @param {HTMLElement} element The DOM element. 
     * @param {String|Number} size The pixel height to size to
     */

    setWidth: function(node, size) {
        _yuitest_coverfunc("build/dom-base/dom-base.js", "setWidth", 664);
_yuitest_coverline("build/dom-base/dom-base.js", 665);
Y.DOM._setSize(node, 'width', size);
    },

    /**
     * Sets the height of the element to the given size, regardless
     * of box model, border, padding, etc.
     * @method setHeight
     * @param {HTMLElement} element The DOM element. 
     * @param {String|Number} size The pixel height to size to
     */

    setHeight: function(node, size) {
        _yuitest_coverfunc("build/dom-base/dom-base.js", "setHeight", 676);
_yuitest_coverline("build/dom-base/dom-base.js", 677);
Y.DOM._setSize(node, 'height', size);
    },

    _setSize: function(node, prop, val) {
        _yuitest_coverfunc("build/dom-base/dom-base.js", "_setSize", 680);
_yuitest_coverline("build/dom-base/dom-base.js", 681);
val = (val > 0) ? val : 0;
        _yuitest_coverline("build/dom-base/dom-base.js", 682);
var size = 0;

        _yuitest_coverline("build/dom-base/dom-base.js", 684);
node.style[prop] = val + 'px';
        _yuitest_coverline("build/dom-base/dom-base.js", 685);
size = (prop === 'height') ? node.offsetHeight : node.offsetWidth;

        _yuitest_coverline("build/dom-base/dom-base.js", 687);
if (size > val) {
            _yuitest_coverline("build/dom-base/dom-base.js", 688);
val = val - (size - val);

            _yuitest_coverline("build/dom-base/dom-base.js", 690);
if (val < 0) {
                _yuitest_coverline("build/dom-base/dom-base.js", 691);
val = 0;
            }

            _yuitest_coverline("build/dom-base/dom-base.js", 694);
node.style[prop] = val + 'px';
        }
    }
});


}, '@VERSION@', {"requires": ["dom-core"]});
