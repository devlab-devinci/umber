import Vue from 'nativescript-vue'
import VueDevtools from 'nativescript-vue-devtools'
import Authentication from './components/Authentication'

import { configureOAuthProviders } from "./components/services/Auth";

configureOAuthProviders();

if(TNS_ENV !== 'production') {
  Vue.use(VueDevtools)
}
// Prints Vue logs when --env.production is *NOT* set while building
Vue.config.silent = (TNS_ENV === 'production');

/**
 * Vuex STORE declared
 */
import FbConfig from './components/services/FbConfig';
import Vuex from 'vuex';
import * as http from "http";

Vue.use(Vuex);
// -> https://blog.ippon.fr/2017/05/29/vue-js-2-0-petit-tutoriel-volume-4/

const state = {
  access_token: "",
  fbUser: {}, // infos from FB via access_token
}

const getters = {
  getAccessToken : state => {
    return state.access_token
  },
  getFbUser: state => {
    return state.fbUser
  }
};


//mutation call to update the current state
const mutations = {
    /**
     * Set access_token (OAuth2 FB valid token required)
     * @param {*} state 
     * @param {*} accessToken 
     */
    setAccessToken(state, accessToken){
      state.access_token = accessToken
    },

    setFbUser(state, fbUserData){
      state.fbUser = fbUserData
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
     */
    findFbUser(state, accessToken){
      return new Promise((resolve, reject) => {
        let graphApiURL = FbConfig.graph_api_url; // graph url from conf (default version used TLS)
        let self = this  
      // step 1
      http
      .getJSON(`${graphApiURL}me?access_token=${accessToken}`)
      .then(function(data){ //data -> json object => name (FB name) / id (fb use for query graph later)
          //step 2 
          let fbUser_id = data.id; // to get listen of fields available -> https://developers.facebook.com/tools/explorer then choose your app send a request and click on nodes (list will appear)
          http
          .getJSON(`${graphApiURL}me?access_token=${accessToken}&fields=id,name,picture,email`)
          .then(function(fbUserData){
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
