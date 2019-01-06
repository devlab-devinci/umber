'use strict';


import * as geolocation from "nativescript-geolocation";
import {Accuracy} from "tns-core-modules/ui/enums"; // used to describe at what accuracy the location should be get
// for help https://github.com/NativeScript/nativescript-geolocation
import axios from 'axios';

class Geolocation {

    constructor() {
    }

    /**
     *
     * @returns {Promise<void>}
     */

    enablePermission() {
        console.log("ENABLED permission is called ")
        return geolocation.enableLocationRequest();
    }

    //TODO -> on click GPS (dans Action bar)
    //If not enable on demande l'user de l'enable et on set les valeur
    //SINON
    //DEJA enable on refresh juste les valeur dans le store de la location de l'user
    setLocationCheck() {
        let self = this;
        console.log("SET LOCATION IS CALLED ")
        geolocation.isEnabled().then(enabled => {
            if (!enabled) {
                //todo -> ask user to enable the geo location and set value lat + lg into the store
                console.log("NOT ENABLED")
                geolocation.enableLocationRequest().then(() => geolocation.enableLocationRequest());
            } else {
                //todo -> refresh location via store
                console.log("larteady enabled")
            }
        });
    }


    /**
     * Return current location of the device / Accuracy.high = 100m
     * @param timeout
     * @returns {Promise<any>}
     */
    getCurrentLocation(timeout) {
        return new Promise((resolve, reject) => {
            geolocation.enableLocationRequest().then(() => { //test if user allowed the app to access device's GPS
                geolocation.getCurrentLocation({desiredAccuracy: Accuracy.high, timeout: timeout}).then(location => {
                    resolve(location);
                }).catch(error => {
                    reject(error);
                });
            });
        });
    }

    getCurrentLocationInfos(longitude, latitude) {
        return new Promise((resolve, reject) => {
            axios
                .get(`https://nominatim.openstreetmap.org/reverse?format=json&lon=${longitude}&lat=${latitude}`)
                .then((response) => {
                    resolve(response.data);
                })
                .catch((err => {
                    reject(err)
                }));
        })
    }
}


let GeolocationService = new Geolocation();
export default GeolocationService;