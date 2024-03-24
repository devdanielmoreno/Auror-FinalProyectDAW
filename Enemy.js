import Phaser from 'phaser';

export default class Enemy extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y, texture) {
        super(scene, x, y, texture);

        scene.add.existing(this);
        scene.physics.add.existing(this);
        
        this.scene = scene; 
        this.setMaxVelocity(250, 250);
        this.setImmovable(true);
        this.body.allowGravity = false;
        this.setCollideWorldBounds(true);
        this.hp = 30;

        this.hpBar = scene.add.graphics();
        
    }

    updateHealthBar() {
        const barWidth = 130;
        const barHeight = 5;
        const barColor = 0xff0000;

        this.hpBar.clear();

        const barWidthValue = Math.max(0, barWidth * (this.hp / 30));
        this.hpBar.fillStyle(barColor);
        this.hpBar.fillRect(0, 0, barWidthValue, barHeight);
        this.hpBar.setDepth(1);
    }

    update() {
        this.updateHealthBar(); 
    }
}
