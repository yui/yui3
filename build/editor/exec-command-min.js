YUI.add("exec-command",function(B){var A=function(){A.superclass.constructor.apply(this,arguments);};B.extend(A,B.Base,{_inst:null,command:function(E,D){var C=A.COMMANDS[E];if(C){return C.call(this,E,D);}else{return this._command(E,D);}},_command:function(E,D){var C=this.getInstance();try{C.config.doc.execCommand(E,false,D);}catch(F){}},getInstance:function(){if(!this._inst){this._inst=this.get("host").getInstance();}return this._inst;},initializer:function(){B.mix(this.get("host"),{execCommand:function(D,C){return this.exec.command(D,C);},_execCommand:function(D,C){return this.exec._command(D,C);}});}},{NAME:"execCommand",NS:"exec",ATTRS:{host:{value:false}},COMMANDS:{wrap:function(E,C){var D=this.getInstance();return(new D.Selection()).wrapContent(C);},inserthtml:function(E,C){var D=this.getInstance();return(new D.Selection()).insertContent(C);},insertandfocus:function(G,D){var F=this.getInstance(),C,E;D+=F.Selection.CURSOR;C=this.command("inserthtml",D);E=new F.Selection();E.focusCursor(true,true);return C;},insertbr:function(E){var D=this.getInstance(),F,C=new D.Selection();C.setCursor();F=C.getCursor();F.insert("<br>","before");C.focusCursor(true,false);return F.previous();},insertimage:function(D,C){return this.command("inserthtml",'<img src="'+C+'">');},addclass:function(E,C){var D=this.getInstance();return(new D.Selection()).getSelected().addClass(C);},removeclass:function(E,C){var D=this.getInstance();return(new D.Selection()).getSelected().removeClass(C);},forecolor:function(E,F){var D=this.getInstance(),C=new D.Selection(),G;if(!B.UA.ie){this._command("styleWithCSS","true");}if(C.isCollapsed){if(C.anchorNode&&(C.anchorNode.get("innerHTML")==="&nbsp;")){C.anchorNode.setStyle("color",F);G=C.anchorNode;}else{G=this.command("inserthtml",'<span style="color: '+F+'">'+D.Selection.CURSOR+"</span>");C.focusCursor(true,true);}return G;}else{return this._command(E,F);}if(!B.UA.ie){this._command("styleWithCSS",false);}},backcolor:function(E,F){var D=this.getInstance(),C=new D.Selection(),G;if(B.UA.gecko||B.UA.opera){E="hilitecolor";}if(!B.UA.ie){this._command("styleWithCSS","true");}if(C.isCollapsed){if(C.anchorNode&&(C.anchorNode.get("innerHTML")==="&nbsp;")){C.anchorNode.setStyle("backgroundColor",F);G=C.anchorNode;}else{G=this.command("inserthtml",'<span style="background-color: '+F+'">'+D.Selection.CURSOR+"</span>");C.focusCursor(true,true);}return G;}else{return this._command(E,F);}if(!B.UA.ie){this._command("styleWithCSS",false);}},hilitecolor:function(){return A.COMMANDS.backcolor.apply(this,arguments);},fontname:function(E,F){var D=this.getInstance(),C=new D.Selection(),G;if(C.isCollapsed){if(C.anchorNode&&(C.anchorNode.get("innerHTML")==="&nbsp;")){C.anchorNode.setStyle("fontFamily",F);G=C.anchorNode;}else{G=this.command("inserthtml",'<span style="font-family: '+F+'">'+D.Selection.CURSOR+"</span>");C.focusCursor(true,true);}return G;}else{return this._command("fontname",F);}},fontsize:function(F,G){var E=this.getInstance(),D=new E.Selection(),H,C;if(D.isCollapsed){H=this.command("inserthtml",'<font size="'+G+'">&nbsp;</font>');C=H.get("previousSibling");if(C&&C.get("nodeType")===3){if(C.get("length")<2){C.remove();}}D.selectNode(H.get("firstChild"),true,false);return H;}else{return this._command("fontsize",G);}}}});B.namespace("Plugin");B.Plugin.ExecCommand=A;},"@VERSION@",{skinnable:false,requires:["frame"]});