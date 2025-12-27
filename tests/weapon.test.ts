import { describe, it, expect, vi, beforeEach } from 'vitest';
import { Weapon } from '../src/entities/Weapon';
import { WEAPONS } from '../src/config/weaponConfig';
import { NullEngine, Scene, Vector3 } from '@babylonjs/core';

describe('Weapon System', () => {
    let scene: Scene;
    let engine: NullEngine;

    beforeEach(() => {
        engine = new NullEngine();
        scene = new Scene(engine);
    });

    it('should initialize with correct ammo', () => {
        const stats = WEAPONS.assault_rifle;
        const weapon = new Weapon(stats, scene);

        expect(weapon.currentAmmo).toBe(stats.magazineSize);
        expect(weapon.reserveAmmo).toBe(stats.reserveAmmo);
    });

    it('should consume ammo when fired', () => {
        const stats = WEAPONS.pistol;
        const weapon = new Weapon(stats, scene);
        
        // Mock raycast to avoid complex scene setup
        scene.pickWithRay = vi.fn().mockReturnValue({ hit: false });

        const startAmmo = weapon.currentAmmo;
        weapon.fire(Vector3.Zero(), Vector3.Forward(), false);

        expect(weapon.currentAmmo).toBe(startAmmo - 1);
    });

    it('should not fire if out of ammo', () => {
        const stats = WEAPONS.pistol;
        const weapon = new Weapon(stats, scene);
        weapon.currentAmmo = 0;

        weapon.fire(Vector3.Zero(), Vector3.Forward(), false);
        expect(weapon.currentAmmo).toBe(0);
    });

    it('should reload correctly', async () => {
        const stats = WEAPONS.pistol;
        // Reduce reload time for test
        const testStats = { ...stats, reloadTime: 0.1 };
        const weapon = new Weapon(testStats, scene);
        
        weapon.currentAmmo = 0;
        const startReserve = weapon.reserveAmmo;

        const reloadPromise = weapon.reload();
        
        // Should be reloading
        expect(weapon.canFire()).toBe(false);

        await reloadPromise;

        expect(weapon.currentAmmo).toBe(testStats.magazineSize);
        expect(weapon.reserveAmmo).toBe(startReserve - testStats.magazineSize);
    });
});
