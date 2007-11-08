(function() {
var Dom = YAHOO.util.Dom,
    Event = YAHOO.util.Event,
    Lang = YAHOO.lang;

    var Resize = function(el, config) {
        var oConfig = {
            element: el,
            attributes: config
        };
        this.constructor.superclass.constructor.call(this, oConfig.element, oConfig.attributes);
    };

    YAHOO.extend(Resize, YAHOO.util.Object, {
        dd: null,
        _wrap: null,
        _proxy: null,
        _handles: null,
        _cache: {
            xy: [],
            height: 0,
            width: 0,
            start: {
                height: 0,
                width: 0
            }
        },
        _active: false,
        _createProxy: function() {
            if (this.get('proxy')) {
                this._proxy = document.createElement('div');
                this._proxy.className = 'yui-resize-proxy';
                this._proxy.style.height = this.__.node.clientHeight + 'px';
                this._proxy.style.width = this.__.node.clientWidth + 'px';
                document.body.appendChild(this._proxy);

                var xy = Dom.getXY(this.__.node);
                Dom.setXY(this._proxy, xy);
            } else {
                this.set('animate', false);
            }
        },
        _createWrap: function() {
            if (this.get('wrap')) {
                this._wrap = document.createElement('div');
                this._wrap.className = 'yui-resize-wrap';
                Dom.setStyle(this._wrap, 'width', this.get('width'));
                Dom.setStyle(this._wrap, 'height', this.get('height'));
                var par = this.__.node.parentNode;
                par.replaceChild(this._wrap, this.__.node);
                this._wrap.appendChild(this.__.node);
            } else {
                this._wrap = this.__.node;
            }
            Dom.addClass(this._wrap, 'yui-resize');
        },
        _createHandles: function() {
            this._handles = {};
            var h = this.get('handles');
            for (var i = 0; i < h.length; i++) {
                this._handles[h[i]] = document.createElement('div');
                this._handles[h[i]].className = 'yui-resize-handle yui-resize-handle-' + h[i];
                this._wrap.appendChild(this._handles[h[i]]);
                Event.on(this._handles[h[i]], 'mousedown', this._handleMouseDown, this, true);
                Event.on(this._handles[h[i]], 'mouseover', this._handleMouseOver, this, true);
                Event.on(this._handles[h[i]], 'mouseout', this._handleMouseOut, this, true);
            }
        },
        _handleMouseOver: function(ev) {
            var tar = Event.getTarget(ev);
            if (Dom.hasClass(tar, 'yui-resize-handle') && !this._active) {
                Dom.addClass(tar, 'yui-resize-handle-active');
            }
        },
        _handleMouseOut: function(ev) {
            var tar = Event.getTarget(ev);
            if (Dom.hasClass(tar, 'yui-resize-handle') && !this._active) {
                Dom.removeClass(tar, 'yui-resize-handle-active');
            }
        },
        _handleMouseDown: function(ev) {
            var tar = Event.getTarget(ev);
            if (Dom.hasClass(tar, 'yui-resize-handle')) {
                this._active = true;

                if (this._proxy) {
                    this._proxy.style.visibility = 'visible';
                    this._proxy.style.zIndex = '1000';
                }

                for (var i in this._handles) {
                    if (Lang.hasOwnProperty(this._handles, i)) {
                        if (this._handles[i] == tar) {
                            this._currentHandle = i;
                            break;
                        }
                    }
                }

                Dom.addClass(tar, 'yui-resize-handle-active');

                if (this.get('proxy')) {
                    var xy = Dom.getXY(this.__.node);
                    Dom.setXY(this._proxy, xy);
                }

                var self = this;
                this.dd = new YAHOO.util.DragDrop(tar);
                this.dd.handleMouseDown(ev);
                Dom.addClass(this._wrap, 'yui-resize-resizing');
                this._cache.xy = Dom.getXY(this._wrap);
                this._cache.height = this.get('clientHeight');
                this._cache.width = this.get('clientWidth');
                if (!this._cache.start.height) {
                    this._cache.start.height = this._cache.height;
                    this._cache.start.width = this._cache.width;
                }
                

                var handle = '_handle_for_' + this._currentHandle;
                this.dd.onDrag = function() {
                    self[handle].call(self, arguments);
                };
                this.dd.onMouseUp = function() {
                    self._onMouseUp.call(self, arguments);
                };
            }
        },
        _setRatio: function(h, w) {
            if (this.get('ratio')) {
                var orgH = parseInt(this.get('height'), 10),
                    orgW = parseInt(this.get('width'), 10),
                    minH = this.get('minHeight'),
                    minW = this.get('minWidth'),
                    maxH = this.get('maxHeight'),
                    maxW = this.get('maxWidth');
                switch (this._currentHandle) {
                    case 'r':
                        h = this._cache.height;
                        //h = h * (w / orgW);
                        //h = Math.min(Math.max(minH, h), maxH);
                        //w = w * (h / orgH);
                        break;
                    case 'br':
                        h = h * (w / orgW);
                        h = Math.min(Math.max(minH, h), maxH);
                        w = w * (h / orgH);
                        break;
                }

            }
            return [h, w];
        },
        reset: function() {
            this.resize(this._cache.start.height, this._cache.start.width, true);
        },
        resize: function(h, w, force) {
            var el = this._wrap, anim = this.get('animate');
            if (this._proxy && !force) {
                el = this._proxy;
                anim = false;
            }

            var ratio = this._setRatio(h, w);
            h = ratio[0];
            w = ratio[1];

            if (h) {
                if (!anim) {
                    el.style.height = h + 'px';
                    if ((this._proxy && force) || !this._proxy) {
                        if (this._wrap != this.__.node) {
                            this.__.node.style.height = h + 'px';
                        }
                    }
                }
                this._cache.height = h;
            }
            if (w) {
                if (!anim) {
                    el.style.width = w + 'px';
                    if ((this._proxy && force) || !this._proxy) {
                        if (this._wrap != this.__.node) {
                            this.__.node.style.width = w + 'px';
                        }
                    }
                }
                this._cache.width = w;
            }
            if (anim) {
                if (YAHOO.util.Anim) {
                    var _anim = new YAHOO.util.Anim(el, {
                        height: {
                            to: this._cache.height
                        },
                        width: {
                            to: this._cache.width
                        }
                    }, this.get('animateDuration'), this.get('animateEasing'));

                    if (this._wrap != this.__.node) {
                        _anim.onTween.subscribe(function() {
                            this.__.node.style.height = el.style.height;
                            this.__.node.style.width = el.style.width;
                        }, this, true);
                    }

                    _anim.onComplete.subscribe(function() {
                        this.set('height', h + 'px');
                        this.set('width', w + 'px');
                        this.fireEvent('resize', { ev: 'resize', target: this, height: h, width: w });
                    }, this, true);
                    _anim.animate();

                }
            } else {
                if (this._proxy && !force) {
                    this.fireEvent('proxyResize', { ev: 'proxyresize', target: this, height: h, width: w });
                } else {
                    this.fireEvent('resize', { ev: 'resize', target: this, height: h, width: w });
                }
            }
        },
        _handle_for_br: function(args) {
            var newW = this._setWidth(args[0]);
            var newH = this._setHeight(args[0]);
            this.resize(newH, newW);
        },
        _handle_for_bl: function(args) {
            var newW = this._setWidth(args[0], true);
            var newH = this._setHeight(args[0]);
            this.resize(newH, newW);
        },
        _handle_for_tl: function(args) {
            var newW = this._setWidth(args[0], true);
            var newH = this._setHeight(args[0], true);
            this.resize(newH, newW);
        },
        _handle_for_tr: function(args) {
            var newW = this._setWidth(args[0]);
            var newH = this._setHeight(args[0], true);
            this.resize(newH, newW);
        },
        _handle_for_r: function(args) {
            this.dd.setYConstraint(0,0);
            var newW = this._setWidth(args[0]);
            var newH = this._setHeight(args[0]);
            this.resize(0, newW);
        },
        _handle_for_l: function(args) {
            this.dd.setYConstraint(0,0);
            var newW = this._setWidth(args[0], true);
            this.resize(0, newW);
        },
        _handle_for_b: function(args) {
            this.dd.setXConstraint(0,0);
            var newH = this._setHeight(args[0]);
            this.resize(newH, 0);
        },
        _handle_for_t: function(args) {
            this.dd.setXConstraint(0,0);
            var newH = this._setHeight(args[0], true);
            this.resize(newH, 0);
        },
        _setWidth: function(ev, flip) {
            var xy = this._cache.xy[0],
                w = this._cache.width,
                x = Event.getPageX(ev),
                nw = (x - xy);
                if (flip) {
                    nw = (xy - x) + parseInt(this.get('width'), 10);
                    if ((xy - x) < 0) {
                        nw = parseInt(this.get('width'), 10);
                    }
                }
                
                if (this.get('minWidth')) {
                    if (nw <= this.get('minWidth')) {
                        nw = this.get('minWidth');
                    }
                }
                if (this.get('maxWidth')) {
                    if (nw >= this.get('maxWidth')) {
                        nw = this.get('maxWidth');
                    }
                }
            return nw;
        },
        _setHeight: function(ev, flip) {
            var xy = this._cache.xy[1],
                h = this._cache.height,
                y = Event.getPageY(ev),
                nh = (y - xy);

                if (flip) {
                    nh = (xy - y) + parseInt(this.get('height'), 10);
                    if ((xy - y) < 0) {
                        nh = parseInt(this.get('height'), 10);
                    }
                }

                if (this.get('minHeight')) {
                    if (nh <= this.get('minHeight')) {
                        nh = this.get('minHeight');
                    }
                }
                if (this.get('maxHeight')) {
                    if (nh >= this.get('maxHeight')) {
                        nh = this.get('maxHeight');
                    }
                }
         
            return nh;
        },
        _onMouseUp: function() {
            this._active = false;
            this._handles[this._currentHandle].style.top = '';
            this._handles[this._currentHandle].style.left = '';
            if (!this.get('animate')) {
                this.set('height', this._cache.height + 'px');
                this.set('width', this._cache.width + 'px');
            }
            Dom.removeClass(this._handles[this._currentHandle], 'yui-resize-handle-active');

            this._currentHandle = null;

            if (this._proxy) {
                this._proxy.style.visibility = 'hidden';
                this._proxy.style.zIndex = '-1';
                this.resize(this._cache.height, this._cache.width, true);
            }

            Dom.removeClass(this._wrap, 'yui-resize-resizing');
        },
        initializer: function(config) {
            this.__.parent = config.parent;
            this.__.node = config.parent.get('node').get('node');

            YAHOO.log('init', 'info', 'Resize');

            //Resize.superclass.init.call(this, p_oElement, p_oAttributes);
            if (!this.__.parent._.rendered) {            
                this.__.parent.on('beforeRender', function() {
                    this.initAttributes(config);
                    this._createWrap();
                    this._createHandles();
                    this._createProxy();
                }, this, true);
            } else {
                this.initAttributes(config);
                this._createWrap();
                this._createHandles();
                this._createProxy();
            }
        },
        initAttributes: function(attr) {
            this.setAttributeConfig('wrap', {
                writeOnce: true,
                value: attr.wrap || false
            });

            this.setAttributeConfig('handles', {
                writeOnce: true,
                value: attr.handles || ['r', 'b', 'br']
            });

            this.setAttributeConfig('width', {
                value: attr.width || false,
                method: function(width) {
                    this.setStyle('width', width);
                }
            });

            this.setAttributeConfig('height', {
                value: attr.height || false,
                method: function(height) {
                    this.setStyle('height', height);
                }
            });

            this.setAttributeConfig('minWidth', {
                value: attr.minWidth || 5
            });

            this.setAttributeConfig('minHeight', {
                value: attr.minHeight || 5
            });

            this.setAttributeConfig('maxWidth', {
                value: attr.maxWidth || 10000
            });

            this.setAttributeConfig('maxHeight', {
                value: attr.maxHeight || 10000
            });

            this.setAttributeConfig('animate', {
                value: attr.animate || false,
                validator: function(value) {
                    var ret = true;
                    if (!YAHOO.util.Anim) {
                        ret = false;
                    }
                    return ret;
                }               
            });

            this.setAttributeConfig('animateEasing', {
                value: attr.animateEasing || function() {
                    var easing = false;
                    try {
                        easing = YAHOO.util.Easing.easeOut;
                    } catch (e) {}
                    return easing;
                }()
            });

            this.setAttributeConfig('animateDuration', {
                value: attr.animateDuration || .5
            });

            this.setAttributeConfig('proxy', {
                value: attr.proxy || false
            });

            this.setAttributeConfig('ratio', {
                value: attr.ratio || false
            });

        },
        destroy: function() {
            for (var i in this._handles) {
                if (Lang.hasOwnProperty(this._handles, i)) {
                    Event.purgeElement(this._handles[i]);
                    this._handles[i].parentNode.removeChild(this._handles[i]);
                }
            }
            if (this.get('proxy')) {
                this._proxy.parentNode.removeChild(this._proxy);
            }
            if (this._wrap != this.__.node) {
                this._wrap.parentNode.replaceChild(this._wrap, this.__.node);
            }
            Dom.removeClass(this.__.node, 'yui-resize');      
        },
        toString: function() {
            return 'Resize (#' + this.get('id') + ')';
        }
    });

    YAHOO.util.Resize = Resize;
    
})();

