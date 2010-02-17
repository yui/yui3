YUI.add("io-base",function(D){var d="io:start",P="io:complete",B="io:success",F="io:failure",e="io:end",X=0,O={"X-Requested-With":"XMLHttpRequest"},Z={},K=D.config.win;function b(h,p,k){var l,g,n,j,Y,u;p=D.Object(p);g=W(p.xdr||p.form,k);j=p.method?p.method=p.method.toUpperCase():p.method="GET";u=p.sync;if(D.Lang.isObject(p.data)){p.data=D.QueryString.stringify(p.data);}if(p.form){if(p.form.upload){return D.io._upload(g,h,p);}else{l=D.io._serialize(p.form,p.data);if(j==="POST"||j==="PUT"){p.data=l;p.headers=D.merge({"Content-Type":"application/x-www-form-urlencoded"},p.headers);}else{if(j==="GET"){h=R(h,l);}}}}else{if(p.data&&j==="GET"){h=R(h,p.data);}}if(p.xdr){if(p.xdr.use==="native"&&window.XDomainRequest||p.xdr.use==="flash"){return D.io.xdr(h,g,p);}}if(!u){g.c.onreadystatechange=function(){c(g,p);};}try{g.c.open(j,h,u?false:true);if(p.xdr&&p.xdr.credentials){g.c.withCredentials=true;}}catch(t){if(p.xdr){return A(g,h,p);}}if(p.data&&j==="POST"){p.headers=D.merge({"Content-Type":"application/x-www-form-urlencoded; charset=UTF-8"},p.headers);}C(g.c,p.headers||{});T(g.id,p);try{g.c.send(p.data||"");if(u){n=g.c;Y=p.arguments?{id:g.id,arguments:p.arguments}:{id:g.id};Y=D.mix(Y,n,false,["status","statusText","responseText","responseXML"]);Y.getAllResponseHeaders=function(){return n.getAllResponseHeaders();};Y.getResponseHeader=function(f){return n.getResponseHeader(f);};G(g,p);a(g,p);return Y;}}catch(q){if(p.xdr){return A(g,h,p);}}if(p.timeout){S(g,p.timeout);}return{id:g.id,abort:function(){return g.c?N(g,"abort"):false;},isInProgress:function(){return g.c?g.c.readyState!==4&&g.c.readyState!==0:false;}};}function Q(h,i){var g=new D.EventTarget().publish("transaction:"+h),Y=i.arguments,f=i.context||D;Y?g.on(i.on[h],f,Y):g.on(i.on[h],f);return g;}function T(g,f){var Y=f.arguments;f.on=f.on||{};Y?D.fire(d,g,Y):D.fire(d,g);if(f.on.start){Q("start",f).fire(g);}}function G(g,h){var f=g.status?{status:0,statusText:g.status}:g.c,Y=h.arguments;h.on=h.on||{};Y?D.fire(P,g.id,f,Y):D.fire(P,g.id,f);if(h.on.complete){Q("complete",h).fire(g.id,f);}}function U(f,g){var Y=g.arguments;g.on=g.on||{};Y?D.fire(B,f.id,f.c,Y):D.fire(B,f.id,f.c);if(g.on.success){Q("success",g).fire(f.id,f.c);}J(f,g);}function I(g,h){var f=g.status?{status:0,statusText:g.status}:g.c,Y=h.arguments;h.on=h.on||{};Y?D.fire(F,g.id,f,Y):D.fire(F,g.id,f);if(h.on.failure){Q("failure",h).fire(g.id,f);}J(g,h);}function J(f,g){var Y=g.arguments;g.on=g.on||{};Y?D.fire(e,f.id,Y):D.fire(e,f.id);if(g.on.end){Q("end",g).fire(f.id);}H(f,g.xdr?true:false);}function N(f,Y){if(f&&f.c){f.status=Y;f.c.abort();}}function A(f,Y,h){var g=parseInt(f.id);H(f);h.xdr.use="flash";return D.io(Y,h,g);}function E(){var Y=X;X++;return Y;}function W(g,Y){var f={};f.id=D.Lang.isNumber(Y)?Y:E();g=g||{};if(!g.use&&!g.upload){f.c=L();}else{if(g.use){if(g.use==="flash"){f.c=D.io._transport[g.use];}else{if(g.use==="native"&&window.XDomainRequest){f.c=new XDomainRequest();}else{f.c=L();}}}else{f.c={};}}return f;}function L(){return K.XMLHttpRequest?new XMLHttpRequest():new ActiveXObject("Microsoft.XMLHTTP");}function R(Y,f){Y+=((Y.indexOf("?")==-1)?"?":"&")+f;return Y;}function V(Y,f){if(f){O[Y]=f;}else{delete O[Y];}}function C(g,Y){var f;for(f in O){if(O.hasOwnProperty(f)){if(Y[f]){break;}else{Y[f]=O[f];}}}for(f in Y){if(Y.hasOwnProperty(f)){g.setRequestHeader(f,Y[f]);}}}function S(f,Y){Z[f.id]=K.setTimeout(function(){N(f,"timeout");},Y);}function M(Y){K.clearTimeout(Z[Y]);delete Z[Y];}function c(Y,f){if(Y.c.readyState===4){if(f.timeout){M(Y.id);}K.setTimeout(function(){G(Y,f);a(Y,f);},0);}}function a(g,h){var Y;try{if(g.c.status&&g.c.status!==0){Y=g.c.status;}else{Y=0;}}catch(f){Y=0;}if(Y>=200&&Y<300||Y===1223){U(g,h);}else{I(g,h);}}function H(f,Y){if(K.XMLHttpRequest&&!Y){if(f.c){f.c.onreadystatechange=null;}}f.c=null;f=null;}b.start=T;b.complete=G;b.success=U;b.failure=I;b.end=J;b._id=E;b._timeout=Z;b.header=V;D.io=b;D.io.http=b;},"@VERSION@",{requires:["event-custom-base"]});