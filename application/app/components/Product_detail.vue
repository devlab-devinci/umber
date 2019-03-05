<template>
    <Page>
        <ActionBar :title="this.product.name | capitalize " android:flat="true">
        </ActionBar>
        <StackLayout>

            <StackLayout>
                <Image
                        @tap="showModal(product._id)"
                        src="https://static.cuisineaz.com/400x320/i108058-kebab-sans-gluten.jpg"></Image>
            </StackLayout>

            <StackLayout class="m-5">
                <StackLayout orientation="vertical">
                    <Label class="" :text="product.name | capitalize"></Label>
                    <Label class="body" :text="product.stock + '/'+ product.stock_total"></Label>
                    <Label class="body"
                           :text="displayTruePrice(product.price, product.promotion) | currency('€', 0, { spaceBetweenAmountAndSymbol: true, symbolOnLeft: false, decimalSeparator: ',', thousandsSeparator: '.'  }) + ' (' + product.promotion + ' de remise)'"></Label>
                    <Label class="body" :text="product.description"></Label>
                    <Label class="body" :text="'ajouté : ' + product.createdAt  | moment('dddd, MMMM Do YYYY, h:mm:ss a')"></Label>
                </StackLayout>
            </StackLayout>
        </StackLayout>
    </Page>
</template>

<script>
    import Router from "./services/Router"
    import axios from 'axios'
    import {api_config} from '../api_config';

    import ModalProductPicture from "./ModalProductPicture";


    export default {
        name: "ProductDetail",
        component: {
            //my component here
        },
        props: {
            product: ""
        },
        data() {
            return {}
        },
        methods: {
            displayTruePrice(product_price, product_promotion) {
                return (product_price - product_promotion);
            },
            showModal(product_id) {
                this.$showModal(ModalProductPicture, { props: { product_id: product_id }});
            }
        }
    }
</script>

<style scoped>
    ActionBar {
        background-color: #53ba82;
        color: #ffffff;
    }
</style>

