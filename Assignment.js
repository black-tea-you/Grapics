"use strict";

let gl;
let program;

// 애니메이션 변수
let theta = 0.0, time = 0.0, direction = true;

// Uniform 변수 위치 캐싱
let thetaLoc, timeLoc, modeLoc, perspectiveLoc, offsetLoc, cloudOffsetLoc;

let vertices = [];
let colors = [];

// 각 도형의 정점 개수를 상수로 정의하여 관리
const NUM_BACKGROUND_VERTICES = 4;  // 노을 배경 (TRIANGLE_STRIP)
const NUM_SUN_VERTICES = 32;        // 태양 (TRIANGLE_FAN: 중심점 1개 + 원둘레 31개)
const NUM_CLOUD_VERTICES = 160;     // 구름 2개 (각 구름당 4개 원 × 20정점 = 80정점)
const NUM_BLADE_VERTICES = 12;
const NUM_BODY_PARTS_VERTICES = 15; // 지붕(3) + 몸통(6) + 문(6)
const NUM_GRASS_VERTICES = 6;
const NUM_TREE_VERTICES = 18;
const NUM_WATER_POINTS = 4500;

// ✨ BUG FIX: windmillOffset을 init() 함수 밖으로 이동하여 render() 함수가 접근할 수 있도록 수정
const windmillOffset = vec3(0.0, 0.1, -0.6);
const windmillScale = 0.45;


window.onload = function init() {
    const canvas = document.getElementById("gl-canvas");
    gl = WebGLUtils.setupWebGL(canvas);
    if (!gl) { alert("WebGL isn't available"); }

    // --- 도형 정점 및 색상 정의 ---

    // 1. 노을 배경 (TRIANGLE_STRIP으로 전체 화면 덮기)
    const bg_z = 0.9; // 가장 뒤에 배치
    const bgVertices = [
        vec3(-1.0, -1.0, bg_z),  // 왼쪽 아래
        vec3(-1.0, 1.0, bg_z),   // 왼쪽 위
        vec3(1.0, -1.0, bg_z),   // 오른쪽 아래
        vec3(1.0, 1.0, bg_z)     // 오른쪽 위
    ];
    vertices.push(...bgVertices);
    // 색상은 더미 값 (셰이더에서 그라디언트 처리)
    for (let i = 0; i < NUM_BACKGROUND_VERTICES; i++) {
        colors.push(vec4(0.0, 0.0, 0.0, 1.0));
    }

    // 2. 태양 (TRIANGLE_FAN으로 원 그리기) - 왼쪽 끝에 배치
    const sun_x = -0.85, sun_y = 0.5, sun_z = 0.85, sun_radius = 0.18;
    vertices.push(vec3(sun_x, sun_y, sun_z)); // 중심점
    colors.push(vec4(1.0, 0.95, 0.4, 1.0)); // 밝은 노란색
    const numSegments = 30;
    for (let i = 0; i <= numSegments; i++) {
        const angle = (i / numSegments) * 2.0 * Math.PI;
        const x = sun_x + sun_radius * Math.cos(angle);
        const y = sun_y + sun_radius * Math.sin(angle);
        vertices.push(vec3(x, y, sun_z));
        colors.push(vec4(1.0, 0.85, 0.3, 1.0)); // 주황빛 노란색
    }

    // 3. 구름 (TRIANGLE_FAN으로 여러 원을 겹쳐서 구름 모양 만들기)
    const cloud_z = 0.8;
    const cloudColor = vec4(1.0, 1.0, 1.0, 0.9); // 흰색 구름
    const cloudSegments = 18;
    
    // 구름 1 (4개의 원으로 구성)
    const cloud1_positions = [
        { x: 0.3, y: 0.7, r: 0.12 },
        { x: 0.45, y: 0.7, r: 0.1 },
        { x: 0.37, y: 0.78, r: 0.09 },
        { x: 0.37, y: 0.64, r: 0.08 }
    ];
    cloud1_positions.forEach(pos => {
        vertices.push(vec3(pos.x, pos.y, cloud_z));
        colors.push(cloudColor);
        for (let i = 0; i <= cloudSegments; i++) {
            const angle = (i / cloudSegments) * 2.0 * Math.PI;
            const x = pos.x + pos.r * Math.cos(angle);
            const y = pos.y + pos.r * Math.sin(angle);
            vertices.push(vec3(x, y, cloud_z));
            colors.push(cloudColor);
        }
    });
    
    // 구름 2 (4개의 원으로 구성)
    const cloud2_positions = [
        { x: -0.3, y: 0.65, r: 0.11 },
        { x: -0.16, y: 0.65, r: 0.09 },
        { x: -0.23, y: 0.73, r: 0.08 },
        { x: -0.23, y: 0.58, r: 0.075 }
    ];
    cloud2_positions.forEach(pos => {
        vertices.push(vec3(pos.x, pos.y, cloud_z));
        colors.push(cloudColor);
        for (let i = 0; i <= cloudSegments; i++) {
            const angle = (i / cloudSegments) * 2.0 * Math.PI;
            const x = pos.x + pos.r * Math.cos(angle);
            const y = pos.y + pos.r * Math.sin(angle);
            vertices.push(vec3(x, y, cloud_z));
            colors.push(cloudColor);
        }
    });

    // 4. 풍차 날개: 크기만 조절하고 위치(offset)는 적용하지 않음 (셰이더에서 처리)
    const blade_z = -0.5;
    let blade_verts = [
        vec3(-0.7, 0.05, blade_z), vec3(-0.7, -0.05, blade_z), vec3(0.7, -0.05, blade_z), vec3(-0.7, 0.05, blade_z), vec3(0.7, -0.05, blade_z), vec3(0.7, 0.05, blade_z),
        vec3(-0.05, 0.7, blade_z), vec3(-0.05, -0.7, blade_z), vec3(0.05, -0.7, blade_z), vec3(-0.05, 0.7, blade_z), vec3(0.05, -0.7, blade_z), vec3(0.05, 0.7, blade_z)
    ];
    blade_verts.forEach(v => {
        vertices.push(vec3(v[0] * windmillScale, v[1] * windmillScale, v[2] * windmillScale));
        colors.push(vec4(1.0, 1.0, 1.0, 1.0));
    });

    // 2. 풍차 몸통 부분 (지붕, 몸, 문): 크기와 위치 모두 JS에서 미리 계산
    const bodyParts = {
        roof: { verts: [vec3(0.0, 0.3, 0.0), vec3(-0.25, 0.0, 0.0), vec3(0.25, 0.0, 0.0)], color: vec4(0.8, 0.2, 0.2, 1.0) },
        body: { verts: [vec3(-0.25, 0.0, 0.0), vec3(-0.4, -0.8, -0.2), vec3(0.4, -0.8, -0.2), vec3(-0.25, 0.0, 0.0), vec3(0.4, -0.8, -0.2), vec3(0.25, 0.0, 0.0)], color: vec4(0.9, 0.8, 0.6, 1.0) },
        door: { verts: [vec3(-0.1, -0.8, -0.21), vec3(-0.1, -0.5, -0.21), vec3(0.1, -0.5, -0.21), vec3(-0.1, -0.8, -0.21), vec3(0.1, -0.5, -0.21), vec3(0.1, -0.8, -0.21)], color: vec4(0.3, 0.3, 0.3, 1.0) }
    };
    Object.values(bodyParts).forEach(part => {
        part.verts.forEach(v => {
            vertices.push(vec3(v[0] * windmillScale + windmillOffset[0], v[1] * windmillScale + windmillOffset[1], v[2] + windmillOffset[2]));
            colors.push(part.color);
        });
    });

    // 3. 배경 요소들 (잔디, 나무, 물)
    const grass = [vec3(-1.0, -0.2, 0.3), vec3(-1.0, -1.0, -0.5), vec3(1.0, -1.0, -0.5), vec3(-1.0, -0.2, 0.3), vec3(1.0, -1.0, -0.5), vec3(1.0, -0.2, 0.3)];
    vertices.push(...grass);
    for (let i = 0; i < NUM_GRASS_VERTICES; i++) colors.push(vec4(0.4, 0.7, 0.2, 1.0));
    const tree_z = 0.2;
    const treePositions = [-0.6, 0.5, -0.3];
    treePositions.forEach(x_pos => {
        let top = vec3(x_pos, -0.2, tree_z), left = vec3(x_pos - 0.1, -0.5, tree_z), right = vec3(x_pos + 0.1, -0.5, tree_z);
        vertices.push(top, left, right, top, right, left);
        for (let i = 0; i < 6; i++) colors.push(vec4(0.1, 0.4, 0.1, 1.0));
    });
    const water_z = -0.7; // 풍차 앞으로 배치
    for (let i = 0; i < NUM_WATER_POINTS; i++) {
        let x = Math.random() * 2.0 - 1.0, y = Math.random() * 0.067 - 0.433; // 위아래 범위를 1/3로 축소
        vertices.push(vec3(x, y, water_z));
        colors.push(vec4(0.3, 0.6, 1.0, 0.8)); // 더 밝고 투명한 물 색상
    }

    // --- WebGL 초기 설정 ---
    gl.viewport(0, 0, canvas.width, canvas.height);
    gl.clearColor(1.0, 0.5, 0.2, 1.0); // 노을 색상으로 배경 설정
    gl.enable(gl.DEPTH_TEST);
    program = initShaders(gl, "vertex-shader", "fragment-shader");
    gl.useProgram(program);

    // --- 버퍼 데이터 로드 ---
    const cBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, cBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(colors), gl.STATIC_DRAW);
    const vColor = gl.getAttribLocation(program, "vColor");
    gl.vertexAttribPointer(vColor, 4, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(vColor);

    const vBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(vertices), gl.STATIC_DRAW);
    const vPosition = gl.getAttribLocation(program, "vPosition");
    gl.vertexAttribPointer(vPosition, 3, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(vPosition);

    // --- Uniform 변수 위치 가져오기 ---
    thetaLoc = gl.getUniformLocation(program, "theta");
    timeLoc = gl.getUniformLocation(program, "time");
    modeLoc = gl.getUniformLocation(program, "u_mode");
    perspectiveLoc = gl.getUniformLocation(program, "u_perspective_strength");
    offsetLoc = gl.getUniformLocation(program, "u_windmill_offset");
    cloudOffsetLoc = gl.getUniformLocation(program, "u_cloud_offset");

    // --- 이벤트 리스너 및 렌더링 시작 ---
    document.getElementById("directionButton").onclick = () => { direction = !direction; };
    render();
};

function render() {
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    // 애니메이션 변수 업데이트
    time += 0.0025; // 물 속도를 반으로 줄임
    theta += (direction ? 0.02 : -0.02);

    // 그리는 순서: 뒤 -> 앞
    let currentOffset = 0;

    // 1. 노을 배경 그리기 (TRIANGLE_STRIP) - 전체 화면을 완전히 덮기
    gl.disable(gl.DEPTH_TEST);
    gl.depthMask(false); // depth buffer에 쓰지 않기
    gl.uniform1f(perspectiveLoc, 0.0); // perspective 효과 끄기
    gl.uniform1i(modeLoc, 3);
    gl.drawArrays(gl.TRIANGLE_STRIP, currentOffset, NUM_BACKGROUND_VERTICES);
    gl.enable(gl.DEPTH_TEST);
    gl.depthMask(true); // depth buffer 쓰기 다시 켜기
    currentOffset += NUM_BACKGROUND_VERTICES;

    // 공통 Uniform 설정 (배경 이후)
    gl.uniform1f(perspectiveLoc, 0.7);

    // 2. 태양 그리기 (TRIANGLE_FAN)
    gl.uniform1i(modeLoc, 0);
    gl.drawArrays(gl.TRIANGLE_FAN, currentOffset, NUM_SUN_VERTICES);
    currentOffset += NUM_SUN_VERTICES;

    // 3. 구름 그리기 (TRIANGLE_FAN, 이동 효과)
    gl.uniform1i(modeLoc, 4);
    gl.uniform1f(timeLoc, time);
    
    // 구름 1 (첫 4개 원) - offset 0.0
    gl.uniform1f(cloudOffsetLoc, 0.0);
    for (let i = 0; i < 4; i++) {
        gl.drawArrays(gl.TRIANGLE_FAN, currentOffset, 20);
        currentOffset += 20;
    }
    
    // 구름 2 (다음 4개 원) - offset 1.5로 떨어진 위치에서 시작
    gl.uniform1f(cloudOffsetLoc, 1.5);
    for (let i = 0; i < 4; i++) {
        gl.drawArrays(gl.TRIANGLE_FAN, currentOffset, 20);
        currentOffset += 20;
    }

    // 4. 회전하는 풍차 날개 그리기
    gl.uniform1i(modeLoc, 1);
    gl.uniform1f(thetaLoc, theta);
    gl.uniform3fv(offsetLoc, flatten(windmillOffset)); // JS 전역에서 offset 전달
    gl.drawArrays(gl.TRIANGLES, currentOffset, NUM_BLADE_VERTICES);
    currentOffset += NUM_BLADE_VERTICES;

    // 5. 고정된 모든 도형 그리기 (몸통, 잔디, 나무)
    gl.uniform1i(modeLoc, 0);
    const numStaticVertices = NUM_BODY_PARTS_VERTICES + NUM_GRASS_VERTICES + NUM_TREE_VERTICES;
    gl.drawArrays(gl.TRIANGLES, currentOffset, numStaticVertices);
    currentOffset += numStaticVertices;

    // 6. 흐르는 물 그리기
    gl.uniform1i(modeLoc, 2);
    gl.uniform1f(timeLoc, time);
    gl.drawArrays(gl.POINTS, currentOffset, NUM_WATER_POINTS);

    // 다음 프레임 요청
    requestAnimationFrame(render);
}