YUI.add("graphics-canvas",function(d,k){var v="canvas",u="shape",a=/[a-z][^a-z]*/ig,n=/[-]?[0-9]*[0-9|\.][0-9]*/g,g=d.config.doc,x=d.Lang,o=d.AttributeLite,p,r,z,t,l,h,y=d.DOM,j=d.Color,s=parseInt,i=parseFloat,q=x.isNumber,m=RegExp,w=j.toRGB,b=j.toHex,f=d.ClassNameManager.getClassName;function c(){}c.prototype={_pathSymbolToMethod:{M:"moveTo",m:"relativeMoveTo",L:"lineTo",l:"relativeLineTo",C:"curveTo",c:"relativeCurveTo",Q:"quadraticCurveTo",q:"relativeQuadraticCurveTo",z:"closePath",Z:"closePath"},_currentX:0,_currentY:0,_toRGBA:function(B,A){A=(A!==undefined)?A:1;if(!j.re_RGB.test(B)){B=b(B);}if(j.re_hex.exec(B)){B="rgba("+[s(m.$1,16),s(m.$2,16),s(m.$3,16)].join(",")+","+A+")";}return B;},_toRGB:function(A){return w(A);},setSize:function(A,B){if(this.get("autoSize")){if(A>this.node.getAttribute("width")){this.node.style.width=A+"px";this.node.setAttribute("width",A);}if(B>this.node.getAttribute("height")){this.node.style.height=B+"px";this.node.setAttribute("height",B);}}},_updateCoords:function(A,B){this._xcoords.push(A);this._ycoords.push(B);this._currentX=A;this._currentY=B;},_clearAndUpdateCoords:function(){var A=this._xcoords.pop()||0,B=this._ycoords.pop()||0;this._updateCoords(A,B);},_updateNodePosition:function(){var B=this.get("node"),A=this.get("x"),C=this.get("y");B.style.position="absolute";B.style.left=(A+this._left)+"px";B.style.top=(C+this._top)+"px";},_updateDrawingQueue:function(A){this._methods.push(A);},lineTo:function(){this._lineTo.apply(this,[d.Array(arguments),false]);},relativeLineTo:function(){this._lineTo.apply(this,[d.Array(arguments),true]);},_lineTo:function(G,A){var I=G[0],B,D,J,H,E=this._stroke&&this._strokeWeight?this._strokeWeight:0,F=A?parseFloat(this._currentX):0,C=A?parseFloat(this._currentY):0;if(!this._lineToMethods){this._lineToMethods=[];}D=G.length-1;if(typeof I==="string"||typeof I==="number"){for(B=0;B<D;B=B+2){J=parseFloat(G[B]);H=parseFloat(G[B+1]);J=J+F;H=H+C;this._updateDrawingQueue(["lineTo",J,H]);this._trackSize(J-E,H-E);this._trackSize(J+E,H+E);this._updateCoords(J,H);}}else{for(B=0;B<D;B=B+1){J=parseFloat(G[B][0]);H=parseFloat(G[B][1]);this._updateDrawingQueue(["lineTo",J,H]);this._lineToMethods[this._lineToMethods.length]=this._methods[this._methods.length-1];this._trackSize(J-E,H-E);this._trackSize(J+E,H+E);this._updateCoords(J,H);}}this._drawingComplete=false;return this;},moveTo:function(){this._moveTo.apply(this,[d.Array(arguments),false]);},relativeMoveTo:function(){this._moveTo.apply(this,[d.Array(arguments),true]);},_moveTo:function(C,F){var B=this._stroke&&this._strokeWeight?this._strokeWeight:0,E=F?parseFloat(this._currentX):0,D=F?parseFloat(this._currentY):0,A=parseFloat(C[0])+E,G=parseFloat(C[1])+D;this._updateDrawingQueue(["moveTo",A,G]);this._trackSize(A-B,G-B);this._trackSize(A+B,G+B);this._updateCoords(A,G);this._drawingComplete=false;return this;},curveTo:function(){this._curveTo.apply(this,[d.Array(arguments),false]);},relativeCurveTo:function(){this._curveTo.apply(this,[d.Array(arguments),true]);},_curveTo:function(A,R){var H,N,P,O,C,B,G,F,S,Q,D,E,I,L=0,M,K=R?parseFloat(this._currentX):0,J=R?parseFloat(this._currentY):0;M=A.length-5;for(;L<M;L=L+6){P=parseFloat(A[L])+K;O=parseFloat(A[L+1])+J;C=parseFloat(A[L+2])+K;B=parseFloat(A[L+3])+J;G=parseFloat(A[L+4])+K;F=parseFloat(A[L+5])+J;this._updateDrawingQueue(["bezierCurveTo",P,O,C,B,G,F]);this._drawingComplete=false;Q=Math.max(G,Math.max(P,C));E=Math.max(F,Math.max(O,B));D=Math.min(G,Math.min(P,C));I=Math.min(F,Math.min(O,B));H=Math.abs(Q-D);N=Math.abs(E-I);S=[[this._currentX,this._currentY],[P,O],[C,B],[G,F]];this._setCurveBoundingBox(S,H,N);this._currentX=G;this._currentY=F;}},quadraticCurveTo:function(){this._quadraticCurveTo.apply(this,[d.Array(arguments),false]);},relativeQuadraticCurveTo:function(){this._quadraticCurveTo.apply(this,[d.Array(arguments),true]);},_quadraticCurveTo:function(B,Q){var E,D,H,G,I,O,R,P,C,F,J,M=0,N=B.length-3,A=this._stroke&&this._strokeWeight?this._strokeWeight:0,L=Q?parseFloat(this._currentX):0,K=Q?parseFloat(this._currentY):0;for(;M<N;M=M+4){E=parseFloat(B[M])+L;D=parseFloat(B[M+1])+K;H=parseFloat(B[M+2])+L;G=parseFloat(B[M+3])+K;this._drawingComplete=false;P=Math.max(H,E);F=Math.max(G,D);C=Math.min(H,E);J=Math.min(G,D);I=Math.abs(P-C);O=Math.abs(F-J);R=[[this._currentX,this._currentY],[E,D],[H,G]];this._setCurveBoundingBox(R,I,O);this._updateDrawingQueue(["quadraticCurveTo",E,D,H,G]);this._updateCoords(H,G);}return this;},drawCircle:function(C,G,B){var E=0,D=2*Math.PI,A=this._stroke&&this._strokeWeight?this._strokeWeight:0,F=B*2;F+=A;this._drawingComplete=false;this._trackSize(C+F,G+F);this._trackSize(C-A,G-A);this._updateCoords(C,G);this._updateDrawingQueue(["arc",C+B,G+B,B,E,D,false]);return this;},drawDiamond:function(B,F,E,A){var D=E*0.5,C=A*0.5;this.moveTo(B+D,F);this.lineTo(B+E,F+C);this.lineTo(B+D,F+A);this.lineTo(B,F+C);this.lineTo(B+D,F);return this;},drawEllipse:function(L,J,M,R){var O=8,G=-(45/180)*Math.PI,T=0,F,D=M/2,E=R/2,P=0,I=L+D,H=J+E,N,K,S,Q,C,B,A=this._stroke&&this._strokeWeight?this._strokeWeight:0;N=I+Math.cos(0)*D;K=H+Math.sin(0)*E;this.moveTo(N,K);for(;P<O;P++){T+=G;F=T-(G/2);S=I+Math.cos(T)*D;Q=H+Math.sin(T)*E;C=I+Math.cos(F)*(D/Math.cos(G/2));B=H+Math.sin(F)*(E/Math.cos(G/2));this._updateDrawingQueue(["quadraticCurveTo",C,B,S,Q]);}this._trackSize(L+M+A,J+R+A);this._trackSize(L-A,J-A);this._updateCoords(L,J);return this;},drawRect:function(B,E,C,D){var A=this._stroke&&this._strokeWeight?this._strokeWeight:0;this._drawingComplete=false;this.moveTo(B,E);this.lineTo(B+C,E);this.lineTo(B+C,E+D);this.lineTo(B,E+D);this.lineTo(B,E);return this;},drawRoundRect:function(B,G,C,E,D,F){var A=this._stroke&&this._strokeWeight?this._strokeWeight:0;this._drawingComplete=false;this.moveTo(B,G+F);this.lineTo(B,G+E-F);this.quadraticCurveTo(B,G+E,B+D,G+E);this.lineTo(B+C-D,G+E);this.quadraticCurveTo(B+C,G+E,B+C,G+E-F);this.lineTo(B+C,G+F);this.quadraticCurveTo(B+C,G,B+C-D,G);this.lineTo(B+D,G);this.quadraticCurveTo(B,G,B,G+F);return this;
},drawWedge:function(K,I,O,H,D,E){var A=this._stroke&&this._strokeWeight?this._strokeWeight:0,N,M,G,S,F,L,J,R,Q,C,B,P=0;E=E||D;this._drawingComplete=false;this._updateDrawingQueue(["moveTo",K,I]);E=E||D;if(Math.abs(H)>360){H=360;}N=Math.ceil(Math.abs(H)/45);M=H/N;G=-(M/180)*Math.PI;S=(O/180)*Math.PI;if(N>0){L=K+Math.cos(O/180*Math.PI)*D;J=I+Math.sin(O/180*Math.PI)*E;this.lineTo(L,J);for(;P<N;++P){S+=G;F=S-(G/2);R=K+Math.cos(S)*D;Q=I+Math.sin(S)*E;C=K+Math.cos(F)*(D/Math.cos(G/2));B=I+Math.sin(F)*(E/Math.cos(G/2));this._updateDrawingQueue(["quadraticCurveTo",C,B,R,Q]);}this._updateDrawingQueue(["lineTo",K,I]);}this._trackSize(0-A,0-A);this._trackSize((D*2)+A,(D*2)+A);return this;},end:function(){this._closePath();return this;},closePath:function(){this._updateDrawingQueue(["closePath"]);this._updateDrawingQueue(["beginPath"]);},_getLinearGradient:function(){var M=d.Lang.isNumber,R=this.get("fill"),I=R.stops,F,Q,P,S=0,T=I.length,A,K=0,J=0,L=this.get("width"),U=this.get("height"),O=R.rotation||0,W,V,E,C,D=K+L/2,B=J+U/2,H,G=Math.PI/180,N=parseFloat(parseFloat(Math.tan(O*G)).toFixed(8));if(Math.abs(N)*L/2>=U/2){if(O<180){E=J;C=J+U;}else{E=J+U;C=J;}W=D-((B-E)/N);V=D-((B-C)/N);}else{if(O>90&&O<270){W=K+L;V=K;}else{W=K;V=K+L;}E=((N*(D-W))-B)*-1;C=((N*(D-V))-B)*-1;}A=this._context.createLinearGradient(W,E,V,C);for(;S<T;++S){P=I[S];F=P.opacity;Q=P.color;H=P.offset;if(M(F)){F=Math.max(0,Math.min(1,F));Q=this._toRGBA(Q,F);}else{Q=w(Q);}H=P.offset||S/(T-1);A.addColorStop(H,Q);}return A;},_getRadialGradient:function(){var P=d.Lang.isNumber,V=this.get("fill"),Q=V.r,H=V.fx,F=V.fy,J=V.stops,G,S,R,W=0,Y=J.length,B,M=0,L=0,N=this.get("width"),Z=this.get("height"),aa,X,E,D,U,T,A,O,ab,ac,I,K,C;T=M+N/2;A=L+Z/2;aa=N*H;E=Z*F;X=M+N/2;D=L+Z/2;U=N*Q;ac=Math.sqrt(Math.pow(Math.abs(T-aa),2)+Math.pow(Math.abs(A-E),2));if(ac>=U){K=ac/U;if(K===1){K=1.01;}O=(aa-T)/K;ab=(E-A)/K;O=O>0?Math.floor(O):Math.ceil(O);ab=ab>0?Math.floor(ab):Math.ceil(ab);aa=T+O;E=A+ab;}if(Q>=0.5){B=this._context.createRadialGradient(aa,E,Q,X,D,Q*N);C=1;}else{B=this._context.createRadialGradient(aa,E,Q,X,D,N/2);C=Q*2;}for(;W<Y;++W){R=J[W];G=R.opacity;S=R.color;I=R.offset;if(P(G)){G=Math.max(0,Math.min(1,G));S=this._toRGBA(S,G);}else{S=w(S);}I=R.offset||W/(Y-1);I*=C;if(I<=1){B.addColorStop(I,S);}}return B;},_initProps:function(){this._methods=[];this._lineToMethods=[];this._xcoords=[0];this._ycoords=[0];this._width=0;this._height=0;this._left=0;this._top=0;this._right=0;this._bottom=0;this._currentX=0;this._currentY=0;},_drawingComplete:false,_createGraphic:function(A){var B=d.config.doc.createElement("canvas");return B;},getBezierData:function(E,D){var F=E.length,C=[],B,A;for(B=0;B<F;++B){C[B]=[E[B][0],E[B][1]];}for(A=1;A<F;++A){for(B=0;B<F-A;++B){C[B][0]=(1-D)*C[B][0]+D*C[parseInt(B+1,10)][0];C[B][1]=(1-D)*C[B][1]+D*C[parseInt(B+1,10)][1];}}return[C[0][0],C[0][1]];},_setCurveBoundingBox:function(L,H,D){var C=0,B=this._currentX,I=B,G=this._currentY,A=G,F=Math.round(Math.sqrt((H*H)+(D*D))),J=1/F,E=this._stroke&&this._strokeWeight?this._strokeWeight:0,K;for(;C<F;++C){K=this.getBezierData(L,J*C);B=isNaN(B)?K[0]:Math.min(K[0],B);I=isNaN(I)?K[0]:Math.max(K[0],I);G=isNaN(G)?K[1]:Math.min(K[1],G);A=isNaN(A)?K[1]:Math.max(K[1],A);}B=Math.round(B*10)/10;I=Math.round(I*10)/10;G=Math.round(G*10)/10;A=Math.round(A*10)/10;this._trackSize(I+E,A+E);this._trackSize(B-E,G-E);},_trackSize:function(A,B){if(A>this._right){this._right=A;}if(A<this._left){this._left=A;}if(B<this._top){this._top=B;}if(B>this._bottom){this._bottom=B;}this._width=this._right-this._left;this._height=this._bottom-this._top;}};d.CanvasDrawing=c;p=function(A){this._transforms=[];this.matrix=new d.Matrix();p.superclass.constructor.apply(this,arguments);};p.NAME="shape";d.extend(p,d.GraphicBase,d.mix({init:function(){this.initializer.apply(this,arguments);},initializer:function(A){var B=this,D=A.graphic,C=this.get("data");B._initProps();B.createNode();B._xcoords=[0];B._ycoords=[0];if(D){this._setGraphic(D);}if(C){B._parsePathData(C);}B._updateHandler();},_setGraphic:function(A){var B;if(A instanceof d.CanvasGraphic){this._graphic=A;}else{A=d.one(A);B=new d.CanvasGraphic({render:A});B._appendShape(this);this._graphic=B;}},addClass:function(A){var B=d.one(this.get("node"));B.addClass(A);},removeClass:function(A){var B=d.one(this.get("node"));B.removeClass(A);},getXY:function(){var D=this.get("graphic"),B=D.getXY(),A=this.get("x"),C=this.get("y");return[B[0]+A,B[1]+C];},setXY:function(C){var E=this.get("graphic"),B=E.getXY(),A=C[0]-B[0],D=C[1]-B[1];this._set("x",A);this._set("y",D);this._updateNodePosition(A,D);},contains:function(A){return A===d.one(this.node);},test:function(A){return d.one(this.get("node")).test(A);},compareTo:function(A){var B=this.node;return B===A;},_getDefaultFill:function(){return{type:"solid",cx:0.5,cy:0.5,fx:0.5,fy:0.5,r:0.5};},_getDefaultStroke:function(){return{weight:1,dashstyle:"none",color:"#000",opacity:1};},_left:0,_right:0,_top:0,_bottom:0,createNode:function(){var C=this,B=d.config.doc.createElement("canvas"),E=C.get("id"),D=C._camelCaseConcat,A=C.name;C._context=B.getContext("2d");B.setAttribute("overflow","visible");B.style.overflow="visible";if(!C.get("visible")){B.style.visibility="hidden";}B.setAttribute("id",E);E="#"+E;C.node=B;C.addClass(f(u)+" "+f(D(v,u))+" "+f(A)+" "+f(D(v,A)));},on:function(B,A){if(d.Node.DOM_EVENTS[B]){return d.one("#"+this.get("id")).on(B,A);}return d.on.apply(this,arguments);},_setStrokeProps:function(G){var B,F,E,D,C,A;if(G){B=G.color;F=i(G.weight);E=i(G.opacity);D=G.linejoin||"round";C=G.linecap||"butt";A=G.dashstyle;this._miterlimit=null;this._dashstyle=(A&&d.Lang.isArray(A)&&A.length>1)?A:null;this._strokeWeight=F;if(q(F)&&F>0){this._stroke=1;}else{this._stroke=0;}if(q(E)){this._strokeStyle=this._toRGBA(B,E);}else{this._strokeStyle=B;}this._linecap=C;if(D=="round"||D=="bevel"){this._linejoin=D;}else{D=parseInt(D,10);if(q(D)){this._miterlimit=Math.max(D,1);this._linejoin="miter";}}}else{this._stroke=0;}},set:function(){var A=this,B=arguments[0];
o.prototype.set.apply(A,arguments);if(A.initialized){A._updateHandler();}},_setFillProps:function(E){var C=q,A,B,D;if(E){A=E.color;D=E.type;if(D=="linear"||D=="radial"){this._fillType=D;}else{if(A){B=E.opacity;if(C(B)){B=Math.max(0,Math.min(1,B));A=this._toRGBA(A,B);}else{A=w(A);}this._fillColor=A;this._fillType="solid";}else{this._fillColor=null;}}}else{this._fillType=null;this._fillColor=null;}},translate:function(A,B){this._translateX+=A;this._translateY+=B;this._addTransform("translate",arguments);},translateX:function(A){this._translateX+=A;this._addTransform("translateX",arguments);},translateY:function(A){this._translateY+=A;this._addTransform("translateY",arguments);},skew:function(A,B){this._addTransform("skew",arguments);},skewX:function(A){this._addTransform("skewX",arguments);},skewY:function(A){this._addTransform("skewY",arguments);},rotate:function(A){this._rotation=A;this._addTransform("rotate",arguments);},scale:function(A,B){this._addTransform("scale",arguments);},_rotation:0,_transform:"",_addTransform:function(B,A){A=d.Array(A);this._transform=x.trim(this._transform+" "+B+"("+A.join(", ")+")");A.unshift(B);this._transforms.push(A);if(this.initialized){this._updateTransform();}},_updateTransform:function(){var G=this.node,F,D,C=this.get("transformOrigin"),B=this.matrix,E=0,A=this._transforms.length;if(this._transforms&&this._transforms.length>0){for(;E<A;++E){F=this._transforms[E].shift();if(F){B[F].apply(B,this._transforms[E]);}}D=B.toCSSText();}this._graphic.addToRedrawQueue(this);C=(100*C[0])+"% "+(100*C[1])+"%";y.setStyle(G,"transformOrigin",C);if(D){y.setStyle(G,"transform",D);}this._transforms=[];},_updateHandler:function(){this._draw();this._updateTransform();},_draw:function(){var A=this.node;this.clear();this._closePath();A.style.left=this.get("x")+"px";A.style.top=this.get("y")+"px";},_closePath:function(){if(!this._methods){return;}var E=this.get("node"),L=this._right-this._left,I=this._bottom-this._top,B=this._context,F=[],C=this._methods.concat(),H=0,G,A,K,D,J=0;this._context.clearRect(0,0,E.width,E.height);if(this._methods){J=C.length;if(!J||J<1){return;}for(;H<J;++H){F[H]=C[H].concat();K=F[H];D=(K[0]=="quadraticCurveTo"||K[0]=="bezierCurveTo")?K.length:3;for(G=1;G<D;++G){if(G%2===0){K[G]=K[G]-this._top;}else{K[G]=K[G]-this._left;}}}E.setAttribute("width",Math.min(L,2000));E.setAttribute("height",Math.min(2000,I));B.beginPath();for(H=0;H<J;++H){K=F[H].concat();if(K&&K.length>0){A=K.shift();if(A){if(A=="closePath"){B.closePath();this._strokeAndFill(B);}else{if(A&&A=="lineTo"&&this._dashstyle){K.unshift(this._xcoords[H]-this._left,this._ycoords[H]-this._top);this._drawDashedLine.apply(this,K);}else{B[A].apply(B,K);}}}}}this._strokeAndFill(B);this._drawingComplete=true;this._clearAndUpdateCoords();this._updateNodePosition();this._methods=C;}},_strokeAndFill:function(A){if(this._fillType){if(this._fillType=="linear"){A.fillStyle=this._getLinearGradient();}else{if(this._fillType=="radial"){A.fillStyle=this._getRadialGradient();}else{A.fillStyle=this._fillColor;}}A.closePath();A.fill();}if(this._stroke){if(this._strokeWeight){A.lineWidth=this._strokeWeight;}A.lineCap=this._linecap;A.lineJoin=this._linejoin;if(this._miterlimit){A.miterLimit=this._miterlimit;}A.strokeStyle=this._strokeStyle;A.stroke();}},_drawDashedLine:function(J,P,A,M){var B=this._context,N=this._dashstyle[0],L=this._dashstyle[1],D=N+L,G=A-J,K=M-P,O=Math.sqrt(Math.pow(G,2)+Math.pow(K,2)),E=Math.floor(Math.abs(O/D)),C=Math.atan2(K,G),I=J,H=P,F;G=Math.cos(C)*D;K=Math.sin(C)*D;for(F=0;F<E;++F){B.moveTo(I,H);B.lineTo(I+Math.cos(C)*N,H+Math.sin(C)*N);I+=G;H+=K;}B.moveTo(I,H);O=Math.sqrt((A-I)*(A-I)+(M-H)*(M-H));if(O>N){B.lineTo(I+Math.cos(C)*N,H+Math.sin(C)*N);}else{if(O>0){B.lineTo(I+Math.cos(C)*O,H+Math.sin(C)*O);}}B.moveTo(A,M);},clear:function(){this._initProps();if(this.node){this._context.clearRect(0,0,this.node.width,this.node.height);}return this;},getBounds:function(){var D=this._type,B=this.get("width"),C=this.get("height"),A=this.get("x"),E=this.get("y");if(D=="path"){A=A+this._left;E=E+this._top;B=this._right-this._left;C=this._bottom-this._top;}return this._getContentRect(B,C,A,E);},_getContentRect:function(L,D,J,G){var B=this.get("transformOrigin"),K=B[0]*L,I=B[1]*D,F=this.matrix.getTransformArray(this.get("transform")),H=new d.Matrix(),C=0,E=F.length,A,M,N;if(this._type=="path"){K=K+J;I=I+G;}K=!isNaN(K)?K:0;I=!isNaN(I)?I:0;H.translate(K,I);for(;C<E;C=C+1){A=F[C];M=A.shift();if(M){H[M].apply(H,A);}}H.translate(-K,-I);N=H.getContentRect(L,D,J,G);return N;},toFront:function(){var A=this.get("graphic");if(A){A._toFront(this);}},toBack:function(){var A=this.get("graphic");if(A){A._toBack(this);}},_parsePathData:function(C){var A,E,G,I=d.Lang.trim(C.match(a)),D=0,F,H,B=this._pathSymbolToMethod;if(I){this.clear();F=I.length||0;for(;D<F;D=D+1){H=I[D];E=H.substr(0,1),G=H.substr(1).match(n);A=B[E];if(A){if(G){this[A].apply(this,G);}else{this[A].apply(this);}}}this.end();}},destroy:function(){var A=this.get("graphic");if(A){A.removeShape(this);}else{this._destroy();}},_destroy:function(){if(this.node){d.one(this.node).remove(true);this._context=null;this.node=null;}}},d.CanvasDrawing.prototype));p.ATTRS={transformOrigin:{valueFn:function(){return[0.5,0.5];}},transform:{setter:function(A){this.matrix.init();this._transforms=this.matrix.getTransformArray(A);this._transform=A;return A;},getter:function(){return this._transform;}},node:{readOnly:true,getter:function(){return this.node;}},id:{valueFn:function(){return d.guid();},setter:function(B){var A=this.node;if(A){A.setAttribute("id",B);}return B;}},width:{value:0},height:{value:0},x:{value:0},y:{value:0},visible:{value:true,setter:function(C){var B=this.get("node"),A=C?"visible":"hidden";if(B){B.style.visibility=A;}return C;}},fill:{valueFn:"_getDefaultFill",setter:function(C){var B,A=this.get("fill")||this._getDefaultFill();B=(C)?d.merge(A,C):null;if(B&&B.color){if(B.color===undefined||B.color=="none"){B.color=null;}}this._setFillProps(B);return B;
}},stroke:{valueFn:"_getDefaultStroke",setter:function(C){var B=this.get("stroke")||this._getDefaultStroke(),A;if(C&&C.hasOwnProperty("weight")){A=parseInt(C.weight,10);if(!isNaN(A)){C.weight=A;}}C=(C)?d.merge(B,C):null;this._setStrokeProps(C);return C;}},autoSize:{value:false},pointerEvents:{value:"visiblePainted"},data:{setter:function(A){if(this.get("node")){this._parsePathData(A);}return A;}},graphic:{readOnly:true,getter:function(){return this._graphic;}}};d.CanvasShape=p;r=function(A){r.superclass.constructor.apply(this,arguments);};r.NAME="path";d.extend(r,d.CanvasShape,{_type:"path",_draw:function(){this._closePath();this._updateTransform();},createNode:function(){var C=this,B=d.config.doc.createElement("canvas"),A=C.name,D=C._camelCaseConcat,E=C.get("id");C._context=B.getContext("2d");B.setAttribute("overflow","visible");B.setAttribute("pointer-events","none");B.style.pointerEvents="none";B.style.overflow="visible";B.setAttribute("id",E);E="#"+E;C.node=B;C.addClass(f(u)+" "+f(D(v,u))+" "+f(A)+" "+f(D(v,A)));},end:function(){this._draw();}});r.ATTRS=d.merge(d.CanvasShape.ATTRS,{width:{getter:function(){var A=this._stroke&&this._strokeWeight?(this._strokeWeight*2):0;return this._width-A;},setter:function(A){this._width=A;return A;}},height:{getter:function(){var A=this._stroke&&this._strokeWeight?(this._strokeWeight*2):0;return this._height-A;},setter:function(A){this._height=A;return A;}},path:{readOnly:true,getter:function(){return this._path;}}});d.CanvasPath=r;z=function(){z.superclass.constructor.apply(this,arguments);};z.NAME="rect";d.extend(z,d.CanvasShape,{_type:"rect",_draw:function(){var A=this.get("width"),B=this.get("height");this.clear();this.drawRect(0,0,A,B);this._closePath();}});z.ATTRS=d.CanvasShape.ATTRS;d.CanvasRect=z;t=function(A){t.superclass.constructor.apply(this,arguments);};t.NAME="ellipse";d.extend(t,p,{_type:"ellipse",_draw:function(){var A=this.get("width"),B=this.get("height");this.clear();this.drawEllipse(0,0,A,B);this._closePath();}});t.ATTRS=d.merge(p.ATTRS,{xRadius:{setter:function(A){this.set("width",A*2);},getter:function(){var A=this.get("width");if(A){A*=0.5;}return A;}},yRadius:{setter:function(A){this.set("height",A*2);},getter:function(){var A=this.get("height");if(A){A*=0.5;}return A;}}});d.CanvasEllipse=t;l=function(A){l.superclass.constructor.apply(this,arguments);};l.NAME="circle";d.extend(l,d.CanvasShape,{_type:"circle",_draw:function(){var A=this.get("radius");if(A){this.clear();this.drawCircle(0,0,A);this._closePath();}}});l.ATTRS=d.merge(d.CanvasShape.ATTRS,{width:{setter:function(A){this.set("radius",A/2);return A;},getter:function(){return this.get("radius")*2;}},height:{setter:function(A){this.set("radius",A/2);return A;},getter:function(){return this.get("radius")*2;}},radius:{lazyAdd:false}});d.CanvasCircle=l;h=function(){h.superclass.constructor.apply(this,arguments);};h.NAME="canvasPieSlice";d.extend(h,d.CanvasShape,{_type:"path",_draw:function(E){var B=this.get("cx"),F=this.get("cy"),D=this.get("startAngle"),C=this.get("arc"),A=this.get("radius");this.clear();this._left=B;this._right=A;this._top=F;this._bottom=A;this.drawWedge(B,F,D,C,A);this.end();}});h.ATTRS=d.mix({cx:{value:0},cy:{value:0},startAngle:{value:0},arc:{value:0},radius:{value:0}},d.CanvasShape.ATTRS);d.CanvasPieSlice=h;function e(A){e.superclass.constructor.apply(this,arguments);}e.NAME="canvasGraphic";e.ATTRS={render:{},id:{valueFn:function(){return d.guid();},setter:function(B){var A=this._node;if(A){A.setAttribute("id",B);}return B;}},shapes:{readOnly:true,getter:function(){return this._shapes;}},contentBounds:{readOnly:true,getter:function(){return this._contentBounds;}},node:{readOnly:true,getter:function(){return this._node;}},width:{setter:function(A){if(this._node){this._node.style.width=A+"px";}return A;}},height:{setter:function(A){if(this._node){this._node.style.height=A+"px";}return A;}},autoSize:{value:false},preserveAspectRatio:{value:"xMidYMid"},resizeDown:{value:false},x:{getter:function(){return this._x;},setter:function(A){this._x=A;if(this._node){this._node.style.left=A+"px";}return A;}},y:{getter:function(){return this._y;},setter:function(A){this._y=A;if(this._node){this._node.style.top=A+"px";}return A;}},autoDraw:{value:true},visible:{value:true,setter:function(A){this._toggleVisible(A);return A;}}};d.extend(e,d.GraphicBase,{set:function(B,F){var E=this,A={autoDraw:true,autoSize:true,preserveAspectRatio:true,resizeDown:true},D,C=false;o.prototype.set.apply(E,arguments);if(E._state.autoDraw===true&&d.Object.size(this._shapes)>0){if(x.isString&&A[B]){C=true;}else{if(x.isObject(B)){for(D in A){if(A.hasOwnProperty(D)&&B[D]){C=true;break;}}}}}if(C){E._redraw();}},_x:0,_y:0,getXY:function(){var A=d.one(this._node),B;if(A){B=A.getXY();}return B;},initializer:function(C){var E=this.get("render"),B=this.get("visible")?"visible":"hidden",A=this.get("width")||0,D=this.get("height")||0;this._shapes={};this._redrawQueue={};this._contentBounds={left:0,top:0,right:0,bottom:0};this._node=g.createElement("div");this._node.style.position="absolute";this._node.style.visibility=B;this.set("width",A);this.set("height",D);if(E){this.render(E);}},render:function(D){var A=d.one(D),E=this._node,B=this.get("width")||parseInt(A.getComputedStyle("width"),10),C=this.get("height")||parseInt(A.getComputedStyle("height"),10);A=A||g.body;A.appendChild(E);E.style.display="block";E.style.position="absolute";E.style.left="0px";E.style.top="0px";this.set("width",B);this.set("height",C);this.parentNode=A;return this;},destroy:function(){this.removeAllShapes();if(this._node){this._removeChildren(this._node);d.one(this._node).destroy();}},addShape:function(A){A.graphic=this;if(!this.get("visible")){A.visible=false;}var C=this._getShapeClass(A.type),B=new C(A);this._appendShape(B);return B;},_appendShape:function(B){var C=B.node,A=this._frag||this._node;if(this.get("autoDraw")){A.appendChild(C);}else{this._getDocFrag().appendChild(C);}},removeShape:function(A){if(!(A instanceof p)){if(x.isString(A)){A=this._shapes[A];
}}if(A&&A instanceof p){A._destroy();delete this._shapes[A.get("id")];}if(this.get("autoDraw")){this._redraw();}return A;},removeAllShapes:function(){var A=this._shapes,B;for(B in A){if(A.hasOwnProperty(B)){A[B].destroy();}}this._shapes={};},clear:function(){this.removeAllShapes();},_removeChildren:function(A){if(A&&A.hasChildNodes()){var B;while(A.firstChild){B=A.firstChild;this._removeChildren(B);A.removeChild(B);}}},_toggleVisible:function(D){var C,B=this._shapes,A=D?"visible":"hidden";if(B){for(C in B){if(B.hasOwnProperty(C)){B[C].set("visible",D);}}}if(this._node){this._node.style.visibility=A;}},_getShapeClass:function(B){var A=this._shapeClass[B];if(A){return A;}return B;},_shapeClass:{circle:d.CanvasCircle,rect:d.CanvasRect,path:d.CanvasPath,ellipse:d.CanvasEllipse,pieslice:d.CanvasPieSlice},getShapeById:function(B){var A=this._shapes[B];return A;},batch:function(B){var A=this.get("autoDraw");this.set("autoDraw",false);B();this.set("autoDraw",A);},_getDocFrag:function(){if(!this._frag){this._frag=g.createDocumentFragment();}return this._frag;},_redraw:function(){var G=this.get("autoSize"),E=this.get("preserveAspectRatio"),H=this.get("resizeDown")?this._getUpdatedContentBounds():this._contentBounds,A,K,L,I,M,D,C=0,B=0,J,F=this.get("node");if(G){if(G=="sizeContentToGraphic"){A=H.right-H.left;K=H.bottom-H.top;L=parseFloat(y.getComputedStyle(F,"width"));I=parseFloat(y.getComputedStyle(F,"height"));J=new d.Matrix();if(E=="none"){M=L/A;D=I/K;}else{if(A/K!==L/I){if(A*I/K>L){M=D=L/A;B=this._calculateTranslate(E.slice(5).toLowerCase(),K*L/A,I);}else{M=D=I/K;C=this._calculateTranslate(E.slice(1,4).toLowerCase(),A*I/K,L);}}}y.setStyle(F,"transformOrigin","0% 0%");C=C-(H.left*M);B=B-(H.top*D);J.translate(C,B);J.scale(M,D);y.setStyle(F,"transform",J.toCSSText());}else{this.set("width",H.right);this.set("height",H.bottom);}}if(this._frag){this._node.appendChild(this._frag);this._frag=null;}},_calculateTranslate:function(A,D,C){var B=C-D,E;switch(A){case"mid":E=B*0.5;break;case"max":E=B;break;default:E=0;break;}return E;},addToRedrawQueue:function(A){var C,B;this._shapes[A.get("id")]=A;if(!this.get("resizeDown")){C=A.getBounds();B=this._contentBounds;B.left=B.left<C.left?B.left:C.left;B.top=B.top<C.top?B.top:C.top;B.right=B.right>C.right?B.right:C.right;B.bottom=B.bottom>C.bottom?B.bottom:C.bottom;this._contentBounds=B;}if(this.get("autoDraw")){this._redraw();}},_getUpdatedContentBounds:function(){var E,C,B,A=this._shapes,D={};for(C in A){if(A.hasOwnProperty(C)){B=A[C];E=B.getBounds();D.left=x.isNumber(D.left)?Math.min(D.left,E.left):E.left;D.top=x.isNumber(D.top)?Math.min(D.top,E.top):E.top;D.right=x.isNumber(D.right)?Math.max(D.right,E.right):E.right;D.bottom=x.isNumber(D.bottom)?Math.max(D.bottom,E.bottom):E.bottom;}}D.left=x.isNumber(D.left)?D.left:0;D.top=x.isNumber(D.top)?D.top:0;D.right=x.isNumber(D.right)?D.right:0;D.bottom=x.isNumber(D.bottom)?D.bottom:0;this._contentBounds=D;return D;},_toFront:function(B){var A=this.get("node");if(B instanceof d.CanvasShape){B=B.get("node");}if(A&&B){A.appendChild(B);}},_toBack:function(B){var A=this.get("node"),C;if(B instanceof d.CanvasShape){B=B.get("node");}if(A&&B){C=A.firstChild;if(C){A.insertBefore(B,C);}else{A.appendChild(B);}}}});d.CanvasGraphic=e;},"@VERSION@",{"requires":["graphics"]});