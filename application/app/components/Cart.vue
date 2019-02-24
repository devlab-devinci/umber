<template>
    <Page>
        <ActionBar class="action-bar" title="Votre panier">
        </ActionBar>
        <scroll-view class="green" v-if="this.current_cart !== null">
            <StackLayout>
                <StackLayout>
                    <Label text="Supprimer ce panier" @tap="delete_cart"></Label>
                </StackLayout>
                <ListView for="product in formatted">
                    <v-template>
                        <StackLayout>
                            <Label :text="product.name | capitalize"></Label>
                            <Label :text="product.store_access_name | capitalize"></Label>
                            <Label>
                                <FormattedString>
                                    <Span :text="product.price | currency('€')"></Span>
                                    <Span text=" x "></Span>
                                    <Span :text="product.quantity"></Span>
                                    <Span text=" = "></Span>
                                    <Span :text="product.total"></Span>
                                </FormattedString>
                            </Label>
                        </StackLayout>
                    </v-template>
                </ListView>
                <StackLayout>
                    <Label :text="total_bill | currency('€')"></Label>
                </StackLayout>
                <StackLayout>
                    <Button text="Paiement" @tap="goToPaiement" :disabled="true"></Button>
                </StackLayout>
            </StackLayout>

        </scroll-view>
        <scroll-view class="green" v-else>
            <StackLayout>
                <Label text="Panier not exist"></Label>
            </StackLayout>
        </scroll-view>
    </Page>
</template>

<script>

    import Router from "./services/Router";

    const _ = require('lodash');

    import {api_config} from '../api_config';
    import axios from 'axios';


    //feedback
    import {Feedback, FeedbackType} from "nativescript-feedback";
    import {Color} from "tns-core-modules/color";

    export default {
        props: {},
        data: function () {
            return {
                current_cart: null,
                formated: null,
                total_bill: 0,
                quantity_formatted: 0,
                payment_url: api_config.payment_server_url
            };
        },
        mounted: function () {
            this.checkCurrentCart();
        },
        methods: {
            checkCurrentCart() {
                if (this.$store.getters.getCurrentCart === null) {
                    this.current_cart = null;
                } else {
                    this.current_cart = this.$store.getters.getCurrentCart;

                    let formatted = this.current_cart.map(function (item) {
                        return item.name
                    }).filter((value, index, self) => self.indexOf(value) === index);

                    let products = [];
                    for (let item in formatted) {
                        products.push({
                            name: formatted[item],
                            quantity: 0,
                            total: 0,
                            price: 0,
                        })
                    }

                    for (let y in this.current_cart) {
                        for (let x in products) {
                            if (this.current_cart[y].name == products[x].name) {
                                products[x].quantity += this.current_cart[y].quantity
                                products[x].price = parseFloat(this.current_cart[y].price)
                                products[x].total += (parseFloat(this.current_cart[y].price) * this.current_cart[y].quantity)

                            }
                        }
                    }

                    this.total_bill = products.map((product) => product.total).reduce((prev, next) => {
                        return prev + next
                    });

                    this.formatted = products;
                    console.log("end", products)
                    console.log("total vbill", this.total_bill)


                }
            },
            goToPaiement() {

                let self = this;

                const headers = {
                    'fb-access-token': this.$store
                        .getters.getAccessToken

                };

                let body = {};
                body.user_id = self.$store.getters.getCurrentUser._id;
                body.products = self.current_cart;
                body.total_bill = self.total_bill;
                axios
                    .post(`${api_config.api_url}/api/v1/cart`, body, {headers: headers})
                    .then(function (response) {
                        console.log(console.log("error", response.status))
                        console.log("RESPON SE??????", response);
                        if (response.status !== 200) {
                            new Feedback().error({
                                title: "Une erreur est survenue",
                                titleColor: new Color("#222222"),
                                type: FeedbackType.Custom, // this is the default type, by the way
                                message: `Veuillez réessayer plus tard`,
                                duration: 2000,
                            })
                        } else {
                            console.log("Ok", response);
                            self.$navigateTo(Router.payment);
                        }
                    })
                    .catch(function (err) {
                        console.log(err)
                    });
            },
            delete_cart() {
                //TODO
                console.log("delete db + delete variable");
                console.log("TODO, delete", this.current_cart)
            }
        }
    }
    ;
</script>
