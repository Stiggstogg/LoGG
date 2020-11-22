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
    this.misses = 0;            // number of misses
    this.hitRate = 0;           // hit rate

    // states
    this.state = 0;             // state of the game: 0: starting, 1: playing, 2: end

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

        this.missTarget();

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

    // add start text
    // ---------------------
    let textStyleStart = {
        fontFamily: 'Courier',
        fontSize: '30px',
        color: '#27ff00',
        align: 'center',
    };

    this.startText1 = this.add.text(this.coordGameToCanvas(50, 'x'),
        this.coordGameToCanvas(95, 'y'),
        'Welcome to "LIGHTs out GUN GAME" a gun game where you cannot see your shooting target.\n\n' +
        'On the right you see the coordinates of the target in this area. ' +
        'Position x: 0, y: 0 is on the bottom left of this area and x: 100, y: 100 on the top right.',
        textStyleStart);
    this.startText1.setWordWrapWidth(this.gw * this.vertLinePos * 0.8);
    this.startText1.setOrigin(0.5, 0);

    this.startText2 = this.add.text(this.coordGameToCanvas(50, 'x'),
        this.coordGameToCanvas(30, 'y'),
        'Shoot the first target to start the game! In total 26 targets, which appear on random positions, need to be shot.\n\n' +
        'Press "SPACE" to hide the mouse cursor.',
        textStyleStart);
    this.startText2.setWordWrapWidth(this.gw * this.vertLinePos * 0.8);
    this.startText2.setOrigin(0.5, 0);


    // add target sprite
    // ---------------------

    // create
    this.targetX = 50;      // starting positions
    this.targetY = 50;

    this.target = this.add.sprite(this.coordGameToCanvas(this.targetX,'x'), this.coordGameToCanvas(this.targetY, 'y'), 'target');

    // set properties
    this.target.setOrigin(0.5, 0.5);
    this.target.setScale(this.targetSize);

    // set interactivity
    this.target.setInteractive();

    this.target.on('pointerdown', function (pointer) {

        this.hitTarget();

    }, this);

    // add coordinates text (right pane)
    // ---------------------

    // x and y position of the texts (relative to game width and height) and vertical spaces
    let xpos1 = 0.82;
    let xpos2 = 0.95;           // positions of the coordinates (right aligned)
    let xpos3 = 0.99;           // positions of the numbers (right aligned)
    let ypos1 = 0.30;
    let yspace = 0.05;
    let ypos2 = ypos1 + 6 * yspace;


    // define text style
    let textStyleCoord = {
        fontFamily: 'Courier',
        fontSize: '50px',
        color: '#27ff00'
    };

    this.add.text(this.gw * xpos1, this.gh * ypos1 ,'x:', textStyleCoord);
    this.add.text(this.gw * xpos1, this.gh * (ypos1 + 2 * yspace) ,'y:', textStyleCoord);

    this.xCoordText = this.add.text(this.gw * xpos2, this.gh * ypos1, this.targetX, textStyleCoord);
    this.xCoordText.setOrigin(1, 0);
    this.yCoordText = this.add.text(this.gw * xpos2, this.gh * (ypos1 + 2 * yspace), this.targetY, textStyleCoord);
    this.yCoordText.setOrigin(1, 0);

    // add hits, hit rate and time
    let textStyleNumbers = {
        fontFamily: 'Courier',
        fontSize: '23px',
        color: '#27ff00',
    };

    // names
    this.add.text(this.gw * xpos1, this.gh * ypos2 ,'Hits:', textStyleNumbers);
    this.add.text(this.gw * xpos1, this.gh * (ypos2 + yspace) ,'Hit Rate:', textStyleNumbers);
    this.add.text(this.gw * xpos1, this.gh * (ypos2 + 2 * yspace) ,'Time:', textStyleNumbers);

    // numbers
    this.hitText = this.add.text(this.gw * xpos3, this.gh * ypos2 ,'0', textStyleNumbers);
    this.hitText.setOrigin(1, 0);
    this.hitRateText = this.add.text(this.gw * xpos3, this.gh * (ypos2 + yspace) ,'- %', textStyleNumbers);
    this.hitRateText.setOrigin(1, 0);
    this.timeText = this.add.text(this.gw * xpos3, this.gh * (ypos2 + 2 * yspace) ,'00:00', textStyleNumbers);
    this.timeText.setOrigin(1, 0);


    this.hitRateText.originX = 1;

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

    // get positions which contain a character (not spaces)
    this.titleCharacterPos = []

    for (let i = 0; i < title.length; i++) {
        if (title[i] !== ' ') {
            this.titleCharacterPos.push(i);
        }
    }

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

// update method
gameScene.update = function () {

};

// function which defines what happens when the target is hit
gameScene.hitTarget = function () {

    // check if it is the first target and then start the game (timer) and remove the start text
    if (this.state == 0 || this.state == 1) {

        // add hit to counter, change hits and hit rate
        this.hits++;
        this.hitText.setText(this.hits);
        this.hitRateCalc();

        // change background color of the corresponding letter in the title (omit spaces)
        this.titleText[this.titleCharacterPos[this.hits - 1]].setBackgroundColor('#ff00ae');

        if (this.state == 0) {
            // change state
            this.state = 1;

            // remove start text
            this.startText1.destroy();
            this.startText2.destroy();
        }

        // check if game is finished and change state
        if (this.hits == this.titleCharacterPos.length) {
            this.gameFinished();
            return
        }

        // calculate target size
        let targetSizeGameX = this.targetSize / (this.gw * this.vertLinePos - 1.5 * this.lineWidth) * 100;
        let targetSizeGameY = this.targetSize / (this.gh * (1 - this.horLinePos) - 1.5 * this.lineWidth) * 100;

        // calculate new random position (in game coordinates)
        this.targetX = Phaser.Math.Between(targetSizeGameX / 2, 100 - targetSizeGameX / 2);
        this.targetY = Phaser.Math.Between(targetSizeGameY / 2, 100 - targetSizeGameY / 2);

        // set new position of the target (in canvas coordinates)
        this.target.setPosition(this.coordGameToCanvas(this.targetX,'x'), this.coordGameToCanvas(this.targetY, 'y'));

        // write new coordinates to text
        this.xCoordText.setText(this.targetX);
        this.yCoordText.setText(this.targetY);
    }
}

// function which defines what happens when a target is missed
gameScene.missTarget = function () {

    if (this.state == 1) {      // only register misses when the game started already

        // add one to the number of misses and recalculate (and update) hit rate
        this.misses++;
        this.hitRateCalc();
    }
    else if (this.state == 2) {
        this.scene.restart();
    }
}

// calculate and change hit rate
gameScene.hitRateCalc = function () {

    this.hitRate = this.hits / (this.hits + this.misses) * 100;
    this.hitRateText.setText(this.hitRate.toFixed(0) + ' %');

};

// final screen
gameScene.gameFinished = function () {

    // set state to finished
    this.state = 2;

    // destroy the target
    this.target.destroy();

    // show final text
    let textStyleEnd = {
        fontFamily: 'Courier',
        fontSize: '30px',
        color: '#27ff00',
        align: 'center',
    };

    this.startEndText = this.add.text(this.coordGameToCanvas(50, 'x'),
        this.coordGameToCanvas(95, 'y'),
        'The game is finished!\n\nYour score is: ???\n\n\n\nShoot again to restart the game!',
        textStyleEnd);
    this.startEndText.setWordWrapWidth(this.gw * this.vertLinePos * 0.8);
    this.startEndText.setOrigin(0.5, 0);

}

// calculates from game coordinates (area on which can be shot) to the real coordinates in the canvas
gameScene.coordGameToCanvas = function (gameCoord, dim) {

    if (dim === 'x') {
        return this.lineWidth + gameCoord / 100 * (this.gw * this.vertLinePos - 1.5 * this.lineWidth);
    }
    else if (dim === 'y') {
        return this.gh * this.horLinePos + this.lineWidth * 0.5 + (100 - gameCoord) / 100 * (this.gh * (1 - this.horLinePos) - 1.5 * this.lineWidth);
    }

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