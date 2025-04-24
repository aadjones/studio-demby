#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 u_resolution;
uniform float u_carrierFreqX;
uniform float u_carrierFreqY;
uniform float u_modulatorFreq;
uniform float u_modulationIndex;
uniform float u_amplitudeModulationIndex;
uniform vec2 u_modulationCenter;
uniform float u_time;
uniform float u_lfoFrequency;
uniform float u_lfoAmplitude;

// Helper functions for 2D simplex noise
vec3 mod289(vec3 x) {
  return x - floor(x / 289.0) * 289.0;
}
vec2 mod289(vec2 x) {
  return x - floor(x / 289.0) * 289.0;
}
vec3 permute(vec3 x) {
  return mod289(((x * 34.0) + 1.0) * x);
}
float snoise(vec2 v) {
    const vec4 C = vec4(0.211324865405187,  // (3.0 - √3)/6
                        0.366025403784439,  // (√3 - 1)/2
                       -0.577350269189626,  // -1.0 + 2·C.x
                        0.024390243902439); // 1/41
    vec2 i = floor(v + dot(v, C.yy));
    vec2 x0 = v - i + dot(i, C.xx);
    vec2 i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
    vec4 x12 = x0.xyxy + C.xxzz;
    x12.xy -= i1;
    i = mod289(i);
    vec3 p = permute(
               permute(vec3(i.y + vec3(0.0, i1.y, 1.0)))
             + i.x + vec3(0.0, i1.x, 1.0)
             );
    vec3 m = max(0.5 - vec3(
                          dot(x0,x0),
                          dot(x12.xy,x12.xy),
                          dot(x12.zw,x12.zw)
                        ), 0.0);
    m = m*m; 
    m = m*m;
    vec3 x = 2.0 * fract(p * C.www) - 1.0;
    vec3 h = abs(x) - 0.5;
    vec3 ox = floor(x + 0.5);
    vec3 a0 = x - ox;
    m *= 1.79284291400159 - 
         0.85373472095314 * (a0*a0 + h*h);
    vec3 g;
    g.x  = a0.x * x0.x + h.x  * x0.y;
    g.yz = a0.yz * x12.xz + h.yz * x12.yw;
    return 130.0 * dot(m, g);
}

void main() {
  // Map pixel coords to [-1,1]×[-1,1]
  vec2 st = gl_FragCoord.xy / u_resolution * 2.0 - 1.0;

  // LFO oscillation
  float lfo = sin(2.0 * 3.14159 * u_lfoFrequency * u_time)
            * u_lfoAmplitude;

  // Dynamic modulation indices
  float dynamicModIndex = u_modulationIndex + lfo;
  float dynamicAmpIndex = u_amplitudeModulationIndex + lfo;

  // FIX: combine manual center + LFO symmetrically
  vec2 newCenter = u_modulationCenter + vec2(lfo, lfo);

  // 2D sinusoidal carrier
  float carrierX = sin(2.0 * 3.14159 * u_carrierFreqX * st.x);
  float carrierY = sin(2.0 * 3.14159 * u_carrierFreqY * st.y);

  // Circular modulator around newCenter
  float dist = length(st - newCenter);
  float modulator = sin(2.0 * 3.14159 * u_modulatorFreq * dist);

  // FM + AM
  float modCarX = sin(
    2.0 * 3.14159 * u_carrierFreqX * st.x
    + dynamicModIndex * modulator
  );
  float modCarY = sin(
    2.0 * 3.14159 * u_carrierFreqY * st.y
    + dynamicModIndex * modulator
  );
  float ampModX = modCarX * (1.0 + dynamicAmpIndex * modulator);
  float ampModY = modCarY * (1.0 + dynamicAmpIndex * modulator);

  float combined = ampModX + ampModY;
  combined = combined * 0.5 + 0.5;

  gl_FragColor = vec4(vec3(combined), 1.0);
}
