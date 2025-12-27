export class HUD {
    private container: HTMLElement;
    private healthElement!: HTMLElement;
    private ammoElement!: HTMLElement;
    private waveElement!: HTMLElement;
    private crosshairElement!: HTMLElement;

    constructor() {
        this.container = document.getElementById('ui-layer') || document.body;
        this.createElements();
    }

    private createElements(): void {
        // Health
        this.healthElement = document.createElement('div');
        this.healthElement.style.position = 'absolute';
        this.healthElement.style.bottom = '20px';
        this.healthElement.style.left = '20px';
        this.healthElement.style.color = 'white';
        this.healthElement.style.fontSize = '24px';
        this.healthElement.style.fontFamily = 'Arial, sans-serif';
        this.healthElement.style.textShadow = '2px 2px 0 #000';
        this.container.appendChild(this.healthElement);

        // Ammo
        this.ammoElement = document.createElement('div');
        this.ammoElement.style.position = 'absolute';
        this.ammoElement.style.bottom = '20px';
        this.ammoElement.style.right = '20px';
        this.ammoElement.style.color = 'white';
        this.ammoElement.style.fontSize = '24px';
        this.ammoElement.style.fontFamily = 'Arial, sans-serif';
        this.ammoElement.style.textShadow = '2px 2px 0 #000';
        this.container.appendChild(this.ammoElement);

        // Wave
        this.waveElement = document.createElement('div');
        this.waveElement.style.position = 'absolute';
        this.waveElement.style.top = '20px';
        this.waveElement.style.left = '50%';
        this.waveElement.style.transform = 'translateX(-50%)';
        this.waveElement.style.color = 'yellow';
        this.waveElement.style.fontSize = '32px';
        this.waveElement.style.fontFamily = 'Arial, sans-serif';
        this.waveElement.style.textShadow = '2px 2px 0 #000';
        this.container.appendChild(this.waveElement);

        // Crosshair
        this.crosshairElement = document.createElement('div');
        this.crosshairElement.style.position = 'absolute';
        this.crosshairElement.style.top = '50%';
        this.crosshairElement.style.left = '50%';
        this.crosshairElement.style.width = '6px';
        this.crosshairElement.style.height = '6px';
        this.crosshairElement.style.backgroundColor = 'lime';
        this.crosshairElement.style.borderRadius = '50%';
        this.crosshairElement.style.transform = 'translate(-50%, -50%)';
        this.crosshairElement.style.pointerEvents = 'none';
        this.container.appendChild(this.crosshairElement);
    }

    public update(health: number, currentAmmo: number, reserveAmmo: number, wave: number, enemiesLeft: number): void {
        this.healthElement.textContent = `Health: ${Math.ceil(health)}`;
        this.ammoElement.textContent = `${currentAmmo} / ${reserveAmmo}`;
        this.waveElement.textContent = `Wave ${wave} | Enemies: ${enemiesLeft}`;
    }
}
