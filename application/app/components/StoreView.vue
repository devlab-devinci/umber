<template>
    <Page>
        <ActionBar :title="this.store.name | capitalize " android:flat="true">
            <AbsoluteLayout>
                <Button text="pannier" left="2" top="1" width="20" height="40" backgroundColor="#550C5C"/>
                <Button text="nb product" left="10" top="4" width="40" height="30" backgroundColor="#FAC152"/>
            </AbsoluteLayout>
            <ActionItem @tap="goToCartView" ios.systemIcon="9" ios.position="right" text="edit product"
                        android.position="popup"/>
        </ActionBar>

        <StackLayout>
            <Label :text="this.store.name | capitalize"></Label>
            <Label :text="this.store.city | capitalize"></Label>
            <Label :text="this.store.address | capitalize"></Label>
            <Label :text="this.store.zipcode | capitalize"></Label>
            <Label v-if="this.store.products.length === 0" text="Pas de produits pour le moment"></Label>

            <StackLayout className="mt-5" v-if="this.store.products.length > 0">
                <Label text="Produits"></Label>
            </StackLayout>
            <ListView v-if="this.store.products.length > 0" for="(product, key, index) in this.store.products">
                <v-template>
                    <StackLayout orientation="vertical">
                        <Label :text="product.name | capitalize"></Label>
                        <Label :text="product.price | currency('€', 0, { spaceBetweenAmountAndSymbol: true, symbolOnLeft: false, decimalSeparator: ',', thousandsSeparator: '.'  })"></Label>
                        <TextView :text="product.description"></TextView>
                        <TextField keyboardType="number" hint="Quantité" v-model="product.key">
                        </TextField>
                        <Button text="Add to cart" @tap="addToCart(product, product.key)"></Button>
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


    const Toast = require('nativescript-toast');

    export default {
        name: "StoreView",
        props: {
            store: ""
        },
        mounted() {
            console.log("do you have a cart ?", this.$store.getters.getCurrentCart);
        },
        data() {
            return {}
        },
        methods: {
            addToCart(product, quantity) {
                if (!quantity) {
                    const errorQuantityToast = Toast.makeText('Choisissez une quantité', 'short');
                    errorQuantityToast.show();
                } else {
                    product.quantity = quantity;
                    let feedback = new Feedback();
                    feedback
                        .success({
                            title: `${product.name}`,
                            titleColor: new Color("#222222"),
                            type: FeedbackType.Custom, // this is the default type, by the way
                            message: `Ajouter au panier !`,
                            messageColor: new Color("#333333"),
                            duration: 2000,
                            backgroundColor: new Color("#78e08f")
                        });

                    console.log("store name",this.store.name);
                    this.$store.commit('setProductCart', product);
                    //TODO urgent
                    // en gros il faut pas pouvoir ajouter un article d'un autre magasin dans le cart d'un magasin
                    // ->sinon faire un message du style vous avez déjà un autre panier en cours voulez vous le remplacer ?
                    // -> si oui on creer le nouveau currentCart remove l'ancien et ajoute l'article
                    // sinon on on redirige vers le panier resume
                    //coté api enlever pour le paiment le checking du panier déjà existant (ca na pas de sens en fait)

                    //console.log(" $$$$$$$$ CURRENT CART $$$$$$$ : ", this.$store.getters.getCurrentCart);
                    //console.log("HOME - > USER STATUS : ", this.$store.getters.getUserStatus);
                }

            },
            goToCartView() {
                console.log("GO TO CART LIST")
                this.$navigateTo(Router.cart);
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
