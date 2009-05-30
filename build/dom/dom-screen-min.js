YUI.add("dom-screen",function(E){var N="offsetTop",W="documentElement",M="compatMode",D="offsetLeft",a="offsetParent",P="position",U="fixed",c="relative",O="left",S="top",b="scrollLeft",X="scrollTop",Z="BackCompat",R="medium",Q="height",H="width",F="borderLeftWidth",G="borderTopWidth",C="getBoundingClientRect",B="getComputedStyle",d=/^t(?:able|d|h)$/i;E.mix(E.DOM,{winHeight:function(e){var Y=E.DOM._getWinSize(e)[Q];return Y;},winWidth:function(e){var Y=E.DOM._getWinSize(e)[H];return Y;},docHeight:function(e){var Y=E.DOM._getDocSize(e)[Q];return Math.max(Y,E.DOM._getWinSize(e)[Q]);},docWidth:function(e){var Y=E.DOM._getDocSize(e)[H];return Math.max(Y,E.DOM._getWinSize(e)[H]);},docScrollX:function(Y){var e=E.DOM._getDoc(Y);return Math.max(e[W][b],e.body[b]);},docScrollY:function(Y){var e=E.DOM._getDoc(Y);return Math.max(e[W][X],e.body[X]);},getXY:function(){if(document[W][C]){return function(g){var o=null,h,e,m,i,n;if(g){if(E.DOM.inDoc(g)){h=E.DOM.docScrollX(g);e=E.DOM.docScrollY(g);i=g[C]();n=E.DOM._getDoc(g);o=[i[O],i[S]];if(E.UA.ie){var l=2,k=2,j=n[M],Y=E.DOM[B](n[W],F),f=E.DOM[B](n[W],G);if(E.UA.ie===6){if(j!==Z){l=0;k=0;}}if((j==Z)){if(Y!==R){l=parseInt(Y,10);}if(f!==R){k=parseInt(f,10);}}o[0]-=l;o[1]-=k;}if((e||h)){o[0]+=h;o[1]+=e;}}else{o=E.DOM._getOffset(g);}}return o;};}else{return function(f){var h=null,Y,i,g,e;if(f){if(E.DOM.inDoc(f)){h=[f[D],f[N]];Y=f;i=((E.UA.gecko||E.UA.webkit>519)?true:false);while((Y=Y[a])){h[0]+=Y[D];h[1]+=Y[N];if(i){h=E.DOM._calcBorders(Y,h);}}if(E.DOM.getStyle(f,P)!=U){Y=f;while((Y=Y.parentNode)){g=Y[X];scrollLeft=Y[b];if(E.UA.gecko&&(E.DOM.getStyle(Y,"overflow")!=="visible")){h=E.DOM._calcBorders(Y,h);}if(g||scrollLeft){h[0]-=scrollLeft;h[1]-=g;}}h[0]+=E.DOM.docScrollX(f);h[1]+=E.DOM.docScrollY(f);}else{h[0]+=E.DOM.docScrollX(f);h[1]+=E.DOM.docScrollY(f);}}else{h=E.DOM._getOffset(f);}}return h;};}}(),_getOffset:function(Y){var f,e=null;if(Y){f=E.DOM.getStyle(Y,P);e=[parseInt(E.DOM[B](Y,O),10),parseInt(E.DOM[B](Y,S),10)];if(isNaN(e[0])){e[0]=parseInt(E.DOM.getStyle(Y,O),10);if(isNaN(e[0])){e[0]=(f===c)?0:Y[D]||0;}}if(isNaN(e[1])){e[1]=parseInt(E.DOM.getStyle(Y,S),10);if(isNaN(e[1])){e[1]=(f===c)?0:Y[N]||0;}}}return e;},getX:function(Y){return E.DOM.getXY(Y)[0];},getY:function(Y){return E.DOM.getXY(Y)[1];},setXY:function(e,h,k){var f=E.DOM.setStyle,j,i,Y,g;if(e&&h){j=E.DOM.getStyle(e,P);i=E.DOM._getOffset(e);if(j=="static"){j=c;f(e,P,j);}g=E.DOM.getXY(e);if(h[0]!==null){f(e,O,h[0]-g[0]+i[0]+"px");}if(h[1]!==null){f(e,S,h[1]-g[1]+i[1]+"px");}if(!k){Y=E.DOM.getXY(e);if(Y[0]!==h[0]||Y[1]!==h[1]){E.DOM.setXY(e,h,true);}}}else{}},setX:function(e,Y){return E.DOM.setXY(e,[Y,null]);},setY:function(Y,e){return E.DOM.setXY(Y,[null,e]);},_calcBorders:function(f,g){var e=parseInt(E.DOM[B](f,G),10)||0,Y=parseInt(E.DOM[B](f,F),10)||0;if(E.UA.gecko){if(d.test(f.tagName)){e=0;Y=0;}}g[0]+=Y;g[1]+=e;return g;},_getWinSize:function(g){var j=E.DOM._getDoc(),i=j.defaultView||j.parentWindow,k=j[M],f=i.innerHeight,e=i.innerWidth,Y=j[W];if(k&&!E.UA.opera){if(k!="CSS1Compat"){Y=j.body;}f=Y.clientHeight;e=Y.clientWidth;}return{height:f,width:e};},_getDocSize:function(e){var f=E.DOM._getDoc(),Y=f[W];if(f[M]!="CSS1Compat"){Y=f.body;}return{height:Y.scrollHeight,width:Y.scrollWidth};}});var J="offsetWidth",A="offsetHeight",S="top",K="right",I="bottom",O="left",T="tagName";var L=function(g,f){var i=Math.max(g[S],f[S]),j=Math.min(g[K],f[K]),Y=Math.min(g[I],f[I]),e=Math.max(g[O],f[O]),h={};h[S]=i;h[K]=j;h[I]=Y;h[O]=e;return h;};var V=V||E.DOM;E.mix(V,{region:function(e){var f=V.getXY(e),Y=false;if(e&&f){Y=V._getRegion(f[1],f[0]+e[J],f[1]+e[A],f[0]);}return Y;},intersect:function(f,Y,h){var e=h||V.region(f),g={};var j=Y;if(j[T]){g=V.region(j);}else{if(E.Lang.isObject(Y)){g=Y;}else{return false;}}var i=L(g,e);return{top:i[S],right:i[K],bottom:i[I],left:i[O],area:((i[I]-i[S])*(i[K]-i[O])),yoff:((i[I]-i[S])),xoff:(i[K]-i[O]),inRegion:V.inRegion(f,Y,false,h)};},inRegion:function(g,Y,e,i){var h={},f=i||V.region(g);var k=Y;if(k[T]){h=V.region(k);}else{if(E.Lang.isObject(Y)){h=Y;}else{return false;}}if(e){return(f[O]>=h[O]&&f[K]<=h[K]&&f[S]>=h[S]&&f[I]<=h[I]);}else{var j=L(h,f);if(j[I]>=j[S]&&j[K]>=j[O]){return true;}else{return false;}}},inViewportRegion:function(e,Y,f){return V.inRegion(e,V.viewportRegion(e),Y,f);},_getRegion:function(f,g,Y,e){var h={};h[S]=h[1]=f;h[O]=h[0]=e;h[I]=Y;h[K]=g;h.width=h[K]-h[O];h.height=h[I]-h[S];return h;},viewportRegion:function(e){e=e||E.config.doc.documentElement;var Y=false,g,f;if(e){g=V.docScrollX(e);f=V.docScrollY(e);Y=V._getRegion(f,V.winWidth(e)+g,f+V.winHeight(e),g);}return Y;}});},"@VERSION@",{requires:["dom-base","dom-style"],skinnable:false});