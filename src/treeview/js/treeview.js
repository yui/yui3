/**
 * Create a node within a hierarchical root built with TreeView
 * 
 * @module treeView
 */

var TREEVIEW = 'treeview'	;

var KEY = {
    BACK_SPACE   : 8,
    DELETE       : 46,
    DOWN         : 40,
    END          : 35,
    ENTER        : 13,
    ESCAPE       : 27,
    HOME         : 36,
    LEFT         : 37,
    PAGE_DOWN    : 34,
    PAGE_UP      : 33, 
    RIGHT        : 39,
    SHIFT        : 16,
    SPACE        : 32,
    TAB          : 9,
    UP           : 38,
	PLUS         : 43,
	MINUS        : 45
};


	
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
		currentFocus: {
			value:null,
			validator: function(node) { 
				return this._genericNodeValidator(node,CURRENT_FOCUS);
			}
		}

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
		
		this.after(CURRENT_FOCUS + CHANGE, this._afterCurrentFocusChange);
		
	},
	renderUI : function () {
		Y.log(Y.substitute('_renderUI [{me}]',{me:this}));
		var cb   = this.get(CONTENT_BOX);
		cb.addClass(C_CHILDREN);
		this._childContainerEl = cb;
		for (var i = 0;i < this._children.length; i++) {
			this._children[i].render(cb);
		}	
		Q.run();
	},
	bindUI: function () {
		var bb = this.get(BOUNDING_BOX);
		Y.on('click',Y.bind(this._onClick,this),bb);
		Y.on('key',this._onKey,bb,'press:' + [KEY.UP,KEY.DOWN,KEY.LEFT,KEY.RIGHT,KEY.ENTER,KEY.PLUS,KEY.MINUS,KEY.HOME,KEY.END].join(','),this);
		Y.on('key',this._onShiftedKey,bb,'press:' + [KEY.PLUS,KEY.MINUS].join(',') + '+shift',this);
	},
	_onClick: function (ev) {
		var target = ev.target;
		var node = this.getNodeByElement(target);
		console.log('_onClick',this,arguments,node);
		if (node) {
			if (target.hasClass(C_LABEL) /*|| target.hasClass(C_MAGNET) */ ) {
				node.fire(CLICK_EVENT,{node:node});
			} else if (target.hasClass(C_CONTENT)) {
				node.toggle();
			}
		}
	},
	_onKey: function (ev) {
		console.log('_onKey',ev.keyCode,this);
		switch(ev.keyCode) {
			case KEY.UP:
				break;
			case KEY.DOWN:
				break;
			case KEY.LEFT:
				break;
			case KEY.RIGHT:
				break;
			case KEY.ENTER:
				break;
			case KEY.PLUS:
				break;
			case KEY.MINUS:
				break;
			case KEY.HOME:
				break;
			case KEY.END:
				break;
		}
	},
	_onShiftedKey: function (ev) {
		console.log('_onShiftedKey',ev.keyCode);
		switch(ev.keyCode) {
			case KEY.PLUS:
				break;
			case KEY.MINUS:
				break;
		}
	},
	
	getNodeByElement : function (el) {
		var node = el.ancestor('.' + getCN(TREENODE));
		return node && _nodes[node.get('id')];
	},
	
	_afterCurrentFocusChange: function (ev) {
		console.log('_afterCurrentFocusChange',ev);
		if (ev.node !== ev.newVal) {return; }
		(ev.prevVal && ev.prevVal.blur());
		(ev.newVal  && Y.Lang.isUndefined(ev.node) && ev.newVal.focus());
	}
});

Y.TreeView = TreeView;
