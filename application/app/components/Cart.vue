<template>
    <Page>
        <ActionBar class="action-bar" title="Panier">
            <!-- <Button text="Paiement" class="btn btn-primary" @tap="goToPaiement" :disabled="true"></Button> -->
            <ActionItem @tap="goToPaiement" ios.position="right" text="Payer" android.position="popup" v-if="this.current_cart!== null && this.total_bill !== 0.00"/>
        </ActionBar>

            <ListView for="product in this.formatted" class="list-group" v-if="this.current_cart !== null && this.total_bill !== 0.00">
                <v-template>
                    <GridLayout class="list-group-item" rows="*,*,*,*,*,*" columns="150, 150">
                        <Label row="0" col="0" :text="product.name | capitalize"></Label>
                        <Image row="0" col="2"
                               src="https://www.nootica.fr/media/catalog/product/cache/1/small_image/9df78eab33525d08d6e5fb8d27136e95/placeholder/default/no-image_1.png"
                               class="thumb img-circle"></Image>
                        <Label class="body" row="1" col="0" :text="product.store_access_name | capitalize"></Label>
                        <label class="body" row="2" col="0" :text="product.price_promo | currency('€', 0, { spaceBetweenAmountAndSymbol: true, symbolOnLeft: false, decimalSeparator: ',', thousandsSeparator: '.'  }) + ' de remise'"></label>

                        <Label row="3" col="0" class="body" textWrap="true">
                            <Span :text="product.price | currency('€', 0, { spaceBetweenAmountAndSymbol: true, symbolOnLeft: false, decimalSeparator: ',', thousandsSeparator: '.'  })"></Span>
                            <Span text=" x "></Span>
                            <Span :text="product.quantity"></Span>
                            <Span text=" = "></Span>
                            <Span :text="product.total"></Span>
                        </Label>

                        <label row="4" col="0" :text="total_bill | currency('€', 0, { spaceBetweenAmountAndSymbol: true, symbolOnLeft: false, decimalSeparator: ',', thousandsSeparator: '.'  })" class="body"></label>
                        <Button row="5" col="3" text="Supprimer" class="btn btn-primary btn-war" @tap="removeProduct(product)"></Button>
                    </GridLayout>
                </v-template>
            </ListView>



        <!--
        <scroll-view class="green" v-if="this.current_cart !== null && this.total_bill !== 0.00">
            <StackLayout>
                <ListView for="product in this.formatted">
                    <v-template>
                        <StackLayout>
                            <Label :text="product.name | capitalize"></Label>
                            <Label :text="product.store_access_name | capitalize"></Label>
                            <Button text="remove" @tap="removeProduct(product)"></Button>
                            <Label>
                                <FormattedString>
                                    <Span :text="product.price | currency('€')"></Span>
                                    <Span :text="product.price_promo | currency('€')"></Span>
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
        <-- -->


        <!-- empty cart -->
        <scroll-view class="green" v-else>
            <FlexboxLayout style="align-items:center; flex-direction:column;" justifyContent="space-around" class="m-5">
                <Label class="body" text="Votre panier est vide."></Label>
            </FlexboxLayout>
        </scroll-view>
        <!-- -->
    </Page>
</template>

<script>

    import Router from "./services/Router";
    import {LoadingIndicator} from "nativescript-loading-indicator";

    const _ = require('lodash');

    import {api_config} from '../api_config';
    import axios from 'axios';


    //feedback
    import {Feedback, FeedbackType} from "nativescript-feedback";
    import {Color} from "tns-core-modules/color";

    const loaderOptions = require('./services/LoaderConfig').getOptions();
    const loader = new LoadingIndicator();

    export default {
        props: {},
        data: function () {
            return {
                current_cart: null,
                formatted: null,
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

                    //TODO - WIP
                    //TODO le bug en fait 'est juste que current_cart on a genre 2 fois le mpême element mais avec la quantité duplicate putin
                    //console.log("current_cart", this.current_cart)
                    //console.log("current cart quantity ?", this.current_cart)
                    console.log("real quantity is count  item in curren t_cart", this.current_cart.length)

                    //TODO -> promotion !!!!

                    let product_names = [];

                    this.current_cart.forEach(function (element) {
                        product_names.push(element.name);
                        console.log(element.name + " : " + element.quantity + " qt" + element.price + " eur")
                    });


                    function compressObj(original) {

                        //var compressed = [];
                        var obj = {}
                        // make a copy of the input array
                        var copy = original.slice(0);

                        // first loop goes over every element
                        for (var i = 0; i < original.length; i++) {

                            var myCount = 0;
                            // loop over every element in the copy and see if it's the same
                            for (var w = 0; w < copy.length; w++) {
                                if (original[i] == copy[w]) {
                                    // increase amount of times dplicate is found
                                    myCount++;
                                    // sets item to undefined
                                    delete copy[w];
                                }
                            }

                            if (myCount > 0) {
                                //var a = new Object();
                                //obj.value = original[i];
                                obj[original[i]] = myCount;
                                console.log("OBJECT", obj)
                                //compressed.push(a);
                            }
                        }

                        return obj;
                    };

                    let quantities = compressObj(product_names);
                    console.log("compress quantities", quantities[0]);
                    //todo -> pour chaque name on doit creer un array du style
                    // name:{array_found.length}
                    //array found c'est le tableau do'ccurnce


                    for (let y in this.current_cart) {
                        for (let x in products) {
                            console.log("QUANTITY", quantities[products[x].name]);
                            console.log(parseFloat(this.current_cart[y].promotion))
                            console.log(typeof parseFloat(this.current_cart[y].promotion))

                            //TODO -> bug du NaN
                            if (this.current_cart[y].name == products[x].name) {
                                products[x].quantity = parseFloat(quantities[products[x].name]);
                                console.log("quantity loop", quantities[products[x].name], " :: ", products[x].name)
                                products[x].price_promo = parseFloat(this.current_cart[y].price) - parseFloat(this.current_cart[y].promotion)
                                products[x].price = parseFloat(this.current_cart[y].price)
                                products[x].total = (parseFloat(products[x].price_promo) * parseFloat(quantities[products[x].name]))
                                products[x].store_access_name = this.current_cart[y].store_access_name;
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
            removeProduct(product) {
                loader.show(loaderOptions);
                //array of removed products
                let removed = _.remove(this.current_cart, {
                    name: product.name
                });

                for (let x in this.current_cart) {
                    console.log(this.current_cart[x].name);
                }

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

                let product_names = [];

                this.current_cart.forEach(function (element) {
                    product_names.push(element.name);
                    console.log(element.name + " : " + element.quantity + " qt" + element.price + " eur")
                });


                function compressObj(original) {

                    //var compressed = [];
                    var obj = {}
                    // make a copy of the input array
                    var copy = original.slice(0);

                    // first loop goes over every element
                    for (var i = 0; i < original.length; i++) {

                        var myCount = 0;
                        // loop over every element in the copy and see if it's the same
                        for (var w = 0; w < copy.length; w++) {
                            if (original[i] == copy[w]) {
                                // increase amount of times dplicate is found
                                myCount++;
                                // sets item to undefined
                                delete copy[w];
                            }
                        }

                        if (myCount > 0) {
                            //var a = new Object();
                            //obj.value = original[i];
                            obj[original[i]] = myCount;
                            console.log("OBJECT", obj)
                            //compressed.push(a);
                        }
                    }

                    return obj;
                };

                let quantities = compressObj(product_names);
                console.log("compress quantities", quantities[0]);
                //todo -> pour chaque name on doit creer un array du style
                // name:{array_found.length}
                //array found c'est le tableau do'ccurnce


                for (let y in this.current_cart) {
                    for (let x in products) {
                        console.log("QUANTITY", quantities[products[x].name]);
                        console.log(parseFloat(this.current_cart[y].promotion))
                        console.log(typeof parseFloat(this.current_cart[y].promotion))

                        //TODO -> bug du NaN
                        if (this.current_cart[y].name == products[x].name) {
                            products[x].quantity = parseFloat(quantities[products[x].name]);
                            console.log("quantity loop", quantities[products[x].name], " :: ", products[x].name)
                            products[x].price_promo = parseFloat(this.current_cart[y].price) - parseFloat(this.current_cart[y].promotion)
                            products[x].price = parseFloat(this.current_cart[y].price)
                            products[x].total = (parseFloat(products[x].price_promo) * parseFloat(quantities[products[x].name]))
                            products[x].store_access_name = this.current_cart[y].store_access_name;
                        }
                    }
                }

                if (products.length > 0) {
                    this.total_bill = products.map((product) => product.total).reduce((prev, next) => {
                        return prev + next
                    });
                } else {
                    this.total_bill = 0.00;
                }

                console.log("FORMATTED", products);
                this.formatted = products;
                setTimeout(function () {
                    loader.hide();
                    let feedback = new Feedback();
                    feedback
                        .success({
                            title: "Produit supprimé",
                            titleColor: new Color("#222222"),
                            type: FeedbackType.Custom, // this is the default type, by the way
                            message: `${product.name} supprimé de votre panier`,
                            messageColor: new Color("#333333"),
                            duration: 2000,
                            backgroundColor: new Color("yellowgreen")
                        })
                }, 500);


            }
        }
    }
    ;
</script>

<style scoped>

    .btn-war {
        background-color: #eb4d4b;
    }
</style>

