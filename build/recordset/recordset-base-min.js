YUI.add("recordset-base",function(E){var A=E.Base.create("record",E.Base,[],{_setId:function(){return E.guid();},initializer:function(F){},destructor:function(){},getValue:function(F){if(F===undefined){return this.get("data");}else{return this.get("data")[F];}return null;}},{ATTRS:{id:{valueFn:"_setId"},data:{value:null}}});E.Record=A;var B=E.ArrayList,C=E.bind,D=E.Base.create("recordset",E.Base,[],{initializer:function(){this.publish("add",{defaultFn:this._defAddFn});this.publish("remove",{defaultFn:this._defRemoveFn});this.publish("empty",{defaultFn:this._defEmptyFn});this.publish("update",{defaultFn:this._defUpdateFn});this._recordsetChanged();this._syncHashTable();},destructor:function(){},_defAddFn:function(J){var F=this._items.length,I=J.added,G=J.index,H=0;for(;H<I.length;H++){if(G===F){this._items.push(I[H]);}else{this._items.splice(G,0,I[H]);G++;}}},_defRemoveFn:function(F){if(F.index===0){this._items.pop();}else{this._items.splice(F.index,F.range);}},_defEmptyFn:function(F){this._items=[];},_defUpdateFn:function(G){for(var F=0;F<G.updated.length;F++){this._items[G.index+F]=this._changeToRecord(G.updated[F]);}},_defAddHash:function(I){var H=this.get("table"),G=this.get("key"),F=0;for(;F<I.added.length;F++){H[I.added[F].get(G)]=I.added[F];}this.set("table",H);},_defRemoveHash:function(I){var H=this.get("table"),G=this.get("key"),F=0;for(;F<I.removed.length;F++){delete H[I.removed[F].get(G)];}this.set("table",H);},_defUpdateHash:function(I){var H=this.get("table"),G=this.get("key"),F=0;for(;F<I.updated.length;F++){if(I.overwritten[F]){delete H[I.overwritten[F].get(G)];}H[I.updated[F].get(G)]=I.updated[F];}this.set("table",H);},_defEmptyHash:function(){this.set("table",{});},_setHashTable:function(){var I={},H=this.get("key"),G=0,F=this._items.length;for(;G<F;G++){I[this._items[G].get(H)]=this._items[G];}return I;},_changeToRecord:function(G){var F;if(G instanceof E.Record){F=G;}else{F=new E.Record({data:G});}return F;},_recordsetChanged:function(){this.on(["update","add","remove","empty"],function(){this.fire("change",{});});},_syncHashTable:function(){this.after("add",function(F){this._defAddHash(F);});this.after("remove",function(F){this._defRemoveHash(F);});this.after("update",function(F){this._defUpdateHash(F);});this.after("update",function(F){this._defEmptyHash();});},getRecord:function(F){if(E.Lang.isString(F)){return this.get("table")[F];}else{if(E.Lang.isNumber(F)){return this._items[F];}}return null;},getRecordByIndex:function(F){return this._items[F];},getRecordsByIndex:function(H,G){var I=0,F=[];G=(E.Lang.isNumber(G)&&(G>0))?G:1;for(;I<G;I++){F.push(this._items[H+I]);}return F;},getLength:function(){return this.size();},getValuesByKey:function(H){var G=0,F=this._items.length,I=[];for(;G<F;G++){I.push(this._items[G].getValue(H));}return I;},add:function(J,G){var I=[],F,H=0;F=(E.Lang.isNumber(G)&&(G>-1))?G:this._items.length;if(E.Lang.isArray(J)){for(;H<J.length;H++){I[H]=this._changeToRecord(J[H]);}}else{if(E.Lang.isObject(J)){I[0]=this._changeToRecord(J);}}this.fire("add",{added:I,index:F});return this;},remove:function(G,F){var H=[];G=(G>-1)?G:(this.size()-1);F=(F>0)?F:1;H=this._items.slice(G,(G+F));this.fire("remove",{removed:H,range:F,index:G});return this;},empty:function(){this.fire("empty",{});return this;},update:function(I,G){var J,F,H=0;F=(!(E.Lang.isArray(I)))?[I]:I;J=this._items.slice(G,G+F.length);for(;H<F.length;H++){F[H]=this._changeToRecord(F[H]);}this.fire("update",{updated:F,overwritten:J,index:G});return this;}},{ATTRS:{records:{validator:E.Lang.isArray,getter:function(){return E.Array(this._items);},setter:function(H){var G=[];function F(I){var J;if(I instanceof E.Record){G.push(I);}else{J=new E.Record({data:I});G.push(J);}}E.Array.each(H,F);this._items=E.Array(G);},lazyAdd:false},table:{valueFn:"_setHashTable"},key:{value:"id",readOnly:true}}});E.augment(D,B);E.Recordset=D;},"@VERSION@",{requires:["base","record","arraylist"]});