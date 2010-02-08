YUI.add('iframe', function(Y) {

    var IFrame = function(o) {
        IFrame.superclass.constructor.apply(this, arguments);
    };

    Y.extend(IFrame, Y.Base, {
        _iframe: null,
        _instance: null,
        _ready: null,
        appendTo: function(n) {
            if (this._ready) {
                n = Y.one(n);
                n.append(this._iframe);
            } else {
                this.on('ready', Y.bind(function(n) {
                    n = Y.one(n);
                    n.append(this._iframe);
                }, this, n));
            }
        },
        _create: function() {
            this._iframe = Y.Node.create(IFrame.HTML);
            this._iframe.setStyle('visibility', 'hidden');
            this.get('container').append(this._iframe);
            
            var inst,
            cb = Y.bind(function(i) {
                //console.info('Internal instance loaded with node: ', inst, this);
                this._instanceLoaded(inst);
            }, this),
            args = Y.clone(this.get('use')),
            config = {
                debug: false,
                bootstrap: false,
                win: this._iframe._node.contentWindow,
                doc: this._iframe._node.contentWindow.document
            };

            var fn = function() {
                //console.info('New Modules Loaded into main instance');
                //console.log(config);
                inst = YUI(config);
                //console.log('Creating new internal instance with node only: ', inst.id, inst);
                inst.use('node', cb);
            };

            args.push(fn);

            //console.info('Adding new modules to main instance: ', args);
            Y.use.apply(Y, args);
        },
        _onDomEvent: function(e) {
            var xy = this._iframe.getXY(),
                node = this._instance.one('win');
            //console.log('onDOMEvent: ', e.type, e);
            if (e.pageX && e.pageY) {
                e.frameX = xy[0] + e.pageX - node.get('scrollLeft');
                e.frameY = xy[1] + e.pageY - node.get('scrollTop');
            }
            this.publish(e.type, {
                stoppedFn: Y.bind(function(ev, domev) {
                    console.log('stopped: ', arguments);
                    domev.halt();
                }, this, e),
                preventedFn: function() {
                    console.log('prevented: ', arguments);
                }
            });
            this.fire(e.type, e);
        },
        _setup: function() {
            var events = [
                'click',
                'mousedown',
                'mouseup',
                'dblclick',
                'keydown',
                'keyup',
                'keypress',
                'contextmenu',
                'mousemove'
            ];
            this._instance.on(events, Y.bind(this._onDomEvent, this), this._instance.config.doc);
        },
        _instanceLoaded: function(inst) {
            this._instance = inst;
            
            this._instance.on('available', Y.bind(function() {
                //console.log('On available for body of iframe');
                var args = Y.clone(this.get('use'));
                args.push(Y.bind(function() {
                    //console.info('Callback from final internal use call');
                    this._setup();
                    this._iframe.setStyle('visibility', 'visible');
                    this._ready = true;
                    this.fire('ready');
                }, this));
                //console.info('Calling use on internal instance: ', args);
                this._instance.use.apply(this._instance, args);
                
            }, this), 'body');

            var html = Y.substitute(IFrame.PAGE_HTML, {
                CONTENT: Y.one('#stub').get('innerHTML')
            });
            //console.info('Injecting content into iframe');
            doc = this._instance.config.doc;
            doc.open();
            doc.write(html);
            doc.close();

        },
        getInstance: function() {
            return this._instance;
        },
        render: function() {
            this._create();
            return this;
        },
        initializer: function() {
        },
        destructor: function() {
        }
    }, {
        HTML: '<iframe src="javascript:;" border="0" frameBorder="0" marginWidth="0" marginHeight="0" leftMargin="0" topMargin="0" allowTransparency="true" width="100%" height="100%"></iframe>',
        PAGE_HTML: '<html><head><title></title><meta http-equiv="Content-Type" content="text/html; charset=UTF-8" /></head><body>{CONTENT}</body></html>',
        NAME: 'iframe',
        ATTRS: {
            use: {
                value: ['node', 'selector-css3']
            },
            container: {
                value: 'body',
                setter: function(n) {
                    return Y.one(n);
                }
            },
            id: {
                getter: function(id) {
                    if (!id) {
                        id = Y.guid();
                    }
                    if (id.indexOf('iframe') !== 0) {
                        id = 'iframe-' + id;
                    }
                    return id;
                }
            }
        }
    });

    Y.IFrame = IFrame;

}, '@VERSION@' ,{requires:['base', 'node', 'selector-css3'], skinnable:false });
