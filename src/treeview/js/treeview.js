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
