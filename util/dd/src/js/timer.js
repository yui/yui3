(function() {
    
    var Timer = {
        _timer: {},
        start: function(id) {
            this._timer[id] = {
                start: (new Date()).getTime()
            };
        },
        end: function(id) {
            this._timer[id].end = (new Date()).getTime();
            this._timer[id].time = (this._timer[id].end - this._timer[id].start);
            return id + ': ' + this._timer[id].time + 'ms';
        },
        avg: function() {
            var avg = 0, len = 0;

            for (var i in this._timer) {
                avg += this._timer[i].time;
                len++;
            }
            return 'Average: ' + (avg / len) + 'ms';
        }
    };

    YAHOO.Timer = Timer;

})();
