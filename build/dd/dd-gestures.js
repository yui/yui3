YUI.add('dd-gestures', function(Y) {


    
    Y.DD.Drag.prototype._prep = function() {
        this._dragThreshMet = false;
        var node = this.get('node'), DDM = Y.DD.DDM;

        node.addClass(DDM.CSS_PREFIX + '-draggable');

        node.on('gesturemovestart', Y.bind(this._handleMouseDownEvent, this), {
            minDistance: 0,
            minTime: 0
        });
        node.setData('dd', true);
        node.on('gesturemoveend', Y.bind(this._handleMouseUp, this), { standAlone: true });
        node.on('dragstart', Y.bind(this._fixDragStart, this));
        node.on('gesturemove', Y.throttle(Y.bind(DDM._move, DDM), DDM.get('throttleTime')), { standAlone: true });

    };

    Y.DD.DDM._setupListeners = function() {
        this._createPG();
        this._active = true;
    };



}, '@VERSION@' ,{requires:['dd-drag', 'event-synthetic', 'event-gestures'], skinnable:false});
