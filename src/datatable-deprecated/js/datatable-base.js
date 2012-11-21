// API Doc comments disabled to avoid deprecated class leakage into
// non-deprecated class API docs.  See the 3.4.1 datatable API doc files in the
// download at http://yui.zenfs.com/releases/yui3/yui_3.4.1.zip for reference.
/**
The DataTable widget provides a progressively enhanced DHTML control for
displaying tabular data across A-grade browsers.

DEPRECATED. As of YUI 3.5.0, DataTable has been rebuilt.  This module
corresponds to the 3.4.1 version of DataTable and will be removed from the
library in a future version.

See http://yuilibrary.com/yui/docs/migration.html for help upgrading to the
latest version.

For complete API docs for the classes in this and other deprecated
DataTable-related modules, refer to the static API doc files in the 3.4.1
download at http://yui.zenfs.com/releases/yui3/yui_3.4.1.zip

@module datatable-deprecated
@main datatable-deprecated
@deprecated
**/

/**
Provides the base DataTable implementation, which can be extended to add
additional functionality, such as sorting or scrolling.

DEPRECATED. As of YUI 3.5.0, DataTable has been rebuilt.  This module
corresponds to the 3.4.1 version of DataTable and will be removed from the
library in a future version.

See http://yuilibrary.com/yui/docs/migration.html for help upgrading to the
latest version.

For complete API docs for the classes in this and other deprecated
DataTable-related modules, refer to the static API doc files in the 3.4.1
download at http://yui.zenfs.com/releases/yui3/yui_3.4.1.zip

@module datatable-deprecated
@submodule datatable-base-deprecated
@deprecated
**/

/*
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

    /*
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
        /*
        * @attribute columnset
        * @description Pointer to Columnset instance.
        * @type Array | Y.Columnset
        */
        columnset: {
            setter: "_setColumnset"
        },

        /*
        * @attribute recordset
        * @description Pointer to Recordset instance.
        * @type Array | Y.Recordset
        */
        recordset: {
            valueFn: '_initRecordset',
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

        /*
        * @attribute summary
        * @description Summary.
        * @type String
        */
        summary: {
        },

        /*
        * @attribute caption
        * @description Caption
        * @type String
        */
        caption: {
        },

        /*
        * @attribute thValueTemplate
        * @description Tokenized markup template for TH value.
        * @type String
        * @default '{value}'
        */
        thValueTemplate: {
            value: TEMPLATE_VALUE
        },

        /*
        * @attribute tdValueTemplate
        * @description Tokenized markup template for TD value.
        * @type String
        * @default '{value}'
        */
        tdValueTemplate: {
            value: TEMPLATE_VALUE
        },

        /*
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
    /*
    * @property thTemplate
    * @description Tokenized markup template for TH node creation.
    * @type String
    * @default '<th id="{id}" rowspan="{rowspan}" colspan="{colspan}" class="{classnames}" abbr="{abbr}"><div class="'+CLASS_LINER+'">{value}</div></th>'
    */
    thTemplate: TEMPLATE_TH,

    /*
    * @property tdTemplate
    * @description Tokenized markup template for TD node creation.
    * @type String
    * @default '<td headers="{headers}" class="{classnames}"><div class="yui3-datatable-liner">{value}</div></td>'
    */
    tdTemplate: TEMPLATE_TD,
    
    /*
    * @property _theadNode
    * @description Pointer to THEAD node.
    * @type {Node}
    * @private
    */
    _theadNode: null,
    
    /*
    * @property _tbodyNode
    * @description Pointer to TBODY node.
    * @type {Node}
    * @private
    */
    _tbodyNode: null,
    
    /*
    * @property _msgNode
    * @description Pointer to message display node.
    * @type {Node}
    * @private
    */
    _msgNode: null,

    /////////////////////////////////////////////////////////////////////////////
    //
    // ATTRIBUTE HELPERS
    //
    /////////////////////////////////////////////////////////////////////////////
    /*
    * @method _setColumnset
    * @description Converts Array to Y.Columnset.
    * @param columns {Array | Y.Columnset}
    * @return {Columnset}
    * @private
    */
    _setColumnset: function(columns) {
        return YLang.isArray(columns) ? new Y.Columnset({definitions:columns}) : columns;
    },

    /*
     * Updates the UI if Columnset is changed.
     *
     * @method _afterColumnsetChange
     * @param e {Event} Custom event for the attribute change.
     * @protected
     */
    _afterColumnsetChange: function (e) {
        this._uiSetColumnset(e.newVal);
    },

    /*
    * @method _setRecordset
    * @description Converts Array to Y.Recordset.
    * @param records {Array | Recordset}
    * @return {Recordset}
    * @private
    */
    _setRecordset: function(rs) {
        if(YLang.isArray(rs)) {
            rs = new Y.Recordset({records:rs});
        }

        rs.addTarget(this);
        return rs;
    },
    
    /*
    * Updates the UI if Recordset is changed.
    *
    * @method _afterRecordsetChange
    * @param e {Event} Custom event for the attribute change.
    * @protected
    */
    _afterRecordsetChange: function (e) {
        this._uiSetRecordset(e.newVal);
    },

    /*
    * Updates the UI if Recordset records are changed.
    *
    * @method _afterRecordsChange
    * @param e {Event} Custom event for the attribute change.
    * @protected
    */
    _afterRecordsChange: function (e) {
        this._uiSetRecordset(this.get('recordset'));
    },

    /*
     * Updates the UI if summary is changed.
     *
     * @method _afterSummaryChange
     * @param e {Event} Custom event for the attribute change.
     * @protected
     */
    _afterSummaryChange: function (e) {
        this._uiSetSummary(e.newVal);
    },

    /*
     * Updates the UI if caption is changed.
     *
     * @method _afterCaptionChange
     * @param e {Event} Custom event for the attribute change.
     * @protected
     */
    _afterCaptionChange: function (e) {
        this._uiSetCaption(e.newVal);
    },

    ////////////////////////////////////////////////////////////////////////////
    //
    // METHODS
    //
    ////////////////////////////////////////////////////////////////////////////

    /*
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

    /*
    * Renders UI.
    *
    * @method renderUI
    * @private
    */
    renderUI: function() {
        // TABLE
        this._addTableNode(this.get("contentBox"));

        // COLGROUP
        this._addColgroupNode(this._tableNode);

        // THEAD
        this._addTheadNode(this._tableNode);

        // Primary TBODY
        this._addTbodyNode(this._tableNode);

        // Message TBODY
        this._addMessageNode(this._tableNode);

        // CAPTION
        this._addCaptionNode(this._tableNode);
   },

    /*
    * Creates and attaches TABLE element to given container.
    *
    * @method _addTableNode
    * @param containerNode {Node} Parent node.
    * @protected
    * @return {Node}
    */
    _addTableNode: function(containerNode) {
        if (!this._tableNode) {
            this._tableNode = containerNode.appendChild(Ycreate(TEMPLATE_TABLE));
        }
        return this._tableNode;
    },

    /*
    * Creates and attaches COLGROUP element to given TABLE.
    *
    * @method _addColgroupNode
    * @param tableNode {Node} Parent node.
    * @protected
    * @return {Node}
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

    /*
    * Creates and attaches THEAD element to given container.
    *
    * @method _addTheadNode
    * @param tableNode {Node} Parent node.
    * @protected
    * @return {Node}
    */
    _addTheadNode: function(tableNode) {
        if(tableNode) {
            this._theadNode = tableNode.insertBefore(Ycreate(TEMPLATE_THEAD), this._colgroupNode.next());
            return this._theadNode;
        }
    },

    /*
    * Creates and attaches TBODY element to given container.
    *
    * @method _addTbodyNode
    * @param tableNode {Node} Parent node.
    * @protected
    * @return {Node}
    */
    _addTbodyNode: function(tableNode) {
        this._tbodyNode = tableNode.appendChild(Ycreate(TEMPLATE_TBODY));
        return this._tbodyNode;
    },

    /*
    * Creates and attaches message display element to given container.
    *
    * @method _addMessageNode
    * @param tableNode {Node} Parent node.
    * @protected
    * @return {Node}
    */
    _addMessageNode: function(tableNode) {
        this._msgNode = tableNode.insertBefore(Ycreate(TEMPLATE_MSG), this._tbodyNode);
        return this._msgNode;
    },

    /*
    * Creates and attaches CAPTION element to given container.
    *
    * @method _addCaptionNode
    * @param tableNode {Node} Parent node.
    * @protected
    * @return {Node}
    */
    _addCaptionNode: function(tableNode) {
        this._captionNode = Y.Node.create('<caption></caption>');
    },

    ////////////////////////////////////////////////////////////////////////////
    //
    // BIND
    //
    ////////////////////////////////////////////////////////////////////////////

    /*
    * Binds events.
    *
    * @method bindUI
    * @private
    */
    bindUI: function() {
        this.after({
            columnsetChange: this._afterColumnsetChange,
            summaryChange  : this._afterSummaryChange,
            captionChange  : this._afterCaptionChange,
            recordsetChange: this._afterRecordsChange,
            "recordset:tableChange": this._afterRecordsChange
        });
    },
    
    delegate: function(type) {
        //TODO: is this necessary?
        if(type==="dblclick") {
            this.get("boundingBox").delegate.apply(this.get("boundingBox"), arguments);
        }
        else {
            this.get("contentBox").delegate.apply(this.get("contentBox"), arguments);
        }
    },
    

    ////////////////////////////////////////////////////////////////////////////
    //
    // SYNC
    //
    ////////////////////////////////////////////////////////////////////////////

    /*
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

    /*
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

    /*
     * Updates caption.
     *
     * @method _uiSetCaption
     * @param val {String} New caption.
     * @protected
     */
    _uiSetCaption: function(val) {
        var caption = this._captionNode,
            inDoc   = caption.inDoc(),
            method  = val ? (!inDoc && 'prepend') : (inDoc && 'removeChild');

        caption.setContent(val || '');

        if (method) {
            // prepend of remove necessary
            this._tableNode[method](caption);
        }
    },


    ////////////////////////////////////////////////////////////////////////////
    //
    // THEAD/COLUMNSET FUNCTIONALITY
    //
    ////////////////////////////////////////////////////////////////////////////
    /*
     * Updates THEAD.
     *
     * @method _uiSetColumnset
     * @param cs {Columnset} New Columnset.
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
            this._addTheadTrNode({
                thead:   thead,
                columns: tree[i],
                id     : '' // to avoid {id} leftovers from the trTemplate
            }, (i === 0), (i === len - 1));
        }

        // Column helpers needs _theadNode to exist
        //this._createColumnHelpers();

        
        // Re-attach THEAD to DOM
        parent.insert(thead, nextSibling);

     },
     
    /*
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
     

    /*
    * Creates header row element.
    *
    * @method _createTheadTrNode
    * @param o {Object} {thead, columns}.
    * @param isFirst {Boolean} Is first row.
    * @param isLast {Boolean} Is last row.
    * @protected
    * @return {Node}
    */
    _createTheadTrNode: function(o, isFirst, isLast) {
        //TODO: custom classnames
        var tr = Ycreate(fromTemplate(this.get("trTemplate"), o)),
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

    /*
    * Attaches header row element.
    *
    * @method _attachTheadTrNode
    * @param o {Object} {thead, columns, tr}.
    * @protected
    */
    _attachTheadTrNode: function(o) {
        o.thead.appendChild(o.tr);
    },

    /*
    * Creates and attaches header cell element.
    *
    * @method _addTheadThNode
    * @param o {Object} {value, column, tr}.
    * @protected
    */
    _addTheadThNode: function(o) {
        o.th = this._createTheadThNode(o);
        this._attachTheadThNode(o);
        //TODO: assign all node pointers: thNode, thLinerNode, thLabelNode
        o.column.thNode = o.th;
    },

    /*
    * Creates header cell element.
    *
    * @method _createTheadThNode
    * @param o {Object} {value, column, tr}.
    * @protected
    * @return {Node}
    */
    _createTheadThNode: function(o) {
        var column = o.column;
        
        // Populate template object
        o.id = column.get("id");//TODO: validate 1 column ID per document
        o.colspan = column.colSpan;
        o.rowspan = column.rowSpan;
        o.abbr = column.get("abbr");
        o.classnames = column.get("classnames");
        o.value = fromTemplate(this.get("thValueTemplate"), o);

        /*TODO
        // Clear minWidth on hidden Columns
        if(column.get("hidden")) {
            //this._clearMinWidth(column);
        }
        */
        
        return Ycreate(fromTemplate(this.thTemplate, o));
    },

    /*
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
    /*
     * Updates TBODY.
     *
     * @method _uiSetRecordset
     * @param rs {Recordset} New Recordset.
     * @protected
     */
    _uiSetRecordset: function(rs) {
        var self = this,
            oldTbody = this._tbodyNode,
            parent = oldTbody.get("parentNode"),
            nextSibling = oldTbody.next(),
            columns = this.get('columnset').keys,
            cellValueTemplate = this.get('tdValueTemplate'),
            o = {},
            newTbody, i, len, column, formatter;

        // Replace TBODY with a new one
        //TODO: split _addTbodyNode into create/attach
        oldTbody.remove();
        oldTbody = null;
        newTbody = this._addTbodyNode(this._tableNode);
        newTbody.remove();
        this._tbodyNode = newTbody;
        o.tbody = newTbody;

        o.rowTemplate = this.get('trTemplate');
        o.columns = [];

        // Build up column data to avoid passing through Attribute APIs inside
        // render loops for rows and cells
        for (i = columns.length - 1; i >= 0; --i) {
            column = columns[i];
            o.columns[i] = {
                column        : column,
                fields        : column.get('field'),
                classnames    : column.get('classnames'),
                emptyCellValue: column.get('emptyCellValue')
            }

            formatter = column.get('formatter');

            if (YLang.isFunction(formatter)) {
                // function formatters need to run before checking if the value
                // needs defaulting from column.emptyCellValue
                formatter = Y.bind(this._functionFormatter, this, formatter);
            } else {
                if (!YLang.isString(formatter)) {
                    formatter = cellValueTemplate;
                }

                // string formatters need the value defaulted before processing
                formatter = Y.bind(this._templateFormatter, this, formatter);
            }

            o.columns[i].formatter = formatter;
        }


        // Iterate Recordset to use existing TR when possible or add new TR
        // TODO i = this.get("state.offsetIndex")
        // TODO len =this.get("state.pageLength")
        for (i = 0, len = rs.size(); i < len; ++i) {
            o.record = rs.item(i);
            o.data   = o.record.get("data");
            o.rowindex = i;
            this._addTbodyTrNode(o); //TODO: sometimes rowindex != recordindex
        }
        
        // TBODY to DOM
        parent.insert(this._tbodyNode, nextSibling);
    },

    _functionFormatter: function (formatter, o) {
        var value = formatter.call(this, o);

        return (value !== undefined) ? value : o.emptyCellValue;
    },

    _templateFormatter: function (template, o) {
        if (o.value === undefined) {
            o.value = o.emptyCellValue;
        }

        return fromTemplate(template, o);
    },

    /*
    * Creates and attaches data row element.
    *
    * @method _addTbodyTrNode
    * @param o {Object} {tbody, record}
    * @protected
    */
    _addTbodyTrNode: function(o) {
        var row = o.tbody.one("#" + o.record.get("id"));

        o.tr = row || this._createTbodyTrNode(o);

        this._attachTbodyTrNode(o);
    },

    /*
    * Creates data row element.
    *
    * @method _createTbodyTrNode
    * @param o {Object} {tbody, record}
    * @protected
    * @return {Node}
    */
    _createTbodyTrNode: function(o) {
        var columns = o.columns,
            i, len, columnInfo;

        o.tr = Ycreate(fromTemplate(o.rowTemplate, { id: o.record.get('id') }));
        
        for (i = 0, len = columns.length; i < len; ++i) {
            columnInfo      = columns[i];
            o.column        = columnInfo.column;
            o.field         = columnInfo.fields;
            o.classnames    = columnInfo.classnames;
            o.formatter     = columnInfo.formatter;
            o.emptyCellValue= columnInfo.emptyCellValue;

            this._addTbodyTdNode(o);
        }
        
        return o.tr;
    },

    /*
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
            isOdd = (index % 2);
            
        if(isOdd) {
            tr.replaceClass(CLASS_EVEN, CLASS_ODD);
        } else {
            tr.replaceClass(CLASS_ODD, CLASS_EVEN);
        }
        
        tbody.insertBefore(tr, nextSibling);
    },

    /*
    * Creates and attaches data cell element.
    *
    * @method _addTbodyTdNode
    * @param o {Object} {record, column, tr}.
    * @protected
    */
    _addTbodyTdNode: function(o) {
        o.td = this._createTbodyTdNode(o);
        this._attachTbodyTdNode(o);
        delete o.td;
    },
    
    /*
    Creates a TD Node from the tdTemplate property using the input object as
    template {placeholder} values.  The created Node is also assigned to the
    `td` property on the input object.

    If the input object already has a `td` property, it is returned an no new
    Node is created.

    @method createCell
    @param {Object} data Template values
    @return {Node}
    **/
    createCell: function (data) {
        return data && (data.td ||
            (data.td = Ycreate(fromTemplate(this.tdTemplate, data))));
    },

    /*
    * Creates data cell element.
    *
    * @method _createTbodyTdNode
    * @param o {Object} {record, column, tr}.
    * @protected
    * @return {Node}
    */
    _createTbodyTdNode: function(o) {
        o.headers = o.column.headers;
        o.value   = this.formatDataCell(o);

        return o.td || this.createCell(o);
    },
    
    /*
    * Attaches data cell element.
    *
    * @method _attachTbodyTdNode
    * @param o {Object} {record, column, tr, headers, classnames, value}.
    * @protected
    */
    _attachTbodyTdNode: function(o) {
        o.tr.appendChild(o.td);
    },

    /*
     * Returns markup to insert into data cell element.
     *
     * @method formatDataCell
     * @param @param o {Object} {record, column, tr, headers, classnames}.
     */
    formatDataCell: function (o) {
        o.value = o.data[o.field];

        return o.formatter.call(this, o);
    },

    _initRecordset: function () {
        return new Y.Recordset({ records: [] });
    }
});

Y.namespace("DataTable").Base = DTBase;
