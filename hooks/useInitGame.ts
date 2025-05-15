import {useEffect, useState} from 'react';
import {BoardService} from '../services/BoardService';
import {InitGame} from '../types';

interface UseInitGameResult {
  cages: InitGame['cages'] | null;
  solvedBoard: InitGame['solvedBoard'] | null;
}

export const useInitGame = (id: string): UseInitGameResult => {
  const [cages, setCages] = useState<InitGame['cages'] | null>(null);
  const [solvedBoard, setSolvedBoard] = useState<
    InitGame['solvedBoard'] | null
  >(null);

  useEffect(() => {
    const loadInitGame = async () => {
      try {
        const initGame = await BoardService.loadInit();

        if (initGame && initGame.id === id) {
          setCages(initGame.cages);
          setSolvedBoard(initGame.solvedBoard);
        }
      } catch (err) {
        console.error(err);
      }
    };

    loadInitGame();
  }, [id]);

  return {
    cages,
    solvedBoard,
  };
};
