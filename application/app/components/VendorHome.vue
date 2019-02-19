<template>
    <Page>

        <ActionBar>
            <ActionItem text="Mes Offres" :visibility="selectedItem === 0 ? 'visible' : 'collapsed'"></ActionItem>
            <ActionItem text="Ajouter un store" :visibility="selectedItem === 1 ? 'visible' : 'collapsed'"></ActionItem>
            <ActionItem text="Ajouter une offre"
                        :visibility="selectedItem === 2 ? 'visible' : 'collapsed'"></ActionItem>
        </ActionBar>
        <TabView selectedIndex="0" iosIconRenderingMode="alwaysOriginal">
            <TabViewItem title="Mes offres">
                <StackLayout style="margin:10px;">
                    <SegmentedBar @selectedIndexChange="onSelectedIndexChange" v-model="selectedItem">
                        <SegmentedBarItem title="Mes offres"/>
                        <SegmentedBarItem title="Ajouter un magasin"/>
                        <SegmentedBarItem title="Ajouter une offre"/>
                    </SegmentedBar>

                    <FlexboxLayout :visibility="selectedItem === 0 ? 'visible' : 'collapsed'" style="align-items:center; flex-direction:column;">
                        <Products v-if="selectedItem === 0" :seller="true"></Products>
                    </FlexboxLayout>


                    <FlexboxLayout :visibility="selectedItem === 1 ? 'visible' : 'collapsed'"
                                   style="align-items:center; flex-direction:column;">
                      <scroll-view>
                        <EditStore v-if="selectedItem === 1"></EditStore>
                      </scroll-view>
                    </FlexboxLayout>


                    <!-- OFFER FORM-->
                    <FlexboxLayout :visibility="selectedItem === 2 ? 'visible' : 'collapsed'"
                                   style="align-items:center; flex-direction:column;">
                      <scroll-view>
                        <EditProduct v-if="selectedItem === 2"></EditProduct>
                      </scroll-view>
                    </FlexboxLayout>


                </StackLayout>
            </TabViewItem>
            <TabViewItem title="Commandes">
                <Label text="commandes"></Label>
            </TabViewItem>
            <TabViewItem title="Statistiques">
                <Label text="statistiques"></Label>
            </TabViewItem>
            <TabViewItem title="Compte" iconSource="">
                <Profile :welcomMessage="welcomMessage"></Profile>
            </TabViewItem>
        </TabView>


        <!-- columns = " width col1, width col2, width col3 ...." -->
        <!-- row = "height row1, height row2 ..." -->

        <!--
        <GridLayout class="p-15" columns="auto, auto, auto, 10" rows="auto, auto, auto" width="auto" height="auto"
                    backgroundColor="#2ABB9B">
            <Button row="0" col="0" class="btn btn-md btn-primary btn-rounded-md" @tap="imVendor">Commercant
            </Button>
            <Button row="0" col="1" class="btn btn-md btn-primary btn-rounded-md" @tap="imCustomer">Consomateur
            </Button>

        </GridLayout>
        -->


    </Page>
</template>
<script>
    import {Feedback, FeedbackType, FeedbackPosition} from "nativescript-feedback";
    import {Color} from "tns-core-modules/color";
    import GeolocationService from "./services/Geolocation";

    import Router from "./services/Router";

    import Products from './Products';
    import EditProduct from "./EditProduct";
    import EditStore from "./EditStore";
    import Profile from "./Profile";


    export default {
        name: "CustomerHome",
//callback lifecyclme (vuejs)
        beforeCreate() {
            let self = this;
            let feedback = new Feedback();
            feedback
              .success({
                  title: "Connectez avec succès",
                  titleColor: new Color("#222222"),
                  type: FeedbackType.Custom, // this is the default type, by the way
                  message: `Vous êtes connecté`,
                  messageColor: new Color("#333333"),
                  duration: 2000,
                  backgroundColor: new Color("#000000")
              });

            //console.log("HOME - > USER STATUS : ", this.$store.getters.getUserStatus);


            //categories for store loading

        },
        mounted() {
            let self = this;
             console.log("MOUNTED")
            //display status (if user choose vendor OR customer)
            //console.log("PICTURE", this.$store.getters.getFbUser.picture.data.url);

            GeolocationService.enablePermission() //call to init permission
            //https://www.thepolyglotdeveloper.com/2017/03/device-geolocation-nativescript-angular-application/

            GeolocationService
              .getCurrentLocation(10000)
              .then(function (location) {
                  self
                    .$store
                    .commit('setCurrentLocation', location);

                  /**
                   * After get and set the current location of the device (lat / lg / timestamp), we get infos from this position
                   * this.$store.getters.getCurrentLocation.latitude
                   * this.$store.getters.getCurrentLocation.longitude
                   * this.$store.getters.getCurrentLocation.timestamp
                   */
                  if (location) {
                      GeolocationService
                        .getCurrentLocationInfos(self.$store.getters.getCurrentLocation.longitude, self.$store.getters.getCurrentLocation.latitude)
                        .then((currentLocationInfos) => {
                            self.$store.commit('setCurrentLocationInfos', currentLocationInfos);
                        })
                        .catch((err) => {
                            //TODO message d'erreur creer un service pour gerer les erreur avec des toasts etc
                            console.log("Error getCurrentLocationInfos", err)
                        })
                  }
              })
              .catch(err => console.log("getCurrentLocation ERROR -> ", err))

        },
        data() {
            return {
              welcomMessage: "Connecté : " + this.$store.getters.getFbUser.name + "",
              selectedItem: 0
            }
        },
        methods: {
            onTextChanged() {
                console.log("change texted")
            },
            onSelectedIndexChange() {
                console.log("ITEM SELECTED", this.selectedItem);
                console.log(typeof this.selectedItem);
                console.log(this.selectedItem === 0 ? 'visible' : 'collapsed')
            },
            onProductTap(product) {
                this.$navigateTo(Router.product, {
                    props: {
                        id: product._id
                    }
                });


            }

        },
        components: {
          EditProduct,
          EditStore,
          Products,
          Profile
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

