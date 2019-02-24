<template>
    <Page class="page">
        <ActionBar class="action-bar" title="Payment Stripe">
        </ActionBar>
        <WebView :src="this.payment_server_url"></WebView>
    </Page>
</template>

<script>
    import {api_config} from '../api_config';

    export default {

        data() {
            return {
                payment_server_url: `${api_config.payment_server_url}${this.$store.getters.getAccessToken}/${this.$store.getters.getCurrentUser._id}`
            }
        },
        methods: {}
    };
</script>