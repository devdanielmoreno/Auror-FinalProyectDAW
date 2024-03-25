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
        
        this.anims.create({
            key: 'goblinIdle',
            frames: this.anims.generateFrameNames('goblinIdle', { prefix: 'goblin', end: 3, zeroPad: 5 }),
            frameRate: 3
        });
        this.anims.create({
            key: 'goblinRun',
            frames: this.anims.generateFrameNames('goblinRun', { prefix: 'goblinrun', end: 7, zeroPad: 5 }),
            frameRate: 8
        });
        this.anims.create({
            key: 'goblinAttack',
            frames: this.anims.generateFrameNames('goblinAttack', { prefix: 'goblinatta', end: 9, zeroPad: 5 }),
            frameRate: 10
        });
        this.anims.create({
            key: 'goblinHit',
            frames: this.anims.generateFrameNames('goblinHit', { prefix: 'goblinhit', end: 4, zeroPad: 5 }),
            frameRate: 10
        });
        this.anims.create({
            key: 'goblinDeath',
            frames: this.anims.generateFrameNames('goblinDeath', { prefix: 'goblindead', end: 3, zeroPad: 5 }),
            frameRate: 10
        });
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
    hpbar(){
        this.hpBar.setPosition(this.x - this.displayWidth - 10, this.y + this.displayHeight / 12 - 40).setDepth(9000);
    }
}
