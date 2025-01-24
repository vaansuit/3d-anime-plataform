'use client';

import { useRouter } from "next/navigation"; // Update to 'next/navigation' for App Router

const GlassCard = ({ children }) => {
  const router = useRouter();

  const handleClick = () => {
    router.push("/videos"); // Navigate to the videos route
  };

  return (
    <div
      onClick={handleClick}
      className="bg-white/30 backdrop-blur-md border border-white/20 rounded-lg p-6 shadow-lg cursor-pointer"
    >
      {children}
    </div>
  );
};

export default GlassCard;
