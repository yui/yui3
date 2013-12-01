YUI.add('datatable-filter-tests', function(Y) {

    var suite = new Y.Test.Suite('datatable-filter'),
        Assert = Y.Assert;

    suite.add(new Y.Test.Case({
        name: 'DataTable Filter',

        'test datatable exists': function() {
            var dt = Y.one('.example #dt .yui3-datatable');

            Y.Assert.isNotNull(dt);
        },

        'test filters exist': function () {
            var ul = Y.one('.example .filters ul');

            Y.Assert.isNotNull(ul);

            Y.Assert.areSame(2, ul.all('select').size());

            Y.Assert.areSame(1, ul.all('input').size());

            Y.Assert.areSame(1, ul.all('button').size());
        },

        'test filters buttons exist': function () {
            var cont = Y.one('.example .filters');

            Y.Assert.isNotNull(cont);

            Y.Assert.areSame(4, cont.all('button').size());
        },

        'test filtering': function () {
            var input = Y.one('.example .filters input'),
                btn = Y.one('.example .filters button.filter'),
                dt = Y.one('.example .yui3-datatable');

            Y.Assert.isNotNull(input);
            Y.Assert.isNotNull(btn);
            Y.Assert.isNotNull(dt);

            input.set('value', 'e');
            btn.simulate('click');


            Y.Assert.areSame(4, dt.all('.yui3-datatable-data tr').size());
        }
    }));

    Y.Test.Runner.add(suite);

}, '', { requires: [ 'node', 'node-event-simulate' ] });
