YUI.add('selection', function(Y) {

    var resolve = function(n) {
        if (n && n.nodeType === 3) {
            n = n.parentNode;
        }
        return Y.one(n);
    }, textContent = 'textContent';


    Y.Selection = function() {
        var sel, el;
        if (Y.config.win.getSelection) {
	        sel = Y.config.win.getSelection();
        } else if (Y.config.doc.selection) {
    	    sel = Y.config.doc.selection.createRange();
        }
        this._selection = sel;
        
        if (Y.UA.ie) {
            textContent = 'nodeValue';
            this.isCollapsed = (sel.compareEndPoints('StartToEnd', sel)) ? false : true;

            if (this.isCollapsed) {
                sel.pasteHTML('<span id="__CUR__" style="height: 0; line-height: 0; font-size: 0;"> </span>');
                el = Y.one('#__CUR__').previous(function(n) {
                    if (n.get('nodeType') === 3) {
                        return true;
                    }
                }, true);

                this.anchorNode = resolve(Y.Node.getDOMNode(el));
                this.focusNode = resolve(Y.Node.getDOMNode(el));
                
                this.anchorOffset = el.get('nodeValue.length');
                this.focusOffset = el.get('nodeValue.length');
                
                this.anchorTextNode = el;
                this.focusTextNode = el;
                Y.one('#__CUR__').remove();
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
                if (n.getAttribute('style') === '') {
                    n.removeAttribute('style');
                }
            }
        });
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
                var node = this.insertAtCursor(html, this.anchorTextNode, this.anchorOffset);
                return node;
            } else {
                Y.log('Can not insert into a non-collapsed selection, use wrapContent', 'error', 'selection');
                return null;
            }
        },
        insertAtCursor: function(html, node, offset) {
            var cur = Y.Node.create('<span class="yui-non"></span>'),
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
        getSelected: function() {
            Y.Selection.filter();
            Y.config.doc.execCommand('fontname', null, 'yui-tmp');
            var nodes = Y.all('[style],font[face]'),
                items = [];

            nodes.each(function(n, k) {
                if (n.getStyle('fontFamily', 'yui-tmp')) {
                    n.setStyle('fontFamily', '');
                    n.removeAttribute('face');
                    if (n.getAttribute('style') === '') {
                        n.removeAttribute('style');
                    }
                    items.push(nodes.item(k));
                }
            });
            return Y.all(items);
        },
        wrapContent: function(tag) {
            tag = (tag) ? tag : 'span';

            if (!this.isCollapsed) {
                Y.log('Wrapping selection with: ' + tag, 'info', 'selection');
                var items = this.getSelected(),
                    changed = [], range, last, first;

                items.each(function(n, k) {
                    var t = n.get('tagName').toLowerCase();
                    switch (t) {
                        case 'font':
                            changed.push(this._swap(items.item(k), tag));
                            break;
                        default:
                            changed.push(this._wrap(items.item(k), tag));
                            break;
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
        _wrap: function(n, tag) {
            var tmp = Y.Node.create('<' + tag + '></' + tag + '>');
            tmp.set('innerHTML', n.get('innerHTML'));
            n.set('innerHTML', '');
            n.append(tmp);
            return Y.Node.getDOMNode(tmp);
        },
        _swap: function(n, tag) {
            var tmp = Y.Node.create('<' + tag + '></' + tag + '>');
            tmp.set('innerHTML', n.get('innerHTML'));
            n.replace(tmp, n);
            return Y.Node.getDOMNode(tmp);
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
        createRange: function() {
            if (Y.config.doc.selection) {
                return Y.config.doc.selection.createRange();
            } else {
		        return Y.config.doc.createRange();
            }
        },
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
        setCursor: function() {
		    var range = this.createRange();
		    range.setStart(this._selection.anchorNode, this._selection.anchorOffset);
		    range.setEnd(this._selection.focusNode, this._selection.focusOffset);
        }
    };

});
