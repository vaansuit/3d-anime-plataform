'use client';

import { useState, useRef, useEffect } from 'react';
import ThreeScene from './components/ThreeScene';
import GlassCard from './components/GlassCard';
import gsap from 'gsap';
import { fetchYouTubePlaylist } from './utils/youtube'; // Import the fetch function

export default function Home() {
  const [isZoomedIn, setIsZoomedIn] = useState(false);
  const [isCardContentChanged, setIsCardContentChanged] = useState(false); // For transitioning content
  const [showVideoContent, setShowVideoContent] = useState(false); // Dedicated to showing video content
  const [currentPage, setCurrentPage] = useState(0); // Track the current page of videos
  const [playlist, setPlaylist] = useState([]); // State to store fetched playlist
  const [isLoading, setIsLoading] = useState(true); // Loading state
  const [error, setError] = useState(null); // Error state
  const cameraRef = useRef(null);

  const videosPerPage = 6;
  const totalPages = Math.ceil(playlist.length / videosPerPage);
  const startIndex = currentPage * videosPerPage;
  const endIndex = startIndex + videosPerPage;
  const currentVideos = playlist.slice(startIndex, endIndex);

  // Fetch playlist data when the component mounts
  useEffect(() => {
    const playlistId = 'PLzghRWMYy1XtC-DdX75ah-y5wvfLrsL7j'; // Your YouTube playlist ID
    setIsLoading(true);
    fetchYouTubePlaylist(playlistId)
      .then((data) => {
        setPlaylist(data);
        setError(null);
      })
      .catch((error) => {
        setError(error.message);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  const handleNext = (e) => {
    e.stopPropagation(); // Stop event propagation
    if (currentPage < totalPages - 1) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePrevious = (e) => {
    e.stopPropagation(); // Stop event propagation
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1);
    }
  };

  // Function to zoom the camera using GSAP
  const zoomCamera = () => {
    const targetPosition = isZoomedIn ? { z: 1 } : { z: -0.2 }; // Define zoom positions

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

  // Function to handle GlassCard click
  const handleCardClick = () => {
    if (!isCardContentChanged) {
      // When transitioning to the new card (zoom in)
      gsap.to('.glass-card-content', {
        opacity: 0,
        duration: 1,
        ease: 'power2.out',
        onComplete: () => {
          zoomCamera();
          setIsCardContentChanged(true); // Toggle to the new card content
          setShowVideoContent(true); // Show video content

          gsap.to('.glass-card-content', {
            opacity: 1,
            duration: 1,
            ease: 'power2.out',
          });
        },
      });
    } else {
      // When transitioning back to the original card (zoom out)
      gsap.to('.glass-card-content', {
        opacity: 0,
        duration: 1,
        ease: 'power2.out',
        onComplete: () => {
          zoomCamera();
          setIsCardContentChanged(false); // Toggle back to the original content
          setShowVideoContent(false); // Hide video content

          gsap.to('.glass-card-content', {
            opacity: 1,
            duration: 1,
            ease: 'power2.out',
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
            {showVideoContent ? (
              // Render video content
              <div className="flex flex-col items-center space-y-6">
                <h2 className="text-2xl font-bold text-gray-800">Lista de episódios</h2>
                {isLoading ? (
                  <p>Loading videos...</p>
                ) : error ? (
                  <p className="text-red-500">Error: {error}</p>
                ) : (
                  <>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                      {currentVideos.map((video, index) => (
                        <div
                          key={index}
                          className="flex flex-col items-center space-y-2 border rounded-lg p-4 shadow-lg bg-white/70"
                        >
                          <iframe
                            width="280"
                            height="157"
                            src={video.videoUrl}
                            title={video.title}
                            frameBorder="0"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                            className="rounded-lg"
                          ></iframe>
                          <p className="text-sm font-semibold text-gray-800">{video.title}</p>
                        </div>
                      ))}
                    </div>
                    <div className="flex space-x-4">
                      <button
                        onClick={handlePrevious}
                        disabled={currentPage === 0}
                        className="px-4 py-2 bg-blue-500 text-white rounded-lg disabled:bg-gray-300"
                      >
                        Voltar
                      </button>
                      <button
                        onClick={handleNext}
                        disabled={currentPage === totalPages - 1}
                        className="px-4 py-2 bg-blue-500 text-white rounded-lg disabled:bg-gray-300"
                      >
                        Próxima
                      </button>
                    </div>
                  </>
                )}
              </div>
            ) : (
              // Render the initial image and text
              <div className="flex flex-col items-center space-y-4">
                <img
                  src="/thumbs/thumb-naruto-s1.jpg"
                  alt="thumb"
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