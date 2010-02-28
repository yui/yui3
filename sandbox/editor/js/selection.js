YUI.add('selection', function(Y) {
    /**
     * Wraps some common Selection/Range functionality into a simple object
     * @module selection
     */     
    /**
     * Wraps some common Selection/Range functionality into a simple object
     * @class Selection
     * @constructor
     */
    
    /**
    * Resolve a node from the selection object and return a Node instance
    * @private
    * @method resolve
    * @param HTMLElement n The HTMLElement to resolve. Might be a TextNode.
    * @return Node
    * @type Node
    */
    var resolve = function(n) {
        if (n && n.nodeType === 3) {
            n = n.parentNode;
        }
        return Y.one(n);
    }, textContent = 'textContent',
    INNER_HTML = 'innerHTML',
    FONT_FAMILY = 'fontFamily';


    Y.Selection = function() {
        var sel, el;
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
                sel.pasteHTML(Y.Selection.CURSOR);
                el = Y.one('#' + Y.Selection.CURID).previous(function(n) {
                    if (n.get('nodeType') === 3) {
                        return true;
                    }
                }, true);

                this.anchorNode = resolve(Y.Node.getDOMNode(el));
                this.focusNode = resolve(Y.Node.getDOMNode(el));
                
                this.anchorOffset = this.focusOffset = el.get('nodeValue.length');
                
                this.anchorTextNode = this.focusTextNode = el;
                Y.one('#' + Y.Selection.CURID).remove();
            }
            
            //var self = this;
            //debugger;
        } else {
            this.isCollapsed = sel.isCollapsed;
            this.anchorNode = resolve(sel.anchorNode);
            this.focusNode = resolve(sel.focusNode);
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
        var nodes = Y.all(Y.Selection.ALL);
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
        var baseNodes = Y.all('strong,em');
        baseNodes.each(function(n, k) {
            var t = n.get('tagName').toLowerCase(),
                newTag = 'i';
            if (t === 'strong') {
                newTag = 'b';
            }
            Y.Selection.prototype._swap(baseNodes.item(k), newTag);
        });
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
    /**
    * The DOM id of the tmp node inserted into the doc to track the cursor: __CUR__
    * @static
    * @property CURID
    */
    Y.Selection.CURID = '__CUR__';
    /**
    * The HTML used to create the temporary cursor.
    * @static
    * @property CURSOR
    */
    Y.Selection.CURSOR = '<' + Y.Selection.DEFAULT_TAG + ' id="' + Y.Selection.CURID + '" style="height: 0; line-height: 0; font-size: 0;"> </' + Y.Selection.DEFAULT_TAG + '>';

    Y.Selection.prototype = {
        /**
        * Range text value
        * @property text
        */
        text: null,
        /**
        * Flag to show if the range is collapsed or not
        * @property isCollapsed
        */
        isCollapsed: null,
        /**
        * A Node instance of the parentNode of the anchorNode of the range
        * @property anchorNode
        */
        anchorNode: null,
        /**
        * The offset from the range object
        * @property anchorOffset
        */
        anchorOffset: null,
        /**
        * A Node instance of the actual textNode of the range.
        * @property anchorTextNode
        */
        anchorTextNode: null,
        /**
        * A Node instance of the parentNode of the focusNode of the range
        * @property focusNode
        */
        focusNode: null,
        /**
        * The offset from the range object
        * @property focusOffset
        */
        focusOffset: null,
        /**
        * A Node instance of the actual textNode of the range.
        * @property focusTextNode
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
        * @param HTMLElement n The node to wrap 
        * @param String tag The tag to use when creating the new element.
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
        * @param HTMLElement n The node to swap 
        * @param String tag The tag to use when creating the new element.
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
        * @return NodeList
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
                    items.push(nodes.item(k));
                }
            });
            return Y.all(items);
        },
        /**
        * Insert HTML at the current cursor position and return a Node instance of the newly inserted element.
        * @method insertContent
        * @param String html The HTML to insert.
        * @return Node
        */
        insertContent: function(html) {
            if (this.isCollapsed) {
                var node = this.insertAtCursor(html, this.anchorTextNode, this.anchorOffset);
                return node;
            } else {
                Y.log('Can not insert into a non-collapsed selection, use wrapContent', 'error', 'selection');
                return null;
            }
        },
        /**
        * Insert HTML at the current cursor position, this method gives you control over the text node to insert into and the offset where to put it.
        * @method insertAtCursor
        * @param String html The HTML to insert.
        * @param Node node The text node to break when inserting.
        * @param Number offset The left offset of the text node to break and insert the new content.
        * @return Node
        */
        insertAtCursor: function(html, node, offset) {
            var cur = Y.Node.create('<' + Y.Selection.DEFAULT_TAG + ' class="yui-non"></' + Y.Selection.DEFAULT_TAG + '>'),
                inHTML = node.get(textContent), txt, txt2;
            
            txt = Y.one(Y.config.doc.createTextNode(inHTML.substr(0, offset)));
            txt2 = Y.one(Y.config.doc.createTextNode(inHTML.substr(offset)));
            
            node.replace(txt, node);
            var newNode = Y.Node.create(html);
            txt.insert(newNode, 'after');
            newNode.insert(cur, 'after');
            cur.insert(txt2, 'after');
            this.selectNode(cur);
            return newNode;
        },
        /**
        * Get all elements inside a selection and wrap them with a new element and return a NodeList of all elements touched.
        * @method wrapContent
        * @param String tag The tag to wrap all selected items with.
        * @return NodeList
        */
        wrapContent: function(tag) {
            tag = (tag) ? tag : Y.Selection.DEFAULT_TAG;

            if (!this.isCollapsed) {
                Y.log('Wrapping selection with: ' + tag, 'info', 'selection');
                var items = this.getSelected(),
                    changed = [], range, last, first;

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
                    var range2 = this.createRange();
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
        * @param String se The string to search for.
        * @param String re The string of HTML to replace it with.
        * @param Node node A Node instance of the text node to interact with.
        * @return Node
        */
        replace: function(se,re,node) {
            Y.log('replacing (' + se + ') with (' + re + ')');
            var txt = node.get(textContent),
                index = txt.indexOf(se),
                len = txt.length;

            txt = txt.replace(se, '');
            node.set(textContent, txt);
            var newNode = this.insertAtCursor(re, node, index);
            return newNode;
        },
        /**
        * Destroy the range.
        * @method remove
        */
        remove: function() {
            this._selection.removeAllRanges();
            return this;
        },
        /**
        * Wrapper for the different range creation methods.
        * @method createRange
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
        * @param Node node The node to select
        */
        selectNode: function(node) {
		    var range = this.createRange();
            if (range.selectNode) {
                range.selectNode(Y.Node.getDOMNode(node));
                this._selection.removeAllRanges();
                this._selection.addRange(range);
            } else {
                range.select(Y.Node.getDOMNode(node));
            }
        },
        /**
        * Put a placeholder in the DOM at the current cursor position: NOT FINISHED
        * @method setCursor
        * @return Node
        */
        setCursor: function() {
            return this.insertContent(Y.Selection.CURSOR);
        },
        /**
        * Get the placeholder in the DOM at the current cursor position: NOT FINISHED
        * @method getCursor
        * @return Node
        */
        getCursor: function() {
            return Y.one('#' + Y.Selection.CURID);
        }
    };
});
