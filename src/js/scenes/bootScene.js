// "Boot" scene: First scene, which is used to load basic (and small) assets for the "Loading" scene
let bootScene = new Phaser.Scene('Boot');

// load basic asset for "Loading" scene (e.g. logo), this asset should be small
bootScene.preload = function () {

    // load logo
    this.load.image('logo', 'assets/images/logo.png');


};

// change to "Loading" scene
bootScene.create = function () {

    this.scene.start('Loading');

};

// export scene
export default bootScene;
