// create a new scene
let gameScene = new Phaser.Scene('Game');


// initiate scene parameters
gameScene.init = function() {

    // get game width and height
    this.gw = this.sys.game.config.width;
    this.gh = this.sys.game.config.height;

    // is cursors hidden
    this.cursorHide = false;

};

// load assets (executed once after init() and before create())
gameScene.preload = function () {

    // load images
    this.load.image('target', 'assets/images/target.png');              // target image (1px, red)
    this.load.image('background', 'assets/images/background.png');      // background image (10x10 px, black)

};

// create objects (executed once after preload())
gameScene.create = function () {

    // add background sprite (all black)
    // ----------------------------------

    // create
    this.bg = this.add.sprite(0, 0, 'background');

    // set properties
    this.bg.setOrigin(0, 0);
    this.bg.setScale(this.gw*0.1, this.gh*0.1);

    // set interactivity
    this.bg.setInteractive();
    this.bg.on('pointerdown', function (pointer) {

        console.log('miss'); // TODO: Replace with correct action!

    }, this);


    // add target sprite
    // ---------------------

    // create
    this.target = this.add.sprite(this.gw*0.5, this.gh*0.5, 'target');

    // set properties
    this.target.setOrigin(0.5, 0.5);
    this.target.setScale(100);

    // set interactivity
    this.target.setInteractive();

    this.target.on('pointerdown', function (pointer) {
        console.log('HIT!');

        this.target.setPosition(Phaser.Math.Between(0, this.gw), Phaser.Math.Between(0, this.gh));
    }, this);

    // keyboard events
    // --------------------

    this.keySpace = this.input.keyboard.addKey('Space');
    this.keySpace.on('down', function (event) {

        if (this.cursorHide) {
            this.input.setDefaultCursor('default');
        } else {
            this.input.setDefaultCursor('none');
        }

        this.cursorHide = !this.cursorHide;

    }, this);

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