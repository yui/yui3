YUI.add("scrollview-base",function(C){var E=C.ClassNameManager.getClassName,K="scrollview",H=10,B=150,I={scrollbar:E(K,"scrollbar"),vertical:E(K,"vertical"),horizontal:E(K,"horizontal"),child:E(K,"child"),b:E(K,"b"),middle:E(K,"middle"),showing:E(K,"showing")},A="scrollStart",G="scrollChange",L="scrollEnd",J="flick",F="ui";function D(){D.superclass.constructor.apply(this,arguments);}C.ScrollViewBase=C.extend(D,C.Widget,{initializer:function(){this._createEvents();},_createEvents:function(){this.publish(A);this.publish(G);this.publish(L);this.publish(J);},_uiSizeCB:function(){},_transitionEnded:function(){this.fire(L);},bindUI:function(){this.get("boundingBox").on("touchstart",this._onTouchstart,this);this.get("contentBox")._node.addEventListener("webkitTransitionEnd",C.bind(this._transitionEnded,this),false);this.get("contentBox")._node.addEventListener("DOMSubtreeModified",C.bind(this._uiDimensionsChange,this));this.after("scrollYChange",this._afterScrollYChange);this.after("scrollXChange",this._afterScrollXChange);this.after("heightChange",this._afterHeightChange);this.after("widthChange",this._afterWidthChange);this.after("renderedChange",function(){C.later(0,this,"_uiDimensionsChange");});},syncUI:function(){this.scrollTo(this.get("scrollX"),this.get("scrollY"));},scrollTo:function(N,Q,O,P){var M=this.get("contentBox");if(N!==this.get("scrollX")){this.set("scrollX",N,{src:F});}if(Q!==this.get("scrollY")){this.set("scrollY",Q,{src:F});}if(O){P=P||"cubic-bezier(0, 0.1, 0, 1.0)";M.setStyle("-webkit-transition",O+"ms -webkit-transform");M.setStyle("-webkit-transition-timing-function",P);}else{M.setStyle("-webkit-transition",null);M.setStyle("-webkit-transition-timing-function",null);}M.setStyle("-webkit-transform","translate3d("+(N*-1)+"px,"+(Q*-1)+"px,0)");},_onTouchstart:function(M){var N;if(M.touches&&M.touches.length===1){N=M.touches[0];this._killTimer();this._touchmoveEvt=this.get("boundingBox").on("touchmove",this._onTouchmove,this);this._touchendEvt=this.get("boundingBox").on("touchend",this._onTouchend,this);this._touchstartY=M.touches[0].clientY+this.get("scrollY");this._touchstartX=M.touches[0].clientX+this.get("scrollX");this._touchStartTime=(new Date()).getTime();this._touchStartClientY=N.clientY;this._touchStartClientX=N.clientX;this._isDragging=false;this._snapToEdge=false;}},_onTouchmove:function(M){var N=M.touches[0];M.preventDefault();this._isDragging=true;this._touchEndClientY=N.clientY;this._touchEndClientX=N.clientX;this._lastMoved=(new Date()).getTime();if(this._scrollsVertical){this.set("scrollY",-(M.touches[0].clientY-this._touchstartY));}if(this._scrollsHorizontal){this.set("scrollX",-(M.touches[0].clientX-this._touchstartX));}},_onTouchend:function(T){var R=this._minScrollY,M=this._maxScrollY,S=this._minScrollX,O=this._maxScrollX,P=this._scrollsVertical?this._touchStartClientY:this._touchStartClientX,U=this._scrollsVertical?this._touchEndClientY:this._touchEndClientX,N=P-U,Q=+(new Date())-this._touchStartTime;this._touchmoveEvt.detach();this._touchendEvt.detach();this._scrolledHalfway=false;this._snapToEdge=false;this._isDragging=false;if(this._scrollsHorizontal&&Math.abs(N)>(this.get("width")/2)){this._scrolledHalfway=true;this._scrolledForward=N>0;}if(this._scrollsVertical&&Math.abs(N)>(this.get("height")/2)){this._scrolledHalfway=true;this._scrolledForward=N>0;}if(this._scrollsVertical&&this.get("scrollY")<R){this._snapToEdge=true;this.set("scrollY",R);}if(this._scrollsHorizontal&&this.get("scrollX")<S){this._snapToEdge=true;this.set("scrollX",S);}if(this.get("scrollY")>M){this._snapToEdge=true;this.set("scrollY",M);}if(this.get("scrollX")>O){this._snapToEdge=true;this.set("scrollX",O);}if(this._snapToEdge){return;}if(+(new Date())-this._touchStartTime>100){this.fire(L,{staleScroll:true});return;}this._flick(N,Q);},_afterScrollYChange:function(M){if(M.src!==F){this._uiScrollY(M.newVal,M.duration,M.easing);}},_uiScrollY:function(N,M,O){M=M||this._snapToEdge?400:0;O=O||this._snapToEdge?"ease-out":null;this.scrollTo(this.get("scrollX"),N,M,O);},_afterScrollXChange:function(M){if(M.src!==F){this._uiScrollX(M.newVal,M.duration,M.easing);}},_uiScrollX:function(N,M,O){M=M||this._snapToEdge?400:0;O=O||this._snapToEdge?"ease-out":null;this.scrollTo(N,this.get("scrollY"),M,O);},_afterHeightChange:function(){this._uiDimensionsChange();},_afterWidthChange:function(){this._uiDimensionsChange();},_uiDimensionsChange:function(){var N=this.get("contentBox"),R=this.get("boundingBox"),M=this.get("height"),Q=this.get("width"),P=N.get("scrollHeight"),O=N.get("scrollWidth");if(M&&P>M){this._scrollsVertical=true;this._maxScrollY=P-M;this._minScrollY=0;R.setStyle("overflow-y","auto");}if(Q&&O>Q){this._scrollsHorizontal=true;this._maxScrollX=O-Q;this._minScrollX=0;R.setStyle("overflow-x","auto");}},_flick:function(N,M){this._currentVelocity=N/M;this._flicking=true;this._flickFrame();this.fire(J);},_flickFrame:function(){var P=this.get("scrollY"),N=this._maxScrollY,R=this._minScrollY,Q=this.get("scrollX"),O=this._maxScrollX,M=this._minScrollX;this._currentVelocity=(this._currentVelocity*this.get("deceleration"));if(this._scrollsVertical){P=this.get("scrollY")+(this._currentVelocity*H);}if(this._scrollsHorizontal){Q=this.get("scrollX")+(this._currentVelocity*H);}if(Math.abs(this._currentVelocity).toFixed(4)<=0.015){this._flicking=false;this._killTimer(!(this._exceededYBoundary||this._exceededXBoundary));if(this._scrollsVertical){if(P<R){this._snapToEdge=true;this.set("scrollY",R);}else{if(P>N){this._snapToEdge=true;this.set("scrollY",N);}}}if(this._scrollsHorizontal){if(Q<M){this._snapToEdge=true;this.set("scrollX",M);}else{if(Q>O){this._snapToEdge=true;this.set("scrollX",O);}}}return;}if(this._scrollsVertical&&(P<R||P>N)){this._exceededYBoundary=true;this._currentVelocity*=this.get("bounce");}if(this._scrollsHorizontal&&(Q<M||Q>O)){this._exceededXBoundary=true;this._currentVelocity*=this.get("bounce");}if(this._scrollsVertical){this.set("scrollY",P);}if(this._scrollsHorizontal){this.set("scrollX",Q);
}this._flickTimer=C.later(H,this,"_flickFrame");},_killTimer:function(M){if(this._flickTimer){this._flickTimer.cancel();}if(M){this.fire(L);}},_setScrollX:function(P){var N=this.get("bounce"),O=N?-B:0,M=N?this._maxScrollX+B:this._maxScrollX;if(!N||!this._isDragging){if(P<O){P=O;}else{if(P>M){P=M;}}}return P;},_setScrollY:function(P){var N=this.get("bounce"),O=N?-B:0,M=N?this._maxScrollY+B:this._maxScrollY;if(!N||!this._isDragging){if(P<O){P=O;}else{if(P>M){P=M;}}}return P;}},{NAME:"scrollview",ATTRS:{scrollY:{value:0,setter:"_setScrollY"},scrollX:{value:0,setter:"_setScrollX"},deceleration:{value:0.98},bounce:{value:0.7}},CLASS_NAMES:I,UI_SRC:F});C.ScrollView=C.ScrollViewBase;},"@VERSION@",{requires:["widget","event-touch"]});