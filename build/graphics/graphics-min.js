YUI.add("graphics",function(b,l){var f="setter",g=b.Plugin.Host,j="value",a="valueFn",k="readOnly",c=b.Lang,e="string",h="writeOnce",i,d;d=function(){var m=this;m._ATTR_E_FACADE={};b.EventTarget.call(this,{emitFacade:true});m._state={};m.prototype=b.mix(d.prototype,m.prototype);};d.prototype={addAttrs:function(n){var r=this,p=this.constructor.ATTRS,m,o,q,s=r._state;for(o in p){if(p.hasOwnProperty(o)){m=p[o];if(m.hasOwnProperty(j)){s[o]=m.value;}else{if(m.hasOwnProperty(a)){q=m.valueFn;if(c.isString(q)){s[o]=r[q].apply(r);}else{s[o]=q.apply(r);}}}}}r._state=s;for(o in p){if(p.hasOwnProperty(o)){m=p[o];if(m.hasOwnProperty(k)&&m.readOnly){continue;}if(m.hasOwnProperty(h)&&m.writeOnce){m.readOnly=true;}if(n&&n.hasOwnProperty(o)){if(m.hasOwnProperty(f)){r._state[o]=m.setter.apply(r,[n[o]]);}else{r._state[o]=n[o];}}}}},get:function(n){var p=this,m,o=p.constructor.ATTRS;if(o&&o[n]){m=o[n].getter;if(m){if(typeof m==e){return p[m].apply(p);}return o[n].getter.apply(p);}return p._state[n];}return null;},set:function(m,o){var n;if(c.isObject(m)){for(n in m){if(m.hasOwnProperty(n)){this._set(n,m[n]);}}}else{this._set.apply(this,arguments);}},_set:function(m,q){var p=this,r,n,o=p.constructor.ATTRS;if(o&&o.hasOwnProperty(m)){r=o[m].setter;if(r){n=[q];if(typeof r==e){q=p[r].apply(p,n);}else{q=o[m].setter.apply(p,n);}}p._state[m]=q;}}};b.mix(d,b.EventTarget,false,null,1);b.AttributeLite=d;i=function(m){var o=this,n=b.Plugin&&b.Plugin.Host;if(o._initPlugins&&n){n.call(o);}o.name=o.constructor.NAME;o._eventPrefix=o.constructor.EVENT_PREFIX||o.constructor.NAME;d.call(o);o.addAttrs(m);o.init.apply(this,arguments);if(o._initPlugins){o._initPlugins(m);}o.initialized=true;};i.NAME="baseGraphic";i.prototype={init:function(){this.publish("init",{fireOnce:true});this.initializer.apply(this,arguments);this.fire("init",{cfg:arguments[0]});},_camelCaseConcat:function(n,m){return n+m.charAt(0).toUpperCase()+m.slice(1);}};b.mix(i,b.AttributeLite,false,null,1);b.mix(i,g,false,null,1);i.prototype.constructor=i;i.plug=g.plug;i.unplug=g.unplug;b.GraphicBase=i;},"@VERSION@",{"requires":["node","event-custom","pluginhost","matrix","classnamemanager"]});