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
_yuitest_coverage["/build/sortable/sortable.js"] = {
    lines: {},
    functions: {},
    coveredLines: 0,
    calledLines: 0,
    coveredFunctions: 0,
    calledFunctions: 0,
    path: "/build/sortable/sortable.js",
    code: []
};
_yuitest_coverage["/build/sortable/sortable.js"].code=["YUI.add('sortable', function(Y) {","","","    /**","     * The class allows you to create a Drag & Drop reordered list.","     * @module sortable","     */     ","    /**","     * The class allows you to create a Drag & Drop reordered list.","     * @class Sortable","     * @extends Base","     * @constructor","     */","","","    var Sortable = function(o) {","        Sortable.superclass.constructor.apply(this, arguments);","    },","    CURRENT_NODE = 'currentNode',","    OPACITY_NODE = 'opacityNode',","    CONT = 'container',","    ID = 'id',","    ZINDEX = 'zIndex',","    OPACITY = 'opacity',","    PARENT_NODE = 'parentNode',","    NODES = 'nodes',","    NODE = 'node';","","","    Y.extend(Sortable, Y.Base, {","        /**","        * @property delegate","        * @type DD.Delegate","        * @description A reference to the DD.Delegate instance.","        */","        delegate: null,","        /**","        * @property drop","        * @type DD.Drop","        * @description A reference to the DD.Drop instance","        */","        drop: null,","        initializer: function() {","            var id = 'sortable-' + Y.guid(),","                delConfig = {","                    container: this.get(CONT),","                    nodes: this.get(NODES),","                    target: true,","                    invalid: this.get('invalid'),","                    dragConfig: {","                        groups: [ id ]","                    }","                }, del;","","            if (this.get('handles')) {","                delConfig.handles = this.get('handles');","            }","            del = new Y.DD.Delegate(delConfig);","","            this.set(ID, id);","","            del.dd.plug(Y.Plugin.DDProxy, {","                moveOnEnd: false,","                cloneNode: true","            });","","            this.drop =  new Y.DD.Drop({","                node: this.get(CONT),","                bubbleTarget: del,","                groups: del.dd.get('groups')","            });","            this.drop.on('drop:over', Y.bind(this._onDropOver, this));","            ","            del.on({","                'drag:start': Y.bind(this._onDragStart, this),","                'drag:end': Y.bind(this._onDragEnd, this),","                'drag:over': Y.bind(this._onDragOver, this),","                'drag:drag': Y.bind(this._onDrag, this)","            });","","            this.delegate = del;","            Sortable.reg(this);","        },","        _up: null,","        _y: null,","        _onDrag: function(e) {","            if (e.pageY < this._y) {","                this._up = true; ","            } else if (e.pageY > this._y) { ","                this._up = false; ","            } ","","            this._y = e.pageY;","        },","        /**","        * @private","        * @method _onDropOver","        * @param Event e The Event Object","        * @description Handles the DropOver event to append a drop node to an empty target","        */","        _onDropOver: function(e) {","            if (!e.drop.get(NODE).test(this.get(NODES))) {","                var nodes = e.drop.get(NODE).all(this.get(NODES));","                e.drop.get(NODE).append(e.drag.get(NODE));","            }","        },","        /**","        * @private","        * @method _onDragOver","        * @param Event e The Event Object","        * @description Handles the DragOver event that moves the object in the list or to another list.","        */","        _onDragOver: function(e) {","            if (!e.drop.get(NODE).test(this.get(NODES))) {","                return;","            }","            if (e.drag.get(NODE) == e.drop.get(NODE)) {","                return;","            }","            // is drop a child of drag?","            if (e.drag.get(NODE).contains(e.drop.get(NODE))) {","                return;","            }","            var same = false, dir, oldNode, newNode, dropsort, dropNode,","                moveType = this.get('moveType').toLowerCase();","","            if (e.drag.get(NODE).get(PARENT_NODE).contains(e.drop.get(NODE))) {","                same = true;","            }","            if (same && moveType == 'move') {","                moveType = 'insert';","            }","            switch (moveType) {","                case 'insert':","                    dir = ((this._up) ? 'before' : 'after');","                    dropNode = e.drop.get(NODE);","                    if (Y.Sortable._test(dropNode, this.get(CONT))) {","                        dropNode.append(e.drag.get(NODE));","                    } else {","                        dropNode.insert(e.drag.get(NODE), dir);","                    }","                    break;","                case 'swap':","                    Y.DD.DDM.swapNode(e.drag, e.drop);","                    break;","                case 'move':","                case 'copy':","                    dropsort = Y.Sortable.getSortable(e.drop.get(NODE).get(PARENT_NODE));","","                    if (!dropsort) {","                        return;","                    }","                    ","                    Y.DD.DDM.getDrop(e.drag.get(NODE)).addToGroup(dropsort.get(ID));","","                    //Same List","                    if (same) {","                        Y.DD.DDM.swapNode(e.drag, e.drop);","                    } else {","                        if (this.get('moveType') == 'copy') {","                            //New List","                            oldNode = e.drag.get(NODE);","                            newNode = oldNode.cloneNode(true);","","                            newNode.set(ID, '');","                            e.drag.set(NODE, newNode);","                            dropsort.delegate.createDrop(newNode, [dropsort.get(ID)]);","                            oldNode.setStyles({","                                top: '',","                                left: ''","                            });","                        }","                        e.drop.get(NODE).insert(e.drag.get(NODE), 'before');","                    }","                    break;","            }","","            this.fire(moveType, { same: same, drag: e.drag, drop: e.drop });","            this.fire('moved', { same: same, drag: e.drag, drop: e.drop });","        },","        /**","        * @private","        * @method _onDragStart","        * @param Event e The Event Object","        * @description Handles the DragStart event and initializes some settings.","        */","        _onDragStart: function(e) {","            var del = this.delegate,","                lastNode = del.get('lastNode');","            if (lastNode && lastNode.getDOMNode()) {","                lastNode.setStyle(ZINDEX, '');","            }","            del.get(this.get(OPACITY_NODE)).setStyle(OPACITY, this.get(OPACITY));","            del.get(CURRENT_NODE).setStyle(ZINDEX, '999');","        },","        /**","        * @private","        * @method _onDragEnd","        * @param Event e The Event Object","        * @description Handles the DragEnd event that cleans up the settings in the drag:start event.","        */","        _onDragEnd: function(e) {","            this.delegate.get(this.get(OPACITY_NODE)).setStyle(OPACITY, 1);","            this.delegate.get(CURRENT_NODE).setStyles({","                top: '',","                left: ''","            });","            this.sync();","        },","        /**","        * @method plug","        * @param Class cls The class to plug","        * @param Object config The class config","        * @description Passthrough to the DD.Delegate.ddplug method","        * @chainable","        */","        plug: function(cls, config) {","            //I don't like this.. Not at all, need to discuss with the team","            if (cls && cls.NAME.substring(0, 4).toLowerCase() === 'sort') {","                this.constructor.superclass.plug.call(this, cls, config);","            } else {","                this.delegate.dd.plug(cls, config);","            }","            return this;","        },","        /**","        * @method sync","        * @description Passthrough to the DD.Delegate syncTargets method.","        * @chainable","        */","        sync: function() {","            this.delegate.syncTargets();","            return this;","        },","        destructor: function() {","            this.drop.destroy();","            this.delegate.destroy();","            Sortable.unreg(this);","        },","        /**","        * @method join","        * @param Sortable sel The Sortable list to join with","        * @param String type The type of join to do: full, inner, outer, none. Default: full","        * @description Join this Sortable with another Sortable instance.","        * <ul>","        *   <li>full: Exchange nodes with both lists.</li>","        *   <li>inner: Items can go into this list from the joined list.</li>","        *   <li>outer: Items can go out of the joined list into this list.</li>","        *   <li>none: Removes the join.</li>","        * </ul>","        * @chainable","        */","        join: function(sel, type) {","            if (!(sel instanceof Y.Sortable)) {","                Y.error('Sortable: join needs a Sortable Instance');","                return this;","            }","            if (!type) {","                type = 'full';","            }","            type = type.toLowerCase();","            var method = '_join_' + type;","","            if (this[method]) {","                this[method](sel);","            }","            ","            return this;","        },","        /**","        * @private","        * @method _join_none","        * @param Sortable sel The Sortable to remove the join from","        * @description Removes the join with the passed Sortable.","        */","        _join_none: function(sel) {","            this.delegate.dd.removeFromGroup(sel.get(ID));","            sel.delegate.dd.removeFromGroup(this.get(ID));","        },","        /**","        * @private","        * @method _join_full","        * @param Sortable sel The Sortable list to join with","        * @description Joins both of the Sortables together.","        */","        _join_full: function(sel) {","            this.delegate.dd.addToGroup(sel.get(ID));","            sel.delegate.dd.addToGroup(this.get(ID));","        },","        /**","        * @private","        * @method _join_outer","        * @param Sortable sel The Sortable list to join with","        * @description Allows this Sortable to accept items from the passed Sortable.","        */","        _join_outer: function(sel) {","            this.delegate.dd.addToGroup(sel.get(ID));","        },","        /**","        * @private","        * @method _join_inner","        * @param Sortable sel The Sortable list to join with","        * @description Allows this Sortable to give items to the passed Sortable.","        */","        _join_inner: function(sel) {","            sel.delegate.dd.addToGroup(this.get(ID));","        },","        /**","        * A custom callback to allow a user to extract some sort of id or any other data from the node to use in the \"ordering list\" and then that data should be returned from the callback.","        * @method getOrdering","        * @param Function callback ","        * @return Array","        */","        getOrdering: function(callback) {","            var ordering = [];","","            if (!Y.Lang.isFunction(callback)) {","                callback = function (node) {","                    return node;","                };","            }","","            Y.one(this.get(CONT)).all(this.get(NODES)).each(function(node) {","                ordering.push(callback(node));","            });","            return ordering;","       }","    }, {","        NAME: 'sortable',","        ATTRS: {","            /**","            * @attribute handles","            * @description Drag handles to pass on to the internal DD.Delegate instance.","            * @type Array","            */    ","            handles: {","                value: false","            },","            /**","            * @attribute container","            * @description A selector query to get the container to listen for mousedown events on. All \"nodes\" should be a child of this container.","            * @type String","            */    ","            container: {","                value: 'body'","            },","            /**","            * @attribute nodes","            * @description A selector query to get the children of the \"container\" to make draggable elements from.","            * @type String","            */        ","            nodes: {","                value: '.dd-draggable'","            },","            /**","            * @attribute opacity","            * @description The opacity to change the proxy item to when dragging.","            * @type String","            */        ","            opacity: {","                value: '.75'","            },","            /**","            * @attribute opacityNode","            * @description The node to set opacity on when dragging (dragNode or currentNode). Default: currentNode.","            * @type String","            */        ","            opacityNode: {","                value: 'currentNode'","            },","            /**","            * @attribute id","            * @description The id of this Sortable, used to get a reference to this Sortable list from another list.","            * @type String","            */        ","            id: {","                value: null","            },","            /**","            * @attribute moveType","            * @description How should an item move to another list: insert, swap, move, copy. Default: insert","            * @type String","            */        ","            moveType: {","                value: 'insert'","            },","            /**","            * @attribute invalid","            * @description A selector string to test if a list item is invalid and not sortable","            * @type String","            */        ","            invalid: {","                value: ''","            }","        },","        /**","        * @static","        * @property _sortables","        * @private","        * @type Array","        * @description Hash map of all Sortables on the page.","        */","        _sortables: [],","        /**","        * @static","        * @method _test","        * @param {Node} node The node instance to test.","        * @param {String|Node} test The node instance or selector string to test against.","        * @description Test a Node or a selector for the container","        */","        _test: function(node, test) {","            if (test instanceof Y.Node) {","                return (test === node);","            } else {","                return node.test(test);","            }","        },","        /**","        * @static","        * @method getSortable","        * @param {String|Node} node The node instance or selector string to use to find a Sortable instance.","        * @description Get a Sortable instance back from a node reference or a selector string.","        */","        getSortable: function(node) {","            var s = null;","            node = Y.one(node);","            Y.each(Y.Sortable._sortables, function(v) {","                if (Y.Sortable._test(node, v.get(CONT))) {","                    s = v;","                }","            });","            return s;","        },","        /**","        * @static","        * @method reg","        * @param Sortable s A Sortable instance.","        * @description Register a Sortable instance with the singleton to allow lookups later.","        */","        reg: function(s) {","            Y.Sortable._sortables.push(s);","        },","        /**","        * @static","        * @method unreg","        * @param Sortable s A Sortable instance.","        * @description Unregister a Sortable instance with the singleton.","        */","        unreg: function(s) {","            Y.each(Y.Sortable._sortables, function(v, k) {","                if (v === s) {","                    Y.Sortable._sortables[k] = null;","                    delete Sortable._sortables[k];","                }","            });","        }","    });","","    Y.Sortable = Sortable;","","    /**","    * @event copy","    * @description A Sortable node was moved with a copy.","    * @param {Event.Facade} event An Event Facade object","    * @param {Boolean} event.same Moved to the same list.","    * @param {DD.Drag} event.drag The drag instance.","    * @param {DD.Drop} event.drop The drop instance.","    * @type {Event.Custom}","    */","    /**","    * @event move","    * @description A Sortable node was moved with a move.","    * @param {Event.Facade} event An Event Facade object with the following specific property added:","    * @param {Boolean} event.same Moved to the same list.","    * @param {DD.Drag} event.drag The drag instance.","    * @param {DD.Drop} event.drop The drop instance.","    * @type {Event.Custom}","    */","    /**","    * @event insert","    * @description A Sortable node was moved with an insert.","    * @param {Event.Facade} event An Event Facade object with the following specific property added:","    * @param {Boolean} event.same Moved to the same list.","    * @param {DD.Drag} event.drag The drag instance.","    * @param {DD.Drop} event.drop The drop instance.","    * @type {Event.Custom}","    */","    /**","    * @event swap","    * @description A Sortable node was moved with a swap.","    * @param {Event.Facade} event An Event Facade object with the following specific property added:","    * @param {Boolean} event.same Moved to the same list.","    * @param {DD.Drag} event.drag The drag instance.","    * @param {DD.Drop} event.drop The drop instance.","    * @type {Event.Custom}","    */","    /**","    * @event moved","    * @description A Sortable node was moved.","    * @param {Event.Facade} event An Event Facade object with the following specific property added:","    * @param {Boolean} event.same Moved to the same list.","    * @param {DD.Drag} event.drag The drag instance.","    * @param {DD.Drop} event.drop The drop instance.","    * @type {Event.Custom}","    */","","","","}, '@VERSION@' ,{requires:['dd-delegate', 'dd-drop-plugin', 'dd-proxy']});"];
_yuitest_coverage["/build/sortable/sortable.js"].lines = {"1":0,"16":0,"17":0,"30":0,"44":0,"55":0,"56":0,"58":0,"60":0,"62":0,"67":0,"72":0,"74":0,"81":0,"82":0,"87":0,"88":0,"89":0,"90":0,"93":0,"102":0,"103":0,"104":0,"114":0,"115":0,"117":0,"118":0,"121":0,"122":0,"124":0,"127":0,"128":0,"130":0,"131":0,"133":0,"135":0,"136":0,"137":0,"138":0,"140":0,"142":0,"144":0,"145":0,"148":0,"150":0,"151":0,"154":0,"157":0,"158":0,"160":0,"162":0,"163":0,"165":0,"166":0,"167":0,"168":0,"173":0,"175":0,"178":0,"179":0,"188":0,"190":0,"191":0,"193":0,"194":0,"203":0,"204":0,"208":0,"219":0,"220":0,"222":0,"224":0,"232":0,"233":0,"236":0,"237":0,"238":0,"254":0,"255":0,"256":0,"258":0,"259":0,"261":0,"262":0,"264":0,"265":0,"268":0,"277":0,"278":0,"287":0,"288":0,"297":0,"306":0,"315":0,"317":0,"318":0,"319":0,"323":0,"324":0,"326":0,"412":0,"413":0,"415":0,"425":0,"426":0,"427":0,"428":0,"429":0,"432":0,"441":0,"450":0,"451":0,"452":0,"453":0,"459":0};
_yuitest_coverage["/build/sortable/sortable.js"].functions = {"Sortable:16":0,"initializer:43":0,"_onDrag:86":0,"_onDropOver:101":0,"_onDragOver:113":0,"_onDragStart:187":0,"_onDragEnd:202":0,"plug:217":0,"sync:231":0,"destructor:235":0,"join:253":0,"_join_none:276":0,"_join_full:286":0,"_join_outer:296":0,"_join_inner:305":0,"callback:318":0,"(anonymous 2):323":0,"getOrdering:314":0,"_test:411":0,"(anonymous 3):427":0,"getSortable:424":0,"reg:440":0,"(anonymous 4):450":0,"unreg:449":0,"(anonymous 1):1":0};
_yuitest_coverage["/build/sortable/sortable.js"].coveredLines = 115;
_yuitest_coverage["/build/sortable/sortable.js"].coveredFunctions = 25;
_yuitest_coverline("/build/sortable/sortable.js", 1);
YUI.add('sortable', function(Y) {


    /**
     * The class allows you to create a Drag & Drop reordered list.
     * @module sortable
     */     
    /**
     * The class allows you to create a Drag & Drop reordered list.
     * @class Sortable
     * @extends Base
     * @constructor
     */


    _yuitest_coverfunc("/build/sortable/sortable.js", "(anonymous 1)", 1);
_yuitest_coverline("/build/sortable/sortable.js", 16);
var Sortable = function(o) {
        _yuitest_coverfunc("/build/sortable/sortable.js", "Sortable", 16);
_yuitest_coverline("/build/sortable/sortable.js", 17);
Sortable.superclass.constructor.apply(this, arguments);
    },
    CURRENT_NODE = 'currentNode',
    OPACITY_NODE = 'opacityNode',
    CONT = 'container',
    ID = 'id',
    ZINDEX = 'zIndex',
    OPACITY = 'opacity',
    PARENT_NODE = 'parentNode',
    NODES = 'nodes',
    NODE = 'node';


    _yuitest_coverline("/build/sortable/sortable.js", 30);
Y.extend(Sortable, Y.Base, {
        /**
        * @property delegate
        * @type DD.Delegate
        * @description A reference to the DD.Delegate instance.
        */
        delegate: null,
        /**
        * @property drop
        * @type DD.Drop
        * @description A reference to the DD.Drop instance
        */
        drop: null,
        initializer: function() {
            _yuitest_coverfunc("/build/sortable/sortable.js", "initializer", 43);
_yuitest_coverline("/build/sortable/sortable.js", 44);
var id = 'sortable-' + Y.guid(),
                delConfig = {
                    container: this.get(CONT),
                    nodes: this.get(NODES),
                    target: true,
                    invalid: this.get('invalid'),
                    dragConfig: {
                        groups: [ id ]
                    }
                }, del;

            _yuitest_coverline("/build/sortable/sortable.js", 55);
if (this.get('handles')) {
                _yuitest_coverline("/build/sortable/sortable.js", 56);
delConfig.handles = this.get('handles');
            }
            _yuitest_coverline("/build/sortable/sortable.js", 58);
del = new Y.DD.Delegate(delConfig);

            _yuitest_coverline("/build/sortable/sortable.js", 60);
this.set(ID, id);

            _yuitest_coverline("/build/sortable/sortable.js", 62);
del.dd.plug(Y.Plugin.DDProxy, {
                moveOnEnd: false,
                cloneNode: true
            });

            _yuitest_coverline("/build/sortable/sortable.js", 67);
this.drop =  new Y.DD.Drop({
                node: this.get(CONT),
                bubbleTarget: del,
                groups: del.dd.get('groups')
            });
            _yuitest_coverline("/build/sortable/sortable.js", 72);
this.drop.on('drop:over', Y.bind(this._onDropOver, this));
            
            _yuitest_coverline("/build/sortable/sortable.js", 74);
del.on({
                'drag:start': Y.bind(this._onDragStart, this),
                'drag:end': Y.bind(this._onDragEnd, this),
                'drag:over': Y.bind(this._onDragOver, this),
                'drag:drag': Y.bind(this._onDrag, this)
            });

            _yuitest_coverline("/build/sortable/sortable.js", 81);
this.delegate = del;
            _yuitest_coverline("/build/sortable/sortable.js", 82);
Sortable.reg(this);
        },
        _up: null,
        _y: null,
        _onDrag: function(e) {
            _yuitest_coverfunc("/build/sortable/sortable.js", "_onDrag", 86);
_yuitest_coverline("/build/sortable/sortable.js", 87);
if (e.pageY < this._y) {
                _yuitest_coverline("/build/sortable/sortable.js", 88);
this._up = true; 
            } else {_yuitest_coverline("/build/sortable/sortable.js", 89);
if (e.pageY > this._y) { 
                _yuitest_coverline("/build/sortable/sortable.js", 90);
this._up = false; 
            }} 

            _yuitest_coverline("/build/sortable/sortable.js", 93);
this._y = e.pageY;
        },
        /**
        * @private
        * @method _onDropOver
        * @param Event e The Event Object
        * @description Handles the DropOver event to append a drop node to an empty target
        */
        _onDropOver: function(e) {
            _yuitest_coverfunc("/build/sortable/sortable.js", "_onDropOver", 101);
_yuitest_coverline("/build/sortable/sortable.js", 102);
if (!e.drop.get(NODE).test(this.get(NODES))) {
                _yuitest_coverline("/build/sortable/sortable.js", 103);
var nodes = e.drop.get(NODE).all(this.get(NODES));
                _yuitest_coverline("/build/sortable/sortable.js", 104);
e.drop.get(NODE).append(e.drag.get(NODE));
            }
        },
        /**
        * @private
        * @method _onDragOver
        * @param Event e The Event Object
        * @description Handles the DragOver event that moves the object in the list or to another list.
        */
        _onDragOver: function(e) {
            _yuitest_coverfunc("/build/sortable/sortable.js", "_onDragOver", 113);
_yuitest_coverline("/build/sortable/sortable.js", 114);
if (!e.drop.get(NODE).test(this.get(NODES))) {
                _yuitest_coverline("/build/sortable/sortable.js", 115);
return;
            }
            _yuitest_coverline("/build/sortable/sortable.js", 117);
if (e.drag.get(NODE) == e.drop.get(NODE)) {
                _yuitest_coverline("/build/sortable/sortable.js", 118);
return;
            }
            // is drop a child of drag?
            _yuitest_coverline("/build/sortable/sortable.js", 121);
if (e.drag.get(NODE).contains(e.drop.get(NODE))) {
                _yuitest_coverline("/build/sortable/sortable.js", 122);
return;
            }
            _yuitest_coverline("/build/sortable/sortable.js", 124);
var same = false, dir, oldNode, newNode, dropsort, dropNode,
                moveType = this.get('moveType').toLowerCase();

            _yuitest_coverline("/build/sortable/sortable.js", 127);
if (e.drag.get(NODE).get(PARENT_NODE).contains(e.drop.get(NODE))) {
                _yuitest_coverline("/build/sortable/sortable.js", 128);
same = true;
            }
            _yuitest_coverline("/build/sortable/sortable.js", 130);
if (same && moveType == 'move') {
                _yuitest_coverline("/build/sortable/sortable.js", 131);
moveType = 'insert';
            }
            _yuitest_coverline("/build/sortable/sortable.js", 133);
switch (moveType) {
                case 'insert':
                    _yuitest_coverline("/build/sortable/sortable.js", 135);
dir = ((this._up) ? 'before' : 'after');
                    _yuitest_coverline("/build/sortable/sortable.js", 136);
dropNode = e.drop.get(NODE);
                    _yuitest_coverline("/build/sortable/sortable.js", 137);
if (Y.Sortable._test(dropNode, this.get(CONT))) {
                        _yuitest_coverline("/build/sortable/sortable.js", 138);
dropNode.append(e.drag.get(NODE));
                    } else {
                        _yuitest_coverline("/build/sortable/sortable.js", 140);
dropNode.insert(e.drag.get(NODE), dir);
                    }
                    _yuitest_coverline("/build/sortable/sortable.js", 142);
break;
                case 'swap':
                    _yuitest_coverline("/build/sortable/sortable.js", 144);
Y.DD.DDM.swapNode(e.drag, e.drop);
                    _yuitest_coverline("/build/sortable/sortable.js", 145);
break;
                case 'move':
                case 'copy':
                    _yuitest_coverline("/build/sortable/sortable.js", 148);
dropsort = Y.Sortable.getSortable(e.drop.get(NODE).get(PARENT_NODE));

                    _yuitest_coverline("/build/sortable/sortable.js", 150);
if (!dropsort) {
                        _yuitest_coverline("/build/sortable/sortable.js", 151);
return;
                    }
                    
                    _yuitest_coverline("/build/sortable/sortable.js", 154);
Y.DD.DDM.getDrop(e.drag.get(NODE)).addToGroup(dropsort.get(ID));

                    //Same List
                    _yuitest_coverline("/build/sortable/sortable.js", 157);
if (same) {
                        _yuitest_coverline("/build/sortable/sortable.js", 158);
Y.DD.DDM.swapNode(e.drag, e.drop);
                    } else {
                        _yuitest_coverline("/build/sortable/sortable.js", 160);
if (this.get('moveType') == 'copy') {
                            //New List
                            _yuitest_coverline("/build/sortable/sortable.js", 162);
oldNode = e.drag.get(NODE);
                            _yuitest_coverline("/build/sortable/sortable.js", 163);
newNode = oldNode.cloneNode(true);

                            _yuitest_coverline("/build/sortable/sortable.js", 165);
newNode.set(ID, '');
                            _yuitest_coverline("/build/sortable/sortable.js", 166);
e.drag.set(NODE, newNode);
                            _yuitest_coverline("/build/sortable/sortable.js", 167);
dropsort.delegate.createDrop(newNode, [dropsort.get(ID)]);
                            _yuitest_coverline("/build/sortable/sortable.js", 168);
oldNode.setStyles({
                                top: '',
                                left: ''
                            });
                        }
                        _yuitest_coverline("/build/sortable/sortable.js", 173);
e.drop.get(NODE).insert(e.drag.get(NODE), 'before');
                    }
                    _yuitest_coverline("/build/sortable/sortable.js", 175);
break;
            }

            _yuitest_coverline("/build/sortable/sortable.js", 178);
this.fire(moveType, { same: same, drag: e.drag, drop: e.drop });
            _yuitest_coverline("/build/sortable/sortable.js", 179);
this.fire('moved', { same: same, drag: e.drag, drop: e.drop });
        },
        /**
        * @private
        * @method _onDragStart
        * @param Event e The Event Object
        * @description Handles the DragStart event and initializes some settings.
        */
        _onDragStart: function(e) {
            _yuitest_coverfunc("/build/sortable/sortable.js", "_onDragStart", 187);
_yuitest_coverline("/build/sortable/sortable.js", 188);
var del = this.delegate,
                lastNode = del.get('lastNode');
            _yuitest_coverline("/build/sortable/sortable.js", 190);
if (lastNode && lastNode.getDOMNode()) {
                _yuitest_coverline("/build/sortable/sortable.js", 191);
lastNode.setStyle(ZINDEX, '');
            }
            _yuitest_coverline("/build/sortable/sortable.js", 193);
del.get(this.get(OPACITY_NODE)).setStyle(OPACITY, this.get(OPACITY));
            _yuitest_coverline("/build/sortable/sortable.js", 194);
del.get(CURRENT_NODE).setStyle(ZINDEX, '999');
        },
        /**
        * @private
        * @method _onDragEnd
        * @param Event e The Event Object
        * @description Handles the DragEnd event that cleans up the settings in the drag:start event.
        */
        _onDragEnd: function(e) {
            _yuitest_coverfunc("/build/sortable/sortable.js", "_onDragEnd", 202);
_yuitest_coverline("/build/sortable/sortable.js", 203);
this.delegate.get(this.get(OPACITY_NODE)).setStyle(OPACITY, 1);
            _yuitest_coverline("/build/sortable/sortable.js", 204);
this.delegate.get(CURRENT_NODE).setStyles({
                top: '',
                left: ''
            });
            _yuitest_coverline("/build/sortable/sortable.js", 208);
this.sync();
        },
        /**
        * @method plug
        * @param Class cls The class to plug
        * @param Object config The class config
        * @description Passthrough to the DD.Delegate.ddplug method
        * @chainable
        */
        plug: function(cls, config) {
            //I don't like this.. Not at all, need to discuss with the team
            _yuitest_coverfunc("/build/sortable/sortable.js", "plug", 217);
_yuitest_coverline("/build/sortable/sortable.js", 219);
if (cls && cls.NAME.substring(0, 4).toLowerCase() === 'sort') {
                _yuitest_coverline("/build/sortable/sortable.js", 220);
this.constructor.superclass.plug.call(this, cls, config);
            } else {
                _yuitest_coverline("/build/sortable/sortable.js", 222);
this.delegate.dd.plug(cls, config);
            }
            _yuitest_coverline("/build/sortable/sortable.js", 224);
return this;
        },
        /**
        * @method sync
        * @description Passthrough to the DD.Delegate syncTargets method.
        * @chainable
        */
        sync: function() {
            _yuitest_coverfunc("/build/sortable/sortable.js", "sync", 231);
_yuitest_coverline("/build/sortable/sortable.js", 232);
this.delegate.syncTargets();
            _yuitest_coverline("/build/sortable/sortable.js", 233);
return this;
        },
        destructor: function() {
            _yuitest_coverfunc("/build/sortable/sortable.js", "destructor", 235);
_yuitest_coverline("/build/sortable/sortable.js", 236);
this.drop.destroy();
            _yuitest_coverline("/build/sortable/sortable.js", 237);
this.delegate.destroy();
            _yuitest_coverline("/build/sortable/sortable.js", 238);
Sortable.unreg(this);
        },
        /**
        * @method join
        * @param Sortable sel The Sortable list to join with
        * @param String type The type of join to do: full, inner, outer, none. Default: full
        * @description Join this Sortable with another Sortable instance.
        * <ul>
        *   <li>full: Exchange nodes with both lists.</li>
        *   <li>inner: Items can go into this list from the joined list.</li>
        *   <li>outer: Items can go out of the joined list into this list.</li>
        *   <li>none: Removes the join.</li>
        * </ul>
        * @chainable
        */
        join: function(sel, type) {
            _yuitest_coverfunc("/build/sortable/sortable.js", "join", 253);
_yuitest_coverline("/build/sortable/sortable.js", 254);
if (!(sel instanceof Y.Sortable)) {
                _yuitest_coverline("/build/sortable/sortable.js", 255);
Y.error('Sortable: join needs a Sortable Instance');
                _yuitest_coverline("/build/sortable/sortable.js", 256);
return this;
            }
            _yuitest_coverline("/build/sortable/sortable.js", 258);
if (!type) {
                _yuitest_coverline("/build/sortable/sortable.js", 259);
type = 'full';
            }
            _yuitest_coverline("/build/sortable/sortable.js", 261);
type = type.toLowerCase();
            _yuitest_coverline("/build/sortable/sortable.js", 262);
var method = '_join_' + type;

            _yuitest_coverline("/build/sortable/sortable.js", 264);
if (this[method]) {
                _yuitest_coverline("/build/sortable/sortable.js", 265);
this[method](sel);
            }
            
            _yuitest_coverline("/build/sortable/sortable.js", 268);
return this;
        },
        /**
        * @private
        * @method _join_none
        * @param Sortable sel The Sortable to remove the join from
        * @description Removes the join with the passed Sortable.
        */
        _join_none: function(sel) {
            _yuitest_coverfunc("/build/sortable/sortable.js", "_join_none", 276);
_yuitest_coverline("/build/sortable/sortable.js", 277);
this.delegate.dd.removeFromGroup(sel.get(ID));
            _yuitest_coverline("/build/sortable/sortable.js", 278);
sel.delegate.dd.removeFromGroup(this.get(ID));
        },
        /**
        * @private
        * @method _join_full
        * @param Sortable sel The Sortable list to join with
        * @description Joins both of the Sortables together.
        */
        _join_full: function(sel) {
            _yuitest_coverfunc("/build/sortable/sortable.js", "_join_full", 286);
_yuitest_coverline("/build/sortable/sortable.js", 287);
this.delegate.dd.addToGroup(sel.get(ID));
            _yuitest_coverline("/build/sortable/sortable.js", 288);
sel.delegate.dd.addToGroup(this.get(ID));
        },
        /**
        * @private
        * @method _join_outer
        * @param Sortable sel The Sortable list to join with
        * @description Allows this Sortable to accept items from the passed Sortable.
        */
        _join_outer: function(sel) {
            _yuitest_coverfunc("/build/sortable/sortable.js", "_join_outer", 296);
_yuitest_coverline("/build/sortable/sortable.js", 297);
this.delegate.dd.addToGroup(sel.get(ID));
        },
        /**
        * @private
        * @method _join_inner
        * @param Sortable sel The Sortable list to join with
        * @description Allows this Sortable to give items to the passed Sortable.
        */
        _join_inner: function(sel) {
            _yuitest_coverfunc("/build/sortable/sortable.js", "_join_inner", 305);
_yuitest_coverline("/build/sortable/sortable.js", 306);
sel.delegate.dd.addToGroup(this.get(ID));
        },
        /**
        * A custom callback to allow a user to extract some sort of id or any other data from the node to use in the "ordering list" and then that data should be returned from the callback.
        * @method getOrdering
        * @param Function callback 
        * @return Array
        */
        getOrdering: function(callback) {
            _yuitest_coverfunc("/build/sortable/sortable.js", "getOrdering", 314);
_yuitest_coverline("/build/sortable/sortable.js", 315);
var ordering = [];

            _yuitest_coverline("/build/sortable/sortable.js", 317);
if (!Y.Lang.isFunction(callback)) {
                _yuitest_coverline("/build/sortable/sortable.js", 318);
callback = function (node) {
                    _yuitest_coverfunc("/build/sortable/sortable.js", "callback", 318);
_yuitest_coverline("/build/sortable/sortable.js", 319);
return node;
                };
            }

            _yuitest_coverline("/build/sortable/sortable.js", 323);
Y.one(this.get(CONT)).all(this.get(NODES)).each(function(node) {
                _yuitest_coverfunc("/build/sortable/sortable.js", "(anonymous 2)", 323);
_yuitest_coverline("/build/sortable/sortable.js", 324);
ordering.push(callback(node));
            });
            _yuitest_coverline("/build/sortable/sortable.js", 326);
return ordering;
       }
    }, {
        NAME: 'sortable',
        ATTRS: {
            /**
            * @attribute handles
            * @description Drag handles to pass on to the internal DD.Delegate instance.
            * @type Array
            */    
            handles: {
                value: false
            },
            /**
            * @attribute container
            * @description A selector query to get the container to listen for mousedown events on. All "nodes" should be a child of this container.
            * @type String
            */    
            container: {
                value: 'body'
            },
            /**
            * @attribute nodes
            * @description A selector query to get the children of the "container" to make draggable elements from.
            * @type String
            */        
            nodes: {
                value: '.dd-draggable'
            },
            /**
            * @attribute opacity
            * @description The opacity to change the proxy item to when dragging.
            * @type String
            */        
            opacity: {
                value: '.75'
            },
            /**
            * @attribute opacityNode
            * @description The node to set opacity on when dragging (dragNode or currentNode). Default: currentNode.
            * @type String
            */        
            opacityNode: {
                value: 'currentNode'
            },
            /**
            * @attribute id
            * @description The id of this Sortable, used to get a reference to this Sortable list from another list.
            * @type String
            */        
            id: {
                value: null
            },
            /**
            * @attribute moveType
            * @description How should an item move to another list: insert, swap, move, copy. Default: insert
            * @type String
            */        
            moveType: {
                value: 'insert'
            },
            /**
            * @attribute invalid
            * @description A selector string to test if a list item is invalid and not sortable
            * @type String
            */        
            invalid: {
                value: ''
            }
        },
        /**
        * @static
        * @property _sortables
        * @private
        * @type Array
        * @description Hash map of all Sortables on the page.
        */
        _sortables: [],
        /**
        * @static
        * @method _test
        * @param {Node} node The node instance to test.
        * @param {String|Node} test The node instance or selector string to test against.
        * @description Test a Node or a selector for the container
        */
        _test: function(node, test) {
            _yuitest_coverfunc("/build/sortable/sortable.js", "_test", 411);
_yuitest_coverline("/build/sortable/sortable.js", 412);
if (test instanceof Y.Node) {
                _yuitest_coverline("/build/sortable/sortable.js", 413);
return (test === node);
            } else {
                _yuitest_coverline("/build/sortable/sortable.js", 415);
return node.test(test);
            }
        },
        /**
        * @static
        * @method getSortable
        * @param {String|Node} node The node instance or selector string to use to find a Sortable instance.
        * @description Get a Sortable instance back from a node reference or a selector string.
        */
        getSortable: function(node) {
            _yuitest_coverfunc("/build/sortable/sortable.js", "getSortable", 424);
_yuitest_coverline("/build/sortable/sortable.js", 425);
var s = null;
            _yuitest_coverline("/build/sortable/sortable.js", 426);
node = Y.one(node);
            _yuitest_coverline("/build/sortable/sortable.js", 427);
Y.each(Y.Sortable._sortables, function(v) {
                _yuitest_coverfunc("/build/sortable/sortable.js", "(anonymous 3)", 427);
_yuitest_coverline("/build/sortable/sortable.js", 428);
if (Y.Sortable._test(node, v.get(CONT))) {
                    _yuitest_coverline("/build/sortable/sortable.js", 429);
s = v;
                }
            });
            _yuitest_coverline("/build/sortable/sortable.js", 432);
return s;
        },
        /**
        * @static
        * @method reg
        * @param Sortable s A Sortable instance.
        * @description Register a Sortable instance with the singleton to allow lookups later.
        */
        reg: function(s) {
            _yuitest_coverfunc("/build/sortable/sortable.js", "reg", 440);
_yuitest_coverline("/build/sortable/sortable.js", 441);
Y.Sortable._sortables.push(s);
        },
        /**
        * @static
        * @method unreg
        * @param Sortable s A Sortable instance.
        * @description Unregister a Sortable instance with the singleton.
        */
        unreg: function(s) {
            _yuitest_coverfunc("/build/sortable/sortable.js", "unreg", 449);
_yuitest_coverline("/build/sortable/sortable.js", 450);
Y.each(Y.Sortable._sortables, function(v, k) {
                _yuitest_coverfunc("/build/sortable/sortable.js", "(anonymous 4)", 450);
_yuitest_coverline("/build/sortable/sortable.js", 451);
if (v === s) {
                    _yuitest_coverline("/build/sortable/sortable.js", 452);
Y.Sortable._sortables[k] = null;
                    _yuitest_coverline("/build/sortable/sortable.js", 453);
delete Sortable._sortables[k];
                }
            });
        }
    });

    _yuitest_coverline("/build/sortable/sortable.js", 459);
Y.Sortable = Sortable;

    /**
    * @event copy
    * @description A Sortable node was moved with a copy.
    * @param {Event.Facade} event An Event Facade object
    * @param {Boolean} event.same Moved to the same list.
    * @param {DD.Drag} event.drag The drag instance.
    * @param {DD.Drop} event.drop The drop instance.
    * @type {Event.Custom}
    */
    /**
    * @event move
    * @description A Sortable node was moved with a move.
    * @param {Event.Facade} event An Event Facade object with the following specific property added:
    * @param {Boolean} event.same Moved to the same list.
    * @param {DD.Drag} event.drag The drag instance.
    * @param {DD.Drop} event.drop The drop instance.
    * @type {Event.Custom}
    */
    /**
    * @event insert
    * @description A Sortable node was moved with an insert.
    * @param {Event.Facade} event An Event Facade object with the following specific property added:
    * @param {Boolean} event.same Moved to the same list.
    * @param {DD.Drag} event.drag The drag instance.
    * @param {DD.Drop} event.drop The drop instance.
    * @type {Event.Custom}
    */
    /**
    * @event swap
    * @description A Sortable node was moved with a swap.
    * @param {Event.Facade} event An Event Facade object with the following specific property added:
    * @param {Boolean} event.same Moved to the same list.
    * @param {DD.Drag} event.drag The drag instance.
    * @param {DD.Drop} event.drop The drop instance.
    * @type {Event.Custom}
    */
    /**
    * @event moved
    * @description A Sortable node was moved.
    * @param {Event.Facade} event An Event Facade object with the following specific property added:
    * @param {Boolean} event.same Moved to the same list.
    * @param {DD.Drag} event.drag The drag instance.
    * @param {DD.Drop} event.drop The drop instance.
    * @type {Event.Custom}
    */



}, '@VERSION@' ,{requires:['dd-delegate', 'dd-drop-plugin', 'dd-proxy']});
