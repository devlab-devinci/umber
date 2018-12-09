'use strict';


import * as geolocation from "nativescript-geolocation";
import { Accuracy } from "tns-core-modules/ui/enums"; // used to describe at what accuracy the location should be get
// for help https://github.com/NativeScript/nativescript-geolocation

class Geolocation {

    constructor() {
    }

    /**
     *
     * @returns {Promise<void>}
     */

    enablePermission(){
        return geolocation.enableLocationRequest();
    }


    /**
     * Return current location of the device / Accuracy.high = 100m
     * @param timeout
     * @returns {Promise<any>}
     */
    getCurrentLocation(timeout) {
        return new Promise((resolve, reject) => {
            geolocation.enableLocationRequest().then(() => { //test if user allowed the app to access device's GPS
                geolocation.getCurrentLocation({desiredAccuracy:Accuracy.high, timeout: timeout}).then(location => {
                    resolve(location);
                }).catch(error => {
                    reject(error);
                });
            });
        });
    }

}



let GeolocationService = new Geolocation();
export default GeolocationService;