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
                console.log('he is', this.STATUS_VENDOR);
                this.$store.commit('setUserStatus', this.STATUS_VENDOR); //commit == mutation (update)
                console.log("CHOICE -> USER STATUS : ", this.$store.getters.getUserStatus)

                this.$navigateTo(Router.vendorHome);
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
