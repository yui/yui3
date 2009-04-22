YUI.add('dd-proxy', function(Y) {

    /**
     * The Drag & Drop Utility allows you to create a draggable interface efficiently, buffering you from browser-level abnormalities and enabling you to focus on the interesting logic surrounding your particular implementation. This component enables you to create a variety of standard draggable objects with just a few lines of code and then, using its extensive API, add your own specific implementation logic.
     * @module dd
     * @submodule dd-proxy
     */
    /**
     * This class extends dd-drag to allow for creating a proxy drag node, instead of dragging the original node.
     * @for Drag
     */
    var DDM = Y.DD.DDM,
        NODE = 'node',
        DRAG_NODE = 'dragNode',
        PROXY = 'proxy',
        ATTRS = Y.DD.Drag.ATTRS,
        PATTRS = {
            /**
            * @attribute moveOnEnd
            * @description Move the original node at the end of the drag. Default: true
            * @type Boolean
            */
            moveOnEnd: {
                value: true
            },
            /**
            * @attribute resizeFrame
            * @description Make the Proxy node assume the size of the original node. Default: true
            * @type Boolean
            */
            resizeFrame: {
                value: true
            },
            /**
            * @attribute positionProxy
            * @description Make the Proxy node appear in the same place as the original node. Default: true
            * @type Boolean
            */
            positionProxy: {
                value: true
            },
            /**
            * @attribute borderStyle
            * @description The default border style for the border of the proxy. Default: 1px solid #808080
            * @type Boolean
            */
            borderStyle: {
                value: '1px solid #808080'
            },
            /**
            * @attribute proxy
            * @description Make this Draggable instance a Proxy instance. Default: false
            * @type Boolean
            */
            proxy: {
                value: false,
                setter: function(v) {
                    this._setProxy(v);
                    return v;
                }
            }
        };
    Y.mix(PATTRS, ATTRS);
    Y.DD.Drag.ATTRS = PATTRS;

    //Add a couple of methods
    Y.mix(Y.DD.Drag.prototype, {
        /**
        * @private
        * @property _proxyHandles
        * @description Holds the event handles for setting the proxy
        */
        _proxyHandles: null,
        /**
        * @private
        * @method _setProxy
        * @description Handler for the proxy config attribute
        */
        _setProxy: function(v) {
            if (!this._proxyHandles) {
                this._proxyHandles = [];
            }
            if (!DDM._proxy) {
                Y.on('event:ready', Y.bind(this._setProxy, this, v));
                return;
            }
            if (v) {
                console.log(this);
                if (this.get(DRAG_NODE).compareTo(this.get(NODE))) {
                    if (DDM._proxy) {
                        this.set(DRAG_NODE, DDM._proxy);
                    }
                }
                for (var i in this._proxyHandles) {
                    this._proxyHandles[i].detach();
                }
                var h = DDM.on('ddm:start', Y.bind(function() {
                    if (DDM.activeDrag === this) {
                        DDM._setFrame(this);
                    }
                }, this));
                var h1 = DDM.on('ddm:end', Y.bind(function() {
                    if (this.get(PROXY) && this.get('dragging')) {
                        if (this.get('moveOnEnd')) {
                            this.get(NODE).setXY(this.lastXY);
                        }
                        this.get(DRAG_NODE).setStyle('display', 'none');
                    }
                }, this));
                this._proxyHandles = [h, h1];
            } else {
                for (var i in this._proxyHandles) {
                    this._proxyHandles[i].detach();
                }
                this.set(DRAG_NODE, this.get(NODE));
            }
        }
    });
    
    //Add a couple of methods to the DDM
    Y.mix(DDM, {
        /**
        * @private
        * @for DDM
        * @method _createFrame
        * @description Create the proxy element if it doesn't already exist and set the DD.DDM._proxy value
        */
        _createFrame: function() {
            if (!Y.DD.DDM._proxy) {
                Y.DD.DDM._proxy = true;

                var p = Y.Node.create('<div></div>'),
                b = Y.Node.get('body');

                p.setStyles({
                    position: 'absolute',
                    display: 'none',
                    zIndex: '999',
                    top: '-999px',
                    left: '-999px'
                });

                b.insertBefore(p, b.get('firstChild'));
                p.set('id', Y.stamp(p));
                p.addClass(Y.DD.DDM.CSS_PREFIX + '-proxy');
                Y.DD.DDM._proxy = p;
            }
        },
        /**
        * @private
        * @for DDM
        * @method _setFrame
        * @description If resizeProxy is set to true (default) it will resize the proxy element to match the size of the Drag Element.
        * If positionProxy is set to true (default) it will position the proxy element in the same location as the Drag Element.
        */
        _setFrame: function(drag) {
            var n = drag.get(NODE), ah, cur = 'auto';
            if (drag.get('resizeFrame')) {
                DDM._proxy.setStyles({
                    height: n.get('offsetHeight') + 'px',
                    width: n.get('offsetWidth') + 'px'
                });
            }
            
            ah = DDM.activeDrag.get('activeHandle');
            if (ah) {
                cur = ah.getStyle('cursor');
            }
            if (cur == 'auto') {
                cur = DDM.get('dragCursor');
            }


            drag.get(DRAG_NODE).setStyles({
                visibility: 'hidden',
                display: 'block',
                cursor: cur,
                border: drag.get('borderStyle')
            });



            if (drag.get('positionProxy')) {
                drag.get(DRAG_NODE).setXY(drag.nodeXY);
            }
            drag.get(DRAG_NODE).setStyle('visibility', 'visible');
        }
    });

    //Create the frame when DOM is ready
    Y.on('event:ready', Y.bind(Y.DD.DDM._createFrame, Y.DD.DDM));

}, '@VERSION@' ,{requires:['dd-ddm', 'dd-drag'], skinnable:false});
