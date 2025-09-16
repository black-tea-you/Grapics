var gl;
var points;

window.onload=function init()
{
    var canvas = document.getElementById( "gl-canvas" );
    gl = WebGLUtils.setupWebGL( canvas );    
    if (!gl) { alert( "WebGL isn't available" );} 

    var hexagonVertices=[
        vec2(-0.3,0.6),
        vec2(-0.4,0.8),
        vec2(-0.6,0.8),
        vec2(-0.7,0.6),
        vec2(-0.6,0.4),
        vec2(-0.4,0.4),
        vec2(-0.3,0.6), 
    ];

    var triagleVertices=[
        vec2(0.3,0.4),
        vec2(0.7,0.4),
        vec2(0.5,0.8),

    ];

    var colors=[
        vec4(1.0,0.0,0.0,1.0),
        vec4(0.0,1.0,0.0,1.0),
        vec4(0.0,0.0,1.0,1.0),
    ];

    var stripVertices=[
        vec2(-0.5,0.2),
        vec2(-0.4,0.0),
        vec2(-0.3,0.2),
        vec2(-0.2,0.0),
        vec2(-0.1,0.2),
        vec2(0.0,0.0),
        vec2(0.1,0.2),
        vec2(0.2,0.0),
        vec2(0.3,0.2),
        vec2(0.4,0.0),
        vec2(0.5,0.2),

        //second
        vec2(-0.5,-0.3),
        vec2(-0.4,-0.5),
        vec2(-0.3,-0.3),
        vec2(-0.2,-0.5),
        vec2(-0.1,-0.3),
        vec2(0.0,-0.5),
        vec2(0.1,-0.3),
        vec2(0.2,-0.5),
        vec2(0.3,-0.3),
        vec2(0.4,-0.5),
        vec2(0.5,-0.3),

    ];

    //  Configure WebGL
    //    
    gl.viewport( 0, 0, canvas.width, canvas.height );
    gl.clearColor( 0.0, 0.0, 0.0, 1.0 );

    //  Load shaders and initialize attribute buffers
    var program = initShaders( gl, "vertex-shader", "fragment-shader" );
    gl.useProgram( program );

    var vPosition = gl.getAttribLocation( program, "vPosition" );
    var vColor = gl.getAttribLocation( program, "vColor" );

    //공통사항



    //Hexagon Vertex
    var hexagonbufferId = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, hexagonbufferId);
    gl.bufferData( gl.ARRAY_BUFFER, flatten(hexagonVertices), gl.STATIC_DRAW);
    
    gl.vertexAttribPointer( vPosition, 2, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vPosition );
    gl.drawArrays(gl.LINE_STRIP,0,7);


    //Triangle Vertex       
    var trianglebufferId = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, trianglebufferId );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(triagleVertices), gl.STATIC_DRAW);



    var TCbufferId = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, TCbufferId );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(colors), gl.STATIC_DRAW);

    gl.bindBuffer(gl.ARRAY_BUFFER,trianglebufferId);
    gl.vertexAttribPointer( vPosition, 2, gl.FLOAT, false, 0, 0 );
    gl.bindBuffer(gl.ARRAY_BUFFER,TCbufferId)
    gl.vertexAttribPointer( vColor, 4, gl.FLOAT, false, 0, 0 );

    gl.enableVertexAttribArray(vPosition)
    gl.enableVertexAttribArray(vColor);
    gl.drawArrays(gl.TRIANGLES,0,3);
};