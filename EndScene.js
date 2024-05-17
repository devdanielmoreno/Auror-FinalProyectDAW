class EndScene extends Phaser.Scene {
    constructor() {
        super("scene-end");
    }

    create() {
        this.cameras.main.fadeIn(1000, 0, 0, 0);

        this.add.text(this.cameras.main.centerX, this.cameras.main.centerY, "Demo Finalizada", {
            fontFamily: "Orbitron",
            fontSize: '64px',
            fill: '#ffffff',
            stroke: '#000000',
            strokeThickness: 6
        }).setOrigin(0.5);

    }
}
export default EndScene;
