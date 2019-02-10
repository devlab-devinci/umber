<template>
    <PullToRefresh @refresh="refreshList">
        <ListView for="store in stores" style="margin: 15px">
            <v-template>
                <!-- Shows the list item label in the default color and style. -->
                <StackLayout @tap="storeClicked(store._id)">
                    <Label :text="store.name | capitalize"></Label>
                    <Label textWrap="true">
                        <FormattedString>
                            <Span class="fa" style="color: #78e08f;" :text="'fa-map-marker' | fonticon"></Span>
                            <Span :text="store.address"/>
                        </FormattedString>
                    </Label>
                    <Label :text="store.zipcode"></Label>
                    <Label :text="store.city"></Label>
                </StackLayout>
            </v-template>
        </ListView>
    </PullToRefresh>
</template>


<script>
    import axios from 'axios';
    import {api_config} from '../api_config';
    import Router from "./services/Router"

    export default {
        name: "Store",
        mounted() {
            let self = this;

            let headers = {
                'fb-access-token': this.$store.getters.getAccessToken
            };

            axios
                .get(`${api_config.api_url}/api/v1/store`, {headers: headers})
                .then(function (stores) {
                    self.stores = stores.data.data; //array
                })
                .catch(err => console.log("STORE GET ERROR ----> ", err))
        },
        data() {
            return {
                stores: {}
            }
        },
        methods: {
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
            /**
             * Pull and refresh
             * @param args
             */
            refreshList(args) {
                let self = this;

                var pullRefresh = args.object;

                let headers = {
                    'fb-access-token': this.$store.getters.getAccessToken
                };

                axios
                    .get(`${api_config.api_url}/api/v1/store`, {headers: headers})
                    .then(function (stores) {
                        console.log("store refresh", stores)
                        self.stores = stores.data.data; //array
                        setTimeout(function () {
                            pullRefresh.refreshing = false;
                        }, 500);
                    })
                    .catch(function (err) {
                        setTimeout(function () {
                            console.log("errorrefresh ->", err);
                            pullRefresh.refreshing = false;
                        }, 1000);
                    });

            }

        }
    }
</script>