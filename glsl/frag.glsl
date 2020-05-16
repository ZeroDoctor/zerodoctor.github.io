/**
    author: Daniel Castro

    purpose: background smoke for
    my resume website/webpage (at this point 
    I don't know yet). the smoke shouldn't be
    flashy or the main focus, however, it should 
    serve as a subtle unique background for a hero.

    it still a work in progress. Although the smoke seems
    random slow and soft, it is lacking in the realism
    department.

    credit to The Book of Shaders for
    having educational website about shaders
    https://thebookofshaders.com
*/
precision lowp float;

#define NOISE fbm
#define NUM_NOISE_OCTAVES 6

uniform float u_time;
uniform vec2 u_resolution;
uniform vec2 u_mouse;

float random(in vec2 p) {
    return fract(sin(dot(p.xy, vec2(32.7410, 99.4443))) * 784537.8457);
}

float noise(in vec2 x) {
    vec2 i = floor(x);
    vec2 f = fract(x);

    float a = random(i);
    float b = random(i + vec2(1.0, 0.0));
    float c = random(i + vec2(0.0, 1.0));
    float d = random(i + vec2(1.0, 1.0));

    // smoothstepping	
    vec2 u = f * f * (3.0 - 2.0 * f);
    return mix(a, b, u.x) + (c - a) * u.y * (1.0 - u.x) + (d - b) * u.x * u.y;
}


float fbm(in vec2 x) {
    float value = 0.0;
    float amp = 0.45;
    vec2 shift = vec2(300.0); 

    float deg = 1.5;
    mat2 rot = mat2(cos(deg), sin(deg), -sin(deg), cos(deg));
    
    //shift.x = u_time + sin(noise(x));
    shift.y = u_time * 0.3 + noise(x);

    // varying octaves in the future
    for(int i = 0; i < NUM_NOISE_OCTAVES; i++) {
        value += amp * noise(x);
        x = rot * x * 2.0 + shift;
        amp *= 0.55;
    }

    return value;
}

void main() {

    //float v = 0.0;
    //vec2 coord = gl_FragCoord.xy * 0.1 - vec2(u_resolution.x / 2.0, u_time * 5.0);
    //v = NOISE(coord);

    vec2 st = (gl_FragCoord.xy - 0.5 * u_resolution.xy) / u_resolution.y;
    //st.x *= u_resolution.x/u_resolution.y;

    vec3 color = vec3(0.0);

    vec2 q = vec2(0.0);
    q.x = NOISE(st);
    q.y = NOISE(st + vec2(1.0));

    vec2 r = vec2(0.0);
    r.x = NOISE(st + 1.0 * q + vec2(1.8, 9.2) + 0.115 * u_time);
    r.y = NOISE(st + 1.0 * q + vec2(6.5, 12.8) + 0.216 * u_time);

    // add for more smoke
    float f = NOISE(st * r - cos(u_time * 0.09));

    // could use sin or cos instead of clamp
    color = mix(
        vec3(0.4118, 0.5216, 0.4471),
        vec3(0.96078,0.96078,0.96078), 
        clamp((f * f)*2., .9,1.));
    color = mix(
        color,
        vec3(0.3882, 0.3373, 0.1176), 
        clamp(length(q), 0.6,1.)); 
    color = mix(
        color,
        vec3(0.24705,0.30196,0.43921), 
        clamp(length(r), 0.3,1.));

    color /= 2.7 - abs(sin(u_time * 0.26) + 0.7 * 1.6);
    

    gl_FragColor = vec4((1.2*f*f*f+.7*f*f+.7*f)*color, 1.0);
}