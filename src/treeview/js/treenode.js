/**
 * Create a node within a hierarchical root built with TreeView
 * 
 * @module treeview
 */

var TREENODE = 'treenode',

	CONTENT_BOX  = 'contentBox',
	BOUNDING_BOX = 'boundingBox',
	// RENDERED	 = 'rendered',
	EXPANDED 	= 'expanded',
	FOCUSED	= 'focused',
	
	// NOT_HIGHLIGHTED =      0,
	// HIGHLIGHTED =          1,
	// PARTIALLY_HIGHLIGHTED =2,
	
	// PROPAGATE_HIGHLIGHT_NONE = 0,
	// PROPAGATE_HIGHLIGHT_UP =   1,
	// PROPAGATE_HIGHLIGHT_DOWN = 2,
	// PROPAGATE_HIGHLIGHT_BOTH = 3,
	
	// PARENT 		= 'parent',
	// PREVIOUS	= 'previous',
	// NEXT 		= 'next',
	// ROOT		= 'root',
	CONTENT		= 'content',
	// CURRENT_FOCUS = 'currentFocus',
	// CHANGE		= 'Change',
	

	getCN     = Y.ClassNameManager.getClassName,
	
	TOGGLE = 	'toggle',
	LEAF =		'leaf',
	PLUS =		'plus',
	MINUS =		'minus',
	FIRST =		'first',
	MIDDLE =	'middle',
	LAST =		'last',
	//MAGNET = 	'magnet',
	CHILDREN = 	'children',
	
	//C_MAGNET = 		getCN(TREENODE, MAGNET),
	C_CHILDREN =	getCN(TREENODE, CHILDREN),
	
	//MAGNET_MARKUP = 	'<a class ="' + C_MAGNET + '" href ="#">&#160;</a>',
	CHILDREN_MARKUP = 	'<ul class ="' + C_CHILDREN + '"></ul>',
	
	// CLICK_EVENT = 		'click',
	// FOCUS_EVENT  =		'focus',
	TOGGLE_EVENT = 		'toggle',
	EXPAND_EVENT = 		'expand',
	COLLAPSE_EVENT = 	'collapse';
	
	
	

/**
 * Create a hierarchical tree
 *
 * @class TreeNode
 * @extends Widget
 * @uses WidgetChild
 * @uses WidgetParent
 * @param config {Object} Configuration object
 * @constructor
 */

Y.TreeNode = Y.Base.create(
	TREENODE, 
	Y.Widget, 
	[Y.WidgetParent, Y.WidgetChild], 
	{


		// _dontPropagate: false,
		_lastToggleClass: '',
		
		BOUNDING_TEMPLATE: '<li></li>',

		ROOT_TYPE: Y.TreeView,

		
		
		renderUI : function () {
			Y.log(Y.substitute('_renderUI [{me}]',{me:this}));
			
			var container = Y.Node.create(CHILDREN_MARKUP);
			//container.set('tabIndex',0);
			this._childrenContainer = container;
			this.get(BOUNDING_BOX).appendChild(container);
			this.get(CONTENT_BOX).setContent(this.get(CONTENT));

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
				return value;
			}
			Y.log(Y.substitute(this.getString('badContent'),{me:this,val:value}),'error');
			return Y.Attribute.INVALID_VALUE;
		},
		bindUI: function () {
			// this.after('parentChange',     		this._syncParentChange);
			// this.after('nextChange',   	this._syncNextChange);
			// this.after('previousChange',	this._syncPreviousChange);	
			// this.after('contentChange',    this._syncContentChange);	
			this.publish(EXPAND_EVENT,  { defaultFn: this._defExpandFn    ,emitFacade:true});
			this.publish(COLLAPSE_EVENT,{ defaultFn: this._defCollapseFn  ,emitFacade:true});
			this.publish(TOGGLE_EVENT,  { defaultFn: this._defToggleFn    ,emitFacade:true});
			

		},
		syncUI: function () {
			
			var toggleClass = getCN(
				TREENODE, 
				TOGGLE,
				(this.next()?(this.previous()?MIDDLE:FIRST):LAST) ,
				(this.isEmpty()?LEAF:(this.get(EXPANDED)?MINUS:PLUS))
			);
			this.get(BOUNDING_BOX).replaceClass(this._lastToggleClass,toggleClass);
			this._lastToggleClass = toggleClass;
		},
		toggle : function() {
			Y.log('toggle');
			if (!this.isEmpty()) {
				this.fire(TOGGLE_EVENT,{node:this});
			}
		},
		_defToggleFn: function(ev) {
			if (ev.node !== this) { return; }
			Y.log(Y.substitute('_defToggleFn; node: {node}',ev));
			if (this.get(EXPANDED)) {
				this.collapse();
			} else {
				this.expand();
			}
			ev.stopPropagation();
		},
		expand: function()  {
			Y.log('expand');
			if (this.get(EXPANDED)) {return;}
			this.fire(EXPAND_EVENT,{node:this});
		},
		_defExpandFn: function (ev) {
			if (ev.node !== this) { return; }
			Y.log(Y.substitute('_defExpandFn; ev.node: {node}',ev));
			this.set(EXPANDED,true);
			this.syncUI();
		},
		collapse: function() {
			Y.log('collapse');
			if (!this.get(EXPANDED)) {return; }
			this.fire(COLLAPSE_EVENT,{node:this});
		},
		_defCollapseFn: function(ev) {
			if (ev.node !== this) { return; }
			Y.log(Y.substitute('_defCollapseFn; ev.node: {node}',ev));
			this.set(EXPANDED,false);
			this.syncUI();
		},
		_onDocFocus: function (evt) {
			var bFocused = this.get(BOUNDING_BOX).contains(evt.target); // contains() checks invoking node also
			this._focusTaken = bFocused;
			this.some(function (child) {
				if (child._focusTaken) {
					bFocused = false;
					return true;
				}
			},this);

			this._hasDOMFocus = bFocused;
			console.log('focus',this.get(CONTENT),this.get(BOUNDING_BOX).contains(evt.target),bFocused, this._focusTaken);
			this._set(FOCUSED, bFocused, { src: Y.Widget.UI_SRC });
		}
/*
		
		_genericNodeValidator: function (node,who) {
			// The new node must be either a TreeNode instance or null
			// If the new node is the same as the existing, don't waste time
			// Besides, it prevents looping forever into updating reciprocal relationships
			// You've been warned!
			var prevVal = this.get(who);
			//console.log('node validator',who,this,node,prevVal,(node === null && prevVal !== null) || (node instanceof TreeNode && node !== prevVal));
			return (node === null && prevVal !== null) || (node instanceof Y.TreeNode && node !== prevVal);
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
		
		
		toString : function() {
			return (this.get(CONTENT) && this.get(CONTENT).get('textContent')) || this._yuid;
		},
		

		_afterNodeFocusedChange: function (ev){
			Y.log(Y.substitute('_afterFocusedChange',ev,this);
			if (ev.target != this) { return; }
			console.log('_afterFocusedChange 1',ev,this);
			this.get(ROOT).set(CURRENT_FOCUS,this,{node:this});
		}
		*/
	},
	{
		/**
		 * The identity of the widget.
		 *
		 * @property TreeNode.NAME
		 * @type String
		 * @static
		 */
		

		/**
		 * Static property used to define the default attribute configuration of
		 * the Widget.
		 *
		 * @property Slider.ATTRS
		 * @Type Object
		 * @static
		 */
		ATTRS : {
/*			dataLoader: {
				value: null
			},
			editable: {
				value:false
			},
			enableHighlight: {
				value:false
			},
			isLeaf: {
				value: false
			},
			multiExpand: {
				value:true
			},
			container: {
				writeOnce:true
			},
	*/		
			expanded: {
				value:false
			},
			content: {
				value: null,
				setter: '_contentSetter'
			},
			defaultChildType: {
				value:'TreeNode'
			},
			tabIndex: {
				value:-1
			}
		},
		HTML_PARSER: {
			boundingBox: function(srcNode) {
				return srcNode;
			},
			content: function(srcNode) {
				if (srcNode.hasChildNodes()) {
					var child = srcNode.get('firstChild');
					var tag = child.get('nodeName').toUpperCase();
					if ( tag == 'UL' || tag == 'OL') {
						return '';
					} 
					if (child.get('nodeType') == 3) {
						return Y.Lang.trim(child.get('textContent')) || undefined;
					}
					return child;
				}
			 },
			children: function (srcNode) {
				this._childrenContainer = srcNode.one('ul');
				var children = [];
				srcNode.all('>ul>li, >ol>li').each(function(srcNode) {
					children.push(new Y.TreeNode({srcNode:srcNode}));
				});
				return children;
			},

			yuiconfig: function(srcNode) { 
				// debugger;
				 return srcNode.getAttribute('yuiconfig'); 
			},
			expanded: function (srcNode) {
				return srcNode.hasClass('expanded');
			}
		}
	}
);
