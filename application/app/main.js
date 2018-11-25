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
import Vuex from 'vuex'
Vue.use(Vuex);

const store = new Vuex.Store({
    state: {
        firstname: "bitch",
        lastname: "aurevoir"
    },
    mutations: {
    }
});

Vue.prototype.$store = store

new Vue({
  render: h => h('frame', [h(Authentication)])
}).$start()
