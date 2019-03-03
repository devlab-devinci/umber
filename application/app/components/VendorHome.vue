<template>
    <Page>

        <ActionBar>
            <ActionItem text="Mes Offres" :visibility="selectedItem === 0 ? 'visible' : 'collapsed'"></ActionItem>
            <ActionItem text="Ajouter un store" :visibility="selectedItem === 1 ? 'visible' : 'collapsed'"></ActionItem>
            <ActionItem text="Ajouter une offre"
                        :visibility="selectedItem === 2 ? 'visible' : 'collapsed'"></ActionItem>
        </ActionBar>
        <TabView selectedIndex="0" iosIconRenderingMode="alwaysOriginal">
            <TabViewItem title="Mes offres">
                <StackLayout style="margin:10px;">
                    <SegmentedBar @selectedIndexChange="onSelectedIndexChange" v-model="selectedItem">
                        <SegmentedBarItem title="Mes offres"/>
                        <SegmentedBarItem title="Ajouter un magasin"/>
                        <SegmentedBarItem title="Ajouter une offre"/>
                    </SegmentedBar>


                    <ListView for="product in this.owner_products" v-if="this.owner_products.length > 0"
                              :visibility="selectedItem === 0 ? 'visible' : 'collapsed'">
                        <v-template>
                            <GridLayout class="list-group-item" rows="*,*,*,*,*" columns="200, 200"
                                        @tap="onProductTap(product)">
                                <Label row="0" col="0" class="body" textWrap="true"
                                       :text="product.name | capitalize">
                                </Label>
                                <Image row="0" col="2"
                                       src="https://static.cuisineaz.com/400x320/i108058-kebab-sans-gluten.jpg"
                                       class="thumb img-circle"></Image>
                            </GridLayout>
                        </v-template>
                    </ListView>
                    <Label text="Pas de produits pour le moment" v-if="this.owner_products.length === 0"></Label>


                    <FlexboxLayout :visibility="selectedItem === 1 ? 'visible' : 'collapsed'"
                                   style="align-items:center; flex-direction:column;">
                        <ScrollView>
                            <StackLayout class="form mt-5">

                                <TextField v-model="form_name" hint="Nom" class="input input-rounded m-t-10"/>

                                <TextField hint="Ville" v-model="form_city"
                                           class="input input-rounded m-t-10"></TextField>

                                <TextField class="input input-rounded m-t-10"
                                           hint="Adresse"
                                           v-model="form_address"></TextField>

                                <TextField class="input input-rounded m-t-10" hint="Code postal"
                                           v-model="form_zipcode"></TextField>

                                <!-- <Button text="Catégories" @tap="showModal" class="btn btn-primary m-t-20"/> -->

                                <ListPicker :items="this.categories_store_names" v-model="pickerIndex"></ListPicker>

                                <Button text="Confirmer" class="btn btn-gd m-5" @tap="submit"></Button>
                            </StackLayout>
                        </ScrollView>
                    </FlexboxLayout>


                    <!-- OFFER FORM-->
                    <FlexboxLayout :visibility="selectedItem === 2 ? 'visible' : 'collapsed'"
                                   style="align-items:center; flex-direction:column;">
                        <ScrollView>
                            <StackLayout class="form">
                                <TextField v-model="form_offer_name" hint="Nom" class="input input-rounded m-t-10"/>
                                <TextField v-model="form_offer_price" hint="Prix" class="input input-rounded m-t-10"/>
                                <TextField v-model="form_offer_description" hint="Description"
                                           class="input input-rounded m-t-10"/>
                                <TextField v-model="form_offer_stock" hint="Quantité"
                                           class="input input-rounded m-t-10"/>
                                <TextField v-model="form_offer_promotion" hint="Remise"
                                           class="input input-rounded m-t-10"/>
                                <StackLayout class="input-field">
                                    <ListPicker :items="this.categories_product_names"
                                                v-model="form_offer_category_picker_index"></ListPicker>
                                    <ListPicker :items="this.owner_stores_name"
                                                v-model="owner_stores_index"></ListPicker>
                                    <Button text="Confirmer" class="btn btn-gd" @tap="submitOffer"></Button>
                                </StackLayout>
                            </StackLayout>
                        </ScrollView>
                    </FlexboxLayout>


                </StackLayout>
            </TabViewItem>
            <TabViewItem title="Commandes">
                <StackLayout style="margin:10px;">
                    <SegmentedBar @selectedIndexChange="onSelectedIndexCommandChange" v-model="selectedCommandItem">
                        <SegmentedBarItem title="En cours"/>
                        <SegmentedBarItem title="Historique"/>
                    </SegmentedBar>

                    <FlexboxLayout :visibility="selectedCommandItem === 0 ? 'visible' : 'collapsed'"
                                   style="align-items:center; flex-direction:column;">
                        <ListView for="command_c in this.prepare_commands" v-if="this.prepare_commands.length > 0">
                            <v-template>
                                <GridLayout class="list-group-item" rows="*,*,*,*,*" columns="200, 200">
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
                                    <Button row="3" col="2" @tap="ready(command_c)" class="btn-primary m-5 btn-gd"
                                            text="Prêt !" width="40%"></Button>
                                    <Image :src="'/Users/sylvainjoly/Workspace/umber/Payment_Server/bin/'+command_c.qr_code"
                                           v-if="command_c.qr_code_b64">
                                    </Image>
                                </GridLayout>
                            </v-template>

                        </ListView>
                        <Label text="Aucune commandes en cours pour le moment"
                               v-if="this.prepare_commands.length === 0">

                        </Label>
                    </FlexboxLayout>


                    <ListView for="command_h in this.historic_commands"
                              :visibility="selectedCommandItem === 1 ? 'visible' : 'collapsed'"
                              v-if="this.historic_commands.length > 0">
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
                                <Image :src="'/Users/sylvainjoly/Workspace/umber/Payment_Server/bin/'+command_h.qr_code"
                                       v-if="command_h.qr_code_b64"></Image>
                            </GridLayout>
                        </v-template>
                    </ListView>
                    <Label text="Aucune commande dans votre historique pour le moment"
                           v-if="this.historic_commands.length === 0">
                    </Label>


                </StackLayout>
            </TabViewItem>
            <TabViewItem title="Statistiques">
                <FlexboxLayout style="align-items:center; flex-direction:column;" justifyContent="space-around">
                    <StackLayout>
                        <Label textWrap="true" class="mt-4">
                            <FormattedString>
                                <Span text="Nombre de likes : "></Span>
                                <Span class="fa" style="color: #78e08f;" :text="'fa-heart' | fonticon"></Span>
                                <Span :text="' '+this.stats_like.length"></Span>
                            </FormattedString>
                        </Label>
                        <Label textWrap="true" class="mt-4">
                            <FormattedString>
                                <Span text="Commande honorés : "></Span>
                                <Span class="fa" style="color: #78e08f;" :text="'fa-boxes' | fonticon"></Span>
                                <Span :text="this.stats_command.length"></Span>
                            </FormattedString>
                        </Label>

                        <ListPicker :items="this.stats_items" @selectedIndexChange="selectedIndexStatsChanged"
                                    selectedIndex="0"></ListPicker>
                    </StackLayout>
                </FlexboxLayout>
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

    import Products from './Products';
    import {Feedback, FeedbackType, FeedbackPosition} from "nativescript-feedback";
    import {Color} from "tns-core-modules/color";

    import GeolocationService from "./services/Geolocation";

    import axios from 'axios';
    import {api_config} from '../api_config';
    import Router from "./services/Router";

    export default {
        name: "CustomerHome",
//callback lifecyclme (vuejs)
        beforeCreate() {
            let self = this;
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
                });

            //console.log("HOME - > USER STATUS : ", this.$store.getters.getUserStatus);


            //categories for store loading
            loader.show(loaderOptions);

            const headers = {
                'fb-access-token': this.$store
                    .getters.getAccessToken

            };
            axios
                .get(`${api_config.api_url}/api/v1/dual/categories/${this.$store.getters.getCurrentUser._id}`, {headers: headers})
                .then(function (response) {
                    self.categories_store = response.data.categories_store;
                    self.categories_product = response.data.categories_product;
                    self.owner_stores = response.data.owner_stores;

                    for (let i in self.categories_store) {
                        self.categories_store_names.push(self.categories_store[i].name)
                    }
                    for (let i in self.categories_product) {
                        self.categories_product_names.push(self.categories_product[i].name)
                    }
                    for (let i in self.owner_stores) {
                        self.owner_stores_name.push(self.owner_stores[i].name)
                    }
                    setTimeout(function () {
                        loader.hide();
                    }, 1000);
                })
                .catch(function (err) {
                    loader.hide();
                    feedback.error({
                        title: "Oups, une erreur est survenue! réessayer plus tard",
                        titleColor: new Color("black")
                    });
                    console.log("ERROR DUAL categories :", err)
                });

            axios
                .get(`${api_config.api_url}/api/v1/offers/${self.$store.getters.getCurrentUser._id}`, {headers: headers})
                .then(function (response) {
                    self.owner_products = response.data.data;

                })
                .catch(function (err) {
                    loader.hide();
                    feedback.error({
                        title: "Oups, une erreur est survenue! réessayer plus tard",
                        titleColor: new Color("black")
                    });
                    console.log("ERROR:", err);
                });


            //Get commands en cours status: prepare with ready_at:null)
            axios
                .get(`${api_config.api_url}/api/v1/commands/${this.$store.getters.getCurrentUser._id}/vendor/prepare`, {headers: headers})
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
                .get(`${api_config.api_url}/api/v1/commands/${this.$store.getters.getCurrentUser._id}/vendor/historic`, {headers: headers})
                .then(function (response) {
                    console.log("RESP", response);
                    self.historic_commands = response.data.data;
                    console.log("prepare commands historic", self.historic_commands);
                    setTimeout(function () {
                        loader.hide();
                    }, 1000);
                })
                .catch(function (err) {
                    console.log("prepare commands historic", err);
                    loader.hide();
                    feedback.error({
                        title: "Oups, une erreur est survenue! réessayer plus tard",
                        titleColor: new Color("black")
                    });
                });

            //Load stats (default day)
            axios
                .get(`${api_config.api_url}/api/v1/stats/day`, {headers: headers})
                .then(function (response) {
                    self.stats = response.data.data;
                    self.stats_command = response.data.data.stats_command;
                    self.stats_like = response.data.data.stats_like;
                    console.log("dataaaaa response for stats", self.state);
                    setTimeout(function () {
                        loader.hide();
                    }, 1000);
                })
                .catch(function (err) {
                    console.log("STATS FOR DAY", err);
                    loader.hide();
                    feedback.error({
                        title: "Oups, une erreur est survenue! réessayer plus tard",
                        titleColor: new Color("black")
                    });
                });
        },
        mounted() {
            let self = this;
            console.log("MOUNTED")
            console.log(this.categories_product);
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

                owner_stores: [],
                owner_stores_name: [],
                owner_stores_index: 0,
                owner_products: [],
                owner_products_index: 0,


                //command nav
                selectedCommandItem: 0,

                //prepare commands section
                prepare_commands: "",

                //historic commands section
                historic_commands: "",


                //stats (default loader for the current day)
                stats: "",
                //(pour manipulation rapide)
                stats_command: "",
                stats_like: "",
                stats_test: "",
                stats_items: ['Aujourd\'hui', 'Semaine', 'Mois', 'Année'],
                stats_item_picked: "",

                welcomMessage: "Connecté : " + this.$store.getters.getFbUser.name + "",
                categories_store: [],
                categories_store_names: [],
                selectedItem: 0,
                pickerIndex: 0,
                form_name: "",
                form_address: "",
                form_city: "",
                form_zipcode: "",

                categories_product: [],
                categories_product_names: [],
                form_offer_name: "",
                form_offer_price: 0,
                form_offer_stock: 1,
                form_offer_promotion: 0,
                form_offer_description: "",
                form_offer_category_picker_index: 0,
            }
        },
        methods: {
            onTextChanged() {
                console.log("change texted")
            },
            selectedIndexStatsChanged(picker) {
                //TODO -> get index of picker list then refresh list en fonction de la value pick
                loader.show(loaderOptions);
                setTimeout(function () {
                    loader.hide();
                }, 500)
                console.log("OK");
                console.log("ITEM SELECTED");
            },
            onSelectedIndexChange() {
                console.log("ITEM SELECTED", this.selectedItem);
                console.log(typeof this.selectedItem);
                console.log(this.selectedItem === 0 ? 'visible' : 'collapsed')
                console.log(this.categories_product_names);
            },
            onSelectedIndexCommandChange() {
                console.log("ITEM COMMAND SELECTED", this.selectedCommandItem);
                console.log(typeof this.selectedCommandItem);
                console.log(this.selectedCommandItem === 0 ? 'visible' : 'collapsed')
            },
            submit() {
                let feedback = new Feedback();
                let self = this;

                //premier temps aller cherche la catégorie
                // deuxieme temps push object id de cette categorie dans mon magasin
                let city = this.form_city;
                let zipcode = this.form_zipcode;
                let address = this.form_address;
                let name = this.form_name;

                let body = {
                    city: city,
                    zipcode: zipcode,
                    address: address,
                    name: name,
                    category_id: ""
                };

                const headers = {
                    'fb-access-token': this.$store
                        .getters.getAccessToken

                };

                loader.show(loaderOptions);
                axios.get(`${api_config.api_url}/api/v1/${this.categories_store_names[this.pickerIndex]}/category/store`)
                    .then(function (category) {
                        body.category_id = category.data.data._id;
                        body.owner_id = self.$store.getters.getCurrentUser._id;
                        axios.post(`${api_config.api_url}/api/v1/store`, body, {headers: headers})
                            .then(function (response) {
                                console.log(response.status);
                                if (response.status === 200) {
                                    loader.hide();
                                    feedback
                                        .success({
                                            title: "Félicitation !",
                                            titleColor: new Color("#222222"),
                                            type: FeedbackType.Custom, // this is the default type, by the way
                                            message: `Store ajouté !`,
                                            messageColor: new Color("#333333"),
                                            duration: 2000,
                                            backgroundColor: new Color("yellowgreen")
                                        });
                                    self.$navigateTo(Router.vendorHome)
                                } else {
                                    loader.hide();
                                    feedback
                                        .warning({
                                            message: "Erreur lors de l'ajout du store !"
                                        });
                                }
                            })
                            .catch(function (err) {
                                loader.hide();
                                feedback.warning({
                                    message: "Erreur dans les champs !"
                                });
                            })

                    })
                    .catch(function (err) {
                        loader.hide();
                        feedback.error({
                            title: "Oups, une erreur est survenue!",
                            titleColor: new Color("black")
                        });
                    })
            },
            submitOffer() {
                const headers = {
                    'fb-access-token': this.$store
                        .getters.getAccessToken

                };
                console.log("submit new offer . . .");
                loader.show(loaderOptions);
                let feedback = new Feedback();
                let inputOffer = {
                    name: "",
                    price: "",
                    stock: 0,
                    promotion: 0,
                    description: "",
                    category_name: this.categories_product_names[this.form_offer_category_picker_index],
                    owner_id: this.$store.getters.getCurrentUser._id,
                    owner_store_id: this.owner_stores[this.owner_stores_index]._id
                };

                let errorValidation = [];

                if (this.form_offer_name && typeof this.form_offer_name === "string" && this.form_offer_name.length !== 0) {
                    inputOffer.name = this.form_offer_name
                } else {
                    errorValidation.push("invalide name");
                }

                if (this.form_offer_price > 0) {
                    inputOffer.price = this.form_offer_price
                } else {
                    errorValidation.push("invalide price");
                }

                if (this.form_offer_stock > 0) {
                    inputOffer.stock = this.form_offer_stock
                } else {
                    errorValidation.push("invalide stock");
                }

                console.log("TEST THIS : ", (this.form_offer_price - this.form_offer_promotion) <= 0)
                //console.log("asset test", this.form_offer_promotion - this.form_offer_price);
                if (!(this.form_offer_price - this.form_offer_promotion) <= 0) {
                    inputOffer.promotion = this.form_offer_promotion;
                } else {
                    console.log("PROMOTION", this.form_offer_promotion)
                    console.log("PRICE", this.form_offer_price);
                    errorValidation.push("invalide promotion");
                }

                inputOffer.description = this.form_offer_description;
                inputOffer.stock_total = this.form_offer_stock;

                if (errorValidation.length > 0) {
                    console.log("VALIDATION FORM OFFER : ", errorValidation);
                    //error
                    setTimeout(function () {
                        feedback
                            .warning({
                                message: "Erreur, vérifier les champs !"
                            });
                        loader.hide()
                    }, 1000);

                } else {
                    //console.log("current_user _id", this.$store.getters.getCurrentUser._id);
                    //console.log("payload", inputOffer)
                    console.log("STORE ID", inputOffer.owner_store_id);
                    axios
                        .post(`${api_config.api_url}/api/v1/offer`, inputOffer, {headers: headers})
                        .then(function (response) {
                            console.log(response);
                            if (response.data.status === 200) {
                                loader.hide();
                                feedback
                                    .success({
                                        title: "Félicitation !",
                                        titleColor: new Color("#222222"),
                                        type: FeedbackType.Custom, // this is the default type, by the way
                                        message: `Offre ajouté !`,
                                        messageColor: new Color("#333333"),
                                        duration: 2000,
                                        backgroundColor: new Color("yellowgreen")
                                    });
                            } else {
                                loader.hide()
                                feedback
                                    .error({
                                        message: "Une erreur survenue. Veuillez réessayer"
                                    });
                            }
                        })
                        .catch(function (err) {
                            loader.hide()
                            feedback
                                .warning("Oups, une erreur est surevenue. Veuillez réessayer plus tard")
                        });

                }
            },
            onProductTap(product) {
                this.$navigateTo(Router.product_detail, {
                    props: {
                        product: product
                    }
                });


            },
            displayStatus(cmd_status) {
                if (cmd_status === 'prepare') {
                    return "Commande en préparation"
                } else {
                    return "Commande prête !"
                }
            },
            ready(command) {
                let self = this;
                console.log(command._id);
                loader.show(loaderOptions);
                const headers = {
                    'fb-access-token': this.$store
                        .getters.getAccessToken

                };
                let body = {
                    command: command
                };

                console.log("body id send", body.command._id);
                let feedback = new Feedback();

                axios.put(`${api_config.api_url}/api/v1/commands/archived`, body, {headers: headers})
                    .then(function (response) {
                        console.log("repppp", response);
                        console.log("STAAAATUS", response.data.status);
                        if (response.data.status === 200) {
                            setTimeout(function () {
                                loader.hide();
                                feedback
                                    .success({
                                        title: "Archivé",
                                        titleColor: new Color("#222222"),
                                        type: FeedbackType.Custom, // this is the default type, by the way
                                        message: `Ajouté à votre historique.`,
                                        messageColor: new Color("#333333"),
                                        duration: 2000,
                                        backgroundColor: new Color("yellowgreen")
                                    });
                            }, 1000);
                        } else {
                            loader.hide();
                            feedback
                                .warning({
                                    message: "Erreur lors de l'ajout du store !"
                                });
                        }
                    })
                    .catch(function (err) {
                        loader.hide();
                        feedback.warning({
                            message: "Erreur dans les champs !"
                        });
                    });

                console.log("@TAP READY : ", command);
            },
            displayQrCode(command_c_data) {
                //console.log('data:Image/png;base64'+ new Buffer(command_c_data).toString('base64'))
                console.log('data:Image/png;base64' + new Buffer(command_c_data).toString('base64'))
                return 'data:Image/png;base64' + new Buffer(command_c_data).toString('base64')
            }

        },
        components: {
            Products
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


    .btn-gd {
        background-color: #22a6b3;
        color: white;
    }
</style>

