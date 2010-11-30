/**
 * The DataTable widget provides a progressively enhanced DHTML control for
 * displaying tabular data across A-grade browsers.
 *
 * @module datatable
 */

/**
 * Provides the base DataTable implementation, which can be extended to add
 * additional functionality, such as sorting or scrolling.
 *
 * @module datatable
 * @submodule datatable-base
 */

/**
 * Base class for the DataTable widget.
 * @class DataTable.Base
 * @extends Widget
 * @constructor
 */
function DTBase(config) {
    DTBase.superclass.constructor.apply(this, arguments);
}

/////////////////////////////////////////////////////////////////////////////
//
// STATIC PROPERTIES
//
/////////////////////////////////////////////////////////////////////////////
Y.mix(DTBase, {

    /**
     * Class name.
     *
     * @property NAME
     * @type String
     * @static
     * @final
     * @value "dataTable"
     */
    NAME:  "dataTable",

/////////////////////////////////////////////////////////////////////////////
//
// ATTRIBUTES
//
/////////////////////////////////////////////////////////////////////////////
    ATTRS: {
        /**
        * @attribute columnset
        * @description Pointer to Columnset instance.
        * @type Array | Y.Columnset
        */
        columnset: {
            setter: "_setColumnset"
        },

        /**
        * @attribute recordset
        * @description Pointer to Recordset instance.
        * @type Array | Y.Recordset
        */
        recordset: {
            value: new Y.Recordset({records:[]}),
            setter: "_setRecordset"
        },

        /*TODO
        * @attribute state
        * @description Internal state.
        * @readonly
        * @type
        */
        /*state: {
            value: new Y.State(),
            readOnly: true

        },*/

        /**
        * @attribute summary
        * @description Summary.
        * @type String
        */
        summary: {
        },

        /**
        * @attribute caption
        * @description Caption
        * @type String
        */
        caption: {
        },

        /**
        * @attribute thValueTemplate
        * @description Tokenized markup template for TH value.
        * @type String
        * @default '{value}'
        */
        thValueTemplate: {
            value: TEMPLATE_VALUE
        },

        /**
        * @attribute tdValueTemplate
        * @description Tokenized markup template for TD value.
        * @type String
        * @default '{value}'
        */
        tdValueTemplate: {
            value: TEMPLATE_VALUE
        },

        /**
        * @attribute trTemplate
        * @description Tokenized markup template for TR node creation.
        * @type String
        * @default '<tr id="{id}"></tr>'
        */
        trTemplate: {
            value: TEMPLATE_TR
        }
    },

/////////////////////////////////////////////////////////////////////////////
//
// TODO: HTML_PARSER
//
/////////////////////////////////////////////////////////////////////////////
    HTML_PARSER: {
        /*caption: function (srcNode) {
            
        }*/
    }
});

/////////////////////////////////////////////////////////////////////////////
//
// PROTOTYPE
//
/////////////////////////////////////////////////////////////////////////////
Y.extend(DTBase, Y.Widget, {
    /**
    * @property thTemplate
    * @description Tokenized markup template for TH node creation.
    * @type String
    * @default '<th id="{id}" rowspan="{rowspan}" colspan="{colspan}"><div class="'+CLASS_LINER+'">{value}</div></th>'
    */
    thTemplate: TEMPLATE_TH,

    /**
    * @property tdTemplate
    * @description Tokenized markup template for TD node creation.
    * @type String
    * @default '<td headers="{headers}"><div class="'+CLASS_LINER+'">{value}</div></td>'
    */
    tdTemplate: TEMPLATE_TD,
    
    /**
    * @property _theadNode
    * @description Pointer to THEAD node.
    * @type Y.Node
    * @private
    */
    _theadNode: null,
    
    /**
    * @property _tbodyNode
    * @description Pointer to TBODY node.
    * @type Y.Node
    * @private
    */
    _tbodyNode: null,
    
    /**
    * @property _msgNode
    * @description Pointer to message display node.
    * @type Y.Node
    * @private
    */
    _msgNode: null,

    /////////////////////////////////////////////////////////////////////////////
    //
    // ATTRIBUTE HELPERS
    //
    /////////////////////////////////////////////////////////////////////////////
    /**
    * @method _setColumnset
    * @description Converts Array to Y.Columnset.
    * @param columns {Array | Y.Columnset}
    * @returns Y.Columnset
    * @private
    */
    _setColumnset: function(columns) {
        return YLang.isArray(columns) ? new Y.Columnset({definitions:columns}) : columns;
    },

    /**
     * Updates the UI if Columnset is changed.
     *
     * @method _afterColumnsetChange
     * @param e {Event} Custom event for the attribute change.
     * @protected
     */
    _afterColumnsetChange: function (e) {
        if(this.get("rendered")) {
            this._uiSetColumnset(e.newVal);
        }
    },

    /**
    * @method _setRecordset
    * @description Converts Array to Y.Recordset.
    * @param records {Array | Y.Recordset}
    * @returns Y.Recordset
    * @private
    */
    _setRecordset: function(rs) {
        if(YLang.isArray(rs)) {
            rs = new Y.Recordset({records:rs});
        }

        rs.addTarget(this);
        return rs;
    },
    
    /**
    * Updates the UI if Recordset is changed.
    *
    * @method _afterRecordsetChange
    * @param e {Event} Custom event for the attribute change.
    * @protected
    */
    _afterRecordsetChange: function (e) {
        if(this.get("rendered")) {
            this._uiSetRecordset(e.newVal);
        }
    },

    /**
     * Updates the UI if summary is changed.
     *
     * @method _afterSummaryChange
     * @param e {Event} Custom event for the attribute change.
     * @protected
     */
    _afterSummaryChange: function (e) {
        if(this.get("rendered")) {
            this._uiSetSummary(e.newVal);
        }
    },

    /**
     * Updates the UI if caption is changed.
     *
     * @method _afterCaptionChange
     * @param e {Event} Custom event for the attribute change.
     * @protected
     */
    _afterCaptionChange: function (e) {
        if(this.get("rendered")) {
            this._uiSetCaption(e.newVal);
        }
    },

    /////////////////////////////////////////////////////////////////////////////
    //
    // METHODS
    //
    /////////////////////////////////////////////////////////////////////////////
    /**
    * Initializer.
    *
    * @method initializer
    * @param config {Object} Config object.
    * @private
    */
    initializer: function(config) {
        this.after("columnsetChange", this._afterColumnsetChange);
        this.after("recordsetChange", this._afterRecordsetChange);
        this.after("summaryChange", this._afterSummaryChange);
        this.after("captionChange", this._afterCaptionChange);
    },

    /**
    * Destructor.
    *
    * @method destructor
    * @private
    */
    destructor: function() {
         this.get("recordset").removeTarget(this);
    },
    
    ////////////////////////////////////////////////////////////////////////////
    //
    // RENDER
    //
    ////////////////////////////////////////////////////////////////////////////

    /**
    * Renders UI.
    *
    * @method renderUI
    * @private
    */
    renderUI: function() {
        // TABLE
        return (this._addTableNode(this.get("contentBox")) &&
        // COLGROUP
        this._addColgroupNode(this._tableNode) &&
        // THEAD
        this._addTheadNode(this._tableNode) &&
        // Primary TBODY
        this._addTbodyNode(this._tableNode) &&
        // Message TBODY
        this._addMessageNode(this._tableNode) &&
        // CAPTION
        this._addCaptionNode(this._tableNode));
   },

    /**
    * Creates and attaches TABLE element to given container.
    *
    * @method _addTableNode
    * @param containerNode {Y.Node} Parent node.
    * @protected
    * @returns Y.Node
    */
    _addTableNode: function(containerNode) {
        if (!this._tableNode) {
            this._tableNode = containerNode.appendChild(Ycreate(TEMPLATE_TABLE));
        }
        return this._tableNode;
    },

    /**
    * Creates and attaches COLGROUP element to given TABLE.
    *
    * @method _addColgroupNode
    * @param tableNode {Y.Node} Parent node.
    * @protected
    * @returns Y.Node
    */
    _addColgroupNode: function(tableNode) {
        // Add COLs to DOCUMENT FRAGMENT
        var len = this.get("columnset").keys.length,
            i = 0,
            allCols = ["<colgroup>"];

        for(; i<len; ++i) {
            allCols.push(TEMPLATE_COL);
        }

        allCols.push("</colgroup>");

        // Create COLGROUP
        this._colgroupNode = tableNode.insertBefore(Ycreate(allCols.join("")), tableNode.get("firstChild"));

        return this._colgroupNode;
    },

    /**
    * Creates and attaches THEAD element to given container.
    *
    * @method _addTheadNode
    * @param tableNode {Y.Node} Parent node.
    * @protected
    * @returns Y.Node
    */
    _addTheadNode: function(tableNode) {
        if(tableNode) {
            this._theadNode = tableNode.insertBefore(Ycreate(TEMPLATE_THEAD), this._colgroupNode.next());
            return this._theadNode;
        }
    },

    /**
    * Creates and attaches TBODY element to given container.
    *
    * @method _addTbodyNode
    * @param tableNode {Y.Node} Parent node.
    * @protected
    * @returns Y.Node
    */
    _addTbodyNode: function(tableNode) {
        this._tbodyNode = tableNode.appendChild(Ycreate(TEMPLATE_TBODY));
        return this._tbodyNode;
    },

    /**
    * Creates and attaches message display element to given container.
    *
    * @method _addMessageNode
    * @param tableNode {Y.Node} Parent node.
    * @protected
    * @returns Y.Node
    */
    _addMessageNode: function(tableNode) {
        this._msgNode = tableNode.insertBefore(Ycreate(TEMPLATE_MSG), this._tbodyNode);
        return this._msgNode;
    },

    /**
    * Creates and attaches CAPTION element to given container.
    *
    * @method _addCaptionNode
    * @param tableNode {Y.Node} Parent node.
    * @protected
    * @returns Y.Node
    */
    _addCaptionNode: function(tableNode) {
        this._captionNode = tableNode.createCaption();
        return this._captionNode;
    },

    ////////////////////////////////////////////////////////////////////////////
    //
    // BIND
    //
    ////////////////////////////////////////////////////////////////////////////

    /**
    * Binds events.
    *
    * @method bindUI
    * @private
    */
    bindUI: function() {
        var tableNode = this._tableNode,
            contentBox = this.get("contentBox"),
            theadFilter = "thead."+CLASS_COLUMNS+">tr>th",
            tbodyFilter ="tbody."+CLASS_DATA+">tr>td",
            msgFilter = "tbody."+CLASS_MSG+">tr>td";
            
        // Define custom events that wrap DOM events. Simply pass through DOM
        // event facades.
        //TODO: do we need queuable=true?
        //TODO: can i condense this?
        
        
        
        // FOCUS EVENTS
        /**
         * Fired when a TH element has a focus.
         *
         * @event theadCellFocus
         */
        this.publish("theadCellFocus", {defaultFn: this._defTheadCellFocusFn, emitFacade:false, queuable:true});
        /**
         * Fired when a THEAD>TR element has a focus.
         *
         * @event theadRowFocus
         */
        this.publish("theadRowFocus", {defaultFn: this._defTheadRowFocusFn, emitFacade:false, queuable:true});
        /**
         * Fired when the THEAD element has a focus.
         *
         * @event theadFocus
         */
        this.publish("theadFocus", {defaultFn: this._defTheadFocusFn, emitFacade:false, queuable:true});
        /**
         * Fired when a TBODY.data>TD element has a focus.
         *
         * @event tbodyCellFocus
         */
        this.publish("tbodyCellFocus", {defaultFn: this._defTbodyCellFocusFn, emitFacade:false, queuable:true});
        /**
         * Fired when a TBODY.data>TR element has a focus.
         *
         * @event tbodyRowFocus
         */
        this.publish("tbodyRowFocus", {defaultFn: this._defTbodyRowFocusFn, emitFacade:false, queuable:true});
        /**
         * Fired when the TBODY.data element has a focus.
         *
         * @event tbodyFocus
         */
        this.publish("tbodyFocus", {defaultFn: this._defTbodyFocusFn, emitFacade:false, queuable:true});
        /**
         * Fired when a TBODY.msg>TD element has a focus.
         *
         * @event msgCellFocus
         */
        this.publish("msgCellFocus", {defaultFn: this._defMsgCellFocusFn, emitFacade:false, queuable:true});
        /**
         * Fired when a TBODY.msg>TR element has a focus.
         *
         * @event msgRowFocus
         */
        this.publish("msgRowFocus", {defaultFn: this._defMsgRowFocusFn, emitFacade:false, queuable:true});
        /**
         * Fired when the TBODY.msg element has a focus.
         *
         * @event msgTbodyFocus
         */
        this.publish("msgTbodyFocus", {defaultFn: this._defMsgTbodyFocusFn, emitFacade:false, queuable:true});

        
        
        // KEYDOWN EVENTS
        /**
         * Fired when a TH element has a keydown.
         *
         * @event theadCellKeydown
         */
        this.publish("theadCellKeydown", {defaultFn: this._defTheadCellKeydownFn, emitFacade:false, queuable:true});
        /**
         * Fired when a THEAD>TR element has a keydown.
         *
         * @event theadRowKeydown
         */
        this.publish("theadRowKeydown", {defaultFn: this._defTheadRowKeydownFn, emitFacade:false, queuable:true});
        /**
         * Fired when the THEAD element has a keydown.
         *
         * @event theadKeydown
         */
        this.publish("theadKeydown", {defaultFn: this._defTheadKeydownFn, emitFacade:false, queuable:true});
        /**
         * Fired when a TBODY.data>TD element has a keydown.
         *
         * @event tbodyCellKeydown
         */
        this.publish("tbodyCellKeydown", {defaultFn: this._defTbodyCellKeydownFn, emitFacade:false, queuable:true});
        /**
         * Fired when a TBODY.data>TR element has a keydown.
         *
         * @event tbodyRowKeydown
         */
        this.publish("tbodyRowKeydown", {defaultFn: this._defTbodyRowKeydownFn, emitFacade:false, queuable:true});
        /**
         * Fired when the TBODY.data element has a keydown.
         *
         * @event tbodyKeydown
         */
        this.publish("tbodyKeydown", {defaultFn: this._defTbodyKeydownFn, emitFacade:false, queuable:true});
        /**
         * Fired when a TBODY.msg>TD element has a keydown.
         *
         * @event msgCellKeydown
         */
        this.publish("msgCellKeydown", {defaultFn: this._defMsgCellKeydownFn, emitFacade:false, queuable:true});
        /**
         * Fired when a TBODY.msg>TR element has a keydown.
         *
         * @event msgRowKeydown
         */
        this.publish("msgRowKeydown", {defaultFn: this._defMsgRowKeydownFn, emitFacade:false, queuable:true});
        /**
         * Fired when the TBODY.msg element has a keydown.
         *
         * @event msgTbodyKeydown
         */
        this.publish("msgTbodyKeydown", {defaultFn: this._defMsgTbodyKeydownFn, emitFacade:false, queuable:true});



        // FOCUS EVENTS
        /**
         * Fired when a TH element has a mouseenter.
         *
         * @event theadCellMouseenter
         */
        this.publish("theadCellMouseenter", {defaultFn: this._defTheadCellMouseenterFn, emitFacade:false, queuable:true});
        /**
         * Fired when a THEAD>TR element has a mouseenter.
         *
         * @event theadRowMouseenter
         */
        this.publish("theadRowMouseenter", {defaultFn: this._defTheadRowMouseenterFn, emitFacade:false, queuable:true});
        /**
         * Fired when the THEAD element has a mouseenter.
         *
         * @event theadMouseenter
         */
        this.publish("theadMouseenter", {defaultFn: this._defTheadMouseenterFn, emitFacade:false, queuable:true});
        /**
         * Fired when a TBODY.data>TD element has a mouseenter.
         *
         * @event tbodyCellMouseenter
         */
        this.publish("tbodyCellMouseenter", {defaultFn: this._defTbodyCellMouseenterFn, emitFacade:false, queuable:true});
        /**
         * Fired when a TBODY.data>TR element has a mouseenter.
         *
         * @event tbodyRowMouseenter
         */
        this.publish("tbodyRowMouseenter", {defaultFn: this._defTbodyRowMouseenterFn, emitFacade:false, queuable:true});
        /**
         * Fired when the TBODY.data element has a mouseenter.
         *
         * @event tbodyMouseenter
         */
        this.publish("tbodyMouseenter", {defaultFn: this._defTbodyMouseenterFn, emitFacade:false, queuable:true});
        /**
         * Fired when a TBODY.msg>TD element has a mouseenter.
         *
         * @event msgCellMouseenter
         */
        this.publish("msgCellMouseenter", {defaultFn: this._defMsgCellMouseenterFn, emitFacade:false, queuable:true});
        /**
         * Fired when a TBODY.msg>TR element has a mouseenter.
         *
         * @event msgRowMouseenter
         */
        this.publish("msgRowMouseenter", {defaultFn: this._defMsgRowMouseenterFn, emitFacade:false, queuable:true});
        /**
         * Fired when the TBODY.msg element has a mouseenter.
         *
         * @event msgTbodyMouseenter
         */
        this.publish("msgTbodyMouseenter", {defaultFn: this._defMsgTbodyMouseenterFn, emitFacade:false, queuable:true});



        // FOCUS EVENTS
        /**
         * Fired when a TH element has a mouseleave.
         *
         * @event theadCellMouseleave
         */
        this.publish("theadCellMouseleave", {defaultFn: this._defTheadCellMouseleaveFn, emitFacade:false, queuable:true});
        /**
         * Fired when a THEAD>TR element has a mouseleave.
         *
         * @event theadRowMouseleave
         */
        this.publish("theadRowMouseleave", {defaultFn: this._defTheadRowMouseleaveFn, emitFacade:false, queuable:true});
        /**
         * Fired when the THEAD element has a mouseleave.
         *
         * @event theadMouseleave
         */
        this.publish("theadMouseleave", {defaultFn: this._defTheadMouseleaveFn, emitFacade:false, queuable:true});
        /**
         * Fired when a TBODY.data>TD element has a mouseleave.
         *
         * @event tbodyCellMouseleave
         */
        this.publish("tbodyCellMouseleave", {defaultFn: this._defTbodyCellMouseleaveFn, emitFacade:false, queuable:true});
        /**
         * Fired when a TBODY.data>TR element has a mouseleave.
         *
         * @event tbodyRowMouseleave
         */
        this.publish("tbodyRowMouseleave", {defaultFn: this._defTbodyRowMouseleaveFn, emitFacade:false, queuable:true});
        /**
         * Fired when the TBODY.data element has a mouseleave.
         *
         * @event tbodyMouseleave
         */
        this.publish("tbodyMouseleave", {defaultFn: this._defTbodyMouseleaveFn, emitFacade:false, queuable:true});
        /**
         * Fired when a TBODY.msg>TD element has a mouseleave.
         *
         * @event msgCellMouseleave
         */
        this.publish("msgCellMouseleave", {defaultFn: this._defMsgCellMouseleaveFn, emitFacade:false, queuable:true});
        /**
         * Fired when a TBODY.msg>TR element has a mouseleave.
         *
         * @event msgRowMouseleave
         */
        this.publish("msgRowMouseleave", {defaultFn: this._defMsgRowMouseleaveFn, emitFacade:false, queuable:true});
        /**
         * Fired when the TBODY.msg element has a mouseleave.
         *
         * @event msgTbodyMouseleave
         */
        this.publish("msgTbodyMouseleave", {defaultFn: this._defMsgTbodyMouseleaveFn, emitFacade:false, queuable:true});



        // FOCUS EVENTS
        /**
         * Fired when a TH element has a mouseup.
         *
         * @event theadCellMouseup
         */
        this.publish("theadCellMouseup", {defaultFn: this._defTheadCellMouseupFn, emitFacade:false, queuable:true});
        /**
         * Fired when a THEAD>TR element has a mouseup.
         *
         * @event theadRowMouseup
         */
        this.publish("theadRowMouseup", {defaultFn: this._defTheadRowMouseupFn, emitFacade:false, queuable:true});
        /**
         * Fired when the THEAD element has a mouseup.
         *
         * @event theadMouseup
         */
        this.publish("theadMouseup", {defaultFn: this._defTheadMouseupFn, emitFacade:false, queuable:true});
        /**
         * Fired when a TBODY.data>TD element has a mouseup.
         *
         * @event tbodyCellMouseup
         */
        this.publish("tbodyCellMouseup", {defaultFn: this._defTbodyCellMouseupFn, emitFacade:false, queuable:true});
        /**
         * Fired when a TBODY.data>TR element has a mouseup.
         *
         * @event tbodyRowMouseup
         */
        this.publish("tbodyRowMouseup", {defaultFn: this._defTbodyRowMouseupFn, emitFacade:false, queuable:true});
        /**
         * Fired when the TBODY.data element has a mouseup.
         *
         * @event tbodyMouseup
         */
        this.publish("tbodyMouseup", {defaultFn: this._defTbodyMouseupFn, emitFacade:false, queuable:true});
        /**
         * Fired when a TBODY.msg>TD element has a mouseup.
         *
         * @event msgCellMouseup
         */
        this.publish("msgCellMouseup", {defaultFn: this._defMsgCellMouseupFn, emitFacade:false, queuable:true});
        /**
         * Fired when a TBODY.msg>TR element has a mouseup.
         *
         * @event msgRowMouseup
         */
        this.publish("msgRowMouseup", {defaultFn: this._defMsgRowMouseupFn, emitFacade:false, queuable:true});
        /**
         * Fired when the TBODY.msg element has a mouseup.
         *
         * @event msgTbodyMouseup
         */
        this.publish("msgTbodyMouseup", {defaultFn: this._defMsgTbodyMouseupFn, emitFacade:false, queuable:true});



        // FOCUS EVENTS
        /**
         * Fired when a TH element has a mousedown.
         *
         * @event theadCellMousedown
         */
        this.publish("theadCellMousedown", {defaultFn: this._defTheadCellMousedownFn, emitFacade:false, queuable:true});
        /**
         * Fired when a THEAD>TR element has a mousedown.
         *
         * @event theadRowMousedown
         */
        this.publish("theadRowMousedown", {defaultFn: this._defTheadRowMousedownFn, emitFacade:false, queuable:true});
        /**
         * Fired when the THEAD element has a mousedown.
         *
         * @event theadMousedown
         */
        this.publish("theadMousedown", {defaultFn: this._defTheadMousedownFn, emitFacade:false, queuable:true});
        /**
         * Fired when a TBODY.data>TD element has a mousedown.
         *
         * @event tbodyCellMousedown
         */
        this.publish("tbodyCellMousedown", {defaultFn: this._defTbodyCellMousedownFn, emitFacade:false, queuable:true});
        /**
         * Fired when a TBODY.data>TR element has a mousedown.
         *
         * @event tbodyRowMousedown
         */
        this.publish("tbodyRowMousedown", {defaultFn: this._defTbodyRowMousedownFn, emitFacade:false, queuable:true});
        /**
         * Fired when the TBODY.data element has a mousedown.
         *
         * @event tbodyMousedown
         */
        this.publish("tbodyMousedown", {defaultFn: this._defTbodyMousedownFn, emitFacade:false, queuable:true});
        /**
         * Fired when a TBODY.msg>TD element has a mousedown.
         *
         * @event msgCellMousedown
         */
        this.publish("msgCellMousedown", {defaultFn: this._defMsgCellMousedownFn, emitFacade:false, queuable:true});
        /**
         * Fired when a TBODY.msg>TR element has a mousedown.
         *
         * @event msgRowMousedown
         */
        this.publish("msgRowMousedown", {defaultFn: this._defMsgRowMousedownFn, emitFacade:false, queuable:true});
        /**
         * Fired when the TBODY.msg element has a mousedown.
         *
         * @event msgTbodyMousedown
         */
        this.publish("msgTbodyMousedown", {defaultFn: this._defMsgTbodyMousedownFn, emitFacade:false, queuable:true});



        // CLICK EVENTS
        /**
         * Fired when a TH element has a click.
         *
         * @event theadCellClick
         */
        this.publish("theadCellClick", {defaultFn: this._defTheadCellClickFn, emitFacade:false, queuable:true});
        /**
         * Fired when a THEAD>TR element has a click.
         *
         * @event theadRowClick
         */
        this.publish("theadRowClick", {defaultFn: this._defTheadRowClickFn, emitFacade:false, queuable:true});
        /**
         * Fired when the THEAD element has a click.
         *
         * @event theadClick
         */
        this.publish("theadClick", {defaultFn: this._defTheadClickFn, emitFacade:false, queuable:true});
        /**
         * Fired when a TBODY.data>TD element has a click.
         *
         * @event tbodyCellClick
         */
        this.publish("tbodyCellClick", {defaultFn: this._defTbodyCellClickFn, emitFacade:false, queuable:true});
        /**
         * Fired when a TBODY.data>TR element has a click.
         *
         * @event tbodyRowClick
         */
        this.publish("tbodyRowClick", {defaultFn: this._defTbodyRowClickFn, emitFacade:false, queuable:true});
        /**
         * Fired when the TBODY.data element has a click.
         *
         * @event tbodyClick
         */
        this.publish("tbodyClick", {defaultFn: this._defTbodyClickFn, emitFacade:false, queuable:true});
        /**
         * Fired when a TBODY.msg>TD element has a click.
         *
         * @event msgCellClick
         */
        this.publish("msgCellClick", {defaultFn: this._defMsgCellClickFn, emitFacade:false, queuable:true});
        /**
         * Fired when a TBODY.msg>TR element has a click.
         *
         * @event msgRowClick
         */
        this.publish("msgRowClick", {defaultFn: this._defMsgRowClickFn, emitFacade:false, queuable:true});
        /**
         * Fired when the TBODY.msg element has a click.
         *
         * @event msgTbodyClick
         */
        this.publish("msgTbodyClick", {defaultFn: this._defMsgTbodyClickFn, emitFacade:false, queuable:true});
        
        
        
        
        // DBLCLICK EVENTS
        /**
         * Fired when a TH element has a dblclick.
         *
         * @event theadCellDblclick
         */
        this.publish("theadCellDblclick", {defaultFn: this._defTheadCellDblclickFn, emitFacade:false, queuable:true});
        /**
         * Fired when a THEAD>TR element has a dblclick.
         *
         * @event theadRowDblclick
         */
        this.publish("theadRowDblclick", {defaultFn: this._defTheadRowDblclickFn, emitFacade:false, queuable:true});
        /**
         * Fired when the THEAD element has a dblclick.
         *
         * @event theadDblclick
         */
        this.publish("theadDblclick", {defaultFn: this._defTheadDblclickFn, emitFacade:false, queuable:true});
        /**
         * Fired when a TBODY.data>TD element has a dblclick.
         *
         * @event tbodyCellDblclick
         */
        this.publish("tbodyCellDblclick", {defaultFn: this._defTbodyCellDblclickFn, emitFacade:false, queuable:true});
        /**
         * Fired when a TBODY.data>TR element has a dblclick.
         *
         * @event tbodyRowDblclick
         */
        this.publish("tbodyRowDblclick", {defaultFn: this._defTbodyRowDblclickFn, emitFacade:false, queuable:true});
        /**
         * Fired when the TBODY.data element has a dblclick.
         *
         * @event tbodyDblclick
         */
        this.publish("tbodyDblclick", {defaultFn: this._defTbodyDblclickFn, emitFacade:false, queuable:true});
        /**
         * Fired when a TBODY.msg>TD element has a dblclick.
         *
         * @event msgCellDblclick
         */
        this.publish("msgCellDblclick", {defaultFn: this._defMsgCellDblclickFn, emitFacade:false, queuable:true});
        /**
         * Fired when a TBODY.msg>TR element has a dblclick.
         *
         * @event msgRowDblclick
         */
        this.publish("msgRowDblclick", {defaultFn: this._defMsgRowDblclickFn, emitFacade:false, queuable:true});
        /**
         * Fired when the TBODY.msg element has a dblclick.
         *
         * @event msgTbodyDblclick
         */
        this.publish("msgTbodyDblclick", {defaultFn: this._defMsgTbodyDblclickFn, emitFacade:false, queuable:true});



        // Bind to THEAD DOM events
        tableNode.delegate(FOCUS, this._onDomEvent, theadFilter, this, "theadCellFocus");
        tableNode.delegate(KEYDOWN, this._onDomEvent, theadFilter, this, "theadCellKeydown");
        tableNode.delegate(MOUSEENTER, this._onDomEvent, theadFilter, this, "theadCellMouseenter");
        tableNode.delegate(MOUSELEAVE, this._onDomEvent, theadFilter, this, "theadCellMouseleave");
        tableNode.delegate(MOUSEUP, this._onDomEvent, theadFilter, this, "theadCellMouseup");
        tableNode.delegate(MOUSEDOWN, this._onDomEvent, theadFilter, this, "theadCellMousedown");
        tableNode.delegate(CLICK, this._onDomEvent, theadFilter, this, "theadCellClick");
        // Since we can't listen for click and dblclick on the same element...
        contentBox.delegate(DBLCLICK, this._onDomEvent, theadFilter, this, "theadCellDblclick");

        // Bind to TBODY DOM events
        tableNode.delegate(FOCUS, this._onDomEvent, tbodyFilter, this, "tbodyCellFocus");
        tableNode.delegate(KEYDOWN, this._onDomEvent, tbodyFilter, this, "tbodyCellKeydown");
        tableNode.delegate(MOUSEENTER, this._onDomEvent, tbodyFilter, this, "tbodyCellMouseenter");
        tableNode.delegate(MOUSELEAVE, this._onDomEvent, tbodyFilter, this, "tbodyCellMouseleave");
        tableNode.delegate(MOUSEUP, this._onDomEvent, tbodyFilter, this, "tbodyCellMouseup");
        tableNode.delegate(MOUSEDOWN, this._onDomEvent, tbodyFilter, this, "tbodyCellMousedown");
        tableNode.delegate(CLICK, this._onDomEvent, tbodyFilter, this, "tbodyCellClick");
        // Since we can't listen for click and dblclick on the same element...
        contentBox.delegate(DBLCLICK, this._onDomEvent, tbodyFilter, this, "tbodyCellDblclick");

        // Bind to message TBODY DOM events
        tableNode.delegate(FOCUS, this._onDomEvent, msgFilter, this, "msgCellFocus");
        tableNode.delegate(KEYDOWN, this._onDomEvent, msgFilter, this, "msgCellKeydown");
        tableNode.delegate(MOUSEENTER, this._onDomEvent, msgFilter, this, "msgCellMouseenter");
        tableNode.delegate(MOUSELEAVE, this._onDomEvent, msgFilter, this, "msgCellMouseleave");
        tableNode.delegate(MOUSEUP, this._onDomEvent, msgFilter, this, "msgCellMouseup");
        tableNode.delegate(MOUSEDOWN, this._onDomEvent, msgFilter, this, "msgCellMousedown");
        tableNode.delegate(CLICK, this._onDomEvent, msgFilter, this, "msgCellClick");
        // Since we can't listen for click and dblclick on the same element...
        contentBox.delegate(DBLCLICK, this._onDomEvent, msgFilter, this, "msgCellDblclick");
    },
    
    /**
    * On DOM event, fires corresponding custom event.
    *
    * @method _onDomEvent
    * @param e {DOMEvent} The original DOM event facade.
    * @param type {String} Corresponding custom event to fire.
    * @private
    */
    _onDomEvent: function(e, type) {
        this.fire(type, e);
    },

    //TODO: abstract this out
    _defTheadCellClickFn: function(e) {
        this.fire("theadRowClick", e);
    },

    _defTheadRowClickFn: function(e) {
        this.fire("theadClick", e);
    },

    _defTheadClickFn: function(e) {
    },

    ////////////////////////////////////////////////////////////////////////////
    //
    // SYNC
    //
    ////////////////////////////////////////////////////////////////////////////

    /**
    * Syncs UI to intial state.
    *
    * @method syncUI
    * @private
    */
    syncUI: function() {
        // THEAD ROWS
        this._uiSetColumnset(this.get("columnset"));
        // DATA ROWS
        this._uiSetRecordset(this.get("recordset"));
        // SUMMARY
        this._uiSetSummary(this.get("summary"));
        // CAPTION
        this._uiSetCaption(this.get("caption"));
    },

    /**
     * Updates summary.
     *
     * @method _uiSetSummary
     * @param val {String} New summary.
     * @protected
     */
    _uiSetSummary: function(val) {
        val = YisValue(val) ? val : "";
        this._tableNode.set("summary", val);
    },

    /**
     * Updates caption.
     *
     * @method _uiSetCaption
     * @param val {String} New caption.
     * @protected
     */
    _uiSetCaption: function(val) {
        val = YisValue(val) ? val : "";
        this._captionNode.setContent(val);
    },


    ////////////////////////////////////////////////////////////////////////////
    //
    // THEAD/COLUMNSET FUNCTIONALITY
    //
    ////////////////////////////////////////////////////////////////////////////
    /**
     * Updates THEAD.
     *
     * @method _uiSetColumnset
     * @param cs {Y.Columnset} New Columnset.
     * @protected
     */
    _uiSetColumnset: function(cs) {
        var tree = cs.tree,
            thead = this._theadNode,
            i = 0,
            len = tree.length,
            parent = thead.get("parentNode"),
            nextSibling = thead.next();
            
        // Move THEAD off DOM
        thead.remove();
        
        thead.get("children").remove(true);

        // Iterate tree of columns to add THEAD rows
        for(; i<len; ++i) {
            this._addTheadTrNode({thead:thead, columns:tree[i]}, (i === 0), (i === len-1));
        }

        // Column helpers needs _theadNode to exist
        //this._createColumnHelpers();

        
        // Re-attach THEAD to DOM
        parent.insert(thead, nextSibling);

     },
     
    /**
    * Creates and attaches header row element.
    *
    * @method _addTheadTrNode
    * @param o {Object} {thead, columns}.
    * @param isFirst {Boolean} Is first row.
    * @param isFirst {Boolean} Is last row.
    * @protected
    */
     _addTheadTrNode: function(o, isFirst, isLast) {
        o.tr = this._createTheadTrNode(o, isFirst, isLast);
        this._attachTheadTrNode(o);
     },
     

    /**
    * Creates header row element.
    *
    * @method _createTheadTrNode
    * @param o {Object} {thead, columns}.
    * @param isFirst {Boolean} Is first row.
    * @param isLast {Boolean} Is last row.
    * @protected
    * @returns Y.Node
    */
    _createTheadTrNode: function(o, isFirst, isLast) {
        //TODO: custom classnames
        var tr = Ycreate(Ysubstitute(this.get("trTemplate"), o)),
            i = 0,
            columns = o.columns,
            len = columns.length,
            column;

         // Set FIRST/LAST class
        if(isFirst) {
            tr.addClass(CLASS_FIRST);
        }
        if(isLast) {
            tr.addClass(CLASS_LAST);
        }

        for(; i<len; ++i) {
            column = columns[i];
            this._addTheadThNode({value:column.get("label"), column: column, tr:tr});
        }

        return tr;
    },

    /**
    * Attaches header row element.
    *
    * @method _attachTheadTrNode
    * @param o {Object} {thead, columns, tr}.
    * @protected
    */
    _attachTheadTrNode: function(o) {
        o.thead.appendChild(o.tr);
    },

    /**
    * Creates and attaches header cell element.
    *
    * @method _addTheadThNode
    * @param o {Object} {value, column, tr}.
    * @protected
    */
    _addTheadThNode: function(o) {
        o.th = this._createTheadThNode(o);
        this._attachTheadThNode(o);
    },

    /**
    * Creates header cell element.
    *
    * @method _createTheadThNode
    * @param o {Object} {value, column, tr}.
    * @protected
    * @returns Y.Node
    */
    _createTheadThNode: function(o) {
        var column = o.column;
        
        // Populate template object
        o.id = column.get("id");//TODO: validate 1 column ID per document
        o.colspan = column.colSpan;
        o.rowspan = column.rowSpan;
        //TODO o.abbr = column.get("abbr");
        o.classnames = column.get("classnames");
        o.value = Ysubstitute(this.get("thValueTemplate"), o);

        /*TODO
        // Clear minWidth on hidden Columns
        if(column.get("hidden")) {
            //this._clearMinWidth(column);
        }
        */
        
        //TODO: assign all node pointers: thNode, thLinerNode, thLabelNode
        //column.thNode = o.th);

        return Ycreate(Ysubstitute(this.thTemplate, o));
    },

    /**
    * Attaches header cell element.
    *
    * @method _attachTheadThNode
    * @param o {Object} {value, column, tr}.
    * @protected
    */
    _attachTheadThNode: function(o) {
        o.tr.appendChild(o.th);
    },

    ////////////////////////////////////////////////////////////////////////////
    //
    // TBODY/RECORDSET FUNCTIONALITY
    //
    ////////////////////////////////////////////////////////////////////////////
    /**
     * Updates TBODY.
     *
     * @method _uiSetRecordset
     * @param rs {Y.Recordset} New Recordset.
     * @protected
     */
    _uiSetRecordset: function(rs) {
        var i = 0,//TODOthis.get("state.offsetIndex")
            len = rs.getLength(), //TODOthis.get("state.pageLength")
            tbody = this._tbodyNode,
            parent = tbody.get("parentNode"),
            nextSibling = tbody.next(),
            o = {tbody:tbody}; //TODO: not sure best time to do this -- depends on sdt

        // Move TBODY off DOM
        tbody.remove();

        // Iterate Recordset to use existing TR when possible or add new TR
        for(; i<len; ++i) {
            o.record = rs.getRecord(i);
            o.rowindex = i;
            this._addTbodyTrNode(o); //TODO: sometimes rowindex != recordindex
        }
        
        // Re-attach TBODY to DOM
        parent.insert(tbody, nextSibling);
    },

    /**
    * Creates and attaches data row element.
    *
    * @method _addTbodyTrNode
    * @param o {Object} {tbody, record}
    * @protected
    */
    _addTbodyTrNode: function(o) {
        var tbody = o.tbody,
            record = o.record;
        o.tr = tbody.one("#"+record.get("id")) || this._createTbodyTrNode(o);
        this._attachTbodyTrNode(o);
    },

    /**
    * Creates data row element.
    *
    * @method _createTbodyTrNode
    * @param o {Object} {tbody, record}
    * @protected
    * @returns Y.Node
    */
    _createTbodyTrNode: function(o) {
        var tr = Ycreate(Ysubstitute(this.get("trTemplate"), {id:o.record.get("id")})),
            i = 0,
            allKeys = this.get("columnset").keys,
            len = allKeys.length;

        o.tr = tr;
        
        for(; i<len; ++i) {
            o.column = allKeys[i];
            this._addTbodyTdNode(o);
        }
        
        return tr;
    },

    /**
    * Attaches data row element.
    *
    * @method _attachTbodyTrNode
    * @param o {Object} {tbody, record, tr}.
    * @protected
    */
    _attachTbodyTrNode: function(o) {
        var tbody = o.tbody,
            tr = o.tr,
            index = o.rowindex,
            nextSibling = tbody.get("children").item(index) || null,
            isEven = (index%2===0);
            
        if(isEven) {
            tr.replaceClass(CLASS_ODD, CLASS_EVEN);
        }
        else {
            tr.replaceClass(CLASS_EVEN, CLASS_ODD);
        }
        
        tbody.insertBefore(tr, nextSibling);
    },

    /**
    * Creates and attaches data cell element.
    *
    * @method _addTbodyTdNode
    * @param o {Object} {record, column, tr}.
    * @protected
    */
    _addTbodyTdNode: function(o) {
        o.td = this._createTbodyTdNode(o);
        this._attachTbodyTdNode(o);
    },
    
    /**
    * Creates data cell element.
    *
    * @method _createTbodyTdNode
    * @param o {Object} {record, column, tr}.
    * @protected
    * @returns Y.Node
    */
    _createTbodyTdNode: function(o) {
        var column = o.column;
        //TODO: attributes? or methods?
        o.headers = column.get("headers");
        o.classnames = column.get("classnames");
        o.value = this.formatDataCell(o);
        return Ycreate(Ysubstitute(this.tdTemplate, o));
    },
    
    /**
    * Attaches data cell element.
    *
    * @method _attachTbodyTdNode
    * @param o {Object} {record, column, tr, headers, classnames, value}.
    * @protected
    */
    _attachTbodyTdNode: function(o) {
        o.tr.appendChild(o.td);
    },

    /**
     * Returns markup to insert into data cell element.
     *
     * @method formatDataCell
     * @param @param o {Object} {record, column, tr, headers, classnames}.
     */
    formatDataCell: function(o) {
        var record = o.record;
        o.data = record.get("data");
        o.value = record.getValue(o.column.get("field"));
        return Ysubstitute(this.get("tdValueTemplate"), o);
    }
});

Y.namespace("DataTable").Base = DTBase;
