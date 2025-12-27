export interface EnemyStats {
    type: string;
    health: number;
    speed: number;
    damage: number;
    attackRange: number;
    attackCooldown: number;
    scoreValue: number;
    color: string; // Hex color for debug mesh
}

export const ENEMIES: { [key: string]: EnemyStats } = {
    basic: {
        type: 'basic',
        health: 100,
        speed: 3.5,
        damage: 15,
        attackRange: 1.5,
        attackCooldown: 1.0,
        scoreValue: 10,
        color: "#FF0000"
    },
    fast: {
        type: 'fast',
        health: 60,
        speed: 6.0,
        damage: 10,
        attackRange: 1.5,
        attackCooldown: 0.7,
        scoreValue: 20,
        color: "#FFA500"
    },
    tank: {
        type: 'tank',
        health: 300,
        speed: 2.0,
        damage: 40,
        attackRange: 2.0,
        attackCooldown: 2.0,
        scoreValue: 50,
        color: "#8B0000"
    }
};
