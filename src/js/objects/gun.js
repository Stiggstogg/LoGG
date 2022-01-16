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

            this.ammo--;                    // remove one shot from the magazine
            this.ready = false;             // change the state to false

            // make the gun ready again after some delay ()
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

    // set ammo indicator (string)
    getAmmoString() {

        let ammoString = '';

        // add used ammo
        for (let i = 0; i < this.capacity - this.ammo; i++) {
            ammoString += '.';
        }

        // add remaining ammo
        for (let i = this.ammo; i > 0 ; i--) {
            ammoString += 'I';
        }

        return ammoString;

    }

    // reload gun
    reload() {

        if (this.ready) {                               // only reload if the gun is ready

            this.ammo = this.capacity;                  // refill ammo
            this.ready = false;                         // change the state to false

            // make the gun ready again after some delay (reload speed)
            this.scene.time.addEvent({
                delay: this.reloadSpeed,
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

}