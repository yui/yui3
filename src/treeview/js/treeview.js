/**
 * Create a node within a hierarchical root built with TreeView
 * 
 * @module treeview
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
 * @uses WidgetParent
 * @param config {Object} Configuration object
 * @constructor
 */
    /**
     * The identity of the widget.
     *
     * @property TreeView.NAME
     * @type String
	 * @value "treeview"
     * @static
     */

Y.TreeView = Y.Base.create(
	TREEVIEW, 
	Y.Widget, 
	[Y.WidgetParent], 
	{

		CONTENT_TEMPLATE:'<ul class="' + C_CHILDREN + '></ul>',
		
		
		bindUI: function () {
			var bb = this.get(BOUNDING_BOX);
			this.after('treenode:click',this._afterNodeClick);
			Y.on('key',this._onKey,bb,'press:' + [KEY.UP,KEY.DOWN,KEY.LEFT,KEY.RIGHT,KEY.ENTER,KEY.PLUS,KEY.MINUS,KEY.HOME,KEY.END].join(','),this);
			Y.on('key',this._onShiftedKey,bb,'press:' + [KEY.PLUS,KEY.MINUS].join(',') + '+shift',this);
		},
		_afterNodeClick: function (ev) {
			Y.log(Y.substitute('_afterNodeClick; node: {target}', ev));
			var node = ev.target,
				domTarget = ev.domEvent.target;
			if (node.get(BOUNDING_BOX) === domTarget) {
				ev.halt();
				node.toggle();
			}
		},
		_onKey: function (ev) {
			Y.log(Y.substitute('_onKey: {keyCode}', ev));
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
			Y.log(Y.substitute('_onShiftedKey: {keyCode}',ev));
			switch(ev.keyCode) {
				case KEY.PLUS:
					break;
				case KEY.MINUS:
					break;
			}
		},
		
		getNodeByElement : function (el) {
			// var node = el.ancestor('.' + getCN(TREENODE));
			// return node && _nodes[node.get('id')];
		},
		
		_afterCurrentFocusChange: function (ev) {
			Y.log(Y.substitute('_afterCurrentFocusChange, node: {node}, newVal: {newVal}, prevVal: {prevVal}',ev));
			if (ev.node !== ev.newVal) {return; }
			(ev.prevVal && ev.prevVal.blur());
			(ev.newVal  && Y.Lang.isUndefined(ev.node) && ev.newVal.focus());
		}
	},
	{
		
		

		/**
		 * Static property used to define the default attribute configuration of
		 * the Widget.
		 *
		 * @property Slider.ATTRS
		 * @Type Object
		 * @static
		 */
		ATTRS : {
			// currentFocus: {
				// value:null,
				// validator: function(node) { 
					// return this._genericNodeValidator(node,CURRENT_FOCUS);
				// }
			// },
			defaultChildType: {
				value:'TreeNode'
			}

		},
		HTML_PARSER: {
			boundingBox:  function (srcNode) {
				return srcNode;
			},

			contentBox: '>ul',
			children: function (srcNode) {
				this._childrenContainer = srcNode.one('ul');
				var children = [];
				srcNode.all('>ul>li, >ol>li').each(function(srcNode) {
					children.push(new Y.TreeNode({srcNode:srcNode}));
				});
				return children;
			}
		}
	}
);

