<template>
    <Page>
        <ActionBar :title="this.product.name | capitalize " android:flat="true">
        </ActionBar>
        <Label :text="this.product.name">
        </Label>
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
            return {
            }
        },
        methods: {}
    }
</script>
