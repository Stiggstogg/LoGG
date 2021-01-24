// "Boot" scene: First scene, which is used to load basic (and small) assets for the "Loading" scene
export default class bootScene extends Phaser.Scene {

    constructor() {
        super({
            key: 'Boot'
        });
    }

    // load basic asset for "Loading" scene (e.g. logo), this asset should be small
    preload() {

        // load logo
        this.load.image('logo', 'assets/images/logo.png');

    }

    // change to "Loading" scene
    create() {

        this.scene.start('Loading');

    }

}