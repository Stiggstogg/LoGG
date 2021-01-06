// "Home" scene: Shows the home screen of the game
let homeScene = new Phaser.Scene('Home');

// Shows the home screen and waits for the the user to start the game
homeScene.create = function () {

    // get game width and height
    let gw = this.sys.game.config.width;
    let gh = this.sys.game.config.height;

    // create background zone
    this.bgZone = this.add.zone(0, 0, gw, gh);

    // set properties
    this.bgZone.setOrigin(0, 0);

    // set interactivity and start game scene when clicked
    this.bgZone.setInteractive();
    this.bgZone.on('pointerdown', function (pointer) {

        console.log('hey');

        this.scene.start('Game');

    }, this);


    // show home screen text
    let text = this.add.text(gw / 2, gh / 2, 'Lights out Gun Game', {
            font: '40px Arial',
            fill: '#27ff00'
        }
    );
    text.setOrigin(0.5, 0.5);

};
