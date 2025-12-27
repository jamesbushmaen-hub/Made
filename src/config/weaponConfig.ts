export interface WeaponStats {
    name: string;
    damage: number;
    fireRate: number;         // Rounds per minute
    magazineSize: number;
    reserveAmmo: number;
    reloadTime: number;       // Seconds
    range: {
        effective: number;
        maximum: number;
    };
    recoil: {
        vertical: number;
        horizontal: number;
        recovery: number;
    };
    adsTime: number;
    spread: {
        hipfire: number;
        ads: number;
    };
}

export const WEAPONS: { [key: string]: WeaponStats } = {
    assault_rifle: {
        name: "AR-15",
        damage: 30,
        fireRate: 600,
        magazineSize: 30,
        reserveAmmo: 120,
        reloadTime: 2.1,
        range: { effective: 40, maximum: 80 },
        recoil: { vertical: 0.3, horizontal: 0.15, recovery: 5 },
        adsTime: 0.25,
        spread: { hipfire: 3.5, ads: 0.8 }
    },
    pistol: {
        name: "M9",
        damage: 25,
        fireRate: 400,
        magazineSize: 15,
        reserveAmmo: 60,
        reloadTime: 1.5,
        range: { effective: 20, maximum: 50 },
        recoil: { vertical: 0.2, horizontal: 0.05, recovery: 8 },
        adsTime: 0.15,
        spread: { hipfire: 2.0, ads: 0.5 }
    },
    sniper: {
        name: "AWP",
        damage: 100,
        fireRate: 50,
        magazineSize: 5,
        reserveAmmo: 20,
        reloadTime: 3.5,
        range: { effective: 150, maximum: 300 },
        recoil: { vertical: 1.5, horizontal: 0.2, recovery: 2 },
        adsTime: 0.4,
        spread: { hipfire: 10.0, ads: 0.0 }
    },
    shotgun: {
        name: "M870",
        damage: 15, // Per pellet
        fireRate: 80,
        magazineSize: 8,
        reserveAmmo: 32,
        reloadTime: 0.8, // Per shell logic needed later
        range: { effective: 10, maximum: 25 },
        recoil: { vertical: 1.0, horizontal: 0.5, recovery: 3 },
        adsTime: 0.3,
        spread: { hipfire: 8.0, ads: 6.0 }
    }
};
