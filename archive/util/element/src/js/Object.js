(function() {
    var Y = YAHOO.util,
        lang = YAHOO.lang,
        YUI = lang.CONST;

    // constructor
    var Obj = function Obj(attributes) {
        YAHOO.log('constructor called', 'life', 'Obj');
        this.init(attributes);
    };

    Obj.NAME = 'Object';

    Obj.CONFIG = {
        destroyed: {
            readOnly: true,
            value: false,
            foo: 'foo'
        }
    };

    // public 
    var proto = {
        /* @final*/
        init: function(attributes) {
            YAHOO.log('init called', 'life', 'Obj');
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

            var config;
            while (constructor = classes.shift()) { // initialize from top down
                config = YAHOO.lang.merge(constructor.CONFIG);
                 //YAHOO.log('configuring' + lang.dump(constructor.CONFIG), 'attr', 'Object');
                
                for (var attr in attributes) {
                    if (config[attr]) { // must be configured
                        config[attr] = YAHOO.lang.merge(config[attr]); // copy obj
                        config[attr].value = attributes[attr];
                    }
                }

                this.setAttributeConfigs(config, true); // init Attributes
                if (constructor !== Obj && constructor.prototype.initializer) { // Obj Class has no initializer
                    constructor.prototype.initializer.apply(this, arguments);
                }

            }
            this.fireEvent(YUI.Init, attributes);
            //YAHOO.log('created: ' + this, 'life', 'Obj');
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

            YAHOO.log('destructor called', 'life', 'Obj');
            this._configs.destroyed.value.destroyed = true;

            this.fireEvent(YUI.Destroy);
        },

        toString: function() {
            return 'Obj: ' + this;
        }
    };

    Obj.prototype = proto;
    YAHOO.lang.augmentProto(Obj, Y.AttributeProvider);
    YAHOO.util.Object = Obj;

})();
