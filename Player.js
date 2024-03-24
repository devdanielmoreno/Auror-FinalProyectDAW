import Phaser from 'phaser';
const sizes = {
    width: 1500,
    height: 700
}
export default class Player extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y, texture) {
        super(scene, x, y, texture);

        scene.add.existing(this);
        scene.physics.add.existing(this);

        this.setMaxVelocity(300, 300);
        this.setImmovable(true);
        this.body.allowGravity = false;
        this.setCollideWorldBounds(true);
        this.hp = 100;
        this.maxHp= 100;
        this.scene = scene; 
    }

    attack() {
        if (this.scene.isAttacking || this.scene.isRolling || !this.scene.enemy || this.hp <= 0) {
            return;
        }
    
        this.attackCount = (this.attackCount || 0) + 1;
        this.scene.time.delayedCall(1500, () => {
            this.attackCount = 0;
        });
    
        const attackAnim = `player_attack${Math.min(this.attackCount, 3)}`;
        const attackDamage = {
            'player_attack1': 10,
            'player_attack2': 20,
            'player_attack3': 30,
        }[attackAnim]; 
    
        this.scene.isAttacking = true;
        this.anims.play(attackAnim, true);
        this.setDepth();
        this.scene.sound.play('playerAttack', { volume: 0.2 });
        this.setVelocity(0);
    
        this.once('animationcomplete', () => {
            this.scene.isAttacking = false;
        });
    
        if (this.scene.enemy && this.scene.enemy.hp > 0) {
            const distance = Phaser.Math.Distance.Between(
                this.x,
                this.y,
                this.scene.enemy.x,
                this.scene.enemy.y
            );
    
            if (distance <= 130) {
                this.scene.enemy.hp -= attackDamage;
    
                if (this.scene.enemy.hp <= 0) {
                    this.scene.enemy.destroy();
                    if (this.hp < this.maxHp) {
                        this.hp = Math.min(this.maxHp, this.hp + 5);
                        this.scene.healthText.setText(`${this.hp}/100`);
                        const baraWidth = Math.max(0, this.hp / this.maxHp * sizes.width / 10);
                        const baraColor = this.hp <= 20 ? 0xff0000 : (this.hp <= 50 ? 0xffff00 : 0x00ff00);
                        this.scene.healthBar.clear().fillStyle(baraColor, 1).fillRect(0, 0, baraWidth, 20);
                    }
                }
    
                this.scene.events.emit('updateHealthBar');
            }
        }
    
        this.lastAttackTime = this.scene.time.now;
    }
    

    

    roll() {
        if (this.scene.rollCharges > 0 && this.scene.time.now > this.scene.lastRollTime + this.scene.rollCooldown) {
            this.scene.isRolling = true;
            this.setAlpha(0.5);
            this.anims.stop();
            this.anims.play('roll_effect', true);
            this.scene.sound.play('playerRoll', { volume: 0.2 });
            this.setVelocity(0);
            this.scene.lastRollTime = this.scene.time.now;
            this.scene.invincibleTime = this.scene.time.now + 1000;
            this.scene.rollCharges--;

            let rollDirection = 0;
            if (this.scene.cursor.left.isDown) {
                rollDirection = -50;
            } else if (this.scene.cursor.right.isDown) {
                rollDirection = 50;
            }
    
            this.scene.tweens.add({
                targets: this,
                x: this.x + rollDirection,
                duration: 400,
                ease: 'Linear', 
                onComplete: () => {
                    this.scene.isRolling = false;
                    this.setAlpha(1);
                    this.scene.updateRollChargeCircles();
    
                    if (this.scene.rollCharges < 3) {
                        this.scene.time.delayedCall(8000, () => {
                            this.scene.rollCharges++;
                            this.scene.updateRollChargeCircles();
                        });
                    }
                }
            });
        }
    }
    
    moveLeft() {
        this.setVelocityX(-50); 
    }
    
    moveRight() {
        this.setVelocityX(50);
    }
    
    

}
