function BenchmarkBase (name) {
	var Benchmark = this;
	
	Benchmark._name  = name;

	Y.each(Y.UA, function(v, k) {
		if (!Y.Lang.isFunction(v) && v && Y.Lang.isNumber(v)) {
			Benchmark._ua = k + v;
		}
	});
}

BenchmarkBase.prototype = {
	_name: null,
	_ua: null,
	_timeStart:[],
	_timeEnd: [],
	_notes: [],
	_note: function (note) {
		this._notes.push(note);
	}
};

function BenchmarkTimer () {
    BenchmarkTimer.superclass.constructor.apply(this, arguments);
}

function BenchmarkValue () {
    BenchmarkValue.superclass.constructor.apply(this, arguments);
}


Y.extend(BenchmarkTimer, BenchmarkBase, {

	// Prototype

	start: function () {
		this._timeStart = Y.Lang.now();
		Y.Profiler.start(this._name);
		this._note(this._name + ': begin @ ' + this._timeStart);
	},

	end: function () {
		this._timeEnd = Y.Lang.now();
		Y.Profiler.stop(this._name);
		this._note(this._name + ': end @ ' + this._timeEnd);

		this._finish();
	},

	_finish: function () {
		var report = Y.mix({
				name: this._name,
				description: 'Sample test',
				ua: this._ua,
				notes: this._notes
			},
			Y.Profiler.getReport(this._name)
		);
		delete report.points; // Don't need this
		console.log(Y.JSON.stringify(report));
	}
}, {
	// Static
});


Y.extend(BenchmarkValue, BenchmarkBase, {
	
	// Prototype

	end: function (value) {
		this._timeEnd = Y.Lang.now();
		this._value = value;
		this._note(this._name + ': end @ ' + this._timeEnd);

		this._finish();
	},

	_finish: function () {
		var report = {
			name: this._name,
			description: 'Sample test',
			ua: this._ua,
			notes: this._notes,
			calls: 1, // TODO
			max: this._value, // TODO
			min: this._value, // TODO
			avg: this._value
		};

		console.log(Y.JSON.stringify(report));
	}
}, {
	// Static
});

Y.namespace('Benchmark').Timer = BenchmarkTimer;
Y.namespace('Benchmark').Value = BenchmarkValue;