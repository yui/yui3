var ResizePlugin = function(config) {

                //if its a widget, get the bounding box
                //config.node = ((Y.Widget && config.host instanceof Y.Widget) ? config.host.get('boundingBox') : config.host);
                ResizePlugin.superclass.constructor.apply(this, arguments);
                //var tmpclass = Y.Base.create("resize-plugin", Y.Resize, [Y.Plugin.Base]),
                //tmpinstance = new tmpclass(config);
                //tmpclass.NS = "tmpClass";
                //return tmpinstance;
        };
        
        /**
        * @property NAME
        * @description dd-plugin
        * @type {String}
        */
        ResizePlugin.NAME = "resize-plugin";

        /**
        * @property NS
        * @description The Drag instance will be placed on the Node instance under the dd namespace. It can be accessed via Node.dd;
        * @type {String}
        */
        ResizePlugin.NS = "resize";

        ResizePlugin.ATTRS = {
            resizableNode: {
                value: undefined
            },

            node: {
                value: undefined
            }
        };


        Y.extend(ResizePlugin, Y.Plugin.Base, {

                isWidget: undefined,

                initializer: function(config) {
                        var self = this,
                        host = this.get('host');

                        if (host instanceof Y.Widget) {
                            this.isWidget = true;
                            this.set('node', host.get('boundingBox'));
                        }
                        else {
                            this.set('node', host);
                        }

                        this.set('resizableNode', new Y.Resize({
                            node: self.get('node')
                        }));

                        var resizableNode = this.get('resizableNode');

                        resizableNode.on('resize:resize', function(e) {
                                //this.fire("resize", e);
                                self._correctDimensions(e);
                        });


                
                },

                _correctDimensions: function(e) {
                        
                        var node = this.get('node'),
                        x = {
                            old: node.getX(),
                            current: e.currentTarget.info.left
                        },
                        y = {
                            old: node.getY(),
                            current: e.currentTarget.info.top
                        };

                        
                        if (this.isWidget) {
                            this._setWidgetProperties(e, x, y);
                        }

                        //now set properties on just the node or the widget's bounding box
                        if (this._isDifferent(x.old, x.current)) {
                            node.set('x', x.current);
                        }

                        if (this._isDifferent(y.old, y.current)) {
                            node.set('y', y.current);
                        }
                },




                //If the host is a widget, then set the width, height. Then look for widgetPosition and set x,y
                _setWidgetProperties: function(e,x,y) {
                    //all widgets have width/height attrs. change these only if they differ from the old values

                    var widget = this.get('host'),
                    oldHeight = widget.get('height'),
                    oldWidth = widget.get('width'),
                    currentWidth = e.currentTarget.info.offsetWidth,
                    currentHeight = e.currentTarget.info.offsetHeight;

                    if (this._isDifferent(oldHeight, currentHeight)) {
                        widget.set('height', currentHeight);
                    }

                    if (this._isDifferent(oldWidth, currentWidth)) {
                        widget.set('width', currentWidth);
                    }

                    

                    //If the widget uses Y.WidgetPosition, it will also have x,y position support. 
                    if (widget.hasImpl && widget.hasImpl(Y.WidgetPosition)) {

                        // console.log('new values: ' + x.current + ', ' + y.current);
                        // console.log('old values: ' + x.old + ', ' + y.old);
                        if (this._isDifferent(x.old, x.current)) {
                            widget.set('x', x.current);
                        }

                        if (this._isDifferent(y.old, y.current)) {
                            widget.set('y', y.current);
                        }

                    }
                },

                //just a little utility method that returns a value if the old !== new, otherwise it returns false.
                _isDifferent: function(oldVal, newVal) {
                    if (oldVal !== newVal) {
                        return newVal;
                    }
                    else {
                        return false;
                    }
                },


        });
        Y.namespace('Plugin');
        Y.Plugin.Resize = ResizePlugin;