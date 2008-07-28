<div id="demo" class="yui-module">
    <div class="yui-hd">
        <h4>Animation Demo</h4>
        <a title="scroll up" class="yui-scrollup"><em>&#9757;</em></a>
        <a title="scroll down" class="yui-scrolldown"><em>&#9759;</em></a>
    </div>
    <div class="yui-bd yui-scroll">
        <p>This an example of what you can do with the YUI Animation Utility.</p>
        <p><em>Follow the instructions above to see the animation in action.</em></p>
        <p>Lorem Ipsum is slechts een proeftekst uit het drukkerij- en zetterijwezen. Lorem Ipsum is de standaard proeftekst in deze bedrijfstak sinds de 16e eeuw, toen een onbekende drukker een zethaak met letters nam en ze door elkaar husselde om een font-catalogus te maken. Het heeft niet alleen vijf eeuwen overleefd maar is ook, vrijwel onveranderd, overgenomen in elektronische letterzetting. Het is in de jaren '60 populair geworden met de introductie van Letraset vellen met Lorem Ipsum passages en meer recentelijk door desktop publishing software zoals Aldus PageMaker die versies van Lorem Ipsum bevatten.
        Waarom gebruiken we het?

        Het is al geruime tijd een bekend gegeven dat een lezer, tijdens het bekijken van de layout van een pagina, afgeleid wordt door de tekstuele inhoud. Het belangrijke punt van het gebruik van Lorem Ipsum is dat het uit een min of meer normale verdeling van letters bestaat, in tegenstelling tot "Hier uw tekst, hier uw tekst" wat het tot min of meer leesbaar nederlands maakt. Veel desktop publishing pakketten en web pagina editors gebruiken tegenwoordig Lorem Ipsum als hun standaard model tekst, en een zoekopdracht naar "lorem ipsum" ontsluit veel websites die nog in aanbouw zijn. Verscheidene versies hebben zich ontwikkeld in de loop van de jaren, soms per ongeluk soms expres (ingevoegde humor en dergelijke).</p>

    </div>
</div>

<script type="text/javascript">
YUI().use('animation', function(Y) {
    var node = Y.get('#demo .yui-bd');
    var anim = new Y.Anim({
        node: node,
        to: {
            scroll: function(node) {
                return [0, node.get('scrollTop') + node.get('offsetHeight')]
            }
        },
        easing: Y.Easing.easeOut
    });

    var onClick = function(e) {
        var y = node.get('offsetHeight');
        if (e.currentTarget.hasClass('yui-scrollup')) {
            y = 0 - y;
        }

        anim.set('to', { scroll: [0, y + node.get('scrollTop')] });
        anim.run();
    };

    Y.all('#demo .yui-hd a').on('click', onClick);
});

</script>
