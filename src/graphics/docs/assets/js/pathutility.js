YUI({filter:"raw"}).use('graphics','dd','event-key','dd-delegate','escape', function (Y){
    var myline,
    mycurve;
        
///////////////////// pencil //////////////////////


    var jsStr = '',
    isNewObj,
    inpObjName = Y.one('.obj-name'),
    objName = inpObjName.get('value'),
    pencil = Y.one('#pencil'),
    pencilXYTextInput = Y.one('.pencil-xy'),
    txtCode = Y.one('#txt-code'),
    shiftIsDown = false,
    altIsDown = false,
    curveInProgress = false,
    prevToMethod = 'moveTo', // this is part of a patch for the problem that multiple moveTo commands = lineTo See drag:end
    prevX = pencil.getX() - Y.one('#mygraphiccontainer').getX(),
    prevY = pencil.getY() - Y.one('#mygraphiccontainer').getY(),
    myX,
    myY,
    cp1X,
    cp1Y,
    cp2X,
    cp2Y,
    dd = new Y.DD.Drag({
        node: pencil
    }),
    ddCp = new Y.DD.Delegate({  // dd control points for curves
        container: 'body', //The common container
        nodes: '.control-point' //The items to make draggable
    });

    ddCp.on('drag:drag', function(e){
        mycurve.clear();
        mycurve.moveTo(prevX,prevY);
        cp1X = parseInt(Y.one('.cp1').getStyle('left'), 10);
        cp1Y = parseInt(Y.one('.cp1').getStyle('top'), 10);
        cp2X = parseInt(Y.one('.cp2').getStyle('left'), 10);
        cp2Y = parseInt(Y.one('.cp2').getStyle('top'), 10);
        mycurve.curveTo(cp1X,cp1Y,cp2X,cp2Y, myX, myY);
        mycurve.end();
    });

    dd.on('drag:mouseDown', function(e){
        if(curveInProgress){
            finalizeCurve();
        }
    });

    dd.on('drag:start', function(e){
        myX = pencil.getX() - Y.one('#mygraphiccontainer').getX();
        myY = pencil.getY() - Y.one('#mygraphiccontainer').getY();
        if((isNewObj)&&(!shiftIsDown)){
            myline.moveTo(myX,myY); //fixes issue of graphics needs a moveTo to start a new object or it won't draw.
            isNewObj = false;
        }
    });

    dd.on('drag:drag', function(e){
        var myX = pencil.getX() - Y.one('#mygraphiccontainer').getX(),
        myY = pencil.getY() - Y.one('#mygraphiccontainer').getY();
        pencilXYTextInput.setContent(myX + ',' + myY );
    });

    dd.on('drag:end', function(e){
        var newObjStr = "",
        toMethod,
        methodStr;
        myX = pencil.getX() - Y.one('#mygraphiccontainer').getX();
        myY = pencil.getY() - Y.one('#mygraphiccontainer').getY();
        if(shiftIsDown){
            toMethod = 'moveTo';
            if(prevToMethod === 'moveTo'){  // this is part of a patch for the problem that multiple moveTo commands = lineTo
                Y.log('double moveto issue') ;
                jsStr = jsStr.substring(0, jsStr.lastIndexOf('.moveTo(')) + '.end(); // lastEndMarker';
                txtCode.set('value', jsStr); 
            } 
            myline.moveTo(myX, myY); //Notice we're using myLine that is defined to do the real drawing
            prevToMethod = 'moveTo';
        }else if(altIsDown){
            mycurve.clear();
            mycurve.set('stroke', {opacity:1}); // last resort. set opacity: 0
            mycurve.moveTo(prevX,prevY);
            cp1X = (10 + prevX + ((myX - prevX) * .33));
            cp1Y = (-10 + prevY + ((myY - prevY) * .33));
            cp2X = (-10 + prevX + ((myX - prevX) * .66));
            cp2Y = (10 + prevY + ((myY - prevY) * .66));
            mycurve.curveTo(cp1X,cp1Y,cp2X,cp2Y, myX, myY);
            mycurve.end();
            Y.one('.cp1').setStyles({left:cp1X, top:cp1Y});
            Y.one('.cp2').setStyles({left:cp2X, top:cp2Y});
            curveInProgress = true;
            Y.all('.control-point').setStyle('visibility', 'visible');
            prevToMethod = '';
            return; // Do not write code in box. Do not update prevX prevY
        }else{
            myline.set("stroke", {color: "#f00"}); 
            toMethod = 'lineTo'; 
            myline.lineTo(myX, myY); //Notice we're using myLine that is defined to do the real drawing
            prevToMethod = '';
        }
        
        if(toMethod === 'moveTo'){
            // this is part of a patch for the problem that multiple moveTo commands = lineTo See drag:end
        } else{
            myline.end();
        }
        methodStr = '.' + toMethod + '(' + myX + ',' + myY + ');\n' + objName + '.end(); // lastEndMarker';
        insertCode(methodStr);
        prevX = myX;
        prevY = myY;    
    });    
    
    // inserts code into text area
    var insertCode = function(methodStr){
        jsStr = txtCode.get('value');
        jsStr = jsStr.replace(/(.end\(\); \/\/ lastEndMarker)/g, methodStr);
        txtCode.set('value', jsStr);
        txtCode.select();
    }
    var finalizeCurve = function(){
        // draw myline where mycurve was
        var methodStr;
        myline.moveTo(prevX,prevY);
        myline.curveTo(cp1X,cp1Y,cp2X,cp2Y, myX, myY);
        myline.end();
        
        // try to clear mycurve, FIXME
        mycurve.clear();
        mycurve.set('stroke', {opacity:0}); // set opacity 0
        mycurve.end();
        toMethod = 'curveTo';
        Y.all('.control-point').setStyle('visibility', 'hidden');
        methodStr = '.' + toMethod + '(' + cp1X + ',' + cp1Y + ',' + cp2X + ',' + cp2Y + ',' + myX + ',' + myY + ');\r\n'  + objName + '.end(); // lastEndMarker';
        insertCode(methodStr);
        prevX = myX;
        prevY = myY;    
        curveInProgress = false;
        
    }
    
    Y.on('keydown', function(e){
        if(e.shiftKey){
            shiftIsDown = true; // This will be a myLine.moveTo
            //Y.one('.pencil-img-container').addClass('pencil-img-container-moving');  // doesn't work in IE6
            Y.one('.pencil-img-container').setStyle('backgroundPosition', '-46px 0');
        }else if(e.altKey){
            altIsDown = true; // triggers a curve line
        }
    },document);
    
    Y.on('keyup', function(e){
            shiftIsDown = false; // This will be a myLine.lineTo
            altIsDown = false;  // Will this cause bug if multiple keys are down?
            //Y.one('.pencil-img-container').removeClass('pencil-img-container-moving');  // doesn't work in IE6
            Y.one('.pencil-img-container').setStyle('backgroundPosition', '0 0');
    },document);
    
    // when user changes the object name in the input box "Graphic Object Name"
    Y.on('change', function(){
        if(inpObjName.get('value') !== objName){
            myX = pencil.getX() - Y.one('#mygraphiccontainer').getX();
            myY = pencil.getY() - Y.one('#mygraphiccontainer').getY();
            jsStr = jsStr.replace(/(\/\/ lastEndMarker)/g, '\r\n\r\n');
            if(prevToMethod === 'moveTo'){  // this is part of a patch for the problem that multiple moveTo commands = lineTo
                Y.log('double moveto issue on new obj creation') ;
                jsStr = jsStr.substring(0, jsStr.lastIndexOf('.moveTo(')) + '.end();\r\n\r\n';   // remove the last moveTo because a new object is being created
            }             
            jsStr += makeStrForNewObject();
            txtCode.set('value', jsStr);
            myline.end();
            txtCode.select();
        }
    },inpObjName);    

    var makeStrForNewObject = function(){
            objName = Y.Escape.html(inpObjName.get('value'));
            var newLine = '\r\n',
            newObjStr = newLine + 'var ' + objName + 
            ' = mygraphic.addShape({' + newLine +
            '   type: "path",' + newLine +
            '   stroke: {' + newLine +
            '       weight: 2,' + newLine +
            '       color: "#00dd00"' + newLine +
            '   },' + newLine +
            '   fill: {' + newLine +
            '       type: "linear",' + newLine +
            '       stops: [' + newLine +
            '       {color: "#cc0000", opacity: 1, offset: 0},' + newLine +
            '       {color: "#00cc00", opacity: 0.3, offset: 0.8}' + newLine +
            '       ]' + newLine +
            '   }' + newLine +
            '});' + newLine +
            objName + '.moveTo(' + prevX + ',' + prevY + ');' + newLine + 
            objName + '.end(); // lastEndMarker' + newLine +
            '';
            return newObjStr;
    }
    // init code gen box
    jsStr += makeStrForNewObject();
    Y.one('#txt-code').set('value', jsStr);
//////////////////////////////////////  end pencil code /////////////////////

    var mygraphic = new Y.Graphic();
    mygraphic.render("#mygraphiccontainer");

    function loadGraphics(e)
    {
        // line object reused for all lines
        myline = mygraphic.addShape({
			type: "path",
			stroke: {
				weight: 1,
				color: "#ff0000",
				opacity: 1
			}
        });
		myline.moveTo(200, 200);
        myline.end();

        // curve object reused for all curve
        mycurve = mygraphic.addShape({
			type: "path",
			stroke: {
				weight: 1,
				color: "#f00",
				opacity: 1 //,
				//dashstyle: [3,3]
			}
        });
		mycurve.moveTo(200, 200);
		mycurve.lineTo(208, 208);
        mycurve.clear();
        mycurve.end();
    } 

    loadGraphics();
});

