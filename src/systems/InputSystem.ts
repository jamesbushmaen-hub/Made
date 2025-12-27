import { Scene, ActionManager, ExecuteCodeAction } from '@babylonjs/core';

export class InputSystem {
    private scene: Scene;
    private inputMap: { [key: string]: boolean } = {};
    private mouseMap: { [button: number]: boolean } = {};
    
    // Configurable bindings
    public bindings = {
        forward: 'w',
        backward: 's',
        left: 'a',
        right: 'd',
        jump: ' ', // Space
        crouch: 'c',
        sprint: 'shift',
        reload: 'r',
        fire: 0, // Left click
        aim: 2   // Right click
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

        // Mouse Down
        this.scene.onPointerDown = (evt) => {
            if (evt.button !== -1) {
                this.mouseMap[evt.button] = true;
            }
        };

        // Mouse Up
        this.scene.onPointerUp = (evt) => {
            if (evt.button !== -1) {
                this.mouseMap[evt.button] = false;
            }
        };
    }

    public isKeyDown(key: string): boolean {
        return this.inputMap[key.toLowerCase()] === true;
    }

    public isMouseButtonDown(button: number): boolean {
        return this.mouseMap[button] === true;
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

    public isFirePressed(): boolean {
        return this.isMouseButtonDown(this.bindings.fire);
    }

    public isAimPressed(): boolean {
        return this.isMouseButtonDown(this.bindings.aim);
    }

    public isReloadPressed(): boolean {
        return this.isKeyDown(this.bindings.reload);
    }
}
