'use client';

import { useState, useRef } from 'react';
import ThreeScene from './components/ThreeScene';
import GlassCard from './components/GlassCard';
import gsap from 'gsap';

export default function Home() {
  const [isZoomedIn, setIsZoomedIn] = useState(false);
  const cameraRef = useRef(null);

  // Function to zoom the camera using GSAP
  const zoomCamera = () => {
    const targetPosition = isZoomedIn ? { z: 1 } : { z: -0.2 }; // Define zoom positions

    // Use GSAP to animate the camera zoom
    gsap.to(cameraRef.current.position, {
      duration: 2,
      z: targetPosition.z,
      ease: 'power2.out',
      onUpdate: () => {
        cameraRef.current.updateProjectionMatrix(); // Update projection matrix during animation
      },
    });

    setIsZoomedIn(!isZoomedIn); // Toggle zoom state
  };

  return (
    <div className="relative w-full h-screen overflow-hidden">
      <div className="absolute inset-0 z-0">
        <ThreeScene cameraRef={cameraRef} /> {/* Pass the camera ref to ThreeScene */}
      </div>

      <div className="absolute inset-0 z-10 flex items-center justify-center">
        <GlassCard onCardClick={zoomCamera}>
          <h1 className="text-2xl font-bold text-gray-800">Welcome!</h1>
          <p className="mt-2 text-gray-600">
            Click here to start the experience.
          </p>
        </GlassCard>
      </div>
    </div>
  );
}
