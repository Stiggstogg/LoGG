// Background class (which registers missed hits)

export default class Background extends Phaser.GameObjects.Zone {

    constructor(scene, x, y, width, height) {

        super(scene, x, y, width, height);

        // properties
        this.setOrigin(0, 0);   // set origin to top left

        // background counter (how many misses)
        this.counter = 0;

        // set interactivity
       this.setInteractive();

        // add events (event when clicked)
        this.on('pointerdown', function () { this.miss(this.scene) });


    }

    // miss was registered
    miss(scene) {

        // add miss to counter (only if the first target was already hit)
        if (scene.target.counter > 0) {
            this.counter++;
        }

        // actions on scene
        scene.missTarget();

    }

}