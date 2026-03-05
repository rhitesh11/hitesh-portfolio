import { motion } from 'framer-motion';

interface CharacterSelectionProps {
  onSelect: (character: 'male' | 'female') => void;
}

export default function CharacterSelection({ onSelect }: CharacterSelectionProps) {
  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center bg-slate-900 text-white z-40">
      <motion.h2 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-4xl md:text-5xl font-bold mb-12 text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-indigo-500"
      >
        Choose Your Character
      </motion.h2>
      
      <div className="flex flex-col md:flex-row gap-8">
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          whileHover={{ scale: 1.05, y: -10 }}
          onClick={() => onSelect('male')}
          className="cursor-pointer bg-slate-800 p-8 rounded-2xl border border-slate-700 hover:border-cyan-500 transition-colors shadow-xl flex flex-col items-center group"
        >
          <div className="w-48 h-48 bg-slate-700 rounded-full mb-6 overflow-hidden flex items-center justify-center group-hover:bg-cyan-900/30 transition-colors">
            {/* SVG Placeholder for Male Developer */}
            <svg viewBox="0 0 100 100" className="w-32 h-32">
              <circle cx="50" cy="30" r="18" fill="#ffddc1" />
              <rect x="30" y="50" width="40" height="50" rx="8" fill="#3b82f6" />
              <rect x="20" y="55" width="12" height="35" rx="6" fill="#ffddc1" />
              <rect x="68" y="55" width="12" height="35" rx="6" fill="#ffddc1" />
            </svg>
          </div>
          <h3 className="text-2xl font-semibold text-slate-200 group-hover:text-cyan-400">Male Developer</h3>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
          whileHover={{ scale: 1.05, y: -10 }}
          onClick={() => onSelect('female')}
          className="cursor-pointer bg-slate-800 p-8 rounded-2xl border border-slate-700 hover:border-pink-500 transition-colors shadow-xl flex flex-col items-center group"
        >
          <div className="w-48 h-48 bg-slate-700 rounded-full mb-6 overflow-hidden flex items-center justify-center group-hover:bg-pink-900/30 transition-colors">
            {/* SVG Placeholder for Female Developer */}
            <svg viewBox="0 0 100 100" className="w-32 h-32">
              <circle cx="50" cy="30" r="18" fill="#ffddc1" />
              <rect x="30" y="50" width="40" height="50" rx="8" fill="#ec4899" />
              <rect x="20" y="55" width="12" height="35" rx="6" fill="#ffddc1" />
              <rect x="68" y="55" width="12" height="35" rx="6" fill="#ffddc1" />
            </svg>
          </div>
          <h3 className="text-2xl font-semibold text-slate-200 group-hover:text-pink-400">Female Developer</h3>
        </motion.div>
      </div>
    </div>
  );
}
