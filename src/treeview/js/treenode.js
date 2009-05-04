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
	EMPTY_DIV_MARKUP = '<div></div>',
	
	
	silent = false;
	
	var Q = new Y.Queue();
	Q.on('executeCallback',function(ev) {
		console.log('executeCallback',ev.name,ev.context,ev.args);
	});
	Q.on('complete',function() {
		console.log('Q complete');
	});
	
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
			setter: function (value) {
				return this._contentSetter(value);
			}
		},
		container: {
			writeOnce:true
		},
		strings: {
			value: {
				badContent:'Rejected attempt to set invalid content [{val}] on node [{me}]',
				orphan:'TreeNode [{me}] was already an orphan',
				setParent:'Setting new parent [{parent}] of [{me}]',
				setNextSibling:'Setting new next sibling [{next}] of [{me}]',
				setPreviousSibling:'Setting new previous sibling [{previous}] of [{me}]',
				nextSiblingNotChild:'Position of next sibling [{next}] amongst parent [{parent}] children not found',
				previousSiblingNotChild:'Position of previous sibling [{previous}] amongst parent [{parent}] children not found',
				moving:'Moving [{node}] under [{parent}] in between [{previous}] and [{next}]',
				removing:'Removing child [{child}] from parent [{me}]',
				inserting:'Inserting child [{child}] into [{me}] at position [{position}]',
				positionOutOfBounds:'Tried to insert child [{child}] out of bounds at position [{position}] under parent [{me}]',
				positionNotInParent:'Cannot insert node [{child}] before a node [{position}] that is not a child of this node [{me}]',
				positionArgumentInvalid:'Argument position in method insertNode should be an integer, a TreeNode reference or undefined, was [{position}]'
				
			}
		}
	},
	HTML_PARSER: {
		content: function(contentBox) {
			//console.log('+++ content',contentBox.get('innerHTML'));
			var child = contentBox.get('firstChild');
			var tag = child.get('nodeName').toUpperCase();
			if ( tag == 'UL' || tag == 'OL') {
				//console.log('=== content','');
				return '';
			} 
			if (child.get('nodeType') == 3) {
				//console.log('=== content',child.get('textContent'));
				return child.get('textContent');
			}
			//console.log('=== content',child.get('nodeName'),child.get('innerHTML'));
			return child;
		},
		children: ['ul > li, ol > li'],
		/*function (contentBox) {
			var ul = contentBox.query('ul');
			var ol = contentBox.query('ol');
			if (ol && ((ul && Y.DOM.contains(ol,ul)) || !ul)) {
				ul = ol;
			}
			return ul?ul.queryAll('li'):undefined;
		},*/
		yuiconfig: function(contentBox) { 
	        return contentBox.getAttribute('yuiconfig'); 
	    }
	}
});

Y.extend(TreeNode,Y.Widget,{

	_children: null,
	_childContainerEl: null,
	_dontPropagate: false,
	
	
	initializer: function (config) {
		Y.log(Y.substitute('initializer [{me}]',{me:this}));
		this._children = [];
		this.set('locale','es');
		this.set('strings', {
			badContent:'Rechazada la asignaci&oacute;n de contenido inv&aacute;lido [{val}] al nodo [{me}]',
			orphan:'El TreeNode [{me}] ya era hu&eacute;rfano',
			setParent:'Estableciendo nuevo padre [{parent}] para [{me}]',
			setNextSibling:'Estableciendo nuevo hermano siguiente [{next}] para [{me}]',
			setPreviousSibling:'Estableciendo nuevo hermano previo [{previous}] para [{me}]',
			nextSiblingNotChild:'No se ha encontrado la position del hermano siguiente [{next}] entre los hijos del padre [{parent}]',
			previousSiblingNotChild:'No se ha encontrado la position del hermano previo [{previous}] entre los hijos del padre [{parent}]',
			moving:'Moviendo [{node}] bajo [{parent}] entre [{previous}] y [{next}]',
			removing:'Retirando el hijo [{child}] del padre [{me}]',
			inserting:'Insertando el hijo [{child}] bajo el padre [{me}] en la posici&oacute;n [{position}]',
			positionOutOfBounds:'Rechazado el intento de insertar el hijo [{child}] fuera de rango en la posici&oacute;n [{position}] bajo el padre [{me}]',
			positionNotInParent:'No se puede insertar el nodo [{child}] antes de un nodo [{position}] que no es hijo de este padre [{me}]',
			positionArgumentInvalid:"El argumento 'position' en el m&eacute;todo 'insertNode' debe ser un entero, un TreeNode o 'undefined', fue [{position}]"
		});


		config = config || {};

		
		this.after('parentChange',     		this._doWhenNotSilent,this,  this._afterParentChange);
		this.after('nextSiblingChange',   	this._doWhenNotSilent,this,  this._afterNextSiblingChange);
		this.after('previousSiblingChange',	this._doWhenNotSilent,this,  this._afterPreviousSiblingChange);	
		
		this.after('contentChange',    this._afterContentChange);	

		
		silent = true;
	
		if (PARENT in config) {
			this._changeParent(config[PARENT]);
		}
		if (NEXT in config) {
			this._changeNextSibling(config[NEXT]);
		}
		
		if (PREVIOUS in config) {
			this._changePreviousSibling(config[PREVIOUS]);
		}

		silent = false;
		if (CONTENT in config) {
			console.log('content',this,this.get(CONTENT) && (this.get(CONTENT).get('innerHTML') || this.get(CONTENT).get('textContent')));
		}
		if ('yuiconfig' in config) {
			console.log('yuiconfig',this,config.yuiconfig);
		}
		if (CHILDREN in config) {
			config[CHILDREN].each(function (node) {
				console.log('child',this,node.get('innerHTML'));
				(new Y.TreeNode({parent:this,contentBox:node}));
			},this);
		}

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
	render: function (parentNode) {
		var root = this.get(ROOT);
		if (root !== this && !root.get(RENDERED)) {
			root.render(parentNode);
		} else {
			TreeNode.superclass.render.apply(this,arguments);
		}
	},
		
	renderUI : function () {
			
        Q.add({fn:this._renderUIContainer,context:this,name:'renderUIContainer'});
        Q.add({fn:this._renderUIChildren,context:this,name:'renderUIChildren'});
		if (!this.get(PARENT)) {
			Q.run();
			console.log('Q launched');
		}
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
		Y.log(Y.substitute('_renderUIContainer [{me}]',{me:this}));
		var cb   = this.get(CONTENT_BOX);
		console.log('antes1',this.get(BOUNDING_BOX).get('innerHTML'));
		if (this === this.get(ROOT)) {
			cb.set('innerHTML','');
		}
		//console.log('antes',this.get(BOUNDING_BOX).get('innerHTML'));
		if (cb.get('nodeName').toUpperCase() == 'LI') {
			var bb = this.get(BOUNDING_BOX);
			var newCb = Y.Node.create('<div></div>');
			bb.replaceChild(newCb,cb);
			var attrs =	cb.get('attributes');
			if (attrs) {
				attrs.each(function(a) {
					newCb.setAttribute(a.get('name'),a.get('value'));
				});
			}
			var children = 	cb.get(CHILDREN);
			if (children) {
				children.each(function(e) {
					if (e.get('nodeName').toUpperCase() == 'UL' || e.get('nodeName').toUpperCase() == 'OL') {
						var grandChildren = e.get(CHILDREN);
						if (grandChildren) {
							grandChildren.each(function(ee) {
								newCb.appendChild(ee);
							});
						}
					} else {
						newCb.appendChild(e);
					}
				});
			}
			cb = newCb;
		}
		cb.appendChild(Y.Node.create(NODE_MARKUP));
		cb.addClass(C_TOGGLE_F_N);
		var container = cb.query('.' + C_CONTENT);
		this.set('container',container);
		var newContent = this.get('content');
		if (newContent instanceof Y.Node) {
			container.appendChild(newContent);
		}
		//console.log('despues',this.get(BOUNDING_BOX).get('innerHTML'));
	},
	_renderUIChildren: function () {

		Y.log(Y.substitute('_renderUIChildren [{me}]',{me:this}));
		var cb   = this.get(CONTENT_BOX);
		cb.appendChild(Y.Node.create(CHILDREN_MARKUP));
		this._childContainerEl = cb.query('.' + C_CHILDREN);
		for (var i = 0;i < this._children.length; i++) {
			Q.add({fn:this._children[i].render,context:this._children[i],args:[this._childContainerEl],name:'render'});
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
		var prevVal = this.get(who);
		//console.log('node validator',who,this,node,prevVal,(node === null && prevVal !== null) || (node instanceof TreeNode && node !== prevVal));
		return (node === null && prevVal !== null) || (node instanceof TreeNode && node !== prevVal);
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
	
	_contentSetter: function(value) {
		if (Y.Lang.isNull(value)) {
			return null;
		}
		if (value instanceof Y.Node) {
			return value;
		}
		if (value.nodeType && value.nodeType == 1) {
			return Y.get(value);
		}
		if (Y.Lang.isString(value)) {
			value = Y.Lang.trim(value);
			return value?Y.Node.create(value):null;
		}
		Y.log(Y.substitute(this.getString('badContent'),{me:this,val:value}),'error');
		return Y.Attribute.INVALID_VALUE;
	},
	
	_afterContentChange: function (e) {
		var newContent = e.newVal;
		var container = this.get('container');
		if (container) {
			container.set('innerHTML','');
			container.appendChild(newContent);
		}
	},
	
	_detach:  function(newParent,oldParent) {
		var parent = oldParent || this.get(PARENT), found = false;
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
				Y.error(Y.substitute(this.getString('orphan'),{me:this}));
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
		if (silent) { 
			//console.log('drop',ev.type,ev.target,ev.newVal,ev.prevVal);
			return; 
		}
		//console.log('do',ev.type,ev.target,ev.newVal,ev.prevVal);
		silent = true;
		f.call(this,ev);
		silent = false;
		Q.run();
	},
	
	_afterParentChange : function(e) {
		var newParent = e.newVal;
		this._detach(newParent,e.prevVal);
		this._changeParent(newParent);
		if (this.get(RENDERED)) {
			Q.add({fn:this._move,context:this,name:'_move'});
		}
	},
	_changeParent: function (newParent) {
		var siblings;

		Y.log(Y.substitute(this.getString('setParent'),{parent:newParent,me:this}));
		this.set(NEXT,null);
		siblings = newParent._children;
		this.set(PREVIOUS,siblings[siblings.length -1] || null);
		siblings.push(this);
	},
	
	_afterNextSiblingChange : function(e) {
		var next = e.newVal;
		this._detach(next && next.get(PARENT));
		this._changeNextSibling(next);
		if (this.get(RENDERED)) {
			Q.add({fn:this._move,context:this,name:'_move'});
		}
	},
	_changeNextSibling: function (next) {
		var	newParent,siblings, previous, found,i;

		Y.log(Y.substitute(this.getString('setNextSibling'),{next:next,me:this}));
		newParent = next && next.get(PARENT);
		if (newParent) {
			siblings = newParent._children;
			found = false;
			for (i = 0;i < siblings.length;i++){
				if (next === siblings[i]) {
					//console.log('::::n',next,i,siblings.length);
					siblings.splice(i,0,this);
					found = true;
					break;
				}
			}
			if (!found && siblings.length) {
				Y.error(Y.substitute(this.getString('nextSiblingNotChild'),{me:this,next:next,parent:newParent}));
			}
			this.set(PARENT,newParent);
		}
		this.set(NEXT,next);
		previous = next.get(PREVIOUS);
		if (previous) {
			this.set(PREVIOUS,previous);
			previous.set(NEXT,this);
		}
		next.set(PREVIOUS,this);
	},
	_afterPreviousSiblingChange : function(e) {
		var previous = e.newVal;
		this._detach(previous && previous.get(PARENT));
		this._changePreviousSibling(previous);
		if (this.get(RENDERED)) {
			Q.add({fn:this._move,context:this,name:'_move'});
		}
	},
	_changePreviousSibling: function (previous) {
		var	newParent,siblings, next, found,i;
		Y.log(Y.substitute(this.getString('setPreviousSibling'),{previous:previous,me:this}));
		newParent = previous && previous.get(PARENT);
		if (newParent) {
			siblings = newParent._children;
			found = false;
			for (i = 0;i < siblings.length;i++){
				if (previous === siblings[i]) {
					//console.log('::::p',previous,i,siblings.length);
					siblings.splice(i+1, 0, this);
					found = true;
					break;
				}
			}
			if (!found && siblings.length) {
				Y.error(Y.substitute(this.getString('previousSiblingNotChild'),{me:this,previous:previous,parent:newParent}));
			}
			this.set(PARENT,newParent);
		}
		this.set(PREVIOUS,previous);
		next = previous.get(NEXT);
		if (next) {
			this.set(NEXT,next);
			next.set(PREVIOUS,this);
		}
		previous.set(NEXT,this);

	},
	_move: function () {
		var myBB = this.get(BOUNDING_BOX),
			parent = this.get(PARENT),
			parentContainer = parent && parent._childContainerEl,
			next= this.get(NEXT),
			nextBB = next && next.get(BOUNDING_BOX);
			
		Y.log(Y.substitute(this.getString('moving'),{
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
		Y.log(Y.substitute(this.getString('removing'),{child:node,me:this}));
		node.set(PARENT,null);
		return node;
	},
	appendChild: function(node) {
		return this.insertNode(node);
	},
	insertChild: function (node, position) {
		var next;
		Y.log(Y.substitute(this.getString('inserting'),{child:node,me:this,position:position}));
		if (node.get(PREVIOUS) || node.get(PREVIOUS) || node.get(PARENT)) {
			Y.error('Cannot insert a node attached elsewhere [' + node + ']');
			return false;
		}
		if (Y.Lang.isNumber(position)) {
			if (position >=0 && position < this._children.length) {
				next = this._children[next];
			} else {
				Y.error(Y.substritute(this.getString('positionOutOfBounds'),{child:node,position:next,me:this}));
				return false;
			}
		} else {
			next = position;
		}
		if (next instanceof TreeNode) {
			if (next.get(PARENT) !== this) {
				Y.error(Y.substitute(this.getString('positionNotInParent'),{child:node,position:next,me:this }));
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