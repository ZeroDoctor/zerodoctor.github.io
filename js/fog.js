var gl;
var points;
var _lastTimestamp = 0;
var loc_time;
var speed = 0.0;
var canvas = 0;
var up = true;

function getRelativeMousePosition(event, target) {
    target = target || event.target;
    var rect = target.getBoundingClientRect();
  
    return {
      x: event.clientX - rect.left,
      y: event.clientY - rect.top,
    }
}
  
// assumes target or event.target is canvas
function getCanvasMousePosition(event, target) {
    target = target || event.target;
    var pos = getRelativeMousePosition(event, target);
  
    pos.x = pos.x * target.width  / target.clientWidth;
    pos.y = pos.y * target.height / target.clientHeight;
    
    return pos;  
}

function resizeCanvas() {
	var width = canvas.clientWidth;
	var height = canvas.clientHeight;
	if(canvas.width != width || canvas.height != height) {
		canvas.width = width;
		canvas.height = height;
	}
	
	gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
}

function initFog() {
	var container = document.getElementById("gl-canvas");
	var canvas = document.createElement("canvas");
	canvas.setAttribute("width", "300");
	canvas.setAttribute("height", "250");
	container.appendChild(canvas);

	gl = WebGLUtils.setupWebGL(canvas);
	if (!gl) {
        alert("WebGL isn't available");
        return;
	}

	gl.getExtension('OES_standard_derivatives');
    
	// Four Vertices
	var vertices = [
		vec2(-1.0, -1.0),
		vec2(-1.0, 1.0),
		vec2(1.0, 1.0),
		vec2(1.0, -1.0)
	];

	//
	//  Configure WebGL
	//
	resizeCanvas();
	gl.clearColor(1.0, 0.0, 0.0, 1.0);

	//  Load shaders and initialize attribute buffers
	var program = initShaders(gl, "mobile-vert-shader", "fragment-shader");
	gl.useProgram(program);

	loc_time = gl.getUniformLocation(program, "u_time");
	var loc_mouse = gl.getUniformLocation(program, "u_mouse");
	var loc_resolution = gl.getUniformLocation(program, "u_resolution");
    gl.uniform2fv(loc_resolution, [gl.canvas.width, gl.canvas.height]);
    
    // since canvas is behind other elements, add event listener to 'window' is nessary
    window.addEventListener('mousemove', e => {
        const pos = getCanvasMousePosition(e, gl.canvas);

        // pos is in pixel coordinates for the canvas.
        // so convert to WebGL clip space coordinates
        const x = pos.x / gl.canvas.width  *  2 - 1;
        const y = pos.y / gl.canvas.height * -2 + 1;

        if(x < 1.0 && x > -1.0 && y < 1.0 && y > -1.0) {
            // this.console.log(x + ', ' + y);
            gl.uniform2fv(loc_mouse, [x, y]);
        }
	});
	
	window.addEventListener('resize', e => {
		resizeCanvas();
		gl.uniform2fv(loc_resolution, [gl.canvas.width, gl.canvas.height]);

	})

	// Load the data into the GPU
	var bufferId = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, bufferId);
	gl.bufferData(gl.ARRAY_BUFFER, flatten(vertices), gl.STATIC_DRAW);

	// Associate out shader variables with our data buffer

	var vPosition = gl.getAttribLocation(program, "vPosition");
	gl.vertexAttribPointer(vPosition, 2, gl.FLOAT, false, 0, 0);
	gl.enableVertexAttribArray(vPosition);

	render();
};

function getElapsed() {
	const time = new Date().getTime();
	var elapsed = 0.0;

	if (_lastTimestamp != 0) {
		elapsed = (time - _lastTimestamp) / 1000.0;
	}

	_lastTimestamp = time;

	return elapsed;
}

function getDirection(elapsed) {
	if (up) {
		speed += elapsed;
		if(speed >= 45.0) up = false;
	} else {
		speed -= elapsed;
		if(speed <= 0.0) up = true;
	}
}

function render() {
    drawScene(getElapsed());
    requestAnimFrame(render);
}

function drawScene(elapsed) {
	gl.uniform1f(loc_time, speed);
	getDirection(elapsed)

	gl.clear(gl.COLOR_BUFFER_BIT);
    gl.drawArrays(gl.TRIANGLE_FAN, 0, 4);
}