import "./style.css";
import Phaser from "phaser";

const sizes = {
    width: 1500,
    height: 800
}
class MenuScene extends Phaser.Scene {
    constructor() {
        super("scene-menu");
        this.mInicio
    }

    preload() {
        this.load.image("background", "assets/Mapa/Mapa.png");
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
        backgroundImage.setDisplaySize(sizes.width, sizes.height);
        const titleText = this.add.text(
            sizes.width / 2, 
            sizes.height / 4 - 60, 
            "Auror", 
            {
                fontSize: '200px',
                fontWeight: 'bold',
                fill: 'brown',
                fontFamily: "Jaini Purva",
                stroke: '#000000',
                strokeThickness: 10 
            }
        ).setDepth(100).setOrigin(0.5); 
        
        titleText.setOrigin(0.5, 0.5);


        const startButton = this.add.image(sizes.width / 2, sizes.height / 2 + 50, "startButton");
        startButton.setInteractive();
        startButton.on('pointerdown', () => {
            this.scene.start('scene-game');
            this.mInicio.stop();
        });
    }
}
export default MenuScene;