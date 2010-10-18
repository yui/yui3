var YLang = Y.Lang,
    Ysubstitute = Y.Lang.substitute,
    YNode = Y.Node,
    Ycreate = YNode.create,
    YgetClassName = Y.ClassNameManager.getClassName,
    Ybind = Y.bind,

    DATATABLE = "datatable",
    
    FOCUS = "focus",
    KEYDOWN = "keydown",
    MOUSEOVER = "mouseover",
    MOUSEOUT = "mouseout",
    MOUSEUP = "mouseup",
    MOUSEDOWN = "mousedown",
    CLICK = "click",
    DOUBLECLICK = "doubleclick",

    CLASS_COLUMNS = YgetClassName(DATATABLE, "columns"),
    CLASS_DATA = YgetClassName(DATATABLE, "data"),
    CLASS_MSG = YgetClassName(DATATABLE, "msg"),
    CLASS_LINER = YgetClassName(DATATABLE, "liner"),
    CLASS_FIRST = YgetClassName(DATATABLE, "first"),
    CLASS_LAST = YgetClassName(DATATABLE, "last"),

    TEMPLATE_TABLE = '<table></table>',
    TEMPLATE_COL = '<col></col>',
    TEMPLATE_THEAD = '<thead class="'+CLASS_COLUMNS+'"></thead>',
    TEMPLATE_TBODY = '<tbody class="'+CLASS_DATA+'"></tbody>',
    TEMPLATE_TH = '<th id="{id}" rowspan="{rowspan}" colspan="{colspan}"><div class="'+CLASS_LINER+'">{value}</div></th>',
    TEMPLATE_TR = '<tr id="{id}"></tr>',
    TEMPLATE_TD = '<td headers="{headers}"><div class="'+CLASS_LINER+'">{value}</div></td>',
    TEMPLATE_VALUE = '{value}',
    TEMPLATE_MSG = '<tbody class="'+CLASS_MSG+'"></tbody>';

function DTBase(config) {
    DTBase.superclass.constructor.apply(this, arguments);
}

/*
 * Required NAME static field, to identify the Widget class and
 * used as an event prefix, to generate class names etc. (set to the
 * class name in camel case).
 */
DTBase.NAME = "dataTable";

/*
 * The attribute configuration for the widget. This defines the core user facing state of the widget
 */
DTBase.ATTRS = {
    columnset: {
        setter: "_setColumnset"
    },

    //@type Recordset or Array
    recordset: {
        setter: "_setRecordset"
    },

    state: {
        value: new Y.State(),
        readOnly: true

    },

    strings: {
        valueFn: function() {
            return Y.Intl.get("datatable-base");
        }
    },

    thValueTemplate: {
        value: TEMPLATE_VALUE
    },

    tdValueTemplate: {
        value: TEMPLATE_VALUE
    },

    trTemplate: {
        value: TEMPLATE_TR
    }
};

/*
 * The HTML_PARSER static constant is used if the Widget supports progressive enhancement, and is
 * used to populate the configuration for the DTBase instance from markup already on the page.
 */
DTBase.HTML_PARSER = {

    attrA: function (srcNode) {
        // If progressive enhancement is to be supported, return the value of "attrA" based on the contents of the srcNode
    }

};

/* DTBase extends the base Widget class */
Y.extend(DTBase, Y.Widget, {
    // Properties
    thTemplate: TEMPLATE_TH,

    tdTemplate: TEMPLATE_TD,
    
    _theadNode: null,
    
    _tbodyNode: null,
    
    _msgNode: null,

    // Attributes
    _setColumnset: function(columns) {
        return YLang.isArray(columns) ? new Y.Columnset({columns:columns}) : columns;
    },

    _setRecordset: function(recordset) {
        if(YLang.isArray(recordset)) {
            recordset = new Y.Recordset({records:recordset});
        }

        recordset.addTarget(this);
        return recordset;
    },

    // Initialization
    initializer: function() {
        // Custom events wrap DOM events. Simply pass through DOM event facades.
        //TODO: do we need queuable=true?
        this.publish("theadCellClick", {defaultFn: this._defTheadCellClickFn, emitFacade:false, queuable:true});
        this.publish("theadRowClick", {defaultFn: this._defTheadRowClickFn, emitFacade:false, queuable:true});
        this.publish("theadClick", {defaultFn: this._defTheadClickFn, emitFacade:false, queuable:true});
    },

    _defTheadCellClickFn: function(e) {
        this.fire("theadRowClick", e);
    },

    _defTheadRowClickFn: function(e) {
        this.fire("theadClick", e);
    },

    _defTheadClickFn: function(e) {
    },

    // Destruction
    destructor: function() {
         this.get("recordset").removeTarget(this);
    },

    // UI
    renderUI: function() {
        // TABLE
        var ok = this._addTableNode(this.get("contentBox")) &&
            // COLGROUP
            this._addColgroupNode(this._tableNode) &&
            // THEAD
            this._addTheadNode(this._tableNode) &&
            // Primary TBODY
            this._addTbodyNode(this._tableNode) &&
            // Message TBODY
            this._addMessageNode(this._tableNode) &&
            // CAPTION
            this._addCaptionNode(this._tableNode);

        return ok;
    },

    _addTableNode: function(containerNode) {
        if (!this._tableNode) {
            this._tableNode = containerNode.appendChild(Ycreate(TEMPLATE_TABLE));
        }
        return this._tableNode;
    },

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

    _addTheadNode: function(tableNode) {
        if(tableNode) {
            this._theadNode = tableNode.insertBefore(Ycreate(TEMPLATE_THEAD), this._colgroupNode.next());
            return this._theadNode;
        }
    },

    _addTbodyNode: function(tableNode) {
        this._tbodyNode = tableNode.appendChild(Ycreate(TEMPLATE_TBODY));
        return this._tbodyNode;
    },

    _addMessageNode: function(tableNode) {
        this._msgNode = tableNode.insertBefore(Ycreate(TEMPLATE_MSG), this._tbodyNode);
        return this._msgNode;
    },

    _addCaptionNode: function(tableNode) {
        this._captionNode = tableNode.invoke("createCaption");
        return this._captionNode;
    },

    // Events
    bindUI: function() {
        var tableNode = this._tableNode,
            contentBox = this.get("contentBox"),
            theadFilter = "thead."+CLASS_COLUMNS+">tr>th",
            tbodyFilter ="tbody."+CLASS_DATA+">tr>td",
            msgFilter = "tbody."+CLASS_MSG+">tr>td";
            
            

        // DOM event delegation for THEAD
        
        tableNode.delegate(FOCUS, this._onEvent, theadFilter, this, "theadCellFocus");
        tableNode.delegate(KEYDOWN, this._onEvent, theadFilter, this, "theadCellKeydown");
        tableNode.delegate(MOUSEOVER, this._onEvent, theadFilter, this, "theadCellMousedown");
        tableNode.delegate(MOUSEOUT, this._onEvent, theadFilter, this, "theadCellMouseout");
        tableNode.delegate(MOUSEUP, this._onEvent, theadFilter, this, "theadCellMouseup");
        tableNode.delegate(MOUSEDOWN, this._onEvent, theadFilter, this, "theadCellMousedown");
        tableNode.delegate(CLICK, this._onEvent, theadFilter, this, "theadCellClick");
        // Since we can't listen for click and dblclick on the same element...
        contentBox.delegate(DOUBLECLICK, this._onEvent, theadFilter, this, "theadCellDoubleclick");

        // DOM event delegation for TBODY
        tableNode.delegate(FOCUS, this._onEvent, theadFilter, this, "tbodyCellFocus");
        tableNode.delegate(KEYDOWN, this._onEvent, theadFilter, this, "tbodyCellKeydown");
        tableNode.delegate(MOUSEOVER, this._onEvent, theadFilter, this, "tbodyCellMouseover");
        tableNode.delegate(MOUSEOUT, this._onEvent, theadFilter, this, "tbodyCellMouseout");
        tableNode.delegate(MOUSEUP, this._onEvent, theadFilter, this, "tbodyCellMouseup");
        tableNode.delegate(MOUSEDOWN, this._onEvent, theadFilter, this, "tbodyCellMousedown");
        tableNode.delegate(CLICK, this._onEvent, theadFilter, this, "tbodyCellClick");
        // Since we can't listen for click and dblclick on the same element...
        contentBox.delegate(DOUBLECLICK, this._onEvent, theadFilter, this, "tbodyCellDoubleclick");

        // DOM event delegation for MSG TBODY
        tableNode.delegate(FOCUS, this._onEvent, msgFilter, this, "msgCellFocus");
        tableNode.delegate(KEYDOWN, this._onEvent, msgFilter, this, "msgCellKeydown");
        tableNode.delegate(MOUSEOVER, this._onEvent, msgFilter, this, "msgCellMouseover");
        tableNode.delegate(MOUSEOUT, this._onEvent, msgFilter, this, "msgCellMouseout");
        tableNode.delegate(MOUSEUP, this._onEvent, msgFilter, this, "msgCellMouseup");
        tableNode.delegate(MOUSEDOWN, this._onEvent, msgFilter, this, "msgCellMousedown");
        tableNode.delegate(CLICK, this._onEvent, msgFilter, this, "msgCellClick");
        // Since we can't listen for click and dblclick on the same element...
        contentBox.delegate(DOUBLECLICK, this._onEvent, msgFilter, this, "msgCellDoubleclick");
    },
    
    _onEvent: function(e, type) {
        this.fire(type, e);
    },

    syncUI: function() {
        /*
         * syncUI is intended to be used by the Widget subclass to
         * update the UI to reflect the initial state of the widget,
         * after renderUI. From there, the event listeners we bound above
         * will take over.
         */
        // STRINGS
        this._uiSetStrings(this.get("strings"));
        // THEAD ROWS
        this._uiSetColumnset(this.get("columnset"));
        // DATA ROWS
        this._uiSetRecordset(this.get("recordset"));
    },

    /* Listeners, UI update methods */

    /**
     * Updates the UI if changes are made to any of the strings in the strings
     * attribute.
     *
     * @method _afterStringsChange
     * @param e {Event} Custom event for the attribute change
     * @protected
     */
    _afterStringsChange: function (e) {
        this._uiSetStrings(e.newVal);
    },

    _uiSetStrings: function (strings) {
        this._uiSetSummary(strings.summary);
        this._uiSetCaption(strings.caption);
    },

    _uiSetSummary: function(val) {
        this._tableNode.set("summary", val);
    },

    _uiSetCaption: function(val) {
        this._captionNode.setContent(val);
    },


    ////////////////////////////////////////////////////////////////////////////
    //
    // THEAD FUNCTIONALITY
    //
    ////////////////////////////////////////////////////////////////////////////
    
    _afterColumnsetChange: function (e) {
        this._uiSetColumnset(e.newVal);
    },

    _uiSetColumnset: function(cs) {
        var tree = cs.get("tree"),
            thead = this._theadNode,
            i = 0,
            len = tree.length;
            
        //TODO: move thead off dom
        thead.get("children").remove(true);

        // Iterate tree of columns to add THEAD rows
        for(; i<len; ++i) {
            this._addTheadTrNode({thead:thead, columns:tree[i]}, (i === 0), (i === len-1));
        }

        // Column helpers needs _theadNode to exist
        //this._createColumnHelpers();

        
        //TODO: move thead on dom

     },
     
     _addTheadTrNode: function(o, isFirst, isLast) {
        o.tr = this._createTheadTrNode(o, isFirst, isLast);
        this._attachTheadTrNode(o);
     },
     

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

    _attachTheadTrNode: function(o) {
        o.thead.appendChild(o.tr);
    },

    _addTheadThNode: function(o) {
        o.th = this._createTheadThNode(o);
        this._attachTheadThNode(o);
    },

    _createTheadThNode: function(o) {
        var column = o.column;
        
        // Populate template object
        o.id = column.get("id");//TODO: validate 1 column ID per document
        o.colspan = column.get("colspan");
        o.rowspan = column.get("rowspan");
        //TODO o.abbr = column.get("abbr");
        //TODO o.classnames
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

    _attachTheadThNode: function(o) {
        o.tr.appendChild(o.th);
    },

    _afterRecordsetChange: function (e) {
        this._uiSetRecordset(e.newVal);
    },

    _uiSetRecordset: function(rs) {
        var i = 0,//TODOthis.get("state.offsetIndex")
            len = rs.getLength(), //TODOthis.get("state.pageLength")
            o = {tbody:this._tbodyNode}; //TODO: not sure best time to do this -- depends on sdt

        // Iterate recordset to use existing or add new tr
        for(; i<len; ++i) {
            o.record = rs.getRecord(i);
            o.rowindex = i;
            this._addTbodyTrNode(o); //TODO: sometimes rowindex != recordindex
        }
    },

    _addTbodyTrNode: function(o) {
        var tbody = o.tbody,
            record = o.record;
        o.tr = tbody.one("#"+record.get("id")) || this._createTbodyTrNode(o);
        this._attachTbodyTrNode(o);
    },

    _createTbodyTrNode: function(o) {
        var tr = Ycreate(Ysubstitute(this.get("trTemplate"), {id:o.record.get("id")})),
            i = 0,
            allKeys = this.get("columnset").get("keys"),
            len = allKeys.length,
            column;

        o.tr = tr;
        
        for(; i<len; ++i) {
            o.column = allKeys[i];
            this._addTbodyTdNode(o);
        }
        
        return tr;
    },

    _attachTbodyTrNode: function(o) {
        var tbody = o.tbody,
            tr = o.tr,
            record = o.record,
            index = o.rowindex,
            nextSibling = tbody.get("children").item(index) || null;

        tbody.insertBefore(tr, nextSibling);
    },

    _addTbodyTdNode: function(o) {
        o.td = this._createTbodyTdNode(o);
        this._attachTbodyTdNode(o);
    },
    
    _createTbodyTdNode: function(o) {
        var column = o.column;
        o.headers = column.get("headers");
        o.value = this.formatDataCell(o);
        return Ycreate(Ysubstitute(this.tdTemplate, o));
    },
    
    _attachTbodyTdNode: function(o) {
        o.tr.appendChild(o.td);
    },

    formatDataCell: function(o) {
        var record = o.record;
        o.data = record.get("data");
        o.value = record.getValue(o.column.get("key"));
        return Ysubstitute(this.get("tdValueTemplate"), o);
    }
});

Y.namespace("DataTable").Base = DTBase;
