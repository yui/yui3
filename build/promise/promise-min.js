YUI.add("promise",function(e,t){function n(e){if(!(this instanceof n))return new n(e);var t=new n.Resolver(this);this._resolver=t,e.call(this,function(e){t.fulfill(e)},function(e){t.reject(e)})}function r(e){this._callbacks=[],this._errbacks=[],this.promise=e,this._status="pending"}e.mix(n.prototype,{then:function(e,t){return this._resolver.then(e,t)},getStatus:function(){return this._resolver.getStatus()}}),n.isPromise=function(e){return!!e&&typeof e.then=="function"},e.Promise=n,e.mix(r.prototype,{fulfill:function(e){this._status==="pending"&&(this._result=e),this._status!=="rejected"&&(this._notify(this._callbacks,this._result),this._callbacks=[],this._errbacks=null,this._status="fulfilled")},reject:function(e){this._status==="pending"&&(this._result=e),this._status!=="fulfilled"&&(this._notify(this._errbacks,this._result),this._callbacks=null,this._errbacks=[],this._status="rejected")},then:function(e,t){var n=this.promise,r,i,s=new n.constructor(function(e,t){r=e,i=t}),o=this._callbacks||[],u=this._errbacks||[];return o.push(typeof e=="function"?this._wrap(r,i,e):r),u.push(typeof t=="function"?this._wrap(r,i,t):i),this._status==="fulfilled"?this.fulfill(this._result):this._status==="rejected"&&this.reject(this._result),s},_wrap:function(t,r,i){var s=this.promise;return function(){var o=arguments;e.soon(function(){var e;try{e=i.apply(s,o)}catch(u){return r(u)}n.isPromise(e)?e.then(t,r):t(e)})}},getStatus:function(){return this._status},_notify:function(e,t){var n,r;for(n=0,r=e.length;n<r;++n)e[n](t)}},!0),e.Promise.Resolver=r,e.when=function(t,n,r){var i;return e.Promise.isPromise(t)||(i=t,t=new e.Promise(function(e){e(i)})),n||r?t.then(n,r):t};var i=[].slice;e.batch=function(){var t=i.call(arguments),n=t.length,r=0,s=t.length,o=[];return new e.Promise(function(i,u){function f(e){return function(t){o[e]=t,n--,!n&&a.getStatus()!=="rejected"&&i(o)}}var a=this;if(s<1)return i(o);for(;r<s;r++)e.when(t[r],f(r),u)})}},"@VERSION@",{requires:["timers"]});
