<template>
    <Page>
        <ActionBar title="Authentication" android:flat="true">
            <ActionItem @tap="$navigateTo($router.products)" ios.systemIcon="17" ios.position="right" text="Produits"
                        android.position="popup"/>
            <ActionItem @tap="$navigateTo($router.cart)" ios.systemIcon="16" ios.position="right" text="Panier"
                        android.position="popup"/>
            <ActionItem @tap="$navigateTo($router.editProduct)" ios.systemIcon="16" ios.position="right"
                        text="edit product" android.position="popup"/>
            <ActionItem @tap="$navigateTo($router.shops)" ios.systemIcon="16" ios.position="right" text="Shop"
                        android.position="popup"/>
        </ActionBar>

        <TabView android:tabBackgroundColor="#53ba82"
                 android:tabTextColor="#c4ffdf"
                 android:selectedTabTextColor="#ffffff"
                 androidSelectedTabHighlightColor="#ffffff">

            <TabViewItem title="S'inscrire">
                <StackLayout>
                    <StackLayout class="form">
                        <Image width="140" padding="5" class="m-t-4"
                               src="https://cdn.discordapp.com/attachments/502101586110185472/547162466631548960/unknown.png"/>
                        <StackLayout class="input-field">
                            <Label text="Firstname"></Label>
                            <TextField class="input" editable="true"></TextField>
                        </StackLayout>

                        <StackLayout class="input-field">
                            <TextField class="input"></TextField>
                        </StackLayout>
                        <Button text="Log In" class="btn btn-primary"></Button>
                    </StackLayout>
                    <Button text="Connectez-vous avec Facebook" class="btn btn-primary btn-rounded-lg" @tap="login"
                            textWrap="true"/>
                </StackLayout>
            </TabViewItem>

            <TabViewItem title="Se connecter">
                <StackLayout class="form">
                    <StackLayout class="input-field">
                        <TextField class="input"></TextField>
                    </StackLayout>

                    <StackLayout class="input-field">
                        <TextField class="input"></TextField>
                    </StackLayout>
                    <Button text="Log In" class="btn btn-primary"></Button>
                </StackLayout>
            </TabViewItem>

        </TabView>

    </Page>
</template>

<script>

    import Router from "./services/Router"

    import {tnsOauthLogin, tnsOauthLogout} from "./services/Auth";

    import axios from 'axios';


    export default {
        name: "Authentication",

        component: {
            //my component here
        },
        data() {
            return {}
        },
        methods: {
            login(event) {
                let self = this;
                tnsOauthLogin('facebook')
                    .then(function (response) {
                            self.$store.commit('setAccessToken', response.accessToken) //commit == mutation (update)

                            self.$store
                                .dispatch('findFbUser', response.accessToken) //dispatch == action  (return promise)
                                .then(function (userData) {

                                    self.$store
                                        .commit('setFbUser', userData); // update user we get

                                    console.log("LOGGED USER ->", self.$store.getters.getFbUser.email)
                                    console.log("lOGGGEEED", self.$store.getters.getFbUser.picture.data.url)
                                    console.log("lOGGGEEED", response.accessToken);
                                    //first_name  //field api fb graph
                                    //last_name

                                    //TODO create application side -> config file wiht localhost etc
                                    // TODO post on /auth/login/fb -> to create user
                                    console.log("FB USER saved, so lets set currentUser", self.$store.getters.getFbUser)
                                    axios
                                        .post(`${self.$config.apiConfig.api_url}/auth/login/fb`, {
                                            fullname: self.$store.getters.getFbUser.name,
                                            picture: self.$store.getters.getFbUser.picture.data.url,
                                            email: self.$store.getters.getFbUser.email
                                        })
                                        .then(response => {
                                            self.$store.commit('setCurrentUser', response.data.data); // set currentUser after login fb success
                                            //this variable is to get _id
                                            console.log(self.$store.getters.getFbUser);
                                            console.log("CURRENT_USER (made after fb login", self.$store.getters.getCurrentUser);
                                            console.log("AUTH ok.");
                                        })
                                        .catch(error => {
                                            console.log("ERRORRRRRRR API", error);
                                            console.log(error);
                                            console.log("ROOT", API_url)
                                        })

                                    self.$navigateTo(Router.choice);
                                })

                                //TODO -> return modal here
                                .catch(err => {
                                    console.log("LOGIN FAILED", err)
                                })

                        }
                    )
                    .catch(err => console.log(err))
                //TODO -> return error  with modal (voir tuto)
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
