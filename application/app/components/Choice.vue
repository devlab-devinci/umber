<template>
    <Page>
        <ActionBar title="Continuer en ..." android:flat="true">
            <!--
            <NavigationButton text="Back" visibility="hidden"/>
            -->
        </ActionBar>
        <FlexboxLayout style="align-items:center; flex-direction:column; margin-top:20%">
            <Label class="h2" text="Vous êtes ..."></Label>
            <Button text="Acheteur" width="70%" class="btn btn-primary btn-rounded-lg classic-btn" @tap="goToHomeCustomer"
                    textWrap="true"/>
            <StackLayout class="hr-light m-10" width="320"></StackLayout>
            <Button text="Vendeur" width="70%" class="btn btn-primary btn-rounded-lg classic-btn fb-btn" @tap="goToHomeVendor"
                    textWrap="true"/>
        </FlexboxLayout>
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
                let self = this;
                axios
                    .post(`${api_config.api_url}/auth/current_user/role`, {role: self.STATUS_CUSTOMER}, {
                        headers: {
                            'fb-access-token': self.$store
                                .getters.getAccessToken,

                        }
                    })
                    .then(function (response) {
                        if (response.error) {
                            console.log("you are not authenticated ...");
                        } else {
                            console.log('he is', self.STATUS_CUSTOMER);
                            self.$store.commit('setUserStatus', self.STATUS_CUSTOMER); //commit == mutation (update)
                            console.log("CHOICE -> USER STATUS : ", self.$store.getters.getUserStatus)

                            self.$navigateTo(Router.customerHome);
                        }
                    })
                    .catch(err => console.log(err))
            }

        }
    }
</script>

<style scoped>
    ActionBar {
        background-color: #53ba82;
        color: #ffffff;
    }


    .classic-btn {
        background-color: #22a6b3;
        color: white;
    }
    .btn-outline {
        color: #22a6b3;
    }
</style>
