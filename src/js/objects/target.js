// Target class (Rectangle)

export default class Target extends Phaser.GameObjects.Rectangle {

    constructor(scene, x, y, width, height, fillColor) {

        super(scene, 0, 0, width, height, fillColor);

        // set starting coordinates
        this.x = this.coordGameToCanvas(x, 'x');
        this.y = this.coordGameToCanvas(y, 'y');

        // target counter (how many targets have been shot)
        this.counter = 0;

        // set properties
        this.setAlpha(1);          // set alpha to zero to make it invisible TODO: Change back to 0 as soon as Phaser Issue #5507 is fixed (https://github.com/photonstorm/phaser/issues/5507)

        // set interactivity
        this.setInteractive();
        this.input.alwaysEnabled = true;     // needs to be true otherwise the pointerdown event will not fire if alpha is set to 0

        // add events
        this.on('pointerdown', function () { this.hit() });

    }

    // target was hit
    hit() {

        // add hit to counter
        this.counter++;

        // actions on scene
        this.scene.hitTarget(this.counter);

    }

    // create a new target
    newTarget() {

        // calculate target size
        let targetSizeGameX = this.width / (this.scene.gw * this.scene.vertLinePos - 1.5 * this.scene.lineWidth) * 100;
        let targetSizeGameY = this.height / (this.scene.gh * (1 - this.scene.horLinePos) - 1.5 * this.scene.lineWidth) * 100;

        // calculate new random position (in game coordinates)
        this.targetX = Phaser.Math.Between(targetSizeGameX / 2, 100 - targetSizeGameX / 2);
        this.targetY = Phaser.Math.Between(targetSizeGameY / 2, 100 - targetSizeGameY / 2);

        // set new position of the target (in canvas coordinates)
        this.setPosition(this.coordGameToCanvas(this.targetX,'x'), this.coordGameToCanvas(this.targetY, 'y'));

        // write new coordinates to text
        this.scene.xCoordText.setText(this.targetX);
        this.scene.yCoordText.setText(this.targetY);

    }

    // calculates from game coordinates (area on which can be shot) to the real coordinates in the canvas
    coordGameToCanvas(gameCoord, dim) {
        if (dim === 'x') {
            return this.scene.lineWidth + gameCoord / 100 * (this.scene.gw * this.scene.vertLinePos - 1.5 * this.scene.lineWidth);
        }
        else if (dim === 'y') {
            return this.scene.gh * this.scene.horLinePos + this.scene.lineWidth * 0.5 + (100 - gameCoord) / 100 * (this.scene.gh * (1 - this.scene.horLinePos) - 1.5 * this.scene.lineWidth);
        }
    }

}