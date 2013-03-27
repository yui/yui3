if (typeof _yuitest_coverage == "undefined"){
    _yuitest_coverage = {};
    _yuitest_coverline = function(src, line){
        var coverage = _yuitest_coverage[src];
        if (!coverage.lines[line]){
            coverage.calledLines++;
        }
        coverage.lines[line]++;
    };
    _yuitest_coverfunc = function(src, name, line){
        var coverage = _yuitest_coverage[src],
            funcId = name + ":" + line;
        if (!coverage.functions[funcId]){
            coverage.calledFunctions++;
        }
        coverage.functions[funcId]++;
    };
}
_yuitest_coverage["build/tree-sortable/tree-sortable.js"] = {
    lines: {},
    functions: {},
    coveredLines: 0,
    calledLines: 0,
    coveredFunctions: 0,
    calledFunctions: 0,
    path: "build/tree-sortable/tree-sortable.js",
    code: []
};
_yuitest_coverage["build/tree-sortable/tree-sortable.js"].code=["YUI.add('tree-sortable', function (Y, NAME) {","","/*jshint expr:true, onevar:false */","","/**","Extension for `Tree` that makes nodes sortable.","","@module tree","@submodule tree-sortable","@main tree-sortable","**/","","/**","Extension for `Tree` that makes nodes sortable.","","@class Tree.Sortable","@constructor","@param {Object} [config] Configuration options.","@param {Function} [config.sortComparator] Default comparator function to use","    when sorting a node's children if the node itself doesn't have a custom","    comparator function. If not specified, insertion order will be used by","    default.","@param {Boolean} [config.sortReverse=false] If `true`, node children will be","    sorted in reverse (descending) order by default. Otherwise they'll be sorted","    in ascending order.","@extensionfor Tree","**/","","/**","Fired after a node's children are re-sorted.","","@event sort","@param {Tree.Node} node Node whose children were sorted.","@param {Boolean} reverse `true` if the children were sorted in reverse","    (descending) order, `false` otherwise.","@param {String} src Source of the event.","**/","var EVT_SORT = 'sort';","","function Sortable() {}","","Sortable.prototype = {","    // -- Public Properties ----------------------------------------------------","","    /**","    If `true`, node children will be sorted in reverse (descending) order by","    default. Otherwise they'll be sorted in ascending order.","","    @property {Boolean} sortReverse","    @default false","    **/","    sortReverse: false,","","    // -- Lifecycle ------------------------------------------------------------","    initializer: function (config) {","        this.nodeExtensions = this.nodeExtensions.concat(Y.Tree.Node.Sortable);","","        if (config) {","            if (config.sortComparator) {","                this.sortComparator = config.sortComparator;","            }","","            if ('sortReverse' in config) {","                this.sortReverse = config.sortReverse;","            }","        }","    },","","    // -- Public Methods -------------------------------------------------------","","    /**","    Default comparator function to use when sorting a node's children if the","    node itself doesn't have a custom comparator function.","","    If not specified, insertion order will be used by default.","","    @method sortComparator","    @param {Tree.Node} node Node being sorted.","    @return {Number|String} Value by which the node should be sorted relative to","        its siblings.","    **/","    sortComparator: function (node) {","        return node.index();","    },","","    /**","    Sorts the children of the specified node.","","    @method sortNode","    @param {Tree.Node} node Node whose children should be sorted.","    @param {Object} [options] Options.","        @param {Boolean} [options.silent] If `true`, no `sort` event will be","            fired.","        @param {Function} [options.sortComparator] Custom comparator function to","            use. If specified, this will become the node's new comparator","            function, overwriting any previous comparator function that was set","            for the node.","        @param {Boolean} [options.sortReverse] If `true`, children will be","            sorted in reverse (descending) order. Otherwise they'll be sorted in","            ascending order. This will become the node's new sort order,","            overwriting any previous sort order that was set for the node.","        @param {String} [options.src] Source of the sort operation. Will be","            passed along to the `sort` event facade.","    @chainable","    **/","    sortNode: function (node, options) {","        // Nothing to do if the node has no children.","        if (!node.children.length) {","            return this;","        }","","        options || (options = {});","","        var comparator;","","        if (options.sortComparator) {","            comparator = node.sortComparator = options.sortComparator;","        } else {","            comparator = node.sortComparator || this.sortComparator;","        }","","        var reverse;","","        if ('sortReverse' in options) {","            reverse = node.sortReverse = options.sortReverse;","        } else if ('sortReverse' in node) {","            reverse = node.sortReverse;","        } else {","            reverse = this.sortReverse;","        }","","        node.children.sort(Y.rbind(this._sort, this, comparator, reverse));","","        if (!options.silent) {","            this.fire(EVT_SORT, {","                node   : node,","                reverse: !!reverse,","                src    : options.src","            });","        }","","        return this;","    },","","    // -- Protected Methods ----------------------------------------------------","","    /**","    Compares value _a_ to value _b_ for sorting purposes.","","    Values are assumed to be the result of calling a sortComparator function.","","    @method _sort","    @param {Mixed} a First value to compare.","    @param {Mixed} b Second value to compare.","    @return {Number} `-1` if _a_ should come before _b_, `0` if they're","        equivalent, `1` if _a_ should come after _b_.","    @protected","    **/","    _compare: function (a, b) {","        return a < b ? -1 : (a > b ? 1 : 0);","    },","","    /**","    Compares value _a_ to value _b_ for sorting purposes, but sorts them in","    reverse (descending) order.","","    Values are assumed to be the result of calling a sortComparator function.","","    @method _compareReverse","    @param {Mixed} a First value to compare.","    @param {Mixed} b Second value to compare.","    @return {Number} `-1` if _a_ should come before _b_, `0` if they're","        equivalent, `1` if _a_ should come after _b_.","    @protected","    **/","    _compareReverse: function (a, b) {","        return b < a ? -1 : (b > a ? 1 : 0);","    },","","    /**","    Overrides `Tree#_getDefaultNodeIndex()` to provide insertion-time sorting","    for nodes inserted without an explicit index.","","    @method _getDefaultNodeIndex","    @param {Tree.Node} parent Parent node.","    @param {Tree.Node} node Node being inserted.","    @param {Object} [options] Options passed to `insertNode()`.","    @return {Number} Index at which _node_ should be inserted into _parent_'s","        `children` array.","    @protected","    **/","    _getDefaultNodeIndex: function (parent, node) {","        /*jshint bitwise:false */","","        var children   = parent.children,","            comparator = parent.sortComparator || this.sortComparator,","            max        = children.length,","            min        = 0,","            reverse    = 'sortReverse' in parent ? parent.sortReverse : this.sortReverse;","","        if (!max) {","            return max;","        }","","        // Special case: if the sortComparator is the default sortComparator,","        // cheat and just return the first or last index of the children array.","        //","        // This is necessary because the default sortComparator relies on","        // the node's index, which is always -1 for uninserted nodes.","        if (comparator === Sortable.prototype.sortComparator) {","            return reverse ? 0 : max;","        }","","        var compare = reverse ? this._compareReverse : this._compare,","            needle  = comparator(node);","","        // Perform an iterative binary search to determine the correct position","        // for the node based on the return value of the comparator function.","        var middle;","","        while (min < max) {","            middle = (min + max) >> 1; // Divide by two and discard remainder.","","            if (compare(comparator(children[middle]), needle) < 0) {","                min = middle + 1;","            } else {","                max = middle;","            }","        }","","        return min;","    },","","    /**","    Array sort function used by `sortNode()` to re-sort a node's children.","","    @method _sort","    @param {Tree.Node} a First node to compare.","    @param {Tree.Node} b Second node to compare.","    @param {Function} comparator Comparator function.","    @param {Boolean} [reverse=false] If `true`, this will be a reverse","        (descending) comparison.","    @return {Number} `-1` if _a_ is less than _b_, `0` if equal, `1` if greater.","    @protected","    **/","    _sort: function (a, b, comparator, reverse) {","        return this[reverse ? '_compareReverse' : '_compare'](","            comparator(a), comparator(b));","    }","};","","Y.Tree.Sortable = Sortable;","/**","@module tree","@submodule tree-sortable","**/","","/**","`Tree.Node` extension that adds methods useful for nodes in trees that use the","`Tree.Sortable` extension.","","@class Tree.Node.Sortable","@constructor","@extensionfor Tree.Node","**/","","function NodeSortable() {}","","NodeSortable.prototype = {","    /**","    Sorts this node's children.","","    @method sort","    @param {Object} [options] Options.","        @param {Boolean} [options.silent] If `true`, no `sort` event will be","            fired.","        @param {Function} [options.sortComparator] Custom comparator function to","            use. If specified, this will become the node's new comparator","            function, overwriting any previous comparator function that was set","            for the node.","        @param {Boolean} [options.sortReverse] If `true`, children will be","            sorted in reverse (descending) order. Otherwise they'll be sorted in","            ascending order. This will become the node's new sort order,","            overwriting any previous sort order that was set for the node.","        @param {String} [options.src] Source of the sort operation. Will be","            passed along to the `sort` event facade.","    @chainable","    **/","    sort: function (options) {","        this.tree.sortNode(this, options);","        return this;","    }","};","","Y.Tree.Node.Sortable = NodeSortable;","","","}, '@VERSION@', {\"requires\": [\"tree\"]});"];
_yuitest_coverage["build/tree-sortable/tree-sortable.js"].lines = {"1":0,"38":0,"40":0,"42":0,"56":0,"58":0,"59":0,"60":0,"63":0,"64":0,"83":0,"108":0,"109":0,"112":0,"114":0,"116":0,"117":0,"119":0,"122":0,"124":0,"125":0,"126":0,"127":0,"129":0,"132":0,"134":0,"135":0,"142":0,"160":0,"177":0,"195":0,"201":0,"202":0,"210":0,"211":0,"214":0,"219":0,"221":0,"222":0,"224":0,"225":0,"227":0,"231":0,"247":0,"252":0,"267":0,"269":0,"290":0,"291":0,"295":0};
_yuitest_coverage["build/tree-sortable/tree-sortable.js"].functions = {"Sortable:40":0,"initializer:55":0,"sortComparator:82":0,"sortNode:106":0,"_compare:159":0,"_compareReverse:176":0,"_getDefaultNodeIndex:192":0,"_sort:246":0,"NodeSortable:267":0,"sort:289":0,"(anonymous 1):1":0};
_yuitest_coverage["build/tree-sortable/tree-sortable.js"].coveredLines = 50;
_yuitest_coverage["build/tree-sortable/tree-sortable.js"].coveredFunctions = 11;
_yuitest_coverline("build/tree-sortable/tree-sortable.js", 1);
YUI.add('tree-sortable', function (Y, NAME) {

/*jshint expr:true, onevar:false */

/**
Extension for `Tree` that makes nodes sortable.

@module tree
@submodule tree-sortable
@main tree-sortable
**/

/**
Extension for `Tree` that makes nodes sortable.

@class Tree.Sortable
@constructor
@param {Object} [config] Configuration options.
@param {Function} [config.sortComparator] Default comparator function to use
    when sorting a node's children if the node itself doesn't have a custom
    comparator function. If not specified, insertion order will be used by
    default.
@param {Boolean} [config.sortReverse=false] If `true`, node children will be
    sorted in reverse (descending) order by default. Otherwise they'll be sorted
    in ascending order.
@extensionfor Tree
**/

/**
Fired after a node's children are re-sorted.

@event sort
@param {Tree.Node} node Node whose children were sorted.
@param {Boolean} reverse `true` if the children were sorted in reverse
    (descending) order, `false` otherwise.
@param {String} src Source of the event.
**/
_yuitest_coverfunc("build/tree-sortable/tree-sortable.js", "(anonymous 1)", 1);
_yuitest_coverline("build/tree-sortable/tree-sortable.js", 38);
var EVT_SORT = 'sort';

_yuitest_coverline("build/tree-sortable/tree-sortable.js", 40);
function Sortable() {}

_yuitest_coverline("build/tree-sortable/tree-sortable.js", 42);
Sortable.prototype = {
    // -- Public Properties ----------------------------------------------------

    /**
    If `true`, node children will be sorted in reverse (descending) order by
    default. Otherwise they'll be sorted in ascending order.

    @property {Boolean} sortReverse
    @default false
    **/
    sortReverse: false,

    // -- Lifecycle ------------------------------------------------------------
    initializer: function (config) {
        _yuitest_coverfunc("build/tree-sortable/tree-sortable.js", "initializer", 55);
_yuitest_coverline("build/tree-sortable/tree-sortable.js", 56);
this.nodeExtensions = this.nodeExtensions.concat(Y.Tree.Node.Sortable);

        _yuitest_coverline("build/tree-sortable/tree-sortable.js", 58);
if (config) {
            _yuitest_coverline("build/tree-sortable/tree-sortable.js", 59);
if (config.sortComparator) {
                _yuitest_coverline("build/tree-sortable/tree-sortable.js", 60);
this.sortComparator = config.sortComparator;
            }

            _yuitest_coverline("build/tree-sortable/tree-sortable.js", 63);
if ('sortReverse' in config) {
                _yuitest_coverline("build/tree-sortable/tree-sortable.js", 64);
this.sortReverse = config.sortReverse;
            }
        }
    },

    // -- Public Methods -------------------------------------------------------

    /**
    Default comparator function to use when sorting a node's children if the
    node itself doesn't have a custom comparator function.

    If not specified, insertion order will be used by default.

    @method sortComparator
    @param {Tree.Node} node Node being sorted.
    @return {Number|String} Value by which the node should be sorted relative to
        its siblings.
    **/
    sortComparator: function (node) {
        _yuitest_coverfunc("build/tree-sortable/tree-sortable.js", "sortComparator", 82);
_yuitest_coverline("build/tree-sortable/tree-sortable.js", 83);
return node.index();
    },

    /**
    Sorts the children of the specified node.

    @method sortNode
    @param {Tree.Node} node Node whose children should be sorted.
    @param {Object} [options] Options.
        @param {Boolean} [options.silent] If `true`, no `sort` event will be
            fired.
        @param {Function} [options.sortComparator] Custom comparator function to
            use. If specified, this will become the node's new comparator
            function, overwriting any previous comparator function that was set
            for the node.
        @param {Boolean} [options.sortReverse] If `true`, children will be
            sorted in reverse (descending) order. Otherwise they'll be sorted in
            ascending order. This will become the node's new sort order,
            overwriting any previous sort order that was set for the node.
        @param {String} [options.src] Source of the sort operation. Will be
            passed along to the `sort` event facade.
    @chainable
    **/
    sortNode: function (node, options) {
        // Nothing to do if the node has no children.
        _yuitest_coverfunc("build/tree-sortable/tree-sortable.js", "sortNode", 106);
_yuitest_coverline("build/tree-sortable/tree-sortable.js", 108);
if (!node.children.length) {
            _yuitest_coverline("build/tree-sortable/tree-sortable.js", 109);
return this;
        }

        _yuitest_coverline("build/tree-sortable/tree-sortable.js", 112);
options || (options = {});

        _yuitest_coverline("build/tree-sortable/tree-sortable.js", 114);
var comparator;

        _yuitest_coverline("build/tree-sortable/tree-sortable.js", 116);
if (options.sortComparator) {
            _yuitest_coverline("build/tree-sortable/tree-sortable.js", 117);
comparator = node.sortComparator = options.sortComparator;
        } else {
            _yuitest_coverline("build/tree-sortable/tree-sortable.js", 119);
comparator = node.sortComparator || this.sortComparator;
        }

        _yuitest_coverline("build/tree-sortable/tree-sortable.js", 122);
var reverse;

        _yuitest_coverline("build/tree-sortable/tree-sortable.js", 124);
if ('sortReverse' in options) {
            _yuitest_coverline("build/tree-sortable/tree-sortable.js", 125);
reverse = node.sortReverse = options.sortReverse;
        } else {_yuitest_coverline("build/tree-sortable/tree-sortable.js", 126);
if ('sortReverse' in node) {
            _yuitest_coverline("build/tree-sortable/tree-sortable.js", 127);
reverse = node.sortReverse;
        } else {
            _yuitest_coverline("build/tree-sortable/tree-sortable.js", 129);
reverse = this.sortReverse;
        }}

        _yuitest_coverline("build/tree-sortable/tree-sortable.js", 132);
node.children.sort(Y.rbind(this._sort, this, comparator, reverse));

        _yuitest_coverline("build/tree-sortable/tree-sortable.js", 134);
if (!options.silent) {
            _yuitest_coverline("build/tree-sortable/tree-sortable.js", 135);
this.fire(EVT_SORT, {
                node   : node,
                reverse: !!reverse,
                src    : options.src
            });
        }

        _yuitest_coverline("build/tree-sortable/tree-sortable.js", 142);
return this;
    },

    // -- Protected Methods ----------------------------------------------------

    /**
    Compares value _a_ to value _b_ for sorting purposes.

    Values are assumed to be the result of calling a sortComparator function.

    @method _sort
    @param {Mixed} a First value to compare.
    @param {Mixed} b Second value to compare.
    @return {Number} `-1` if _a_ should come before _b_, `0` if they're
        equivalent, `1` if _a_ should come after _b_.
    @protected
    **/
    _compare: function (a, b) {
        _yuitest_coverfunc("build/tree-sortable/tree-sortable.js", "_compare", 159);
_yuitest_coverline("build/tree-sortable/tree-sortable.js", 160);
return a < b ? -1 : (a > b ? 1 : 0);
    },

    /**
    Compares value _a_ to value _b_ for sorting purposes, but sorts them in
    reverse (descending) order.

    Values are assumed to be the result of calling a sortComparator function.

    @method _compareReverse
    @param {Mixed} a First value to compare.
    @param {Mixed} b Second value to compare.
    @return {Number} `-1` if _a_ should come before _b_, `0` if they're
        equivalent, `1` if _a_ should come after _b_.
    @protected
    **/
    _compareReverse: function (a, b) {
        _yuitest_coverfunc("build/tree-sortable/tree-sortable.js", "_compareReverse", 176);
_yuitest_coverline("build/tree-sortable/tree-sortable.js", 177);
return b < a ? -1 : (b > a ? 1 : 0);
    },

    /**
    Overrides `Tree#_getDefaultNodeIndex()` to provide insertion-time sorting
    for nodes inserted without an explicit index.

    @method _getDefaultNodeIndex
    @param {Tree.Node} parent Parent node.
    @param {Tree.Node} node Node being inserted.
    @param {Object} [options] Options passed to `insertNode()`.
    @return {Number} Index at which _node_ should be inserted into _parent_'s
        `children` array.
    @protected
    **/
    _getDefaultNodeIndex: function (parent, node) {
        /*jshint bitwise:false */

        _yuitest_coverfunc("build/tree-sortable/tree-sortable.js", "_getDefaultNodeIndex", 192);
_yuitest_coverline("build/tree-sortable/tree-sortable.js", 195);
var children   = parent.children,
            comparator = parent.sortComparator || this.sortComparator,
            max        = children.length,
            min        = 0,
            reverse    = 'sortReverse' in parent ? parent.sortReverse : this.sortReverse;

        _yuitest_coverline("build/tree-sortable/tree-sortable.js", 201);
if (!max) {
            _yuitest_coverline("build/tree-sortable/tree-sortable.js", 202);
return max;
        }

        // Special case: if the sortComparator is the default sortComparator,
        // cheat and just return the first or last index of the children array.
        //
        // This is necessary because the default sortComparator relies on
        // the node's index, which is always -1 for uninserted nodes.
        _yuitest_coverline("build/tree-sortable/tree-sortable.js", 210);
if (comparator === Sortable.prototype.sortComparator) {
            _yuitest_coverline("build/tree-sortable/tree-sortable.js", 211);
return reverse ? 0 : max;
        }

        _yuitest_coverline("build/tree-sortable/tree-sortable.js", 214);
var compare = reverse ? this._compareReverse : this._compare,
            needle  = comparator(node);

        // Perform an iterative binary search to determine the correct position
        // for the node based on the return value of the comparator function.
        _yuitest_coverline("build/tree-sortable/tree-sortable.js", 219);
var middle;

        _yuitest_coverline("build/tree-sortable/tree-sortable.js", 221);
while (min < max) {
            _yuitest_coverline("build/tree-sortable/tree-sortable.js", 222);
middle = (min + max) >> 1; // Divide by two and discard remainder.

            _yuitest_coverline("build/tree-sortable/tree-sortable.js", 224);
if (compare(comparator(children[middle]), needle) < 0) {
                _yuitest_coverline("build/tree-sortable/tree-sortable.js", 225);
min = middle + 1;
            } else {
                _yuitest_coverline("build/tree-sortable/tree-sortable.js", 227);
max = middle;
            }
        }

        _yuitest_coverline("build/tree-sortable/tree-sortable.js", 231);
return min;
    },

    /**
    Array sort function used by `sortNode()` to re-sort a node's children.

    @method _sort
    @param {Tree.Node} a First node to compare.
    @param {Tree.Node} b Second node to compare.
    @param {Function} comparator Comparator function.
    @param {Boolean} [reverse=false] If `true`, this will be a reverse
        (descending) comparison.
    @return {Number} `-1` if _a_ is less than _b_, `0` if equal, `1` if greater.
    @protected
    **/
    _sort: function (a, b, comparator, reverse) {
        _yuitest_coverfunc("build/tree-sortable/tree-sortable.js", "_sort", 246);
_yuitest_coverline("build/tree-sortable/tree-sortable.js", 247);
return this[reverse ? '_compareReverse' : '_compare'](
            comparator(a), comparator(b));
    }
};

_yuitest_coverline("build/tree-sortable/tree-sortable.js", 252);
Y.Tree.Sortable = Sortable;
/**
@module tree
@submodule tree-sortable
**/

/**
`Tree.Node` extension that adds methods useful for nodes in trees that use the
`Tree.Sortable` extension.

@class Tree.Node.Sortable
@constructor
@extensionfor Tree.Node
**/

_yuitest_coverline("build/tree-sortable/tree-sortable.js", 267);
function NodeSortable() {}

_yuitest_coverline("build/tree-sortable/tree-sortable.js", 269);
NodeSortable.prototype = {
    /**
    Sorts this node's children.

    @method sort
    @param {Object} [options] Options.
        @param {Boolean} [options.silent] If `true`, no `sort` event will be
            fired.
        @param {Function} [options.sortComparator] Custom comparator function to
            use. If specified, this will become the node's new comparator
            function, overwriting any previous comparator function that was set
            for the node.
        @param {Boolean} [options.sortReverse] If `true`, children will be
            sorted in reverse (descending) order. Otherwise they'll be sorted in
            ascending order. This will become the node's new sort order,
            overwriting any previous sort order that was set for the node.
        @param {String} [options.src] Source of the sort operation. Will be
            passed along to the `sort` event facade.
    @chainable
    **/
    sort: function (options) {
        _yuitest_coverfunc("build/tree-sortable/tree-sortable.js", "sort", 289);
_yuitest_coverline("build/tree-sortable/tree-sortable.js", 290);
this.tree.sortNode(this, options);
        _yuitest_coverline("build/tree-sortable/tree-sortable.js", 291);
return this;
    }
};

_yuitest_coverline("build/tree-sortable/tree-sortable.js", 295);
Y.Tree.Node.Sortable = NodeSortable;


}, '@VERSION@', {"requires": ["tree"]});
