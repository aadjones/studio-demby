// waveVert.vert
precision mediump float;

attribute vec3 aPosition;
uniform mat4 uModelViewMatrix;
uniform mat4 uProjectionMatrix;

uniform float uTime;
uniform float uAmplitude;
uniform float uNoiseScale;

// GLSL pseudo-random function
float rand(vec2 co) {
    return fract(sin(dot(co.xy, vec2(12.9898,78.233))) * 43758.5453);
}

// GLSL smooth noise function
float noise(vec2 st) {
    vec2 i = floor(st);
    vec2 f = fract(st);

    float a = rand(i);
    float b = rand(i + vec2(1.0, 0.0));
    float c = rand(i + vec2(0.0, 1.0));
    float d = rand(i + vec2(1.0, 1.0));

    vec2 u = f * f * (3.0 - 2.0 * f);

    return mix(a, b, u.x) + (c - a) * u.y * (1.0 - u.x) + (d - b) * u.x * u.y;
}

// Main function
void main() {
    // Apply Perlin-like noise for displacement
    vec3 pos = aPosition;
    float displacement = noise(pos.xy * uNoiseScale + vec2(uTime, uTime)) * uAmplitude;
    pos.z += displacement;

    // Transform position
    gl_Position = uProjectionMatrix * uModelViewMatrix * vec4(pos, 1.0);
}
