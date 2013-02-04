var template = new Y.Template(),

    /**
        {
            classNames:,
            link:,
            title:,
            display:,
        }
    */
    control =   '<li class="<%= data.classNames.controlWrapper %>">' +
                    '<a href="<%= data.link %>" title="<%= data.title %>" class="<%= data.classNames.control %> <%= data.controlClass %>" data-type="<%= data.type %>">' +
                        '<%= data.display %>' +
                    '</a>' +
                '</li>',

    /**
        {
            classNames:,
            link:,
            page:,
            title:,
            display:,
        }
    */
    page =  '<li class="<%= data.classNames.controlWrapper %>">' +
                '<a href="<%= data.link %>" data-page="<%= data.page %>" title="<%= data.title %>" class="<%= data.classNames.page %><%= data.selectedClass %>">' +
                    '<%= data.display %>' +
                '</a>' +
            '</li>',

    /**
        {
            classNames:,
            preLabel:,
            page:,
            postLabel:,
        }
    */
    pageInput = '<li class="<%= data.classNames.controlWrapper %>">' +
                    '<label class="<%= data.classNames.control %>" data-type="<%= data.type %>">' +
                        '<%= data.preLabel %>' +
                        '<input class="<%= data.classNames.pageInput %>" type="text" value="<%= data.page %>">' +
                        '<%= data.postLabel %>' +
                    '</label>' +
                '</li>',

    /**
        {
            classNames:,
            preLabel:,
            postLabel:,
            options: [
                {
                    value:,
                    selected:,
                    display:,
                }
            ]
        }
    */
    pageSelect =    '<li class="<%= data.classNames.controlWrapper %>">' +
                        '<label class="<%= data.classNames.control %>" data-type="<%= data.type %>">' +
                            '<%= data.preLabel %><select class="<%= data.classNames.pageSelect %>">' +
                            '<% Y.Array.each(data.options, function(option) { %>' +
                                '<option value="<%= option.value %>"<% if(option.selected) {%> selected="selected"<% }; %>>' +
                                    '<%= option.display %>' +
                                '</option>' +
                            '<% }); %>' +
                            '</select><%= data.postLabel %>' +
                        '</label>' +
                    '</li>',

    /**
        {
            classNames:,
            preLabel:,
            postLabel:,
            options: [
                {
                    value:,
                    selected:,
                    display:,
                }
            ]
        }
    */
    perPageSelect = '<li class="<%= data.classNames.controlWrapper %>">' +
                        '<label class="<%= data.classNames.control %>" data-type="<%= data.type %>">' +
                            '<%= data.preLabel %> <select class="<%= data.classNames.pageSelect %>">' +
                            '<% Y.Array.each(data.options, function(option) { %>' +
                                '<option value="<%= option.value %>"<% if(option.selected) {%> selected="selected"<% }; %>>' +
                                    '<%= option.display %>' +
                                '</option>' +
                            '<% }); %>' +
                            '</select><%= data.postLabel %>' +
                        '</label>' +
                    '</li>',

    /**
        {
            classNames:,
            first:,
            prev:,
            pages:,
            next:,
            last:,
        }
    */
    list =  '<ul class="<%= data.classNames.list %>">' +
                '<%== data.first %><%== data.prev %>' +
                '<ul class="<%= data.classNames.pages %>">' +
                    '<%== data.pages %>' +
                '</ul>' +
                '<%== data.next %><%== data.last %>' +
            '</ul>',

    /**
        {
            classNames:,
            first:,
            pref:,
            pageInput:,
            next:,
            last:,
            pageSelect:,
            perPageSelect:,
        }
    */
    dt =    '<ul class="<%= data.classNames.dt %>">' +
                '<%== data.first %><%== data.prev %>' +
                '<%== data.pageInput %>' +
                '<%== data.next %><%== data.last %>' +
                '<%== data.pageSelect %>' +
                '<%== data.perPageSelect %>' +
            '</ul>',

    PageTemplates = {
        control: template.compile(control),
        page: template.compile(page),
        pageInput: template.compile(pageInput),
        pageSelect: template.compile(pageSelect),
        perPageSelect: template.compile(perPageSelect),
        list: template.compile(list),
        dt: template.compile(dt)
    };

Y.namespace('Paginator').Templates = PageTemplates;
