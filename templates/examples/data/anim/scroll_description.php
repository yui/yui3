<h3>Setting up the HTML</h3>
<p>First we add some HTML to animate.  We'll add a bunch of arbitrary content to demonstrate the scroll effect.</p>
<textarea name="code" class="JScript" cols="60" rows="1">
<div id="demo" class="yui-module">
    <div class="yui-hd">
        <h4>Animation Demo</h4>
        <span class="yui-scroll-controls">
            <a title="scroll up" class="yui-scrollup"><em>scroll up</em></a>
            <a title="scroll down" class="yui-scrolldown"><em>scroll down</em></a>
        </span>
    </div>
    <div class="yui-bd yui-scroll">
        <p>This an example of what you can do with the YUI Animation Utility.</p>
        <p><em>Follow the instructions above to see the animation in action.</em></p>
        <p>Lorem Ipsum is slechts een proeftekst uit het drukkerij- en zetterijwezen. Lorem Ipsum is de standaard proeftekst in deze bedrijfstak sinds de 16e eeuw, toen een onbekende drukker een zethaak met letters nam en ze door elkaar husselde om een font-catalogus te maken. Het heeft niet alleen vijf eeuwen overleefd maar is ook, vrijwel onveranderd, overgenomen in elektronische letterzetting. Het is in de jaren '60 populair geworden met de introductie van Letraset vellen met Lorem Ipsum passages en meer recentelijk door desktop publishing software zoals Aldus PageMaker die versies van Lorem Ipsum bevatten.
        Waarom gebruiken we het?

        Het is al geruime tijd een bekend gegeven dat een lezer, tijdens het bekijken van de layout van een pagina, afgeleid wordt door de tekstuele inhoud. Het belangrijke punt van het gebruik van Lorem Ipsum is dat het uit een min of meer normale verdeling van letters bestaat, in tegenstelling tot "Hier uw tekst, hier uw tekst" wat het tot min of meer leesbaar nederlands maakt. Veel desktop publishing pakketten en web pagina editors gebruiken tegenwoordig Lorem Ipsum als hun standaard model tekst, en een zoekopdracht naar "lorem ipsum" ontsluit veel websites die nog in aanbouw zijn. Verscheidene versies hebben zich ontwikkeld in de loop van de jaren, soms per ongeluk soms expres (ingevoegde humor en dergelijke).</p>

    </div>
</div>
</textarea>

<h3>Creating the Anim Instance</h3>
<p>Now we create an instance of <code>Y.Anim</code>, passing it a configuration object that includes the <code>node</code> we wish to animate.</p>

<textarea name="code" class="JScript" cols="60" rows="1">
var node = Y.get('#demo');

var anim = new Y.Anim({
    node: node,
    duration: 1.5,
    easing: Y.Easing.easeOut
});
</textarea>

<h3>Changing Attributes</h3>
<p>Depending on which control is clicked, we may be scrolling up or down, so an event handler will update the <code>to</code> attribute's <code>scroll</code> behavior before calling <code>run</code>.</p>
<textarea name="code" class="JScript" cols="60" rows="1">
var onClick = function(e) {
    var y = node.get('offsetHeight');
    if (e.currentTarget.hasClass('yui-scrollup')) {
        y = 0 - y;
    }

    anim.set('to', { scroll: [0, y + node.get('scrollTop')] });
    anim.run();
};
</textarea>

<h3>Running the Animation</h3>
<p>Finally we add an event handler to run the animation. Both of our controls use the same handler, so we can use the <code>Y.all</code> method to assign the handler to both.</p>
<textarea name="code" class="JScript" cols="60" rows="1">
Y.all('#demo .yui-hd a').on('click', onClick);
</textarea>

<h3>Full Script Source</h3>
<textarea name="code" class="JScript" cols="60" rows="1">
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
</textarea>

