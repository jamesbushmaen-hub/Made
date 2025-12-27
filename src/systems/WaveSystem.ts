import { Vector3 } from '@babylonjs/core';
import { GameEngine } from '../core/Engine';

export class WaveSystem {
    private engine: GameEngine;
    private currentWave: number = 0;
    private enemiesRemainingToSpawn: number = 0;
    private activeEnemies: number = 0;
    private isWaveActive: boolean = false;
    private timeBetweenWaves: number = 5000; // 5 seconds
    private waveTimer: number = 0;
    private spawnTimer: number = 0;
    private spawnInterval: number = 2000; // 2 seconds between spawns

    // Spawn points
    private spawnPoints: Vector3[] = [
        new Vector3(10, 1, 10),
        new Vector3(-10, 1, 10),
        new Vector3(10, 1, -10),
        new Vector3(-10, 1, -10)
    ];

    constructor(engine: GameEngine) {
        this.engine = engine;
    }

    public get wave(): number {
        return this.currentWave;
    }

    public start(): void {
        this.startWave(1);
    }

    public update(deltaTime: number, currentEnemyCount: number): void {
        this.activeEnemies = currentEnemyCount;

        if (!this.isWaveActive) {
            // Timer between waves
            this.waveTimer -= deltaTime * 1000;
            if (this.waveTimer <= 0) {
                this.startWave(this.currentWave + 1);
            }
            return;
        }

        // Wave Logic
        if (this.enemiesRemainingToSpawn > 0) {
            this.spawnTimer -= deltaTime * 1000;
            if (this.spawnTimer <= 0) {
                this.spawnEnemy();
                this.spawnTimer = this.spawnInterval;
            }
        } else if (this.activeEnemies === 0) {
            // Wave Complete
            this.endWave();
        }
    }

    private startWave(waveNumber: number): void {
        this.currentWave = waveNumber;
        this.isWaveActive = true;
        
        // Calculate enemies for this wave
        // Simple progression: 5 + (wave * 2)
        this.enemiesRemainingToSpawn = 5 + (waveNumber * 2);
        
        // Decrease spawn interval
        this.spawnInterval = Math.max(500, 2000 - (waveNumber * 100));

        console.log(`Wave ${waveNumber} started! Enemies: ${this.enemiesRemainingToSpawn}`);
    }

    private endWave(): void {
        this.isWaveActive = false;
        this.waveTimer = this.timeBetweenWaves;
        console.log(`Wave ${this.currentWave} Complete! Next wave in 5s...`);
    }

    private spawnEnemy(): void {
        // Pick random spawn point
        const spawnPoint = this.spawnPoints[Math.floor(Math.random() * this.spawnPoints.length)];
        
        // Pick enemy type based on wave
        // Wave 1-2: Basic
        // Wave 3-4: Basic + Fast
        // Wave 5+: Basic + Fast + Tank
        let type = 'basic';
        const rand = Math.random();
        
        if (this.currentWave >= 5) {
            if (rand > 0.8) type = 'tank';
            else if (rand > 0.5) type = 'fast';
        } else if (this.currentWave >= 3) {
            if (rand > 0.7) type = 'fast';
        }

        this.engine.spawnEnemy(type, spawnPoint.clone());
        this.enemiesRemainingToSpawn--;
    }
}
