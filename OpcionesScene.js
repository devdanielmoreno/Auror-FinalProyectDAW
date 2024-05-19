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
    }

    preload() {
        this.input.setDefaultCursor("url(assets/HUD/cursor.png), pointer");
    }

    create() {
        const background = this.add
            .rectangle(0, 0, sizes.width, sizes.height, 0x000000, 0.5)
            .setOrigin(0);
            this.add
            .text(sizes.width - 100 , 170, "Musica", { fontSize: "32px", fill: "white",fontFamily: "Orbitron", })
            .setOrigin(0.5);

        this.add.text(sizes.width / 2, 150, "Juego en Pausa", { fontSize: "50px", fill: "white",fontFamily: "Orbitron", }).setOrigin(0.5);

        const volumeBar = this.add.rectangle(
            sizes.width - 100,
            sizes.height / 2 - 20,
            20, 
            sizes.height / 5, 
            0xffffff
        );
        volumeBar.setOrigin(0, 0.5);

        const volumeFill = this.add.rectangle(
            sizes.width - 100, 
            sizes.height / 2 - 20, 
            20, 
            sizes.height / 5, 
            0x000000
        );
        volumeFill.setOrigin(0, 0.5);
        volumeFill.setScale(1, this.volume); 

        const volumeUpArea = this.add.rectangle(
            sizes.width - 70, 
            sizes.height / 2 - (sizes.height / 10) - 20, 
            30,
            sizes.height / 10,
            0xcccccc
        );
        volumeUpArea.setOrigin(0, 0.5);
        volumeUpArea.setInteractive();
        volumeUpArea.on("pointerdown", () => {
            this.volume = Math.min(this.volume + 0.1, 1);
            volumeFill.setScale(1, this.volume);
            this.scene.get("scene-game").bgMusica.setVolume(this.volume);
            this.scene.get("scene-game").bossMusic.setVolume(this.volume);
        });

        const volumeDownArea = this.add.rectangle(
            sizes.width - 70, 
            sizes.height / 2 + (sizes.height / 10) - 20, 
            30,
            sizes.height / 10,
            0xcccccc
        );
        volumeDownArea.setOrigin(0, 0.5);
        volumeDownArea.setInteractive();
        volumeDownArea.on("pointerdown", () => {
            this.volume = Math.max(this.volume - 0.1, 0);
            volumeFill.setScale(1, this.volume);
            this.scene.get("scene-game").bgMusica.setVolume(this.volume);
            this.scene.get("scene-game").bossMusic.setVolume(this.volume);
        });

        this.add
            .text(
                sizes.width / 2,
                sizes.height / 2 + 50,
                "Volver a la Partida (ESC)",
                { fontSize: "32px", fill: "white" }
            )
            .setOrigin(0.5);

        this.input.keyboard.on("keydown-ESC", () => {
            const gameScene = this.scene.get("scene-game");
            gameScene.bgMusica.resume();
            gameScene.bossMusic.resume();
            this.scene.stop();
            this.scene.resume("scene-game");
        });
    }
}

export default OpcionesScene;

