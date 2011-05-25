YUI.add('shape-anim', function(Y) {

       /**
        * Simple plugin that can be used to animate object attributes.
        *
        * @module anim
        * @submodule shape-anim
        */
        var NUM = Number,
            NODE = "node",
       /**
        * Simple plugin that can be used to animate an object attributes.
        *
        * @class ShapeAnim
        * @extends Anim
        * @constructor
        * @namespace Plugin
        */
        Anim = function(config) {
            config.node = config.host;
            Anim.superclass.constructor.call(this, config);
        };
        
        /**
         * @property NAME
         * @description anim-plugin
         * @type {String}
         */
        Anim.NAME = "shape-anim";

        /**
         * @property NS
         * @description The Anim instance will be placed on the target instance under the anim namespace. It can be accessed via [target].anim;
         * @type {String}
         */
        Anim.NS = "anim";
       
        /**
         * The default setter to use when setting object properties.
         *
         * @property DEFAULT_SETTER
         * @static
         */
        Anim.DEFAULT_SETTER = function(anim, att, from, to, elapsed, duration, fn, unit) {
            var node = anim._node,
                domNode = node._node,
                val = fn(elapsed, NUM(from), NUM(to) - NUM(from), duration);

            if (domNode && (domNode.style || domNode.attributes)) {
                if (att in domNode.style || att in Y.DOM.CUSTOM_STYLES) {
                    unit = unit || '';
                    node.setStyle(att, val + unit);
                } else if (domNode.attributes[att]) {
                    node.setAttribute(att, val);
                }
            } else if (node.set) {
                node.set(att, val);
            }
        };

        /**
         * The default getter to use when getting object properties.
         *
         * @property DEFAULT_GETTER
         * @static
         */
        Anim.DEFAULT_GETTER = function(anim, att) {
            var node = anim._node,
                domNode = node._node,
                val = '';

            if (domNode && (domNode.style || domNode.attributes)) {
                if (att in domNode.style || att in Y.DOM.CUSTOM_STYLES) {
                    val = node.getComputedStyle(att);
                } else if (domNode.attributes[att]) {
                    val = node.getAttribute(att);
                }
            } else if (node.get) {
                val = node.get(att);
            }

            return val;
        };


        Anim.ATTRS = {
            /**
             * The object to be animated.
             * @attribute node
             * @type Node
             */
            node: {
                setter: function(node) {
                    if (node) {
                        if (typeof node == 'string' || node.nodeType) {
                            node = Y.one(node);
                        }
                    }
                    this._node = node;
                    if (!node) {
                        Y.log(node + ' is not a valid node', 'warn', 'Anim');
                    }
                    return node;
                }
            }
        };
        
        Y.extend(Anim, Y.Anim, {
            _initAnimAttr: function() {
                var from = this.get('from') || {},
                    to = this.get('to') || {},
                    attr = {
                        duration: this.get('duration') * 1000,
                        easing: this.get('easing')
                    },
                    customAttr = Y.Anim.behaviors,
                    node = this.get(NODE), // implicit attr init
                    unit, begin, end;

                Y.each(to, function(val, name) {
                    if (typeof val === 'function') {
                        val = val.call(this, node);
                    }

                    begin = from[name];
                    if (begin === undefined) {
                        begin = (name in customAttr && 'get' in customAttr[name])  ?
                                customAttr[name].get(this, name) : Anim.DEFAULT_GETTER(this, name);
                    } else if (typeof begin === 'function') {
                        begin = begin.call(this, node);
                    }

                    var mFrom = Y.Anim.RE_UNITS.exec(begin);
                    var mTo = Y.Anim.RE_UNITS.exec(val);

                    begin = mFrom ? mFrom[1] : begin;
                    end = mTo ? mTo[1] : val;
                    unit = mTo ? mTo[2] : mFrom ?  mFrom[2] : ''; // one might be zero TODO: mixed units

                    if (!unit && Y.Anim.RE_DEFAULT_UNIT.test(name)) {
                        unit = Y.Anim.DEFAULT_UNIT;
                    }

                    if (!begin || !end) {
                        Y.error('invalid "from" or "to" for "' + name + '"', 'Anim');
                        return;
                    }

                    attr[name] = {
                        from: begin,
                        to: end,
                        unit: unit
                    };

                }, this);

                this._runtimeAttr = attr;
            },

            _runAttrs: function(t, d, reverse) {
                var attr = this._runtimeAttr,
                    customAttr = Y.Anim.behaviors,
                    easing = attr.easing,
                    lastFrame = d,
                    done = false,
                    attribute,
                    setter,
                    i;

                if (t >= d) {
                    done = true;
                }

                if (reverse) {
                    t = d - t;
                    lastFrame = 0;
                }

                for (i in attr) {
                    if (attr[i].to) {
                        attribute = attr[i];
                        setter = (i in customAttr && 'set' in customAttr[i]) ?
                                customAttr[i].set : Anim.DEFAULT_SETTER;

                        if (!done) {
                            setter(this, i, attribute.from, attribute.to, t, d, easing, attribute.unit); 
                        } else {
                            setter(this, i, attribute.from, attribute.to, lastFrame, d, easing, attribute.unit); 
                        }
                    }
                }
            }
        });
        Y.namespace('Plugin');
        Y.Plugin.ShapeAnim = Anim;


}, '@VERSION@' ,{requires:['anim.js']});
