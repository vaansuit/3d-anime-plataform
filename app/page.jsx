import ThreeScene from './components/ThreeScene';
import GlassCard from './components/GlassCard';

export default function Home() {
  return (
    <div className="relative w-full h-screen overflow-hidden">
      <div className="absolute inset-0 z-0">
        <ThreeScene />
      </div>

      <div className="absolute inset-0 z-10 flex items-center justify-center">
        <GlassCard>
          <h1 className="text-2xl font-bold text-gray-800">Welcome!</h1>
          <p className="mt-2 text-gray-600">
            Click here to start the experience.
          </p>
        </GlassCard>
      </div>
    </div>
  );
}
