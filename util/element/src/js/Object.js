(function() {
    var Y = YAHOO.util,
        lang = YAHOO.lang,
        YUI = lang.CONST;

    // constructor
    var Class = function Object(attributes) {
        YAHOO.log('constructor called', 'life', 'Object');
        this.init(attributes);
    };

    Class.CONFIG = {
        destroyed: {
            readOnly: true,
            value: true,
            foo: 'foo'
        }
    };

    // public 
    var proto = {
        _: null, // protected container
        __: null, // private container

        /* @final*/
        init: function(attributes) {
            YAHOO.log('init called', 'life', 'Object');
            this._ = {}; // init protected
            this.__ = {}; // init private

            var constructor = this.constructor,
                retVal = this.fireEvent(YUI.BeforeInit);

            if (retVal === false) { // returning false from beforeEvent cancels TODO: use preventDefault/stopPropagation instead?
                return false;
            }
            var classes = [];

            while (constructor && constructor.prototype) { // collect Classes to initialize top down (top = superclass)
                classes.unshift(constructor);
                constructor = constructor.superclass ? constructor.superclass.constructor : null;
            }

            while (constructor = classes.shift()) { // initialize from top down
                YAHOO.log('configuring' + lang.dump(constructor.CONFIG), 'attr', 'Object');
                this.setAttributeConfigs(constructor.CONFIG, attributes, true); // init Attributes
                if (constructor !== Class && constructor.prototype.initializer) { // this Class has no initializer
                    constructor.prototype.initializer.apply(this, arguments);
                }

            }
            this.fireEvent(YUI.Init, attributes);
            //YAHOO.log('created: ' + this, 'life', 'Object');
        },

        destroy: function() {
            var constructor = this.constructor,
                retVal = this.fireEvent(YUI.BeforeDestroy);

            if (retVal === false) { // returning false from beforeEvent cancels TODO: use preventDefault/stopPropagation instead?
                return false;
            }
            while (constructor && constructor.prototype && constructor.prototype.destructor) { // call destructors from bottom up
                constructor.prototype.destructor.apply(this, arguments);
                constructor = constructor.superclass ? constructor.superclass.constructor : null;
            }

            YAHOO.log('destructor called', 'life', 'Object');
            this._configs.destroyed.value.destroyed = true;

            this.fireEvent(YUI.Destroy);
        },

        toString: function() {
            return 'Object: ' + this.get('id');
        }
    };

    Class.prototype = proto;
    YAHOO.lang.augmentProto(Class, Y.AttributeProvider);
    YAHOO.util.Object = Class;

})();
