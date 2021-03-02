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

    // shoot
    shoot() {

        if (this.ready && this.ammo > 0) {

            //this.ammo--;                    // remove one shot from the magazine  TODO: Add again as soon as ammo is implemented
            this.ready = false;             // change the state to false

            this.scene.time.addEvent({
                delay: this.shootSpeed,
                callback: function() {
                    this.ready = true;
                },
                callbackScope: this
            });

            return true;

        }
        else {
            return false;
        }


    }

    // reload
    reload() {


    }


}