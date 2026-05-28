import { useMemo, useEffect, Suspense } from 'react';
import { Canvas, useThree, useFrame } from '@react-three/fiber';
import { OrthographicCamera, useTexture } from '@react-three/drei';
import * as THREE from 'three';
import { useVideoTextures } from '@/hooks/useVideoTextures';
import {
  setupInstancedTextMaterial,
  instancedUvs,
  instancedCenters,
  NUM_COLS,
  NUM_ROWS,
  NUM_INSTANCES,
} from '@/lib/instancedTextMaterial';

interface FeedbackRenderTarget extends THREE.WebGLRenderTarget {
  userData: {
    scene: THREE.Scene;
    material: THREE.MeshBasicMaterial;
    videoTexture: THREE.VideoTexture;
  };
}

function Effects({ videoSrc }: { videoSrc: string }) {
  const { size, gl, scene, camera } = useThree();
  const { videoTexture, feedbackTexture, texturesReady } = useVideoTextures(videoSrc);
  const fontAtlas = useTexture('/images/font-atlas.png');

  const outputTarget = useMemo(
    () =>
      new THREE.WebGLRenderTarget(size.width, size.height, {
        minFilter: THREE.LinearFilter,
        magFilter: THREE.LinearFilter,
        format: THREE.RGBAFormat,
      }),
    [size]
  );

  const asciiMaterial = useMemo(() => setupInstancedTextMaterial(new THREE.MeshBasicMaterial()), []);

  useEffect(() => {
    const fb = feedbackTexture.current as FeedbackRenderTarget | null;
    const vt = videoTexture.current;
    if (!fb || !vt || !fontAtlas || !outputTarget) return;

    fb.userData.material.map = vt;
    (asciiMaterial as any).uniforms.uMap.value = fb.texture;
    (asciiMaterial as any).uniforms.uFontAtlas.value = fontAtlas;
    (asciiMaterial as any).uniforms.uFeedbackTexture.value = outputTarget.texture;
  }, [feedbackTexture, videoTexture, fontAtlas, outputTarget, asciiMaterial]);

  const instancedMesh = useMemo(() => {
    const baseGeometry = new THREE.PlaneGeometry(1, 1);
    const instancedGeometry = new THREE.InstancedBufferGeometry();
    instancedGeometry.index = baseGeometry.index;
    instancedGeometry.attributes.position = baseGeometry.attributes.position;
    instancedGeometry.attributes.uv = baseGeometry.attributes.uv;
    instancedGeometry.attributes.iUv = new THREE.InstancedBufferAttribute(instancedUvs, 2);
    instancedGeometry.attributes.iCenter = new THREE.InstancedBufferAttribute(instancedCenters, 2);

    const mesh = new THREE.InstancedMesh(instancedGeometry, asciiMaterial, NUM_INSTANCES);

    const aspect = size.width / size.height;
    const fontAspect = NUM_COLS / NUM_ROWS;
    let scaleX = 1 / NUM_COLS;
    let scaleY = 1 / NUM_COLS;
    if (aspect > fontAspect) {
      scaleX *= fontAspect / aspect;
    } else {
      scaleY *= aspect / fontAspect;
    }

    const cellW = scaleX * 2.0;
    const cellH = scaleY * 2.0;
    const dummy = new THREE.Object3D();

    for (let i = 0; i < NUM_INSTANCES; i++) {
      const col = i % NUM_COLS;
      const row = Math.floor(i / NUM_COLS);
      dummy.position.set(
        col * cellW + cellW * 0.5 - scaleX,
        row * cellH + cellH * 0.5 - scaleY,
        0
      );
      dummy.updateMatrix();
      mesh.setMatrixAt(i, dummy.matrix);
    }

    mesh.instanceMatrix.needsUpdate = true;
    return mesh;
  }, [asciiMaterial, size]);

  useFrame(() => {
    const fb = feedbackTexture.current as FeedbackRenderTarget | null;
    if (fb) {
      gl.setRenderTarget(fb);
      gl.render(fb.userData.scene, camera);
      gl.setRenderTarget(null);
    }

    gl.setRenderTarget(outputTarget);
    gl.render(scene, camera);
    gl.setRenderTarget(null);

    gl.render(scene, camera);
  });

  return (
    <>
      {texturesReady && <primitive object={instancedMesh} />}
      <OrthographicCamera makeDefault position={[0, 0, 2000]} zoom={1} />
    </>
  );
}

export default function InstancedText({ videoSrc }: { videoSrc: string }) {
  return (
    <div style={{ position: 'absolute', inset: 0, zIndex: 0 }}>
      <Canvas
        gl={{
          alpha: true,
          antialias: false,
          preserveDrawingBuffer: true,
        }}
        style={{ background: 'transparent' }}
      >
        <Suspense fallback={null}>
          <Effects videoSrc={videoSrc} />
        </Suspense>
      </Canvas>
    </div>
  );
}
