/**
Adds keyboard support to an ImageCropper widget.

@class Plugin.ImageCropperKeys
@param {Object} config Object literal containing configuration parameters.
  Supports the following options:
  * `keyTick` {Number=1} Number of pixels that the crop rectangle will be moved 
     when pressing an arrow key
  * `shiftKeyTick` {Number=10} Number of pixels that the crop rectangle will be moved 
     when pressing an arrow key while holding down the shift key
*/
function KeysPlugin(config) {
    var host = config.host,
        resizeKnob = host.get('resizeKnob');

    this.host          = host;
    this._shiftKeyTick = config.shiftKeyTick || 10;
    this._keyTick      = config.keyTick || 1;

    this._handler = resizeKnob.on({
        arrow: Y.bind(this._moveResizeKnob, this),
        mousedown: resizeKnob.focus
    });
}

/**
Moves the `resizeKnob` based on the keys pressed.
Uses the `gallery-event-arrow` module to get the direction
of the movement based on the arrow pressed, then calculates
the new position of the node applying constrains.
It then fires `crop:*` events as if the image was cropped
with the mouse.

@method _moveResizeKnob
@param {EventFacade} e
@private
*/
KeysPlugin.prototype._moveResizeKnob = function (e) {
    // prevent scroll in Firefox
    e.preventDefault();
    
    var host = this.host,
        resizeKnob = host.get('resizeKnob'),
        contentBox = host.get('contentBox'),
        
        knobWidth = resizeKnob.get('offsetWidth'),
        knobHeight = resizeKnob.get('offsetHeight'),
    
        tick = e.shiftKey ? this._shiftKeyTick : this._keyTick,
        direction = e.direction,
        
        tickH = direction.indexOf('w') > -1 ? -tick : direction.indexOf('e') > -1 ? tick : 0,
        tickV = direction.indexOf('n') > -1 ? -tick : direction.indexOf('s') > -1 ? tick : 0,
        
        x = resizeKnob.getX() + tickH,
        y = resizeKnob.getY() + tickV,
        
        minX = contentBox.getX(),
        minY = contentBox.getY(),
        
        maxX = minX + contentBox.get('offsetWidth') - knobWidth,
        maxY = minY + contentBox.get('offsetHeight') - knobHeight,
        
        o;
        
    if (x < minX) {
        x = minX;
    } else if (x > maxX) {
        x = maxX;
    }
    if (y < minY) {
        y = minY;
    } else if (y > maxY) {
        y = maxY;
    }
    resizeKnob.setXY([x, y]);
    
    o = {
        width: knobWidth,
        height: knobHeight,
        left: resizeKnob.get('offsetLeft'),
        top: resizeKnob.get('offsetTop'),
        sourceEvent: e.type
    };
    
    o[e.type + 'Event'] = e;
    host.fire('crop:start', o);
    host.fire('crop:crop', o);
    host.fire('crop:end', o);
    
    host._syncResizeMask();
};
    
KeysPlugin.prototype.destroy = function () {
    this._handler.detach();
    this.host = null;
};

KeysPlugin.NS = 'keys';

Y.Plugin.ImageCropperKeys = KeysPlugin;