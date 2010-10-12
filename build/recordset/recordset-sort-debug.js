YUI.add('recordset-sort', function(Y) {

var Compare = Y.ArraySort.compare,
	isValue = Y.Lang.isValue;

function RecordsetSort(field, desc, sorter) {
    RecordsetSort.superclass.constructor.apply(this, arguments);
}

Y.mix(RecordsetSort, {
    NS: "sort",

    NAME: "recordsetSort",

    ATTRS: {
		lastSortProperties: {
			value: {
				field:undefined,
				desc:true,
				sorter:undefined
			},
			validator: function(v) {
				return (isValue(v.field) && isValue(v.desc) && isValue(v.sorter));
			}
		},

        defaultSorter: {
            value: function(recA, recB, field, desc) {
                var sorted = Compare(recA.getValue(field), recB.getValue(field), desc);
                if(sorted === 0) {
                    return Compare(recA.get("id"), recB.get("id"), desc);
                }
                else {
                    return sorted;
                }
            }
        },

		isSorted: {
			value: false,
			valueFn: "_getState"
		}
    }
});

Y.extend(RecordsetSort, Y.Plugin.Base, {
    initializer: function(config) {
        this.publish("sort", {defaultFn: Y.bind("_defSortFn", this)});
    },

    destructor: function(config) {
    },

	_getState: function() {
		var host = this.get('host'),
			checker = Y.bind(function() {
				this.set('isSorted',false);
			}, this);
		
		this.on("sort", function() {
		 	this.set('isSorted', true);
		});
		
		this.onHostEvent('add', checker, host);
		this.onHostEvent('update', checker, host);
	},

    _defSortFn: function(e) {
		Y.log('sort fired');
		this.set('lastSortProperties', e);
		
		//have to work directly with _items here - changing the recordset.
        this.get("host")._items.sort(function(a, b) {
			return (e.sorter)(a, b, e.field, e.desc);
		});
    },

    sort: function(field, desc, sorter) {
		this.fire("sort", {field:field, desc: desc, sorter: sorter || this.get("defaultSorter")});
    },

	resort: function() {
		var p = this.get('lastSortProperties');
		this.fire("sort", {field:p.field, desc: p.desc, sorter: p.sorter || this.get("defaultSorter")});
	},

    reverse: function() {
		this.get('host')._items.reverse();
    },

	//flips the recordset based on the same sort method that user had defined
	flip: function() {
		var p = this.get('lastSortProperties');
		
		//If a predefined field is not provided by which to sort by, throw an error
		if (isValue(p.field)) {
			this.fire("sort", {field:p.field, desc: !p.desc, sorter: p.sorter || this.get("defaultSorter")});
		}
		else {
			Y.log('You called flip before setting a field by which to sort by. Maybe you meant to call reverse().');
		}
	}
});

Y.namespace("Plugin").RecordsetSort = RecordsetSort;



}, '@VERSION@' ,{requires:['recordset-base','arraysort','plugin']});
