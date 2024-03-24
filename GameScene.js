import "./style.css";
import Phaser from "phaser";
import Player from "./Player.js";
import Enemy from "./Enemy.js";

const sizes = {
    width: 1500,
    height: 700
}

const speedDown = 300
class GameScene extends Phaser.Scene {
    constructor() {
        super("scene-game");
        this.player;
        this.cursor;
        this.playerSpeed = speedDown + 300;
        this.enemy;
        this.healthBar;
        this.rollCooldown = 1000;
        this.rollCharges = 3;
        this.lastRollTime = 0;
        this.isRolling = false;
        this.isAttacking = false;
        this.bgMusica;
        this.emitter;
        this.cartel;
        this.cartelVisible = true;
    }

    preload() {
        this.load.image('base_tiles', 'assets/TX Tileset Grass.png')
        this.load.image('obsta', 'assets/TX Plant.png')
        this.load.image('stairs', 'assets/TX Struct.png')
        this.load.image('stone', 'assets/TX Tileset Stone Ground.png')
        this.load.image('wall', 'assets/TX Tileset Wall.png')
        this.load.image('cosas', 'assets/TX Props.png')
        this.load.tilemapTiledJSON('tilemap', 'assets/MapaP2.json')

        this.load.atlas("player", "assets/player.png", "assets/playerSprites.json");
        this.load.atlas("playerRun", "assets/run.png", "assets/playerRun.json");
        this.load.atlas("player_attack", "assets/player_attack.png", "assets/attack.json");
        this.load.atlas("roll_effect", "assets/roll_effect.png", "assets/roll.json");
        this.load.atlas("hit_effect", "assets/hit.png", "assets/hit.json");
        this.load.atlas("player_death", "assets/death.png", "assets/death.json");
        this.load.image("enemy", "assets/enemy.png");
        this.load.image("barra", "assets/barra.png");
        this.load.image("dialog", "assets/dialog.png");
        this.load.image("rollbar1", "assets/roll.png");
        this.load.image("rollbar2", "assets/roll2.png");
        this.load.image("rollbar3", "assets/roll3.png");
        this.load.image("rollbar4", "assets/roll4.png");

        this.load.audio("bgMusica", "assets/musica.ogg");
        this.load.audio("enemyAttack", "assets/enemyAttack.mp3");
        this.load.audio("playerAttack", "assets/playerAttack.mp3");
        this.load.audio("playerRoll", "assets/playerRoll.mp3");
    }

    create() {
        //restrablece las variables al morir si quiero que se guarde una piedra no pongo que se vuelva a poner por defecto
        this.rollCharges = 3;
        this.lastRollTime = 0;
        this.isRolling = false;
        this.isAttacking = false;
        ///////////////////////////////////////

        this.bgMusica = this.sound.add("bgMusica");
        this.bgMusica.play();
        this.bgMusica.loop = true;

        const map = this.make.tilemap({ key: 'tilemap' })
        const tileset = map.addTilesetImage('grass', 'base_tiles')
        const tile = map.addTilesetImage('obstacles', 'obsta');
        const tilewall = map.addTilesetImage('TX Tileset Wall', 'wall');
        const tilepiedra = map.addTilesetImage('TX Tileset Stone Ground', 'stone');
        const tilestairs = map.addTilesetImage('TX Struct', 'stairs');
        const tilecosas = map.addTilesetImage('TX Props', 'cosas');
        const tilerunas = map.addTilesetImage('TX Props', 'cosas');
        const tilecarteles = map.addTilesetImage('TX Props', 'cosas');
        const groundLayer = map.createLayer('ground', tileset);
        const stoneLayer = map.createLayer('piedra', tilepiedra);
        const obstaLayer = map.createLayer('obstacles', tile);
        const wallLayer = map.createLayer('paredes', tilewall);
        const stairLayer = map.createLayer('escaleras', tilestairs);
        const cosasLayer = map.createLayer('cosas', tilecosas);
        const cartelesLayer = map.createLayer('carteles', tilerunas);
        const runasLayer = map.createLayer('runas', tilecosas);

        this.player = new Player(this, 50, 340, "player");
        this.player.scene = this;
        this.physics.add.collider(this.player, obstaLayer)
        obstaLayer.setCollisionBetween(65, 189)
        this.physics.add.collider(this.player, wallLayer)
        wallLayer.setCollisionBetween(338, 437)
        stairLayer.setDepth(1000);
        this.physics.add.collider(this.player, cosasLayer)
        cosasLayer.setCollisionBetween(911, 1141)

        this.physics.world.setBounds(0, 0, map.widthInPixels, map.heightInPixels);
        this.cameras.main.setBounds(0, 0, map.widthInPixels, map.heightInPixels);

        this.cameras.main.startFollow(this.player);


        this.anims.create({
            key: 'playerSprite',
            frames: this.anims.generateFrameNames('player', { prefix: 'playerSprite', end: 1, zeroPad: 5 }),
            repeat: -1,
            frameRate: 3
        });
        this.anims.create({
            key: 'playerRun',
            frames: this.anims.generateFrameNames('playerRun', { prefix: 'run', end: 7, zeroPad: 5 }),
            repeat: -1,
        });
        this.anims.create({
            key: 'player_attack1',
            frames: this.anims.generateFrameNames('player_attack', { prefix: 'attack', end: 4, zeroPad: 5 }),
            frameRate: 15
        });
        this.anims.create({
            key: 'player_attack2',
            frames: this.anims.generateFrameNames('player_attack', { prefix: 'attack2', end: 4, zeroPad: 5 }),
            frameRate: 15
        });
        this.anims.create({
            key: 'player_attack3',
            frames: this.anims.generateFrameNames('player_attack', { prefix: 'attack3', end: 4, zeroPad: 5 }),
            frameRate: 15
        });
        this.anims.create({
            key: 'roll_effect',
            frames: this.anims.generateFrameNames('roll_effect', { prefix: 'roll', end: 3, zeroPad: 5 }),
            frameRate: 13
        });
        this.anims.create({
            key: 'hit_effect',
            frames: this.anims.generateFrameNames('hit_effect', { prefix: 'hit', end: 3, zeroPad: 5 }),
            frameRate: 4
        });
        this.anims.create({
            key: 'player_death',
            frames: this.anims.generateFrameNames('player_death', { prefix: 'death', end: 6, zeroPad: 5 }),
            frameRate: 10
        });


        this.enemy = new Enemy(this, this.getRandomX(), this.getRandomY(), "enemy");

        this.lastAttackTime = 0;
        this.invincibleTime = 0;

        this.physics.add.collider(this.player, this.enemy, this.enemyHit, null, this);

        this.healthText = this.add.text(14, 13, `${this.player.hp}/100`, { fontFamily: "Orbitron", fontSize: '32px', fill: '#00ff00', stroke: 'black', strokeThickness: 3 });
        this.healthBar = this.add.graphics({ x: 15, y: this.healthText.y + this.healthText.height + 5 });
        const baraWidth = Math.max(0, this.player.hp / this.player.maxHp * sizes.width / 10);
        const baraColor = this.player.hp <= 20 ? 0xff0000 : (this.player.hp <= 50 ? 0xffff00 : 0x00ff00);
        this.healthBar.clear().fillStyle(baraColor, 1).fillRect(0, 0, baraWidth, 20);

        this.healthText.setScrollFactor(0);
        this.healthBar.setScrollFactor(0);
        this.healthText.setDepth(9000);
        this.healthBar.setDepth(9000);

        const barraImage = this.add.image(93, this.healthText.y + this.healthText.height + 20, "barra");
        barraImage.setScrollFactor(0);
        barraImage.setDepth(9001);

        this.cartel = this.add.image(300, 180, "dialog").setVisible(false);

        this.cursor = this.input.keyboard.createCursorKeys();
        this.zKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.Z);
        this.xKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.X);
        this.cKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.C);
        this.escKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ESC);


        this.events.on('playerDead', () => {
            this.scene.pause();
            this.bgMusica.stop();
            this.scene.run('scene-dead');
        });


        this.rollbars = [
            this.add.image(87, 110, "rollbar1").setDepth(9001).setScrollFactor(0).setVisible(false),
            this.add.image(87, 110, "rollbar2").setDepth(9001).setScrollFactor(0).setVisible(false),
            this.add.image(87, 110, "rollbar3").setDepth(9001).setScrollFactor(0).setVisible(false),
            this.add.image(87, 110, "rollbar4").setDepth(9001).setScrollFactor(0).setVisible(false)
        ];
        this.updateRollChargeCircles();
        this.map = map;
        this.events.on('updateHealthBar', () => {
            this.enemy.updateHealthBar();
        });
    }

    update() {
        const { left, right, up, down } = this.cursor;

        if (!this.isRolling && !this.isAttacking) {
            if (left.isDown) {
                this.player.setVelocityX(-this.playerSpeed);
                this.player.anims.play('playerRun', true);
                this.player.flipX = true;
            } else if (right.isDown) {
                this.player.setVelocityX(this.playerSpeed);
                this.player.anims.play('playerRun', true);
                this.player.flipX = false;
            } else {
                if (this.time.now > this.lastAttackTime + 1500) {
                    this.player.anims.play('playerSprite', true);
                    this.player.setVelocityX(0);
                } else {
                    this.player.anims.play('hit_effect', true);
                    this.player.setVelocityX(0);

                }
            }

            if (up.isDown) {
                this.player.setVelocityY(-this.playerSpeed);
                this.player.anims.play('playerRun', true);
            } else if (down.isDown) {
                this.player.setVelocityY(this.playerSpeed);
                this.player.anims.play('playerRun', true);
            } else {
                this.player.setVelocityY(0);
            }
        }
        if (!left.isDown && !right.isDown) {
            this.player.setScale(1, 1);
        }
        this.escKey.on('down', () => {
            this.scene.pause();
            this.scene.launch('scene-options');
            this.bgMusica.pause();
        });
        this.enemy.hpBar.setPosition(this.enemy.x - this.enemy.displayWidth / 2, this.enemy.y + this.enemy.displayHeight / 2 + 10);
        if (Phaser.Input.Keyboard.JustDown(this.xKey)) {
            this.player.roll();
        }
        if (this.isRolling && this.time.now > this.lastRollTime + 2000) {
            this.isRolling = false;
            this.player.setAlpha(1);
        }
        if (this.player.hp <= 0) {
            this.player.anims.play('player_death', true);
            this.events.emit('playerDead');
        }
        if (Phaser.Input.Keyboard.JustDown(this.zKey)) {
            this.player.attack(this.enemy);
        }
        if (this.player && this.enemy && this.enemy.body) {
            const distance = Phaser.Math.Distance.Between(
                this.player.x,
                this.player.y,
                this.enemy.x,
                this.enemy.y
            );

            const moveEnemy = () => {
                if (distance <= 400) {
                    if (distance <= 20) {
                        this.enemy.setVelocity(0);
                    } else {
                        this.physics.moveToObject(this.enemy, this.player);
                    }
                } else {
                    this.enemy.setVelocity(0);
                }
            };

            moveEnemy();
        }
        const distance = Phaser.Math.Distance.Between(
            this.player.x,
            this.player.y,
            this.cartel.x,
            this.cartel.y
        );

        if (distance <= 450 && this.cartelVisible) {
            this.mostrarDialogo();
            this.cartelVisible = false;
        }

        if (distance > 450 || this.cartel.alpha === 0) {
            this.cartel.setVisible(false);
        }

        this.cKey.on('down', () => {
            if (!this.cartelVisible) {
                this.cartelVisible = true;
                this.mostrarDialogo();
            }
        });
    }
    mostrarDialogo() {
        this.cartel.setVisible(true).setDepth(1001);
        this.time.delayedCall(5000, () => {
            this.cartel.setVisible(false);
        });
    }

    updateRollChargeCircles() {
        for (let i = 0; i < this.rollbars.length; i++) {
            this.rollbars[i].setVisible(i === this.rollCharges);
        }
    }

    enemyHit(player, enemy) {
        if (this.isRolling) {
            return;
        }
        if (this.isAttacking) {
            if (enemy.hp <= 0) {
                enemy.destroy();
                if (this.player.hp < this.player.maxHp) {
                    this.player.hp = Math.min(this.player.maxHp, this.player.hp + 5);
                    this.healthText.setText(`${this.player.hp}/100`);
                    const baraWidth = Math.max(0, this.player.hp / this.player.maxHp * sizes.width / 10);
                    const baraColor = this.player.hp <= 20 ? 0xff0000 : (this.player.hp <= 50 ? 0xffff00 : 0x00ff00);
                    this.healthBar.clear().fillStyle(baraColor, 1).fillRect(0, 0, baraWidth, 20);
                }
            }
        }
        if (this.invincibleTime > this.time.now) {
            return;
        }

        if (this.time.now > this.lastAttackTime + 1500) {
            this.lastAttackTime = this.time.now;
            this.player.hp = Math.max(0, this.player.hp - 5);

            this.invincibleTime = this.time.now + 2000;

            this.healthText.setText(`${this.player.hp}/100`);
            const baraWidth = Math.max(0, this.player.hp / this.player.maxHp * sizes.width / 10);
            const baraColor = this.player.hp <= 20 ? 0xff0000 : (this.player.hp <= 50 ? 0xffff00 : 0x00ff00);
            this.healthBar.clear().fillStyle(baraColor, 1).fillRect(0, 0, baraWidth, 20);

            this.sound.play("enemyAttack");
        }
    }

    getRandomX() {
        return Math.floor(Math.random() * (sizes.width - 300));
    }

    getRandomY() {
        return Math.floor(Math.random() * (sizes.height - 300));
    }
}
export default GameScene;