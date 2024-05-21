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
        this.load.image("background3", "assets/Mapa/Mapa3.png"); 
        this.load.image("startButton", "assets/HUD/boton.png");
        this.load.image("titulo", "assets/HUD/titulo.png");
        this.load.image("carta", "assets/HUD/cartaa.png");
        this.input.setDefaultCursor('url(assets/HUD/cursor.png), pointer');
        this.load.audio("mInicio", "assets/Musica/inicio.ogg");
        this.load.audio("paperSound", "assets/Musica/paperSound.mp3");
    }

    create() {
        this.mInicio = this.sound.add("mInicio");
        this.paperSound = this.sound.add("paperSound");
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

        const backgroundImage3 = this.add.image(0, -50, "background3")
            .setOrigin(0, 0)
            .setDisplaySize(sizes.width, sizes.height)
            .setAlpha(0); 

        const titleText = this.add.image(sizes.width / 2 + 10, sizes.height / 4 - 60, "titulo").setScale(0.5);

        const startButton = this.add.image(sizes.width / 2, sizes.height / 2 + 100, "startButton");
        startButton.setInteractive();
        startButton.on('pointerdown', () => {
            this.startTransition(titleText, startButton, backgroundImage, backgroundImage2, backgroundImage3, createdByText);
        });
    }

    startTransition(titleText, startButton, backgroundImage, backgroundImage2, backgroundImage3, createdByText) {
        this.tweens.add({
            targets: [titleText, startButton],
            alpha: 0,
            duration: 2000,
            onComplete: () => {
                titleText.destroy(); 
                startButton.destroy(); 
                createdByText.destroy(); 

                this.tweens.add({
                    targets: backgroundImage,
                    alpha: 0,
                    duration: 2000,
                    onComplete: () => {
                        this.tweens.add({
                            targets: backgroundImage2,
                            alpha: 1,
                            duration: 2000,
                            onComplete: () => {
                                this.showTextSlide(() => {
                                    this.tweens.add({
                                        targets: backgroundImage2,
                                        alpha: 0,
                                        duration: 2000,
                                        onComplete: () => {
                                            this.tweens.add({
                                                targets: backgroundImage3,
                                                alpha: 1,
                                                duration: 2000,
                                                onComplete: () => {
                                                    this.showFinalCarta(backgroundImage3);
                                                }
                                            });
                                        }
                                    });
                                });
                            }
                        });
                    }
                });
            }
        });
    }

    showTextSlide(callback) {
        const fullText = "¡Nuestro pueblo está destrozado!";
        const textObject = this.add.text(
            sizes.width / 2,
            sizes.height / 2 - 50,
            "",
            {
                fontSize: '80px',
                fill: 'white',
                fontFamily: "Pixelify Sans",
                align: 'center',
                stroke: '#000000',
                strokeThickness: 5
            }
        ).setDepth(101).setOrigin(0.5, 0.5);

        let currentIndex = 0;
        const revealText = () => {
            if (currentIndex < fullText.length) {
                textObject.setText(fullText.substr(0, currentIndex + 1));
                currentIndex++;
                this.time.delayedCall(50, revealText);
            } else {
                const continueText = this.add.text(
                    sizes.width / 2,
                    sizes.height / 2 + 100,
                    "- Click para continuar -",
                    {
                        fontSize: '50px',
                        fill: 'white',
                        fontFamily: "Pixelify Sans",
                        align: 'center',
                        stroke: '#000000',
                        strokeThickness: 5
                    }
                ).setDepth(101).setOrigin(0.5, 0.5).setAlpha(0);

                this.tweens.add({
                    targets: continueText,
                    alpha: { from: 0, to: 1 },
                    duration: 500,
                    yoyo: true,
                    repeat: -1
                });

                this.input.once('pointerdown', () => {
                    textObject.destroy();
                    continueText.destroy();
                    callback();
                });
            }
        };
        revealText();
    }

    showFinalCarta(backgroundImage3) {
        const fullText = "Una carta?";
        const textObject = this.add.text(
            sizes.width / 2,
            sizes.height / 2 -50,
            "",
            {
                fontSize: '80px',
                fill: 'white',
                fontFamily: "Pixelify Sans",
                align: 'center',
                stroke: '#000000',
                strokeThickness: 5
            }
        ).setDepth(101).setOrigin(0.5, 0.5);

        let currentIndex = 0;
        const revealText = () => {
            if (currentIndex < fullText.length) {
                textObject.setText(fullText.substr(0, currentIndex + 1));
                currentIndex++;
                this.time.delayedCall(50, revealText);
            } else {
                const continueText = this.add.text(
                    sizes.width / 2,
                    sizes.height / 2 + 100,
                    "- Click para abrir -",
                    {
                        fontSize: '50px',
                        fill: 'white',
                        fontFamily: "Pixelify Sans",
                        align: 'center',
                        stroke: '#000000',
                        strokeThickness: 5
                    }
                ).setDepth(101).setOrigin(0.5, 0.5).setAlpha(0);

                this.tweens.add({
                    targets: continueText,
                    alpha: { from: 0, to: 1 },
                    duration: 500,
                    yoyo: true,
                    repeat: -1
                });

                this.input.once('pointerdown', () => {
                    textObject.destroy();
                    continueText.destroy();
                    this.paperSound.play();
                    const originalText = this.add.image(sizes.width / 2, sizes.height / 4 + 150, "carta");
                    originalText.setScale(1.5);

                    this.input.once('pointerdown', () => {
                        originalText.destroy();
                        this.time.delayedCall(1000, () => {
                            this.fadeOutToGame();
                        });
                    });
                });
            }
        };
        revealText();
    }

    fadeOutToGame() {
        this.cameras.main.fadeOut(1000, 0, 0, 0);
        this.time.delayedCall(1000, () => {
            this.startGame();
        });
    }

    startGame() {
        this.mInicio.stop();
        this.scene.start('scene-game');
    }
}

export default MenuScene;
