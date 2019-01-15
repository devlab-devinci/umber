<template>
    <Page>

        <ActionBar>
            <SearchBar hint="Localisation ..." text="" textFieldBackgroundColor="#b2bec3"
                       @textChange="onTextChanged" @submit="setLocation"/>

            <!--
            <StackLayout orientation="horizontal">
                <Image src="https://play.nativescript.org/dist/assets/img/NativeScript_logo.png" width="40" height="40"
                       verticalAlignment="center"/>
                <Label class="m-l-5" text="Umber" fontSize="24" verticalAlignment="center"/>
                <Label class="m-l-5" textWrap="true">
                    <FormattedString>
                        <Span class="fa" style="color: #fd79a8" :text="'fa-map' | fonticon"></Span>
                    </FormattedString>
                </Label>
            </StackLayout>
             -->
        </ActionBar>


        <TabView selectedIndex="0" iosIconRenderingMode="alwaysOriginal">
            <TabViewItem title="Mes offres">
                <Label text="offre"></Label>
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

    import {Feedback, FeedbackType, FeedbackPosition} from "nativescript-feedback";
    import {Color} from "tns-core-modules/color";

    import GeolocationService from "./services/Geolocation";

    import Router from "./services/Router";

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
            }
        },
        methods: {
            setLocation(event) {
                confirm('Voulez-vous rafraîchir votre position ?')
                    .then(response => {
                        console.log(response);
                        if (response) {
                            //TODO -> loader activity https://www.nativescript.org/blog/showing-an-activity-indicator-during-processing-in-nativescript-apps
                            //TODO _> ajouter la possibilité d'ajouter une location manuellement
                            GeolocationService.setLocationCheck();
                            console.log('CALL SET LOCATIONCHECK puis set la location')
                        } else {
                            console.log("nothing.")
                        }

                    });

            },
            onTextChanged() {
                console.log("change texted")
            }
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

