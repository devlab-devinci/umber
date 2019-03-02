<template>
    <Page>

        <ActionBar title="Commerces">
            <ActionItem @tap="choiceLocationMenu"
                        ios.systemIcon="res://markLocation" ios.position="left"
                        android.systemIcon="ic_menu_mylocation" android.position="actionBar"/>
            <ActionItem @tap="goToCartView" ios.systemIcon="9" ios.position="right"
                        android.position="popup"/>
        </ActionBar>


        <TabView selectedIndex="0" iosIconRenderingMode="alwaysOriginal">
            <TabViewItem title="Commerces">
                <Store></Store>
            </TabViewItem>
            <TabViewItem title="Recherche">
                <StackLayout>
                    <SearchBar hint="Recherche ..." text="" class="m-5" style="border-radius: 10px;"
                               textFieldBackgroundColor="#b2bec3"
                               v-model="searchVal"
                               @textChange="onTextChanged" @submit="searchByValue"/>

                    <ListView for="store in this.search_stores" v-if="this.search_stores.length > 0">
                        <v-template>
                            <GridLayout class="list-group-item" rows="*,*,*,*" columns="150, 150"
                                        @tap="storeClicked(store._id)">
                                <Label row="0" col="0" :text="store.name | capitalize"></Label>
                                <Image row="0" col="2"
                                       src="https://www.nootica.fr/media/catalog/product/cache/1/small_image/9df78eab33525d08d6e5fb8d27136e95/placeholder/default/no-image_1.png"
                                       class="thumb img-circle"></Image>
                                <Label row="1" col="0" class="body" textWrap="true">
                                    <FormattedString>
                                        <Span class="fa color-gad" :text="'fa-map-marker' | fonticon"></Span>
                                        <Span text=" "></Span>
                                        <Span :text="store.city"/>
                                    </FormattedString>
                                </Label>
                                <Label row="2" col="0" class="body"
                                       :text="store.categories_store[0].name | capitalize"></Label>
                                <Label row="3" col="0" class="body color-gad" textWrap="true">
                                    <FormattedString>
                                        <Span class="fa" :text="'fa-tags' | fonticon"></Span>
                                        <Span text=" "></Span>
                                        <Span :text="store.products.length + ' offres disponibles'"/>
                                    </FormattedString>
                                </Label>
                            </GridLayout>
                        </v-template>
                    </ListView>

                </StackLayout>
            </TabViewItem>
            <TabViewItem title="Reçues">
                <StackLayout style="margin:10px;">
                    <SegmentedBar @selectedIndexChange="onSelectedIndexChange" v-model="selectedItem">
                        <SegmentedBarItem title="En cours"/>
                        <SegmentedBarItem title="Historique"/>
                    </SegmentedBar>
                    <ListView for="command_c in this.prepare_commands" v-if="this.prepare_commands.length > 0"
                              :visibility="selectedItem === 0 ? 'visible' : 'collapsed'">

                        <v-template>
                            <GridLayout class="list-group-item" rows="*,*,*,*" columns="200, 200">
                                <Label row="0" col="0" :text="'n° ' + command_c.identifier"></Label>
                                <Label row="3" col="0" class=""
                                       :text="command_c.amount_cart | currency('€', 0, { spaceBetweenAmountAndSymbol: true, symbolOnLeft: false, decimalSeparator: ',', thousandsSeparator: '.'  })"
                                       textWrap="true">
                                </Label>
                                <Image row="0" col="2"
                                       src="https://static.cuisineaz.com/400x320/i108058-kebab-sans-gluten.jpg"
                                       class="thumb img-circle"></Image>
                                <Label row="1" col="0" class="body" textWrap="true"
                                       :text="command_c.createdAt  | moment('dddd, MMMM Do YYYY, h:mm:ss a')">
                                </Label>
                                <Label row="2" col="0" class="body"
                                       :text="displayStatus(command_c.status)"></Label>
                            </GridLayout>
                        </v-template>


                    </ListView>
                    <Label text="Aucune commandes en cours pour le moment"
                           v-if="this.prepare_commands.length === 0"></Label>

                    <ListView for="command_h in this.historic_commands"
                              v-if="this.historic_commands.length > 0"
                              :visibility="selectedItem === 1 ? 'visible' : 'collapsed'">
                        <v-template>
                            <GridLayout class="list-group-item" rows="*,*,*,*,*" columns="200, 200">
                                <Label row="0" col="0" :text="'n° ' + command_h.identifier"></Label>
                                <Label row="3" col="0" class=""
                                       :text="command_h.amount_cart | currency('€', 0, { spaceBetweenAmountAndSymbol: true, symbolOnLeft: false, decimalSeparator: ',', thousandsSeparator: '.'  })"
                                       textWrap="true">
                                </Label>
                                <Image row="0" col="2"
                                       src="https://static.cuisineaz.com/400x320/i108058-kebab-sans-gluten.jpg"
                                       class="thumb img-circle"></Image>
                                <Label row="1" col="0" class="body" textWrap="true"
                                       :text="command_h.createdAt  | moment('dddd, MMMM Do YYYY, h:mm:ss a')">
                                </Label>
                                <Label row="2" col="0" class="body"
                                       :text="displayStatus(command_h.status)"></Label>

                                <Button row="3" col="2" @tap="like(command_h.products[0].store)" class="btn-primary m-5"
                                        text="Encourager !"></Button>

                            </GridLayout>
                        </v-template>

                    </ListView>
                    <Label text="Aucune commande dans votre historique pour le moment"
                           v-if="this.historic_commands.length === 0">

                    </Label>

                </StackLayout>
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

    import Shops from './Shop';
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
            let self = this;
            const headers = {
                'fb-access-token': this.$store
                    .getters.getAccessToken
            };

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

            loader.show(loaderOptions);
            console.log("URL", `${api_config.api_url}/api/v1/commands/${this.$store.getters.getCurrentUser._id}/prepare`)
            console.log("headers", headers);

            //Get commands en cours status: prepare with ready_at:null)
            axios
                .get(`${api_config.api_url}/api/v1/commands/${this.$store.getters.getCurrentUser._id}/prepare`, {headers: headers})
                .then(function (response) {
                    console.log("RESP", response);
                    self.prepare_commands = response.data.data;
                    console.log("prepare commands", self.prepare_commands);
                    setTimeout(function () {
                        loader.hide();
                    }, 1000);
                })
                .catch(function (err) {
                    console.log("prepare commands", err);
                    loader.hide();
                    feedback.error({
                        title: "Oups, une erreur est survenue! réessayer plus tard",
                        titleColor: new Color("black")
                    });
                });


            //Get commands historic (status: ready with ready_at not null)
            axios
                .get(`${api_config.api_url}/api/v1/commands/${this.$store.getters.getCurrentUser._id}/historic`, {headers: headers})
                .then(function (response) {
                    console.log("RESP", response);
                    self.historic_commands = response.data.data;
                    console.log("prepare commands", self.historic_commands);
                    setTimeout(function () {
                        loader.hide();
                    }, 1000);
                })
                .catch(function (err) {
                    console.log("prepare commands", err);
                    loader.hide();
                    feedback.error({
                        title: "Oups, une erreur est survenue! réessayer plus tard",
                        titleColor: new Color("black")
                    });
                });


            //init search
            this.search_stores = [];

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
                searchVal: "",
                selectedItem: 0,

                //prepare commands section
                prepare_commands: "",

                //historic commands section
                historic_commands: "",


                //search stores
                search_stores: "",
            }
        },
        methods: {
            formatSearchIndicator(length) {
                if (length > 1) {
                    return `Résultats pour ${this.searchVal} : ${length}`
                } else {
                    return `Résultat pour ${this.searchVal} : ${length}`
                }
            },
            onSelectedIndexChange() {
                console.log("ITEM SELECTED", this.selectedItem);
                console.log(typeof this.selectedItem);
                console.log(this.selectedItem === 0 ? 'visible' : 'collapsed')
            },
            searchByValue(event) {
                let self = this;
                loader.show(loaderOptions);
                console.log("SEARCH value : ", this.searchVal)

                const headers = {
                    'fb-access-token': this.$store
                        .getters.getAccessToken

                };
                let body = {
                    search_value: this.searchVal.toLowerCase() // lowercase for search
                };

                axios
                    .post(`${api_config.api_url}/api/v1/search`, body, {headers: headers})
                    .then(function (response) {
                        let storesFilter = response.data.data;
                        console.log(response.data);
                        console.log("STORE FILTER ", storesFilter);
                        setTimeout(function () {
                            self.search_stores = storesFilter;
                            loader.hide();
                        }, 1000);
                    })
                    .catch(function (err) {
                        setTimeout(function () {
                            console.log("error store filter : ", err)
                            loader.hide();
                            feedback.error({
                                title: "Oups, une erreur est survenue! réessayer plus tard",
                                titleColor: new Color("black")
                            });
                        }, 1000);
                    })

            },
            onTextChanged() {
                console.log("change texted")
                console.log(this.searchVal)
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
            },
            storeClicked: function (id_store) {
                let self = this;
                const headers = {
                    'fb-access-token': this.$store
                        .getters.getAccessToken

                };
                axios
                    .get(`${api_config.api_url}/api/v1/store/${id_store}`, {headers: headers})
                    .then(function (store) {
                        //Send variable
                        self.$navigateTo(Router.storeView, {
                            transition: {},
                            transitionIOS: {},
                            transitionAndroid: {},
                            props: {
                                store: store.data.data
                            }
                        });
                        /*
                        self.$navigateTo(Router.storeView, {
                            transition: {},
                            transitionIOS: {},
                            transitionAndroid: {},
                            props: {
                                store: store.data.data
                            }
                        });
                        */
                    })
                    .catch(err => console.log("ERROR HIT", err));
                console.log("item clicked", id_store)
            },
            like(store_id) {

                loader.show(loaderOptions);
                //on fait un command.products[O], car on part sur le principe que les products VIENNET d'un unique mangasin
                const headers = {
                    'fb-access-token': this.$store
                        .getters.getAccessToken
                };
                const body = {
                    user_id: this.$store.getters.getCurrentUser._id,
                    store_id: store_id
                };
                let feedback = new Feedback();

                console.log("LIKE : ", store_id);

                axios
                    .post(`${api_config.api_url}/api/v1/like`, body, {headers: headers})
                    .then(function (response) {
                        console.log("resssss", response);
                        if (response.data.status === 200) {
                            if (response.data.exist === true) {
                                loader.hide()
                                feedback.warning({
                                    title: "Magasin déjà liké !",
                                    titleColor: new Color("black")
                                });
                            } else {
                                loader.hide()
                                feedback.success({
                                    title: "Merci pour votre soutien !",
                                    titleColor: new Color("black")
                                });
                            }
                        } else {
                            loader.hide()
                            feedback.error({
                                title: "Oups, une erreur est survenue! réessayer plus tard",
                                titleColor: new Color("black")
                            });
                        }
                    })
                    .catch(function (err) {
                        console.log("errrr", err)
                        loader.hide()
                        feedback.error({
                            title: "Oups, une erreur est survenue! réessayer plus tard",
                            titleColor: new Color("black")
                        });
                    });

            },
            goToCartView() {
                console.log("GO TO CART LIST")
                this.$navigateTo(Router.cart);
            },
            displayStatus(cmd_status) {
                if (cmd_status === 'prepare') {
                    return "Commande en préparation"
                } else {
                    return "Commande prête !"
                }
            }


        },
        components: {
            Shops,
            Store
        }

    }
</script>

<style scoped>
    ActionBar {
        background-color: #53ba82;
        color: #ffffff;
    }

    .btn-circle {
        width: 30px;
        height: 30px;
        border-radius: 15px;
        text-align: center;
        font-size: 12px;
        line-height: 1.42857;
    }

    .message {
        vertical-align: center;
        text-align: center;
        font-size: 20;
        color: #333333;
    }
</style>

