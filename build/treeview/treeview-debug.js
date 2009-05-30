YUI.add('treeview', function(Y) {

/**
 * Create a node within a hierarchical root built with TreeView
 * 
 * @module treeNode
 */

var TREENODE = 'treenode',

	CONTENT_BOX  = 'contentBox',
	BOUNDING_BOX = 'boundingBox',
	RENDERED	 = 'rendered',
	EXPANDED 	= 'expanded',
	
	// NOT_HIGHLIGHTED =      0,
	// HIGHLIGHTED =          1,
	// PARTIALLY_HIGHLIGHTED =2,
	
	// PROPAGATE_HIGHLIGHT_NONE = 0,
	// PROPAGATE_HIGHLIGHT_UP =   1,
	// PROPAGATE_HIGHLIGHT_DOWN = 2,
	// PROPAGATE_HIGHLIGHT_BOTH = 3,
	
	PARENT 		= 'parent',
	PREVIOUS	= 'previousSibling',
	NEXT 		= 'nextSibling',
	ROOT		= 'root',
	CONTENT		= 'content',
	

	getCN     = Y.ClassNameManager.getClassName,
	
	TOGGLE = 	'toggle',
	LEAF =		'leaf',
	PLUS =		'plus',
	MINUS =		'minus',
	FIRST =		'first',
	MIDDLE =	'middle',
	LAST =		'last',
	LABEL = 	'label',
	MAGNET = 	'magnet',
	CHILDREN = 	'children',
	
	C_LABEL = 		getCN(TREENODE, LABEL),
	C_MAGNET = 		getCN(TREENODE, MAGNET),
	C_CHILDREN =	getCN(TREENODE, CHILDREN),
	C_CONTENT =		getCN(TREENODE, CONTENT),
	
	NODE_MARKUP = 		'<div class ="' + C_LABEL + '"></div>',
	MAGNET_MARKUP = 	'<a class ="' + C_MAGNET + '" href ="#">&nbsp;</a>',
	CHILDREN_MARKUP = 	'<ul class ="' + C_CHILDREN + '"></ul>',
	
	CLICK_EVENT = 'click',
	TOGGLE_EVENT = 'toggle',
	EXPAND_EVENT = 'expand',
	COLLAPSE_EVENT = 'collapse',
	
	
	
	Q = new Y.Queue(),
	
	_nodes = {};

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
		// highlightState: {
			// value:NOT_HIGHLIGHTED
		// },
		// propagateHighlight: {
			// value: PROPAGATE_HIGHLIGHT_NONE
		// },
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
				positionArgumentInvalid:'Argument position in method insertNode should be an integer, a TreeNode reference or undefined, was [{position}]',
				cantHaveParent:'Config "parent" ignored. The TreeView object is the root of the tree, it can\'t have a parent.',
				needsParent:'When looking for the root of [{me}] found no parent above [{brokenRoot}]'
				
			}
		}
	},
	HTML_PARSER: {
		content: function(contentBox) {
			var child = contentBox.get('firstChild');
			var tag = child.get('nodeName').toUpperCase();
			if ( tag == 'UL' || tag == 'OL') {
				return '';
			} 
			if (child.get('nodeType') == 3) {
				return Y.Lang.trim(child.get('textContent')) || undefined;
			}
			return child;
		},
		children: ['>ul>li,>ol>li'],
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
	_lastToggleClass: '',
	
	BOUNDING_TEMPLATE: '<li></li>',
	
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
			positionArgumentInvalid:"El argumento 'position' en el m&eacute;todo 'insertNode' debe ser un entero, un TreeNode o 'undefined', fue [{position}]",
			cantHaveParent:'Se ignorar&aacute; el Atributo "parent". El objeto TreeView es la ra&iacute;z del &aacute;rbol, no puede tener padre.',
			needsParent:'Al buscar la ra&iacute;z para [{me}] no se pudo encontrar el padre de [{brokenRoot}]'
		});


		config = config || {};

		
		this.on('parentChange',  this._onParentChange);
		this.on('nextSiblingChange',   this._onNextSiblingChange);
		this.on('previousSiblingChange',  this._onPreviousSiblingChange);	
		
		this.on('contentChange',    this._onContentChange);	

		this.publish(CLICK_EVENT,{defaultFn:this._defClickFn});
		this.publish(TOGGLE_EVENT,{defaultFn:this._defToggleFn});
		this.publish(EXPAND_EVENT,{defaultFn:this._defExpandFn});
		this.publish(COLLAPSE_EVENT,{defaultFn:this._defCollapseFn});

	
		if (PARENT in config) {
			this._changeParent(config[PARENT]);
		}
		if (NEXT in config) {
			this._changeNextSibling(config[NEXT]);
		}
		
		if (PREVIOUS in config) {
			this._changePreviousSibling(config[PREVIOUS]);
		}

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
		this.on('render',function(ev) {
			this._findRoot();
		});
		var parent = this.get(PARENT);
		if (parent  && parent.get(RENDERED)) {
			this.render(parent._childContainerEl);
			Q.run();
		}
	},
	
	destructor: function () {
		for (var i = 0;i < this._children.length;i++) {
			this._children[i].destructor();
		}
		var cb = this.get(CONTENT_BOX);
		cb.set('innerHTML','');
		cb.removeClass(this._lastToggleClass);
	},
		
	renderUI : function () {
			
        Q.add({fn:this._renderUIContainer,context:this,name:'renderUIContainer'});
        Q.add({fn:this._renderUIChildren,context:this,name:'renderUIChildren'});
		if (!this.get(PARENT)) {
			Q.run();
		}
	},
	_findRoot : function () {
		var self = this;
		var findParent = function (node) {
			var root, parent = node.get(PARENT);
			if (parent) {
				root = findParent(parent);
			} else {
				if (node._isRoot) {
					root = node;
				} else {
					Y.error(Y.substitute(self.getString('needsParent'),{me:self,brokenRoot:node}));
				}
			}
			node._set(ROOT,root);
			return root;
		};
		this._set(ROOT,findParent(this));
	},
		
	_renderUIContainer: function () {
		Y.log(Y.substitute('_renderUIContainer [{me}]',{me:this}));
		var cb   = this.get(CONTENT_BOX);
		/*
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
		*/
				
		
		var container = Y.Node.create(NODE_MARKUP);
		cb.appendChild(container);
		this.set('container',container);
		var newContent = this.get('content');
		if (newContent instanceof Y.Node) {
			container.appendChild(newContent);
		}
		cb.appendChild(Y.Node.create(MAGNET_MARKUP));
		//console.log('despues',this.get(BOUNDING_BOX).get('innerHTML'));
		
		_nodes[this.get(BOUNDING_BOX).get('id')] = this;
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
		this.after('parentChange',     		this._syncParentChange);
		this.after('nextSiblingChange',   	this._syncNextSiblingChange);
		this.after('previousSiblingChange',	this._syncPreviousSiblingChange);	
		
		this.after('contentChange',    this._syncContentChange);	
		
		this.addTarget(this.get(PARENT));
		
		

	},
	syncUI: function () {
		var isNull = Y.Lang.isNull;
		
		if (this._isRoot) { return; }
		var toggleClass = getCN(TREENODE, TOGGLE,
			(isNull(this.get(NEXT))?LAST:(isNull(this.get(PREVIOUS))?FIRST:MIDDLE)) ,
			(this._children.length>0?(this.get(EXPANDED)?MINUS:PLUS):LEAF));
		this.get(CONTENT_BOX).replaceClass(this._lastToggleClass,toggleClass);
		this._lastToggleClass = toggleClass;
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
	
	_onContentChange: function (e) {
		var newContent = e.newVal;
		var container = this.get('container');
		if (container) {
			container.set('innerHTML','');
			container.appendChild(newContent);
		}
	},
	_syncContentChange: function (e) {
	
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
			next.set(PREVIOUS, previous,{internal:true});
		}
		if (previous) {
			previous.set(NEXT,next,{internal:true});
		}			
	},
	
	_onParentChange : function(e) {
		if (e.internal) { return; }
		var newParent = e.newVal;
		this._detach(newParent,e.prevVal);
		this._changeParent(newParent);
	},
	_changeParent: function (newParent) {
		var siblings;

		Y.log(Y.substitute(this.getString('setParent'),{parent:newParent,me:this}));
		this.set(NEXT,null,{internal:true});
		siblings = newParent._children;
		var previous = siblings.length && siblings[siblings.length -1];
		if (previous) {
			this.set(PREVIOUS,previous,{internal:true});
			previous.set(NEXT,this,{internal:true});
		}
		siblings.push(this);
	},
	_syncParentChange: function (e) {
		if (e.internal) { return; }
		Q.add({fn:this._move,context:this,name:'_move'});
	},
	_onNextSiblingChange : function(e) {
		if (e.internal) { return; }
		var next = e.newVal;
		this._detach(next && next.get(PARENT));
		this._changeNextSibling(next);
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
			this.set(PARENT,newParent,{internal:true});
		}
		this.set(NEXT,next,{internal:true});
		previous = next.get(PREVIOUS);
		if (previous) {
			this.set(PREVIOUS,previous,{internal:true});
			previous.set(NEXT,this,{internal:true});
		}
		next.set(PREVIOUS,this,{internal:true});
	},
	_syncNextSiblingChange: function (e) {
		if (e.internal) { return; }
		Q.add({fn:this._move,context:this,name:'_move'});
	},
	_onPreviousSiblingChange : function(e) {
		if (e.internal){ return; }
		var previous = e.newVal;
		this._detach(previous && previous.get(PARENT));
		this._changePreviousSibling(previous);
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
			this.set(PARENT,newParent,{internal:true});
		}
		this.set(PREVIOUS,previous,{internal:true});
		next = previous.get(NEXT);
		if (next) {
			this.set(NEXT,next,{internal:true});
			next.set(PREVIOUS,this,{internal:true});
		}
		previous.set(NEXT,this,{internal:true});

	},
	_syncPreviousSiblingChange: function (e) {
		if (e.internal) { return; }
		Q.add({fn:this._move,context:this,name:'_move'});
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
		this.syncUI();
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
	},
	
	_defClickFn: function (ev) {
		console.log('_defClickFn',this,arguments);
		if (ev.node !== this) { return; }
		console.log('_defClickFn 2',this,arguments);
		this.toggle();
	},
	toggle : function() {
		console.log('toggle',this,arguments);
		if (this._children.length) {
			this.fire(TOGGLE_EVENT,{node:this});
		}
	},
	_defToggleFn: function(ev) {
		if (ev.node !== this) { return; }
		console.log('_defToggleFn',this,arguments);
		if (this.get(EXPANDED)) {
			this.collapse();
		} else {
			this.expand();
		}
		ev.stopPropagation();
	},
	expand: function()  {
		console.log('expand',this,arguments);
		this.fire(EXPAND_EVENT,{node:this});
	},
	_defExpandFn: function (ev) {
		if (ev.node !== this) { return; }
		console.log('_defExpandFn',this,arguments);
		this.set(EXPANDED,true);
		this.syncUI();
	},
	collapse: function() {
		console.log('collapse',this,arguments);
		this.fire(COLLAPSE_EVENT,{node:this});
	},
	_defCollapseFn: function(ev) {
		if (ev.node !== this) { return; }
		console.log('_defCollapseFn',this,arguments);
		this.set(EXPANDED,false);
		this.syncUI();
	}
});

Y.TreeNode = TreeNode;

/**
 * Create a node within a hierarchical root built with TreeView
 * 
 * @module treeView
 */

var TREEVIEW = 'treeview'	;
	
/**
 * Create a hierarchical tree
 *
 * @class TreeView
 * @extends Widget
 * @param config {Object} Configuration object
 * @constructor
 */
var TreeView = function () {
	TreeView.superclass.constructor.apply(this,arguments);
};

Y.mix(TreeView,{
    /**
     * The identity of the widget.
     *
     * @property TreeView.NAME
     * @type String
     * @static
     */
	NAME: TREEVIEW,
	
	

    /**
     * Static property used to define the default attribute configuration of
     * the Widget.
     *
     * @property Slider.ATTRS
     * @Type Object
     * @static
     */
    ATTRS : {
	},
	HTML_PARSER: {
	}
	
});

Y.extend(TreeView,Y.TreeNode,{

	BOUNDING_TEMPLATE: '<div></div>',
	CONTENT_TEMPLATE:'<ul></ul>',
	
	_isRoot: true,
	
	initializer: function (config) {
		config = config || {};
		if (PARENT in config) {
			Y.log(this.getString('cantHaveParent'));
			delete config[PARENT];
		}
		this.set(ROOT,this);
		TreeView.superclass.initializer.apply(this,arguments);
		
	},
	_renderUIContainer: null,
	_renderUIChildren: function () {

		Y.log(Y.substitute('_renderUIChildren [{me}]',{me:this}));
		var cb   = this.get(CONTENT_BOX);
		cb.addClass(C_CHILDREN);
		this._childContainerEl = cb;
		for (var i = 0;i < this._children.length; i++) {
			Q.add({fn:this._children[i].render,context:this._children[i],args:[cb],name:'render'});
		}
	
	},
	bindUI: function () {
		Y.on('click',Y.bind(this._onClick,this),this.get(BOUNDING_BOX));
	},
	_onClick: function (ev) {
		var target = ev.target;
		var node = this.getNodeByElement(target);
		console.log('_noClick',this,arguments,node);
		if (node) {
			if (target.hasClass(C_LABEL) || target.hasClass(C_MAGNET)) {
				node.fire(CLICK_EVENT,{node:node});
			} else if (target.hasClass(C_CONTENT)) {
				node.toggle();
			}
		}
	},
	getNodeByElement : function (el) {
		var node = el.ancestor('.' + getCN(TREENODE));
		return node && _nodes[node.get('id')];
	}
});

Y.TreeView = TreeView;



}, '@VERSION@' ,{requires:['widget','queue']});
