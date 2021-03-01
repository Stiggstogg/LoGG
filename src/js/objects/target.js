// Target class (Rectangle)

export default class Target extends Phaser.GameObjects.Rectangle {

    constructor(scene, xGame, yGame, width, height, fillColor, area) {

        super(scene, 0, 0, width, height, fillColor);

        // get the game area (origin and size)
        this.gameArea = area;

        // calculate the target size in game coordinates (%)
        this.widthGame = this.width / this.gameArea.width * 100;
        this.heightGame = this.height / this.gameArea.height * 100;

        // set starting coordinates
        this.xGame = xGame;
        this.yGame = yGame;
        this.placeNewTarget();

        // target counter (how many targets have been shot)
        this.counter = 0;

        // set properties
        this.setAlpha(0.1);          // set alpha to zero to make it invisible TODO: Change back to 0 as soon as Phaser Issue #5507 is fixed (https://github.com/photonstorm/phaser/issues/5507)

        // set interactivity
        this.setInteractive();
        this.input.alwaysEnabled = true;     // needs to be true otherwise the pointerdown event will not fire if alpha is set to 0
        this.on('pointerdown', function () { this.hit(this.scene) });   // add events (event when clicked)

        // set tween
        this.addTween(scene);

    }

    // target was hit
    hit(scene) {

        // add hit to counter
        this.counter++;

        // flash target
        this.flashTween.play();

        // actions on scene
        scene.hitTarget(this.counter);

    }

    // calculate new random coordinates for the target
    setNewTarget() {

        // calculate new random position (in game coordinates)
        this.xGame = Phaser.Math.Between(this.widthGame / 2, 100 - this.widthGame / 2);
        this.yGame = Phaser.Math.Between(this.heightGame / 2, 100 - this.heightGame / 2);

    }

    // place the new target
    placeNewTarget() {

        // set new position of the target (in canvas coordinates)
        this.setPosition(this.coordGameToCanvas(this.xGame,'x'), this.coordGameToCanvas(this.yGame, 'y'));

    }

    // add flash tween
    addTween(scene) {

        // flash tween of the target (when hit)
        this.flashTween = scene.tweens.add({
            targets: this,
            alpha: 1,
            duration: 50,
            paused: true,       // pause to be able to control the tween
            yoyo: true,          // tween will go back to beginning state
            ease: 'Quad.easeInQuad'  // easing function for smoother transition
        });

        // create a new target when the tween is completed
        this.flashTween.on('complete', function () {
            this.placeNewTarget()
        }, this);

    }

    // calculates from game coordinates (area on which can be shot) to the real coordinates in the canvas
    coordGameToCanvas(gameCoord, dim) {
        if (dim === 'x') {
            return this.gameArea.x + this.gameArea.width * gameCoord / 100;
        }
        else if (dim === 'y') {
            return this.gameArea.y + (100 - gameCoord)/100 * this.gameArea.height;
        }
    }

}