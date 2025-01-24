'use client';

import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';

const ThreeScene = () => {
  const canvasRef = useRef(null); // Reference for the container div
  const modelRef = useRef(null); // Reference for the loaded model

  useEffect(() => {
    // Scene setup
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true});
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    canvasRef.current.appendChild(renderer.domElement);

    // Add basic lighting
    const ambientLight = new THREE.AmbientLight(0x404040, 1); // Ambient light
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 1); // Directional light
    directionalLight.position.set(5, 5, 5); // Light position
    scene.add(directionalLight);

    // Camera positioning
    camera.position.set(0, 0, 1); // Set the camera closer to the object

    // Create a loading manager to track model loading status
    const manager = new THREE.LoadingManager();

    // Log when the model is loaded
    manager.onLoad = () => {
      console.log('Loading complete!');
    };

    // Load the GLTF model
    const loader = new GLTFLoader(manager);
    const scale = 0.5; // Scale of the model

    // Load the model once
    loader.load(
      '/models/rasengan.glb', // Path to your GLB file
      (gltf) => {
        // Scale and rotate the model
        gltf.scene.scale.set(scale, scale, scale);
        gltf.scene.rotation.y = Math.PI / 6; // Rotate 30% to the left

        // Position the model in the center
        gltf.scene.position.set(0, 0, 0); // Set the position

        // Add the model to the scene
        scene.add(gltf.scene);

        // Store the model reference
        modelRef.current = gltf.scene;
      },
      (xhr) => {
        console.log('Loading progress:', (xhr.loaded / xhr.total) * 100 + '%');
      },
      (error) => {
        console.error('Model loading error:', error);
      }
    );

    // Animation loop to render the scene
    const animate = () => {
      requestAnimationFrame(animate);

      // Rotate the model to make it spin
      if (modelRef.current) {
        modelRef.current.rotation.y += 0.01; // Speed of the rotation
      }

      renderer.render(scene, camera);
    };
    animate();

    // Resize handling to maintain full-screen on window resize
    const handleResize = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;

      // Resize renderer and camera
      renderer.setSize(width, height);
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
    };
    window.addEventListener('resize', handleResize);

    // Initial resize
    handleResize();

    // Cleanup on component unmount
    return () => {
      window.removeEventListener('resize', handleResize);
      renderer.dispose();
    };
  }, []); // The empty array ensures that this runs only once

  return (
    <div
      ref={canvasRef}
      className="w-full h-full bg-gradient-radial"
      style={{ height: '100vh' }}
    />
  );
};

export default ThreeScene;
