import { Scene, Vector3, Ray, Color3, StandardMaterial, MeshBuilder } from '@babylonjs/core';
import { WeaponStats } from '../config/weaponConfig';

export class Weapon {
    public stats: WeaponStats;
    public currentAmmo: number;
    public reserveAmmo: number;
    
    private scene: Scene;
    private lastFireTime: number = 0;
    private isReloading: boolean = false;
    // private weaponMesh: Mesh | null = null; // Visual representation to be added

    constructor(stats: WeaponStats, scene: Scene) {
        this.stats = stats;
        this.scene = scene;
        this.currentAmmo = stats.magazineSize;
        this.reserveAmmo = stats.reserveAmmo;
    }

    public canFire(): boolean {
        const now = Date.now();
        const timeBetweenShots = 60000 / this.stats.fireRate;
        return !this.isReloading && this.currentAmmo > 0 && (now - this.lastFireTime) >= timeBetweenShots;
    }

    public fire(origin: Vector3, direction: Vector3, isAds: boolean): void {
        if (!this.canFire()) return;

        this.lastFireTime = Date.now();
        this.currentAmmo--;

        // Calculate spread
        const spreadAngle = isAds ? this.stats.spread.ads : this.stats.spread.hipfire;
        const spreadRad = (spreadAngle * Math.PI) / 180;
        
        // Apply spread to direction
        // Simple spread implementation: perturbation
        const spreadX = (Math.random() - 0.5) * spreadRad;
        const spreadY = (Math.random() - 0.5) * spreadRad;
        
        // Create rotation matrix for spread
        // Ideally we need a local coordinate system relative to direction
        // For MVP, just adding to direction vector (less accurate but works for small angles)
        const finalDirection = direction.clone();
        finalDirection.x += spreadX;
        finalDirection.y += spreadY;
        finalDirection.normalize();

        // Raycast
        const range = this.stats.range.maximum;
        const ray = new Ray(origin, finalDirection, range);
        
        const hit = this.scene.pickWithRay(ray, (mesh) => {
            return mesh.isPickable && mesh.name !== "player" && mesh.name !== "skybox";
        });

        if (hit && hit.pickedPoint) {
            // Visual debug: create a small sphere at hit point
            const sphere = MeshBuilder.CreateSphere("impact", { diameter: 0.1 }, this.scene);
            sphere.position = hit.pickedPoint;
            const mat = new StandardMaterial("impactMat", this.scene);
            mat.emissiveColor = Color3.Red();
            sphere.material = mat;
            
            // Cleanup impact after 1 sec
            setTimeout(() => {
                sphere.dispose();
            }, 1000);

            // Log hit for now
            // console.log(`Hit ${hit.pickedMesh?.name} at distance ${hit.distance}`);
            
            // TODO: Apply damage to entity
        }
    }

    public reload(): Promise<void> {
        if (this.isReloading || this.currentAmmo === this.stats.magazineSize || this.reserveAmmo <= 0) {
            return Promise.resolve();
        }

        this.isReloading = true;
        // console.log("Reloading...");

        return new Promise((resolve) => {
            setTimeout(() => {
                const needed = this.stats.magazineSize - this.currentAmmo;
                const toLoad = Math.min(needed, this.reserveAmmo);
                
                this.currentAmmo += toLoad;
                this.reserveAmmo -= toLoad;
                
                this.isReloading = false;
                // console.log("Reload complete");
                resolve();
            }, this.stats.reloadTime * 1000);
        });
    }

    public update(_deltaTime: number): void {
        // Handle recoil recovery here if needed
    }
}
