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
_yuitest_coverage["editor-selection"] = {
    lines: {},
    functions: {},
    coveredLines: 0,
    calledLines: 0,
    coveredFunctions: 0,
    calledFunctions: 0,
    path: "editor-selection",
    code: []
};
_yuitest_coverage["editor-selection"].code=["YUI.add('editor-selection', function (Y, NAME) {","","    /**","     * Wraps some common Selection/Range functionality into a simple object","     * @class EditorSelection","     * @constructor","     * @module editor","     * @submodule selection","     */","    ","    //TODO This shouldn't be there, Y.Node doesn't normalize getting textnode content.","    var textContent = 'textContent',","    INNER_HTML = 'innerHTML',","    FONT_FAMILY = 'fontFamily';","","    if (Y.UA.ie) {","        textContent = 'nodeValue';","    }","","    Y.EditorSelection = function(domEvent) {","        var sel, par, ieNode, nodes, rng, i;","","        if (Y.config.win.getSelection && (!Y.UA.ie || Y.UA.ie < 9)) {","	        sel = Y.config.win.getSelection();","        } else if (Y.config.doc.selection) {","    	    sel = Y.config.doc.selection.createRange();","        }","        this._selection = sel;","","        if (!sel) {","            return false;","        }","","        if (sel.pasteHTML) {","            this.isCollapsed = (sel.compareEndPoints('StartToEnd', sel)) ? false : true;","            if (this.isCollapsed) {","                this.anchorNode = this.focusNode = Y.one(sel.parentElement());","","                if (domEvent) {","                    ieNode = Y.config.doc.elementFromPoint(domEvent.clientX, domEvent.clientY);","                }","                rng = sel.duplicate();","                if (!ieNode) {","                    par = sel.parentElement();","                    nodes = par.childNodes;","","                    for (i = 0; i < nodes.length; i++) {","                        //This causes IE to not allow a selection on a doubleclick","                        //rng.select(nodes[i]);","                        if (rng.inRange(sel)) {","                            if (!ieNode) {","                                ieNode = nodes[i];","                            }","                        }","                    }","                }","","                this.ieNode = ieNode;","                ","                if (ieNode) {","                    if (ieNode.nodeType !== 3) {","                        if (ieNode.firstChild) {","                            ieNode = ieNode.firstChild;","                        }","                        if (ieNode && ieNode.tagName && ieNode.tagName.toLowerCase() === 'body') {","                            if (ieNode.firstChild) {","                                ieNode = ieNode.firstChild;","                            }","                        }","                    }","                    this.anchorNode = this.focusNode = Y.EditorSelection.resolve(ieNode);","                    ","                    rng.moveToElementText(sel.parentElement());","                    var comp = sel.compareEndPoints('StartToStart', rng),","                    moved = 0;","                    if (comp) {","                        //We are not at the beginning of the selection.","                        //Setting the move to something large, may need to increase it later","                        moved = Math.abs(sel.move('character', -9999));","                    }","                    ","                    this.anchorOffset = this.focusOffset = moved;","                    ","                    this.anchorTextNode = this.focusTextNode = Y.one(ieNode);","                }","                ","                ","            } else {","                //This helps IE deal with a selection and nodeChange events","                if (sel.htmlText && sel.htmlText !== '') {","                    var n = Y.Node.create(sel.htmlText);","                    if (n && n.get('id')) {","                        var id = n.get('id');","                        this.anchorNode = this.focusNode = Y.one('#' + id);","                    } else if (n) {","                        n = n.get('childNodes');","                        this.anchorNode = this.focusNode = n.item(0);","                    }","                }","            }","","            //var self = this;","            //debugger;","        } else {","            this.isCollapsed = sel.isCollapsed;","            this.anchorNode = Y.EditorSelection.resolve(sel.anchorNode);","            this.focusNode = Y.EditorSelection.resolve(sel.focusNode);","            this.anchorOffset = sel.anchorOffset;","            this.focusOffset = sel.focusOffset;","            ","            this.anchorTextNode = Y.one(sel.anchorNode);","            this.focusTextNode = Y.one(sel.focusNode);","        }","        if (Y.Lang.isString(sel.text)) {","            this.text = sel.text;","        } else {","            if (sel.toString) {","                this.text = sel.toString();","            } else {","                this.text = '';","            }","        }","    };","    ","    /**","    * Utility method to remove dead font-family styles from an element.","    * @static","    * @method removeFontFamily","    */","    Y.EditorSelection.removeFontFamily = function(n) {","        n.removeAttribute('face');","        var s = n.getAttribute('style').toLowerCase();","        if (s === '' || (s == 'font-family: ')) {","            n.removeAttribute('style');","        }","        if (s.match(Y.EditorSelection.REG_FONTFAMILY)) {","            s = s.replace(Y.EditorSelection.REG_FONTFAMILY, '');","            n.setAttribute('style', s);","        }","    };","","    /**","    * Performs a prefilter on all nodes in the editor. Looks for nodes with a style: fontFamily or font face","    * It then creates a dynamic class assigns it and removed the property. This is so that we don't lose","    * the fontFamily when selecting nodes.","    * @static","    * @method filter","    */","    Y.EditorSelection.filter = function(blocks) {","        var startTime = (new Date()).getTime();","","        var nodes = Y.all(Y.EditorSelection.ALL),","            baseNodes = Y.all('strong,em'),","            doc = Y.config.doc, hrs,","            classNames = {}, cssString = '',","            ls;","","        var startTime1 = (new Date()).getTime();","        nodes.each(function(n) {","            var raw = Y.Node.getDOMNode(n);","            if (raw.style[FONT_FAMILY]) {","                classNames['.' + n._yuid] = raw.style[FONT_FAMILY];","                n.addClass(n._yuid);","","                Y.EditorSelection.removeFontFamily(raw);","            }","            /*","            if (n.getStyle(FONT_FAMILY)) {","                classNames['.' + n._yuid] = n.getStyle(FONT_FAMILY);","                n.addClass(n._yuid);","                n.removeAttribute('face');","                n.setStyle(FONT_FAMILY, '');","                if (n.getAttribute('style') === '') {","                    n.removeAttribute('style');","                }","                //This is for IE","                if (n.getAttribute('style').toLowerCase() === 'font-family: ') {","                    n.removeAttribute('style');","                }","            }","            */","        });","        var endTime1 = (new Date()).getTime();","","        Y.all('.hr').addClass('yui-skip').addClass('yui-non');","        ","        if (Y.UA.ie) {","            hrs = doc.getElementsByTagName('hr');","            Y.each(hrs, function(hr) {","                var el = doc.createElement('div');","                    el.className = 'hr yui-non yui-skip';","                    ","                    el.setAttribute('readonly', true);","                    el.setAttribute('contenteditable', false); //Keep it from being Edited","                    if (hr.parentNode) {","                        hr.parentNode.replaceChild(el, hr);","                    }","                    //Had to move to inline style. writes for ie's < 8. They don't render el.setAttribute('style');","                    var s = el.style;","                    s.border = '1px solid #ccc';","                    s.lineHeight = '0';","                    s.height = '0';","                    s.fontSize = '0';","                    s.marginTop = '5px';","                    s.marginBottom = '5px';","                    s.marginLeft = '0px';","                    s.marginRight = '0px';","                    s.padding = '0';","            });","        }","        ","","        Y.each(classNames, function(v, k) {","            cssString += k + ' { font-family: ' + v.replace(/\"/gi, '') + '; }';","        });","        Y.StyleSheet(cssString, 'editor');","","        ","        //Not sure about this one?","        baseNodes.each(function(n, k) {","            var t = n.get('tagName').toLowerCase(),","                newTag = 'i';","            if (t === 'strong') {","                newTag = 'b';","            }","            Y.EditorSelection.prototype._swap(baseNodes.item(k), newTag);","        });","","        //Filter out all the empty UL/OL's","        ls = Y.all('ol,ul');","        ls.each(function(v, k) {","            var lis = v.all('li');","            if (!lis.size()) {","                v.remove();","            }","        });","        ","        if (blocks) {","            Y.EditorSelection.filterBlocks();","        }","        var endTime = (new Date()).getTime();","    };","","    /**","    * Method attempts to replace all \"orphined\" text nodes in the main body by wrapping them with a <p>. Called from filter.","    * @static","    * @method filterBlocks","    */","    Y.EditorSelection.filterBlocks = function() {","        var startTime = (new Date()).getTime();","        var childs = Y.config.doc.body.childNodes, i, node, wrapped = false, doit = true,","            sel, single, br, divs, spans, c, s;","","        if (childs) {","            for (i = 0; i < childs.length; i++) {","                node = Y.one(childs[i]);","                if (!node.test(Y.EditorSelection.BLOCKS)) {","                    doit = true;","                    if (childs[i].nodeType == 3) {","                        c = childs[i][textContent].match(Y.EditorSelection.REG_CHAR);","                        s = childs[i][textContent].match(Y.EditorSelection.REG_NON);","                        if (c === null && s) {","                            doit = false;","                            ","                        }","                    }","                    if (doit) {","                        if (!wrapped) {","                            wrapped = [];","                        }","                        wrapped.push(childs[i]);","                    }","                } else {","                    wrapped = Y.EditorSelection._wrapBlock(wrapped);","                }","            }","            wrapped = Y.EditorSelection._wrapBlock(wrapped);","        }","","        single = Y.all(Y.EditorSelection.DEFAULT_BLOCK_TAG);","        if (single.size() === 1) {","            br = single.item(0).all('br');","            if (br.size() === 1) {","                if (!br.item(0).test('.yui-cursor')) {","                    br.item(0).remove();","                }","                var html = single.item(0).get('innerHTML');","                if (html === '' || html === ' ') {","                    single.set('innerHTML', Y.EditorSelection.CURSOR);","                    sel = new Y.EditorSelection();","                    sel.focusCursor(true, true);","                }","                if (br.item(0).test('.yui-cursor') && Y.UA.ie) {","                    br.item(0).remove();","                }","            }","        } else {","            single.each(function(p) {","                var html = p.get('innerHTML');","                if (html === '') {","                    p.remove();","                }","            });","        }","        ","        if (!Y.UA.ie) {","            /*","            divs = Y.all('div, p');","            divs.each(function(d) {","                if (d.hasClass('yui-non')) {","                    return;","                }","                var html = d.get('innerHTML');","                if (html === '') {","                    d.remove();","                } else {","                    if (d.get('childNodes').size() == 1) {","                        if (d.ancestor('p')) {","                            d.replace(d.get('firstChild'));","                        }","                    }","                }","            });*/","","            /* Removed this, as it was causing Pasting to be funky in Safari","            spans = Y.all('.Apple-style-span, .apple-style-span');","            spans.each(function(s) {","                s.setAttribute('style', '');","            });","            */","        }","","","        var endTime = (new Date()).getTime();","    };","","    /**","    * Regular Expression used to find dead font-family styles","    * @static","    * @property REG_FONTFAMILY","    */   ","    Y.EditorSelection.REG_FONTFAMILY = /font-family: ;/;","","    /**","    * Regular Expression to determine if a string has a character in it","    * @static","    * @property REG_CHAR","    */   ","    Y.EditorSelection.REG_CHAR = /[a-zA-Z-0-9_!@#\\$%\\^&*\\(\\)-=_+\\[\\]\\\\{}|;':\",.\\/<>\\?]/gi;","","    /**","    * Regular Expression to determine if a string has a non-character in it","    * @static","    * @property REG_NON","    */","    Y.EditorSelection.REG_NON = /[\\s|\\n|\\t]/gi;","","    /**","    * Regular Expression to remove all HTML from a string","    * @static","    * @property REG_NOHTML","    */","    Y.EditorSelection.REG_NOHTML = /<\\S[^><]*>/g;","","","    /**","    * Wraps an array of elements in a Block level tag","    * @static","    * @private","    * @method _wrapBlock","    */","    Y.EditorSelection._wrapBlock = function(wrapped) {","        if (wrapped) {","            var newChild = Y.Node.create('<' + Y.EditorSelection.DEFAULT_BLOCK_TAG + '></' + Y.EditorSelection.DEFAULT_BLOCK_TAG + '>'),","                firstChild = Y.one(wrapped[0]), i;","","            for (i = 1; i < wrapped.length; i++) {","                newChild.append(wrapped[i]);","            }","            firstChild.replace(newChild);","            newChild.prepend(firstChild);","        }","        return false;","    };","","    /**","    * Undoes what filter does enough to return the HTML from the Editor, then re-applies the filter.","    * @static","    * @method unfilter","    * @return {String} The filtered HTML","    */","    Y.EditorSelection.unfilter = function() {","        var nodes = Y.all('body [class]'),","            html = '', nons, ids,","            body = Y.one('body');","        ","        ","        nodes.each(function(n) {","            if (n.hasClass(n._yuid)) {","                //One of ours","                n.setStyle(FONT_FAMILY, n.getStyle(FONT_FAMILY));","                n.removeClass(n._yuid);","                if (n.getAttribute('class') === '') {","                    n.removeAttribute('class');","                }","            }","        });","","        nons = Y.all('.yui-non');","        nons.each(function(n) {","            if (!n.hasClass('yui-skip') && n.get('innerHTML') === '') {","                n.remove();","            } else {","                n.removeClass('yui-non').removeClass('yui-skip');","            }","        });","","        ids = Y.all('body [id]');","        ids.each(function(n) {","            if (n.get('id').indexOf('yui_3_') === 0) {","                n.removeAttribute('id');","                n.removeAttribute('_yuid');","            }","        });","        ","        if (body) {","            html = body.get('innerHTML');","        }","        ","        Y.all('.hr').addClass('yui-skip').addClass('yui-non');","        ","        /*","        nodes.each(function(n) {","            n.addClass(n._yuid);","            n.setStyle(FONT_FAMILY, '');","            if (n.getAttribute('style') === '') {","                n.removeAttribute('style');","            }","        });","        */","        ","        return html;","    };","    /**","    * Resolve a node from the selection object and return a Node instance","    * @static","    * @method resolve","    * @param {HTMLElement} n The HTMLElement to resolve. Might be a TextNode, gives parentNode.","    * @return {Node} The Resolved node","    */","    Y.EditorSelection.resolve = function(n) {","        if (n && n.nodeType === 3) {","            //Adding a try/catch here because in rare occasions IE will","            //Throw a error accessing the parentNode of a stranded text node.","            //In the case of Ctrl+Z (Undo)","            try {","                n = n.parentNode;","            } catch (re) {","                n = 'body';","            }","        }","        return Y.one(n);","    };","","    /**","    * Returns the innerHTML of a node with all HTML tags removed.","    * @static","    * @method getText","    * @param {Node} node The Node instance to remove the HTML from","    * @return {String} The string of text","    */","    Y.EditorSelection.getText = function(node) {","        var txt = node.get('innerHTML').replace(Y.EditorSelection.REG_NOHTML, '');","        //Clean out the cursor subs to see if the Node is empty","        txt = txt.replace('<span><br></span>', '').replace('<br>', '');","        return txt;","    };","","    //Y.EditorSelection.DEFAULT_BLOCK_TAG = 'div';","    Y.EditorSelection.DEFAULT_BLOCK_TAG = 'p';","","    /**","    * The selector to use when looking for Nodes to cache the value of: [style],font[face]","    * @static","    * @property ALL","    */","    Y.EditorSelection.ALL = '[style],font[face]';","","    /**","    * The selector to use when looking for block level items.","    * @static","    * @property BLOCKS","    */","    Y.EditorSelection.BLOCKS = 'p,div,ul,ol,table,style';","    /**","    * The temporary fontname applied to a selection to retrieve their values: yui-tmp","    * @static","    * @property TMP","    */","    Y.EditorSelection.TMP = 'yui-tmp';","    /**","    * The default tag to use when creating elements: span","    * @static","    * @property DEFAULT_TAG","    */","    Y.EditorSelection.DEFAULT_TAG = 'span';","","    /**","    * The id of the outer cursor wrapper","    * @static","    * @property DEFAULT_TAG","    */","    Y.EditorSelection.CURID = 'yui-cursor';","","    /**","    * The id used to wrap the inner space of the cursor position","    * @static","    * @property CUR_WRAPID","    */","    Y.EditorSelection.CUR_WRAPID = 'yui-cursor-wrapper';","","    /**","    * The default HTML used to focus the cursor..","    * @static","    * @property CURSOR","    */","    Y.EditorSelection.CURSOR = '<span><br class=\"yui-cursor\"></span>';","","    Y.EditorSelection.hasCursor = function() {","        var cur = Y.all('#' + Y.EditorSelection.CUR_WRAPID);","        return cur.size();","    };","","    /**","    * Called from Editor keydown to remove the \"extra\" space before the cursor.","    * @static","    * @method cleanCursor","    */","    Y.EditorSelection.cleanCursor = function() {","        var cur, sel = 'br.yui-cursor';","        cur = Y.all(sel);","        if (cur.size()) {","            cur.each(function(b) {","                var c = b.get('parentNode.parentNode.childNodes'), html;","                if (c.size()) {","                    b.remove();","                } else {","                    html = Y.EditorSelection.getText(c.item(0));","                    if (html !== '') {","                        b.remove();","                    }","                }","            });","        }","        /*","        var cur = Y.all('#' + Y.EditorSelection.CUR_WRAPID);","        if (cur.size()) {","            cur.each(function(c) {","                var html = c.get('innerHTML');","                if (html == '&nbsp;' || html == '<br>') {","                    if (c.previous() || c.next()) {","                        c.remove();","                    }","                }","            });","        }","        */","    };","","    Y.EditorSelection.prototype = {","        /**","        * Range text value","        * @property text","        * @type String","        */","        text: null,","        /**","        * Flag to show if the range is collapsed or not","        * @property isCollapsed","        * @type Boolean","        */","        isCollapsed: null,","        /**","        * A Node instance of the parentNode of the anchorNode of the range","        * @property anchorNode","        * @type Node","        */","        anchorNode: null,","        /**","        * The offset from the range object","        * @property anchorOffset","        * @type Number","        */","        anchorOffset: null,","        /**","        * A Node instance of the actual textNode of the range.","        * @property anchorTextNode","        * @type Node","        */","        anchorTextNode: null,","        /**","        * A Node instance of the parentNode of the focusNode of the range","        * @property focusNode","        * @type Node","        */","        focusNode: null,","        /**","        * The offset from the range object","        * @property focusOffset","        * @type Number","        */","        focusOffset: null,","        /**","        * A Node instance of the actual textNode of the range.","        * @property focusTextNode","        * @type Node","        */","        focusTextNode: null,","        /**","        * The actual Selection/Range object","        * @property _selection","        * @private","        */","        _selection: null,","        /**","        * Wrap an element, with another element ","        * @private","        * @method _wrap","        * @param {HTMLElement} n The node to wrap ","        * @param {String} tag The tag to use when creating the new element.","        * @return {HTMLElement} The wrapped node","        */","        _wrap: function(n, tag) {","            var tmp = Y.Node.create('<' + tag + '></' + tag + '>');","            tmp.set(INNER_HTML, n.get(INNER_HTML));","            n.set(INNER_HTML, '');","            n.append(tmp);","            return Y.Node.getDOMNode(tmp);","        },","        /**","        * Swap an element, with another element ","        * @private","        * @method _swap","        * @param {HTMLElement} n The node to swap ","        * @param {String} tag The tag to use when creating the new element.","        * @return {HTMLElement} The new node","        */","        _swap: function(n, tag) {","            var tmp = Y.Node.create('<' + tag + '></' + tag + '>');","            tmp.set(INNER_HTML, n.get(INNER_HTML));","            n.replace(tmp, n);","            return Y.Node.getDOMNode(tmp);","        },","        /**","        * Get all the nodes in the current selection. This method will actually perform a filter first.","        * Then it calls doc.execCommand('fontname', null, 'yui-tmp') to touch all nodes in the selection.","        * The it compiles a list of all nodes affected by the execCommand and builds a NodeList to return.","        * @method getSelected","        * @return {NodeList} A NodeList of all items in the selection.","        */","        getSelected: function() {","            Y.EditorSelection.filter();","            Y.config.doc.execCommand('fontname', null, Y.EditorSelection.TMP);","            var nodes = Y.all(Y.EditorSelection.ALL),","                items = [];","            ","            nodes.each(function(n, k) {","                if (n.getStyle(FONT_FAMILY) ==  Y.EditorSelection.TMP) {","                    n.setStyle(FONT_FAMILY, '');","                    Y.EditorSelection.removeFontFamily(n);","                    if (!n.test('body')) {","                        items.push(Y.Node.getDOMNode(nodes.item(k)));","                    }","                }","            });","            return Y.all(items);","        },","        /**","        * Insert HTML at the current cursor position and return a Node instance of the newly inserted element.","        * @method insertContent","        * @param {String} html The HTML to insert.","        * @return {Node} The inserted Node.","        */","        insertContent: function(html) {","            return this.insertAtCursor(html, this.anchorTextNode, this.anchorOffset, true);","        },","        /**","        * Insert HTML at the current cursor position, this method gives you control over the text node to insert into and the offset where to put it.","        * @method insertAtCursor","        * @param {String} html The HTML to insert.","        * @param {Node} node The text node to break when inserting.","        * @param {Number} offset The left offset of the text node to break and insert the new content.","        * @param {Boolean} collapse Should the range be collapsed after insertion. default: false","        * @return {Node} The inserted Node.","        */","        insertAtCursor: function(html, node, offset, collapse) {","            var cur = Y.Node.create('<' + Y.EditorSelection.DEFAULT_TAG + ' class=\"yui-non\"></' + Y.EditorSelection.DEFAULT_TAG + '>'),","                inHTML, txt, txt2, newNode, range = this.createRange(), b;","","            if (node && node.test('body')) {","                b = Y.Node.create('<span></span>');","                node.append(b);","                node = b;","            }","","            ","            if (range.pasteHTML) {","                if (offset === 0 && node && !node.previous() && node.get('nodeType') === 3) {","                    /*","                    * For some strange reason, range.pasteHTML fails if the node is a textNode and","                    * the offset is 0. (The cursor is at the beginning of the line)","                    * It will always insert the new content at position 1 instead of ","                    * position 0. Here we test for that case and do it the hard way.","                    */","                    node.insert(html, 'before');","                    if (range.moveToElementText) {","                        range.moveToElementText(Y.Node.getDOMNode(node.previous()));","                    }","                    //Move the cursor after the new node","                    range.collapse(false);","                    range.select();","                    return node.previous();","                } else {","                    newNode = Y.Node.create(html);","                    try {","                        range.pasteHTML('<span id=\"rte-insert\"></span>');","                    } catch (e) {}","                    inHTML = Y.one('#rte-insert');","                    if (inHTML) {","                        inHTML.set('id', '');","                        inHTML.replace(newNode);","                        if (range.moveToElementText) {","                            range.moveToElementText(Y.Node.getDOMNode(newNode));","                        }","                        range.collapse(false);","                        range.select();","                        return newNode;","                    } else {","                        Y.on('available', function() {","                            inHTML.set('id', '');","                            inHTML.replace(newNode);","                            if (range.moveToElementText) {","                                range.moveToElementText(Y.Node.getDOMNode(newNode));","                            }","                            range.collapse(false);","                            range.select();","                        }, '#rte-insert');","                    }","                }","            } else {","                //TODO using Y.Node.create here throws warnings & strips first white space character","                //txt = Y.one(Y.Node.create(inHTML.substr(0, offset)));","                //txt2 = Y.one(Y.Node.create(inHTML.substr(offset)));","                if (offset > 0) {","                    inHTML = node.get(textContent);","","                    txt = Y.one(Y.config.doc.createTextNode(inHTML.substr(0, offset)));","                    txt2 = Y.one(Y.config.doc.createTextNode(inHTML.substr(offset)));","","                    node.replace(txt, node);","                    newNode = Y.Node.create(html);","                    if (newNode.get('nodeType') === 11) {","                        b = Y.Node.create('<span></span>');","                        b.append(newNode);","                        newNode = b;","                    }","                    txt.insert(newNode, 'after');","                    //if (txt2 && txt2.get('length')) {","                    if (txt2) {","                        newNode.insert(cur, 'after');","                        cur.insert(txt2, 'after');","                        this.selectNode(cur, collapse);","                    }","                } else {","                    if (node.get('nodeType') === 3) {","                        node = node.get('parentNode');","                    }","                    newNode = Y.Node.create(html);","                    html = node.get('innerHTML').replace(/\\n/gi, '');","                    if (html === '' || html === '<br>') {","                        node.append(newNode);","                    } else {","                        if (newNode.get('parentNode')) {","                            node.insert(newNode, 'before');","                        } else {","                            Y.one('body').prepend(newNode);","                        }","                    }","                    if (node.get('firstChild').test('br')) {","                        node.get('firstChild').remove();","                    }","                }","            }","            return newNode;","        },","        /**","        * Get all elements inside a selection and wrap them with a new element and return a NodeList of all elements touched.","        * @method wrapContent","        * @param {String} tag The tag to wrap all selected items with.","        * @return {NodeList} A NodeList of all items in the selection.","        */","        wrapContent: function(tag) {","            tag = (tag) ? tag : Y.EditorSelection.DEFAULT_TAG;","","            if (!this.isCollapsed) {","                var items = this.getSelected(),","                    changed = [], range, last, first, range2;","","                items.each(function(n, k) {","                    var t = n.get('tagName').toLowerCase();","                    if (t === 'font') {","                        changed.push(this._swap(items.item(k), tag));","                    } else {","                        changed.push(this._wrap(items.item(k), tag));","                    }","                }, this);","                ","		        range = this.createRange();","                first = changed[0];","                last = changed[changed.length - 1];","                if (this._selection.removeAllRanges) {","                    range.setStart(changed[0], 0);","                    range.setEnd(last, last.childNodes.length);","                    this._selection.removeAllRanges();","                    this._selection.addRange(range);","                } else {","                    if (range.moveToElementText) {","                        range.moveToElementText(Y.Node.getDOMNode(first));","                        range2 = this.createRange();","                        range2.moveToElementText(Y.Node.getDOMNode(last));","                        range.setEndPoint('EndToEnd', range2);","                    }","                    range.select();","                }","","                changed = Y.all(changed);","                return changed;","","","            } else {","                return Y.all([]);","            }","        },","        /**","        * Find and replace a string inside a text node and replace it with HTML focusing the node after ","        * to allow you to continue to type.","        * @method replace","        * @param {String} se The string to search for.","        * @param {String} re The string of HTML to replace it with.","        * @return {Node} The node inserted.","        */","        replace: function(se,re) {","            var range = this.createRange(), node, txt, index, newNode;","","            if (range.getBookmark) {","                index = range.getBookmark();","                txt = this.anchorNode.get('innerHTML').replace(se, re);","                this.anchorNode.set('innerHTML', txt);","                range.moveToBookmark(index);","                newNode = Y.one(range.parentElement());","            } else {","                node = this.anchorTextNode;","                txt = node.get(textContent);","                index = txt.indexOf(se);","","                txt = txt.replace(se, '');","                node.set(textContent, txt);","                newNode = this.insertAtCursor(re, node, index, true);","            }","            return newNode;","        },","        /**","        * Destroy the range.","        * @method remove","        * @chainable","        * @return {EditorSelection}","        */","        remove: function() {","            if (this._selection && this._selection.removeAllRanges) {","                this._selection.removeAllRanges();","            }","            return this;","        },","        /**","        * Wrapper for the different range creation methods.","        * @method createRange","        * @return {RangeObject}","        */","        createRange: function() {","            if (Y.config.doc.selection) {","                return Y.config.doc.selection.createRange();","            } else {","		        return Y.config.doc.createRange();","            }","        },","        /**","        * Select a Node (hilighting it).","        * @method selectNode","        * @param {Node} node The node to select","        * @param {Boolean} collapse Should the range be collapsed after insertion. default: false","        * @chainable","        * @return {EditorSelection}","        */","        selectNode: function(node, collapse, end) {","            if (!node) {","                return;","            }","            end = end || 0;","            node = Y.Node.getDOMNode(node);","		    var range = this.createRange();","            if (range.selectNode) {","                range.selectNode(node);","                this._selection.removeAllRanges();","                this._selection.addRange(range);","                if (collapse) {","                    try {","                        this._selection.collapse(node, end);","                    } catch (err) {","                        this._selection.collapse(node, 0);","                    }","                }","            } else {","                if (node.nodeType === 3) {","                    node = node.parentNode;","                }","                try {","                    range.moveToElementText(node);","                } catch(e) {}","                if (collapse) {","                    range.collapse(((end) ? false : true));","                }","                range.select();","            }","            return this;","        },","        /**","        * Put a placeholder in the DOM at the current cursor position.","        * @method setCursor","        * @return {Node}","        */","        setCursor: function() {","            this.removeCursor(false);","            return this.insertContent(Y.EditorSelection.CURSOR);","        },","        /**","        * Get the placeholder in the DOM at the current cursor position.","        * @method getCursor","        * @return {Node}","        */","        getCursor: function() {","            return Y.all('#' + Y.EditorSelection.CURID);","        },","        /**","        * Remove the cursor placeholder from the DOM.","        * @method removeCursor","        * @param {Boolean} keep Setting this to true will keep the node, but remove the unique parts that make it the cursor.","        * @return {Node}","        */","        removeCursor: function(keep) {","            var cur = this.getCursor();","            if (cur) {","                if (keep) {","                    cur.removeAttribute('id');","                    cur.set('innerHTML', '<br class=\"yui-cursor\">');","                } else {","                    cur.remove();","                }","            }","            return cur;","        },","        /**","        * Gets a stored cursor and focuses it for editing, must be called sometime after setCursor","        * @method focusCursor","        * @return {Node}","        */","        focusCursor: function(collapse, end) {","            if (collapse !== false) {","                collapse = true;","            }","            if (end !== false) {","                end = true;","            }","            var cur = this.removeCursor(true);","            if (cur) {","                cur.each(function(c) {","                    this.selectNode(c, collapse, end);","                }, this);","            }","        },","        /**","        * Generic toString for logging.","        * @method toString","        * @return {String}","        */","        toString: function() {","            return 'EditorSelection Object';","        }","    };","","    //TODO Remove this alias in 3.6.0","    Y.Selection = Y.EditorSelection;","","","","}, '@VERSION@', {\"requires\": [\"node\"]});"];
_yuitest_coverage["editor-selection"].lines = {"1":0,"12":0,"16":0,"17":0,"20":0,"21":0,"23":0,"24":0,"25":0,"26":0,"28":0,"30":0,"31":0,"34":0,"35":0,"36":0,"37":0,"39":0,"40":0,"42":0,"43":0,"44":0,"45":0,"47":0,"50":0,"51":0,"52":0,"58":0,"60":0,"61":0,"62":0,"63":0,"65":0,"66":0,"67":0,"71":0,"73":0,"74":0,"76":0,"79":0,"82":0,"84":0,"90":0,"91":0,"92":0,"93":0,"94":0,"95":0,"96":0,"97":0,"105":0,"106":0,"107":0,"108":0,"109":0,"111":0,"112":0,"114":0,"115":0,"117":0,"118":0,"120":0,"130":0,"131":0,"132":0,"133":0,"134":0,"136":0,"137":0,"138":0,"149":0,"150":0,"152":0,"158":0,"159":0,"160":0,"161":0,"162":0,"163":0,"165":0,"183":0,"185":0,"187":0,"188":0,"189":0,"190":0,"191":0,"193":0,"194":0,"195":0,"196":0,"199":0,"200":0,"201":0,"202":0,"203":0,"204":0,"205":0,"206":0,"207":0,"208":0,"213":0,"214":0,"216":0,"220":0,"221":0,"223":0,"224":0,"226":0,"230":0,"231":0,"232":0,"233":0,"234":0,"238":0,"239":0,"241":0,"249":0,"250":0,"251":0,"254":0,"255":0,"256":0,"257":0,"258":0,"259":0,"260":0,"261":0,"262":0,"263":0,"267":0,"268":0,"269":0,"271":0,"274":0,"277":0,"280":0,"281":0,"282":0,"283":0,"284":0,"285":0,"287":0,"288":0,"289":0,"290":0,"291":0,"293":0,"294":0,"298":0,"299":0,"300":0,"301":0,"306":0,"334":0,"342":0,"349":0,"356":0,"363":0,"372":0,"373":0,"374":0,"377":0,"378":0,"380":0,"381":0,"383":0,"392":0,"393":0,"398":0,"399":0,"401":0,"402":0,"403":0,"404":0,"409":0,"410":0,"411":0,"412":0,"414":0,"418":0,"419":0,"420":0,"421":0,"422":0,"426":0,"427":0,"430":0,"442":0,"451":0,"452":0,"456":0,"457":0,"459":0,"462":0,"472":0,"473":0,"475":0,"476":0,"480":0,"487":0,"494":0,"500":0,"506":0,"513":0,"520":0,"527":0,"529":0,"530":0,"531":0,"539":0,"540":0,"541":0,"542":0,"543":0,"544":0,"545":0,"546":0,"548":0,"549":0,"550":0,"570":0,"634":0,"635":0,"636":0,"637":0,"638":0,"649":0,"650":0,"651":0,"652":0,"662":0,"663":0,"664":0,"667":0,"668":0,"669":0,"670":0,"671":0,"672":0,"676":0,"685":0,"697":0,"700":0,"701":0,"702":0,"703":0,"707":0,"708":0,"715":0,"716":0,"717":0,"720":0,"721":0,"722":0,"724":0,"725":0,"726":0,"728":0,"729":0,"730":0,"731":0,"732":0,"733":0,"735":0,"736":0,"737":0,"739":0,"740":0,"741":0,"742":0,"743":0,"745":0,"746":0,"754":0,"755":0,"757":0,"758":0,"760":0,"761":0,"762":0,"763":0,"764":0,"765":0,"767":0,"769":0,"770":0,"771":0,"772":0,"775":0,"776":0,"778":0,"779":0,"780":0,"781":0,"783":0,"784":0,"786":0,"789":0,"790":0,"794":0,"803":0,"805":0,"806":0,"809":0,"810":0,"811":0,"812":0,"814":0,"818":0,"819":0,"820":0,"821":0,"822":0,"823":0,"824":0,"825":0,"827":0,"828":0,"829":0,"830":0,"831":0,"833":0,"836":0,"837":0,"841":0,"853":0,"855":0,"856":0,"857":0,"858":0,"859":0,"860":0,"862":0,"863":0,"864":0,"866":0,"867":0,"868":0,"870":0,"879":0,"880":0,"882":0,"890":0,"891":0,"893":0,"905":0,"906":0,"908":0,"909":0,"910":0,"911":0,"912":0,"913":0,"914":0,"915":0,"916":0,"917":0,"919":0,"923":0,"924":0,"926":0,"927":0,"929":0,"930":0,"932":0,"934":0,"942":0,"943":0,"951":0,"960":0,"961":0,"962":0,"963":0,"964":0,"966":0,"969":0,"977":0,"978":0,"980":0,"981":0,"983":0,"984":0,"985":0,"986":0,"996":0,"1001":0};
_yuitest_coverage["editor-selection"].functions = {"EditorSelection:20":0,"removeFontFamily:130":0,"(anonymous 2):159":0,"(anonymous 3):189":0,"(anonymous 4):213":0,"(anonymous 5):220":0,"(anonymous 6):231":0,"filter:149":0,"(anonymous 7):298":0,"filterBlocks:249":0,"_wrapBlock:372":0,"(anonymous 8):398":0,"(anonymous 9):410":0,"(anonymous 10):419":0,"unfilter:392":0,"resolve:451":0,"getText:472":0,"hasCursor:529":0,"(anonymous 11):543":0,"cleanCursor:539":0,"_wrap:633":0,"_swap:648":0,"(anonymous 12):667":0,"getSelected:661":0,"insertContent:684":0,"(anonymous 13):739":0,"insertAtCursor:696":0,"(anonymous 14):809":0,"wrapContent:802":0,"replace:852":0,"remove:878":0,"createRange:889":0,"selectNode:904":0,"setCursor:941":0,"getCursor:950":0,"removeCursor:959":0,"(anonymous 15):985":0,"focusCursor:976":0,"toString:995":0,"(anonymous 1):1":0};
_yuitest_coverage["editor-selection"].coveredLines = 387;
_yuitest_coverage["editor-selection"].coveredFunctions = 40;
_yuitest_coverline("editor-selection", 1);
YUI.add('editor-selection', function (Y, NAME) {

    /**
     * Wraps some common Selection/Range functionality into a simple object
     * @class EditorSelection
     * @constructor
     * @module editor
     * @submodule selection
     */
    
    //TODO This shouldn't be there, Y.Node doesn't normalize getting textnode content.
    _yuitest_coverfunc("editor-selection", "(anonymous 1)", 1);
_yuitest_coverline("editor-selection", 12);
var textContent = 'textContent',
    INNER_HTML = 'innerHTML',
    FONT_FAMILY = 'fontFamily';

    _yuitest_coverline("editor-selection", 16);
if (Y.UA.ie) {
        _yuitest_coverline("editor-selection", 17);
textContent = 'nodeValue';
    }

    _yuitest_coverline("editor-selection", 20);
Y.EditorSelection = function(domEvent) {
        _yuitest_coverfunc("editor-selection", "EditorSelection", 20);
_yuitest_coverline("editor-selection", 21);
var sel, par, ieNode, nodes, rng, i;

        _yuitest_coverline("editor-selection", 23);
if (Y.config.win.getSelection && (!Y.UA.ie || Y.UA.ie < 9)) {
	        _yuitest_coverline("editor-selection", 24);
sel = Y.config.win.getSelection();
        } else {_yuitest_coverline("editor-selection", 25);
if (Y.config.doc.selection) {
    	    _yuitest_coverline("editor-selection", 26);
sel = Y.config.doc.selection.createRange();
        }}
        _yuitest_coverline("editor-selection", 28);
this._selection = sel;

        _yuitest_coverline("editor-selection", 30);
if (!sel) {
            _yuitest_coverline("editor-selection", 31);
return false;
        }

        _yuitest_coverline("editor-selection", 34);
if (sel.pasteHTML) {
            _yuitest_coverline("editor-selection", 35);
this.isCollapsed = (sel.compareEndPoints('StartToEnd', sel)) ? false : true;
            _yuitest_coverline("editor-selection", 36);
if (this.isCollapsed) {
                _yuitest_coverline("editor-selection", 37);
this.anchorNode = this.focusNode = Y.one(sel.parentElement());

                _yuitest_coverline("editor-selection", 39);
if (domEvent) {
                    _yuitest_coverline("editor-selection", 40);
ieNode = Y.config.doc.elementFromPoint(domEvent.clientX, domEvent.clientY);
                }
                _yuitest_coverline("editor-selection", 42);
rng = sel.duplicate();
                _yuitest_coverline("editor-selection", 43);
if (!ieNode) {
                    _yuitest_coverline("editor-selection", 44);
par = sel.parentElement();
                    _yuitest_coverline("editor-selection", 45);
nodes = par.childNodes;

                    _yuitest_coverline("editor-selection", 47);
for (i = 0; i < nodes.length; i++) {
                        //This causes IE to not allow a selection on a doubleclick
                        //rng.select(nodes[i]);
                        _yuitest_coverline("editor-selection", 50);
if (rng.inRange(sel)) {
                            _yuitest_coverline("editor-selection", 51);
if (!ieNode) {
                                _yuitest_coverline("editor-selection", 52);
ieNode = nodes[i];
                            }
                        }
                    }
                }

                _yuitest_coverline("editor-selection", 58);
this.ieNode = ieNode;
                
                _yuitest_coverline("editor-selection", 60);
if (ieNode) {
                    _yuitest_coverline("editor-selection", 61);
if (ieNode.nodeType !== 3) {
                        _yuitest_coverline("editor-selection", 62);
if (ieNode.firstChild) {
                            _yuitest_coverline("editor-selection", 63);
ieNode = ieNode.firstChild;
                        }
                        _yuitest_coverline("editor-selection", 65);
if (ieNode && ieNode.tagName && ieNode.tagName.toLowerCase() === 'body') {
                            _yuitest_coverline("editor-selection", 66);
if (ieNode.firstChild) {
                                _yuitest_coverline("editor-selection", 67);
ieNode = ieNode.firstChild;
                            }
                        }
                    }
                    _yuitest_coverline("editor-selection", 71);
this.anchorNode = this.focusNode = Y.EditorSelection.resolve(ieNode);
                    
                    _yuitest_coverline("editor-selection", 73);
rng.moveToElementText(sel.parentElement());
                    _yuitest_coverline("editor-selection", 74);
var comp = sel.compareEndPoints('StartToStart', rng),
                    moved = 0;
                    _yuitest_coverline("editor-selection", 76);
if (comp) {
                        //We are not at the beginning of the selection.
                        //Setting the move to something large, may need to increase it later
                        _yuitest_coverline("editor-selection", 79);
moved = Math.abs(sel.move('character', -9999));
                    }
                    
                    _yuitest_coverline("editor-selection", 82);
this.anchorOffset = this.focusOffset = moved;
                    
                    _yuitest_coverline("editor-selection", 84);
this.anchorTextNode = this.focusTextNode = Y.one(ieNode);
                }
                
                
            } else {
                //This helps IE deal with a selection and nodeChange events
                _yuitest_coverline("editor-selection", 90);
if (sel.htmlText && sel.htmlText !== '') {
                    _yuitest_coverline("editor-selection", 91);
var n = Y.Node.create(sel.htmlText);
                    _yuitest_coverline("editor-selection", 92);
if (n && n.get('id')) {
                        _yuitest_coverline("editor-selection", 93);
var id = n.get('id');
                        _yuitest_coverline("editor-selection", 94);
this.anchorNode = this.focusNode = Y.one('#' + id);
                    } else {_yuitest_coverline("editor-selection", 95);
if (n) {
                        _yuitest_coverline("editor-selection", 96);
n = n.get('childNodes');
                        _yuitest_coverline("editor-selection", 97);
this.anchorNode = this.focusNode = n.item(0);
                    }}
                }
            }

            //var self = this;
            //debugger;
        } else {
            _yuitest_coverline("editor-selection", 105);
this.isCollapsed = sel.isCollapsed;
            _yuitest_coverline("editor-selection", 106);
this.anchorNode = Y.EditorSelection.resolve(sel.anchorNode);
            _yuitest_coverline("editor-selection", 107);
this.focusNode = Y.EditorSelection.resolve(sel.focusNode);
            _yuitest_coverline("editor-selection", 108);
this.anchorOffset = sel.anchorOffset;
            _yuitest_coverline("editor-selection", 109);
this.focusOffset = sel.focusOffset;
            
            _yuitest_coverline("editor-selection", 111);
this.anchorTextNode = Y.one(sel.anchorNode);
            _yuitest_coverline("editor-selection", 112);
this.focusTextNode = Y.one(sel.focusNode);
        }
        _yuitest_coverline("editor-selection", 114);
if (Y.Lang.isString(sel.text)) {
            _yuitest_coverline("editor-selection", 115);
this.text = sel.text;
        } else {
            _yuitest_coverline("editor-selection", 117);
if (sel.toString) {
                _yuitest_coverline("editor-selection", 118);
this.text = sel.toString();
            } else {
                _yuitest_coverline("editor-selection", 120);
this.text = '';
            }
        }
    };
    
    /**
    * Utility method to remove dead font-family styles from an element.
    * @static
    * @method removeFontFamily
    */
    _yuitest_coverline("editor-selection", 130);
Y.EditorSelection.removeFontFamily = function(n) {
        _yuitest_coverfunc("editor-selection", "removeFontFamily", 130);
_yuitest_coverline("editor-selection", 131);
n.removeAttribute('face');
        _yuitest_coverline("editor-selection", 132);
var s = n.getAttribute('style').toLowerCase();
        _yuitest_coverline("editor-selection", 133);
if (s === '' || (s == 'font-family: ')) {
            _yuitest_coverline("editor-selection", 134);
n.removeAttribute('style');
        }
        _yuitest_coverline("editor-selection", 136);
if (s.match(Y.EditorSelection.REG_FONTFAMILY)) {
            _yuitest_coverline("editor-selection", 137);
s = s.replace(Y.EditorSelection.REG_FONTFAMILY, '');
            _yuitest_coverline("editor-selection", 138);
n.setAttribute('style', s);
        }
    };

    /**
    * Performs a prefilter on all nodes in the editor. Looks for nodes with a style: fontFamily or font face
    * It then creates a dynamic class assigns it and removed the property. This is so that we don't lose
    * the fontFamily when selecting nodes.
    * @static
    * @method filter
    */
    _yuitest_coverline("editor-selection", 149);
Y.EditorSelection.filter = function(blocks) {
        _yuitest_coverfunc("editor-selection", "filter", 149);
_yuitest_coverline("editor-selection", 150);
var startTime = (new Date()).getTime();

        _yuitest_coverline("editor-selection", 152);
var nodes = Y.all(Y.EditorSelection.ALL),
            baseNodes = Y.all('strong,em'),
            doc = Y.config.doc, hrs,
            classNames = {}, cssString = '',
            ls;

        _yuitest_coverline("editor-selection", 158);
var startTime1 = (new Date()).getTime();
        _yuitest_coverline("editor-selection", 159);
nodes.each(function(n) {
            _yuitest_coverfunc("editor-selection", "(anonymous 2)", 159);
_yuitest_coverline("editor-selection", 160);
var raw = Y.Node.getDOMNode(n);
            _yuitest_coverline("editor-selection", 161);
if (raw.style[FONT_FAMILY]) {
                _yuitest_coverline("editor-selection", 162);
classNames['.' + n._yuid] = raw.style[FONT_FAMILY];
                _yuitest_coverline("editor-selection", 163);
n.addClass(n._yuid);

                _yuitest_coverline("editor-selection", 165);
Y.EditorSelection.removeFontFamily(raw);
            }
            /*
            if (n.getStyle(FONT_FAMILY)) {
                classNames['.' + n._yuid] = n.getStyle(FONT_FAMILY);
                n.addClass(n._yuid);
                n.removeAttribute('face');
                n.setStyle(FONT_FAMILY, '');
                if (n.getAttribute('style') === '') {
                    n.removeAttribute('style');
                }
                //This is for IE
                if (n.getAttribute('style').toLowerCase() === 'font-family: ') {
                    n.removeAttribute('style');
                }
            }
            */
        });
        _yuitest_coverline("editor-selection", 183);
var endTime1 = (new Date()).getTime();

        _yuitest_coverline("editor-selection", 185);
Y.all('.hr').addClass('yui-skip').addClass('yui-non');
        
        _yuitest_coverline("editor-selection", 187);
if (Y.UA.ie) {
            _yuitest_coverline("editor-selection", 188);
hrs = doc.getElementsByTagName('hr');
            _yuitest_coverline("editor-selection", 189);
Y.each(hrs, function(hr) {
                _yuitest_coverfunc("editor-selection", "(anonymous 3)", 189);
_yuitest_coverline("editor-selection", 190);
var el = doc.createElement('div');
                    _yuitest_coverline("editor-selection", 191);
el.className = 'hr yui-non yui-skip';
                    
                    _yuitest_coverline("editor-selection", 193);
el.setAttribute('readonly', true);
                    _yuitest_coverline("editor-selection", 194);
el.setAttribute('contenteditable', false); //Keep it from being Edited
                    _yuitest_coverline("editor-selection", 195);
if (hr.parentNode) {
                        _yuitest_coverline("editor-selection", 196);
hr.parentNode.replaceChild(el, hr);
                    }
                    //Had to move to inline style. writes for ie's < 8. They don't render el.setAttribute('style');
                    _yuitest_coverline("editor-selection", 199);
var s = el.style;
                    _yuitest_coverline("editor-selection", 200);
s.border = '1px solid #ccc';
                    _yuitest_coverline("editor-selection", 201);
s.lineHeight = '0';
                    _yuitest_coverline("editor-selection", 202);
s.height = '0';
                    _yuitest_coverline("editor-selection", 203);
s.fontSize = '0';
                    _yuitest_coverline("editor-selection", 204);
s.marginTop = '5px';
                    _yuitest_coverline("editor-selection", 205);
s.marginBottom = '5px';
                    _yuitest_coverline("editor-selection", 206);
s.marginLeft = '0px';
                    _yuitest_coverline("editor-selection", 207);
s.marginRight = '0px';
                    _yuitest_coverline("editor-selection", 208);
s.padding = '0';
            });
        }
        

        _yuitest_coverline("editor-selection", 213);
Y.each(classNames, function(v, k) {
            _yuitest_coverfunc("editor-selection", "(anonymous 4)", 213);
_yuitest_coverline("editor-selection", 214);
cssString += k + ' { font-family: ' + v.replace(/"/gi, '') + '; }';
        });
        _yuitest_coverline("editor-selection", 216);
Y.StyleSheet(cssString, 'editor');

        
        //Not sure about this one?
        _yuitest_coverline("editor-selection", 220);
baseNodes.each(function(n, k) {
            _yuitest_coverfunc("editor-selection", "(anonymous 5)", 220);
_yuitest_coverline("editor-selection", 221);
var t = n.get('tagName').toLowerCase(),
                newTag = 'i';
            _yuitest_coverline("editor-selection", 223);
if (t === 'strong') {
                _yuitest_coverline("editor-selection", 224);
newTag = 'b';
            }
            _yuitest_coverline("editor-selection", 226);
Y.EditorSelection.prototype._swap(baseNodes.item(k), newTag);
        });

        //Filter out all the empty UL/OL's
        _yuitest_coverline("editor-selection", 230);
ls = Y.all('ol,ul');
        _yuitest_coverline("editor-selection", 231);
ls.each(function(v, k) {
            _yuitest_coverfunc("editor-selection", "(anonymous 6)", 231);
_yuitest_coverline("editor-selection", 232);
var lis = v.all('li');
            _yuitest_coverline("editor-selection", 233);
if (!lis.size()) {
                _yuitest_coverline("editor-selection", 234);
v.remove();
            }
        });
        
        _yuitest_coverline("editor-selection", 238);
if (blocks) {
            _yuitest_coverline("editor-selection", 239);
Y.EditorSelection.filterBlocks();
        }
        _yuitest_coverline("editor-selection", 241);
var endTime = (new Date()).getTime();
    };

    /**
    * Method attempts to replace all "orphined" text nodes in the main body by wrapping them with a <p>. Called from filter.
    * @static
    * @method filterBlocks
    */
    _yuitest_coverline("editor-selection", 249);
Y.EditorSelection.filterBlocks = function() {
        _yuitest_coverfunc("editor-selection", "filterBlocks", 249);
_yuitest_coverline("editor-selection", 250);
var startTime = (new Date()).getTime();
        _yuitest_coverline("editor-selection", 251);
var childs = Y.config.doc.body.childNodes, i, node, wrapped = false, doit = true,
            sel, single, br, divs, spans, c, s;

        _yuitest_coverline("editor-selection", 254);
if (childs) {
            _yuitest_coverline("editor-selection", 255);
for (i = 0; i < childs.length; i++) {
                _yuitest_coverline("editor-selection", 256);
node = Y.one(childs[i]);
                _yuitest_coverline("editor-selection", 257);
if (!node.test(Y.EditorSelection.BLOCKS)) {
                    _yuitest_coverline("editor-selection", 258);
doit = true;
                    _yuitest_coverline("editor-selection", 259);
if (childs[i].nodeType == 3) {
                        _yuitest_coverline("editor-selection", 260);
c = childs[i][textContent].match(Y.EditorSelection.REG_CHAR);
                        _yuitest_coverline("editor-selection", 261);
s = childs[i][textContent].match(Y.EditorSelection.REG_NON);
                        _yuitest_coverline("editor-selection", 262);
if (c === null && s) {
                            _yuitest_coverline("editor-selection", 263);
doit = false;
                            
                        }
                    }
                    _yuitest_coverline("editor-selection", 267);
if (doit) {
                        _yuitest_coverline("editor-selection", 268);
if (!wrapped) {
                            _yuitest_coverline("editor-selection", 269);
wrapped = [];
                        }
                        _yuitest_coverline("editor-selection", 271);
wrapped.push(childs[i]);
                    }
                } else {
                    _yuitest_coverline("editor-selection", 274);
wrapped = Y.EditorSelection._wrapBlock(wrapped);
                }
            }
            _yuitest_coverline("editor-selection", 277);
wrapped = Y.EditorSelection._wrapBlock(wrapped);
        }

        _yuitest_coverline("editor-selection", 280);
single = Y.all(Y.EditorSelection.DEFAULT_BLOCK_TAG);
        _yuitest_coverline("editor-selection", 281);
if (single.size() === 1) {
            _yuitest_coverline("editor-selection", 282);
br = single.item(0).all('br');
            _yuitest_coverline("editor-selection", 283);
if (br.size() === 1) {
                _yuitest_coverline("editor-selection", 284);
if (!br.item(0).test('.yui-cursor')) {
                    _yuitest_coverline("editor-selection", 285);
br.item(0).remove();
                }
                _yuitest_coverline("editor-selection", 287);
var html = single.item(0).get('innerHTML');
                _yuitest_coverline("editor-selection", 288);
if (html === '' || html === ' ') {
                    _yuitest_coverline("editor-selection", 289);
single.set('innerHTML', Y.EditorSelection.CURSOR);
                    _yuitest_coverline("editor-selection", 290);
sel = new Y.EditorSelection();
                    _yuitest_coverline("editor-selection", 291);
sel.focusCursor(true, true);
                }
                _yuitest_coverline("editor-selection", 293);
if (br.item(0).test('.yui-cursor') && Y.UA.ie) {
                    _yuitest_coverline("editor-selection", 294);
br.item(0).remove();
                }
            }
        } else {
            _yuitest_coverline("editor-selection", 298);
single.each(function(p) {
                _yuitest_coverfunc("editor-selection", "(anonymous 7)", 298);
_yuitest_coverline("editor-selection", 299);
var html = p.get('innerHTML');
                _yuitest_coverline("editor-selection", 300);
if (html === '') {
                    _yuitest_coverline("editor-selection", 301);
p.remove();
                }
            });
        }
        
        _yuitest_coverline("editor-selection", 306);
if (!Y.UA.ie) {
            /*
            divs = Y.all('div, p');
            divs.each(function(d) {
                if (d.hasClass('yui-non')) {
                    return;
                }
                var html = d.get('innerHTML');
                if (html === '') {
                    d.remove();
                } else {
                    if (d.get('childNodes').size() == 1) {
                        if (d.ancestor('p')) {
                            d.replace(d.get('firstChild'));
                        }
                    }
                }
            });*/

            /* Removed this, as it was causing Pasting to be funky in Safari
            spans = Y.all('.Apple-style-span, .apple-style-span');
            spans.each(function(s) {
                s.setAttribute('style', '');
            });
            */
        }


        _yuitest_coverline("editor-selection", 334);
var endTime = (new Date()).getTime();
    };

    /**
    * Regular Expression used to find dead font-family styles
    * @static
    * @property REG_FONTFAMILY
    */   
    _yuitest_coverline("editor-selection", 342);
Y.EditorSelection.REG_FONTFAMILY = /font-family: ;/;

    /**
    * Regular Expression to determine if a string has a character in it
    * @static
    * @property REG_CHAR
    */   
    _yuitest_coverline("editor-selection", 349);
Y.EditorSelection.REG_CHAR = /[a-zA-Z-0-9_!@#\$%\^&*\(\)-=_+\[\]\\{}|;':",.\/<>\?]/gi;

    /**
    * Regular Expression to determine if a string has a non-character in it
    * @static
    * @property REG_NON
    */
    _yuitest_coverline("editor-selection", 356);
Y.EditorSelection.REG_NON = /[\s|\n|\t]/gi;

    /**
    * Regular Expression to remove all HTML from a string
    * @static
    * @property REG_NOHTML
    */
    _yuitest_coverline("editor-selection", 363);
Y.EditorSelection.REG_NOHTML = /<\S[^><]*>/g;


    /**
    * Wraps an array of elements in a Block level tag
    * @static
    * @private
    * @method _wrapBlock
    */
    _yuitest_coverline("editor-selection", 372);
Y.EditorSelection._wrapBlock = function(wrapped) {
        _yuitest_coverfunc("editor-selection", "_wrapBlock", 372);
_yuitest_coverline("editor-selection", 373);
if (wrapped) {
            _yuitest_coverline("editor-selection", 374);
var newChild = Y.Node.create('<' + Y.EditorSelection.DEFAULT_BLOCK_TAG + '></' + Y.EditorSelection.DEFAULT_BLOCK_TAG + '>'),
                firstChild = Y.one(wrapped[0]), i;

            _yuitest_coverline("editor-selection", 377);
for (i = 1; i < wrapped.length; i++) {
                _yuitest_coverline("editor-selection", 378);
newChild.append(wrapped[i]);
            }
            _yuitest_coverline("editor-selection", 380);
firstChild.replace(newChild);
            _yuitest_coverline("editor-selection", 381);
newChild.prepend(firstChild);
        }
        _yuitest_coverline("editor-selection", 383);
return false;
    };

    /**
    * Undoes what filter does enough to return the HTML from the Editor, then re-applies the filter.
    * @static
    * @method unfilter
    * @return {String} The filtered HTML
    */
    _yuitest_coverline("editor-selection", 392);
Y.EditorSelection.unfilter = function() {
        _yuitest_coverfunc("editor-selection", "unfilter", 392);
_yuitest_coverline("editor-selection", 393);
var nodes = Y.all('body [class]'),
            html = '', nons, ids,
            body = Y.one('body');
        
        
        _yuitest_coverline("editor-selection", 398);
nodes.each(function(n) {
            _yuitest_coverfunc("editor-selection", "(anonymous 8)", 398);
_yuitest_coverline("editor-selection", 399);
if (n.hasClass(n._yuid)) {
                //One of ours
                _yuitest_coverline("editor-selection", 401);
n.setStyle(FONT_FAMILY, n.getStyle(FONT_FAMILY));
                _yuitest_coverline("editor-selection", 402);
n.removeClass(n._yuid);
                _yuitest_coverline("editor-selection", 403);
if (n.getAttribute('class') === '') {
                    _yuitest_coverline("editor-selection", 404);
n.removeAttribute('class');
                }
            }
        });

        _yuitest_coverline("editor-selection", 409);
nons = Y.all('.yui-non');
        _yuitest_coverline("editor-selection", 410);
nons.each(function(n) {
            _yuitest_coverfunc("editor-selection", "(anonymous 9)", 410);
_yuitest_coverline("editor-selection", 411);
if (!n.hasClass('yui-skip') && n.get('innerHTML') === '') {
                _yuitest_coverline("editor-selection", 412);
n.remove();
            } else {
                _yuitest_coverline("editor-selection", 414);
n.removeClass('yui-non').removeClass('yui-skip');
            }
        });

        _yuitest_coverline("editor-selection", 418);
ids = Y.all('body [id]');
        _yuitest_coverline("editor-selection", 419);
ids.each(function(n) {
            _yuitest_coverfunc("editor-selection", "(anonymous 10)", 419);
_yuitest_coverline("editor-selection", 420);
if (n.get('id').indexOf('yui_3_') === 0) {
                _yuitest_coverline("editor-selection", 421);
n.removeAttribute('id');
                _yuitest_coverline("editor-selection", 422);
n.removeAttribute('_yuid');
            }
        });
        
        _yuitest_coverline("editor-selection", 426);
if (body) {
            _yuitest_coverline("editor-selection", 427);
html = body.get('innerHTML');
        }
        
        _yuitest_coverline("editor-selection", 430);
Y.all('.hr').addClass('yui-skip').addClass('yui-non');
        
        /*
        nodes.each(function(n) {
            n.addClass(n._yuid);
            n.setStyle(FONT_FAMILY, '');
            if (n.getAttribute('style') === '') {
                n.removeAttribute('style');
            }
        });
        */
        
        _yuitest_coverline("editor-selection", 442);
return html;
    };
    /**
    * Resolve a node from the selection object and return a Node instance
    * @static
    * @method resolve
    * @param {HTMLElement} n The HTMLElement to resolve. Might be a TextNode, gives parentNode.
    * @return {Node} The Resolved node
    */
    _yuitest_coverline("editor-selection", 451);
Y.EditorSelection.resolve = function(n) {
        _yuitest_coverfunc("editor-selection", "resolve", 451);
_yuitest_coverline("editor-selection", 452);
if (n && n.nodeType === 3) {
            //Adding a try/catch here because in rare occasions IE will
            //Throw a error accessing the parentNode of a stranded text node.
            //In the case of Ctrl+Z (Undo)
            _yuitest_coverline("editor-selection", 456);
try {
                _yuitest_coverline("editor-selection", 457);
n = n.parentNode;
            } catch (re) {
                _yuitest_coverline("editor-selection", 459);
n = 'body';
            }
        }
        _yuitest_coverline("editor-selection", 462);
return Y.one(n);
    };

    /**
    * Returns the innerHTML of a node with all HTML tags removed.
    * @static
    * @method getText
    * @param {Node} node The Node instance to remove the HTML from
    * @return {String} The string of text
    */
    _yuitest_coverline("editor-selection", 472);
Y.EditorSelection.getText = function(node) {
        _yuitest_coverfunc("editor-selection", "getText", 472);
_yuitest_coverline("editor-selection", 473);
var txt = node.get('innerHTML').replace(Y.EditorSelection.REG_NOHTML, '');
        //Clean out the cursor subs to see if the Node is empty
        _yuitest_coverline("editor-selection", 475);
txt = txt.replace('<span><br></span>', '').replace('<br>', '');
        _yuitest_coverline("editor-selection", 476);
return txt;
    };

    //Y.EditorSelection.DEFAULT_BLOCK_TAG = 'div';
    _yuitest_coverline("editor-selection", 480);
Y.EditorSelection.DEFAULT_BLOCK_TAG = 'p';

    /**
    * The selector to use when looking for Nodes to cache the value of: [style],font[face]
    * @static
    * @property ALL
    */
    _yuitest_coverline("editor-selection", 487);
Y.EditorSelection.ALL = '[style],font[face]';

    /**
    * The selector to use when looking for block level items.
    * @static
    * @property BLOCKS
    */
    _yuitest_coverline("editor-selection", 494);
Y.EditorSelection.BLOCKS = 'p,div,ul,ol,table,style';
    /**
    * The temporary fontname applied to a selection to retrieve their values: yui-tmp
    * @static
    * @property TMP
    */
    _yuitest_coverline("editor-selection", 500);
Y.EditorSelection.TMP = 'yui-tmp';
    /**
    * The default tag to use when creating elements: span
    * @static
    * @property DEFAULT_TAG
    */
    _yuitest_coverline("editor-selection", 506);
Y.EditorSelection.DEFAULT_TAG = 'span';

    /**
    * The id of the outer cursor wrapper
    * @static
    * @property DEFAULT_TAG
    */
    _yuitest_coverline("editor-selection", 513);
Y.EditorSelection.CURID = 'yui-cursor';

    /**
    * The id used to wrap the inner space of the cursor position
    * @static
    * @property CUR_WRAPID
    */
    _yuitest_coverline("editor-selection", 520);
Y.EditorSelection.CUR_WRAPID = 'yui-cursor-wrapper';

    /**
    * The default HTML used to focus the cursor..
    * @static
    * @property CURSOR
    */
    _yuitest_coverline("editor-selection", 527);
Y.EditorSelection.CURSOR = '<span><br class="yui-cursor"></span>';

    _yuitest_coverline("editor-selection", 529);
Y.EditorSelection.hasCursor = function() {
        _yuitest_coverfunc("editor-selection", "hasCursor", 529);
_yuitest_coverline("editor-selection", 530);
var cur = Y.all('#' + Y.EditorSelection.CUR_WRAPID);
        _yuitest_coverline("editor-selection", 531);
return cur.size();
    };

    /**
    * Called from Editor keydown to remove the "extra" space before the cursor.
    * @static
    * @method cleanCursor
    */
    _yuitest_coverline("editor-selection", 539);
Y.EditorSelection.cleanCursor = function() {
        _yuitest_coverfunc("editor-selection", "cleanCursor", 539);
_yuitest_coverline("editor-selection", 540);
var cur, sel = 'br.yui-cursor';
        _yuitest_coverline("editor-selection", 541);
cur = Y.all(sel);
        _yuitest_coverline("editor-selection", 542);
if (cur.size()) {
            _yuitest_coverline("editor-selection", 543);
cur.each(function(b) {
                _yuitest_coverfunc("editor-selection", "(anonymous 11)", 543);
_yuitest_coverline("editor-selection", 544);
var c = b.get('parentNode.parentNode.childNodes'), html;
                _yuitest_coverline("editor-selection", 545);
if (c.size()) {
                    _yuitest_coverline("editor-selection", 546);
b.remove();
                } else {
                    _yuitest_coverline("editor-selection", 548);
html = Y.EditorSelection.getText(c.item(0));
                    _yuitest_coverline("editor-selection", 549);
if (html !== '') {
                        _yuitest_coverline("editor-selection", 550);
b.remove();
                    }
                }
            });
        }
        /*
        var cur = Y.all('#' + Y.EditorSelection.CUR_WRAPID);
        if (cur.size()) {
            cur.each(function(c) {
                var html = c.get('innerHTML');
                if (html == '&nbsp;' || html == '<br>') {
                    if (c.previous() || c.next()) {
                        c.remove();
                    }
                }
            });
        }
        */
    };

    _yuitest_coverline("editor-selection", 570);
Y.EditorSelection.prototype = {
        /**
        * Range text value
        * @property text
        * @type String
        */
        text: null,
        /**
        * Flag to show if the range is collapsed or not
        * @property isCollapsed
        * @type Boolean
        */
        isCollapsed: null,
        /**
        * A Node instance of the parentNode of the anchorNode of the range
        * @property anchorNode
        * @type Node
        */
        anchorNode: null,
        /**
        * The offset from the range object
        * @property anchorOffset
        * @type Number
        */
        anchorOffset: null,
        /**
        * A Node instance of the actual textNode of the range.
        * @property anchorTextNode
        * @type Node
        */
        anchorTextNode: null,
        /**
        * A Node instance of the parentNode of the focusNode of the range
        * @property focusNode
        * @type Node
        */
        focusNode: null,
        /**
        * The offset from the range object
        * @property focusOffset
        * @type Number
        */
        focusOffset: null,
        /**
        * A Node instance of the actual textNode of the range.
        * @property focusTextNode
        * @type Node
        */
        focusTextNode: null,
        /**
        * The actual Selection/Range object
        * @property _selection
        * @private
        */
        _selection: null,
        /**
        * Wrap an element, with another element 
        * @private
        * @method _wrap
        * @param {HTMLElement} n The node to wrap 
        * @param {String} tag The tag to use when creating the new element.
        * @return {HTMLElement} The wrapped node
        */
        _wrap: function(n, tag) {
            _yuitest_coverfunc("editor-selection", "_wrap", 633);
_yuitest_coverline("editor-selection", 634);
var tmp = Y.Node.create('<' + tag + '></' + tag + '>');
            _yuitest_coverline("editor-selection", 635);
tmp.set(INNER_HTML, n.get(INNER_HTML));
            _yuitest_coverline("editor-selection", 636);
n.set(INNER_HTML, '');
            _yuitest_coverline("editor-selection", 637);
n.append(tmp);
            _yuitest_coverline("editor-selection", 638);
return Y.Node.getDOMNode(tmp);
        },
        /**
        * Swap an element, with another element 
        * @private
        * @method _swap
        * @param {HTMLElement} n The node to swap 
        * @param {String} tag The tag to use when creating the new element.
        * @return {HTMLElement} The new node
        */
        _swap: function(n, tag) {
            _yuitest_coverfunc("editor-selection", "_swap", 648);
_yuitest_coverline("editor-selection", 649);
var tmp = Y.Node.create('<' + tag + '></' + tag + '>');
            _yuitest_coverline("editor-selection", 650);
tmp.set(INNER_HTML, n.get(INNER_HTML));
            _yuitest_coverline("editor-selection", 651);
n.replace(tmp, n);
            _yuitest_coverline("editor-selection", 652);
return Y.Node.getDOMNode(tmp);
        },
        /**
        * Get all the nodes in the current selection. This method will actually perform a filter first.
        * Then it calls doc.execCommand('fontname', null, 'yui-tmp') to touch all nodes in the selection.
        * The it compiles a list of all nodes affected by the execCommand and builds a NodeList to return.
        * @method getSelected
        * @return {NodeList} A NodeList of all items in the selection.
        */
        getSelected: function() {
            _yuitest_coverfunc("editor-selection", "getSelected", 661);
_yuitest_coverline("editor-selection", 662);
Y.EditorSelection.filter();
            _yuitest_coverline("editor-selection", 663);
Y.config.doc.execCommand('fontname', null, Y.EditorSelection.TMP);
            _yuitest_coverline("editor-selection", 664);
var nodes = Y.all(Y.EditorSelection.ALL),
                items = [];
            
            _yuitest_coverline("editor-selection", 667);
nodes.each(function(n, k) {
                _yuitest_coverfunc("editor-selection", "(anonymous 12)", 667);
_yuitest_coverline("editor-selection", 668);
if (n.getStyle(FONT_FAMILY) ==  Y.EditorSelection.TMP) {
                    _yuitest_coverline("editor-selection", 669);
n.setStyle(FONT_FAMILY, '');
                    _yuitest_coverline("editor-selection", 670);
Y.EditorSelection.removeFontFamily(n);
                    _yuitest_coverline("editor-selection", 671);
if (!n.test('body')) {
                        _yuitest_coverline("editor-selection", 672);
items.push(Y.Node.getDOMNode(nodes.item(k)));
                    }
                }
            });
            _yuitest_coverline("editor-selection", 676);
return Y.all(items);
        },
        /**
        * Insert HTML at the current cursor position and return a Node instance of the newly inserted element.
        * @method insertContent
        * @param {String} html The HTML to insert.
        * @return {Node} The inserted Node.
        */
        insertContent: function(html) {
            _yuitest_coverfunc("editor-selection", "insertContent", 684);
_yuitest_coverline("editor-selection", 685);
return this.insertAtCursor(html, this.anchorTextNode, this.anchorOffset, true);
        },
        /**
        * Insert HTML at the current cursor position, this method gives you control over the text node to insert into and the offset where to put it.
        * @method insertAtCursor
        * @param {String} html The HTML to insert.
        * @param {Node} node The text node to break when inserting.
        * @param {Number} offset The left offset of the text node to break and insert the new content.
        * @param {Boolean} collapse Should the range be collapsed after insertion. default: false
        * @return {Node} The inserted Node.
        */
        insertAtCursor: function(html, node, offset, collapse) {
            _yuitest_coverfunc("editor-selection", "insertAtCursor", 696);
_yuitest_coverline("editor-selection", 697);
var cur = Y.Node.create('<' + Y.EditorSelection.DEFAULT_TAG + ' class="yui-non"></' + Y.EditorSelection.DEFAULT_TAG + '>'),
                inHTML, txt, txt2, newNode, range = this.createRange(), b;

            _yuitest_coverline("editor-selection", 700);
if (node && node.test('body')) {
                _yuitest_coverline("editor-selection", 701);
b = Y.Node.create('<span></span>');
                _yuitest_coverline("editor-selection", 702);
node.append(b);
                _yuitest_coverline("editor-selection", 703);
node = b;
            }

            
            _yuitest_coverline("editor-selection", 707);
if (range.pasteHTML) {
                _yuitest_coverline("editor-selection", 708);
if (offset === 0 && node && !node.previous() && node.get('nodeType') === 3) {
                    /*
                    * For some strange reason, range.pasteHTML fails if the node is a textNode and
                    * the offset is 0. (The cursor is at the beginning of the line)
                    * It will always insert the new content at position 1 instead of 
                    * position 0. Here we test for that case and do it the hard way.
                    */
                    _yuitest_coverline("editor-selection", 715);
node.insert(html, 'before');
                    _yuitest_coverline("editor-selection", 716);
if (range.moveToElementText) {
                        _yuitest_coverline("editor-selection", 717);
range.moveToElementText(Y.Node.getDOMNode(node.previous()));
                    }
                    //Move the cursor after the new node
                    _yuitest_coverline("editor-selection", 720);
range.collapse(false);
                    _yuitest_coverline("editor-selection", 721);
range.select();
                    _yuitest_coverline("editor-selection", 722);
return node.previous();
                } else {
                    _yuitest_coverline("editor-selection", 724);
newNode = Y.Node.create(html);
                    _yuitest_coverline("editor-selection", 725);
try {
                        _yuitest_coverline("editor-selection", 726);
range.pasteHTML('<span id="rte-insert"></span>');
                    } catch (e) {}
                    _yuitest_coverline("editor-selection", 728);
inHTML = Y.one('#rte-insert');
                    _yuitest_coverline("editor-selection", 729);
if (inHTML) {
                        _yuitest_coverline("editor-selection", 730);
inHTML.set('id', '');
                        _yuitest_coverline("editor-selection", 731);
inHTML.replace(newNode);
                        _yuitest_coverline("editor-selection", 732);
if (range.moveToElementText) {
                            _yuitest_coverline("editor-selection", 733);
range.moveToElementText(Y.Node.getDOMNode(newNode));
                        }
                        _yuitest_coverline("editor-selection", 735);
range.collapse(false);
                        _yuitest_coverline("editor-selection", 736);
range.select();
                        _yuitest_coverline("editor-selection", 737);
return newNode;
                    } else {
                        _yuitest_coverline("editor-selection", 739);
Y.on('available', function() {
                            _yuitest_coverfunc("editor-selection", "(anonymous 13)", 739);
_yuitest_coverline("editor-selection", 740);
inHTML.set('id', '');
                            _yuitest_coverline("editor-selection", 741);
inHTML.replace(newNode);
                            _yuitest_coverline("editor-selection", 742);
if (range.moveToElementText) {
                                _yuitest_coverline("editor-selection", 743);
range.moveToElementText(Y.Node.getDOMNode(newNode));
                            }
                            _yuitest_coverline("editor-selection", 745);
range.collapse(false);
                            _yuitest_coverline("editor-selection", 746);
range.select();
                        }, '#rte-insert');
                    }
                }
            } else {
                //TODO using Y.Node.create here throws warnings & strips first white space character
                //txt = Y.one(Y.Node.create(inHTML.substr(0, offset)));
                //txt2 = Y.one(Y.Node.create(inHTML.substr(offset)));
                _yuitest_coverline("editor-selection", 754);
if (offset > 0) {
                    _yuitest_coverline("editor-selection", 755);
inHTML = node.get(textContent);

                    _yuitest_coverline("editor-selection", 757);
txt = Y.one(Y.config.doc.createTextNode(inHTML.substr(0, offset)));
                    _yuitest_coverline("editor-selection", 758);
txt2 = Y.one(Y.config.doc.createTextNode(inHTML.substr(offset)));

                    _yuitest_coverline("editor-selection", 760);
node.replace(txt, node);
                    _yuitest_coverline("editor-selection", 761);
newNode = Y.Node.create(html);
                    _yuitest_coverline("editor-selection", 762);
if (newNode.get('nodeType') === 11) {
                        _yuitest_coverline("editor-selection", 763);
b = Y.Node.create('<span></span>');
                        _yuitest_coverline("editor-selection", 764);
b.append(newNode);
                        _yuitest_coverline("editor-selection", 765);
newNode = b;
                    }
                    _yuitest_coverline("editor-selection", 767);
txt.insert(newNode, 'after');
                    //if (txt2 && txt2.get('length')) {
                    _yuitest_coverline("editor-selection", 769);
if (txt2) {
                        _yuitest_coverline("editor-selection", 770);
newNode.insert(cur, 'after');
                        _yuitest_coverline("editor-selection", 771);
cur.insert(txt2, 'after');
                        _yuitest_coverline("editor-selection", 772);
this.selectNode(cur, collapse);
                    }
                } else {
                    _yuitest_coverline("editor-selection", 775);
if (node.get('nodeType') === 3) {
                        _yuitest_coverline("editor-selection", 776);
node = node.get('parentNode');
                    }
                    _yuitest_coverline("editor-selection", 778);
newNode = Y.Node.create(html);
                    _yuitest_coverline("editor-selection", 779);
html = node.get('innerHTML').replace(/\n/gi, '');
                    _yuitest_coverline("editor-selection", 780);
if (html === '' || html === '<br>') {
                        _yuitest_coverline("editor-selection", 781);
node.append(newNode);
                    } else {
                        _yuitest_coverline("editor-selection", 783);
if (newNode.get('parentNode')) {
                            _yuitest_coverline("editor-selection", 784);
node.insert(newNode, 'before');
                        } else {
                            _yuitest_coverline("editor-selection", 786);
Y.one('body').prepend(newNode);
                        }
                    }
                    _yuitest_coverline("editor-selection", 789);
if (node.get('firstChild').test('br')) {
                        _yuitest_coverline("editor-selection", 790);
node.get('firstChild').remove();
                    }
                }
            }
            _yuitest_coverline("editor-selection", 794);
return newNode;
        },
        /**
        * Get all elements inside a selection and wrap them with a new element and return a NodeList of all elements touched.
        * @method wrapContent
        * @param {String} tag The tag to wrap all selected items with.
        * @return {NodeList} A NodeList of all items in the selection.
        */
        wrapContent: function(tag) {
            _yuitest_coverfunc("editor-selection", "wrapContent", 802);
_yuitest_coverline("editor-selection", 803);
tag = (tag) ? tag : Y.EditorSelection.DEFAULT_TAG;

            _yuitest_coverline("editor-selection", 805);
if (!this.isCollapsed) {
                _yuitest_coverline("editor-selection", 806);
var items = this.getSelected(),
                    changed = [], range, last, first, range2;

                _yuitest_coverline("editor-selection", 809);
items.each(function(n, k) {
                    _yuitest_coverfunc("editor-selection", "(anonymous 14)", 809);
_yuitest_coverline("editor-selection", 810);
var t = n.get('tagName').toLowerCase();
                    _yuitest_coverline("editor-selection", 811);
if (t === 'font') {
                        _yuitest_coverline("editor-selection", 812);
changed.push(this._swap(items.item(k), tag));
                    } else {
                        _yuitest_coverline("editor-selection", 814);
changed.push(this._wrap(items.item(k), tag));
                    }
                }, this);
                
		        _yuitest_coverline("editor-selection", 818);
range = this.createRange();
                _yuitest_coverline("editor-selection", 819);
first = changed[0];
                _yuitest_coverline("editor-selection", 820);
last = changed[changed.length - 1];
                _yuitest_coverline("editor-selection", 821);
if (this._selection.removeAllRanges) {
                    _yuitest_coverline("editor-selection", 822);
range.setStart(changed[0], 0);
                    _yuitest_coverline("editor-selection", 823);
range.setEnd(last, last.childNodes.length);
                    _yuitest_coverline("editor-selection", 824);
this._selection.removeAllRanges();
                    _yuitest_coverline("editor-selection", 825);
this._selection.addRange(range);
                } else {
                    _yuitest_coverline("editor-selection", 827);
if (range.moveToElementText) {
                        _yuitest_coverline("editor-selection", 828);
range.moveToElementText(Y.Node.getDOMNode(first));
                        _yuitest_coverline("editor-selection", 829);
range2 = this.createRange();
                        _yuitest_coverline("editor-selection", 830);
range2.moveToElementText(Y.Node.getDOMNode(last));
                        _yuitest_coverline("editor-selection", 831);
range.setEndPoint('EndToEnd', range2);
                    }
                    _yuitest_coverline("editor-selection", 833);
range.select();
                }

                _yuitest_coverline("editor-selection", 836);
changed = Y.all(changed);
                _yuitest_coverline("editor-selection", 837);
return changed;


            } else {
                _yuitest_coverline("editor-selection", 841);
return Y.all([]);
            }
        },
        /**
        * Find and replace a string inside a text node and replace it with HTML focusing the node after 
        * to allow you to continue to type.
        * @method replace
        * @param {String} se The string to search for.
        * @param {String} re The string of HTML to replace it with.
        * @return {Node} The node inserted.
        */
        replace: function(se,re) {
            _yuitest_coverfunc("editor-selection", "replace", 852);
_yuitest_coverline("editor-selection", 853);
var range = this.createRange(), node, txt, index, newNode;

            _yuitest_coverline("editor-selection", 855);
if (range.getBookmark) {
                _yuitest_coverline("editor-selection", 856);
index = range.getBookmark();
                _yuitest_coverline("editor-selection", 857);
txt = this.anchorNode.get('innerHTML').replace(se, re);
                _yuitest_coverline("editor-selection", 858);
this.anchorNode.set('innerHTML', txt);
                _yuitest_coverline("editor-selection", 859);
range.moveToBookmark(index);
                _yuitest_coverline("editor-selection", 860);
newNode = Y.one(range.parentElement());
            } else {
                _yuitest_coverline("editor-selection", 862);
node = this.anchorTextNode;
                _yuitest_coverline("editor-selection", 863);
txt = node.get(textContent);
                _yuitest_coverline("editor-selection", 864);
index = txt.indexOf(se);

                _yuitest_coverline("editor-selection", 866);
txt = txt.replace(se, '');
                _yuitest_coverline("editor-selection", 867);
node.set(textContent, txt);
                _yuitest_coverline("editor-selection", 868);
newNode = this.insertAtCursor(re, node, index, true);
            }
            _yuitest_coverline("editor-selection", 870);
return newNode;
        },
        /**
        * Destroy the range.
        * @method remove
        * @chainable
        * @return {EditorSelection}
        */
        remove: function() {
            _yuitest_coverfunc("editor-selection", "remove", 878);
_yuitest_coverline("editor-selection", 879);
if (this._selection && this._selection.removeAllRanges) {
                _yuitest_coverline("editor-selection", 880);
this._selection.removeAllRanges();
            }
            _yuitest_coverline("editor-selection", 882);
return this;
        },
        /**
        * Wrapper for the different range creation methods.
        * @method createRange
        * @return {RangeObject}
        */
        createRange: function() {
            _yuitest_coverfunc("editor-selection", "createRange", 889);
_yuitest_coverline("editor-selection", 890);
if (Y.config.doc.selection) {
                _yuitest_coverline("editor-selection", 891);
return Y.config.doc.selection.createRange();
            } else {
		        _yuitest_coverline("editor-selection", 893);
return Y.config.doc.createRange();
            }
        },
        /**
        * Select a Node (hilighting it).
        * @method selectNode
        * @param {Node} node The node to select
        * @param {Boolean} collapse Should the range be collapsed after insertion. default: false
        * @chainable
        * @return {EditorSelection}
        */
        selectNode: function(node, collapse, end) {
            _yuitest_coverfunc("editor-selection", "selectNode", 904);
_yuitest_coverline("editor-selection", 905);
if (!node) {
                _yuitest_coverline("editor-selection", 906);
return;
            }
            _yuitest_coverline("editor-selection", 908);
end = end || 0;
            _yuitest_coverline("editor-selection", 909);
node = Y.Node.getDOMNode(node);
		    _yuitest_coverline("editor-selection", 910);
var range = this.createRange();
            _yuitest_coverline("editor-selection", 911);
if (range.selectNode) {
                _yuitest_coverline("editor-selection", 912);
range.selectNode(node);
                _yuitest_coverline("editor-selection", 913);
this._selection.removeAllRanges();
                _yuitest_coverline("editor-selection", 914);
this._selection.addRange(range);
                _yuitest_coverline("editor-selection", 915);
if (collapse) {
                    _yuitest_coverline("editor-selection", 916);
try {
                        _yuitest_coverline("editor-selection", 917);
this._selection.collapse(node, end);
                    } catch (err) {
                        _yuitest_coverline("editor-selection", 919);
this._selection.collapse(node, 0);
                    }
                }
            } else {
                _yuitest_coverline("editor-selection", 923);
if (node.nodeType === 3) {
                    _yuitest_coverline("editor-selection", 924);
node = node.parentNode;
                }
                _yuitest_coverline("editor-selection", 926);
try {
                    _yuitest_coverline("editor-selection", 927);
range.moveToElementText(node);
                } catch(e) {}
                _yuitest_coverline("editor-selection", 929);
if (collapse) {
                    _yuitest_coverline("editor-selection", 930);
range.collapse(((end) ? false : true));
                }
                _yuitest_coverline("editor-selection", 932);
range.select();
            }
            _yuitest_coverline("editor-selection", 934);
return this;
        },
        /**
        * Put a placeholder in the DOM at the current cursor position.
        * @method setCursor
        * @return {Node}
        */
        setCursor: function() {
            _yuitest_coverfunc("editor-selection", "setCursor", 941);
_yuitest_coverline("editor-selection", 942);
this.removeCursor(false);
            _yuitest_coverline("editor-selection", 943);
return this.insertContent(Y.EditorSelection.CURSOR);
        },
        /**
        * Get the placeholder in the DOM at the current cursor position.
        * @method getCursor
        * @return {Node}
        */
        getCursor: function() {
            _yuitest_coverfunc("editor-selection", "getCursor", 950);
_yuitest_coverline("editor-selection", 951);
return Y.all('#' + Y.EditorSelection.CURID);
        },
        /**
        * Remove the cursor placeholder from the DOM.
        * @method removeCursor
        * @param {Boolean} keep Setting this to true will keep the node, but remove the unique parts that make it the cursor.
        * @return {Node}
        */
        removeCursor: function(keep) {
            _yuitest_coverfunc("editor-selection", "removeCursor", 959);
_yuitest_coverline("editor-selection", 960);
var cur = this.getCursor();
            _yuitest_coverline("editor-selection", 961);
if (cur) {
                _yuitest_coverline("editor-selection", 962);
if (keep) {
                    _yuitest_coverline("editor-selection", 963);
cur.removeAttribute('id');
                    _yuitest_coverline("editor-selection", 964);
cur.set('innerHTML', '<br class="yui-cursor">');
                } else {
                    _yuitest_coverline("editor-selection", 966);
cur.remove();
                }
            }
            _yuitest_coverline("editor-selection", 969);
return cur;
        },
        /**
        * Gets a stored cursor and focuses it for editing, must be called sometime after setCursor
        * @method focusCursor
        * @return {Node}
        */
        focusCursor: function(collapse, end) {
            _yuitest_coverfunc("editor-selection", "focusCursor", 976);
_yuitest_coverline("editor-selection", 977);
if (collapse !== false) {
                _yuitest_coverline("editor-selection", 978);
collapse = true;
            }
            _yuitest_coverline("editor-selection", 980);
if (end !== false) {
                _yuitest_coverline("editor-selection", 981);
end = true;
            }
            _yuitest_coverline("editor-selection", 983);
var cur = this.removeCursor(true);
            _yuitest_coverline("editor-selection", 984);
if (cur) {
                _yuitest_coverline("editor-selection", 985);
cur.each(function(c) {
                    _yuitest_coverfunc("editor-selection", "(anonymous 15)", 985);
_yuitest_coverline("editor-selection", 986);
this.selectNode(c, collapse, end);
                }, this);
            }
        },
        /**
        * Generic toString for logging.
        * @method toString
        * @return {String}
        */
        toString: function() {
            _yuitest_coverfunc("editor-selection", "toString", 995);
_yuitest_coverline("editor-selection", 996);
return 'EditorSelection Object';
        }
    };

    //TODO Remove this alias in 3.6.0
    _yuitest_coverline("editor-selection", 1001);
Y.Selection = Y.EditorSelection;



}, '@VERSION@', {"requires": ["node"]});
