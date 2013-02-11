function BenchmarkConsole() {
    BenchmarkConsole.superclass.constructor.apply(this, arguments);
}

Y.BenchmarkConsole = Y.extend(BenchmarkConsole, Y.Console, {
    initializer: function () {
        this.on('entry', this._onEntry);
    },

    _onEntry: function () {

    }
}, {
    NAME: 'benchmarkConsole',

    ATTRS: {
        height: {
            value: '350px'
        },

        newestOnTop: {
            value: false
        },

        style: {
            value: 'block'
        },

        width: {
            value: Y.UA.ie && Y.UA.ie < 9 ? '100%' : 'inherit'
        }
    }
});
