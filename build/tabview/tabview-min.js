YUI.add("tabview",function(g,f){var a=g.TabviewBase._queries,e=g.TabviewBase._classNames,h=".",b=g.ClassNameManager.getClassName,c=g.Base.create("tabView",g.Widget,[g.WidgetParent],{_afterChildAdded:function(i){this.get("contentBox").focusManager.refresh();},_defListNodeValueFn:function(){return g.Node.create(c.LIST_TEMPLATE);},_defPanelNodeValueFn:function(){return g.Node.create(c.PANEL_TEMPLATE);},_afterChildRemoved:function(l){var j=l.index,k=this.get("selection");if(!k){k=this.item(j-1)||this.item(0);if(k){k.set("selected",1);}}this.get("contentBox").focusManager.refresh();},_initAria:function(){var i=this.get("contentBox"),j=i.one(a.tabviewList);if(j){j.setAttrs({role:"tablist"});}},bindUI:function(){this.get("contentBox").plug(g.Plugin.NodeFocusManager,{descendants:h+e.tabLabel,keys:{next:"down:39",previous:"down:37"},circular:true});this.after("render",this._setDefSelection);this.after("addChild",this._afterChildAdded);this.after("removeChild",this._afterChildRemoved);},renderUI:function(){var i=this.get("contentBox");this._renderListBox(i);this._renderPanelBox(i);this._childrenContainer=this.get("listNode");this._renderTabs(i);},_setDefSelection:function(i){var j=this.get("selection")||this.item(0);this.some(function(k){if(k.get("selected")){j=k;return true;}});if(j){this.set("selection",j);j.set("selected",1);}},_renderListBox:function(i){var j=this.get("listNode");if(!j.inDoc()){i.append(j);}},_renderPanelBox:function(i){var j=this.get("panelNode");if(!j.inDoc()){i.append(j);}},_renderTabs:function(i){var l=i.all(a.tab),j=this.get("panelNode"),k=(j)?this.get("panelNode").get("children"):null,m=this;if(l){l.addClass(e.tab);i.all(a.tabLabel).addClass(e.tabLabel);i.all(a.tabPanel).addClass(e.tabPanel);l.each(function(p,o){var n=(k)?k.item(o):null;m.add({boundingBox:p,contentBox:p.one(h+e.tabLabel),label:p.one(h+e.tabLabel).get("text"),panelNode:n});});}}},{LIST_TEMPLATE:'<ul class="'+e.tabviewList+'"></ul>',PANEL_TEMPLATE:'<div class="'+e.tabviewPanel+'"></div>',ATTRS:{defaultChildType:{value:"Tab"},listNode:{setter:function(i){i=g.one(i);if(i){i.addClass(e.tabviewList);}return i;},valueFn:"_defListNodeValueFn"},panelNode:{setter:function(i){i=g.one(i);if(i){i.addClass(e.tabviewPanel);}return i;},valueFn:"_defPanelNodeValueFn"},tabIndex:{value:null}},HTML_PARSER:{listNode:a.tabviewList,panelNode:a.tabviewPanel}});g.TabView=c;var d=g.Lang,a=g.TabviewBase._queries,e=g.TabviewBase._classNames,b=g.ClassNameManager.getClassName;g.Tab=g.Base.create("tab",g.Widget,[g.WidgetChild],{BOUNDING_TEMPLATE:'<li class="'+e.tab+'"></li>',CONTENT_TEMPLATE:'<a class="'+e.tabLabel+'"></a>',PANEL_TEMPLATE:'<div class="'+e.tabPanel+'"></div>',_uiSetSelectedPanel:function(i){this.get("panelNode").toggleClass(e.selectedPanel,i);},_afterTabSelectedChange:function(i){this._uiSetSelectedPanel(i.newVal);},_afterParentChange:function(i){if(!i.newVal){this._remove();}else{this._add();}},_initAria:function(){var j=this.get("contentBox"),k=j.get("id"),i=this.get("panelNode");if(!k){k=g.guid();j.set("id",k);}j.set("role","tab");j.get("parentNode").set("role","presentation");i.setAttrs({role:"tabpanel","aria-labelledby":k});},syncUI:function(){this.set("label",this.get("label"));this.set("content",this.get("content"));this._uiSetSelectedPanel(this.get("selected"));},bindUI:function(){this.after("selectedChange",this._afterTabSelectedChange);this.after("parentChange",this._afterParentChange);},renderUI:function(){this._renderPanel();this._initAria();},_renderPanel:function(){this.get("parent").get("panelNode").appendChild(this.get("panelNode"));},_add:function(){var j=this.get("parent").get("contentBox"),k=j.get("listNode"),i=j.get("panelNode");if(k){k.appendChild(this.get("boundingBox"));}if(i){i.appendChild(this.get("panelNode"));}},_remove:function(){this.get("boundingBox").remove();this.get("panelNode").remove();},_onActivate:function(i){if(i.target===this){i.domEvent.preventDefault();i.target.set("selected",1);}},initializer:function(){this.publish(this.get("triggerEvent"),{defaultFn:this._onActivate});},_defLabelSetter:function(i){this.get("contentBox").setContent(i);return i;},_defContentSetter:function(i){this.get("panelNode").setContent(i);return i;},_defContentGetter:function(i){return this.get("panelNode").getContent();},_defPanelNodeValueFn:function(){var j=this.get("contentBox").get("href")||"",l=this.get("parent"),k=j.indexOf("#"),i;j=j.substr(k);if(j.charAt(0)==="#"){i=g.one(j);if(i){i.addClass(e.tabPanel);}}if(!i&&l){i=l.get("panelNode").get("children").item(this.get("index"));}if(!i){i=g.Node.create(this.PANEL_TEMPLATE);}return i;}},{ATTRS:{triggerEvent:{value:"click"},label:{setter:"_defLabelSetter",validator:d.isString},content:{setter:"_defContentSetter",getter:"_defContentGetter"},panelNode:{setter:function(i){i=g.one(i);if(i){i.addClass(e.tabPanel);}return i;},valueFn:"_defPanelNodeValueFn"},tabIndex:{value:null,validator:"_validTabIndex"}},HTML_PARSER:{selected:function(i){var j=(this.get("boundingBox").hasClass(e.selectedTab))?1:0;return j;}}});},"@VERSION@",{"requires":["widget","widget-parent","widget-child","tabview-base","node-pluginhost","node-focusmanager"],"skinnable":true});