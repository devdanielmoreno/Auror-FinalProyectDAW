class EndScene extends Phaser.Scene {
    constructor() {
        super("scene-end");
    }

    create() {
        this.cameras.main.fadeIn(1000, 0, 0, 0);

        const centerX = this.cameras.main.centerX;
        const centerY = this.cameras.main.centerY;

        const text = this.add.text(
            centerX - 220, 
            centerY - 60,
            "Gracias amigo mío,\nSabía que podía confiar en ti,\n-Rod",
            {
                fontFamily: "Orbitron",
                fontSize: '50px',
                fill: '#ffffff',
                stroke: '#000000',
                strokeThickness: 4,
                align: 'center'
            }
        ).setOrigin(0.5);

        const rodImage = this.add.image(
            text.x + text.width / 2 + 180, 
            text.y - 10,
            'rod_image'
        ).setOrigin(0.5).setScale(0.3);

        this.time.delayedCall(3000, () => {
            const continueText = this.add.text(
                this.cameras.main.width - 10, 
                this.cameras.main.height - 10, 
                "Continuara...",
                {
                    fontFamily: "Orbitron",
                    fontSize: '50px',
                    fill: '#ffffff',
                    stroke: '#000000',
                    strokeThickness: 3
                }
            ).setOrigin(1, 1).setDepth(9001);

            this.tweens.add({
                targets: continueText,
                alpha: 0,
                duration: 500,
                ease: 'Linear',
                yoyo: true,
                repeat: -1
            });
        });
    }
}

export default EndScene;
