<template>
    <Page>
        <ActionBar class="action-bar" title="Votre panier">
        </ActionBar>

        <scroll-view class="green" v-if="this.current_cart !== null">
            <StackLayout>
                <ListView for="product in formatted">
                    <v-template>
                        <StackLayout>
                            <Label :text="product.name | capitalize"></Label>
                            <Label>
                                <FormattedString>
                                    <Span :text="product.price"></Span>
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
                    <Label :text="total_bill"></Label>
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

    const _ = require('lodash');

    export default {
        props: {},
        data: function () {
            return {
                current_cart: null,
                formated: null,
                total_bill: 0,
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
        }
    }
    ;
</script>
