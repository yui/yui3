(function() {
    jqPlugin = function() {
        jqPlugin.superclass.constructor.apply(this, arguments);
    };

    var proto = {
        name: 'jquery',
        initializer : function(config) {
            config = config[0];
            this.listenBefore(this.get('parent').get('node'), 'visible', this.onBeforeVisibleChange, this, true);
            this.listen(this.get('parent'), 'beforeMove', this.onBeforeMove, this, true);

            this.addOverride(this.get('parent'), 'blur', function() {
                alert('blur override');
            });
            this.addOverride(this.get('parent'), 'focus', function() {
                alert('focus override');
            });
        },
        destructor: function() {
            this.removeDrag();
            this.removeResize();
        },
        onBeforeMove: function(args) {
            var x = args[0], y = args[1];
            $(this.get('node')).animate({
                top: parseInt($(this.get('node')).css('top'), 10) + x,
                left: parseInt($(this.get('node')).css('left'), 10) + y
            }, 1000, 'swing');

            return false;
        },
        addResize: function() {
            var handle = document.createElement('div');
            handle.className = 'jqHandle jqResize';
            this.get('node').appendChild(handle);
            $(this.get('node')).jqResize('.jqResize');
        },
        addDrag: function(config) {
            $(this.get('node')).draggable(config);
        },
        removeDrag: function() {
            $(this.get('node')).draggableDestroy();
        },
        removeResize: function() {
            $('#' + this.get('node').id + ' div.jqResize').remove();
        },
        onBeforeVisibleChange : function(e) {
            if (e.newValue === e.prevValue) {
                return; // already showing
            }
            if (e.newValue === true) {
                this.show();
            } else {
                this.hide();
            }
            return false; // prevent default set
        },
        show : function() {
            var me = this;
            $(this.get('node')).slideDown('slow', function() {
                $(me.get.call(me, 'node')).css('display', '');
                me.setVisible.call(me, true);
            });
        },
        hide : function() {
            var me = this;
            $(this.get('node')).slideUp('slow', function() {
                me.setVisible.call(me, false);
            });
        },
        setVisible: function(val) {
            this.setSilent(this.get('parent').get('node'), 'visible', val);
        },       
        toString: function() {
            return 'jQuery Plugin';
        }
    };

    YAHOO.lang.extend(jqPlugin, YAHOO.plugin.PluginBase, proto);
})();
