YUI.add('datatable-base', function(Y) {

function Column(config) {
    Column.superclass.constructor.apply(this, arguments);
}

/**
 * Class name.
 *
 * @property NAME
 * @type String
 * @static
 * @final
 * @value "column"
 */
Column.NAME = "column";

/////////////////////////////////////////////////////////////////////////////
//
// Column Attributes
//
/////////////////////////////////////////////////////////////////////////////
Column.ATTRS = {
    id: {
        valueFn: "_defaultId",
        writeOnce: true
    },
    key: {
        valueFn: "_defaultKey"
    },
    field: {
        valueFn: "_defaultField"
    },
    label: {
        valueFn: "_defaultLabel"
    },
    keyIndex: {
        readOnly: true
    },
    parent: {
        readOnly: true
    },
    children: {
    },
    colspan: {
        readOnly: true
    },
    rowspan: {
        readOnly: true
    },
    thNode: {
        readOnly: true
    },
    thLinerNode: {
        readOnly: true
    },
    thLabelNode: {
        readOnly: true
    },
    abbr: {
        value: null
    },
    className: {},
    editor: {},
    formatter: {},
    
    // requires datatable-colresize
    resizeable: {},

    //requires datatable-sort
    sortable: {},
    hidden: {},
    width: {},
    minWidth: {},
    maxAutoWidth: {}
};

/* Column extends Widget */
Y.extend(Column, Y.Widget, {
    _defaultId: function() {
        return Y.guid();
    },

    _defaultKey: function(key) {
        return key || Y.guid();
    },

    _defaultField: function(field) {
        return field || this.get("key");
    },

    _defaultLabel: function(label) {
        return label || this.get("key");
    },

    initializer: function() {
    },

    destructor: function() {
    },

    syncUI: function() {
        this._uiSetAbbr(this.get("abbr"));
    },

    _afterAbbrChange: function (e) {
        this._uiSetAbbr(e.newVal);
    },
    
    _uiSetAbbr: function(val) {
        this._thNode.set("abbr", val);
    }

});

Y.Column = Column;

var Lang = Y.Lang;

function Columnset(config) {
    Columnset.superclass.constructor.apply(this, arguments);
}

/**
 * Class name.
 *
 * @property NAME
 * @type String
 * @static
 * @final
 * @value "columnset"
 */
Columnset.NAME = "columnset";

/////////////////////////////////////////////////////////////////////////////
//
// Columnset Attributes
//
/////////////////////////////////////////////////////////////////////////////
Columnset.ATTRS = {
    columns: {
        setter: "_setColumns"
    },

    // DOM tree representation of all Columns
    tree: {
        readOnly: true,
        value: []
    },

    //TODO: is this necessary?
    // Flat representation of all Columns
    flat: {
        readOnly: true,
        value: []
    },

    // Hash of all Columns by ID
    hash: {
        readOnly: true,
        value: {}
    },

    // Flat representation of only Columns that are meant to display data
    keys: {
        readOnly: true,
        value: []
    }
};

/* Columnset extends Base */
Y.extend(Columnset, Y.Base, {
    _setColumns: function(columns) {
            return Y.clone(columns);
    },

    initializer: function() {

            // DOM tree representation of all Columns
            var tree = [],
            // Flat representation of all Columns
            flat = [],
            // Hash of all Columns by ID
            hash = {},
            // Flat representation of only Columns that are meant to display data
            keys = [],
            // Original definitions
            columns = this.get("columns"),

            self = this;

        // Internal recursive function to define Column instances
        function parseColumns(depth, nodeList, parent) {
            var i=0,
                len = nodeList.length,
                currentNode,
                column,
                currentChildren;

            // One level down
            depth++;

            // Create corresponding dom node if not already there for this depth
            if(!tree[depth]) {
                tree[depth] = [];
            }

            // Parse each node at this depth for attributes and any children
            for(; i<len; ++i) {
                currentNode = nodeList[i];

                currentNode = Lang.isString(currentNode) ? {key:currentNode} : currentNode;

                // Instantiate a new Column for each node
                column = new Y.Column(currentNode);

                // Cross-reference Column ID back to the original object literal definition
                currentNode.yuiColumnId = column.get("id");

                // Add the new Column to the flat list
                flat.push(column);

                // Add the new Column to the hash
                hash[column.get("id")] = column;

                // Assign its parent as an attribute, if applicable
                if(parent) {
                    column._set("parent", parent);
                }

                // The Column has descendants
                if(Lang.isArray(currentNode.children)) {
                    currentChildren = currentNode.children;
                    column._set("children", currentChildren);

                    self._setColSpans(column, currentNode);

                    self._cascadePropertiesToChildren(column, currentChildren);

                    // The children themselves must also be parsed for Column instances
                    if(!tree[depth+1]) {
                        tree[depth+1] = [];
                    }
                    parseColumns(depth, currentChildren, column);
                }
                // This Column does not have any children
                else {
                    column._set("keyIndex", keys.length);
                    column._set("colspan", 1);
                    keys.push(column);
                }

                // Add the Column to the top-down dom tree
                tree[depth].push(column);
            }
            depth--;
        }

        // Parse out Column instances from the array of object literals
        parseColumns(-1, columns);


        // Save to the Columnset instance
        this._set("tree", tree);
        this._set("flat", flat);
        this._set("hash", hash);
        this._set("keys", keys);

        this._setRowSpans();
        this._setHeaders();
    },

    destructor: function() {
    },

    _cascadePropertiesToChildren: function(oColumn, currentChildren) {
        var i = 0,
            len = currentChildren.length,
            child;

        // Cascade certain properties to children if not defined on their own
        for(; i<len; ++i) {
            child = currentChildren[i];
            if(oColumn.get("className") && (child.className === undefined)) {
                child.className = oColumn.get("className");
            }
            if(oColumn.get("editor") && (child.editor === undefined)) {
                child.editor = oColumn.get("editor");
            }
            if(oColumn.get("formatter") && (child.formatter === undefined)) {
                child.formatter = oColumn.get("formatter");
            }
            if(oColumn.get("resizeable") && (child.resizeable === undefined)) {
                child.resizeable = oColumn.get("resizeable");
            }
            if(oColumn.get("sortable") && (child.sortable === undefined)) {
                child.sortable = oColumn.get("sortable");
            }
            if(oColumn.get("hidden")) {
                child.hidden = true;
            }
            if(oColumn.get("width") && (child.width === undefined)) {
                child.width = oColumn.get("width");
            }
            if(oColumn.get("minWidth") && (child.minWidth === undefined)) {
                child.minWidth = oColumn.get("minWidth");
            }
            if(oColumn.get("maxAutoWidth") && (child.maxAutoWidth === undefined)) {
                child.maxAutoWidth = oColumn.get("maxAutoWidth");
            }
        }
    },

    _setColSpans: function(oColumn, currentNode) {
        // Determine COLSPAN value for this Column
        var terminalChildNodes = 0;

        function countTerminalChildNodes(ancestor) {
            var descendants = ancestor.children,
                i = 0,
                len = descendants.length;

            // Drill down each branch and count terminal nodes
            for(; i<len; ++i) {
                // Keep drilling down
                if(Lang.isArray(descendants[i].children)) {
                    countTerminalChildNodes(descendants[i]);
                }
                // Reached branch terminus
                else {
                    terminalChildNodes++;
                }
            }
        }
        countTerminalChildNodes(currentNode);
        oColumn._set("colspan", terminalChildNodes);
    },

    _setRowSpans: function() {
        // Determine ROWSPAN value for each Column in the dom tree
        function parseDomTreeForRowspan(tree) {
            var maxRowDepth = 1,
                currentRow,
                currentColumn,
                m,p;

            // Calculate the max depth of descendants for this row
            function countMaxRowDepth(row, tmpRowDepth) {
                tmpRowDepth = tmpRowDepth || 1;

                var i = 0,
                    len = row.length,
                    col;

                for(; i<len; ++i) {
                    col = row[i];
                    // Column has children, so keep counting
                    if(Lang.isArray(col.children)) {
                        tmpRowDepth++;
                        countMaxRowDepth(col.children, tmpRowDepth);
                        tmpRowDepth--;
                    }
                    // Column has children, so keep counting
                    else if(col.get && Lang.isArray(col.get("children"))) {
                        tmpRowDepth++;
                        countMaxRowDepth(col.get("children"), tmpRowDepth);
                        tmpRowDepth--;
                    }
                    // No children, is it the max depth?
                    else {
                        if(tmpRowDepth > maxRowDepth) {
                            maxRowDepth = tmpRowDepth;
                        }
                    }
                }
            }

            // Count max row depth for each row
            for(m=0; m<tree.length; m++) {
                currentRow = tree[m];
                countMaxRowDepth(currentRow);

                // Assign the right ROWSPAN values to each Column in the row
                for(p=0; p<currentRow.length; p++) {
                    currentColumn = currentRow[p];
                    if(!Lang.isArray(currentColumn.get("children"))) {
                        currentColumn._set("rowspan", maxRowDepth);
                    }
                    else {
                        currentColumn._set("rowspan", 1);
                    }
                }

                // Reset counter for next row
                maxRowDepth = 1;
            }
        }
        parseDomTreeForRowspan(this.get("tree"));
    },

    _setHeaders: function() {
        var headers, column,
            allKeys = this.get("keys"),
            i=0, len = allKeys.length;

        function recurseAncestorsForHeaders(headers, oColumn) {
            headers.push(oColumn.get("key"));
            //headers[i].push(oColumn.getSanitizedKey());
            if(oColumn.get("parent")) {
                recurseAncestorsForHeaders(headers, oColumn.get("parent"));
            }
        }
        for(; i<len; ++i) {
            headers = [];
            column = allKeys[i];
            recurseAncestorsForHeaders(headers, column);
            column._set("headers", headers.reverse().join(" "));
        }
    },

    getColumn: function() {
    }
});

Y.Columnset = Columnset;

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
        var ok = this._addTableNode() &&
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

    _addTableNode: function() {
        if (!this._tableNode) {
            this._tableNode = this.get("contentBox").appendChild(Ycreate(TEMPLATE_TABLE));
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



}, '@VERSION@' ,{lang:['en'], requires:['intl','substitute','widget','recordset']});
