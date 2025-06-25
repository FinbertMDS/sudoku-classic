import { CORE_EVENTS } from '..';
import { BoardService } from '../../services/BoardService';
import { generateBoard } from '../../utils/boardUtil';
import eventBus from '../eventBus';
import { InitGameCoreEvent } from '../types';

export const handleInitGame = async (payload: InitGameCoreEvent) => {
  try {
    const initGame = generateBoard(payload.level, payload.id);
    await BoardService.save(initGame);
    // Emit gameStarted in next tick
    requestAnimationFrame(() => {
      eventBus.emit(CORE_EVENTS.gameStarted);
    });
  } catch (error) {
    console.error('Error in handleInitGame:', error);
  }
};
