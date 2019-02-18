<template>
    <Page>
        <ActionBar :title="this.store.name | capitalize " android:flat="true">
            <AbsoluteLayout>
                <Button text="pannier" left="2" top="1" width="20" height="40" backgroundColor="#550C5C"/>
                <Button text="nb product" left="10" top="4" width="40" height="30" backgroundColor="#FAC152"/>
            </AbsoluteLayout>
            <ActionItem v-if="cart && cart.cartEntries && cart.cartEntries.length > 0" ios.systemIcon="9" ios.position="right" :text="'Produits : ' + cart.cartEntries.length + ' Afficher le panier ' + cart.price.price" col="2" @tap="goToCartView(cart)" android.position="popup" />
        </ActionBar>

        <StackLayout>
            <Image v-if="this.store.picture" width="150rem" :src="this.store.picture"></Image>
            <Label :text="this.store.name | capitalize"></Label>
            <Label :text="this.store.city | capitalize"></Label>
            <Label :text="this.store.address | capitalize"></Label>
            <Label :text="this.store.zipcode | capitalize"></Label>
            <Label v-if="items && items.length === 0" text="Pas de produits pour le moment"></Label>

            <StackLayout className="mt-5" v-if="items && items.length > 0">
                <Label text="Produits"></Label>
            </StackLayout>
            <ListView height="100%" v-if="items && items.length" flexGrow="1" for="(item, index) in items" @itemTap="" item-key="item._id"  width="100%">
                <v-template>
                    <StackLayout>
                        <Label :text="'Nom :' + item.name" col="1" row="0"></Label>
                        <Label :text="item.description" col="1" row="0"></Label>
                        <Image v-if="item.cover && item.cover.name" col="0" row="0" :src="$config.url + '/upload/' + item.cover.name"></Image>
                        <Label :text="'Prix :' + item.price" col="3" row="1"/>
                        <Label v-if="item.promotion" :text="'Promotion :' + item.promotion" col="3" row="1"/>
                        <Button text="Voir le produit" col="2" @tap="showProduct(item)" />
                    </StackLayout>
                </v-template>
            </ListView>

        </StackLayout>

    </Page>

</template>


<script>
    import axios from 'axios';
    import {api_config} from '../api_config';
    import {Feedback, FeedbackType} from "nativescript-feedback";
    import {Color} from "tns-core-modules/color";
    import Router from "./services/Router";
    import _ from "lodash";

    const Toast = require('nativescript-toast');

    export default {
        name: "StoreView",
        props: {
            store: ""
        },
        mounted() {
            this.fetchProducts();
        },
        data: function () {
            return {
                shop: null,
                items: null,
                cart: null
            };
        },
        mounted: function () {
            this.fetchShop();
            this.fetchProducts();
        },
        methods: {
            fetchShop: function () {
                let vm = this;
                console.log(3, vm.store._id);
                vm.$http.get('api/v1/store/' + vm.store._id)
                  .then(shop => {
                      console.log(4, shop);
                      vm.shop = shop.data;
                  })
                  .then(() => {
                      console.log(52, vm.$store.getters.getFbUser.id);
                      console.log(5, vm.$store && vm.$store.state && vm.$store.getters.getFbUser.id && vm.$store.getters.getFbUser.id);
                      console.log(6, vm.store._id);
                      vm.$http.get('api/v1/carts', {params: {buyer: vm.$store.getters.getFbUser.id, seller: vm.store._id}})
                        .then(cart => {
                            console.log(7, cart);
                            vm.cart = _.cloneDeep(cart.data.data[0]);
                        })
                        .catch(error => console.error(error));
                  })
                  .catch(error => console.error(error));
            },
            showCart(cart) {
                let vm = this;
                this.$navigateTo(vm.$router.cart, {
                    props: {
                        id: cart._id
                    },
                    animated: true,
                    transition: {
                        name: "slideTop",
                        duration: 380,
                        curve: "easeIn"
                    }
                })
            },
            fetchProducts: function () {
                let vm = this;
                vm.$http.get('api/v1/products', {params: {owner: (vm.store && vm.store._id)}})
                  .then(products => {
                      console.log(2, products);
                      vm.items = products.data.data;
                  })
                  .catch(error => console.error(error));
            },
            showProduct(shopItem) {
                let vm = this;
                this.$showModal(vm.$router.product, {
                    props: {
                        id: shopItem._id
                    },
                    animated: true,
                    transition: {
                        name: "slideTop",
                        duration: 380,
                        curve: "easeIn"
                    }
                })
            },
            goToCartView(cart) {
                console.log("GO TO CART LIST")
                let vm = this;
                this.$navigateTo(vm.$router.cart, {
                    props: {
                        id: cart._id
                    },
                    animated: true,
                    transition: {
                        name: "slideTop",
                        duration: 380,
                        curve: "easeIn"
                    }
                })
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
