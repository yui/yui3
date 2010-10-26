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
 * @class DataSource.Base
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
        * @attribute strings
        * @description The collection of localizable strings used to label
        * elements of the UI.
        * @type Object
        */
        strings: {
            valueFn: function() {
                return Y.Intl.get("datatable-base");
            }
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
     * Updates the UI if changes are made to any of the strings in the strings
     * attribute.
     *
     * @method _afterStringsChange
     * @param e {Event} Custom event for the attribute change.
     * @protected
     */
    _afterStringsChange: function (e) {
        this._uiSetStrings(e.newVal);
    },

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
     * Updates the UI if changes are made to Columnset.
     *
     * @method _afterColumnsetChange
     * @param e {Event} Custom event for the attribute change.
     * @private
     */
    _afterColumnsetChange: function (e) {
        this._uiSetColumnset(e.newVal);
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
    * @method _afterRecordsetChange
    * @description Adds bubble target.
    * @param records {Array | Y.Recordset}
    * @returns Y.Recordset
    * @private
    */
    _afterRecordsetChange: function (e) {
        this._uiSetRecordset(e.newVal);
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
        var len = this.get("columnset").get("keys").length,
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
        //TODO: node.createCaption
        this._captionNode = tableNode.invoke("createCaption");
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
        //TODO: All the other events.
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
         * Fired when a TD element has a click.
         *
         * @event tbodyCellClick
         */
        this.publish("tbodyCellClick", {defaultFn: this._defTbodyCellClickFn, emitFacade:false, queuable:true});
        /**
         * Fired when a TBODY>TR element has a click.
         *
         * @event tbodyRowClick
         */
        this.publish("tbodyRowClick", {defaultFn: this._defTbodyRowClickFn, emitFacade:false, queuable:true});
        /**
         * Fired when the TBODY element has a click.
         *
         * @event tbodyClick
         */
        this.publish("tbodyClick", {defaultFn: this._defTbodyClickFn, emitFacade:false, queuable:true});

        // Bind to THEAD DOM events
        tableNode.delegate(FOCUS, this._onDomEvent, theadFilter, this, "theadCellFocus");
        tableNode.delegate(KEYDOWN, this._onDomEvent, theadFilter, this, "theadCellKeydown");
        tableNode.delegate(MOUSEENTER, this._onDomEvent, theadFilter, this, "theadCellMouseenter");
        tableNode.delegate(MOUSELEAVE, this._onDomEvent, theadFilter, this, "theadCellMouseleave");
        tableNode.delegate(MOUSEUP, this._onDomEvent, theadFilter, this, "theadCellMouseup");
        tableNode.delegate(MOUSEDOWN, this._onDomEvent, theadFilter, this, "theadCellMousedown");
        tableNode.delegate(CLICK, this._onDomEvent, theadFilter, this, "theadCellClick");
        // Since we can't listen for click and dblclick on the same element...
        contentBox.delegate(DOUBLECLICK, this._onEvent, theadFilter, this, "theadCellDoubleclick");

        // Bind to TBODY DOM events
        tableNode.delegate(FOCUS, this._onDomEvent, tbodyFilter, this, "tbodyCellFocus");
        tableNode.delegate(KEYDOWN, this._onDomEvent, tbodyFilter, this, "tbodyCellKeydown");
        tableNode.delegate(MOUSEENTER, this._onDomEvent, tbodyFilter, this, "tbodyCellMouseenter");
        tableNode.delegate(MOUSELEAVE, this._onDomEvent, tbodyFilter, this, "tbodyCellMouseleave");
        tableNode.delegate(MOUSEUP, this._onDomEvent, tbodyFilter, this, "tbodyCellMouseup");
        tableNode.delegate(MOUSEDOWN, this._onDomEvent, tbodyFilter, this, "tbodyCellMousedown");
        tableNode.delegate(CLICK, this._onDomEvent, tbodyFilter, this, "tbodyCellClick");
        // Since we can't listen for click and dblclick on the same element...
        contentBox.delegate(DOUBLECLICK, this._onEvent, tbodyFilter, this, "tbodyCellDoubleclick");

        // Bind to message TBODY DOM events
        tableNode.delegate(FOCUS, this._onDomEvent, msgFilter, this, "msgCellFocus");
        tableNode.delegate(KEYDOWN, this._onDomEvent, msgFilter, this, "msgCellKeydown");
        tableNode.delegate(MOUSEENTER, this._onDomEvent, msgFilter, this, "msgCellMouseenter");
        tableNode.delegate(MOUSELEAVE, this._onDomEvent, msgFilter, this, "msgCellMouseleave");
        tableNode.delegate(MOUSEUP, this._onDomEvent, msgFilter, this, "msgCellMouseup");
        tableNode.delegate(MOUSEDOWN, this._onDomEvent, msgFilter, this, "msgCellMousedown");
        tableNode.delegate(CLICK, this._onDomEvent, msgFilter, this, "msgCellClick");
        // Since we can't listen for click and dblclick on the same element...
        contentBox.delegate(DOUBLECLICK, this._onDomEvent, msgFilter, this, "msgCellDoubleclick");
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
        // STRINGS
        this._uiSetStrings(this.get("strings"));
    },

    /**
     * Updates all strings.
     *
     * @method _uiSetStrings
     * @param strings {Object} Collection of new strings.
     * @protected
     */
    _uiSetStrings: function (strings) {
        this._uiSetSummary(strings.summary);
        this._uiSetCaption(strings.caption);
    },

    /**
     * Updates summary.
     *
     * @method _uiSetSummary
     * @param val {String} New summary.
     * @protected
     */
    _uiSetSummary: function(val) {
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
        var tree = cs.get("tree"),
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
        o.colspan = column.get("colSpan");
        o.rowspan = column.get("rowSpan");
        //TODO o.abbr = column.get("abbr");
        o.classnames = column.get("classnames");
        o.value = Ysubstitute(this.get("thValueTemplate"), o);

        /*TODO
        // Clear minWidth on hidden Columns
        if(column.get("hidden")) {
            //this._clearMinWidth(column);
        }
        */
        
        //column._set("thNode", o.th);

        return Ycreate(Ysubstitute(this.thTemplate, o));
    },

    /**
    * Attaches header cell element.
    *
    * @method _attachTheadTrNode
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
            allKeys = this.get("columnset").get("keys"),
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
        o.value = record.getValue(o.column.get("key"));
        return Ysubstitute(this.get("tdValueTemplate"), o);
    }
});

Y.namespace("DataTable").Base = DTBase;
