YUI({filter:"raw"}).use('graphics','dd','event-key','dd-delegate', function (Y){
    var myline,
    mycurve;
        
///////////////////// pencil //////////////////////


    var jsStr = '',
    isNewObj,
    inpObjName = Y.one('.obj-name'),
    objName = inpObjName.get('value'),
    pencil = Y.one('#pencil'),
    pencilXYTextInput = Y.one('.pencil-xy'),
    code = Y.one('.code'),
    ctrlIsDown = false,
    altIsDown = false,
    curveInProgress = false,
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
        if((isNewObj)&&(!ctrlIsDown)){
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
        if(ctrlIsDown){
            toMethod = 'moveTo'; 
            myline.moveTo(myX, myY); //Notice we're using myLine that is defined to do the real drawing
        }else if(altIsDown){
            mycurve.clear();
            //mycurve.set("stroke", {color: "#0f0"});
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
            return; // Do not write code in box. Do not update prevX prevY
        }else{
            myline.set("stroke", {color: "#f00"}); 
            toMethod = 'lineTo'; 
            myline.lineTo(myX, myY); //Notice we're using myLine that is defined to do the real drawing
        }
        myline.end();
        methodStr = '.' + toMethod + '(' + myX + ',' + myY + ');\n' + objName + '.end(); // lastEndMarker';
        insertCode(methodStr);
        prevX = myX;
        prevY = myY;    
    });    
    
    // inserts code into text area
    var insertCode = function(methodStr){
        jsStr = code.getContent();
        code.remove(); // If the user types into the textarea, the contents would not update anymore, So removed then created a new one
        code = Y.Node.create('<textarea class="code" rows="8" cols="5">copy generated code from here</textarea>');
        Y.one('.code-div').append(code);
        jsStr = jsStr.replace(/(.end\(\); \/\/ lastEndMarker)/g, methodStr);
        code.setContent(jsStr);
        code.select();
    }
    var finalizeCurve = function(){
        // draw myline where mycurve was
        var methodStr;
        myline.moveTo(prevX,prevY);
        myline.curveTo(cp1X,cp1Y,cp2X,cp2Y, myX, myY);
        myline.end();
        
        // try to clear mycurve, but no luck FIXME
        mycurve.clear();
        mycurve.set('stroke', {opacity:0}); // last resort. set opacity 0
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
            ctrlIsDown = true; // This will be a myLine.moveTo
            Y.one('.pencil-img-container').addClass('pencil-img-container-moving');
        }else if(e.altKey){
            altIsDown = true; // triggers a curve line
        }
    },document);
    
    Y.on('keyup', function(e){
            ctrlIsDown = false; // This will be a myLine.lineTo
            altIsDown = false;  // Will this cause bug if multiple keys are down?
            Y.one('.pencil-img-container').removeClass('pencil-img-container-moving');
    },document);
    
    // when user changes the object name in the input box "Graphic Object Name"
    Y.on('change', function(){
        if(inpObjName.get('value') !== objName){
            myX = pencil.getX() - Y.one('#mygraphiccontainer').getX();
            myY = pencil.getY() - Y.one('#mygraphiccontainer').getY();
            jsStr = jsStr.replace(/(\/\/ lastEndMarker)/g, '\r\n\r\n');
            jsStr += makeStrForNewObject();
            //jsStr += objName + '.end(); // lastEndMarker\r\n';
            code.setContent(jsStr);
            myline.end();
            code.select();
        }
    },inpObjName);    

    var makeStrForNewObject = function(){
            objName = inpObjName.get('value');
            var newObjStr = '\r\nvar ' + objName + 
            ' = mygraphic.addShape({\r\n'+
            '   type: "path",\r\n'+
            '   stroke: {\r\n'+
            '       weight: 2,\r\n'+
            '       color: "#00dd00"\r\n'+
            '   },\r\n'+
            '   fill: {\r\n'+
            '       type: "linear",\r\n'+
            '       stops: [\r\n'+
            '       {color: "#cc0000", opacity: 1, offset: 0},\r\n'+
            '       {color: "#00cc00", opacity: 0.3, offset: 0.8}\r\n'+
            '       ]\r\n'+
            '   }\r\n'+
            '});\r\n'+
            objName + '.moveTo(' + prevX + ',' + prevY + ');\r\n'+ 
            objName + '.end(); // lastEndMarker\r\n'+
            '';
            return newObjStr;
    }
    // init code gen box
    jsStr += makeStrForNewObject();
    code.setContent(jsStr);
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
