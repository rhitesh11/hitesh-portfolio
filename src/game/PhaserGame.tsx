import { useEffect, useRef } from 'react';
import Phaser from 'phaser';
import GameScene from './GameScene';

interface PhaserGameProps {
  character: 'male' | 'female';
  onEnterBuilding: (id: string) => void;
}

export default function PhaserGame({ character, onEnterBuilding }: PhaserGameProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const gameInstance = useRef<Phaser.Game | null>(null);
  const onEnterBuildingRef = useRef(onEnterBuilding);

  useEffect(() => {
    onEnterBuildingRef.current = onEnterBuilding;
  }, [onEnterBuilding]);

  useEffect(() => {
    if (!containerRef.current) return;

    const config: Phaser.Types.Core.GameConfig = {
      type: Phaser.AUTO,
      width: window.innerWidth,
      height: window.innerHeight,
      parent: containerRef.current,
      physics: {
        default: 'arcade',
        arcade: {
          gravity: { x: 0, y: 0 },
          debug: false,
        },
      },
      scene: [GameScene],
      backgroundColor: '#f4f7fb',
      scale: {
        mode: Phaser.Scale.RESIZE,
        autoCenter: Phaser.Scale.CENTER_BOTH,
      },
    };

    const game = new Phaser.Game(config);

    game.scene.start('GameScene', {
      character,
      onEnterBuilding: (id: string) => onEnterBuildingRef.current(id),
    });

    gameInstance.current = game;

    const handleResize = () => {
      game.scale.resize(window.innerWidth, window.innerHeight);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      game.destroy(true);
    };
  }, [character]);

  return <div ref={containerRef} className="w-full h-full" />;
}