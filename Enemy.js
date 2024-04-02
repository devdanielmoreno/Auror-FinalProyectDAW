import Phaser from 'phaser';
export default class Enemy extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y, texture, type,damage) {
        super(scene, x, y, texture);

        scene.add.existing(this);
        scene.physics.add.existing(this);
        this.scene = scene;

        this.setMaxVelocity(250, 250);
        this.setImmovable(true);
        this.body.allowGravity = false;
        this.setCollideWorldBounds(true);
        
        this.enemyType = type;
        this.damage = damage;

        if (type === 'goblin') {
            this.hp = 30;
            this.damage = 30;
        } else if (type === 'seta') {
            this.hp = 100;
            this.damage = 5;
        }
        this.hpBar = scene.add.graphics();

        this.enemyHit = false;
        this.updateHealthBar();
    }
    setAnimations(type) {
        if (type === 'goblin') {
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

        } else if (type === 'seta') {
            this.anims.create({
                key: 'setaIdle',
                frames: this.anims.generateFrameNames('setaIdle', { prefix: 'seta', end: 3, zeroPad: 5 }),
                frameRate: 3
            });
            this.anims.create({
                key: 'setaRun',
                frames: this.anims.generateFrameNames('setaRun', { prefix: 'setaRun', end: 7, zeroPad: 5 }),
                frameRate: 8
            });
            this.anims.create({
                key: 'setaAttack',
                frames: this.anims.generateFrameNames('setaAttack', { prefix: 'attack', end: 7, zeroPad: 5 }),
                frameRate: 10
            });
            this.anims.create({
                key: 'setaHit',
                frames: this.anims.generateFrameNames('setaHit', { prefix: 'hit', end: 3, zeroPad: 5 }),
                frameRate: 10
            });
            this.anims.create({
                key: 'setaDeath',
                frames: this.anims.generateFrameNames('setaDeath', { prefix: 'death', end: 3, zeroPad: 5 }),
                frameRate: 4
            });
        }
    }

    updateHealthBar() {
        const barWidth = 50;
        const barHeight = 5;
        const redBarColor = 0xff0000;

        this.hpBar.clear();

        const hpbar = Math.max(0, barWidth * (this.hp / 30));
        this.hpBar.fillStyle(redBarColor);
        this.hpBar.fillRect(0, 0, hpbar, barHeight);
        this.hpBar.setDepth(1);
    }

    hpbar() {
        this.hpBar.setPosition(this.x - this.displayWidth + 5, this.y + this.displayHeight / 12 - 40).setDepth(9000);
    }

    update() {
        this.updateHealthBar();
    }

    handleHit() {
        this.anims.stop();
        this.anims.play(`${this.enemyType}Hit`, true);
        this.setVelocity(0);
        this.enemyHit = true;

        this.scene.time.delayedCall(500, () => {
            this.enemyHit = false;
        });
    }

    updateMovement() {
        if (this.hp <= 0 && !this.deathHandled) {
            this.anims.play(`${this.enemyType}Death`, true);
            this.setVelocity(0);

            if (this.enemyType !== "seta") {
                const moveDistance = this.flipX ? 50 : -50;

                this.scene.tweens.add({
                    targets: this,
                    x: this.x + moveDistance,
                    duration: 1000,
                    ease: 'Power1',
                });
                this.deathHandled = true;
            }
        }

        if (!this.enemyHit) {
            const distance = Phaser.Math.Distance.Between(
                this.scene.player.x,
                this.scene.player.y,
                this.x,
                this.y
            );
            if (distance <= 300) {
                if (distance <= 20) {
                    this.setVelocity(0);
                    this.anims.play(`${this.enemyType}Attack`, true);
                } else {
                    this.anims.play(`${this.enemyType}Run`, true);
                    this.scene.physics.moveToObject(this, this.scene.player);
                }
            } else {
                this.anims.play(`${this.enemyType}Idle`, true);
                this.setVelocity(0);
            }
        }
    }
}
