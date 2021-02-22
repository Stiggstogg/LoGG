// "Game" scene: This is the main scene of the game

// imports
import Target from '../objects/target.js'

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

    }

    // create objects (executed once after preload())
    create() {

        // set background zone (triggers a miss!)
        // ----------------------------------

        // TODO: Replace by object

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

        // TODO: Put in separate function

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

        // add target (rectangle)
        // ---------------------

        this.target = this.add.existing(new Target(this, 50, 50, this.targetSize, this.targetSize, this.lineColor));

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

        // add tweens
        // --------------------
        this.addTweens();

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

    // function which defines what happens when a target is missed
    missTarget() {

        if (this.state == 1) {      // only register misses when the game started already

            this.flashCamera();   // flash

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
        this.hitRate = this.target.counter / (this.target.counter + this.misses) * 100;
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

    // adds all tweens to the scene
    addTweens() {

        // flash tween of the target
        this.flashTargetTween = this.tweens.add({
            targets: this.target,
            alpha: 1,
            duration: 50,
            paused: true,       // pause to be able to control the tween
            yoyo: true,          // tween will go back to beginning state
            ease: 'Quad.easeInQuad'  // easing function for smoother transition
        });

        // create a new target when the tween is completed
        this.flashTargetTween.on('complete', function () { this.target.newTarget() }, this);

    }

    // camera flash
    flashCamera() {
        this.cameras.main.flash(100);
    }

    // actions which happen on the scene when the target is hit
    hitTarget(hitCounter) {

        // flash camera
        this.flashCamera();

        // play tween (flash target)
        this.flashTargetTween.play();

        // play sound
        this.soundHit.play();

        // set hit texts
        this.hitText.setText(hitCounter);
        this.hitRateCalc();

        // change background color of the corresponding letter in the title (omit spaces)
        this.titleText[this.titleCharacterPos[hitCounter - 1]].setBackgroundColor('#ff00ae');

        // if it is the first hit, start the timer
        if (hitCounter == 1) {

            // set start time
            this.scene.startTime = new Date();
        }

        // check if game is finished and change state
        if (hitCounter === this.titleCharacterPos.length) {
            this.gameFinished();
        }

    }


}