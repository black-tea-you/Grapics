var gl;
var points;

window.onload=function intit()
{
    var canvas = document.getElementById( "gl-canvas" );
    gl = WebGLUtils.setupWebGL( canvas );    
    if (!gl) { alert( "WebGL isn't available" );} 

     var vertices = new Float32Array([
        10, 20,
        80, 20,
        10, 30,
        10, 30,
        80, 20,
        80, 30,
    ]);

    //  Configure WebGL
    //    
    gl.viewport( 0, 0, canvas.width, canvas.height );
    gl.clearColor( 0.0, 0.0, 0.0, 1.0 );

    //  Load shaders and initialize attribute buffers
    var program = initShaders( gl, "vertex-shader", "fragment-shader" );
    gl.useProgram( program );

    var VbufferId = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, VbufferId );
    gl.bufferData( gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);

    var vPosition = gl.getAttribLocation( program, "vPosition" );
    gl.vertexAttribPointer( vPosition, 2, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vPosition );

     // we added auniformcalled vResolution. 
    var vResolution = gl.getUniformLocation(program, "vResolution"); 
    // set the resolution
    gl.uniform2f(vResolution, gl.canvas.width, gl.canvas.height);

    for(var ii=0; ii<50; ++ii){
        setRectangle(gl,randomInt(300),randomInt(300),randomInt(300),randomInt(300));

        gl.uniform4f(fcolor,Math,random(),Math,random(),Math,random(),1);

        var primitiveType=gl.TRIANGLES;
        var offset=0;
        var count=6;
        gl.drawArrays(primitiveType,offset,count);
    }
};

function randomInt(range)
{
    return Math.floor(Math.random()*range);
}

function setRectangle(gl,x,y,width,height){
    var x1=x;
    var x2=x+width;
    vary1=y;
    var y2=y+height;
}
