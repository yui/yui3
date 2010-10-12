var LANG = Y.Lang,
    NODE = Y.Node,
    GETCLASSNAME = Y.ClassNameManager.getClassName,
    BIND = Y.bind,

    DATATABLE = "datatable",
    
    FOCUS = "focus",
    KEYDOWN = "keydown",
    MOUSEOVER = "mouseover",
    MOUSEOUT = "mouseout",
    MOUSEUP = "mouseup",
    MOUSEDOWN = "mousedown",
    CLICK = "click",
    DOUBLECLICK = "doubleclick",

    CLASS_COLUMNS = GETCLASSNAME(DATATABLE, "columns"),
    CLASS_DATA = GETCLASSNAME(DATATABLE, "data"),
    CLASS_MSG = GETCLASSNAME(DATATABLE, "msg"),
    CLASS_LINER = GETCLASSNAME(DATATABLE, "liner"),
    CLASS_FIRST = GETCLASSNAME(DATATABLE, "first"),
    CLASS_LAST = GETCLASSNAME(DATATABLE, "last"),

    TEMPLATE_TH = '<th id="{id}" rowspan="{rowspan}" colspan="{colspan}"><div class="'+CLASS_LINER+'">{value}</div></th>',
    TEMPLATE_TR = '<tr id="{id}"></tr>',
    TEMPLATE_TD = '<td headers="{headers}"><div class="'+CLASS_LINER+'">{value}</div></td>',
    TEMPLATE_VALUE = '{value}';

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
        return LANG.isArray(columns) ? new Y.Columnset({columns:columns}) : columns;
    },

    _setRecordset: function(recordset) {
        if(LANG.isArray(recordset)) {
            recordset = new Y.Recordset({records:recordset});
        }

        recordset.addTarget(this);
        return recordset;
    },

    // Initialization
    initializer: function() {
        // Custom events that broadcast DOM updates
        this.publish("addTheadTr", {defaultFn: BIND("_defAddTheadTrFn", this), queuable:false});
        this.publish("addTheadTh", {defaultFn: BIND("_defAddTheadThFn", this), queuable:false});

        this.publish("addTr", {defaultFn: BIND("_defAddTrFn", this), queuable:false});
        this.publish("addTd", {defaultFn: BIND("_defAddTdFn", this), queuable:false});

        // Custom events that broadcast DOM interactions
        // Simply pass through DOM event facades
        //TODO: do we need queuable=true?
        this.publish("theadCellClick", {emitFacade:false});
        this.publish("theadRowClick", {emitFacade:false});
        this.publish("theadClick", {emitFacade:false});
    },

    // Destruction
    destructor: function() {
         this.get("recordset").removeTarget(this);
    },

    // UI
    renderUI: function() {
        // TABLE and CAPTION
        var ok = this._createTableNode();
        // COLGROUP
        ok = ok ? this._createColgroupNode(this._tableNode) : false;
        // THEAD
        ok = ok ? this._createTheadNode(this._tableNode) : false;
        // Primary TBODY
        ok = ok ? this._createTbodyNode(this._tableNode) : false;
         // Message TBODY
        ok = ok ? this._createMessageNode(this._tableNode) : false;
        // CAPTION
        ok = ok ? this._createCaptionNode(this._tableNode) : false;
        return ok;
    },

    _createTableNode: function() {
        if (!this._tableNode) {
            this._tableNode = this.get("contentBox").appendChild(NODE.create("<table></table>"));
        }
        return this._tableNode;
    },

    _createColgroupNode: function(tableNode) {
        // Add COLs to DOCUMENT FRAGMENT
        var allKeys = this.get("columnset").get("keys"),
            i = 0,
            len = allKeys.length,
            allCols = ["<colgroup>"];

        for(; i<len; ++i) {
            allCols.push("<col></col>");
        }

        allCols.push("</colgroup>");

        // Create COLGROUP
        this._colgroupNode = tableNode.insertBefore(NODE.create(allCols.join("")), tableNode.get("firstChild"));

        return this._colgroupNode;
    },

    _createTheadNode: function(tableNode) {
        if(tableNode) {
            this._theadNode = tableNode.insertBefore(NODE.create("<thead class='"+CLASS_COLUMNS+"'></thead>"), this._colgroupNode.next());
            return this._theadNode;
        }
    },

    _createTbodyNode: function(tableNode) {
        this._tbodyNode = tableNode.appendChild(NODE.create("<tbody class='"+CLASS_DATA+"'></tbody>"));
        return this._tbodyNode;
    },

    _createMessageNode: function(tableNode) {
        this._msgNode = tableNode.insertBefore(NODE.create("<tbody class='"+CLASS_MSG+"'></tbody>"), this._tbodyNode);
        return this._msgNode;
    },

    _createCaptionNode: function(tableNode) {
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
        tableNode.delegate(FOCUS, BIND(this._onTheadFocus, this), theadFilter);
        tableNode.delegate(KEYDOWN, BIND(this._onTheadKeydown, this), theadFilter);
        tableNode.delegate(MOUSEOVER, BIND(this._onTheadMouseover, this), theadFilter);
        tableNode.delegate(MOUSEOUT, BIND(this._onTheadMouseout, this), theadFilter);
        tableNode.delegate(MOUSEUP, BIND(this._onTheadMouseup, this), theadFilter);
        tableNode.delegate(MOUSEDOWN, BIND(this._onTheadMousedown, this), theadFilter);
        tableNode.delegate(CLICK, BIND(this._onTheadClick, this), theadFilter);
        // Since we can't listen for click and dblclick on the same element...
        contentBox.delegate(DOUBLECLICK, BIND(this._onTheadDoubleclick, this), theadFilter);

        // DOM event delegation for TBODY
        tableNode.delegate(FOCUS, BIND(this._onTbodyFocus, this), tbodyFilter);
        tableNode.delegate(KEYDOWN, BIND(this._onTbodyKeydown, this), tbodyFilter);
        tableNode.delegate(MOUSEOVER, BIND(this._onTbodyMouseover, this), tbodyFilter);
        tableNode.delegate(MOUSEOUT, BIND(this._onTbodyMouseout, this), tbodyFilter);
        tableNode.delegate(MOUSEUP, BIND(this._onTbodyMouseup, this), tbodyFilter);
        tableNode.delegate(MOUSEDOWN, BIND(this._onTbodyMousedown, this), tbodyFilter);
        tableNode.delegate("click", BIND(this._onTbodyClick, this), tbodyFilter);
        // Since we can't listen for click and dblclick on the same element...
        contentBox.delegate(DOUBLECLICK, BIND(this._onTbodyDoubleclick, this), tbodyFilter);

        // DOM event delegation for MSG TBODY
        tableNode.delegate(FOCUS, BIND(this._onMsgFocus, this), msgFilter);
        tableNode.delegate(KEYDOWN, BIND(this._onMsgKeydown, this), msgFilter);
        tableNode.delegate(MOUSEOVER, BIND(this._onMsgMouseover, this), msgFilter);
        tableNode.delegate(MOUSEOUT, BIND(this._onMsgMouseout, this), msgFilter);
        tableNode.delegate(MOUSEUP, BIND(this._onMsgMouseup, this), msgFilter);
        tableNode.delegate(MOUSEDOWN, BIND(this._onMsgMousedown, this), msgFilter);
        tableNode.delegate("click", BIND(this._onMsgClick, this), msgFilter);
        // Since we can't listen for click and dblclick on the same element...
        contentBox.delegate(DOUBLECLICK, BIND(this._onMsgDoubleclick, this), msgFilter);

    },

    _onTheadFocus: function() {
    },

    _onTheadKeydown: function() {
    },

    _onTheadMouseover: function() {
    },

    _onTheadMouseout: function() {
    },

    _onTheadMouseup: function() {
    },

    _onTheadMousedown: function() {
    },

    // e.currentTarget holds the clicked element
    _onTheadClick: function(e) {
        this.fire("theadCellClick", e);
        this.fire("theadRowClick", e);
        this.fire("theadClick", e);
    },

    _onTheadDoubleclick: function() {
    },

    _onTbodyFocus: function() {
    },

    _onTbodyKeydown: function() {
    },

    _onTbodyMouseover: function() {
    },

    _onTbodyMouseout: function() {
    },

    _onTbodyMouseup: function() {
    },

    _onTbodyMousedown: function() {
    },

    _onTbodyClick: function(e) {
    },

    _onTbodyDoubleclick: function() {
    },

    _onMsgFocus: function() {
    },

    _onMsgKeydown: function() {
    },

    _onMsgMouseover: function() {
    },

    _onMsgMouseout: function() {
    },

    _onMsgMouseup: function() {
    },

    _onMsgMousedown: function() {
    },

    _onMsgClick: function(e) {
    },

    _onMsgDoubleclick: function() {
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
        this._captionNode.set("innerHTML", val);
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
            theadNode = this._theadNode,
            i = 0,
            len = tree.length,
            tr,
            columns;
            
        while(theadNode.get("firstChild")) {
            theadNode.removeChild(theadNode.get("firstChild"));
        }
        
        //TODO: move thead off dom

        // Iterate tree to add rows
        for(; i<len; ++i) {
            columns = tree[i];
            tr = NODE.create(this._getTheadTrMarkup(columns));
            
            // Set FIRST/LAST class
            if(i === 0) {
                tr.addClass(CLASS_FIRST);
            }
            if(i === len-1) {
                tr.addClass(CLASS_LAST);
            }
            
            this.fire("addTheadTr", {columns:columns, thead:theadNode, tr:tr});
        }

        // Column helpers needs _theadNode to exist
        //this._createColumnHelpers();

        
        //TODO: move thead on dom

     },

    _defAddTheadTrFn: function(e) {
        var columns = e.columns,
            thead = e.thead,
            tr = e.tr,
            i = 0,
            len = columns.length,
            column,
            th;

        for(; i<len; ++i) {
            column = columns[i];
            th = NODE.create(this._getTheadThMarkup({value:column.get("label")}, column));
            this.fire("addTheadTh", {column:column, tr:tr, th:th});
        }

       thead.appendChild(tr);
    },
    
    _getTheadTrMarkup: function(record) {
        return Y.substitute(this.get("trTemplate"), {});
    },

    _defAddTheadThFn: function(e) {
            e.tr.appendChild(e.th);
            //column._set("thNode", thNode);
    },

    _getTheadThMarkup: function(o, column) {
        o.column = column;
        o.id = column.get("id");//TODO: validate 1 column ID per document
        o.value = Y.substitute(this.get("thValueTemplate"), o);
        //TODO o.classnames
        o.colspan = column.get("colspan");
        o.rowspan = column.get("rowspan");
        //TODO o.abbr = column.get("abbr");

        /*TODO
        // Clear minWidth on hidden Columns
        if(column.get("hidden")) {
            //this._clearMinWidth(column);
        }
        */

        return Y.substitute(this.thTemplate, o);
    },

    _afterRecordsetChange: function (e) {
        this._uiSetRecordset(e.newVal);
    },

    _uiSetRecordset: function(rs) {
        var i = 0,//TODOthis.get("state.offsetIndex"),
            len = 3;//TODOthis.get("state.pageLength"),;

        // Iterate recordset to use existing or add new tr
        for(; i<len; ++i) {
            this.fire("addTr", {record:rs.getRecord(i), index:i});//this._createBodyTr(record);
        }
    },

    _defAddTrFn: function(e) {
        var record = e.record,
            index = e.index,
            tbodyNode = this._tbodyNode,
            nextSibling = tbodyNode.get("children").item(index) || null,
            tr = tbodyNode.one("#"+record.get("id")) || this._createBodyTr(record);
        tbodyNode.insertBefore(tr, nextSibling);
        return tr;
    },

    _createBodyTr: function(record) {
        var tr = NODE.create(this._getDataTrMarkup(record));
        this._createTdNodes(record, tr);
        return tr;
    },

    _getDataTrMarkup: function(record) {
        return Y.substitute(this.get("trTemplate"), {id:record.get("id")});
    },

    _createTdNodes: function(record, tr) {
        var i = 0,
            allKeys = this.get("columnset").get("keys"),
            len = allKeys.length,
            tds = [];

        for(; i<len; ++i) {
            tds.push(this._getTdNodeMarkup(record, allKeys[i]));
        }

        tr.appendChild(NODE.create(tds.join("")));
    },


    _getTdNodeMarkup: function(record, column) {
        var o = {};
        o.headers = column.get("headers");
        o.value = this.formatDataCell(record, column);
        return Y.substitute(this.tdTemplate, o);
    },

    formatDataCell: function(record, column) {
        var o = {};
        o.data = record.get("data");
        o.value = record.getValue(column.get("key"));
        return Y.substitute(this.get("tdValueTemplate"), o);
    }
});

Y.namespace("DataTable").Base = DTBase;
