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
import Vue2Filters from 'vue2-filters'
import VueDevtools from 'nativescript-vue-devtools'
import axios from 'axios';
import Router from './components/services/Router'
import apiConfig from './config/api_config'
import Authentication from './components/Authentication'


import {configureOAuthProviders} from "./components/services/Auth";

configureOAuthProviders();

apiConfig.url = `${apiConfig.protocol}://${apiConfig.hostname}:${apiConfig.port}`;

if (TNS_ENV !== 'production') {
    Vue.use(VueDevtools, {host: apiConfig.vuedevtools});
    apiConfig.url = `${apiConfig.protocol}://${apiConfig.vuedevtools}:${apiConfig.port}`;
}
Vue.use(Vue2Filters);

// Prints Vue logs when --env.production is *NOT* set while building
Vue.config.silent = (TNS_ENV === 'production');
Vue.registerElement('CardView', () => require('nativescript-cardview').CardView);
Vue.registerElement(
    'PullToRefresh',
    () => require('nativescript-pulltorefresh').PullToRefresh
);

import {TNSFontIcon, fonticon} from 'nativescript-fonticon';

TNSFontIcon.debug = true;
TNSFontIcon.paths = {
    'fa': './assets/font-awesome.css'
};
TNSFontIcon.loadCss();
Vue.filter('fonticon', fonticon);


Vue.prototype.$router = Router;

Vue.prototype.$config = apiConfig;

Vue.prototype.$http = {
    request: resource => axios.request(resource),
    get: (resource, params) => axios.get(apiConfig.url + '/' + resource, params),
    delete: resource => axios.put(apiConfig.url + '/' + resource),
    head: resource => axios.head(apiConfig.url + '/' + resource),
    // options: axios.options(apiConfig.url + '/' + resource),
    path: (resource, data) => axios.patch(apiConfig.url + '/' + resource, data),
    post: (resource, data, config) => axios.post(apiConfig.url + '/' + resource, data, config),
    put: (resource, data, config) => axios.put(apiConfig.url + '/' + resource, data, config)
};


/**
 * Vuex STORE declared
 */
import FbConfig from './components/services/FbConfig';
import Vuex from 'vuex';
import * as http from "http";
import Test from "./components/Test";

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

    current_location: {},
    current_location_infos: {},

    /**
     * User Status (customer // vendor)
     * ____________
     */
    user_status: "",

    currentCart: null,

    currentUser: {} // set from after fb login when user is svaed in mongodb (usfull to get _id)

    // currentUser: {role: "user", userTypes: "buyer", _id:"5c43b9e2a904e53e21dfebe5", fullname: "buyer2", picture :"http://placekitten.com/200/300",email:"buyer2@user.fr", updatedAt:"2019-01-19T23:59:30.011Z", __v:0},
    //TODO dont use it
    /*
    currentUser: {
        role: "user",
        userTypes: "seller",
        _id: "5c43b9e2a904e53e21dfebe0",
        companyName: "companyName0",
        fullname: "seller0",
        picture: "http://placekitten.com/200/300",
        email: "seller0@user.fr",
        updatedAt: "2019-01-19T23:59:30.011Z",
        "__v": 0
    }
    */

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
    },

    getCurrentUser: state => {
        return state.currentUser;
    },

    /**
     * Return user status (customer OR vendor ?)
     * @param state
     * @returns {string}
     */
    getUserStatus: state => {
        return state.user_status;
    },

    getCurrentCart: state => {
        return state.currentCart;
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
    setCurrentLocationInfos(state, currentLocationInfos) {
        state.current_location_infos = currentLocationInfos;
    },

    /**
     * Set status for user (customer // vendor)
     * @param state
     * @param userStatus
     */
    setUserStatus(state, userStatus) {
        console.log("USER TO SET du store", userStatus)
        state.user_status = userStatus;
    },

    setProductCart(state, payload) {
        console.log("SET PRODUCT CART IS CALLED");
        if (!state.currentCart) {
            state.currentCart = []
        }

        let quantity = parseInt(payload.quantity);
        let product = payload.product;
        let existingQuantity = payload.existingQuantity;
        let realQuantity = quantity+ existingQuantity;

        console.log("user added", quantity)
        console.log("but ecisting", existingQuantity);
        console.log("donc il en a", quantity+ existingQuantity)
        while (realQuantity > existingQuantity) {
            state.currentCart.push(product);
            realQuantity -= 1
        }

        console.log("CURRENT CART",state.currentCart.length)

    },

    removeProductCart(state, {productIndex}) {
        state.currentCart.splice(productIndex, 1);
        return state.currentCart
    },

    setCurrentUser(state, currentUser) {
        state.currentUser = currentUser
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
    render: h => h('frame', [h(Authentication)])
}).$start()
