// set the configuration of the game
let config = {
    type: Phaser.AUTO, // Phaser will use WebGL if available, if not it uses the canvas
    width: 1280,
    height: 720,
    scene: [bootScene, loadingScene, homeScene, gameScene],
    title: 'LIGHTs out GUN GAME',  // Shown in the console
    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH
    },
    pixelArt: false,   // if true pixel perfect rendering is used
};