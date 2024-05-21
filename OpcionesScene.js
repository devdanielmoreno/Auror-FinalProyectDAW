import "./style.css";
import Phaser from "phaser";

const sizes = {
    width: 1500,
    height: 700,
};

class OpcionesScene extends Phaser.Scene {
    constructor() {
        super("scene-options");
        this.volume = 0.5;
        this.controlsElements = [];
    }

    preload() {
        this.input.setDefaultCursor("url(assets/HUD/cursor.png), pointer");
        this.load.image('backgroun', 'assets/HUD/opciones.png');
        this.load.image('volumeBar', 'assets/HUD/volumeBar.png');
        this.load.image('volumeFill', 'assets/HUD/volumeFill.png');
        this.load.image('volumeButton', 'assets/HUD/volumeButton.png');
        this.load.image('menuButton', 'assets/HUD/menuButton.png');
        this.load.image('controlsButton', 'assets/HUD/menuButton.png'); 
        this.load.image('controlsBackground', 'assets/HUD/opciones.png'); 
    }

    create() {
        const background = this.add.image(sizes.width / 2, sizes.height / 2, 'backgroun').setOrigin(0.5);
        background.setScale(2.5);

        this.generalTexts = [
            this.add.text(sizes.width / 2, 150, "Juego en Pausa", {
                fontSize: "50px",
                fill: "white",
                fontFamily: "Orbitron",
                stroke: "#5a7a82",
                strokeThickness: 6
            }).setOrigin(0.5),

            this.add.text(sizes.width - 550, sizes.height / 2 - 120, "Musica", {
                fontSize: "32px",
                fill: "white",
                fontFamily: "Orbitron",
                stroke: "#5a7a82",
                strokeThickness: 6
            }).setOrigin(0.5),

            this.add.text(sizes.width / 2, sizes.height / 2 + 98, "Volver", {
                fontSize: "20px",
                fill: "white",
                fontFamily: "Orbitron",
                stroke: "brown",
                strokeThickness: 6
            }).setOrigin(0.5).setDepth(2),

            this.add.text(sizes.width / 2, sizes.height / 2 + 197, "Reiniciar", {
                fontSize: "20px",
                fill: "white",
                fontFamily: "Orbitron",
                stroke: "brown",
                strokeThickness: 6
            }).setOrigin(0.5).setDepth(2),

            this.add.text(sizes.width / 2, sizes.height / 2 + 148, "Controles", {
                fontSize: "20px",
                fill: "white",
                fontFamily: "Orbitron",
                stroke: "brown",
                strokeThickness: 6
            }).setOrigin(0.5).setDepth(2)
        ];

        const volumeBar = this.add.image(sizes.width - 550, sizes.height / 2 + 30, 'volumeBar').setOrigin(0.5);
        const volumeFill = this.add.image(sizes.width - 550, sizes.height / 2 + 30, 'volumeFill').setOrigin(0.5);
        volumeFill.setScale(1, this.volume);

        const volumeUpButton = this.add.image(sizes.width - 547, sizes.height / 2 - 45, 'volumeButton').setOrigin(0.5).setInteractive();
        volumeUpButton.on("pointerdown", () => {
            this.volume = Math.min(this.volume + 0.1, 1);
            volumeFill.setScale(1, this.volume);
            this.scene.get("scene-game").bgMusica.setVolume(this.volume);
            this.scene.get("scene-game").bossMusic.setVolume(this.volume);
        });

        const volumeDownButton = this.add.image(sizes.width - 547, sizes.height / 2 + 130, 'volumeButton').setOrigin(0.5).setInteractive();
        volumeDownButton.flipY = true;
        volumeDownButton.on("pointerdown", () => {
            this.volume = Math.max(this.volume - 0.1, 0);
            volumeFill.setScale(1, this.volume);
            this.scene.get("scene-game").bgMusica.setVolume(this.volume);
            this.scene.get("scene-game").bossMusic.setVolume(this.volume);
        });

        const menuButton = this.add.image(sizes.width / 2, sizes.height / 2 + 200, 'menuButton').setOrigin(0.5).setInteractive().setDepth(1);
        menuButton.on("pointerdown", () => {
            this.cameras.main.fadeOut(1000, 0, 0, 0);
            this.cameras.main.once('camerafadeoutcomplete', () => {
                this.scene.stop("scene-options");
                this.scene.stop("scene-game");
                this.scene.start("scene-menu");
            });
        });

        const controlsButton = this.add.image(sizes.width / 2, sizes.height / 2 + 150, 'controlsButton').setOrigin(0.5).setInteractive().setDepth(1);
        controlsButton.on("pointerdown", () => {
            this.showControlsMenu();
        });

        const volverButton = this.add.image(sizes.width / 2, sizes.height / 2 + 100, 'menuButton').setOrigin(0.5).setInteractive().setDepth(1);
        volverButton.on("pointerdown", () => {
            this.returnToGame();
        });

        this.input.keyboard.on("keydown-ESC", () => {
            this.returnToGame();
        });
    }

    showControlsMenu() {
        const controlsBackground = this.add.image(sizes.width / 2, sizes.height / 2, 'controlsBackground').setOrigin(0.5).setDepth(3);
        controlsBackground.setScale(2.5);
    
        const textConfig = {
            fontSize: "32px",
            fill: "white",
            fontFamily: "Orbitron",
            stroke: "#5a7a82",
            strokeThickness: 6
        };
    
        this.controlsElements.push(controlsBackground);
        this.controlsElements.push(this.add.text(sizes.width / 2, sizes.height / 2 - 180, "Para moverte: Flechas", textConfig).setOrigin(0.5).setDepth(3));
        this.controlsElements.push(this.add.text(sizes.width / 2, sizes.height / 2 - 110, "Para atacar: Z", textConfig).setOrigin(0.5).setDepth(3));
        this.controlsElements.push(this.add.text(sizes.width / 2, sizes.height / 2 - 40, "Para rodar: X", textConfig).setOrigin(0.5).setDepth(3));
        this.controlsElements.push(this.add.text(sizes.width / 2, sizes.height / 2 + 20, "Para usar poción: Espacio", textConfig).setOrigin(0.5).setDepth(3));
        this.controlsElements.push(this.add.text(sizes.width / 2, sizes.height / 2 + 80, "Para mirar cartel: C", textConfig).setOrigin(0.5).setDepth(3));
    
        const volverButton = this.add.image(sizes.width / 2, sizes.height / 2 + 203, 'menuButton').setOrigin(0.5).setInteractive().setDepth(3);

        this.controlsElements.push(volverButton);
    
        const closeButton = this.add.text(sizes.width / 2, sizes.height / 2 + 200, "Cerrar", {
            fontSize: "20px",
            fill: "white",
            fontFamily: "Orbitron",
            stroke: "brown",
            strokeThickness: 6
        }).setOrigin(0.5).setInteractive().setDepth(3);
    
        closeButton.on("pointerdown", () => {
            this.controlsElements.forEach(element => element.destroy());
            this.controlsElements = [];
        });
    
        this.controlsElements.push(closeButton);
    }
    

    returnToGame() {
        const gameScene = this.scene.get("scene-game");
        gameScene.bgMusica.resume();
        gameScene.bossMusic.resume();
        this.scene.stop();
        this.scene.resume("scene-game");
    }
}

export default OpcionesScene;
