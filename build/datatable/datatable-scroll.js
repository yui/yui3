YUI.add('datatable-scroll', function(Y) {

var YDo = Y.Do,
	YNode = Y.Node,
	CLASS_HEADER = "yui3-datatable-hd",
	CLASS_BODY = "yui3-datatable-bd",
	CONTAINER_HEADER = '<div class="'+CLASS_HEADER+'"></div>',
	CONTAINER_BODY = '<div class="'+CLASS_BODY+'"></div>';
	

function DataTableScroll() {
    DataTableScroll.superclass.constructor.apply(this, arguments);
}

Y.mix(DataTableScroll, {
    NS: "scroll",

    NAME: "dataTableScroll",

    ATTRS: {
        width: {
			value: undefined
		},
		height: {
			value: undefined
		},
		
		scroll: {
			value: 'y'
		}
    }
});

Y.extend(DataTableScroll, Y.Plugin.Base, {
	
	_parentTableNode: null,
	
	_parentTheadNode: null,
	
	_parentTbodyNode: null,
	
	_parentMsgNode: null,
	
	_parentContainer: null,
	
	_bodyContainer: CONTAINER_BODY,
	
	_headerContainer: CONTAINER_HEADER,
	
	initializer: function(config) {
        var dt = this.get("host");
		this._parentContainer = dt.get('contentBox');
		this._parentContainer.addClass('yui3-datatable-scrollable');
		this._setUpNodes();
	},
	
	alertMe: function() {
		alert('i am being alerted');
	},
	
	
	
	/////////////////////////////////////////////////////////////////////////////
	//
	// Set up Table Nodes
	//
	/////////////////////////////////////////////////////////////////////////////
				
	_setUpNodes: function() {
		var dt = this.get('host');
		
		//TODO: Detach all these handles in the destructor
		this.afterHostMethod("_addTableNode", this._setUpParentTableNode);
		this.afterHostMethod("_addTheadNode", this._setUpParentTheadNode); 
		this.afterHostMethod("_addTbodyNode", this._setUpParentTbodyNode);
		this.afterHostMethod("_addMessageNode", this._setUpParentMessageNode);
		
		this.afterHostMethod("renderUI", this.renderUI);
	},
	
	_setUpParentTableNode: function() {
		this._parentTableNode = this.get('host')._tableNode;
		console.log(this._parentTableNode);
	},
	
	_setUpParentTheadNode: function() {
		this._parentTheadNode = this.get('host')._theadNode;
		console.log(this._parentTheadNode);
	},
	_setUpParentTbodyNode: function() {
		this._parentTbodyNode = this.get('host')._tbodyNode;
		console.log(this._parentTbodyNode);
	},
	_setUpParentMessageNode: function() {
		this._parentMsgNode = this.get('host')._msgNode;
		console.log(this._parentMsgNode);
	},
	
	renderUI: function() {
		var hd = YNode.create(this._headerContainer),
			bd = YNode.create(this._bodyContainer);
			bd.setStyle("width", this.get('width'));
			bd.setStyle('height', this.get('height'));
			
		bd.appendChild(this._parentTableNode);
		this._parentContainer.appendChild(bd);
        
	}
	
});

Y.namespace("Plugin").DataTableScroll = DataTableScroll;





}, '@VERSION@' ,{requires:['plugin','datatable-base']});
