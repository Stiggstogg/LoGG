// Impact class (Ellipse)

export default class Impact extends Phaser.GameObjects.Ellipse {

    constructor(scene, x, y, radius, fillColorMiss, fillColorHit, flashSpeed) {

        super(scene, x, y, radius, radius, fillColorMiss, 0);

        this.setDepth(1);   // make sure the impact is always in front

        this.colorMiss = fillColorMiss;
        this.colorHit = fillColorHit;

        this.addTween(scene, flashSpeed);

    }

    // show where the shot hit
    show(x, y, hit) {

        // if it is a hit it is black, else it is green
        if (hit) {
            this.setFillStyle(this.colorHit, 0);
        }
        else {
            this.setFillStyle(this.colorMiss, 0);
        }

        this.setPosition(x, y);     // move to the position
        this.flashTween.play();     // flash the impact object

    }

    // add flash tween
    addTween(scene, flashSpeed) {

        // flash tween to show where the shot was placed
        this.flashTween = scene.tweens.add({
            targets: this,
            fillAlpha: 1,
            duration: flashSpeed,
            paused: true,       // pause to be able to control the tween
            yoyo: true,          // tween will go back to beginning state
            ease: 'Quad.easeInQuad'  // easing function for smoother transition
        });

    }

}