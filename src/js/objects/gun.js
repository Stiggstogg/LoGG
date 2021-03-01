// Gun class (manages the shooting e.g. shooting speed and ammo)

export default class Gun {

    constructor(scene, shootSpeed, reloadSpeed, capacity) {

        this.shootSpeed = shootSpeed;       // time between shots
        this.reloadSpeed = reloadSpeed;     // reloading time
        this.capacity = capacity;           // capacity (maximum number of ammo)

        this.ammo = capacity;               // current ammo

        this.ready = true;                  // if this is true an action can be triggered (shooting or reloading)

        this.scene = scene;                 // scene

    }

    // shoot    // TODO: Continue here!
    shoot() {

        if (this.ready && this.ammo > 0) {

            console.log('shoot')

            this.ammo--;                    // remove one shot from the magazine
            this.ready = false;             // change the state to false

            this.scene.time.addEvent({
                delay: 5000,
                callback: function() {
                    console.log('ready');
                    this.ready = true;
                },
                callbackScope: this
            });

        }


    }

    // reload
    reload() {


    }


}