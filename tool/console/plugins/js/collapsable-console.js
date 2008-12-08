var MIN = 'min',
    MAX = 'max',
    VALUE = 'value',
    
    COLLAPSED  = 'collapsed',
    C_COLLAPSE = getCN(LOGREADER,'collapse'), // for .foo .foo { ... }
    C_EXPAND   = getCN(LOGREADER,'expand'),

    isNumber = Y.Lang.isNumber,
    
    abs = Math.abs;

function CollapsableConsole() {
    CollapsableConsole.superclass.apply(this,arguments);
}

// collapsable, filterable, templatable
Y.mix(CollapsableConsole,{
    NAME : 'collapsableconsole',

    NS : 'collapsableconsole',

    STRINGS : {
        COLLAPSE : "Collapse",
        EXPAND   : "Expand"
    },

    ATTRS : {
        collapsed : {
            value : false
        }
    }
});

Y.extend(CollapsableConsole, {
    _values : null,

    _tickSize : null,

    initializer : function () {
        var lr = this._owner;

        lr._setStrings(CollapsableConsole.STRINGS,'en');

        lr.after('_renderHead',this._renderButtons);
    },

    _renderButtons : function (e) {
        var head = this._owner._head;

        if (head) {
            head.insertBefore(
                Y.Node.create(
                '<div class="'+C_CONTROLS+'">'+
                    '<input type="button" class="'+C_BUTTON+' '+C_COLLAPSE+'"'+
                        ' value="'+S.COLLAPSE+'">'+
                    '<input type="button" class="'+C_BUTTON+' '+C_EXPAND+'"'+
                        ' value="'+S.EXPAND+'">'+
                '</div>'), head.get('firstChild'));
        } else {
            Y.log("No head section in LogReader found to deposit buttons","warn","CollapsableConsole");
        }
    },

    bindUI : function () {
        var head = this._owner._head,
            controls;

        // get the buttons' container then
        controls.on('click', this._handleClick);

        this.after('collapsedChange', this._afterCollapsedChange);
    },

    syncUI : function () {
        this.set(COLLAPSED,this.get(COLLAPSED));
    },

    _handleClick : function (e) {
        var t = e.target;

        if (t.hasClass(C_COLLAPSE)) {
            this.set(COLLAPSED, true);
        } else if (t.hasClass(C_EXPAND)) {
            this.set(COLLAPSED, false);
        }
    },

    _afterCollapsedChange : function (e) {
        this._owner._addOrRemoveClass(C_COLLAPSE,e.newVal);
    }

});

Y.Plugin.CollapsableConsole = CollapsableConsole;
