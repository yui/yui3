YUI.add('selection', function(Y) {

    var resolve = function(n) {
        if (n.nodeType === 3) {
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
        setContent: function(html) {
            if (this.isCollapsed) {
                //handle insert
                var out_html = '';
                var inHTML = this.anchorNode.get('innerHTML');
                
                out_html = inHTML.substr(0, this.anchorOffset);
                out_html += html;
                out_html += inHTML.substr(this.anchorOffset);

                this.anchorNode.set('innerHTML', out_html);
            }
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
        setCursor: function() {
		    var range = Y.config.doc.createRange();
		    range.setStart(this._selection.anchorNode, this._selection.anchorOffset);
		    range.setEnd(this._selection.focusNode, this._selection.focusOffset);
        }
    };

});
