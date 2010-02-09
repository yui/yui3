YUI.add('frame', function(Y) {
    /**
     * Creates a wrapper around an iframe or a new window. It loads the content either from a local
     * file or from script and creates a local YUI instance bound to that new window and document.
     * @module frame
     */     
    /**
     * Creates a wrapper around an iframe or a new window. It loads the content either from a local
     * file or from script and creates a local YUI instance bound to that new window and document.
     * @class Frame
     * @extends Base
     * @constructor
     */

    var Frame = function() {
        Frame.superclass.constructor.apply(this, arguments);
    };

    Y.extend(Frame, Y.Base, {
        /**
        * @private
        * @property _frame
        * @description Internal Node reference to the iFrame or the window
        * @type Node
        */
        _iframe: null,
        /**
        * @private
        * @property _instance
        * @description Internal reference to the YUI instance bound to the iFrame or window
        * @type YUI
        */
        _instance: null,
        /**
        * @private
        * @property _ready
        * @description Flag set when the content of the frame or window is ready
        * @type Boolean
        */
        _ready: null,
        /**
        * @private
        * @method _create
        * @description Create the iframe or Window and get references to the Document & Window
        * @return Hash table containing references to the new Document & Window
        * @type Object
        */
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
        /**
        * @private
        * @method _resolveWinDoc
        * @description Resolves the document and window from an iframe or window instance
        * @param Object c The YUI Config to add the window and document to
        * @return Returns an Object hash of window and document references, if a YUI config was passed, it is returned.
        * @type Object
        */
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
        /**
        * @private
        * @method _onDomEvent
        * @description Generic handler for all DOM events fired by the iframe or window. This handler
        * takes the current EventFacade and augments it to fire on the Frame host. It adds two new properties
        * to the EventFacade called frameX and frameY which adds the scroll and xy position of the iframe
        * to the original pageX and pageY of the event so external nodes can be positioned over the frame.
        * @param EventFacade e
        */
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
        /**
        * @private
        * @method _setup
        * @description Binds DOM events, sets the iframe to visible and fires the ready event
        */
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
        /**
        * @private
        * @method _onContentReady
        * @description Called once the content is available in the frame/window and calls the final use call
        * on the internal instance so that the modules are loaded properly.
        */
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
        /**
        * @private
        * @method _instanceLoaded
        * @description Called from the first YUI instance that sets up the internal instance.
        * This loads the content into the window/frame and attaches the contentready event.
        * @param YUI inst The internal YUI instance bound to the frame/window
        */
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
        /**
        * @method delegate
        * @description A delegate method passed to the instance's delegate method
        * @param String type The type of event to listen for
        * @param Function fn The method to attach
        * @param String cont The container to act as a delegate, if no "sel" passed, the body is assumed as the container.
        * @param String sel The selector to match in the event (optional)
        * @return EventHandle
        */
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
        /**
        * @method getInstance
        * @description Get a reference to the internal YUI instance.
        * @return YUI The internal YUI instance
        */
        getInstance: function() {
            return this._instance;
        },
        /**
        * @method render
        * @description Render the iframe into the container config option or open the window.
        * @param String/HTMLElement/Node The node to render to
        * @return self
        * @chainable
        */
        render: function(node) {
            if (node) {
                this.set('container', node);
            }
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
        }
    }, {
        /**
        * @static
        * @property HTML
        * @description The template string used to create the iframe
        * @type String
        */
        HTML: '<iframe border="0" frameBorder="0" marginWidth="0" marginHeight="0" leftMargin="0" topMargin="0" allowTransparency="true" width="100%" height="100%"></iframe>',
        /**
        * @static
        * @property PAGE_HTML
        * @description The template used to create the page when created dynamically.
        * @type String
        */
        PAGE_HTML: '<html><head><title></title><meta http-equiv="Content-Type" content="text/html; charset=UTF-8" /></head><body>{CONTENT}</body></html>',
        /**
        * @static
        * @property NAME
        * @description The name of the class
        * @type String
        */
        NAME: 'iframe',
        ATTRS: {
            /**
            * @config src
            * @description The src of the iframe/window. Defaults to javascript:;
            * @type String
            */
            src: {
                value: ((Y.UA.ie) ? 'javascript:false;' : 'javascript:;')
            },
            /**
            * @config type
            * @description The type of frame to make. (iframe or window)
            * @type String
            */
            type: {
                value: 'iframe'
            },
            /**
            * @config designMode
            * @description Should designMode be turned on after creation.
            * @type Boolean
            */
            designMode: {
                writeOnce: true,
                value: false
            },
            /**
            * @config content
            * @description The string to inject into the body of the new frame/window.
            * @type String
            */
            content: {
                value: '<br>'
            },
            /**
            * @config use
            * @description Array of modules to include in the scoped YUI instance. Default: ['none', 'selector-css2']
            * @type Array
            */
            use: {
                value: ['node', 'selector-css3']
            },
            /**
            * @config container
            * @description The container to append the iFrame to on render.
            * @type String/HTMLElement/Node
            */
            container: {
                value: 'body',
                setter: function(n) {
                    return Y.one(n);
                }
            },
            /**
            * @config id
            * @description Set the id of the new Node. (optional)
            * @type String
            */
            id: {
                getter: function(id) {
                    if (!id) {
                        id = 'iframe-' + Y.guid();
                    }
                    return id;
                }
            }
        }
    });

    Y.Frame = Frame;

}, '@VERSION@' ,{requires:['base', 'node', 'selector-css3'], skinnable:false });
