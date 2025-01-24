'use client';

const GlassCard = ({ children, onCardClick }) => {
  return (
    <div
      onClick={onCardClick} // Trigger the content change and zoom
      className="bg-white/30 backdrop-blur-md border border-white/20 rounded-lg p-6 shadow-lg cursor-pointer"
    >
      {children}
    </div>
  );
};

export default GlassCard;
