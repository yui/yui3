YUI.add("get",function(A){(function(){var C=A.UA,B=A.Lang,E="text/javascript",F="text/css",D="stylesheet";A.Get=function(){var M={},K=0,U=false,W=function(a,X,b){var Y=b||A.config.win,c=Y.document,e=c.createElement(a),Z;for(Z in X){if(X[Z]&&X.hasOwnProperty(Z)){e.setAttribute(Z,X[Z]);}}return e;},T=function(Y,Z,X){var a={id:A.guid(),type:F,rel:D,href:Y};if(X){A.mix(a,X);}return W("link",a,Z);},S=function(Y,Z,X){var a={id:A.guid(),type:E,src:Y};if(X){A.mix(a,X);}return W("script",a,Z);},N=function(f){var b=M[f],e,X,c,a,Z,Y;if(b){e=b.nodes;X=e.length;c=b.win.document;a=c.getElementsByTagName("head")[0];if(b.insertBefore){Z=L(b.insertBefore,f);if(Z){a=Z.parentNode;}}for(Y=0;Y<X;Y=Y+1){a.removeChild(e[Y]);}}b.nodes=[];},P=function(Y,Z,X){return{tId:Y.tId,win:Y.win,data:Y.data,nodes:Y.nodes,msg:Z,statusText:X,purge:function(){N(this.tId);}};},O=function(b,a,X){var Y=M[b],Z;if(Y&&Y.onEnd){Z=Y.context||Y;Y.onEnd.call(Z,P(Y,a,X));}},V=function(a,Z){var X=M[a],Y;if(X.timer){clearTimeout(X.timer);}if(X.onFailure){Y=X.context||X;X.onFailure.call(Y,P(X,Z));}O(a,Z,"failure");},L=function(X,a){var Y=M[a],Z=(B.isString(X))?Y.win.document.getElementById(X):X;if(!Z){V(a,"target node not found: "+X);}return Z;},I=function(a){var X=M[a],Z,Y;if(X.timer){clearTimeout(X.timer);}X.finished=true;if(X.aborted){Z="transaction "+a+" was aborted";V(a,Z);return;}if(X.onSuccess){Y=X.context||X;X.onSuccess.call(Y,P(X));}O(a,Z,"OK");},Q=function(Z){var X=M[Z],Y;if(X.onTimeout){Y=X.context||X;X.onTimeout.call(Y,P(X));}O(Z,"timeout","timeout");},H=function(Z,c){var Y=M[Z],b,g,f,e,a,X,i;if(Y.timer){clearTimeout(Y.timer);}if(Y.aborted){b="transaction "+Z+" was aborted";V(Z,b);return;}if(c){Y.url.shift();if(Y.varName){Y.varName.shift();}}else{Y.url=(B.isString(Y.url))?[Y.url]:Y.url;if(Y.varName){Y.varName=(B.isString(Y.varName))?[Y.varName]:Y.varName;}}g=Y.win;f=g.document;e=f.getElementsByTagName("head")[0];if(Y.url.length===0){I(Z);return;}X=Y.url[0];if(!X){Y.url.shift();return H(Z);}if(Y.timeout){Y.timer=setTimeout(function(){Q(Z);},Y.timeout);}if(Y.type==="script"){a=S(X,g,Y.attributes);}else{a=T(X,g,Y.attributes);}J(Y.type,a,Z,X,g,Y.url.length);Y.nodes.push(a);if(Y.insertBefore){i=L(Y.insertBefore,Z);if(i){i.parentNode.insertBefore(a,i);}}else{e.appendChild(a);}if((C.webkit||C.gecko)&&Y.type==="css"){H(Z,X);}},G=function(){if(U){return;}U=true;var X,Y;for(X in M){if(M.hasOwnProperty(X)){Y=M[X];if(Y.autopurge&&Y.finished){N(Y.tId);delete M[X];}}}U=false;},R=function(Y,X,Z){Z=Z||{};var c="q"+(K++),a,b=Z.purgethreshold||A.Get.PURGE_THRESH;if(K%b===0){G();}M[c]=A.merge(Z,{tId:c,type:Y,url:X,finished:false,nodes:[]});a=M[c];a.win=a.win||A.config.win;a.context=a.context||a;a.autopurge=("autopurge" in a)?a.autopurge:(Y==="script")?true:false;if(Z.charset){a.attributes=a.attributes||{};a.attributes.charset=Z.charset;}setTimeout(function(){H(c);},0);return{tId:c};},J=function(Z,e,d,Y,c,b,X){var a=X||H;if(C.ie){e.onreadystatechange=function(){var f=this.readyState;if("loaded"===f||"complete"===f){e.onreadystatechange=null;a(d,Y);}};}else{if(C.webkit){if(Z==="script"){e.addEventListener("load",function(){a(d,Y);});}}else{e.onload=function(){a(d,Y);};e.onerror=function(f){V(d,f+": "+Y);};}}};return{PURGE_THRESH:20,_finalize:function(X){setTimeout(function(){I(X);},0);},abort:function(Y){var Z=(B.isString(Y))?Y:Y.tId,X=M[Z];if(X){X.aborted=true;}},script:function(X,Y){return R("script",X,Y);},css:function(X,Y){return R("css",X,Y);}};}();})();},"@VERSION@");