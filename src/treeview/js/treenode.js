/**
 * Create a node within a hierarchical root built with TreeView
 * 
 * @module treeNode
 */
var TREENODE = 'treenode',

	CONTENT_BOX = 'contentBox',
	BOUNDING_BOX = 'boundingBox',
	
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
			get: function() {
				return this._children;
			},
			clone: Y.Attribute.CLONE.DEEP
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
			set: function (value) {
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
		var parent, siblings, previous, next, i;

		this._children = [];
		
		config = config || {};
		if (PARENT in config) {
			parent = config[PARENT];
			siblings = parent._children;
			if (siblings.length) {
				previous = siblings[siblings.length -1];
				previous._dontPropagate = true;
				previous.set(NEXT, this);
				previous._dontPropagate = false;
				this.set(PREVIOUS, previous);
			}
			siblings.push(this);
			this.set(PARENT,parent);
		}
		if (NEXT in config) {
			next = config[NEXT];
			this.set(NEXT,next);
			if (parent) {
				if (next.get(PARENT)) {
					if (next.get(PARENT) !== parent) {
						Y.error('Next Sibling has a diferent parent');
						return false;
					}
				} else {
					next._dontPropagate = true;
					next.set(PARENT,parent);
					next._dontPropagate = false;
					siblings.push(next);
				}
			} else {
				if (next.get(PARENT)) {
					parent = next.get(PARENT);
					siblings = parent._children;
					for (i = 0;i < siblings.length;i++){
						if (next === siblings[i]) {
							siblings.splice(i,0,this);
							break;
						}
					}
					if (i === siblings.length) {
						Y.error('Position of nextSibling amongst parent children not found');
					}
					this.set(PARENT,parent);
				}
			}
			previous = next.get(PREVIOUS);
			if (previous) {
				this.set(PREVIOUS,previous);
				previous._dontPropagate = true;
				previous.set(NEXT,this);
				previous._dontPropagate = false;

			}

			next._dontPropagate = true;
			next.set(PREVIOUS,this);
			next._dontPropagate = false;
		}
		if (PREVIOUS in config) {
			if (previous) {
				if (previous !== config[PREVIOUS]) {
					Y.error('Inconsistent siblings for node');
				}
			} else {
				previous = config[PREVIOUS];
				this.set(PREVIOUS,previous);
				if (parent) {
					if (parent !== previous.get(PARENT)) {
						Y.error('Previous Sibling has a diferent parent');
					}
				} else {
					parent = previous.get(PARENT);
					siblings = parent._children;
					for (i = 0; i < siblings.length;i++){
						if (previous === siblings[i]) {
							siblings.splice(i+1,0,this);
							break;
						}
					}
					if (i === siblings.length) {
						Y.error('Position of previousSibling amongst parent children not found');
					}
					this.set(PARENT,parent);
				}
						
				if (next) {
					if (next !== previous.get(NEXT)) {
						Y.error('Inconsistent siblings for node');
					} 
				} else {
					next = previous.get(NEXT);
					if (next) {
						next._dontPropagate = true;
						next.set(PREVIOUS,this);
						next._dontPropagate = false;
						this.set(NEXT,next);
					}
				} 
				//debugger;
				previous._dontPropagate = true;
				previous.set(NEXT,this);
				previous._dontPropagate = false;
				//debugger;
			}
		}
		
		this._findRoot();
		
		this.after('parentChange',    this._afterParentChange);
		this.after('nextSiblingChange',    this._afterNextSiblingChange);
		this.after('previousSiblingChange',    this._afterPreviousSiblingChange);	
		this.after('contentChange',    this._afterContentChange);	
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
		return !Y.Lang.isUndefined(value);
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
		
	
	_afterParentChange : function(e) {
		if (this._dontPropagate) { return;}
		this._dontPropagate = true;
		var node = e.newVal;
		//if (this.get(PARENT) !== node) {
			Y.log('setting parent [' + node + '] of  [' + this  + ']');
			var oldParent = this.get('parent');
			if (oldParent) {
				oldParent.removeChild(node);
			}
			if (node) {
			node.insertChild(this);
			}
		/*} else {
			this._dontPropagate = false;
			return false;
			//debugger;
		}*/
		this._dontPropagate = false;
	},
	_afterNextSiblingChange : function(e) {
		if (this._dontPropagate) { return;}
		this._dontPropagate = true;
		var node = e.newVal;
		//if (this.get(NEXT) !== node) {
			Y.log('setting next sibling [' + node + '] to  [' + this  + ']');
			var oldParent = this.get(PARENT);
			var newParent = node && node.get(PARENT);
			if (oldParent) {
				oldParent.removeChild(node);
			}
			if (newParent) {
				newParent.insertChild(this,node);
			} else {
			}
		/*} else {
			this._dontPropagate = false;
			return false;
			//debugger;
		}*/
		this._dontPropagate = false;
	},
	_afterPreviousSiblingChange : function(e) {
		if (this._dontPropagate) { return;}
		this._dontPropagate = true;
		var node = e.newVal;
		//if (this.get(PREVIOUS) !== node) {
			Y.log('setting previous sibling [' + node + '] to  [' + this  + ']');
			var oldParent = this.get(PARENT);
			if (oldParent) {
				oldParent.removeChild(node);
			}
			var newParent = node && node.get(PARENT);
			if (newParent) {
				newParent.insertChild(this,node.get(NEXT));
			} else {
			}
		/*} else {
			console.log('on',this,node,this.get(PREVIOUS));
			this._dontPropagate = false;
			return false;
			//debugger;
		}*/			
		this._dontPropagate = false;
	},
	removeChild: function (node) {
		Y.log('removing [' + node + '] from  [' + this  + ']');
		if (node.get(PREVIOUS)) {
			node.get(PREVIOUS).set(NEXT,node.get(NEXT));
		}
		if (node.get(NEXT)) {
			node.get(NEXT).set(PREVIOUS,node.get(PREVIOUS));
		}
		for (var i = 0; i < this._children.length; i++) {
			if (this._children[i] === node) {
				this._children.splice(i,1);
				break;
			}
		}
		node.set(PARENT,null);
		node.set(NEXT,null);
		node.set(PREVIOUS,null);
		node._set(ROOT,node);
		if (node.get('rendered')) {
			var bb = node.get(BOUNDING_BOX);
			bb.get('parentNode').removeChild(bb);
		}
		
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
		} else if (Y.Lang.isUndefined(next)) {
			next = null;
		} else {
			Y.error('Argument next in method insertNode should be an integer, a TreeNode reference or undefined ' + next);
			return false;
		}
		siblings = this._children;
		if (next) {
			node.set(NEXT,next);
			previous = next.get(PREVIOUS);
			if (previous) {
				previous.set(NEXT, node);
			}
			node.set(PREVIOUS, previous);
			next.set(PREVIOUS, node);
			for (i = 0; i < siblings.length; i++) {
				if (siblings[i] === next) {
					siblings.splice(i,0,node);
					break;
				}
			}
			if (i === siblings.length) {
				Y.error('Position of nextSibling amongst parent children not found');
			}
				
		} else {
			previous = siblings[siblings.length -1];
			if (previous) {
				previous.set(NEXT, node);
				node.set(PREVIOUS,previous);
			}
			siblings.push(node);
		}
		if (node.get('rendered')) {
			bb = node.get(BOUNDING_BOX);
			if (next) {
				this._childContainerEl.insertBefore(bb,next.get(BOUNDING_BOX));
			} else {
				this._childContainerEl.appendChild(bb);
			}
		} else {
			if (next) {
				this.set(CONTENT_BOX,this._childContainerEl.insertBefore(Y.Node.create(EMPTY_DIV_MARKUP),next.get(BOUNDING_BOX)));
			} else {
				this.set(CONTENT_BOX,this._childContainerEl.appendChild(Y.Node.create(EMPTY_DIV_MARKUP)));
			}
			node.render();
		}
		if (node.get(ROOT) !== this.get(ROOT)) {
			this._findRoot();
		}
			
		return node;
	}
	

});

Y.TreeNode = TreeNode;