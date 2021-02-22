// "How To Play" scene: This is the main scene of the game

export default class howtoScene extends Phaser.Scene {

    constructor() {
        super({
            key: 'HowTo'
        });
    }

    // initiate scene parameters
    init() {

        // get game width and height
        this.gw = this.sys.game.config.width;
        this.gh = this.sys.game.config.height;

    }

    // create objects (executed once after preload())
    create() {

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



    }
}