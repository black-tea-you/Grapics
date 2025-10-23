var gl;
var points;

var NumVertices = 36;
var points=[];
var colors=[];

var xAxis = 0;
var yAxis = 1;
var zAxis = 2;

var axis=0;
var theta=[0,0,0];

var thetaLoc;

window.onload=function init()
{
    var canvas = document.getElementById( "gl-canvas" );
    gl = WebGLUtils.setupWebGL( canvas );    
    if (!gl) { alert( "WebGL isn't available" );} 

    var vertices = [
        vec4( -0.5, -0.5,  0.5, 1.0 ), //0
        vec4( -0.5,  0.5,  0.5, 1.0 ), //1
        vec4(  0.5,  0.5,  0.5, 1.0 ), //2
        vec4(  0.5, -0.5,  0.5, 1.0 ), //3
        vec4( -0.5, -0.5, -0.5, 1.0 ), //4
        vec4( -0.5,  0.5, -0.5, 1.0 ), //5
        vec4(  0.5,  0.5, -0.5, 1.0 ), //6
        vec4(  0.5, -0.5, -0.5, 1.0 ), //7 
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

    colorCube();

    //공통사항

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

    thetaLoc = gl.getUniformLocation(program, "theta");
    document.getElementById("xButton").onclick=function(){axis=xAxis;};
    document.getElementById("yButton").onclick=function(){axis=yAxis;};
    document.getElementById("zButton").onclick=function(){axis=zAxis;};

    gl.enable(gl.DEPTH_TEST);
    render();
};

function quad(a,b,c,d){
    var vertices = [
        vec4( -0.5, -0.5,  0.5, 1.0 ), //0
        vec4( -0.5,  0.5,  0.5, 1.0 ), //1
        vec4(  0.5,  0.5,  0.5, 1.0 ), //2
        vec4(  0.5, -0.5,  0.5, 1.0 ), //3
        vec4( -0.5, -0.5, -0.5, 1.0 ), //4
        vec4( -0.5,  0.5, -0.5, 1.0 ), //5
        vec4(  0.5,  0.5, -0.5, 1.0 ), //6
        vec4(  0.5, -0.5, -0.5, 1.0 ), //7 
    ];

    var vertexColors=[
    [0.0, 0.0, 0.0, 1.0 ], // black
    [1.0, 0.0, 0.0, 1.0 ], // red
    [1.0, 1.0, 0.0, 1.0 ], // yellow
    [0.0, 1.0, 0.0, 1.0 ], // green
    [0.0, 0.0, 1.0, 1.0 ], // blue
    [1.0, 0.0, 1.0, 1.0 ], // magenta
    [0.0, 1.0, 1.0, 1.0 ], // cyan
    [1.0, 1.0, 1.0, 1.0 ]  // white
];
    var indices=[a,b,c,a,c,d];

    for(var i=0;i<indices.length;i++){
        points.push(vertices[indices[i]]);
        colors.push(vertexColors[a]);
    }

}

function colorCube(){
    quad(1,0,3,2);
    quad(2,3,7,6);
    quad(3,0,4,7);
    quad(6,5,1,2);
    quad(4,5,6,7);
    quad(5,4,0,1);
}

 function render(){
    gl.clear( gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    theta[axis] += 2.0;    
    gl.uniform3fv(thetaLoc, theta);
    gl.drawArrays( gl.TRIANGLES, 0, NumVertices );
    requestAnimFrame( render );
 }