YUI.add("scrollview-scrollbars",function(a,k){var n=a.ClassNameManager.getClassName,j,h=a.Transition,l=h.useNative,B="scrollbar",E="scrollview",D="verticalNode",o="horizontalNode",w="childCache",y="top",s="left",g="width",x="height",r="scrollWidth",i="scrollHeight",C="_sbh",v="_sbv",p=h._VENDOR_PREFIX+"TransitionProperty",f="transform",e="translateX(",d="translateY(",A="scaleX(",z="scaleY(",u="scrollX",t="scrollY",m="px",c=")",q=m+c;function b(){b.superclass.constructor.apply(this,arguments);}b.CLASS_NAMES={showing:n(E,B,"showing"),scrollbar:n(E,B),scrollbarV:n(E,B,"vert"),scrollbarH:n(E,B,"horiz"),scrollbarVB:n(E,B,"vert","basic"),scrollbarHB:n(E,B,"horiz","basic"),child:n(E,"child"),first:n(E,"first"),middle:n(E,"middle"),last:n(E,"last")};j=b.CLASS_NAMES;b.NAME="pluginScrollViewScrollbars";b.NS="scrollbars";b.SCROLLBAR_TEMPLATE=["<div>",'<span class="'+j.child+" "+j.first+'"></span>','<span class="'+j.child+" "+j.middle+'"></span>','<span class="'+j.child+" "+j.last+'"></span>',"</div>"].join("");b.ATTRS={verticalNode:{setter:"_setNode",valueFn:"_defaultNode"},horizontalNode:{setter:"_setNode",valueFn:"_defaultNode"}};a.namespace("Plugin").ScrollViewScrollbars=a.extend(b,a.Plugin.Base,{initializer:function(){this._host=this.get("host");this.afterHostEvent("scrollEnd",this._hostScrollEnd);this.afterHostMethod("scrollTo",this._update);this.afterHostMethod("_uiDimensionsChange",this._hostDimensionsChange);},_hostDimensionsChange:function(){var G=this._host,F=G.axis;this._renderBar(this.get(D),F.y,"vert");this._renderBar(this.get(o),F.x,"horiz");this._update();a.later(500,this,"flash",true);},_hostScrollEnd:function(F){if(!this._host._flicking){this.flash();}},_renderBar:function(G,I){var H=G.inDoc(),J=this._host._bb,F=G.getData("isHoriz")?j.scrollbarHB:j.scrollbarVB;if(I&&!H){J.append(G);G.toggleClass(F,this._basic);this._setChildCache(G);}else{if(!I&&H){G.remove();this._clearChildCache(G);}}},_setChildCache:function(I){var K=I.get("children"),G=K.item(0),J=K.item(1),H=K.item(2),F=I.getData("isHoriz")?"offsetWidth":"offsetHeight";I.setStyle(p,f);J.setStyle(p,f);H.setStyle(p,f);I.setData(w,{fc:G,lc:H,mc:J,fcSize:G&&G.get(F),lcSize:H&&H.get(F)});},_clearChildCache:function(F){F.clearData(w);},_updateBar:function(F,O,H,Y){var M=this._host,I=this._basic,N=M._cb,T=0,P=1,G=F.getData(w),U=G.lc,X=G.mc,ac=G.fcSize,ab=G.lcSize,Q,Z,W,L,aa,S,J,V,R,K;if(Y){S=g;J=s;V=C;R=M.get("width");K=M._scrollWidth;L=e;aa=A;O=(O!==undefined)?O:M.get(u);}else{S=x;J=y;V=v;R=M.get("height");K=M._scrollHeight;L=d;aa=z;O=(O!==undefined)?O:M.get(t);}T=Math.floor(R*(R/K));P=Math.floor((O/(K-R))*(R-T));if(T>R){T=1;}if(P>(R-T)){T=T-(P-(R-T));}else{if(P<0){T=P+T;P=0;}}Q=(T-(ac+ab));if(Q<0){Q=0;}if(Q===0&&P!==0){P=R-(ac+ab)-1;}if(H!==0){W={duration:H};if(l){W.transform=L+P+q;}else{W[J]=P+m;}F.transition(W);}else{if(l){F.setStyle(f,L+P+q);}else{F.setStyle(J,P+m);}}if(this[V]!==Q){this[V]=Q;if(Q>0){if(H!==0){W={duration:H};if(l){W.transform=aa+Q+c;}else{W[S]=Q+m;}X.transition(W);}else{if(l){X.setStyle(f,aa+Q+c);}else{X.setStyle(S,Q+m);}}if(!Y||!I){Z=T-ab;if(H!==0){W={duration:H};if(l){W.transform=L+Z+q;}else{W[J]=Z;}U.transition(W);}else{if(l){U.setStyle(f,L+Z+q);}else{U.setStyle(J,Z+m);}}}}}},_update:function(G,M,K,L){var J=this.get(D),F=this.get(o),I=this._host,H=I.axis;K=(K||0)/1000;if(!this._showing){this.show();}if(H.y&&J){this._updateBar(J,M,K,false);}if(H.x&&F){this._updateBar(F,G,K,true);}},show:function(F){this._show(true,F);},hide:function(F){this._show(false,F);},_show:function(F,I){var H=this.get(D),J=this.get(o),K=(I)?0.6:0,G=(F)?1:0,L;this._showing=F;if(this._flashTimer){this._flashTimer.cancel();}L={duration:K,opacity:G};if(H){H.transition(L);}if(J){J.transition(L);}},flash:function(){var F=this._host;this.show(true);this._flashTimer=a.later(800,this,"hide",true);},_setNode:function(G,F){var H=(F===o);G=a.one(G);if(G){G.addClass(j.scrollbar);G.addClass((H)?j.scrollbarH:j.scrollbarV);G.setData("isHoriz",H);}return G;},_defaultNode:function(){return a.Node.create(b.SCROLLBAR_TEMPLATE);},_basic:a.UA.ie&&a.UA.ie<=8});},"@VERSION@",{"requires":["classnamemanager","transition","plugin"],"skinnable":true});