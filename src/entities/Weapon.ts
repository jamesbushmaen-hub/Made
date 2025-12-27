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

    // Optimization
    private _ray: Ray;
    private _tempDirection = new Vector3();

    constructor(stats: WeaponStats, scene: Scene) {
        this.stats = stats;
        this.scene = scene;
        this.currentAmmo = stats.magazineSize;
        this.reserveAmmo = stats.reserveAmmo;
        this._ray = new Ray(Vector3.Zero(), Vector3.Forward());
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
        const spreadX = (Math.random() - 0.5) * spreadRad;
        const spreadY = (Math.random() - 0.5) * spreadRad;
        
        // Use temp vector
        this._tempDirection.copyFrom(direction);
        this._tempDirection.x += spreadX;
        this._tempDirection.y += spreadY;
        this._tempDirection.normalize();

        // Update Ray
        this._ray.origin = origin;
        this._ray.direction = this._tempDirection;
        this._ray.length = this.stats.range.maximum;
        
        const hit = this.scene.pickWithRay(this._ray, (mesh) => {
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
                if (!sphere.isDisposed()) {
                    sphere.dispose();
                }
            }, 1000);

            // TODO: Apply damage to entity
            // Check if hit mesh has 'enemy' metadata or name pattern
            // For now, no damage logic connected (Enemy class has takeDamage but we need to map mesh to Enemy instance)
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
