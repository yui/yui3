var PaginatorList = function() {};

PaginatorList.ATTRS = {
    controlTemp: {
        value: '<a href="{link}" title="{number}">{text}</a>'
    },

    disabledControlTemp: {
        value: '<span>{text}</span>'
    },

    controlsTemp: {
        value: '<ul class="{controlsClass}">' +
                 '<li class="{firstClass}">{firstControl}</li>' +
                 '<li class="{prevClass}">{prevControl}</li>' +
                 '<li>{page} of {pages}</li>' +
                 '<li class="{pagesClass}">{pagesControls}</li>' +
                 '<li class="{nextClass}">{nextControl}</li>' +
                 '<li class="{lastClass}">{lastControl}</li>' +
               '</ul>'
    },

    pageTemp: {
        value: '<li class="{pageClass}"><a href="{link}" title="{number}">{text}</a></li>'
    },

    pagesTemp: {
        value: '<ul>{pages}</ul>'
    }
};

Y.mix(PaginatorList.prototype, {
    initializer: function() {
        this.classNames = {
            controls: 'controls',
            first: 'first',
            prev: 'prev',
            pages: 'pages',
            next: 'next',
            last: 'last',
            page: 'page'
        };
    },

    renderUI: function() {
        this.get('boundingBox').append(this._createControls());
    },

    bindUI: function() {

    },

    syncUI: function() {

    },

    _createControls: function() {

        return Y.Lang.sub(this.get('controlsTemp'), Y.mix({
                    controlsClass: this.classNames.controls,
                    firstClass: this.classNames.first,
                    firstControl: this._createControl('first'),
                    prevClass: this.classNames.prev,
                    prevControl: this._createControl('prev'),
                    pagesClass: this.classNames.pages,
                    pagesControls: this._createPages(),
                    nextClass: this.classNames.next,
                    nextControl: this._createControl('next'),
                    lastClass: this.classNames.last,
                    lastControl: this._createControl('last')
                }, this.getAttrs()));
    },

    _createControl: function(type) {
        var link,
            number,
            disabled = false,
            text;

        switch (type) {
            case 'first':
                number = 1;
                disabled = !this.hasPrev();
                text = '&lt; &lt;';
                break;
            case 'prev':
                number = this.get('page') - 1;
                disabled = !this.hasPrev();
                text = '&lt;';
                break;
            case 'next':
                number = this.get('page') + 1;
                disabled = !this.hasNext();
                text = '&gt;';
                break;
            case 'last':
                number = this.get('pages');
                disabled = !this.hasNext();
                text = '&gt; &gt;';
                break;
        }

        link = this.formatUrl(number);


        return Y.Lang.sub((disabled) ? this.get('disabledControlTemp') : this.get('controlTemp'), {
            link: link,
            number: number,
            disabled: disabled,
            text: text
        });
    },

    _createPages: function() {
        var i = 1,
            totalPages = this.get('pages'),
            pagesString = '';

        for (i = 1; i <= totalPages; i++) {
            pagesString += Y.Lang.sub(this.get('pageTemp'), {
                pageClass: (this.classNames.page + ' ' + this.classNames.page + '-' + i),
                link: this.formatUrl(i),
                number: i,
                text: i
            });
        }

        return Y.Lang.sub(this.get('pagesTemp'), { pages: pagesString });
    }
});


Y.Base.mix(Y.Paginator, [PaginatorList]);
