YUI.add('datatable-scroll', function(Y) {

var YDo = Y.Do,
	YNode = Y.Node,
	YLang = Y.Lang,
	//YUA = Y.UA,
	YgetClassName = Y.ClassNameManager.getClassName,
	DATATABLE = "datatable",
	CLASS_HEADER = YgetClassName(DATATABLE, "hd"),
	CLASS_BODY = YgetClassName(DATATABLE, "bd"),
	CLASS_LINER = YgetClassName(DATATABLE, "liner"),
	CLASS_SCROLLABLE = YgetClassName(DATATABLE, "scrollable"),
	CONTAINER_HEADER = '<div class="'+CLASS_HEADER+'"></div>',
	CONTAINER_BODY = '<div class="'+CLASS_BODY+'"></div>',
	TEMPLATE_TH = '<th id="{id}" rowspan="{rowspan}" colspan="{colspan}"><div class="'+CLASS_LINER+'" style="width:100px">{value}</div></th>',
	TEMPLATE_TD = '<td headers="{headers}"><div class="'+CLASS_LINER+'" style="width:100px">{value}</div></td>';
	

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
		},
		
		columnWidth: {
			value: undefined
		}
    }
});

Y.extend(DataTableScroll, Y.Plugin.Base, {
	
	tdTemplate: TEMPLATE_TD,
	
	thTemplate: TEMPLATE_TH,
	
	_parentTableNode: null,
	
	_parentTheadNode: null,
	
	_parentTbodyNode: null,
	
	_parentMsgNode: null,
	
	_parentContainer: null,
	
	_bodyContainerNode: null,
	
	_headerContainerNode: null,
	
	initializer: function(config) {
        var dt = this.get("host");
		this._parentContainer = dt.get('contentBox');
		this._parentContainer.addClass(CLASS_SCROLLABLE);
		this._setUpNodes();
	},
	
	/////////////////////////////////////////////////////////////////////////////
	//
	// Set up Table Nodes
	//
	/////////////////////////////////////////////////////////////////////////////
				
	_setUpNodes: function() {
		var dt = this.get('host');
		
		this.afterHostMethod("_addTableNode", this._setUpParentTableNode);
		this.afterHostMethod("_addTheadNode", this._setUpParentTheadNode); 
		this.afterHostMethod("_addTbodyNode", this._setUpParentTbodyNode);
		this.afterHostMethod("_addMessageNode", this._setUpParentMessageNode);
       	
		this.afterHostMethod("renderUI", this.renderUI);
		
		this.beforeHostMethod('_attachTheadThNode', this._attachTheadThNode);
		this.beforeHostMethod('_attachTbodyTdNode', this._attachTbodyTdNode);        
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
	
	/////////////////////////////////////////////////////////////////////////////
	//
	// Renderer
	//
	/////////////////////////////////////////////////////////////////////////////
	
	renderUI: function() {
		this._createHeaderContainer();
		this._createBodyContainer();
		//this._syncScroll();
	},
	
	
	//Before attaching the Th nodes, add the appropriate width to the liner divs.
	_attachTheadThNode: function(o) {
		var width = this.get('columnWidth');
		o.th.get('firstChild').setStyle('width', width);
		return o;
	},
	
	//Before attaching the td nodes, add the appropriate width to the liner divs.
	_attachTbodyTdNode: function(o) {
		var width = this.get('columnWidth');
		o.td.get('firstChild').setStyle('width', width);
		return o;
	},
	
	_createBodyContainer: function() {
		var	bd = YNode.create(CONTAINER_BODY),
			onScrollFn = Y.bind("_onScroll", this);
		bd.setStyle("width", this.get('width'));
		bd.setStyle('height', this.get('height'));
			
		bd.appendChild(this._parentTableNode);
		this._parentContainer.appendChild(bd);
		this._bodyContainerNode = bd;		
		bd.on('scroll', onScrollFn);
	},
	
	_createHeaderContainer: function() {
		var hd = YNode.create(CONTAINER_HEADER);
		hd.setStyle("width", this.get('width'));
		hd.appendChild(this._parentTheadNode);
		
		console.log(this._parentTheadNode);
		this._parentContainer.appendChild(hd);
		
		this._headerContainerNode = hd;
	},
	
	/////////////////////////////////////////////////////////////////////////////
	//
	// Scroll Syncing
	//
	/////////////////////////////////////////////////////////////////////////////
	_onScroll: function() {
		this._headerContainerNode.set('scrollLeft', this._bodyContainerNode.get('scrollLeft'));
	},
	
	_syncScroll : function() {
		    this._syncScrollX();
		    this._syncScrollY();
		    //this._syncScrollOverhang();
		    // if(YUA.opera) {
		    // 	        // Bug 1925874
		    // 	        this._headerContainer.set('scrollLeft', this._bodyContainerNode.get('scrollLeft'));
		    // 	        if(!this.get("width")) {
		    // 	            // Bug 1926125
		    // 	            document.body.style += '';
		    // 	        }
		    // 	    }
		 },
	
		/**
		 * Snaps container width for y-scrolling tables.
		 *
		 * @method _syncScrollY
		 * @private
		 */
		_syncScrollY : function() {
		    var tBody = this._parentTbodyNode,
		        tBodyContainer = this._bodyContainerNode,
				w;
	
		    // X-scrolling not enabled
		    if(!this.get("width")) {
		        // Snap outer container width to content
		        w = 
		                (tBodyContainer.get('scrollHeight') > tBodyContainer.get('clientHeight')) ?
		                // but account for y-scrollbar since it is visible
		                (tBody.get('parentNode').get('clientWidth') + 19) + "px" :
		                // no y-scrollbar, just borders
		                (tBody.get('parentNode').get('clientWidth') + 2) + "px";
				tBodyContainer.setStyle('width', w);
		    }
		},
		
		/**
		 * Snaps container height for x-scrolling tables in IE. Syncs message TBODY width. 
		 * Taken from YUI2 ScrollingDataTable.js
		 *
		 * @method _syncScrollX
		 * @private
		 */
		_syncScrollX: function() {
			var tBody = this._parentTbodyNode,
				tBodyContainer = this._bodyContainerNode,
				w;
				this._headerContainerNode.set('scrollLeft', this._bodyContainerNode.get('scrollLeft'));
			
			// if(!this.get('height') && (YUA.ie)) {
			// 			w = (tBodyContainer.get('scrollWidth') > tBodyContainer.get('offsetWidth')) ?
			//             (tBody.get('parentNode').get('offsetHeight') + 18) + "px" : 
			//             tBody.get('parentNode').get('offsetHeight') + "px";
			// 			
			// 			tBodyContainer.setStyle('height', w);
			// 		}
			
			if (tBody.get('rows').length === 0) {
				this._parentMsgNode.get('parentNode').setStyle('width', this._parentTheadNode.get('parentNode').get('offsetWidth')+'px');
			}
			else {
				this._parentMsgNode.get('parentNode').setStyle('width', "");
			}
			
		}
	
	/**
	 * Adds/removes Column header overhang as necesary.
	 * Taken from YUI2 ScrollingDataTable.js
	 *
	 * @method _syncScrollOverhang
	 * @private
	 */
	// _syncScrollOverhang: function() {
	// 	var tBodyContainer = this._bodyContainerNode,
	// 		padding = 1;
	// 	
	// 	if ((tBodyContainer.get('scrollHeight') > tBodyContainer.get('clientHeight')) && (tBodyContainer.get('scrollWidth') > tBodyContainer.get('clientWidth'))) {
	// 		padding = 18;
	// 	}
	// 	
	// this._setOverhangValue(padding);
	// },
	
	// _setOverhangValue: function(borderWidth) {
	// 	var host = this.get('host'),
	// 		colset = host.get('columnset'),
	// 	 	lastHeaders = colset.headers[colset.headers.length-1] || [],
	//         len = lastHeaders.length,
	//         prefix = this._yuid+"-fixedth-",
	//         value = borderWidth + "px solid grey"; // + this.get("COLOR_COLUMNFILLER")
	// 
	//     this._parentTheadNode.setStyle('display', 'none');
	//     // for(var i=0; i<len; i++) {
	//     //     YNode.one(sPrefix+aLastHeaders[i]).style.borderRight = sValue;
	//     // }
	//     this._parentTheadNode.style.display = "";
	// }
	
	// setColumnWidth: function(col, width) {
	// 	colWidth = col.get('minWidth');
	// 	if (YLang.isNumber(width)) {
	// 		width = (width > colWidth) ? width : colWidth;
	// 		col.set('width', width);
	// 		
	// 		//resize dom elements
	// 		this._setColumnWidth(col, width+"px");
	// 		
	// 		this.fire('columnsetWidthEvent', {column: col, width: width});
	// 	}
	// 	
	// 	else if (width === null) {
	// 		col.set('width', width);
	// 		this._setColumnWidth(col, "auto");
	// 		this.fire('columnsetWidthEvent', {column: col});
	// 		
	// 	}
	// 	else {
	// 	}
	// },
	// 
	// _setColumnWidth: function(col, width, overflow) {
	// 	if (col && (col.get('keyIndex') !== null)) {
	// 		overflow = overflow || (((width === '') || (width === 'auto')) ? 'visible' : 'hidden');
	// 		
	// 	}
	// }
	
	
	
	
});

Y.namespace("Plugin").DataTableScroll = DataTableScroll;





}, '@VERSION@' ,{requires:['plugin','datatable-base']});
