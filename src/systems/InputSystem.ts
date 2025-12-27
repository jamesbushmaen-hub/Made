import { Scene, ActionManager, ExecuteCodeAction } from '@babylonjs/core';

export class InputSystem {
    private scene: Scene;
    private inputMap: { [key: string]: boolean } = {};
    
    // Configurable bindings
    public bindings = {
        forward: 'w',
        backward: 's',
        left: 'a',
        right: 'd',
        jump: ' ', // Space
        crouch: 'c',
        sprint: 'shift',
        reload: 'r'
    };

    constructor(scene: Scene) {
        this.scene = scene;
        this.setupInputs();
    }

    private setupInputs(): void {
        this.scene.actionManager = new ActionManager(this.scene);

        // Key Down
        this.scene.actionManager.registerAction(new ExecuteCodeAction(ActionManager.OnKeyDownTrigger, (evt) => {
            const key = evt.sourceEvent.key.toLowerCase();
            this.inputMap[key] = true;
        }));

        // Key Up
        this.scene.actionManager.registerAction(new ExecuteCodeAction(ActionManager.OnKeyUpTrigger, (evt) => {
            const key = evt.sourceEvent.key.toLowerCase();
            this.inputMap[key] = false;
        }));
    }

    public isKeyDown(key: string): boolean {
        return this.inputMap[key.toLowerCase()] === true;
    }

    public getMovementVector(): { x: number, z: number } {
        let x = 0;
        let z = 0;

        if (this.isKeyDown(this.bindings.forward)) z += 1;
        if (this.isKeyDown(this.bindings.backward)) z -= 1;
        if (this.isKeyDown(this.bindings.left)) x -= 1;
        if (this.isKeyDown(this.bindings.right)) x += 1;

        return { x, z };
    }

    public isJumpPressed(): boolean {
        return this.isKeyDown(this.bindings.jump);
    }

    public isCrouchPressed(): boolean {
        return this.isKeyDown(this.bindings.crouch);
    }

    public isSprintPressed(): boolean {
        return this.isKeyDown(this.bindings.sprint);
    }
}
