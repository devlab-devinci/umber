<template>
    <Page>

        <ActionBar>
            <ActionItem text="Mes Offres" :visibility="selectedItem === 0 ? 'visible' : 'collapsed'"></ActionItem>
            <ActionItem text="Ajouter un store" :visibility="selectedItem === 1 ? 'visible' : 'collapsed'"></ActionItem>
            <ActionItem text="Ajouter une offre" :visibility="selectedItem === 2 ? 'visible' : 'collapsed'"></ActionItem>
        </ActionBar>
        <TabView selectedIndex="0" iosIconRenderingMode="alwaysOriginal">
            <TabViewItem title="Mes offres">
                <StackLayout style="margin:10px;">
                    <SegmentedBar @selectedIndexChange="onSelectedIndexChange" v-model="selectedItem">
                        <SegmentedBarItem title="Mes offres"/>
                        <SegmentedBarItem title="Ajouter un magasin"/>
                        <SegmentedBarItem title="Ajouter une offre"/>
                    </SegmentedBar>

                    <FlexboxLayout :visibility="selectedItem === 0 ? 'visible' : 'collapsed'">
                        <Label order="2" :text="selectedItem" backgroundColor="blue"
                               height="100" width="100"></Label>
                        <Label order="1" :text="selectedItem" backgroundColor="red"
                               height="100" width="100"></Label>
                    </FlexboxLayout>


                    <FlexboxLayout :visibility="selectedItem === 1 ? 'visible' : 'collapsed'"
                                   style="align-items:center; flex-direction:column;">
                        <StackLayout class="form">
                            <StackLayout class="input-field">
                                <TextField class="input" hint="Nom ..." v-model="form_name"></TextField>
                            </StackLayout>

                            <StackLayout class="input-field">
                                <TextField class="input"
                                           hint="3 Allée Autocomplete to do wiht google places ..."
                                           v-model="form_address"></TextField>
                            </StackLayout>

                            <StackLayout class="input-field">
                                <TextField class="input" hint="City's name" v-model="form_city"></TextField>
                            </StackLayout>

                            <StackLayout class="input-field">
                                <TextField class="input" hint="Zipcode ...." v-model="form_zipcode"></TextField>
                            </StackLayout>

                            <StackLayout class="input-field">
                                <ListPicker :items="this.categories_store_names" v-model="pickerIndex"></ListPicker>
                            </StackLayout>

                            <StackLayout>
                                <Button text="Confirmer" class="btn btn-primary" @tap="submit"></Button>
                            </StackLayout>
                        </StackLayout>
                    </FlexboxLayout>


                    <FlexboxLayout :visibility="selectedItem === 2 ? 'visible' : 'collapsed'">
                        <Label order="2" :text="selectedItem" backgroundColor="blue"
                               height="100" width="100"></Label>
                        <Label order="1" :text="selectedItem" backgroundColor="red"
                               height="100" width="100"></Label>
                    </FlexboxLayout>


                </StackLayout>
            </TabViewItem>
            <TabViewItem title="Commandes">
                <Label text="commandes"></Label>
            </TabViewItem>
            <TabViewItem title="Statistiques">
                <Label text="statistiques"></Label>
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
                .get(`${api_config.api_url}/api/v1/category`, {headers: headers})
                .then(function (categoriesStores) {
                    self.categories_store = categoriesStores.data.data;
                    for (let i in self.categories_store) {
                        self.categories_store_names.push(self.categories_store[i].name)
                    }
                    setTimeout(function () {
                        loader.hide();
                    }, 1000);
                })
                .catch(function (err) {
                    loader.hide();
                    console.log("ERROR HIT", err)
                });


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
                categories_store: [],
                categories_store_names: [],
                selectedItem: 0,
                pickerIndex: 0,
                form_name: "",
                form_address: "",
                form_city: "",
                form_zipcode: ""
            }
        },
        methods: {
            onTextChanged() {
                console.log("change texted")
            },
            onSelectedIndexChange() {
                console.log("ITEM SELECTED", this.selectedItem);
                -
                    console.log(typeof this.selectedItem);
                console.log(this.selectedItem === 0 ? 'visible' : 'collapsed')
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
                            .catch(function(err){
                                loader.hide();
                                feedback.warning({
                                   message: "Erreur dans les champs !"
                                });
                            })

                    })
                    .catch(function(err){
                        loader.hide();
                        feedback.error({
                            title: "Oups, une erreur est survenue!",
                            titleColor: new Color("black")
                        });
                    })
            },

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
</style>

