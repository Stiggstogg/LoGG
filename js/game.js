// create a new scene
let gameScene = new Phaser.Scene('Game');


// initiate scene parameters
gameScene.init = function() {

    // get game width and height
    this.gw = this.sys.game.config.width;
    this.gh = this.sys.game.config.height;

    // is cursors hidden
    this.cursorHide = false;

    // line properties
    this.lineWidth = 5;         // width of the lines (in px)
    this.lineColor = 0x27ff00;  // colors of the lines
    this.vertLinePos = 0.8;     // relative y position of the vertical line (above is the title) (relative to game height)
    this.horLinePos = 0.2;      // relative x position of the hrizontal line (to the left the coordinates are shown) (relative to game width)

    // target properties
    this.targetSize = 100;      // size of the target (in px as the asset is 1 px)

    // numbers for scores
    this.hits = 0;              // number of hits

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

    // add lines
    // ---------------------

    // rectangle (border)
    let rect = new Phaser.Geom.Rectangle(this.lineWidth*0.5, this.lineWidth*0.5, this.gw-this.lineWidth, this.gh-this.lineWidth); // x, y, width, height

    let graphics = this.add.graphics({lineStyle: {width: this.lineWidth, color: this.lineColor }});  // create graphics object

    graphics.strokeRectShape(rect);     // draw rectangle

    // lines
    let vertLine = new Phaser.Geom.Line(this.gw*this.vertLinePos, this.gh*this.horLinePos, this.gw*this.vertLinePos, this.gh);
    let horLine = new Phaser.Geom.Line(0, this.gh*this.horLinePos, this.gw, this.gh*this.horLinePos);

    graphics.strokeLineShape(vertLine);
    graphics.strokeLineShape(horLine);

    // add target sprite
    // ---------------------

    // create
    this.targetX = 50;      // starting positions
    this.targetY = 50;

    this.target = this.add.sprite(this.CoordGameToCanvas(this.targetX,'x'), this.CoordGameToCanvas(this.targetY, 'y'), 'target');

    // set properties
    this.target.setOrigin(0.5, 0.5);
    this.target.setScale(this.targetSize);

    // set interactivity
    this.target.setInteractive();

    let targetSizeGameX = this.targetSize / (this.gw * this.vertLinePos - 1.5 * this.lineWidth) * 100;
    let targetSizeGameY = this.targetSize / (this.gh * (1 - this.horLinePos) - 1.5 * this.lineWidth) * 100;

    this.target.on('pointerdown', function (pointer) {

        // calculate new position (in game coordinates)
        this.targetX = Phaser.Math.Between(targetSizeGameX / 2, 100 - targetSizeGameX / 2);
        this.targetY = Phaser.Math.Between(targetSizeGameY / 2, 100 - targetSizeGameY / 2);

        // set new position of the target (in canvas coordinates)
        this.target.setPosition(this.CoordGameToCanvas(this.targetX,'x'), this.CoordGameToCanvas(this.targetY, 'y'));

        // write new coordinates to text
        this.xCoordText.setText('x: ' + this.targetX);
        this.yCoordText.setText('y: ' + this.targetY);

        // add hit to counter
        this.hits++;

        // change style of the title letter

    }, this);

    // add text (right pane)
    // ---------------------

    // define text style
    let textStyle = {
        fontFamily: 'Courier',
        fontSize: '50px',
        color: '#27ff00'
    };

    this.xCoordText = this.add.text(this.gw * 0.82, this.gh * 0.3 ,'x: ' + this.targetX, textStyle);
    this.yCoordText = this.add.text(this.gw * 0.82, this.gh * 0.4 ,'y: ' + this.targetY, textStyle);

    // add title text
    // --------------------

    // text style and position
    this.titleStyle = {
        fontFamily: 'Courier',
        fontSize: '60px',
        color: '#27ff00',
        fontStyle: 'bold'
    };

    this.titleStyleShot = {             // style of the title when scored
        fontFamily: 'Courier',
        fontSize: '60px',
        color: '#27ff00',
        fontStyle: 'bold',
        backgroundColor: '#FF00AE'
    }

    let titleStartPos = 0.043;    // x start position of the title (relative to game width)
    let titleSeparation = 0.03; // separation between the letter (relative to game width)

    // create title text array
    let title = ['2', '0', '0', ' ',
        'E', 'p', 'i', 's', 'o', 'd', 'e', 's', ' ',
        'L', 'i', 'g', 'h', 't', ' ',
        'G', 'u', 'n', ' ',
        'R', 'e', 'v', 'i', 'e', 'w', 's'
    ];

    this.titleSpacePos = [3, 12, 18, 22];    // positions with spaces

    this.titleText = [];

    // add all texts
    for (let i = 0; i < title.length; i++) {
        this.titleText.push(this.add.text(titleStartPos*this.gw + i * titleSeparation*this.gw, this.gh * 0.06, title[i], this.titleStyle));
    }

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

// calculates from game coordinates (area on which can be shot) to the real coordinates in the canvas
gameScene.CoordGameToCanvas = function (gameCoord, dim) {

    if (dim === 'x') {
        return this.lineWidth + gameCoord / 100 * (this.gw * this.vertLinePos - 1.5 * this.lineWidth);
    }
    else if (dim === 'y') {
        return this.gh * this.horLinePos + this.lineWidth * 0.5 + (100 - gameCoord) / 100 * (this.gh * (1 - this.horLinePos) - 1.5 * this.lineWidth);
    }

};

// calculates from game coordinates (area on which can be shot) to the real coordinates in the canvas
gameScene.yCoordGameToCanvas = function (gameY) {

    return this.lineWidth + gameX * (this.gw * this.horLinePos - 1.5 * this.lineWidth) / 100;

}


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