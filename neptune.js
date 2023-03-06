import { FrameBuffer, Shader, Texture } from './classes.js';

const canvas = document.querySelector("#gl-canvas");
const gl = canvas.getContext("webgl");
const viewport = {
    width: window.innerWidth,
    height: window.innerHeight
};
const grid = {
    cell_size: 1, 
    resolution: [ 1280, viewport.height/viewport.width * 1280 ] 
};
const force = {
    multiplier: 10000,
    radius: 100
};
const splat = {
    multiplier: 0.3,
    radius: 300
};
const fluid = {
    diffusion: 0.0001,
    viscosity: 0.01,
};
const sim = {
    diffuse_iterations: 50,
    dissipate_iterations: 50,
    project_iterations: 80
};

const screen_quad = [
    // position		texture
    1,	 1,			1,	1,
    1,	-1,			1,	0,
    -1,	 1,			0,	1,
    -1,	-1,			0,	0,
    -1,	 1,			0,	1,
    1,	-1,			1,	0
];

function gl_init() {
    //Initialize WebGL Context

    //Catch errors
    if (gl === null) {
        alert("Unable to initialize WebGL");
        return;
    }

    gl.clearColor(0,0,0,1);
    gl.clear(gl.COLOR_BUFFER_BIT);
}

let prev_time = 0;

function draw(current_time) {
    let delta_time = current_time - prev_time;
    prev_time = current_time;


    window.requestAnimationFrame(draw);
}

gl_init();

window.requestAnimationFrame(draw);