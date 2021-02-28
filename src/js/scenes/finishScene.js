// "Finish" scene: This is the final scene of the game which shows the scores

// imports

export default class finishScene extends Phaser.Scene {

    constructor() {
        super({
            key: 'Finish'
        });
    }

    // initiate scene parameters
    init(data) {

        // score calculation values
        this.scrTime = {a: -430.11, b: 51612.90};
        this.scrRt = {a: 500, b: 0};

        // final text position (relative to game area)
        this.positionText = {x: 50, y: 95};
        this.gameArea = data.area;
        this.properties = data.properties;
        this.performance = data.performance;

    }

    // create objects (executed once after preload())
    create() {

        // get score
        let scr = this.scrCalc(this.performance.time, this.performance.hitRate);

        // display text and score
        let finalText = this.add.text(this.gameArea.x + this.positionText.x / 100 * this.gameArea.width,
            this.gameArea.y + (100 - this.positionText.y) / 100 * this.gameArea.height,
            'The game is finished!\n\nYour score is: ' + scr + '\n\n\n\nShoot to go back to the main menu!',
            {fontFamily: this.properties.font, fontSize: '30px', color: this.properties.color2, align: 'center'});
        finalText.setWordWrapWidth(this.gameArea.width);
        finalText.setOrigin(0.5, 0);

        // move to home screen when clicked
        this.input.on('pointerdown', function() {
            this.scene.stop('Game');    // stop game scene
            this.scene.start('Home');   // start home scene
            }, this);


        // this.score.toFixed(0)
    }

    // calculate scores
    scrCalc(t, rt) {
        let scr = t * this.scrTime.a + this.scrTime.b + rt * this.scrRt.a + this.scrRt.b;

        if (scr < 0) {
            scr = 0;
        }

        return scr.toFixed(0);

    }


}