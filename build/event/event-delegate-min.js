YUI.add("event-delegate",function(B){var J=B.Event,F=B.Lang,E={},A={mouseenter:"mouseover",mouseleave:"mouseout"},I={focus:J._attachFocus,blur:J._attachBlur},H=function(L){try{if(L&&3==L.nodeType){return L.parentNode;}}catch(K){}return L;},D=function(L,Q,N){var R=H((Q.target||Q.srcElement)),O=E[L],U,P,M,T,S;var K=function(Y,V,W){var X;if(!Y||Y===W){X=false;}else{X=B.Selector.test(Y,V)?Y:K(Y.parentNode,V,W);}return X;};for(U in O){if(O.hasOwnProperty(U)){P=O[U];T=O.fn;M=null;if(B.Selector.test(R,U,N)){M=R;}else{if(B.Selector.test(R,((U.replace(/,/gi," *,"))+" *"),N)){M=K(R,U,N);}}if(M){if(!S){S=new B.DOMEventFacade(Q,N);S.container=S.currentTarget;}S.currentTarget=B.Node.get(M);B.publish(P,{contextFn:function(){return S.currentTarget;}});if(T){T(S,P);}else{B.fire(P,S);}}}}},G=function(N,M,L){var O=I[N],K=[N,function(P){D(M,(P||window.event),L);},L];if(O){return O(K,{capture:true,facade:false});}else{return J._attach(K,{facade:false});}},C=B.cached(function(K){return K.replace(/[|,:]/g,"~");});B.Env.evt.plugins.delegate={on:function(P,O,N,K,L){var M=B.Array(arguments,0,true);M.splice(3,1);M[0]=K;return B.delegate.apply(B,M);}};J.delegate=function(R,U,L,X){if(!X){return false;}var O=B.Array(arguments,0,true),N,W;if(F.isString(L)){N=B.Selector.query(L);if(N.length===0){return J.onAvailable(L,function(){J.delegate.apply(J,O);},J,true,false);}}if(J._isValidCollection(N)){W=[];B.each(N,function(Z,Y){O[2]=Z;W.push(J.delegate.apply(J,O));});return(W.length===1)?W[0]:W;}N=B.Node.getDOMNode(L);var S=B.stamp(N),M="delegate:"+S+R+C(X),K=R+S,Q=E[K],T,V,P;if(!Q){Q={};if(A[R]){if(!J._fireMouseEnter){return false;}R=A[R];Q.fn=J._fireMouseEnter;}T=G(R,K,N);B.after(function(Y){if(T.sub==Y){delete E[K];B.detachAll(M);}},T.evt,"_delete");Q.handle=T;E[K]=Q;}P=Q.listeners;Q.listeners=P?(P+1):1;Q[X]=M;O[0]=M;O.splice(2,2);V=B.on.apply(B,O);B.after(function(){Q.listeners=(Q.listeners-1);if(Q.listeners===0){Q.handle.detach();}},V,"detach");return V;};B.delegate=J.delegate;},"@VERSION@",{requires:["event-base"]});