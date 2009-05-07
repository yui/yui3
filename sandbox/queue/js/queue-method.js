function add(arr,callbacks) {
    Y.Array.each(callbacks,function (fn) {
        if (Y.Lang.isFunction(fn)) {
            arr.push(fn);
        }
    });

    return arr;
}

function SimpleQueue() {
    this._q = add([], arguments);
}

Y.mix(SimpleQueue.prototype, {
    _q : null,

    active : false,

    run : function () {
        this.active = true;

        while (this.active && this._q.length) {
            this._q.shift().call(Y);
        }

        this.active = false;
    },

    add : function () {
        add(this._q, arguments);
    },

    pause : function () {
        this.active = false;
    },

    stop : function () {
        this.active = false;
        this._q = [];
    },

    size : function () {
        return this._q.length;
    }
});

Y.SimpleQueue = SimpleQueue;
