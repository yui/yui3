YUI.add('datatable-scroll', function(Y) {

var YDo = Y.Do,
	YNode = Y.Node,
	YLang = Y.Lang,
	YUA = Y.UA,
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
		
		COLOR_COLUMNFILLER: {
			value: '#f2f2f2',
			validator: YLang.isString,
			setter: function(param) {
				if (this._headerContainerNode) {
					this._headerContainerNode.setStyle('backgroundColor', param);
				}
			}
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
		this.afterHostMethod("syncUI", this.syncUI);
		
		this.beforeHostMethod('_attachTheadThNode', this._attachTheadThNode);
		this.beforeHostMethod('_attachTbodyTdNode', this._attachTbodyTdNode);        
	},
		
	
	_setUpParentTableNode: function() {
		this._parentTableNode = this.get('host')._tableNode;
		//console.log(this._parentTableNode);
	},
	
	_setUpParentTheadNode: function() {
		this._parentTheadNode = this.get('host')._theadNode;
		//console.log(this._parentTheadNode);
	},
	_setUpParentTbodyNode: function() {
		this._parentTbodyNode = this.get('host')._tbodyNode;
		//console.log(this._parentTbodyNode);
	},
	_setUpParentMessageNode: function() {
		this._parentMsgNode = this.get('host')._msgNode;
		//console.log(this._parentMsgNode);
	},
	
	/////////////////////////////////////////////////////////////////////////////
	//
	// Renderer
	//
	/////////////////////////////////////////////////////////////////////////////
	
	renderUI: function() {
		this._createBodyContainer();
		this._createHeaderContainer();
		this._setContentBoxDimenions();
	},
	
	syncUI: function() {
		this._syncScroll();
		this._syncTh();
	},
	
	_syncTh: function() {
		var th = YNode.all('#'+this._parentContainer.get('id')+' .yui3-datatable-hd table thead th'),
			//td = this._parentTbodyNode.get('children')._nodes[0].children,
			td = YNode.all('#'+this._parentContainer.get('id')+' .yui3-datatable-bd table tr td'),
			i,
			len,
			thWidth, tdWidth, thLiner, tdLiner;
			
			for (i=0, len = th.size(); i<len; i++) {
				
				//If a width has not been already set on the TD:
				if (td.item(i).get('firstChild').getStyle('width') === "auto") {
					
					thLiner = th.item(i).get('firstChild'); //TODO: use liner API
					tdLiner = td.item(i).get('firstChild');
					
					thWidth = thLiner.get('clientWidth');
					tdWidth = td.item(i).get('clientWidth'); /* TODO: for some reason, using tdLiner.get('clientWidth') doesn't work - why not? */
										
					//if TH is bigger than TD, enlarge TD Liner
					if (thWidth > tdWidth) {
						tdLiner.setStyle('width', thWidth - 20 + 'px');
					}
					
					//if TD is bigger than TH, enlarge TH Liner
					else if (tdWidth > thWidth) {
						thLiner.setStyle('width', tdWidth - 20 + 'px');
					}
				}

			}
			
	},
	
	//Before attaching the Th nodes, add the appropriate width to the liner divs.
	_attachTheadThNode: function(o) {
		var width = o.column.get('width') || 'auto';
		
		if (width !== 'auto') {
			o.th.get('firstChild').setStyles({'width': width, 'overflow':'hidden'});
		}
		else {
			//o.th.get('firstChild').setStyles({'overflow':'visible'});
		}
		return o;
	},
	
	//Before attaching the td nodes, add the appropriate width to the liner divs.
	_attachTbodyTdNode: function(o) {
		var width = o.column.get('width') || 'auto';
		
		if (width !== 'auto') {
			o.td.get('firstChild').setStyles({'width': width, 'overflow': 'hidden'});
			o.td.setStyles({'width': width, 'overflow': 'hidden'});
		}
		else {
			o.td.get('firstChild').setStyles({'width': width, 'overflow': 'visible'});
			o.td.setStyles({'width': width, 'overflow': 'visible'});
		}

		return o;
	},
	
	_createBodyContainer: function() {
		var	bd = YNode.create(CONTAINER_BODY),
			onScrollFn = Y.bind("_onScroll", this);
		this._bodyContainerNode = bd;		
		this._setOverflowForTbody();
		bd.appendChild(this._parentTableNode);
		this._parentContainer.appendChild(bd);
		bd.on('scroll', onScrollFn);
	},
	
	_createHeaderContainer: function() {
		var hd = YNode.create(CONTAINER_HEADER),
			tbl = YNode.create('<table></table>');
		this._headerContainerNode = hd;
		
		hd.setStyle('backgroundColor',this.get("COLOR_COLUMNFILLER"));
		this._setOverflowForThead();
		tbl.appendChild(this._parentTheadNode);
		hd.appendChild(tbl);
		this._parentContainer.prepend(hd);
		
	},
	
	_setOverflowForTbody: function() {
		var dir = this.get('scroll'),
			w = this.get('width') || "",
			h = this.get('height') || "",
			el = this._bodyContainerNode,
			styles = {'width':"", 'height':h};
				
		if (dir === 'x') {
			styles['overflowY'] = 'hidden';
			styles['width'] = w;
			//el.setStyles({'overflow-y':'hidden'});
		}
		else if (dir === 'y') {
			//el.setStyles({'overflow-x':'hidden', "width": ""});
			styles['overflowX'] = 'hidden';
		}
		
		//assume xy
		else {
			styles['width'] = w;
		}
		
		el.setStyles(styles);
		return el;
	},
	
	_setOverflowForThead: function() {
		var dir = this.get('scroll'),
			w = this.get('width'),
			el = this._headerContainerNode;
		
		if (dir !== 'y') {
			el.setStyles({'width': w, 'overflow': 'hidden'});
		}
	},
	
	_setContentBoxDimenions: function() {
		if (this.get('scroll') === 'y') {
			this._parentContainer.setStyle('width', 'auto');
		}
		
		else if (YUA.ie) {
			this._parentContainer.setStyle('width', this.get('width') || 'auto');
		}
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
		    this._syncScrollOverhang();
		 				    if(YUA.opera) {
			 				    	// Bug 1925874
			 				    	this._headerContainerNode.set('scrollLeft', this._bodyContainerNode.get('scrollLeft'));
			 				    		if(!this.get("width")) {
			 				    	    	// Bug 1926125
			 				    	        document.body.style += '';
			 				    	    }
			 		}
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
		        w = (tBodyContainer.get('scrollHeight') > tBodyContainer.get('clientHeight')) ?
		    	// but account for y-scrollbar since it is visible
					(tBody.get('parentNode').get('clientWidth') + 19) + "px" :
		     		// no y-scrollbar, just borders
            		(tBody.get('parentNode').get('clientWidth') + 2) + "px";
				this._parentContainer.setStyle('width', w);
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
			
			if(!this.get('height') && (YUA.ie)) {
						w = (tBodyContainer.get('scrollWidth') > tBodyContainer.get('offsetWidth')) ?
			            (tBody.get('parentNode').get('offsetHeight') + 18) + "px" : 
			            tBody.get('parentNode').get('offsetHeight') + "px";
						
						tBodyContainer.setStyle('height', w);
					}
			
		if (tBody.get('rows').length === 0) {
			this._parentMsgNode.get('parentNode').setStyle('width', this._parentTheadNode.get('parentNode').get('offsetWidth')+'px');
		}
		else {
			this._parentMsgNode.get('parentNode').setStyle('width', "");
		}
			
	},
	
	/**
	 * Adds/removes Column header overhang as necesary.
	 * Taken from YUI2 ScrollingDataTable.js
	 *
	 * @method _syncScrollOverhang
	 * @private
	 */
	_syncScrollOverhang: function() {
		var tBodyContainer = this._bodyContainerNode,
			padding = 1;
		
		if ((tBodyContainer.get('scrollHeight') > tBodyContainer.get('clientHeight')) || (tBodyContainer.get('scrollWidth') > tBodyContainer.get('clientWidth'))) {
			padding = 18;
		}
		
		this._setOverhangValue(padding);
	},
	
	
	/**
	 * Sets Column header overhang to given width.
	 * Taken from YUI2 ScrollingDataTable.js with minor modifications
	 *
	 * @method _setOverhangValue
	 * @param nBorderWidth {Number} Value of new border for overhang. 
	 * @private
	 */ 
	_setOverhangValue: function(borderWidth) {
		var host = this.get('host'),
			cols = host.get('columnset').get('columns'),
		 	lastHeaders = cols[cols.length-1] || [],
	        len = cols.length,
	        value = borderWidth + "px solid " + this.get("COLOR_COLUMNFILLER"),
			children = this._parentTheadNode.get('children').get('children')[0]._nodes; //hack here to get to the array of TH elements
	
	    //this._parentTheadNode.setStyle('display', 'none');
		YNode.one('#'+children[len-1].id).setStyle('borderRight', value);
	    // for(var i=0; i<len; i++) {
	    // 			YNode.one('#'+children[i]._yuid).setStyle('borderRight', value);
	    // 	    }
	    // 	    this._parentTheadNode.setStyle('display', '');
	}
	
	
	
	
	
	
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
	// 		Y.log("Set width of Column " + oColumn + " to " + nWidth + "px", "info", this.toString());
	// 	}
	// 	
	// 	else if (width === null) {
	// 		col.set('width', width);
	// 		this._setColumnWidth(col, "auto");
	// 		this.fire('columnsetWidthEvent', {column: col});
	// 		
	// 	}
	// 	else {
	// 		Y.log("Could not set width of Column " + oColumn + " to " + nWidth + "px", "warn", this.toString());
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
