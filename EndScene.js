class EndScene extends Phaser.Scene {
    constructor() {
        super("scene-end");
    }

    create() {
        this.add.text(this.cameras.main.centerX, this.cameras.main.centerY, "Demo Finalizada", {
            fontFamily: "Orbitron",
            fontSize: '64px',
            fill: '#ffffff'
        }).setOrigin(0.5);
    }
}
export default EndScene;
