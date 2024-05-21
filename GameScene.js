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
        this.potionUsages = 2;
        this.bossHealthBar;
        this.bossHealthText;
        this.bossActive = false;
    }

    preload() {
        /////Mapa//////
        this.load.image('base_tiles', 'assets/Mapa/TX Tileset Grass.png')
        this.load.image('obsta', 'assets/Mapa/TX Plant.png')
        this.load.image('detras', 'assets/Mapa/TX Props.png')
        this.load.image('zonaSangre', 'assets/Mapa/blood.png')
        this.load.image('stairs', 'assets/Mapa/TX Struct.png')
        this.load.image('stone', 'assets/Mapa/TX Tileset Stone Ground.png')
        this.load.image('wall', 'assets/Mapa/TX Tileset Wall.png')
        this.load.image('zonaBoss', 'assets/Mapa/TX Props.png')
        this.load.image('cosas', 'assets/Mapa/TX Props.png')
        this.load.image('final', 'assets/Mapa/TX Props.png')
        this.load.tilemapTiledJSON('tilemap', 'assets/Mapa/Mapa.json')

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

        this.load.atlas("bossIdle", "assets/enemigos/boss/bossIdle.png", "assets/enemigos/boss/boss.json");
        this.load.atlas("bossRun", "assets/enemigos/boss/bossRun.png", "assets/enemigos/boss/bossRun.json");
        this.load.atlas("bossAttack", "assets/enemigos/boss/bossAttack.png", "assets/enemigos/boss/bossAttack.json");
        this.load.atlas("bossHit", "assets/enemigos/boss/bossHit.png", "assets/enemigos/boss/bossHit.json");
        this.load.atlas("bossDeath", "assets/enemigos/boss/bossDeath.png", "assets/enemigos/boss/bossDeath.json");

        this.load.atlas("bosssIdle", "assets/enemigos/miniboss/cala.png", "assets/enemigos/miniboss/cala.json");
        this.load.atlas("bosssRun", "assets/enemigos/miniboss/calabera.png", "assets/enemigos/miniboss/calabera.json");
        this.load.atlas("bosssAttack", "assets/enemigos/miniboss/calabera.png", "assets/enemigos/miniboss/calabera.json");
        this.load.atlas("bosssHit", "assets/enemigos/miniboss/calabera.png", "assets/enemigos/miniboss/calabera.json");
        this.load.atlas("bosssDeath", "assets/enemigos/miniboss/cala.png", "assets/enemigos/miniboss/cala.json");

        /////HUD/////
        this.load.image("barra", "assets/HUD/barra.png");
        this.load.image("dialog", "assets/HUD/dialog.png");
        this.load.image("rollbar1", "assets/HUD/roll.png");
        this.load.image("rollbar2", "assets/HUD/roll2.png");
        this.load.image("rollbar3", "assets/HUD/roll3.png");
        this.load.image("rollbar4", "assets/HUD/roll4.png");
        this.load.image("potion", "assets/HUD/pocion.png");
        this.load.image('arrow', 'assets/HUD/arrow.png');
        this.load.image('rod_image', 'assets/HUD/rod.jpeg');

        /////Musica/////
        this.load.audio("bgMusica", "assets/Musica/musica.ogg");
        this.load.audio("bossMusic", "assets/Musica/boss.mp3");
        this.load.audio("enemyAttack", "assets/Musica/enemyAttack.mp3");
        this.load.audio("playerAttack", "assets/Musica/playerAttack.mp3");
        this.load.audio("playerRoll", "assets/Musica/playerRoll.mp3");
        this.load.audio("healSound", "assets/Musica/healsound.wav");
        this.load.audio("bossDeathSound", "assets/Musica/bossDeath.mp3");

    }

    create() {
        //restrablece las variables al morir si quiero que se guarde una piedra no pongo que se vuelva a poner por defecto
        this.rollCharges = 3;
        this.potionUsages = 2;
        this.bossActive = false;
        /////

        this.bgMusica = this.sound.add("bgMusica");
        this.bgMusica.play();
        this.bgMusica.loop = true;
        this.bossMusic = this.sound.add("bossMusic");
        this.bossDeathSound = this.sound.add('bossDeathSound');


        const map = this.make.tilemap({ key: 'tilemap' })
        const tileset = map.addTilesetImage('grass', 'base_tiles')
        const tile = map.addTilesetImage('obstacles', 'obsta');
        const tileDetras = map.addTilesetImage('TX Props', 'detras');
        const tilewall = map.addTilesetImage('TX Tileset Wall', 'wall');
        const tilepiedra = map.addTilesetImage('TX Tileset Stone Ground', 'stone');
        const tilestairs = map.addTilesetImage('TX Struct', 'stairs');
        const tilecosas = map.addTilesetImage('TX Props', 'cosas');
        const tilerunas = map.addTilesetImage('TX Props', 'cosas');
        const tileZonaBoss = map.addTilesetImage('TX Props', 'zonaBoss');
        const tilecarteles = map.addTilesetImage('TX Props', 'cosas');
        const tilefinal = map.addTilesetImage('TX Props', 'final');
        const tileSangre = map.addTilesetImage('blood', 'zonaSangre');
        const groundLayer = map.createLayer('ground', tileset);
        const stoneLayer = map.createLayer('piedra', tilepiedra);
        const obstaLayer = map.createLayer('obstacles', tile);
        const sagreLayer = map.createLayer('zonaSangre', tileSangre);
        const detrasLayer = map.createLayer('detras', tileDetras);
        const wallLayer = map.createLayer('paredes', tilewall);
        const stairLayer = map.createLayer('escaleras', tilestairs);
        const cosasLayer = map.createLayer('cosas', tilecosas);
        const cartelesLayer = map.createLayer('carteles', tilerunas);
        const runasLayer = map.createLayer('runas', tilecosas);
        const zonaBossLayer = map.createLayer('zonaBoss', tileZonaBoss);
        const finalLayer = map.createLayer('final', tilefinal);

        this.player = new Player(this, 50, 340, "player");
        this.player.scene = this;

        this.createEnemies();
        obstaLayer.setCollisionBetween(65, 189)
        obstaLayer.setDepth(9000);
        this.physics.add.collider(this.player, wallLayer)
        this.physics.add.collider(this.enemies, wallLayer)
        wallLayer.setCollisionBetween(338, 437)
        stairLayer.setCollisionBetween(664, 697)
        wallLayer.setDepth(1000);
        stairLayer.setDepth(1000);
        this.physics.add.collider(this.player, cosasLayer)
        cosasLayer.setCollisionBetween(911, 1141)
        cosasLayer.setDepth(1001);
        finalLayer.setCollisionByExclusion([-1]);

        this.physics.add.collider(this.player, finalLayer, this.finalA, null, this);
        detrasLayer.setAlpha(0);
        detrasLayer.setCollision(1053)
        this.physics.add.collider(this.player, detrasLayer);
        this.physics.add.collider(this.enemies, detrasLayer)

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
        this.healthText.setDepth(9003);
        this.healthBar.setDepth(9003);

        const barraImage = this.add.image(93, this.healthText.y + this.healthText.height + 20, "barra");
        barraImage.setScrollFactor(0);
        barraImage.setDepth(9004);

        this.cartel = this.add.image(300, 200, "dialog").setVisible(false);

        this.events.on('playerDead', () => {
            this.resetBossHealth();
            this.updateBossHealthBar();
            this.scene.pause();
            this.bgMusica.stop();
            this.bossMusic.stop();
            this.scene.run('scene-dead');
            this.time.delayedCall(3000, () => {
                this.scene.restart();
            });
        });
        this.anims.create({
            key: 'bosssIdle',
            frames: this.anims.generateFrameNames('bosssIdle', { prefix: 'cala', end: 3, zeroPad: 5 }),
            frameRate: 4,
        });
        this.anims.create({
            key: 'bosssRun',
            frames: this.anims.generateFrameNames('bosssRun', { prefix: 'calabera', end: 7, zeroPad: 5 }),
            frameRate: 8,
        });
        this.anims.create({
            key: 'bosssAttack',
            frames: this.anims.generateFrameNames('bosssAttack', { prefix: 'calabera', end: 7, zeroPad: 5 }),
            frameRate: 8,
        });
        this.anims.create({
            key: 'bosssHit',
            frames: this.anims.generateFrameNames('bosssHit', { prefix: 'calabera', end: 7, zeroPad: 5 }),
            frameRate: 8,
        });
        this.anims.create({
            key: 'bosssDeath',
            frames: this.anims.generateFrameNames('bosssDeath', { prefix: 'cala', end: 3, zeroPad: 5 }),
            frameRate: 4,
        });

        this.potionImage = this.add.image(sizes.width - 50, sizes.height - 50, "potion").setInteractive().setScrollFactor(0).setDepth(9009).setScale(1.5);

        this.potionText = this.add.text(sizes.width - 50, sizes.height, `${this.potionUsages}`, { fontFamily: "Orbitron", fontSize: "24px", fill: "#ffffff" }).setScrollFactor(0).setDepth(9009);

        this.input.keyboard.on('keydown-SPACE', () => {
            this.usePotion();
        });
        const potionBackground = this.add.circle(sizes.width - 70, sizes.height - 60, 50, 0x000000, 0.5)
            .setStrokeStyle(10, 0x826744)
            .setScrollFactor(0)
            .setDepth(9008);

        this.rollbars = [
            this.add.image(87, 110, "rollbar1").setDepth(9001).setScrollFactor(0).setVisible(false),
            this.add.image(87, 110, "rollbar2").setDepth(9001).setScrollFactor(0).setVisible(false),
            this.add.image(87, 110, "rollbar3").setDepth(9001).setScrollFactor(0).setVisible(false),
            this.add.image(87, 110, "rollbar4").setDepth(9001).setScrollFactor(0).setVisible(false)
        ];
        this.updateRollChargeCircles();
        this.map = map;

        this.bossHealthBar = this.add.graphics();
        this.bossHealthText = this.add.text(sizes.width / 2, sizes.height - 30, "", { fontSize: "20px", fill: "#ffffff" });
        this.bossHealthText.setOrigin(0.5, 0.5);
        this.bossHealthBar.setScrollFactor(0);
        this.bossHealthText.setScrollFactor(0);
        this.bossHealthBar.setDepth(10000);
        this.bossHealthText.setDepth(10000);

        this.cursor = this.input.keyboard.createCursorKeys();
        this.zKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.Z);
        this.xKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.X);
        this.cKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.C);
        this.escKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ESC);

        this.arrow = this.add.image(2700, 480, 'arrow');
        this.arrow.setVisible(false);
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
            this.bossMusic.pause();
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
                if (enemy.enemyType === 'boss' && !this.bossActive) {
                    const distance = Phaser.Math.Distance.Between(this.player.x, this.player.y, enemy.x, enemy.y);
                    if (distance <= 500) {
                        this.activateBoss(enemy);
                    }
                }
            });
        });
        const bossss = this.enemies.find(enemy => enemy.enemyType === 'boss');
        if (bossss && bossss.hp <= bossss.maxHp / 2 ) {
            this.createBossEnemies();
        }
        

        this.potionImage.setPosition(this.cameras.main.width - 72, this.cameras.main.height - 75);
        this.potionText.setPosition(this.cameras.main.width - 81, this.cameras.main.height - 45);

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
            if (enemy.enemyType === 'boss' && !this.bossActive) {
                const distance = Phaser.Math.Distance.Between(this.player.x, this.player.y, enemy.x, enemy.y);
                if (distance <= 500) {
                    this.activateBoss(enemy);
                }
            }
        });

        if (this.bossActive) {
            this.updateBossHealthBar();
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
    activateBoss(boss) {
        this.bossActive = true;
        this.bgMusica.stop();
        this.bossMusic.play({ loop: true });

        this.bossHealthBar.clear();
        this.bossHealthText.setStyle({
            fontFamily: 'Orbitron',
        });
        this.updateBossHealthBar();
    }
    resetBossHealth() {
        const boss = this.enemies.find(enemy => enemy.enemyType === 'boss');
        if (boss) {
            boss.hp = boss.maxHp;
        }
    }

    updateBossHealthBar() {
        const boss = this.enemies.find(enemy => enemy.enemyType === 'boss');
        if (boss) {
            this.bossHealthBar.clear();
            const barWidth = sizes.width - 300;
            const barHeight = 20;
            boss.hp = Math.max(0, boss.hp);

            const healthPercentage = boss.hp / boss.maxHp;
            const healthWidth = barWidth * healthPercentage;

            this.bossHealthBar.fillStyle(0x000000);
            this.bossHealthBar.fillRect(sizes.width / 2 - barWidth / 2, sizes.height - 40, barWidth, barHeight);
            this.bossHealthBar.fillStyle(0xff0000);
            this.bossHealthBar.fillRect(sizes.width / 2 - barWidth / 2, sizes.height - 40, healthWidth, barHeight);

            this.bossHealthText.setText(`Valea: La Destructora     ${boss.hp}/${boss.maxHp}`);


            if (boss.hp <= 0) {
                this.arrow.setVisible(true);
                if (this.bossMusic.isPlaying) {
                    this.bossMusic.stop();
                }
                if (!this.bossDeathSound.isPlaying) {
                    this.bossDeathSound.play();
                }
            }
        }
    }



    createEnemies() {
        this.enemies = [];

        const enemyData = [
            { x: 500, y: 540, sprite: "goblinIdle", type: "goblin" },
            { x: 900, y: 200, sprite: "setaIdle", type: "seta" },
            { x: 1800, y: 840, sprite: "goblinIdle", type: "goblin" },
            { x: 1700, y: 340, sprite: "setaIdle", type: "seta" },
            { x: 1100, y: 600, sprite: "goblinIdle", type: "goblin" },
            { x: 1400, y: 700, sprite: "setaIdle", type: "seta" },
            { x: 700, y: 1900, sprite: "goblinIdle", type: "goblin" },
            { x: 750, y: 1800, sprite: "goblinIdle", type: "goblin" },
            { x: 830, y: 1800, sprite: "goblinIdle", type: "goblin" },
            { x: 1600, y: 1600, sprite: "setaIdle", type: "seta" },
            { x: 1900, y: 1700, sprite: "setaIdle", type: "seta" },
            { x: 2000, y: 1800, sprite: "goblinIdle", type: "goblin" },
            { x: 2650, y: 480, sprite: "bossIdle", type: "boss" },
        ];

        enemyData.forEach(data => {
            const { x, y, sprite, type } = data;
            const enemy = new Enemy(this, x, y, sprite, type);
            enemy.enemyType = type;
            if (type === "goblin") {
                enemy.setAnimations('goblin');
            } else if (type === "seta") {
                enemy.setAnimations('seta');
            } else if (type === "boss") {
                enemy.setAnimations('boss');
                enemy.setScale(1.5);
                enemy.hp = enemy.maxHp;
            }

            this.enemies.push(enemy);
        });

        this.setupCollisions();
    }
    createBossEnemies() {
        if (!this.bossEnemiesCreated) {
            const bossEnemiesData = [
                { x: 2350, y: 280, sprite: "bossIdle", type: "bosss" },
                { x: 2450, y: 580, sprite: "bossIdle", type: "bosss" },
            ];
    
            bossEnemiesData.forEach(data => {
                const { x, y, sprite, type } = data;
                const enemy = new Enemy(this, x, y, sprite, type);
                if (type === "bosss") {
                    enemy.setAnimations('boss');
                    enemy.setScale(1.3);
                    enemy.setAcceleration(20);
                    enemy.setVelocityX(this.playerSpeed);
                }
                this.enemies.push(enemy);
            });
            this.bossEnemiesCreated = true;
    
            this.setupCollisions();
        }
    }
    setupCollisions() {
        this.enemies.forEach(enemy => {
            this.physics.add.collider(enemy, this.player, () => {
                this.enemyHit(enemy);
            });
        });
    }
    mostrarDialogo() {
        this.cartel.setVisible(true).setDepth(9001);
        this.time.delayedCall(5000, () => {
            this.cartel.setVisible(false);
        });
    }

    updateRollChargeCircles() {
        for (let i = 0; i < this.rollbars.length; i++) {
            this.rollbars[i].setVisible(i === this.rollCharges);
        }
    }

    enemyHit(enemy) {
        if (this.isRolling || this.invincibleTime > this.time.now || this.player.hp <= 0) {
            return;
        }

        if (this.time.now > this.lastAttackTime + 1500) {
            this.lastAttackTime = this.time.now;
            this.player.hp = Math.max(0, this.player.hp - enemy.damage);

            this.invincibleTime = this.time.now + 2000;

            this.healthText.setText(`${this.player.hp}/100`);
            const baraWidth = Math.max(0, this.player.hp / this.player.maxHp * sizes.width / 10);
            const baraColor = this.player.hp <= 20 ? 0xff0000 : (this.player.hp <= 50 ? 0xffff00 : 0x00ff00);
            this.healthBar.clear().fillStyle(baraColor, 1).fillRect(0, 0, baraWidth, 20);

            this.sound.play("enemyAttack", { volume: 0.2 });

        }
    }
    usePotion() {
        if (this.potionUsages > 0) {
            this.player.hp = Math.min(this.player.maxHp, this.player.hp);
            this.potionUsages--;
            this.potionText.setText(`${this.potionUsages}`);
            this.player.usePotion();
        }
    }

    finalA() {
        const boss = this.enemies.find(enemy => enemy.enemyType === 'boss');
        if (boss && boss.hp <= 0) {
            this.cameras.main.fadeOut(1000, 0, 0, 0);
            this.cameras.main.once('camerafadeoutcomplete', () => {
                this.bossMusic.stop();
                this.player.disableBody(true, true);
                this.scene.start('scene-end');
            });
        }
    }

}
export default GameScene;