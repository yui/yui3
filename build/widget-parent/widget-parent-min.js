YUI.add("widget-parent",function(c){var b=c.Lang;function a(d){this.publish("addChild",{defaultTargetOnly:true,defaultFn:this._defAddChildFn});this.publish("removeChild",{defaultTargetOnly:true,defaultFn:this._defRemoveChildFn});this._items=[];var e,f;if(d&&d.children){e=d.children;f=this.after("initializedChange",function(g){this._add(e);f.detach();});}c.after(this._renderChildren,this,"renderUI");c.after(this._bindUIParent,this,"bindUI");this.after("selectionChange",this._afterSelectionChange);this.after("selectedChange",this._afterParentSelectedChange);this.after("activeDescendantChange",this._afterActiveDescendantChange);this._hDestroyChild=this.after("*:destroy",this._afterDestroyChild);this.after("*:focusedChange",this._updateActiveDescendant);}a.ATTRS={defaultChildType:{setter:function(f){var d=c.Attribute.INVALID_VALUE,e=b.isString(f)?c[f]:f;if(b.isFunction(e)){d=e;}return d;}},activeDescendant:{readOnly:true},multiple:{value:false,validator:b.isBoolean,writeOnce:true,getter:function(e){var d=this.get("root");return(d&&d!=this)?d.get("multiple"):e;}},selection:{readOnly:true,setter:"_setSelection",getter:function(e){var d=b.isArray(e)?(new c.ArrayList(e)):e;return d;}},selected:{setter:function(e){var d=e;if(e===1&&!this.get("multiple")){d=c.Attribute.INVALID_VALUE;}return d;}}};a.prototype={destructor:function(){this._destroyChildren();},_afterDestroyChild:function(d){var e=d.target;if(e.get("parent")==this){e.remove();}},_afterSelectionChange:function(f){if(f.target==this&&f.src!=this){var d=f.newVal,e=0;if(d){e=2;if(c.instanceOf(d,c.ArrayList)&&(d.size()===this.size())){e=1;}}this.set("selected",e,{src:this});}},_afterActiveDescendantChange:function(e){var d=this.get("parent");if(d){d._set("activeDescendant",e.newVal);}},_afterParentSelectedChange:function(d){var e=d.newVal;if(this==d.target&&d.src!=this&&(e===0||e===1)){this.each(function(f){f.set("selected",e,{src:this});},this);}},_setSelection:function(f){var e=null,d;if(this.get("multiple")&&!this.isEmpty()){d=[];this.each(function(g){if(g.get("selected")>0){d.push(g);}});if(d.length>0){e=d;}}else{if(f.get("selected")>0){e=f;}}return e;},_updateSelection:function(e){var f=e.target,d;if(f.get("parent")==this){if(e.src!="_updateSelection"){d=this.get("selection");if(!this.get("multiple")&&d&&e.newVal>0){d.set("selected",0,{src:"_updateSelection"});}this._set("selection",f);}if(e.src==this){this._set("selection",f,{src:this});}}},_updateActiveDescendant:function(d){var e=(d.newVal===true)?d.target:null;this._set("activeDescendant",e);},_createChild:function(d){var i=this.get("defaultChildType"),f=d.childType||d.type,h,e,g;if(f){e=b.isString(f)?c[f]:f;}if(b.isFunction(e)){g=e;}else{if(i){g=i;}}if(g){h=new g(d);}else{c.error("Could not create a child instance because its constructor is either undefined or invalid.");}return h;},_defAddChildFn:function(f){var g=f.child,d=f.index,e=this._items;if(g.get("parent")){g.remove();}if(b.isNumber(d)){e.splice(d,0,g);}else{e.push(g);}g._set("parent",this);g.addTarget(this);f.index=g.get("index");g.after("selectedChange",c.bind(this._updateSelection,this));},_defRemoveChildFn:function(f){var g=f.child,d=f.index,e=this._items;if(g.get("focused")){g.set("focused",false);}if(g.get("selected")){g.set("selected",0);}e.splice(d,1);g.removeTarget(this);g._oldParent=g.get("parent");g._set("parent",null);},_add:function(h,d){var e,g,f;if(b.isArray(h)){e=[];c.each(h,function(j,i){g=this._add(j,(d+i));if(g){e.push(g);}},this);if(e.length>0){f=e;}}else{if(c.instanceOf(h,c.Widget)){g=h;}else{g=this._createChild(h);}if(g&&this.fire("addChild",{child:g,index:d})){f=g;}}return f;},add:function(){var e=this._add.apply(this,arguments),d=e?(b.isArray(e)?e:[e]):[];return(new c.ArrayList(d));},remove:function(d){var f=this._items[d],e;if(f&&this.fire("removeChild",{child:f,index:d})){e=f;}return e;},removeAll:function(){var d=[],e;c.each(this._items.concat(),function(){e=this.remove(0);if(e){d.push(e);}},this);return(new c.ArrayList(d));},selectChild:function(d){this.item(d).set("selected",1);},selectAll:function(){this.set("selected",1);},deselectAll:function(){this.set("selected",0);},_uiAddChild:function(i,d){i.render(d);var g=i.get("boundingBox"),f,h=i.next(false),e;if(h){f=h.get("boundingBox");f.insert(g,"before");}else{e=i.previous(false);if(e){f=e.get("boundingBox");f.insert(g,"after");}}},_uiRemoveChild:function(d){d.get("boundingBox").remove();},_afterAddChild:function(d){var e=d.child;if(e.get("parent")==this){this._uiAddChild(e,this._childrenContainer);}},_afterRemoveChild:function(d){var e=d.child;if(e._oldParent==this){this._uiRemoveChild(e);}},_bindUIParent:function(){this.after("addChild",this._afterAddChild);this.after("removeChild",this._afterRemoveChild);},_renderChildren:function(){var d=this._childrenContainer||this.get("contentBox");this._childrenContainer=d;this.each(function(e){e.render(d);});},_destroyChildren:function(){this._hDestroyChild.detach();this.each(function(d){d.destroy();});}};c.augment(a,c.ArrayList);c.WidgetParent=a;},"@VERSION@",{requires:["base-build","arraylist","widget"]});