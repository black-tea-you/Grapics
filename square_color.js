var gl;
var points;

window.onload=function intit()
{
    var canvas = document.getElementById( "gl-canvas" );
    gl = WebGLUtils.setupWebGL( canvas );    
    if (!gl) { alert( "WebGL isn't available" );} 

    var vertices = new Float32Array([-1,-1, 0, 1, 1,-1]);

    var colors=[
        vec4(1.0,0.0,0.0,1.0),
        vec4(0.0,1.0,0.0,1.0),
        vec4(0.0,0.0,1.0,1.0)
    ]

    //  Configure WebGL
    //    
    gl.viewport( 0, 0, canvas.width, canvas.height );
    gl.clearColor( 0.0, 0.0, 0.0, 1.0 );

    //  Load shaders and initialize attribute buffers
    var program = initShaders( gl, "vertex-shader", "fragment-shader" );
    gl.useProgram( program );

    //Triangle Vertex       
    var VbufferId = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, VbufferId );
    gl.bufferData( gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);

     // Associate vertex data buffer with shader variables

    var vPosition = gl.getAttribLocation( program, "vPosition" );
    gl.vertexAttribPointer( vPosition, 2, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vPosition );
    
    //vertex Color
    var CbufferId = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, CbufferId );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(colors), gl.STATIC_DRAW);

     // Associate vertex data buffer with shader variables

    var vColor = gl.getAttribLocation( program, "vColor" );
    gl.vertexAttribPointer( vColor, 4, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vColor );

    //render
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.drawArrays(gl.TRIANGLES,0,3);
};


    function render(){
    gl.clear( gl.COLOR_BUFFER_BIT ); 
    gl.drawArrays( gl.TRIANGLES, 0, 6 );
 }
