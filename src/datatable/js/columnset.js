/**
 * The Columnset class defines and manages a collection of Columns.
 *
 * @class Columnset
 * @extends Base
 * @constructor
 */
function Columnset(config) {
    Columnset.superclass.constructor.apply(this, arguments);
}

/////////////////////////////////////////////////////////////////////////////
//
// STATIC PROPERTIES
//
/////////////////////////////////////////////////////////////////////////////
Y.mix(Columnset, {
    /**
     * Class name.
     *
     * @property NAME
     * @type String
     * @static
     * @final
     * @value "columnset"
     */
    NAME: "columnset",

    /////////////////////////////////////////////////////////////////////////////
    //
    // ATTRIBUTES
    //
    /////////////////////////////////////////////////////////////////////////////
    ATTRS: {
        /**
        * @attribute definitions
        * @description Array of column definitions that will populate this Columnset.
        * @type Array
        */
        definitions: {
            setter: "_setDefinitions"
        }

    }
});

/////////////////////////////////////////////////////////////////////////////
//
// PROTOTYPE
//
/////////////////////////////////////////////////////////////////////////////
Y.extend(Columnset, Y.Base, {
    /////////////////////////////////////////////////////////////////////////////
    //
    // ATTRIBUTE HELPERS
    //
    /////////////////////////////////////////////////////////////////////////////
    /**
    * @method _setDefinitions
    * @description Clones definitions before setting.
    * @param definitions {Array} Array of column definitions.
    * @returns Array
    * @private
    */
    _setDefinitions: function(definitions) {
            return Y.clone(definitions);
    },
    
    /////////////////////////////////////////////////////////////////////////////
    //
    // PROPERTIES
    //
    /////////////////////////////////////////////////////////////////////////////
    /**
     * Top-down tree representation of Column hierarchy. Used to create DOM
     * elements.
     *
     * @property tree
     * @type Y.Column[]
     */
    tree: null,

    /**
     * Hash of all Columns by ID.
     *
     * @property idHash
     * @type Object
     */
    idHash: null,

    /**
     * Hash of all Columns by key.
     *
     * @property keyHash
     * @type Object
     */
    keyHash: null,

    /**
     * Array of only Columns that are meant to be displayed in DOM.
     *
     * @property keys
     * @type Y.Column[]
     */
    keys: null,

    /////////////////////////////////////////////////////////////////////////////
    //
    // METHODS
    //
    /////////////////////////////////////////////////////////////////////////////
    /**
    * Initializer. Generates all internal representations of the collection of
    * Columns.
    *
    * @method initializer
    * @param config {Object} Config object.
    * @private
    */
    initializer: function() {

        // DOM tree representation of all Columns
        var tree = [],
        // Hash of all Columns by ID
        idHash = {},
        // Hash of all Columns by key
        keyHash = {},
        // Flat representation of only Columns that are meant to display data
        keys = [],
        // Original definitions
        definitions = this.get("definitions"),

        self = this;

        // Internal recursive function to define Column instances
        function parseColumns(depth, currentDefinitions, parent) {
            var i=0,
                len = currentDefinitions.length,
                currentDefinition,
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
                currentDefinition = currentDefinitions[i];

                currentDefinition = YLang.isString(currentDefinition) ? {key:currentDefinition} : currentDefinition;

                // Instantiate a new Column for each node
                column = new Y.Column(currentDefinition);

                // Cross-reference Column ID back to the original object literal definition
                currentDefinition.yuiColumnId = column.get("id");

                // Add the new Column to the hash
                idHash[column.get("id")] = column;
                keyHash[column.get("key")] = column;

                // Assign its parent as an attribute, if applicable
                if(parent) {
                    column.parent = parent;
                }

                // The Column has descendants
                if(YLang.isArray(currentDefinition.children)) {
                    currentChildren = currentDefinition.children;
                    column._set("children", currentChildren);

                    self._setColSpans(column, currentDefinition);

                    self._cascadePropertiesToChildren(column, currentChildren);

                    // The children themselves must also be parsed for Column instances
                    if(!tree[depth+1]) {
                        tree[depth+1] = [];
                    }
                    parseColumns(depth, currentChildren, column);
                }
                // This Column does not have any children
                else {
                    column.keyIndex = keys.length;
                    // Default is already 1
                    //column.colSpan = 1;
                    keys.push(column);
                }

                // Add the Column to the top-down dom tree
                tree[depth].push(column);
            }
            depth--;
        }

        // Parse out Column instances from the array of object literals
        parseColumns(-1, definitions);


        // Save to the Columnset instance
        this.tree = tree;
        this.idHash = idHash;
        this.keyHash = keyHash;
        this.keys = keys;

        this._setRowSpans();
        this._setHeaders();
    },

    /**
    * Destructor.
    *
    * @method destructor
    * @private
    */
    destructor: function() {
    },

    /////////////////////////////////////////////////////////////////////////////
    //
    // COLUMN HELPERS
    //
    /////////////////////////////////////////////////////////////////////////////
    /**
    * Cascade certain properties to children if not defined on their own.
    *
    * @method _cascadePropertiesToChildren
    * @private
    */
    _cascadePropertiesToChildren: function(column, currentChildren) {
        //TODO: this is all a giant todo
        var i = 0,
            len = currentChildren.length,
            child;

        // Cascade certain properties to children if not defined on their own
        for(; i<len; ++i) {
            child = currentChildren[i];
            if(column.get("className") && (child.className === undefined)) {
                child.className = column.get("className");
            }
            if(column.get("editor") && (child.editor === undefined)) {
                child.editor = column.get("editor");
            }
            if(column.get("formatter") && (child.formatter === undefined)) {
                child.formatter = column.get("formatter");
            }
            if(column.get("resizeable") && (child.resizeable === undefined)) {
                child.resizeable = column.get("resizeable");
            }
            if(column.get("sortable") && (child.sortable === undefined)) {
                child.sortable = column.get("sortable");
            }
            if(column.get("hidden")) {
                child.hidden = true;
            }
            if(column.get("width") && (child.width === undefined)) {
                child.width = column.get("width");
            }
            if(column.get("minWidth") && (child.minWidth === undefined)) {
                child.minWidth = column.get("minWidth");
            }
            if(column.get("maxAutoWidth") && (child.maxAutoWidth === undefined)) {
                child.maxAutoWidth = column.get("maxAutoWidth");
            }
        }
    },

    /**
    * @method _setColSpans
    * @description Calculates and sets colSpan attribute on given Column.
    * @param column {Array} Column instance.
    * @param definition {Object} Column definition.
    * @private
    */
    _setColSpans: function(column, definition) {
        // Determine COLSPAN value for this Column
        var terminalChildNodes = 0;

        function countTerminalChildNodes(ancestor) {
            var descendants = ancestor.children,
                i = 0,
                len = descendants.length;

            // Drill down each branch and count terminal nodes
            for(; i<len; ++i) {
                // Keep drilling down
                if(YLang.isArray(descendants[i].children)) {
                    countTerminalChildNodes(descendants[i]);
                }
                // Reached branch terminus
                else {
                    terminalChildNodes++;
                }
            }
        }
        countTerminalChildNodes(definition);
        column.colSpan = terminalChildNodes;
    },

    /**
    * @method _setRowSpans
    * @description Calculates and sets rowSpan attribute on all Columns.
    * @private
    */
    _setRowSpans: function() {
        // Determine ROWSPAN value for each Column in the DOM tree
        function parseDomTreeForRowSpan(tree) {
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
                    if(YLang.isArray(col.children)) {
                        tmpRowDepth++;
                        countMaxRowDepth(col.children, tmpRowDepth);
                        tmpRowDepth--;
                    }
                    // Column has children, so keep counting
                    else if(col.get && YLang.isArray(col.get("children"))) {
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
                    if(!YLang.isArray(currentColumn.get("children"))) {
                        currentColumn.rowSpan = maxRowDepth;
                    }
                    // Default is already 1
                    // else currentColumn.rowSpan =1;
                }

                // Reset counter for next row
                maxRowDepth = 1;
            }
        }
        parseDomTreeForRowSpan(this.tree);
    },

    /**
    * @method _setHeaders
    * @description Calculates and sets headers attribute on all Columns.
    * @private
    */
    _setHeaders: function() {
        var headers, column,
            allKeys = this.keys,
            i=0, len = allKeys.length;

        function recurseAncestorsForHeaders(headers, column) {
            headers.push(column.get("id"));
            if(column.parent) {
                recurseAncestorsForHeaders(headers, column.parent);
            }
        }
        for(; i<len; ++i) {
            headers = [];
            column = allKeys[i];
            recurseAncestorsForHeaders(headers, column);
            column.headers = headers.reverse().join(" ");
        }
    },

    //TODO
    getColumn: function() {
    }
});

Y.Columnset = Columnset;