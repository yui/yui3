YUI.add("base-observable",function(e,t){function a(){}var n=e.Lang,r="destroy",i="init",s="bubbleTargets",o="_bubbleTargets",u=e.AttributeObservable;a._ATTR_CFG=u._ATTR_CFG.concat(),a._NON_ATTRS_CFG=["on","after","bubbleTargets"],a.prototype={_initAttribute:function(t){e.BaseCore.prototype._initAttribute.apply(this,arguments),e.AttributeObservable.call(this),this._eventPrefix=this.constructor.EVENT_PREFIX||this.constructor.NAME,this._yuievt.config.prefix=this._eventPrefix},init:function(e){return this.publish(i,{queuable:!1,fireOnce:!0,defaultTargetOnly:!0,defaultFn:this._defInitFn}),this._preInitEventCfg(e),this.fire(i,{cfg:e}),this},_preInitEventCfg:function(e){e&&(e.on&&this.on(e.on),e.after&&this.after(e.after));var t,r,i,u=e&&s in e;if(u||o in this){i=u?e&&e.bubbleTargets:this._bubbleTargets;if(n.isArray(i))for(t=0,r=i.length;t<r;t++)this.addTarget(i[t]);else i&&this.addTarget(i)}},destroy:function(){return this.publish(r,{queuable:!1,fireOnce:!0,defaultTargetOnly:!0,defaultFn:this._defDestroyFn}),this.fire(r),this.detachAll(),this},_defInitFn:function(e){this._baseInit(e.cfg)},_defDestroyFn:function(e){this._baseDestroy(e.cfg)}},e.mix(a,u,!1,null,1),e.BaseObservable=a},"@VERSION@",{requires:["attribute-observable"]});
