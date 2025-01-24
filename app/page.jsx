'use client';

import { useState, useRef } from 'react';
import ThreeScene from './components/ThreeScene';
import GlassCard from './components/GlassCard';
import gsap from 'gsap';

export default function Home() {
  const [isZoomedIn, setIsZoomedIn] = useState(false);
  const [isCardContentChanged, setIsCardContentChanged] = useState(false);
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

  // Function to handle GlassCard click and transition content
  const handleCardClick = () => {
    if (!isCardContentChanged) {
      // Fade out the current content
      gsap.to(".glass-card-content", {
        opacity: 0,
        duration: 1,
        ease: "power2.out",
        onComplete: () => {
          // After the content fades out, zoom in the camera
          zoomCamera();
          setIsCardContentChanged(true); // Change content to new card
          
          // Fade in the new content after zooming in
          gsap.to(".glass-card-content", {
            opacity: 1,
            duration: 1,
            ease: "power2.out",
          });
        },
      });
    } else {
      // Fade out new content
      gsap.to(".glass-card-content", {
        opacity: 0,
        duration: 1,
        ease: "power2.out",
        onComplete: () => {
          // After the new content fades out, zoom out the camera
          zoomCamera();
          setIsCardContentChanged(false); // Change content back to original card
          
          // Fade in the original content after zooming out
          gsap.to(".glass-card-content", {
            opacity: 1,
            duration: 1,
            ease: "power2.out",
          });
        },
      });
    }
  };

  return (
    <div className="relative w-full h-screen overflow-hidden">
      <div className="absolute inset-0 z-0">
        <ThreeScene cameraRef={cameraRef} /> {/* Pass the camera ref to ThreeScene */}
      </div>

      <div className="absolute inset-0 z-10 flex items-center justify-center">
        <GlassCard onCardClick={handleCardClick} className="glass-card">
          <div className="glass-card-content">
            {isCardContentChanged ? (
              <div>
                <h2 className="text-2xl font-bold text-gray-800">New Content</h2>
                <p className="mt-2 text-gray-600">This is the new card content!</p>
              </div>
            ) : (
              <div className="flex flex-col items-center space-y-4">
                <img
                src="/thumbs/thumb-naruto-s1.jpg" 
                alt="Welcome Image"
                className="w-200 h-80 border-2 border-black shadow-xl object-cover"
                />
</div>
            )}
          </div>
        </GlassCard>
      </div>
    </div>
  );
}
