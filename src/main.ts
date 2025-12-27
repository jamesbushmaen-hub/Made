import { GameEngine } from './core/Engine';

window.addEventListener('DOMContentLoaded', async () => {
    const canvas = document.getElementById('renderCanvas') as HTMLCanvasElement;
    if (!canvas) {
        throw new Error('Canvas not found');
    }

    const game = new GameEngine(canvas);
    await game.initialize();
    game.start();
});
