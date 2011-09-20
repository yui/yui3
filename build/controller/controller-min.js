YUI.add("controller",function(a){var h=a.HistoryHash,e=a.Lang,b=a.QueryString,j=a.Array,f=a.HistoryBase.html5&&(!a.UA.android||a.UA.android>=3),g=a.config.win,k=g.location,i=[],d="ready";function c(){c.superclass.constructor.apply(this,arguments);}a.Controller=a.extend(c,a.Base,{html5:f,root:"",routes:[],_regexPathParam:/([:*])([\w-]+)/g,_regexUrlQuery:/\?([^#]*).*$/,_regexUrlStrip:/^https?:\/\/[^\/]*/i,initializer:function(m){var l=this;m||(m={});m.routes&&(l.routes=m.routes);e.isValue(m.root)&&(l.root=m.root);l._routes=[];j.each(l.routes,function(n){l.route(n.path,n.callback);});if(f){l._history=new a.HistoryHTML5({force:true});l._history.after("change",l._afterHistoryChange,l);}else{a.on("hashchange",l._afterHistoryChange,g,l);}l.publish(d,{defaultFn:l._defReadyFn,fireOnce:true,preventable:false});l.once("initializedChange",function(){a.once("load",function(){setTimeout(function(){l.fire(d,{dispatched:!!l._dispatched});},20);});});},destructor:function(){if(f){this._history.detachAll();}else{a.detach("hashchange",this._afterHistoryChange,g);}},dispatch:function(){this.once(d,function(){this._ready=true;if(f&&this.upgrade()){return;}else{this._dispatch(this._getPath());}});return this;},getPath:function(){return this._getPath();},hasRoute:function(l){return !!this.match(l).length;},match:function(l){return j.filter(this._routes,function(m){return l.search(m.regex)>-1;});},removeRoot:function(m){var l=this.root;m=m.replace(this._regexUrlStrip,"");if(l&&m.indexOf(l)===0){m=m.substring(l.length);}return m.charAt(0)==="/"?m:"/"+m;},replace:function(l){return this._queue(l,true);},route:function(m,n){var l=[];this._routes.push({callback:n,keys:l,path:m,regex:this._getRegex(m,l)});return this;},save:function(l){return this._queue(l);},upgrade:f?function(){var l=this._getHashPath();if(l&&l.charAt(0)==="/"){this.once(d,function(){this.replace(l);});return true;}return false;}:function(){return false;},_decode:function(l){return decodeURIComponent(l.replace(/\+/g," "));},_dequeue:function(){var l=this,m;if(!YUI.Env.windowLoaded){a.once("load",function(){l._dequeue();});return this;}m=i.shift();return m?m():this;},_dispatch:function(o){var m=this,l=m.match(o),n;m._dispatching=m._dispatched=true;if(!l||!l.length){return m;}n=m._getRequest(o);n.next=function(q){var s,r,p;if(q){a.error(q);}else{if((p=l.shift())){r=p.regex.exec(o);s=typeof p.callback==="string"?m[p.callback]:p.callback;if(r.length===p.keys.length+1){n.params=j.hash(p.keys,r.slice(1));}else{n.params=r.concat();}s.call(m,n,n.next);}}};n.next();m._dispatching=false;return m._dequeue();},_getHashPath:function(){return h.getHash().replace(this._regexUrlQuery,"");},_getPath:f?function(){return this.removeRoot(k.pathname);}:function(){return this._getHashPath()||this.removeRoot(k.pathname);},_getQuery:f?function(){return k.search.substring(1);}:function(){var m=h.getHash(),l=m.match(this._regexUrlQuery);return m&&l?l[1]:k.search.substring(1);},_getRegex:function(m,l){if(m instanceof RegExp){return m;}m=m.replace(this._regexPathParam,function(o,n,p){l.push(p);return n==="*"?"(.*?)":"([^/]*)";});return new RegExp("^"+m+"$");},_getRequest:function(l){return{path:l,query:this._parseQuery(this._getQuery())};},_joinURL:function(m){var l=this.root;if(m.charAt(0)==="/"){m=m.substring(1);}return l&&l.charAt(l.length-1)==="/"?l+m:l+"/"+m;},_parseQuery:b&&b.parse?b.parse:function(o){var p=this._decode,r=o.split("&"),n=0,m=r.length,l={},q;for(;n<m;++n){q=r[n].split("=");if(q[0]){l[p(q[0])]=p(q[1]||"");}}return l;},_queue:function(){var m=arguments,l=this;i.push(function(){if(f){if(a.UA.ios&&a.UA.ios<5){l._save.apply(l,m);}else{setTimeout(function(){l._save.apply(l,m);},1);}}else{l._dispatching=true;l._save.apply(l,m);}return l;});return !this._dispatching?this._dequeue():this;},_save:f?function(l,m){this._ready=true;this._history[m?"replace":"add"](null,{url:typeof l==="string"?this._joinURL(l):l});return this;}:function(l,m){this._ready=true;if(typeof l==="string"&&l.charAt(0)!=="/"){l="/"+l;}h[m?"replaceHash":"setHash"](l);return this;},_afterHistoryChange:function(m){var l=this;if(l._ready){l._dispatch(l._getPath());}},_defReadyFn:function(l){this._ready=true;}},{NAME:"controller"});},"@VERSION@",{optional:["querystring-parse"],requires:["array-extras","base-build","history"]});