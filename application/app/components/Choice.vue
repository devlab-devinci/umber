<template>
    <Page>
        <GridLayout columns="auto" rows="auto, auto" width="auto" height="auto"
                    backgroundColor="#2ABB9B">
            <Button row="0" col="0" class="btn btn-md btn-primary btn-rounded-md" @tap="goToHomeVendor">Commercant
            </Button>
            <Button row="1" col="0" class="btn btn-md btn-primary btn-rounded-md" @tap="goToHomeCustomer">Consomateur
            </Button>
        </GridLayout>
    </Page>
</template>

<script>
    import Router from "./services/Router"
    import axios from 'axios'
    import {api_config} from '../api_config';

    export default {
        name: "Choice",

        component: {
            //my component here
        },
        data() {
            return {
                STATUS_VENDOR: "STATUS_VENDOR",
                STATUS_CUSTOMER: "STATUS_CUSTOMER",
            }
        },
        methods: {
            goToHomeVendor() {
               let self = this;
                axios
                    .post(`${api_config.api_url}/auth/current_user/role`, {role: self.STATUS_VENDOR}, {
                        headers: {
                            'fb-access-token': self.$store
                                .getters.getAccessToken,

                        }
                    })
                    .then(function (response) {
                        console.log(response)
                        if (response.error) {
                            console.log("you are not authenticated.....")
                        } else {
                            console.log('he is', self.STATUS_VENDOR);
                            self.$store.commit('setUserStatus', self.STATUS_VENDOR); //commit == mutation (update)
                            console.log("CHOICE -> USER STATUS : ", self.$store.getters.getUserStatus)
                            self.$navigateTo(Router.vendorHome);
                        }
                    })
                    .catch(err => console.log(err))


            },
            goToHomeCustomer() {
                console.log('he is', this.STATUS_CUSTOMER);
                this.$store.commit('setUserStatus', this.STATUS_CUSTOMER); //commit == mutation (update)
                console.log("CHOICE -> USER STATUS : ", this.$store.getters.user_status)

                this.$navigateTo(Router.customerHome);
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
