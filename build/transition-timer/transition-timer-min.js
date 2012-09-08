YUI.add("transition-timer",function(c,b){var a=c.Transition;c.mix(a.prototype,{_start:function(){if(a.useNative){this._runNative();}else{this._runTimer();}},_runTimer:function(){var d=this;d._initAttrs();a._running[c.stamp(d)]=d;d._startTime=new Date();a._startTimer();},_endTimer:function(){var d=this;delete a._running[c.stamp(d)];d._startTime=null;},_runFrame:function(){var d=new Date()-this._startTime;this._runAttrs(d);},_runAttrs:function(f){var p=this,o=p._node,v=p._config,g=c.stamp(o),n=a._nodeAttrs[g],j=a.behaviors,m=false,h=false,w,x,k,r,e,u,s,l,q;for(x in n){if((k=n[x])&&k.transition===p){s=k.duration;u=k.delay;e=(f-u)/1000;l=f;w={type:"propertyEnd",propertyName:x,config:v,elapsedTime:e};r=(q in j&&"set" in j[q])?j[q].set:a.DEFAULT_SETTER;m=(l>=s);if(l>s){l=s;}if(!u||f>=u){r(p,x,k.from,k.to,l-u,s-u,k.easing,k.unit);if(m){delete n[x];p._count--;if(v[x]&&v[x].on&&v[x].on.end){v[x].on.end.call(c.one(o),w);}if(!h&&p._count<=0){h=true;p._end(e);p._endTimer();}}}}}},_initAttrs:function(){var k=this,f=a.behaviors,m=c.stamp(k._node),r=a._nodeAttrs[m],e,j,l,o,h,d,n,p,q,g,i;for(d in r){if((e=r[d])&&e.transition===k){j=e.duration*1000;l=e.delay*1000;o=e.easing;h=e.value;if(d in k._node.style||d in c.DOM.CUSTOM_STYLES){g=(d in f&&"get" in f[d])?f[d].get(k,d):a.DEFAULT_GETTER(k,d);p=a.RE_UNITS.exec(g);n=a.RE_UNITS.exec(h);g=p?p[1]:g;i=n?n[1]:h;q=n?n[2]:p?p[2]:"";if(!q&&a.RE_DEFAULT_UNIT.test(d)){q=a.DEFAULT_UNIT;}if(typeof o==="string"){if(o.indexOf("cubic-bezier")>-1){o=o.substring(13,o.length-1).split(",");}else{if(a.easings[o]){o=a.easings[o];}}}e.from=Number(g);e.to=Number(i);e.unit=q;e.easing=o;e.duration=j+l;e.delay=l;}else{delete r[d];k._count--;}}}},destroy:function(){this.detachAll();this._node=null;}},true);c.mix(c.Transition,{_runtimeAttrs:{},RE_DEFAULT_UNIT:/^width|height|top|right|bottom|left|margin.*|padding.*|border.*$/i,DEFAULT_UNIT:"px",intervalTime:20,behaviors:{left:{get:function(e,d){return c.DOM._getAttrOffset(e._node,d);}}},DEFAULT_SETTER:function(g,h,j,k,m,f,i,l){j=Number(j);k=Number(k);var e=g._node,d=a.cubicBezier(i,m/f);d=j+d[0]*(k-j);if(e){if(h in e.style||h in c.DOM.CUSTOM_STYLES){l=l||"";c.DOM.setStyle(e,h,d+l);}}else{g._end();}},DEFAULT_GETTER:function(f,d){var e=f._node,g="";if(d in e.style||d in c.DOM.CUSTOM_STYLES){g=c.DOM.getComputedStyle(e,d);}return g;},_startTimer:function(){if(!a._timer){a._timer=setInterval(a._runFrame,a.intervalTime);}},_stopTimer:function(){clearInterval(a._timer);a._timer=null;},_runFrame:function(){var d=true,e;for(e in a._running){if(a._running[e]._runFrame){d=false;a._running[e]._runFrame();}}if(d){a._stopTimer();}},cubicBezier:function(u,n){var I=0,g=0,z=u[0],f=u[1],w=u[2],e=u[3],v=1,d=0,s=v-3*w+3*z-I,r=3*w-6*z+3*I,q=3*z-3*I,o=I,m=d-3*e+3*f-g,l=3*e-6*f+3*g,k=3*f-3*g,j=g,i=(((s*n)+r)*n+q)*n+o,h=(((m*n)+l)*n+k)*n+j;return[i,h];},easings:{ease:[0.25,0,1,0.25],linear:[0,0,1,1],"ease-in":[0.42,0,1,1],"ease-out":[0,0,0.58,1],"ease-in-out":[0.42,0,0.58,1]},_running:{},_timer:null,RE_UNITS:/^(-?\d*\.?\d*){1}(em|ex|px|in|cm|mm|pt|pc|%)*$/},true);a.behaviors.top=a.behaviors.bottom=a.behaviors.right=a.behaviors.left;c.Transition=a;},"@VERSION@",{"requires":["transition"]});