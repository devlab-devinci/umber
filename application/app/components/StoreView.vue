<template>
    <Page>
        <ActionBar :title="this.store.name | capitalize " android:flat="true">
            <ActionItem @tap="goToCartView" ios.systemIcon="9" ios.position="right" text="edit product"
                        android.position="popup"/>
        </ActionBar>

        <StackLayout>

            <StackLayout>
                <Image
                        src="https://www.athenaspahotel.com/media/cache/jadro_resize/rc/Tv22O4rW1550816149/jadroRoot/medias/_a1a8429.jpg"></Image>
            </StackLayout>

            <StackLayout class="m-5">
                <Label textWrap="true">
                    <FormattedString>
                        <Span :text="this.store.name|capitalize"/>
                        <Span text=" - "/>
                        <Span :text="this.store.city|capitalize"/>
                    </FormattedString>
                </Label>
                <Label textWrap="true" class="body">
                    <FormattedString>
                        <Span :text="this.store.address|capitalize"/>
                        <Span text=", "/>
                        <Span :text="this.store.city |capitalize"/>
                        <Span text=" - "/>
                        <Span :text="this.store.zipcode"></Span>
                    </FormattedString>
                </Label>

                <label :text="store.categories_store[0].name | capitalize"></label>

                <!-- offres -->
                <StackLayout class="hr-light m-10" width="320"></StackLayout>

                <FlexboxLayout v-if="this.store.products.length === 0"
                               style="align-items:center; flex-direction:column;">
                    <Label class="body" text="Aucunes offres disponible"></Label>
                </FlexboxLayout>

                <ListView v-if="this.store.products.length > 0" for="(product, key, index) in this.store.products" class="m-5">
                    <v-template>
                        <StackLayout orientation="vertical">
                            <Label class="body" :text="product.name | capitalize"></Label>
                            <Label class="body" :text="displayStock(product.stock)"></Label>
                            <Label class="body" :text="displayTruePrice(product.price, product.promotion) | currency('€', 0, { spaceBetweenAmountAndSymbol: true, symbolOnLeft: false, decimalSeparator: ',', thousandsSeparator: '.'  }) + ' (' + product.promotion + ' de remise)'"></Label>
                            <Label class="body" :text="product.description"></Label>
                            <TextField keyboardType="number" hint="Quantité" v-model="product.key">
                            </TextField>
                            <Button text="Ajouter au panier"
                                    @tap="addToCart(product, product.key, product.promotion)"></Button>
                        </StackLayout>
                    </v-template>
                </ListView>

            </StackLayout>
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
            addToCart(product, quantity, promotion) {
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

                    let existingQuantity = 0;
                    let payload = {
                        quantity: quantity,
                        product: product,
                        promotion: promotion
                    };

                    if (this.$store.getters.getCurrentCart !== null) {
                        existingQuantity = this.$store.getters.getCurrentCart.length
                    }

                    payload.existingQuantity = existingQuantity;

                    /*
                    console.log("before : ",payload.quantity)
                    if(this.$store.getters.getCurrentCart !== null){
                        payload.quantity = parseInt(payload.quantity) + this.$store.getters.getCurrentCart.length
                    }

                    console.log("after",payload.quantity)
                    */
                    this.$store.commit('setProductCart', payload);

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
            },
            displayStock(product_stock) {

                if (product_stock < 0 || product_stock === 0) {
                    return `Indisponible`
                } else if (product_stock === 1) {
                    return `Plus que 1 produit disponible`
                } else if (product_stock === 2) {
                    return `Plus que 2 produit disponible`
                } else if (product_stock === 3) {
                    return `Plus que 3 produit disponible`
                } else {
                    return `Disponible`
                }
            },
            displayTruePrice(product_price, product_promotion) {
                return (product_price - product_promotion);
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
