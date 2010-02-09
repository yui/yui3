YUI.add('frame', function(Y) {

    var Frame = function(o) {
        Frame.superclass.constructor.apply(this, arguments);
    };

    Y.extend(Frame, Y.Base, {
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
            var win, doc, res;
            if (this.get('type') == 'iframe') {
                this._iframe = Y.Node.create(Frame.HTML);
                this._iframe.setStyle('visibility', 'hidden');
                this.get('container').append(this._iframe);
                this._iframe.set('src', this.get('src'));
                res = this._resolveWinDoc();
                win = res.win;
                doc = res.doc;
            }
            if (this.get('type') == 'window') {
                win = window.open(this.get('src'), Y.guid(), 'menubar=1,resizable=1,width=450,height=550');
                doc = win.document;
                this._iframe = Y.one(win);
            }
            return {
                win: win,
                doc: doc
            }
        },
        _resolveWinDoc: function(c) {
            var config = (c) ? c : {};
            if (this.get('type') == 'iframe') {
                config.win = Y.Node.getDOMNode(this._iframe.get('contentWindow'));
                config.doc = Y.Node.getDOMNode(this._iframe.get('contentWindow.document'));
            }
            if (this.get('type') == 'window') {
                config.win = Y.Node.getDOMNode(this._iframe);
                config.doc = config.win.document;
            }
            return config;
        },
        _onDomEvent: function(e) {
            var xy = this._iframe.getXY(),
                node = this._instance.one('win');

            //Y.log('onDOMEvent: ' + e.type, 'info', 'frame');
            if (e.pageX && e.pageY) {
                e.frameX = xy[0] + e.pageX - node.get('scrollLeft');
                e.frameY = xy[1] + e.pageY - node.get('scrollTop');
            }
            this.publish(e.type, {
                stoppedFn: Y.bind(function(ev, domev) {
                    ev.halt();
                }, this, e),
                preventedFn: Y.bind(function(ev, domev) {
                    ev.preventDefault();
                }, this, e)
            });
            this.fire(e.type, e);
        },
        _setup: function() {
            if (!this._ready) {
                var inst = this.getInstance(),
                    fn = Y.bind(this._onDomEvent, this);
                
                Y.each(Y.Node.DOM_EVENTS, function(v, k) {
                    if (v === 1) {
                        inst.on(k, fn, inst.config.doc);
                    }
                });

                this._iframe.setStyle('visibility', 'visible');
                this._ready = true;
                this.fire('ready');
            }
        },
        _onContentReady: function(e) {
            var inst = this.getInstance(),
                args = Y.clone(this.get('use'));

            Y.log('On available for body of iframe', 'info', 'frame');
            if (e) {
                inst.config.doc = Y.Node.getDOMNode(e.target);
            }
            args.push(Y.bind(function() {
                Y.log('Callback from final internal use call', 'info', 'frame');
                this._setup();
            }, this));
            Y.log('Calling use on internal instance: ', 'info', 'frame');
            inst.use.apply(inst, args);
        },
        _instanceLoaded: function(inst) {
            this._instance = inst;
            if (this.get('type') == 'iframe') {
                this._instance.on('contentready', Y.bind(this._onContentReady, this), 'body');
            } else {
                this._iframe.on('load', Y.bind(this._onContentReady, this));
            }
            var html = '',
                doc = this._instance.config.doc;

            if (this.get('src').indexOf('javascript') === 0) {
                Y.log('Creating the document from a javascript URL', 'info', 'frame');
                html = Y.substitute(Frame.PAGE_HTML, {
                    CONTENT: this.get('content')
                });
                if (this.get('designMode')) {
                    doc.designMode = 'on';
                }
                Y.log('Injecting content into iframe', 'info', 'frame');
                doc.open();
                doc.write(html);
                doc.close();
            }
        },
        delegate: function(type, fn, cont, sel) {
            var inst = this.getInstance();
            if (!inst) {
                Y.log('Delegate events can not be attached until after the ready event has fired.', 'error', 'iframe');
                return false;
            }
            if (!sel) {
                sel = cont;
                cont = 'body';
            }
            return inst.delegate(type, fn, cont, sel);
        },
        getInstance: function() {
            return this._instance;
        },
        render: function() {
            var inst,
                res = this._create(),
                cb = Y.bind(function(i) {
                    Y.log('Internal instance loaded with node', 'info', 'frame');
                    this._instanceLoaded(i);
                }, this),
                args = Y.clone(this.get('use')),
                config = {
                    debug: false,
                    bootstrap: false,
                    win: res.win,
                    doc: res.doc
                },
                fn = Y.bind(function() {
                    Y.log('New Modules Loaded into main instance', 'info', 'frame');
                    config = this._resolveWinDoc(config);
                    inst = YUI(config);
                    Y.log('Creating new internal instance with node only', 'info', 'frame');
                    inst.use('node-base', cb);
                }, this);

            args.push(fn);

            Y.log('Adding new modules to main instance', 'info', 'frame');
            Y.use.apply(Y, args);
            return this;
        },
        initializer: function() {
        },
        destructor: function() {
        }
    }, {
        HTML: '<iframe border="0" frameBorder="0" marginWidth="0" marginHeight="0" leftMargin="0" topMargin="0" allowTransparency="true" width="100%" height="100%"></iframe>',
        PAGE_HTML: '<html><head><title></title><meta http-equiv="Content-Type" content="text/html; charset=UTF-8" /></head><body>{CONTENT}</body></html>',
        NAME: 'iframe',
        ATTRS: {
            src: {
                value: ((Y.UA.ie) ? 'javascript:false;' : 'javascript:;')
            },
            type: {
                value: 'iframe'
            },
            designMode: {
                value: false
            },
            content: {
                value: ''
            },
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

    Y.Frame = Frame;

}, '@VERSION@' ,{requires:['base', 'node', 'selector-css3'], skinnable:false });
