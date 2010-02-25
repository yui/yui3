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
                var r = this.getRangeAt(),
                    par = r.commonAncestorContainer,
                    childs = [],
                    items = [], parse = false,
                    sNode = Y.one(r.startContainer),
                    eNode = Y.one(r.endContainer),
                    sPar , ePar,
                    changed = [];

                console.log(this._selection);
                console.log(r);

                console.log('start: ', sNode);
                console.log('end: ', eNode);
                if (((sNode === eNode) || r.endOffset === 0) && !sNode.test('body')) {
                    Y.log('Start & end are the same', 'info', 'selection');
                    var txt = sNode.get('textContent'),
                        end = r.endOffset;
                    if (end === 0) {
                        end = txt.length;
                    }
                    var first = Y.one(Y.config.doc.createTextNode(txt.substring(0, r.startOffset)));
                    var html = '<' + tag + '>' + txt.substring(r.startOffset, end) + '</' + tag + '>';
                    var last = Y.one(Y.config.doc.createTextNode(txt.substring(end)));
                    var tmp = Y.Node.create(html);
                    sNode.replace(first, sNode);
                    first.insert(tmp, 'after');
                    tmp.insert(last, 'after');
                    changed.push(tmp);
                    return changed;
                }

                if (sNode.get('nodeType') === 3) {
                    //Text Node
                    var txt = sNode.get('textContent');
                    var first = Y.one(Y.config.doc.createTextNode(txt.substring(0, r.startOffset)));
                    var html = '<' + tag + '>' + txt.substring(r.startOffset) + '</' + tag + '>';
                    var tmp = Y.Node.create(html);
                    sNode.replace(first, sNode);
                    first.insert(tmp, 'after');
                    firstNode = tmp;
                    changed.push(tmp);
                }

                if (eNode.get('nodeType') === 3) {
                    //Text Node
                    var txt = eNode.get('textContent');
                    var html = '<' + tag + '>' + txt.substring(0, r.endOffset) + '</' + tag + '>';
                    var last = Y.one(Y.config.doc.createTextNode(txt.substring(r.endOffset)));
                    var tmp = Y.Node.create(html);
                    eNode.replace(tmp, eNode);
                    tmp.insert(last, 'after');
                    lastNode = tmp;
                    changed.push(tmp);
                }
                return changed;

                childs = Y.all(this._filterChilds(par.childNodes, sNode, eNode));
                childs.each(function(n) {
                    var ch = this._wrap(n, tag);
                    if (Y.Lang.isArray(ch)) {
                        Y.each(ch, function(c) {
                            changed.push(c)
                        });
                    } else {
                        changed.push(ch);
                    }
                }, this);

                /* {{{ OLD
                childs.each(function(n, k) {
                    if (n.contains(sNode)) {
                        parse = true;
                        sPar = childs.item(k);
                    }
                    if (parse) {
                        //start + between + end elements
                        if (childs.item(k).get('textContent') !== "\n") {
                            items.push(childs.item(k));
                        }
                    }
                    if (n.contains(eNode)) {
                        ePar = childs.item(k);
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
                
                var firstNode, lastNode;

                if (sNode.get('nodeType') === 3) {
                    //Text Node
                    var txt = sNode.get('textContent');
                    var first = Y.one(Y.config.doc.createTextNode(txt.substring(0, r.startOffset)));
                    var html = '<' + tag + '>' + txt.substring(r.startOffset) + '</' + tag + '>';
                    var tmp = Y.Node.create(html);
                    sNode.replace(first, sNode);
                    first.insert(tmp, 'after');
                    firstNode = tmp;
                    changed.push(tmp);
                }

                if (eNode.get('nodeType') === 3) {
                    //Text Node
                    var txt = eNode.get('textContent');
                    var html = '<' + tag + '>' + txt.substring(0, r.endOffset) + '</' + tag + '>';
                    var last = Y.one(Y.config.doc.createTextNode(txt.substring(r.endOffset)));
                    var tmp = Y.Node.create(html);
                    eNode.replace(tmp, eNode);
                    tmp.insert(last, 'after');
                    lastNode = tmp;
                    changed.push(tmp);
                }

                console.log(firstNode, lastNode);
                if (firstNode.get('parentNode') !== lastNode.get('parentNode')) {
                    //Different parents, fill to end and fill from start
                    var fParChilds = firstNode.ancestor(Y.Selection.PARENTS).get('childNodes'), parse = false;
                    console.info(fParChilds);
                    fParChilds.each(function(n) {
                        if (parse) {
                            this._wrap(n, tag);
                        }
                        if (n.contains(firstNode)) {
                            var fChilds = n.get('childNodes'), fparse = false;
                            fChilds.each(function(n) {
                                if (fparse) {
                                    this._wrap(n, tag);
                                }
                                if (n === firstNode) {
                                    fparse = true;
                                }
                            }, this);
                            console.info(fChilds);
                            parse = true;
                        }
                    }, this);
                    
                    var lParChilds = lastNode.ancestor(Y.Selection.PARENTS).get('childNodes'), parse = true;
                    lParChilds.each(function(n) {
                        if (n.contains(lastNode)) {

                            var lChilds = n.get('childNodes'), lparse = true;
                            lChilds.each(function(n) {
                                if (lparse) {
                                    this._wrap(n, tag);
                                }
                                if (n === lastNode) {
                                    lparse = false;
                                }
                            }, this);
                            parse = false;
                        }
                        if (parse) {
                            this._wrap(n, tag);
                        }
                    }, this);

                }
                
                var sChilds = sNode.get('parentNode.childNodes'), parse = false;
                console.log('sChilds: ', sChilds);

                Y.each(sChilds, function(s) {
                    if (parse) {
                        console.log('sChilds(s): ', s);
                        this._wrap(s, tag);
                    }
                    if (s === sNode) {
                        parse = true;
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
                }}} */

                console.log('childs: ', childs);
                //console.log('items: ', items);
                console.log('changed: ', changed);
                //console.log('start: ', sPar, sNode);
                //console.log('end: ', ePar, eNode);

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
