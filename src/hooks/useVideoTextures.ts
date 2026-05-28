import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';

interface FeedbackRenderTarget extends THREE.WebGLRenderTarget {
  userData: {
    scene: THREE.Scene;
    material: THREE.MeshBasicMaterial;
    videoTexture: THREE.VideoTexture;
  };
}

export function useVideoTextures(videoSrc: string) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const threeVideoTexture = useRef<THREE.VideoTexture | null>(null);
  const feedbackTexture = useRef<FeedbackRenderTarget | null>(null);
  const [texturesReady, setTexturesReady] = useState(false);

  useEffect(() => {
    if (feedbackTexture.current) return;

    const rt = new THREE.WebGLRenderTarget(
      window.innerWidth,
      window.innerHeight,
      {
        minFilter: THREE.LinearFilter,
        magFilter: THREE.LinearFilter,
        format: THREE.RGBAFormat,
      }
    ) as FeedbackRenderTarget;

    feedbackTexture.current = rt;

    const video = document.createElement('video');
    video.src = videoSrc;
    video.crossOrigin = 'anonymous';
    video.loop = true;
    video.muted = true;
    video.playsInline = true;
    video.play();

    videoRef.current = video;

    const videoTexture = new THREE.VideoTexture(video);
    videoTexture.minFilter = THREE.LinearFilter;
    videoTexture.magFilter = THREE.LinearFilter;
    threeVideoTexture.current = videoTexture;

    const feedbackMaterial = new THREE.MeshBasicMaterial({ map: videoTexture });
    const feedbackPlane = new THREE.PlaneGeometry(window.innerWidth, window.innerHeight);
    const feedbackScene = new THREE.Scene();
    feedbackScene.add(new THREE.Mesh(feedbackPlane, feedbackMaterial));

    rt.userData = {
      scene: feedbackScene,
      material: feedbackMaterial,
      videoTexture: videoTexture,
    };

    setTexturesReady(true);

    return () => {
      video.pause();
      video.src = '';
      videoTexture.dispose();
      feedbackMaterial.dispose();
      feedbackPlane.dispose();
      if (feedbackTexture.current) {
        feedbackTexture.current.dispose();
      }
    };
  }, [videoSrc]);

  return { videoTexture: threeVideoTexture, feedbackTexture, texturesReady };
}
