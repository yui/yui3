YUI({
    filter: 'raw',
    skin: {
        overrides: {
            panel: ['night']
        }
    }
}).use('graphics','dd','event-key','dd-delegate','dd-constrain','resize','json', 'cssbutton', 'panel', 'dd-plugin', function (Y){


///////////////////// gradient UI controls //////////////////////
    var resizeNode = Y.one('#resize-r'),
    gradControlNode = Y.one('#grad-control'),
    outCX = Y.one('#out-cx'),
    outCY = Y.one('#out-cy'),
    outFX = Y.one('#out-fx'),
    outFY = Y.one('#out-fy'),
    outR = Y.one('#out-r'),
    myellipse,
    bounds = Y.one('#grad-control'),
    origX = bounds.getX(),
    origY = bounds.getY(),
    maxX = bounds.get('offsetWidth'),
    maxY = bounds.get('offsetHeight'),
    cW = Y.one('.grad-c').get('offsetWidth'),
    fW = Y.one('.grad-f').get('offsetWidth'),
    theCX = 0.5,
    theCY = 0.5,
    theFX = 0.5,
    theFY = 0.5,
    theR = 0.5,
    centerColor = '#ff8800',
    outerColor = '#300060',
    stopsArr = [
                    {color: centerColor, opacity:1, offset:0},
                    {color: outerColor, opacity:1, offset:1}
                ];
    // Updates the radial fill properties in myellipse
    var updateGraphic = function(){
        myellipse.set('fill', {
                type: "radial",
                stops: stopsArr,
                cx: theCX,
                cy: theCY,
                fx: theFX,
                fy: theFY,
                r: theR
            }
        );
    }

    // This recenters the outter edge of the gradient control, as it is sized
    var recenterGradientR = function(e){
        var radius = resizeNode.get('offsetWidth')/2 + 'px';
        resizeNode.setStyles({
            'left': '-' + radius,
            'top': '-' + radius,
            'borderRadius': radius
            }  );
        theR =  (resizeNode.get('offsetWidth') / 2)  / gradControlNode.get('offsetWidth');
        theR = Math.round(theR * 100) / 100;
        outR.setContent(theR);
        updateGraphic();
    }

    // Instatiate a resize object on the outter gradient control ring
    var resize = new Y.Resize({
        //Selector of the node to resize
        node: '#resize-r',
        handles: ['bl', 'br', 'tl', 'tr']
    });
    resize.plug(Y.Plugin.ResizeConstrained, {
        minWidth: 20,
        minHeight: 20,
        maxWidth: 300,
        maxHeight: 300,
        preserveRatio: true
    });
    resize.after('resize:end', function(){
        recenterGradientR();
    });
    resize.after('resize:resize', function(){    // seem to need both resize:resize and resize:end
        recenterGradientR();
    });


    // Instantiate a drag on the container of the outter gradient control ring
    var ddC = new Y.DD.Drag({
        node: '.grad-c'
    });

    // Instantiate a drag on the container of the inner gradient control ring
    ddF = new Y.DD.Drag({
        node: '.grad-f'
    });

    // Handle drag of the container of the outter control ring
    ddC.on('drag:drag', function(e){

        theCX = (this.lastXY[0] - origX) / (maxX - cW);
        theCY = (this.lastXY[1] - origY) / (maxY - cW);
        theCX = Math.round(theCX * 100) / 100;
        theCY = Math.round(theCY * 100) / 100;

        outCX.setContent(theCX);
        outCY.setContent(theCY);
        updateGraphic();
    });


    // Handle drag of the container of the inner control ring
    ddF.on('drag:drag', function(e){

        theFX = (this.lastXY[0] - origX) / (maxX - fW);
        theFY = (this.lastXY[1] - origY) / (maxY - fW);
        theFX = Math.round(theFX * 100) / 100;
        theFY = Math.round(theFY * 100) / 100;
        outFX.setContent(theFX);
        outFY.setContent(theFY);
        updateGraphic();
    });

    // Handle a click on the 'get code snippet' button
    Y.one('#btn-get-code').on('click', function(){
        var html = ''+
        'var myellipse = mygraphic.addShape({\n'+
        '    type: "ellipse",\n'+
        '    fill: {\n'+
        '        type: "radial",\n'+
        '        stops: [\n'+
        '           ' + Y.JSON.stringify(stopsArr[0]) + ',\n'+
        '           ' + Y.JSON.stringify(stopsArr[1]) + '\n'+
        '        ],\n'+
        '        cx: ' + theCX + ',\n'+
        '        cy: ' + theCY + ',\n'+
        '        fx: ' + theFX + ',\n'+
        '        fy: ' + theFY + ',\n'+
        '        r: ' + theR + '\n'+
        '    },\n'+
        '    stroke: {\n'+
        '        weight: 0,\n'+
        '        color: "#000" \n'+
        '    },\n'+
        '    width: 150,\n'+
        '    height: 100,\n'+
        '    x: 35,\n'+
        '    y: 35\n'+
        '});\n';
        var textArea = Y.one('#panel-content textarea')
        textArea.setContent(html);
        panel.show();
        textArea.focus();
        textArea.select();
        textArea.scrollTop();
    });
    Y.one('#center-color').on('change', function(){
        centerColor = this.get('value');
        Y.one('.grad-f').setStyle('backgroundColor', centerColor);
        stopsArr = [
                {color: centerColor, opacity:1, offset:0},
                {color: outerColor, opacity:1, offset:1}
            ];
        updateGraphic();
    });
    Y.one('#outer-color').on('change', function(){
        outerColor = this.get('value');
        Y.one('.grad-r').setStyle('backgroundColor', outerColor);
        stopsArr = [
                {color: centerColor, opacity:1, offset:0},
                {color: outerColor, opacity:1, offset:1}
            ];
        updateGraphic();
    });
///////////////////// END gradient UI controls //////////////////////

    // Instantiate a new graphic to contain objects
    var mygraphic = new Y.Graphic();
    mygraphic.render("#mygraphiccontainer");

    // add shapes to the graphics object
    var loadGraphics = function (e)
    {
        //create an ellipse with addShape
        myellipse = mygraphic.addShape({
            type: "ellipse",
            fill: {
                type: "radial",
                stops: stopsArr,
                cx: 0.5,
                cy: 0.5,
                fx: 0.5,
                fy: 0.5,
                r: 0.5
            },
            stroke: {
                weight: 0,
                color: "#000"
            },
            width: 150,
            height: 100,
            x: 45,
            y: 55
        });


    }

    loadGraphics();


    ////////////////////////////////////////
    var panel = new Y.Panel({
        bodyContent: '<div class="textarea-box"><textarea></textarea></div>',
        headerContent: 'Code Snippet',
        width        : 350,
        height       : 400,
        zIndex       : 5,
        centered     : true,
        modal        : true,
        visible      : false,
        render       : '#panel-content',
        plugins      : [Y.Plugin.Drag]
    });

    panel.addButton({
        value  : 'Close',
        section: Y.WidgetStdMod.FOOTER,
        action : function (e) {
            e.preventDefault();
            panel.hide();
        }
    });

});
