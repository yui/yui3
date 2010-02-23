YUI.add('selection', function(Y) {

    Y.Selection = function() {
        var sel;
        if (Y.config.win.getSelection) {
	        sel = Y.config.win.getSelection();
        } else if (Y.config.doc.selection) {
    	    sel = Y.config.doc.selection.createRange();
        }
        this._selection = sel;
    };

    Y.Selection.prototype = {
        _selection: null,
        getRangeAt: function() {
            if (this._selection.getRangeAt) {
		        return this._selection.getRangeAt(0);
            } else {
		        var range = Y.config.doc.createRange();
		        range.setStart(this._selection.anchorNode, this._selection.anchorOffset);
		        range.setEnd(this._selection.focusNode, this._selection.focusOffset);
		        return range;
            }
        }
    };

});
