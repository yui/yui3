YUI.add('datatable-base', function(Y) {

var LANG = Y.Lang,
    NODE = Y.Node,
    GETCLASSNAME = Y.ClassNameManager.getClassName,
    BIND = Y.bind,

    DATATABLE = "datatable",

    CLASS_DATA = GETCLASSNAME(DATATABLE, "data"),
    CLASS_MSG = GETCLASSNAME(DATATABLE, "msg"),
    CLASS_FIRST = GETCLASSNAME(DATATABLE, "first"),
    CLASS_LAST = GETCLASSNAME(DATATABLE, "last"),

    TEMPLATE_TH = '<th id="{id}" rowspan="{rowspan}" colspan="{colspan}">{value}</th>',
    TEMPLATE_TR = '<tr id="{id}"></tr>',
    TEMPLATE_TD = '<td headers="{headers}">{value}</td>',
    TEMPLATE_VALUE = '{value}';

function DTBase(config) {
    DTBase.superclass.constructor.apply(this, arguments);
}

/*
 * Required NAME static field, to identify the Widget class and
 * used as an event prefix, to generate class names etc. (set to the
 * class name in camel case).
 */
DTBase.NAME = "baseDataTable";

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
        this.publish("addTr", {defaultFn: BIND("_defAddTrFn", this), queuable:true});

        // This set of custom events pass through DOM event facades
        //TODO: are the default functions necessary?
        this.publish("theadCellClick", {emitFacade:false, defaultFn: BIND("_defTheadCellClickFn", this), queuable:true});
        this.publish("theadRowClick", {emitFacade:false, defaultFn: BIND("_defTheadRowClickFn", this), queuable:true});
        this.publish("theadClick", {emitFacade:false, defaultFn: BIND("_defTheadClickFn", this), queuable:true});
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
            this._theadNode = tableNode.insertBefore(NODE.create("<thead class='"+CLASS_DATA+"'></thead>"), this._colgroupNode.next());
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
        var theadNode = this._theadNode,
            tbodyNode = this._tbodyNode,
            msgNode = this._msgNode,
            contentBox = this.get("contentBox");

        this._tableNode.delegate("click", BIND(this._onTheadClick, this), "thead."+CLASS_DATA+">tr>th");
        this._tableNode.delegate("click", BIND(this._onTbodyClick, this), "tbody."+CLASS_DATA+">tr>td");
        this._tableNode.delegate("click", BIND(this._onMsgClick, this), "tbody."+CLASS_MSG+">tr>td");

/*
        // Set up DOM events for THEAD
        theadNode.on("focus", BIND("_onTheadFocus", this));
        theadNode.on("keydown", BIND("_onTheadKeydown", this));
        theadNode.on("mouseover", BIND("_onTableMouseover", this));
        theadNode.on("mouseout", BIND("_onTableMouseout", this));
        theadNode.on("mousedown", BIND("_onTableMousedown", this));
        theadNode.on("mouseup", BIND("_onTableMouseup", this));
        theadNode.on("click", BIND("_onTheadClick", this));
        // Since we can't listen for click and dblclick on the same element...
        // Attach dblclick separately to contentBox
        // theadNode.on("dblclick", BIND("_onTableDblclick", this));

        // Set up DOM events for TBODY
        tbodyNode.on("focus", BIND("this._onTbodyFocus", this));
        tbodyNode.on("mouseover", BIND("_onTableMouseover", this));
        tbodyNode.on("mouseout", BIND("_onTableMouseout", this));
        tbodyNode.on("mousedown", BIND("_onTableMousedown", this));
        tbodyNode.on("mouseup", BIND("_onTableMouseup", this));
        tbodyNode.on("keydown", BIND("_onTbodyKeydown", this));
        tbodyNode.on("keypress", BIND("_onTableKeypress", this));
        tbodyNode.on("click", BIND("_onTbodyClick", this));
        // Since we can't listen for click and dblclick on the same element...
        // Attach dblick separately to contentBox
        // tbodyNode.on("dblclick", BIND("_onTableDblclick", this));

        contentBox.on("focus", BIND("_onTableFocus", this));
        contentBox.on("dblclick", BIND("_onTableDblclick", this));

        // Set up DOM events for msg node
        msgNode.on("focus", BIND("_onTbodyFocus", this));
        msgNode.on("mouseover", BIND("_onTableMouseover", this));
        msgNode.on("mouseout", BIND("_onTableMouseout", this));
        msgNode.on("mousedown", BIND("_onTableMousedown", this));
        msgNode.on("mouseup", BIND("_onTableMouseup", this));
        msgNode.on("keydown", BIND("_onTbodyKeydown", this));
        msgNode.on("keypress", BIND("_onTableKeypress", this));
        msgNode.on("click", BIND("_onTbodyClick", this));
*/
    },

    _onTheadFocus: function() {
    },

    _onTheadKeydown: function() {
    },

    _onTheadClick: function(e, target, container) {
        this.fire("theadCellClick", e);
        this.fire("theadRowClick", e);
        this.fire("theadClick", e);
    },


    _onTbodyFocus: function() {
    },

    _onTbodyKeydown: function() {
    },

    _onTbodyClick: function() {
    },


    _onTableMouseover: function() {
    },

    _onTableMouseout: function() {
    },

    _onTableMousedown: function() {
    },

    _onTableMouseup: function() {
    },

    _onTableKeypress: function() {
    },

    _onTableFocus: function() {
    },

    _onTableDblclick: function() {
    },

    _defTheadCellClickFn: function() {

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
        // HEADER ROWS
        this._uiSetColumnset(this.get("columnset"));
        // DATA RECORDS
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

    _afterColumnsetChange: function (e) {
        this._uiSetColumnset(e.newVal);
    },

    _uiSetColumnset: function(cs) {
        //TODO
        // this._removeHeaderRows();

        var tree = cs.get("tree"),
            theadNode = this._theadNode,
            tr,
            i = 0,
            len = tree.length;

        // Iterate tree to add rows
        for(; i<len; ++i) {
            tr = this._createHeaderTr(tree[i]);

            // Set FIRST/LAST class
            if(i === 0) {
                tr.addClass(CLASS_FIRST);
            }
            if(i === (len-1)) {
                tr.addClass(CLASS_LAST);
            }

            theadNode.appendChild(tr);
        }

        //TODO
        //this._setHeaderFirstLastClasses();

        // Column helpers needs _theadNode to exist
        //this._createColumnHelpers();
    },

    _createHeaderTr: function(record) {
        var tr = NODE.create(this._getHeaderTrMarkup(record));
        this._createThNodes(record, tr);
        this.fire("addHeaderTr", {record: record, tr: tr});
        return tr;
    },

    _getHeaderTrMarkup: function(record) {
        return Y.substitute(this.get("trTemplate"), {});
    },

    _createThNodes: function(treeRow, tr) {
        var i = 0,
            len = treeRow.length,
            ths = [],
            column,
            o;

        for(; i<len; ++i) {
            column = treeRow[i];
            ths.push(this._getThNodeMarkup({value:column.get("label")}, column));
            //column._set("thNode", thNode);
        }

        //TODO fire an event with node to append so that you can access the node via a listener

        tr.appendChild(NODE.create(ths.join("")));
    },

    _getThNodeMarkup: function(o, column) {
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
        var tbodyNode = this._tbodyNode,
            i = 0,//TODOthis.get("state.offsetIndex"),
            len = 3,//TODOthis.get("state.pageLength"),
            record,
            tr,
            nextSibling;

        // Iterate recordset to use existing or add new tr
        for(; i<len; ++i) {
            record = rs.getRecord(i);
            tr = tbodyNode.one("#"+record.get("id")) || this._createBodyTr(record);
            nextSibling = tbodyNode.get("children").item(i) || null;
            tbodyNode.insertBefore(tr, nextSibling);
        }
    },

    _createBodyTr: function(record) {
        var tr = NODE.create(this._getDataTrMarkup(record));
        this._createTdNodes(record, tr);
        this.fire("addDataTr", {record: record, tr: tr}); //on and after are the same state here bc there is no def fn
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



}, '@VERSION@' ,{lang:['en'], requires:['intl','substitute','widget']});
