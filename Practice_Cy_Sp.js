var gl;
var points;

var points=[];
var colors=[];

window.onload=function init()
{
    var canvas = document.getElementById( "gl-canvas" );
    gl = WebGLUtils.setupWebGL( canvas );    
    if (!gl) { alert( "WebGL isn't available" );} 

    var myCylinder =cylinder(72,3,true);
    myCylinder.scale(0.5,1.0,0.5);
    myCylinder.rotate(45.0,[1,1,1]);
    myCylinder.translate(0.0,0.0,0.0);

    points=points.concat(myCylinder.TriangleVertices);
    colors=colors.concat(myCylinder.TriangleVertexColors);
    


    //  Configure WebGL
    //    
    gl.viewport( 0, 0, canvas.width, canvas.height );
    gl.clearColor( 0.0, 0.0, 0.0, 1.0 );

    gl.enable(gl.DEPTH_TEST);

    //  Load shaders and initialize attribute buffers
    var program = initShaders( gl, "vertex-shader", "fragment-shader" );
    gl.useProgram( program );

    var vPosition = gl.getAttribLocation( program, "vPosition" );
    var vColor = gl.getAttribLocation( program, "vColor" );

    //3D Vertex
    var bufferId = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, bufferId);
    gl.bufferData( gl.ARRAY_BUFFER, flatten(points), gl.STATIC_DRAW);

    var vPosition = gl.getAttribLocation( program, "vPosition" );
    gl.vertexAttribPointer( vPosition, 4, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vPosition );

    var cBuffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, cBuffer );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(colors), gl.STATIC_DRAW);

    var vColor = gl.getAttribLocation( program, "vColor" );
    gl.vertexAttribPointer( vColor, 4, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vColor );

    modelViewMatrixLoc = gl.getUniformLocation( program, "modelViewMatrix" );
    document.getElementById("xButton").onclick=function(){axis=xAxis;};
    document.getElementById("yButton").onclick=function(){axis=yAxis;};
    document.getElementById("zButton").onclick=function(){axis=zAxis;};

    render();
};

function render(){
    gl.clear( gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    theta[axis] += 2.0;    
    ctm = mat4();
    ctm = mult(ctm, rotate(theta[zAxis], 1, 0, 0)); // rotateZ
    ctm = mult(ctm, rotate(theta[yAxis], 0, 1, 0)); // rotateY
    ctm = mult(ctm, rotate(theta[xAxis], 0, 0, 1)); // rotateX
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(ctm));
    gl.drawArrays( gl.TRIANGLES, 0, points.length);
    requestAnimFrame( render );
 }