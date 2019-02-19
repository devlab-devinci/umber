<template>
    <Page>

        <ActionBar title="Commerces">
            <ActionItem @tap="choiceLocationMenu"
                        ios.systemIcon="3" ios.position="left"
                        android.systemIcon="ic_menu_share" android.position="actionBar"/>
        </ActionBar>


        <TabView selectedIndex="0" iosIconRenderingMode="alwaysOriginal">
            <TabViewItem title="Commerces">
                <Store></Store>
            </TabViewItem>
            <TabViewItem title="Recherche">
                <StackLayout>
                    <SearchBar hint="Localisation ..." text="" textFieldBackgroundColor="#b2bec3"
                               v-model="searchByLocationValue"
                               @textChange="onTextChanged" @submit="searchByLocation"/>
                </StackLayout>
            </TabViewItem>
            <TabViewItem title="Reçues">
                <Label text="reçues"></Label>
            </TabViewItem>
            <TabViewItem title="Compte" iconSource="">
                <StackLayout>
                    <card-view margin="10" elevation="100" radius="1" ripple="true" shadowRadius="10"
                               shadowColor="#000000"
                               background="#fffff4">
                        <stack-layout padding="5" class="m-l-5 m-t-5">
                            <Label horizontalAlignment="left" class="m-t-3 h4" id="welcomText" :text="welcomMessage"
                                   textWrap="true"/>
                            <Image id="profile-pic" horizontalAlignment="center" class="text-justify"
                                   :src="this.$store.getters.getFbUser.picture.data.url"
                                   stretch="aspectFit"/>
                            <Label textWrap="true" class="mt-4">
                                <FormattedString>
                                    <Span class="fa" style="color: #78e08f;" :text="'fa-map-marker' | fonticon"></Span>
                                    <Span text=" Poisition"/>
                                </FormattedString>
                            </Label>
                            <Label textWrap="true">
                                <FormattedString>
                                    <Span class="body"
                                          :text="this.$store.getters.getCurrentLocationInfos.display_name"/>
                                </FormattedString>
                            </Label>

                            <StackLayout class="hr-light m-10"></StackLayout>

                            <Label textWrap="true">
                                <FormattedString>
                                    <Span style="color: #78e08f;" class="fa" :text="'fa-envelope' | fonticon"></Span>
                                    <Span text=" Contact"/>
                                </FormattedString>
                            </Label>
                            <Label textWrap="true">
                                <FormattedString>
                                    <Span class="body" :text="this.$store.getters.getFbUser.email"/>
                                </FormattedString>
                            </Label>
                        </stack-layout>
                    </card-view>
                </StackLayout>
            </TabViewItem>
        </TabView>


        <!-- columns = " width col1, width col2, width col3 ...." -->
        <!-- row = "height row1, height row2 ..." -->

        <!--
        <GridLayout class="p-15" columns="auto, auto, auto, 10" rows="auto, auto, auto" width="auto" height="auto"
                    backgroundColor="#2ABB9B">
            <Button row="0" col="0" class="btn btn-md btn-primary btn-rounded-md" @tap="imVendor">Commercant
            </Button>
            <Button row="0" col="1" class="btn btn-md btn-primary btn-rounded-md" @tap="imCustomer">Consomateur
            </Button>

        </GridLayout>
        -->


    </Page>
</template>
<script>

    import {LoadingIndicator} from "nativescript-loading-indicator";

    const loaderOptions = require('./services/LoaderConfig').getOptions();
    const loader = new LoadingIndicator();

    const geolib = require('geolib');
    import axios from 'axios';
    import {api_config} from '../api_config';

    import Store from './Store';
    import {Feedback, FeedbackType} from "nativescript-feedback";
    import {Color} from "tns-core-modules/color";

    import GeolocationService from "./services/Geolocation";


    import Router from "./services/Router";
    import {action} from "tns-core-modules/ui/dialogs";

    const dialogs = require('tns-core-modules/ui/dialogs');


    export default {
        name: "CustomerHome",
//callback lifecyclme (vuejs)
        beforeCreate() {
            let feedback = new Feedback();
            feedback
                .success({
                    title: "Connectez avec succès",
                    titleColor: new Color("#222222"),
                    type: FeedbackType.Custom, // this is the default type, by the way
                    message: `Vous êtes connecté`,
                    messageColor: new Color("#333333"),
                    duration: 2000,
                    backgroundColor: new Color("yellowgreen")
                })

            console.log("HOME - > USER STATUS : ", this.$store.getters.getUserStatus);

        },
        mounted() {
            let self = this;
            //display status (if user choose vendor OR customer)
            //console.log("PICTURE", this.$store.getters.getFbUser.picture.data.url);

            GeolocationService.enablePermission() //call to init permission
            //https://www.thepolyglotdeveloper.com/2017/03/device-geolocation-nativescript-angular-application/

            GeolocationService
                .getCurrentLocation(10000)
                .then(function (location) {
                    self
                        .$store
                        .commit('setCurrentLocation', location);

                    /**
                     * After get and set the current location of the device (lat / lg / timestamp), we get infos from this position
                     * this.$store.getters.getCurrentLocation.latitude
                     * this.$store.getters.getCurrentLocation.longitude
                     * this.$store.getters.getCurrentLocation.timestamp
                     */
                    if (location) {
                        GeolocationService
                            .getCurrentLocationInfos(self.$store.getters.getCurrentLocation.longitude, self.$store.getters.getCurrentLocation.latitude)
                            .then((currentLocationInfos) => {
                                self.$store.commit('setCurrentLocationInfos', currentLocationInfos);
                            })
                            .catch((err) => {
                                //TODO message d'erreur creer un service pour gerer les erreur avec des toasts etc
                                console.log("Error getCurrentLocationInfos", err)
                            })
                    }
                })
                .catch(err => console.log("getCurrentLocation ERROR -> ", err))

        },
        component: {
            //my component here
        },
        data() {
            return {
                welcomMessage: "Connecté : " + this.$store.getters.getFbUser.name + "",
                searchByLocationValue: "",
            }
        },
        methods: {

            searchByLocation(event) {

                console.log("SEARCH LOCATION : ", this.searchByLocationValue)
                loader.show(loaderOptions);
                setTimeout(function () {
                    loader.hide();
                }, 1000);
            },
            onTextChanged() {
                console.log("change texted")
                console.log(this.searchByLocationValue)
            },

            choiceLocationMenu() {
                let self = this;
                let current_position_lat = self.$store.getters.getCurrentLocationInfos.lat;
                let current_position_lon = self.$store.getters.getCurrentLocationInfos.lon;

                console.log("device emulator location", current_position_lat, current_position_lon)
                const headers = {
                    'fb-access-token': this.$store
                        .getters.getAccessToken

                };
                action("Position", "Changer d'addresse", [this.$store.getters.getCurrentLocationInfos.display_name, "Entrez une addresse"])
                    .then(result => {
                        loader.show(loaderOptions);
                        if (result === this.$store.getters.getCurrentLocationInfos.display_name) { // when we choose first (auto detect position)
                            axios
                                .get(`${api_config.api_url}/api/v1/position/stores/${current_position_lat}/${current_position_lon}`, {headers: headers})
                                .then(function (storesForPosition) {
                                    setTimeout(function () {
                                        loader.hide();
                                        //TODO set dans la current liste des commerces a la place de celle par défaut
                                        console.log("DATA RESPONSE", storesForPosition.data);
                                        self.$root.$emit('updateStoresList', storesForPosition.data.data);
                                    }, 1000);
                                })
                                .catch(function (err) {
                                    console.log(err);
                                    loader.hide()
                                })
                        } else {
                            loader.hide();
                            prompt({
                                title: "Addresse complète",
                                message: "",
                                okButtonText: "Localiser",
                                cancelButtonText: "Annuler",
                                defaultText: "3 allée des platanes Draveil 91210",
                            }).then(result => {
                                console.log("result prompt", result);
                                if (!result.result) {
                                    //Annuler
                                } else {
                                    if (result.text === "") {
                                        alert({
                                            message: "Addresse invalide",
                                            title: "Oups",
                                            okButtonText: "Fermer"
                                        })
                                            .then(function () {/*close*/
                                            })
                                    } else {
                                        let localisation = result.text;
                                        console.log("LOCALISATION", localisation)
                                        loader.show(loaderOptions);
                                        axios
                                            .get(`${api_config.api_url}/api/v1/geocoding/localisation/${encodeURIComponent(localisation.trim())}/define/localisation`, {headers: headers})
                                            .then(function (result) {
                                                console.log(result.data);
                                                console.log("ICI", result.data.mapLat);
                                                console.log("ICI", result.data.mapLon);

                                                let lat = result.data.mapLat;
                                                let lon = result.data.mapLon;
                                                axios
                                                    .get(`${api_config.api_url}/api/v1/position/stores/${lat}/${lon}`, {headers: headers})
                                                    .then(function (storesAround) {
                                                        self.$root.$emit('updateStoresList', storesAround.data.data);
                                                        loader.hide()
                                                    })
                                                    .catch(function (err) {
                                                        loader.hide()
                                                        console.log(err)
                                                    })
                                            }).catch(function (err) {
                                            loader.hide();
                                            console.log(err)
                                        });
                                        console.log(`Dialog result: ${result.result}, text: ${result.text}`)

                                    }
                                }
                            });

                        }

                    });
            }


        },
        components: {
            Store
        }

    }
</script>

<style scoped>
    ActionBar {
        background-color: #53ba82;
        color: #ffffff;
    }

    .message {
        vertical-align: center;
        text-align: center;
        font-size: 20;
        color: #333333;
    }
</style>

