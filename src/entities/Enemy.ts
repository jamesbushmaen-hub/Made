import { Scene, Vector3, MeshBuilder, Mesh, StandardMaterial, Color3 } from '@babylonjs/core';
import { EnemyStats } from '../config/enemyConfig';
import { Player } from './Player';

export class Enemy {
    public mesh: Mesh;
    public stats: EnemyStats;
    public isDead: boolean = false;
    
    private scene: Scene;
    private player: Player;
    private currentHealth: number;
    private lastAttackTime: number = 0;
    
    // Optimization: Reusable vectors
    private _direction = new Vector3();
    private _lookTarget = new Vector3();

    constructor(scene: Scene, stats: EnemyStats, player: Player, position: Vector3) {
        this.scene = scene;
        this.stats = stats;
        this.player = player;
        this.currentHealth = stats.health;

        // Create Mesh
        this.mesh = MeshBuilder.CreateBox("enemy", { size: 1.8, height: 2 }, this.scene);
        this.mesh.position = position;
        this.mesh.checkCollisions = true;
        this.mesh.ellipsoid = new Vector3(0.5, 1.0, 0.5);
        this.mesh.ellipsoidOffset = new Vector3(0, 1.0, 0);

        // Material
        const mat = new StandardMaterial("enemyMat", this.scene);
        mat.diffuseColor = Color3.FromHexString(stats.color);
        this.mesh.material = mat;
    }

    public update(deltaTime: number): void {
        if (this.isDead) return;

        // Simple AI: Move towards player
        const playerPos = this.player.getPosition();
        // this._direction = playerPos - this.mesh.position
        playerPos.subtractToRef(this.mesh.position, this._direction);
        
        const distance = this._direction.length();
        this._direction.normalize();

        // Move if not in attack range
        if (distance > this.stats.attackRange) {
            // Apply gravity
            // Reuse _direction for velocity but be careful not to mutate it if needed later
            // velocity = direction * speed * dt
            const velocity = this._direction.scale(this.stats.speed * deltaTime);
            velocity.y = -9.81 * deltaTime; // Simple gravity

            this.mesh.moveWithCollisions(velocity);
            
            // Look at player (ignore Y)
            this._lookTarget.set(playerPos.x, this.mesh.position.y, playerPos.z);
            this.mesh.lookAt(this._lookTarget);
        } else {
            // Attack
            this.attack();
        }
    }

    private attack(): void {
        const now = Date.now();
        if (now - this.lastAttackTime >= this.stats.attackCooldown * 1000) {
            this.lastAttackTime = now;
            // console.log("Enemy attacks player!");
            // TODO: Damage player
        }
    }

    public takeDamage(amount: number): void {
        this.currentHealth -= amount;
        if (this.currentHealth <= 0) {
            this.die();
        } else {
            // Flash white effect
            if (this.mesh.material instanceof StandardMaterial) {
                const oldColor = this.mesh.material.diffuseColor;
                this.mesh.material.diffuseColor = Color3.White();
                setTimeout(() => {
                    if (this.mesh.material instanceof StandardMaterial) {
                        this.mesh.material.diffuseColor = oldColor;
                    }
                }, 100);
            }
        }
    }

    private die(): void {
        this.isDead = true;
        this.mesh.dispose();
        // console.log("Enemy died");
    }
}
