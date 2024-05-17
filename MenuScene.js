import "./style.css";
import Phaser from "phaser";

const sizes = {
    width: 1500,
    height: 800
};

class MenuScene extends Phaser.Scene {
    constructor() {
        super("scene-menu");
        this.mInicio = null;
    }

    preload() {
        this.load.image("background", "assets/Mapa/Mapa.png");
        this.load.image("background2", "assets/Mapa/Mapa2.png"); 
        this.load.image("startButton", "assets/HUD/boton.png");
        this.input.setDefaultCursor('url(assets/HUD/cursor.png), pointer');
        this.load.audio("mInicio", "assets/Musica/inicio.ogg");
    }

    create() {
        this.mInicio = this.sound.add("mInicio");
        this.mInicio.play();
        this.mInicio.loop = true;
        this.mInicio.setVolume(0.2);

        const backgroundImage = this.add.image(0, 0, "background")
            .setOrigin(0, 0)
            .setDisplaySize(sizes.width, sizes.height);

        const backgroundImage2 = this.add.image(0, 0, "background2")
            .setOrigin(0, 0)
            .setDisplaySize(sizes.width, sizes.height)
            .setAlpha(0); 

        const titleText = this.add.text(
            sizes.width / 2,
            sizes.height / 4 - 60,
            "Auror",
            {
                fontSize: '200px',
                fontWeight: 'bold',
                fill: 'gray',
                fontFamily: "Jaini Purva",
                stroke: '#000000',
                strokeThickness: 10
            }
        ).setDepth(100).setOrigin(0.5);

        const startButton = this.add.image(sizes.width / 2, sizes.height / 2 + 50, "startButton");
        startButton.setInteractive();
        startButton.on('pointerdown', () => {
            this.startTransition(titleText, startButton, backgroundImage2);
        });
    }

    startTransition(titleText, startButton, backgroundImage2) {
        this.tweens.add({
            targets: [titleText, startButton],
            alpha: 0,
            duration: 2000,
            onComplete: () => {
                titleText.destroy(); 
                startButton.destroy(); 
                this.tweens.add({
                    targets: backgroundImage2,
                    alpha: 1,
                    duration: 3000,
                    onComplete: () => {
                        this.time.delayedCall(1000, () => {
                            this.startGame();
                        });
                    }
                });
            }
        });
    }

    startGame() {
        this.mInicio.stop();
        this.scene.start('scene-game');
    }
}

export default MenuScene;
