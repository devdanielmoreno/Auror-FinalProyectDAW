import "./style.css";
import Phaser from "phaser";
import MenuScene from "./MenuScene.js";
import OpcionesScene from "./OpcionesScene.js";
import DeadScene from "./DeadScene.js";
import GameScene from "./GameScene.js";
import EndScene from './EndScene.js';

const sizes = {
  width: 1500,
  height: 700
}
const speedDown = 300

const config = {
  type: Phaser.WEBGL,
  width: sizes.width,
  height: sizes.height,
  canvas: gameCanvas,
  physics: {
    default: "arcade",
    arcade: {
      gravity: { y: speedDown },
      debug: false
    }
  },
  scene: [MenuScene, GameScene, DeadScene, OpcionesScene,EndScene]
};

const game = new Phaser.Game(config);
