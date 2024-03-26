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
        this.hpBarGreen = this.scene.add.graphics();

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
            frameRate: 4
        });

        this.goblinHit = false;
    }

    updateHealthBar() {
        const barWidth = 130;
        const barHeight = 5;
        const redBarColor = 0xff0000;
        const greenBarColor = 0x00ff00;
    
        this.hpBar.clear();
        this.hpBarGreen.clear();
    
        const redBarWidthValue = Math.max(0, barWidth * (this.hp / 30));
        this.hpBar.fillStyle(redBarColor);
        this.hpBar.fillRect(0, 0, redBarWidthValue, barHeight);
        this.hpBar.setDepth(1);

        const greenBarWidthValue = Math.max(0, barWidth * (this.hp / 30));
        this.hpBarGreen.fillStyle(greenBarColor);
        this.hpBarGreen.fillRect(0, 0, greenBarWidthValue, barHeight);
        this.hpBarGreen.setDepth(2); 
    }
    
    hpbar() {
        this.hpBar.setPosition(this.x - this.displayWidth + 20, this.y + this.displayHeight / 12 - 40).setDepth(9000);
        this.hpBarGreen.setPosition(this.x - this.displayWidth - 20, this.y + this.displayHeight / 12 - 40).setDepth(9001);
    }
    
    update() {
        this.updateHealthBar();
    }
    
    handleHit() {
        this.anims.stop();
        this.anims.play('goblinHit', true);
        this.setVelocity(0);
        this.goblinHit = true;

        this.scene.time.delayedCall(500, () => {
            this.goblinHit = false;
        });
    }

    updateMovement() {
        if (this.hp <= 0 && !this.deathHandled) {
            this.anims.play('goblinDeath', true);
            this.setVelocity(0);

            const moveDistance = this.flipX ? 50 : -50;

            this.scene.tweens.add({
                targets: this,
                x: this.x + moveDistance,
                duration: 1000, 
                ease: 'Power1', 
            });
            this.deathHandled = true;
        }

        if (!this.goblinHit) {
            const distance = Phaser.Math.Distance.Between(
                this.scene.player.x,
                this.scene.player.y,
                this.x,
                this.y
            );
            if (distance <= 400) {
                if (distance <= 20) {
                    this.setVelocity(0);
                    this.anims.play('goblinAttack', true);
                } else {
                    this.anims.play('goblinRun', true);
                    this.scene.physics.moveToObject(this, this.scene.player);
                }
            } else {
                this.anims.play('goblinIdle', true);
                this.setVelocity(0);
            }
        }
    }
}
