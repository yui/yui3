/**
 The Paginator utility allows you to display an item or a group of items
 depending on the number of items you wish to display at one time.

 Paginator's primary functionality is contained in `paginator-core` and is mixed
 into `paginator` to allow `paginator` to have extra functionality added to it
 while leaving the core functionality untouched. This allows `paginator-core` to
 remain available for use later on or used in isolation if it is the only piece
 you need.

 Due to the vast number of interfaces a paginator could possibly consist of,
 `Paginator` does not contain any ready to use UIs. However, `Paginator` is
 ready to be used in any Based-based, module such as a Widget, by extending your
 desired class and mixing in `Paginator`. This is displayed in the following
 example:

 <pre><code>
 YUI().use('paginator-url', 'widget', function (Y){
     var MyPaginator = Y.Base.create('my-paginator', Y.Widget, [Y.Paginator], {

        renderUI: function () {
            var numbers = '',
                i, numberOfPages = this.get('totalPages');

            for (i = 1; i <= numberOfPages; i++) {
                // use paginator-url's formatUrl method
                numbers += '&lt;a href="' + this.formatUrl(i) + '">' + i + '&lt;/a>';
            }

            this.get('boundingBox').append(numbers);
        },

        bindUI: function () {
            this.get('boundingBox').delegate('click', function (e) {
                // let's not go to the page, just update internally
                e.preventDefault();
                this.set('page', parseInt(e.currentTarget.getContent(), 10));
            }, 'a', this);

            this.after('pageChange', function (e) {
                // mark the link selected when it's the page being displayed
                var bb = this.get('boundingBox'),
                    activeClass = 'selected';

                bb.all('a').removeClass(activeClass).item(e.newVal).addClass(activeClass);
            });
        }

     });

     var myPg = new MyPaginator({
                    totalItems: 100,
                    pageUrl: '?pg={page}'
                });

     myPg.render();
 });
 </code></pre>

 @module paginator
 @main paginator
 @class Paginator
 @constructor
 @since 3.11.0
 */

Y.Paginator = Y.mix(
    Y.Base.create('pagiantor', Y.Base, [Y.Paginator.Core]),
    Y.Paginator
);
