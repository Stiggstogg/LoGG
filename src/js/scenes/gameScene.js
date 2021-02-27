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

        // title in the game scene
        this.title = '200 Episodes Light Gun Reviews';

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
        this.xFirst = 50;           // x coordinate of the first target
        this.yFirst = 50;           // y coordinate of the first target

        // numbers for scores
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
        this.bgZone.on('pointerdown', function () {

            this.missTarget();

        }, this);

        // setup of the game objects
        this.gameArea = this.addLines();    // add lines and get game area (shooting area)
        this.addTextTitle();                // add title text ('200 Episodes Light Gun Reviews')
        this.addTextStats();                // add the stats text on the

        this.target = this.add.existing(new Target(this, this.xFirst, this.yFirst, this.targetSize, this.targetSize, this.lineColor, this.gameArea));


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
        this.keySpace.on('down', function () {

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

        // set timer
        let now = new Date();                               // current time
        let diff = now - this.startTime;                    // difference to start time in milli seconds
        if (this.target.counter > 0) {                      // change the time text if the first target was shot
            this.timeText.setText(this.convertTime(diff));  // convert time to string and set timer text
        }
    }

    // actions which happen on the scene when the target is hit
    hitTarget(hitCounter) {

        // if it is the first hit, start the timer
        if (hitCounter === 1) {
            this.startTime = new Date();    // set start time
        }

        // animations (tweens and sounds)
        this.cameras.main.flash(100);   // flash camera
        this.flashTargetTween.play();           // flash target
        this.soundHit.play();                   // play sound

        // calculate coordinates of the new target
        this.target.setNewTarget();

        // adapt texts
        this.hitText.setText(hitCounter);               // hit counter text
        this.hitRateCalc();                             // calculate and change hit rate text
        this.xCoordText.setText(this.target.xGame);     // coordinates for the next target
        this.yCoordText.setText(this.target.yGame);     // coordinates for the next target

        // change background color of the corresponding letter in the title
        this.titleText[hitCounter - 1].setBackgroundColor('#ff00ae');

        // check if game is finished and change state
        if (hitCounter === this.titleText.length) {
            this.gameFinished();
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
        this.flashTargetTween.on('complete', function () {
            this.target.placeNewTarget()
        }, this);

    }

    // Add lines to the screen
    addLines() {

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

        // calculate game area (shooting area) origin (top left) and size
        let gameArea = {};
        gameArea.x = this.lineWidth;
        gameArea.y = this.gh * this.horLinePos + this.lineWidth/2;
        gameArea.width = (this.gw * this.vertLinePos - this.lineWidth/2) - this.lineWidth;
        gameArea.height = (this.gh - this.lineWidth) - (this.gh * this.horLinePos + this.lineWidth/2);

        return gameArea;

    }

    // Add title text
    addTextTitle() {

        // Create title text array, style and set position
        this.titleText = [];            // title text array
        let titleStyle = {fontFamily: 'Courier', fontSize: '60px', color: '#27ff00', fontStyle: 'bold'};
        let titleStartPos = 0.043;      // x start position of the title (relative to game width)
        let titleSeparation = 0.03;     // separation between the letter (relative to game width)

        // add all letters (as separate texts) to the scene (spaces are skipped!)
        for (let i = 0; i < this.title.length; i++) {
            if (this.title[i] !== ' ') {                // skip spaces
                this.titleText.push(                    // put all texts in an array so that they can be changed later (change background when target is hit)
                    this.add.text(titleStartPos * this.gw + i * titleSeparation * this.gw,
                    this.gh * 0.06,
                    this.title[i],
                    titleStyle));
            }
        }

    }

    // Add stats text (on the right pane)
    addTextStats() {

        // x and y position of the texts and vertical spaces (all relative to game width and height)
        let xPos = [0.82, 0.95, 0.99];          // x positions: 0: names (left aligned), 1: coordinates (right aligned), 2: stats (right aligned)
        let ySpace = 0.05;                      // vertical space between the different texts
        let yPos = [0.30];                      // y positions: 0: position of first coordinate (x), 1: position of first stat text (hits)
        yPos.push(yPos[0] + 6 * ySpace);

        // coordinates (x and y)
        // ---------------------

        let textStyle = {fontFamily: 'Courier', fontSize: '50px', color: '#27ff00'};    // text style

        // names
        this.add.text(this.gw * xPos[0], this.gh * yPos[0] ,'x:', textStyle);
        this.add.text(this.gw * xPos[0], this.gh * (yPos[0] + 2 * ySpace) ,'y:', textStyle);

        // values
        this.xCoordText = this.add.text(this.gw * xPos[1], this.gh * yPos[0], this.xFirst, textStyle);    // x
        this.xCoordText.setOrigin(1, 0);        // right aligned
        this.yCoordText = this.add.text(this.gw * xPos[1], this.gh * (yPos[0] + 2 * ySpace), this.yFirst, textStyle); // y
        this.yCoordText.setOrigin(1, 0);        // right aligned

        // stats (hits, hit rate and time)
        // --------------------------------

        textStyle.fontSize = '23px';        // text style (same as coordinates, but smaller)

        // names
        this.add.text(this.gw * xPos[0], this.gh * yPos[1] ,'Hits:', textStyle);
        this.add.text(this.gw * xPos[0], this.gh * (yPos[1] + ySpace) ,'Hit Rate:', textStyle);
        this.add.text(this.gw * xPos[0], this.gh * (yPos[1] + 2 * ySpace) ,'Time:', textStyle);

        // values
        this.hitText = this.add.text(this.gw * xPos[2], this.gh * yPos[1] ,'0', textStyle);  // hits
        this.hitText.setOrigin(1, 0);       // right aligned
        this.hitRateText = this.add.text(this.gw * xPos[2], this.gh * (yPos[1] + ySpace) ,'- %', textStyle); // hit rate
        this.hitRateText.setOrigin(1, 0);   // right aligned
        this.timeText = this.add.text(this.gw * xPos[2], this.gh * (yPos[1] + 2 * ySpace) ,'00:00', textStyle);  // time
        this.timeText.setOrigin(1, 0);  // right aligned

    }

    // calculate and change hit rate
    hitRateCalc() {
        this.hitRate = this.target.counter / (this.target.counter + this.misses) * 100;
        this.hitRateText.setText(this.hitRate.toFixed(0) + ' %');
    }

    // convert time in ms to string in mm:ss format
    convertTime(time) {

        let mm = Math.floor(time / 1000 / 60);  // minutes part of the time
        let ss = time / 1000 - mm * 60;             // seconds part of the time

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

        return mmDisplay + ':' + ssDisplay;

    }

}