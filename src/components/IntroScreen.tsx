import { motion } from 'framer-motion';

interface IntroScreenProps {
  onStart: () => void;
}

export default function IntroScreen({ onStart }: IntroScreenProps) {
  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center bg-slate-950 text-white z-50 overflow-hidden">
      <div className="absolute inset-0 z-0 opacity-20">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-indigo-500 via-slate-900 to-black"></div>
      </div>
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: 0.2 }}
        className="z-10 text-center"
      >
        <h1 className="text-6xl md:text-8xl font-bold tracking-tighter mb-4 text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-indigo-500">
          Hitesh World
        </h1>
        <p className="text-xl md:text-2xl text-slate-400 mb-12 font-light tracking-wide">
          Explore my developer journey like a game.
        </p>
        
        <motion.button
          whileHover={{ scale: 1.05, boxShadow: "0 0 20px rgba(99, 102, 241, 0.5)" }}
          whileTap={{ scale: 0.95 }}
          onClick={onStart}
          className="px-8 py-4 bg-indigo-600 hover:bg-indigo-500 text-white rounded-full font-semibold text-lg transition-colors border border-indigo-400/30"
        >
          Start Game
        </motion.button>
      </motion.div>
    </div>
  );
}
