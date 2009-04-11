/**
 * Create a node within a hierarchical root built with TreeView
 * 
 * @module treeNode
 */
var TREENODE = 'treenode',

	CONTENT_BOX  = 'contentBox',
	BOUNDING_BOX = 'boundingBox',
	RENDERED	 = 'rendered',
	
	NOT_HIGHLIGHTED =      0,
	HIGHLIGHTED =          1,
	PARTIALLY_HIGHLIGHTED =2,
	
	PROPAGATE_HIGHLIGHT_NONE = 0,
	PROPAGATE_HIGHLIGHT_UP =   1,
	PROPAGATE_HIGHLIGHT_DOWN = 2,
	PROPAGATE_HIGHLIGHT_BOTH = 3,
	
	PARENT 		= 'parent',
	PREVIOUS	= 'previousSibling',
	NEXT 		= 'nextSibling',
	ROOT		= 'root',
	

	getCN     = Y.ClassNameManager.getClassName,
	
	TOGGLE = 	'toggle',
	LEAF =		'leaf',
	PLUS =		'plus',
	MINUS =		'minus',
	FIRST =		'first',
	MIDDLE =	'middle',
	LAST =		'last',
	CONTENT = 	'content',
	MAGNET = 	'magnet',
	CHILDREN = 	'children',
	
	C_TOGGLE = 		getCN(TREENODE, TOGGLE),
	C_TOGGLE_F_N = 	getCN(TREENODE, TOGGLE, FIRST, LEAF),
	C_TOGGLE_F_P = 	getCN(TREENODE, TOGGLE, FIRST, PLUS),
	C_TOGGLE_F_M = 	getCN(TREENODE, TOGGLE, FIRST, MINUS),
	C_TOGGLE_M_N = 	getCN(TREENODE, TOGGLE, MIDDLE, LEAF),
	C_TOGGLE_M_P = 	getCN(TREENODE, TOGGLE, MIDDLE, PLUS),
	C_TOGGLE_M_M = 	getCN(TREENODE, TOGGLE, MIDDLE, MINUS),
	C_TOGGLE_L_N = 	getCN(TREENODE, TOGGLE, LAST, LEAF),
	C_TOGGLE_L_P = 	getCN(TREENODE, TOGGLE, LAST, PLUS),
	C_TOGGLE_L_M = 	getCN(TREENODE, TOGGLE, LAST, MINUS),
	
	regexp_C_TOGGLE = new RegExp('\\b' + getCN(TREENODE,TOGGLE,'(' + FIRST + '|' + MIDDLE + '|' + LAST + ')','(' + LEAF + '|' + PLUS + '|' + MINUS + ')') + '\\b','gi'),
	
	C_CONTENT = 	getCN(TREENODE, CONTENT),
	C_MAGNET = 		getCN(TREENODE, MAGNET),
	C_CHILDREN =	getCN(TREENODE, CHILDREN),
	
	NODE_MARKUP = '<div class ="' + C_TOGGLE + '"><span class ="' + C_CONTENT + '"></span><a class ="' + C_MAGNET + '" href ="#">&nbsp;</a></div>',
	CHILDREN_MARKUP = '<div class ="' + C_CHILDREN + '"></div>',
	EMPTY_DIV_MARKUP = '<div></div>';
	
	/**
 * Create a hierarchical tree
 *
 * @class TreeNode
 * @extends Widget
 * @param config {Object} Configuration object
 * @constructor
 */
var TreeNode = function () {
	TreeNode.superclass.constructor.apply(this,arguments);
};

Y.mix(TreeNode,{
    /**
     * The identity of the widget.
     *
     * @property TreeNode.NAME
     * @type String
     * @static
     */
	NAME: TREENODE,
	
	
	    /**
     * Static Object hash used to capture existing markup for progressive
     * enhancement.  Keys correspond to config attribute names and values
     * are selectors used to inspect the contentBox for an existing node
     * structure.
     *
     * @property Slider.HTML_PARSER
     * @Type Object
     * @static
     */
    HTML_PARSER : {

    },

    /**
     * Static property used to define the default attribute configuration of
     * the Widget.
     *
     * @property Slider.ATTRS
     * @Type Object
     * @static
     */
    ATTRS : {
		children: {
			readOnly:true,
			getter: function() {
				return Y.mix({},this._children);
			}
		},
		dataLoader: {
			value: null
		},
		depth: {
			value:undefined
		},
		editable: {
			value:false
		},
		enableHighlight: {
			value:false
		},
		expanded: {
			value:false
		},
		highlightState: {
			value:NOT_HIGHLIGHTED
		},
		isLeaf: {
			value: false
		},
		multiExpand: {
			value:true
		},
		nextSibling: {
			value: null,
			validator: function(node) { 
				return this._nextSiblingValidator(node); 
			}
		},
		previousSibling: {
			value: null,
			validator: function(node) { 
				return this._previousSiblingValidator(node); 
			}
		},
		parent: {
			value:null,
			validator: function(node) { 
				return this._parentValidator(node); 
			}
		},
		propagateHighlight: {
			value: PROPAGATE_HIGHLIGHT_NONE
		},
		root: {
			value: null,
			readOnly: true
		},
		content: {
			value: null,
			validator: function (value) {
				return this._contentValidator(value);
			},
			setter: function (value) {
				return this._contentSetter(value);
			}
		},
		container: {
			writeOnce:true
		}
	}
});

Y.extend(TreeNode,Y.Widget,{

	_children: null,
	_childContainerEl: null,
	_dontPropagate: false,
	
	
	initializer: function (config) {
		Y.log('initializer [' + this + ']');
		this._children = [];
		config = config || {};

		
		this.on('parentChange',     	this._doWhenNotSilent,this,  this._onParentChange);
		this.on('nextSiblingChange',   	this._doWhenNotSilent,this,  this._onNextSiblingChange);
		this.on('previousSiblingChange',this._doWhenNotSilent,this,  this._onPreviousSiblingChange);	
		
		this.after('contentChange',    this._afterContentChange);	

		this.setAttrs(config);

		this._findRoot();
	},
	destructor: function () {
		for (var i = 0;i < this._children.length;i++) {
			this._children[i].destructor();
		}
		var cb = this.get(CONTENT_BOX);
		cb.set('innerHTML','');
		cb.set('className',cb.get('className').replace(regexp_C_TOGGLE,''));
	},
	renderUI : function () {
			
		if (!this.get(ROOT)) {
			this._findRoot();
		}
        this._renderUIContainer();
        this._renderUIChildren();
	},
	_findRoot : function () {
		var findParent = function (node) {
			var root, parent = node.get(PARENT);
			if (parent) {
				root = findParent(parent);
			} else {
				root = node;
			}
			node._set(ROOT,root);
			return root;
		};
		this._set(ROOT,findParent(this));
	},
		
	_renderUIContainer: function () {
		Y.log('_renderUIContainer [' + this  + ']');
		var cb   = this.get(CONTENT_BOX);
		cb.appendChild(Y.Node.create(NODE_MARKUP));
		cb.addClass(C_TOGGLE_F_N);
		var container = this.get(CONTENT_BOX).query('.' + C_CONTENT);
		this.set('container',container);
		var newContent = this.get('content');
		if (newContent instanceof Y.Node) {
			container.appendChild(newContent);
		}
	},
	_renderUIChildren: function () {

		Y.log('_renderUIChildren [' + this  + ']');
		var cb   = this.get(CONTENT_BOX);
		cb.appendChild(Y.Node.create(CHILDREN_MARKUP));
		this._childContainerEl = cb.query('.' + C_CHILDREN);
		for (var i = 0;i < this._children.length; i++) {
			this._children[i].render(this._childContainerEl);
		}
	
	},
	bindUI: function () {

	},
	syncUI: function () {

	},
	
	_genericNodeValidator: function (node,who) {
		// The new node must be either a TreeNode instance or null
		// If the new node is the same as the existing, don't waste time
		// Besides, it prevents looping forever into updating reciprocal relationships
		// You've been warned!
		var other = this.get(who);
		return (node === null && other !== null) || (node instanceof TreeNode && node !== other);
	},
	
	_parentValidator: function (node) {
		return this._genericNodeValidator(node,PARENT);
	},
	_nextSiblingValidator: function (node) {
		return this._genericNodeValidator(node,NEXT);
	},
	_previousSiblingValidator: function (node) {
		return this._genericNodeValidator(node,PREVIOUS);
	},
	
	_contentValidator:function(value) {
		return value === null || value instanceof Y.Node || (value.nodeType && value.nodeType == 1) ||  Y.Lang.isString(value);
	},
	_contentSetter: function(value) {
		switch(true) {
			case Y.Lang.isNull(value):
				return null;
			case value instanceof Y.Node:
				return value;
			case value.nodeType && value.nodeType == 1:
				return Y.get(value);
			case Y.Lang.isString(value):
				return Y.Node.create(value);
			default:
				return undefined;
		}	
	},
	
	_afterContentChange: function (e) {
		var newContent = e.newVal;
		var container = this.get('container');
		if (container) {
			container.set('innerHTML','');
			container.appendChild(newContent);
		}
	},
	
	_detach:  function(newParent) {
		var parent = this.get(PARENT), found = false;
		if (parent && parent !== newParent) {
			var siblings = parent._children;
			for (var i = 0; i < siblings.length;i++) {
				if (this === siblings[i]) {
					siblings.splice(i,1);
					found = true;
					break;
				}
			}
			if (!found && siblings.length) {
				Y.error(Y.substitute('I [{me}] was already an orphan!',{me:this}));
			}
		}
		var next = this.get(NEXT),
			previous = this.get(PREVIOUS);
		if (next) {
			next.set(PREVIOUS, previous);
		}
		if (previous) {
			previous.set(NEXT,next);
		}			
	},
	
	_doWhenNotSilent : function(ev,f) {
		var root = this.get(ROOT);
		if (!root || root._silent) { return; }
		root._silent = true;
		f.call(this,ev);
		root._silent = false;
	},
	
	_onParentChange : function(e) {
		var newParent = e.newVal;
		Y.log('setting parent [' + newParent + '] of  [' + this  + ']');
		this._detach(newParent);
		if (newParent) {
			this.set(NEXT,null);
			var siblings = newParent._children;
			this.set(PREVIOUS,siblings[siblings.length -1]);
			siblings.push(this);
		}
		if (this.get(RENDERED)) {
			this._move();
		}
	},
	_onNextSiblingChange : function(e) {
		var next = e.newVal;
		Y.log('setting next sibling [' + next + '] to  [' + this  + ']');
		var newParent = next && next.get(PARENT);
		this._detach(newParent);
		if (next) {
			if (newParent) {
				var siblings = newParent._children, found = false;
				for (var i = 0;i < siblings.length;i++){
					if (next === siblings[i]) {
						siblings.splice(i,0,this);
						found = true;
						break;
					}
				}
				if (!found && siblings.length) {
					Y.error('Position of nextSibling amongst parent children not found');
				}
				this.set(PARENT,newParent);
			}
			this.set(NEXT,next);
			var previous = next.get(PREVIOUS);
			if (previous) {
				this.set(PREVIOUS,previous);
				previous.set(NEXT,this);
			}
			next.set(PREVIOUS,this);
		}
		if (this.get(RENDERED)) {
			this._move();
		}
	},
	_onPreviousSiblingChange : function(e) {
		var previous = e.newVal;
		Y.log('setting previous sibling [' + previous + '] to  [' + this  + ']');
		var newParent = previous && previous.get(PARENT);
		this._detach(newParent);
		if (previous) {
			if (newParent) {
				var siblings = newParent._children, found = false;
				for (var i = 0;i < siblings.length;i++){
					if (previous === siblings[i]) {
						siblings.splice(i+1, 0, this);
						found = true;
						break;
					}
				}
				if (!found && siblings.length) {
					Y.error('Position of previousSibling amongst parent children not found');
				}
				this.set(PARENT,newParent);
			}
			this.set(PREVIOUS,previous);
			var next = previous.get(NEXT);
			if (next) {
				this.set(NEXT,next);
				next.set(PREVIOUS,this);
			}
			previous.set(NEXT,this);
		}
		if (this.get(RENDERED)) {
			this._move();
		}
	},
	_move: function () {
		var myBB = this.get(BOUNDING_BOX),
			parent = this.get(PARENT),
			parentContainer = parent && parent._childContainerEl,
			next= this.get(NEXT),
			nextBB = next && next.get(BOUNDING_BOX);
			
		Y.log(Y.substitute('Moving [{node}] under [{parent}] in between [{previous}] and [{next}]',{
			node:this,
			parent:parent,
			previous:this.get(PREVIOUS),
			next:next
		}));
		if (parentContainer) {
			if (nextBB) {
				parentContainer.insertBefore(myBB,nextBB);
			} else {
				parentContainer.appendChild(myBB);
			}
		}
	},
	removeChild: function (node) {
		Y.log('removing [' + node + '] from  [' + this  + ']');
		node.set(PARENT,null);
		return node;
	},
	appendChild: function(node) {
		return this.insertNode(node);
	},
	insertChild: function (node, position) {
		var next,previous,siblings,bb,i;
		Y.log('inserting [' + node + '] into [' + this + '] at [' + position + ']');
		if (node.get(PREVIOUS) || node.get(PREVIOUS) || node.get(PARENT)) {
			Y.error('Cannot insert a node attached elsewhere [' + node + ']');
			return false;
		}
		if (Y.Lang.isNumber(position)) {
			if (position >=0 && position < this._children.length) {
				next = this._children[next];
			} else {
				Y.error('Tried to insert child [' + node + '] out of bounds at next ' + next + ' in [' + this + ']');
				return false;
			}
		} else {
			next = position;
		}
		if (next instanceof TreeNode) {
			if (next.get(PARENT) !== this) {
				Y.error('Cannot insert node [' + node + '] before a node [' + next + '] that is not a children of this node [' + this + ']');
				return false;
			}
			node.set(NEXT,next);
		} else if (Y.Lang.isUndefined(next)) {
			node.set(PARENT,this);
		} else {
			Y.error('Argument next in method insertNode should be an integer, a TreeNode reference or undefined ' + next);
			return false;
		}
		return node;
	},
	toString : function() {
		return (this.get(CONTENT) && this.get(CONTENT).get('textContent')) || this._yuid;
	}
	

});

Y.TreeNode = TreeNode;