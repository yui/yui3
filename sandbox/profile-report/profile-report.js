YUI.add('profile-report',function (Y) {

    function flatten(data, sortBy) {
        var flat = [], name;

        for (name in data) {
            if (data.hasOwnProperty(name)) {
                flat.push(data[name]);
            }
        }

        sortBy = (sortBy in (flat[0] || {})) ? sortBy : 'percent';

        flat.sort(sortBy === 'function' ?
            function (a,b) {
                var _a = a['function'],
                    _b = b['function'];

                return _a === _b ? 0 : _a > _b ? 1 : -1;
            } :
            function (a,b) { return b[sortBy] - a[sortBy] });

        return flat;
    }

    Y.Profiler.renderFullReport = function (caption, sortBy, container) {
        var data = Y.Profiler.getFullReport(function (x) {return x.calls > 0;});

        new Y.Table({
            caption : caption,
            columns : ['function','calls','min','max','total','avg','own','ownAvg','percent'],
            data : flatten(data, sortBy),
            totals : [false, true, false, false, false, false, true, false, true]
        }).render(container);

        Y.Profiler.clear();
    };

},'@VERSION@',{requires:['profiler']});
