YUI.add('selection', function(Y) {
    /**
     * Wraps some common Selection/Range functionality into a simple object
     * @module editor
     * @submodule selection
     */     
    /**
     * Wraps some common Selection/Range functionality into a simple object
     * @class Selection
     * @constructor
     */
    
    //TODO This shouldn't be there, Y.Node doesn't normalize getting textnode content.
    var textContent = 'textContent',
    INNER_HTML = 'innerHTML',
    FONT_FAMILY = 'fontFamily';

    Y.Selection = function() {
        var sel, el, cur, curStr, curID;
        if (Y.config.win.getSelection) {
	        sel = Y.config.win.getSelection();
        } else if (Y.config.doc.selection) {
    	    sel = Y.config.doc.selection.createRange();
        }
        this._selection = sel;
        
        if (sel.pasteHTML) {
            textContent = 'nodeValue';
            this.isCollapsed = (sel.compareEndPoints('StartToEnd', sel)) ? false : true;

            if (this.isCollapsed) {
                var par = sel.parentElement(),
                    nodes = par.childNodes, ieNode,
                    rng = sel.duplicate();

                Y.each(nodes, function(v) {
                    rng.select(v);
                    if (rng.inRange(sel)) {
                       ieNode = v; 
                    }
                });

                this.ieNode = ieNode;
                
                if (ieNode) {
                    if (ieNode.nodeType !== 3) {
                        ieNode = ieNode.firstChild;
                    }
                    this.anchorNode = Y.Selection.resolve(ieNode);
                    this.focusNode = Y.Selection.resolve(ieNode);
                    
                    this.anchorOffset = this.focusOffset = (ieNode.nodeValue) ? ieNode.nodeValue.length : 0 ;
                    
                    this.anchorTextNode = this.focusTextNode = Y.one(ieNode);
                }
                
            }

            //var self = this;
            //debugger;
        } else {
            this.isCollapsed = sel.isCollapsed;
            this.anchorNode = Y.Selection.resolve(sel.anchorNode);
            this.focusNode = Y.Selection.resolve(sel.focusNode);
            this.anchorOffset = sel.anchorOffset;
            this.focusOffset = sel.focusOffset;
            
            this.anchorTextNode = Y.one(sel.anchorNode);
            this.focusTextNode = Y.one(sel.focusNode);
        }
        if (Y.Lang.isString(sel.text)) {
            this.text = sel.text;
        } else {
            this.text = sel.toString();
        }
    };
    
    /**
    * Performs a prefilter on all nodes in the editor. Looks for nodes with a style: fontFamily or font face
    * It then creates a dynamic class assigns it and removed the property. This is so that we don't lose
    * the fontFamily when selecting nodes.
    * @static
    * @method filter
    */
    Y.Selection.filter = function() {
        var nodes = Y.all(Y.Selection.ALL),
            baseNodes = Y.all('strong,em');

        Y.log('Filtering nodes', 'info', 'selection');
        nodes.each(function(n) {
            if (n.getStyle(FONT_FAMILY)) {
                var sheet = new Y.StyleSheet('editor');
                sheet.set('.' + n._yuid, {
                    fontFamily: n.getStyle(FONT_FAMILY)
                });
                n.addClass(n._yuid);
                n.removeAttribute('face');
                n.setStyle(FONT_FAMILY, '');
                if (n.getAttribute('style') === '') {
                    n.removeAttribute('style');
                }
            }
        });
        
        //Not sure about this one?
        baseNodes.each(function(n, k) {
            var t = n.get('tagName').toLowerCase(),
                newTag = 'i';
            if (t === 'strong') {
                newTag = 'b';
            }
            Y.Selection.prototype._swap(baseNodes.item(k), newTag);
        });
        //Filter out all the empty UL/OL's
        var ls = Y.all('ol,ul');
        ls.each(function(v, k) {
            var lis = v.all('li');
            if (!lis.size()) {
                v.remove();
            }
        });

    };
    /**
    * Undoes what filter does enough to return the HTML from the Editor, then re-applies the filter.
    * @static
    * @method unfilter
    * @return {String} The filtered HTML
    */
    Y.Selection.unfilter = function() {
        var nodes = Y.all('body [class]'),
            html = '';
        
        Y.log('UnFiltering nodes', 'info', 'selection');
        
        nodes.each(function(n) {
            if (n.hasClass(n._yuid)) {
                //One of ours
                n.setStyle(FONT_FAMILY, n.getStyle(FONT_FAMILY));
                n.removeClass(n._yuid);
                if (n.getAttribute('class') === '') {
                    n.removeAttribute('class');
                }
            }
        });
        var nons = Y.all('.yui-non');
        nons.each(function(n) {
            if (n.get('innerHTML') === '') {
                n.remove();
            }
        });

        var ids = Y.all('body [id]');
        ids.each(function(n) {
            if (n.get('id').indexOf('yui_3_') === 0) {
                n.removeAttribute('id');
                n.removeAttribute('_yuid');
            }
        });

        html = Y.one('body').get('innerHTML');
        
        nodes.each(function(n) {
            n.addClass(n._yuid);
            n.setStyle(FONT_FAMILY, '');
            if (n.getAttribute('style') === '') {
                n.removeAttribute('style');
            }
        });
        
        return html;
    };
    /**
    * Resolve a node from the selection object and return a Node instance
    * @static
    * @method resolve
    * @param {HTMLElement} n The HTMLElement to resolve. Might be a TextNode, gives parentNode.
    * @return {Node} The Resolved node
    */
    Y.Selection.resolve = function(n) {
        if (n && n.nodeType === 3) {
            n = n.parentNode;
        }
        return Y.one(n);
    };

    /**
    * The selector to use when looking for Nodes to cache the value of: [style],font[face]
    * @static
    * @property ALL
    */
    Y.Selection.ALL = '[style],font[face]';
    /**
    * The temporary fontname applied to a selection to retrieve their values: yui-tmp
    * @static
    * @property TMP
    */
    Y.Selection.TMP = 'yui-tmp';
    /**
    * The default tag to use when creating elements: span
    * @static
    * @property DEFAULT_TAG
    */
    Y.Selection.DEFAULT_TAG = 'span';

    Y.Selection.prototype = {
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
            var tmp = Y.Node.create('<' + tag + '></' + tag + '>');
            tmp.set(INNER_HTML, n.get(INNER_HTML));
            n.set(INNER_HTML, '');
            n.append(tmp);
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
            var tmp = Y.Node.create('<' + tag + '></' + tag + '>');
            tmp.set(INNER_HTML, n.get(INNER_HTML));
            n.replace(tmp, n);
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
            Y.Selection.filter();
            Y.config.doc.execCommand('fontname', null, Y.Selection.TMP);
            var nodes = Y.all(Y.Selection.ALL),
                items = [];

            nodes.each(function(n, k) {
                if (n.getStyle(FONT_FAMILY, Y.Selection.TMP)) {
                    n.setStyle(FONT_FAMILY, '');
                    n.removeAttribute('face');
                    if (n.getAttribute('style') === '') {
                        n.removeAttribute('style');
                    }
                    items.push(Y.Node.getDOMNode(nodes.item(k)));
                }
            });
            return Y.all(items);
        },
        /**
        * Insert HTML at the current cursor position and return a Node instance of the newly inserted element.
        * @method insertContent
        * @param {String} html The HTML to insert.
        * @return {Node} The inserted Node.
        */
        insertContent: function(html) {
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
            var cur = Y.Node.create('<' + Y.Selection.DEFAULT_TAG + ' class="yui-non"></' + Y.Selection.DEFAULT_TAG + '>'),
                inHTML = node.get(textContent), txt, txt2, newNode;
            
            //TODO using Y.Node.create here throws warnings & strips first white space character
            //txt = Y.one(Y.Node.create(inHTML.substr(0, offset)));
            //txt2 = Y.one(Y.Node.create(inHTML.substr(offset)));
            txt = Y.one(Y.config.doc.createTextNode(inHTML.substr(0, offset)));
            txt2 = Y.one(Y.config.doc.createTextNode(inHTML.substr(offset)));
            
            node.replace(txt, node);
            newNode = Y.Node.create(html);
            txt.insert(newNode, 'after');
            newNode.insert(cur, 'after');
            cur.insert(txt2, 'after');
            this.selectNode(cur, collapse);
            return newNode;
        },
        /**
        * Get all elements inside a selection and wrap them with a new element and return a NodeList of all elements touched.
        * @method wrapContent
        * @param {String} tag The tag to wrap all selected items with.
        * @return {NodeList} A NodeList of all items in the selection.
        */
        wrapContent: function(tag) {
            tag = (tag) ? tag : Y.Selection.DEFAULT_TAG;

            if (!this.isCollapsed) {
                Y.log('Wrapping selection with: ' + tag, 'info', 'selection');
                var items = this.getSelected(),
                    changed = [], range, last, first, range2;

                items.each(function(n, k) {
                    var t = n.get('tagName').toLowerCase();
                    if (t === 'font') {
                        changed.push(this._swap(items.item(k), tag));
                    } else {
                        changed.push(this._wrap(items.item(k), tag));
                    }
                }, this);
                
		        range = this.createRange();
                first = changed[0];
                last = changed[changed.length - 1];
                if (this._selection.removeAllRanges) {
                    range.setStart(changed[0], 0);
                    range.setEnd(last, last.childNodes.length);
                    this._selection.removeAllRanges();
                    this._selection.addRange(range);
                } else {
                    range.moveToElementText(Y.Node.getDOMNode(first));
                    range2 = this.createRange();
                    range2.moveToElementText(Y.Node.getDOMNode(last));
                    range.setEndPoint('EndToEnd', range2);
                    range.select();
                }

                changed = Y.all(changed);
                Y.log('Returning NodeList with (' + changed.size() + ') item(s)' , 'info', 'selection');
                return changed;


            } else {
                Y.log('Can not wrap a collapsed selection, use insertContent', 'error', 'selection');
                return Y.all([]);
            }
        },
        /**
        * Find and replace a string inside a text node and replace it with HTML focusing the node after 
        * to allow you to continue to type.
        * @method replace
        * @param {String} se The string to search for.
        * @param {String} re The string of HTML to replace it with.
        * @param {Node} node A Node instance of the text node to interact with.
        * @return {Node} The node inserted.
        */
        replace: function(se,re,node) {
            Y.log('replacing (' + se + ') with (' + re + ')');
            var txt = node.get(textContent),
                index = txt.indexOf(se),
                newNode;

            txt = txt.replace(se, '');
            node.set(textContent, txt);
            newNode = this.insertAtCursor(re, node, index, true);
            return newNode;
        },
        /**
        * Destroy the range.
        * @method remove
        * @chainable
        * @return {Y.Selection}
        */
        remove: function() {
            this._selection.removeAllRanges();
            return this;
        },
        /**
        * Wrapper for the different range creation methods.
        * @method createRange
        * @return {RangeObject}
        */
        createRange: function() {
            if (Y.config.doc.selection) {
                return Y.config.doc.selection.createRange();
            } else {
		        return Y.config.doc.createRange();
            }
        },
        /**
        * Select a Node (hilighting it).
        * @method selectNode
        * @param {Node} node The node to select
        * @param {Boolean} collapse Should the range be collapsed after insertion. default: false
        * @chainable
        * @return {Y.Selection}
        */
        selectNode: function(node, collapse, end) {
            end = end || 0;
            node = Y.Node.getDOMNode(node);
		    var range = this.createRange();
            if (range.selectNode) {
                range.selectNode(node);
                this._selection.removeAllRanges();
                this._selection.addRange(range);
                if (collapse) {
                    try {
                        this._selection.collapse(node, end);
                    } catch (e) {
                        this._selection.collapse(node, 0);
                    }
                }
            } else {
                range.moveToElementText(node);
                range.select();
                if (collapse) {
                    range.collapse(((end) ? false : true));
                }
            }
            return this;
        },
        /**
        * Put a placeholder in the DOM at the current cursor position: NOT FINISHED
        * @method setCursor
        * @return {Node}
        */
        setCursor: function() {
            return this.insertContent(Y.Selection.CURSOR);
        },
        /**
        * Get the placeholder in the DOM at the current cursor position: NOT FINISHED
        * @method getCursor
        * @return {Node}
        */
        getCursor: function() {
            return Y.one('#' + Y.Selection.CURID);
        },
        /**
        * Generic toString for logging.
        * @method toString
        * @return {String}
        */
        toString: function() {
            return 'Selection Object';
        }
    };
});
