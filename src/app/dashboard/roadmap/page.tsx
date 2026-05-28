export default function RoadmapPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
      <div className="w-24 h-24 rounded-full bg-[#D4F87A]/10 border border-[#D4F87A]/20 flex items-center justify-center mb-6 relative">
        <div className="absolute inset-0 rounded-full border border-[#D4F87A]/30 animate-ping opacity-20"></div>
        <span className="material-symbols-outlined text-4xl text-[#D4F87A]">route</span>
      </div>
      
      <h1 className="text-4xl font-bold text-white mb-4 tracking-tight">Your Detailed Roadmap</h1>
      <p className="text-white/60 max-w-lg mb-8 text-lg">
        We are building a highly interactive, timeline-based roadmap experience just for you. Check back soon for the full feature.
      </p>
      
      <div className="glass-card border border-white/5 p-6 rounded-2xl max-w-2xl w-full text-left bg-white/[0.02]">
        <div className="flex items-center gap-4 mb-4">
          <div className="w-12 h-12 rounded-xl bg-[#2E4024]/40 border border-[#D4F87A]/20 flex items-center justify-center">
            <span className="material-symbols-outlined text-[#D4F87A]">construction</span>
          </div>
          <div>
            <h3 className="text-white font-semibold">Under Construction</h3>
            <p className="text-sm text-white/50">Expected completion: Next week</p>
          </div>
        </div>
      </div>
    </div>
  );
}
