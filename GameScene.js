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
        this.enemies = [];
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
        /////Mapa//////
        this.load.image('base_tiles', 'assets/Mapa/TX Tileset Grass.png')
        this.load.image('obsta', 'assets/Mapa/TX Plant.png')
        this.load.image('stairs', 'assets/Mapa/TX Struct.png')
        this.load.image('stone', 'assets/Mapa/TX Tileset Stone Ground.png')
        this.load.image('wall', 'assets/Mapa/TX Tileset Wall.png')
        this.load.image('cosas', 'assets/Mapa/TX Props.png')
        this.load.tilemapTiledJSON('tilemap', 'assets/Mapa/MapaP2.json')

        /////Player//////
        this.load.atlas("player", "assets/jugador/player.png", "assets/jugador/playerSprites.json");
        this.load.atlas("playerRun", "assets/jugador/run.png", "assets/jugador/playerRun.json");
        this.load.atlas("player_attack", "assets/jugador/player_attack.png", "assets/jugador/attack.json");
        this.load.atlas("roll_effect", "assets/jugador/roll_effect.png", "assets/jugador/roll.json");
        this.load.atlas("hit_effect", "assets/jugador/hit.png", "assets/jugador/hit.json");
        this.load.atlas("player_death", "assets/jugador/death.png", "assets/jugador/death.json");
        this.load.atlas("arriba", "assets/jugador/arriba.png", "assets/jugador/arriba.json");
        this.load.atlas("abajo", "assets/jugador/abajo.png", "assets/jugador/abajo.json");


        /////Enemigos/////
        this.load.atlas("goblinIdle", "assets/enemigos/goblin/goblinIdle.png", "assets/enemigos/goblin/goblin.json");
        this.load.atlas("goblinRun", "assets/enemigos/goblin/goblinRun.png", "assets/enemigos/goblin/goblinRun.json");
        this.load.atlas("goblinAttack", "assets/enemigos/goblin/goblinAttack.png", "assets/enemigos/goblin/goblinAttack.json");
        this.load.atlas("goblinHit", "assets/enemigos/goblin/goblinHIt.png", "assets/enemigos/goblin/goblinHit.json");
        this.load.atlas("goblinDeath", "assets/enemigos/goblin/goblinDeath.png", "assets/enemigos/goblin/goblinDeath.json");

        this.load.atlas("setaIdle", "assets/enemigos/seta/setaIdle.png", "assets/enemigos/seta/seta.json");
        this.load.atlas("setaRun", "assets/enemigos/seta/setaRun.png", "assets/enemigos/seta/setaRun.json");
        this.load.atlas("setaAttack", "assets/enemigos/seta/setaAttack.png", "assets/enemigos/seta/setaAttack.json");
        this.load.atlas("setaHit", "assets/enemigos/seta/setaHit.png", "assets/enemigos/seta/setaHit.json");
        this.load.atlas("setaDeath", "assets/enemigos/seta/setaDeath.png", "assets/enemigos/seta/setaDeath.json");

        /////HUD/////
        this.load.image("barra", "assets/HUD/barra.png");
        this.load.image("dialog", "assets/HUD/dialog.png");
        this.load.image("rollbar1", "assets/HUD/roll.png");
        this.load.image("rollbar2", "assets/HUD/roll2.png");
        this.load.image("rollbar3", "assets/HUD/roll3.png");
        this.load.image("rollbar4", "assets/HUD/roll4.png");

        /////Musica/////
        this.load.audio("bgMusica", "assets/Musica/musica.ogg");
        this.load.audio("enemyAttack", "assets/Musica/enemyAttack.mp3");
        this.load.audio("playerAttack", "assets/Musica/playerAttack.mp3");
        this.load.audio("playerRoll", "assets/Musica/playerRoll.mp3");
    }

    create() {
        //restrablece las variables al morir si quiero que se guarde una piedra no pongo que se vuelva a poner por defecto
        this.rollCharges = 3;
        /////

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

        this.createEnemies();

        this.physics.add.collider(this.player, obstaLayer)
        this.physics.add.collider(this.enemies, obstaLayer)
        obstaLayer.setCollisionBetween(65, 189)
        this.physics.add.collider(this.player, wallLayer)
        wallLayer.setCollisionBetween(338, 437)
        wallLayer.setDepth(1000);
        stairLayer.setDepth(1000);
        this.physics.add.collider(this.player, cosasLayer)
        cosasLayer.setCollisionBetween(911, 1141)
        cosasLayer.setDepth(1001);

        this.physics.world.setBounds(0, 0, map.widthInPixels, map.heightInPixels);
        this.cameras.main.setBounds(0, 0, map.widthInPixels, map.heightInPixels);

        this.cameras.main.startFollow(this.player);

        this.lastAttackTime = 0;
        this.invincibleTime = 0;

        this.setupCollisions();

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


        this.cursor = this.input.keyboard.createCursorKeys();
        this.zKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.Z);
        this.xKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.X);
        this.cKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.C);
        this.escKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ESC);

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
                this.player.anims.play('arriba', true);
            } else if (down.isDown) {
                this.player.setVelocityY(this.playerSpeed);
                this.player.anims.play('abajo', true);
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
            this.player.attack();
        }
        this.player.updateHitboxPosition();

        this.events.on('updateHealthBar', () => {
            this.enemies.forEach(enemy => {
                if (enemy && enemy.updateHealthBar) {
                    enemy.updateHealthBar();
                }
            });
        });
        this.enemies.forEach(enemy => {
            if (enemy && enemy.hpbar) {
                enemy.hpbar(); 
            }

            if (this.player.x > enemy.x) {
                enemy.flipX = false;
            } else {
                enemy.flipX = true;
            }
            if (this.player && enemy && enemy.body) {
                enemy.updateMovement();
            }
        });

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
    createEnemies() {
        const enemyData = [
            { x: 500, y: 340, sprite: "goblinIdle", type: "goblin" },
            { x: 700, y: 340, sprite: "setaIdle", type: "seta" },
            { x: 1800, y: 340, sprite: "goblinIdle", type: "goblin" },
        ];
    
        enemyData.forEach(data => {
            const { x, y, sprite, type } = data;
            const enemy = new Enemy(this, x, y, sprite);
            enemy.enemyType = type; 
            if (type === "goblin") {
                enemy.setAnimations('goblin');
            } else if (type === "seta") {
                enemy.setAnimations('seta');
            }
    
            this.enemies.push(enemy);
        });
    }
    

    setupCollisions() {
        this.enemies.forEach(enemy => {
            this.physics.add.collider(enemy, this.player, this.enemyHit, null, this);
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

    enemyHit() {
        if (this.isRolling || this.invincibleTime > this.time.now || this.player.hp <= 0) {
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

            this.sound.play("enemyAttack", { volume: 0.2 });
        }
    }
}
export default GameScene;