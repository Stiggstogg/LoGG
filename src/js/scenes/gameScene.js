// "Game" scene: This is the main scene of the game

// imports
import Background from '../objects/background.js'
import Target from '../objects/target.js'
import Impact from '../objects/impact.js'
import Gun from '../objects/gun.js'
import {borderColor, relBorderWidth} from "../Helper/globals";

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

        // text and line properties
        this.properties = {
            color1: 0x27ff00,       // color as hex number
            color2: '#27ff00',      // the same color as above as string
            color3: 0x000000,       // second color of the game
            font: 'Courier'         // font
        };

        // Gun properties
        this.shootSpeed = 500;      // time between shots in ms
        this.reloadSpeed = 1000;    // reloading speed in ms
        this.capacity = 5;          // gun capacity

        // tween properties
        this.flashDuration = 50;    // camera, impact and target flash speed in ms (attention: as yoyo is activated for impact and target the flash speed will be twice as long)

        // line properties
        const relLineWidth = 0.0047;                        // relative width of the lines (relative to game width); 0.0047 ~ 6 px
        this.lineWidth = this.gw * relLineWidth;            // width of the lines (in px)

        // Sinden Light Gun border
        this.borderWidth = Math.ceil(this.gh * relBorderWidth);    // width of the border for the Sinden Light Gun

        // title area (area where the title is written, top)
        const relTitleHeight = 0.2;                     // relative height of the title bar (relative to game height)
        this.titlePosDim = {                            // position and dimension of the title bar
            x: this.borderWidth,
            y: this.borderWidth,
            width: this.gw - 2 * this.borderWidth,
            height: this.gh * relTitleHeight
        };

        // title font size
        this.titleFontSize = 60;                        // title font size in px

        // status area (area where the status is written, bottom right)
        const relStatusWidth = 0.2;                     // relative width of the status bar (relative to game width)
        this.statusPosDim = {                           // position and dimension of the status bar
            x: this.gw * (1 - relStatusWidth) - this.borderWidth,
            y: this.titlePosDim.y + this.titlePosDim.height + this.lineWidth,
            width: this.gw * relStatusWidth,
            height: this.gh - this.titlePosDim.height - 2 * this.borderWidth- this.lineWidth
        };

        // shooting area (area where the targets are shot, bottom left)
        this.shootingPosDim = {                         // position and dimension of the shooting area
            x: this.titlePosDim.x,
            y: this.statusPosDim.y,
            width: this.titlePosDim.width - this.statusPosDim.width - this.lineWidth,
            height: this.statusPosDim.height
        };

        // target properties
        this.targetSize = 100;      // size of the target
        this.xFirst = 50;           // x coordinate of the first target
        this.yFirst = 50;           // y coordinate of the first target

        // impact marker properties
        this.impactSize = 20;

        // numbers for calculating the score
        this.finalPerformance = {
            hits: 0,                // hits
            hitRate: 0,             // hit rate
            time: 0                 // time
        }

    }

    // create objects (executed once after preload())
    create() {

        // setup of the game objects (non-interactive)
        this.addLines();                    // add lines
        this.addTextTitle();                // add title text in the title area
        this.addTextStats();                // add the stats text on the right pane

/*        // setup various objects
        this.impact = this.add.existing(new Impact(this, 0, 0, this.impactSize, this.properties.color1, this.properties.color3, this.flashDuration));     // impact object which shows the impact of the shots
        this.gun = new Gun(this, this.shootSpeed, this.reloadSpeed, this.capacity);                           // gun object which manages the gun

        // setup of interactive objects
        this.background = this.add.existing(new Background(this, 0, 0, this.gw, this.gh, this.gun));  // background (registers misses)
        this.target = this.add.existing(new Target(this, this.xFirst, this.yFirst, this.targetSize, this.targetSize,
            this.properties.color1, this.gameArea, this.gun, this.flashDuration)); // target to shoot on



        // Audio
        this.soundHit = this.sound.add('hit');
        this.soundMiss = this.sound.add('miss');

        // keyboard events
        this.keySpace = this.input.keyboard.addKey('Space');    // hide cursor
        this.keySpace.on('down', function () {

            if (this.cursorHide) {
                this.input.setDefaultCursor('default');
            } else {
                this.input.setDefaultCursor('none');
            }

            this.cursorHide = !this.cursorHide;

        }, this);*/

    }

    // update method
    update(time, delta) {

        // set timer
        let now = new Date();                               // current time
        let diff = now - this.startTime;                    // difference to start time in milli seconds
        /*if (this.target.counter > 0 && this.target.counter < this.titleText.length) {                      // change the time text if the first target was shot and stop when the last target was shot. The final time is added in finishGame()
            this.timeText.setText(this.convertTime(diff));  // convert time to string and set timer text
        }*/
    }

    // actions which happen on the scene when the target is hit
    hitTarget(pointer, hitCounter) {

        // if it is the first hit, start the timer
        if (hitCounter === 1) {
            this.startTime = new Date();    // set start time
        }

        // animations (tweens and sounds)
        this.flashCamera();                     // flash camera
        this.soundHit.play();                   // play sound
        this.impact.show(pointer.x, pointer.y, true);   // show where the shot was hit (show impact)

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
    missTarget(pointer) {

            // animations (tweens and sounds)
            this.flashCamera();                     // camera flash
            this.soundMiss.play();                  // miss sound
            this.impact.show(pointer.x, pointer.y, false);   // show where the shot was hit (show impact)

            // adapt texts
            this.hitRateCalc();
    }

    // final screen
    gameFinished() {

        // set final time and record scores
        let now = new Date();
        this.finalPerformance.time = (now - this.startTime) / 1000;     // calculate time needed (in s)
        this.finalPerformance.hits = this.target.counter;               // get the number of hits
        this.finalPerformance.hitRate = this.hitRateCalc();             // get the hit rate

        // update the time display with the final time
        this.timeText.setText(this.convertTime(this.finalPerformance.time * 1000));

        // destroy the interactive objects
        this.target.destroy();
        this.background.destroy();

        // start finishing scene (in parallel)
        this.scene.launch('Finish', {
            performance: this.finalPerformance,
            properties: this.properties,
            area: this.gameArea
        });

    }

    // flash camera (when shooting)
    flashCamera() {
        this.cameras.main.flash(this.flashDuration);
    }

    // Add lines to the screen (outer border and play area lines)
    addLines() {

        // vertical and horizontal lines for the game area
        const vertLine = this.add.line(0, 0, this.statusPosDim.x - this.lineWidth/2, this.statusPosDim.y, this.statusPosDim.x - this.lineWidth/2, this.statusPosDim.y + this.statusPosDim.height, this.properties.color1);
        const horLine = this.add.line(0, 0, this.titlePosDim.x, this.titlePosDim.y + this.titlePosDim.height + this.lineWidth/2,
            this.titlePosDim.x + this.titlePosDim.width, this.titlePosDim.y + this.titlePosDim.height + this.lineWidth/2, this.properties.color1);

        vertLine.setOrigin(0).setLineWidth(this.lineWidth/2);       // lineWidth needs to be halfed as the width is added to both sides
        horLine.setOrigin(0).setLineWidth(this.lineWidth/2);

        // Sinden Light Gun or neutral border
        const sindenBorder = this.add.rectangle(0, 0, this.gw, this.gh); // x, y, width, height
        sindenBorder.setOrigin(0).setStrokeStyle(this.borderWidth * 2, borderColor); // lineWidth needs to be doubled as half of the line will be outside

    }

    // Add title text
    addTextTitle() {

        // create title text array and style
        this.titleText = [];                        // title text array (array which contains the title characters as single text objects)
        const titleStyle = {fontFamily: this.properties.font, fontSize: this.titleFontSize + 'px', color: this.properties.color2, fontStyle: 'bold'};
        const titleLength = this.title.length;      // number of characters in the title (incl. spaces)

        // add all letters (as separate text objects) to the title text array
        for (let i = 0; i < titleLength; i++) {
            if (this.title[i] !== ' ') {                    // skip spaces
                this.titleText.push(                        // put all texts in an array so that they can be changed later (change background when target is hit)
                    this.add.text(0,0,                // position is wrong now, will be adapted later
                        this.title[i],
                        titleStyle));
            }
        }

        // calculate the x position of the letters (in the middle of the title area and evenly distributed)
        const letterWidth = this.titleText[0].width;                                // get width of a letter (full box)
        const spaceTitleText = this.titlePosDim.width * 0.9;                        // maximum space of the title text (5 % on each side should be empty)
        const spacePerLetter = spaceTitleText / titleLength;                        // maximum space per letter
        const letterSeparation = spacePerLetter - letterWidth;         // calculate the spacing between the letter boxes (letter boxes: space between the full size of a single letter text object)
        const titleWidth = spacePerLetter * titleLength - letterSeparation;         // calculate the full width of the title (the space of the last letter is subtracted to make the title appear in the middle)

        const titleStartPosX = this.titlePosDim.x + (this.titlePosDim.width - titleWidth) / 2;      // x start position of the title (in pixels)

        // calculate the y position of the letters (in the middle of the title area)
        const letterHeight = this.titleText[0].height;                               // get height of a letter (full box)
        const titlePosY = this.titlePosDim.y + (this.titlePosDim.height - letterHeight) / 2;      // y start position of the title (in pixels)

        // position all letters correctly (in the middle and evenly spaced)
        let j = 0;

        for (let i = 0; i < titleLength; i++) {
            if (this.title[i] !== ' ') {                // skip spaces
                this.titleText[j].setPosition(titleStartPosX + i * spacePerLetter, titlePosY);                     // put all texts in an array so that they can be changed later (change background when target is hit)
                j++;
            }
        }


    }

    // Add stats text (on the right pane)
    addTextStats() {

        // x and y position of the texts and vertical spaces (all relative to the width and height of the status area)
        const xPos = [0.10, 0.9, 0.9];        // x positions relative to status area width: 0: names / labels (left aligned), 1: coordinates (right aligned), 2: stats (right aligned)
        const yPos = [0.13, 0.5];               // y positions relative to status area height: 0: position of first coordinate (x), 1: position of first stat text (hits etc.)
        const ySpace = [0.1, 0.06];            // y spaces relative to status area height: 0: between the coordinates, 1: between the status texts (hits);

        // coordinates (x and y)
        // ---------------------

        const textStyle = {fontFamily: this.properties.font, fontSize: '50px', color: this.properties.color2};    // text style

        // names
        const xLabel = this.add.text(this.statusPosDim.x + this.statusPosDim.width * xPos[0], this.statusPosDim.y + this.statusPosDim.height * yPos[0],'x:', textStyle);
        const yLabel = this.add.text(this.statusPosDim.x + this.statusPosDim.width * xPos[0], this.statusPosDim.y + this.statusPosDim.height * (yPos[0] + ySpace[0]) ,'y:', textStyle);

        // values
        this.xCoordText = this.add.text(this.statusPosDim.x + this.statusPosDim.width * xPos[1], xLabel.y, this.xFirst, textStyle);    // x
        this.xCoordText.setOrigin(1, 0);        // right aligned
        this.yCoordText = this.add.text(this.xCoordText.x, yLabel.y, this.yFirst, textStyle); // y
        this.yCoordText.setOrigin(1, 0);        // right aligned

        // stats (hits, hit rate and time)
        // --------------------------------

        textStyle.fontSize = '23px';        // text style (same as coordinates, but smaller)

        // names
        const hitsLabel = this.add.text(xLabel.x, this.statusPosDim.y + this.statusPosDim.height * yPos[1],'Hits:', textStyle);
        const rateLabel = this.add.text(xLabel.x, this.statusPosDim.y + this.statusPosDim.height * (yPos[1] + ySpace[1]) ,'Hit Rate:', textStyle);
        const timeLabel = this.add.text(xLabel.x, this.statusPosDim.y + this.statusPosDim.height * (yPos[1] + 2 * ySpace[1]) ,'Time:', textStyle);

        // values
        this.hitText = this.add.text(this.statusPosDim.x + this.statusPosDim.width * xPos[2], hitsLabel.y ,'0', textStyle);  // hits
        this.hitText.setOrigin(1, 0);       // right aligned
        this.hitRateText = this.add.text(this.hitText.x, rateLabel.y ,'- %', textStyle); // hit rate
        this.hitRateText.setOrigin(1, 0);   // right aligned
        this.timeText = this.add.text(this.hitText.x, timeLabel.y ,'00:00', textStyle);  // time
        this.timeText.setOrigin(1, 0);  // right aligned

    }

    // Add gun elements (Ammo, Reload, busy indicator)
    addGunElements() {

        // gun busy indicator TODO: Continue here


    }

    // calculate and change hit rate
    hitRateCalc() {

        if (this.target.counter > 0) {      // only change the hit rate text when the game started (after the first target was hit)
            let hitRate = this.target.counter / (this.target.counter + this.background.counter) * 100;        // calculate new hit rate
            this.hitRateText.setText(hitRate.toFixed(0) + ' %');                               // set the hit rate text
            return hitRate
        }
        else {
            return 0;
        }

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