"use strict";

module.exports = Queue;
function Queue(capacity) {
    this.capacity = this.snap(capacity);
    this.length = 0;
    this.front = 0;
    this.initialize();
}

Queue.prototype.push = function (value) {
    var length = this.length;
    if (this.capacity <= length) {
        this.grow(this.snap(this.capacity * this.growFactor));
    }
    var index = (this.front + length) & (this.capacity - 1);
    this[index] = value;
    this.length = length + 1;
};

Queue.prototype.shift = function () {
    var front = this.front;
    var result = this[front];

    this[front] = void 0;
    this.front = (front + 1) & (this.capacity - 1);
    this.length--;
    return result;
};

Queue.prototype.grow = function (capacity) {
    var oldFront = this.front;
    var oldCapacity = this.capacity;
    var oldQueue = new Array(oldCapacity);
    var length = this.length;

    copy(this, 0, oldQueue, 0, oldCapacity);
    this.capacity = capacity;
    this.initialize();
    this.front = 0;
    if (oldFront + length <= oldCapacity) {
        // Can perform direct linear copy
        copy(oldQueue, oldFront, this, 0, length);
    } else {
        // Cannot perform copy directly, perform as much as possible at the
        // end, and then copy the rest to the beginning of the buffer
        var lengthBeforeWrapping =
            length - ((oldFront + length) & (oldCapacity - 1));
        copy(
            oldQueue,
            oldFront,
            this,
            0,
            lengthBeforeWrapping
        );
        copy(
            oldQueue,
            0,
            this,
            lengthBeforeWrapping,
            length - lengthBeforeWrapping
        );
    }
};

Queue.prototype.initialize = function () {
    var length = this.capacity;
    for (var i = 0; i < length; ++i) {
        this[i] = void 0;
    }
};

Queue.prototype.snap = function (capacity) {
    if (typeof capacity !== "number") {
        return this.minCapacity;
    }
    return pow2AtLeast(
        Math.min(this.maxCapacity, Math.max(this.minCapacity, capacity))
    );
};

Queue.prototype.maxCapacity = (1 << 30) | 0;
Queue.prototype.minCapacity = 16;
Queue.prototype.growFactor = 8;

function copy(source, sourceIndex, target, targetIndex, length) {
    for (var index = 0; index < length; ++index) {
        target[index + targetIndex] = source[index + sourceIndex];
    }
}

function pow2AtLeast(n) {
    n = n >>> 0;
    n = n - 1;
    n = n | (n >> 1);
    n = n | (n >> 2);
    n = n | (n >> 4);
    n = n | (n >> 8);
    n = n | (n >> 16);
    return n + 1;
}
