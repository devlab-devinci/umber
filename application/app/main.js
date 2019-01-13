/**
 * Vuex Store / Entry point of Application / loading Library etc ...
 *
 * PLEASE READ . . .
 *
 * This file contains the store (vuex)
 * To interact with the state in every screens of this application
 *      ***************************************************
 *  ******* INTERACT WITH STATE ONLY VIA THIS VUEX STORE ! *******
 *      ***************************************************
 */


import Vue from 'nativescript-vue'
import VueDevtools from 'nativescript-vue-devtools'

// import Authentication from './components/Authentication'
import Products from './components/Products'

import {configureOAuthProviders} from "./components/services/Auth";

configureOAuthProviders();

if (TNS_ENV !== 'production') {
    // Vue.use(VueDevtools)
    Vue.use(VueDevtools, { host: '192.168.0.20' })
}
// Prints Vue logs when --env.production is *NOT* set while building
Vue.config.silent = (TNS_ENV === 'production');
Vue.registerElement('CardView', () => require('nativescript-cardview').CardView);

import {TNSFontIcon, fonticon} from 'nativescript-fonticon';
TNSFontIcon.debug = true;
TNSFontIcon.paths = {
    'fa': './assets/font-awesome.css'
};
TNSFontIcon.loadCss();
Vue.filter('fonticon', fonticon);


/**
 * Vuex STORE declared
 */
import FbConfig from './components/services/FbConfig';
import Vuex from 'vuex';
import * as http from "http";

Vue.use(Vuex);
// -> https://blog.ippon.fr/2017/05/29/vue-js-2-0-petit-tutoriel-volume-4/

const state = {
    /**
     * AUTH
     * ____________
     * contains :
     *
     * access_token
     * fbUser (contains fb fields called from actions via fb api graph)
     */
    access_token: "",
    fbUser: {}, // infos from FB via access_token,

    /**
     * LOCATION
     * ____________
     * contains :
     *
     * current_location (lt / ld / timestamp only)
     * current_location_infos ( infos from the current_location given -> https://nominatim.openstreetmap.org/reverse?format=json&lon=-122.406417&lat=37.785834 )
     */
    current_location:{},
    current_location_infos: {}
}

const getters = {

    /**
     * Provide the current access token from facebook (USE IT FOR FB GRAPH API !!!)
     * @param state
     * @returns {string|*}
     */
    getAccessToken: state => {
        return state.access_token
    },

    /**
     * Get user logged in via Facebook (data fields are related to the API call made via fb api graph) to understand, please check in action the method : findFbUser
     * @param state
     * @returns {state.fbUser|{}|*}
     */
    getFbUser: state => {
        return state.fbUser
    },

    /**
     * Return current location (lt / ld / timestamp only)
     * @param state
     * @returns {state.current_location|{}|*}
     */
    getCurrentLocation: state => {
        return state.current_location;
    },

    /**
     * Return current location infos (details like city name / address / country etc -> please check the following example to know more about it
     * https://nominatim.openstreetmap.org/reverse?format=json&lon=-122.406417&lat=37.785834)
     * @param state
     * @returns {state.current_location_infos|{}}
     */
    getCurrentLocationInfos: state => {
        return state.current_location_infos;
    }
};


//mutation call to update the current state
const mutations = {

    //Auth
    /**
     * Set access_token (OAuth2 FB valid token required)
     * @param {*} state
     * @param {*} accessToken
     */
    setAccessToken(state, accessToken) {
        state.access_token = accessToken;
    },

    /**
     * Set user data from his facebook account he logged in
     * @param state
     * @param fbUserData
     */
    setFbUser(state, fbUserData) {
        state.fbUser = fbUserData;
    },

    /**
     * Set Location from device (lg / lt / timestamp)
     * @param state
     * @param currentLocation
     */
    setCurrentLocation(state, currentLocation) {
        state.current_location = currentLocation;
    },

    /**
     * Set Location details from device via current location data from the device like lt, ld , timestamp
     * @param state
     * @param currentLocationInfos
     */
    setCurrentLocationInfos(state, currentLocationInfos){
        state.current_location_infos = currentLocationInfos;
    }

};


//call to perform action (dont hesitate to using promise)
const actions = {
    /**
     * 2 STEPS :
     * - 1 -> We request fb with access token to get user id (we also received fb name of user via this token but useless)
     * - 2 -> We request fb to get all infos via this id
     * @param {*} state
     *
     * @param accessToken (fb)
     */
    findFbUser(state, accessToken) {
        return new Promise((resolve, reject) => {
            let graphApiURL = FbConfig.graph_api_url; // graph url from conf (default version used TLS)
            let self = this;
            // step 1
            http
                .getJSON(`${graphApiURL}me?access_token=${accessToken}`)
                .then(function (data) { //data -> json object => name (FB name) / id (fb use for query graph later)
                    //step 2
                    let fbUser_id = data.id; // to get listen of fields available -> https://developers.facebook.com/tools/explorer then choose your app send a request and click on nodes (list will appear)
                    http
                        .getJSON(`${graphApiURL}me?access_token=${accessToken}&fields=id,name,picture,email`)
                        .then(function (fbUserData) {
                            resolve(fbUserData)
                        })
                        .catch(err => reject(err))
                })
                .catch(err => reject(err))
        })

    }
}

const store = new Vuex.Store({
    state: state,
    getters: getters,
    mutations: mutations,
    actions: actions
});


// END STORE
Vue.prototype.$store = store

new Vue({
    // render: h => h('frame', [h(Authentication)])
    render: h => h('frame', [h(Products)])
}).$start()
