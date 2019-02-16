<template>
    <Page>
        <ActionBar :title="this.product.name | capitalize " android:flat="true">
        </ActionBar>
        <StackLayout>
            <Label :text="this.product.name">
            </Label>
            <Label :text="this.product.price | currency('€') ">
            </Label>
            <Label textWrap="true">
                <FormattedString>
                    <Span text="Remise : "></Span>
                    <Span :text="this.product.promotion | currency('€') "/>
                </FormattedString>
            </Label>
            <Label :text="product.description">
            </Label>
            <Label textWrap="true">
                <FormattedString>
                    <Span text="Quantité : "></Span>
                    <Span :text="product.stock"/>
                </FormattedString>
            </Label>
            <Label textWrap="true">
                <FormattedString>
                    <Span text="Catégorie : "></Span>
                    <Span :text="product.categories[0].name"/>
                </FormattedString>
            </Label>
        </StackLayout>
    </Page>
</template>

<script>
    import Router from "./services/Router"
    import axios from 'axios'
    import {api_config} from '../api_config';

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
        methods: {}
    }
</script>

<style scoped>
    ActionBar {
        background-color: #53ba82;
        color: #ffffff;
    }
</style>

