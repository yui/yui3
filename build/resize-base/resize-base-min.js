YUI.add("resize-base",function(U,m){var X=U.Lang,b=X.isArray,ax=X.isBoolean,N=X.isNumber,aC=X.isString,ah=U.Array,at=X.trim,k=ah.indexOf,s=",",af=".",q="",I="{handle}",r=" ",p="active",M="activeHandle",C="activeHandleNode",v="all",al="autoHide",av="border",aq="bottom",am="className",ap="color",aB="defMinHeight",aG="defMinWidth",w="handle",K="handles",O="handlesWrapper",ad="hidden",u="inner",a="left",J="margin",o="node",z="nodeName",V="none",E="offsetHeight",aA="offsetWidth",ab="padding",d="parentNode",l="position",j="relative",ak="resize",n="resizing",g="right",aH="static",f="style",i="top",G="width",an="wrap",aD="wrapper",ai="wrapTypes",F="resize:mouseUp",t="resize:resize",x="resize:align",H="resize:end",S="resize:start",Z="t",aF="tr",aa="r",aw="br",aj="b",ay="bl",ag="l",aI="tl",aE=function(){return Array.prototype.slice.call(arguments).join(r);},ar=function(B){return Math.round(parseFloat(B))||0;},ae=function(B,L){return B.getComputedStyle(L);},aJ=function(B){return w+B.toUpperCase();},P=function(B){return(B instanceof U.Node);},Q=U.cached(function(B){return B.substring(0,1).toUpperCase()+B.substring(1);}),A=U.cached(function(){var L=[],B=ah(arguments,0,true);ah.each(B,function(R,T){if(T>0){R=Q(R);}L.push(R);});return L.join(q);}),y=U.ClassNameManager.getClassName,au=y(ak),ao=y(ak,w),ac=y(ak,w,p),e=y(ak,w,u),D=y(ak,w,u,I),aK=y(ak,w,I),c=y(ak,ad,K),W=y(ak,K,aD),az=y(ak,aD);function h(){h.superclass.constructor.apply(this,arguments);}U.mix(h,{NAME:ak,ATTRS:{activeHandle:{value:null,validator:function(B){return U.Lang.isString(B)||U.Lang.isNull(B);}},activeHandleNode:{value:null,validator:P},autoHide:{value:false,validator:ax},defMinHeight:{value:15,validator:N},defMinWidth:{value:15,validator:N},handles:{setter:"_setHandles",value:v},handlesWrapper:{readOnly:true,setter:U.one,valueFn:"_valueHandlesWrapper"},node:{setter:U.one},resizing:{value:false,validator:ax},wrap:{setter:"_setWrap",value:false,validator:ax},wrapTypes:{readOnly:true,value:/^canvas|textarea|input|select|button|img|iframe|table|embed$/i},wrapper:{readOnly:true,valueFn:"_valueWrapper",writeOnce:true}},RULES:{b:function(B,R,L){var Y=B.info,T=B.originalInfo;Y.offsetHeight=T.offsetHeight+L;},l:function(B,R,L){var Y=B.info,T=B.originalInfo;Y.left=T.left+R;Y.offsetWidth=T.offsetWidth-R;},r:function(B,R,L){var Y=B.info,T=B.originalInfo;Y.offsetWidth=T.offsetWidth+R;},t:function(B,R,L){var Y=B.info,T=B.originalInfo;Y.top=T.top+L;Y.offsetHeight=T.offsetHeight-L;},tr:function(B,R,L){this.t.apply(this,arguments);this.r.apply(this,arguments);},bl:function(B,R,L){this.b.apply(this,arguments);this.l.apply(this,arguments);},br:function(B,R,L){this.b.apply(this,arguments);this.r.apply(this,arguments);},tl:function(B,R,L){this.t.apply(this,arguments);this.l.apply(this,arguments);}},capitalize:A});U.Resize=U.extend(h,U.Base,{ALL_HANDLES:[Z,aF,aa,aw,aj,ay,ag,aI],REGEX_CHANGE_HEIGHT:/^(t|tr|b|bl|br|tl)$/i,REGEX_CHANGE_LEFT:/^(tl|l|bl)$/i,REGEX_CHANGE_TOP:/^(tl|t|tr)$/i,REGEX_CHANGE_WIDTH:/^(bl|br|l|r|tl|tr)$/i,HANDLES_WRAP_TEMPLATE:'<div class="'+W+'"></div>',WRAP_TEMPLATE:'<div class="'+az+'"></div>',HANDLE_TEMPLATE:'<div class="'+aE(ao,aK)+'">'+'<div class="'+aE(e,D)+'">&nbsp;</div>'+"</div>",totalHSurrounding:0,totalVSurrounding:0,nodeSurrounding:null,wrapperSurrounding:null,changeHeightHandles:false,changeLeftHandles:false,changeTopHandles:false,changeWidthHandles:false,delegate:null,info:null,lastInfo:null,originalInfo:null,initializer:function(){this._eventHandles=[];this.renderer();},renderUI:function(){var B=this;B._renderHandles();},bindUI:function(){var B=this;B._createEvents();B._bindDD();B._bindHandle();},syncUI:function(){var B=this;this.get(o).addClass(au);B._setHideHandlesUI(B.get(al));},destructor:function(){var B=this,R=B.get(o),T=B.get(aD),L=T.get(d);U.each(B._eventHandles,function(aL,Y){aL.detach();});B._eventHandles.length=0;B.eachHandle(function(Y){B.delegate.dd.destroy();Y.remove(true);});B.delegate.destroy();if(B.get(an)){B._copyStyles(T,R);if(L){L.insertBefore(R,T);}T.remove(true);}R.removeClass(au);R.removeClass(c);},renderer:function(){this.renderUI();this.bindUI();this.syncUI();},eachHandle:function(L){var B=this;U.each(B.get(K),function(Y,R){var T=B.get(aJ(Y));L.apply(B,[T,Y,R]);});},_bindDD:function(){var B=this;B.delegate=new U.DD.Delegate({bubbleTargets:B,container:B.get(O),dragConfig:{clickPixelThresh:0,clickTimeThresh:0,useShim:true,move:false},nodes:af+ao,target:false});B._eventHandles.push(B.on("drag:drag",B._handleResizeEvent),B.on("drag:dropmiss",B._handleMouseUpEvent),B.on("drag:end",B._handleResizeEndEvent),B.on("drag:start",B._handleResizeStartEvent));},_bindHandle:function(){var B=this,L=B.get(aD);B._eventHandles.push(L.on("mouseenter",U.bind(B._onWrapperMouseEnter,B)),L.on("mouseleave",U.bind(B._onWrapperMouseLeave,B)),L.delegate("mouseenter",U.bind(B._onHandleMouseEnter,B),af+ao),L.delegate("mouseleave",U.bind(B._onHandleMouseLeave,B),af+ao));},_createEvents:function(){var B=this,L=function(R,T){B.publish(R,{defaultFn:T,queuable:false,emitFacade:true,bubbles:true,prefix:ak});};L(S,this._defResizeStartFn);L(t,this._defResizeFn);L(x,this._defResizeAlignFn);L(H,this._defResizeEndFn);L(F,this._defMouseUpFn);},_renderHandles:function(){var B=this,R=B.get(aD),L=B.get(O);B.eachHandle(function(T){L.append(T);});R.append(L);},_buildHandle:function(L){var B=this;return U.Node.create(U.Lang.sub(B.HANDLE_TEMPLATE,{handle:L}));},_calcResize:function(){var B=this,T=B.handle,aL=B.info,Y=B.originalInfo,R=aL.actXY[0]-Y.actXY[0],L=aL.actXY[1]-Y.actXY[1];if(T&&U.Resize.RULES[T]){U.Resize.RULES[T](B,R,L);}else{}},_checkSize:function(aL,L){var B=this,Y=B.info,T=B.originalInfo,R=(aL==E)?i:a;Y[aL]=L;if(((R==a)&&B.changeLeftHandles)||((R==i)&&B.changeTopHandles)){Y[R]=T[R]+T[aL]-L;}},_copyStyles:function(R,Y){var B=R.getStyle(l).toLowerCase(),T=this._getBoxSurroundingInfo(R),L;if(B==aH){B=j;}L={position:B,left:ae(R,a),top:ae(R,i)};U.mix(L,T.margin);U.mix(L,T.border);Y.setStyles(L);R.setStyles({border:0,margin:0});Y.sizeTo(R.get(aA)+T.totalHBorder,R.get(E)+T.totalVBorder);
},_extractHandleName:U.cached(function(R){var L=R.get(am),B=L.match(new RegExp(y(ak,w,"(\\w{1,2})\\b")));return B?B[1]:null;}),_getInfo:function(Y,B){var aL=[0,0],aN=B.dragEvent.target,aM=Y.getXY(),T=aM[0],R=aM[1],L=Y.get(E),aO=Y.get(aA);if(B){aL=(aN.actXY.length?aN.actXY:aN.lastXY);}return{actXY:aL,bottom:(R+L),left:T,offsetHeight:L,offsetWidth:aO,right:(T+aO),top:R};},_getBoxSurroundingInfo:function(B){var L={padding:{},margin:{},border:{}};if(P(B)){U.each([i,g,aq,a],function(aL){var T=A(ab,aL),Y=A(J,aL),R=A(av,aL,G),aM=A(av,aL,ap),aN=A(av,aL,f);L.border[aM]=ae(B,aM);L.border[aN]=ae(B,aN);L.border[R]=ae(B,R);L.margin[Y]=ae(B,Y);L.padding[T]=ae(B,T);});}L.totalHBorder=(ar(L.border.borderLeftWidth)+ar(L.border.borderRightWidth));L.totalHPadding=(ar(L.padding.paddingLeft)+ar(L.padding.paddingRight));L.totalVBorder=(ar(L.border.borderBottomWidth)+ar(L.border.borderTopWidth));L.totalVPadding=(ar(L.padding.paddingBottom)+ar(L.padding.paddingTop));return L;},_syncUI:function(){var B=this,T=B.info,R=B.wrapperSurrounding,Y=B.get(aD),L=B.get(o);Y.sizeTo(T.offsetWidth,T.offsetHeight);if(B.changeLeftHandles||B.changeTopHandles){Y.setXY([T.left,T.top]);}if(!Y.compareTo(L)){L.sizeTo(T.offsetWidth-R.totalHBorder,T.offsetHeight-R.totalVBorder);}if(U.UA.webkit){L.setStyle(ak,V);}},_updateChangeHandleInfo:function(L){var B=this;B.changeHeightHandles=B.REGEX_CHANGE_HEIGHT.test(L);B.changeLeftHandles=B.REGEX_CHANGE_LEFT.test(L);B.changeTopHandles=B.REGEX_CHANGE_TOP.test(L);B.changeWidthHandles=B.REGEX_CHANGE_WIDTH.test(L);},_updateInfo:function(L){var B=this;B.info=B._getInfo(B.get(aD),L);},_updateSurroundingInfo:function(){var B=this,T=B.get(o),Y=B.get(aD),L=B._getBoxSurroundingInfo(T),R=B._getBoxSurroundingInfo(Y);B.nodeSurrounding=L;B.wrapperSurrounding=R;B.totalVSurrounding=(L.totalVPadding+R.totalVBorder);B.totalHSurrounding=(L.totalHPadding+R.totalHBorder);},_setActiveHandlesUI:function(R){var B=this,L=B.get(C);if(L){if(R){B.eachHandle(function(T){T.removeClass(ac);});L.addClass(ac);}else{L.removeClass(ac);}}},_setHandles:function(R){var B=this,L=[];if(b(R)){L=R;}else{if(aC(R)){if(R.toLowerCase()==v){L=B.ALL_HANDLES;}else{U.each(R.split(s),function(Y,T){var aL=at(Y);if(k(B.ALL_HANDLES,aL)>-1){L.push(aL);}});}}}return L;},_setHideHandlesUI:function(L){var B=this,R=B.get(aD);if(!B.get(n)){if(L){R.addClass(c);}else{R.removeClass(c);}}},_setWrap:function(T){var B=this,R=B.get(o),Y=R.get(z),L=B.get(ai);if(L.test(Y)){T=true;}return T;},_defMouseUpFn:function(L){var B=this;B.set(n,false);},_defResizeFn:function(L){var B=this;B._resize(L);},_resize:function(L){var B=this;B._handleResizeAlignEvent(L.dragEvent);B._syncUI();},_defResizeAlignFn:function(L){var B=this;B._resizeAlign(L);},_resizeAlign:function(R){var B=this,T,L,Y;B.lastInfo=B.info;B._updateInfo(R);T=B.info;B._calcResize();if(!B.con){L=(B.get(aB)+B.totalVSurrounding);Y=(B.get(aG)+B.totalHSurrounding);if(T.offsetHeight<=L){B._checkSize(E,L);}if(T.offsetWidth<=Y){B._checkSize(aA,Y);}}},_defResizeEndFn:function(L){var B=this;B._resizeEnd(L);},_resizeEnd:function(R){var B=this,L=R.dragEvent.target;L.actXY=[];B._syncUI();B._setActiveHandlesUI(false);B.set(M,null);B.set(C,null);B.handle=null;},_defResizeStartFn:function(L){var B=this;B._resizeStart(L);},_resizeStart:function(L){var B=this,R=B.get(aD);B.handle=B.get(M);B.set(n,true);B._updateSurroundingInfo();B.originalInfo=B._getInfo(R,L);B._updateInfo(L);},_handleMouseUpEvent:function(B){this.fire(F,{dragEvent:B,info:this.info});},_handleResizeEvent:function(B){this.fire(t,{dragEvent:B,info:this.info});},_handleResizeAlignEvent:function(B){this.fire(x,{dragEvent:B,info:this.info});},_handleResizeEndEvent:function(B){this.fire(H,{dragEvent:B,info:this.info});},_handleResizeStartEvent:function(B){if(!this.get(M)){this._setHandleFromNode(B.target.get("node"));}this.fire(S,{dragEvent:B,info:this.info});},_onWrapperMouseEnter:function(L){var B=this;if(B.get(al)){B._setHideHandlesUI(false);}},_onWrapperMouseLeave:function(L){var B=this;if(B.get(al)){B._setHideHandlesUI(true);}},_setHandleFromNode:function(L){var B=this,R=B._extractHandleName(L);if(!B.get(n)){B.set(M,R);B.set(C,L);B._setActiveHandlesUI(true);B._updateChangeHandleInfo(R);}},_onHandleMouseEnter:function(B){this._setHandleFromNode(B.currentTarget);},_onHandleMouseLeave:function(L){var B=this;if(!B.get(n)){B._setActiveHandlesUI(false);}},_valueHandlesWrapper:function(){return U.Node.create(this.HANDLES_WRAP_TEMPLATE);},_valueWrapper:function(){var B=this,R=B.get(o),L=R.get(d),T=R;if(B.get(an)){T=U.Node.create(B.WRAP_TEMPLATE);if(L){L.insertBefore(T,R);}T.append(R);B._copyStyles(R,T);R.setStyles({position:aH,left:0,top:0});}return T;}});U.each(U.Resize.prototype.ALL_HANDLES,function(L,B){U.Resize.ATTRS[aJ(L)]={setter:function(){return this._buildHandle(L);},value:null,writeOnce:true};});},"@VERSION@",{"requires":["base","widget","event","oop","dd-drag","dd-delegate","dd-drop"],"skinnable":true});