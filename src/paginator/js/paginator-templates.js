var control = '<a href="<%= link %>" title="<%= title %>" class="<%= classname %>"><%= label =></a>',
    page = '<a href="<%= link %>" title="<%= title %>" class="<%= classname %>"><%= label =></a>',
    list = '<ul class="<%= classname %>"><%= first %><%= prev %><ul class="<%= pagesClass %>"><%= pages %></ul><%= next %><%= last %=></ul>';

Y.Paginator.Templates = {
    control: control
    page: page
    list: list
};