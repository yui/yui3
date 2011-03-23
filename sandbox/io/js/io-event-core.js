Y.Transaction = function () {
    Y.EventTarget.apply(this, this.constructor.EVENT_CONFIG);
    this._init(arguments);
};
Y.Transaction.EVENT_CONFIG = {
    prefix: 'transaction',
    emitFacade: true,
    queuable: true,
    bubbles: true
};
Y.Transaction.prototype = {
    _init: function () {
        // TODO: at least link in the resource? or that via addTarget?
    }
    // TODO: send? abort? addTarget?
};
Y.augment(Y.Transaction, Y.EventTarget);
