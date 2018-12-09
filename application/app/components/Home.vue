<template>
    <Page>
        <ActionBar title="Home" android:flat="true"/>
        <StackLayout>
            <TextField :text="this.$store.getters.getFbUser.name" hint="Enter text..."/>

            <TextField :text="this.$store.getters.getCurrentLocation.longitude" hint="Enter text..."/>
            <TextField :text="this.$store.getters.getCurrentLocation.latitude" hint="Enter text..."/>
            <TextField :text="this.$store.getters.getCurrentLocation.timestamp" hint="Enter text..."/>

        </StackLayout>
    </Page>
</template>
<script>

    import {Feedback, FeedbackType, FeedbackPosition} from "nativescript-feedback";
    import {Color} from "tns-core-modules/color";

    import GeolocationService from "./services/Geolocation";


    export default {

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
        },
        mounted() {
            let self = this;

            GeolocationService.enablePermission() //call to init permission
            //https://www.thepolyglotdeveloper.com/2017/03/device-geolocation-nativescript-angular-application/
            GeolocationService
                .getCurrentLocation(10000)
                .then(function (location) {
                    self
                        .$store
                        .commit('setCurrentLocation', location);
                })
                .catch(err => console.log("getCurrentLocation ERROR -> ", err))

        },
        component: {
            //my component here
        },
        data() {
            return {}
        },
        methods: {}
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
