// Miss class (Ellipse)

export default class Miss extends Phaser.GameObjects.Ellipse {

    constructor(scene, x, y, radius, fillColor) {

        super(scene, x, y, radius, radius, fillColor, 0);

        this.addTween(scene);

    }

    // show where the shot hit
    show(x, y) {

        this.setPosition(x, y);     // move to the position
        this.flashTween.play();     // flash the miss object

    }

    // add flash tween
    addTween(scene) {

        // flash tween to show where the shot was placed
        this.flashTween = scene.tweens.add({
            targets: this,
            fillAlpha: 1,
            duration: 50,
            paused: true,       // pause to be able to control the tween
            yoyo: true,          // tween will go back to beginning state
            ease: 'Quad.easeInQuad'  // easing function for smoother transition
        });

    }

}