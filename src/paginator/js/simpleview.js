var getClass = Y.ClassNameManager.getClassName,
    PAGINATOR = 'paginator',
    PAGE      = 'page',
    DOT       = '.',
    FIRST_CLASS    = getClass(PAGINATOR, 'first', PAGE),
    LAST_CLASS     = getClass(PAGINATOR, 'last', PAGE),
    NEXT_CLASS     = getClass(PAGINATOR, 'next', PAGE),
    PREVIOUS_CLASS = getClass(PAGINATOR, 'previous', PAGE),
    PAGE_CLASS     = getClass(PAGINATOR, PAGE),
    PAGES_CLASS    = getClass(PAGINATOR, 'pages'),
    CURRENT_CLASS  = getClass(PAGINATOR, 'current', PAGE),
    PAGE_ATTR      = 'yui3-page',
    events = {};

events[DOT + FIRST_CLASS]    =
events[DOT + LAST_CLASS]     =
events[DOT + NEXT_CLASS]     =
events[DOT + PREVIOUS_CLASS] =
events[DOT + PAGE_CLASS]     = { click: '_onPageLinkClick' };

Y.Paginator.SimpleView = Y.Base.create(PAGINATOR, Y.View, [], {
    render: function () {
        var data = Y.merge(
            this.get('strings'), {
                firstClass   : FIRST_CLASS,
                lastClass    : LAST_CLASS,
                nextClass    : NEXT_CLASS,
                previousClass: PREVIOUS_CLASS,
                pageClass    : PAGE_CLASS,
                pagesClass   : PAGES_CLASS,
                currentClass : CURRENT_CLASS
            }),
            tokenRE = /\{(\w+)(?:\s+(\w+))?\}/g,
            formatters = Y.Paginator.SimpleView.Formatter,
            paginator = this;

        function process(match, token, page) {
            var renderer = formatters[token],
                value    = data[token];

            if (renderer) {
                // recursive for output from formatters
                value = renderer.apply(paginator, arguments)
                            .replace(tokenRE, process);
            }

            return value;
        }

        this.get('container').setContent(
            this.get('template').replace(tokenRE, process));
    },

    events: events,

    _onPageLinkClick: function (e) {
        var page = +e.currentTarget.getData(PAGE_ATTR);

        e.preventDefault();

        this.get('host').set('page', page, { originEvent: e });
    }
}, {
    Formatter: {
        pageLinks: function (_, val, meta) {
            var host     = this.get('host'),
                pages    = host.get('pages'),
                links    = Math.min(this.get('pageLinks'), pages),
                page     = host.get('page'),
                start    = Math.max(1, Math.floor(page - (links / 2))),
                template = '<ol start="' + start + '" class="{pagesClass}">',
                i        = start;

            for (; i <= links; ++i) {
                template += '<li>{pageLink ' + i + '}</li>';
            }

            template += '</ol>';

            return template;
        },

        pageLink: function (_, val, page) {
            var host         = this.get('host'),
                currentPage  = this.get('page'),
                pages        = host.get('pages'),
                label        = this.get('strings.' + page),
                urlGenerator = this.get('urlFormatter'),
                linkClass    = '{pageClass}';

            if (label) {
                host = this.get('host');

                linkClass = '{' + label + 'Class}';

                page = (page === 'first')    ? 1 :
                       (page === 'last')     ? pages :
                       (page === 'next')     ? Math.min(pages, currentPage + 1):
                       (page === 'previous') ? Math.max(1, currentPage - 1) :
                       page;
            } else {
                label = page;
            }

            if (currentPage == page) {
                linkClass += ' {currentClass}';
            }

            return Y.Lang.sub(this.get('pageLinkTemplate'), {
                page     : page,
                label    : label,
                linkClass: linkClass,
                url      : urlGenerator ? urlGenerator.call(this, +page) : '#'
            });
        }
    },

    ATTRS: {
        host: {},

        pageLinks: {
            value: 7
        },

        template: {
            value: '{pageLink first} {pageLink previous} {pageLinks} {pageLink next} {pageLink last}'
        },

        pageLinkTemplate: {
            value: '<a href="{url}" class="{linkClass}" ' +
                            'data-' + PAGE_ATTR + '="{page}">{label}</a>'
        },

        strings: {
            valueFn: function () {
                return Y.Intl.get('paginator-simple-view');
            }
        }
    }
});
