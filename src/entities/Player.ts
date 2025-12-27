import { Scene, Vector3, MeshBuilder, Mesh, UniversalCamera, Ray, Scalar } from '@babylonjs/core';
import { InputSystem } from '../systems/InputSystem';

export class Player {
    private scene: Scene;
    private inputSystem: InputSystem;
    private camera!: UniversalCamera;
    private mesh!: Mesh;
    
    // Movement Parameters
    private speed = 4.5;
    private sprintSpeed = 6.5;
    private crouchSpeed = 2.0;
    private jumpForce = 7.0;
    private gravity = -20.0;
    
    // State
    private velocity = new Vector3(0, 0, 0);
    private isGrounded = false;
    private isCrouching = false;

    constructor(scene: Scene, inputSystem: InputSystem) {
        this.scene = scene;
        this.inputSystem = inputSystem;
    }

    async initialize(startPosition: Vector3): Promise<void> {
        // Create player collision mesh (Capsule)
        this.mesh = MeshBuilder.CreateCapsule("player", { height: 1.8, radius: 0.3 }, this.scene);
        this.mesh.position = startPosition;
        this.mesh.checkCollisions = true;
        this.mesh.ellipsoid = new Vector3(0.3, 0.9, 0.3); // Collision ellipsoid
        this.mesh.ellipsoidOffset = new Vector3(0, 0.9, 0); // Center of ellipsoid relative to mesh pivot (bottom)
        this.mesh.isVisible = false; // Hide the capsule

        // Setup Camera
        this.camera = new UniversalCamera("playerCamera", new Vector3(0, 1.6, 0), this.scene);
        this.camera.parent = this.mesh;
        this.camera.attachControl(this.scene.getEngine().getRenderingCanvas(), true);
        
        // Configure Camera Config
        this.camera.minZ = 0.1;
        this.camera.angularSensibility = 1000; // Lower is faster
        this.camera.inertia = 0.1;
    }

    update(): void {
        const deltaTime = this.scene.getEngine().getDeltaTime() / 1000;
        
        this.handleMovement(deltaTime);
        this.handleCrouch(deltaTime);
    }

    private handleMovement(deltaTime: number): void {
        const moveVector = this.inputSystem.getMovementVector();
        const isSprinting = this.inputSystem.isSprintPressed();
        
        let currentSpeed = isSprinting ? this.sprintSpeed : this.speed;
        if (this.isCrouching) currentSpeed = this.crouchSpeed;

        // Calculate movement direction based on camera rotation
        const forward = this.camera.getDirection(Vector3.Forward());
        const right = this.camera.getDirection(Vector3.Right());
        
        // Flatten vectors to XZ plane
        forward.y = 0;
        forward.normalize();
        right.y = 0;
        right.normalize();

        const desiredVelocity = forward.scale(moveVector.z * currentSpeed).add(right.scale(moveVector.x * currentSpeed));

        // Apply simple gravity
        this.velocity.y += this.gravity * deltaTime;

        // Jump
        if (this.isGrounded && this.inputSystem.isJumpPressed()) {
            this.velocity.y = this.jumpForce; // Jump impulse
            this.isGrounded = false;
        }

        // Apply velocity
        const velocityWithGravity = desiredVelocity.clone();
        velocityWithGravity.y = this.velocity.y;

        // Move with collisions
        this.mesh.moveWithCollisions(velocityWithGravity.scale(deltaTime));

        // Check ground status using Ray
        const ray = new Ray(this.mesh.position.add(new Vector3(0, 0.1, 0)), new Vector3(0, -1, 0), 0.2);
        const hit = this.scene.pickWithRay(ray, (mesh) => mesh !== this.mesh);
        
        if (hit && hit.hit) {
            this.isGrounded = true;
            if (this.velocity.y < 0) this.velocity.y = 0; // Reset gravity accumulator
        } else {
            this.isGrounded = false;
        }
    }

    private handleCrouch(deltaTime: number): void {
        if (this.inputSystem.isCrouchPressed()) {
            this.isCrouching = true;
            // Lower camera
            this.camera.position.y = Scalar.Lerp(this.camera.position.y, 1.0, 10 * deltaTime);
        } else {
            this.isCrouching = false;
            // Raise camera
            this.camera.position.y = Scalar.Lerp(this.camera.position.y, 1.6, 10 * deltaTime);
        }
    }
}
