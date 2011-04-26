
/**
 * Implements a render function for all layers of the application framework.
 * This is used to render not only the views, but also whatever template
 * output that would be used to represent different navigation areas the
 * nav controllers control.  It will invoke a renderer function if there
 * is an attribute defined for this.  This function is supplied a callback
 * that must be executed when render is complete so that renderers can be
 * async.
 * @class RenderTarget
 */
function RenderTarget() {}

RenderTarget.prototype = {

    /**
     * Executes a function contained in the renderer attribute.  The function
     * receives a callback param that must be executed when the render is
     * complete.  At that time it sets the rendered attribute to true.
     * @method render
     * @param callback {callback} the function to execute after render is
     * complete.
     * @param data passed to the renderer function
     * @context the host object
     */
    render: function(callback, data) {
        var self = this,
            renderer = self.get('renderer');
        Y.log('render: ' + self.get('id') + ', ' + (data || ''), 'info', 'app');
        if (renderer) {
            renderer.call(self, function() {

                /**
                 * After render has been completed the first time the rendered
                 * attribute is set to true.
                 * @attribute rendered
                 * @type boolean
                 * @default false
                 */
                self.set('rendered', true);

                if (callback) {
                    callback.call(self, data);
                }

            }, data);
        }
    }

};

Y.RenderTarget = RenderTarget;

