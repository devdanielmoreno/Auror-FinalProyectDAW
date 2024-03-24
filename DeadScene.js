import "./style.css";
import Phaser from "phaser";

const sizes = {
    width: 1500,
    height: 700
}
class DeadScene extends Phaser.Scene {
    constructor() {
        super("scene-dead");
        this.muerte
    }
    preload() {
        this.load.audio("muerte", "assets/muerte.ogg");
    }
    create() {
        this.muerte = this.sound.add("muerte");
        this.muerte.play();
        const background = this.add.rectangle(0, 0, sizes.width, sizes.height, 0x000000, 0.5);
        background.setOrigin(0);

        const deadText = this.add.text(sizes.width / 2, sizes.height / 2 - 50, 'HAS MUERTO', { fontSize: '64px', fill: '#ff0000' });
        deadText.setOrigin(0.5);

        const restartButton = this.add.text(sizes.width / 2, sizes.height / 2 + 50, 'Reiniciar (R)', { fontSize: '32px', fill: '#ffffff' });
        restartButton.setOrigin(0.5);
        this.input.keyboard.on('keydown-R', () => {
            this.scene.stop();
            this.scene.start('scene-game');
        });
    }
}
export default DeadScene;