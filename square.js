var gl;
var points;


window.onload=function intit()
{
    var canvas = document.getElementById( "gl-canvas" );
    gl = WebGLUtils.setupWebGL( canvas );    
    if (!gl) { alert( "WebGL isn't available" );} 


    //var vertices = new Float32Array([-0.5,-0.5,-0.5,0.5,0.5,0.5,0.5,-0.5]);//FAN
    var vertices = new Float32Array([
        0,1,-0.5,0.5,0.5,0.5,
        0,0.5,-0.5,0,0.5,0,
        0,0,-0.5,-0.5,0.5,-0.5,
        -0.15,-0.5,0.15,-0.5,-0.15,-1,
        0.15,-0.5,-0.15,-1,0.15,-1
    ]);


    //  Configure WebGL
    //    
    gl.viewport( 0, 0, canvas.width, canvas.height );

    //  Load shaders and initialize attribute buffers
    var program = initShaders( gl, "vertex-shader", "fragment-shader" );
    gl.useProgram( program );

    // Load the data into the GPU        
    var bufferId = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, bufferId );
    gl.bufferData( gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW );



    // Associate vertex data buffer with shader variables
    var vPosition = gl.getAttribLocation( program, "vPosition" );
    gl.vertexAttribPointer( vPosition, 2, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vPosition );

    var uColor=gl.getUniformLocation(program, "uColor");
    gl.clear(gl.COLOR_BUFFER_BIT);

    gl.uniform4fv(uColor,[0,1,0,1]);
    gl.drawArrays( gl.TRIANGLES, 0, 9);

    //body
    gl.uniform4fv(uColor,[0.5,0.25,0,1]);
    gl.drawArrays(gl.TRIANGLES, 9, 6);

};


    function render(){
    gl.clear( gl.COLOR_BUFFER_BIT ); 
    gl.drawArrays( gl.TRIANGLE_FAN, 0, 4 );
    //gl.drawArrays( gl.TRIANGLES, 0, 6 );
 }
