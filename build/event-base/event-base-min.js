YUI.add("event-base",function(e,t){e.publish("domready",{fireOnce:!0,async:!0}),YUI.Env.DOMReady?e.fire("domready"):e.Do.before(function(){e.fire("domready")},YUI.Env,"_ready");var n=e.UA,r={},i={63232:38,63233:40,63234:37,63235:39,63276:33,63277:34,25:9,63272:46,63273:36,63275:35},s=function(t){if(!t)return t;try{t&&3==t.nodeType&&(t=t.parentNode)}catch(n){return null}return e.one(t)},o=function(e,t,n){this._event=e,this._currentTarget=t,this._wrapper=n||r,this.init()};e.extend(o,Object,{init:function(){var e=this._event,t=this._wrapper.overrides,r=e.pageX,o=e.pageY,u,a=this._currentTarget;this.altKey=e.altKey,this.ctrlKey=e.ctrlKey,this.metaKey=e.metaKey,this.shiftKey=e.shiftKey,this.type=t&&t.type||e.type,this.clientX=e.clientX,this.clientY=e.clientY,this.pageX=r,this.pageY=o,u=e.keyCode||e.charCode,n.webkit&&u in i&&(u=i[u]),this.keyCode=u,this.charCode=u,this.which=e.which||e.charCode||u,this.button=this.which,this.target=s(e.target),this.currentTarget=s(a),this.relatedTarget=s(e.relatedTarget);if(e.type=="mousewheel"||e.type=="DOMMouseScroll")this.wheelDelta=e.detail?e.detail*-1:Math.round(e.wheelDelta/80)||(e.wheelDelta<0?-1:1);this._touch&&this._touch(e,a,this._wrapper)},stopPropagation:function(){this._event.stopPropagation(),this._wrapper.stopped=1,this.stopped=1},stopImmediatePropagation:function(){var e=this._event;e.stopImmediatePropagation?e.stopImmediatePropagation():this.stopPropagation(),this._wrapper.stopped=2,this.stopped=2},preventDefault:function(e){var t=this._event;t.preventDefault(),t.type==="beforeunload"&&(t.returnValue=e||!1),this._wrapper.prevented=1,this.prevented=1},halt:function(e){e?this.stopImmediatePropagation():this.stopPropagation(),this.preventDefault()}}),o.resolve=s,e.DOM2EventFacade=o,e.DOMEventFacade=o,function(){e.Env.evt.dom_wrappers={},e.Env.evt.dom_map={};var t=e.Env.evt,n=e.config,r=n.win,i=YUI.Env.add,s=YUI.Env.remove,o=function(){YUI.Env.windowLoaded=!0,e.Event._load(),s(r,"load",o)},u=function(){e.Event._unload()},a="domready",f="~yui|2|compat~",l=function(t){try{return t&&typeof t!="string"&&e.Lang.isNumber(t.length)&&!t.tagName&&!e.DOM.isWindow(t)}catch(n){return!1}},c=e.CustomEvent.prototype._delete,h=function(t){var n=c.apply(this,arguments);return this.hasSubs()||e.Event._clean(this),n},p=function(){var n=!1,o=0,c=[],d=t.dom_wrappers,v=null,m=t.dom_map;return{POLL_RETRYS:1e3,POLL_INTERVAL:40,lastError:null,_interval:null,_dri:null,DOMReady:!1,startInterval:function(){p._interval||(p._interval=setInterval(p._poll,p.POLL_INTERVAL))},onAvailable:function(t,n,r,i,s,u){var a=e.Array(t),f,l;for(f=0;f<a.length;f+=1)c.push({id:a[f],fn:n,obj:r,override:i,checkReady:s,compat:u});return o=this.POLL_RETRYS,setTimeout(p._poll,0),l=new e.EventHandle({_delete:function(){if(l.handle){l.handle.detach();return}var e,t;for(e=0;e<a.length;e++)for(t=0;t<c.length;t++)a[e]===c[t].id&&c.splice(t,1)}}),l},onContentReady:function(e,t,n,r,i){return p.onAvailable(e,t,n,r,!0,i)},attach:function(t,n,r,i){return p._attach(e.Array(arguments,0,!0))},_createWrapper:function(t,n,s,o,u){var a,f=e.stamp(t),l="event:"+f+n;return!1===u&&(l+="native"),s&&(l+="capture"),a=d[l],a||(a=e.publish(l,{silent:!0,bubbles:!1,emitFacade:!1,contextFn:function(){return o?a.el:(a.nodeRef=a.nodeRef||e.one(a.el),a.nodeRef)}}),a.overrides={},a.el=t,a.key=l,a.domkey=f,a.type=n,a.fn=function(e){a.fire(p.getEvent(e,t,o||!1===u))},a.capture=s,t==r&&n=="load"&&(a.fireOnce=!0,v=l),a._delete=h,d[l]=a,m[f]=m[f]||{},m[f][l]=a,i(t,n,a.fn,s)),a},_attach:function(t,n){var i,s,o,u,a,c=!1,h,d=t[0],v=t[1],m=t[2]||r,g=n&&n.facade,y=n&&n.capture,b=n&&n.overrides;t[t.length-1]===f&&(i=!0);if(!v||!v.call)return!1;if(l(m))return s=[],e.each(m,function(e,r){t[2]=e,s.push(p._attach(t.slice(),n))}),new e.EventHandle(s);if(e.Lang.isString(m)){if(i)o=e.DOM.byId(m);else{o=e.Selector.query(m);switch(o.length){case 0:o=null;break;case 1:o=o[0];break;default:return t[2]=o,p._attach(t,n)}}if(!o)return h=p.onAvailable(m,function(){h.handle=p._attach(t,n)},p,!0,!1,i),h;m=o}return m?(e.Node&&e.instanceOf(m,e.Node)&&(m=e.Node.getDOMNode(m)),u=p._createWrapper(m,d,y,i,g),b&&e.mix(u.overrides,b),m==r&&d=="load"&&YUI.Env.windowLoaded&&(c=!0),i&&t.pop(),a=t[3],h=u._on(v,a,t.length>4?t.slice(4):null),c&&u.fire(),h):!1},detach:function(t,n,r,i){var s=e.Array(arguments,0,!0),o,u,a,c,h,v;s[s.length-1]===f&&(o=!0);if(t&&t.detach)return t.detach();typeof r=="string"&&(o?r=e.DOM.byId(r):(r=e.Selector.query(r),u=r.length,u<1?r=null:u==1&&(r=r[0])));if(!r)return!1;if(r.detach)return s.splice(2,1),r.detach.apply(r,s);if(l(r)){a=!0;for(c=0,u=r.length;c<u;++c)s[2]=r[c],a=e.Event.detach.apply(e.Event,s)&&a;return a}return!t||!n||!n.call?p.purgeElement(r,!1,t):(h="event:"+e.stamp(r)+t,v=d[h],v?v.detach(n):!1)},getEvent:function(t,n,i){var s=t||r.event;return i?s:new e.DOMEventFacade(s,n,d["event:"+e.stamp(n)+t.type])},generateId:function(t){return e.DOM.generateID(t)},_isValidCollection:l,_load:function(t){n||(n=!0,e.fire&&e.fire(a),p._poll())},_poll:function(){if(p.locked)return;if(e.UA.ie&&!YUI.Env.DOMReady){p.startInterval();return}p.locked=!0;var t,r,i,s,u,a,f=!n;f||(f=o>0),u=[],a=function(t,n){var r,i=n.override;try{n.compat?(n.override?i===!0?r=n.obj:r=i:r=t,n.fn.call(r,n.obj)):(r=n.obj||e.one(t),n.fn.apply(r,e.Lang.isArray(i)?i:[]))}catch(s){}};for(t=0,r=c.length;t<r;++t)i=c[t],i&&!i.checkReady&&(s=i.compat?e.DOM.byId(i.id):e.Selector.query(i.id,null,!0),s?(a(s,i),c[t]=null):u.push(i));for(t=0,r=c.length;t<r;++t){i=c[t];if(i&&i.checkReady){s=i.compat?e.DOM.byId(i.id):e.Selector.query(i.id,null,!0);if(s){if(n||s.get&&s.get("nextSibling")||s.nextSibling)a(s,i),c[t]=null}else u.push(i)}}o=u.length===0?0:o-1,f?p.startInterval():(clearInterval(p._interval),p._interval=null),p.locked=!1;return},purgeElement:function(t,n,r){var i=e.Lang.isString(t)?e.Selector.query(t,null,!0):t,s=p.getListeners(i,r),o,u,a,f;if(n&&i){s=s||[],a=e.Selector.query("*",i),u=a.length;for(o=0;o<u;++o)f=p.getListeners(a[o],r),f&&(s=s.concat(f))}if(s)for(o=0,u=s.length
;o<u;++o)s[o].detachAll()},_clean:function(t){var n=t.key,r=t.domkey;s(t.el,t.type,t.fn,t.capture),delete d[n],delete e._yuievt.events[n],m[r]&&(delete m[r][n],e.Object.size(m[r])||delete m[r])},getListeners:function(n,r){var i=e.stamp(n,!0),s=m[i],o=[],u=r?"event:"+i+r:null,a=t.plugins;return s?(u?(a[r]&&a[r].eventDef&&(u+="_synth"),s[u]&&o.push(s[u]),u+="native",s[u]&&o.push(s[u])):e.each(s,function(e,t){o.push(e)}),o.length?o:null):null},_unload:function(t){e.each(d,function(e,n){e.type=="unload"&&e.fire(t),e.detachAll()}),s(r,"unload",u)},nativeAdd:i,nativeRemove:s}}();e.Event=p,n.injected||YUI.Env.windowLoaded?o():i(r,"load",o);if(e.UA.ie){e.on(a,p._poll);if(e.UA.ie<7)try{i(r,"unload",u)}catch(d){}}p.Custom=e.CustomEvent,p.Subscriber=e.Subscriber,p.Target=e.EventTarget,p.Handle=e.EventHandle,p.Facade=e.EventFacade,p._poll()}(),e.Env.evt.plugins.available={on:function(t,n,r,i){var s=arguments.length>4?e.Array(arguments,4,!0):null;return e.Event.onAvailable.call(e.Event,r,n,i,s)}},e.Env.evt.plugins.contentready={on:function(t,n,r,i){var s=arguments.length>4?e.Array(arguments,4,!0):null;return e.Event.onContentReady.call(e.Event,r,n,i,s)}}},"@VERSION@",{requires:["event-custom-base"]});
