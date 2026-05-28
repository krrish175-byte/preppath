import * as THREE from 'three';

export const NUM_COLS = 100;
export const NUM_ROWS = 50;
export const NUM_INSTANCES = NUM_COLS * NUM_ROWS;

// Precompute instanced UVs and centers
const instancedUvs = new Float32Array(NUM_INSTANCES * 2);
const instancedCenters = new Float32Array(NUM_INSTANCES * 2);

for (let i = 0; i < NUM_INSTANCES; i++) {
  const col = i % NUM_COLS;
  const row = Math.floor(i / NUM_COLS);
  const cellX = (col + 0.5) / NUM_COLS;
  const cellY = (row + 0.5) / NUM_ROWS;
  instancedUvs[i * 2] = cellX;
  instancedUvs[i * 2 + 1] = cellY;
  const centerX = (col / NUM_COLS) * 2.0 - 1.0;
  const centerY = (row / NUM_ROWS) * 2.0 - 1.0;
  instancedCenters[i * 2] = centerX;
  instancedCenters[i * 2 + 1] = centerY;
}

export { instancedUvs, instancedCenters };

const vertexHeader = `
attribute vec2 iUv;
attribute vec2 iCenter;
varying vec2 vUv;
varying vec2 vCenter;
varying vec2 vTextUv;
varying float vScale;
#ifdef USE_FEEDBACK
varying vec2 vFeedbackUv;
#endif
`;

const vertexTransform = `
vUv = iUv;
vCenter = iCenter;
vTextUv = uv;
vScale = 1.0;
#ifdef USE_FEEDBACK
vec4 feedbackUv = projectionMatrix * modelViewMatrix * instanceMatrix * vec4(vec3(0.0), 1.0);
vFeedbackUv = feedbackUv.xy / feedbackUv.w * 0.5 + 0.5;
#endif
vec4 texel = texture2D(uMap, iUv);
float brightness = (texel.r + texel.g + texel.b) / 3.0;
vScale = brightness;
vec3 newPosition = position * brightness;
vec4 worldPosition = instanceMatrix * vec4(newPosition, 1.0);
gl_Position = projectionMatrix * modelViewMatrix * worldPosition;
`;

const fragmentHeader = `
varying vec2 vUv;
varying vec2 vCenter;
varying vec2 vTextUv;
varying float vScale;
uniform sampler2D uMap;
uniform sampler2D uFontAtlas;
uniform float uGlyphHeight;
uniform float uGlyphVerticalSpacing;
uniform sampler2D uFeedbackTexture;
uniform float uNeedUseFeedback;
#ifdef USE_FEEDBACK
varying vec2 vFeedbackUv;
#endif
`;

const fragmentMain = `
vec4 finalColor = vec4(0.0);
if (vScale > 0.01) {
  vec4 texel = texture2D(uMap, vUv);
  finalColor = texel;
  vec2 textUv = vTextUv;
  textUv.y *= uGlyphHeight;
  textUv += vec2(0.0, 1.0 - uGlyphHeight);
  vec4 glyphColor = texture2D(uFontAtlas, textUv);
  finalColor.rgb = glyphColor.rgb;
}
#ifdef USE_FEEDBACK
if (uNeedUseFeedback > 0.01) {
  vec4 feedbackTexel = texture2D(uFeedbackTexture, vFeedbackUv);
  vec3 feedbackColor = feedbackTexel.rgb;
  float feedbackBrightness = (feedbackTexel.r + feedbackTexel.g + feedbackTexel.b) / 3.0;
  finalColor.rgb = mix(finalColor.rgb, feedbackColor, 0.7);
  finalColor.a = max(finalColor.a, feedbackBrightness);
}
#endif
gl_FragColor = finalColor;
`;

export function setupInstancedTextMaterial(material: THREE.Material): THREE.MeshBasicMaterial {
  const mat = material as THREE.MeshBasicMaterial;
  
  mat.onBeforeCompile = (shader) => {
    shader.vertexShader = shader.vertexShader.replace(
      '#include <common>',
      vertexHeader + '\n#include <common>'
    );
    shader.vertexShader = shader.vertexShader.replace(
      '#include <project_vertex>',
      vertexTransform
    );
    shader.fragmentShader = shader.fragmentShader.replace(
      '#include <common>',
      fragmentHeader + '\n#include <common>'
    );
    shader.fragmentShader = shader.fragmentShader.replace(
      '#include <dithering_fragment>',
      fragmentMain + '\n#include <dithering_fragment>'
    );
  };

  // Define custom uniforms
  mat.defines = mat.defines || {};
  mat.defines['USE_UV'] = '';
  mat.defines['USE_FEEDBACK'] = '';

  // Store uniforms on the material for later access
  (mat as any).uniforms = {
    uMap: { value: null },
    uGlyphHeight: { value: 0.78 },
    uGlyphVerticalSpacing: { value: 1.0 },
    uFontAtlas: { value: null },
    uFeedbackTexture: { value: null },
    uNeedUseFeedback: { value: 1.0 },
  };

  return mat;
}
