import { Engine, Scene, Vector3, HemisphericLight, MeshBuilder, Color4 } from '@babylonjs/core';
import { Player } from '../entities/Player';
import { InputSystem } from '../systems/InputSystem';

export class GameEngine {
    private engine: Engine;
    private scene: Scene;
    private canvas: HTMLCanvasElement;
    private player: Player | null = null;
    private inputSystem: InputSystem;

    constructor(canvas: HTMLCanvasElement) {
        this.canvas = canvas;
        this.engine = new Engine(canvas, true);
        this.scene = new Scene(this.engine);
        this.inputSystem = new InputSystem(this.scene);
        
        // Handle window resize
        window.addEventListener('resize', () => {
            this.engine.resize();
        });
    }

    async initialize(): Promise<void> {
        // Basic Scene Setup
        this.scene.clearColor = new Color4(0.1, 0.1, 0.2, 1);
        
        // Physics (to be added later)
        // const gravityVector = new Vector3(0, -9.81, 0);
        // const physicsPlugin = new CannonJSPlugin();
        // this.scene.enablePhysics(gravityVector, physicsPlugin);

        // Lighting
        const light = new HemisphericLight("light", new Vector3(0, 1, 0), this.scene);
        light.intensity = 0.7;

        // Ground for testing
        const ground = MeshBuilder.CreateGround("ground", { width: 100, height: 100 }, this.scene);
        ground.checkCollisions = true;

        // Test obstacles
        const box = MeshBuilder.CreateBox("box", { size: 2 }, this.scene);
        box.position.y = 1;
        box.position.z = 5;
        box.checkCollisions = true;

        // Player Setup
        this.player = new Player(this.scene, this.inputSystem);
        await this.player.initialize(new Vector3(0, 2, 0));

        // Lock cursor on click
        this.scene.onPointerDown = () => {
            if (document.pointerLockElement !== this.canvas) {
                this.canvas.requestPointerLock();
            }
        };
    }

    start(): void {
        this.engine.runRenderLoop(() => {
            if (this.player) {
                this.player.update();
            }
            this.scene.render();
        });
    }
}
