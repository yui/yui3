YUI.add('selection', function(Y) {

    var resolve = function(n) {
        if (n && n.nodeType === 3) {
            n = n.parentNode;
        }
        return Y.one(n);
    };

    Y.Selection = function() {
        var sel;
        if (Y.config.win.getSelection) {
	        sel = Y.config.win.getSelection();
        } else if (Y.config.doc.selection) {
    	    sel = Y.config.doc.selection.createRange();
        }
        this._selection = sel;
        this.anchorNode = resolve(sel.anchorNode);
        this.focusNode = resolve(sel.focusNode);
        this.anchorOffset = sel.anchorOffset;
        this.focusOffset = sel.focusOffset;
        if (sel.text) {
            this.text = sel.text;
        } else {
            this.text = sel.toString();
        }
        this.isCollapsed = sel.isCollapsed;
    };

    Y.Selection.BLOCKS = {
        ul: 'li',
        ol: 'li'
    };

    Y.Selection.filter = function() {
        var nodes = Y.all('[style],font[face]');
        Y.log('Filtering nodes', 'info', 'selection');
        nodes.each(function(n) {
            if (n.getStyle('fontFamily')) {
                var sheet = new Y.StyleSheet('editor');
                sheet.set('.' + n._yuid, {
                    fontFamily: n.getStyle('fontFamily')
                });
                n.addClass(n._yuid);
                n.removeAttribute('face');
                n.setStyle('fontFamily', '');
            }
        });
    };

    Y.Selection.PARENTS = 'p,div,blockquote,body';
    Y.Selection.BAD = 'style,br';

    Y.Selection.prototype = {
        anchorNode: null,
        focusNode: null,
        _selection: null,
        cloneContents: function() {
            return this.getRangeAt(0).cloneContents();
        },
        extractContents: function() {
            return this.getRangeAt(0).extractContents();
        },
        insertContent: function(html) {
            if (this.isCollapsed) {
                //handle insert
                var out_html = '', cur = '<span id="__CUR__" class="yui-non"></span>',
                    inHTML = this._selection.anchorNode.textContent;
                
                out_html = '<span>' + inHTML.substr(0, this.anchorOffset);
                out_html += html + cur;
                out_html += inHTML.substr(this.anchorOffset) + '</span>';
                var node = Y.Node.create(out_html);

                //this._selection.anchorNode.textContent = out_html;
                this.anchorNode.replaceChild(node, this._selection.anchorNode);
                var c = this.anchorNode.one('#__CUR__');
                c.set('id', '');
                this.selectNode(c);
                return node;
            } else {
                Y.log('Can not insert into a non-collapsed selection, use wrapContent', 'error', 'selection');
            }
        },
        _filterChilds: function(childs, sNode, eNode) {
            var newChilds = [], parse = false;
            Y.each(childs, function(n) {
                if (n.nodeType === 3) {
                    //Skipping nodes that are just returns
                    if (n.textContent !== "\n") {
                        newChilds.push(n);
                    }
                } else {
                    var node = Y.one(n);
                    //Filter out bad items
                    if (!node.test(Y.Selection.BAD)) {
                        //If it's the body, allow all
                        if (sNode.test('body')) {
                            newChilds.push(n);
                        } else {
                            //This get's all nodes in between the start and the end
                            if (node.contains(eNode)) {
                                parse = false;
                            }
                            if (parse) {
                                newChilds.push(n);
                            }
                            if (node.contains(sNode)) {
                                parse = true;
                            }
                        }
                    }
                }
            });
            return newChilds;
        },
        wrapContent: function(tag) {
            if (!this.isCollapsed) {
                Y.log('Wrapping selection with: ' + tag, 'info', 'selection');
                Y.Selection.filter();
                Y.config.doc.execCommand('fontname', null, 'yui-tmp');
                var nodes = Y.all('[style],font[face]'),
                    items = changed = [];
                nodes.each(function(n, k) {
                    if (n.getStyle('fontFamily', 'yui-tmp')) {
                        n.setStyle('fontFamily', '');
                        n.removeAttribute('face');
                        items.push(nodes.item(k));
                    }
                });
                items = Y.all(items);
                items.each(function(n, k) {
                    var t = n.get('tagName').toLowerCase();
                    switch (t) {
                        case 'font':
                            break;
                    }
                });
                console.log(changed);
                return changed;


            } else {
                Y.log('Can not wrap a collapsed selection, use insertContent', 'error', 'selection');
            }
        },
        _wrap: function(n, tag) {
            tag = (tag) ? tag : 'span';
            var childTag;
            if (n.get('nodeType') !== 3) {
                childTag = Y.Selection.BLOCKS[n.get('tagName').toLowerCase()];
            }
            if (childTag) {
                var childs = n.all(childTag), changed = [];
                childs.each(function(c) {
                    changed.push(this._wrap(c, tag));
                }, this);
                return changed;
            } else {
                console.log('wrap ', n, ' with ', tag);
                if (n.get('nodeType') === 3) {
                    var span = Y.Node.create('<' + tag + '>' + n.get('textContent') + '</' + tag + '>');
                    n.replace(span, n);
                } else {
                    n.set('innerHTML', '<' + tag + '>' + n.get('innerHTML') + '</' + tag + '>');
                }
                return n.get('firstChild');
            }
        },
        remove: function() {
            this._selection.removeAllRanges();
            return this;
        },
        getRangeAt: function() {
            if (this._selection.getRangeAt) {
		        return this._selection.getRangeAt(0);
            } else {
		        var range = Y.config.doc.createRange();
		        range.setStart(this._selection.anchorNode, this._selection.anchorOffset);
		        range.setEnd(this._selection.focusNode, this._selection.focusOffset);
		        return range;
            }
        },
        selectNode: function(node) {
		    var range = Y.config.doc.createRange();
            range.selectNode(Y.Node.getDOMNode(node));
            this._selection.removeAllRanges();
            this._selection.addRange(range);
        },
        setCursor: function() {
		    var range = Y.config.doc.createRange();
		    range.setStart(this._selection.anchorNode, this._selection.anchorOffset);
		    range.setEnd(this._selection.focusNode, this._selection.focusOffset);
        }
    };

});
