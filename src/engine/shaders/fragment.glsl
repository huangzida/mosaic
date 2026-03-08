#version 300 es
precision highp float;

uniform float uTime;
uniform vec2 uResolution;
uniform float uGridSize;
uniform float uBlurIntensity;
uniform float uGrainOpacity;
uniform int uTextureType;
uniform vec3 uColor1;
uniform vec3 uColor2;
uniform vec3 uColor3;
uniform float uModernIntensity;
uniform float uModernFlow;
uniform float uModernBloom;

in vec2 vUv;
out vec4 FragColor;

float hash(vec2 p) {
  return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123);
}

float noise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  vec2 u = f * f * (3.0 - 2.0 * f);
  return mix(mix(hash(i + vec2(0.0, 0.0)), hash(i + vec2(1.0, 0.0)), u.x),
             mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), u.x), u.y);
}

void main() {
  vec2 uv = vUv;

  vec2 gridCount = max(uResolution / max(uGridSize, 1.0), vec2(1.0));
  vec2 mosaicUv = floor(uv * gridCount) / gridCount;
  vec2 localUv = fract(uv * gridCount);

  vec2 distortedUv = mosaicUv;
  
  if (uTextureType == 1) {
    float ribbed = sin(uv.x * gridCount.x * 6.28 + uTime * 0.2) * 0.01;
    distortedUv.x += ribbed;
  } else if (uTextureType == 2) {
    float water = noise(uv * 10.0 + uTime * 0.5) * 0.05;
    distortedUv += water;
  }

  float flow = noise(uv * 3.5 + uTime * (0.2 + uModernFlow));
  distortedUv += (flow - 0.5) * 0.02 * uModernFlow;

  vec2 p = distortedUv * 2.2 - 1.1;
  p.x *= uResolution.x / max(uResolution.y, 1.0);
  
  float n1 = noise(p + uTime * 0.1);
  float n2 = noise(p * 1.8 - uTime * 0.05);
  vec3 color = mix(uColor1, uColor2, n1);
  color = mix(color, uColor3, n2 * 0.7);

  float grain = hash(uv * 1000.0) * uGrainOpacity;
  
  if (uTextureType == 0) {
    color += grain;
  } else if (uTextureType == 1) {
    float ribs = abs(sin(uv.x * gridCount.x * 3.14));
    color += ribs * 0.05 * (1.0 - uBlurIntensity);
    color += grain * 0.5;
  } else if (uTextureType == 2) {
    float shimmer = pow(noise(uv * 15.0 + uTime), 3.0) * 0.1;
    color += shimmer;
  }

  float edgeDist = min(min(localUv.x, 1.0 - localUv.x), min(localUv.y, 1.0 - localUv.y));
  float edgeMask = smoothstep(0.0, 0.05, edgeDist);
  color *= 0.96 + 0.04 * edgeMask;
  float gloss = smoothstep(1.0, 0.7, localUv.y) * 0.03 * edgeMask;
  color += gloss;

  float bloom = smoothstep(0.0, 1.0, flow) * uModernBloom;
  vec3 glow = mix(uColor2, uColor3, flow) * bloom;
  color = mix(color, color + glow, uModernIntensity);

  FragColor = vec4(clamp(color, 0.0, 1.0), 1.0);
}
