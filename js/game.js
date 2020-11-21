// create a new scene
let gameScene = new Phaser.Scene('Game');


// initiate scene parameters
gameScene.init = function() {

};

// load assets (executed once after init() and before create())
gameScene.preload = function () {

};

// create objects (executed once after preload())
gameScene.create = function () {

};

// update method
gameScene.update = function () {

};

// set the configuration of the game
let config = {
    type: Phaser.AUTO, // Phaser will use WebGL if available, if not it uses the canvas
    width: 1280,
    height: 720,
    scene: gameScene,
    title: 'LIGHTs out GUN GAME',  // Shown in the console
    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH
    },
    pixelArt: false,   // if true pixel perfect rendering is used
};

// create a new game, pass the configuration
let game = new Phaser.Game(config);