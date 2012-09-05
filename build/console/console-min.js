YUI.add("console",function(d,J){var g=d.ClassNameManager.getClassName,b="checked",S="clear",R="click",s="collapsed",ae="console",B="contentBox",F="disabled",O="entry",K="error",H="height",o="info",l="lastTime",f="pause",D="paused",X="reset",V="startTime",P="title",G="warn",x=".",w=g(ae,"button"),z=g(ae,"checkbox"),ad=g(ae,S),W=g(ae,"collapse"),r=g(ae,s),e=g(ae,"controls"),C=g(ae,"hd"),A=g(ae,"bd"),c=g(ae,"ft"),I=g(ae,P),Z=g(ae,O),T=g(ae,O,"cat"),y=g(ae,O,"content"),t=g(ae,O,"meta"),E=g(ae,O,"src"),a=g(ae,O,"time"),p=g(ae,f),v=g(ae,f,"label"),N=/^(\S+)\s/,aa=/&(?!#?[a-z0-9]+;)/g,U=/>/g,j=/</g,h="&#38;",q="&#62;",M="&#60;",n='<div class="{entry_class} {cat_class} {src_class}">'+'<p class="{entry_meta_class}">'+'<span class="{entry_src_class}">'+"{sourceAndDetail}"+"</span>"+'<span class="{entry_cat_class}">'+"{category}</span>"+'<span class="{entry_time_class}">'+" {totalTime}ms (+{elapsedTime}) {localTime}"+"</span>"+"</p>"+'<pre class="{entry_content_class}">{message}</pre>'+"</div>",i=d.Lang,k=d.Node.create,ac=i.isNumber,m=i.isString,Q=d.merge,ab=d.Lang.sub;function u(){u.superclass.constructor.apply(this,arguments);}d.Console=d.extend(u,d.Widget,{_evtCat:null,_head:null,_body:null,_foot:null,_printLoop:null,buffer:null,log:function(){d.log.apply(d,arguments);return this;},clearConsole:function(){this._body.empty();this._cancelPrintLoop();this.buffer=[];return this;},reset:function(){this.fire(X);return this;},collapse:function(){this.set(s,true);return this;},expand:function(){this.set(s,false);return this;},printBuffer:function(Y){var ak=this.buffer,af=d.config.debug,L=[],ah=this.get("consoleLimit"),aj=this.get("newestOnTop"),ag=aj?this._body.get("firstChild"):null,ai;if(ak.length>ah){ak.splice(0,ak.length-ah);}Y=Math.min(ak.length,(Y||ak.length));d.config.debug=false;if(!this.get(D)&&this.get("rendered")){for(ai=0;ai<Y&&ak.length;++ai){L[ai]=this._createEntryHTML(ak.shift());}if(!ak.length){this._cancelPrintLoop();}if(L.length){if(aj){L.reverse();}this._body.insertBefore(k(L.join("")),ag);if(this.get("scrollIntoView")){this.scrollToLatest();}this._trimOldEntries();}}d.config.debug=af;return this;},initializer:function(){this._evtCat=d.stamp(this)+"|";this.buffer=[];this.get("logSource").on(this._evtCat+this.get("logEvent"),d.bind("_onLogEvent",this));this.publish(O,{defaultFn:this._defEntryFn});this.publish(X,{defaultFn:this._defResetFn});this.after("rendered",this._schedulePrint);},destructor:function(){var L=this.get("boundingBox");this._cancelPrintLoop();this.get("logSource").detach(this._evtCat+"*");L.purge(true);},renderUI:function(){this._initHead();this._initBody();this._initFoot();var L=this.get("style");if(L!=="block"){this.get("boundingBox").addClass(this.getClassName(L));}},syncUI:function(){this._uiUpdatePaused(this.get(D));this._uiUpdateCollapsed(this.get(s));this._uiSetHeight(this.get(H));},bindUI:function(){this.get(B).one("button."+W).on(R,this._onCollapseClick,this);this.get(B).one("input[type=checkbox]."+p).on(R,this._onPauseClick,this);this.get(B).one("button."+ad).on(R,this._onClearClick,this);this.after(this._evtCat+"stringsChange",this._afterStringsChange);this.after(this._evtCat+"pausedChange",this._afterPausedChange);this.after(this._evtCat+"consoleLimitChange",this._afterConsoleLimitChange);this.after(this._evtCat+"collapsedChange",this._afterCollapsedChange);},_initHead:function(){var L=this.get(B),Y=Q(u.CHROME_CLASSES,{str_collapse:this.get("strings.collapse"),str_title:this.get("strings.title")});this._head=k(ab(u.HEADER_TEMPLATE,Y));L.insertBefore(this._head,L.get("firstChild"));},_initBody:function(){this._body=k(ab(u.BODY_TEMPLATE,u.CHROME_CLASSES));this.get(B).appendChild(this._body);},_initFoot:function(){var L=Q(u.CHROME_CLASSES,{id_guid:d.guid(),str_pause:this.get("strings.pause"),str_clear:this.get("strings.clear")});this._foot=k(ab(u.FOOTER_TEMPLATE,L));this.get(B).appendChild(this._foot);},_isInLogLevel:function(af){var L=af.cat,Y=this.get("logLevel");if(Y!==o){L=L||o;if(m(L)){L=L.toLowerCase();}if((L===G&&Y===K)||(L===o&&Y!==o)){return false;}}return true;},_normalizeMessage:function(af){var ah=af.msg,Y=af.cat,ag=af.src,L={time:new Date(),message:ah,category:Y||this.get("defaultCategory"),sourceAndDetail:ag||this.get("defaultSource"),source:null,localTime:null,elapsedTime:null,totalTime:null};L.source=N.test(L.sourceAndDetail)?RegExp.$1:L.sourceAndDetail;L.localTime=L.time.toLocaleTimeString?L.time.toLocaleTimeString():(L.time+"");L.elapsedTime=L.time-this.get(l);L.totalTime=L.time-this.get(V);this._set(l,L.time);return L;},_schedulePrint:function(){if(!this._printLoop&&!this.get(D)&&this.get("rendered")){this._printLoop=d.later(this.get("printTimeout"),this,this.printBuffer,this.get("printLimit"),true);}},_createEntryHTML:function(L){L=Q(this._htmlEscapeMessage(L),u.ENTRY_CLASSES,{cat_class:this.getClassName(O,L.category),src_class:this.getClassName(O,L.source)});return this.get("entryTemplate").replace(/\{(\w+)\}/g,function(Y,af){return af in L?L[af]:"";});},scrollToLatest:function(){var L=this.get("newestOnTop")?0:this._body.get("scrollHeight");this._body.set("scrollTop",L);},_htmlEscapeMessage:function(L){L.message=this._encodeHTML(L.message);L.source=this._encodeHTML(L.source);L.sourceAndDetail=this._encodeHTML(L.sourceAndDetail);L.category=this._encodeHTML(L.category);return L;},_trimOldEntries:function(){d.config.debug=false;var ai=this._body,af=this.get("consoleLimit"),ag=d.config.debug,L,aj,ah,Y;if(ai){L=ai.all(x+Z);Y=L.size()-af;if(Y>0){if(this.get("newestOnTop")){ah=af;Y=L.size();}else{ah=0;}this._body.setStyle("display","none");for(;ah<Y;++ah){aj=L.item(ah);if(aj){aj.remove();}}this._body.setStyle("display","");}}d.config.debug=ag;},_encodeHTML:function(L){return m(L)?L.replace(aa,h).replace(j,M).replace(U,q):L;},_cancelPrintLoop:function(){if(this._printLoop){this._printLoop.cancel();this._printLoop=null;}},_validateStyle:function(L){return L==="inline"||L==="block"||L==="separate";},_onPauseClick:function(L){this.set(D,L.target.get(b));
},_onClearClick:function(L){this.clearConsole();},_onCollapseClick:function(L){this.set(s,!this.get(s));},_validateLogSource:function(L){return L&&d.Lang.isFunction(L.on);},_setLogLevel:function(L){if(m(L)){L=L.toLowerCase();}return(L===G||L===K)?L:o;},_getUseBrowserConsole:function(){var L=this.get("logSource");return L instanceof YUI?L.config.useBrowserConsole:null;},_setUseBrowserConsole:function(L){var Y=this.get("logSource");if(Y instanceof YUI){L=!!L;Y.config.useBrowserConsole=L;return L;}else{return d.Attribute.INVALID_VALUE;}},_uiSetHeight:function(L){u.superclass._uiSetHeight.apply(this,arguments);if(this._head&&this._foot){var Y=this.get("boundingBox").get("offsetHeight")-this._head.get("offsetHeight")-this._foot.get("offsetHeight");this._body.setStyle(H,Y+"px");}},_uiSizeCB:function(){},_afterStringsChange:function(af){var ah=af.subAttrName?af.subAttrName.split(x)[1]:null,L=this.get(B),Y=af.prevVal,ag=af.newVal;if((!ah||ah===P)&&Y.title!==ag.title){L.all(x+I).setHTML(ag.title);}if((!ah||ah===f)&&Y.pause!==ag.pause){L.all(x+v).setHTML(ag.pause);}if((!ah||ah===S)&&Y.clear!==ag.clear){L.all(x+ad).set("value",ag.clear);}},_afterPausedChange:function(Y){var L=Y.newVal;if(Y.src!==d.Widget.SRC_UI){this._uiUpdatePaused(L);}if(!L){this._schedulePrint();}else{if(this._printLoop){this._cancelPrintLoop();}}},_uiUpdatePaused:function(L){var Y=this._foot.all("input[type=checkbox]."+p);if(Y){Y.set(b,L);}},_afterConsoleLimitChange:function(){this._trimOldEntries();},_afterCollapsedChange:function(L){this._uiUpdateCollapsed(L.newVal);},_uiUpdateCollapsed:function(L){var ag=this.get("boundingBox"),Y=ag.all("button."+W),ah=L?"addClass":"removeClass",af=this.get("strings."+(L?"expand":"collapse"));ag[ah](r);if(Y){Y.setHTML(af);}this._uiSetHeight(L?this._head.get("offsetHeight"):this.get(H));},_afterVisibleChange:function(L){u.superclass._afterVisibleChange.apply(this,arguments);this._uiUpdateFromHideShow(L.newVal);},_uiUpdateFromHideShow:function(L){if(L){this._uiSetHeight(this.get(H));}},_onLogEvent:function(Y){if(!this.get(F)&&this._isInLogLevel(Y)){var L=d.config.debug;d.config.debug=false;this.fire(O,{message:this._normalizeMessage(Y)});d.config.debug=L;}},_defResetFn:function(){this.clearConsole();this.set(V,new Date());this.set(F,false);this.set(D,false);},_defEntryFn:function(L){if(L.message){this.buffer.push(L.message);this._schedulePrint();}}},{NAME:ae,LOG_LEVEL_INFO:o,LOG_LEVEL_WARN:G,LOG_LEVEL_ERROR:K,ENTRY_CLASSES:{entry_class:Z,entry_meta_class:t,entry_cat_class:T,entry_src_class:E,entry_time_class:a,entry_content_class:y},CHROME_CLASSES:{console_hd_class:C,console_bd_class:A,console_ft_class:c,console_controls_class:e,console_checkbox_class:z,console_pause_class:p,console_pause_label_class:v,console_button_class:w,console_clear_class:ad,console_collapse_class:W,console_title_class:I},HEADER_TEMPLATE:'<div class="{console_hd_class}">'+'<h4 class="{console_title_class}">{str_title}</h4>'+'<button type="button" class="'+'{console_button_class} {console_collapse_class}">{str_collapse}'+"</button>"+"</div>",BODY_TEMPLATE:'<div class="{console_bd_class}"></div>',FOOTER_TEMPLATE:'<div class="{console_ft_class}">'+'<div class="{console_controls_class}">'+'<label for="{id_guid}" class="{console_pause_label_class}">'+'<input type="checkbox" class="{console_checkbox_class} '+'{console_pause_class}" value="1" id="{id_guid}"> '+"{str_pause}</label>"+'<button type="button" class="'+'{console_button_class} {console_clear_class}">{str_clear}'+"</button>"+"</div>"+"</div>",ENTRY_TEMPLATE:n,ATTRS:{logEvent:{value:"yui:log",writeOnce:true,validator:m},logSource:{value:d,writeOnce:true,validator:function(L){return this._validateLogSource(L);}},strings:{valueFn:function(){return d.Intl.get("console");}},paused:{value:false,validator:i.isBoolean},defaultCategory:{value:o,validator:m},defaultSource:{value:"global",validator:m},entryTemplate:{value:n,validator:m},logLevel:{value:d.config.logLevel||o,setter:function(L){return this._setLogLevel(L);}},printTimeout:{value:100,validator:ac},printLimit:{value:50,validator:ac},consoleLimit:{value:300,validator:ac},newestOnTop:{value:true},scrollIntoView:{value:true},startTime:{value:new Date()},lastTime:{value:new Date(),readOnly:true},collapsed:{value:false},height:{value:"300px"},width:{value:"300px"},useBrowserConsole:{lazyAdd:false,value:false,getter:function(){return this._getUseBrowserConsole();},setter:function(L){return this._setUseBrowserConsole(L);}},style:{value:"separate",writeOnce:true,validator:function(L){return this._validateStyle(L);}}}});},"@VERSION@",{"requires":["yui-log","widget"],"skinnable":true,"lang":["en","es","ja"]});