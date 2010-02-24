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
                Y.log('Can not insert into a non-collapsed selection', 'error', 'selection');
            }
        },
        wrapContent: function(tag) {
            if (!this.isCollapsed) {
                Y.log('Wrapping selection with: ' + tag, 'info', 'selection');
                var r = this.getRangeAt(),
                    par = r.commonAncestorContainer,
                    childs = Y.all(par.childNodes),
                    items = [], parse = false,
                    sNode = Y.one(r.startContainer),
                    eNode = Y.one(r.endContainer),
                    sPar , ePar,
                    changed = [];

                console.log(this._selection);
                console.log(r);

                if (sNode === eNode) {
                    Y.log('Start & end are the same', 'info', 'selection');
                    var out_html = '',
                        inHTML = sNode.get('textContent');
                    
                    out_html = '<span>' + inHTML.substr(0, r.startOffset);
                    out_html += '<' + tag + '>' + inHTML.substr(r.startOffset, (r.endOffset - r.startOffset)) + '</' + tag + '>';
                    out_html += inHTML.substr(r.endOffset) + '</span>';
                    var node = Y.Node.create(out_html);
                    sNode.replace(node, r.startContainer);
                    return;
                }

                childs.each(function(n, k) {
                    if (n.contains(sNode)) {
                        parse = true;
                        sPar = n;
                    }
                    if (parse) {
                        //start + between + end elements
                        if (childs.item(k).get('textContent') !== "\n") {
                            items.push(childs.item(k));
                        }
                    }
                    if (n.contains(eNode)) {
                        ePar = n;
                        parse = false;
                    }
                });
                console.log('items: ', items);
                items = Y.all(items);
                items.each(function(n) {
                    if (n !== sPar && n !== ePar) {
                        var ch = this._wrap(n, tag);
                        if (Y.Lang.isArray(ch)) {
                            Y.each(ch, function(c) {
                                changed.push(c)
                            });
                        } else {
                            changed.push(ch);
                        }
                    }
                }, this);

                var sChilds = sPar.get('childNodes'), parse = false;
                console.log('sChilds: ', sChilds);
                Y.each(sChilds, function(s) {
                    if (parse) {
                        console.log('sChilds(s): ', s);
                        this._wrap(s, tag);
                    }
                    if (s === sNode) {
                        parse = true;
                        var html = '<span>', txt = sNode.get('textContent');
                        html += txt.substring(0, r.startOffset);
                        html += '<' + tag + '>' + txt.substring(r.startOffset) + '</' + tag + '>';
                        html += '</span>';
                        console.log(html);
                        var tmp = Y.Node.create(html);
                        changed.push(tmp);
                        sNode.replace(tmp, sNode);
                    }
                    
                }, this);

                var eChilds = ePar.get('childNodes'), parse = false;
                console.log('eChilds: ', eChilds);
                Y.each(eChilds, function(s) {
                    if (parse) {
                        console.log('eChilds(s): ', s);
                        this._wrap(s, tag);
                    }
                    if (s === eNode) {
                        parse = true;
                        var html = '<span>', txt = eNode.get('textContent');
                        html += '<' + tag + '>' + txt.substring(0, r.endOffset) + '</' + tag + '>';
                        html += txt.substring(r.endOffset);
                        html += '</span>';
                        console.log(html);
                        var tmp = Y.Node.create(html);
                        changed.push(tmp.get('firstChild'));
                        eNode.replace(tmp, eNode);
                    }
                    
                }, this);

                console.log('items: ', items);
                console.log('changed: ', changed);
                console.log(sPar, sNode);
                console.log(ePar, eNode);

            } else {
                Y.log('Can not wrap a collapsed selection', 'error', 'selection');
            }
        },
        _wrap: function(n, tag) {
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
                    console.log('textNode');
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
