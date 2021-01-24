// "Game" scene: This is the main scene of the game
export default class gameScene extends Phaser.Scene {

    constructor() {
        super({
            key: 'Game'
        });
    }

    // initiate scene parameters
    init() {

        // get game width and height
        this.gw = this.sys.game.config.width;
        this.gh = this.sys.game.config.height;

        // is cursors hidden
        this.cursorHide = false;

        // line properties
        this.lineWidth = 5;         // width of the lines (in px)
        this.lineColor = 0x27ff00;  // colors of the lines
        this.vertLinePos = 0.8;     // relative y position of the vertical line (above is the title) (relative to game height)
        this.horLinePos = 0.2;      // relative x position of the horizontal line (to the left the coordinates are shown) (relative to game width)

        // target properties
        this.targetSize = 100;      // size of the target

        // numbers for scores
        this.hits = 0;              // number of hits
        this.misses = 0;            // number of misses
        this.hitRate = 0;           // hit rate
        this.time = 0;              // time
        this.score = 0;             // score

        // states
        this.state = 0;             // state of the game: 0: starting, 1: playing, 2: end

    }

    // create objects (executed once after preload())
    create() {

        // set background zone (triggers a miss!)
        // ----------------------------------

        // create
        this.bgZone = this.add.zone(0, 0, this.gw, this.gh);

        // set properties
        this.bgZone.setOrigin(0, 0);

        // set interactivity
        this.bgZone.setInteractive();
        this.bgZone.on('pointerdown', function (pointer) {

            this.missTarget();

        }, this);

        // add lines
        // ---------------------

        // rectangle (border)
        let rect = this.add.rectangle(0, 0, this.gw, this.gh); // x, y, width, height
        rect.setOrigin(0);
        rect.setStrokeStyle(this.lineWidth*2, this.lineColor);   // lineWidth needs to be doubled as half of the line will be outside

        // lines
        let vertLine = this.add.line(0, 0, this.gw*this.vertLinePos, this.gh*this.horLinePos, this.gw*this.vertLinePos, this.gh, this.lineColor);
        let horLine = this.add.line(0, 0, 0, this.gh*this.horLinePos, this.gw, this.gh*this.horLinePos, this.lineColor);

        vertLine.setOrigin(0);
        horLine.setOrigin(0);

        vertLine.setLineWidth(this.lineWidth/2);    // lineWidth needs to be halfed as the width is added to both sides
        horLine.setLineWidth(this.lineWidth/2);


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

        // add target (rectangle)
        // ---------------------

        // create
        this.targetX = 50;      // starting positions
        this.targetY = 50;

        this.target = this.add.rectangle(this.coordGameToCanvas(this.targetX,'x'), this.coordGameToCanvas(this.targetY, 'y'), this.targetSize, this.targetSize, this.lineColor);

        // set properties
        this.target.setAlpha(0.0001);         // set alpha to zero to make it invisible TODO: Change back to 0 as soon as Phaser Issue #5507 is fixed (https://github.com/photonstorm/phaser/issues/5507)

        // set interactivity
        this.target.setInteractive();
        this.target.input.alwaysEnabled = true;     // needs to be true otherwise the pointerdown event will not fire if alpha is set to 0

        // create tween
        this.target.flashTween = this.tweens.add({
            targets: this.target,
            alpha: 1,
            duration: 50,
            paused: true,       // pause to be able to control the tween
            yoyo: true,          // tween will go back to beginning state
            ease: 'Quad.easeInQuad'  // easing function for smoother transition
        });

        this.target.on('pointerdown', function (pointer) {

            this.hitTarget();

        }, this);

        console.log(this.target);
        console.log(this.bgZone);

        this.target.setDepth(-1);
        this.bgZone.setDepth(10);

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

        // Audio
        // --------------------

        this.soundHit = this.sound.add('hit');
        this.soundMiss = this.sound.add('miss');

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

    }

    // update method
    update(time, delta) {

        // update timer
        if (this.state == 1) {
            let now = new Date();
            let diff = now - this.startTime;        // difference in milli seconds

            let mm = Math.floor(diff / 1000 / 60);  // minutes part of the difference
            let ss = diff / 1000 - mm * 60;             // seconds part of the difference

            let mmDisplay;
            let ssDisplay;

            // add 0 as prefix if numbers are smaller then 10
            if (mm < 10) {
                mmDisplay = '0' + mm.toFixed(0);
            } else {
                mmDisplay = mm.toFixed(0);
            }

            if (Math.round(ss) < 10) {
                ssDisplay = '0' + ss.toFixed(0);
            } else {
                ssDisplay = ss.toFixed(0);
            }

            this.timeText.setText(mmDisplay + ':' + ssDisplay);      // set timer text
        }

    }

    // function which defines what happens when the target is hit
    hitTarget() {

        // check if it is the first target and then start the game (timer) and remove the start text
        if (this.state < 2) {

            // flash camera
            this.cameras.main.flash(100);

            // play tween (flash target)
            this.target.flashTween.play();

            // play sound
            this.soundHit.play();

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

                // set start time
                this.startTime = new Date();
            }

            // check if game is finished and change state
            if (this.hits == this.titleCharacterPos.length) {
                this.gameFinished();
                return
            }

            this.target.flashTween.on('complete', function () {

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


            }, this);

        }
    }

    // function which defines what happens when a target is missed
    missTarget() {

        if (this.state == 1) {      // only register misses when the game started already

            this.cameras.main.flash(100);   // flash

            // play sound
            this.soundMiss.play();

            // add one to the number of misses and recalculate (and update) hit rate
            this.misses++;
            this.hitRateCalc();
        }
        else if (this.state == 2) {
            this.scene.restart();
        }
    }

    // calculate and change hit rate
    hitRateCalc() {
        this.hitRate = this.hits / (this.hits + this.misses) * 100;
        this.hitRateText.setText(this.hitRate.toFixed(0) + ' %');
    }

    // final screen
    gameFinished() {

        // set state to finished
        this.state = 2;

        // set final time and calculate score
        let now = new Date();
        this.time = (now - this.startTime) / 1000;
        this.score = this.hitRate / this.time * 2000;

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
            'The game is finished!\n\nYour score is: ' + this.score.toFixed(0) + '\n\n\n\nShoot to restart the game!',
            textStyleEnd);
        this.startEndText.setWordWrapWidth(this.gw * this.vertLinePos * 0.8);
        this.startEndText.setOrigin(0.5, 0);

    }

    // calculates from game coordinates (area on which can be shot) to the real coordinates in the canvas
    coordGameToCanvas(gameCoord, dim) {
        if (dim === 'x') {
            return this.lineWidth + gameCoord / 100 * (this.gw * this.vertLinePos - 1.5 * this.lineWidth);
        }
        else if (dim === 'y') {
            return this.gh * this.horLinePos + this.lineWidth * 0.5 + (100 - gameCoord) / 100 * (this.gh * (1 - this.horLinePos) - 1.5 * this.lineWidth);
        }
    }

}