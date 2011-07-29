YUI.add('event-lazyfacade', function (Y) {

var resolve = Y.DOMEventFacade.resolve,
    webkitKeyMap = {
        63232: 38, // up
        63233: 40, // down
        63234: 37, // left
        63235: 39, // right
        63276: 33, // page up
        63277: 34, // page down
        25:     9, // SHIFT-TAB (Safari provides a different key code in
                   // this case, even though the shiftKey modifier is set)
        63272: 46, // delete
        63273: 36, // home
        63275: 35  // end
    },
    define,
    Facade;

try {
    Object.defineProperty({}, "x", { value: function () {} });

    define = function (o, prop, fn) {
        function val(v) {
            //console.log("lazy fetching " + prop);

            var ret = (arguments.length) ? v : fn.call(this);

            // delete needed for IE8
            delete o[prop];
            Object.defineProperty(o, prop, {
                value: ret,
                configurable: true,
                writable: true
            });
            return ret;
        }
        Object.defineProperty(o, prop, {
            get: val,
            set: val,
            configurable: true
        });
    };
} catch (e) {
    try {
        ({}).__defineGetter__("x", function () {});

        define = function (o, prop, fn) {
            function val(v) {
                //console.log("lazy fetching " + prop);
                // removes getter/setter
                delete o[prop];
                return (this[prop] = (arguments.length) ? v : fn.call(this));
            }
            o.__defineGetter__(prop, val);
            o.__defineSetter__(prop, val);
        };
    } catch (e2) {
        // No lazy facade for you!
    }
}


// Only replace DOMEventFacade in browsers that support getters/setters
if (Y.config.lazyEventFacade && define) {

    Facade = function (e, currentTarget, wrapper) {
        //console.log("Creating lazy facade");
        wrapper || (wrapper = {});

        var overrides = wrapper.overrides,
            lazyProps = Facade._lazyProperties,
            prop;

        this._event = e;
        this._currentTarget = currentTarget;
        this._wrapper = wrapper;

        this.altKey = e.altKey;
        this.ctrlKey = e.ctrlKey;
        this.metaKey = e.metaKey;
        this.shiftKey = e.shiftKey;
        this.clientX = e.clientX;
        this.clientY = e.clientY;
        this.pageX = e.pageX;
        this.pageY = e.pageY;

        this.type = (overrides && overrides.type) || e.type;

        for (prop in lazyProps) {
            if (lazyProps.hasOwnProperty(prop)) {
                define(this, prop, lazyProps[prop]);
            }
        }

        this.init && this.init();

        this._touch && this._touch(e, currentTarget, wrapper);
    };

    Facade.prototype = Y.merge(Y.DOMEventFacade.prototype);
    delete Facade.prototype.init;

    Facade._lazyProperties = {
        keyCode: function () {
            var e = this._event,
                key = e.keyCode || e.charCode;

            return webkitKeyMap[key] || key;
        },
        charCode: function () { return this.keyCode; },

        button: function () {
            var e = this._event;
            return (e.which || e.charCode || this.keyCode);
        },
        which: function () { return this.button; },

        target: function () {
            return resolve(this._event.target);
        },
        currentTarget: function () {
            return resolve(this._currentTarget);
        },
        relatedTarget: function () {
            return resolve(this._event.relatedTarget);
        },

        wheelDelta: function () {
            var e = this._event,
                detail;

            if (e.type === "mousewheel" || e.type === "DOMMouseScroll") {
                detail = (e.detail) ?
                    (e.detail * -1) :
                    // wheelDelta between -80 and 80 result in -1 or 1
                    Math.round(e.wheelDelta / 80) || ((e.wheelDelta < 0) ? -1 : 1);
            }

            return detail;
        }
    };

    Y.DOMEventFacade = Facade;
}


}, '0.0.1', { requires: ['event-base'] });
