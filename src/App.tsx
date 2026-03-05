import { useState } from 'react';
import IntroScreen from './components/IntroScreen';
import CharacterSelection from './components/CharacterSelection';
import PhaserGame from './game/PhaserGame';
import Modal from './components/Modal';

export default function App() {
  const [gameState, setGameState] = useState<'intro' | 'character' | 'game'>('intro');
  const [character, setCharacter] = useState<'male' | 'female'>('male');
  const [activeSection, setActiveSection] = useState<string | null>(null);

  const handleStart = () => setGameState('character');
  
  const handleCharacterSelect = (char: 'male' | 'female') => {
    setCharacter(char);
    setGameState('game');
  };

  const handleEnterBuilding = (id: string) => {
    setActiveSection(id);
  };

  const handleCloseModal = () => {
    setActiveSection(null);
  };

  const handleChangeCharacter = () => {
    setGameState('character');
  };

  return (
    <div className="w-screen h-screen overflow-hidden bg-slate-950 font-sans touch-none">
      {gameState === 'intro' && <IntroScreen onStart={handleStart} />}
      
      {gameState === 'character' && (
        <CharacterSelection onSelect={handleCharacterSelect} />
      )}
      
      {gameState === 'game' && (
        <>
          <PhaserGame character={character} onEnterBuilding={handleEnterBuilding} />
          
          <button 
            onClick={handleChangeCharacter}
            className="fixed top-2 left-2 z-10 px-3 py-2 text-xs bg-slate-800/80 hover:bg-slate-700 text-white rounded-lg border border-slate-600 backdrop-blur-sm transition-colors text-sm font-medium shadow-lg"
          >
            Change Character
          </button>

          <Modal 
            isOpen={activeSection !== null} 
            section={activeSection} 
            onClose={handleCloseModal} 
          />
        </>
      )}
    </div>
  );
}
