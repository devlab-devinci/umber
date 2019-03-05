<template>
    <PullToRefresh @refresh="refreshList">
        <ListView for="store in stores" class="list-group">
            <v-template>
                <GridLayout class="list-group-item" rows="*,*,*,*" columns="150, 150" @tap="storeClicked(store._id)">
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
                    <Label row="2" col="0" class="body" :text="store.categories_store[0].name | capitalize"></Label>
                    <Label row="3" col="0" class="body color-gad" textWrap="true">
                        <FormattedString>
                            <Span class="fa" :text="'fa-tags' | fonticon"></Span>
                            <Span text=" "></Span>
                            <Span :text="store.products.length + ' offres disponibles'"/>
                        </FormattedString>
                    </Label>
                </GridLayout>
            </v-template>

            <!--
            <v-template>
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
        -->

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

            //update from position sleected
            this.$root.$on('updateStoresList', (stores) => { // here you need to use the arrow function
                this.stores = stores;
            })
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

            },


        }
    }
</script>


<style scoped>

    .color-gad {
        color: #22a6b3;;
    }

</style>
