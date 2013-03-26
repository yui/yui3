/**
Adds delegate support to Node and NodeList.

@module eventx
@submodule eventx-node-delegate
@for Node
**/

// Override the getter for container to cache the Node instance in the data
// collection.
Y.Event.EventFacade.prototype._getter.container = function () {
    var container = this.data.container ||
                    (this.subscription &&
                     this.subscription.details &&
                     this.subscription.details.container);

    if (container && !(container instanceof Y.Node)) {
        container = this.data.container = Y.one(container);
    }

    return container;
};
