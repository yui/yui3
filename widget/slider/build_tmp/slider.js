YUI.add('slider', function(Y) {

var CLASS_RAIL  = 'rail',
    CLASS_THUMB = 'thumb',
    CLASS_INPUT = 'input',
    
    L = Y.Lang,
    isString = L.isString,
    isNumber = L.isNumber;

function _replaceField(f) {
}
function _hideField(f) {
}
function _preserveField(f) {}

function Slider() {
    this.constructor.superclass.constructor.apply(this,arguments);
}

Y.mix(Slider, {

    NAME : 'slider',

    /**
     * Alternate value for attribute preserveField to convert the element to an
     * &lt;input type="hidden" ..&gt;
     */
    FIELD_HANDLER : {
        'replace' : _replaceField,
        'preserve': _preserveField,
        'hide'    : _hideField
    },

    ATTRS : {
        axis : {
            value : 'x',
            validator : function (v) {
                return isString(v) &&
                       v.length === 1 && 'xy'.indexOf(v.toLowerCase()) > -1;
            },
            set : function (v) {
                return v.toLowerCase();
            }
        },

        value : {
            value : 0,
            validator : function (v) {
                var values = this.get('values');

                return isNumber(v) &&
                        (values ?
                            Y.Array.indexOf(values,v) > -1 :
                            (v >= this.get('min') && v <= this.get('max')));
            }
        },

        values : {
            value : null,
            validator : function (v) {
                return L.isArray(v) || (
                    isNumber(v) && v > 1 && v <= this.get('max'));
            },
            set : function (v) {
                if (isNumber(v)) {
                    var min = this.get('min'),
                        max = this.get('max'),
                        inc = Math.round((max - min)/v),
                        vals = [min],
                        i,len;

                    for (i = 1, len = v - 1; i < len; ++i) {
                        vals[i] = min + (i * inc);
                    }

                    vals[i] = max;

                    return vals;
                }
            }
        },

        min : {
            value : 0,
            validator : isNumber
        },

        max : {
            value : 100,
            validator : isNumber
        },

        field : {
            value : null,
            set : function (v) {
                // queryAll to support radio groups 'input[name=fooRadio]'
                var nodes = v ? Y.queryAll(v) : null;
                return nodes && nodes.length === 1 ? nodes.item(0) : nodes;
            }
        },

        rail : {
            value : null,
            set : function (v) {
                return v ? Y.get(v) : null;
            }
        },

        thumb : {
            value : null,
            set : function (v) {
                return v ? Y.get(v) : null;
            }
        },

        thumbImage : {
            value : null,
            set : function (v) {
                return v ? Y.get(v) ||
                        Y.Node.create('<img src="'+v+'" alt="Slider thumb">') :
                        null;
            }
        },

        railHeight : {
            value : null,
            validator : function (v) {
                return isString(v) && (v === '0' ||
                    /^\d+(?:p[xtc]|%|e[mx]|in|[mc]m)$/.test(v));
            }
        },

        railWidth : {
            value : null,
            validator : function (v) {
                return isString(v) && (v === '0' ||
                    /^\d+(?:p[xtc]|%|e[mx]|in|[mc]m)$/.test(v));
            }
        },

        backgroundEnabled : {
            value : true,
            validator : L.isBoolean
        },

        preserveField : {
            value : _replaceField,
            validator : function (v) {
                return L.isFunction(v) || isString(v);
            },
            set : function (v) {
                return L.isFunction(v) ? v : Slider.FIELD_HANDLER[v];
            }
        },

        keyIncrement : {
            value : 5,
            validator : isNumber
        },

        edgeOffset : {
            value : 0,
            validator : isString
        }
    }
});

Y.extend(Slider, Y.Widget, {

    HTML_PARSER : {
        // implemented as functions due to a timing issue with instance-based
        // ClassNameManager
        rail : function (cb) {
            return cb.query('.'+this.getClassName(CLASS_RAIL));
        },
        thumb : function (cb) {
            return cb.quer('.'+this.getClassName(CLASS_THUMB));
        },
        field : function (cb) {
            return cb.query('.'+this.getClassName(CLASS_INPUT));
        },
        thumbImage : function (cb) {
            return cb.query('.'+this.getClassName(CLASS_THUMB)+' img');
        }
    },

    _bgEl : null,

    _hasFieldValues : false,

    _thumbCenterOffset : null,

    initializer : function () {
        // In initializer because render needs values, and these might update it
        this.on('fieldChange',this._handleFieldChange);
        this.on('minChange',this._handleMinChange);
        this.on('maxChange',this._handleMaxChange);
    },

    renderUI : function () {

        this.initField();

        this.initRail();

        this.initThumb();

        this.initRailDims();
    },

    initField : function () {
        this.get('preserveField')(this.get('field'));
    },

    initRail : function () {
        var cb   = this.get('contentBox'),
            rail = this.get('rail');

        // Create rail if necessary. Make sure it's in the contentBox
        if (!rail) {
            rail = cb.appendChild(
                Y.Node.create('<div class="'+
                    this.getClassName(CLASS_RAIL)+'"></div>'));

            this.set('rail',rail);
        } else if (!cb.contains(rail)) {
            cb.appendChild(rail);
        }

        if ('absolute|relative'.indexOf(rail.getStyle('position')) === -1) {
            rail.setStyle('position','relative');
        }
    },

    initRailDims : function () {
        var rail = this.get('rail'),
            w    = this.get('railWidth');

        rail.setStyle('height', this.get('railHeight'));// ||
                                //(thumbs[0].get('offsetHeight') + 'px'));

        if (w) {
            rail.setStyle('width',w);
        }
    },

    initThumb : function () {
        var rail  = this.get('rail'),
            thumb = this.get('thumb'),
            img   = this.get('thumbImage');

        if (!thumb) {
            thumb = Y.Node.create(
                '<div class="'+this.getClassName(CLASS_THUMB)+'"></div>');

            this.set('thumb',thumb);
        }

        if (!rail.contains(thumb)) {
            rail.appendChild(thumb);
        }

        if (img && !thumb.contains(img)) {
            thumb.appendChild(img);
        }

        thumb.setStyle('position','absolute');

        if (!img && parseInt(thumb.getStyle('width'),10) < 1) {
            this.initThumbDims();
        }
    },

    initThumbDims : function () {
        var thumb = this.get('thumb'),
            xy = this.get(this._axisProp('dimAttr'));

        thumb.setStyles({
            height : xy,
            width  : xy
        });
    },

    bindUI : function () {
        this.initThumbDD();
    },

    initThumbDD : function () {
        var rail  = this.get('rail'),
            thumb = this.get('thumb');

        this._dd = new Y.DD.Drag({
            node : thumb,
            constrain2node : rail
        });

        this.initBackgroundDD();
        this.initValueStops();
    },

    initBackgroundDD : function () {
        var rail = this.get('rail'),
            thumb = this.get('thumb');

        // Temporary hack while dd doesn't support outer handles
        Y.on('mousedown',Y.bind(function (ev) {
            this._dragThreshMet = false;
            this._ev_md = ev;

            if (this.get('primaryButtonOnly') && ev.button > 1) {
                return false;
            }

            var n = this.get('dragNode'),
                x = rail.getX(),
                offset  = n.get('offsetWidth')/2,
                newX = Math.min(Math.max(ev.pageX - x - offset,0)),
                startXY;

            this._fixIEMouseDown();
            ev.halt();

            Y.DD.DDM.activeDrag = this;

            n.setStyle('left',newX + 'px');

            startXY = n.getXY();
            startXY[0] = Math.max(startXY[0] + offset,0);

            this._setStartPosition(startXY);

            var self = this;
            this._clickTimeout = setTimeout(function() {
                self._timeoutCheck.call(self);
            }, this.get('clickTimeThresh'));

            this.fire('drag:afterMouseDown', { ev: ev });

        },this._dd),rail);
    },

    initValueStops : function () {
    },

    syncUI : function () {
    },

    getValue : function () {
    },

    setValue : function (val) {
    },

    initKeyListeners : function () {
    },

    // Place holders
    _handleFieldChange: function () {},
    _handleMinChange: function () {},
    _handleMaxChange: function () {},

    _axisProp : function (key) {
        return 'railHeight';
    }
});

Y.Slider = Slider;


}, '@VERSION@' ,{requires:['widget','dd']});
