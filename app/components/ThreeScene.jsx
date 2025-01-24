'use client';

import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';

const ThreeScene = ({ cameraRef }) => {
  const canvasRef = useRef(null);
  const modelRef = useRef(null);

  useEffect(() => {
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000); // Camera setup

    if (cameraRef) {
      cameraRef.current = camera; // Assign camera reference passed from parent
    }

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    canvasRef.current.appendChild(renderer.domElement);

    // Lighting setup
    const ambientLight = new THREE.AmbientLight(0x404040, 1);
    scene.add(ambientLight);
    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(5, 5, 5);
    scene.add(directionalLight);

    camera.position.set(0, 0, 1); // Camera start position

    const manager = new THREE.LoadingManager();
    manager.onLoad = () => console.log('Loading complete!');
    
    const loader = new GLTFLoader(manager);
    const scale = 0.5;
    loader.load(
      '/models/rasengan.glb',
      (gltf) => {
        gltf.scene.scale.set(scale, scale, scale);
        scene.add(gltf.scene);
        modelRef.current = gltf.scene;
      },
      (xhr) => console.log('Loading progress:', (xhr.loaded / xhr.total) * 100 + '%'),
      (error) => console.error('Model loading error:', error)
    );

    // Animation loop to render the scene
    const animate = () => {
      requestAnimationFrame(animate);
      if (modelRef.current) {
        modelRef.current.rotation.y += 0.01; // Rotate model
      }
      renderer.render(scene, camera);
    };
    animate();

    const handleResize = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      renderer.setSize(width, height);
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
    };
    window.addEventListener('resize', handleResize);
    handleResize();

    return () => {
      window.removeEventListener('resize', handleResize);
      renderer.dispose();
    };
  }, [cameraRef]);

  return <div ref={canvasRef} className="w-full h-full bg-gradient-radial" style={{ height: '100vh' }} />;
};

export default ThreeScene;
