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