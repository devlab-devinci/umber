<template>
    <StackLayout class="p-20" backgroundColor="white">
        <Button class="btn classic-btn" text="Fermer" @tap="$modal.close()"/>
        <Button text="Choisissez une photo" @tap="selectPicture"/>
        <StackLayout>
            <Image v-for="img in images" :src="img.src" width="75" height="75"/>
        </StackLayout>

        <Button v-if="images.length > 0" text="Confirmer" @tap="upload($modal)"/>

    </StackLayout>
</template>

<script>
    const camera = require('nativescript-camera');
    const imagePicker = require('nativescript-imagepicker');
    import {Image} from "tns-core-modules/ui/image";


    import {LoadingIndicator} from "nativescript-loading-indicator";

    const loaderOptions = require('./services/LoaderConfig').getOptions();
    const loader = new LoadingIndicator();
    import axios from 'axios';
    import {api_config} from '../api_config';
    import Router from "./services/Router";

    import * as bghttp from "nativescript-background-http";

    var session = bghttp.session("image-upload");

    export default {
        beforeCreate() {
            camera.requestPermissions();
        },
        props: {
            product_id: ""
        },
        data() {
            return {
                images: []
            };
        },
        methods: {
            selectPicture() {

                let context = imagePicker.create({
                    mode: 'single'
                });

                context.authorize()
                    .then(function () {
                        return context.present();
                    })
                    .then(selection => {
                        selection.forEach(selected => {
                            console.log("SELECTED : ", selected)
                            console.log(selected)
                            console.log("----------------------------------------")
                            //console.log(JSON.stringify(selected));
                            let img = new Image();
                            img.src = selected;
                            this.images.push(img);
                            this.images.forEach(function(i){
                                console.log("I : ",i.src)
                            })
                            console.log("----------------------------------------")
                            console.log("----------------------------------------")
                            console.log("----------------------------------------")
                            console.log("----------------------------------------")
                            console.log("----------------------------------------")
                            console.log("----------------------------------------")
                            console.log("----------------------------------------")

                            console.log("IMAGES", this.images);
                        });
                    }).catch(function (e) {
                    console.log('error in selectPicture', e);
                });
            },

            upload($modal) {
                const self = this;
                loader.show(loaderOptions);

                //todo checking picture exist to display else default picture
                const headers = {
                    'fb-access-token': this.$store
                        .getters.getAccessToken,
                    "Content-Type": "multipart/form-data"
                };
                console.log(this.images[0])
                console.log(this.images[0].src.ios);
                let file = "/some/local/file/path/and/file/name.jpg";
                let url = ``;
                let name = file.substr(file.lastIndexOf("/") + 1);

            }
        }
    };
</script>

<style scoped>
    ActionBar {
        background-color: #53ba82;
        color: #ffffff;
    }

    .btn-outline {
        color: #22a6b3;
    }

    .classic-btn {
        background-color: #22a6b3;
        color: white;
    }

    .fb-btn {
        background-color: #3b5998;
    }
</style>

