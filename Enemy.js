import Phaser from 'phaser';

export default class Enemy extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y, texture, type, damage) {
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
            this.maxHp = 30;
            this.damage = 30;
        } else if (type === 'seta') {
            this.hp = 100;
            this.maxHp = 100;
            this.damage = 5;
        }else if (type === 'boss') {
            this.hp = 350;
            this.maxHp = 350;
            this.damage = 20;
        }else if (type === 'bosss') {
            this.hp = 100;
            this.maxHp = 100;
            this.damage = 30;
        }

        this.hpBar = scene.add.graphics();
        this.updateHealthBar();
        
        this.enemyHit = false;
        this.deathHandled = false;
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
            
        }else if (type === 'boss') {
            this.anims.create({
                key: 'bossIdle',
                frames: this.anims.generateFrameNames('bossIdle', { prefix: 'boss', end: 5, zeroPad: 5 }),
                frameRate: 6,
            });
            this.anims.create({
                key: 'bossRun',
                frames: this.anims.generateFrameNames('bossIdle', { prefix: 'boss', end: 5, zeroPad: 5 }),
                frameRate: 6,
            });
            this.anims.create({
                key: 'bossAttack',
                frames: this.anims.generateFrameNames('bossAttack', { prefix: 'attack', end: 10, zeroPad: 5 }),
                frameRate: 5,
            });
            this.anims.create({
                key: 'bossDeath',
                frames: this.anims.generateFrameNames('bossDeath', { prefix: 'death', end: 4, zeroPad: 5 }),
                frameRate: 4,
            });
        }
    }

    updateHealthBar() {
        if (this.enemyType !== 'boss') {
            const barWidth = 80;
            const barHeight = 5;
            const redBarColor = 0xff0000;

            this.hpBar.clear();
            this.hpBar.fillStyle(redBarColor);
            this.hpBar.fillRect(this.x - barWidth / 2, this.y - this.displayHeight / 2 - barHeight - 10, Math.max(0, barWidth * (this.hp / this.maxHp)),barHeight);
            this.hpBar.setDepth(9001);
        }
    }

    update() {
        this.updateHealthBar();
        this.updateMovement();
    }
    handleHit() {
        if (this.enemyType !== 'boss' && this.enemyType !== 'miniboss') {
        this.anims.stop();
        this.anims.play(`${this.enemyType}Hit`, true);
        this.setVelocity(0);
        this.enemyHit = true;
        }
        this.scene.time.delayedCall(500, () => {
            this.enemyHit = false;
        });
    }

    updateMovement() {
        if (this.hp <= 0 && !this.deathHandled) {
            if (this.enemyType === 'boss') {
                this.anims.play(`${this.enemyType}Death`, true);
                this.setVelocity(0);
                this.scene.ataqueBoss.play({volume: 0.5});
            } else {
                this.anims.play(`${this.enemyType}Death`, true);
                this.setVelocity(0);
            }

            if (this.enemyType !== "seta" && this.enemyType !== "boss" && this.enemyType !== "bosss") {
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
            
            const maxDistance = this.enemyType === 'boss' ? 500 : 300;
            
            if (distance <= maxDistance) {
                if (distance <= 20) {
                    this.setVelocity(0);
                    this.anims.play(`${this.enemyType}Attack`, true);
                } else if (this.enemyType === 'boss' && distance <= 150) {
                    this.once('animationcomplete', () => {
                        if (this.anims.play(`${this.enemyType}Attack`)) {
                            this.setVelocity(0);
                            this.anims.play(`${this.enemyType}Attack`, true);
                            this.scene.pug.play({volume: 0.3});
                        }
                    });
                } else{
                    this.anims.play(`${this.enemyType}Run`, true);
                    this.scene.physics.moveToObject(this, this.scene.player);
                }
            } else {
                this.anims.play(`${this.enemyType}Idle`, true);
                this.setVelocity(0);
            }
            this.updateHealthBar();
        }

    }
}
