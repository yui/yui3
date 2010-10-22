Y.mix(Y.ScrollView.prototype, {

    _fixIESelect : function(bb, cb) {
        this._cbDoc = cb.get("ownerDocument");
        this._nativeBody = Y.Node.getDOMNode(Y.one("body", this._cbDoc));

        cb.on("mousedown", function() {
            this._selectstart = this._nativeBody.onselectstart;
            this._nativeBody.onselectstart = this._iePreventSelect;
            this._cbDoc.once("mouseup", this._ieRestoreSelect, this);
        }, this);
    },
    
    /**
     * Native onselectstart handle to prevent selection in IE
     *
     * @method _iePreventSelect
     * @private
     */
    _iePreventSelect : function() {
        return false;
    },

    /**
     * Restores native onselectstart handle, backed up to prevent selection in IE
     *
     * @method _ieRestoreSelect
     * @private
     */
    _ieRestoreSelect : function() {
        this._nativeBody.onselectstart = this._selectstart;
    }
}, true);