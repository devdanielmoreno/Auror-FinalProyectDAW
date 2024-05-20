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

        const createdByText = this.add.text(
            sizes.width - 30,
            sizes.height - 130,
            "Creado por: Daniel Moreno",
            {
                fontSize: '30px',
                fill: 'white',
                fontFamily: "Jaini Purva",
                align: 'right',
                stroke: '#000000',
                strokeThickness: 5
            }
        ).setDepth(101).setOrigin(1, 1);

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
            this.startTransition(titleText, startButton, backgroundImage2, createdByText);
        });
    }

    startTransition(titleText, startButton, backgroundImage2, createdByText) {
        this.tweens.add({
            targets: [titleText, startButton],
            alpha: 0,
            duration: 2000,
            onComplete: () => {
                titleText.destroy(); 
                startButton.destroy(); 
                createdByText.destroy(); 
                
                const explanationText = this.add.text(
                    sizes.width / 2,
                    sizes.height / 4 + 400,
                    "CLICK PARA EMPEZAR",
                    {
                        fontSize: '100px', 
                        fill: 'red',
                        fontFamily: "Jaini Purva",
                        align: 'center',
                        stroke: '#000000',
                        strokeThickness: 10
                    }
                ).setDepth(101).setOrigin(0.5);

                const originalText = this.add.text(
                    sizes.width / 2,
                    sizes.height / 4 + 80,
                    "¡Tu pueblo ha sido invadido!\n\nTu misión es liberarlo\neliminando al jefe\ny llegando a la estatua de la diosa Auror",
                    {
                        fontSize: '80px', 
                        fill: '#5a7a82',
                        fontFamily: "Jaini Purva",
                        align: 'center',
                        stroke: '#000000',
                        strokeThickness: 10
                    }
                ).setDepth(101).setOrigin(0.5);

                this.tweens.add({
                    targets: backgroundImage2,
                    alpha: 1,
                    duration: 2000,
                    onComplete: () => {
                        this.input.once('pointerdown', () => {
                            explanationText.destroy();
                            originalText.destroy();
                            this.time.delayedCall(1000, () => {
                                this.startGame();
                            });
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
